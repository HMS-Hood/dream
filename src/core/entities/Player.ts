/* eslint-disable import/prefer-default-export */
import { reactive } from 'vue';
import { Team } from './Team';
import { Emblem } from './Emblem';
import { Flag } from './Flag';
import { Equipment } from '../interfaces';
import { generateCharacter } from '../utils';
import { Character } from './Character';

export class Player {
  id: string;

  name: string;

  title: string;

  reputation: number;

  familyEmblem: Emblem;

  familyFlag: Flag;

  gold: number;

  leadTeam: Team; // The default team

  teams: Team[] = reactive([]);

  equipments: Equipment[] = reactive([]);

  members: Character[] = reactive([]);

  protagonistId: string;

  constructor(name: string, familyEmblem: Emblem, familyFlag: Flag) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = name;
    this.title = '红叶原之主';
    this.reputation = 0;
    this.familyEmblem = familyEmblem;
    this.familyFlag = familyFlag;
    this.gold = 0;
    const protagonist = reactive(generateCharacter('jane'));
    this.protagonistId = protagonist.id;
    this.members.push(protagonist);
    this.leadTeam = reactive(
      new Team(name, this.protagonistId, familyEmblem, familyFlag)
    );
  }

  addReputation(amount: number) {
    this.reputation += amount;
  }

  setTitle(title: string) {
    this.title = title;
  }
}
