/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Squad, Army } from '../interfaces/combat';
import { SquadPosition } from '../enums';
import { IRefactoredCampaign } from './IRefactoredCampaign';
import { CombatStats } from '../interfaces';

export class BattleUtils {
  private campaign: IRefactoredCampaign;

  constructor(campaign: IRefactoredCampaign) {
    this.campaign = campaign;
  }

  public static calculateAttackDistance(
    attackerSquad: Squad,
    targetSquad: Squad
  ): number {
    const order = [
      SquadPosition.FRONT,
      SquadPosition.MIDDLE,
      SquadPosition.BACK,
    ];
    const attackerIndex = order.indexOf(attackerSquad.position);
    const targetIndex = order.indexOf(targetSquad.position);
    return Math.abs(attackerIndex - targetIndex);
  }

  public static selectTargetWithinRange(
    attackerSquad: Squad,
    enemyArmies: Army[],
    maxDistance: number
  ): CombatStats | null {
    const validUnits: { unit: CombatStats; weight: number }[] = [];
    const enemySquads: Squad[] = enemyArmies.flatMap((army) => army.squads);
    for (let i = 0; i < enemySquads.length; i += 1) {
      const squad = enemySquads[i];
      const distance = BattleUtils.calculateAttackDistance(
        attackerSquad,
        squad
      );
      if (distance <= maxDistance) {
        // 根据距离计算权重：若距离为0，权重1，否则权重为 0.5^(距离)
        const weight = distance === 0 ? 1 : 0.5 ** distance;
        squad.members
          .filter((unit) => !unit.isDead)
          .forEach((unit) => validUnits.push({ unit, weight }));
      }
    }

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
        return validUnits[i].unit;
      }
    }
    return validUnits[0].unit;
  }
}
