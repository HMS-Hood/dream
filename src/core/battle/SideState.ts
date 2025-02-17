/* eslint-disable import/prefer-default-export */
import { IArmy } from '../interfaces/combat';
import { ArmyState } from './ArmyState';

export class SideState {
  armiesState: ArmyState[];

  initalArmyCount: number;

  constructor(armies: IArmy[]) {
    this.armiesState = armies.map((army) => new ArmyState(army));
    this.initalArmyCount = armies.filter((army) => !army.isDead).length;
  }

  get armyCount() {
    return this.armiesState.filter((army) => !army.isDead).length;
  }
}
