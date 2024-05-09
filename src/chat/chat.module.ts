import { Module } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { ChatGptController } from './chat-gpt.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GptModule } from '@app/gpt';
import { ChatRepository } from './chat.repository';
import { BullModule } from '@nestjs/bull';
import { AppQueue } from '../common/data/constants/queue';
import { PlayhtModule } from '@app/playht';

@Module({
  imports: [
    PrismaModule,
    GptModule,
    PlayhtModule,
    BullModule.registerQueue({
      name: AppQueue.FileDelete,
    }),
  ],
  controllers: [ChatGptController],
  providers: [ChatGptService, ChatRepository],
})
export class ChatModule {}
