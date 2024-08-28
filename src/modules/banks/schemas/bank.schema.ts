import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Document } from "mongoose";

export type BankDocument = HydratedDocument<Bank>;

@Schema({ timestamps: true })
export class Bank extends Document {
  @Prop()
  id: number;

  @Prop()
  accountNumber: string;

  @Prop()
  accountName: string;

  @Prop()
  accountType: string;

  @Prop()
  balance: number;

  @Prop()
  currency: string;

  @Prop()
  swift: string;

  @Prop()
  citad: string;

  @Prop()
  serviceType: string;

  @Prop()
  bankName: string;

  @Prop()
  BIN: number;

  @Prop()
  bankCodeName: string;

  @Prop()
  memo: string;

  @Prop()
  connectStatus: number;

  @Prop()
  beginningSettingDate: string;

  @Prop()
  beginningTxnDate: string | null;

  @Prop()
  beginningBalance: number | null;

  @Prop()
  creditTxnTotal: number | null;

  @Prop()
  creditTxnAmount: number | null;

  @Prop()
  debitTxnTotal: number;

  @Prop()
  debitTxnAmount: number;

  @Prop()
  lockSyncDate: string | null;

  @Prop()
  endingBalance: number | null;

  @Prop()
  endingTxnDate: string | null;

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;

  @Prop({ type: Array })
  owner: string[];
}

export const BankSchema = SchemaFactory.createForClass(Bank);
