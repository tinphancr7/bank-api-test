import { BinanceSPOTService } from "./binanceSPOT.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BinanceSPOT, BinanceSPOTSchema } from "./binanceSPOT.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: BinanceSPOT.name, schema: BinanceSPOTSchema }])],
  providers: [BinanceSPOTService],
})
export class BinanceSPOTModule {}
