import { WeaponHandType } from '../enums';
import { Armor, Shield, Weapon } from '../interfaces/item';

export interface IEquipments {
  weapon?: Weapon;
  shield?: Shield;
  armor?: Armor;
}

/* eslint-disable import/prefer-default-export */
export class Equipments implements IEquipments {
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

  reload(loadData: IEquipments) {
    this.weapon = loadData.weapon;
    this.shield = loadData.shield;
    this.armor = loadData.armor;
  }
}
