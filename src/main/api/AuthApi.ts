import { APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export class AuthApi extends BaseApi {

  constructor(request: ConstructorParameters<typeof BaseApi>[0]) {
    super(request, '/parabank/services/bank');
  }

  async login(
    username: string,
    password: string
  ): Promise<APIResponse> {
    return await this.get(
      `/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`
    );
  }

}