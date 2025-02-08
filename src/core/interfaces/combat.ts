import { SquadPosition } from '../enums';
import { CombatUnit } from '../entities/CombatUnit';
import { BattleConfig } from '.';

export interface Squad {
  id: string;
  position: SquadPosition;
  attackSpeed: number;
  members: CombatUnit[];
  targetIds: string[];
  isDead: boolean;
}

export interface Army {
  id: string; // Unique ID for each army
  squads: Squad[];
  reserveSquads: Squad[];
}

export interface BattleGroup {
  id: string;
  side1Armies: Army[];
  side2Armies: Army[];
  battleState: {
    timeElapsed: number;
    isOver: boolean;
  };
}

export interface BattleSide {
  id: string;
  name: string;
  armies: Army[]; // 当前上场部队
  reserveArmies: Army[]; // 后备部队
  isPlayerSide: boolean;
}

export interface BattleState {
  sides: BattleSide[];
  battleGroups: BattleGroup[];
  round: number;
  isBattleOver: boolean;
}

export interface BattleAction {
  attackerSquadId: string;
  targetSquadId: string;
  damage: number;
  isCritical: boolean;
  targetDestroyed: boolean;
}

export interface BattleRound {
  round: number;
  actions: BattleAction[];
}

export interface CombatLog {
  attackerId: CombatUnit;
  targetId: CombatUnit;
  damage: number;
  type: string;
  isKill: boolean;
}

export interface BattleGroupResult {
  isPlayerInvolved: boolean;
  groupId: string;
  rounds: BattleRound[];
  winningSide?: number;
  combatLogs: CombatLog[];
  casualties?: {
    side1: number;
    side2: number;
  };
}

export interface ICampaign {
  executeNextStep(): 'match' | 'nonPlayerBattles' | 'playerBattle' | 'complete';
  getCurrentBattleResults(): Map<string, BattleGroupResult>;
  getBattleStatus(): {
    battleMatched: boolean;
    nonPlayerBattlesExecuted: boolean;
    playerBattleExecuted: boolean;
  };
  getBattleConfig(): BattleConfig;
  getBattleState(): BattleState;
  getPlayerArmyId(): string | null;
  getWinningStatus(): { winner: BattleSide | null; isDraw: boolean };
  getActiveBattleGroups(): BattleGroup[];
  getPlayerSide(): BattleSide | undefined;
  isPlayerArmy(army: Army): boolean;
  isPlayerBattleGroup(group: BattleGroup): boolean;
  getBattleGroups(): BattleGroup[];
  getSides(): BattleSide[];
  getRound(): number;
  isBattleOver(): boolean;
  getBattleGroupResult(groupId: string): BattleGroupResult | undefined;
  getAllBattleResults(): Map<string, BattleGroupResult>;
  getParticipatingSquads(army: Army): Squad[];
  getSquadPosition(): typeof SquadPosition;
  clearCurrentBattleGroupResults(): void;
  setBattleMatched(value: boolean): void;
  setNonPlayerBattlesExecuted(value: boolean): void;
  setPlayerBattleExecuted(value: boolean): void;
  setPlayerBattleGroupId(value: string | null): void;
}
