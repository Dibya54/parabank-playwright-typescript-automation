import { test } from '@playwright/test';
import { AuthApi } from '../../../main/api/AuthApi';

test.describe('ParaBank - Authentication API', () => {

  test('should authenticate with valid credentials', async ({ request }) => {

    const authApi = new AuthApi(request);

    const username = 'testuser';
    const password = 'password';

    const response = await authApi.login(username, password);

    console.log('Login API status:', response.status());

    const responseBody = await response.text();

    console.log('Login API response:', responseBody);
  });

});