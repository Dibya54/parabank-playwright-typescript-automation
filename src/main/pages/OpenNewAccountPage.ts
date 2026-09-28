import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OpenNewAccountPage extends BasePage {

  readonly accountTypeDropdown: Locator;
  readonly fromAccountDropdown: Locator;
  readonly openAccountButton: Locator;
  readonly accountOpenedMessage: Locator;
  readonly newAccountId: Locator;

  constructor(page: Page) {
    super(page);

    this.accountTypeDropdown = page.locator(
      '#type'
    );

    this.fromAccountDropdown = page.locator(
      '#fromAccountId'
    );

    this.openAccountButton = page.locator(
      'input[type="button"]'
    );

    this.accountOpenedMessage = page.getByText(
      'Account Opened!',
      {
        exact: true
      }
    );

    // The newly generated account number is a link.
    this.newAccountId = page.locator(
      '#newAccountId'
    );
  }

  async selectAccountType(
    accountType: 'CHECKING' | 'SAVINGS'
  ): Promise<void> {

    await this.accountTypeDropdown.selectOption({
      label: accountType
    });
  }

  async selectFromAccount(
    accountNumber: string
  ): Promise<void> {

    await this.fromAccountDropdown.selectOption({
      label: accountNumber
    });
  }

  async clickOpenAccount(): Promise<void> {

    await this.openAccountButton.click();
  }

  async isAccountOpened(): Promise<boolean> {

    return await this.accountOpenedMessage.isVisible();
  }

  async getNewAccountNumber(): Promise<string> {

    await this.newAccountId.waitFor({
      state: 'visible',
      timeout: 30000
    });

    return (
      await this.newAccountId.innerText()
    ).trim();
  }

  async clickNewAccount(): Promise<void> {

    await this.newAccountId.click();
  }

  async openAccount(
    accountType: 'CHECKING' | 'SAVINGS',
    fromAccount: string
  ): Promise<string> {

    await this.selectAccountType(
      accountType
    );

    await this.selectFromAccount(
      fromAccount
    );

    await this.clickOpenAccount();

    await this.accountOpenedMessage.waitFor({
      state: 'visible',
      timeout: 30000
    });

    return await this.getNewAccountNumber();
  }
}