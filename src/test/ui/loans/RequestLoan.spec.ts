import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { LoginPage } from '../../../main/pages/LoginPage';
import { AccountsOverviewPage } from '../../../main/pages/AccountsOverviewPage';
import { RequestLoanPage } from '../../../main/pages/RequestLoanPage';

const credentialsPath = path.join(
  process.cwd(),
  'test-data',
  'json',
  'LoginCredentials.json'
);

if (!fs.existsSync(credentialsPath)) {
  throw new Error(
    `Login credentials file not found: ${credentialsPath}`
  );
}

const credentials = JSON.parse(
  fs.readFileSync(credentialsPath, 'utf-8')
);

if (!credentials.username || !credentials.password) {
  throw new Error(
    'Username or password is missing from LoginCredentials.json'
  );
}

test.describe('ParaBank - Request Loan UI', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto(
      'https://parabank.parasoft.com/parabank/index.htm',
      {
        waitUntil: 'domcontentloaded'
      }
    );

    const loginPage = new LoginPage(page);

    await loginPage.login(
      credentials.username,
      credentials.password
    );

    await expect(
      page
        .getByRole('heading', {
          name: /Accounts Overview/i
        })
        .first()
    ).toBeVisible({
      timeout: 30000
    });
  });

  test('Request Loan page should display all required fields', async ({
    page
  }) => {

    await page.getByRole('link', {
      name: 'Request Loan'
    }).click();

    const requestLoanPage =
      new RequestLoanPage(page);

    await expect(
      requestLoanPage.amountInput
    ).toBeVisible();

    await expect(
      requestLoanPage.downPaymentInput
    ).toBeVisible();

    await expect(
      requestLoanPage.fromAccountDropdown
    ).toBeVisible();

    await expect(
      requestLoanPage.applyButton
    ).toBeVisible();
  });

  test('User should be able to submit a loan request', async ({
    page
  }) => {

    const accountsOverviewPage =
      new AccountsOverviewPage(page);

    await accountsOverviewPage.waitForAccountsToLoad();

    const fromAccount =
      await accountsOverviewPage.getFirstAccountNumber();

    console.log(
      'Loan request from account:',
      fromAccount
    );

    await page.getByRole('link', {
      name: 'Request Loan'
    }).click();

    const requestLoanPage =
      new RequestLoanPage(page);

    const loanAmount = '1000';
    const downPayment = '100';

    await requestLoanPage.requestLoan(
      loanAmount,
      downPayment,
      fromAccount
    );

    // Verify loan request was processed
    await expect(
      requestLoanPage.loanRequestProcessedHeading
    ).toBeVisible({
      timeout: 30000
    });

    // Verify loan provider
    await expect(
      requestLoanPage.loanProvider
    ).toBeVisible();

    // Verify approval status
    await expect(
      requestLoanPage.loanStatus
    ).toBeVisible();

    // Verify approval message
    await expect(
      requestLoanPage.approvalMessage
    ).toBeVisible();

    // Verify dynamic loan date
    const loanDate =
      await requestLoanPage.getLoanDate();

    console.log(
      'Loan approval date:',
      loanDate
    );

    expect(loanDate).not.toBe('');

    // Verify dynamic new account number
    const newAccountNumber =
      await requestLoanPage.getNewAccountNumber();

    console.log(
      'New loan account number:',
      newAccountNumber
    );

    expect(newAccountNumber).not.toBe('');

    await expect(
      requestLoanPage.newAccountLink
    ).toBeVisible();
  });
});