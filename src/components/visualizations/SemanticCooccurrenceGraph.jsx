import React, { useEffect, useRef, useState, useMemo } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { drag } from 'd3-drag';
import { useTranslation } from 'react-i18next';
import NetworkControls from './NetworkControls';
import NetworkTooltip from './NetworkTooltip';
import './SemanticCooccurrenceGraph.css';

const COLORS = {
  positive: '#4FC3F7',    // Electric Blue
  negative: '#FF00CC',    // Magenta
  neutral: '#FFB100',     // Amber
  center: '#00FFFF'       // Cyan
};

const SemanticCooccurrenceGraph = React.memo(({
  data,
  width = 900,
  height = 700,
  initialThreshold = 5
}) => {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [tooltip, setTooltip] = useState({ visible: false, data: null, x: 0, y: 0 });
  const simulationRef = useRef(null);

  // Filter data based on threshold
  const filteredData = useMemo(() => {
    if (!data || !data.nodes || !data.edges) {
      return { nodes: [], edges: [] };
    }

    const filteredEdges = data.edges.filter(e => e.weight >= threshold);
    const connectedNodeIds = new Set(filteredEdges.flatMap(e => [e.source, e.target]));
    const filteredNodes = data.nodes.filter(n =>
      n.group === 'center' || connectedNodeIds.has(n.id)
    );

    return {
      nodes: filteredNodes.map(n => ({ ...n })),
      edges: filteredEdges.map(e => ({ ...e }))
    };
  }, [data, threshold]);

  // Max threshold from data
  const maxThreshold = useMemo(() => {
    if (!data || !data.edges || data.edges.length === 0) return 50;
    return Math.max(...data.edges.map(e => e.weight));
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !filteredData.nodes.length) return;

    // Clear previous content
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    // Setup zoom behavior
    const zoomBehavior = zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Create main group for zoom/pan
    const g = svg.append('g');

    // Add glow filter
    const defs = svg.append('defs');

    // Glow filter for center node
    const centerGlow = defs.append('filter')
      .attr('id', 'center-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    centerGlow.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '5')
      .attr('result', 'blur');

    centerGlow.append('feFlood')
      .attr('flood-color', COLORS.center)
      .attr('flood-opacity', '0.8');

    centerGlow.append('feComposite')
      .attr('in2', 'blur')
      .attr('operator', 'in')
      .attr('result', 'glow');

    const merge1 = centerGlow.append('feMerge');
    merge1.append('feMergeNode').attr('in', 'glow');
    merge1.append('feMergeNode').attr('in', 'SourceGraphic');

    // Glow filter for edges
    const edgeGlow = defs.append('filter')
      .attr('id', 'edge-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    edgeGlow.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', '2')
      .attr('result', 'blur');

    const merge2 = edgeGlow.append('feMerge');
    merge2.append('feMergeNode').attr('in', 'blur');
    merge2.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create force simulation
    const simulation = forceSimulation(filteredData.nodes)
      .force('link', forceLink(filteredData.edges)
        .id(d => d.id)
        .distance(d => 200 - Math.sqrt(d.weight) * 10)
      )
      .force('charge', forceManyBody().strength(-500))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collision', forceCollide().radius(d => d.size / 2 + 20));

    simulationRef.current = simulation;

    // Draw edges
    const link = g.append('g')
      .selectAll('line')
      .data(filteredData.edges)
      .enter()
      .append('line')
      .attr('stroke', d => COLORS[d.sentiment] || COLORS.neutral)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.weight) * 1.5)
      .attr('class', 'edge')
      .style('filter', 'url(#edge-glow)');

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(filteredData.nodes)
      .enter()
      .append('g')
      .attr('class', d => `node ${d.group === 'center' ? 'center-node' : ''}`)
      .call(drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => d.size / 2)
      .attr('fill', d => d.group === 'center' ? COLORS.center : COLORS[d.sentiment])
      .attr('class', d => d.group === 'center' ? 'center-circle' : 'related-circle')
      .style('filter', d => d.group === 'center' ? 'url(#center-glow)' : 'none')
      .on('mouseenter', handleMouseEnter)
      .on('mouseleave', handleMouseLeave);

    // Add labels to nodes
    node.append('text')
      .text(d => d.label)
      .attr('font-size', d => d.group === 'center' ? '18px' : '13px')
      .attr('font-weight', d => d.group === 'center' ? 'bold' : '600')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.size / 2 + 18)
      .attr('fill', d => d.group === 'center' ? COLORS.center : '#B8C5D6')
      .attr('class', 'node-label')
      .style('pointer-events', 'none')
      .style('font-family', "'Noto Sans TC', 'Microsoft JhengHei', sans-serif");

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag handlers
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep center node fixed
      if (d.group !== 'center') {
        d.fx = null;
        d.fy = null;
      }
    }

    // Mouse event handlers
    function handleMouseEnter(event, d) {
      if (d.group === 'center') return;

      const [x, y] = [event.pageX, event.pageY];
      setTooltip({
        visible: true,
        data: d,
        x,
        y
      });

      // Highlight node
      select(event.target)
        .transition()
        .duration(200)
        .attr('r', d.size / 2 * 1.3)
        .style('filter', 'url(#center-glow)');
    }

    function handleMouseLeave(event, d) {
      setTooltip({ visible: false, data: null, x: 0, y: 0 });

      // Reset node size
      select(event.target)
        .transition()
        .duration(200)
        .attr('r', d.size / 2)
        .style('filter', 'none');
    }

    // Cleanup
    return () => {
      if (simulation) {
        simulation.stop();
      }
    };
  }, [filteredData, width, height, t]);

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="network-graph-container">
        <div className="network-empty-state">
          <div className="empty-icon">🌐</div>
          <div className="empty-text">{t('network.no_data') || 'No network data available'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="network-graph-container">
      <NetworkControls
        threshold={threshold}
        onThresholdChange={setThreshold}
        maxThreshold={maxThreshold}
      />

      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="network-svg"
      />

      <NetworkTooltip
        data={tooltip.data}
        x={tooltip.x}
        y={tooltip.y}
        visible={tooltip.visible}
      />
    </div>
  );
});

SemanticCooccurrenceGraph.displayName = 'SemanticCooccurrenceGraph';

export default SemanticCooccurrenceGraph;
