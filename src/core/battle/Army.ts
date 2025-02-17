/* eslint-disable import/prefer-default-export */
import { IArmy, IArmyData, ISquad } from '../interfaces/combat';
import {
  baseSquadLimit,
  charmQualityAdjustSquadLimit,
} from '../setting/param-combat';
import { generateId, getQualityForValue } from '../utils/utils';

export class Army implements IArmy {
  id: string;

  name: string;

  leaderId: string;

  squads: ISquad[];

  reserveSquads: ISquad[];

  isDead: boolean;

  constructor(initData: IArmyData) {
    this.id = initData.id ?? generateId();
    this.name = initData.name;
    this.squads = initData.squads ?? [];
    if (initData.leaderId) {
      this.leaderId = initData.leaderId;
    } else if (this.squads.length > 0) {
      this.leaderId = this.squads[0].leaderId;
    } else {
      this.leaderId = '';
    }
    this.reserveSquads = initData.reserveSquads ?? [];
    this.isDead = initData.isDead ?? false;
  }

  get squadLimit() {
    if (this.leaderId) {
      const leader = this.squads
        .flatMap((squad) => squad.members)
        .find((member) => member.getCharacter().id === this.leaderId);
      if (leader) {
        return (
          baseSquadLimit +
          charmQualityAdjustSquadLimit[
            getQualityForValue(leader.getCharacter().charm)
          ]
        );
      }
    }
    return baseSquadLimit;
  }
}
