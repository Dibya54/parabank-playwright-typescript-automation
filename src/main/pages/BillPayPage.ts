import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BillPayPage extends BasePage {

  readonly payeeNameInput: Locator;
  readonly payeeStreetInput: Locator;
  readonly payeeCityInput: Locator;
  readonly payeeStateInput: Locator;
  readonly payeeZipCodeInput: Locator;
  readonly payeePhoneInput: Locator;
  readonly payeeAccountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountDropdown: Locator;
  readonly sendPaymentButton: Locator;

  readonly billPaymentCompleteMessage: Locator;
  readonly billPaymentDetailsMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.payeeNameInput = page.locator(
      '[name="payee.name"]'
    );

    this.payeeStreetInput = page.locator(
      '[name="payee.address.street"]'
    );

    this.payeeCityInput = page.locator(
      '[name="payee.address.city"]'
    );

    this.payeeStateInput = page.locator(
      '[name="payee.address.state"]'
    );

    // Based on the locator you provided:
    this.payeeZipCodeInput = page
      .locator('tr')
      .locator('td')
      .nth(1);

    this.payeePhoneInput = page.locator(
      '[name="payee.phoneNumber"]'
    );

    this.payeeAccountNumberInput = page.locator(
      '[name="payee.accountNumber"]'
    );

    this.verifyAccountInput = page.locator(
      '[name="verifyAccount"]'
    );

    this.amountInput = page.locator(
      '[name="amount"]'
    );

    this.fromAccountDropdown = page.getByRole(
      'combobox'
    );

    this.sendPaymentButton = page.locator(
      'input.button'
    );

    this.billPaymentCompleteMessage = page.getByText(
      'Bill Payment Complete',
      {
        exact: true
      }
    );

    this.billPaymentDetailsMessage = page.getByText(
      /Bill Payment to .* in the amount of .* from account .* was successful\./
    );
  }

  async enterPayeeName(
    name: string
  ): Promise<void> {
    await this.payeeNameInput.fill(name);
  }

  async enterPayeeStreet(
    street: string
  ): Promise<void> {
    await this.payeeStreetInput.fill(street);
  }

  async enterPayeeCity(
    city: string
  ): Promise<void> {
    await this.payeeCityInput.fill(city);
  }

  async enterPayeeState(
    state: string
  ): Promise<void> {
    await this.payeeStateInput.fill(state);
  }

  async enterPayeeZipCode(
    zipCode: string
  ): Promise<void> {
    await this.payeeZipCodeInput.fill(zipCode);
  }

  async enterPayeePhone(
    phone: string
  ): Promise<void> {
    await this.payeePhoneInput.fill(phone);
  }

  async enterPayeeAccountNumber(
    accountNumber: string
  ): Promise<void> {
    await this.payeeAccountNumberInput.fill(
      accountNumber
    );
  }

  async enterVerifyAccount(
    accountNumber: string
  ): Promise<void> {
    await this.verifyAccountInput.fill(
      accountNumber
    );
  }

  async enterAmount(
    amount: string
  ): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async selectFromAccount(
    accountNumber: string
  ): Promise<void> {
    await this.fromAccountDropdown.selectOption({
      label: accountNumber
    });
  }

  async clickSendPayment(): Promise<void> {
    await this.sendPaymentButton.click();
  }

  async payBill(
    payeeName: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string,
    accountNumber: string,
    amount: string,
    fromAccount: string
  ): Promise<void> {

    await this.enterPayeeName(payeeName);
    await this.enterPayeeStreet(street);
    await this.enterPayeeCity(city);
    await this.enterPayeeState(state);
    await this.enterPayeeZipCode(zipCode);
    await this.enterPayeePhone(phone);

    await this.enterPayeeAccountNumber(
      accountNumber
    );

    await this.enterVerifyAccount(
      accountNumber
    );

    await this.enterAmount(amount);

    await this.selectFromAccount(
      fromAccount
    );

    await this.clickSendPayment();

    await this.billPaymentCompleteMessage.waitFor({
      state: 'visible',
      timeout: 30000
    });
  }

  async getBillPaymentConfirmation(): Promise<string> {
    await this.billPaymentDetailsMessage.waitFor({
      state: 'visible',
      timeout: 30000
    });

    return (
      await this.billPaymentDetailsMessage.innerText()
    ).trim();
  }
}