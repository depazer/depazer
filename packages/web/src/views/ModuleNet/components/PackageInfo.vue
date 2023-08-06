<script lang="ts" setup>
import { usePackageStore } from '@/stores/package'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useFetch } from '@vueuse/core'
import { ApiGetNpmPackageInfo } from '@/api/npmRegistry'

const appStore = useAppStore()
const { currentRegistry } = storeToRefs(appStore)
const packageStore = usePackageStore()
const { currentPackage } = storeToRefs(packageStore)

const emit = defineEmits<{ close: [] }>()

const packageRegistryURL = computed(() => {
  return `${currentRegistry.value}${currentPackage.value.name}/${currentPackage.value.version}`
})

const packageInfo = ref({
  name: '@vue/runtime-dom',
  version: '3.3.4',
  description: '@vue/runtime-dom',
  sideEffects: false,
  repository: {
    type: 'git',
    url: 'git+https://github.com/vuejs/core.git',
    directory: 'packages/runtime-dom'
  },
  keywords: ['vue'],
  author: {
    name: 'Evan You'
  },
  license: 'MIT',
  bugs: {
    url: 'https://github.com/vuejs/core/issues'
  },
  homepage: 'https://github.com/vuejs/core/tree/main/packages/runtime-dom#readme',
  dependencies: {
    '@vue/shared': '3.3.4',
    '@vue/runtime-core': '3.3.4',
    csstype: '^3.1.1'
  },
  _id: '@vue/runtime-dom@3.3.4',
  dist: {
    fileCount: 12,
    unpackedSize: 979547,
    size: 251403
  },
  _npmUser: {
    name: 'yyx990803',
    email: 'yyx990803@gmail.com'
  },
  directories: {},
  maintainers: [
    {
      name: 'yyx990803',
      email: 'yyx990803@gmail.com'
    }
  ],
  _hasShrinkwrap: false,
  _cnpmcore_publish_time: '2023-05-18T08:31:25.817Z',
  publish_time: 1684398685817,
  _source_registry_name: 'default'
})

// const { data } = await ApiGetNpmPackageInfo(
//   currentPackage.value.name,
//   currentPackage.value.version,
//   currentRegistry.value
// )
</script>

<template>
  <div
    bg="gray-3 dark:slate-7"
    class="rounded-md pa-4 w-xs h-[calc(100vh-8rem)]"
    shadow="lg gray-3 dark:slate-6"
  >
    <header flex="~ justify-between items-center">
      <div>
        <span class="px-1 rounded-l dark:bg-blue-6 bg-indigo-3 text-indigo-8 dark:text-blue-2">{{
          currentPackage.name
        }}</span>
        <span class="px-1 rounded-r bg-lime-2 dark:bg-lime-6 text-lime-6 dark:text-lime-1">{{
          currentPackage.version
        }}</span>
      </div>
      <button
        type="button"
        title="关闭"
        class="pa-1 ma-0 border-none rounded-md"
        bg="transparent hover:gray-2 hover:dark:slate-8"
        @click="emit('close')"
      >
        <i class="i-uil-times" text="xl" />
      </button>
    </header>

    <p class="select-none">
      <span class="after:content-[':'] mr-1">开源协议</span>
      <code class="px-1 rounded bg-red-1 text-red-6">{{ packageInfo.license }}</code>
    </p>
  </div>
</template>
