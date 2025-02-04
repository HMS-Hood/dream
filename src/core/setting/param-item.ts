import { QualityLevel } from '../enums';
import { QualityRange } from './param';

export const qualityDamageRanges: QualityRange = {
  [QualityLevel.F]: [5, 5],
  [QualityLevel.E]: [6, 6],
  [QualityLevel.D]: [7, 7],
  [QualityLevel.C]: [8, 8],
  [QualityLevel.B]: [9, 10],
  [QualityLevel.A]: [11, 12],
  [QualityLevel.S]: [13, 14],
  [QualityLevel.SS]: [15, 17],
  [QualityLevel.SSS]: [18, 20],
};

export const qualityTwoHandDamageRanges: QualityRange = {
  [QualityLevel.F]: [7, 7],
  [QualityLevel.E]: [8, 8],
  [QualityLevel.D]: [9, 10],
  [QualityLevel.C]: [11, 12],
  [QualityLevel.B]: [13, 15],
  [QualityLevel.A]: [16, 18],
  [QualityLevel.S]: [19, 22],
  [QualityLevel.SS]: [23, 26],
  [QualityLevel.SSS]: [27, 30],
};

export const qualityShieldRanges: QualityRange = {
  [QualityLevel.F]: [2, 2],
  [QualityLevel.E]: [3, 3],
  [QualityLevel.D]: [4, 4],
  [QualityLevel.C]: [4, 5],
  [QualityLevel.B]: [6, 7],
  [QualityLevel.A]: [8, 10],
  [QualityLevel.S]: [11, 15],
  [QualityLevel.SS]: [16, 20],
  [QualityLevel.SSS]: [21, 25],
};

export const qualityPlateRanges: QualityRange = {
  [QualityLevel.F]: [5, 5],
  [QualityLevel.E]: [6, 6],
  [QualityLevel.D]: [7, 8],
  [QualityLevel.C]: [9, 10],
  [QualityLevel.B]: [11, 15],
  [QualityLevel.A]: [16, 20],
  [QualityLevel.S]: [21, 30],
  [QualityLevel.SS]: [31, 40],
  [QualityLevel.SSS]: [41, 50],
};

export const qualityLeatherRanges: QualityRange = {
  [QualityLevel.F]: [3, 3],
  [QualityLevel.E]: [4, 4],
  [QualityLevel.D]: [5, 5],
  [QualityLevel.C]: [6, 7],
  [QualityLevel.B]: [8, 10],
  [QualityLevel.A]: [11, 13],
  [QualityLevel.S]: [14, 16],
  [QualityLevel.SS]: [17, 19],
  [QualityLevel.SSS]: [20, 25],
};

export const qualityLeatherAgiRanges: QualityRange = {
  [QualityLevel.F]: [1, 1],
  [QualityLevel.E]: [2, 2],
  [QualityLevel.D]: [3, 3],
  [QualityLevel.C]: [4, 4],
  [QualityLevel.B]: [5, 6],
  [QualityLevel.A]: [7, 8],
  [QualityLevel.S]: [9, 10],
  [QualityLevel.SS]: [11, 12],
  [QualityLevel.SSS]: [13, 15],
};

export const qualityRobeRanges: QualityRange = {
  [QualityLevel.F]: [1, 1],
  [QualityLevel.E]: [2, 2],
  [QualityLevel.D]: [3, 3],
  [QualityLevel.C]: [4, 4],
  [QualityLevel.B]: [5, 5],
  [QualityLevel.A]: [6, 7],
  [QualityLevel.S]: [8, 9],
  [QualityLevel.SS]: [10, 11],
  [QualityLevel.SSS]: [12, 15],
};

export const qualityRobeIntellRanges: QualityRange = {
  [QualityLevel.F]: [1, 1],
  [QualityLevel.E]: [2, 2],
  [QualityLevel.D]: [3, 3],
  [QualityLevel.C]: [4, 5],
  [QualityLevel.B]: [6, 7],
  [QualityLevel.A]: [8, 10],
  [QualityLevel.S]: [11, 13],
  [QualityLevel.SS]: [14, 16],
  [QualityLevel.SSS]: [17, 20],
};
