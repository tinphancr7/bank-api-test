import { BotTelegramService } from "./../manage-bot-telegram/BotTelegram.service";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "src/base/base.service";
import { toObjectId } from "src/utils";
import { IUser } from "src/modules/users/users.interface";
import { Model } from "mongoose";
import { Transaction, TransactionDocument } from "./schemas/transaction.schema";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { ApiServiceCasso } from "src/apiservice/ApiServiceCasso";
import { Bank, BankDocument } from "../banks/schemas/bank.schema";
import moment from "moment";

@Injectable()
export class TransactionsService extends BaseService<TransactionDocument> {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private readonly apiServiceCasso: ApiServiceCasso,
    @InjectModel(Bank.name)
    private readonly bankModel: Model<BankDocument>,
    private readonly botTelegramService: BotTelegramService,
  ) {
    super(transactionModel);
  }

  async create(createTransactionDto: CreateTransactionDto, user: IUser) {
    return this.createData({
      ...createTransactionDto,
      createdBy: toObjectId(user?._id),
    });
  }
  async findAll({ page, limit, accountId, user, search, preDay = "all" }) {
    try {
      const queryObj = {};
      const startDate = preDay !== "all" ? moment().subtract(Number(preDay), "days").toDate() : "";

      const endDate = moment().toDate();

      if (preDay !== "all") {
        queryObj["transactionDateTime"] = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
      if (search) {
        queryObj["$or"] = [
          {
            description: {
              $regex: `.*${search}.*`,
              $options: "i",
            },
          },
        ];
      }

      const transactions = await this.apiServiceCasso.getTransactionByAccountId(accountId, "DESC", 100);

      if (transactions?.data?.data) {
        const updatePromises = transactions?.data?.data?.records.map(
          (transaction) =>
            this.transactionModel
              .findOneAndUpdate(
                {
                  accountId: transaction.accountId,
                  privateId: transaction.privateId,
                  reference: transaction.reference,
                },
                { ...transaction, createdBy: toObjectId(user?._id) },
                { upsert: true },
              )
              .exec(), // Execute the query and return a promise
        );

        await Promise.all(updatePromises);
      }
      const result = await this.transactionModel.aggregate([
        {
          $addFields: {
            transactionDateTime: {
              $toDate: "$transactionDateTime",
            },
          },
        },
        {
          $match: {
            accountId,
            ...queryObj,
          },
        },

        {
          $sort: {
            transactionDateTime: -1,
          },
        },
        {
          $facet: {
            paginatedResults: [{ $skip: (+page - 1) * +limit }, { $limit: +limit }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);

      const paginatedResults = result[0].paginatedResults;
      const totalItems = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
      const totalPages = Math.ceil(totalItems / +limit);

      return {
        meta: {
          page,
          limit,
          totalPages,
          totalItems,
        },
        result: paginatedResults,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    return this.findOneData({
      id,
    });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.updateData({
      id,
      updateDto: {
        ...updateTransactionDto,
      },
    });
  }

  async remove(id: string) {
    return this.removeData({
      id,
    });
  }

  async callBackTransaction(data: any, user: IUser) {
    if (data?.data) {
      const results = await Promise.all(
        data.data.map(async (transaction: any) => {
          const getDetailBank = await this.bankModel.findOne({ accountNumber: String(transaction.bank_sub_acc_id) });
          let typeTran = `- Tiền vào:  ${transaction.amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`;
          if (String(transaction.amount).includes("-")) {
            typeTran = `- Tiền ra: ${transaction.amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`;
          }
          const message = `\n- Ngày giao dịch : ${moment(transaction?.when).format("DD/MM/YYYY HH:mm:ss")}
          - Tên chủ thẻ: ${getDetailBank?.accountName}
          - Số tài khoản: ${getDetailBank?.accountNumber} 
          - Ngân Hàng: ${getDetailBank?.bankName}
          ${typeTran}
          - Nội dung: ${transaction.description} 
          - Số dư hiện tại: ${transaction.cusum_balance.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
          `;
          this.botTelegramService.sendMessage(message);
          return await this.create(
            {
              privateId: transaction?.id,
              reference: transaction?.tid,
              description: transaction?.description,
              amount: transaction?.amount,
              runningBalance: transaction?.cusum_balance,
              transactionDate: transaction?.when,
              transactionDateTime: transaction?.when,
              virtualAccountNumber: transaction?.bank_sub_acc_id,
              virtualAccountName: transaction?.bankName,
              paymentChannel: transaction?.bankAbbreviation,
              counterAccountNumber: transaction?.corresponsiveAccount,
              counterAccountName: transaction?.bankName,
              counterAccountBankId: transaction?.bank_sub_acc_id,
              counterAccountBankName: transaction?.bank_sub_acc_id,
              accountId: getDetailBank?.id,
              bankCodeName: transaction?.bankName,
              raw: JSON.stringify(transaction),
            },
            user,
          );
        }),
      );
    }
  }
}
