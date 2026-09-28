import { test, expect } from '@playwright/test';

import Endpoints from '../../../main/constants/Endpoints';

test.describe('ParaBank - Transfer Funds API', () => {

  test('should successfully transfer funds between two valid accounts', async ({
    request
  }) => {

    const fromAccountId = '54321';
    const toAccountId = '12456';
    const amount = '10';

    const response = await request.post(
      `${Endpoints.BANK}${Endpoints.TRANSFER}`,
      {
        params: {
          fromAccountId,
          toAccountId,
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
      'Transfer response:',
      responseBody
    );

    // We are intentionally not hardcoding the
    // success status until we observe the real API response.
    expect(response.status()).toBe(200);

    expect(responseBody).toBe(
  `Successfully transferred $${amount} from account #${fromAccountId} to account #${toAccountId}`
);
  });


  test('should reject transfer when an account does not exist', async ({
    request
  }) => {

    const fromAccountId = '999999';
    const toAccountId = '12456';
    const amount = '10';

    const response = await request.post(
      `${Endpoints.BANK}${Endpoints.TRANSFER}`,
      {
        params: {
          fromAccountId,
          toAccountId,
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
      'Transfer error:',
      responseBody
    );

    // Invalid account should not produce
    // a successful response.
    expect(response.status()).toBe(400);


  expect(responseBody).toContain(
  `Could not find account number ${fromAccountId} and/or ${toAccountId}`
);
  });

});