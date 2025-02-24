export enum SquadPosition {
  FRONT = 'FRONT',
  BACK = 'BACK',
}

export enum AttackMethod {
  MELEE = 'MELEE',
  LONG_RANGE = 'LONG_RANGE',
}

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  SHIELD = 'shield',
  SCROLL = 'scroll',
}

export enum WeaponHandType {
  ONE_HAND = 'ONE_HAND',
  TWO_HAND = 'TWO_HAND',
}

export enum OneHandWeaponType {
  SWORD = 'SWORD',
  AXE = 'AXE',
  MACE = 'MACE',
}

export enum TwoHandWeaponType {
  GREAT_SWORD = 'GREAT_SWORD',
  GREAT_AXE = 'GREAT_AXE',
  GREAT_MACE = 'GREAT_MACE',
  LANCE = 'LANCE',
  HALBERD = 'HALBERD',
}

export enum StaffWeaponType {
  STAFF = 'STAFF',
}

export enum LongRangeWeaponType {
  BOW = 'BOW',
  CROSSBOW = 'CROSSBOW',
}

export enum CharacterLevel {
  ROOKIE = 'ROOKIE',
  ORDINARY = 'ORDINARY',
  VETERAN = 'VETERAN',
  ELITE = 'ELITE',
  LEGENDARY = 'LEGENDARY',
}

export enum CharacterBaseProperty {
  strength = 'strength',
  agility = 'agility',
  endurance = 'endurance',
  intelligence = 'intelligence',
  spirit = 'spirit',
  perception = 'perception',
  luck = 'luck',
  charm = 'charm',
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

export enum MissionDifficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export const difficultyRankMap: { [key in MissionDifficulty]: number } = {
  EASY: 0,
  NORMAL: 1,
  HARD: 2,
  EPIC: 3,
  LEGENDARY: 4,
};

/**
 * New Proficiency system with 5 levels.
 */
export enum ProficiencyLevel {
  NOVICE = 'NOVICE',
  APPRENTICE = 'APPRENTICE',
  JOURNEYMAN = 'JOURNEYMAN',
  EXPERT = 'EXPERT',
  MASTER = 'MASTER',
}
