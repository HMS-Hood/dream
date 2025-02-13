/* eslint-disable import/prefer-default-export */
import { reactive } from 'vue';
import { Emblem } from './Emblem';
import { Flag } from './Flag';
import { generateCharacter } from '../utils/utils';
import { Character } from './Character';
import { Item } from '../interfaces/item';

export class Player {
  id: string;

  name: string;

  nickName: string;

  title: string;

  reputation: number;

  familyEmblem: Emblem;

  familyFlag: Flag;

  gold: number;

  items: Item[] = reactive([]);

  members: Character[] = reactive([]);

  deadMembers: Character[] = reactive([]);

  protagonistId: string;

  constructor(name: string, familyEmblem: Emblem, familyFlag: Flag) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = name;
    this.nickName = '';
    this.title = '';
    this.reputation = 0;
    this.familyEmblem = familyEmblem;
    this.familyFlag = familyFlag;
    this.gold = 2000;
    const protagonist = reactive(generateCharacter());
    this.protagonistId = protagonist.id;
    this.members.push(protagonist);
  }

  addReputation(amount: number) {
    this.reputation += amount;
  }

  setTitle(title: string) {
    this.title = title;
  }
}
