/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { IArmy } from '../core/interfaces/combat';

export const useArmyStore = defineStore('Army', {
  state: () => ({
    army: null as IArmy | null,
  }),

  actions: {
    setArmy(army: IArmy | null) {
      this.army = army;
    },

    getArmy(): IArmy | null {
      return this.army as IArmy | null;
    },
  },
});
