import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";

export type BinancePAYDocument = HydratedDocument<BinancePAY>;

@Schema({ timestamps: true })
export class BinancePAY extends Document {
  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;

  @Prop({ type: Number })
  uid: number;

  @Prop({ type: Number })
  counterpartyId: number;

  @Prop({ type: String })
  orderId: string;

  @Prop({ type: String })
  note: string;

  @Prop({ type: String })
  orderType: string;

  @Prop({ type: String })
  transactionId: string;

  @Prop({ type: Number })
  transactionTime: number;

  @Prop({ type: String })
  amount: string;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: Number })
  walletType: number;

  @Prop({ type: Array })
  walletTypes: string[];

  @Prop({ type: Array })
  fundsDetail: object;

  @Prop({ type: {} })
  payerInfo: object;

  @Prop({ type: {} })
  receiverInfo: object;

  @Prop({ type: String })
  totalPaymentFee: string;

  @Prop({ type: String })
  apiKey_id: string;
}

export const BinancePAYSchema = SchemaFactory.createForClass(BinancePAY);
