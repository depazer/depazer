<script lang="ts" setup>
import ForceChart from './components/ForceChart.vue'
import PackageInfo from './components/PackageInfo.vue'

import { ref, reactive, shallowRef } from 'vue'
import { useToggle } from '@vueuse/core'
import type { Data } from './types'
import { ApiGetGraph } from './mockModuleData'

const packageInfoVisible = ref<boolean>(false)
const togglePackageInfoVisible = useToggle(packageInfoVisible)
const currentPackage = reactive<Record<'name' | 'version', string>>({ name: '', version: '' })
function handleClick(packageID: string) {
  packageInfoVisible.value = true
  currentPackage.version = packageID.split('@').slice(-1)[0] // === at(-1)
  currentPackage.name = packageID.split('@').slice(0, -1).join('@')
}

const graphData = shallowRef<Data>({ nodes: [], links: [] })
ApiGetGraph().then((res) => {
  graphData.value = res
})
</script>

<template>
  <div class="w-full h-100vh overflow-hidden">
    <Transition name="chart">
      <ForceChart @nodeClick="handleClick" :graphData="graphData" v-if="graphData.nodes.length" />
      <i
        v-else
        class="absolute i-svg-spinners-blocks-shuffle-3 top-[calc(50%-3rem)] text-8xl left-[calc(50%-3rem)]"
      />
    </Transition>

    <Transition name="package-info">
      <aside v-if="packageInfoVisible" class="absolute top-16 left-4">
        <PackageInfo :currentPackage="currentPackage" @close="togglePackageInfoVisible" />
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.chart-enter-active {
  animation: 300ms chart-loading;
}
.chart-leave-active {
  animation: 300ms chart-loading reverse;
}
@keyframes chart-loading {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.package-info-enter-active {
  animation: 300ms package-info;
}

.package-info-leave-active {
  animation: 300ms package-info reverse;
}
@keyframes package-info {
  0% {
    opacity: 0.5;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
