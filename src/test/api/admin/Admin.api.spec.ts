import { test, expect } from '@playwright/test';
import { AdminApi } from '../../../main/api/AdminApi';

test.describe('ParaBank - Admin API', () => {

  test('should retrieve customer details by customer ID', async ({ request }) => {

    const adminApi = new AdminApi(request);

    const response = await adminApi.getCustomerById('12212');

    console.log('Status:', response.status());

    const responseBody = await response.text();

    console.log('Response:', responseBody);

    expect(response.ok()).toBeTruthy();
    expect(responseBody).toContain('<id>12212</id>');
  });

});

test('should return 400 for an invalid customer ID', async ({ request }) => {

  const adminApi = new AdminApi(request);

  const response = await adminApi.getCustomerById('999999');

  console.log('Status:', response.status());

  const responseBody = await response.text();

  console.log('Response:', responseBody);

  expect(response.status()).toBe(400);
  expect(responseBody).toContain('Could not find customer #999999');
});