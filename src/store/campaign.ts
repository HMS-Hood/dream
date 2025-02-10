/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { Campaign } from '../core/battle/campaign';

export const useCampaignStore = defineStore('campaign', {
  state: () => ({
    campaign: null as Campaign | null,
  }),

  actions: {
    setCampaign(campaign: Campaign | null) {
      if (campaign instanceof Campaign) {
        this.campaign = campaign;
      } else {
        this.campaign = null;
      }
    },

    getCampaign(): Campaign | null {
      return this.campaign as Campaign | null;
    },
  },
});
