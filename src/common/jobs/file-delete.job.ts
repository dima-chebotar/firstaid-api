import { AppQueue } from '../data/constants/queue';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs';

type JobType = { path: string };

@Processor(AppQueue.FileDelete)
export class FileDeleteJobConsumer {
  @Process()
  async transcode(job: Job<JobType>): Promise<void> {
    const path = job.data.path;
    try {
      await fs.unlinkSync(path);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}
