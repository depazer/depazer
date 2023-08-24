<script setup lang="tsx">
import GlobalSetting from '@/components/GlobalSetting.vue'
import EnvironmentInfo from '@/components/EnvironmentInfo.vue'

import html2canvas from 'html2canvas'
import { useLocale } from '@/hooks/locale'
import { useAppStore } from '@/stores/app'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

const { toggleLocale } = useLocale()

const { settingCardVisible } = storeToRefs(useAppStore())
const toggleSettingVisible = useToggle(settingCardVisible)

const mainRef = ref<HTMLElement | null>(null)
const handleScreenshot = () => {
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
}

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

  <EnvironmentInfo class="absolute right-4 bottom-4" />
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

:global(body) {
  overflow: hidden;
}
</style>
