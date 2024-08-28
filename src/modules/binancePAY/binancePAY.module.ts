import { BinancePAYService } from "./binancePAY.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BinancePAY, BinancePAYSchema } from "./binancePAY.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: BinancePAY.name, schema: BinancePAYSchema }])],
  providers: [BinancePAYService],
})
export class BinancePAYModule {}
