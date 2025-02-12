import { CharacterLevel } from '../enums';
import { BattleConfig } from '../interfaces';

// Base values for combat stats
export const baseCombatStats = {
  health: 200,
  hitRate: 0.75,
  dodgeRate: 0.05,
  criticalRate: 0.05,
  criticalDamage: 1.5,
  attackSpeed: 1.0,
  moveSpeed: 1.0,
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
  const normalized = value / 20;
  return 2 / (1 + Math.exp(-4 * (normalized - 0.5)));
}

export const defaultBattleConfig: BattleConfig = {
  battlefieldWidth: 3, // 每方最多3支部队同时参战
  battleTimeLimit: 100, // 战斗时限
  standardInterval: 40,
  positionWeight: {
    front: 4, // 前排权重最高
    middle: 2,
    back: 1,
  },
};
