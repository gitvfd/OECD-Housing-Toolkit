// https://observablehq.com/@brunolaranjeira/d3-v6-force-directed-graph-with-directional-straight-arrow@316
import define1 from "./a33468b95d0b15b0@703.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["suits.csv",new URL("./files/63c4d2f34c05d62a116fc16daf04215d82790c6bd036ce5783f7d002c5d83f704798ae8d61da50e2cc4cb81af8f629e4b14cc82abeeffd789a0cd425072cf2e6",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# D3 V6 force-directed graph with directional straight arrows

I did a fork on the classic original because I found the straigth arrows to be more pleasant (especially if using a single color) by changing linkArc() and increasing the arrow length by a little using forceCollide(). I also increased the radius and the text positioning.`
)});
  main.variable(observer()).define(["swatches","color"], function(swatches,color){return(
swatches({color})
)});
  main.variable(observer("chart")).define("chart", ["data","d3","width","height","types","color","location","drag","linkArc","invalidation"], function(data,d3,width,height,types,color,location,drag,linkArc,invalidation)
{
      const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force('collide', d3.forceCollide(d => 65))

    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])

    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(types)
        .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 38)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", 'M0,-5L10,0L0,5');

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => color(d.type))
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulation));

    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("r", 25)
        .attr('fill', d => '#6baed6');
  
    node.append("text")
        .attr("x", 30 + 4)
        .attr("y", "0.31em")
        .text(d => d.id)
        .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3);
  
    node.on('dblclick', (e, d) => console.log(nodes[d.index]))


    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    invalidation.then(() => simulation.stop());

    return svg.node();
}
);
  main.variable(observer("links")).define("links", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("suits.csv").text())
)});
  main.variable(observer("types")).define("types", ["links"], function(links){return(
Array.from(new Set(links.map(d => d.type)))
)});
  main.variable(observer("data")).define("data", ["links"], function(links){return(
{nodes: Array.from(new Set(links.flatMap(l => [l.source, l.target])), id => ({id})), links}
)});
  main.variable(observer("height")).define("height", function(){return(
800
)});
  main.variable(observer("color")).define("color", ["d3","types"], function(d3,types){return(
d3.scaleOrdinal(types, d3.schemeCategory10)
)});
  main.variable(observer("linkArc")).define("linkArc", function(){return(
d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
)});
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {
  
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
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  const child1 = runtime.module(define1);
  main.import("swatches", child1);
  return main;
}
