<script lang="ts" setup>
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div
    bg="gray-3 dark:slate-7"
    class="rounded-md pa-4 box-border"
    shadow="lg gray-3 dark:slate-6"
    flex="~ col"
  >
    <header flex="~ justify-between items-center">
      <slot name="header"><span></span></slot>
      <button
        type="button"
        title="关闭"
        class="ma-0 rounded-md border-none pa-1"
        bg="transparent hover:gray-2 hover:dark:slate-8"
        @click="emit('close')"
      >
        <i class="i-uil-times" text="xl" />
      </button>
    </header>
    <slot />
  </div>
</template>
