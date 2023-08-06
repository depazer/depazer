<script lang="ts" setup>
import { useAppStore } from '@/stores/app'

const emit = defineEmits<{ close: [] }>()

const appStore = useAppStore()
</script>

<template>
  <div
    bg="gray-3 dark:slate-7"
    class="select-none rounded-md pa-4 w-xs"
    shadow="lg gray-3 dark:slate-6"
  >
    <header flex="~ justify-between items-center">
      <span class="font-bold">设置</span>
      <button
        type="button"
        title="关闭"
        class="rounded-md pa-1 ma-0 border-none"
        bg="transparent hover:gray-2 hover:dark:slate-8"
        @click="emit('close')"
      >
        <i class="i-uil-times" text="xl" />
      </button>
    </header>

    <div>
      <p>注册表API</p>
      <div
        flex="~ items-center"
        class="pa-1 rounded"
        bg="gray-2 focus-within:gray-1  dark:slate-6 focus-within:dark:slate-8"
      >
        <i class="i-logos-npm-icon mx-2 text-base" />
        <input
          v-model="appStore.currentRegistry"
          type="text"
          class="rounded-md border-none pa-1 text-base w-full focus:outline-none"
          bg="transparent"
          placeholder="https://registry.npmjs.org/"
        />
      </div>
    </div>
  </div>
</template>
