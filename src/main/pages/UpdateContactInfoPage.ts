import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class UpdateContactInfoPage extends BasePage {

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly updateProfileButton: Locator;

  readonly profileUpdatedHeading: Locator;
  readonly profileUpdatedMessage: Locator;

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
      "input[id='customer.address.city']"
    );

    this.stateInput = page.locator(
      '[name="customer.address.state"]'
    );

    this.zipCodeInput = page.locator(
      "//tr[td[contains(., 'Zip Code:')]]//td"
    );

    this.phoneInput = page.locator(
      '#customer\\.phoneNumber\\:visible'
    );

    this.updateProfileButton = page.getByRole(
      'button'
    );

    this.profileUpdatedHeading = page.getByText(
      'Profile Updated',
      {
        exact: true
      }
    );

    this.profileUpdatedMessage = page.getByText(
      'Your updated address and phone number have been added to the system.',
      {
        exact: true
      }
    );
  }

  async enterFirstName(
    firstName: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async enterLastName(
    lastName: string
  ): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async enterAddress(
    address: string
  ): Promise<void> {
    await this.addressInput.fill(address);
  }

  async enterCity(
    city: string
  ): Promise<void> {
    await this.cityInput.fill(city);
  }

  async enterState(
    state: string
  ): Promise<void> {
    await this.stateInput.fill(state);
  }

  async enterZipCode(
    zipCode: string
  ): Promise<void> {
    await this.zipCodeInput.fill(zipCode);
  }

  async enterPhone(
    phone: string
  ): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  async clickUpdateProfile(): Promise<void> {
    await this.updateProfileButton.click();
  }

  async updateContactInformation(
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    phone: string
  ): Promise<void> {

    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterAddress(address);
    await this.enterCity(city);
    await this.enterState(state);
    await this.enterZipCode(zipCode);
    await this.enterPhone(phone);

    await this.clickUpdateProfile();

    await this.profileUpdatedHeading.waitFor({
      state: 'visible',
      timeout: 30000
    });
  }

  async getProfileUpdatedMessage(): Promise<string> {
    await this.profileUpdatedMessage.waitFor({
      state: 'visible',
      timeout: 30000
    });

    return (
      await this.profileUpdatedMessage.innerText()
    ).trim();
  }
}