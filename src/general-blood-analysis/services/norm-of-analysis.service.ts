import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

interface IAnalysisNorm {
  esr: string;
  plt: string;
  rdwSd: string;
  pdw: string;
  mpv: string;
  pLcr: string;
  pct: string;
  lymph_rel: string;
  lymph_abs: string;
  mono_rel: string;
  mono_abs: string;
  hct: string;
  hgb: string;
  rbc: string;
  mcv: string;
  mch: string;
  mchc: string;
  wbc: string;
  neut_abs: string;
  eo_abs: string;
  baso_abs: string;
}

const BASE_NORM_OF_ANALYSIS = {
  male: {
    esr: undefined,
    plt: '150-450',
    rdwSd: '11-16',
    pdw: '10-20',
    mpv: '7-14',
    pLcr: '13-43',
    pct: '0.1-0.5',
    lymph_rel: '19-40',
    lymph_abs: '1.32-3.57',
    mono_rel: '3-11',
    mono_abs: '0.3-0.82',
    hct: '35-55',
    hgb: '130-160',
    rbc: '4.0-5.5',
    mcv: undefined,
    mch: '27-35',
    mchc: undefined,
    wbc: '4-9',
    neut_abs: '1.78-5.38',
    eo_abs: '0.04-0.54',
    baso_abs: '0.01-0.08',
  },
  female: {
    esr: undefined,
    plt: '150-450',
    rdwSd: '11-16',
    pdw: '10-20',
    mpv: '7-14',
    pLcr: '13-43',
    pct: '0.1-0.5',
    lymph_rel: '19-40',
    lymph_abs: '1.18-3.74',
    mono_rel: '3-11',
    mono_abs: '0.24-0.82',
    hct: '33-50',
    hgb: '120-150',
    rbc: '3.5-4.7',
    mcv: undefined,
    mch: '27-35',
    mchc: undefined,
    wbc: '4-9',
    neut_abs: '1.56-6.13',
    eo_abs: '0.04-0.36',
    baso_abs: '0.01-0.08',
  },
};

@Injectable()
export class NormOfAnalysisService {
  getNormAnalysis(user: User): IAnalysisNorm {
    const age = this.getAge(user);
    const isMale = user.gender === 'male';

    const norma = isMale
      ? BASE_NORM_OF_ANALYSIS.male
      : BASE_NORM_OF_ANALYSIS.female;

    norma.esr = this.getESR(age, isMale);
    norma.mcv = this.getMCV(age, isMale);
    norma.mchc = age > 60 ? '320-360' : '300-380';

    return norma;
  }

  private getAge(user: User): number {
    const today = new Date();
    return today.getFullYear() - user.birthdate.getFullYear();
  }

  private getESR(age: number, isMale: boolean): string {
    if (isMale && age <= 50) {
      return '1-15';
    }

    if (isMale && age > 50) {
      return '1-20';
    }

    if (!isMale && age <= 50) {
      return '1-20';
    }

    if (!isMale && age > 50) {
      return '1-30';
    }

    throw new Error('Failed to determine the rate for ESR');
  }

  private getMCV(age: number, isMale: boolean): string {
    if (isMale && age <= 60) {
      return '73-99';
    }

    if (isMale && age > 60) {
      return '76-102';
    }

    if (!isMale && age <= 60) {
      return '73-100';
    }

    if (!isMale && age > 60) {
      return '76-102';
    }

    throw new Error('Failed to determine the rate for MCV');
  }
}
