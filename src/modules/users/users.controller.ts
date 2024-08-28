import { BotTelegramService } from "./../manage-bot-telegram/BotTelegram.service";
import { Controller, Get, Post, Body, Param, Delete, Put, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUser } from "./users.interface";
import { User } from "src/modules/auth/decorators/user.decorator";
import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller("users")
@ApiTags("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly botTelegramService: BotTelegramService,
  ) {}

  @Post()
  @ResponseMessage("Create a new user")
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }
  @Post("/key/bot-telegram")
  saveAPIKeyBotTelegram(@Body() data: any, @User() user: IUser) {
    return this.botTelegramService.saveBotKey(data, user?._id);
  }

  @Get()
  findAll(@Query() query: any) {
    const { page = 1, limit = 10, search = "" } = query;
    return this.usersService.findAll({
      page: +page,
      limit: +limit,
      search,
    });
  }

  @Get(":id")
  @ResponseMessage("Fetch a user by id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update a user by id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(":id")
  @ResponseMessage("Delete a user by id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
