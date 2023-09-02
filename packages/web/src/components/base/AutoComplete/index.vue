<script lang="ts" setup>
const props = defineProps<{ data: string[]; placeholder?: string; modelValue: string }>()
const emits = defineEmits<{ 'update:modelValue': [input: string]; change: [input: string] }>()
const inputValue = useVModel(props, 'modelValue', emits)

const optionsVisible = ref<boolean>(false)
const toggleOPtionsVisible = useToggle(optionsVisible)

const autoComplete = ref<HTMLElement | null>(null)

const debouncedInputValue = refDebounced(inputValue, 500)
const optionList = computed(() => {
  const filteredData = props.data.filter((item) => item.includes(debouncedInputValue.value))

  return filteredData.slice(0, 5)
})

function handleChange($event: Event) {
  const target = $event.target as HTMLInputElement
  emits('change', target.value)
}
function handleSelect(item: string) {
  inputValue.value = item
  emits('change', item)
}
</script>

<template>
  <div
    ref="autoComplete"
    flex="~ items-center"
    class="rounded pa-1"
    bg="gray-2 focus-within:gray-1  dark:slate-6 focus-within:dark:slate-8"
  >
    <slot name="prefix" />
    <input
      class="w-full rounded-md border-none pa-1 text-base focus:outline-none"
      bg="transparent"
      v-model="inputValue"
      @change="handleChange"
      :placeholder="placeholder"
      @blur="toggleOPtionsVisible(false)"
      @focus="toggleOPtionsVisible(true)"
    />
    <slot name="suffix" />
  </div>

  <Transition name="options">
    <ul
      v-show="optionsVisible"
      :style="`width: ${autoComplete?.getBoundingClientRect().width}px`"
      class="absolute pa-0 mt-1 bg-gray-2 dark:bg-slate-6 rounded-md overflow-hidden shadow-md"
    >
      <li
        tabindex="0"
        @mousedown="handleSelect(item)"
        class="list-none pa-2 hover:bg-gray-3/50 dark:hover:bg-slate-7/50 cursor-pointer"
        v-for="item of optionList"
        :key="item"
      >
        <span class="text-base font-400">{{ item }}</span>
      </li>
    </ul>
  </Transition>
</template>

<style scoped>
.options-enter-active {
  position: absolute;
  transform-origin: top;
  animation: scale-options 150ms;
}
.options-leave-active {
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
