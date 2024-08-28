import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "src/base/base.service";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { BinanceP2P, BinanceP2PDocument } from "./binanceP2P.schema";
import { toObjectId } from "src/utils";

@Injectable()
export class BinanceP2PService extends BaseService<BinanceP2PDocument> {
  constructor(@InjectModel(BinanceP2P.name) private binanceP2PModel: Model<BinanceP2PDocument>) {
    super(binanceP2PModel);
  }

  async saveTransactionHistoryFUND_P2P(data: any, user_id: any, apiKey_id: any) {
    data.map(async (item: any) => {
      await this.createData({
        ...item,
        timestamp: item?.createTime,
        createdBy: toObjectId(user_id),
        apiKey_id,
      });
    });
  }

  async delelteTransactionHistoryFUND_P2P() {
    await this.binanceP2PModel.deleteMany({});
  }

  async getTransactionHistoryBinanceP2p(binance_key_id: any) {
    // return await this.binanceP2PModel.find({ createdBy: user_id, apiKey_id: binance_key_id });
    return await this.binanceP2PModel.find({ apiKey_id: binance_key_id });
  }
}
