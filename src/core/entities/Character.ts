import {
  AttackMethod,
  CharacterLevel,
  QualityLevel,
  ProficiencyLevel,
  OneHandWeaponType,
  TwoHandWeaponType,
  StaffWeaponType,
  LongRangeWeaponType,
} from '../enums';
import {
  CharacterInitialData,
  ICharacter,
  Skill,
  ProficiencyType,
} from '../interfaces';
import { getQualityForValue } from '../utils/utils';
import { Equipments } from './Equipments';
import { proficiencyExpRequirements } from '../setting/param';

/* eslint-disable import/prefer-default-export */
export class Character implements ICharacter {
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

  // 每种武器具体熟练度：单手武器、双手武器、法杖、远程武器及盾牌
  public proficiency: {
    oneHandWeapon: {
      [key in OneHandWeaponType]: {
        level: ProficiencyLevel;
        experience: number;
      };
    };
    twoHandWeapon: {
      [key in TwoHandWeaponType]: {
        level: ProficiencyLevel;
        experience: number;
      };
    };
    staffWeapon: {
      [key in StaffWeaponType]: { level: ProficiencyLevel; experience: number };
    };
    longRangeWeapon: {
      [key in LongRangeWeaponType]: {
        level: ProficiencyLevel;
        experience: number;
      };
    };
    shield: { level: ProficiencyLevel; experience: number };
  };

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

    // 为每种具体武器初始化熟练度，初始等级均为 NOVICE，经验 0
    this.proficiency = {
      oneHandWeapon: {
        [OneHandWeaponType.SWORD]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
        [OneHandWeaponType.AXE]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
        [OneHandWeaponType.MACE]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
      },
      twoHandWeapon: {
        [TwoHandWeaponType.GREAT_SWORD]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
        [TwoHandWeaponType.GREAT_AXE]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
        [TwoHandWeaponType.GREAT_MACE]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
        [TwoHandWeaponType.LANCE]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
        [TwoHandWeaponType.HALBERD]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
      },
      staffWeapon: {
        [StaffWeaponType.STAFF]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
      },
      longRangeWeapon: {
        [LongRangeWeaponType.BOW]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
        [LongRangeWeaponType.CROSSBOW]: {
          level: ProficiencyLevel.NOVICE,
          experience: 0,
        },
      },
      shield: { level: ProficiencyLevel.NOVICE, experience: 0 },
    };
  }

  get attackMethod(): AttackMethod {
    return this.equipment?.weapon?.attackMethod || AttackMethod.MELEE;
  }

  get total(): number {
    return (
      this.strength +
      this.agility +
      this.endurance +
      this.perception +
      this.spirit +
      this.intelligence +
      this.charm +
      this.luck
    );
  }

  get fightStatistic(): number {
    return this.strength + this.agility + this.endurance + this.perception;
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

  get smallAvatar() {
    return this.avatar.replace('.png', '_s.png');
  }

  // 获取当前等级所需升级经验
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

  // 添加经验值并尝试连续升级
  addExperience(amount: number): void {
    this.experience += amount;
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

  // 获取当前等级进度百分比
  getLevelProgress(): number {
    return Math.min(100, (this.experience / this.getLevelUpExperience()) * 100);
  }

  /**
   * 私有方法，根据传入的武器/盾牌类型，返回相应的熟练度数据对象。
   */
  private getProficiencyData(type: ProficiencyType): {
    level: ProficiencyLevel;
    experience: number;
  } {
    if (type === 'shield') return this.proficiency.shield;
    if (
      type === OneHandWeaponType.SWORD ||
      type === OneHandWeaponType.AXE ||
      type === OneHandWeaponType.MACE
    ) {
      return this.proficiency.oneHandWeapon[type as OneHandWeaponType];
    }
    if (
      type === TwoHandWeaponType.GREAT_SWORD ||
      type === TwoHandWeaponType.GREAT_AXE ||
      type === TwoHandWeaponType.GREAT_MACE ||
      type === TwoHandWeaponType.LANCE ||
      type === TwoHandWeaponType.HALBERD
    ) {
      return this.proficiency.twoHandWeapon[type as TwoHandWeaponType];
    }
    if (type === StaffWeaponType.STAFF) {
      return this.proficiency.staffWeapon[type as StaffWeaponType];
    }
    if (
      type === LongRangeWeaponType.BOW ||
      type === LongRangeWeaponType.CROSSBOW
    ) {
      return this.proficiency.longRangeWeapon[type as LongRangeWeaponType];
    }
    throw new Error('Invalid proficiency type');
  }

  /**
   * 获取指定武器或盾牌当前熟练度升级所需经验。
   * 如果已达到 MASTER，则返回 Infinity。
   */
  getProficiencyExpRequirement(type: ProficiencyType): number {
    const data = this.getProficiencyData(type);
    if (data.level === ProficiencyLevel.MASTER) {
      return Infinity;
    }
    return proficiencyExpRequirements[data.level];
  }

  /**
   * 为指定武器或盾牌增加熟练度经验，并尝试自动升级。
   */
  addProficiencyExperience(type: ProficiencyType, amount: number): void {
    const data = this.getProficiencyData(type);
    data.experience += amount;
    while (
      data.experience >= this.getProficiencyExpRequirement(type) &&
      data.level !== ProficiencyLevel.MASTER
    ) {
      if (!this.upgradeProficiency(type)) {
        break;
      }
    }
  }

  /**
   * 尝试升级指定武器或盾牌的熟练度：
   * - 如果已是 MASTER 或经验不足则返回 false；
   * - 否则扣除所需经验并升级熟练度。
   */
  upgradeProficiency(type: ProficiencyType): boolean {
    const data = this.getProficiencyData(type);
    if (data.level === ProficiencyLevel.MASTER) return false;
    const requiredExp = this.getProficiencyExpRequirement(type);
    if (data.experience < requiredExp) return false;

    data.experience -= requiredExp;
    switch (data.level) {
      case ProficiencyLevel.NOVICE:
        data.level = ProficiencyLevel.APPRENTICE;
        break;
      case ProficiencyLevel.APPRENTICE:
        data.level = ProficiencyLevel.JOURNEYMAN;
        break;
      case ProficiencyLevel.JOURNEYMAN:
        data.level = ProficiencyLevel.EXPERT;
        break;
      case ProficiencyLevel.EXPERT:
        data.level = ProficiencyLevel.MASTER;
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   * 根据当前装备的武器自动为对应武器增加熟练度经验。
   * 需要装备中存在 weapon 对象，并且该对象具备 type 属性，
   * 该 type 值需为具体的武器类型（OneHandWeaponType、TwoHandWeaponType、StaffWeaponType、LongRangeWeaponType）。
   */
  addWeaponProficiencyExperience(amount: number): void {
    if (!this.equipment.weapon) {
      console.warn(
        'No weapon equipped, cannot add weapon proficiency experience.'
      );
      return;
    }
    // 假定 weapon 对象具有 type 属性，对应具体武器类型
    this.addProficiencyExperience(this.equipment.weapon.weaponType, amount);
  }

  /**
   * 根据当前装备的盾牌为盾牌添加熟练度经验。
   */
  addShieldProficiencyExperience(amount: number): void {
    if (!this.equipment.shield) {
      console.warn(
        'No shield equipped, cannot add shield proficiency experience.'
      );
      return;
    }
    this.addProficiencyExperience('shield', amount);
  }
}
