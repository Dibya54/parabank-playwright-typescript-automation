import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator(
      '[name="username"]'
    );

    this.passwordInput = page.locator(
      '[name="password"]'
    );

    this.loginButton = page.locator(
      'input[type="submit"][value="Log In"]'
    );

    this.errorMessage = page.getByText(
      'The username and password could not be verified.',
      {
        exact: true
      }
    );
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

async clickLogin(): Promise<void> {
  await this.loginButton.click();

  await this.page.waitForLoadState('domcontentloaded');

  console.log('After login URL:', this.page.url());
  console.log(
    'After login title:',
    await this.page.title()
  );
}

  async login(
    username: string,
    password: string
  ): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async isLoginErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}