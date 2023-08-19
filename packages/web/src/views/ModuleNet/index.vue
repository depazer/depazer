<script lang="ts" setup>
import ForceChart from './components/ForceChart.vue'
import PackageInfo from './components/PackageInfo.vue'
import EnvironmentInfo from './components/EnvironmentInfo.vue'

import { useLocalModule } from '@/hooks/localModule'
import { ref, reactive } from 'vue'

const packageInfoVisible = ref<boolean>(false)
const togglePackageInfoVisible = useToggle(packageInfoVisible)
const currentPackage = reactive<Record<'name' | 'version', string>>({ name: '', version: '' })
function handleClick(packageID: string) {
  packageInfoVisible.value = true
  currentPackage.version = packageID.split('@').slice(-1)[0] // === at(-1)
  currentPackage.name = packageID.split('@').slice(0, -1).join('@')
}

const { graphData, rootModule } = useLocalModule()
</script>

<template>
  <div class="h-100vh w-full overflow-hidden">
    <Transition name="chart">
      <ForceChart @nodeClick="handleClick" :graphData="graphData" v-if="graphData.nodes.length" />
      <i
        v-else
        class="i-svg-spinners-blocks-shuffle-3 absolute left-[calc(50%-3rem)] top-[calc(50%-3rem)] text-8xl"
      />
    </Transition>

    <Transition name="package-info">
      <aside v-if="packageInfoVisible" class="absolute left-4 top-16">
        <PackageInfo
          v-model="rootModule"
          :currentPackage="currentPackage"
          @close="togglePackageInfoVisible"
        />
      </aside>
    </Transition>

    <EnvironmentInfo class="absolute right-4 bottom-4" />
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
