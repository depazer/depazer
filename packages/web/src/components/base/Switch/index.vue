<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<{ modelValue: boolean; disable?: boolean }>(), {
  modelValue: false,
  disable: false
})
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const handleToggle = (modelValue: boolean) => {
  emit('update:modelValue', !modelValue)
}

const { t } = useI18n({
  messages: {
    'zh-CN': {
      switch: {
        on: '开',
        off: '关'
      }
    },
    'en-US': {
      switch: {
        on: 'ON',
        off: 'OFF'
      }
    }
  }
})
</script>

<template>
  <button
    type="button"
    :title="t(modelValue ? 'switch.on' : 'switch.off')"
    @click="handleToggle(modelValue)"
    border="2 solid gray-1 dark:slate-6"
    flex="~ justify-center items-center"
    :bg="modelValue && '!gray-5 !dark:slate-2'"
    class="h-6 w-12 rounded-3 bg-gray-2 transition-background-color dark:bg-slate-8 transition-background-color"
    :disabled="disable"
  >
    <span
      :transform="modelValue && '!translate-x-3'"
      class="inline-block h-4 w-4 rounded-2 bg-gray-4 transition-transform -translate-x-3"
    />
  </button>
</template>
