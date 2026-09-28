# Security Audit Report

## Executive Summary

Scope was the current ParaBank Playwright TypeScript workspace and its configured target, `parabank.parasoft.com`. No project code, tests, configuration, or test data were changed. The existing suite was inventoried with Playwright test discovery only; the tests themselves were not run because multiple existing cases create accounts, update profiles, request loans, pay bills, or mutate balances in a shared demo environment.

The strongest confirmed application finding is that unauthenticated GET requests returned customer records containing SSN and contact fields, account records containing balances, and transaction records. The data was read-only and identifiers came from the existing test fixtures. Cross-customer access was not confirmed: the known account identifiers in this repository all mapped to one seeded customer, and no second known customer object was available without guessing identifiers.

The framework also stores a test username/password in a JSON file, reads registration passwords from an Excel workbook, and logs usernames, account identifiers, balances, raw API responses, and transaction details. The existing generated HTML report did not contain the sensitive markers checked, and Git metadata is absent from this workspace, so whether the credential files are committed cannot be verified.

Observed invalid-login behavior returned the expected generic credential error, but the page title was an error page; unauthenticated protected-page paths returned generic HTTP 500 pages. This is an environment/application behavior requiring retest, not evidence of an authentication bypass. Valid login, logout invalidation, and authenticated cross-customer behavior remain unverified.

## Confirmed Findings

### SEC-001 - Customer API discloses personal data without authentication

- **Severity:** Medium for this demo target; production impact is not inferred.
- **Component:** API.
- **Endpoint/Page:** `GET /parabank/services/bank/customers/{customerId}`.
- **Evidence:** In a browser context that had not authenticated, a GET using an existing fixture ID returned HTTP 200 and a `<customer>` record. The returned schema included `ssn`, first and last name, street, city, state, ZIP code, and phone number. A nearby unassigned customer ID returned HTTP 400. No credential or session login was performed.
- **Impact:** Anyone able to obtain or guess a customer ID can retrieve sensitive customer attributes. The response also reveals whether an identifier exists. The live demo data may be synthetic; no claim is made about production data.
- **Recommendation:** Require authentication and enforce customer ownership/role authorization on every customer-object read. Do not return SSN unless strictly needed; mask or omit it by default. Avoid distinguishable existence responses where disclosure is unnecessary.
- **Recommended automation coverage:** Anonymous request must receive 401/403 (or the documented unauthenticated response) and must not return customer fields. An authenticated user must receive only their own profile; another user's profile must receive 403/404 with no personal data.

### SEC-002 - Account and transaction APIs disclose financial records without authentication

- **Severity:** Medium for this demo target; production impact is not inferred.
- **Component:** API.
- **Endpoint/Page:** `GET /parabank/services/bank/customers/{customerId}/accounts`, `/accounts/{accountId}`, `/accounts/{accountId}/transactions`, and `/transactions/{transactionId}`.
- **Evidence:** Anonymous GETs to fixture-backed account-list, account-detail, and transaction-detail routes returned HTTP 200. Responses exposed account/customer identifiers and balances, and transaction identifiers, account identifiers, type, date, amount, and description. The same requests were made without signing in.
- **Impact:** Unauthenticated callers can enumerate known object identifiers and read financial data. This is a confirmed missing access boundary on the observed routes; access to a different customer's object was not independently demonstrated.
- **Recommendation:** Authenticate these routes and enforce owner authorization at the object level, including transaction-to-account ownership. Return only fields required by the caller and avoid making IDs alone sufficient for access.
- **Recommended automation coverage:** Add anonymous-access checks for each route family and paired-owner tests proving user A cannot read user B's accounts or transactions. Assert both status and absence of object fields in the response body.

### SEC-003 - Test credentials are persisted in plaintext workspace files

- **Severity:** Low for the current demo account; elevate if these credentials are reused outside the demo.
- **Component:** Automation framework / test data.
- **Endpoint/Page:** `test-data/json/LoginCredentials.json`; `test-data/excel/RegistrationData.xlsx`.
- **Evidence:** The JSON contains a username/password pair in plaintext. Registration reads a password from the workbook and writes generated credentials back to the JSON file. The workbook schema includes identity, contact, SSN, and password columns. Several UI specs read the JSON at module load. Credential validity was not tested during this audit.
- **Impact:** Anyone who can read or receive the workspace, a copied test-data file, or an artifact can obtain the test account password and reuse it against the demo account. Git tracking could not be checked because this workspace has no `.git` metadata.
- **Recommendation:** Source credentials from environment/secret storage; keep generated authentication data in an ignored, per-run location; remove passwords and unnecessary SSNs from committed fixtures; ensure generated state is not published as an artifact.
- **Recommended automation coverage:** Add a repository/CI secret scan and a test-data policy check that rejects password/SSN columns or values in committed fixtures. Assert generated auth-state files are ignored and excluded from published artifacts.

## Potential Findings

### POT-001 - Cross-customer BOLA/IDOR remains unverified

- **Component:** API authorization.
- **Endpoint/Page:** Customer, account, and transaction object routes listed under SEC-001 and SEC-002.
- **Evidence:** The routes returned records anonymously, but the known account IDs in the existing suite resolved to the same seeded customer. The only alternate customer ID tried was not a valid seeded customer and returned an error. No identifier guessing or brute force was performed.
- **Potential impact:** If another customer's valid object identifier is accepted in the same way, cross-customer customer/account/transaction data may be exposed.
- **Additional verification required:** Use two disposable, isolated test customers and their known object IDs; authenticate as one, request the other's customer/account/transaction resources, and record status plus field presence. Do not probe guessed IDs on the shared demo.

### POT-002 - Authentication/session behavior is unstable on the live demo

- **Component:** UI / application environment.
- **Endpoint/Page:** Login flow and direct unauthenticated account-page paths.
- **Evidence:** One invalid UI login displayed the standard generic credential error but navigated to a page titled as an error. Several direct account-page requests without a session returned HTTP 500 with a generic internal-error page rather than a clear redirect/401. No successful login or logout cycle was performed.
- **Potential impact:** Session establishment, access control redirects, and post-logout invalidation cannot be reliably assessed while the target behaves this way.
- **Additional verification required:** Retest on a stable local/staging instance with a known disposable account; verify valid login, cookie/session properties, logout, browser back, and protected API/page access after logout. Treat the current behavior as an environment/application blocker; do not rewrite the login framework to mask it.

## Informational Findings

### INF-001 - Read-only malformed-input probes did not demonstrate unsafe processing

- **Severity:** Informational.
- **Component:** API.
- **Endpoint/Page:** Account lookup and transaction amount-search routes.
- **Evidence:** Non-numeric and oversized account IDs returned generic HTTP 404 responses. Transaction amount-search reads using negative, zero, and very large values returned HTTP 200 and empty/no-match results in the observed cases. These were query-only GETs; no money-changing request was sent.
- **Impact:** No injection, crash, or unintended write was demonstrated. Write-operation validation for zero, negative, or very large monetary values remains unknown.
- **Recommendation:** Add write validation only against isolated, resettable data and verify the account balance is unchanged after each rejected input.
- **Recommended automation coverage:** See SEC-TEST-005 and SEC-TEST-006.

### INF-002 - Identifier-specific error text permits existence distinction

- **Severity:** Informational in isolation; the exposed object data is addressed by SEC-001/SEC-002.
- **Component:** API.
- **Endpoint/Page:** Invalid customer/account/transaction lookups.
- **Evidence:** Existing tests assert status 400 and response text that names the supplied customer/account/transaction identifier. Valid seeded identifiers returned 200 in read-only probes.
- **Impact:** Responses can distinguish known objects from missing objects, assisting enumeration if identifiers are guessable.
- **Recommendation:** Prefer consistent non-disclosing not-found/forbidden behavior where compatible with the API contract; rate-limit enumeration on a production system.
- **Recommended automation coverage:** Assert response bodies do not include stack traces, internal paths, or unnecessary customer data; separately verify access control rather than relying on opaque errors.

## Existing Security Coverage

Playwright discovery reports 48 test cases per browser project (26 API, 18 non-empty UI, and 4 E2E; one UI spec file is empty). The configured projects are Chromium, Firefox, and WebKit. The API count matches the approximately 26 cases already present; preserve those assertions and extend only where the gaps below justify it.

- **Authentication:** API login has one valid-credential test that logs status/body but asserts neither status nor authenticated identity. UI login covers valid and invalid-password outcomes, but the valid path depends on the shared credentials JSON. No logout/session invalidation coverage was found.
- **Customer/account reads:** Existing API tests validate account list/detail and customer detail, including invalid IDs. Assertions validate shape/values, not authorization.
- **Transactions:** Existing API tests cover account transactions, transaction by ID, amount, month/type, date range/date, and invalid IDs. Assertions validate returned values and empty results, not ownership authorization.
- **Transfers/deposits/withdrawals:** Existing tests cover successful and nonexistent-account paths. Success cases mutate shared seeded accounts and do not cover numeric boundary values or cross-owner checks.
- **Loans:** One insufficient-down-payment response is asserted. A successful loan-request case logs the body but has no assertions. UI/E2E include successful loan submissions that can create loan accounts.
- **Registration and UI:** Required-field errors are tested. No security-focused registration limits, session fixation, logout, direct-route authorization, or sensitive-field masking assertions were found.
- **Negative identifiers:** Several API suites cover a nonexistent numeric ID. Malformed identifiers, authorization failures, and invalid object combinations are not broadly covered.

## Missing Security Coverage

- Anonymous access to customer, account, transaction, and loan-related data/API operations.
- Cross-customer customer/account/transaction access with two known, isolated identities.
- Transaction ownership checks independent of the account ID supplied by the client.
- Direct-navigation authorization and access-after-logout checks for protected UI pages and APIs.
- Login session lifecycle: cookie attributes, session rotation on authentication, invalidation after logout, and back/refresh behavior.
- Authentication API assertions for valid and invalid credentials without placing passwords in URLs or logs.
- Negative values, zero, excessive amounts, malformed numbers, precision boundaries, and invalid source/destination combinations on write operations, with before/after balance assertions.
- Loan ownership and request validation on a safe isolated account; there is no loan-read method in the current API client.
- Response minimization and checks that SSN/password/token-like fields are absent or masked.
- Assertions that error responses do not expose internals and that logs/reports redact credentials, SSNs, and account/customer identifiers.
- Test-data isolation, cleanup/expiry, and CI-safe handling of generated accounts and credentials.

## API Security Findings

- The current API client classes use the common `BaseApi` GET/POST wrappers, but `TransferApi.ts` is empty and transfer/deposit/withdraw tests call `request.post` directly. This is a consistency/coverage issue, not by itself a vulnerability.
- `AuthApi.login` places username and password in URL path segments. URL paths can be retained by browser history, server/proxy access logs, and request diagnostics. The API login test also prints the full response and has no assertions.
- Customer, account, admin-named customer lookup, and transaction wrappers interpolate caller-controlled identifiers directly into paths. Observed malformed IDs returned 404; this audit did not find evidence of injection.
- Loan and account creation use POST with query parameters. No write probes were sent during this audit.
- API test logs include raw customer/account/transaction/loan response bodies and financial identifiers. The admin customer response schema includes SSN, so running the current test can emit sensitive data into console/list/HTML report output. The existing report artifact checked during this audit did not contain the tested sensitive markers.

## UI Security Findings

- Anonymous direct navigation to several protected account-page paths returned generic HTTP 500 pages, not a demonstrated data bypass. This is a live-target reliability/authorization-response concern and should be retested on a stable local/staging instance.
- The invalid UI login check displayed a generic credential message and did not echo the submitted audit inputs. No brute force or valid credential attempt was made.
- UI and E2E specs hard-code the public ParaBank URL rather than using `baseURL`. Consequently, pointing `BASE_URL` at an isolated environment does not redirect those specs; their account-creating and payment flows continue targeting the hard-coded host.
- Password, username, account identifiers, loan details, transaction information, and confirmation strings are printed by several specs/page objects. Failure traces, screenshots, and video are configured to be retained on failures and may also contain entered values.
- Selectors include positional/table-cell selectors and generic `input.button`/`getByRole('button')` locators. These can target the wrong field when markup changes; no security bypass was demonstrated.

## Framework Security Findings

### FW-001 - Sensitive test data and output are not consistently protected

- **Severity:** Medium.
- **Component:** Test data, logs, and reports.
- **Endpoint/Page:** `LoginCredentials.json`, `RegistrationData.xlsx`, API/UI test output, Playwright traces.
- **Evidence:** Plaintext credentials are persisted; workbook columns include SSN and password; API specs print raw XML bodies; UI specs print usernames, account numbers, balances, and confirmations. `.gitignore` excludes generated reports/results and Playwright auth state but does not exclude `.env` or the credentials JSON. Git tracking cannot be determined in this workspace.
- **Impact:** Test output or copied fixtures can disclose credentials and financial/personal test data.
- **Recommendation:** Use secret injection, minimize fixture fields, redact logs, ignore generated credentials and `.env`, and review artifact retention/access controls.
- **Recommended automation coverage:** Secret scanning and a post-run artifact scan for credential/SSN patterns; verify expected masking before publishing reports.

### FW-002 - UI specs bypass configured target selection

- **Severity:** Medium.
- **Component:** UI/E2E configuration.
- **Endpoint/Page:** `playwright.config.ts` and multiple UI/E2E `page.goto` calls.
- **Evidence:** `baseURL` is configured from `BASE_URL`, but specs use literal `https://parabank.parasoft.com/...` URLs. A local/staging `BASE_URL` therefore does not contain UI/E2E mutations.
- **Impact:** Tests may mutate the public shared demo or a target different from the operator's intended environment; this weakens isolation and safe test execution.
- **Recommendation:** Route all application navigation through configured `baseURL`; add an explicit allowed-host guard before tests that mutate data.
- **Recommended automation coverage:** Run discovery/config tests with a local sentinel host and assert every UI/E2E request stays on that host; fail closed on unexpected origin.

### FW-003 - Shared fixed test data is unsafe under parallel execution

- **Severity:** Medium.
- **Component:** API/UI/E2E test isolation.
- **Endpoint/Page:** Account, transfer, deposit/withdraw, loan, and UI/E2E specs.
- **Evidence:** Global `fullyParallel: true` is enabled; API write tests use fixed customer/account IDs; UI tests reuse a shared credentials file; registration writes that shared file; multiple E2E paths create accounts, loans, payments, or transfers without cleanup. The registration UI test only runs in Chromium, but other mutating suites are configured for all three browser projects.
- **Impact:** Concurrent tests can race on shared balances/accounts, contaminate later runs, or make security assertions unreliable.
- **Recommendation:** Use per-test disposable identities/accounts on an isolated environment, explicit setup/cleanup, and serialization only for truly shared state. Do not run destructive business-flow specs against the shared demo as an audit prerequisite.
- **Recommended automation coverage:** Add a parallel repeatability test on disposable data and assert each test's created objects are uniquely scoped and cleaned up.

### FW-004 - Test commands and CI safeguards are incomplete

- **Severity:** Low.
- **Component:** Package scripts / CI.
- **Endpoint/Page:** `package.json`, `.github/`.
- **Evidence:** `test:ui` targets `src/ui`, while the actual specs are under `src/test/ui`. `.github/` contains agent markdown files but no workflow files. `test` runs the full cross-browser suite, including state-changing specs. `forbidOnly` is enabled only when `CI` is truthy; no CI workflow was available to verify that it is set.
- **Impact:** The UI shortcut does not target the current architecture, and automated CI safety/secret handling cannot be confirmed.
- **Recommendation:** Correct the test path and add a CI workflow that sets `CI=true`, uses an isolated target and secrets, separates read-only checks from mutating flows, and controls report artifact access/retention.
- **Recommended automation coverage:** Validate script target paths with `--list`; add CI checks for the configured origin and artifact redaction.

### FW-005 - Empty or misleading API abstraction surface

- **Severity:** Informational.
- **Component:** API framework.
- **Endpoint/Page:** `src/main/api/TransferApi.ts`, transfer/deposit/withdraw specs, `AdminApi.ts`.
- **Evidence:** `TransferApi.ts` is empty while related endpoints are called directly in test specs; `AdminApi.getCustomerById` calls the ordinary `/customers/{id}` endpoint and does not demonstrate an administrative authorization boundary.
- **Impact:** Repeated direct request construction makes common headers, safe logging, and authorization assertions harder to apply consistently; the `AdminApi` name can imply stronger privilege semantics than its implementation provides.
- **Recommendation:** Keep existing tests and assertions; only add shared methods where repeated request behavior benefits from common safe defaults. Rename/document the customer lookup abstraction if it is not an admin-only API.
- **Recommended automation coverage:** Add a small contract test verifying each wrapper's HTTP method/path and that secret values are not added to URLs or logs.

## Recommended Security Test Scenarios

### SEC-TEST-001 - Anonymous customer data access

- **Objective:** Prevent unauthenticated customer profile disclosure.
- **Preconditions:** A known disposable customer ID in an isolated environment; no authenticated cookie/token.
- **Action:** GET `/customers/{customerId}` and `/customers/{customerId}/accounts`.
- **Expected security behavior:** Both requests are rejected with the documented unauthenticated status; no customer/account object is returned.
- **Assertion intent:** Assert 401/403 (or the documented login redirect for UI), and assert the parsed response has no `ssn`, address, account IDs, or customer object. Run against this demo as a regression to capture the currently observed failure, not as a passing expectation.

### SEC-TEST-002 - Anonymous account and transaction access

- **Objective:** Prevent access to financial records without authentication.
- **Preconditions:** Known disposable account and transaction IDs; clean unauthenticated context.
- **Action:** GET `/accounts/{accountId}`, `/accounts/{accountId}/transactions`, and `/transactions/{transactionId}`.
- **Expected security behavior:** Requests are denied without returning balances, transaction values, or descriptions.
- **Assertion intent:** Assert unauthorized status and absence of XML account/transaction roots and sensitive fields.

### SEC-TEST-003 - Cross-customer BOLA checks

- **Objective:** Prove customer/account/transaction ownership is enforced.
- **Preconditions:** Two isolated disposable users A and B; known customer/account/transaction IDs for each; authenticated session for A.
- **Action:** Request B's customer, account, and transaction objects while authenticated as A.
- **Expected security behavior:** Each foreign object request is denied without object fields; A's own objects remain accessible.
- **Assertion intent:** Assert 403/404 for B IDs, no sensitive response fields, and 200 plus matching owner IDs for A IDs. Never obtain IDs by brute force.

### SEC-TEST-004 - Logout invalidates UI and API access

- **Objective:** Ensure logout ends the authenticated session.
- **Preconditions:** Stable local/staging target and known disposable user; successful login.
- **Action:** Capture an authorized account URL and API request, log out, then revisit both and use browser back/refresh.
- **Expected security behavior:** Protected UI redirects to login and protected API is denied; no cached page exposes new data after logout.
- **Assertion intent:** Assert login form or 401/403, absence of account details, and that the pre-logout session identifier cannot access protected endpoints.

### SEC-TEST-005 - Monetary input boundaries on isolated data

- **Objective:** Reject unsafe monetary values and invalid account combinations without changing balances.
- **Preconditions:** Private resettable environment; disposable owned source/destination accounts; record both balances before each case.
- **Action:** Submit zero, negative, excessive-but-bounded, malformed, and over-precision amounts to transfer/deposit/withdraw; include same-account, foreign-account, and nonexistent-account combinations.
- **Expected security behavior:** Invalid requests fail validation and produce no ledger entry or balance change.
- **Assertion intent:** Assert a documented 4xx or explicit validation result, no success response, unchanged source/destination balances, and no new transaction. Do not run this on the shared public demo.

### SEC-TEST-006 - Identifier and error-response handling

- **Objective:** Ensure malformed IDs and errors do not reveal internals or bypass validation.
- **Preconditions:** Read-only test identity and known valid/missing IDs.
- **Action:** Query empty, non-numeric, oversized, and missing customer/account/transaction IDs plus invalid date/month/type parameters.
- **Expected security behavior:** Stable documented 4xx responses with no stack trace, SQL details, filesystem paths, or unrelated object data.
- **Assertion intent:** Assert status class and a bounded generic error schema; assert response contains none of `stack`, internal package/path names, or other customers' fields.

### SEC-TEST-007 - Secret-safe authentication and report output

- **Objective:** Keep credentials and sensitive fields out of URLs, logs, traces, and reports.
- **Preconditions:** Disposable account credentials injected through CI secrets; report generation enabled.
- **Action:** Perform one successful and one failed login, then generate the normal test report.
- **Expected security behavior:** Password is not in URL, console output, request diagnostics, trace text, or report artifacts; SSN is omitted/masked.
- **Assertion intent:** Assert request URL excludes the password, captured console/report text excludes credential values and SSN patterns, and any persisted auth state is ignored and access-controlled.

## Framework Improvements

1. **Protect credentials and sensitive fixture fields.** Move passwords out of JSON/XLSX, remove SSN where not needed, ignore local generated credentials, and redact console output. Evidence: `LoginCredentials.json`, the workbook schema, and current `console.log` calls.
2. **Honor one configured target.** Replace hard-coded public URLs with the configured `baseURL` and add an allowed-origin check before mutation. Evidence: config reads `BASE_URL` but UI/E2E specs use literals.
3. **Isolate stateful tests.** Give each worker/test its own disposable identity and accounts, add cleanup/expiry, and keep write tests out of shared demo runs. Evidence: fixed fixture IDs, shared credentials JSON, `fullyParallel: true`, and account/loan/payment/transfer mutations.
4. **Add narrowly targeted security coverage.** Prioritize anonymous object access and cross-customer ownership before adding more happy paths; preserve the existing 26 API cases. Evidence: live anonymous GET results and the absence of ownership/session assertions.
5. **Fix the UI script and introduce verifiable CI controls.** Point `test:ui` at `src/test/ui`; add a workflow that sets `CI`, uses an isolated environment, runs read-only suites separately, and limits report artifact access. Evidence: current script path and absence of workflow files.
6. **Make auth and API logging safer.** Avoid credentials in URL paths, assert login responses, redact response bodies, and centralize repeated request construction only where it enables safe defaults. Evidence: `AuthApi.login`, its no-assertion test, raw-body logging, direct POST calls, and empty `TransferApi`.
7. **Keep UI diagnostics stable.** Prefer labels/roles/IDs over positional table cells and generic buttons, and replace fixed polling loops with condition-based waits where applicable. Evidence: positional zip-code selectors, generic submit/button selectors, and one-second polling loops in `AccountActivityPage`.

## Audit Limitations and Exact Inspection

- Read `AGENTS.md`, `playwright.config.ts`, `package.json`, `tsconfig.json`, `.gitignore`, and the `.env` key structure. Only the `BASE_URL` key name and configured origin were reported; no `.env` value was placed in this report.
- Inspected every file under `src/main/api/`, `src/main/pages/`, `src/main/utils/`, and `src/main/constants/`; every API/UI/E2E spec under `src/test/`; both test-data locations; and the contents of `specs/` before creating this report. `src/test/fixtures/` is absent, and `TransferFunds.spec.ts` is empty. The declared `src/main/config/`, `data/`, and `models/` folders are also absent in this checkout.
- Inspected the existing generated `playwright-report/index.html` for sensitive markers; the checked markers were absent. The report directory and `test-results/` are ignored by the supplied `.gitignore`.
- Playwright `--list` discovered 48 cases for one browser project, including 26 API cases. No test cases were executed.
- Live validation used only a few sequential GET requests to fixture-backed customer/account/transaction read routes, a single invalid-credential UI submission, and unauthenticated page navigation. No successful login was attempted; no POST/PUT/DELETE, account creation, balance mutation, profile update, bill payment, or loan request was sent.
- Cross-customer authorization, authenticated ownership checks, logout invalidation, loan object reads, write-input rejection, response headers/cookie flags, and the validity of stored credentials were not verified.
- The workspace has no `.git` metadata, so tracked-file status and commit history could not be checked. No security conclusion about whether any test credential is committed is made.