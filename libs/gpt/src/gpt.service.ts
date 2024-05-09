import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { GptModel } from '@app/gpt/gpt.model';
import { ReadStream } from 'fs';

@Injectable()
export class GptService {
  private readonly logger = new Logger(GptService.name);
  private openai: OpenAIApi;

  constructor(private readonly config: ConfigService) {
    const configuration = new Configuration({
      apiKey: config.get<string>('OPENAI_API_KEY'),
    });
    this.openai = new OpenAIApi(configuration);
  }

  async createChatCompletion(
    messages: ChatCompletionRequestMessage[],
    model: GptModel.THREE_DOT_FIVE_TURBO | GptModel.FOUR = GptModel.FOUR,
  ): Promise<string> {
    try {
      const completion = await this.openai.createChatCompletion({
        model: model,
        messages: messages,
      });
      return completion.data.choices[0]?.message.content;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async createTranscription(
    file: File | ReadStream,
    model: GptModel,
  ): Promise<string> {
    const transcription = await this.openai.createTranscription(
      <File>file,
      model,
    );
    return transcription.data.text;
  }
}
