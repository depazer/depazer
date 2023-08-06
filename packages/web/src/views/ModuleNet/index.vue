<script lang="ts" setup>
import PackageInfo from './components/PackageInfo.vue'

import { ref } from 'vue'
import { vD3Chart } from './directive'
import { ApiGetGraph } from './mockModuleData'
import { usePackageStore } from '@/stores/package'
import { useForceUpdate } from '@/hooks/forceUpdate'
import { useToggle, useWindowSize } from '@vueuse/core'

import type { Data } from './types'

/**
 * 点击节点(circle)会调用 togglePackage 方法
 * 将 packageInfoVisible 设置为 true
 */
const packageInfoVisible = ref<boolean>(false)
const togglePackageInfoVisible = useToggle(packageInfoVisible)
const packageStore = usePackageStore()
packageStore.$onAction(({ name }) => {
  if (name === 'togglePackage') packageInfoVisible.value = true
})

const { key, forceUpdate } = useForceUpdate()
const { width, height } = useWindowSize()

let data: Data = { nodes: [], links: [] }
ApiGetGraph().then((res) => {
  data = res
  forceUpdate()
})
</script>

<template>
  <div class="w-full h-100vh overflow-hidden">
    <Transition name="chart">
      <svg
        :key="key"
        v-if="key !== 0"
        v-d3-chart="data"
        :width="width"
        :height="height"
        :viewBox="`${-width / 2} ${-height / 2} ${width} ${height}`"
        class="ma-0 block pa-0"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="4"
            markerHeight="8"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#999" />
          </marker>
        </defs>
      </svg>
      <i
        v-else
        class="absolute i-svg-spinners-blocks-shuffle-3 top-[calc(50%-3rem)] text-8xl left-[calc(50%-3rem)]"
      />
    </Transition>

    <Transition name="package-info">
      <aside v-if="packageInfoVisible" class="absolute top-16 left-4">
        <PackageInfo @close="togglePackageInfoVisible" />
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
