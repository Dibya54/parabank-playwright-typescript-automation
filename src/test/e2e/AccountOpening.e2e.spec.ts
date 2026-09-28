import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { LoginPage } from '../../main/pages/LoginPage';
import { AccountsOverviewPage } from '../../main/pages/AccountsOverviewPage';
import { OpenNewAccountPage } from '../../main/pages/OpenNewAccountPage';
import { AccountDetailsPage } from '../../main/pages/AccountDetailsPage';


// =======================================================
// TEST DATA
// =======================================================

const credentialsPath = path.join(
  process.cwd(),
  'test-data',
  'json',
  'LoginCredentials.json'
);

if (!fs.existsSync(credentialsPath)) {
  throw new Error(
    `Login credentials file was not found: ${credentialsPath}`
  );
}

const credentials = JSON.parse(
  fs.readFileSync(
    credentialsPath,
    'utf-8'
  )
);

if (
  !credentials.username ||
  !credentials.password
) {
  throw new Error(
    'LoginCredentials.json must contain username and password.'
  );
}


// =======================================================
// TEST SUITE
// =======================================================

test.describe('ParaBank - Open New Account', () => {


  // =====================================================
  // LOGIN BEFORE EACH TEST
  // =====================================================

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

    const accountsHeading = page.getByRole(
      'heading',
      {
        name: /Accounts Overview/i
      }
    ).first();

    await expect(
      accountsHeading
    ).toBeVisible({
      timeout: 30000
    });
  });


  // =====================================================
  // OPEN AND VERIFY NEW CHECKING ACCOUNT
  // =====================================================

  test(
    'User should be able to open and verify a new checking account',
    async ({ page }) => {

      const accountsOverviewPage =
        new AccountsOverviewPage(page);


      // ---------------------------------------------------
      // Get existing account
      // ---------------------------------------------------

      await accountsOverviewPage.waitForAccountsToLoad();

      const fromAccount =
        await accountsOverviewPage.getFirstAccountNumber();


      // ---------------------------------------------------
      // Navigate to Open New Account
      // ---------------------------------------------------

      await page.getByRole(
        'link',
        {
          name: 'Open New Account'
        }
      ).click();


      const openNewAccountPage =
        new OpenNewAccountPage(page);


      // ---------------------------------------------------
      // Verify Open New Account page
      // ---------------------------------------------------

      await expect(
        openNewAccountPage.fromAccountDropdown
      ).toBeVisible({
        timeout: 30000
      });


      // ---------------------------------------------------
      // Create new CHECKING account
      // ---------------------------------------------------

      const newAccountNumber =
        await openNewAccountPage.openAccount(
          'CHECKING',
          fromAccount
        );


      // ---------------------------------------------------
      // Verify account creation
      // ---------------------------------------------------

      await expect(
        openNewAccountPage.accountOpenedMessage
      ).toBeVisible({
        timeout: 30000
      });

      expect(
        newAccountNumber
      ).not.toBe('');


      // ---------------------------------------------------
      // Navigate to Account Details
      // ---------------------------------------------------

      await openNewAccountPage.clickNewAccount();

      const accountDetailsPage =
        new AccountDetailsPage(page);


      // ---------------------------------------------------
      // Verify Account Details page
      // ---------------------------------------------------

      await expect(
        accountDetailsPage.accountDetailsHeading
      ).toBeVisible({
        timeout: 30000
      });


      // ---------------------------------------------------
      // Verify Account Number
      // ---------------------------------------------------

      const displayedAccountNumber =
        await accountDetailsPage.getAccountNumber();

      expect(
        displayedAccountNumber
      ).toBe(newAccountNumber);


      // ---------------------------------------------------
      // Verify Account Type
      // ---------------------------------------------------

      const accountType =
        await accountDetailsPage.getAccountType();

      expect(
        accountType
      ).toBe('CHECKING');


      // ---------------------------------------------------
      // Verify Balance
      // ---------------------------------------------------

      const balance =
        await accountDetailsPage.getBalance();

      expect(
        balance
      ).toBe('$100.00');


      // ---------------------------------------------------
      // Verify Available Balance
      // ---------------------------------------------------

      const availableBalance =
        await accountDetailsPage.getAvailableBalance();

      expect(
        availableBalance
      ).toBe('$100.00');


      // ---------------------------------------------------
      // Verify Transaction
      // ---------------------------------------------------

      await expect(
        accountDetailsPage.fundsTransferReceivedLink
      ).toBeVisible({
        timeout: 30000
      });
    }
  );

});