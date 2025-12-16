import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CUSTOM_COLORS = {
  Spam: "#E53935", // Red for Spam (High contrast)
  Ham: "#43A047",  // Green for Ham (High contrast)
};

const PieChart = ({ data, width = 400, height = 400 }) => {
  const svgRef = useRef(null);

  const chartHeight = Math.min(height, width / 2);
  const outerRadius = chartHeight / 2 - 10;
  const innerRadius = outerRadius * 0.75;
  
  // Define extra space for the labels outside the chart
  const labelRadius = outerRadius * 1.05; 
  const lineEndRadius = outerRadius * 1.1; 

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous chart elements
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        // Adjust viewBox to accommodate labels outside the chart
        .attr("viewBox", [-width / 2, -height / 2, width, height]) 
        .style("overflow", "visible");

    const color = d3.scaleOrdinal()
        .domain(Object.keys(CUSTOM_COLORS))
        .range(Object.values(CUSTOM_COLORS));

    // 1. Define the Arc Generator (for the shape)
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    // 2. Define the Outer Arc Generator (for polyline positioning)
    const outerArc = d3.arc()
        .innerRadius(lineEndRadius)
        .outerRadius(lineEndRadius);
        
    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    const arcs = pie(data);

    // 3. Draw the slices (The D3 Data Join)
    svg.selectAll("path")
        .data(arcs)
      .join("path")
        .attr("fill", d => color(d.data.label))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .each(function(d) { this._current = d; }) 
        .attr("d", arc);

    // 4. Draw Polylines (The connecting lines)
    svg.selectAll('polyline')
        .data(arcs)
      .join('polyline')
        .attr('stroke', 'black')
        .style('fill', 'none')
        .attr('stroke-width', 1)
        .attr('points', function(d) {
            const posA = arc.centroid(d); // Start of the line (center of the slice edge)
            const posB = outerArc.centroid(d); // Corner point
            const posC = outerArc.centroid(d); // End point for the horizontal line segment
            
            // Determine the side (left or right) for the final line segment
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            posC[0] = labelRadius * (midangle < Math.PI ? 1 : -1); // Extend line horizontally
            
            return [posA, posB, posC];
        });

    // 5. Add Labels (Text outside the chart with two lines using tspan)
    const labels = svg.selectAll('text')
        .data(arcs)
      .join('text')
        // Position the text at the end of the polyline
        .attr('transform', function(d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = labelRadius * (midangle < Math.PI ? 1 : -1); // Adjust x position
            return `translate(${pos})`;
        })
        // Align text based on which side of the chart it's on
        .style('text-anchor', function(d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return (midangle < Math.PI ? 'start' : 'end');
        })
        .style("fill", "gray") 
        .style("font-size", "12px");
        
    // 5a. First Line: The Label (e.g., "Ham" or "Spam")
    labels.append("tspan")
        .attr("x", 0) // Anchor at the text position
        .attr("dy", "-0.3em") // Shift up slightly to center the block of text
        .style("font-weight", "bold")
        .style("color","gray")
        .text(d => d.data.label);

    // 5b. Second Line: The Percentage (Line break)
    labels.append("tspan")
        .attr("x", 0) // Anchor at the text position
        .attr("dy", "1.2em") // Move down to the next line (line break)
        .text(d => d.data.percentage || `${Math.round(d.data.value)}%`);

  }, [data, width, height, outerRadius, innerRadius, labelRadius, lineEndRadius]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default PieChart;