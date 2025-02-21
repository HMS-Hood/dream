/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';

export const useStatusStore = defineStore('panel.status', {
  state: () => ({
    difficulty: '',
    quality: '',
  }),

  actions: {
    setDifficulty(difficulty: string) {
      this.difficulty = difficulty;
    },

    setQuality(quality: string) {
      this.quality = quality;
    },

    getDifficulty(): string {
      return this.difficulty;
    },

    getQuality(): string {
      return this.quality;
    },
  },
});
