import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3'

export interface GraphData {
  name: string
  depth: number
  dependencies: string[]
  isDevDependency: boolean
}

export type NodeInfo = GraphData & SimulationNodeDatum
export type LinkInfo = SimulationLinkDatum<SimulationNodeDatum & { isDeps: boolean }>

export type Data = { nodes: NodeInfo[]; links: LinkInfo[] }
