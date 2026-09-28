import { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class CustomerApi extends BaseApi {

  constructor(request: ConstructorParameters<typeof BaseApi>[0]) {
    super(request, '/parabank/services/bank');
  }

  async getCustomerAccounts(customerId: string): Promise<APIResponse> {
    return await this.get(`/customers/${customerId}/accounts`);
  }

}