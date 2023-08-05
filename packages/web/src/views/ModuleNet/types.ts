import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3'

export interface GraphData {
  name: string
  dependencies: string[]
}

type NodeInfo = GraphData & SimulationNodeDatum
type LinkInfo = SimulationLinkDatum<SimulationNodeDatum & { value: number }>

export type Data = { nodes: NodeInfo[]; links: LinkInfo[] }
