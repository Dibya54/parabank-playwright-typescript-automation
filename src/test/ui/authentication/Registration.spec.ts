import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

import { HomePage } from '../../../main/pages/HomePage';
import { RegisterPage } from '../../../main/pages/RegisterPage';
import { ExcelReader } from '../../../main/utils/ExcelReader';

// =========================================================
// Excel Configuration
// =========================================================

const excelPath = path.join(
  process.cwd(),
  'test-data',
  'excel',
  'RegistrationData.xlsx'
);

const registrationData = ExcelReader.readExcel(
  excelPath,
  'Sheet1'
);

if (registrationData.length === 0) {
  throw new Error(
    'RegistrationData.xlsx does not contain any registration data.'
  );
}

// Use only the first row as registration data
const userData = registrationData[0];

// =========================================================
// Registration Test Suite
// =========================================================

test.describe('ParaBank - User Registration', () => {

  // -------------------------------------------------------
  // Navigate to Registration Page
  // -------------------------------------------------------

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.navigateTo(
      'https://parabank.parasoft.com/parabank/index.htm'
    );

    await homePage.clickRegister();
  });

  // =======================================================
  // Positive Registration Test
  // =======================================================

  test(
    'User should register successfully with Excel data',
    async ({ page, browserName }) => {

      // Registration creates shared test data.
      // Run only once using Chromium.
      test.skip(
        browserName !== 'chromium',
        'Registration creates shared test data only once.'
      );

      const registerPage = new RegisterPage(page);

      // ---------------------------------------------------
      // Generate Unique Username
      // ---------------------------------------------------

      const uniqueUsername =
        `testuser_${randomUUID()
          .replace(/-/g, '')
          .slice(0, 8)}`;

      const password = userData.Password;

      console.log(
        `Generated username: ${uniqueUsername}`
      );

      // ---------------------------------------------------
      // Enter Personal Information
      // ---------------------------------------------------

      await registerPage.enterFirstName(
        userData.FirstName
      );

      await registerPage.enterLastName(
        userData.LastName
      );

      await registerPage.enterAddress(
        userData.Address
      );

      await registerPage.enterCity(
        userData.City
      );

      await registerPage.enterState(
        userData.State
      );

      await registerPage.enterZipCode(
        userData.ZipCode
      );

      await registerPage.enterPhone(
        userData.Phone
      );

      await registerPage.enterSSN(
        userData.SSN
      );

      // ---------------------------------------------------
      // Enter Login Credentials
      // ---------------------------------------------------

      await registerPage.enterUsername(
        uniqueUsername
      );

      await registerPage.enterPassword(
        password
      );

      await registerPage.enterConfirmPassword(
        password
      );

      // ---------------------------------------------------
      // Submit Registration
      // ---------------------------------------------------

      await registerPage.clickRegister();

      // ---------------------------------------------------
      // Validate Duplicate Username
      // ---------------------------------------------------

      const usernameExistsMessage = page.getByText(
        'This username already exists.',
        {
          exact: true
        }
      );

      if (await usernameExistsMessage.isVisible()) {
        throw new Error(
          `Registration failed because username already exists: ${uniqueUsername}`
        );
      }

      // ---------------------------------------------------
      // Validate Successful Registration
      // ---------------------------------------------------

      await expect(
        page.getByText(
          `Welcome ${uniqueUsername}`,
          {
            exact: true
          }
        )
      ).toBeVisible();

      await expect(
        page.getByText(
          'Your account was created successfully. You are now logged in.',
          {
            exact: true
          }
        )
      ).toBeVisible();

      // ===================================================
      // Save Credentials to JSON
      // ===================================================

      const jsonDirectory = path.join(
        process.cwd(),
        'test-data',
        'json'
      );

      const credentialsPath = path.join(
        jsonDirectory,
        'LoginCredentials.json'
      );

      // Create JSON directory if it doesn't exist
      fs.mkdirSync(
        jsonDirectory,
        {
          recursive: true
        }
      );

      const credentials = {
        username: uniqueUsername,
        password: password
      };

      fs.writeFileSync(
        credentialsPath,
        JSON.stringify(
          credentials,
          null,
          2
        ),
        'utf-8'
      );

      console.log(
        `Login credentials saved at: ${credentialsPath}`
      );
    }
  );

  // =======================================================
  // Negative Registration Test
  // =======================================================

  test(
    'Required field validation messages should be displayed',
    async ({ page }) => {

      const registerPage = new RegisterPage(page);

      // ---------------------------------------------------
      // Submit empty registration form
      // ---------------------------------------------------

      await registerPage.clickRegister();

      // ---------------------------------------------------
      // Expected validation messages
      // ---------------------------------------------------

      const requiredErrors = [
        'First name is required.',
        'Last name is required.',
        'Address is required.',
        'City is required.',
        'State is required.',
        'Zip Code is required.',
        'Social Security Number is required.',
        'Username is required.',
        'Password is required.',
        'Password confirmation is required.'
      ];

      // ---------------------------------------------------
      // Validate each error message
      // ---------------------------------------------------

      for (const errorMessage of requiredErrors) {
        await expect(
          registerPage.getErrorMessage(errorMessage)
        ).toBeVisible();
      }
    }
  );
});