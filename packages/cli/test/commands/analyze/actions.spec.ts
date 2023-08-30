import action from '@/commands/analyze/actions/index'

import { describe, vi } from 'vitest'

describe('analyze actions', (test) => {
  const { mockedGenerateReport, mockedStartAnalyzer } = vi.hoisted(() => {
    return {
      mockedGenerateReport: vi.fn(),
      mockedStartAnalyzer: vi.fn()
    }
  })

  vi.mock('@/commands/analyze/actions/generateReport', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      generateReport: mockedGenerateReport
    }
  })

  vi.mock('@/commands/analyze/actions/startAnalyzer', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      startAnalyzer: mockedStartAnalyzer
    }
  })

  console.log = vi.fn()

  const defaultArgs = {
    depth: Infinity,
    d: Infinity,
    dev: false,
    port: 4936,
    p: 4946,
    open: false,
    o: false,
    j: '',
    jsonFile: '',
    '--': []
  }

  test('action', ({ expect }) => {
    expect(action).toBeDefined()
  })

  test('start analyzer without -j', async ({ expect }) => {
    await action('.', defaultArgs)

    expect(mockedStartAnalyzer).toBeCalled()
  })

  test('generate report with -j', async ({ expect }) => {
    await action('.', {
      ...defaultArgs,
      jsonFile: true,
      j: true
    })

    expect(mockedGenerateReport).toBeCalled()
  })

  test('throw error when args error', async ({ expect }) => {
    try {
      await action('.', {
        ...defaultArgs,
        '--': ['error']
      })
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })
})
