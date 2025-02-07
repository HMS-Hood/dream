import { WeaponHandType } from '../enums';
import { Armor, Shield, Weapon } from '../interfaces/item';

/* eslint-disable import/prefer-default-export */
export class Equipments {
  weapon?: Weapon;

  shield?: Shield;

  armor?: Armor;

  setWeapon(weapon: Weapon) {
    if (weapon.handType === WeaponHandType.TWO_HAND) {
      this.shield = undefined;
    }
    this.weapon = weapon;
  }

  setShield(shield: Shield) {
    if (this.weapon?.handType === WeaponHandType.TWO_HAND) {
      this.weapon = undefined;
    }
    this.shield = shield;
  }

  setArmor(armor: Armor) {
    this.armor = armor;
  }
}
