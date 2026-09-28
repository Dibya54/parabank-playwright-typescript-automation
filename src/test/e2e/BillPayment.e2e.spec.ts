import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { LoginPage } from '../../main/pages/LoginPage';
import { AccountsOverviewPage } from '../../main/pages/AccountsOverviewPage';
import { BillPayPage } from '../../main/pages/BillPayPage';

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
  fs.readFileSync(credentialsPath, 'utf-8')
);

if (!credentials.username || !credentials.password) {
  throw new Error(
    'LoginCredentials.json must contain username and password.'
  );
}

test.describe('ParaBank - Bill Payment', () => {

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
      page.getByRole('heading', {
        name: /Accounts Overview/i
      }).first()
    ).toBeVisible({
      timeout: 30000
    });
  });

  test(
    'User should be able to complete a bill payment',
    async ({ page }) => {

      const accountsOverviewPage =
        new AccountsOverviewPage(page);

      await accountsOverviewPage.waitForAccountsToLoad();

      const fromAccount =
        await accountsOverviewPage.getFirstAccountNumber();

      console.log(
        'Bill payment from account:',
        fromAccount
      );

      await page.getByRole('link', {
        name: 'Bill Pay'
      }).click();

      const billPayPage =
        new BillPayPage(page);

      const payeeName = 'rter';
      const street = '123 Test Street';
      const city = 'Kolkata';
      const state = 'West Bengal';
      const zipCode = '700001';
      const phone = '9876543210';
      const accountNumber = '123456789';
      const amount = '100';

      await billPayPage.payBill(
        payeeName,
        street,
        city,
        state,
        zipCode,
        phone,
        accountNumber,
        amount,
        fromAccount
      );

      await expect(
        billPayPage.billPaymentCompleteMessage
      ).toBeVisible({
        timeout: 30000
      });

      const confirmation =
        await billPayPage.getBillPaymentConfirmation();

      console.log(
        'Bill payment confirmation:',
        confirmation
      );

      expect(confirmation).toContain(
        'Bill Payment to'
      );

      expect(confirmation).toContain(
        'was successful.'
      );

      expect(confirmation).toContain(
        `$${Number(amount).toFixed(2)}`
      );

      expect(confirmation).toContain(
        `from account ${fromAccount}`
      );
    }
  );
});