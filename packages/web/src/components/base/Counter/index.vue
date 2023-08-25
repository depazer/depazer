<script lang="ts" setup>
import { clamp } from '@/utils/math'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
  }>(),
  {
    min: 0,
    max: 100
  }
)

const emit = defineEmits<{
  'update:modelValue': [moduleValue: number]
  clearInitStatus: [value: boolean]
}>()

const count = computed({
  get: () => (props.modelValue === Infinity ? '♾️' : props.modelValue),
  set: (newValue: string | number) => {
    emit('update:modelValue', clamp(~~newValue, props.min, props.max))
  }
})

function handleAdd() {
  typeof count.value === 'string' ? (count.value = 2) : (count.value += 1)
  emit('clearInitStatus', false)
}
function handleMinus() {
  typeof count.value === 'string' ? (count.value = 2) : (count.value -= 1)
  emit('clearInitStatus', false)
}
</script>

<template>
  <div class="flex rounded-md bg-gray-2 dark:bg-slate-6" border="solid gray-2 dark:slate-6">
    <button
      title="减"
      type="button"
      @click="handleMinus"
      bg="gray-2 dark:slate-6 hover:gray dark:hover:slate active:gray/70 dark:active:slate/70"
      class="rounded-l-md border-none dark:text-slate-1"
    >
      <i i-ci-remove-minus />
    </button>
    <input
      v-model.lazy="count"
      placeholder="请输入数字"
      bg="gray-2 dark:slate-6 focus:gray-1 dark:focus:slate-8"
      class="block w-full border-none text-center text-4 dark:text-slate-1 focus:outline-none"
    />
    <button
      title="加"
      type="button"
      @click="handleAdd"
      bg="gray-2 dark:slate-6 hover:gray dark:hover:slate active:gray/70 dark:active:slate/70"
      class="rounded-r-md border-none dark:text-slate-1"
    >
      <i i-ci-add-plus />
    </button>
  </div>
</template>
