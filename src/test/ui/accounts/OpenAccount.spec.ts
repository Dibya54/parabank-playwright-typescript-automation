import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { LoginPage } from '../../../main/pages/LoginPage';
import { AccountsOverviewPage } from '../../../main/pages/AccountsOverviewPage';
import { OpenNewAccountPage } from '../../../main/pages/OpenNewAccountPage';

// =========================================================
// Login Credentials Configuration
// =========================================================

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

// =========================================================
// Open New Account Test Suite
// =========================================================

test.describe('ParaBank - Open New Account', () => {

  // -------------------------------------------------------
  // Login before every test
  // -------------------------------------------------------

  test.beforeEach(async ({ page }) => {

    await page.goto(
      'https://parabank.parasoft.com/parabank/index.htm'
    );

    const loginPage = new LoginPage(page);

    await loginPage.login(
      credentials.username,
      credentials.password
    );

    // Verify successful login
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

  // =======================================================
  // Open Checking Account
  // =======================================================

  test(
    'User should be able to open a new checking account',
    async ({ page }) => {

      const accountsOverviewPage =
        new AccountsOverviewPage(page);

      // ---------------------------------------------------
      // Wait for existing account data
      // ---------------------------------------------------

      await accountsOverviewPage.waitForAccountsToLoad();

      // ---------------------------------------------------
      // Get existing account dynamically
      // ---------------------------------------------------

      const fromAccount =
        await accountsOverviewPage.getFirstAccountNumber();

      console.log(
        'Existing account used for funding:',
        fromAccount
      );

      // ---------------------------------------------------
      // Navigate to Open New Account
      // ---------------------------------------------------

      await page.getByRole(
        'link',
        {
          name: 'Open New Account'
        }
      ).click();

      // ---------------------------------------------------
      // Create Open New Account Page Object
      // ---------------------------------------------------

      const openNewAccountPage =
        new OpenNewAccountPage(page);

      // ---------------------------------------------------
      // Wait for From Account dropdown
      // ---------------------------------------------------

      await expect(
        openNewAccountPage.fromAccountDropdown
      ).toBeVisible({
        timeout: 30000
      });

      // ---------------------------------------------------
      // Open Checking Account
      // ---------------------------------------------------

      const newAccountNumber =
        await openNewAccountPage.openAccount(
          'CHECKING',
          fromAccount
        );

      // ---------------------------------------------------
      // Validate New Account
      // ---------------------------------------------------

      await expect(
        openNewAccountPage.accountOpenedMessage
      ).toBeVisible();

      expect(
        newAccountNumber
      ).not.toBe('');

      console.log(
        'New checking account created:',
        newAccountNumber
      );
    }
  );

});