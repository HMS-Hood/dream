/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { BattleConfig } from '../interfaces';
import {
  BattleState,
  BattleGroup,
  BattleSide,
  Army,
  Squad,
  BattleRound,
} from '../interfaces/combat';
import { generateId } from '../utils/utils';

export class BattleStateHandler {
  private battleState: BattleState;

  private config: BattleConfig;

  private currentBattleGroupResults: Map<string, any> = new Map();

  constructor(
    config: BattleConfig,
    side1Armies: Army[],
    side2Armies: Army[],
    isPlayerOnSide1: boolean
  ) {
    this.config = config;
    this.battleState = {
      sides: [
        {
          id: generateId(),
          name: 'Side 1',
          armies: side1Armies,
          reserveArmies: [],
          isPlayerSide: isPlayerOnSide1,
        },
        {
          id: generateId(),
          name: 'Side 2',
          armies: side2Armies,
          reserveArmies: [],
          isPlayerSide: !isPlayerOnSide1,
        },
      ],
      battleGroups: [],
      round: 0,
      isBattleOver: false,
    };
  }

  public getConfig(): BattleConfig {
    return this.config;
  }

  public getBattleState(): BattleState {
    return this.battleState;
  }

  public getAliveSides(): BattleSide[] {
    return this.battleState.sides.filter((side) =>
      side.armies.some((army) => army.squads.some((squad) => !squad.isDead))
    );
  }

  public getAllSquads(): Squad[] {
    return this.battleState.sides.flatMap((side) =>
      side.armies.flatMap((army) => army.squads)
    );
  }

  public getSquadSide(squad: Squad): BattleSide | undefined {
    return this.battleState.sides.find((side) =>
      side.armies.some((army) => army.squads.includes(squad))
    );
  }

  public getEnemySquads(squadSide: BattleSide): Squad[] {
    return this.battleState.sides
      .filter((side) => side !== squadSide)
      .flatMap((side) =>
        side.armies.flatMap((army) => army.squads.filter((s) => !s.isDead))
      );
  }

  public getParticipatingSquads(army: Army): Squad[] {
    return army.squads.filter((squad) => !squad.isDead);
  }

  public updateTargetLists(allSquads: Squad[]): void {
    allSquads.forEach((s) => {
      if (s.targetIds) {
        s.targetIds = s.targetIds.filter((targetId) =>
          allSquads.some((target) => target.id === targetId && !target.isDead)
        );
      }
    });
  }

  public setBattleOver(isOver: boolean): void {
    this.battleState.isBattleOver = isOver;
  }

  public recordBattleResult(
    group: BattleGroup,
    attackerSquad: Squad,
    targetSquad: Squad,
    damage: number,
    isCritical: boolean
  ): void {
    const result = this.currentBattleGroupResults.get(group.id) || {
      groupId: group.id,
      side1Casualties: 0,
      side2Casualties: 0,
      combatLogs: [],
      isPlayerInvolved: this.isPlayerBattleGroup(group),
      rounds: [] as BattleRound[],
    };

    let currentRound = result.rounds.find(
      (r) => r.round === this.battleState.round
    );
    if (!currentRound) {
      currentRound = {
        round: this.battleState.round,
        actions: [],
      };
      result.rounds.push(currentRound);
    }

    currentRound.actions.push({
      attackerSquadId: attackerSquad.id,
      targetSquadId: targetSquad.id,
      damage,
      isCritical,
      targetDestroyed: targetSquad.members.length <= 0,
    });

    this.currentBattleGroupResults.set(group.id, result);
  }

  public checkCampaignEnd(): boolean {
    const [side1, side2] = this.battleState.sides;

    const side1Defeated =
      side1.armies.length === 0 && side1.reserveArmies.length === 0;
    const side2Defeated =
      side2.armies.length === 0 && side2.reserveArmies.length === 0;

    side1.armies = side1.armies.filter((army) => army.squads.length > 0);
    side2.armies = side2.armies.filter((army) => army.squads.length > 0);

    return (
      side1Defeated ||
      side2Defeated ||
      this.battleState.round >= this.config.maxRounds
    );
  }

  public finishRound(): void {
    this.battleState.round += 1;
    this.battleState.isBattleOver = this.checkCampaignEnd();
  }

  public prepareBattlefield(): void {
    this.battleState.sides.forEach((side) => {
      while (
        side.armies.length < this.config.battlefieldWidth &&
        side.reserveArmies.length > 0
      ) {
        const army = side.reserveArmies.shift();
        if (army) side.armies.push(army);
      }
    });
  }

  public matchBattleGroups(): void {
    const [side1, side2] = this.battleState.sides;
    const unassignedArmies1 = [...side1.armies];
    const unassignedArmies2 = [...side2.armies];

    this.battleState.battleGroups = this.battleState.battleGroups.filter(
      (group) => !group.battleState.isOver
    );

    while (unassignedArmies1.length > 0 && unassignedArmies2.length > 0) {
      const ratio = Math.max(
        Math.ceil(unassignedArmies1.length / unassignedArmies2.length),
        Math.ceil(unassignedArmies2.length / unassignedArmies1.length)
      );

      const armies1 = unassignedArmies1.splice(0, ratio);
      const armies2 = unassignedArmies2.splice(0, ratio);

      this.battleState.battleGroups.push(
        this.createBattleGroup(armies1, armies2)
      );
    }
  }

  private createBattleGroup(
    side1Armies: Army[],
    side2Armies: Army[]
  ): BattleGroup {
    const battleGroup: BattleGroup = {
      id: generateId(),
      side1Armies,
      side2Armies,
      battleState: {
        timeElapsed: 0,
        isOver: false,
      },
    };
    return battleGroup;
  }

  public clearCurrentBattleGroupResults(): void {
    this.currentBattleGroupResults.clear();
  }

  private isPlayerBattleGroup(group: BattleGroup): boolean {
    return false;
  }

  public addReserveTroops(): void {
    this.battleState.sides.forEach((side) => {
      const availableSlots = this.config.battlefieldWidth - side.armies.length;

      if (availableSlots > 0 && side.reserveArmies.length > 0) {
        const troopsToAdd = Math.min(availableSlots, side.reserveArmies.length);
        const newTroops = side.reserveArmies.splice(0, troopsToAdd);
        side.armies.push(...newTroops);
      }
    });
  }
}
