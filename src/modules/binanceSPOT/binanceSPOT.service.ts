import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "src/base/base.service";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { BinanceSPOT, BinanceSPOTDocument } from "./binanceSPOT.schema";
import { toObjectId } from "src/utils";

@Injectable()
export class BinanceSPOTService extends BaseService<BinanceSPOTDocument> {
  constructor(@InjectModel(BinanceSPOT.name) private binanceSPOTModel: Model<BinanceSPOTDocument>) {
    super(binanceSPOTModel);
  }

  async saveTransactionHistoryFUND_SPOT(data: any, user_id: any, apiKey_id: any) {
    data.map(async (item: any) => {
      await this.createData({
        ...item,
        createTimestamp: item?.createTime,
        createdBy: toObjectId(user_id),
        apiKey_id,
      });
    });
  }
  async deleteTransactionHistoryFUND_SPOT() {
    await this.binanceSPOTModel.deleteMany({});
  }

  async getTransactionHistoryBinanceSPOT(binance_key_id: any) {
    // return await this.binancePAYModel
    //   .find({ createdBy: new Types.ObjectId(user_id), apiKey_id: binance_key_id })
    //   .sort({ transactionTime: -1 });

    return await this.binanceSPOTModel.find({ apiKey_id: binance_key_id });
  }
}
