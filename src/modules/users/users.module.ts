import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { Role, RoleSchema } from "src/modules/roles/schemas/role.schema";
import { BotTelegramService } from "../manage-bot-telegram/BotTelegram.service";
import { BotTelegram, BotTelegramSchema } from "../manage-bot-telegram/BotTelegram.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: BotTelegram.name, schema: BotTelegramSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, BotTelegramService],
  exports: [UsersService],
})
export class UsersModule {}
