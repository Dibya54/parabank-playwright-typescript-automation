import { test, expect } from '@playwright/test';
import Endpoints from '../../main/constants/Endpoints';

test('ParaBank API should be accessible', async ({ request }) => {
  const customerId = '12212';

  const endpoint = Endpoints.CUSTOMER_ACCOUNTS.replace(
    '{customerId}',
    customerId
  );

  const response = await request.get(
    `${Endpoints.BANK}${endpoint}`
  );

console.log('Status:', response.status());

const responseBody = await response.text();

console.log('Response:', responseBody);

expect(response.ok()).toBeTruthy();
expect(responseBody).toContain(`<customerId>${customerId}</customerId>`);
});