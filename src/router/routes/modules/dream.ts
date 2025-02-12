import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw[] = [
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/my/main.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/recruit',
    name: 'recruit',
    component: () => import('@/views/my/recruit.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/my/shop.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/barracks',
    name: 'barracks',
    component: () => import('@/views/my/barracks.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/campaign',
    name: 'campaign',
    component: () => import('@/views/my/compaign/CampaignView.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/campaign-test',
    name: 'CampaignTest',
    component: () => import('@/views/CampaignTest.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/army-manager',
    name: 'armyManager',
    component: () => import('@/views/my/ArmyManager.vue'),
    meta: {
      requiresAuth: false,
    },
  },
];

export default DASHBOARD;
