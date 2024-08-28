import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import CryptoJS from "crypto-js";

@Injectable() // Export service
export class ApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async makeRequestCassoVN(method: string, url: string, data?: any): Promise<any> {
    try {
      const API_KEY_CASSO = this.configService.get<string>("API_KEY_CASSO");
      this.httpService.axiosRef.interceptors.request.use(
        (config) => {
          config.headers["Authorization"] = `Apikey ${API_KEY_CASSO}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );
      const result = await this.httpService.axiosRef[method]("https://oauth.casso.vn/v2" + url, data);
      return {
        status: 1,
        data: result?.data,
      };
    } catch (error) {
      return {
        status: 0,
        data: error?.response?.data?.message,
      };
    }
  }

  async makeRequestBinance(
    apiKey: any,
    skKey: any,
    method: string,
    url: string,
    isSignature: any,
    data?: any,
  ): Promise<any> {
    try {
      this.httpService.axiosRef.interceptors.request.use(
        (config) => {
          config.headers["X-MBX-APIKEY"] = apiKey;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );

      let bURL = "";
      if (isSignature) {
        let queryStr = "recvWindow=50000&timestamp=" + (Date.now() - 20000);
        if (data && Object.keys(data).length > 0) {
          const pairs = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
            }
          }
          queryStr += "&" + pairs.join("&");
        }
        const signature = CryptoJS.HmacSHA256(queryStr, skKey).toString(CryptoJS.enc.Hex);
        bURL = "https://api.binance.com" + url + "?" + queryStr + "&signature=" + signature;
        console.log(bURL)
      } else {
        const pairs = [];
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
          }
        }
        bURL = "https://api.binance.com" + url + "?" + pairs.join("&");
      }

      const result = await this.httpService.axiosRef[method](bURL);
      return {
        status: 1,
        data: result?.data,
      };
    } catch (error) {
      return {
        status: 0,
        data: error?.response?.data,
      };
    }
  }

  async makeRequestReminato(method: string, url: string, data?: any): Promise<any> {
    try {
      this.httpService.axiosRef.interceptors.request.use(
        (config) => {
          config.headers["Authorization"] = `Bearer ${process.env.API_KEY_DIGITAL_OCEAN}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );
      const result = await this.httpService.axiosRef[method]("https://api.digitalocean.com/v2" + url, data);
      return {
        status: 1,
        data: result?.data,
      };
    } catch (error) {
      return {
        status: 0,
        data: error?.response?.data?.message,
      };
    }
  }
}
