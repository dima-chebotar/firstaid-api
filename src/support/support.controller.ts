import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { SuccessResponseDto } from '../common/data/dto/success-response.dto';
import { CREATE_SUPPORT_MESSAGE_SUCCESSFULLY } from './constants';
import { Public } from 'src/common/decorators/rout.decorator';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async create(@Body() dto: CreateSupportDto): Promise<SuccessResponseDto> {
    await this.supportService.create(dto);
    return new SuccessResponseDto(CREATE_SUPPORT_MESSAGE_SUCCESSFULLY);
  }
}
