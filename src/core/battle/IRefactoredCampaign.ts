import { BattleConfig } from '../interfaces';
import { Army, BattleGroup } from '../interfaces/combat';

export interface IRefactoredCampaign {
  /**
   * 根据部队正面宽度和战场上限，将上场部队与后备部队分配出来
   */
  assignActiveAndReserveArmies(maxFrontWidth: number): {
    active: Army[];
    reserve: Army[];
  }[];

  /**
   * 匹配双方上场部队组成战团
   */
  matchBattleGroups(activeSide1: Army[], activeSide2: Army[]): BattleGroup[];

  /**
   * 执行战斗，采用行动调度器模拟单位行动，并在战斗过程中动态调整战团
   */
  executeBattle(): void;

  getBattleConfig(): BattleConfig;
}
