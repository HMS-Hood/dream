import {
  SquadPosition,
  AttackMethod,
  CharacterLevel,
  QualityLevel,
} from '../enums';
import { Armor, OneHandWeapon, Shield, TwoHandWeapon } from './item';

export interface Skill {
  name: string;
  Effect: any;
}

export interface CharacterInterface {
  id: string;
  name: string;
  avatar: string;
  level: CharacterLevel;
  experience: number;
  quality: QualityLevel;
  attackMethod: AttackMethod;
  health: number;
  strength: number;
  agility: number;
  endurance: number;
  intelligence: number;
  spirit: number;
  perception: number;
  luck: number;
  charm: number;
  skills: Skill[];
  oneHandWeapon?: OneHandWeapon;
  twoHandWeapon?: TwoHandWeapon;
  shield?: Shield;
  armor?: Armor;
}

export interface Squad {
  id: string; // Unique ID for each squad
  position: SquadPosition;
  attackSpeed: number;
  attackMethod: AttackMethod;
  members: CharacterInterface[]; // Use TeamMember type
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

export interface Equipment {
  name: string;
}

export interface Question {
  name: string;
  desc: string;
  quality: QualityLevel;
}
