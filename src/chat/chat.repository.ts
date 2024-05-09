import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ChatMessage,
  MessageFrom,
  ChatRoom,
  RoomType,
  User,
} from '@prisma/client';
import { CreateGptMessageDto } from './dto/create-gpt-message.dto';

@Injectable()
export class ChatRepository {
  constructor(private prisma: PrismaService) {}

  async getRoomsByUserId(
    id: number,
  ): Promise<(ChatRoom & { chatMessages: ChatMessage[] })[]> {
    return this.prisma.chatRoom.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        chatMessages: {
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async createChatRoom(
    id: number,
    chatRoomType: RoomType,
  ): Promise<User & { chatRooms: ChatRoom[] }> {
    return this.prisma.user.update({
      where: { id },
      data: {
        chatRooms: {
          create: {
            type: chatRoomType,
          },
        },
      },
      include: {
        chatRooms: {
          include: {
            chatMessages: true,
          },
        },
      },
    });
  }

  async getAllChatMessageByRoomId(
    roomId: number,
  ): Promise<ChatRoom & { chatMessages: ChatMessage[] }> {
    return this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        chatMessages: true,
      },
    });
  }

  async saveMessages(
    userId: number,
    dto: CreateGptMessageDto,
    message: string,
  ): Promise<ChatMessage[]> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        chatRooms: {
          update: {
            where: { id: parseInt(dto.chatRoomId) },
            data: {
              chatMessages: {
                create: [
                  { message: dto.message, isRead: true },
                  { message: message, from: MessageFrom.ASSISTANT_GPT },
                ],
              },
            },
          },
        },
      },
      include: {
        chatRooms: {
          where: { id: parseInt(dto.chatRoomId) },
          include: {
            chatMessages: {
              take: 2,
            },
          },
        },
      },
    });

    if (user.chatRooms.length > 0) {
      return user.chatRooms[0].chatMessages;
    }

    throw new Error('Error create new messages.');
  }

  async markMessagesByRoomId(id: number): Promise<void> {
    await this.prisma.chatMessage.updateMany({
      where: { chatRoomId: id, isRead: false },
      data: {
        isRead: true,
      },
    });
  }

  async deleteByRoomId(userId: number, roomId: number): Promise<void> {
    await this.prisma.chatRoom.deleteMany({
      where: { userId: userId, id: roomId },
    });
  }
}
