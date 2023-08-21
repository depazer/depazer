<script lang="ts" setup>
import { useLocalModule } from '@/hooks/localModule'
import { useAppStore } from '@/stores/app'

const { placeholder } = defineProps<{ placeholder?: string }>()

const searchValue = ref<string>('')
const searchedVisible = ref<boolean>(false)
const searchRef = ref<HTMLElement | null>(null)
const searchedList: string[] = reactive([])

const { graphData } = useLocalModule()
const { rootModule } = storeToRefs(useAppStore())

// init searchValue
onMounted(() => {
  searchValue.value = rootModule.value === 'root' ? '' : rootModule.value
})

const handleInput = useDebounceFn((val: string) => {
  searchedList.length = 0
  searchValue.value = val

  const searchRes = graphData.value.nodes
    .filter(({ name }) => name.startsWith(val))
    .map(({ name }) => name)

  if (val) {
    // 最多显示 10 条
    searchRes.length > 10
      ? searchedList.push(...searchRes.slice(0, 10))
      : searchedList.push(...searchRes)
  } else {
    rootModule.value = 'root'
  }

  searchedVisible.value = !!val
}, 300)

const selectValue = (val: string) => {
  searchValue.value = val
  searchedVisible.value = false

  // focus
  rootModule.value = searchValue.value
}
</script>

<template>
  <div
    ref="searchRef"
    flex="~ items-center"
    class="rounded pa-1"
    bg="gray-2 focus-within:gray-1  dark:slate-6 focus-within:dark:slate-8"
  >
    <input
      class="w-full rounded-md border-none pa-1 text-base focus:outline-none"
      bg="transparent"
      :placeholder="placeholder"
      :value="searchValue"
      @input="handleInput(($event.target as HTMLInputElement).value)"
      @blur="searchedVisible = false"
      @focus="handleInput(searchValue)"
    />
  </div>

  <Transition name="searched">
    <ul
      v-show="searchedVisible"
      :style="`width: ${searchRef?.getBoundingClientRect().width}px`"
      class="absolute pa-0 mt-1 bg-gray-2 dark:bg-slate-6 rounded-md overflow-hidden shadow-md"
    >
      <li
        tabindex="0"
        @mousedown.stop.prevent="selectValue(item)"
        class="list-none pa-2 hover:bg-gray-3/50 dark:hover:bg-slate-7/50 cursor-pointer"
        v-for="item of searchedList"
        :key="item"
      >
        <span class="text-base font-400">{{ item }}</span>
      </li>
    </ul>
  </Transition>
</template>

<style scoped>
.searched-enter-active {
  position: absolute;
  transform-origin: top;
  animation: scale-options 150ms;
}
.searched-leave-active {
  position: absolute;
  transform-origin: top;
  animation: scale-options 150ms reverse;
}

@keyframes scale-options {
  0% {
    transform: scale(1, 0);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
