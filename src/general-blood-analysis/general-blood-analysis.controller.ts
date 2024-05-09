import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GeneralBloodAnalysisService } from './services/general-blood-analysis.service';
import { CurrentUser } from '../user/user.decorator';
import { User } from '@prisma/client';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { GeneralBloodAnalysisEntity } from './entities/general-blood-analysis.entity';
import { SuccessResponseDto } from '../common/data/dto/success-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('general-blood-analysis')
export class GeneralBloodAnalysisController {
  constructor(
    private readonly generalBloodAnalysisService: GeneralBloodAnalysisService,
  ) {}

  @Get('get-analyses')
  @HttpCode(HttpStatus.OK)
  async getAnalysesByUserId(
    @CurrentUser() user: User,
  ): Promise<GeneralBloodAnalysisEntity[]> {
    return this.generalBloodAnalysisService.getAnalysesByUserId(user.id);
  }

  @Get('get-analysis-by-id/:id')
  @HttpCode(HttpStatus.OK)
  async getAnalisisById(
    @Param('id') id: string,
  ): Promise<GeneralBloodAnalysisEntity> {
    return this.generalBloodAnalysisService.getAnalysisById(parseInt(id));
  }

  @Post('create-analysis')
  @HttpCode(HttpStatus.CREATED)
  async createAnalysis(
    @CurrentUser() user: User,
    @Body() dto: CreateAnalysisDto,
  ): Promise<GeneralBloodAnalysisEntity> {
    return this.generalBloodAnalysisService.createAnalysis(user, dto);
  }

  @Post('parse-analysis')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async parseAnalysis(
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<CreateAnalysisDto> {
    return this.generalBloodAnalysisService.parseAnalysis(file);
  }

  @Delete('delete-analysis/:id')
  @HttpCode(HttpStatus.OK)
  async deleteRoomById(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<SuccessResponseDto> {
    await this.generalBloodAnalysisService.deleteByAnalysisId(
      user.id,
      parseInt(id),
    );
    return new SuccessResponseDto('Deleted successfully');
  }
}
