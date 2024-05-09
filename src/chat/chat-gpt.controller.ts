import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { CurrentUser } from '../user/user.decorator';
import { ChatMessage, ChatRoom, RoomType, User } from '@prisma/client';
import { CreateGptMessageDto } from './dto/create-gpt-message.dto';
import { SuccessResponseDto } from '../common/data/dto/success-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/config/multer.config';
import { CreateGptMessageResponseDto } from './dto/create-gpt-message.response.dto';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly chatService: ChatGptService) {}

  @Get('get-rooms-by-user-id')
  @HttpCode(HttpStatus.OK)
  async getRoomsByUserId(
    @CurrentUser() user: User,
  ): Promise<(ChatRoom & { chatMessages: ChatMessage[] })[]> {
    return this.chatService.getRoomsByUserId(user.id);
  }

  @Post('create-room')
  @HttpCode(HttpStatus.CREATED)
  async createChatRoom(@CurrentUser() user: User): Promise<ChatRoom> {
    return this.chatService.createChatRoom(user.id, RoomType.CONSUMER_TO_GPT);
  }

  @Post('create-message')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async createMessage(
    @CurrentUser() user: User,
    @Body() dto: CreateGptMessageDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<CreateGptMessageResponseDto> {
    const messages = await this.chatService.createMessage(user.id, dto, file);

    // const voiceUrl = await this.chatService.getVoice(messages[1].message);
    const voiceUrl = null;

    return new CreateGptMessageResponseDto(messages, voiceUrl);
  }

  @Get('get-messages-by-room-id/:id')
  @HttpCode(HttpStatus.OK)
  async getMessagesByRoomId(@Param('id') id: string): Promise<ChatMessage[]> {
    return this.chatService.getMessagesByRoomId(parseInt(id));
  }

  @Patch('mark-messages-by-room-id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markMessageReadByRoomId(@Body('id') id: number): Promise<void> {
    await this.chatService.markMessagesByRoomId(id);
  }

  @Delete('delete-room-by-id/:id')
  @HttpCode(HttpStatus.OK)
  async deleteRoomById(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<SuccessResponseDto> {
    await this.chatService.deleteByRoomId(user.id, parseInt(id));
    return new SuccessResponseDto('Deleted successfully');
  }
}
