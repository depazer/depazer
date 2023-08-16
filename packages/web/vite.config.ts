import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import autoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    unocss(),
    vue(),
    vueJsx(),
    vueI18n({ jitCompilation: true }),
    autoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
      vueTemplate: true,
      dts: 'src/types/auto-imports.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
