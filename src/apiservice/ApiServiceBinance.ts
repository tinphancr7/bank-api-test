import { BinanceP2PService } from "./../modules/binanceP2P/binanceP2P.service";
import { Injectable } from "@nestjs/common";
import { ApiService } from "./ApiService.service";
import { BinanceSPOTService } from "src/modules/binanceSPOT/binanceSPOT.service";
import { BinancePAYService } from "src/modules/binancePAY/binancePAY.service";
@Injectable() // Export service
export class ApiServiceBinance {
  constructor(
    private readonly apiService: ApiService,
    private readonly binanceP2PService: BinanceP2PService,
    private readonly binanceSPOTService: BinanceSPOTService,
    private readonly binancePAYService: BinancePAYService,
  ) {}

  // get region all in digital ocean
  async getDetailAccountBinance(apiKey: any, skKey: any): Promise<any> {
    const enpointSpot = "/sapi/v3/asset/getUserAsset"; // ví spot
    const enpointFunding = "/sapi/v1/asset/get-funding-asset"; // ví funding
    const endPointRate = "/api/v3/ticker/price";
    const rateBTCUSDT = {
      symbol: "BTCUSDT",
    };
    const rateETHUSDT = {
      symbol: "ETHUSDT",
    };
    const [resSpot, resFunding, resRateBTCUSDT, resRateETHUSDT] = await Promise.all([
      this.apiService.makeRequestBinance(apiKey, skKey, "post", enpointSpot, true),
      this.apiService.makeRequestBinance(apiKey, skKey, "post", enpointFunding, true),
      this.apiService.makeRequestBinance(apiKey, skKey, "get", endPointRate, false, rateBTCUSDT),
      this.apiService.makeRequestBinance(apiKey, skKey, "get", endPointRate, false, rateETHUSDT),
    ]);
    return {
      spotWallet: resSpot?.data,
      fundingWallet: resFunding?.data,
      resRateBTCUSDT,
      resRateETHUSDT,
    };
  }

  async getTransactionHistoryFUND_P2P(apiKey: any, skKey: any, user_id: any): Promise<any> {
    //api get transaction p2p
    //init
    const p2pHistoryEndpoint = "/sapi/v1/c2c/orderMatch/listUserOrderHistory";
    const p2pParamBUY = {
      tradeType: "BUY",
    };
    const p2pParamSELL = {
      tradeType: "SELL",
    };

    const [p2pHistoryBUY, p2pHistorySELL] = await Promise.all([
      this.apiService.makeRequestBinance(apiKey, skKey, "get", p2pHistoryEndpoint, true, p2pParamBUY),
      this.apiService.makeRequestBinance(apiKey, skKey, "get", p2pHistoryEndpoint, true, p2pParamSELL),
    ]);

    // lưu db - test
    // if (p2pHistorySELL?.data?.data.length > 0) {
    //   await this.binanceP2PService.saveTransactionHistoryFUND_P2P(p2pHistorySELL?.data?.data, user_id);
    // }

    // if (p2pHistoryBUY?.data?.data.length > 0) {
    //   await this.binanceP2PService.saveTransactionHistoryFUND_P2P(p2pHistoryBUY?.data?.data, user_id);
    // }
    return {
      p2pHistorySELL: p2pHistorySELL?.data?.data,
      p2pHistoryBUY: p2pHistoryBUY?.data?.data,
    };
  }

  async getTransactionHistoryFUND_SPOT(apiKey: any, skKey: any, user_id: any): Promise<any> {
    /* Lấy giao dịch chuyển từ ví Funding sang spot
      - ---> Query User Universal Transfer History (USER_DATA)  <---
      - Support query within the last 6 months only
      - If startTimeand endTime not sent, return records of the last 7 days by default

      @param: 
      - type	:	 
        + MAIN_FUNDING : Lịch sử giao dịch từ ví spot sang funding
        + FUNDING_MAIN : Lịch sử giao dịch từ funding sang spot
        + FUNDING_UMFUTURE: Funding Chuyển sang Ví Futures USD-M
    */
    const p2pHistoryEndpoint = "/sapi/v1/asset/transfer"; //api get transaction p2p
    const endTime = Date.now();
    // Tạo đối tượng Date từ timestamp
    const currentDate = new Date(endTime);
    // Trừ đi 6 tháng
    currentDate.setMonth(currentDate.getMonth() - 6);
    // Lấy timestamp mới
    const starTime = currentDate.getTime();

    const FUND_SPOT = {
      type: "FUNDING_MAIN",
      startTime: starTime,
      endTime: endTime,
    };

    const [FUND_SPOT_History] = await Promise.all([
      this.apiService.makeRequestBinance(apiKey, skKey, "get", p2pHistoryEndpoint, true, FUND_SPOT),
    ]);
    // if (FUND_SPOT_History?.data?.rows.length > 0) {
    //   await this.binanceSPOTService.saveTransactionHistoryFUND_SPOT(FUND_SPOT_History?.data?.rows, user_id);
    // }
    return FUND_SPOT_History?.data?.rows;
  }

  async getTransactionHistory(apiKey: any, skKey: any, user_id: any, type_transaction: any): Promise<any> {
    // type_transaction : ['ALL', 'fund_p2p', 'FUND_SPOT']
    if (type_transaction === "fund_p2p") {
      const resultFUND_P2P = await this.getTransactionHistoryFUND_P2P(apiKey, skKey, user_id);
      return resultFUND_P2P;
    }
    if (type_transaction === "fund_spot") {
      const resultFUND_P2P = await this.getTransactionHistoryFUND_SPOT(apiKey, skKey, user_id);
      return resultFUND_P2P;
    }
  }

  generateDateRangesForYear() {
    const now = new Date();
    const dateRanges = [];

    for (let i = 0; i < 12; i += 2) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 2, 0);

      dateRanges.push({
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
      });
    }

    return dateRanges.reverse(); // Sắp xếp từ tháng cũ nhất đến mới nhất
  }
  generateDateRangesFor30Days() {
    const now = new Date();
    const dateRanges = [];

    for (let i = 0; i < 6; i += 1) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      dateRanges.push({
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
      });
    }

    return dateRanges.reverse(); // Sắp xếp từ tháng cũ nhất đến mới nhất
  }

  async getTransactionBinancePayCronJob(apiKey: any, skKey: any, user_id: any, apiKey_id: any) {
    /*
      Pay Endpoints
      Get Pay Trade History (USER_DATA)
      If startTime and endTime are not sent, the recent 90 days' data will be returned.
      The max interval between startTime and endTime is 90 days.
      Support for querying orders within the last 18 months.
      - END POINT
    */
    await this.binancePAYService.deleteTransactionHistoryBinancePay();
    const payEndPoint = "/sapi/v1/pay/transactions";
    const dateRangesArray = this.generateDateRangesForYear();
    //tạo thời gian hiện tại
    // Lấy dữ liệu của 3 tháng trước
    dateRangesArray.map(async (item) => {
      const [transactionHistoryBinancePay] = await Promise.all([
        this.apiService.makeRequestBinance(apiKey, skKey, "get", payEndPoint, true, item),
      ]);
      await this.binancePAYService.saveTransactionHistoryBinancePay(
        transactionHistoryBinancePay.data.data,
        user_id,
        apiKey_id,
      );
    });
  }

  async getTransactionBinanceFUNDCronJob(
    apiKey: any,
    skKey: any,
    user_id: any,
    type_transaction: any,
    apiKey_id: any,
  ): Promise<any> {
    // type_transaction : ['ALL', 'fund_p2p', 'FUND_SPOT']
    if (type_transaction === "fund_p2p") {
      const p2pHistoryEndpoint = "/sapi/v1/c2c/orderMatch/listUserOrderHistory";
      const p2pParamBUY = {
        tradeType: "BUY",
      };
      const p2pParamSELL = {
        tradeType: "SELL",
      };
      await this.binanceP2PService.delelteTransactionHistoryFUND_P2P();

      const [p2pHistoryBUY, p2pHistorySELL] = await Promise.all([
        this.apiService.makeRequestBinance(apiKey, skKey, "get", p2pHistoryEndpoint, true, p2pParamBUY),
        this.apiService.makeRequestBinance(apiKey, skKey, "get", p2pHistoryEndpoint, true, p2pParamSELL),
      ]);
      // lưu db - test
      if (p2pHistorySELL?.data?.data.length > 0) {
        await this.binanceP2PService.saveTransactionHistoryFUND_P2P(p2pHistorySELL?.data?.data, user_id, apiKey_id);
      }
      if (p2pHistoryBUY?.data?.data.length > 0) {
        await this.binanceP2PService.saveTransactionHistoryFUND_P2P(p2pHistoryBUY?.data?.data, user_id, apiKey_id);
      }
    }

    if (type_transaction === "fund_spot") {
      const p2pHistoryEndpoint = "/sapi/v1/asset/transfer"; //api get transaction p2p
      // Tạo đối tượng Date từ timestamp
      // Trừ đi 6 tháng
      // Lấy timestamp mới
      const FUND_SPOT = {
        type: "FUNDING_MAIN",
      };
      await this.binanceSPOTService.deleteTransactionHistoryFUND_SPOT();
      const dateRangesArray = this.generateDateRangesFor30Days();
      dateRangesArray.map(async (item) => {
        const [FUND_SPOT_History] = await Promise.all([
          this.apiService.makeRequestBinance(apiKey, skKey, "get", p2pHistoryEndpoint, true, { ...FUND_SPOT, ...item }),
        ]);
        if (FUND_SPOT_History?.data?.rows?.length > 0) {
          await this.binanceSPOTService.saveTransactionHistoryFUND_SPOT(
            FUND_SPOT_History?.data?.rows,
            user_id,
            apiKey_id,
          );
        }
      });
    }
  }
}
