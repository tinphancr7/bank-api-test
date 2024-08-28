import { ApiService } from "src/apiservice/ApiService.service";
import { Module } from "@nestjs/common";
import { BinanceService } from "./binance.service";
import { BinanceController } from "./binance.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Binance, BinanceSchema } from "./binance.schema";
import { ApiServiceBinance } from "src/apiservice/ApiServiceBinance";
import { HttpModule } from "@nestjs/axios";
import { BinanceP2P, BinanceP2PSchema } from "../binanceP2P/binanceP2P.schema";
import { BinanceP2PService } from "../binanceP2P/binanceP2P.service";
import { BinanceSPOTService } from "../binanceSPOT/binanceSPOT.service";
import { BinanceSPOT, BinanceSPOTSchema } from "../binanceSPOT/binanceSPOT.schema";
import { BinancePAY, BinancePAYSchema } from "../binancePAY/binancePAY.schema";
import { BinancePAYService } from "../binancePAY/binancePAY.service";
import { User, UserSchema } from "../users/schemas/user.schema";
import { UsersService } from "../users/users.service";
// import { Role, RoleSchema } from "src/modules/roles/schemas/role.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Binance.name, schema: BinanceSchema },
      { name: User.name, schema: UserSchema },
      { name: BinanceP2P.name, schema: BinanceP2PSchema },
      { name: BinanceSPOT.name, schema: BinanceSPOTSchema },
      { name: BinancePAY.name, schema: BinancePAYSchema },
    ]),
    HttpModule,
  ],
  controllers: [BinanceController],
  providers: [BinanceService, ApiService, ApiServiceBinance, BinanceP2PService, BinanceSPOTService, BinancePAYService],
  exports: [BinanceService],
})
export class BinanceModule {}
