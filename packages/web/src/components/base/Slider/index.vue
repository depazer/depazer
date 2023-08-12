<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100
  }
)
const emit = defineEmits<{ 'update:modelValue': [moduleValue: number] }>()

const range = computed(() => props.max - props.min)
const percent = computed({
  get: () => clamp(((props.modelValue - props.min) / range.value) * 100),
  set: (newValue: number) => emit('update:modelValue', range.value * (newValue / 100) + props.min)
})
const slider = ref<HTMLElement>()

function clamp(value: number, min: number = 0, max: number = 100) {
  return Math.min(Math.max(value, min), max)
}

const sliderBounds = computed(() => {
  const { left, width } = slider.value?.getBoundingClientRect() ?? { left: 0, width: 100 }
  return { left, width }
})

function handleClick(e: MouseEvent) {
  const { left, width } = sliderBounds.value
  const x = e.clientX - left
  const widthPercent = (x / width) * 100
  percent.value = ~~clamp(widthPercent)
}

function handleMouseMove(e: MouseEvent) {
  const { left, width } = sliderBounds.value
  const x = e.clientX - left
  const widthPercent = (x / width) * 100
  percent.value = ~~clamp(widthPercent)
}
function handleMouseDown() {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}
function handleMouseUp() {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
}
</script>

<template>
  <div
    ref="slider"
    @click="handleClick"
    @mousedown="handleMouseDown"
    class="h-1 rounded bg-gray-2 dark:bg-slate-8"
  >
    <div :style="`width: ${percent}%`" class="h-1 rounded w-1/4 bg-gray dark:bg-slate" />
    <button
      type="button"
      :title="percent + '%'"
      :style="`left: calc(${percent}% - 0.5rem)`"
      border="solid 4 gray-1 dark:slate-6"
      class="bg-gray dark:bg-slate relative rounded-xl pa-2 -top-4.5"
    />
  </div>
</template>
