<script lang="ts" setup>
import { vD3Chart } from './directive'
import { onMounted, shallowRef } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { ApiGetGraph } from './mockModuleData'

import type { Data } from './types'

const data = shallowRef<Data>({ nodes: [], links: [] })
onMounted(async () => (data.value = await ApiGetGraph()))

const { width, height } = useWindowSize()
</script>

<template>
  <div class="w-full h-100vh overflow-hidden">
    <svg
      v-if="data.nodes.length > 0"
      v-d3-chart="data"
      :width="width"
      :height="height"
      :viewBox="`${-width / 2} ${-height / 2} ${width} ${height}`"
      class="ma-0 block pa-0"
    ></svg>
    <i
      class="i-svg-spinners-blocks-shuffle-3 absolute top-[calc(50%-3rem)] text-8xl left-[calc(50%-3rem)]"
      v-else
    />
  </div>
</template>
