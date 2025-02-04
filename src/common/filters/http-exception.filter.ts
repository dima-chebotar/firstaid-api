import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Environment } from '../data/constants/environments';
import { ConfigService } from '@nestjs/config';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger(HttpErrorFilter.name);
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const devErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception?.name,
      message: exception?.message,
    };

    const prodErrorResponse = {
      statusCode,
      message,
    };
    this.logger.error(
      `request method: ${request.method} request url${request.url}`,
      JSON.stringify(devErrorResponse),
    );
    response
      .status(statusCode)
      .json(
        this.configService.get<string>('NODE_ENV') === Environment.Development
          ? devErrorResponse
          : prodErrorResponse,
      );
  }
}
