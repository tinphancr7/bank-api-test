import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { BinancePAY, BinancePAYDocument } from "./binancePAY.schema";
import { toObjectId } from "src/utils";

@Injectable()
export class BinancePAYService {
  constructor(@InjectModel(BinancePAY.name) private binancePAYModel: Model<BinancePAYDocument>) {}

  async saveTransactionHistoryBinancePay(data: any, user_id: any, apiKey_id: any) {
    data?.map(async (item: any) => {
      await this.binancePAYModel.create({
        ...item,
        createdBy: toObjectId(user_id),
        apiKey_id,
      });
    });
  }

  async getTransactionHistoryBinancePay(user_id: any, binance_key_id: any) {
    // return await this.binancePAYModel
    //   .find({ createdBy: new Types.ObjectId(user_id), apiKey_id: binance_key_id })
    //   .sort({ transactionTime: -1 });

    return await this.binancePAYModel.find({ apiKey_id: binance_key_id }).sort({ transactionTime: -1 });
  }
  async deleteTransactionHistoryBinancePay() {
    return await this.binancePAYModel.deleteMany({});
  }
}
