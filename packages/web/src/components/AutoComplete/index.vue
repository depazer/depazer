<script lang="ts" setup>
import type { Data } from './types'
import { ref } from 'vue'

const { data, placeholder } = defineProps<{
  data: Data
  placeholder?: string
  modelValue: string
}>()
const emits = defineEmits(['update:modelValue'])

const isShow = ref(false)

const handleFocus = () => {
  showDropItems('', true)
}
const handleBlur = () => {
  hideDropItems()
}
const handleSelect = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  emits('update:modelValue', val)

  showDropItems(val)
}

const showDropItems = (target: string, all: boolean = false): void => {
  const items = getMatchItems(target, all)
  isShow.value = true
}
const hideDropItems = () => {
  isShow.value = false
}
const getMatchItems = (target: string, all: boolean = false): Data => {
  if (target === '' || all) return data

  return data.filter((item) => item.indexOf(target) !== -1)
}
</script>

<template>
  <input
    class="auto-complete-input"
    :placeholder="placeholder"
    :value="modelValue"
    @focus="handleFocus"
    @input="handleSelect"
    @blur="handleBlur"
  />

  <div v-show="isShow">test</div>
</template>
