import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatMessage, ChatRoom, MessageFrom, RoomType } from '@prisma/client';
import { CreateGptMessageDto } from './dto/create-gpt-message.dto';
import { GptService } from '@app/gpt';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai';
import { ChatRepository } from './chat.repository';
import { GptModel } from '@app/gpt/gpt.model';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { AppQueue } from '../common/data/constants/queue';
import { PlayhtService } from '@app/playht';
import { IAudioFromTextDto } from '@app/playht/data/interfaces';
import { OutputFormat } from '@app/playht/data/output-format';
import { Quality } from '@app/playht/data/quality';
import { Voice } from '@app/playht/data/voice';
import { CHAT_SYSTEM_MESSAGE } from './chat.constants';

@Injectable()
export class ChatGptService {
  constructor(
    @InjectQueue(AppQueue.FileDelete) private fileDeleteQueue: Queue,
    private prisma: PrismaService,
    private readonly gptService: GptService,
    private chatRepository: ChatRepository,
    private playhtService: PlayhtService,
  ) {}

  async getRoomsByUserId(
    id: number,
  ): Promise<(ChatRoom & { chatMessages: ChatMessage[] })[]> {
    return this.chatRepository.getRoomsByUserId(id);
  }

  async createChatRoom(id: number, chatRoomType: RoomType): Promise<ChatRoom> {
    const user = await this.chatRepository.createChatRoom(id, chatRoomType);

    return user.chatRooms[user.chatRooms.length - 1];
  }

  async createMessage(
    id: number,
    dto: CreateGptMessageDto,
    file?: Express.Multer.File,
  ): Promise<ChatMessage[]> {
    if (dto.chatRoomId === undefined) {
      const room = await this.createChatRoom(id, RoomType.CONSUMER_TO_GPT);
      dto.chatRoomId = room.id.toString();
    }

    const allMessage = await this.chatRepository.getAllChatMessageByRoomId(
      parseInt(dto.chatRoomId),
    );
    if (file) {
      dto.message = await this.getTranscriptionMessage(file);
    }

    const reqMessages = this.getChatCompletionRequestMessage(
      allMessage,
      dto.message,
    );

    const gptMessage = await this.gptService.createChatCompletion(reqMessages);

    return this.chatRepository.saveMessages(id, dto, gptMessage);
  }

  private async getTranscriptionMessage(
    file: Express.Multer.File,
  ): Promise<string> {
    const stream: ReadStream = createReadStream(join(process.cwd(), file.path));
    const text = await this.gptService.createTranscription(
      stream,
      GptModel.WHISPER_ONE,
    );

    await this.fileDeleteQueue.add({
      path: file.path,
    });

    return text;
  }

  private getChatCompletionRequestMessage(
    allMessage: ChatRoom & { chatMessages: ChatMessage[] },
    message: string,
  ): ChatCompletionRequestMessage[] {
    const reqMessages: ChatCompletionRequestMessage[] = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: CHAT_SYSTEM_MESSAGE,
      },
    ];

    if (allMessage.chatMessages.length !== 0) {
      allMessage.chatMessages.forEach((i) => {
        if (i.from === MessageFrom.USER) {
          reqMessages.push({
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: i.message,
          });
        } else if (i.from === MessageFrom.ASSISTANT_GPT) {
          reqMessages.push({
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: i.message,
          });
        }
      });
    }

    reqMessages.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: message,
    });
    return reqMessages;
  }

  async getMessagesByRoomId(id: number): Promise<ChatMessage[]> {
    const room = await this.chatRepository.getAllChatMessageByRoomId(id);

    return room.chatMessages;
  }

  async markMessagesByRoomId(id: number): Promise<void> {
    await this.chatRepository.markMessagesByRoomId(id);
  }

  async deleteByRoomId(userId: number, roomId: number): Promise<void> {
    await this.chatRepository.deleteByRoomId(userId, roomId);
  }

  async getVoice(message: string): Promise<string> {
    const req: IAudioFromTextDto = {
      output_format: OutputFormat.Mp3,
      quality: Quality.Medium,
      sample_rate: 24000,
      speed: 1,
      text: message,
      voice: Voice.Anny,
    };

    return this.playhtService.getVoiceUrl(req);
  }
}
