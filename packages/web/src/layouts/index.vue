<template>
  <header flex="~ justify-between" class="bg-gray-1 dark:bg-slate-8 px-4 py-2">
    <div>1</div>
    <div>
      <button
        title="颜色模式"
        type="button"
        class="rounded-full pa-1 cursor-pointer mr-2"
        border="solid 1 gray-3"
      >
        <i class="i-uil-sun" text="2xl gray-6" />
      </button>
      <button
        title="设置"
        type="button"
        class="rounded-full pa-1 cursor-pointer"
        border="solid 1 gray-3"
      >
        <i class="i-uil-setting" text="2xl gray-6" />
      </button>
    </div>
  </header>

  <main class="">
    <router-view />
  </main>
</template>
