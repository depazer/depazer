<script lang="ts" setup>
import BaseCard from '@/components/base/Card/index.vue'
import ForceChart from '@/views/ForceChart.vue'

import { useModuleStore } from '@/stores/module'

import type { DependencyLink, DigraphWithLinks } from '@/types/dependency'
import type { DependencyNode } from '@depazer/core'
import { breakpointsTailwind } from '@vueuse/core'

const { nodesData } = storeToRefs(useModuleStore())

const charts = computed<DigraphWithLinks[]>(() => {
  const loopDependencies = nodesData.value.loopDependencies

  return loopDependencies.reduce<DigraphWithLinks[]>((charts, loopLink) => {
    const nodes: DependencyNode[] = []
    for (let i = 0; ++i < loopLink.length; ) {
      nodes.push({
        name: loopLink[i - 1],
        dependencies: [loopLink[i]],
        depth: i,
        isDevDependency: false
      })
    }

    charts.push({
      nodes,
      links: nodes.reduce<DependencyLink[]>(
        (links, item) => (
          links.push({
            source: item.dependencies[0],
            target: item.name,
            linkColor: '#F00'
          }),
          links
        ),
        []
      )
    })

    return charts
  }, [])
})

const emit = defineEmits<{ toggleRoot: [dependency: string] }>()

const breakPoints = useBreakpoints(breakpointsTailwind)
const chartWidth = computed(() => {
  switch (true) {
    case breakPoints.greater('xl').value:
      return 960
    case breakPoints.greater('lg').value:
      return 700
    case breakPoints.greater('md').value:
      return 500
    default:
      return 400
  }
})
</script>

<template>
  <BaseCard>
    <template #header><span class="font-bold text-lg select-none">循环依赖</span></template>
    <div class="overflow-auto">
      <ForceChart
        v-for="chart of charts"
        :key="chart.nodes.reduce<string>((key, { name }) => key + name, '')"
        :graphData="chart"
        :zoomRange="[1, 1]"
        @nodeClick="(dependency) => emit('toggleRoot', dependency)"
        :width="chartWidth"
        height="400"
        class="mx-auto my-8 bg-gray-2 dark:bg-slate-9 rounded-md"
      />
    </div>
  </BaseCard>
</template>
