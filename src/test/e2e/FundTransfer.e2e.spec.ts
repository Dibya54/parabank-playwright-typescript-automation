import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import path from 'path';

import { HomePage } from '../../main/pages/HomePage';
import { RegisterPage } from '../../main/pages/RegisterPage';
import { LoginPage } from '../../main/pages/LoginPage';

import { ExcelReader } from '../../main/utils/ExcelReader';

import { AccountsOverviewPage } from '../../main/pages/AccountsOverviewPage';
import { OpenNewAccountPage } from '../../main/pages/OpenNewAccountPage';
import { TransferFundsPage } from '../../main/pages/TransferFundsPage';
import { AccountActivityPage } from '../../main/pages/AccountActivityPage';
import { TransactionDetailsPage } from '../../main/pages/TransactionDetailsPage';


// =======================================================
// REGISTRATION DATA
// =======================================================

const excelPath = path.join(
  process.cwd(),
  'test-data',
  'excel',
  'RegistrationData.xlsx'
);

const registrationData = ExcelReader.readExcel(
  excelPath,
  'Sheet1'
);

if (registrationData.length === 0) {
  throw new Error(
    'RegistrationData.xlsx does not contain any registration data.'
  );
}

const userData = registrationData[0];


// =======================================================
// TEST SUITE
// =======================================================

test.describe('ParaBank - Fund Transfer', () => {


  // =====================================================
  // FRESH REGISTRATION + LOGIN
  // =====================================================

  test.beforeEach(async ({ page }) => {

    // ---------------------------------------------------
    // Open ParaBank
    // ---------------------------------------------------

    const homePage = new HomePage(page);

    await homePage.navigateTo(
      'https://parabank.parasoft.com/parabank/index.htm'
    );

    // ---------------------------------------------------
    // Open Registration
    // ---------------------------------------------------

    await homePage.clickRegister();

    const registerPage =
      new RegisterPage(page);


    // ---------------------------------------------------
    // Generate Fresh Username
    // ---------------------------------------------------

    const uniqueUsername =
      `testuser_${randomUUID()
        .replace(/-/g, '')
        .slice(0, 8)}`;

    const password =
      userData.Password;


    // ---------------------------------------------------
    // Fill Registration Details
    // ---------------------------------------------------

    await registerPage.enterFirstName(
      userData.FirstName
    );

    await registerPage.enterLastName(
      userData.LastName
    );

    await registerPage.enterAddress(
      userData.Address
    );

    await registerPage.enterCity(
      userData.City
    );

    await registerPage.enterState(
      userData.State
    );

    await registerPage.enterZipCode(
      userData.ZipCode
    );

    await registerPage.enterPhone(
      userData.Phone
    );

    await registerPage.enterSSN(
      userData.SSN
    );

    await registerPage.enterUsername(
      uniqueUsername
    );

    await registerPage.enterPassword(
      password
    );

    await registerPage.enterConfirmPassword(
      password
    );


    // ---------------------------------------------------
    // Submit Registration
    // ---------------------------------------------------

    await registerPage.clickRegister();


    // ---------------------------------------------------
    // Validate Registration
    // ---------------------------------------------------

    await expect(
      page.getByText(
        `Welcome ${uniqueUsername}`,
        {
          exact: true
        }
      )
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      page.getByText(
        'Your account was created successfully. You are now logged in.',
        {
          exact: true
        }
      )
    ).toBeVisible({
      timeout: 30000
    });


    // ---------------------------------------------------
    // Logout
    // ---------------------------------------------------

    await page.getByRole(
      'link',
      {
        name: 'Log Out'
      }
    ).click();


    // ---------------------------------------------------
    // Login With Fresh Credentials
    // ---------------------------------------------------

    const loginPage =
      new LoginPage(page);

    await loginPage.login(
      uniqueUsername,
      password
    );


    // ---------------------------------------------------
    // Verify Accounts Overview
    // ---------------------------------------------------

    await expect(
      page.getByRole(
        'heading',
        {
          name: /Accounts Overview/i
        }
      ).first()
    ).toBeVisible({
      timeout: 30000
    });
  });


  // =====================================================
  // FUND TRANSFER TEST
  // =====================================================

  test(
    'User should be able to transfer funds and verify transactions',
    async ({ page }) => {

      const accountsOverviewPage =
        new AccountsOverviewPage(page);


      // =================================================
      // GET ORIGINAL ACCOUNT
      // =================================================

      await accountsOverviewPage.waitForAccountsToLoad();

      const fromAccount =
        await accountsOverviewPage.getFirstAccountNumber();


      // =================================================
      // CREATE SECOND ACCOUNT
      // =================================================

      await page.getByRole(
        'link',
        {
          name: 'Open New Account'
        }
      ).click();

      const openNewAccountPage =
        new OpenNewAccountPage(page);

      await expect(
        openNewAccountPage.fromAccountDropdown
      ).toBeVisible({
        timeout: 30000
      });

      const toAccount =
        await openNewAccountPage.openAccount(
          'CHECKING',
          fromAccount
        );

      expect(
        toAccount
      ).not.toBe('');

      expect(
        toAccount
      ).not.toBe(fromAccount);


      // =================================================
      // GO TO FROM ACCOUNT
      // CAPTURE EXISTING SENT TRANSACTIONS
      // =================================================

      await page.getByRole(
        'link',
        {
          name: 'Accounts Overview'
        }
      ).click();

      await accountsOverviewPage.waitForAccountsToLoad();

      await page.getByRole(
        'link',
        {
          name: fromAccount,
          exact: true
        }
      ).click();

      const fromAccountActivityPage =
        new AccountActivityPage(page);

      await expect(
        fromAccountActivityPage.dateColumn
      ).toBeVisible({
        timeout: 30000
      });

      const existingSentTransactions =
        await fromAccountActivityPage
          .getTransferSentHrefs();


      // =================================================
      // GO TO TO ACCOUNT
      // CAPTURE EXISTING RECEIVED TRANSACTIONS
      // =================================================

      await page.getByRole(
        'link',
        {
          name: 'Accounts Overview'
        }
      ).click();

      await accountsOverviewPage.waitForAccountsToLoad();

      await page.getByRole(
        'link',
        {
          name: toAccount,
          exact: true
        }
      ).click();

      const toAccountActivityPage =
        new AccountActivityPage(page);

      await expect(
        toAccountActivityPage.dateColumn
      ).toBeVisible({
        timeout: 30000
      });

      const existingReceivedTransactions =
        await toAccountActivityPage
          .getTransferReceivedHrefs();


      // =================================================
      // OPEN TRANSFER FUNDS
      // =================================================

      await page.getByRole(
        'link',
        {
          name: 'Transfer Funds'
        }
      ).click();

      const transferFundsPage =
        new TransferFundsPage(page);

      await expect(
        transferFundsPage.transferFundsHeading
      ).toBeVisible({
        timeout: 30000
      });


      // =================================================
      // PERFORM TRANSFER
      // =================================================

      const transferAmount =
        '100.00';

      await transferFundsPage.transferFunds(
        transferAmount,
        fromAccount,
        toAccount
      );


      // =================================================
      // VERIFY TRANSFER COMPLETE
      // =================================================

      await expect(
        transferFundsPage.transferCompleteMessage
      ).toBeVisible({
        timeout: 30000
      });


      // =================================================
      // GO TO FROM ACCOUNT
      // =================================================

      await page.getByRole(
        'link',
        {
          name: 'Accounts Overview'
        }
      ).click();

      await accountsOverviewPage.waitForAccountsToLoad();

      await page.getByRole(
        'link',
        {
          name: fromAccount,
          exact: true
        }
      ).click();


      // =================================================
      // FIND NEW SENT TRANSACTION
      // =================================================

      const sentActivityPage =
        new AccountActivityPage(page);

      await expect(
        sentActivityPage.dateColumn
      ).toBeVisible({
        timeout: 30000
      });

      const newSentTransaction =
        await sentActivityPage.waitForNewTransferSent(
          existingSentTransactions
        );

      const newSentHref =
        await newSentTransaction.getAttribute(
          'href'
        );

      if (!newSentHref) {
        throw new Error(
          'Could not obtain the new sent transaction href.'
        );
      }


      // =================================================
      // VERIFY SENT AMOUNT
      // =================================================

      await expect(
        sentActivityPage.getAmountFromTransactionRow(
          newSentHref,
          `$${transferAmount}`
        )
      ).toBeVisible({
        timeout: 30000
      });


      // =================================================
      // OPEN SENT TRANSACTION
      // =================================================

      await sentActivityPage.openTransaction(
        newSentHref
      );

      const sentTransactionPage =
        new TransactionDetailsPage(page);

      const sentTransaction =
        await sentTransactionPage
          .getTransactionDetails();


      // =================================================
      // VERIFY SENT TRANSACTION DETAILS
      // =================================================

      expect(
        sentTransaction.transactionId
      ).not.toBe('');

      expect(
        sentTransaction.date
      ).not.toBe('');

      expect(
        sentTransaction.description
      ).toBe(
        'Funds Transfer Sent'
      );

      expect(
        sentTransaction.type
      ).toBe(
        'Debit'
      );

      expect(
        sentTransaction.amount
      ).toBe(
        `$${transferAmount}`
      );


      // =================================================
      // GO TO TO ACCOUNT
      // =================================================

      await page.getByRole(
        'link',
        {
          name: 'Accounts Overview'
        }
      ).click();

      await accountsOverviewPage.waitForAccountsToLoad();

      await page.getByRole(
        'link',
        {
          name: toAccount,
          exact: true
        }
      ).click();


      // =================================================
      // FIND NEW RECEIVED TRANSACTION
      // =================================================

      const receivedActivityPage =
        new AccountActivityPage(page);

      await expect(
        receivedActivityPage.dateColumn
      ).toBeVisible({
        timeout: 30000
      });

      const newReceivedTransaction =
        await receivedActivityPage
          .waitForNewTransferReceived(
            existingReceivedTransactions
          );

      const newReceivedHref =
        await newReceivedTransaction.getAttribute(
          'href'
        );

      if (!newReceivedHref) {
        throw new Error(
          'Could not obtain the new received transaction href.'
        );
      }


      // =================================================
      // VERIFY RECEIVED AMOUNT
      // =================================================

      await expect(
        receivedActivityPage.getAmountFromTransactionRow(
          newReceivedHref,
          `$${transferAmount}`
        )
      ).toBeVisible({
        timeout: 30000
      });


      // =================================================
      // OPEN RECEIVED TRANSACTION
      // =================================================

      await receivedActivityPage.openTransaction(
        newReceivedHref
      );

      const receivedTransactionPage =
        new TransactionDetailsPage(page);

      const receivedTransaction =
        await receivedTransactionPage
          .getTransactionDetails();


      // =================================================
      // VERIFY RECEIVED TRANSACTION DETAILS
      // =================================================

      expect(
        receivedTransaction.transactionId
      ).not.toBe('');

      expect(
        receivedTransaction.transactionId
      ).not.toBe(
        sentTransaction.transactionId
      );

      expect(
        receivedTransaction.date
      ).toBe(
        sentTransaction.date
      );

      expect(
        receivedTransaction.description
      ).toBe(
        'Funds Transfer Received'
      );

      expect(
        receivedTransaction.type
      ).toBe(
        'Credit'
      );

      expect(
        receivedTransaction.amount
      ).toBe(
        `$${transferAmount}`
      );
    }
  );

});