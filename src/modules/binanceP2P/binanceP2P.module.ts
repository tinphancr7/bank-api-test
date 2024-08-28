import { BinanceP2PService } from "./binanceP2P.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BinanceP2P, BinanceP2PSchema } from "./binanceP2P.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: BinanceP2P.name, schema: BinanceP2PSchema }])],
  providers: [BinanceP2PService],
})
export class BinanceP2PModule {}
