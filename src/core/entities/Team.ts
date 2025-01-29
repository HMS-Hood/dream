import { TeamMember } from '../interfaces';
import { Emblem } from './Emblem';
import { Flag } from './Flag';
import { TeamMemberLevel } from '../enums';

export class Team {
  id: string;

  name: string;

  emblem: Emblem;

  flag: Flag;

  members: TeamMember[];

  leader: TeamMember;

  viceLeader?: TeamMember;

  constructor(name: string, leader: TeamMember, emblem: Emblem, flag: Flag) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = name;
    this.emblem = emblem;
    this.flag = flag;
    this.members = [
      {
        id: leader.id,
        name: leader.name,
        strength: 5,
        agility: 5,
        endurance: 5,
        intelligence: 5,
        energy: 5,
        luck: 5,
        level: TeamMemberLevel.ROOKIE,
      },
    ];
    [this.leader] = this.members;
  }

  addMember(member: TeamMember): void {
    this.members.push(member);
  }

  removeMember(memberId: string): void {
    this.members = this.members.filter((member) => member.id !== memberId);
    if (this.leader?.id === memberId) {
      [this.leader] = this.members;
    }
  }

  setLeader(memberId: string): void {
    const newLeader = this.members.find((member) => member.id === memberId);
    if (newLeader) {
      this.leader = newLeader;
    }
  }

  setViceLeader(memberId: string): void {
    const newViceLeader = this.members.find((member) => member.id === memberId);
    if (newViceLeader) {
      this.viceLeader = newViceLeader;
    }
  }
}

export default Team;
