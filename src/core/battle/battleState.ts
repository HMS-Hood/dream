/* eslint-disable import/prefer-default-export */
import { Army } from '../interfaces/combat';
import { SideState } from './SideState';

export const calArmyState: (armies: Army[]) => SideState = (armies: Army[]) => {
  return new SideState(armies);
};

export class BattleState {
  side1State: SideState;

  side2State: SideState;

  isPlayerOnSide1: boolean;

  isOver: boolean;

  constructor(
    side1Armies: Army[],
    side2Armies: Army[],
    isPlayerOnSide1: boolean
  ) {
    this.side1State = calArmyState(side1Armies);
    this.side2State = calArmyState(side2Armies);
    this.isPlayerOnSide1 = isPlayerOnSide1;
    this.isOver = false;
  }
}
