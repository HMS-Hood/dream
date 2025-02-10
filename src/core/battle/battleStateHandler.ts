/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { BattleConfig } from '../interfaces';
import { Army } from '../interfaces/combat';
import { BattleState } from './battleState';

export class BattleStateHandler {
  private battleState: BattleState;

  private config: BattleConfig;

  constructor(
    config: BattleConfig,
    side1Armies: Army[],
    side2Armies: Army[],
    isPlayerOnSide1: boolean
  ) {
    this.config = config;
    this.battleState = new BattleState(
      side1Armies,
      side2Armies,
      isPlayerOnSide1
    );
  }

  public getConfig(): BattleConfig {
    return this.config;
  }

  public getBattleState(): BattleState {
    return this.battleState;
  }
}
