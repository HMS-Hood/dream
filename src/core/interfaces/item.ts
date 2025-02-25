import {
  AttackMethod,
  ItemType,
  QualityLevel,
  WeaponHandType,
  OneHandWeaponType,
  TwoHandWeaponType,
  LongRangeWeaponType,
  StaffWeaponType,
  CharacterBaseProperty,
} from '../enums';

export interface ItemKey {
  desc: string;
  effect: any;
}

export interface BasePropertyModifier {
  property: CharacterBaseProperty;
  value: number;
}

export interface BasePropertyLimit {
  property: CharacterBaseProperty;
  minValue?: number;
  maxValue?: number;
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
  modifier: BasePropertyModifier[];
  limit: BasePropertyLimit[];
}

export interface Weapon extends Item {
  minDamage: number;
  maxDamage: number;
  handType: WeaponHandType;
  attackMethod: AttackMethod;
  weaponType:
    | OneHandWeaponType
    | TwoHandWeaponType
    | LongRangeWeaponType
    | StaffWeaponType;
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

export interface StaffWeapon extends Weapon {
  handType: WeaponHandType.TWO_HAND;
  attackMethod: AttackMethod.MELEE;
  weaponType: StaffWeaponType;
  modifier: [{ property: CharacterBaseProperty.intelligence; value: number }];
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
  limit: [{ property: CharacterBaseProperty.strength; minValue: number }];
  modifier: [{ property: CharacterBaseProperty.agility; value: number }];
  defence: number;
}

export interface Chain extends Armor {
  limit: [{ property: CharacterBaseProperty.strength; minValue: number }];
  defence: number;
}

export interface Leather extends Armor {
  defence: number;
  modifier: [{ property: CharacterBaseProperty.agility; value: number }];
}

export interface Robe extends Armor {
  defence: number;
  modifier: [{ property: CharacterBaseProperty.intelligence; value: number }];
}
