/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { reactive } from 'vue';
import { Player } from './entities/Player';
import { Emblem } from './entities/Emblem';
import { Flag } from './entities/Flag';
import { generateCharacter } from './utils/dataUtils';
import { Calendar } from './entities/Calendar';
import { ICalendar } from './interfaces';
import { Territory } from './entities/Territory';
import { MonthTrigger } from './entities/trigger/MonthTrigger';

// Create Emblem and Flag
const emblem = new Emblem('Eagle Emblem', '/img/emblem.png');
const flag = new Flag('Red Banner', '/images/red-banner.png');

// Create Player
export const player = reactive(new Player(emblem, flag));

export const setPlayer = (newPlayer: Player) => {
  Object.assign(player, newPlayer);
};

for (let i = 1; i <= 4; i += 1) {
  const character = reactive(generateCharacter());
  player.members.push(character);
}

export const calendar = reactive(new Calendar());

export const setCalendar = (newCalendar: ICalendar) => {
  Object.assign(calendar, newCalendar);
};

export const territory = reactive(new Territory(5000, 100, 200, 1));

const territoryMonthTrigger = new MonthTrigger(
  new Calendar(),
  (triggerCalendar: ICalendar) => {
    territory.population += territory.popuInc;
    territory.prosperity += territory.prosInc;
    player.gold += territory.tax;
  }
);

calendar.triggers.push(territoryMonthTrigger);
