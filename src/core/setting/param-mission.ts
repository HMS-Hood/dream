/* eslint-disable import/prefer-default-export */
import { CharacterLevel, MissionDifficulty, QualityLevel } from '../enums';
import {
  QualityCharacterLevel,
  QualityNumber,
  QualityQuality,
  QualityWeight,
} from './param';

export const missionQualityBaseReward: QualityNumber = {
  [QualityLevel.F]: 100,
  [QualityLevel.E]: 500,
  [QualityLevel.D]: 1000,
  [QualityLevel.C]: 2000,
  [QualityLevel.B]: 5000,
  [QualityLevel.A]: 10000,
  [QualityLevel.S]: 50000,
  [QualityLevel.SS]: 100000,
  [QualityLevel.SSS]: 200000,
};

export const missionDropQualityWeight: QualityWeight = {
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

export const missionDropCountWeight: { [dorpNumber: number]: number } = {
  1: 160,
  2: 80,
  3: 40,
  4: 20,
  5: 10,
  6: 8,
  7: 5,
  8: 2,
};

export const missionQualityEnimyCount: QualityNumber = {
  [QualityLevel.F]: 10,
  [QualityLevel.E]: 20,
  [QualityLevel.D]: 40,
  [QualityLevel.C]: 60,
  [QualityLevel.B]: 100,
  [QualityLevel.A]: 150,
  [QualityLevel.S]: 300,
  [QualityLevel.SS]: 500,
  [QualityLevel.SSS]: 800,
};

export const missionQualityEnimyLevel: QualityCharacterLevel = {
  [QualityLevel.F]: CharacterLevel.ROOKIE,
  [QualityLevel.E]: CharacterLevel.ROOKIE,
  [QualityLevel.D]: CharacterLevel.ROOKIE,
  [QualityLevel.C]: CharacterLevel.ORDINARY,
  [QualityLevel.B]: CharacterLevel.ORDINARY,
  [QualityLevel.A]: CharacterLevel.VETERAN,
  [QualityLevel.S]: CharacterLevel.ELITE,
  [QualityLevel.SS]: CharacterLevel.ELITE,
  [QualityLevel.SSS]: CharacterLevel.ELITE,
};

export const missionQualityLowQuality: QualityQuality = {
  [QualityLevel.F]: QualityLevel.F,
  [QualityLevel.E]: QualityLevel.F,
  [QualityLevel.D]: QualityLevel.F,
  [QualityLevel.C]: QualityLevel.E,
  [QualityLevel.B]: QualityLevel.E,
  [QualityLevel.A]: QualityLevel.D,
  [QualityLevel.S]: QualityLevel.C,
  [QualityLevel.SS]: QualityLevel.C,
  [QualityLevel.SSS]: QualityLevel.C,
};

export const missionQualityRewardMagnification: QualityNumber = {
  [QualityLevel.F]: 2,
  [QualityLevel.E]: 1.5,
  [QualityLevel.D]: 1,
  [QualityLevel.C]: 0.7,
  [QualityLevel.B]: 0.4,
  [QualityLevel.A]: 0.2,
  [QualityLevel.S]: 0.1,
  [QualityLevel.SS]: 0.1,
  [QualityLevel.SSS]: 0.1,
};

export const missionDifficultyMagnification: {
  [key in MissionDifficulty]: [number, number];
} = {
  [MissionDifficulty.EASY]: [0.8, 1.2],
  [MissionDifficulty.NORMAL]: [1.2, 1.5],
  [MissionDifficulty.HARD]: [1.5, 2],
  [MissionDifficulty.EPIC]: [2, 3],
  [MissionDifficulty.LEGENDARY]: [3, 5],
};

type CountAddition = {
  0: number;
  1: number;
  2: number;
  3: number;
};

export const luckAndPerMissionDropRate: { [key: number]: CountAddition } = {
  10: {
    0: 100,
    1: 5,
    2: 0,
    3: 0,
  },
  11: {
    0: 100,
    1: 7,
    2: 0,
    3: 0,
  },
  12: {
    0: 100,
    1: 10,
    2: 0,
    3: 0,
  },
  13: {
    0: 100,
    1: 15,
    2: 1,
    3: 0,
  },
  14: {
    0: 100,
    1: 20,
    2: 2,
    3: 0,
  },
  15: {
    0: 100,
    1: 30,
    2: 2,
    3: 0,
  },
  16: {
    0: 100,
    1: 40,
    2: 4,
    3: 0,
  },
  17: {
    0: 100,
    1: 50,
    2: 7,
    3: 0,
  },
  18: {
    0: 100,
    1: 65,
    2: 10,
    3: 0,
  },
  19: {
    0: 100,
    1: 85,
    2: 15,
    3: 3,
  },
  20: {
    0: 80,
    1: 100,
    2: 20,
    3: 5,
  },
  21: {
    0: 60,
    1: 100,
    2: 30,
    3: 10,
  },
  22: {
    0: 40,
    1: 100,
    2: 40,
    3: 20,
  },
  23: {
    0: 20,
    1: 100,
    2: 50,
    3: 30,
  },
  24: {
    0: 10,
    1: 100,
    2: 60,
    3: 40,
  },
  25: {
    0: 0,
    1: 100,
    2: 70,
    3: 50,
  },
  26: {
    0: 0,
    1: 80,
    2: 80,
    3: 60,
  },
  27: {
    0: 0,
    1: 60,
    2: 90,
    3: 70,
  },
  28: {
    0: 0,
    1: 40,
    2: 100,
    3: 80,
  },
  29: {
    0: 0,
    1: 20,
    2: 100,
    3: 90,
  },
  30: {
    0: 0,
    1: 0,
    2: 100,
    3: 100,
  },
};
