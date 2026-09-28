import { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class AccountApi extends BaseApi {

  constructor(request: ConstructorParameters<typeof BaseApi>[0]) {
    super(request, '/parabank/services/bank');
  }

  async getAccountById(accountId: string): Promise<APIResponse> {
    return await this.get(`/accounts/${accountId}`);
  }

async createAccount(
  customerId: string,
  newAccountType: number,
  fromAccountId: string
): Promise<APIResponse> {
  return await this.post('/createAccount', {
    params: {
      customerId,
      newAccountType,
      fromAccountId
    }
  });
}

}