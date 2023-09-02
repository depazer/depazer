import type { DependencyFetchData } from './dependency'

export const enum WorkerMessageType {
  GenerateDigraphWithLink,
  GenerateRemoteNodes
}

export interface GenerateDigraphWithLinkPayload {
  type: WorkerMessageType.GenerateDigraphWithLink
  data: {
    dependency: DependencyFetchData
    rootDependency: string
    packedNodes: string[]
  }
}

export interface GenerateRemoteNodesPayload {
  type: WorkerMessageType.GenerateRemoteNodes
  data: {
    rootDependency: string
    packedNodes: string[]
    depth: number
  }
}

export type WorkerMessage = GenerateDigraphWithLinkPayload | GenerateRemoteNodesPayload
