import { AttackMethod, CharacterLevel, QualityLevel } from '../enums';
import { CharacterInitialData, CharacterInterface, Skill } from '../interfaces';
import { getQualityForValue } from '../utils/utils';
import { Equipments } from './Equipments';

/* eslint-disable import/prefer-default-export */
export class Character implements CharacterInterface {
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

  equipment: Equipments = new Equipments();

  constructor(initParam: CharacterInitialData) {
    this.id = initParam.id;
    this.name = initParam.name;
    this.nickName = initParam.nickName;
    this.avatar = initParam.avatar;
    this.level = initParam.level;
    this.experience = initParam.experience;
    this.strength = initParam.strength;
    this.agility = initParam.agility;
    this.endurance = initParam.endurance;
    this.intelligence = initParam.intelligence;
    this.spirit = initParam.spirit;
    this.perception = initParam.perception;
    this.luck = initParam.luck;
    this.charm = initParam.charm;
    this.skills = initParam.skills;
    this.equipment.reload(initParam.equipment);
  }

  get attackMethod(): AttackMethod {
    return this.equipment?.weapon?.attackMethod || AttackMethod.MELEE;
  }

  get quality(): QualityLevel {
    const qualities = [
      getQualityForValue(this.strength),
      getQualityForValue(this.agility),
      getQualityForValue(this.endurance),
      getQualityForValue(this.spirit),
      getQualityForValue(this.intelligence),
      getQualityForValue(this.charm),
      getQualityForValue(this.luck),
      getQualityForValue(this.perception),
    ];

    return qualities.reduce((highest, current) => {
      if (
        Object.values(QualityLevel).indexOf(current) >
        Object.values(QualityLevel).indexOf(highest)
      ) {
        return current;
      }
      return highest;
    }, QualityLevel.F);
  }

  // 获取当前等级所需的升级经验
  getLevelUpExperience(): number {
    const baseExperience = 100;
    const currentLevelIndex = Object.values(CharacterLevel).indexOf(this.level);
    return baseExperience * 10 ** currentLevelIndex;
  }

  // 检查是否可以升级
  canLevelUp(): boolean {
    return this.experience >= this.getLevelUpExperience();
  }

  // 升级方法
  levelUp(): boolean {
    if (!this.canLevelUp()) {
      return false;
    }

    const currentLevelIndex = Object.values(CharacterLevel).indexOf(this.level);
    const nextLevel = Object.values(CharacterLevel)[currentLevelIndex + 1];

    if (!nextLevel) {
      return false; // 已达到最高等级
    }

    this.experience -= this.getLevelUpExperience();
    this.level = nextLevel;

    return true;
  }

  // 添加经验值
  addExperience(amount: number): void {
    this.experience += amount;
    // 检查是否可以连续升级
    while (this.canLevelUp()) {
      if (!this.levelUp()) {
        break;
      }
    }
  }

  // 获取下一级所需经验
  getNextLevelExperience(): number {
    return this.getLevelUpExperience();
  }

  // 获取当前等级进度
  getLevelProgress(): number {
    return Math.min(100, (this.experience / this.getLevelUpExperience()) * 100);
  }
}
