/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { Weapon, Shield, Armor } from '@/core/interfaces/item';
import { Mission } from '@/core/mission/Mission';
import { CharacterInterface } from '@/core/interfaces';
import { Calendar } from '@/core/entities/Calendar';
import { calendar } from '@/core/game';
import { generateCharacter } from '@/core/utils/utils';
import { difficultyRankMap, QualityLevel, qualityRankMap } from '@/core/enums';
import { generateRandomEquipment } from '@/core/utils/itemUtils';
import { missionsInfo as efMissionsInfo } from '@/core/setting/mission-info-ef';
import { missionsInfo as dMissionsInfo } from '@/core/setting/mission-info-d';
import { missionsInfo as cMissionsInfo } from '@/core/setting/mission-info-c';
import { missionsInfo as bMissionsInfo } from '@/core/setting/mission-info-b';
import { getRandomElements } from '@/core/utils/arrayUtils';

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

const generateMissions = (): Mission[] => {
  // 从不同级别的任务池中随机抽取
  const efMissions = getRandomElements(efMissionsInfo, 20);
  const dMissions = getRandomElements(dMissionsInfo, 10);
  const cMissions = getRandomElements(cMissionsInfo, 5);
  const bMissions = getRandomElements(bMissionsInfo, 3);

  // 合并所有任务信息并转换为Mission对象
  const allMissionInfos = [
    ...efMissions,
    ...dMissions,
    ...cMissions,
    ...bMissions,
  ];

  // 将任务信息转换为Mission对象并排序
  return allMissionInfos
    .map(
      (info) => new Mission(info.name, info.desc, info.quality, info.difficulty)
    )
    .sort((a, b) => {
      // 首先按品质排序（从高到低）
      if (a.quality !== b.quality) {
        return qualityRankMap[b.quality] - qualityRankMap[a.quality];
      }
      // 品质相同时按难度排序（从高到低）
      return difficultyRankMap[b.difficulty] - difficultyRankMap[a.difficulty];
    });
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
  state.missions = generateMissions();
  state.recruit = generateRecruit();
  state.createDate = new Calendar(
    calendar.year,
    calendar.month,
    renewCalendar[0]
  );
};

export const useEnvDataStore = defineStore('Army', {
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
