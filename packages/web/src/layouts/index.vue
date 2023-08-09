<script setup lang="tsx">
import { ref } from 'vue'
import GlobalSetting from '@/components/GlobalSetting.vue'

import { useDark, useFullscreen, useToggle } from '@vueuse/core'
import useLocale from '@/hooks/useLocale'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

const { currentLocale, changeLocale } = useLocale()

const switchLang = () => {
  if (currentLocale.value == 'zh-CN') {
    changeLocale('en-US')
  } else {
    changeLocale('zh-CN')
  }
}

const settingVisible = ref<boolean>(false)
const toggleSettingVisible = useToggle(settingVisible)
</script>

<template>
  <header flex="~ justify-between items-center" class="w-full fixed box-border px-4 py-2">
    <span class="font-bold select-none text-xl">Dependency Analyzer</span>
    <div>
      <button
        title="全屏"
        type="button"
        class="pa-1 mr-2 cursor-pointer rounded-full"
        bg="gray-1 hover:gray-2 active:gray-3 dark:slate-6 hover:dark:slate-7 active:dark:slate-8"
        border="solid 1 gray-3 dark:slate-5"
        @click="toggleFullscreen"
      >
        <i
          :class="isFullscreen ? 'i-uil-compress' : 'i-uil-focus'"
          text="2xl gray-6 dark:slate-1"
        />
      </button>
      <button
        title="语言"
        type="button"
        class="mr-2 cursor-pointer rounded-full pa-1"
        bg="gray-1 hover:gray-2 active:gray-3 dark:slate-6 hover:dark:slate-7 active:dark:slate-8"
        border="solid 1 gray-3 dark:slate-5"
        @click="() => switchLang()"
      >
        <i class="i-uil-english-to-chinese" text="2xl gray-6 dark:slate-1" />
      </button>
      <button
        title="颜色模式"
        type="button"
        class="mr-2 cursor-pointer rounded-full pa-1"
        bg="gray-1 hover:gray-2 active:gray-3 dark:slate-6 hover:dark:slate-7 active:dark:slate-8"
        border="solid 1 gray-3 dark:slate-5"
        @click="() => toggleDark()"
      >
        <i class="i-uil-moonset dark:i-uil-sunset" text="2xl gray-6 dark:slate-1" />
      </button>
      <button
        title="设置"
        type="button"
        class="cursor-pointer rounded-full pa-1"
        bg="gray-1 hover:gray-2 active:gray-3 dark:slate-6 hover:dark:slate-7 active:dark:slate-8"
        border="solid 1 gray-3 dark:slate-5"
        @click="() => toggleSettingVisible()"
      >
        <i class="i-uil-setting" text="2xl gray-6 dark:slate-1" />
      </button>
    </div>
  </header>

  <Transition name="setting">
    <aside v-if="settingVisible" class="absolute top-16 right-4">
      <GlobalSetting @close="toggleSettingVisible" />
    </aside>
  </Transition>

  <main>
    <router-view />
  </main>
</template>

<style scoped>
.setting-enter-active {
  position: absolute;
  animation: setting-enter 0.3s;
}
.setting-leave-active {
  position: absolute;
  animation: setting-enter 0.3s reverse;
}

@keyframes setting-enter {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

<style>
body {
  overflow: hidden;
}
</style>
