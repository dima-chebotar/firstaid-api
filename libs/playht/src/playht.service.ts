import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GENERATE_AUDIO_FROM_TEXT_ENDPOINT } from '@app/playht/data/constants';
import { IAudioFromTextDto } from '@app/playht/data/interfaces';

@Injectable()
export class PlayhtService {
  private readonly logger = new Logger(PlayhtService.name);
  constructor(private readonly httpService: HttpService) {}

  async getVoiceUrl(dto: IAudioFromTextDto): Promise<string> {
    try {
      const { data } = await this.httpService.axiosRef.post(
        GENERATE_AUDIO_FROM_TEXT_ENDPOINT,
        dto,
      );
      const properties = data.split('event: completed')[1].split('data: ')[1];
      return JSON.parse(properties).url;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
