import type { ModuleGraph, ModuleObject } from '@/types/moduleGraph'

/**
 * @desc npm module graph generator
 * @param root project root
 */
export async function npmAdaptor(
  _root: string,
  _moduleObject: ModuleObject,
  _depth: number
  // @ts-ignore
): Promise<ModuleGraph> {}
