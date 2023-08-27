import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/shared',
  'packages/core',
  'packages/server',
  'packages/web',
  'packages/vite',
  'packages/cli'
])
