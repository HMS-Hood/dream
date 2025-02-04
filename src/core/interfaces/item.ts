import { AttackMethod, QualityLevel } from '../enums';

export interface ItemKey {
  desc: string;
  effect: any;
}

export interface Item {
  name: string;
  /**
   * 价值
   */
  value: number;
  img: string;
  quality: QualityLevel;
  keys: ItemKey[];
}

export interface Weapon extends Item {
  minDamage: number;
  maxDamage: number;
  attackMethod: AttackMethod;
}

export interface OneHandWeapon extends Weapon {
  type: 'one-hand';
}

export interface RangeWeapon extends Weapon {
  type: 'range';
}

export interface TwoHandWeapon extends Weapon {
  type: 'two-hand';
}

export interface Shield extends Item {
  defence: number;
}

export interface Armor extends Item {
  defence: number;
}

export interface Plate extends Armor {
  defence: number;
}

export interface Leather extends Armor {
  defence: number;
  agility: number;
}

export interface Robe extends Armor {
  defence: number;
  intelligence: number;
}
