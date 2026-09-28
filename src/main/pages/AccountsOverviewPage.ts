import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountsOverviewPage extends BasePage {

  readonly accountsOverviewHeading: Locator;
  readonly accountTable: Locator;
  readonly accountLinks: Locator;
  readonly totalText: Locator;
  readonly balanceNote: Locator;

  constructor(page: Page) {
    super(page);

    this.accountsOverviewHeading = page.getByRole(
      'heading',
      {
        name: /Accounts Overview/i
      }
    );

    this.accountTable = page.locator(
      '#accountTable'
    );

    this.accountLinks = page.locator(
      '#accountTable tbody tr td:first-child a'
    );

    this.totalText = page.getByText(
      'Total',
      {
        exact: true
      }
    );

    this.balanceNote = page.getByText(
      '*Balance includes deposits that may be subject to holds',
      {
        exact: true
      }
    );
  }

  async isAccountsOverviewDisplayed(): Promise<boolean> {
    return await this.accountsOverviewHeading.isVisible();
  }

  async waitForAccountsToLoad(): Promise<void> {
    await this.accountLinks.first().waitFor({
      state: 'visible',
      timeout: 30000
    });
  }

  async getAccountCount(): Promise<number> {
    return await this.accountLinks.count();
  }

  async getFirstAccountNumber(): Promise<string> {
    await this.waitForAccountsToLoad();

    return (
      await this.accountLinks.first().innerText()
    ).trim();
  }
}