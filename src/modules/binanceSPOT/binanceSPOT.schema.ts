import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";

export type BinanceSPOTDocument = HydratedDocument<BinanceSPOT>;

@Schema({ timestamps: true })
export class BinanceSPOT extends Document {
  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;

  @Prop({ type: Number })
  orderNumber: number;

  @Prop({ type: Number })
  timestamp: number;

  @Prop({ type: String })
  asset: string;

  @Prop({ type: String })
  amount: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: Number, unique: true })
  tranId: number;

  @Prop({ type: String })
  apiKey_id: string;
}

export const BinanceSPOTSchema = SchemaFactory.createForClass(BinanceSPOT);
