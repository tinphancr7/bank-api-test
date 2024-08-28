import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { error, time } from "console";
import { Document, HydratedDocument, Types } from "mongoose";

export type BinanceP2PDocument = HydratedDocument<BinanceP2P>;

@Schema({ timestamps: true })
export class BinanceP2P extends Document {
  @Prop({ type: String })
  orderNumber: string;

  @Prop({ type: String })
  advNo: string;

  @Prop({ type: String })
  tradeType: string;

  @Prop({ type: String })
  asset: string;

  @Prop({ type: String })
  fiat: string;

  @Prop({ type: String })
  fiatSymbol: string;

  @Prop({ type: String })
  amount: string;

  @Prop({ type: String })
  totalPrice: string;

  @Prop({ type: String })
  unitPrice: string;

  @Prop({ type: String })
  orderStatus: string;

  @Prop({ type: Number })
  createTime: number;

  @Prop({ type: Number })
  timestamp: number;

  @Prop({ type: String })
  commission: string;

  @Prop({ type: String })
  takerCommissionRate: string;

  @Prop({ type: String })
  takerCommission: string;

  @Prop({ type: String })
  takerAmount: string;

  @Prop({ type: String })
  counterPartNickName: string;

  @Prop({ type: String })
  payMethodName: string;

  @Prop({ type: String })
  additionalKycVerify: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;

  @Prop({ type: String })
  apiKey_id: string;
}

export const BinanceP2PSchema = SchemaFactory.createForClass(BinanceP2P);
