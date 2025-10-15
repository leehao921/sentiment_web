import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';

const SentimentHeatmap = React.memo(({ data }) => {
  const { t } = useTranslation();
  const d3Container = useRef(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Clear SVG before redrawing

      const container = d3Container.current.parentElement;
      const containerWidth = container?.clientWidth || 600;

      const margin = { top: 40, right: 40, bottom: 60, left: 120 };
      const width = Math.min(containerWidth, 800) - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Set SVG dimensions
      svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const categories = [...new Set(data.map(d => d.category))];
      const dates = [...new Set(data.map(d => d.date))];

      // X-axis
      const x = d3.scaleBand()
        .range([0, width])
        .domain(dates)
        .padding(0.08);

      chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .style("font-family", "var(--font-primary)")
        .style("font-size", "12px")
        .style("fill", "var(--text-secondary)")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      chart.select(".domain").remove();

      // Y-axis
      const y = d3.scaleBand()
        .range([height, 0])
        .domain(categories)
        .padding(0.08);

      chart.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .style("font-family", "var(--font-primary)")
        .style("font-size", "14px")
        .style("fill", "var(--text-secondary)")
        .style("font-weight", "500");

      chart.select(".domain").remove();

      // Custom color scale for dark theme
      // Negative (-1) -> Magenta, Neutral (0) -> Amber, Positive (1) -> Electric Blue
      const colorScale = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["#FF00CC", "#FFB100", "#4FC3F7"]); // Magenta -> Amber -> Electric Blue

      // Create tooltip
      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "heatmap-tooltip")
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

      // Draw heatmap cells
      chart.selectAll()
        .data(data, d => `${d.date}:${d.category}`)
        .join("rect")
        .attr("x", d => x(d.date))
        .attr("y", d => y(d.category))
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => colorScale(d.score))
        .style("stroke", d => colorScale(d.score))
        .style("stroke-width", 0)
        .style("opacity", 0)
        .style("filter", d => `drop-shadow(0 0 8px ${colorScale(d.score)}40)`)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .style("stroke-width", 3)
            .style("opacity", 1)
            .style("filter", `drop-shadow(0 0 16px ${colorScale(d.score)})`);

          tooltip
            .html(`
              <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-accent); text-transform: uppercase; letter-spacing: 0.05em;">
                ${d.category}
              </div>
              <div style="margin-bottom: 0.25rem;">
                <span style="color: var(--text-secondary);">Date:</span>
                <span style="font-weight: 600; margin-left: 0.5rem; color: var(--text-primary);">${d.date}</span>
              </div>
              <div>
                <span style="color: var(--text-secondary);">Score:</span>
                <span style="font-family: var(--font-display); font-weight: 700; margin-left: 0.5rem; color: ${colorScale(d.score)}; text-shadow: 0 0 8px ${colorScale(d.score)};">${d.score.toFixed(3)}</span>
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
            .style("stroke-width", 0)
            .style("opacity", 0.8)
            .style("filter", d => `drop-shadow(0 0 8px ${colorScale(d.score)}40)`);

          tooltip.style("visibility", "hidden");
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 10)
        .style("opacity", 0.8);

      // Add legend
      const legendWidth = 200;
      const legendHeight = 20;

      const legend = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top + height + 40})`);

      const legendScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([0, legendWidth]);

      const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(d => d === -1 ? '負面' : d === 0 ? '中性' : d === 1 ? '正面' : d.toFixed(1));

      // Create gradient for legend
      const defs = svg.append("defs");
      const linearGradient = defs.append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

      linearGradient.selectAll("stop")
        .data([
          {offset: "0%", color: "#FF00CC"},    // Magenta (negative)
          {offset: "50%", color: "#FFB100"},   // Amber (neutral)
          {offset: "100%", color: "#4FC3F7"}   // Electric Blue (positive)
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

      legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("rx", 4)
        .style("fill", "url(#legend-gradient)")
        .style("stroke", "var(--holo-border)")
        .style("stroke-width", 2)
        .style("filter", "drop-shadow(0 0 8px rgba(0, 255, 255, 0.3))");

      legend.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(legendAxis)
        .selectAll("text")
        .style("font-family", "var(--font-primary)")
        .style("font-size", "12px")
        .style("fill", "var(--text-secondary)")
        .style("font-weight", "600");

      legend.select(".domain").remove();
      legend.selectAll(".tick line")
        .style("stroke", "var(--holo-border)");

      // Cleanup function
      return () => {
        tooltip.remove();
      };
    }
  }, [data, t]);

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

SentimentHeatmap.displayName = 'SentimentHeatmap';

export default SentimentHeatmap;
