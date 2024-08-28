import { Controller, Get, Post, Body, Param, Delete, Put, Query, Logger } from "@nestjs/common";
import { BanksService } from "./banks.service";
import { CreateBankDto } from "./dto/create-bank.dto";
import { UpdateBankDto } from "./dto/update-bank.dto";
import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { User } from "src/modules/auth/decorators/user.decorator";
import { IUser } from "src/modules/users/users.interface";
import { ObjectIdTransformPipe } from "src/pipes/objectid-transform.pipe";
import { ApiTags } from "@nestjs/swagger";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ApiServiceCasso } from "src/apiservice/ApiServiceCasso";

@Controller("banks")
@ApiTags("banks")
export class BanksController {
  constructor(private readonly banksService: BanksService) {}
  private logger = new Logger(); //will print this in context

  @ResponseMessage("Fetch all banks from casso")
  @Get("/fetch-banks")
  fetchBanks(@User() user: IUser) {
    return this.banksService.fetchBanks(user);
  }

  @ResponseMessage("Create a new bank")
  @Post()
  create(@Body(new ObjectIdTransformPipe()) createBankDto: CreateBankDto, @User() user: IUser) {
    return this.banksService.create(createBankDto, user);
  }

  @Get("/get-list-banks-by-user")
  getListBank(@User() user: IUser) {
    return this.banksService.getListBank(user?._id);
  }

  @ResponseMessage("Fetch all banks with paginate")
  @Get()
  findAll(@Query() query: any) {
    const { page = 1, limit = 10, search = "" } = query;

    return this.banksService.findAll({
      page: +page,
      limit: +limit,
      search,
    });
  }

  @ResponseMessage("Fetch a bank by id")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.banksService.findOne(id);
  }

  @ResponseMessage("Update a bank by id")
  @Put(":id")
  update(@Param("id") id: string, @Body(new ObjectIdTransformPipe()) updateBankDto: UpdateBankDto) {
    return this.banksService.update(id, updateBankDto);
  }

  @ResponseMessage("Update owner successfully")
  @Put('update/owner')
  updateOwner(@Body() updateOwner: any) {
    console.log(updateOwner)
    return this.banksService.updateOwner(updateOwner)
  }

  @ResponseMessage("Delete a bank by id")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.banksService.remove(id);
  }
}
