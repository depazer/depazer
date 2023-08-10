import type { ModuleGraph, ModuleObject } from '@/types/moduleGraph'

export async function pnpmAdaptor(
  _root: string,
  _moduleObject: ModuleObject,
  _depth: number
  // @ts-ignore
): Promise<ModuleGraph> {}
