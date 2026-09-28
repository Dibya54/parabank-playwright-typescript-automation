import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountActivityPage extends BasePage {

  readonly dateColumn: Locator;
  readonly transactionColumn: Locator;
  readonly debitColumn: Locator;
  readonly creditColumn: Locator;

  readonly fundsTransferSentLink: Locator;
  readonly fundsTransferReceivedLink: Locator;

  constructor(page: Page) {
    super(page);

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

    this.fundsTransferSentLink = page.getByRole(
      'link',
      {
        name: 'Funds Transfer Sent',
        exact: true
      }
    );

    this.fundsTransferReceivedLink = page.getByRole(
      'link',
      {
        name: 'Funds Transfer Received',
        exact: true
      }
    );
  }


  // =====================================================
  // VERIFY ACTIVITY TABLE
  // =====================================================

  async isActivityTableDisplayed(): Promise<boolean> {

    return (
      await this.dateColumn.isVisible() &&
      await this.transactionColumn.isVisible() &&
      await this.debitColumn.isVisible() &&
      await this.creditColumn.isVisible()
    );
  }


  // =====================================================
  // GET EXISTING SENT TRANSACTION LINKS
  // =====================================================

  async getTransferSentHrefs(): Promise<string[]> {

    return await this.fundsTransferSentLink.evaluateAll(
      links =>
        links.map(
          link => link.getAttribute('href') || ''
        )
    );
  }


  // =====================================================
  // GET EXISTING RECEIVED TRANSACTION LINKS
  // =====================================================

  async getTransferReceivedHrefs(): Promise<string[]> {

    return await this.fundsTransferReceivedLink.evaluateAll(
      links =>
        links.map(
          link => link.getAttribute('href') || ''
        )
    );
  }


  // =====================================================
  // WAIT FOR NEW SENT TRANSACTION
  // =====================================================

  async waitForNewTransferSent(
    existingHrefs: string[]
  ): Promise<Locator> {

    for (let attempt = 0; attempt < 30; attempt++) {

      const currentHrefs =
        await this.getTransferSentHrefs();

      const newHref =
        currentHrefs.find(
          href =>
            href !== '' &&
            !existingHrefs.includes(href)
        );

      if (newHref) {

        return this.page.locator(
          `a[href="${newHref}"]`
        );
      }

      await this.page.waitForTimeout(1000);
    }

    throw new Error(
      'A new Funds Transfer Sent transaction was not found.'
    );
  }


  // =====================================================
  // WAIT FOR NEW RECEIVED TRANSACTION
  // =====================================================

  async waitForNewTransferReceived(
    existingHrefs: string[]
  ): Promise<Locator> {

    for (let attempt = 0; attempt < 30; attempt++) {

      const currentHrefs =
        await this.getTransferReceivedHrefs();

      const newHref =
        currentHrefs.find(
          href =>
            href !== '' &&
            !existingHrefs.includes(href)
        );

      if (newHref) {

        return this.page.locator(
          `a[href="${newHref}"]`
        );
      }

      await this.page.waitForTimeout(1000);
    }

    throw new Error(
      'A new Funds Transfer Received transaction was not found.'
    );
  }


  // =====================================================
  // GET TRANSACTION ROW
  // =====================================================

  getTransactionRow(
    transactionHref: string
  ): Locator {

    return this.page.locator(
      `tr:has(a[href="${transactionHref}"])`
    );
  }


  // =====================================================
  // GET AMOUNT FROM TRANSACTION ROW
  // =====================================================

  getAmountFromTransactionRow(
    transactionHref: string,
    amount: string
  ): Locator {

    return this.getTransactionRow(
      transactionHref
    ).getByText(
      amount,
      {
        exact: true
      }
    );
  }


  // =====================================================
  // GET DATE FROM TRANSACTION ROW
  // =====================================================

  getDateFromTransactionRow(
    transactionHref: string
  ): Locator {

    return this.getTransactionRow(
      transactionHref
    ).locator('td').first();
  }


  // =====================================================
  // OPEN TRANSACTION
  // =====================================================

  async openTransaction(
    transactionHref: string
  ): Promise<void> {

    await this.page.locator(
      `a[href="${transactionHref}"]`
    ).click();
  }
}