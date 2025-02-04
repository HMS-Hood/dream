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
    path: '/barracks',
    name: 'barracks',
    component: () => import('@/views/my/barracks.vue'),
    meta: {
      requiresAuth: false,
    },
  },
];

export default DASHBOARD;
