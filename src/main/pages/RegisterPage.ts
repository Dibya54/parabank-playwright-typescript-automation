import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {

  // ---------------------------------------------------------
  // Locators
  // ---------------------------------------------------------

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly usernameExistsMessage: Locator;

  constructor(page: Page) {
    super(page);

  this.firstNameInput = page.locator(
  '#customer\\.firstName'
);

    this.lastNameInput = page.locator(
      'input[name="customer.lastName"]'
    );

    this.addressInput = page.locator(
      "//input[@id='customer.address.street']"
    );

    this.cityInput = page.locator(
      'input[name="customer.address.city"]'
    );

    this.stateInput = page.locator(
      'input[name="customer.address.state"]'
    );

    this.zipCodeInput = page.locator(
      'input[name="customer.address.zipCode"]'
    );

    this.phoneInput = page.locator(
      'input[name="customer.phoneNumber"]'
    );

    this.ssnInput = page.locator(
      'input[name="customer.ssn"]'
    );

    this.usernameInput = page.locator(
      "//input[@id='customer.username']"
    );

    this.passwordInput = page.locator(
      'input[name="customer.password"]'
    );

    this.confirmPasswordInput = page.locator(
      "//input[@id='repeatedPassword']"
    );

    this.registerButton = page.locator(
      "//input[@value='Register']"
    );

    this.usernameExistsMessage = page.getByText(
      'This username already exists.',
      { exact: true }
    );
  }


  // ---------------------------------------------------------
  // Actions
  // ---------------------------------------------------------

  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async enterAddress(address: string): Promise<void> {
    await this.addressInput.fill(address);
  }

  async enterCity(city: string): Promise<void> {
    await this.cityInput.fill(city);
  }

  async enterState(state: string): Promise<void> {
    await this.stateInput.fill(state);
  }

  async enterZipCode(zipCode: string): Promise<void> {
    await this.zipCodeInput.fill(zipCode);
  }

  async enterPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  async enterSSN(ssn: string): Promise<void> {
    await this.ssnInput.fill(ssn);
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async enterConfirmPassword(
    confirmPassword: string
  ): Promise<void> {
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async clickRegister(): Promise<void> {
    await this.registerButton.click();
  }


  // ---------------------------------------------------------
  // Validations
  // ---------------------------------------------------------

  async isUsernameAlreadyExists(): Promise<boolean> {
    return await this.usernameExistsMessage.isVisible();
  }

  getErrorMessage(message: string): Locator {
    return this.page.getByText(message, {
      exact: true
    });
  }
}