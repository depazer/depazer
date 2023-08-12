<script lang="ts" setup>
import BaseSlider from './base/Slider/index.vue'

import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const emit = defineEmits<{ close: [] }>()

const appStore = useAppStore()
const { fixedNailModel, repulsion } = storeToRefs(appStore)
</script>

<template>
  <div
    bg="gray-3 dark:slate-7"
    class="w-xs select-none rounded-md pa-4"
    shadow="lg gray-3 dark:slate-6"
  >
    <header flex="~ justify-between items-center">
      <span class="font-bold">设置</span>
      <button
        type="button"
        title="关闭"
        class="rounded-md ma-0 border-none pa-1"
        bg="transparent hover:gray-2 hover:dark:slate-8"
        @click="emit('close')"
      >
        <i class="i-uil-times" text="xl" />
      </button>
    </header>

    <div>
      <div my-4 flex="~ justify-between items-center">
        <span>拖拽固定</span>
        <button
          type="button"
          title="开关"
          @click="appStore.toggleFixedNailModel()"
          border="2 solid gray-1 dark:slate-6"
          flex="~ justify-center items-center"
          :bg="fixedNailModel && '!gray-3 !dark:slate-2'"
          class="h-6 w-12 rounded-3 bg-gray-2 dark:bg-slate-8"
        >
          <span
            :transform="fixedNailModel && 'translate-x-3'"
            class="inline-block h-4 w-4 rounded-2 bg-gray-4 transition-transform -translate-x-3"
          ></span>
        </button>
      </div>

      <p>斥力大小</p>
      <BaseSlider :max="10000" :min="100" v-model="repulsion" class="mr-4" />

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
