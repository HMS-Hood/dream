/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { SquadPosition } from '@/core/enums';

export type SquadTemplate = {
  position: SquadPosition;
  leaderId: string;
  membersId: string[];
};

export const useArmyStyleStore = defineStore('ArmyStyle', {
  state: (): { squads: SquadTemplate[] } => ({
    squads: [],
  }),

  actions: {
    setArmyStyle(squads: SquadTemplate[]) {
      this.squads = squads;
    },

    getArmyStyle(): SquadTemplate[] {
      return this.squads;
    },
  },
});
