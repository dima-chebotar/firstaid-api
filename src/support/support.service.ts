import { Injectable } from '@nestjs/common';
import { CreateSupportDto } from "./dto/create-support.dto";
import { MailService } from "@app/mail";

@Injectable()
export class SupportService {

  constructor(private readonly mailService: MailService) {}
  async create(dto: CreateSupportDto): Promise<void> {
    await this.mailService.support(dto);
  }
}
