import { BinanceSPOTService } from "src/modules/binanceSPOT/binanceSPOT.service";
import { BinanceP2PService } from "./../binanceP2P/binanceP2P.service";
import { BinancePAYService } from "src/modules/binancePAY/binancePAY.service";
import { BaseService } from "src/base/base.service";
import { Binance, BinanceDocument } from "./binance.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { decryptKey, encryptKey, toObjectId } from "src/utils";
import { ConfigService } from "@nestjs/config";
import { ApiServiceBinance } from "src/apiservice/ApiServiceBinance";
import { Cron, CronExpression } from "@nestjs/schedule";
import { User, UserDocument } from "../users/schemas/user.schema";
import { ADMIN_ROLE } from "src/common";
@Injectable()
export class BinanceService extends BaseService<BinanceDocument> {
  constructor(
    @InjectModel(Binance.name)
    private binanceModel: Model<BinanceDocument>,
    private readonly configService: ConfigService,
    private readonly apiServiceBinance: ApiServiceBinance,
    private readonly binancePayService: BinancePAYService,
    private readonly binanceP2PService: BinanceP2PService,
    private readonly binanceSPOTService: BinanceSPOTService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(binanceModel);
  }

  async getListAccountBinance(user_id: any) {
    return await this.binanceModel
      .find({ owner: { $in: [user_id] } })
      .select("nameAccount createdAt")
      .sort({ createdAt: -1 });
  }

  async deleteAccountBinance(user: any, _id: any) {
    if (user.role.name === ADMIN_ROLE) {
      await this.binanceModel.findByIdAndDelete({ _id });
    }
  }

  async saveApiKey(data: any, user_id: any) {
    // chỉ có admin mới có chức năng thêm mới apiKey
    // nên admin cũng sẽ có quyền sở hữu account này
    const { apiKey, skKey, nameAccount } = data;
    const dataSave = {
      apiKey: encryptKey(apiKey, this.configService.get("KEY_ENCRYPT")),
      skKey: encryptKey(skKey, this.configService.get("KEY_ENCRYPT")),
      nameAccount,
      owner: [user_id],
    };
    return this.createData({
      ...dataSave,
      createdBy: toObjectId(user_id),
    });
  }

  async getApiKey(user_id: any) {
    return this.binanceModel
      .find({ createdBy: new Types.ObjectId(user_id) })
      .populate("createdBy")
      .sort({ createdAt: -1 });
  }

  async getAccountDetail(user_id: any, binance_id: any) {
    try {
      const getApiKey = await this.binanceModel.findOne({
        owner: { $in: [user_id] },
        _id: new Types.ObjectId(binance_id),
      });

      if (getApiKey !== null) {
        const apiKey = decryptKey(getApiKey.apiKey, this.configService.get("KEY_ENCRYPT"));
        const skKey = decryptKey(getApiKey.skKey, this.configService.get("KEY_ENCRYPT"));

        // call api binance
        const result = await this.apiServiceBinance.getDetailAccountBinance(apiKey, skKey);
        return result;
      }
      return null;
    } catch (error) {
      return {
        statusCode: -1,
        data: error,
      };
    }
  }

  async getHistoryTransaction(user_id: any, type_transaction: any, binance_key_id: any) {
    try {
      // const getApiKey = await this.binanceModel.findOne({ owner: { $in: [user_id] } });
      // if (getApiKey !== null) {
      //   const apiKey = decryptKey(getApiKey.apiKey, this.configService.get("KEY_ENCRYPT"));
      //   const skKey = decryptKey(getApiKey.skKey, this.configService.get("KEY_ENCRYPT"));
      //   // call api binance
      //   const result = await this.apiServiceBinance.getTransactionHistory(apiKey, skKey, user_id, type_transaction);
      //   return result;
      // }
      if (type_transaction === "fund_p2p") {
        const getData = await this.binanceP2PService.getTransactionHistoryBinanceP2p(binance_key_id);
        return getData;
      }

      if (type_transaction === "fund_spot") {
        const getData = await this.binanceSPOTService.getTransactionHistoryBinanceSPOT(binance_key_id);
        return getData;
      }
    } catch (error) {
      throw error;
    }
  }

  async getTransactionBinancePay(user_id: any, binance_key_id: any) {
    try {
      const getData = await this.binancePayService.getTransactionHistoryBinancePay(user_id, binance_key_id);
      return getData;
    } catch (error) {
      throw error;
    }
  }

  async cronJobgetTransactionBinancePay(user_id) {
    try {
      // init data
      const getApiKey = await this.binanceModel.findOne({ createdBy: user_id });
      if (getApiKey !== null) {
        const apiKey = decryptKey(getApiKey.apiKey, this.configService.get("KEY_ENCRYPT"));
        const skKey = decryptKey(getApiKey.skKey, this.configService.get("KEY_ENCRYPT"));

        // call api binance - for init data
        const result = await this.apiServiceBinance.getTransactionBinancePayCronJob(
          apiKey,
          skKey,
          user_id,
          getApiKey._id,
        );
        return result;
      }
    } catch (error) {}
  }

  async cronJobGetTransactionBinanceFUND(user_id, type) {
    try {
      const getApiKey = await this.binanceModel.findOne({ createdBy: user_id });
      if (getApiKey !== null) {
        const apiKey = decryptKey(getApiKey.apiKey, this.configService.get("KEY_ENCRYPT"));
        const skKey = decryptKey(getApiKey.skKey, this.configService.get("KEY_ENCRYPT"));

        // call api binance
        const result = await this.apiServiceBinance.getTransactionBinanceFUNDCronJob(
          apiKey,
          skKey,
          user_id,
          type,
          getApiKey._id,
        );
        return result;
      }
    } catch (error) {}
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async handleCron() {
    // get all user để lấy user_id
    const listUser = await this.userModel.find({});
    // map qua từng thằng user để lấy user_id
    listUser.map(async (item) => {
      // lấy 3 tháng trước hiện tại chỉ lấy được 3 tháng, cần xem lại
      await this.cronJobgetTransactionBinancePay(item._id);
      await this.cronJobGetTransactionBinanceFUND(item._id, "fund_p2p");
      await this.cronJobGetTransactionBinanceFUND(item._id, "fund_spot");

      console.log(item);
    });
    console.log(listUser);
  }
}
