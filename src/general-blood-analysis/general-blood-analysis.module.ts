import { Module } from '@nestjs/common';
import { GeneralBloodAnalysisService } from './services/general-blood-analysis.service';
import { GeneralBloodAnalysisController } from './general-blood-analysis.controller';
import { GeneralBloodAnalysisRepository } from './general-blood-analysis.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { GptModule } from '@app/gpt';
import { PdfParserModule } from '@app/pdf-parser';
import { ParseAnalysesPdfService } from './services/parse-analyses-pdf.service';
import { NormOfAnalysisService } from './services/norm-of-analysis.service';

@Module({
  imports: [PrismaModule, GptModule, PdfParserModule],
  controllers: [GeneralBloodAnalysisController],
  providers: [
    GeneralBloodAnalysisService,
    GeneralBloodAnalysisRepository,
    ParseAnalysesPdfService,
    NormOfAnalysisService,
  ],
})
export class GeneralBloodAnalysisModule {}
