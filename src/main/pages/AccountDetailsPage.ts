import {
  expect,
  Locator,
  Page
} from '@playwright/test';

import { BasePage } from './BasePage';

export class AccountDetailsPage extends BasePage {

  readonly accountDetailsHeading: Locator;
  readonly accountNumber: Locator;
  readonly accountType: Locator;
  readonly balance: Locator;
  readonly availableBalance: Locator;

  readonly accountActivityHeading: Locator;
  readonly activityPeriodDropdown: Locator;
  readonly transactionTypeDropdown: Locator;
  readonly fundsTransferReceivedLink: Locator;

  constructor(page: Page) {
    super(page);

    // ============================================
    // Account Details
    // ============================================

    this.accountDetailsHeading = page.getByRole(
      'heading',
      {
        name: 'Account Details',
        exact: true
      }
    );

    // ParaBank populates this value dynamically
    // after the Account Details page loads.
    this.accountNumber = page.locator(
      '#accountId'
    );

    this.accountType = page.locator(
      'tr:has-text("Account Type:") td'
    ).last();

    this.balance = page.locator(
      'tr:has-text("Balance:") td'
    ).last();

    this.availableBalance = page.locator(
      'tr:has-text("Available:") td'
    ).last();

    // ============================================
    // Account Activity
    // ============================================

    this.accountActivityHeading = page.getByRole(
      'heading',
      {
        name: 'Account Activity',
        exact: true
      }
    );

    this.activityPeriodDropdown = page.locator(
      '//tr[td[contains(., "Activity Period:")]]//select'
    );

    this.transactionTypeDropdown = page.locator(
      '//tr[td[contains(., "Type:")]]//select'
    );

    this.fundsTransferReceivedLink = page.getByRole(
      'link',
      {
        name: 'Funds Transfer Received'
      }
    );
  }

  // ============================================
  // Account Details Methods
  // ============================================

  async getAccountNumber(): Promise<string> {

    await this.accountNumber.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await expect(
      this.accountNumber
    ).not.toHaveText('');

    return (
      await this.accountNumber.innerText()
    ).trim();
  }

  async getAccountType(): Promise<string> {

    return (
      await this.accountType.innerText()
    ).trim();
  }

  async getBalance(): Promise<string> {

    return (
      await this.balance.innerText()
    ).trim();
  }

  async getAvailableBalance(): Promise<string> {

    return (
      await this.availableBalance.innerText()
    ).trim();
  }

  // ============================================
  // Transaction Methods
  // ============================================

  async clickFundsTransferReceived(): Promise<void> {

    await this.fundsTransferReceivedLink.click();
  }
}