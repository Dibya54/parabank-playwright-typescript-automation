import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RequestLoanPage extends BasePage {

  readonly amountInput: Locator;
  readonly downPaymentInput: Locator;
  readonly fromAccountDropdown: Locator;
  readonly applyButton: Locator;

  readonly loanRequestProcessedHeading: Locator;
  readonly loanProvider: Locator;
  readonly loanDate: Locator;
  readonly loanStatus: Locator;
  readonly approvalMessage: Locator;
  readonly newAccountLink: Locator;

  constructor(page: Page) {
    super(page);

    // Loan request fields
    this.amountInput = page.locator('#amount');

    this.downPaymentInput = page.locator(
      '#downPayment'
    );

    this.fromAccountDropdown = page.getByRole(
      'combobox'
    );

    this.applyButton = page.locator(
      'input.button'
    );

    // Loan result
    this.loanRequestProcessedHeading =
      page.getByText(
        'Loan Request Processed',
        {
          exact: true
        }
      );

    this.loanProvider = page.getByText(
      'Wealth Securities Dynamic Loans (WSDL)',
      {
        exact: true
      }
    );

    // Date is dynamic, so do not hardcode today's date.
    this.loanDate = page
      .locator('tr')
      .filter({
        hasText: 'Date:'
      })
      .locator('td')
      .last();

    this.loanStatus = page.getByText(
      'Approved',
      {
        exact: true
      }
    );

    this.approvalMessage = page.getByText(
      'Congratulations, your loan has been approved.',
      {
        exact: true
      }
    );

    // Account number is dynamic.
    // ParaBank creates a different account number
    // for every approved loan.
    this.newAccountLink = page.getByRole(
      'link',
      {
        name: /^\d+$/
      }
    );
  }

  async enterAmount(
    amount: string
  ): Promise<void> {
    await this.amountInput.fill(amount);
  }

  async enterDownPayment(
    downPayment: string
  ): Promise<void> {
    await this.downPaymentInput.fill(
      downPayment
    );
  }

  async selectFromAccount(
    accountNumber: string
  ): Promise<void> {
    await this.fromAccountDropdown.selectOption({
      label: accountNumber
    });
  }

  async clickApply(): Promise<void> {
    await this.applyButton.click();
  }

  async requestLoan(
    amount: string,
    downPayment: string,
    fromAccount: string
  ): Promise<void> {

    await this.enterAmount(amount);

    await this.enterDownPayment(
      downPayment
    );

    await this.selectFromAccount(
      fromAccount
    );

    await this.clickApply();

    await this.loanRequestProcessedHeading.waitFor({
      state: 'visible',
      timeout: 30000
    });
  }

  async getNewAccountNumber(): Promise<string> {

    await this.newAccountLink.waitFor({
      state: 'visible',
      timeout: 30000
    });

    return (
      await this.newAccountLink.innerText()
    ).trim();
  }

  async getLoanDate(): Promise<string> {

    await this.loanDate.waitFor({
      state: 'visible',
      timeout: 30000
    });

    return (
      await this.loanDate.innerText()
    ).trim();
  }
}