/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { Weapon, Shield, Armor } from '@/core/interfaces/item';
import { Mission } from '@/core/mission/Mission';
import { CharacterInterface } from '@/core/interfaces';
import { Calendar } from '@/core/entities/Calendar';
import { calendar } from '@/core/game';
import { generateCharacter } from '@/core/utils/utils';
import { QualityLevel } from '@/core/enums';
import { generateRandomEquipment } from '@/core/utils/itemUtils';

type EnvDataState = {
  items: (Weapon | Shield | Armor)[];
  missions: Mission[];
  recruit: CharacterInterface[];
  createDate: Calendar;
};

const generateRecruit = () => {
  const result: CharacterInterface[] = [];
  for (let i = 0; i < 10; i += 1) {
    result.push(generateCharacter());
  }
  return result;
};

const generateEquipment = () => {
  const result: (Weapon | Armor | Shield)[] = [];
  for (let i = 0; i < 10; i += 1) {
    result.push(generateRandomEquipment(QualityLevel.D));
  }
  return result;
};

const renewData = (state: EnvDataState): void => {
  const renewDays = [21, 11, 1];
  if (calendar.equals(state.createDate)) {
    return;
  }
  const renewCalendar = renewDays.filter((day) => {
    if (calendar.day >= day) {
      return (
        new Calendar(calendar.year, calendar.month, day).getPassedTime(
          state.createDate
        ) > 0
      );
    }
    return false;
  });

  if (renewCalendar.length === 0) {
    return;
  }

  state.items = generateEquipment();
  state.missions = [];
  state.recruit = generateRecruit();
  state.createDate = new Calendar(
    calendar.year,
    calendar.month,
    renewCalendar[0]
  );
};

export const useArmyStore = defineStore('Army', {
  state: (): EnvDataState => ({
    items: [],
    missions: [],
    recruit: [],
    createDate: new Calendar(100),
  }),

  actions: {
    setItems(items: (Weapon | Shield | Armor)[]) {
      this.items = items;
    },

    setMissions(missions: Mission[]) {
      this.missions = missions;
    },

    setRecruit(recruit: CharacterInterface[]) {
      this.recruit = recruit;
    },

    getItems(): (Weapon | Shield | Armor)[] {
      renewData(this);
      return this.items;
    },

    getMissions(): Mission[] {
      renewData(this);
      return this.missions;
    },

    getRecruit(): CharacterInterface[] {
      renewData(this);
      return this.recruit;
    },
  },
});
