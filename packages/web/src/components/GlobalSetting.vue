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
  <BaseCard class="w-xs select-none">
    <template #header>
      <span class="font-bold">{{ $t('globalSetting.title') }}</span>
    </template>
    <div>
      <div my-4 flex="~ justify-between items-center">
        <span>{{ $t('globalSetting.drag') }}</span>
        <BaseSwitch v-model="fixedNailModel" />
      </div>

      <div my-4 flex="~ justify-between items-center">
        <span>{{ $t('globalSetting.devDependencies') }}</span>
        <BaseSwitch :disable="!moduleConfig.isLocal" v-model="moduleConfig.includeDev" />
      </div>

      <div class="mt-4" flex="~ justify-between items-center">
        <span>{{ $t('globalSetting.maxDepth') }}</span>
        <BaseCounter
          :disable="!moduleConfig.isLocal"
          v-model="moduleConfig.depth"
          :max="Infinity"
          :min="1"
          class="max-w-24"
        />
      </div>

      <p>{{ $t('globalSetting.repulsion') }}</p>
      <BaseSlider :max="10000" :min="100" v-model="repulsion" class="mr-4" />

      <p>{{ $t('globalSetting.searchNode') }}</p>
      <BaseSearch placeholder="Enter start search" />

      <p>{{ $t('globalSetting.registryApi') }}</p>
      <BaseAutoComplete v-model="currentRegistry" :data="appStore.npmRegistryURLs">
        <template #prefix>
          <i class="i-logos-npm-icon mx-2 text-base" />
        </template>
      </BaseAutoComplete>
    </div>
  </BaseCard>
</template>
