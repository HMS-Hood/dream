import { Team } from './Team';
import { Emblem } from './Emblem';
import { Flag } from './Flag';
import { TeamMember } from '../interfaces';
import { TeamMemberLevel } from '../enums';

export class Player {
  id: string;

  name: string;

  title: string;

  reputation: number;

  familyEmblem: Emblem;

  familyFlag: Flag;

  team: Team; // The default team

  protagonist: TeamMember = {
    id: 'protagonist',
    name: 'Jane',
    strength: 5,
    agility: 5,
    endurance: 5,
    intelligence: 5,
    energy: 5,
    luck: 5,
    level: TeamMemberLevel.ROOKIE,
  };

  constructor(name: string, familyEmblem: Emblem, familyFlag: Flag) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = name;
    this.title = 'Adventurer';
    this.reputation = 0;
    this.familyEmblem = familyEmblem;
    this.familyFlag = familyFlag;
    this.team = new Team(name, this.protagonist, familyEmblem, familyFlag);
  }

  createTeam(teamName: string, emblem: Emblem, flag: Flag) {
    this.team = new Team(teamName, this.protagonist, emblem, flag);
  }

  addReputation(amount: number) {
    this.reputation += amount;
  }

  setTitle(title: string) {
    this.title = title;
  }
}

export default Player;
