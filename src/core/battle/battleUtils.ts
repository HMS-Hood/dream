/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { ISquad, IArmy } from '../interfaces/combat';
import { SquadPosition } from '../enums';
import { IRefactoredCampaign } from './IRefactoredCampaign';
import { ICombatUnit } from '../interfaces';

export class BattleUtils {
  private campaign: IRefactoredCampaign;

  constructor(campaign: IRefactoredCampaign) {
    this.campaign = campaign;
  }

  public static calculateAttackDistance(
    attackArmy: IArmy,
    attackerSquad: ISquad,
    targetArmy: IArmy,
    targetSquad: ISquad
  ): number {
    let distince = 1;
    if (attackerSquad.position === SquadPosition.BACK) {
      distince += attackArmy.squads.some(
        (squad) => squad.position === SquadPosition.FRONT && !squad.isDead
      )
        ? 1
        : 0;
    }
    if (targetSquad.position === SquadPosition.BACK) {
      distince += targetArmy.squads.some(
        (squad) => squad.position === SquadPosition.FRONT && !squad.isDead
      )
        ? 1
        : 0;
    }
    return distince;
  }

  public static selectTargetWithinRange(
    attackerArmy: IArmy,
    attackerSquad: ISquad,
    targetArmies: IArmy[],
    maxDistance: number
  ): { unit: ICombatUnit; distance: number } | null {
    type UnitWeight = { unit: ICombatUnit; weight: number; distance: number };
    const validUnits: UnitWeight[] = targetArmies.flatMap((targetArmy) => {
      return targetArmy.squads.flatMap((targetSquad): UnitWeight[] => {
        const distance = BattleUtils.calculateAttackDistance(
          attackerArmy,
          attackerSquad,
          targetArmy,
          targetSquad
        );
        if (distance <= maxDistance) {
          // 根据距离计算权重：若距离为0，权重1，否则权重为 0.5
          const weight = targetSquad.position === SquadPosition.FRONT ? 1 : 0.5;
          return targetSquad.members
            .filter((unit) => !unit.isDead)
            .map((unit) => ({ unit, weight, distance }));
        }
        return [];
      });
    });

    if (validUnits.length === 0) {
      return null;
    }

    const totalWeight = validUnits.reduce(
      (sum, entry) => sum + entry.weight,
      0
    );
    let random = Math.random() * totalWeight;
    for (let i = 0; i < validUnits.length; i += 1) {
      random -= validUnits[i].weight;
      if (random <= 0) {
        return { unit: validUnits[i].unit, distance: validUnits[i].distance };
      }
    }
    return { unit: validUnits[0].unit, distance: validUnits[0].distance };
  }
}
