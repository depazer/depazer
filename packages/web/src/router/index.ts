import { useModuleStore } from '@/stores/module'
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
          component: () => import('@/views/index.vue')
        },
        {
          path: 'init/:depth/:includeDev',
          redirect: (to) => {
            const moduleStore = useModuleStore()

            moduleStore.moduleConfig.depth = +(to.params.depth ?? '2')
            moduleStore.moduleConfig.includeDev = to.params.includeDev === 'true'

            return {
              name: 'home',
              params: {}
            }
          }
        }
      ]
    }
  ]
})

export default router
