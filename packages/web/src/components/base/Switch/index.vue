<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<{ modelValue: boolean }>(), { modelValue: false })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { t } = useI18n()
</script>

<template>
  <button
    type="button"
    :title="t('switch.title')"
    @click="emit('update:modelValue', !modelValue)"
    border="2 solid gray-1 dark:slate-6"
    flex="~ justify-center items-center"
    :bg="modelValue && '!gray-3 !dark:slate-2'"
    class="h-6 w-12 rounded-3 bg-gray-2 transition-background-color dark:bg-slate-8"
  >
    <span
      :transform="modelValue && 'translate-x-3'"
      class="inline-block h-4 w-4 rounded-2 bg-gray-4 transition-transform -translate-x-3"
    />
  </button>
</template>

<i18n lang="yaml">
messages:
  zh-CN:
    switch:
      title: 开关
  en-US:
    switch:
      title: Switch
</i18n>
