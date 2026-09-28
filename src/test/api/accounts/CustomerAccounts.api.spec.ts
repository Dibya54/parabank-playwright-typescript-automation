import { test, expect } from '@playwright/test';
import { parseStringPromise } from 'xml2js';

import { CustomerApi } from '../../../main/api/CustomerApi';

test.describe('ParaBank - Customer Accounts API', () => {

  test('should return and validate all accounts for a valid customer', async ({ request }) => {

    const customerId = '12212';

    const customerApi = new CustomerApi(request);

    const response = await customerApi.getCustomerAccounts(customerId);

    console.log('Status:', response.status());

    expect(response.status()).toBe(200);

    const responseBody = await response.text();

    console.log('Response:', responseBody);

    const parsedResponse = await parseStringPromise(responseBody);

    expect(parsedResponse.accounts).toBeDefined();

    const accounts = parsedResponse.accounts.account;

    expect(accounts).toBeDefined();
    expect(accounts.length).toBeGreaterThan(0);

    console.log('Total accounts:', accounts.length);

    for (const account of accounts) {

      const accountId = account.id[0];
      const returnedCustomerId = account.customerId[0];
      const accountType = account.type[0];
      const balance = account.balance[0];

      console.log(
        `Account ID: ${accountId} | ` +
        `Customer ID: ${returnedCustomerId} | ` +
        `Type: ${accountType} | ` +
        `Balance: ${balance}`
      );

      expect(returnedCustomerId).toBe(customerId);
      expect(accountId).toMatch(/^\d+$/);
      expect(['CHECKING', 'SAVINGS', 'LOAN']).toContain(accountType);
      expect(balance).toMatch(/^-?\d+(\.\d{2})?$/);
    }
  });


  test('should return an error for an invalid customer ID', async ({ request }) => {

    const invalidCustomerId = '999999';

    const customerApi = new CustomerApi(request);

    const response = await customerApi.getCustomerAccounts(invalidCustomerId);

    console.log('Status:', response.status());

    const responseBody = await response.text();

    console.log('Error response:', responseBody);

    expect(response.status()).toBe(400);

    expect(responseBody).toContain(
      `Could not find customer #${invalidCustomerId}`
    );
  });

});