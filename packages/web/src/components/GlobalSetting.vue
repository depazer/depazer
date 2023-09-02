<script lang="ts" setup>
import BaseCard from './base/Card/index.vue'
import BaseSwitch from './base/Switch/index.vue'
import BaseSlider from './base/Slider/index.vue'
import BaseCounter from './base/Counter/index.vue'
import BaseAutoComplete from './base/AutoComplete/index.vue'

import { useAppStore } from '@/stores/app'
import { useModuleStore } from '@/stores/module'

import type { NPMRegistrySearch } from '@/types/registry'

const appStore = useAppStore()
const { fixedNailModel, repulsion, currentRegistry } = storeToRefs(appStore)
const { moduleConfig, nodesData } = storeToRefs(useModuleStore())

/** @desc 零时输入框数据 */
const rootDependency = ref<string>(moduleConfig.value.rootModule)

/** @desc 远程搜索依赖包 */
const searchAPI = computed(
  () => `${currentRegistry.value}-/v1/search?text=${rootDependency.value}&size=6&from=0`
)
const { data, execute } = useFetch(searchAPI, { immediate: false }).get().json<NPMRegistrySearch>()
watchDebounced(searchAPI, () => moduleConfig.value.isVirtual && execute(), { debounce: 300 })

/** @desc 依赖包建议列表 远程或本地 */
const suggestList = computed(() => {
  if (moduleConfig.value.isVirtual) {
    const packages = data.value?.objects.map((item) => item.package) ?? []
    return packages.map(({ name, version }) => `${name}@${version}`)
  } else {
    return nodesData.value.dependencyNodes
      .filter(({ name }) => name.startsWith(rootDependency.value))
      .slice(0, 5)
      .map(({ name }) => name)
  }
})

/** @desc change事件更新store数据 */
async function handleChange(newRootDependency: string) {
  moduleConfig.value.rootModule = newRootDependency
}

/** @desc 换回本地api时重置根依赖包 */
function toggleMode(target: boolean) {
  if (target === false) {
    rootDependency.value = ''
    moduleConfig.value.rootModule = ''
  }
}
</script>

<template>
  <BaseCard class="w-xs select-none">
    <template #header>
      <span class="font-bold">{{ $t('globalSetting.title') }}</span>
    </template>
    <div>
      <div my-4 flex="~ justify-between items-center">
        <span>
          {{ $t('globalSetting.virtual') }}
          <code class="text-red-6 dark:text-red-3 text-sm">Beta</code>
        </span>
        <BaseSwitch v-model="moduleConfig.isVirtual" @update:model-value="toggleMode" />
      </div>

      <div my-4 flex="~ justify-between items-center">
        <span>{{ $t('globalSetting.drag') }}</span>
        <BaseSwitch v-model="fixedNailModel" />
      </div>

      <div my-4 flex="~ justify-between items-center">
        <span>{{ $t('globalSetting.devDependencies') }}</span>
        <BaseSwitch :disable="moduleConfig.isVirtual" v-model="moduleConfig.includeDev" />
      </div>

      <div class="mt-4" flex="~ justify-between items-center">
        <span>{{ $t('globalSetting.maxDepth') }}</span>
        <BaseCounter v-model="moduleConfig.depth" :max="Infinity" :min="1" class="max-w-24" />
      </div>

      <p>{{ $t('globalSetting.repulsion') }}</p>
      <BaseSlider :max="10000" :min="100" v-model="repulsion" class="mr-4" />

      <p>{{ $t('globalSetting.searchDependency') }}</p>
      <BaseAutoComplete
        :placeholder="$t('globalSetting.searchDependencyPlaceholder')"
        v-model="rootDependency"
        @change="handleChange"
        :data="suggestList"
      >
        <template #prefix>
          <i class="i-logos-npm-2 mx-2" />
        </template>
      </BaseAutoComplete>

      <p>{{ $t('globalSetting.registryApi') }}</p>
      <BaseAutoComplete v-model="currentRegistry" :data="appStore.npmRegistryURLs">
        <template #prefix>
          <i class="i-logos-npm-icon mx-2 text-base" />
        </template>
      </BaseAutoComplete>
    </div>
  </BaseCard>
</template>
