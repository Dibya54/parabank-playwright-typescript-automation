import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class FindTransactionsPage extends BasePage {

  readonly accountDropdown: Locator;

  readonly transactionIdInput: Locator;
  readonly findByIdButton: Locator;

  readonly transactionDateInput: Locator;
  readonly findByDateButton: Locator;

  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly findByDateRangeButton: Locator;

  readonly amountInput: Locator;
  readonly findByAmountButton: Locator;

  readonly transactionResultsHeading: Locator;
  readonly dateColumn: Locator;
  readonly transactionColumn: Locator;
  readonly debitColumn: Locator;
  readonly creditColumn: Locator;

  constructor(page: Page) {
    super(page);

    this.accountDropdown = page.getByRole('combobox');

    this.transactionIdInput = page.locator(
      '#transactionId'
    );

    this.findByIdButton = page.locator(
      '#findById'
    );

    this.transactionDateInput = page.locator(
      '#transactionDate'
    );

    this.findByDateButton = page.locator(
      '#findByDate\\:visible'
    );

    this.fromDateInput = page.locator(
      '#fromDate'
    );

    this.toDateInput = page.locator(
      '#toDate'
    );

    this.findByDateRangeButton = page.locator(
      '#findByDateRange'
    );

    this.amountInput = page.locator(
      '#amount'
    );

    this.findByAmountButton = page.locator(
      '#findByAmount'
    );

    this.transactionResultsHeading = page.getByText(
      'Transaction Results',
      {
        exact: true
      }
    );

    this.dateColumn = page.getByRole(
      'columnheader',
      {
        name: 'Date',
        exact: true
      }
    );

    this.transactionColumn = page.getByRole(
      'columnheader',
      {
        name: 'Transaction',
        exact: true
      }
    );

    this.debitColumn = page.getByRole(
      'columnheader',
      {
        name: 'Debit (-)',
        exact: true
      }
    );

    this.creditColumn = page.getByRole(
      'columnheader',
      {
        name: 'Credit (+)',
        exact: true
      }
    );
  }

  async selectAccount(
    accountNumber: string
  ): Promise<void> {
    await this.accountDropdown.selectOption({
      label: accountNumber
    });
  }

  async findByTransactionId(
    transactionId: string
  ): Promise<void> {
    await this.transactionIdInput.fill(
      transactionId
    );

    await this.findByIdButton.click();
  }

  async findByDate(
    date: string
  ): Promise<void> {
    await this.transactionDateInput.fill(
      date
    );

    await this.findByDateButton.click();
  }

  async findByDateRange(
    fromDate: string,
    toDate: string
  ): Promise<void> {
    await this.fromDateInput.fill(
      fromDate
    );

    await this.toDateInput.fill(
      toDate
    );

    await this.findByDateRangeButton.click();
  }

  async findByAmount(
    amount: string
  ): Promise<void> {
    await this.amountInput.fill(
      amount
    );

    await this.findByAmountButton.click();
  }

  async isTransactionResultsDisplayed(): Promise<boolean> {
    return await this.transactionResultsHeading.isVisible();
  }

  async isTransactionResultsTableDisplayed(): Promise<boolean> {
    return (
      await this.dateColumn.isVisible() &&
      await this.transactionColumn.isVisible() &&
      await this.debitColumn.isVisible() &&
      await this.creditColumn.isVisible()
    );
  }
}