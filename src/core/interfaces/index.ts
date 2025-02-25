import { Equipments } from '../entities/Equipments';
import {
  AttackMethod,
  CharacterLevel,
  QualityLevel,
  ProficiencyLevel,
  OneHandWeaponType,
  TwoHandWeaponType,
  StaffWeaponType,
  LongRangeWeaponType,
  CharacterBaseProperty,
} from '../enums';
import { Item } from './item';

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

/**
 * 熟练度数据结构，用于存储单个武器或盾牌的熟练度等级及经验值。
 */
export interface ProficiencyData {
  level: ProficiencyLevel;
  experience: number;
}

/**
 * 熟练度类型，此处每种武器均单独计数（例如单手剑、单手斧、单手锤、双手大剑等），
 * 盾牌用字符串 "shield" 表示。
 */
export type ProficiencyType =
  | OneHandWeaponType
  | TwoHandWeaponType
  | StaffWeaponType
  | LongRangeWeaponType
  | 'shield';

export interface ICharacter {
  id: string;
  name: string;
  nickName: string;
  avatar: string;
  level: CharacterLevel;
  experience: number;
  quality: QualityLevel;
  attackMethod: AttackMethod;
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
  total: number;
  fightStatistic: number;
  smallAvatar: string;
  getLevelUpExperience(): number;
  canLevelUp(): boolean;
  levelUp(): boolean;
  addExperience(amount: number): void;
  getNextLevelExperience(): number;
  getLevelProgress(): number;

  // 每个具体武器类型及盾牌的熟练度
  proficiency: {
    oneHandWeapon: { [key in OneHandWeaponType]: ProficiencyData };
    twoHandWeapon: { [key in TwoHandWeaponType]: ProficiencyData };
    staffWeapon: { [key in StaffWeaponType]: ProficiencyData };
    longRangeWeapon: { [key in LongRangeWeaponType]: ProficiencyData };
    shield: ProficiencyData;
  };

  // 新增熟练度方法：增加熟练度经验、尝试升级熟练度，以及获得当前熟练度升级所需经验
  addProficiencyExperience(type: ProficiencyType, amount: number): void;
  upgradeProficiency(type: ProficiencyType): boolean;
  getProficiencyExpRequirement(type: ProficiencyType): number;
  addWeaponProficiencyExperience(amount: number): void;
  addShieldProficiencyExperience(amount: number): void;
}

export interface CheckCharacter {
  character: ICharacter;
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
    back: number;
  };
  interval: number; // 在执行时中间是否有短暂的暂停（毫秒），用于刷新同步显示。为0则不暂停
}

export interface ICombatUnit {
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
  penetrate: number;

  takeDamage(damage: number): void;
  heal(amount: number): void;
  getAttackRange(): number;
  getCharacter(): ICharacter;
  updateStats(): void;
  name: string;
  addExperience(amount: number): void;
  addWeaponProficiencyExperience(amount: number): void;
  addShieldProficiencyExperience(amount: number): void;
}

export interface IPropertyCrystal extends Item {
  baseProperty: CharacterBaseProperty;
  ifEffective: (character: ICharacter) => boolean;
  use: (character: ICharacter) => void;
}

export interface PropertyCrystalInitData {
  baseProperty: CharacterBaseProperty;
  quality: QualityLevel;
}
