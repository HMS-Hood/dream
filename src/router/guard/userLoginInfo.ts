import type { Router } from 'vue-router';

import { player } from '@/core/game';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    if (to.name === 'createHero') {
      next();
      return;
    }
    if (player.protagonistId === '') {
      next({
        name: 'createHero',
      });
      return;
    }
    next();
  });
}
