import { SquadPosition, AttackMethod, TeamMemberLevel } from '../enums';

export interface TeamMember {
  id: string;
  name: string;
  strength: number;
  agility: number;
  endurance: number;
  intelligence: number;
  energy: number;
  luck: number;
  level: TeamMemberLevel;
}

export interface Squad {
  id: string; // Unique ID for each squad
  position: SquadPosition;
  attackSpeed: number;
  attackMethod: AttackMethod;
  members: TeamMember[]; // Use TeamMember type
  // Add properties to track targets, dead status for battle
  targets: Squad[];
  isDead: boolean;
}

export interface Army {
  id: string; // Unique ID for each army
  squads: Squad[];
  reserveSquads: Squad[];
}

export interface BattleConfig {
  maxRounds: number;
  maxTroopsPerSide: number;
  battleTimeLimit: number;
}

export interface BattleState {
  armies: Army[];
  round: number;
  isBattleOver: boolean;
}
