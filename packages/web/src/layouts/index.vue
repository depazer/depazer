<script setup lang="tsx">
import GlobalSetting from '@/components/GlobalSetting.vue'
import EnvironmentInfo from '@/components/EnvironmentInfo.vue'
import LoopDependency from '@/components/LoopDependency.vue'
import Tip from '@/components/base/Tip/index.vue'

import html2canvas from 'html2canvas'
import { useLocale } from '@/hooks/locale'
import { useAppStore } from '@/stores/app'
import { useModuleStore } from '@/stores/module'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const isPlayground = ref(import.meta.env.MODE === 'playground')

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

const { toggleLocale } = useLocale()

const appStore = useAppStore()
const { settingCardVisible, loopDependencyCardVisible } = storeToRefs(appStore)
const toggleSettingVisible = useToggle(settingCardVisible)

const { moduleConfig } = storeToRefs(useModuleStore())
function handleToggleRootDependency(rootDependency: string) {
  loopDependencyCardVisible.value = false

  moduleConfig.value.rootModule = rootDependency
}

const mainRef = ref<HTMLElement | null>(null)
const handleScreenshot = useDebounceFn(() => {
  if (!mainRef.value) return

  html2canvas(mainRef.value, {
    backgroundColor: isDark.value ? '#111729' : '#e1e4e8'
  }).then((canvas) => {
    const link = document.createElement('a')
    canvas.toBlob((blob) => {
      let url = URL.createObjectURL(blob!)
      link.download = 'depazer.png'
      link.href = url
      link.click()
    })
  })
}, 300)

const buttonList = computed(() => [
  {
    title: '全屏',
    icon: isFullscreen.value ? 'i-uil-compress' : 'i-uil-focus',
    onClick: toggleFullscreen
  },
  { title: '截图', icon: 'i-ri-screenshot-fill', onClick: handleScreenshot },
  { title: '语言', icon: 'i-uil-english-to-chinese', onClick: toggleLocale },
  { title: '颜色模式', icon: 'i-uil-moonset dark:i-uil-sunset', onClick: toggleDark },
  { title: '设置', icon: 'i-uil-setting', onClick: toggleSettingVisible }
])
</script>

<template>
  <header flex="~ justify-between items-center" class="fixed box-border w-full px-4 py-2">
    <a
      class="select-none text-xl font-bold decoration-none text-slate-9 dark:text-slate-1"
      href="https://depazer.github.io/depazer"
      target="_blank"
      title="document"
    >
      <img src="/logo.svg" class="w-7 align-bottom" /> Depazer
    </a>

    <Tip v-if="isPlayground" />

    <div>
      <button
        bg="gray-1 hover:gray-2 active:gray-3 dark:slate-6 hover:dark:slate-7 active:dark:slate-8"
        class="mr-2 cursor-pointer rounded-full pa-1"
        border="solid 1 gray-3 dark:slate-5"
        v-for="{ title, icon, onClick } in buttonList"
        :key="icon"
        :title="title"
        type="button"
        @click="() => onClick()"
      >
        <i :class="icon" class="text-2xl text-gray-6 dark:text-slate-1" />
      </button>
    </div>
  </header>

  <Transition name="setting">
    <aside v-if="settingCardVisible" class="absolute right-4 top-16">
      <GlobalSetting @close="toggleSettingVisible" />
    </aside>
  </Transition>

  <main ref="mainRef">
    <router-view />
  </main>

  <EnvironmentInfo @open="appStore.toggleLoopDependencyVisible" class="absolute right-4 bottom-4" />

  <Transition name="loopDependencies">
    <div
      @mousedown="appStore.toggleLoopDependencyVisible"
      v-if="loopDependencyCardVisible"
      :bg="loopDependencyCardVisible ? 'gray-1/50 dark:slate-9/50' : ''"
      class="absolute h-200vh w-full pt-[calc(100vh+4rem)] -top-100vh backdrop-blur-3 transition-background-color"
    >
      <LoopDependency
        @mousedown.stop
        @close="appStore.toggleLoopDependencyVisible"
        @toggleRoot="handleToggleRootDependency"
        class="w-full sm:w-lg md:w-xl lg:w-3xl xl:w-5xl mx-auto h-[calc(100vh-8rem)]"
      />
    </div>
  </Transition>
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

.loopDependencies-enter-active {
  position: absolute;
  animation: loopDependencies-enter 0.3s;
}
.loopDependencies-leave-active {
  position: absolute;
  animation: loopDependencies-enter 0.3s reverse;
}
@keyframes loopDependencies-enter {
  0% {
    opacity: 0;
    transform: translateY(100vh);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

:global(body) {
  overflow: hidden;
}
</style>
