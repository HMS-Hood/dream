/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { MissionInfo } from '@/core/mission/Mission';

export const useMissionInfoStore = defineStore('mission', {
  state: (): {
    missionInfo: MissionInfo | undefined;
  } => ({
    missionInfo: undefined,
  }),

  actions: {
    setMissionInfo(missionInfo: MissionInfo) {
      this.missionInfo = missionInfo;
    },

    clearMissionInfo() {
      this.missionInfo = undefined;
    },

    getMissionInfo(): MissionInfo | undefined {
      return this.missionInfo;
    },
  },
});
