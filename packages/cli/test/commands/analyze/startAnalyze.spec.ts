import { startAnalyzer } from '@/commands/analyze/actions/startAnalyzer'

import { beforeAll, describe, test, vi } from 'vitest'

describe('startAnalyzer', () => {
  const mocked = vi.hoisted(() => {
    return {
      createServer: vi.fn((f) => f()),
      jsonResponse: vi.fn(),
      apiController: vi.fn(),
      pageController: vi.fn(),
      environmentScanner: vi.fn(),
      exec: vi.fn()
    }
  })

  beforeAll(() => {
    for (const item of Object.values(mocked)) {
      item.mockReset()
    }
  })

  vi.mock('node:http', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      createServer: mocked.createServer
    }
  })

  vi.mock('@depazer/core', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      environmentScanner: mocked.environmentScanner
    }
  })

  vi.mock('@depazer/server', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      jsonResponse: mocked.jsonResponse,
      apiController: mocked.apiController,
      pageController: mocked.pageController
    }
  })

  vi.mock('node:child_process', async (getSourceMods) => {
    const sourceMods = await getSourceMods<Record<string, Function>>()
    return {
      ...sourceMods,
      exec: mocked.exec
    }
  })

  test('should not call createServer when environment scanner error', async ({ expect }) => {
    mocked.environmentScanner.mockResolvedValueOnce({ error: 'error' })

    const error = await startAnalyzer(3000, 1, false, 'root')

    expect(mocked.createServer).not.toBeCalled()
    expect(error).toBe('error')
  })

  test('should call createServer when environment scanner success', async ({ expect }) => {
    mocked.environmentScanner.mockResolvedValueOnce({ error: null })

    const server = {
      close: vi.fn(),
      listen: vi.fn(),
      on: vi.fn()
    }

    vi.stubEnv('NODE_ENV', 'production')

    mocked.createServer.mockReturnValueOnce(server)

    await startAnalyzer(3000, 1, false, 'root')
    expect(mocked.createServer).toBeCalled()

    const createServerCallback = mocked.createServer.mock.calls[0][0]
    expect(createServerCallback).toBeTypeOf('function')

    await createServerCallback({ url: '/api/graph?depth=1&includeDev=true', method: 'GET' })
    expect(mocked.apiController).toBeCalled()
    expect(mocked.jsonResponse).toBeCalled()
    expect(mocked.pageController).not.toBeCalled()

    await createServerCallback({ url: '/index.html', method: 'GET' })
    expect(mocked.pageController).toBeCalled()

    const listenCallback = server.listen.mock.calls[0][2]
    expect(listenCallback).toBeTypeOf('function')

    console.clear = vi.fn()
    console.log = vi.fn()
    process.env.NODE_ENV = 'production'

    listenCallback()
    expect(mocked.exec).toBeCalledWith('start http://localhost:3000/init/1/false')
    expect(console.clear).toBeCalled()

    mocked.exec.mockReset()

    const onCallback = server.on.mock.calls[0][1]

    onCallback({ message: 'error' })
    expect(mocked.exec).not.toBeCalled()

    onCallback({ code: 'EADDRINUSE' })
    expect(server.listen).toBeCalledWith(3001, 'localhost', expect.any(Function))
  })
})
