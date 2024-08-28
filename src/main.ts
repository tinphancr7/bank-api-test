import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { TransformInterceptor } from "./transforms/transform.interceptor";
import cookieParser from "cookie-parser";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import compression from "compression";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { configSwagger } from "./configs/api-docs.config";
async function bootstrap() {
  // Create a NestJS application instance using the NestExpressApplication adapter.
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Retrieve the Reflector instance for metadata reflection.
  const reflector = app.get(Reflector);

  // Apply global validation pipes with whitelist enabled to strip non-whitelisted properties.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Apply global exception filters to handle HTTP exceptions.
  app.useGlobalFilters(new HttpExceptionFilter());

  // Apply global interceptors for transforming response data.
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // Define the path for serving static assets.
  // const publicPath = join(__dirname, "../public");

  // Apply global logging interceptors to log all requests.
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Serve static files from the specified public path.
  // app.useStaticAssets(publicPath);

  // Enable cookie parsing middleware.
  app.use(cookieParser());

  // Retrieve the ConfigService instance for configuration management.
  const configService = app.get(ConfigService);

  // Enable CORS with specified options for handling cross-origin requests.
  app.enableCors({
    origin: true,
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    preflightContinue: false,
    credentials: true,
  });

  // Set a global prefix for all routes.
  app.setGlobalPrefix("api");

  // Enable API versioning with URI-based versioning and set default version to "1".
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
    // Uncomment the following line to set multiple default versions.
    // defaultVersion: ["1", "2"],
  });

  // Use Helmet middleware for setting various HTTP headers for security.
  app.use(helmet());

  // Use compression middleware to gzip responses.
  app.use(compression());

  // Configure Swagger for API documentation.
  configSwagger(app);

  // Serve additional static assets from the specified directory.
  app.useStaticAssets(join(__dirname, "./served"));

  // Set the logger for the application.
  app.useLogger(new Logger());

  // Use a global middleware to log a debug message for each request.
  app.use((req: Request, res: Response, next) => {
    new Logger().debug("===TRIGGER GLOBAL MIDDLEWARE==");
    next();
  });

  // Start the application and listen on the port specified in the configuration.
  await app.listen(configService.get<string>("PORT"));
}

bootstrap();
