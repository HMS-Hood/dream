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

  setWeapon(weapon: Weapon): (Weapon | Shield | Armor)[] {
    const returnItem: (Weapon | Shield | Armor)[] = [];
    if (weapon.handType === WeaponHandType.TWO_HAND) {
      if (this.shield) returnItem.push(this.shield);
      this.shield = undefined;
    }
    if (this.weapon) returnItem.push(this.weapon);
    this.weapon = weapon;
    return returnItem;
  }

  setShield(shield: Shield): (Weapon | Shield | Armor)[] {
    const returnItem: (Weapon | Shield | Armor)[] = [];
    if (this.weapon?.handType === WeaponHandType.TWO_HAND) {
      if (this.weapon) returnItem.push(this.weapon);
      this.weapon = undefined;
    }
    if (this.shield) returnItem.push(this.shield);
    this.shield = shield;
    return returnItem;
  }

  setArmor(armor: Armor): (Weapon | Shield | Armor)[] {
    const returnItem: (Weapon | Shield | Armor)[] = [];
    if (this.armor) returnItem.push(this.armor);
    this.armor = armor;
    return returnItem;
  }

  reload(loadData: IEquipments) {
    this.weapon = loadData.weapon;
    this.shield = loadData.shield;
    this.armor = loadData.armor;
  }
}
