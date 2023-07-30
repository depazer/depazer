import { build } from 'esbuild'

build({
  entryPoints: ['./src/main.ts'],
  bundle: true,
  platform: 'node',
  target: ['node14'],
  outfile: '../../lib/index.js',
  format: 'esm'
})
