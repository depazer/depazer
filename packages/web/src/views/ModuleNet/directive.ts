import {
  drag,
  forceX,
  forceY,
  forceLink,
  forceManyBody,
  forceSimulation,
  scaleOrdinal,
  schemeCategory10,
  select,
  type SimulationNodeDatum
} from 'd3'
import { usePackageStore } from '@/stores/package'

import type { ObjectDirective } from 'vue'
import type { Data } from './types'

const color = scaleOrdinal(schemeCategory10)

export const vD3Chart: ObjectDirective<SVGElement, Data> = {
  mounted(el, binding) {
    const { togglePackage } = usePackageStore()
    const { nodes, links } = binding.value

    const simulation = forceSimulation(nodes)
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
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.name)
      .attr('fill', (d) => color(d.name))

    const link = svgSelection
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      /** @todo 使用箭头 */
      // .attr('marker-end', 'url(#arrow)')
      .attr('stroke-width', 2)

    const node = svgSelection
      .append('g')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 6)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('stroke', (d) => color(d.name))
      .attr('r', 8)
      .attr('fill', (d) => color(d.name))
      .on('click', (_, d) => togglePackage(d.name))

    type VDragEvent = DragEvent & { subject: SimulationNodeDatum; active: number }
    const nodeDrag = drag()
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
      })
    node.call(nodeDrag as any)

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as Record<'x' | 'y', number>).x)
        .attr('y1', (d) => (d.source as Record<'x' | 'y', number>).y)
        .attr('x2', (d) => (d.target as Record<'x' | 'y', number>).x)
        .attr('y2', (d) => (d.target as Record<'x' | 'y', number>).y)

      node
        .attr('cx', (d) => (d as Record<'x' | 'y', number>).x)
        .attr('cy', (d) => (d as Record<'x' | 'y', number>).y)

      title.attr('x', (d) => (d?.x ?? 0) - d.name.length * 4).attr('y', (d) => (d?.y ?? 0) - 16)
    })
  }
}
