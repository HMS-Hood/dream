/* eslint-disable import/prefer-default-export */
import { reactive } from 'vue';
import { Emblem } from './Emblem';
import { Flag } from './Flag';

export class Team {
  id: string;

  name: string;

  emblem: Emblem;

  flag: Flag;

  memberIds: string[];

  leaderId: string;

  viceLeaderId?: string;

  constructor(name: string, leaderId: string, emblem: Emblem, flag: Flag) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = name;
    this.emblem = emblem;
    this.flag = flag;
    this.leaderId = leaderId;
    this.memberIds = reactive([]);
  }

  addMember(memberId: string): void {
    this.memberIds.push(memberId);
  }

  removeMember(removedMemberId: string): void {
    this.memberIds = this.memberIds.filter(
      (memberId) => memberId !== removedMemberId
    );
  }

  setLeader(newLeaderId: string): void {
    this.leaderId = newLeaderId;
  }

  setViceLeader(newViceLeaderId: string): void {
    this.viceLeaderId = newViceLeaderId;
  }
}
