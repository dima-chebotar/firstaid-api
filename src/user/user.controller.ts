import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStepperUserDto } from './dto/update-stepper-user.dto';
import { UserEntity } from './entities/user.entity';
import { Public } from '../common/decorators/rout.decorator';
import { User } from '@prisma/client';
import { CurrentUser } from './user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarMulterOptions } from '../common/config/avatar-multer.config';
import { AuthService } from '../auth/auth.service';
import { SuccessResponseDto } from '../common/data/dto/success-response.dto';
import { USER_CREATED_SUCCESSFULLY } from './user.constants';

@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('create')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SuccessResponseDto> {
    const user = await this.usersService.create(createUserDto);
    await this.authService.sendVerificationLink(user);
    return new SuccessResponseDto(USER_CREATED_SUCCESSFULLY);
  }

  @Get()
  async findAll(): Promise<UserEntity[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Get('profile')
  async getProfile(@CurrentUser() user: User): Promise<UserEntity> {
    return new UserEntity(user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Patch('stepper/:id')
  async updateStepper(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStepperUserDto,
  ): Promise<UserEntity> {
    return new UserEntity(await this.usersService.update(id, dto));
  }

  @Post('update-avatar')
  @UseInterceptors(FileInterceptor('file', AvatarMulterOptions))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<UserEntity> {
    return new UserEntity(await this.usersService.updateAvater(user, file));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return new UserEntity(await this.usersService.remove(id));
  }
}
