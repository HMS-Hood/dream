import { AttackMethod, CharacterLevel, QualityLevel } from '../enums';
import { CharacterInterface, Skill } from '../interfaces';
import { Equipments } from './Equipments';

/* eslint-disable import/prefer-default-export */
export class Character implements CharacterInterface {
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

  constructor(initParam: CharacterInterface) {
    this.id = initParam.id;
    this.name = initParam.name;
    this.nickName = initParam.nickName;
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
    this.equipment = initParam.equipment;
  }
}
