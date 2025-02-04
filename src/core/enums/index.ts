export enum SquadPosition {
  FRONT,
  MIDDLE,
  BACK,
}

export enum AttackMethod {
  MELEE,
  MEDIUM_RANGE,
  LONG_RANGE,
}

export enum CharacterLevel {
  ROOKIE = 'ROOKIE',
  ORDINARY = 'ORDINARY',
  VETERAN = 'VETERAN',
  ELITE = 'ELITE',
  LEGENDARY = 'LEGENDARY',
}

export enum QualityLevel {
  F = 'F',
  E = 'E',
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S = 'S',
  SS = 'SS',
  SSS = 'SSS',
}

export const qualityRankMap: { [key in QualityLevel]: number } = {
  F: 0,
  E: 1,
  D: 2,
  C: 3,
  B: 4,
  A: 5,
  S: 6,
  SS: 7,
  SSS: 8,
};
