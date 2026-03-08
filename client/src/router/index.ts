import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/teams',
    name: 'Teams',
    component: () => import('../views/Teams.vue'),
    meta: { title: '球队列表' }
  },
  {
    path: '/teams/:id',
    name: 'TeamDetail',
    component: () => import('../views/TeamDetail.vue'),
    meta: { title: '球队详情' }
  },
  {
    path: '/players',
    name: 'Players',
    component: () => import('../views/Players.vue'),
    meta: { title: '球员列表' }
  },
  {
    path: '/players/:id',
    name: 'PlayerDetail',
    component: () => import('../views/PlayerDetail.vue'),
    meta: { title: '球员详情' }
  },
  {
    path: '/matches',
    name: 'Matches',
    component: () => import('../views/Matches.vue'),
    meta: { title: '比赛列表' }
  },
  {
    path: '/matches/:id',
    name: 'MatchDetail',
    component: () => import('../views/MatchDetail.vue'),
    meta: { title: '比赛详情' }
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('../views/Analysis.vue'),
    meta: { title: '数据分析' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;