import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { BotTelegram, BotTelegramDocument } from "./BotTelegram.schema";

import TelegramBot = require("node-telegram-bot-api");
import { Logger } from "@nestjs/common";

@Injectable()
export class BotTelegramService {
  private readonly bot: TelegramBot;
  private logger = new Logger(BotTelegramService.name);
  constructor(
    @InjectModel(BotTelegram.name)
    private botTelegramModel: Model<BotTelegramDocument>,
    private configService: ConfigService,
  ) {
    // this.bot = new TelegramBot(this.configService.get<string>("TOKEN_CHAT_TELEGRAM"), { polling: true });
  }
  onReceiveMessage = (msg: any) => {
    this.logger.debug(msg);
  };

  sendMessageToUser = (userId: string, message: string) => {
    this.bot.sendMessage(userId, message);
  };

  async saveBotKey(data: any, user_id: any) {
    const { apiKey, idGroup } = data;
    await this.botTelegramModel.create({ botKey: apiKey, idGroup, user_id });
  }
  async getBotKey(user_id: any) {
    const token = await this.botTelegramModel.findOne({ user_id });
    return token.botKey;
  }
  async sendMessage(mess: any) {
    this.bot.sendMessage(this.configService.get<string>("GROUP_CHAT_TELEGRAM"), mess, { parse_mode: "HTML" });
  }
}
