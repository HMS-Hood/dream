import { CharacterLevel, QualityLevel } from '../enums';
import { BattleConfig } from '../interfaces';
import { QualityNumber } from './param';

// Base values for combat stats
export const baseCombatStats = {
  health: 200,
  hitRate: 0.75,
  dodgeRate: 0.05,
  blockRate: 0.3,
  parryRate: 0.05,
  criticalRate: 0.05,
  criticalDamage: 1.5,
  attackSpeed: 5.0,
};

// Level modifiers for combat stats (percentage)
export const levelModifiers: { [key in CharacterLevel]: number } = {
  [CharacterLevel.ROOKIE]: -0.2, // -20%
  [CharacterLevel.ORDINARY]: 0, // 0%
  [CharacterLevel.VETERAN]: 0.2, // +20%
  [CharacterLevel.ELITE]: 0.5, // +50%
  [CharacterLevel.LEGENDARY]: 1.0, // +100%
};

// Non-linear attribute scaling function
// x is the attribute value (e.g. strength)
// returns a multiplier between 0 and 2 (0% to 200%)
export function calculateAttributeModifier(value: number): number {
  // Using a sigmoid-like function for non-linear scaling
  // Assuming max attribute is 20 (from qualityAttributeRanges)
  return (value * value + 10 * value) / 300;
}

export const defaultBattleConfig: BattleConfig = {
  battlefieldWidth: 20, // 每方最多3支部队同时参战
  battleTimeLimit: 100, // 战斗时限
  standardInterval: 40,
  positionWeight: {
    front: 4, // 前排权重最高
    back: 1,
  },
  interval: 0,
};

export const baseMemberLimit = 5;

export const charmQualityAdjustMemberLimit: QualityNumber = {
  [QualityLevel.F]: 0,
  [QualityLevel.E]: 0,
  [QualityLevel.D]: 0,
  [QualityLevel.C]: 0,
  [QualityLevel.B]: 1,
  [QualityLevel.A]: 3,
  [QualityLevel.S]: 7,
  [QualityLevel.SS]: 11,
  [QualityLevel.SSS]: 15,
};

export const baseSquadLimit = 6;

export const charmQualityAdjustSquadLimit: QualityNumber = {
  [QualityLevel.F]: 0,
  [QualityLevel.E]: 0,
  [QualityLevel.D]: 0,
  [QualityLevel.C]: 0,
  [QualityLevel.B]: 1,
  [QualityLevel.A]: 3,
  [QualityLevel.S]: 6,
  [QualityLevel.SS]: 9,
  [QualityLevel.SSS]: 12,
};

export const energySetting = {
  base: 25,
  lowerLimit: -25,
  upperLimit: 100,
  attackConsume: 10,
  dodgeConsume: 2,
  parryConsume: 5,
  blockConsume: 5,
  beHitConsume: 10,
  criticalConsume: 20,
  counterConsume: 5,
  counterDodgeConsume: 1,
  counterParryConsume: 2,
  counterBlockConsume: 2,
  counterBeHitConsume: 5,
};
