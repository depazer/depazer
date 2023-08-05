<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <header flex="~ justify-between items-center" class="w-full fixed box-border px-4 py-2">
    <div class="text-xl select-none">Dependency Analyzer</div>
    <div>
      <button
        title="语言"
        type="button"
        class="mr-2 cursor-pointer rounded-full pa-1"
        bg="gray-1 dark:slate-6"
        border="solid 1 gray-3 dark:slate-5"
      >
        <i class="i-uil-english-to-chinese" text="2xl gray-6 dark:slate-1" />
      </button>
      <button
        title="颜色模式"
        type="button"
        class="mr-2 cursor-pointer rounded-full pa-1"
        bg="gray-1 dark:slate-6"
        border="solid 1 gray-3 dark:slate-5"
        @click="() => toggleDark()"
      >
        <i class="i-uil-moonset dark:i-uil-sunset" text="2xl gray-6 dark:slate-1" />
      </button>
      <button
        title="设置"
        type="button"
        class="cursor-pointer rounded-full pa-1"
        bg="gray-1 dark:slate-6"
        border="solid 1 gray-3 dark:slate-5"
      >
        <i class="i-uil-setting" text="2xl gray-6 dark:slate-1" />
      </button>
    </div>
  </header>

  <main class="">
    <router-view />
  </main>
</template>
