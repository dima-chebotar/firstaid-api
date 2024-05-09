import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { BullModule } from '@nestjs/bull';
import { FileDeleteJobConsumer } from './common/jobs/file-delete.job';
import { ScheduleModule } from '@nestjs/schedule';
import { ClearTempDirectoryTask } from './common/scheduling/clear-temp-directory.task';
import { GeneralBloodAnalysisModule } from './general-blood-analysis/general-blood-analysis.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from '@app/mail';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    AuthModule,
    UserModule,
    ChatModule,
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: parseInt(configService.get('REDIS_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    GeneralBloodAnalysisModule,
    MailModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaModule,
    ClearTempDirectoryTask,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    FileDeleteJobConsumer,
  ],
  // exports: [BullModule],
})
export class AppModule {}
