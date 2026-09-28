import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);

    this.registerLink = page.getByRole('link', {
      name: 'Register'
    });
  }

  async clickRegister(): Promise<void> {
    await this.registerLink.click();
  }
}