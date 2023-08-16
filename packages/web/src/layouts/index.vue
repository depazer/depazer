<script setup lang="tsx">
import GlobalSetting from '@/components/GlobalSetting.vue'

import { useLocale } from '@/hooks/locale'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

const { toggleLocale } = useLocale()

const settingVisible = ref<boolean>(false)
const toggleSettingVisible = useToggle(settingVisible)
</script>

<template>
  <header flex="~ justify-between items-center" class="fixed box-border w-full px-4 py-2">
    <span class="select-none text-xl font-bold">Dependency Analyzer</span>
    <div>
      <button
        title="全屏"
        type="button"
        class="mr-2 cursor-pointer rounded-full pa-1"
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
        @click="toggleLocale"
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
    <aside v-if="settingVisible" class="absolute right-4 top-16">
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
