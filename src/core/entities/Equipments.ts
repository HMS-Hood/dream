import { WeaponHandType } from '../enums';
import {
  Armor,
  LongRangeWeapon,
  MiddleRangeWeapon,
  OneHandWeapon,
  Shield,
  TwoHandWeapon,
} from '../interfaces/item';

/* eslint-disable import/prefer-default-export */
export class Equipments {
  weapon?: OneHandWeapon | TwoHandWeapon | MiddleRangeWeapon;

  longRangeWeapon?: LongRangeWeapon;

  shield?: Shield;

  armor?: Armor;

  setWeapon(weapon: OneHandWeapon | TwoHandWeapon | MiddleRangeWeapon) {
    if (weapon.handType === WeaponHandType.TWO_HAND) {
      this.shield = undefined;
      this.longRangeWeapon = undefined;
    }
    this.weapon = weapon;
  }

  setRangeWeapon(weapon: LongRangeWeapon) {
    if (weapon.handType === WeaponHandType.TWO_HAND) {
      this.weapon = undefined;
    }
    this.shield = undefined;
    this.longRangeWeapon = weapon;
  }

  setShield(shield: Shield) {
    if (this.weapon?.handType === WeaponHandType.TWO_HAND) {
      this.weapon = undefined;
    }
    this.longRangeWeapon = undefined;
    this.shield = shield;
  }

  setArmor(armor: Armor) {
    this.armor = armor;
  }
}
