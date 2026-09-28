import { test, expect } from '@playwright/test';
import { parseStringPromise } from 'xml2js';
import { TransactionApi } from '../../../main/api/TransactionApi';

test.describe('ParaBank - Transaction API', () => {

  test('should retrieve and validate transactions for a valid account', async ({ request }) => {

    const transactionApi = new TransactionApi(request);

    const accountId = '12345';

    const response = await transactionApi.getAccountTransactions(accountId);

    console.log('Status:', response.status());

    expect(response.status()).toBe(200);

    const responseBody = await response.text();

    const parsedResponse = await parseStringPromise(responseBody);

    expect(parsedResponse.transactions).toBeDefined();
    expect(parsedResponse.transactions.transaction).toBeDefined();

    const transactions = parsedResponse.transactions.transaction;

    console.log('Total transactions:', transactions.length);

    expect(transactions.length).toBeGreaterThan(0);

    for (const transaction of transactions) {

      const transactionId = transaction.id[0];
      const returnedAccountId = transaction.accountId[0];
      const transactionType = transaction.type[0];
      const transactionDate = transaction.date[0];
      const amount = transaction.amount[0];
      const description = transaction.description[0];

      console.log(
        `Transaction ID: ${transactionId} | ` +
        `Account ID: ${returnedAccountId} | ` +
        `Type: ${transactionType} | ` +
        `Date: ${transactionDate} | ` +
        `Amount: ${amount} | ` +
        `Description: ${description}`
      );

      expect(transactionId).toMatch(/^\d+$/);

      expect(returnedAccountId).toBe(accountId);

      expect(['Credit', 'Debit']).toContain(transactionType);

      expect(transactionDate).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );

      expect(amount).toMatch(/^-?\d+(\.\d{2})?$/);

      expect(description).not.toBe('');
    }
  });

});

test('should return an error for an invalid account', async ({ request }) => {

  const transactionApi = new TransactionApi(request);

  const invalidAccountId = '999999';

  const response = await transactionApi.getAccountTransactions(invalidAccountId);

  console.log('Invalid account status:', response.status());

  const responseBody = await response.text();

  console.log('Invalid account response:', responseBody);

  expect(response.status()).toBe(400);

  expect(responseBody).toBe(
    `Could not find transactions for account #${invalidAccountId}`
  );
});

test('should retrieve and validate a transaction by transaction ID', async ({ request }) => {

  const transactionApi = new TransactionApi(request);

  const transactionId = '12145';

  const response = await transactionApi.getTransactionById(transactionId);

  console.log('Transaction by ID status:', response.status());

  expect(response.status()).toBe(200);

  const responseBody = await response.text();

  const parsedResponse = await parseStringPromise(responseBody);

  const transaction = parsedResponse.transaction;

  expect(transaction).toBeDefined();

  expect(transaction.id[0]).toBe(transactionId);
  expect(transaction.accountId[0]).toBe('12345');
  expect(['Credit', 'Debit']).toContain(transaction.type[0]);
  expect(transaction.date[0]).toMatch(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
  );
  expect(transaction.amount[0]).toMatch(/^-?\d+(\.\d{2})?$/);
  expect(transaction.description[0]).not.toBe('');

  console.log(
    `Transaction ID: ${transaction.id[0]} | ` +
    `Account ID: ${transaction.accountId[0]} | ` +
    `Type: ${transaction.type[0]} | ` +
    `Amount: ${transaction.amount[0]} | ` +
    `Description: ${transaction.description[0]}`
  );
});

test('should return an error for an invalid transaction ID', async ({ request }) => {

  const transactionApi = new TransactionApi(request);

  const invalidTransactionId = '999999';

  const response = await transactionApi.getTransactionById(invalidTransactionId);

  console.log('Invalid transaction ID status:', response.status());

  expect(response.status()).toBe(400);

  const responseBody = await response.text();

  console.log('Invalid transaction ID response:', responseBody);

  expect(responseBody).toBe(
    `Could not find transaction #${invalidTransactionId}`
  );
});

test('should retrieve transactions by amount', async ({ request }) => {

  const transactionApi = new TransactionApi(request);

  const accountId = '12345';
  const amount = '10';

  const response = await transactionApi.getTransactionsByAmount(
    accountId,
    amount
  );

  console.log('Transaction by amount status:', response.status());

  expect(response.status()).toBe(200);

  const responseBody = await response.text();

  console.log('Transaction by amount response:', responseBody);

  const parsedResponse = await parseStringPromise(responseBody);

  expect(parsedResponse.transactions).toBeDefined();

  const transactions = parsedResponse.transactions.transaction;

  expect(transactions).toBeDefined();
  expect(transactions.length).toBeGreaterThan(0);

  console.log('Total transactions by amount:', transactions.length);

  for (const transaction of transactions) {

    const transactionId = transaction.id[0];
    const returnedAccountId = transaction.accountId[0];
    const transactionType = transaction.type[0];
    const transactionAmount = transaction.amount[0];
    const transactionDate = transaction.date[0];
    const description = transaction.description[0];

    console.log(
      `Transaction ID: ${transactionId} | ` +
      `Account ID: ${returnedAccountId} | ` +
      `Type: ${transactionType} | ` +
      `Amount: ${transactionAmount} | ` +
      `Date: ${transactionDate}`
    );

    expect(transactionId).toMatch(/^\d+$/);

    expect(returnedAccountId).toBe(accountId);

    expect(['Credit', 'Debit']).toContain(transactionType);

    expect(transactionAmount).toBe('10.00');

    expect(transactionDate).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );

    expect(description).not.toBe('');
  }
});

test('should retrieve transactions by month and type', async ({ request }) => {

  const transactionApi = new TransactionApi(request);

  const accountId = '12345';
  const month = '2026-09';
  const type = 'Credit';

  const response = await transactionApi.getTransactionsByMonthAndType(
    accountId,
    month,
    type
  );

  console.log(
    'Transaction by month and type status:',
    response.status()
  );

  expect(response.status()).toBe(200);

  const responseBody = await response.text();

  console.log(
    'Transaction by month and type response:',
    responseBody
  );

  const parsedResponse = await parseStringPromise(responseBody);

  expect(parsedResponse.transactions).toBeDefined();

  const transactions = parsedResponse.transactions.transaction;

  expect(transactions).toBeDefined();
  expect(transactions.length).toBeGreaterThan(0);

  console.log(
    'Total transactions by month and type:',
    transactions.length
  );

  for (const transaction of transactions) {

    const transactionId = transaction.id[0];
    const returnedAccountId = transaction.accountId[0];
    const transactionType = transaction.type[0];
    const transactionDate = transaction.date[0];
    const transactionAmount = transaction.amount[0];
    const description = transaction.description[0];

    console.log(
      `Transaction ID: ${transactionId} | ` +
      `Account ID: ${returnedAccountId} | ` +
      `Type: ${transactionType} | ` +
      `Date: ${transactionDate} | ` +
      `Amount: ${transactionAmount} | ` +
      `Description: ${description}`
    );

    expect(transactionId).toMatch(/^\d+$/);

    expect(returnedAccountId).toBe(accountId);

    expect(transactionType).toBe(type);

    expect(transactionDate).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );

    expect(transactionAmount).toMatch(
      /^-?\d+(\.\d{2})?$/
    );

    expect(description).not.toBe('');
  }
});

test('should return empty transactions for a date range with no matching transactions', async ({ request }) => {

  const transactionApi = new TransactionApi(request);

  const accountId = '12345';
  const fromDate = '2026-09-01';
  const toDate = '2026-09-30';

  const response = await transactionApi.getTransactionsByDateRange(
    accountId,
    fromDate,
    toDate
  );

  console.log(
    'Transaction by date range status:',
    response.status()
  );

  expect(response.status()).toBe(200);

  const responseBody = await response.text();

  console.log(
    'Transaction by date range response:',
    responseBody
  );

  const parsedResponse = await parseStringPromise(responseBody);

  expect(parsedResponse.transactions).toBeDefined();

  const transactions = parsedResponse.transactions.transaction;

  expect(transactions).toBeUndefined();
});

test('should return empty transactions for a date with no matching transactions', async ({ request }) => {

  const transactionApi = new TransactionApi(request);

  const accountId = '12345';
  const date = '2026-09-27';

  const response = await transactionApi.getTransactionsOnDate(
    accountId,
    date
  );

  console.log(
    'Transaction on date status:',
    response.status()
  );

  expect(response.status()).toBe(200);

  const responseBody = await response.text();

  console.log(
    'Transaction on date response:',
    responseBody
  );

  const parsedResponse = await parseStringPromise(responseBody);

  expect(parsedResponse.transactions).toBeDefined();

  const transactions = parsedResponse.transactions.transaction;

  expect(transactions).toBeUndefined();
});