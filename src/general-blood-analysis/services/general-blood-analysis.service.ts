import { Injectable } from '@nestjs/common';
import { CreateAnalysisDto } from '../dto/create-analysis.dto';
import { User } from '@prisma/client';
import { GeneralBloodAnalysisRepository } from '../general-blood-analysis.repository';
import { GptService } from '@app/gpt';
import { GeneralBloodAnalysisEntity } from '../entities/general-blood-analysis.entity';
import { PdfParserService } from '@app/pdf-parser';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { ParseAnalysesPdfService } from './parse-analyses-pdf.service';
import { NormOfAnalysisService } from './norm-of-analysis.service';

@Injectable()
export class GeneralBloodAnalysisService {
  constructor(
    private readonly generalBloodAnalysisRepository: GeneralBloodAnalysisRepository,
    private readonly gptService: GptService,
    private readonly pdfParserService: PdfParserService,
    private readonly readAnalysesPdfService: ParseAnalysesPdfService,
    private readonly normOfAnalysisService: NormOfAnalysisService,
  ) {}

  async getAnalysesByUserId(id: number): Promise<GeneralBloodAnalysisEntity[]> {
    const analyses =
      await this.generalBloodAnalysisRepository.getAnalysesByUserId(id);
    return analyses.map((a) => new GeneralBloodAnalysisEntity(a));
  }

  async getAnalysisById(id: number): Promise<GeneralBloodAnalysisEntity> {
    return this.generalBloodAnalysisRepository.getAnalysesById(id);
  }

  async createAnalysis(
    user: User,
    dto: CreateAnalysisDto,
  ): Promise<GeneralBloodAnalysisEntity> {
    const userMessage = this.buildUserMessage(user, dto);

    const gptMessage = await this.gptService.createChatCompletion([
      { role: ChatCompletionRequestMessageRoleEnum.User, content: userMessage },
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: this.normOfAnalysisService.getNormAnalysis(user).toString(),
      },
    ]);

    const analysis = await this.generalBloodAnalysisRepository.createAnalysis(
      user.id,
      dto,
      userMessage,
      gptMessage,
    );
    return new GeneralBloodAnalysisEntity(analysis);
  }

  private buildUserMessage(user: User, dto: CreateAnalysisDto): string {
    // eslint-disable-next-line max-len
    let message = `You're a professional doctor. Please consult me regarding my health conditions. Check my general blood test results and tell me what can be wrong and what should/can I do. Don't tell me that you can't do that because of being a language model, just consult me. Please mention if you notice some signs of a dehydration, bacterial or viral infection, inflammation or anything else. I'm ${user.gender} birthdate ${user.birthdate}.
        My results are as follows. `;

    if (dto.esr !== null) {
      message += `ESR: ${dto.esr} mm/h `;
    }
    if (dto.plt !== null) {
      message += `PLT: ${dto.plt} 10ˆ9/L `;
    }
    if (dto.rdwSd !== null) {
      message += `RDW-SD: ${dto.rdwSd} fL `;
    }
    if (dto.pdw !== null) {
      message += `PDW: ${dto.pdw} fL `;
    }
    if (dto.mpv !== null) {
      message += `MPV: ${dto.mpv} fL `;
    }
    if (dto.pLcr !== null) {
      message += `P-LCR: ${dto.pLcr} % `;
    }
    if (dto.pct !== null) {
      message += `PCT: ${dto.pct} % `;
    }
    if (dto.lymph_rel !== null) {
      message += `LYMPH%: ${dto.lymph_rel} % `;
    }

    if (dto.lymph_abs !== null) {
      message += `LYMPH#: ${dto.lymph_abs} 10ˆ9/L `;
    }
    if (dto.mono_rel !== null) {
      message += `MONO%: ${dto.mono_rel} % `;
    }

    if (dto.mono_abs !== null) {
      message += `MONO#: ${dto.mono_abs} 10ˆ9/L `;
    }
    if (dto.hct !== null) {
      message += `HCT: ${dto.hct}% `;
    }
    if (dto.hgb !== null) {
      message += `HGB: ${dto.hgb} g/L `;
    }
    if (dto.rbc !== null) {
      message += `RBC: ${dto.rbc} 10ˆ12/L `;
    }
    if (dto.mcv !== null) {
      message += `MCV: ${dto.mcv} fL `;
    }
    if (dto.mch !== null) {
      message += `MCH: ${dto.mch} pg/cell `;
    }
    if (dto.mchc !== null) {
      message += `MCHC: ${dto.mchc} g/L `;
    }
    if (dto.wbc !== null) {
      message += `WBC: ${dto.wbc} 10ˆ9/L `;
    }
    if (dto.neut_abs !== null) {
      message += `NEUT#: ${dto.neut_abs} 10ˆ9/L `;
    }
    if (dto.eo_abs !== null) {
      message += `EO#: ${dto.eo_abs} 10ˆ9/L `;
    }
    if (dto.baso_abs !== null) {
      message += `BASO#: ${dto.baso_abs} 10ˆ9/L `;
    }

    message += 'Please give me some summary and general advices as well.';

    return message;
  }

  async parseAnalysis(file: Express.Multer.File): Promise<CreateAnalysisDto> {
    return this.readAnalysesPdfService.getAnalysesFromFile(file);
  }

  async deleteByAnalysisId(userId: number, id: number): Promise<void> {
    await this.generalBloodAnalysisRepository.deleteByAnalysisId(userId, id);
  }
}
