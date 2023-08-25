import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3'
import type { DependencyNode } from '@depazer/core'

export type D3DependencyNode = DependencyNode & SimulationNodeDatum
export type D3DependencyLink = SimulationLinkDatum<SimulationNodeDatum> & { linkColor: string }

export interface D3DigraphWithLinks {
  nodes: D3DependencyNode[]
  links: D3DependencyLink[]
}

export type DependencyLink = Pick<D3DependencyLink, 'source' | 'target' | 'linkColor'>
export interface DigraphWithLinks {
  nodes: DependencyNode[]
  links: DependencyLink[]
}

export interface DependencyFetchData {
  dependencyNodes: DependencyNode[]
  loopDependencies: string[][]
  depth?: number
  dev?: boolean
}
