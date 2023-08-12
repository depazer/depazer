import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useToggle } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  const npmRegistryURLs = [
    'https://registry.npmmirror.com/',
    'https://registry.npmjs.cf/',
    'https://registry.npmjs.org/'
  ]
  const currentRegistry = ref<string>(npmRegistryURLs[0])

  const fixedNailModel = ref<boolean>(false)
  const toggleFixedNailModel = useToggle(fixedNailModel)

  const repulsion = ref<number>(5000)

  return { currentRegistry, npmRegistryURLs, toggleFixedNailModel, fixedNailModel, repulsion }
})
