import { get } from 'node:https'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import { noteLogger, successLogger, warnLogger } from '@depazer/shared'

import { version } from '../../package.json'

export async function checkUpdate() {
  const CachePath = fileURLToPath(new URL('.cache', import.meta.url))

  const needCheck = await setupUpdate(CachePath)
  if (!needCheck) return false

  const latestVersion = await getLatestVersion()
  if (latestVersion === 'error') return false

  latestVersion !== version && updateLogger(version, latestVersion)
  updateCache(CachePath, latestVersion)
  return true
}

function getLatestVersion(): Promise<string> {
  return new Promise((resolve) => {
    get('https://registry.npmmirror.com/@depazer/cli/latest', (res) => {
      const list: Uint8Array[] = []
      res.on('data', (chunk) => list.push(chunk))

      res.on('end', () => {
        const registry = JSON.parse(Buffer.concat(list).toString())
        resolve(registry.version)
      })
    }).on('error', () => resolve('error'))
  })
}

async function setupUpdate(cachePath: string) {
  const cache = await readFile(cachePath, 'utf-8').catch(() =>
    JSON.stringify({
      lastCheck: 0,
      latestVersion: version
    })
  )

  const { lastCheck, latestVersion } = JSON.parse(cache)

  const now = Date.now()
  return latestVersion !== version || now - lastCheck >= 1000 * 60 * 60 * 24
}

function updateCache(cachePath: string, latestVersion: string | null) {
  writeFile(cachePath, JSON.stringify({ lastCheck: Date.now(), latestVersion }, null, 2))
}

function updateLogger(currentVersion: string, latestVersion: string) {
  warnLogger(`🎉 Update available: v${currentVersion} -> v${latestVersion}`, 'UPDATE!')
  successLogger(
    `📄 https://github.com/depazer/depazer/releases/tag/@depazer/cli@${latestVersion}`,
    'RELEASE'
  )
  noteLogger(
    `✨ npm up @depazer/cli -g | pnpm up @depazer/cli -g | yarn global up @depazer/cli`,
    'INSTALL'
  )
}
