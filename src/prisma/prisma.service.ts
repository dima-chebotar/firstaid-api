import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  enableShutdownHooks(app: INestApplication): void {
    process.on('beforeExit', async (): Promise<void> => {
      await app.close();
    });
  }
}
