<script lang="ts" setup>
import BaseCard from './base/Card/index.vue'
import BaseSwitch from './base/Switch/index.vue'
import BaseSlider from './base/Slider/index.vue'
import BaseCounter from './base/Counter/index.vue'
import BaseAutoComplete from './base/AutoComplete/index.vue'
import BaseSearch from './base/Search/index.vue'

import { useAppStore } from '@/stores/app'
import { useModuleStore } from '@/stores/module'

const appStore = useAppStore()
const { fixedNailModel, repulsion, currentRegistry } = storeToRefs(appStore)
const { moduleConfig } = storeToRefs(useModuleStore())
</script>

<template>
  <BaseCard class="w-xs">
    <template #header><span class="font-bold">设置</span></template>
    <div>
      <div my-4 flex="~ justify-between items-center">
        <span>拖拽固定</span>
        <BaseSwitch v-model="fixedNailModel" />
      </div>

      <div my-4 flex="~ justify-between items-center">
        <span>包含开发依赖</span>
        <BaseSwitch v-model="moduleConfig.includeDev" />
      </div>

      <div class="mt-4" flex="~ justify-between items-center">
        <span>最大深度</span>
        <BaseCounter v-model="moduleConfig.depth" :max="Infinity" class="max-w-24" />
      </div>

      <p>斥力大小</p>
      <BaseSlider :max="10000" :min="100" v-model="repulsion" class="mr-4" />

      <p>搜索节点</p>
      <BaseSearch placeholder="Enter start search" />

      <p>注册表API</p>
      <BaseAutoComplete v-model="currentRegistry" :data="appStore.npmRegistryURLs">
        <template #prefix>
          <i class="i-logos-npm-icon mx-2 text-base" />
        </template>
      </BaseAutoComplete>
    </div>
  </BaseCard>
</template>
