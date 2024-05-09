import { diskStorage } from 'multer';
import e from 'express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';

const FILE_SIZE = 100000000; //bytes (100 MB)
const AVATARS_DIR_PATH = './public/img/avatars';

// const REG_EXP = /\/(mp3|mp4|.mp4|mpeg|mpga|m4a|wav|webm)$/;

export const AvatarMulterOptions: MulterOptions = {
  limits: {
    fileSize: FILE_SIZE,
  },
  // fileFilter: (
  //   req: e.Request,
  //   file: Express.Multer.File,
  //   cb: (error: Error, acceptFile: boolean) => void,
  // ) => {
  //   if (file.mimetype.match(REG_EXP)) {
  //     cb(null, true);
  //   } else {
  //     cb(
  //       new HttpException(
  //         `Unsupported file type ${extname(file.originalname)}`,
  //         HttpStatus.BAD_REQUEST,
  //       ),
  //       false,
  //     );
  //   }
  // },
  storage: diskStorage({
    destination: (
      req: e.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      if (!existsSync(AVATARS_DIR_PATH)) {
        mkdirSync(AVATARS_DIR_PATH);
      }
      cb(null, AVATARS_DIR_PATH);
    },
    // File modification details
    filename: (
      req: e.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};
