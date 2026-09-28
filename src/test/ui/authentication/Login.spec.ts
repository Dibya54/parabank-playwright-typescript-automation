import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { LoginPage } from '../../../main/pages/LoginPage';
import { AccountsOverviewPage } from '../../../main/pages/AccountsOverviewPage';

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
// Login Test Suite
// =========================================================

test.describe('ParaBank - User Login', () => {

  // -------------------------------------------------------
  // Navigate to ParaBank
  // -------------------------------------------------------

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'https://parabank.parasoft.com/parabank/index.htm'
    );
  });

  // =======================================================
  // Positive Login Test
  // =======================================================

  test(
    'Registered user should login successfully',
    async ({ page }) => {

      const loginPage = new LoginPage(page);

      console.log(
        'Username being used:',
        credentials.username
      );

      // ---------------------------------------------------
      // Login
      // ---------------------------------------------------

      await loginPage.login(
        credentials.username,
        credentials.password
      );

      // ---------------------------------------------------
      // Validate Successful Login
      // ---------------------------------------------------

      await expect(
        page
          .getByRole('heading', {
            name: /Accounts Overview/i
          })
          .first()
      ).toBeVisible({
        timeout: 30000
      });

      // ---------------------------------------------------
      // Accounts Overview
      // ---------------------------------------------------

      const accountsOverviewPage =
        new AccountsOverviewPage(page);

      // Wait for AJAX account data to load
      await accountsOverviewPage.waitForAccountsToLoad();

      // Get first account number
      const accountNumber =
        await accountsOverviewPage.getFirstAccountNumber();

      console.log(
        'Account number:',
        accountNumber
      );
    }
  );

  // =======================================================
  // Negative Login Test
  // =======================================================

  test(
    'User should not login with invalid password',
    async ({ page }) => {

      const loginPage = new LoginPage(page);

      await loginPage.login(
        credentials.username,
        'InvalidPassword@123'
      );

      // ---------------------------------------------------
      // Validate Login Error
      // ---------------------------------------------------

      await expect(
        loginPage.errorMessage
      ).toBeVisible({
        timeout: 10000
      });
    }
  );

});