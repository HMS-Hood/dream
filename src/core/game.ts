/* eslint-disable class-methods-use-this */
import { Player } from './entities/Player';
import { Emblem } from './entities/Emblem';
import { Flag } from './entities/Flag';
import { SquadPosition, AttackMethod, TeamMemberLevel } from './enums';
import {
  TeamMember,
  Squad,
  Army,
  BattleConfig,
  BattleState,
} from './interfaces';
import { generateId } from './utils';

class Game {
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
    attacker: TeamMember,
    target: TeamMember
  ): { attackerDamage: number; targetDamage: number } {
    const attackerDamage = Math.max(attacker.strength, 1);
    const targetDamage = Math.max(target.strength * 0.5, 1);
    return { attackerDamage, targetDamage };
  }

  // Handle player attack
  private handleTeamMemberAttack(
    attacker: TeamMember,
    target: TeamMember
  ): void {
    const { attackerDamage, targetDamage } = this.calculateDamage(
      attacker,
      target
    );
    // add more calculation, attribute impact on attack
    if (target && target.energy) {
      (target as any).energy -= attackerDamage;
      if ((target as any).energy <= 0) {
        (target as any).energy = 0;
      }
    }

    if (attacker && attacker.energy) {
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

    // for (const attacker of sortedAttackers) {
    //   if (targetSquad.members.length === 0) {
    //     return;
    //   }
    //   const randomIndex = Math.floor(
    //     Math.random() * targetSquad.members.length
    //   );
    //   const target = targetSquad.members[randomIndex];
    //   this.handleTeamMemberAttack(attacker, target);

    //   // Remove dead player
    //   targetSquad.members = targetSquad.members.filter(
    //     (member) => (member as any).energy > 0
    //   );
    //   attackerSquad.members = attackerSquad.members.filter(
    //     (member) => (member as any).energy > 0
    //   );
    //   if (
    //     targetSquad.members.length === 0 ||
    //     attackerSquad.members.length === 0
    //   ) {
    //     break;
    //   }
    // }
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

    // for (const squad1 of army1ParticipatingSquads) {
    //   if (squad1.targets == null || squad1.targets.length === 0) {
    //     const targets: Squad[] = [];
    //     for (let i = 0; i < opponentsPerSquad1; i += 1) {
    //       const randomIndex = Math.floor(
    //         Math.random() * army2ParticipatingSquads.length
    //       );
    //       const target = army2ParticipatingSquads[randomIndex];
    //       if (targets.includes(target)) {
    //         i -= 1;
    //         continue;
    //       }
    //       targets.push(target);
    //     }
    //     squad1.targets = targets;
    //   }
    // }

    // for (const squad2 of army2ParticipatingSquads) {
    //   if (squad2.targets == null || squad2.targets.length === 0) {
    //     const targets: Squad[] = [];
    //     for (let i = 0; i < opponentsPerSquad2; i += 1) {
    //       const randomIndex = Math.floor(
    //         Math.random() * army1ParticipatingSquads.length
    //       );
    //       const target = army1ParticipatingSquads[randomIndex];
    //       if (targets.includes(target)) {
    //         i -= 1;
    //         continue;
    //       }
    //       targets.push(target);
    //     }
    //     squad2.targets = targets;
    //   }
    // }
  }

  // Add reserve troops if needed
  private addReserveTroops(): void {
    // for (const army of this.battleState.armies) {
    //   const participatingSquads = this.getParticipatingSquads(army);
    //   const reserveSquads = this.getReserveSquads(army);
    //   while (
    //     participatingSquads.length < this.config.maxTroopsPerSide &&
    //     reserveSquads.length > 0
    //   ) {
    //     const squadToAdd = reserveSquads.shift();
    //     if (squadToAdd) {
    //       army.squads.push(squadToAdd);
    //     }
    //   }
    // }
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
    // for (const squad of allSquads) {
    //   const attackInterval = this.config.battleTimeLimit / squad.attackSpeed;
    //   for (
    //     let time = attackInterval;
    //     time <= this.config.battleTimeLimit;
    //     time += attackInterval
    //   ) {
    //     attackQueue.push({ time, squad });
    //   }
    // }

    // Sort the attack queue by attack time
    attackQueue.sort((a, b) => a.time - b.time);

    // Execute the attacks in order
    // for (const { squad } of attackQueue) {
    //   if (squad.isDead) {
    //     continue;
    //   }
    //   const { targets } = squad;
    //   if (targets == null) {
    //     continue;
    //   }

    //   const validTargets = this.selectTargets(squad, targets);
    //   const targetSquad = this.getRandomTarget(validTargets);
    //   if (targetSquad) {
    //     this.handleSquadAttack(squad, targetSquad);
    //   }

    //   // Remove defeated squad from targets list
    //   allSquads.forEach((squad) => {
    //     squad.targets = squad.targets?.filter((t) => !t.isDead);
    //   });
    // }

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

// Example Usage
function createTeamMember(
  name: string,
  strength: number,
  agility: number,
  endurance: number,
  intelligence: number,
  energy: number,
  luck: number,
  level: TeamMemberLevel
): TeamMember {
  return {
    id: generateId(),
    name,
    strength,
    agility,
    endurance,
    intelligence,
    energy,
    luck,
    level,
  };
}

function createSquad(
  position: SquadPosition,
  attackMethod: AttackMethod,
  attackSpeed: number,
  members: TeamMember[]
): Squad {
  return {
    id: generateId(),
    position,
    attackMethod,
    attackSpeed,
    members,
    targets: [],
    isDead: false,
  };
}

function createArmy(squads: Squad[], reserveSquads: Squad[]): Army {
  return {
    id: generateId(),
    squads,
    reserveSquads,
  };
}

// Create Emblem and Flag
const emblem1 = new Emblem('Eagle Emblem', '/images/eagle.png');
const flag1 = new Flag('Red Banner', '/images/red-banner.png');

// Create Player
const player = new Player('Hero', emblem1, flag1);

// Create Team
player.createTeam('Hero Squad', emblem1, flag1);

const member1 = createTeamMember(
  'Fighter1',
  6,
  4,
  5,
  3,
  100,
  6,
  TeamMemberLevel.ROOKIE
);
const member2 = createTeamMember(
  'Fighter2',
  7,
  3,
  6,
  2,
  100,
  3,
  TeamMemberLevel.ROOKIE
);
const member3 = createTeamMember(
  'Fighter3',
  4,
  7,
  4,
  5,
  100,
  7,
  TeamMemberLevel.ROOKIE
);
const member4 = createTeamMember(
  'Fighter4',
  5,
  6,
  5,
  4,
  100,
  5,
  TeamMemberLevel.ROOKIE
);
const member5 = createTeamMember(
  'Fighter5',
  8,
  2,
  7,
  1,
  100,
  8,
  TeamMemberLevel.ROOKIE
);
const member6 = createTeamMember(
  'Fighter6',
  6,
  4,
  5,
  3,
  100,
  6,
  TeamMemberLevel.ROOKIE
);

player.team.addMember(member1);
player.team.addMember(member2);

// Create squads for army1
const frontSquad1 = createSquad(SquadPosition.FRONT, AttackMethod.MELEE, 4, [
  player.team.leader,
]);
const middleSquad1 = createSquad(
  SquadPosition.MIDDLE,
  AttackMethod.MEDIUM_RANGE,
  5,
  [member1, member2]
);
const backSquad1 = createSquad(SquadPosition.BACK, AttackMethod.LONG_RANGE, 6, [
  member3,
]);
const reserveSquad1 = createSquad(
  SquadPosition.BACK,
  AttackMethod.LONG_RANGE,
  6,
  [member4]
);

// Create squads for army2
const frontSquad2 = createSquad(SquadPosition.FRONT, AttackMethod.MELEE, 3, [
  member5,
]);
const middleSquad2 = createSquad(
  SquadPosition.MIDDLE,
  AttackMethod.MEDIUM_RANGE,
  6,
  [member6]
);
const backSquad2 = createSquad(SquadPosition.BACK, AttackMethod.LONG_RANGE, 5, [
  member1,
  member2,
  member3,
]);

const army1 = createArmy(
  [frontSquad1, middleSquad1, backSquad1],
  [reserveSquad1]
);
const army2 = createArmy([frontSquad2, middleSquad2, backSquad2], []);

const battleConfig: BattleConfig = {
  maxRounds: 10,
  maxTroopsPerSide: 4,
  battleTimeLimit: 20,
};

const game = new Game(battleConfig, [army1, army2], player);
game.startGame();
