import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneralBloodAnalysis, MessageFrom } from '@prisma/client';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@Injectable()
export class GeneralBloodAnalysisRepository {
  constructor(private prisma: PrismaService) {}

  async getAnalysesByUserId(id: number): Promise<
    (GeneralBloodAnalysis & {
      messages: {
        createdAt: Date;
        id: number;
        updatedAt: Date;
        message: string;
        isRead: boolean;
      }[];
    })[]
  > {
    return this.prisma.generalBloodAnalysis.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        messages: {
          select: {
            id: true,
            isRead: true,
            message: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async createAnalysis(
    userId: number,
    dto: CreateAnalysisDto,
    userMessage: string,
    GPTMessage: string,
  ): Promise<
    GeneralBloodAnalysis & {
      messages: {
        createdAt: Date;
        id: number;
        updatedAt: Date;
        message: string;
        isRead: boolean;
      }[];
    }
  > {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        generalBloodAnalysis: {
          create: {
            ...dto,
            messages: {
              create: [
                { message: userMessage, isRead: true },
                { message: GPTMessage, from: MessageFrom.ASSISTANT_GPT },
              ],
            },
          },
        },
      },
      include: {
        generalBloodAnalysis: {
          orderBy: {
            id: 'desc',
          },
          take: 1,
          include: {
            messages: {
              select: {
                id: true,
                isRead: true,
                message: true,
                createdAt: true,
                updatedAt: true,
              },
              orderBy: {
                id: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    return user.generalBloodAnalysis[0];
  }

  async deleteByAnalysisId(userId: number, id: number): Promise<void> {
    await this.prisma.generalBloodAnalysis.deleteMany({
      where: { userId: userId, id: id },
    });
  }

  async getAnalysesById(id: number): Promise<
    GeneralBloodAnalysis & {
      messages: {
        createdAt: Date;
        id: number;
        updatedAt: Date;
        message: string;
        isRead: boolean;
      }[];
    }
  > {
    return this.prisma.generalBloodAnalysis.findUnique({
      where: { id: id },
      include: {
        messages: true,
      },
    });
  }
}
