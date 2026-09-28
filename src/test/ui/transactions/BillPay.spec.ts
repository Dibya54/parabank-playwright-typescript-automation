import { test, expect } from '@playwright/test';

import { BillPayPage } from '../../../main/pages/BillPayPage';

test.describe('ParaBank - Bill Pay UI', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'https://parabank.parasoft.com/parabank/billpay.htm',
      {
        waitUntil: 'domcontentloaded'
      }
    );
  });

  test('Bill Pay page should display all payment fields', async ({ page }) => {

    const billPayPage = new BillPayPage(page);

    await expect(
      billPayPage.payeeNameInput
    ).toBeVisible();

    await expect(
      billPayPage.payeeStreetInput
    ).toBeVisible();

    await expect(
      billPayPage.payeeCityInput
    ).toBeVisible();

    await expect(
      billPayPage.payeeStateInput
    ).toBeVisible();

    await expect(
      billPayPage.payeeZipCodeInput
    ).toBeVisible();

    await expect(
      billPayPage.payeePhoneInput
    ).toBeVisible();

    await expect(
      billPayPage.payeeAccountNumberInput
    ).toBeVisible();

    await expect(
      billPayPage.verifyAccountInput
    ).toBeVisible();

    await expect(
      billPayPage.amountInput
    ).toBeVisible();

    await expect(
      billPayPage.fromAccountDropdown
    ).toBeVisible();

    await expect(
      billPayPage.sendPaymentButton
    ).toBeVisible();
  });

  test('User should be able to enter bill payment details', async ({ page }) => {

    const billPayPage = new BillPayPage(page);

    await billPayPage.enterPayeeName('rter');

    await billPayPage.enterPayeeStreet(
      '123 Test Street'
    );

    await billPayPage.enterPayeeCity(
      'Kolkata'
    );

    await billPayPage.enterPayeeState(
      'West Bengal'
    );

    await billPayPage.enterPayeeZipCode(
      '700001'
    );

    await billPayPage.enterPayeePhone(
      '9876543210'
    );

    await billPayPage.enterPayeeAccountNumber(
      '123456789'
    );

    await billPayPage.enterVerifyAccount(
      '123456789'
    );

    await billPayPage.enterAmount(
      '100'
    );

    await expect(
      billPayPage.payeeNameInput
    ).toHaveValue('rter');

    await expect(
      billPayPage.payeeStreetInput
    ).toHaveValue('123 Test Street');

    await expect(
      billPayPage.payeeCityInput
    ).toHaveValue('Kolkata');

    await expect(
      billPayPage.payeeStateInput
    ).toHaveValue('West Bengal');

    await expect(
      billPayPage.payeeZipCodeInput
    ).toHaveValue('700001');

    await expect(
      billPayPage.payeePhoneInput
    ).toHaveValue('9876543210');

    await expect(
      billPayPage.payeeAccountNumberInput
    ).toHaveValue('123456789');

    await expect(
      billPayPage.verifyAccountInput
    ).toHaveValue('123456789');

    await expect(
      billPayPage.amountInput
    ).toHaveValue('100');
  });
});