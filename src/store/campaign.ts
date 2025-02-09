/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia';
import { RefactoredCampaign } from '../core/battle/refactoredCampaign';

export const useCampaignStore = defineStore('campaign', {
  state: () => ({
    campaign: null as RefactoredCampaign | null,
  }),

  actions: {
    setCampaign(campaign: RefactoredCampaign | null) {
      if (campaign instanceof RefactoredCampaign) {
        this.campaign = campaign;
      } else {
        this.campaign = null;
      }
    },

    getCampaign(): RefactoredCampaign | null {
      return this.campaign as RefactoredCampaign | null;
    },
  },
});
