import { Injectable } from "@nestjs/common";
import { ApiService } from "./ApiService.service";

@Injectable() // Export service
export class ApiServiceCasso {
  constructor(private readonly apiService: ApiService) {}

  // get region all in digital ocean
  async getDetailAccount(): Promise<any> {
    const response = await this.apiService.makeRequestCassoVN("get", "/accounts");
    return response;
  }
  async getTransactionByAccountId(accountId: string, sort: string, pageSize: number): Promise<any> {
    const response = await this.apiService.makeRequestCassoVN(
      "get",
      `/accounts/${accountId}/transactions?sort=${sort}&pageSize=${pageSize}`,
    );
    return response;
  }

  async syncTransactionBank(accountNumberBank: string): Promise<any> {
    const response = await this.apiService.makeRequestCassoVN("post", `/sync`, { bank_acc_id: accountNumberBank });
    console.log(response);
    return response;
  }
}
