<script lang="ts" setup>
import ForceChart from './ForceChart.vue'
import PackageInfo from './PackageInfo.vue'

import { useAppStore } from '@/stores/app'
import { useModuleStore } from '@/stores/module'

const { packageInfoCardVisible } = storeToRefs(useAppStore())
const togglePackageInfoVisible = useToggle(packageInfoCardVisible)
const currentPackage = reactive<Record<'name' | 'version', string>>({ name: '', version: '' })
function handleClick(packageID: string) {
  togglePackageInfoVisible(true)
  currentPackage.version = packageID.split('@').slice(-1)[0] // === at(-1)
  currentPackage.name = packageID.split('@').slice(0, -1).join('@')
}

const { graphData, moduleConfig } = storeToRefs(useModuleStore())
const { width, height } = useWindowSize()
</script>

<template>
  <div class="h-100vh w-full overflow-hidden">
    <Transition name="chart">
      <ForceChart
        :width="width"
        :height="height"
        :viewBox="`${-width / 2} ${-height / 2} ${width} ${height}`"
        @nodeClick="handleClick"
        :graphData="graphData"
        v-if="graphData.nodes.length"
      />
      <i
        v-else
        class="i-svg-spinners-blocks-shuffle-3 absolute left-[calc(50%-3rem)] top-[calc(50%-3rem)] text-8xl"
      />
    </Transition>

    <Transition name="package-info">
      <aside v-show="packageInfoCardVisible" class="absolute left-4 top-16">
        <PackageInfo
          v-model="moduleConfig.rootModule"
          :currentPackage="currentPackage"
          @close="togglePackageInfoVisible"
        />
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
