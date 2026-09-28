# Project Rules for AI Agents

You are working in a Playwright TypeScript automation framework for the ParaBank banking application.

Follow these rules for every code change.

---

# Project Purpose

This project is a banking-domain automation framework covering:

- UI automation
- API automation
- End-to-end business flows
- Negative testing
- Security validation
- Test-data driven automation
- Cross-browser testing
- CI/CD readiness

The framework must prioritize maintainability, realistic test coverage, and meaningful assertions over the number of tests.

---

# Stack

- Playwright with TypeScript
- Node.js 20+
- Test runner: `@playwright/test`
- API automation: Playwright APIRequestContext
- XML parsing: `xml2js`
- Excel test data: `xlsx`
- Environment configuration: `dotenv`
- Reporter: Playwright HTML + list reporter
- CI target: GitHub Actions

Do not add npm dependencies without asking first.

---

# Actual Project Structure

The existing project structure is authoritative.

```text
src/
├── main/
│   ├── api/
│   │   ├── AccountApi.ts
│   │   ├── AdminApi.ts
│   │   ├── AuthApi.ts
│   │   ├── BaseApi.ts
│   │   ├── CustomerApi.ts
│   │   ├── LoanApi.ts
│   │   ├── TransactionApi.ts
│   │   └── TransferApi.ts
│   │
│   ├── config/
│   ├── constants/
│   ├── data/
│   ├── models/
│   │
│   ├── pages/
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── RegisterPage.ts
│   │   └── other page objects
│   │
│   └── utils/
│
└── test/
    ├── api/
    ├── e2e/
    ├── fixtures/
    └── ui/

test-data/
├── excel/
└── json/

specs/

playwright.config.ts
package.json
.env