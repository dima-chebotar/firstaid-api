import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { IVerifyEmail } from './IVerifyEmail';
import { CreateSupportDto } from '../../../src/support/dto/create-support.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async verifyEmail({
    to,
    name,
    verifyUrl,
  }: IVerifyEmail): Promise<[SendGrid.ClientResponse, NonNullable<unknown>]> {
    try {
      const mail: SendGrid.MailDataRequired = {
        to,
        templateId: this.configService.get<string>(
          'SENDGRID_EMAIL_VERIFY_TEMPLATE_ID',
        ),
        dynamicTemplateData: {
          name,
          verifyUrl,
        },
        from: this.configService.get<string>('SENDGRID_FROM'),
      };
      return await SendGrid.send(mail);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error.toString());
    }
  }

  async support(
    dto: CreateSupportDto,
  ): Promise<[SendGrid.ClientResponse, NonNullable<unknown>]> {
    try {
      const from = dto.name + ` (${dto.email})`;

      const mail: SendGrid.MailDataRequired = {
        to: dto.email,
        templateId: this.configService.get<string>(
          'SENDGRID_EMAIL_SUPPORT_TEMPLATE_ID',
        ),
        dynamicTemplateData: {
          from,
          subject: dto.subject,
          message: dto.message,
        },
        from: this.configService.get<string>('SENDGRID_FROM'),
      };
      return await SendGrid.send(mail);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error.toString());
    }
  }
}
