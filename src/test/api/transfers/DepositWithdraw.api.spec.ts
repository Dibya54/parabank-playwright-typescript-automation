import { test, expect } from '@playwright/test';

import Endpoints from '../../../main/constants/Endpoints';

test.describe('ParaBank - Deposit and Withdraw API', () => {

  test('should successfully withdraw funds from a valid account', async ({
    request
  }) => {

    const accountId = '12345';
    const amount = '10';

    const response = await request.post(
      `${Endpoints.BANK}${Endpoints.WITHDRAW}`,
      {
        params: {
          accountId,
          amount
        },

        headers: {
          Accept: 'application/xml'
        }
      }
    );

    console.log(
      'Status:',
      response.status()
    );

    const responseBody =
      await response.text();

    console.log(
      'Withdraw response:',
      responseBody
    );

    // Validate successful HTTP response
    expect(response.status()).toBe(200);

    // Validate actual ParaBank response
    expect(responseBody).toBe(
      `Successfully withdrew $${amount} from account #${accountId}`
    );
  });


  test('should reject withdrawal from a non-existing account', async ({
    request
  }) => {

    const accountId = '999999';
    const amount = '10';

    const response = await request.post(
      `${Endpoints.BANK}${Endpoints.WITHDRAW}`,
      {
        params: {
          accountId,
          amount
        },

        headers: {
          Accept: 'application/xml'
        }
      }
    );

    console.log(
      'Status:',
      response.status()
    );

    const responseBody =
      await response.text();

    console.log(
      'Withdraw error:',
      responseBody
    );

    // Invalid account should not return success
    expect(response.ok()).toBeFalsy();

    // Validate that the error identifies the account
    expect(responseBody).toContain(
      accountId
    );
  });


  test('should successfully deposit funds into a valid account', async ({
    request
  }) => {

    const accountId = '12345';
    const amount = '10';

    const response = await request.post(
      `${Endpoints.BANK}${Endpoints.DEPOSIT}`,
      {
        params: {
          accountId,
          amount
        },

        headers: {
          Accept: 'application/xml'
        }
      }
    );

    console.log(
      'Status:',
      response.status()
    );

    const responseBody =
      await response.text();

    console.log(
      'Deposit response:',
      responseBody
    );

    // We will make the exact status assertion
    // after observing the actual API response.
  expect(response.status()).toBe(200);

expect(responseBody).toBe(
  `Successfully deposited $${amount} to account #${accountId}`
);
  });


  test('should reject deposit into a non-existing account', async ({
    request
  }) => {

    const accountId = '999999';
    const amount = '10';

    const response = await request.post(
      `${Endpoints.BANK}${Endpoints.DEPOSIT}`,
      {
        params: {
          accountId,
          amount
        },

        headers: {
          Accept: 'application/xml'
        }
      }
    );

    console.log(
      'Status:',
      response.status()
    );

    const responseBody =
      await response.text();

    console.log(
      'Deposit error:',
      responseBody
    );

expect(response.status()).toBe(400);

expect(responseBody).toBe(
  `Could not find account number ${accountId}`
);
  });

});