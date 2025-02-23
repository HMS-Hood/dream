/* eslint-disable import/prefer-default-export */
import { SquadPosition } from '../enums';
import { ICombatUnit } from '../interfaces';
import { ISquad, ISquadData } from '../interfaces/combat';
import {
  baseMemberLimit,
  charmQualityAdjustMemberLimit,
} from '../setting/param-combat';
import { generateId, getQualityForValue } from '../utils/utils';

export class Squad implements ISquad {
  id: string;

  leaderId: string;

  position: SquadPosition;

  members: ICombatUnit[];

  targetIds: string[];

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
  }

  checkLimit(): boolean {
    if (this.leaderId === '' && this.members.length > 0) {
      this.leaderId = this.members[0].getCharacter().id;
    }
    if (this.members.length > this.memberLimit) {
      return false;
    }
    return true;
  }

  get memberLimit() {
    if (this.leaderId) {
      const leader = this.members.find(
        (member) => member.getCharacter().id === this.leaderId
      );
      if (leader) {
        const charmQuality = getQualityForValue(leader.getCharacter().charm);
        return baseMemberLimit + charmQualityAdjustMemberLimit[charmQuality];
      }
      if (this.members.length > 0) {
        this.leaderId = this.members[0].getCharacter().id;
        const charmQuality = getQualityForValue(
          this.members[0].getCharacter().charm
        );
        return baseMemberLimit + charmQualityAdjustMemberLimit[charmQuality];
      }
      this.leaderId = '';
    }
    return baseMemberLimit;
  }

  get isDead(): boolean {
    return this.members.every((member) => member.isDead);
  }

  get leader(): ICombatUnit | undefined {
    return this.members.find(
      (member) => member.getCharacter().id === this.leaderId
    );
  }

  setLeaderId(leaderId: string) {
    if (this.members.some((member) => member.getCharacter().id === leaderId)) {
      this.leaderId = leaderId;
    } else {
      throw new Error(`id [${leaderId}] is not exist in members`);
    }
  }
}
