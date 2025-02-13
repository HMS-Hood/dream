/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { Army } from '../core/interfaces/combat';

export const useArmyStore = defineStore('Army', {
  state: () => ({
    army: null as Army | null,
  }),

  actions: {
    setArmy(army: Army | null) {
      this.army = army;
    },

    getArmy(): Army | null {
      return this.army as Army | null;
    },
  },
});
