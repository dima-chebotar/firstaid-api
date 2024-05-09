import { Injectable } from '@nestjs/common';
import { CreateAnalysisDto } from '../dto/create-analysis.dto';
import { GptService } from '@app/gpt';
import { PdfParserService } from '@app/pdf-parser';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { GET_ANALYSES_FROM_PDF } from '../general-blood-analisys-constants';

@Injectable()
export class ParseAnalysesPdfService {
  constructor(
    private readonly gptService: GptService,
    private readonly pdfParserService: PdfParserService,
  ) {}

  public async getAnalysesFromFile(
    file: Express.Multer.File,
  ): Promise<CreateAnalysisDto> {
    const rawText = await this.pdfParserService.readPdf(file.buffer);
    const gptMessage = await this.getGptMessage(rawText);
    return this.parseGptMessage(gptMessage);
  }

  private async getGptMessage(rawText: string): Promise<string> {
    const message = [
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: GET_ANALYSES_FROM_PDF + rawText,
      },
    ];

    return this.gptService.createChatCompletion(message);
  }

  private parseGptMessage(gptMessage: string): CreateAnalysisDto {
    return {
      esr: this.parseAnalysis(gptMessage, 'esr'),
      plt: this.parseAnalysis(gptMessage, 'plt'),
      rdwSd: this.parseAnalysis(gptMessage, 'rdw-sd'),
      pdw: this.parseAnalysis(gptMessage, 'pdw'),
      mpv: this.parseAnalysis(gptMessage, 'mpv'),
      pLcr: this.parseAnalysis(gptMessage, 'p-lcr'),
      pct: this.parseAnalysis(gptMessage, 'pct'),
      lymph_rel: this.parseAnalysis(gptMessage, 'lymрh%'),
      lymph_abs: this.parseAnalysis(gptMessage, 'lymрh#'),
      mono_rel: this.parseAnalysis(gptMessage, 'mono%'),
      mono_abs: this.parseAnalysis(gptMessage, 'mono#'),
      hct: this.parseAnalysis(gptMessage, 'hct'),
      hgb: this.parseAnalysis(gptMessage, 'hgb'),
      rbc: this.parseAnalysis(gptMessage, 'rbc'),
      mcv: this.parseAnalysis(gptMessage, 'mcv'),
      mch: this.parseAnalysis(gptMessage, 'mch'),
      mchc: this.parseAnalysis(gptMessage, 'mchc'),
      wbc: this.parseAnalysis(gptMessage, 'wbc'),
      neut_abs: this.parseAnalysis(gptMessage, 'neut'),
      eo_abs: this.parseAnalysis(gptMessage, 'eo'),
      baso_abs: this.parseAnalysis(gptMessage, 'baso'),
    };
  }

  private parseAnalysis(gptMessage: string, value): number | null {
    const separator = '\n';
    const matcher = /[+-]?([0-9]*[.])?[0-9]+/;

    const analysis = gptMessage
      .split(separator)
      .map((line) => line.toLowerCase())
      .find((line) => line.includes(value));

    if (analysis !== undefined) {
      if (analysis.match(matcher) !== null) {
        return parseFloat(analysis.match(matcher)[0]);
      }
    }

    return null;
  }
}
