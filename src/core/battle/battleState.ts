/* eslint-disable import/prefer-default-export */
import { IArmy } from '../interfaces/combat';
import { SideState } from './SideState';

export const calArmyState: (armies: IArmy[]) => SideState = (
  armies: IArmy[]
) => {
  return new SideState(armies);
};

export class BattleState {
  side1State: SideState;

  side2State: SideState;

  isPlayerOnSide1: boolean;

  isOver: boolean;

  constructor(
    side1Armies: IArmy[],
    side2Armies: IArmy[],
    isPlayerOnSide1: boolean
  ) {
    this.side1State = calArmyState(side1Armies);
    this.side2State = calArmyState(side2Armies);
    this.isPlayerOnSide1 = isPlayerOnSide1;
    this.isOver = false;
  }
}
