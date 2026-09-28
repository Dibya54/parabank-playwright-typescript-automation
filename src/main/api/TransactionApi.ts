import { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class TransactionApi extends BaseApi {

  constructor(request: ConstructorParameters<typeof BaseApi>[0]) {
    super(request, '/parabank/services/bank');
  }

  async getTransactionById(transactionId: string): Promise<APIResponse> {
    return await this.get(`/transactions/${transactionId}`);
  }

  async getAccountTransactions(accountId: string): Promise<APIResponse> {
    return await this.get(`/accounts/${accountId}/transactions`);
  }

  async getTransactionsByAmount(
    accountId: string,
    amount: string
  ): Promise<APIResponse> {
    return await this.get(
      `/accounts/${accountId}/transactions/amount/${amount}`
    );
  }

  async getTransactionsByMonthAndType(
    accountId: string,
    month: string,
    type: string
  ): Promise<APIResponse> {
    return await this.get(
      `/accounts/${accountId}/transactions/month/${month}/type/${type}`
    );
  }

  async getTransactionsByDateRange(
    accountId: string,
    fromDate: string,
    toDate: string
  ): Promise<APIResponse> {
    return await this.get(
      `/accounts/${accountId}/transactions/fromDate/${fromDate}/toDate/${toDate}`
    );
  }

  async getTransactionsOnDate(
    accountId: string,
    date: string
  ): Promise<APIResponse> {
    return await this.get(
      `/accounts/${accountId}/transactions/onDate/${date}`
    );
  }
}