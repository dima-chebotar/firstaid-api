import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { getChats } from './chat.factory';
import { getGeneralBloodAnalyses } from './general-blood-analyses.factory';

const prisma = new PrismaClient();

const MAX_USERS = 100;
const DEV_EMAIL = 'all.email.mars@gmail.com';
const DEV_PASSWORD = 'password';

const createUsers = async (password: string): Promise<void> => {
  await prisma.user.create({
    data: {
      email: 'dev@email.test',
      isEmailConfirmed: true,
      password: password,
      firstName: 'Dev',
      lastName: faker.person.lastName(),
      birthdate: new Date('1987-01-01'),
      gender: 'male',
    },
  });

  await prisma.user.create({
    data: {
      email: 'dima@email.test',
      isEmailConfirmed: true,
      password: password,
      firstName: 'Dima',
      lastName: faker.person.lastName(),
      birthdate: new Date('1987-05-31'),
      gender: 'male',
    },
  });

  await prisma.user.create({
    data: {
      email: 'maria@email.test',
      isEmailConfirmed: true,
      password: password,
      firstName: 'Maria',
      lastName: faker.person.lastName(),
      birthdate: new Date('1986-11-20'),
      gender: 'female',
    },
  });

  await prisma.user.create({
    data: {
      email: 'alex@email.test',
      isEmailConfirmed: true,
      password: password,
      firstName: 'Alex',
      lastName: faker.person.lastName(),
      birthdate: new Date('1987-01-03'),
      gender: 'male',
    },
  });

  await prisma.user.create({
    data: {
      email: 'one@email.test',
      isEmailConfirmed: true,
      password: password,
      firstName: 'First female',
      lastName: faker.person.lastName(),
      birthdate: new Date('1967-09-12'),
      gender: 'female',
    },
  });

  await prisma.user.create({
    data: {
      email: 'firstMale@email.test',
      isEmailConfirmed: true,
      password: password,
      firstName: 'First Male',
      lastName: faker.person.lastName(),
      birthdate: new Date('1962-03-28'),
      gender: 'male',
    },
  });

  await prisma.user.create({
    data: {
      email: 'secondMale@email.test',
      isEmailConfirmed: true,
      password: password,
      firstName: 'Second Male',
      lastName: faker.person.lastName(),
      birthdate: new Date('1972-01-19'),
      gender: 'male',
    },
  });
  //
  // await prisma.user.create({
  //   data: {
  //     email: 'iryna@email.test',
  //     password: password,
  //     firstName: 'Iryna',
  //     lastName: faker.person.lastName(),
  //     age: 35,
  //     gender: 'female',
  //   },
  // });
  //
  // await prisma.user.create({
  //   data: {
  //     email: 'dmytrosh@email.test',
  //     password: password,
  //     firstName: 'dmytro_sh',
  //     lastName: faker.person.lastName(),
  //     age: 10,
  //     gender: 'male',
  //   },
  // });
  //
  // await prisma.user.create({
  //   data: {
  //     email: 'amn@email.test',
  //     password: password,
  //     firstName: 'man',
  //     lastName: faker.person.lastName(),
  //     age: 18,
  //     gender: 'male',
  //   },
  // });
};

export async function main(): Promise<void> {
  if ((await prisma.user.count()) > 0) {
    return;
  }

  const password = await bcrypt.hash(DEV_PASSWORD, 10);
  await prisma.user.create({
    data: {
      email: DEV_EMAIL,
      isEmailConfirmed: true,
      password: password,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthdate: faker.date.birthdate({ min: 18, max: 70 }),
      gender: 'male',
      country: faker.location.country(),
      avatar: faker.image.avatar(),
      chatRooms: { create: getChats() },
      generalBloodAnalysis: { create: getGeneralBloodAnalyses() },
    },
  });
  await createUsers(password);

  for (let i = 0; i < MAX_USERS; i++) {
    await prisma.user.create({
      data: {
        email: i + faker.internet.email(),
        password: faker.internet.password({ length: 20 }),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        birthdate: faker.date.birthdate({ min: 18, max: 70 }),
        gender: faker.person.gender(),
        weight: faker.number.int({
          min: 40,
          max: 200,
        }),
        country: faker.location.country(),
        avatar: faker.image.avatar(),
        chatRooms: { create: getChats() },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.log('The factory is completed.');
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
