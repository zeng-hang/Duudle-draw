import { createRouter, createWebHistory } from 'vue-router'
import { getUserInfo } from '@/store/localforage.js'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('../views/Game.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from) => {
  const userInfo = await getUserInfo();

  if (to.name === 'Register') {
    if (userInfo) {
      return { name: 'Home' };
    } else {
      return true;
    }
  }

  if (!userInfo) {
    return { name: 'Register' };
  }

  return true;
});

export default router