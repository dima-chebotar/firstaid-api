import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGptMessageDto {
  chatRoomId?: string;
  message?: string;
}
