import {
  drag,
  forceX,
  forceY,
  forceLink,
  forceManyBody,
  forceSimulation,
  interpolateRainbow,
  scaleSequential,
  select,
  zoom
} from 'd3'
import { usePackageStore } from '@/stores/package'

import type { ObjectDirective } from 'vue'
import type { Data, NodeInfo } from './types'
import type { SimulationNodeDatum, Simulation } from 'd3'

const color = (n: number) => scaleSequential(interpolateRainbow)(((n - 1) % 8) / 8)

export const vD3Chart: ObjectDirective<SVGElement, Data> = {
  beforeMount(el, binding) {
    const { togglePackage } = usePackageStore()
    const { nodes, links } = binding.value

    const simulation: Simulation<NodeInfo, undefined> = forceSimulation(nodes)
      .force(
        'link',
        forceLink(links).id(({ name }: any) => name)
      )
      .force('charge', forceManyBody().strength(-5000))
      .force('x', forceX())
      .force('y', forceY())
      .alphaTarget(0)

    const svgSelection = select(el)

    const title = svgSelection
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.name)
      .attr('fill', ({ depth }) => color(depth))

    const link = svgSelection
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', 'url(#arrow)')
      .attr('stroke-width', 2)
      .selectAll('line')
      .data(links)
      .join('line')

    const node = svgSelection
      .append('g')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 6)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 8)
      .attr('stroke', ({ depth }) => color(depth))
      .attr('fill', ({ depth }) => color(depth))
      .on('click', (_, d) => togglePackage(d.name))

    enableZoom(svgSelection)
    enableDrag(node, simulation)

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimulationNodeDatum)?.x ?? 0)
        .attr('y1', (d) => (d.source as SimulationNodeDatum)?.y ?? 0)
        .attr('x2', (d) => (d.target as SimulationNodeDatum)?.x ?? 0)
        .attr('y2', (d) => (d.target as SimulationNodeDatum)?.y ?? 0)

      node.attr('cx', (d) => d?.x ?? 0).attr('cy', (d) => d?.y ?? 0)

      title.attr('x', (d) => (d?.x ?? 0) - d.name.length * 4).attr('y', (d) => (d?.y ?? 0) - 16)
    })
  }
}

function enableZoom(selection: any) {
  zoom()
    .scaleExtent([1, 8])
    .on('zoom', ({ transform }: Record<'transform', string>) => {
      selection.selectAll('g').attr('transform', transform)
    })(selection)
}

function enableDrag(selection: any, simulation: Simulation<NodeInfo, undefined>) {
  type VDragEvent = DragEvent & { subject: SimulationNodeDatum; active: number }

  drag()
    .on('start', (event: VDragEvent) => {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    })
    .on('drag', (event: VDragEvent) => {
      event.subject.fx = event.x
      event.subject.fy = event.y
    })
    .on('end', (event: VDragEvent) => {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    })(selection)
}
