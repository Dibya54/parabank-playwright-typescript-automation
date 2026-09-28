# Implementation Plan: Automation Security and Safety

## Scope

This plan translates [security-audit.md](security-audit.md) into ordered automation-framework work. It does not remediate ParaBank server-side authorization, alter the login flow, or authorize tests against the shared public demo. Preserve the existing 26 API cases and all UI/E2E coverage; extend or gate execution rather than removing scenarios.

## Recommended Order

### 1. Protect test data and output

- Replace checked-in or shared plaintext login values with injected environment/CI secrets for stable test accounts. Keep the existing `LoginPage` interactions and login behavior unchanged.
- Stop writing generated credentials to the shared `test-data/json/LoginCredentials.json`. Keep generated account state isolated per run/worker, and do not make unrelated specs depend on execution order.
- Remove passwords from the registration workbook. Keep only synthetic registration data required by the current flow; avoid real personal information and retain an SSN field only if the application requires it.
- Remove raw response-body and personal/financial-value `console.log` calls. Log status, assertion-safe summaries, and redacted identifiers only. Review failure traces, screenshots, videos, and HTML reports for entered credentials or personal data before publishing.
- Add a no-new-dependency secret/data scan to CI using available tooling or a small repository check; fail if credentials or unmasked SSNs appear in fixtures or report artifacts.

**Done when:** no reusable password is stored in repository test data or emitted to stdout/reports; generated state is per-run, ignored, and excluded from uploaded artifacts; current assertions and business-flow tests remain present.

### 2. Make target selection fail closed

- Replace UI/E2E absolute ParaBank URLs with relative paths so Playwright's configured `baseURL` controls navigation.
- Require a non-empty `BASE_URL` for application tests and validate the origin against an explicit allowed target before any test can mutate data. Do not silently default to the public demo.
- Keep the ParaBank login page object and current login sequence unchanged. Treat the observed login/server instability as a target readiness issue, not something to compensate for in automation.

**Done when:** a local sentinel `BASE_URL` receives all UI/E2E navigation; a missing or disallowed target stops execution before any mutation; no test silently reaches the public host.

### 3. Isolate state-changing coverage

- Inventory existing writers: account creation, transfer, deposit, withdrawal, bill payment, profile update, registration, and loan requests. Preserve each test but mark its execution boundary clearly in test selection/docs.
- Run write scenarios only against a dedicated resettable local/staging environment with disposable identities/accounts. Do not run them against the shared demo or as part of an untrusted pull-request job.
- Remove fixed shared account/customer assumptions from write scenarios as isolated data becomes available. Use per-run identities and known ownership relationships; avoid relying on `fullyParallel` for shared mutable state. Serialize only tests that cannot yet be isolated.
- Do not add cleanup operations that delete or reverse transactions unless the application provides an authorized, safe reset mechanism.

**Done when:** parallel runs cannot share mutable accounts or credentials; write tests are disabled unless an isolated target is explicitly configured; existing scenarios remain discoverable and runnable in that environment.

### 4. Correct test selection commands

- Correct `test:ui` to target the actual `src/test/ui` tree.
- Add focused read-only API and UI selection commands only if needed by CI; do not redefine the existing full `test` command to silently skip coverage.
- Validate every command with Playwright `--list` and confirm API/UI/E2E discovery counts before execution.

**Done when:** `test:ui` lists the UI specs under the actual project structure, and focused/full commands retain the current coverage.

### 5. Establish CI safety gates

- Add a GitHub Actions workflow only after the target and test-data safeguards above are implemented. Use Node.js 20+, `npm ci`, and the Playwright browser installation required by selected projects.
- Set `CI=true`; inject credentials and `BASE_URL` through protected secrets/variables. Never expose secrets to untrusted fork jobs.
- On ordinary pull requests, run non-mutating checks and read-only tests against an isolated target. Run mutating UI/E2E flows only in a protected job against resettable staging, with explicit concurrency control.
- Restrict report/trace artifact access and retention. Upload artifacts only after secret redaction checks pass.

**Done when:** CI has a verified target allowlist, no default public-demo mutation path, protected secrets, controlled write-job concurrency, and bounded artifact access.

### 6. Add security coverage incrementally

Preserve existing functional/API assertions and add a small number of focused security cases. All object IDs must come from known disposable records; never enumerate or guess IDs.

1. **Anonymous object reads:** Exercise the existing customer, customer-accounts, account, account-transactions, and transaction GET routes without authentication. Assert the agreed unauthenticated response and that no customer, SSN, balance, or transaction fields are returned. The audit observed data disclosure, so this case is expected to fail against the current target until its service owner fixes authorization; keep it out of a passing gate until the target is remediated or explicitly run it as a documented security regression.
2. **Cross-customer ownership:** With two known isolated users, authenticate as A and request B's customer/account/transaction IDs. Assert denial and no object fields; assert A's own objects remain accessible. This depends on a stable target and working valid-login flow; do not rewrite login to enable the test.
3. **Safe malformed read inputs:** Extend existing negative GET coverage with malformed/oversized known inputs and bounded error-body checks. Assert no stack traces, internal paths, or unrelated object data. Do not duplicate current missing-ID happy/negative cases.
4. **Logout/session invalidation:** After the target has a stable supported login flow, test logout followed by protected-page/API access and browser back/refresh. Assert the old session cannot return protected data.
5. **Write validation boundaries:** Only on isolated resettable data, cover zero, negative, malformed, over-precision, and bounded-large transfer/deposit/withdraw inputs plus invalid account combinations. Assert rejection, unchanged before/after balances, and no new transaction. Never run these probes on the shared demo.
6. **Secret-safe diagnostics:** Capture test output and generated reports for a disposable test run; assert credentials and unmasked personal data are absent. Verify the API login request does not newly expose secrets in test output. Do not change the login endpoint contract without confirming ParaBank's supported API behavior.

**Done when:** each case has deterministic test data, a precise status/body/ownership assertion, and an explicit safe target; expected failures against the currently observed exposed target are tracked separately from ordinary passing CI.

## Explicitly Deferred

- Fixing customer/account/transaction authorization or response minimization in the ParaBank application. These are confirmed server-side findings and require the application owner; this automation repository cannot remediate them.
- Cross-customer BOLA claims or tests until two valid disposable identities and object IDs are available.
- Valid-login, logout, session-cookie, and session-rotation automation until the target's login/server behavior is stable. Do not rewrite the login framework to work around the observed environment issue.
- Monetary mutation probes on the public/shared demo.
- New dependencies, broad page-object/API refactors, test-count expansion, and changes to existing functional assertions without a concrete need.

## Implementation Sequence Summary

1. Secrets, fixture minimization, logging/report redaction.
2. Enforced `BASE_URL` and origin guard.
3. Isolation and controlled execution for state-changing tests.
4. Correct `test:ui` path and verify discovery.
5. CI workflow and artifact controls.
6. Add anonymous/malformed read checks, then ownership/session tests when prerequisites are stable; write-boundary tests last on resettable data.