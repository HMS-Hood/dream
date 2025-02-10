/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Squad, Army, ICampaign } from '../interfaces/combat';
import { CombatUnit } from './CombatUnit';
import { SquadPosition } from '../enums';
import { IRefactoredCampaign } from './IRefactoredCampaign';

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

  public getRandomTarget(validTargets: Squad[]): Squad | null {
    if (validTargets.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * validTargets.length);
    return validTargets[randomIndex];
  }

  public calculateDamage(
    attacker: CombatUnit,
    target: CombatUnit
  ): { attackerDamage: number; targetDamage: number } {
    const attackerDamage = attacker.physicalAttack - target.physicalDefense;
    const targetDamage = target.physicalAttack - attacker.physicalDefense;

    return {
      attackerDamage: Math.max(0, attackerDamage),
      targetDamage: Math.max(0, targetDamage),
    };
  }

  public handleTeamMemberAttack(
    attacker: CombatUnit,
    target: CombatUnit
  ): void {
    const { attackerDamage, targetDamage } = this.calculateDamage(
      attacker,
      target
    );

    target.takeDamage(attackerDamage);
    attacker.takeDamage(targetDamage);
  }

  public selectTargetByWeight(validTargets: Squad[]): Squad | null {
    if (validTargets.length === 0) return null;

    const weights = validTargets.map((target) => {
      switch (target.position) {
        case SquadPosition.FRONT:
          return this.campaign.getBattleConfig().positionWeight.front;
        case SquadPosition.MIDDLE:
          return this.campaign.getBattleConfig().positionWeight.middle;
        case SquadPosition.BACK:
          return this.campaign.getBattleConfig().positionWeight.back;
        default:
          return 0;
      }
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i += 1) {
      random -= weights[i];
      if (random <= 0) {
        return validTargets[i];
      }
    }

    return validTargets[0];
  }

  public static selectTargetWithinRange(
    attackerSquad: Squad,
    enemyArmies: Army[],
    maxDistance: number
  ): CombatUnit | null {
    const validUnits: { unit: CombatUnit; weight: number }[] = [];
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
