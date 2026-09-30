# ParaBank Playwright TypeScript Automation Framework

> A banking-domain test automation framework built with **Playwright + TypeScript**, covering **UI automation, REST API testing, end-to-end workflows, negative testing, cross-browser execution, data-driven testing, and security-focused validation**.

![Playwright](https://img.shields.io/badge/Playwright-1.62.1-45ba4b?logo=playwright&logoColor=white)

![TypeScript](https://img.shields.io/badge/TypeScript-Playwright-blue?logo=typescript&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)

![Browsers](https://img.shields.io/badge/Browsers-Chromium%20%7C%20Firefox%20%7C%20WebKit-555)

![API Testing](https://img.shields.io/badge/API-Testing-orange)

![UI Testing](https://img.shields.io/badge/UI-Automation-blue)

![E2E Testing](https://img.shields.io/badge/E2E-Testing-purple)

---

## 📌 Overview

This repository contains a structured **QA/SDET automation framework** for the ParaBank online banking application.

The framework is designed to demonstrate how a maintainable automation solution can combine:

- UI automation

- REST API automation

- End-to-end business workflows

- Page Object Model

- Reusable API abstractions

- Data-driven testing

- Positive and negative testing

- Cross-browser execution

- XML response validation

- Security-focused testing

- Playwright reporting

- Environment-based configuration

Rather than treating UI, API, and E2E automation as isolated scripts, the project organizes them into separate test layers with reusable framework components.

---

## 🎯 Key Capabilities

| Capability | Implementation |

|---|---|

| **UI Automation** | Playwright-based UI tests organized around reusable Page Objects |

| **REST API Automation** | Playwright `APIRequestContext`, reusable API clients, and request-fixture based testing |

| **End-to-End Testing** | Multi-step banking workflows across account, transfer, payment, and loan scenarios |

| **Page Object Model** | Page classes encapsulate locators and user interactions |

| **API Abstraction** | Shared `BaseApi` with reusable API clients |

| **Data-Driven Testing** | Registration data maintained in Excel and consumed through `ExcelReader` |

| **Positive & Negative Testing** | Valid, invalid, boundary, and error scenarios across UI/API layers |

| **XML Response Validation** | `xml2js` used to parse and validate ParaBank XML responses |

| **Cross-Browser Testing** | Chromium, Firefox, and WebKit projects configured in Playwright |

| **Reporting & Diagnostics** | HTML/list reporting with failure screenshots, video, and traces |

| **Security Validation** | Security audit and planned security regression coverage |

| **Environment Configuration** | `dotenv` and Playwright `baseURL` configuration |

> **Security note:** Dedicated authorization/BOLA regression automation is part of the planned security roadmap. The repository does not claim that the observed application-level security findings have been fixed.

---

# 🏗️ Framework Architecture

The framework follows a layered automation architecture:

```text

                         ┌───────────────────────────┐

                         │      Test Layer           │

                         │                           │

                         │  UI Tests | API | E2E     │

                         └─────────────┬─────────────┘

                                       │

                    ┌──────────────────┴──────────────────┐

                    │                                     │

          ┌─────────▼─────────┐                 ┌─────────▼─────────┐

          │   UI Automation   │                 │   API Automation  │

          │                   │                 │                   │

          │   Page Objects    │                 │   API Clients     │

          │   BasePage        │                 │   BaseApi         │

          └─────────┬─────────┘                 └─────────┬─────────┘

                    │                                     │

                    └──────────────────┬──────────────────┘

                                       │

                              ┌────────▼────────┐

                              │ Utilities/Data  │

                              │                 │

                              │ ExcelReader     │

                              │ Environment     │

                              │ Constants       │

                              └────────┬────────┘

                                       │

                              ┌────────▼────────┐

                              │    ParaBank     │

                              │    Application  │

                              └─────────────────┘

```

### Architecture Principles

The framework is organized around several core principles:

- **Separation of concerns** between test logic and page/API implementation

- **Reusable abstractions** through `BasePage` and `BaseApi`

- **Externalized test data** rather than embedding registration data directly in tests

- **Independent UI, API, and E2E test layers**

- **Explicit assertions** on both HTTP responses and user-facing behavior

- **Environment-driven configuration**

- **Security and test-isolation considerations** as part of framework design

---

# 📂 Project Structure

```text

.

├── .github/

│   └── agents/

│       ├── playwright-generator.md

│       ├── playwright-healer.md

│       ├── playwright-planner.md

│       └── playwright-security-auditor.md

│

├── specs/

│   ├── implementation-plan.md

│   └── security-audit.md

│

├── src/

│   ├── main/

│   │   ├── api/

│   │   │   ├── AccountApi.ts

│   │   │   ├── AdminApi.ts

│   │   │   ├── AuthApi.ts

│   │   │   ├── BaseApi.ts

│   │   │   ├── CustomerApi.ts

│   │   │   ├── LoanApi.ts

│   │   │   ├── TransactionApi.ts

│   │   │   └── TransferApi.ts

│   │   │

│   │   ├── constants/

│   │   │   └── Endpoints.ts

│   │   │

│   │   ├── pages/

│   │   │   ├── AccountActivityPage.ts

│   │   │   ├── AccountDetailsPage.ts

│   │   │   ├── AccountsOverviewPage.ts

│   │   │   ├── BasePage.ts

│   │   │   ├── BillPayPage.ts

│   │   │   ├── FindTransactionsPage.ts

│   │   │   ├── HomePage.ts

│   │   │   ├── LoginPage.ts

│   │   │   ├── OpenNewAccountPage.ts

│   │   │   ├── RegisterPage.ts

│   │   │   ├── RequestLoanPage.ts

│   │   │   ├── TransactionDetailsPage.ts

│   │   │   ├── TransferFundsPage.ts

│   │   │   └── UpdateContactInfoPage.ts

│   │   │

│   │   └── utils/

│   │       └── ExcelReader.ts

│   │

│   └── test/

│       ├── api/

│       │   ├── accounts/

│       │   ├── admin/

│       │   ├── authentication/

│       │   ├── loans/

│       │   ├── transactions/

│       │   └── transfers/

│       │

│       ├── e2e/

│       │   ├── AccountOpening.e2e.spec.ts

│       │   ├── BillPayment.e2e.spec.ts

│       │   ├── FundTransfer.e2e.spec.ts

│       │   └── LoanRequest.e2e.spec.ts

│       │

│       └── ui/

│           ├── accounts/

│           ├── authentication/

│           ├── loans/

│           └── transactions/

│

├── test-data/

│   ├── excel/

│   │   └── RegistrationData.xlsx

│   └── json/

│       └── LoginCredentials.json       # local Git-ignored state

│

├── AGENTS.md

├── package.json

├── package-lock.json

├── playwright.config.ts

└── tsconfig.json

```

### Directory Responsibilities

| Directory | Responsibility |

|---|---|

| `src/main/pages` | UI Page Object classes and reusable page actions |

| `src/main/api` | API clients and shared API abstraction |

| `src/main/constants` | Shared endpoint definitions |

| `src/main/utils` | Reusable test utilities such as Excel data reading |

| `src/test/ui` | Functional UI automation |

| `src/test/api` | REST API automation and API validation |

| `src/test/e2e` | Multi-step business workflows |

| `test-data` | Externalized test input and local generated state |

| `specs` | Security audit and implementation planning |

| `.github/agents` | Repository-specific AI agent instructions |

---

# 🎭 UI Automation

The UI automation layer uses **Playwright + TypeScript + Page Object Model**.

Page Objects encapsulate:

- Locators

- Page-level actions

- Navigation

- Form interactions

- Workflow-specific operations

- Reusable page behavior

### UI Functional Areas

The current UI suite covers areas including:

- Authentication

- Registration

- Account overview

- Account opening

- Contact information

- Transaction search

- Fund transfers

- Bill payment

- Loan requests

The framework also includes negative scenarios such as:

- Invalid credentials

- Required-field validation

- Invalid application inputs

- Error-state validation

### Why Page Object Model?

The Page Object Model helps keep:

```text

Test Logic

     ↓

Business Actions

     ↓

Locators / Page Implementation

```

separated.

This makes the tests easier to maintain when application locators or page behavior change.

---

# 🔌 API Automation

The API layer uses **Playwright's `APIRequestContext`** and reusable API classes.

A shared `BaseApi` provides common HTTP request behavior, while specialized API classes represent different ParaBank domains.

### API Areas Covered

The current framework includes API testing for:

- Customer/account operations

- Account details

- Account creation

- Authentication

- Transactions

- Transfers

- Deposits

- Withdrawals

- Loan requests

- Customer lookup

- API availability/health validation

### API Validation

The API tests validate:

- HTTP status codes

- Response content

- XML structure

- Business fields

- Account/customer relationships

- Transaction information

- Positive scenarios

- Negative scenarios

- Invalid identifiers

- Invalid account combinations

- Insufficient loan conditions

### XML Response Handling

ParaBank exposes several XML-based service responses.

The framework uses:

```text

xml2js

```

to parse XML responses and perform structured assertions instead of relying only on raw response strings.

---

# 🔄 End-to-End Testing

The E2E layer validates multi-step banking workflows rather than isolated page actions.

Current E2E areas include:

### Account Opening

Validates the account-opening workflow across multiple application steps.

### Fund Transfer

Validates the end-to-end movement of funds between accounts.

### Bill Payment

Validates the multi-step bill payment workflow.

### Loan Request

Validates the loan request workflow and resulting application state.

The E2E layer complements the lower-level UI and API suites by validating business workflows from an end-user perspective.

---

# 📊 Test Data Management

The framework separates test data from test implementation where appropriate.

### Excel Data

Registration input is maintained in:

```text

test-data/excel/RegistrationData.xlsx

```

and consumed through:

```text

src/main/utils/ExcelReader.ts

```

This allows registration data to be maintained independently from the test implementation.

### Generated Test State

Registration generates local authentication/test state used by relevant UI tests.

Sensitive generated state is excluded from Git through `.gitignore`.

> Never place production credentials, access tokens, or real personal information into the repository test data.

---

# 🌐 Cross-Browser Testing

Playwright projects are configured for:

- Chromium

- Firefox

- WebKit

This allows the same automation architecture to be executed against multiple browser engines.

The framework is configured for cross-browser execution; individual test behavior may still depend on the current state of the external ParaBank environment.

---

# 📈 Reporting & Diagnostics

The Playwright configuration currently uses:

- **HTML Reporter**

- **List Reporter**

Failure diagnostics include:

- Screenshots on failure

- Video retention on failure

- Trace retention on failure

Generated artifacts such as:

```text

playwright-report/

test-results/

```

are excluded from Git through `.gitignore`.

---

# ⚙️ Configuration

The framework uses environment-based configuration through `dotenv`.

The primary environment variable is:

```text

BASE_URL

```

Example:

```dotenv

BASE_URL=https://your-target-environment

```

The actual environment value should be stored locally or through CI/CD secrets and should never be committed to the repository.

Playwright configuration is maintained in:

```text

playwright.config.ts

```

The configuration controls:

- Base URL

- Browser projects

- Headless/headed execution

- Retries

- Timeouts

- Reporters

- Failure diagnostics

- Parallel execution

---

# 🚀 Getting Started

## Prerequisites

Install:

- Node.js 20+

- npm

Verify:

```bash

node --version

npm --version

```

## Install Dependencies

```bash

npm ci

```

Install Playwright browsers:

```bash

npx playwright install

```

## Configure Environment

Create a local:

```text

.env

```

file.

Add:

```dotenv

BASE_URL=https://your-target-environment

```

Use an appropriate isolated environment for state-changing tests.

---

# 🧪 Running Tests

The project currently provides the following npm scripts.

| Command | Purpose |

|---|---|

| `npm test` | Runs the configured Playwright test suite |

| `npm run test:headed` | Runs tests with visible browser windows |

| `npm run test:debug` | Runs Playwright in debug mode |

| `npm run report` | Opens the generated Playwright HTML report |

| `npm run test:ui` | UI-focused script; currently requires the repository's actual UI test path to be aligned |

### Discover Tests

```bash

npx playwright test --list

```

### Run API Tests

```bash

npx playwright test src/test/api --project=chromium

```

### Run UI Tests

```bash

npx playwright test src/test/ui --project=chromium

```

### Run E2E Tests

```bash

npx playwright test src/test/e2e --project=chromium

```

### Run a Specific Browser

```bash

npx playwright test --project=chromium

```

Available configured projects:

```text

chromium

firefox

webkit

```

> Some ParaBank workflows modify application state. Confirm the configured target before running state-changing UI/E2E scenarios.

---

# 🧠 Testing Strategy

The framework uses multiple testing layers to balance speed, coverage, and business confidence.

| Layer | Primary Purpose |

|---|---|

| **API** | Fast service-level validation and business-response verification |

| **UI** | User-facing workflow and validation testing |

| **E2E** | Multi-step business workflow validation |

| **Negative Testing** | Validation of invalid inputs and expected error behavior |

| **Cross-Browser** | Browser-engine compatibility validation |

| **Security Review** | Identification of authorization, data exposure, and framework safety gaps |

This layered approach helps avoid relying exclusively on expensive end-to-end tests for every validation.

---

# 🔐 Security Testing

Security is treated as an important part of the automation strategy.

The repository includes:

```text

specs/security-audit.md

specs/implementation-plan.md

```

which document security observations and the planned automation roadmap.

## Security Areas Reviewed

The security assessment considers areas including:

- Authentication

- Authorization

- Object-level access control

- BOLA/IDOR

- Sensitive data exposure

- Credential handling

- Error-response handling

- Input validation

- Test-data protection

- Environment isolation

- Session behavior

## Current Security Status

The security audit identified application-level behavior on the configured ParaBank demo where certain unauthenticated API requests returned customer/account/transaction data.

This repository **does not claim that those application-level findings have been fixed**.

The audit also did not establish cross-customer authorization bypass, because a second valid disposable customer identity was not available for controlled verification.

## Security Automation Roadmap

Planned security scenarios include:

- Anonymous object-access regression checks

- Cross-customer authorization/BOLA validation

- Logout/session invalidation

- Safe malformed-input validation

- Monetary boundary validation on isolated test data

- Secret-safe logging and reporting

- Test-data isolation

Security scenarios are intended to run only against appropriate controlled environments and known test identities.

---

# 🛡️ Environment & Test Safety

Some banking workflows modify application state, including:

- Account creation

- Transfers

- Deposits

- Withdrawals

- Bill payments

- Profile updates

- Loan requests

For reliable automation, these scenarios should run against an **isolated and resettable environment** rather than treating a shared public demo as disposable test infrastructure.

The framework's implementation plan therefore prioritizes:

1. Test-data protection

2. Target/environment validation

3. State isolation

4. Controlled execution of state-changing tests

5. CI safety gates

This approach helps reduce:

- Test interference

- Shared-account contamination

- Parallel execution conflicts

- Unintended changes to shared environments

---

**# 🤖 CI/CD

GitHub Actions

GitHub Actions CI/CD is implemented and active in this project.

The workflow is located at:

.github/workflows/playwright.yml

The pipeline is triggered automatically on:

Pushes to main

Pull requests targeting main

CI Pipeline

Git Push / Pull Request
        ↓
Checkout Repository
        ↓
Setup Node.js 20
        ↓
Install Dependencies
        ↓
Install Playwright + Chromium
        ↓
Run API Test Suite
        ↓
Upload Playwright Report
        ↓
Upload Test Results

Current CI Scope

The current GitHub Actions workflow executes the API automation suite using Chromium.

This provides an automated CI gate for the service-level test layer while keeping execution controlled against the shared ParaBank demo environment.

Environment Configuration

The CI workflow supplies the required BASE_URL environment variable during execution.

Sensitive local configuration remains excluded from source control through .gitignore.

Failure Visibility

The CI pipeline is designed to surface failures rather than hide or bypass them.

If a test fails because of:

Application behavior

Test-data state

Environment instability

API response changes

Automation defects

the GitHub Actions run reports the failure and retains Playwright artifacts for investigation.

This allows CI to act as an automated feedback mechanism rather than simply reporting successful execution.

Test Artifacts

The workflow uploads:

playwright-report/
test-results/

as GitHub Actions artifacts when the workflow completes.

These artifacts can be used to investigate failed tests through Playwright reports and diagnostic traces.

Future CI Expansion

The current CI pipeline intentionally focuses on API tests.

Future improvements include:

Controlled UI test execution

Controlled E2E execution

Isolated test environments

Better test-data management

Security regression execution

Environment-specific CI configuration

Additional CI safety gates

🧩 Engineering Practices Demonstrated**

This project demonstrates several practices relevant to modern QA/SDET engineering:

### Page Object Model

Encapsulates UI locators and business actions for maintainability.

### API Abstraction

Uses a shared `BaseApi` and domain-oriented API classes to reduce duplicated request construction.

### Layered Test Architecture

Separates:

```text

API

UI

E2E

```

allowing each layer to focus on an appropriate level of validation.

### Data-Driven Testing

Registration data is externalized into Excel and consumed through a reusable reader.

### Positive & Negative Testing

The framework validates both expected success behavior and meaningful failure conditions.

### Cross-Browser Execution

Playwright projects support Chromium, Firefox, and WebKit.

### Explicit Assertions

Tests validate HTTP status, response structure, business fields, and user-visible application behavior.

### Security-Aware Automation

The project incorporates security auditing and a staged security automation roadmap rather than treating functional automation as the only quality concern.

### Environment Awareness

The framework recognizes the difference between a shared demo environment and a controlled test environment.

---

# 📋 Test Coverage

The repository currently contains separate test layers for:

### API

- Customer/account operations

- Account creation

- Authentication

- Transactions

- Transfers

- Deposits

- Withdrawals

- Loans

- Customer lookup

- API accessibility

### UI

- Authentication

- Registration

- Accounts

- Account opening

- Contact information

- Transactions

- Transfers

- Bill payment

- Loan requests

### E2E

- Account opening

- Fund transfer

- Bill payment

- Loan request

The test suite includes both positive and negative scenarios.

---

# ⚠️ Known Limitations

The current repository has a few known engineering considerations:

### ParaBank Environment

The public ParaBank demo has demonstrated login/server instability during automation execution.

The automation framework intentionally does not rewrite the login flow to mask application/environment behavior.

### Shared Demo State

Some banking workflows modify application state and therefore require an isolated/resettable environment for reliable parallel execution.

### Target Hardening

Some existing UI/E2E flows currently contain direct navigation to the public ParaBank environment. Target-selection hardening is part of the implementation roadmap.

### Security Automation

The repository contains a security audit and implementation plan, while dedicated cross-customer authorization/BOLA regression automation remains planned.

### CI/CD

GitHub Actions integration is planned and will be introduced with environment and test-safety controls.

---

# 🗺️ Roadmap

The current implementation roadmap prioritizes:

- [ ] Protect credentials and sensitive test data

- [ ] Improve logging and report redaction

- [ ] Enforce safe target/environment selection

- [ ] Remove hard-coded application navigation

- [ ] Improve state isolation for mutating tests

- [ ] Correct and validate focused test commands

- [x] Introduce GitHub Actions CI/CD

Expand CI coverage to controlled UI/E2E workflows

- [ ] Add focused authorization/security regression tests

- [ ] Improve API abstraction consistency

- [ ] Strengthen CI artifact and secret protection

The roadmap is intentionally incremental so existing functional coverage remains intact.

---

# 📚 Project Documentation

Additional engineering documentation is available under:

```text

specs/

├── security-audit.md

└── implementation-plan.md

```

The repository also contains AI-agent guidance under:

```text

.github/agents/

```

covering planning, test generation, failure healing, and security auditing.

---

# 👨‍💻 Author

**Dibyajyoti Roy**

QA Automation / SDET-focused engineer with hands-on experience in:

- Playwright

- TypeScript

- Selenium

- API Automation

- UI Automation

- REST API Testing

- End-to-End Testing

- Test Automation Framework Design

- SQL

- CI/CD

- Quality Engineering

---

# ⭐ Why This Project?

This project demonstrates more than browser automation.

It brings together:

```text

UI Automation

      +

API Automation

      +

E2E Business Workflows

      +

Reusable Framework Architecture

      +

Data-Driven Testing

      +

Negative Testing

      +

Cross-Browser Execution

      +

Security Engineering

      +

CI/CD Readiness

```

The goal is to demonstrate how a QA automation engineer can design and evolve a maintainable automation framework with **testability, reliability, security, and CI/CD in mind**.

---

## 📌 Repository Status

**Active automation framework — continuously evolving toward stronger test isolation, security coverage, and CI/CD execution.**