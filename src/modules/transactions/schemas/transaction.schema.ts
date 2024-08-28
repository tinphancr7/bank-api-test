import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Document } from "mongoose";

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop()
  privateId: number;

  @Prop()
  reference: string;

  @Prop()
  transactionDate: string;

  @Prop()
  transactionDateTime: string;

  @Prop()
  amount: number;

  @Prop()
  description: string;

  @Prop()
  runningBalance: number;

  @Prop()
  virtualAccountNumber: string;

  @Prop()
  virtualAccountName: string;

  @Prop()
  paymentChannel: string;

  @Prop()
  counterAccountNumber: string;

  @Prop()
  counterAccountName: string;

  @Prop()
  counterAccountBankId: string;

  @Prop()
  counterAccountBankName: string;

  @Prop()
  accountId: number;

  @Prop()
  bankCodeName: string;

  @Prop()
  raw: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index({ accountId: 1, privateId: 1, reference: 1 });
TransactionSchema.index({ accountId: 1, transactionDateTime: 1 });
