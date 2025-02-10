/* eslint-disable import/prefer-default-export */
import { Squad } from '../interfaces/combat';
import { UnitState } from './UnitState';
import { SquadPosition } from '../enums';

export class SquadState {
  unitsState: UnitState[];

  squad: Squad;

  initalUnitCount: number;

  constructor(squad: Squad) {
    this.unitsState = squad.members.map((unit) => new UnitState(unit));
    this.squad = squad;
    this.initalUnitCount = squad.members.filter((unit) => !unit.isDead).length;
  }

  get id(): string {
    return this.squad.id;
  }

  get position(): SquadPosition {
    return this.squad.position;
  }

  get isDead(): boolean {
    return this.squad.isDead;
  }

  get unitCount(): number {
    return this.unitsState.filter((unit) => !unit.isDead).length;
  }
}
