import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const WordCloud = React.memo(({ data }) => {
  const d3Container = useRef(null);

  const layout = useMemo(() => {
    return cloud()
      .size([500, 500])
      .words(data.map(d => ({ text: d.text, size: d.value })))
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize(d => d.size)
  }, [data]);

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Clear SVG before redrawing

      function draw(words) {
        svg
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
          .append("g")
          .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", d => `${d.size}px`)
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
          .text(d => d.text);
      }

      layout.on("end", draw).start();
    }
  }, [data, layout]);

  return (
    <svg
      className="d3-component"
      ref={d3Container}
    />
  );
});

export default WordCloud;