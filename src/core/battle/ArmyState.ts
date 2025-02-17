/* eslint-disable import/prefer-default-export */
import { IArmy } from '../interfaces/combat';
import { SquadState } from './SquadState';

export class ArmyState {
  squadsState: SquadState[];

  army: IArmy;

  initalSquadCount: number;

  constructor(army: IArmy) {
    this.squadsState = army.squads.map((squad) => new SquadState(squad));
    this.army = army;
    this.initalSquadCount = army.squads.filter((squad) => !squad.isDead).length;
  }

  get name(): string {
    return this.army.name;
  }

  get isDead(): boolean {
    return this.army.isDead;
  }

  get squadCount(): number {
    return this.squadsState.filter((squad) => !squad.isDead).length;
  }

  get unitCount(): number {
    return this.squadsState.reduce((acc, squad) => acc + squad.unitCount, 0);
  }

  get initalUnitCount(): number {
    return this.squadsState.reduce(
      (acc, squad) => acc + squad.initalUnitCount,
      0
    );
  }
}
