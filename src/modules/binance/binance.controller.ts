/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { BinanceService } from "./binance.service";
import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { User } from "../auth/decorators/user.decorator";
import { IUser } from "../users/users.interface";
@Controller("binance")
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  @Post("/save-api-key")
  @ResponseMessage("Save Api Key success")
  async saveApiKey(@Body() data: any, @User() user: IUser) {
    const result = await this.binanceService.saveApiKey(data, user?._id);
    return {};
  }

  @Get("/get-api-key")
  @ResponseMessage("Get Api Key success")
  async getApiKey(@Body() data: any, @User() user: IUser) {
    const result = await this.binanceService.getApiKey(user?._id);
    return result;
  }

  @Get("/get-list-account-binance")
  @ResponseMessage("Get list account binance success")
  async getListAccountBinance(@User() user: IUser) {
    const result = await this.binanceService.getListAccountBinance(user?._id);
    return result;
  }

  @Delete("/delete-account-binance/:_id")
  @ResponseMessage("delete account binance success")
  async deleteAccountBinance(@Param("_id") _id: any, @User() user: IUser) {
    const result = await this.binanceService.deleteAccountBinance(user, _id);
    return result;
  }

  @Get("/account-detail/:binance_key_id")
  @ResponseMessage("Get account success")
  async getAccountDetail(@Param("binance_key_id") binance_id: any, @User() user: IUser) {
    const result = await this.binanceService.getAccountDetail(user?._id, binance_id);
    return result;
  }

  @Get("/get-transaction-history/:type/:binance_key_id")
  @ResponseMessage("Get account success")
  async getTransactionHistory(
    @User() user: IUser,
    @Param("binance_key_id") binance_key_id: any,
    @Param() { type: type }: any,
  ) {
    const result = await this.binanceService.getHistoryTransaction(user?._id, type, binance_key_id);
    return result;
  }

  @Get("/get-transaction-pay/:binance_key_id")
  @ResponseMessage("Get account success")
  async getTransactionBinancePay(@Param("binance_key_id") binance_key_id: any, @User() user: IUser) {
    const result = await this.binanceService.getTransactionBinancePay(user?._id, binance_key_id);
    return result;
  }
}
