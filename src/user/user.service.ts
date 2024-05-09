// src/users/users.service.ts
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { ALREADY_EXIST_ERROR } from './user.constants';
import { CreateUserFromSocialDto } from './dto/create-user-from-social.dto';
import * as fs from 'fs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private config: ConfigService, private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      throw new ConflictException(`${ALREADY_EXIST_ERROR}: ${dto.email}`);
    }

    dto.password = await bcrypt.hash(
      dto.password,
      parseInt(this.config.get('ROUNDS_OF_HASHING')),
    );

    return this.prisma.user.create({
      data: dto,
    });
  }

  async createFromSocial(dto: CreateUserFromSocialDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      throw new ConflictException(`${ALREADY_EXIST_ERROR}: ${dto.email}`);
    }

    return this.prisma.user.create({
      data: { ...dto, isEmailConfirmed: true },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async updateAvater(user: User, file: Express.Multer.File): Promise<User> {
    const userDb = await this.prisma.user.update({
      where: { id: user.id },
      data: { avatar: file.path },
    });

    if (user.avatar) {
      fs.unlink(user.avatar, (error) => {
        if (error) {
          this.logger.error(error);
          return;
        }
      });
    }

    userDb.avatar = this.config.get<string>('APP_URL') + '/' + user.avatar;
    return userDb;
  }
}
