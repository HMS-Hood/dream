import { AttackMethod, CharacterLevel, QualityLevel } from '../enums';
import { CharacterInterface, Skill } from '../interfaces';
import {
  Armor,
  OneHandWeapon,
  Shield,
  TwoHandWeapon,
} from '../interfaces/item';

/* eslint-disable import/prefer-default-export */
export class Character implements CharacterInterface {
  id: string;

  name: string;

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

  oneHandWeapon?: OneHandWeapon;

  twoHandWeapon?: TwoHandWeapon;

  shield?: Shield;

  armor?: Armor;

  constructor(initParam: CharacterInterface) {
    this.id = initParam.id;
    this.name = initParam.name;
    this.avatar = initParam.avatar;
    this.level = initParam.level;
    this.experience = initParam.experience;
    this.quality = initParam.quality;
    this.attackMethod = initParam.attackMethod;
    this.health = initParam.health;
    this.strength = initParam.strength;
    this.agility = initParam.agility;
    this.endurance = initParam.endurance;
    this.intelligence = initParam.intelligence;
    this.spirit = initParam.spirit;
    this.perception = initParam.perception;
    this.luck = initParam.luck;
    this.charm = initParam.charm;
    this.skills = initParam.skills;
  }

  setOneHandWeapon(weapon: OneHandWeapon) {
    if (this.twoHandWeapon) {
      this.twoHandWeapon = undefined;
    }
    this.oneHandWeapon = weapon;
  }

  setTwoHandWeapon(weapon: TwoHandWeapon) {
    if (this.oneHandWeapon) {
      this.oneHandWeapon = undefined;
    }
    if (this.shield) {
      this.shield = undefined;
    }
    this.twoHandWeapon = weapon;
  }

  setShield(shield: Shield) {
    if (this.twoHandWeapon) {
      this.twoHandWeapon = undefined;
    }
    this.shield = shield;
  }

  setArmor(armor: Armor) {
    this.armor = armor;
  }
}
