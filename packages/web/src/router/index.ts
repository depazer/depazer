import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/index.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/ModuleNet/index.vue')
        }
      ]
    }
  ]
})

export default router
