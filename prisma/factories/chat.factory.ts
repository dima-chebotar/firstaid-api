import { ChatMessage, MessageFrom, ChatRoom, RoomType } from '@prisma/client';
import { faker } from '@faker-js/faker';

interface IDataFactory extends Pick<ChatRoom, 'type'> {
  chatMessages: {
    create: IChatMessageFactory[];
  };
}

type IChatMessageFactory = Pick<ChatMessage, 'message' | 'isRead' | 'from'>;
export function getChats(count = 10): IDataFactory[] {
  const data: IDataFactory[] = [];

  for (let i = 0; i < count; i++) {
    const item: IDataFactory = {
      type: RoomType.CONSUMER_TO_GPT,
      chatMessages: { create: getChatMessages() },
    };

    data.push(item);
  }
  return data;
}

const getChatMessages = (count = 10): IChatMessageFactory[] => {
  const data: IChatMessageFactory[] = [];

  for (let i = 0; i < count; i++) {
    const item: IChatMessageFactory = {
      message: faker.lorem.sentence(),
      from: i % 2 === 0 ? MessageFrom.USER : MessageFrom.ASSISTANT_GPT,
      isRead: faker.datatype.boolean(),
    };

    data.push(item);
  }

  return data;
};
