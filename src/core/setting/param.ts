import { QualityLevel } from '../enums';

export type QualityWeight = {
  [key in QualityLevel]: number;
};

export type QualityRange = {
  [key in QualityLevel]: [number, number];
};

/**
 * Weights for each quality level.
 */
export const qualityWeights: QualityWeight = {
  [QualityLevel.F]: 30,
  [QualityLevel.E]: 40,
  [QualityLevel.D]: 20,
  [QualityLevel.C]: 8,
  [QualityLevel.B]: 2,
  [QualityLevel.A]: 0.1,
  [QualityLevel.S]: 0.01,
  [QualityLevel.SS]: 0.001,
  [QualityLevel.SSS]: 0.00001,
};

/**
 * Attribute ranges for each quality level.
 */
export const qualityAttributeRanges: QualityRange = {
  [QualityLevel.F]: [5, 6],
  [QualityLevel.E]: [7, 8],
  [QualityLevel.D]: [9, 10],
  [QualityLevel.C]: [11, 12],
  [QualityLevel.B]: [13, 14],
  [QualityLevel.A]: [15, 16],
  [QualityLevel.S]: [17, 18],
  [QualityLevel.SS]: [19, 19],
  [QualityLevel.SSS]: [20, 20],
};

export const maxAvatarIndex = 61;
