import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { LoginPage } from '../../main/pages/LoginPage';
import { AccountsOverviewPage } from '../../main/pages/AccountsOverviewPage';
import { RequestLoanPage } from '../../main/pages/RequestLoanPage';
import { AccountDetailsPage } from '../../main/pages/AccountDetailsPage';

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

test.describe('ParaBank - Loan Request E2E', () => {

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

  test('User should be able to request and receive an approved loan', async ({
    page
  }) => {

    // --------------------------------------------------
    // Step 1: Get an existing account
    // --------------------------------------------------

    const accountsOverviewPage =
      new AccountsOverviewPage(page);

    await accountsOverviewPage.waitForAccountsToLoad();

    const fromAccount =
      await accountsOverviewPage.getFirstAccountNumber();

    console.log(
      'Loan request from account:',
      fromAccount
    );

    expect(fromAccount).not.toBe('');


    // --------------------------------------------------
    // Step 2: Navigate to Request Loan
    // --------------------------------------------------

    await page.getByRole('link', {
      name: 'Request Loan'
    }).click();

    const requestLoanPage =
      new RequestLoanPage(page);

    await expect(
      requestLoanPage.amountInput
    ).toBeVisible({
      timeout: 30000
    });


    // --------------------------------------------------
    // Step 3: Submit loan request
    // --------------------------------------------------

    const loanAmount = '1000';
    const downPayment = '100';

    await requestLoanPage.requestLoan(
      loanAmount,
      downPayment,
      fromAccount
    );


    // --------------------------------------------------
    // Step 4: Verify loan request was processed
    // --------------------------------------------------

    await expect(
      requestLoanPage.loanRequestProcessedHeading
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      requestLoanPage.loanProvider
    ).toBeVisible();

    await expect(
      requestLoanPage.loanStatus
    ).toBeVisible();

    await expect(
      requestLoanPage.approvalMessage
    ).toBeVisible();


    // --------------------------------------------------
    // Step 5: Capture the newly created account
    // --------------------------------------------------

    const newAccountNumber =
      await requestLoanPage.getNewAccountNumber();

    console.log(
      'New loan account number:',
      newAccountNumber
    );

    expect(newAccountNumber).not.toBe('');


    // --------------------------------------------------
    // Step 6: Open the new loan account
    // --------------------------------------------------

    await requestLoanPage.newAccountLink.click();

    const accountDetailsPage =
      new AccountDetailsPage(page);

    await expect(
      accountDetailsPage.accountDetailsHeading
    ).toBeVisible({
      timeout: 30000
    });


    // --------------------------------------------------
    // Step 7: Verify the newly created account
    // --------------------------------------------------

    const displayedAccountNumber =
      await accountDetailsPage.getAccountNumber();

    console.log(
      'Displayed loan account:',
      displayedAccountNumber
    );

    expect(displayedAccountNumber)
      .toBe(newAccountNumber);


    // --------------------------------------------------
    // Step 8: Verify account type
    // --------------------------------------------------

    const accountType =
      await accountDetailsPage.getAccountType();

    console.log(
      'Loan account type:',
      accountType
    );

    expect(accountType).not.toBe('');


    // --------------------------------------------------
    // Step 9: Verify account has balance information
    // --------------------------------------------------

    const balance =
      await accountDetailsPage.getBalance();

    const availableBalance =
      await accountDetailsPage.getAvailableBalance();

    console.log(
      'Loan account balance:',
      balance
    );

    console.log(
      'Loan account available balance:',
      availableBalance
    );

    expect(balance).not.toBe('');
    expect(availableBalance).not.toBe('');
  });
});