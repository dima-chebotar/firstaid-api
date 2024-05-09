import { Module } from '@nestjs/common';
import { PlayhtService } from './playht.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        timeout: 50000,
        maxRedirects: 5,
        headers: {
          accept: 'text/event-stream',
          'content-type': 'application/json',
          AUTHORIZATION: `Bearer ${configService.get('PLAY_HT_API_KEY')}`,
          'X-USER-ID': configService.get('PLAY_HT_USER_ID'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PlayhtService],
  exports: [PlayhtService],
})
export class PlayhtModule {}
