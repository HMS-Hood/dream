/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Squad, ICampaign } from '../interfaces/combat';
import { CombatUnit } from '../entities/CombatUnit';
import { SquadPosition } from '../enums';

export class BattleUtils {
  private campaign: ICampaign;

  constructor(campaign: ICampaign) {
    this.campaign = campaign;
  }

  public calculateAttackDistance(
    attackerSquad: Squad,
    targetSquad: Squad
  ): number {
    const attackerPositionIndex = Object.values(
      this.campaign.getSquadPosition()
    ).indexOf(attackerSquad.position);
    const targetPositionIndex = Object.values(
      this.campaign.getSquadPosition()
    ).indexOf(targetSquad.position);
    let distance = 0;

    if (attackerPositionIndex !== -1 && targetPositionIndex !== -1) {
      distance = Math.abs(attackerPositionIndex - targetPositionIndex);
    }

    return distance;
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

  public selectTargets(attackerSquad: Squad, enemySquads: Squad[]): Squad[] {
    const attackRange = 1;
    const validTargets = enemySquads.filter((targetSquad) => {
      const distance = this.calculateAttackDistance(attackerSquad, targetSquad);
      return distance <= attackRange;
    });

    return validTargets;
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
}
