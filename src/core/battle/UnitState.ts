import { reactive } from 'vue';
import { ICombatUnit } from '../interfaces';

/* eslint-disable import/prefer-default-export */
export class UnitState {
  combatUnit: ICombatUnit;

  constructor(combatUnit: ICombatUnit) {
    this.combatUnit = reactive(combatUnit);
  }

  get isDead(): boolean {
    return this.combatUnit.isDead;
  }

  get maxHealth(): number {
    return this.combatUnit.maxHealth;
  }

  get currentHealth(): number {
    return this.combatUnit.currentHealth;
  }

  get name(): string {
    return this.combatUnit.name;
  }
}
