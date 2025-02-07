/* eslint-disable import/prefer-default-export */
import { Squad, BattleGroup, Army } from '../interfaces/combat';
import { BattleStateHandler } from './battleState';
import { BattleUtils } from './battleUtils';

export class BattleLogic {
  private battleStateHandler: BattleStateHandler;

  private battleUtils: BattleUtils;

  constructor(
    battleStateHandler: BattleStateHandler,
    battleUtils: BattleUtils
  ) {
    this.battleStateHandler = battleStateHandler;
    this.battleUtils = battleUtils;
  }

  public executeBattleGroup(group: BattleGroup): void {
    const attackQueue: { time: number; squad: Squad; army: Army }[] = [];

    [...group.side1Armies, ...group.side2Armies].forEach((army) => {
      this.battleStateHandler.getParticipatingSquads(army).forEach((squad) => {
        const attackInterval =
          this.battleStateHandler.getConfig().battleTimeLimit /
          squad.attackSpeed;
        for (
          let time = attackInterval;
          time <= this.battleStateHandler.getConfig().battleTimeLimit;
          time += attackInterval
        ) {
          attackQueue.push({ time, squad, army });
        }
      });
    });

    attackQueue.sort((a, b) => a.time - b.time);

    attackQueue.forEach(({ squad, army }) => {
      if (squad.isDead) return;

      const targetArmies = group.side1Armies.includes(army)
        ? group.side2Armies
        : group.side1Armies;

      const validTargets = targetArmies.flatMap((targetArmy) =>
        this.battleStateHandler.getParticipatingSquads(targetArmy)
      );

      if (validTargets.length === 0) return;

      const targetSquad = this.battleUtils.getRandomTarget(validTargets);
      if (targetSquad) {
        this.handleSquadAttack(squad, targetSquad, group);
      }
    });

    const side1Alive = group.side1Armies.some(
      (army) => this.battleStateHandler.getParticipatingSquads(army).length > 0
    );
    const side2Alive = group.side2Armies.some(
      (army) => this.battleStateHandler.getParticipatingSquads(army).length > 0
    );

    if (!side1Alive || !side2Alive) {
      group.battleState.isOver = true;
    }
  }

  private handleSquadAttack(
    attackerSquad: Squad,
    targetSquad: Squad,
    battleGroup: BattleGroup
  ): void {
    if (
      attackerSquad.members.length === 0 ||
      targetSquad.members.length === 0
    ) {
      return;
    }

    const sortedAttackers = [...attackerSquad.members].sort(
      (a, b) => a.getCharacter().luck - b.getCharacter().luck
    );

    for (let i = 0; i < sortedAttackers.length; i += 1) {
      if (targetSquad.members.length === 0) {
        return;
      }
      const attacker = sortedAttackers[i];
      const randomIndex = Math.floor(
        Math.random() * targetSquad.members.length
      );
      const target = targetSquad.members[randomIndex];

      const { attackerDamage, targetDamage } = this.battleUtils.calculateDamage(
        attacker,
        target
      );

      const isCritical = Math.random() < attacker.getCharacter().luck * 0.1;
      const finalDamage = isCritical ? attackerDamage * 1.5 : attackerDamage;

      this.battleStateHandler.recordBattleResult(
        battleGroup,
        attackerSquad,
        targetSquad,
        finalDamage,
        isCritical
      );

      target.takeDamage(finalDamage);
      attacker.takeDamage(targetDamage);

      targetSquad.members = targetSquad.members.filter(
        (member) => !member.isDead
      );
      attackerSquad.members = attackerSquad.members.filter(
        (member) => !member.isDead
      );

      if (
        targetSquad.members.length === 0 ||
        attackerSquad.members.length === 0
      ) {
        break;
      }
    }
  }
}
