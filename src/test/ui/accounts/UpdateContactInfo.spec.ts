import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { LoginPage } from '../../../main/pages/LoginPage';
import { UpdateContactInfoPage } from '../../../main/pages/UpdateContactInfoPage';

const credentialsPath = path.join(
  process.cwd(),
  'test-data',
  'json',
  'LoginCredentials.json'
);

if (!fs.existsSync(credentialsPath)) {
  throw new Error(
    `Login credentials file was not found: ${credentialsPath}`
  );
}

const credentials = JSON.parse(
  fs.readFileSync(credentialsPath, 'utf-8')
);

if (!credentials.username || !credentials.password) {
  throw new Error(
    'LoginCredentials.json must contain username and password.'
  );
}

test.describe('ParaBank - Update Contact Information UI', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto(
      'https://parabank.parasoft.com/parabank/index.htm',
      {
        waitUntil: 'domcontentloaded'
      }
    );

    const loginPage = new LoginPage(page);

    await loginPage.login(
      credentials.username,
      credentials.password
    );

    await expect(
      page.getByRole('heading', {
        name: /Accounts Overview/i
      }).first()
    ).toBeVisible({
      timeout: 30000
    });
  });

  test('Update Contact Info page should display all fields', async ({
    page
  }) => {

    await page.getByRole('link', {
      name: 'Update Contact Info'
    }).click();

    const updateContactInfoPage =
      new UpdateContactInfoPage(page);

    await expect(
      updateContactInfoPage.firstNameInput
    ).toBeVisible();

    await expect(
      updateContactInfoPage.lastNameInput
    ).toBeVisible();

    await expect(
      updateContactInfoPage.addressInput
    ).toBeVisible();

    await expect(
      updateContactInfoPage.cityInput
    ).toBeVisible();

    await expect(
      updateContactInfoPage.stateInput
    ).toBeVisible();

    await expect(
      updateContactInfoPage.zipCodeInput
    ).toBeVisible();

    await expect(
      updateContactInfoPage.phoneInput
    ).toBeVisible();

    await expect(
      updateContactInfoPage.updateProfileButton
    ).toBeVisible();
  });

  test('User should be able to update contact information', async ({
    page
  }) => {

    await page.getByRole('link', {
      name: 'Update Contact Info'
    }).click();

    const updateContactInfoPage =
      new UpdateContactInfoPage(page);

    await updateContactInfoPage.updateContactInformation(
      'Test',
      'User',
      '456 Updated Street',
      'Kolkata',
      'West Bengal',
      '700002',
      '9876543211'
    );

    await expect(
      updateContactInfoPage.profileUpdatedHeading
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      updateContactInfoPage.profileUpdatedMessage
    ).toBeVisible({
      timeout: 30000
    });

    const message =
      await updateContactInfoPage.getProfileUpdatedMessage();

    expect(message).toBe(
      'Your updated address and phone number have been added to the system.'
    );
  });
});