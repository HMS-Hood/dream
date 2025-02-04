/* eslint-disable import/prefer-default-export */
import { QualityLevel } from '../enums';
import { QualityRange, QualityWeight } from './param';

export const qualityQuestRewardRange: QualityRange = {
  [QualityLevel.F]: [50, 100],
  [QualityLevel.E]: [100, 200],
  [QualityLevel.D]: [200, 500],
  [QualityLevel.C]: [500, 1000],
  [QualityLevel.B]: [1000, 5000],
  [QualityLevel.A]: [5000, 15000],
  [QualityLevel.S]: [15000, 40000],
  [QualityLevel.SS]: [40000, 100000],
  [QualityLevel.SSS]: [100000, 1000000],
};

export const questDropWeight: QualityWeight = {
  [QualityLevel.F]: 1,
  [QualityLevel.E]: 1,
  [QualityLevel.D]: 2,
  [QualityLevel.C]: 4,
  [QualityLevel.B]: 8,
  [QualityLevel.A]: 16,
  [QualityLevel.S]: 32,
  [QualityLevel.SS]: 32,
  [QualityLevel.SSS]: 32,
};

export const questDropNumberWeight: { [dorpNumber: number]: number } = {
  1: 16,
  2: 8,
  3: 2,
  4: 1,
};
