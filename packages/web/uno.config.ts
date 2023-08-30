import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives
} from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify({ prefix: 'v:' }),
    presetIcons({
      cdn: 'https://fastly.jsdelivr.net/npm/',
      extraProperties: { display: 'inline-block', 'vertical-align': 'middle' }
    }),
    presetUno()
  ],
  rules: [],
  safelist: [],
  shortcuts: {
    'icon-button':
      'ma-0 rounded-md border-none pa-1 bg-transparent hover:bg-gray-2 hover:dark:bg-slate-8 cursor-pointer'
  },
  transformers: [transformerDirectives()]
})
