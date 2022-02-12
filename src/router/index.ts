import {
  createRouter,
  createWebHistory,
} from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'test',
      component: () => import('@/Index.vue'),
    }
  ],
})

export default router
