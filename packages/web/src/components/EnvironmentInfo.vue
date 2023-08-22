<script lang="tsx" setup>
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
    <InfoLi :title="data?.packageManager" :icon="iconMap[data?.packageManager ?? 'npm']" />
    <InfoLi :title="data?.version" icon="i-devicon-nodejs" />
  </ul>
</template>
