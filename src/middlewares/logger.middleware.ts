import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction, Request } from "express";
import * as winston from "winston";
import "winston-daily-rotate-file";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private winstonLoggerErrorLevel = this.createSingleLineLogger("error");
  private winstonLoggerInfoLevel = this.createSingleLineLogger("info");

  createSingleLineLogger(logLevel: string) {
    return winston.createLogger({
      level: logLevel,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        // new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: `logs/${logLevel}-%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d", // Keep logs for 14 days
        }),
      ],
    });
  }

  isErroneousStatusCode(statusCode: number) {
    return statusCode >= 400 && statusCode < 600;
  }

  encryptRequestBodyOnProduction(body: object) {
    // if (ENV_VARS.NODE_ENV === ENVIRONMENT_NAMES.PRODUCTION) {
    //   return encryptObject(ENV_VARS.LOGGER_RSA_KEY_PUBLIC, body);
    // } else {
    //   return body;
    // }
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get("user-agent") || "";

    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");

      const basicRequestMetaInfo = {
        method,
        originalUrl,
        statusCode,
        contentLength,
        userAgent,
        ip,
        timestamp: new Date(),
      };

      if (this.isErroneousStatusCode(statusCode)) {
        const additionalRequestMetaInfo = {
          body: this.encryptRequestBodyOnProduction(request.body),
          query: request.query,
          params: request.params,
          // headers: request.headers,
          // user: request.user,
        };
        this.winstonLoggerErrorLevel.error({
          ...basicRequestMetaInfo,
          ...additionalRequestMetaInfo,
        });
      } else {
        this.winstonLoggerInfoLevel.info(basicRequestMetaInfo);
      }
    });

    next();
  }
}
