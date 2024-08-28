import { BotTelegram, BotTelegramSchema } from "./../manage-bot-telegram/BotTelegram.schema";
import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { Transaction, TransactionSchema } from "./schemas/transaction.schema";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { ApiService } from "src/apiservice/ApiService.service";
import { ApiServiceCasso } from "src/apiservice/ApiServiceCasso";
import { Bank, BankSchema } from "../banks/schemas/bank.schema";
import { BotTelegramService } from "../manage-bot-telegram/BotTelegram.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Bank.name, schema: BankSchema },
      { name: BotTelegram.name, schema: BotTelegramSchema },
    ]),
    HttpModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, ApiService, ApiServiceCasso, BotTelegramService],
})
export class TransactionsModule {}
