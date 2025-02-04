/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Player } from './entities/Player';
import { SquadPosition, AttackMethod } from './enums';
import {
  Army,
  BattleConfig,
  BattleState,
  Squad,
  CharacterInterface,
} from './interfaces';

export class Campaign {
  private battleState: BattleState;

  private config: BattleConfig;

  private player: Player;

  constructor(config: BattleConfig, armies: Army[], player: Player) {
    this.config = config;
    this.battleState = {
      armies,
      round: 0,
      isBattleOver: false,
    };
    this.player = player;
  }

  // Get squads that are participating in the battle
  private getParticipatingSquads(army: Army): Squad[] {
    return army.squads.filter((squad) => !squad.isDead);
  }

  // Get squads that are available in the reserve
  private getReserveSquads(army: Army): Squad[] {
    return army.reserveSquads.filter((squad) => !squad.isDead);
  }

  private calculateAttackDistance(
    attackerSquad: Squad,
    targetSquad: Squad
  ): number {
    const attackerPositionIndex = Object.values(SquadPosition).indexOf(
      attackerSquad.position
    );
    const targetPositionIndex = Object.values(SquadPosition).indexOf(
      targetSquad.position
    );
    let distance = 0;

    if (attackerPositionIndex !== -1 && targetPositionIndex !== -1) {
      distance = Math.abs(attackerPositionIndex - targetPositionIndex);
    }

    return distance;
  }

  // Get attack distance based on attack method
  private getAttackRange(method: AttackMethod): number {
    switch (method) {
      case AttackMethod.MELEE:
        return 1;
      case AttackMethod.MEDIUM_RANGE:
        return 3;
      case AttackMethod.LONG_RANGE:
        return 5;
      default:
        return 0;
    }
  }

  private selectTargets(attackerSquad: Squad, enemySquads: Squad[]): Squad[] {
    const attackRange = this.getAttackRange(attackerSquad.attackMethod);
    const validTargets: Squad[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const targetSquad of enemySquads) {
      const distance = this.calculateAttackDistance(attackerSquad, targetSquad);
      if (distance <= attackRange) {
        validTargets.push(targetSquad);
      }
    }
    return validTargets;
  }

  private getRandomTarget(validTargets: Squad[]): Squad | null {
    if (validTargets.length === 0) {
      return null;
    }
    const weights = validTargets.map((target) => {
      const distance = this.calculateAttackDistance(validTargets[0], target);
      return 1 - distance * 0.5;
    });

    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i += 1) {
      random -= weights[i];
      if (random <= 0) {
        return validTargets[i];
      }
    }
    return validTargets[0];
  }

  // Calculate damage, can add more sophisticated damage model
  private calculateDamage(
    attacker: CharacterInterface,
    target: CharacterInterface
  ): { attackerDamage: number; targetDamage: number } {
    const attackerDamage = Math.max(attacker.strength, 1);
    const targetDamage = Math.max(target.strength * 0.5, 1);
    return { attackerDamage, targetDamage };
  }

  // Handle player attack
  private handleTeamMemberAttack(
    attacker: CharacterInterface,
    target: CharacterInterface
  ): void {
    const { attackerDamage, targetDamage } = this.calculateDamage(
      attacker,
      target
    );
    // add more calculation, attribute impact on attack
    if (target && target.spirit) {
      (target as any).energy -= attackerDamage;
      if ((target as any).energy <= 0) {
        (target as any).energy = 0;
      }
    }

    if (attacker && attacker.spirit) {
      (attacker as any).energy -= targetDamage;
      if ((attacker as any).energy <= 0) {
        (attacker as any).energy = 0;
      }
    }
  }

  // Handle squad attack
  private handleSquadAttack(attackerSquad: Squad, targetSquad: Squad): void {
    if (
      attackerSquad.members.length === 0 ||
      targetSquad.members.length === 0
    ) {
      return;
    }

    // Sort by luck
    const sortedAttackers = [...attackerSquad.members].sort(
      (a, b) => a.luck - b.luck
    );
    const sortedTargets = [...targetSquad.members].sort(
      (a, b) => a.luck - b.luck
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
      this.handleTeamMemberAttack(attacker, target);

      // Remove dead player
      targetSquad.members = targetSquad.members.filter(
        (member) => (member as any).energy > 0
      );
      attackerSquad.members = attackerSquad.members.filter(
        (member) => (member as any).energy > 0
      );

      if (
        targetSquad.members.length === 0 ||
        attackerSquad.members.length === 0
      ) {
        break;
      }
    }
    // check if the squad dead
    if (targetSquad.members.length === 0) {
      targetSquad.isDead = true;
    }
    if (attackerSquad.members.length === 0) {
      attackerSquad.isDead = true;
    }
  }

  // Matching Opponents Logic
  private matchOpponents(): void {
    const aliveArmies = this.battleState.armies.filter(
      (army) => this.getParticipatingSquads(army).length > 0
    );
    if (aliveArmies.length < 2) {
      return;
    }

    const army1 = aliveArmies[0];
    const army2 = aliveArmies[1];

    const army1ParticipatingSquads = this.getParticipatingSquads(army1);
    const army2ParticipatingSquads = this.getParticipatingSquads(army2);
    const squads1Length = army1ParticipatingSquads.length;
    const squads2Length = army2ParticipatingSquads.length;

    // Calculate the number of opponents per squad, trying to keep it balanced
    const minOpponents = Math.min(squads1Length, squads2Length);
    const opponentsPerSquad1 = Math.floor(squads2Length / squads1Length);
    const opponentsPerSquad2 = Math.floor(squads1Length / squads2Length);

    for (let i = 0; i < army1ParticipatingSquads.length; i += 1) {
      const squad1 = army1ParticipatingSquads[i];
      if (squad1.targets == null || squad1.targets.length === 0) {
        const targets: Squad[] = [];
        for (let j = 0; j < opponentsPerSquad1; j += 1) {
          // Renamed inner loop variable to j for clarity
          const randomIndex = Math.floor(
            Math.random() * army2ParticipatingSquads.length
          );
          const target = army2ParticipatingSquads[randomIndex];
          if (targets.includes(target)) {
            j -= 1; // Decrement inner loop counter j
          } else {
            targets.push(target);
          }
        }
        squad1.targets = targets;
      }
    }

    for (let i = 0; i < army2ParticipatingSquads.length; i += 1) {
      const squad2 = army2ParticipatingSquads[i];
      if (squad2.targets == null || squad2.targets.length === 0) {
        const targets: Squad[] = [];
        for (let j = 0; j < opponentsPerSquad2; j += 1) {
          // Renamed inner loop variable to j for clarity
          const randomIndex = Math.floor(
            Math.random() * army1ParticipatingSquads.length
          );
          const target = army1ParticipatingSquads[randomIndex];
          if (targets.includes(target)) {
            j -= 1; // Decrement inner loop counter j
          } else {
            targets.push(target);
          }
        }
        squad2.targets = targets;
      }
    }
  }

  // Add reserve troops if needed
  private addReserveTroops(): void {
    for (let i = 0; i < this.battleState.armies.length; i += 1) {
      const army = this.battleState.armies[i];
      const participatingSquads = this.getParticipatingSquads(army);
      const reserveSquads = this.getReserveSquads(army);
      while (
        participatingSquads.length < this.config.maxTroopsPerSide &&
        reserveSquads.length > 0
      ) {
        const squadToAdd = reserveSquads.shift();
        if (squadToAdd) {
          army.squads.push(squadToAdd);
        }
      }
    }
  }

  // Battle Logic
  private handleBattle(): void {
    const aliveArmies = this.battleState.armies.filter(
      (army) => this.getParticipatingSquads(army).length > 0
    );
    if (aliveArmies.length < 2) {
      this.battleState.isBattleOver = true;
      return;
    }

    const allSquads: Squad[] = aliveArmies.flatMap((army) =>
      this.getParticipatingSquads(army)
    );

    // Create an attack queue based on squad attack speed and battle time limit
    const attackQueue: { time: number; squad: Squad }[] = [];
    for (let i = 0; i < allSquads.length; i += 1) {
      const squad = allSquads[i];
      const attackInterval = this.config.battleTimeLimit / squad.attackSpeed;
      for (
        let time = attackInterval;
        time <= this.config.battleTimeLimit;
        time += attackInterval
      ) {
        attackQueue.push({ time, squad });
      }
    }

    // Sort the attack queue by attack time
    attackQueue.sort((a, b) => a.time - b.time);

    // Execute the attacks in order
    attackQueue.forEach(({ squad }) => {
      if (squad.isDead) {
        return;
      }
      const { targets } = squad;
      if (targets == null) {
        return;
      }

      const validTargets = this.selectTargets(squad, targets);
      const targetSquad = this.getRandomTarget(validTargets);
      if (targetSquad) {
        this.handleSquadAttack(squad, targetSquad);
      }

      // Remove defeated squad from targets list
      allSquads.forEach((defeatedSquad) => {
        defeatedSquad.targets = defeatedSquad.targets?.filter((t) => !t.isDead);
      });
    });

    // Check if any side has lost all troops
    if (
      aliveArmies.some((army) => this.getParticipatingSquads(army).length === 0)
    ) {
      this.battleState.isBattleOver = true;
    }
  }

  // Start the Game
  public startGame(): void {
    while (
      !this.battleState.isBattleOver &&
      this.battleState.round < this.config.maxRounds
    ) {
      console.log(`Round: ${this.battleState.round + 1}`);
      this.addReserveTroops();
      this.matchOpponents();
      this.handleBattle();
      this.battleState.round += 1;
    }
    if (this.battleState.round >= this.config.maxRounds) {
      console.log(`Battle end due to exceed rounds ${this.config.maxRounds}`);
    } else {
      const aliveArmies = this.battleState.armies.filter(
        (army) => this.getParticipatingSquads(army).length > 0
      );
      if (aliveArmies.length === 1) {
        console.log(`Army ${aliveArmies[0].id} win!`);
      } else {
        console.log('Battle Draw');
      }
    }
  }
}
