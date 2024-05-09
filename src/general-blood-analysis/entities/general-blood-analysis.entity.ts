import { GeneralBloodAnalysis } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class GeneralBloodAnalysisEntity implements GeneralBloodAnalysis {
  baso_abs: number | null;
  createdAt: Date;
  eo_abs: number | null;
  esr: number | null;
  hct: number | null;
  hgb: number | null;
  id: number;
  lymph_rel: number | null;
  lymph_abs: number | null;
  mch: number | null;
  mchc: number | null;
  mcv: number | null;
  mono_rel: number | null;
  mono_abs: number | null;
  mpv: number | null;
  neut_abs: number | null;
  pLcr: number | null;
  pct: number | null;
  pdw: number | null;
  plt: number | null;
  rbc: number | null;
  rdwSd: number | null;
  updatedAt: Date;
  wbc: number | null;

  @Exclude()
  userId: number;

  constructor(partial: Partial<GeneralBloodAnalysisEntity>) {
    Object.assign(this, partial);
  }
}
