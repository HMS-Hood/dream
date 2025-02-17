import { Equipments } from '../entities/Equipments';
import { AttackMethod, CharacterLevel, QualityLevel } from '../enums';

export interface Skill {
  name: string;
  Effect: any;
}

export interface CharacterInitialData {
  id: string;
  name: string;
  nickName: string;
  avatar: string;
  level: CharacterLevel;
  experience: number;
  health: number;
  strength: number;
  agility: number;
  endurance: number;
  intelligence: number;
  spirit: number;
  perception: number;
  luck: number;
  charm: number;
  skills: Skill[];
  equipment: Equipments;
}

export interface CharacterInterface {
  id: string;
  name: string;
  nickName: string;
  avatar: string;
  level: CharacterLevel;
  experience: number;
  quality: QualityLevel;
  attackMethod: AttackMethod;
  health: number;
  strength: number;
  agility: number;
  endurance: number;
  intelligence: number;
  spirit: number;
  perception: number;
  luck: number;
  charm: number;
  skills: Skill[];
  equipment: Equipments;
  getLevelUpExperience(): number;
  canLevelUp(): boolean;
  levelUp(): boolean;
  addExperience(amount: number): void;
  getNextLevelExperience(): number;
  getLevelProgress(): number;
}

export interface CheckCharacter {
  character: CharacterInterface;
  checked: boolean;
}

export interface Question {
  name: string;
  desc: string;
  quality: QualityLevel;
}

export interface BattleConfig {
  battlefieldWidth: number; // 战场宽度，决定每方最多上场部队数
  battleTimeLimit: number; // 每场战斗的时间限制
  standardInterval: number;
  positionWeight: {
    // 不同位置的选中权重
    front: number;
    middle: number;
    back: number;
  };
}

export interface CombatStats {
  currentHealth: number;
  isDead: boolean;
  maxHealth: number;
  physicalAttack: number;
  physicalDefense: number;
  magicalAttack: number;
  magicalDefense: number;
  hitRate: number;
  blockRate: number;
  blockValue: number;
  parryRate: number;
  dodgeRate: number;
  criticalRate: number;
  criticalDamage: number;
  attackSpeed: number;

  takeDamage(damage: number): void;
  heal(amount: number): void;
  getAttackRange(): number;
  getCharacter(): CharacterInterface;
  updateStats(): void;
  name: string;
}
