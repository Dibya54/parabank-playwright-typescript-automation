import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransferFundsPage extends BasePage {

  readonly transferFundsHeading: Locator;
  readonly amountInput: Locator;
  readonly fromAccountDropdown: Locator;
  readonly toAccountDropdown: Locator;
  readonly transferButton: Locator;
  readonly transferCompleteMessage: Locator;
  readonly transferDetailsMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.transferFundsHeading = page.getByRole(
      'heading',
      {
        name: 'Transfer Funds',
        exact: true
      }
    );

    this.amountInput = page.locator(
      '#amount'
    );

    this.fromAccountDropdown = page.locator(
      '#fromAccountId'
    );

    this.toAccountDropdown = page.locator(
  '#toAccountId'
);

    this.transferButton = page.locator(
      'input[type="submit"]'
    );

    this.transferCompleteMessage = page.getByText(
      'Transfer Complete!',
      {
        exact: true
      }
    );

    this.transferDetailsMessage = page.getByText(
      /has been transferred from account #.*to account #/
    );
  }


  // =====================================================
  // ENTER TRANSFER AMOUNT
  // =====================================================

  async enterAmount(
    amount: string
  ): Promise<void> {

    await this.amountInput.fill(amount);
  }


  // =====================================================
  // SELECT FROM ACCOUNT
  // =====================================================

  async selectFromAccount(
    accountNumber: string
  ): Promise<void> {

    await this.fromAccountDropdown.selectOption({
      label: accountNumber
    });
  }


  // =====================================================
  // SELECT TO ACCOUNT
  // =====================================================

  async selectToAccount(
    accountNumber: string
  ): Promise<void> {

    await this.toAccountDropdown.selectOption({
      label: accountNumber
    });
  }


  // =====================================================
  // CLICK TRANSFER
  // =====================================================

  async clickTransfer(): Promise<void> {

    await this.transferButton.click();
  }


  // =====================================================
  // COMPLETE TRANSFER
  // =====================================================

  async transferFunds(
    amount: string,
    fromAccount: string,
    toAccount: string
  ): Promise<void> {

    await this.enterAmount(amount);

    await this.selectFromAccount(
      fromAccount
    );

    await this.selectToAccount(
      toAccount
    );

    await this.clickTransfer();

    await this.transferCompleteMessage.waitFor({
      state: 'visible',
      timeout: 30000
    });
  }


  // =====================================================
  // GET TRANSFER CONFIRMATION
  // =====================================================

  async getTransferConfirmation(): Promise<string> {

    await this.transferDetailsMessage.waitFor({
      state: 'visible',
      timeout: 30000
    });

    return (
      await this.transferDetailsMessage.innerText()
    ).trim();
  }
}