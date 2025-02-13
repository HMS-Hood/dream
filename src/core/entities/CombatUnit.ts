/* eslint-disable import/prefer-default-export */
import { CharacterInterface, CombatStats } from '../interfaces';
import { AttackMethod } from '../enums';
import {
  baseCombatStats,
  levelModifiers,
  calculateAttributeModifier,
} from '../setting/param-combat';

function getTotalModifier(...modifiers: number[]): number {
  return modifiers.reduce((total, mod) => total * (1 + mod), 1);
}

export class CombatUnit implements CombatStats {
  private character: CharacterInterface;

  // 战斗状态
  public currentHealth: number;

  public isDead: boolean = false;

  // 二级属性
  public maxHealth: number = 0;

  public physicalAttack: number = 0;

  public physicalDefense: number = 0;

  public magicalAttack: number = 0;

  public magicalDefense: number = 0;

  public hitRate: number = 0;

  public dodgeRate: number = 0;

  public criticalRate: number = 0;

  public criticalDamage: number = 0;

  public attackSpeed: number = 0;

  public moveSpeed: number = 0;

  // Modifiers from different sources
  private levelModifier: number = 0;

  private attributeModifiers: { [key: string]: number } = {};

  private equipmentModifiers: { [key: string]: number } = {};

  private buffModifiers: { [key: string]: number } = {};

  constructor(character: CharacterInterface) {
    this.character = character;
    this.currentHealth = character.health;
    this.calculateModifiers();
    this.calculateSecondaryStats();
  }

  private calculateModifiers(): void {
    // Level modifier
    this.levelModifier = 1 + levelModifiers[this.character.level];

    // Attribute modifiers
    this.attributeModifiers = {
      strength: calculateAttributeModifier(this.character.strength),
      agility: calculateAttributeModifier(this.character.agility),
      endurance: calculateAttributeModifier(this.character.endurance),
      spirit: calculateAttributeModifier(this.character.spirit),
      perception: calculateAttributeModifier(this.character.perception),
      luck: calculateAttributeModifier(this.character.luck),
    };
  }

  // 计算二级属性
  private calculateSecondaryStats(): void {
    // Base health modified by endurance and level
    this.maxHealth =
      baseCombatStats.health *
      getTotalModifier(this.attributeModifiers.endurance, this.levelModifier);

    // Physical attack from weapon and strength
    const basePhysicalAttack = this.getWeaponDamage();
    this.physicalAttack =
      basePhysicalAttack *
      getTotalModifier(this.attributeModifiers.strength, this.levelModifier);

    // Physical defense from armor and endurance
    const basePhysicalDefense = this.getArmorDefense();
    this.physicalDefense =
      basePhysicalDefense *
      getTotalModifier(this.attributeModifiers.endurance, this.levelModifier);

    // Hit rate from base, perception and agility
    this.hitRate =
      baseCombatStats.hitRate *
      getTotalModifier(
        this.attributeModifiers.perception * 0.5,
        this.attributeModifiers.agility * 0.5,
        this.levelModifier
      );

    // Other stats calculations following the same pattern...
    this.dodgeRate =
      baseCombatStats.dodgeRate *
      getTotalModifier(this.attributeModifiers.agility, this.levelModifier);

    this.criticalRate =
      baseCombatStats.criticalRate *
      getTotalModifier(this.attributeModifiers.luck, this.levelModifier);

    this.criticalDamage =
      baseCombatStats.criticalDamage *
      getTotalModifier(this.attributeModifiers.strength);

    this.attackSpeed =
      baseCombatStats.attackSpeed *
      getTotalModifier(this.attributeModifiers.agility);

    this.moveSpeed =
      baseCombatStats.moveSpeed *
      getTotalModifier(this.attributeModifiers.agility);
  }

  // 获取武器伤害
  private getWeaponDamage(): number {
    const { weapon } = this.character.equipment;
    if (!weapon) return Math.floor(this.character.strength * 0.25);
    return (weapon.maxDamage + weapon.minDamage) / 2;
  }

  // 获取护甲防御值
  private getArmorDefense(): number {
    const { armor } = this.character.equipment;
    return armor ? armor.defence : 0;
  }

  // 战斗相关方法
  public takeDamage(damage: number): void {
    this.currentHealth = Math.max(0, this.currentHealth - damage);
    this.isDead = this.currentHealth <= 0;
  }

  public heal(amount: number): void {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
  }

  // 获取攻击范围
  public getAttackRange(): number {
    switch (this.character.attackMethod) {
      case AttackMethod.MELEE:
        return 1;
      case AttackMethod.MEDIUM_RANGE:
        return 2;
      case AttackMethod.LONG_RANGE:
        return 3;
      default:
        return 1;
    }
  }

  // 获取原始角色数据
  public getCharacter(): CharacterInterface {
    return this.character;
  }

  // 更新二级属性（当基础属性或装备发生变化时调用）
  public updateStats(): void {
    this.calculateSecondaryStats();
  }
}
