import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({

  // Location where all test files are present
  testDir: './src',

  // Run test files in parallel
  fullyParallel: true,

  // Prevent test.only from reaching CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests only in CI
  retries: process.env.CI ? 2 : 0,

  // Number of workers
  workers: process.env.CI ? 1 : undefined,

  // Test reports
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  // Common settings for all browsers
  use: {

    // ParaBank application URL
    baseURL: process.env.BASE_URL,

    // Run browser in headless mode by default
    headless: true,

    // Take screenshot only when a test fails
    screenshot: 'only-on-failure',

    // Record video only when a test fails
    video: 'retain-on-failure',

    // Save trace only when a test fails
    trace: 'retain-on-failure',

    // Default action timeout
    actionTimeout: 15000,

    // Default navigation timeout
    navigationTimeout: 30000
  },

  // Browsers
  projects: [

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    }

  ]

});