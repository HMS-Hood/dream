/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { MissionDifficulty, QualityLevel } from '@/core/enums';
import { Calendar } from '@/core/entities/Calendar';
import { MissionResult } from '@/core/mission/Mission';

export type DoingMission = {
  name: string;
  quality: QualityLevel;
  difficulty: MissionDifficulty;
  desc: string;
  result: MissionResult;
  startDay: Calendar;
};

export const useDoingMissionStore = defineStore('DoingMission', {
  state: (): { doingMission: DoingMission[] } => ({
    doingMission: [],
  }),

  actions: {
    setDoingMission(doingMission: DoingMission[]) {
      this.doingMission = doingMission;
    },

    getDoingMission(): DoingMission[] {
      return this.doingMission;
    },
  },
});
