import { ChatMessage } from '@prisma/client';

export class CreateGptMessageResponseDto {
  messages: ChatMessage[];
  voiceUrl: string;
  constructor(messages: ChatMessage[], voiceUrl: string) {
    this.messages = messages;
    this.voiceUrl = voiceUrl;
  }
}
