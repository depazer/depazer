<script lang="ts" setup>
import { usePackageStore } from '@/stores/package'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { ApiGetNpmPackageInfo } from '@/api/npmRegistry'

const appStore = useAppStore()
const { currentRegistry } = storeToRefs(appStore)
const packageStore = usePackageStore()
const { currentPackage } = storeToRefs(packageStore)

const emit = defineEmits<{ close: [] }>()
const fetching = ref<boolean>(false)

watchEffect(async () => {
  fetching.value = true
  const { data } = await ApiGetNpmPackageInfo(
    currentPackage.value.name,
    currentPackage.value.version,
    currentRegistry.value
  )
  packageInfo.value = data
  setTimeout(() => (fetching.value = false), 300)
})

const packageInfo = ref()

const formattedPackageInfo = computed(() => {
  return {
    description: packageInfo.value?.description ?? '无',
    dist: {
      size: packageInfo.value?.dist?.size
        ? (packageInfo.value.dist.size / 1024).toFixed(2) + 'KB'
        : 'UNKNOWN',
      unpackedSize: packageInfo.value?.dist?.unpackedSize
        ? (packageInfo.value.dist.unpackedSize / 1024).toFixed(2) + 'KB'
        : 'UNKNOWN'
    },
    license: packageInfo.value?.license ?? 'UNKNOWN',
    keywords: packageInfo.value?.keywords ?? [],
    dependencies: Object.entries(packageInfo.value?.dependencies ?? {})
  }
})
</script>

<template>
  <div
    bg="gray-3 dark:slate-7"
    class="rounded-md pa-4 w-xs h-[calc(100vh-8rem)]"
    shadow="lg gray-3 dark:slate-6"
  >
    <header flex="~ justify-between items-center">
      <div>
        <code class="px-1 rounded-l dark:bg-blue-6 bg-indigo-3 text-indigo-8 dark:text-blue-2">
          {{ currentPackage.name }}
        </code>
        <code class="px-1 rounded-r bg-lime-2 dark:bg-lime-6 text-lime-6 dark:text-lime-1">
          {{ currentPackage.version }}
        </code>
      </div>
      <button
        type="button"
        title="关闭"
        class="rounded-md pa-1 ma-0 border-none"
        bg="transparent hover:gray-2 hover:dark:slate-8"
        @click="emit('close')"
      >
        <i class="i-uil-times" text="xl" />
      </button>
    </header>

    <section v-show="!fetching">
      <div class="my-4">
        <span class="font-bold select-none">概述</span>
        <p class="my-2">{{ formattedPackageInfo.description }}</p>
      </div>
      <p class="select-none">
        <span class="font-bold mr-2">大小</span>
        <code>{{ formattedPackageInfo.dist.size }}</code>
        <span class="font-bold mx-2">解压大小</span>
        <code>{{ formattedPackageInfo.dist.unpackedSize }}</code>
      </p>
      <p class="select-none">
        <span class="mr-2 font-bold">开源协议</span>
        <code class="px-1 rounded-sm bg-red-1 text-red-6 dark:text-red-3 dark:bg-red-1/30">
          {{ packageInfo?.license }}
        </code>
      </p>
      <div v-show="packageInfo?.keywords?.length" class="select-none my-4">
        <span class="mr-2 font-bold">关键字</span>
        <div flex="~ wrap items-start" class="gap-1 mt-2">
          <code
            class="px-1 rounded-sm text-cyan-6 bg-cyan-1 dark:text-cyan-3 dark:bg-cyan-1/30"
            v-for="key of packageInfo?.keywords ?? []"
            :key="key"
          >
            {{ key }}
          </code>
        </div>
      </div>
      <div
        v-show="Object.keys(packageInfo?.dependencies ?? {}).length !== 0"
        flex="~ wrap col items-start"
        class="gap-1 my-4"
      >
        <span class="font-bold select-none">生产依赖</span>
        <li
          class="px-1"
          v-for="[dependency, version] of Object.entries(packageInfo?.dependencies ?? {})"
          :key="dependency + version"
        >
          {{ dependency }}@{{ version }}
        </li>
      </div>
    </section>
    <!-- 骨架屏 -->
    <section v-show="fetching" class="animate-pulse py-4">
      <span class="mr-2 inline-block bg-gray h-4 rounded w-1/4"></span>
      <span class="inline-block bg-gray h-4 rounded w-1/3"></span>
      <p class="bg-gray h-4 rounded"></p>
      <p class="bg-gray h-4 rounded w-3/4"></p>
      <p class="bg-gray h-4 rounded"></p>
      <p class="bg-gray h-4 rounded"></p>
    </section>
  </div>
</template>
