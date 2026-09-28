import { test, expect } from '@playwright/test';
import { parseStringPromise } from 'xml2js';

import { LoanApi } from '../../../main/api/LoanApi';

test.describe('ParaBank - Loan API', () => {

  test('should reject a loan request when down payment funds are insufficient', async ({ request }) => {

    const loanApi = new LoanApi(request);

    const customerId = '12212';
    const amount = '1000';
    const downPayment = '100';
    const fromAccountId = '12345';

    const response = await loanApi.requestLoan(
      customerId,
      amount,
      downPayment,
      fromAccountId
    );

    console.log('Loan request status:', response.status());

    expect(response.status()).toBe(200);

    const responseBody = await response.text();

    console.log('Loan request response:', responseBody);

   const parsedResponse = await parseStringPromise(responseBody, {
  tagNameProcessors: [
    (name) => name.includes(':') ? name.split(':').pop()! : name
  ]
});
    expect(parsedResponse.loanResponse).toBeDefined();

    const loanResponse = parsedResponse.loanResponse;

    const approved = loanResponse.approved[0];
    const message = loanResponse.message[0];
    const providerName = loanResponse.loanProviderName[0];
    const responseDate = loanResponse.responseDate[0];

    console.log(
      `Approved: ${approved} | ` +
      `Provider: ${providerName} | ` +
      `Message: ${message} | ` +
      `Response Date: ${responseDate}`
    );

    expect(approved).toBe('false');

    expect(message).toBe(
      'error.insufficient.funds.for.down.payment'
    );

    expect(providerName).toBe(
      'Wealth Securities Dynamic Loans (WSDL)'
    );

    expect(responseDate).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });

});

test('should request a loan for a customer with sufficient funds', async ({ request }) => {

  const loanApi = new LoanApi(request);

  const customerId = '12212';
  const amount = '500';
  const downPayment = '100';
  const fromAccountId = '54321';

  const response = await loanApi.requestLoan(
    customerId,
    amount,
    downPayment,
    fromAccountId
  );

  console.log('Successful loan request status:', response.status());

  const responseBody = await response.text();

  console.log('Successful loan request response:', responseBody);
});