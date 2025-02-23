import { SquadPosition } from '../enums';
import { CombatUnit } from '../battle/CombatUnit';
import { ICombatUnit } from '.';

export interface ISquadData {
  id?: string;
  leaderId?: string;
  position?: SquadPosition;
  members?: ICombatUnit[];
  readonly memberLimit?: number;
  targetIds?: string[];
  isDead?: boolean;
}

export interface ISquad extends ISquadData {
  id: string;
  leaderId: string;
  position: SquadPosition;
  members: ICombatUnit[];
  readonly memberLimit: number;
  targetIds: string[];
  isDead: boolean;
  leader: ICombatUnit | undefined;
  checkLimit: () => boolean;
  setLeaderId: (leaderId: string) => void;
}

export interface IArmyData {
  id?: string; // Unique ID for each army
  name: string;
  leaderId?: string;
  squads?: ISquad[];
  readonly squadLimit?: number;
  reserveSquads?: ISquad[];
  isDead?: boolean;
}

export interface IArmy extends IArmyData {
  id: string; // Unique ID for each army
  name: string;
  leaderId: string;
  squads: ISquad[];
  readonly squadLimit: number;
  reserveSquads: ISquad[];
  isDead: boolean;
  checkLimit: () => boolean;
  setLeaderId: (leaderId: string) => void;
}

export interface BattleGroup {
  id: string;
  side1Armies: IArmy[];
  side2Armies: IArmy[];
  battleState: {
    timeElapsed: number;
    isOver: boolean;
  };
}

export interface BattleSide {
  id: string;
  name: string;
  armies: IArmy[]; // 当前上场部队
  reserveArmies: IArmy[]; // 后备部队
  isPlayerSide: boolean;
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
