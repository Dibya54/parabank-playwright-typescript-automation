import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApi {
  protected readonly request: APIRequestContext;
  protected readonly basePath: string;

  constructor(request: APIRequestContext, basePath: string) {
    this.request = request;
    this.basePath = basePath;
  }

  protected async get(endpoint: string): Promise<APIResponse> {
    return await this.request.get(`${this.basePath}${endpoint}`);
  }

  protected async post(
    endpoint: string,
    options?: Parameters<APIRequestContext['post']>[1]
  ): Promise<APIResponse> {
    return await this.request.post(`${this.basePath}${endpoint}`, options);
  }
}