import { resolve } from 'node:path'
import { stat } from 'node:fs/promises'

export async function hasFile(...filePath: string[]) {
  try {
    const stats = await stat(resolve(...filePath))
    return stats.isFile()
  } catch (error) {
    return false
  }
}
