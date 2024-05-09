import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import {
  EMAIL_NOT_CONFIRMED_SUCCESSFULLY,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserFromSocialDto } from '../user/dto/create-user-from-social.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@app/mail';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UserService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new NotFoundException(`${USER_NOT_FOUND_ERROR}: ${email}`);
    }

    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException(EMAIL_NOT_CONFIRMED_SUCCESSFULLY);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  public async sendVerificationLink(user: User): Promise<void> {
    const accessToken = this.jwtService.sign({ userId: user.id });

    const url = `${this.configService.get<string>(
      'APP_URL',
    )}/api/v1/auth/confirm-email?accessToken=${accessToken}`;

    await this.mailService.verifyEmail({
      to: user.email,
      name: user.firstName ? user.firstName : user.email,
      verifyUrl: url,
    });
  }

  async googleAuth(dto: CreateUserFromSocialDto): Promise<string> {
    if (!dto) {
      throw new BadRequestException('Unauthenticated');
    }

    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      user = new UserEntity(await this.usersService.createFromSocial(dto));
    }

    return `<script>window.location.replace("${this.configService.get<string>(
      'CLIENT_APP_NAME',
    )}://?accessToken=${this.jwtService.sign({ userId: user.id })}")</script>`;
  }

  async confirmEmail(accessToken: string): Promise<void> {
    const id = await this.decodeConfirmationToken(accessToken);
    await this.prisma.user.update({
      where: { id },
      data: { isEmailConfirmed: true },
    });
  }

  async decodeConfirmationToken(accessToken: string): Promise<number> {
    try {
      const payload = await this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (typeof payload === 'object' && 'userId' in payload) {
        return +payload.userId;
      }
      new BadRequestException();
    } catch (error) {
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
