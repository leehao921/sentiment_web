import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const WordCloud = React.memo(({ data }) => {
  const d3Container = useRef(null);

  // Color scale for word cloud with neon palette
  const colorScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, 0.5, 1])
      .range(["#B8C5D6", "#4FC3F7", "#00FFFF"]); // Secondary text -> Electric Blue -> Cyan
  }, []);

  const layout = useMemo(() => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));

    return cloud()
      .size([600, 500])
      .words(data.map(d => ({
        text: d.text,
        size: ((d.value - minValue) / (maxValue - minValue)) * 80 + 20, // Scale between 20 and 100
        value: d.value,
        normalizedValue: (d.value - minValue) / (maxValue - minValue)
      })))
      .padding(8)
      .rotate(() => {
        const angles = [-45, 0, 45];
        return angles[Math.floor(Math.random() * angles.length)];
      })
      .font("'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', sans-serif")
      .fontSize(d => d.size)
      .spiral("archimedean");
  }, [data]);

  useEffect(() => {
    if (!layout || !d3Container.current) return;

    const svg = d3.select(d3Container.current);
    svg.selectAll("*").remove(); // Clear SVG before redrawing

    const container = d3Container.current.parentElement;
    const containerWidth = container?.clientWidth || 600;
    const containerHeight = 500;

    svg
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .style("background", "transparent");

    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "wordcloud-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "var(--bg-tertiary)")
      .style("border", "2px solid var(--neon-cyan)")
      .style("border-radius", "var(--radius-md)")
      .style("padding", "var(--spacing-md)")
      .style("box-shadow", "var(--shadow-lg), var(--glow-cyan)")
      .style("font-family", "var(--font-primary)")
      .style("font-size", "0.875rem")
      .style("color", "var(--text-primary)")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    function draw(words) {
      const g = svg
        .append("g")
        .attr("transform", `translate(${containerWidth / 2}, ${containerHeight / 2})`);

      // Add glow filter
      const defs = svg.append("defs");
      const filter = defs.append("filter")
        .attr("id", "text-glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      filter.append("feGaussianBlur")
        .attr("in", "SourceGraphic")
        .attr("stdDeviation", "3")
        .attr("result", "blur");

      filter.append("feFlood")
        .attr("flood-color", "#00FFFF")
        .attr("flood-opacity", "0.6");

      filter.append("feComposite")
        .attr("in2", "blur")
        .attr("operator", "in")
        .attr("result", "glow");

      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "glow");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      g.selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', sans-serif")
        .style("font-weight", "600")
        .style("fill", d => colorScale(d.normalizedValue))
        .style("cursor", "pointer")
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .style("opacity", 0)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .style("filter", "url(#text-glow)")
            .style("transform", "scale(1.1)");

          tooltip
            .html(`
              <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-accent); font-size: 1.125rem; font-family: 'Noto Sans TC', sans-serif;">
                ${d.text}
              </div>
              <div style="display: flex; justify-content: space-between; gap: 1rem;">
                <span style="color: var(--text-secondary);">Frequency:</span>
                <span style="font-family: var(--font-display); font-weight: 700; color: ${colorScale(d.normalizedValue)}; text-shadow: 0 0 8px ${colorScale(d.normalizedValue)};">${d.value}</span>
              </div>
            `)
            .style("visibility", "visible");
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .style("filter", "none")
            .style("transform", "scale(1)");

          tooltip.style("visibility", "hidden");
        })
        .text(d => d.text)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 10)
        .style("opacity", 1);
    }

    // Update layout size
    layout.size([containerWidth, containerHeight]);
    layout.on("end", draw).start();

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [layout, colorScale]);

  if (!data || data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '500px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-primary)',
        fontSize: '1rem'
      }}>
        No word data available
      </div>
    );
  }

  return (
    <svg
      className="d3-component"
      ref={d3Container}
      style={{
        width: '100%',
        display: 'block',
        background: 'transparent'
      }}
    />
  );
});

WordCloud.displayName = 'WordCloud';

export default WordCloud;
