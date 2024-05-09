import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateSupportDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  subject: string;

  @IsString()
  @MinLength(10)
  message: string;
}
