import {
  GeneralBloodAnalysis,
  GeneralBloodAnalysisMessage,
  MessageFrom,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

interface IDataFactory
  extends Omit<
    GeneralBloodAnalysis,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
  > {
  messages: {
    create: IMessageFactory[];
  };
}

type IMessageFactory = Pick<
  GeneralBloodAnalysisMessage,
  'message' | 'isRead' | 'from'
>;

export function getGeneralBloodAnalyses(count = 10): IDataFactory[] {
  const data: IDataFactory[] = [];

  for (let i = 0; i < count; i++) {
    const item: IDataFactory = {
      esr: faker.number.int({ max: 100 }),
      plt: faker.number.int({ max: 100 }),
      rdwSd: faker.number.int({ max: 100 }),
      pdw: faker.number.int({ max: 100 }),
      mpv: faker.number.int({ max: 100 }),
      pLcr: faker.number.int({ max: 100 }),
      pct: faker.number.int({ max: 100 }),
      lymph_rel: faker.number.int({ max: 100 }),
      lymph_abs: faker.number.int({ max: 100 }),
      mono_rel: faker.number.int({ max: 100 }),
      mono_abs: faker.number.int({ max: 100 }),
      hct: faker.number.int({ max: 100 }),
      hgb: faker.number.int({ max: 100 }),
      rbc: faker.number.int({ max: 100 }),
      mcv: faker.number.int({ max: 100 }),
      mch: faker.number.int({ max: 100 }),
      mchc: faker.number.int({ max: 100 }),
      wbc: faker.number.int({ max: 100 }),
      neut_abs: faker.number.int({ max: 100 }),
      eo_abs: faker.number.int({ max: 100 }),
      baso_abs: faker.number.int({ max: 100 }),
      messages: { create: getMessages(2) },
    };

    data.push(item);
  }
  return data;
}

const getMessages = (count = 10): IMessageFactory[] => {
  const data: IMessageFactory[] = [];

  for (let i = 0; i < count; i++) {
    const item: IMessageFactory = {
      message: faker.lorem.sentence(),
      from: i % 2 === 0 ? MessageFrom.USER : MessageFrom.ASSISTANT_GPT,
      isRead: faker.datatype.boolean(),
    };

    data.push(item);
  }

  return data;
};
