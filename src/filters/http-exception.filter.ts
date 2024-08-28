// import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
// import { Response } from "express";

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     console.log(response);

//     const status = exception instanceof HttpException ? exception.getStatus() : 500;
//     console.log("exception.getResponse()", exception.stack);
//     const message = exception instanceof HttpException ? exception.message : "Internal server error";
//     response.status(status).json({
//       statusCode: status,
//       message,
//       error: exception.stack,
//     });
//   }
// }
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // NOTICE: GLOBAL FILTER

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
