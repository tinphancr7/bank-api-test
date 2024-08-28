import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";

export type BotTelegramDocument = HydratedDocument<BotTelegram>;

@Schema({ timestamps: true })
export class BotTelegram extends Document {
  @Prop({ type: String })
  botKey: string;

  @Prop({ type: String })
  idGroup: string;

  @Prop({ type: Types.ObjectId, ref: "User" })
  user_id: Types.ObjectId;
}

export const BotTelegramSchema = SchemaFactory.createForClass(BotTelegram);
