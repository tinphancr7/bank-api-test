import { Controller, Get, Post, Body, Param, Delete, Put, Query, Logger, Response } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";

import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { User } from "src/modules/auth/decorators/user.decorator";
import { IUser } from "src/modules/users/users.interface";
import { ObjectIdTransformPipe } from "src/pipes/objectid-transform.pipe";
import { ApiTags } from "@nestjs/swagger";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { IsSkipPermission } from "../auth/decorators/skip_permission.decorator";
@Controller("transactions")
@ApiTags("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // @ResponseMessage("Fetch all transactions from casso")
  // @Get("/fetch-transactions")
  // fetchtransactions(@User() user: IUser) {
  //   return this.transactionsService.fetchtransactions(user);
  // }

  @ResponseMessage("Create a new transaction")
  @Post()
  create(@Body(new ObjectIdTransformPipe()) createtransactionDto: CreateTransactionDto, @User() user: IUser) {
    return this.transactionsService.create(createtransactionDto, user);
  }

  @ResponseMessage("Fetch all transactions with paginate")
  @Get()
  findAll(@Query() query: any, @User() user: IUser) {
    const { page = 1, limit = 10, accountId, search, preDay } = query;

    return this.transactionsService.findAll({
      page: +page,
      limit: +limit,
      accountId: +accountId,
      user,
      search,
      preDay,
    });
  }

  @ResponseMessage("Fetch a transaction by id")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.transactionsService.findOne(id);
  }

  @ResponseMessage("Update a transaction by id")
  @Put(":id")
  update(@Param("id") id: string, @Body(new ObjectIdTransformPipe()) updatetransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updatetransactionDto);
  }

  @ResponseMessage("Delete a transaction by id")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.transactionsService.remove(id);
  }
  @IsSkipPermission()
  @ResponseMessage("Create a list transaction")
  @Post("/call-back-transaction-casso")
  callBackTransaction(@Body() data: any, @User() user: IUser, @Response() res: any) {
    this.transactionsService.callBackTransaction(data, user);
    return res.status(200).json({ statusCode: 200 });
  }
}
