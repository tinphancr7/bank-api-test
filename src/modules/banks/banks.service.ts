import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateBankDto } from "./dto/create-bank.dto";
import { UpdateBankDto } from "./dto/update-bank.dto";

import { BaseService } from "src/base/base.service";
import { toObjectId } from "src/utils";
import { IUser } from "src/modules/users/users.interface";
import { Model, Types } from "mongoose";
import { Bank, BankDocument } from "./schemas/bank.schema";
import { ApiServiceCasso } from "src/apiservice/ApiServiceCasso";
import { match } from "assert";

@Injectable()
export class BanksService extends BaseService<BankDocument> {
  constructor(
    @InjectModel(Bank.name) private bankModel: Model<BankDocument>,
    private readonly apiServiceCasso: ApiServiceCasso,
  ) {
    super(bankModel);
  }

  async fetchBanks(user) {
    try {
      const banks = await this.apiServiceCasso.getDetailAccount();

      if (banks?.status === 1) {
        await this.bankModel.deleteMany({});
        const updatePromises = banks?.data?.data.map(
          (bank) =>
            this.bankModel
              .findOneAndUpdate(
                { accountNumber: bank.accountNumber },
                { ...bank, createdBy: toObjectId(user?._id) },
                { upsert: true },
              )
              .exec(), // Execute the query and return a promise
        );

        await Promise.all(updatePromises);
      } else {
        throw new BadRequestException("Failed to fetch banks");
      }
    } catch (error) {
      throw error; // Rethrow known BadRequestException
    }
  }

  async create(createBankDto: CreateBankDto, user: IUser) {
    return this.createData({
      ...createBankDto,
      createdBy: toObjectId(user?._id),
    });
  }

  async findAll({ page, limit, search }) {
    const searchQuery = {};

    if (search) {
      searchQuery["$or"] = [
        {
          description: {
            $regex: `.*${search}.*`,
            $options: "i",
          },
        },
      ];
    }
    return this.findAllData({
      query: {
        page,
        limit,
      },
      filter: searchQuery,
      populate: [{ path: "createdBy", select: { name: 1, role: 1, email: 1 } }],
    });
  }

  async findOne(id: string) {
    return this.findOneData({
      id,
      populate: [{ path: "createdBy", select: { name: 1, role: 1, email: 1 } }],
    });
  }

  async update(id: string, updateBankDto: UpdateBankDto) {
    return this.updateData({
      id,
      updateDto: {
        ...updateBankDto,
      },
    });
  }

  async updateOwner(updateOwner: any) {
    const listBanks = await this.bankModel.find({ _id: { $in: updateOwner?.listBank } });
    return listBanks;
  }

  async remove(id: string) {
    return this.removeData({
      id,
    });
  }
  async handleCronSyncTransactionBank(user_id: any) {
    const data = await this.bankModel.find({ createdBy: new Types.ObjectId(user_id) });
    data.map(async (item: any) => {
      await this.apiServiceCasso.syncTransactionBank(item.accountNumber);
    });
    console.log(data);
  }

  // 30 ngafy của tháng đó
  getMonthStartAndEnd(date) {
    // Tạo một đối tượng Date mới từ tham số truyền vào
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // Định dạng ngày tháng theo yêu cầu
    const options: any = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formatter = new Intl.DateTimeFormat("vi-VN", options); // Thay 'vi-VN' bằng locale mong muốn

    return {
      start: formatter.format(firstDayOfMonth),
      end: formatter.format(lastDayOfMonth),
    };
  }

  formatDate(dateString) {
    // Tách chuỗi ngày tháng thành các phần năm, tháng, ngày
    const parts = dateString.split("-");
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Tháng trong JavaScript bắt đầu từ 0
    const day = parseInt(parts[2]);

    // Tạo đối tượng Date
    const date = new Date(year, month, day);

    // Định dạng lại theo yêu cầu
    const options: any = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formatter = new Intl.DateTimeFormat("vi-VN", options); // Thay 'vi-VN' bằng locale mong muốn

    return formatter.format(date);
  }

  async getListBank(user_id: any) {
    const today = new Date();
    const result = this.getMonthStartAndEnd(today);
    console.log(result);
    const transactionDate = "2024-08-20";
    const formattedDate = this.formatDate(transactionDate);
    console.log(formattedDate);
    const listBank = await this.bankModel.aggregate([
      {
        $match: {
          createdBy: new Types.ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "id",
          foreignField: "accountId",
          as: "transaction",
        },
      },
    ]);

    // listBank?.map((bank:any) => {
    //   const transaction = bank.transaction.find((item) => {
    //     if (item)
    //   })
    // }) ;
  }
}
