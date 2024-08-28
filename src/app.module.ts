import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "./modules/auth/guards/jwt.guard";
import { JwtStrategy } from "./modules/auth/strategy/jwt.strategy";

import { PermissionsModule } from "./modules/permissions/permissions.module";
import { RolesModule } from "./modules/roles/roles.module";

import { ThrottlerModule } from "@nestjs/throttler";

import { ScheduleModule } from "@nestjs/schedule";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { BanksModule } from "./modules/banks/banks.module";
import { BinanceModule } from "./modules/binance/binance.module";
import { BinanceP2PModule } from "./modules/binanceP2P/binanceP2P.module";
import { BinanceSPOTModule } from "./modules/binanceSPOT/binanceSPOT.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { BinancePAYModule } from "./modules/binancePAY/binancePAY.module";
import { BotTelegramModule } from "./modules/manage-bot-telegram/BotTelegram.module";
@Module({
  imports: [
    ScheduleModule.forRoot(),
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 60000,
    //     limit: 2,
    //   },
    // ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URL"),
        connectionFactory: (connection) => {
          // connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    BanksModule,
    BinanceModule,
    BinanceP2PModule,
    BinanceSPOTModule,
    BinancePAYModule,
    BotTelegramModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },

    JwtStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
