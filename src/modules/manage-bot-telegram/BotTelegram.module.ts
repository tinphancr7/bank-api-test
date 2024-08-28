import { BotTelegramService } from "./BotTelegram.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BotTelegram, BotTelegramSchema } from "./BotTelegram.schema";
@Module({
  imports: [MongooseModule.forFeature([{ name: BotTelegram.name, schema: BotTelegramSchema }])],
  providers: [BotTelegramService],
})
export class BotTelegramModule {}
