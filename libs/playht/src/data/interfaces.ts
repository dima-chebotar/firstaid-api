import { Quality } from '@app/playht/data/quality';
import { OutputFormat } from '@app/playht/data/output-format';
import { Voice } from '@app/playht/data/voice';

export interface IAudioFromTextDto {
  quality: Quality;
  output_format: OutputFormat;
  speed: number;
  sample_rate: number;
  voice: Voice;
  text: string;
}
