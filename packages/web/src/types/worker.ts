import type { DependencyNode } from '@depazer/core'
import type { DependencyFetchData, DigraphWithLinks } from './dependency'

export const enum WorkerMessageType {
  GenerateDigraphWithLink,
  GenerateRemoteNodes
}

export interface GenerateDigraphWithLinkPayload {
  type: WorkerMessageType.GenerateDigraphWithLink
  id: number
  data: {
    dependency: DependencyFetchData
    rootDependency: string
    packedNodes: string[]
  }
}

export interface GenerateRemoteNodesPayload {
  type: WorkerMessageType.GenerateRemoteNodes
  id: number
  data: {
    rootDependency: string
    packedNodes: string[]
    depth: number
  }
}

export type WorkerReturnMessage = MessageEvent<
  | {
      type: WorkerMessageType.GenerateDigraphWithLink
      id: number
      data: DigraphWithLinks
    }
  | {
      type: WorkerMessageType.GenerateRemoteNodes
      id: number
      data: DependencyNode[]
    }
>

export type WorkerMessage = GenerateDigraphWithLinkPayload | GenerateRemoteNodesPayload
