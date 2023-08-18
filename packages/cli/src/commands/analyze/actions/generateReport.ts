import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { getModuleResolver, graphTranslator } from '@depazer/core'
import { successLogger } from '@depazer/shared'

export async function generateReport(
  fileName: string,
  depth: number,
  includeDeps: boolean,
  root: string
) {
  const resolver = await getModuleResolver(root, includeDeps)
  if (typeof resolver === 'string') return

  const res = await resolver(depth)
  const targetPath = resolve(root, fileName)

  successLogger('Report generated: ' + targetPath)
  successLogger('Flat report generated: ' + resolve(targetPath, '..', 'flat.json'))
  writeFile(targetPath, JSON.stringify(res, null, 2))
  writeFile(resolve(targetPath, '..', 'flat.json'), JSON.stringify(graphTranslator(res), null, 2))
}
