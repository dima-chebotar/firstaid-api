import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { SentryFilter } from './common/filters/sentry.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const config = app.get(ConfigService);
  Sentry.init({
    dsn: config.get('SENTRY_DSN'),
    tracesSampleRate: 1.0,
  });
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new SentryFilter(httpAdapter));
  // app.useGlobalFilters(new HttpErrorFilter(config));

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(config.get('APP_PORT'));
}

bootstrap().then();
