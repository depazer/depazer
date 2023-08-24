<script lang="tsx" setup>
import { useModuleStore } from '@/stores/module'

const { nodesData } = storeToRefs(useModuleStore())
const emit = defineEmits<{ open: [] }>()

const { data } = useFetch(import.meta.env.BASE_URL + 'api/environment')
  .get()
  .json<{ packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun'; version: string }>()

const iconMap = {
  npm: 'i-logos-npm-icon',
  pnpm: 'i-devicon-pnpm',
  yarn: 'i-devicon-yarn',
  bun: 'i-devicon-bun'
}

function InfoLi(props: { title: string; icon: string }) {
  return (
    <li
      title={props.title}
      class="block bg-gray-3 dark:bg-slate-7 rounded-md pa-2 list-none shadow-lg opacity-50 hover:opacity-100"
    >
      <i class={`${props.icon} text-2xl`} />
    </li>
  )
}
</script>

<template>
  <ul v-if="data" class="my-0 flex gap-1">
    <li
      title="循环依赖"
      @click="emit('open')"
      v-show="nodesData.loopDependencies.length"
      bg="red-1/60 hover:red-1 dark:red-9/60 hover:dark:red-9"
      class="block rounded-md pa-2 list-none shadow-lg"
    >
      <i class="i-uil-process text-2xl text-red" />
    </li>

    <InfoLi :title="data?.packageManager" :icon="iconMap[data?.packageManager ?? 'npm']" />
    <InfoLi :title="data?.version" icon="i-devicon-nodejs" />
  </ul>
</template>
