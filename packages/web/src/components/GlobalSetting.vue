<script lang="ts" setup>
import BaseSwitch from './base/Switch/index.vue'
import BaseSlider from './base/Slider/index.vue'
import BaseCounter from './base/Counter/index.vue'
import BaseAutoComplete from './base/AutoComplete/index.vue'
import BaseSearch from './base/Search/index.vue'

import { useAppStore } from '@/stores/app'

const emit = defineEmits<{ close: [] }>()

const appStore = useAppStore()
const { depth, fixedNailModel, includeDev, repulsion } = storeToRefs(appStore)
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
        class="ma-0 rounded-md border-none pa-1"
        bg="transparent hover:gray-2 hover:dark:slate-8"
        @click="emit('close')"
      >
        <i class="i-uil-times" text="xl" />
      </button>
    </header>

    <div>
      <div my-4 flex="~ justify-between items-center">
        <span>拖拽固定</span>
        <BaseSwitch v-model="fixedNailModel" />
      </div>

      <div my-4 flex="~ justify-between items-center">
        <span>包含开发依赖</span>
        <BaseSwitch v-model="includeDev" />
      </div>

      <div class="mt-4" flex="~ justify-between items-center">
        <span>最大深度</span>
        <BaseCounter v-model="depth" :max="Infinity" class="max-w-24" />
      </div>

      <p>斥力大小</p>
      <BaseSlider :max="10000" :min="100" v-model="repulsion" class="mr-4" />

      <p>搜索节点（最多显示 10 条）</p>
      <BaseSearch placeholder="Enter start search" />

      <p>注册表API</p>
      <BaseAutoComplete v-model="appStore.currentRegistry" :data="appStore.npmRegistryURLs">
        <template #prefix>
          <i class="i-logos-npm-icon mx-2 text-base" />
        </template>
      </BaseAutoComplete>
    </div>
  </div>
</template>
