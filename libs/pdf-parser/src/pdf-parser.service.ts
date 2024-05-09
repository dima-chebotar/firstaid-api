import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';

@Injectable()
export class PdfParserService {
  async readPdf(fileBuffer: Buffer): Promise<string> {
    return pdf(fileBuffer).then(function (data) {
      return data.text;
    });
  }
}
