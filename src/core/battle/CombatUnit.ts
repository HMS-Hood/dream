/* eslint-disable import/prefer-default-export */
import { ICharacter, ICombatUnit } from '../interfaces';
import { AttackMethod, CharacterBaseProperty, ItemType } from '../enums';
import {
  baseCombatStats,
  levelModifiers,
  calculateAttributeModifier,
} from '../setting/param-combat';
import { BasePropertyModifier } from '../interfaces/item';

function getTotalModifier(...modifiers: number[]): number {
  return modifiers.reduce((total, mod) => total * (1 + mod), 1);
}

export class CombatUnit implements ICombatUnit {
  private character: ICharacter;

  // 战斗状态
  public currentHealth: number = 0;

  public isDead: boolean = false;

  // 二级属性
  public maxHealth: number = 0;

  public physicalAttack: number = 0;

  public physicalDefense: number = 0;

  public magicalAttack: number = 0;

  public magicalDefense: number = 0;

  public hitRate: number = 0;

  public dodgeRate: number = 0;

  public blockRate: number = 0;

  public blockValue: number = 0;

  public parryRate: number = 0;

  public criticalRate: number = 0;

  public criticalDamage: number = 0;

  public attackSpeed: number = 0;

  // Modifiers from different sources
  private levelModifier: number = 0;

  private attributeModifiers: { [key: string]: number } = {};

  private equipmentModifiers: { [key: string]: number } = {};

  private buffModifiers: { [key: string]: number } = {};

  constructor(character: ICharacter) {
    this.character = character;
    this.calculateModifiers();
    this.calculateSecondaryStats();
  }

  private getModifiedBaseProperty(property: CharacterBaseProperty) {
    const modifiers: BasePropertyModifier[] = [
      ...(this.character.equipment.weapon?.modifier ?? []),
      ...(this.character.equipment.shield?.modifier ?? []),
      ...(this.character.equipment.armor?.modifier ?? []),
    ];
    let originalValue: number = 0;
    switch (property) {
      case CharacterBaseProperty.strength:
        originalValue = this.character.strength;
        break;
      case CharacterBaseProperty.agility:
        originalValue = this.character.agility;
        break;
      case CharacterBaseProperty.endurance:
        originalValue = this.character.endurance;
        break;
      case CharacterBaseProperty.intelligence:
        originalValue = this.character.intelligence;
        break;
      case CharacterBaseProperty.spirit:
        originalValue = this.character.spirit;
        break;
      case CharacterBaseProperty.perception:
        originalValue = this.character.perception;
        break;
      case CharacterBaseProperty.charm:
        originalValue = this.character.charm;
        break;
      case CharacterBaseProperty.luck:
        originalValue = this.character.luck;
        break;
      default:
    }
    return modifiers
      .filter((modifier) => modifier.property === property)
      .reduce<number>(
        (value, modifier) => value + modifier.value,
        originalValue
      );
  }

  private calculateModifiers(): void {
    // Level modifier
    this.levelModifier = levelModifiers[this.character.level];

    // Attribute modifiers
    this.attributeModifiers = {
      strength: calculateAttributeModifier(
        this.getModifiedBaseProperty(CharacterBaseProperty.strength)
      ),
      agility: calculateAttributeModifier(
        this.getModifiedBaseProperty(CharacterBaseProperty.agility)
      ),
      endurance: calculateAttributeModifier(
        this.getModifiedBaseProperty(CharacterBaseProperty.endurance)
      ),
      intelligence: calculateAttributeModifier(
        this.getModifiedBaseProperty(CharacterBaseProperty.intelligence)
      ),
      spirit: calculateAttributeModifier(
        this.getModifiedBaseProperty(CharacterBaseProperty.spirit)
      ),
      perception: calculateAttributeModifier(
        this.getModifiedBaseProperty(CharacterBaseProperty.perception)
      ),
      luck: calculateAttributeModifier(
        this.getModifiedBaseProperty(CharacterBaseProperty.luck)
      ),
      charm: calculateAttributeModifier(
        this.getModifiedBaseProperty(CharacterBaseProperty.charm)
      ),
    };
  }

  // 计算二级属性
  private calculateSecondaryStats(): void {
    this.calculateModifiers();
    // Base health modified by endurance and level
    this.maxHealth = Math.floor(
      baseCombatStats.health *
        getTotalModifier(
          this.attributeModifiers.endurance * 2,
          this.levelModifier
        )
    );
    this.currentHealth = this.maxHealth;

    // Physical attack from weapon and strength
    const basePhysicalAttack = this.getWeaponDamage();
    this.physicalAttack =
      basePhysicalAttack *
      getTotalModifier(this.attributeModifiers.strength, this.levelModifier);

    // Physical defense from armor and endurance
    const basePhysicalDefense = this.getArmorDefense();
    this.physicalDefense = basePhysicalDefense;

    // Hit rate from base, perception and agility
    this.hitRate =
      baseCombatStats.hitRate +
      this.attributeModifiers.perception *
        0.4 *
        getTotalModifier(this.levelModifier);

    // Other stats calculations following the same pattern...
    this.dodgeRate =
      baseCombatStats.dodgeRate +
      this.attributeModifiers.agility *
        0.4 *
        getTotalModifier(this.levelModifier);

    this.blockRate = this.getCharacter().equipment.shield
      ? Math.min(
          0.9,
          baseCombatStats.blockRate +
            this.attributeModifiers.agility *
              0.2 *
              getTotalModifier(this.levelModifier)
        )
      : 0;

    const shieldDefence = this.getCharacter().equipment.shield?.defence ?? 0;
    if (shieldDefence) {
      this.blockValue =
        shieldDefence *
        getTotalModifier(
          2 * this.attributeModifiers.strength,
          this.levelModifier
        );
    }

    this.parryRate = Math.min(
      0.75,
      baseCombatStats.parryRate +
        (this.attributeModifiers.strength * 0.1 +
          this.attributeModifiers.agility * 0.1 +
          this.attributeModifiers.perception * 0.1) *
          getTotalModifier(this.levelModifier)
    );

    this.criticalRate =
      baseCombatStats.criticalRate +
      (this.attributeModifiers.luck * 0.2 +
        this.attributeModifiers.perception * 0.2) *
        getTotalModifier(this.levelModifier);

    this.criticalDamage =
      baseCombatStats.criticalDamage *
      getTotalModifier(
        this.attributeModifiers.strength * 0.25,
        this.attributeModifiers.luck * 0.25,
        this.levelModifier * 0.5
      );

    this.attackSpeed =
      baseCombatStats.attackSpeed *
      getTotalModifier(this.attributeModifiers.agility, this.levelModifier / 4);
  }

  // 获取武器伤害
  private getWeaponDamage(): number {
    const { weapon } = this.character.equipment;
    if (!weapon) return Math.floor(this.character.strength * 0.25);
    return (
      weapon.minDamage + Math.random() * (weapon.maxDamage - weapon.minDamage)
    );
  }

  // 获取护甲防御值
  private getArmorDefense(): number {
    const { armor, shield } = this.character.equipment;
    return (armor ? armor.defence : 0) + (shield ? shield.defence : 0);
  }

  // 战斗相关方法
  public takeDamage(damage: number): void {
    this.currentHealth = Math.max(
      0,
      this.currentHealth - Math.max(0, damage - this.physicalDefense)
    );
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
      case AttackMethod.LONG_RANGE:
        return 3;
      default:
        return 1;
    }
  }

  // 获取原始角色数据
  public getCharacter(): ICharacter {
    return this.character;
  }

  // 更新二级属性（当基础属性或装备发生变化时调用）
  public updateStats(): void {
    this.calculateSecondaryStats();
  }

  get name(): string {
    return this.character.name;
  }
}
