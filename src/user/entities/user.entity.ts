import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @Exclude()
  password: string;

  birthdate: Date | null;

  avatar: string | null;

  country: string | null;

  createdAt: Date;

  email: string;

  isEmailConfirmed: boolean;

  firstName: string | null;

  id: number;

  lastName: string | null;

  updatedAt: Date;

  gender: string | null;

  weight: number | null;

  @Exclude()
  provider: string | null;
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
