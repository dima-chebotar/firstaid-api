import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fsExtra from 'fs-extra';
import { TEMP_DIR_PATH } from '../data/constants/constants';

@Injectable()
export class ClearTempDirectoryTask {
  @Cron(CronExpression.EVERY_WEEK)
  async handleCron(): Promise<void> {
    await fsExtra.emptyDirSync(TEMP_DIR_PATH);
  }
}
