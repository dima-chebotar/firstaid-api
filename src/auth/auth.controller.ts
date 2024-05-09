import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { Public } from '../common/decorators/rout.decorator';
import TERMS_AND_CONDITIONS from './terms-and-conditions.data';
import { TermsAndConditionsDto } from './dto/terms-and-conditions.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from '../user/user.service';
import {
  EMAIL_CONFIRMED_SUCCESSFULLY,
  USER_SIGN_UP_SUCCESSFULLY,
} from './auth.constants';
import { SignInDto } from './dto/sign-in.dto';
import { SuccessResponseDto } from '../common/data/dto/success-response.dto';
import { GoogleOauthGuard } from './guard/google-auth.guard';
import { CreateUserFromSocialDto } from '../user/dto/create-user-from-social.dto';
import { GoogleUser } from './decorators/google-user.decorator';
import { IGoogleUser } from './interfaces/google-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() { email, password }: SignInDto): Promise<AuthEntity> {
    return this.authService.login(email, password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<SuccessResponseDto> {
    await this.userService.create(signUpDto);
    return new SuccessResponseDto(USER_SIGN_UP_SUCCESSFULLY);
  }

  @Public()
  @Get('confirm-email')
  async confirmEmail(
    @Query('accessToken') accessToken: string,
  ): Promise<SuccessResponseDto> {
    await this.authService.confirmEmail(accessToken);
    return new SuccessResponseDto(EMAIL_CONFIRMED_SUCCESSFULLY);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Public()
  @Get('terms-and-conditions')
  async termsAndConditions(): Promise<TermsAndConditionsDto> {
    return new TermsAndConditionsDto(TERMS_AND_CONDITIONS);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(): Promise<void> {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@GoogleUser() user: IGoogleUser): Promise<string> {
    const dto = new CreateUserFromSocialDto(
      user.provider,
      user.email,
      user.name,
      user.picture,
    );

    return this.authService.googleAuth(dto);
  }
}
