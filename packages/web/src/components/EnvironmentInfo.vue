<script lang="tsx" setup>
import { useModuleStore } from '@/stores/module'

const moduleStore = useModuleStore()
const { nodesData, moduleConfig } = storeToRefs(moduleStore)
const emit = defineEmits<{ open: [] }>()

const { data } = useFetch(import.meta.env.BASE_URL + 'api/environment')
  .get()
  .json<{ packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun'; nodeVersion: string }>()

if (import.meta.env.MODE === 'playground') {
  setTimeout(() => (data.value = { packageManager: 'npm', nodeVersion: 'v18.17.0' }), 200)
}

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
  <ul class="my-0 flex gap-1">
    <li
      title="循环依赖"
      @click="emit('open')"
      v-show="nodesData.loopDependencies.length"
      bg="red-1/60 hover:red-1 dark:red-9/60 hover:dark:red-9"
      class="button"
    >
      <i class="i-uil-process text-red" />
    </li>

    <li
      title="重置根节点"
      v-show="moduleConfig.rootModule !== ''"
      @click="moduleConfig.rootModule = ''"
      bg="green-6-1/60 hover:green-1 dark:green-9/60 hover:dark:green-9"
      class="button"
    >
      <i class="i-uil-compass text-green" />
    </li>

    <li
      title="展开全部依赖"
      @click="moduleStore.unpackedAllNodes"
      bg="indigo-1/60 hover:indigo-1 dark:indigo-9/60 hover:dark:indigo-9"
      class="button"
    >
      <i class="i-uil-channel-add text-indigo" />
    </li>
    <li
      title="收起全部子依赖"
      @click="moduleStore.packedAllNodes"
      bg="orange-1/60 hover:orange-1 dark:orange-9/60 hover:dark:orange-9"
      class="button"
    >
      <i class="i-uil-fidget-spinner text-orange" />
    </li>

    <InfoLi
      v-if="data"
      :title="data?.packageManager"
      :icon="iconMap[data?.packageManager ?? 'npm']"
    />
    <InfoLi v-if="data" :title="data?.nodeVersion" icon="i-devicon-nodejs" />
  </ul>
</template>

<style scoped>
.button {
  --uno-apply: block rounded-md pa-2 list-none shadow-lg cursor-pointer;
}
.button > i {
  --uno-apply: text-2xl;
}
</style>
