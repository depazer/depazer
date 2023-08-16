import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/core',
  'packages/cli',
  'packages/web',
  'packages/shared',
  'packages/vite'
])
