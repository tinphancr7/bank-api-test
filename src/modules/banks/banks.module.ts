// Banks.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BanksService } from "./banks.service";
import { BanksController } from "./banks.controller";
import { Bank, BankSchema } from "./schemas/bank.schema";
import { ApiServiceCasso } from "src/apiservice/ApiServiceCasso";
import { ApiService } from "src/apiservice/ApiService.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }]), HttpModule],
  controllers: [BanksController],
  providers: [BanksService, ApiService, ApiServiceCasso],
})
export class BanksModule {}
