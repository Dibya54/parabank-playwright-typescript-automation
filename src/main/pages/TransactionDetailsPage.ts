import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransactionDetailsPage extends BasePage {

  readonly transactionIdLabel: Locator;
  readonly transactionId: Locator;

  readonly dateLabel: Locator;
  readonly date: Locator;

  readonly descriptionLabel: Locator;
  readonly description: Locator;

  readonly typeLabel: Locator;
  readonly type: Locator;

  readonly amountLabel: Locator;
  readonly amount: Locator;

  constructor(page: Page) {
    super(page);

    // Transaction ID
    this.transactionIdLabel = page.getByText(
      'Transaction ID:',
      {
        exact: true
      }
    );

    this.transactionId = page.locator(
      'tr:has-text("Transaction ID:") td'
    ).last();

    // Date
    this.dateLabel = page.getByText(
      'Date:',
      {
        exact: true
      }
    );

    this.date = page.locator(
      'tr:has-text("Date:") td'
    ).last();

    // Description
    this.descriptionLabel = page.getByText(
      'Description:',
      {
        exact: true
      }
    );

    this.description = page.locator(
      'tr:has-text("Description:") td'
    ).last();

    // Type
    this.typeLabel = page.getByText(
      'Type:',
      {
        exact: true
      }
    );

    this.type = page.locator(
      'tr:has-text("Type:") td'
    ).last();

    // Amount
    this.amountLabel = page.getByText(
      'Amount:',
      {
        exact: true
      }
    );

    this.amount = page.locator(
      'tr:has-text("Amount:") td'
    ).last();
  }


  // =====================================================
  // GET TRANSACTION ID
  // =====================================================

  async getTransactionId(): Promise<string> {

    await this.transactionId.waitFor({
      state: 'visible',
      timeout: 30000
    });

    return (
      await this.transactionId.innerText()
    ).trim();
  }


  // =====================================================
  // GET TRANSACTION DATE
  // =====================================================

  async getTransactionDate(): Promise<string> {

    await this.date.waitFor({
      state: 'visible',
      timeout: 30000
    });

    return (
      await this.date.innerText()
    ).trim();
  }


  // =====================================================
  // GET DESCRIPTION
  // =====================================================

  async getDescription(): Promise<string> {

    return (
      await this.description.innerText()
    ).trim();
  }


  // =====================================================
  // GET TRANSACTION TYPE
  // =====================================================

  async getTransactionType(): Promise<string> {

    return (
      await this.type.innerText()
    ).trim();
  }


  // =====================================================
  // GET AMOUNT
  // =====================================================

  async getAmount(): Promise<string> {

    return (
      await this.amount.innerText()
    ).trim();
  }


  // =====================================================
  // GET COMPLETE TRANSACTION DETAILS
  // =====================================================

  async getTransactionDetails(): Promise<{
    transactionId: string;
    date: string;
    description: string;
    type: string;
    amount: string;
  }> {

    return {
      transactionId: await this.getTransactionId(),
      date: await this.getTransactionDate(),
      description: await this.getDescription(),
      type: await this.getTransactionType(),
      amount: await this.getAmount()
    };
  }
}