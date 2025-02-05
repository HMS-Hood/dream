import {
  AttackMethod,
  ItemType,
  QualityLevel,
  WeaponHandType,
  OneHandWeaponType,
  TwoHandWeaponType,
  MiddleRangeWeaponType,
  LongRangeWeaponType,
} from '../enums';

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
  type: ItemType;
}

export interface Weapon extends Item {
  minDamage: number;
  maxDamage: number;
  handType: WeaponHandType;
  attackMethod: AttackMethod;
  weaponType:
    | OneHandWeaponType
    | TwoHandWeaponType
    | MiddleRangeWeaponType
    | LongRangeWeaponType;
}

export interface OneHandWeapon extends Weapon {
  handType: WeaponHandType.ONE_HAND;
  attackMethod: AttackMethod.MELEE;
  weaponType: OneHandWeaponType;
}

export interface TwoHandWeapon extends Weapon {
  handType: WeaponHandType.TWO_HAND;
  attackMethod: AttackMethod.MELEE;
  weaponType: TwoHandWeaponType;
}

export interface MiddleRangeWeapon extends Weapon {
  handType: WeaponHandType.TWO_HAND;
  attackMethod: AttackMethod.MEDIUM_RANGE;
  weaponType: MiddleRangeWeaponType;
}

export interface LongRangeWeapon extends Weapon {
  handType: WeaponHandType.TWO_HAND;
  attackMethod: AttackMethod.LONG_RANGE;
  weaponType: LongRangeWeaponType;
}

export interface Shield extends Item {
  defence: number;
}

export interface Armor extends Item {
  defence: number;
}

export interface Plate extends Armor {
  strengthLimit: number;
  agilityDecrease: number;
  defence: number;
}

export interface Chain extends Armor {
  strengthLimit: number;
  defence: number;
}

export interface Leather extends Armor {
  defence: number;
  agilityIncrease: number;
}

export interface Robe extends Armor {
  defence: number;
  intelligenceIncrease: number;
}
