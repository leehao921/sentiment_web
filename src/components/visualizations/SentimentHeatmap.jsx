import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SentimentHeatmap = React.memo(({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Clear SVG before redrawing

      const margin = { top: 30, right: 30, bottom: 30, left: 100 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const chart = svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const categories = [...new Set(data.map(d => d.category))];
      const dates = [...new Set(data.map(d => d.date))];

      const x = d3.scaleBand()
        .range([0, width])
        .domain(dates)
        .padding(0.05);

      chart.append("g")
        .style("font-size", 15)
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove();

      const y = d3.scaleBand()
        .range([height, 0])
        .domain(categories)
        .padding(0.05);

      chart.append("g")
        .style("font-size", 15)
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove();

      const myColor = d3.scaleSequential()
        .interpolator(d3.interpolateRdYlGn)
        .domain([-1, 1]);

      chart.selectAll()
        .data(data, d => `${d.date}:${d.category}`)
        .join("rect")
        .attr("x", d => x(d.date))
        .attr("y", d => y(d.category))
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => myColor(d.score))
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .append("title")
        .text(d => `Score: ${d.score.toFixed(2)}`);
    }
  }, [data]);

  return (
    <svg
      className="d3-component"
      ref={d3Container}
    />
  );
});

export default SentimentHeatmap;