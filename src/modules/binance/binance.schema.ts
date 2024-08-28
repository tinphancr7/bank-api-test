import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Document } from "mongoose";
import { User } from "../users/schemas/user.schema";

export type BinanceDocument = HydratedDocument<Binance>;

@Schema({ timestamps: true })
export class Binance extends Document {
  @Prop({ type: String })
  apiKey: string;

  @Prop({ type: String })
  skKey: string;

  @Prop({ type: String })
  nameAccount: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;

  @Prop({ type: Array })
  owner: string[];
}

export const BinanceSchema = SchemaFactory.createForClass(Binance);
