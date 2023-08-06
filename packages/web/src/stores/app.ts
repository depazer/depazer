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

  const settingVisible = ref<boolean>(false)
  const toggleSettingVisible = useToggle(settingVisible)

  return { currentRegistry, npmRegistryURLs, settingVisible, toggleSettingVisible }
})
