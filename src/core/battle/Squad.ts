/* eslint-disable import/prefer-default-export */
import { SquadPosition } from '../enums';
import { ICombatUnit } from '../interfaces';
import { ISquad, ISquadData } from '../interfaces/combat';
import {
  baseMemberList,
  charmQualityAdjustMemberLimit,
} from '../setting/param-combat';
import { generateId, getQualityForValue } from '../utils/utils';

export class Squad implements ISquad {
  id: string;

  leaderId: string;

  position: SquadPosition;

  members: ICombatUnit[];

  targetIds: string[];

  isDead: boolean;

  constructor(initData: ISquadData) {
    this.id = initData.id ?? generateId();
    this.position = initData.position ?? SquadPosition.FRONT;
    this.members = initData.members ?? [];
    if (initData.leaderId) {
      this.leaderId = initData.leaderId;
    } else if (initData.members?.length && initData.members.length > 0) {
      this.leaderId = initData.members[0].getCharacter().id;
    } else {
      this.leaderId = '';
    }
    this.targetIds = initData.targetIds ?? [];
    this.isDead = initData.isDead ?? false;
  }

  get memberLimit() {
    if (this.leaderId) {
      const leader = this.members.find(
        (member) => member.getCharacter().id === this.leaderId
      );
      if (leader) {
        const charmQuality = getQualityForValue(leader.getCharacter().charm);
        return baseMemberList + charmQualityAdjustMemberLimit[charmQuality];
      }
    }
    return baseMemberList;
  }
}
