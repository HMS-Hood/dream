/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { SquadPosition } from '../enums';
import { BattleConfig } from '../interfaces';
import {
  BattleState,
  Army,
  Squad,
  BattleGroup,
  BattleSide,
  BattleGroupResult,
  BattleRound,
} from '../interfaces/combat';
import { generateId } from '../utils/utils';
import { BattleLogic } from './battleLogic';
import { BattleStateHandler } from './battleState';
import { BattleUtils } from './battleUtils';

export class Campaign {
  private config: BattleConfig;

  private battleState: BattleState;

  private currentBattleGroupResults: Map<string, BattleGroupResult>;

  private playerBattleGroupId: string | null;

  private battleMatched: boolean;

  private nonPlayerBattlesExecuted: boolean;

  private playerBattleExecuted: boolean;

  private battleStateHandler: BattleStateHandler;

  private battleLogic: BattleLogic;

  private battleUtils: BattleUtils;

  constructor(
    config: BattleConfig,
    side1Armies: Army[],
    side2Armies: Army[],
    playerArmy: Army | null,
    isPlayerOnSide1: boolean = true
  ) {
    this.config = config;

    if (playerArmy) {
      if (isPlayerOnSide1) {
        side1Armies = [playerArmy, ...side1Armies];
      } else {
        side2Armies = [playerArmy, ...side2Armies];
      }
    }

    this.battleStateHandler = new BattleStateHandler(
      config,
      side1Armies,
      side2Armies,
      isPlayerOnSide1
    );
    this.battleUtils = new BattleUtils(this);
    this.battleLogic = new BattleLogic(
      this.battleStateHandler,
      this.battleUtils
    );

    this.battleState = this.battleStateHandler.getBattleState();
    this.currentBattleGroupResults = new Map();
    this.playerBattleGroupId = null;
    this.battleMatched = false;
    this.nonPlayerBattlesExecuted = false;
    this.playerBattleExecuted = false;
  }

  public startCampaign(): void {
    this.prepareBattlefield();

    while (!this.battleState.isBattleOver) {
      console.log(`Round ${this.battleState.round + 1} starting...`);

      this.matchBattleGroups();

      this.battleState.battleGroups.forEach((group) => {
        if (!group.battleState.isOver) {
          this.battleLogic.executeBattleGroup(group);
        }
      });

      this.addReserveTroops();

      this.battleState.round += 1;

      this.battleState.isBattleOver = this.checkCampaignEnd();
    }
  }

  private prepareBattlefield(): void {
    this.battleStateHandler.prepareBattlefield();
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

  private matchBattleGroups(): void {
    this.battleStateHandler.matchBattleGroups();
  }

  private addReserveTroops(): void {
    this.battleStateHandler.addReserveTroops();
  }

  private checkCampaignEnd(): boolean {
    return this.battleStateHandler.checkCampaignEnd();
  }

  public executeNextStep():
    | 'match'
    | 'nonPlayerBattles'
    | 'playerBattle'
    | 'complete' {
    if (!this.battleMatched) {
      this.prepareBattlefield();
      this.matchBattleGroups();
      this.playerBattleGroupId = this.findPlayerBattleGroup()?.id || null;
      this.battleMatched = true;
      return 'match';
    }

    if (!this.nonPlayerBattlesExecuted) {
      this.executeNonPlayerBattles();
      this.nonPlayerBattlesExecuted = true;
      return 'nonPlayerBattles';
    }

    if (!this.playerBattleExecuted && this.playerBattleGroupId) {
      this.executePlayerBattle();
      this.playerBattleExecuted = true;
      return 'playerBattle';
    }

    this.finishRound();
    return 'complete';
  }

  private findPlayerBattleGroup(): BattleGroup | null {
    if (!this.playerBattleGroupId) return null;

    return (
      this.battleState.battleGroups.find((group) =>
        [...group.side1Armies, ...group.side2Armies].some(
          (army) => army.id === this.playerBattleGroupId
        )
      ) || null
    );
  }

  private executeNonPlayerBattles(): void {
    this.battleState.battleGroups.forEach((group) => {
      if (group.id !== this.playerBattleGroupId && !group.battleState.isOver) {
        const result = this.executeBattleGroupWithLogs(group);
        this.currentBattleGroupResults.set(group.id, result);
      }
    });
  }

  private executePlayerBattle(): void {
    const playerGroup = this.findPlayerBattleGroup();
    if (!playerGroup) return;

    const side1UnitsBefore = this.countTotalUnits(playerGroup.side1Armies);
    const side2UnitsBefore = this.countTotalUnits(playerGroup.side2Armies);

    this.battleLogic.executeBattleGroup(playerGroup);

    const result: BattleGroupResult = {
      casualties: {
        side1: side1UnitsBefore - this.countTotalUnits(playerGroup.side1Armies),
        side2: side2UnitsBefore - this.countTotalUnits(playerGroup.side2Armies),
      },
      isPlayerInvolved: true,
      rounds: [],
    };

    this.currentBattleGroupResults.set(playerGroup.id, result);

    playerGroup.battleState.isOver = true;
  }

  private executeBattleGroupWithLogs(group: BattleGroup): BattleGroupResult {
    const result: BattleGroupResult = {
      casualties: {
        side1: 0,
        side2: 0,
      },
      isPlayerInvolved: this.isPlayerBattleGroup(group),
      rounds: [] as BattleRound[],
    };

    const side1UnitsBefore = this.countTotalUnits(group.side1Armies);
    const side2UnitsBefore = this.countTotalUnits(group.side2Armies);

    this.battleLogic.executeBattleGroup(group);

    if (result.casualties) {
      result.casualties.side1 =
        side1UnitsBefore - this.countTotalUnits(group.side1Armies);
      result.casualties.side2 =
        side2UnitsBefore - this.countTotalUnits(group.side2Armies);
    }

    return result;
  }

  private countTotalUnits(armies: Army[]): number {
    return armies.reduce(
      (total, army) =>
        total +
        army.squads.reduce(
          (squadTotal, squad) => squadTotal + squad.members.length,
          0
        ),
      0
    );
  }

  public getCurrentBattleResults(): Map<string, BattleGroupResult> {
    return this.currentBattleGroupResults;
  }

  private finishRound(): void {
    this.battleState.round += 1;
    this.battleState.isBattleOver = this.checkCampaignEnd();
    this.currentBattleGroupResults.clear();
    this.battleMatched = false;
    this.nonPlayerBattlesExecuted = false;
    this.playerBattleExecuted = false;
    this.playerBattleGroupId = null;
  }

  public getBattleConfig(): BattleConfig {
    return this.config;
  }

  public getBattleStatus(): {
    battleMatched: boolean;
    nonPlayerBattlesExecuted: boolean;
    playerBattleExecuted: boolean;
  } {
    return {
      battleMatched: this.battleMatched,
      nonPlayerBattlesExecuted: this.nonPlayerBattlesExecuted,
      playerBattleExecuted: this.playerBattleExecuted,
    };
  }

  public getBattleState(): BattleState {
    return this.battleState;
  }

  public getPlayerArmyId(): string | null {
    return this.playerBattleGroupId;
  }

  public getWinningStatus(): { winner: BattleSide | null; isDraw: boolean } {
    const aliveSides = this.battleState.sides.filter((side) =>
      side.armies.some((army) => army.squads.some((squad) => !squad.isDead))
    );

    return {
      winner: aliveSides.length === 1 ? aliveSides[0] : null,
      isDraw: aliveSides.length === 0,
    };
  }

  public getActiveBattleGroups(): BattleGroup[] {
    return this.battleState.battleGroups.filter(
      (group) => !group.battleState.isOver
    );
  }

  public getPlayerSide(): BattleSide | undefined {
    return this.battleState.sides.find((side) => side.isPlayerSide);
  }

  public isPlayerArmy(army: Army): boolean {
    const playerSide = this.getPlayerSide();
    return playerSide?.armies.includes(army) || false;
  }

  public isPlayerBattleGroup(group: BattleGroup): boolean {
    const playerSide = this.getPlayerSide();
    if (!playerSide) return false;

    return (
      group.side1Armies.some((army) => playerSide.armies.includes(army)) ||
      group.side2Armies.some((army) => playerSide.armies.includes(army))
    );
  }

  public getBattleGroups(): BattleGroup[] {
    return this.battleState.battleGroups;
  }

  public getSides(): BattleSide[] {
    return this.battleState.sides;
  }

  public getRound(): number {
    return this.battleState.round;
  }

  public isBattleOver(): boolean {
    return this.battleState.isBattleOver;
  }

  private recordBattleResult(
    group: BattleGroup,
    attackerSquad: Squad,
    targetSquad: Squad,
    damage: number,
    isCritical: boolean
  ): void {
    this.battleStateHandler.recordBattleResult(
      group,
      attackerSquad,
      targetSquad,
      damage,
      isCritical
    );
  }

  public getBattleGroupResult(groupId: string): BattleGroupResult | undefined {
    return this.currentBattleGroupResults.get(groupId);
  }

  public getAllBattleResults(): Map<string, BattleGroupResult> {
    return this.currentBattleGroupResults;
  }

  public getParticipatingSquads(army: Army): Squad[] {
    return army.squads.filter((squad) => !squad.isDead);
  }

  public getSquadPosition(): typeof SquadPosition {
    return SquadPosition;
  }

  public clearCurrentBattleGroupResults(): void {
    this.currentBattleGroupResults.clear();
  }

  public setBattleMatched(value: boolean): void {
    this.battleMatched = value;
  }

  public setNonPlayerBattlesExecuted(value: boolean): void {
    this.nonPlayerBattlesExecuted = value;
  }

  public setPlayerBattleExecuted(value: boolean): void {
    this.playerBattleExecuted = value;
  }

  public setPlayerBattleGroupId(value: string | null): void {
    this.playerBattleGroupId = value;
  }
}
