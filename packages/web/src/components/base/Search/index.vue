<script lang="ts" setup>
import { useLocalModule } from '@/hooks/localModule'

const { placeholder } = defineProps<{ placeholder?: string }>()

const searchValue = ref<string>('')
const searchedVisible = ref<boolean>(false)
const searchRef = ref<HTMLElement | null>(null)
const searchedList: string[] = reactive([])

const { graphData } = useLocalModule()

const handleInput = useDebounceFn((val: string) => {
  searchedList.length = 0
  searchValue.value = val

  const searchRes = graphData.value.nodes
    .filter(({ name }) => name.startsWith(val))
    .map(({ name }) => name)

  if (val) {
    searchedList.push(...searchRes)
  }

  searchedVisible.value = !!val
}, 300)

const selectValue = (val: string) => {
  searchValue.value = val
  searchedVisible.value = false
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
      @focus="searchedVisible = true"
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
