import { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class LoanApi extends BaseApi {

  constructor(request: ConstructorParameters<typeof BaseApi>[0]) {
    super(request, '/parabank/services/bank');
  }

  async requestLoan(
    customerId: string,
    amount: string,
    downPayment: string,
    fromAccountId: string
  ): Promise<APIResponse> {
    return await this.post('/requestLoan', {
      params: {
        customerId,
        amount,
        downPayment,
        fromAccountId
      }
    });
  }

}