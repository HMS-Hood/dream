/* eslint-disable import/prefer-default-export */
import { reactive } from 'vue';
import { Emblem } from './Emblem';
import { Flag } from './Flag';
import { Character } from './Character';
import { Item } from '../interfaces/item';
import { generateId } from '../utils/utils';
import { CharacterLevel } from '../enums';
import { Equipments } from './Equipments';

const maidCharactor = new Character({
  id: generateId(),
  name: '辛西娅',
  nickName: '贴身女仆',
  avatar: '/img/avatar/1166.png',
  level: CharacterLevel.ORDINARY,
  experience: 0,
  strength: 13,
  agility: 17,
  endurance: 12,
  intelligence: 6,
  spirit: 7,
  perception: 9,
  charm: 8,
  luck: 8,
  skills: [],
  equipment: new Equipments(),
});

export class Player {
  id: string;

  title: string;

  reputation: number;

  familyEmblem: Emblem;

  familyFlag: Flag;

  gold: number;

  items: Item[] = reactive([]);

  members: Character[] = reactive([]);

  deadMembers: Character[] = reactive([]);

  workingIds: string[] = reactive([]);

  protagonistId: string;

  constructor(familyEmblem: Emblem, familyFlag: Flag) {
    this.id = generateId();
    this.title = '';
    this.reputation = 0;
    this.familyEmblem = familyEmblem;
    this.familyFlag = familyFlag;
    this.gold = 2000;
    this.protagonistId = '';
    this.members.push(maidCharactor);
  }

  get protagonist(): Character {
    return this.members.find((member) => member.id === this.protagonistId)!;
  }

  setProtagonist(protagonist: Character) {
    this.members.splice(0, 0, protagonist);
    this.protagonistId = protagonist.id;
  }

  reload(loadData: Player) {
    this.id = loadData.id;
    this.title = loadData.title;
    this.reputation = loadData.reputation;
    this.familyEmblem = loadData.familyEmblem;
    this.familyFlag = loadData.familyFlag;
    this.gold = loadData.gold;
    this.items = loadData.items;
    this.members = loadData.members.map((member) => new Character(member));
    this.deadMembers = loadData.deadMembers.map(
      (member) => new Character(member)
    );
    this.protagonistId = loadData.protagonistId;
  }

  addReputation(amount: number) {
    this.reputation += amount;
  }

  setTitle(title: string) {
    this.title = title;
  }
}
