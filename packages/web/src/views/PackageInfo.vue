<script lang="ts" setup>
import BaseCard from '@/components/base/Card/index.vue'

import { useAppStore } from '@/stores/app'
import { useModuleStore } from '@/stores/module'
import { ApiGetNpmPackageInfo } from '@/api/npmRegistry'

const appStore = useAppStore()
const { currentRegistry } = storeToRefs(appStore)

const { isPackedNode, togglePackedNode } = useModuleStore()

const props = defineProps<{
  currentPackage: Record<'name' | 'version', string>
  modelValue: string
}>()

const dependencyNameWithVersion = computed(() => {
  return props.currentPackage.name + '@' + props.currentPackage.version
})

const emit = defineEmits<{ 'update:modelValue': [rootModule: string] }>()
const fetching = ref<boolean>(false)

const packageInfo = ref()
watchEffect(async (cancel) => {
  if (props.currentPackage.name + props.currentPackage.version === '') return

  fetching.value = true
  const { data } = await ApiGetNpmPackageInfo(
    props.currentPackage.name,
    props.currentPackage.version,
    currentRegistry.value
  )
  packageInfo.value = data
  const timer = setTimeout(() => (fetching.value = false), 300)
  cancel(() => clearTimeout(timer))
})

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
  <BaseCard class="h-[calc(100vh-8rem)] w-xs">
    <template #header>
      <code
        class="rounded bg-indigo-3 px-1 font-sans text-indigo-8 dark:bg-blue-6 dark:text-blue-2"
      >
        {{ currentPackage.name }}
      </code>
    </template>
    <section class="flex-grow overflow-auto" v-show="!fetching">
      <div class="select-none mt-2 flex justify-between items-center gap-2">
        <div>
          <span class="mr-2 font-bold">{{ $t('packageInfo.version') }}</span>
          <code
            class="rounded bg-lime-2 px-1 font-sans text-lime-6 dark:bg-lime-6 dark:text-lime-1"
          >
            {{ currentPackage.version }}
          </code>
        </div>

        <div>
          <button
            type="button"
            title="断开依赖项链接"
            class="ma-0 rounded-md border-none pa-1"
            bg="transparent hover:gray-2 hover:dark:slate-8"
            @click="togglePackedNode(dependencyNameWithVersion)"
          >
            <i
              :class="isPackedNode(dependencyNameWithVersion) ? 'i-uil-plus' : 'i-uil-link-broken'"
              text="lg red-3"
            />
          </button>
          <button
            v-show="currentPackage.version.match(/^\d/)"
            type="button"
            title="设为根节点"
            class="ma-0 rounded-md border-none pa-1"
            bg="transparent hover:gray-2 hover:dark:slate-8"
            @click="emit('update:modelValue', dependencyNameWithVersion)"
          >
            <i class="i-uil-location-point" text="lg red" />
          </button>
          <button
            v-show="modelValue !== ''"
            type="button"
            title="返回主节点"
            class="ma-0 rounded-md border-none pa-1"
            bg="transparent hover:gray-2 hover:dark:slate-8"
            @click="emit('update:modelValue', '')"
          >
            <i class="i-uil-focus-target" text="lg green-6" />
          </button>
        </div>
      </div>
      <div class="my-4">
        <span class="select-none font-bold">{{ $t('packageInfo.description') }}</span>
        <p class="my-2">{{ formattedPackageInfo.description }}</p>
      </div>
      <div class="select-none flex flex-wrap justify-between gap-2">
        <p my-1>
          <span class="mr-2 font-bold">{{ $t('packageInfo.size') }}</span>
          <code font-sans>{{ formattedPackageInfo.dist.size }}</code>
        </p>
        <p my-1>
          <span class="mr-2 font-bold">{{ $t('packageInfo.unpackedSize') }}</span>
          <code font-sans>{{ formattedPackageInfo.dist.unpackedSize }}</code>
        </p>
      </div>
      <p class="select-none">
        <span class="mr-2 font-bold">{{ $t('packageInfo.license') }}</span>
        <code
          class="rounded-sm bg-red-1 px-1 font-sans text-red-6 dark:bg-red-1/30 dark:text-red-3"
        >
          {{ packageInfo?.license }}
        </code>
      </p>
      <div v-show="formattedPackageInfo.keywords.length" class="my-4 select-none">
        <span class="mr-2 font-bold">{{ $t('packageInfo.keywords') }}</span>
        <div flex="~ wrap items-start" class="mt-2 gap-1">
          <code
            class="rounded-sm bg-cyan-1 px-1 font-sans text-cyan-6 dark:bg-cyan-1/30 dark:text-cyan-3"
            v-for="key of formattedPackageInfo.keywords"
            :key="key"
          >
            {{ key }}
          </code>
        </div>
      </div>
      <div
        v-show="formattedPackageInfo.dependencies.length !== 0"
        flex="~ wrap col items-start"
        class="my-4 gap-1"
      >
        <span class="select-none font-bold">{{ $t('packageInfo.dependencies') }}</span>
        <li
          class="px-1"
          v-for="[dependency, version] of formattedPackageInfo.dependencies"
          :key="dependency + version"
        >
          {{ dependency }}@{{ version }}
        </li>
      </div>
    </section>
    <!-- 骨架屏 -->
    <section v-show="fetching" class="animate-pulse py-4">
      <span class="mr-2 inline-block h-4 w-1/4 rounded bg-gray"></span>
      <span class="inline-block h-4 w-1/3 rounded bg-gray"></span>
      <p class="h-4 rounded bg-gray"></p>
      <p class="h-4 w-3/4 rounded bg-gray"></p>
      <p class="h-4 rounded bg-gray"></p>
      <p class="h-4 rounded bg-gray"></p>
    </section>
  </BaseCard>
</template>
