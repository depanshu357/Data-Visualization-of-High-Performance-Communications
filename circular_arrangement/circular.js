var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
svg.attr("height", window.innerHeight + 300);

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3
  .forceSimulation()
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force(
    "link",
    d3.forceLink().id(function (d) {
      return d.id;
    })
  );
// .force("collide", d3.forceCollide().radius(20).strength(0.2)); // Adjust the radius and strength values as needed

var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("right", "10px")
  .style("top", "10px")
  .style("border", "2px solid black")
  .style("width", "100px")
  .style("height", "40px");

d3.json("output.json", function (error, graph) {
  if (error) throw error;

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", function (d) {
      return Math.sqrt(d.value);
    });

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("r", 10)
    .attr("fill", function (d) {
      return color(d.group);
    })
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
  // .on("mouseover", mouseover)
  // .on("mousemove", mousemove)
  // .on("mouseleave", mouseleave)

  // .call(d3.drag()
  //     .on("start", dragstarted)
  //     .on("drag", dragged)
  //     .on("end", dragended));

  // node.append("title")
  //     .text(function (d) { return d.id; });
  link.raise();
  simulation.nodes(graph.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  // Define the number of nodes
  var numNodes1 = 36;
  var numNodes2 = 54;
  var numNodes3 = 52;
  var numNodes4 = 888;

  // Define the radius and center of the circle
  var radius = 300;
  var centerX = width / 2;
  var centerY = height / 2;

  function getXPos(d, i) {
    const { id } = d;
    if (id.substring(0, 3) === "hpc") {
      var angle = (2 * Math.PI) / numNodes4;
      var lastThreeLetters = id.slice(-3);
      var number = parseInt(lastThreeLetters, 10);
      var x = centerX + 400 * Math.cos(number * angle);
      return x;
    } else if (id[3] === "W") {
      var angle = (2 * Math.PI) / numNodes3;
      var lastThreeLetters = id.slice(-2);
      var number = parseInt(lastThreeLetters, 10);
      var x = centerX + 300 * Math.cos(number * angle);
      return x;
    } else if (id[8] === "L") {
      var angle = (2 * Math.PI) / numNodes2;
      var lastThreeLetters = id.slice(-2);
      var number = parseInt(lastThreeLetters, 10);
      if (id[3] === "2") number += 27;
      var x = centerX + 200 * Math.cos(number * angle);
      return x;
    } else if (id[8] === "S") {
      var angle = (2 * Math.PI) / numNodes1;
      var lastThreeLetters = id.slice(-2);
      var number = parseInt(lastThreeLetters, 10);
      if (id[3] === "2") number += 18;
      var x = centerX + 100 * Math.cos(number * angle);
      return x;
    }
    return centerX;
  }
  function getYPos(d, i) {
    const { id } = d;
    if (id.substring(0, 3) === "hpc") {
      var angle = (2 * Math.PI) / numNodes4;
      var lastThreeLetters = id.slice(-3);
      var number = parseInt(lastThreeLetters, 10);
      var x = centerX + 400 * Math.sin(number * angle);
      return x;
    } else if (id[3] === "W") {
      var angle = (2 * Math.PI) / numNodes3;
      var lastThreeLetters = id.slice(-2);
      var number = parseInt(lastThreeLetters, 10);
      var x = centerX + 300 * Math.sin(number * angle);
      return x;
    } else if (id[8] === "L") {
      var angle = (2 * Math.PI) / numNodes2;
      var lastThreeLetters = id.slice(-2);
      var number = parseInt(lastThreeLetters, 10);
      if (id[3] === "2") number += 27;
      var x = centerX + 200 * Math.sin(number * angle);
      return x;
    } else if (id[8] === "S") {
      var angle = (2 * Math.PI) / numNodes1;
      var lastThreeLetters = id.slice(-2);
      var number = parseInt(lastThreeLetters, 10);
      if (id[3] === "2") number += 18;
      var x = centerX + 100 * Math.sin(number * angle);
      return x;
    }
    return centerX;
  }

  function ticked() {
    node
      .attr("cx", function (d, i) {
        return getXPos(d, i);
      })
      .attr("cy", function (d, i) {
        return getYPos(d, i);
      });

    // Apply collision detection to prevent node overlap
    // node.attr("cx", function (d) { return d.x = Math.max(15, Math.min(width - 15, d.x)); })
    //     .attr("cy", function (d) { return d.y = Math.max(15, Math.min(height - 15, d.y)); });

    link
      .attr("x1", function (d, i) {
        return getXPos(d.source, i);
      })
      .attr("y1", function (d, i) {
        return getYPos(d.source, i);
      })
      .attr("x2", function (d, i) {
        return getXPos(d.target, i);
      })
      .attr("y2", function (d, i) {
        return getYPos(d.target, i);
      });
  }
});

function handleMouseOver(d) {
  console.log(d);
  // Show tooltip on mouseover
  tooltip.transition().duration(200).style("opacity", 0.9);
  tooltip.html(d.id);
  // .style("left", (d3.event.pageX + 10) + "px")
  // .style("top", (d3.event.pageY - 20) + "px");

  d3.select(this).style("stroke", "black").style("opacity", 1);
}

function handleMouseOut(d) {
  // Hide tooltip on mouseout
  tooltip.transition().duration(200).style("opacity", 0);

  d3.select(this).style("stroke", "white");
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  console.log(d);
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
