import { test, expect } from '@playwright/test';
import { parseStringPromise } from 'xml2js';

import { AccountApi } from '../../../main/api/AccountApi';

test.describe('ParaBank - Account API', () => {

  test('should retrieve and validate account details by account ID', async ({ request }) => {

    const accountApi = new AccountApi(request);

    const accountId = '12345';

    const response = await accountApi.getAccountById(accountId);

    console.log('Account by ID status:', response.status());

    expect(response.status()).toBe(200);

    const responseBody = await response.text();

    console.log('Account by ID response:', responseBody);

    const parsedResponse = await parseStringPromise(responseBody);

    expect(parsedResponse.account).toBeDefined();

    const account = parsedResponse.account;

    const returnedAccountId = account.id[0];
    const customerId = account.customerId[0];
    const accountType = account.type[0];
    const balance = account.balance[0];

    console.log(
      `Account ID: ${returnedAccountId} | ` +
      `Customer ID: ${customerId} | ` +
      `Type: ${accountType} | ` +
      `Balance: ${balance}`
    );

    expect(returnedAccountId).toBe(accountId);

    expect(customerId).toMatch(/^\d+$/);

    expect(['CHECKING', 'SAVINGS', 'LOAN']).toContain(accountType);

    expect(balance).toMatch(/^-?\d+(\.\d{2})?$/);
  });

});

test('should return an error for an invalid account ID', async ({ request }) => {

  const accountApi = new AccountApi(request);

  const invalidAccountId = '999999';

  const response = await accountApi.getAccountById(invalidAccountId);

  console.log('Invalid account status:', response.status());

  const responseBody = await response.text();

  console.log('Invalid account response:', responseBody);

  expect(response.status()).toBe(400);

  expect(responseBody).toBe(
    `Could not find account #${invalidAccountId}`
  );
});

test('should create a new account for a valid customer', async ({ request }) => {

  const accountApi = new AccountApi(request);

  const customerId = '12212';
  const newAccountType = 1;
  const fromAccountId = '12345';

  const response = await accountApi.createAccount(
    customerId,
    newAccountType,
    fromAccountId
  );

  console.log('Create account status:', response.status());

  expect(response.status()).toBe(200);

  const responseBody = await response.text();

  console.log('Create account response:', responseBody);

  const parsedResponse = await parseStringPromise(responseBody);

  expect(parsedResponse.account).toBeDefined();

  const account = parsedResponse.account;

  const createdAccountId = account.id[0];
  const returnedCustomerId = account.customerId[0];
  const accountType = account.type[0];
  const balance = account.balance[0];

  console.log(
    `Created Account ID: ${createdAccountId} | ` +
    `Customer ID: ${returnedCustomerId} | ` +
    `Type: ${accountType} | ` +
    `Balance: ${balance}`
  );

  expect(createdAccountId).toMatch(/^\d+$/);

  expect(returnedCustomerId).toBe(customerId);

  expect(accountType).toBe('SAVINGS');

  expect(balance).toMatch(/^-?\d+(\.\d{2})?$/);
});

test('should return an error when creating an account for an invalid customer', async ({ request }) => {

  const accountApi = new AccountApi(request);

  const invalidCustomerId = '999999';
  const newAccountType = 1;
  const fromAccountId = '12345';

  const response = await accountApi.createAccount(
    invalidCustomerId,
    newAccountType,
    fromAccountId
  );

  console.log(
    'Invalid customer create account status:',
    response.status()
  );

  const responseBody = await response.text();

  console.log(
    'Invalid customer create account response:',
    responseBody
  );

  expect(response.status()).toBe(400);

  expect(responseBody).toBe(
    `Could not create new account for customer ${invalidCustomerId} from account ${fromAccountId}`
  );
});