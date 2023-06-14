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

function decideRadius(d) {
  const { id } = d;
  if (id.substring(0, 3) === "hpc") {
    return 2;
  } else return 10;
}

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



var link;

var file1 = "output.json";
var file2 = "./outputData/output3.json";

d3.json(file2, function (error, graph) {
  if (error) throw error;

  const maxValues = graph.maxValues;
  // console.log(maxValues);

  // Define the color scale
  const colorScaleHPC = d3
    .scaleLinear()
    .domain([0, maxValues[1]]) // Specify the minimum and maximum values in your range
    .range(["lightcoral", "red"]); // Specify the desired color range
  const colorScaleLeaf = d3
    .scaleLinear()
    .domain([0, maxValues[2]]) // Specify the minimum and maximum values in your range
    .range(['#00FF00', '#008000']); // Specify the desired color range
  const colorScaleDirector = d3
    .scaleLinear()
    .domain([0, maxValues[3]]) // Specify the minimum and maximum values in your range
    .range(['#ADD8E6', '#000080']); // Specify the desired color range
  const colorScaleSpine = d3
    .scaleLinear()
    .domain([0, maxValues[4]]) // Specify the minimum and maximum values in your range
    .range(['#8A2BE2', '#DDA0DD']); // Specify the desired color range

  link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", function (d) {
      return 0.5;
    })
    .attr("stroke", "grey");

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);


    // var preValue = 0;
  // Append circles for nodes with "hpc" ID prefix
  node
    .filter(function (d) {
      return d.id.substring(0, 4) === "Bhpc";
    })
    .append("rect")
    .attr("width", (d,i) => {if(d.value===0) return 0;return d.value*(width)/maxValues[5]})
    .attr("height", 12)
    .attr("fill", (d, i) => colorScaleHPC(d.value))
    .style("stroke","white")

  // Append rectangles for other nodes
  node
    .filter(function (d) {
      return d.id.substring(0, 4) === "IBSW";
    })
    .append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", (d, i) => colorScaleLeaf(d.value));


  node
    .filter(function (d) {
      return d.id[8] === "L";
    })
    .append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", (d, i) => colorScaleDirector(d.value));


  node
    .filter(function (d) {
      return d.id[8] === "S";
    })
    .append("rect")
    .attr("width", 17)
    .attr("height", 17)
    .attr("fill", (d, i) => colorScaleSpine(d.value));


  node.append("title").text(function (d) {
    return d.id;
  });

  link.raise();
  simulation.nodes(graph.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  // Define the number of nodes
  var numNodes1 = 36;
  var numNodes2 = 54;
  var numNodes3 = 52;
  var numNodes4 = 888;
  var numNodes5 = 52;

  // Define the radius and center of the circle
  var radius = 300;
  var centerX = width / 2;
  var centerY = height / 2;

  var previousWidthofBhpc = [];
  // console.log(graph.nodes[0])
  for(let i=0;i<=52;i++){
    previousWidthofBhpc.push(0);
  }
  for(let i=0;i<=52;i++){
    let row = graph.nodes[i];

    let widthOfBhpc = (row.value)*(width)/maxValues[5];
    if(i >0){
      previousWidthofBhpc[i] = ( widthOfBhpc + previousWidthofBhpc[i - 1]);
    }else previousWidthofBhpc[i] = (widthOfBhpc);
  }
  console.log(previousWidthofBhpc)
  function getXPos(d, i) {
    const { id ,value} = d;
    if (id.substring(0, 4) === "Bhpc") {
      var gap = width / ((numNodes5 + 1) * 1.1);
      var lastTwoLetters = id.slice(-2);
      var number = parseInt(lastTwoLetters, 10) ;
      var widthOfBhpc = value*(width)/maxValues[5];
      // number = Math.max(1,number)
      var x = 0;
      if(number > 0){
         x = previousWidthofBhpc[number-1]  + widthOfBhpc/2;
      }
      // previousWidthofBhpc = previousWidthofBhpc + widthOfBhpc;
      // console.log(x)
      return x ;
    } else if (id[3] === "W") {
      var gap = width / (1.5 * numNodes3);
      var lastThreeLetters = id.slice(-2);
      var number = parseInt(lastThreeLetters, 10);
      var x = centerX + gap * number - centerX / 1.5;
      return x;
    } else if (id[8] === "L") {
      var gap = width / (2 * numNodes2);
      var lastThreeLetters = id.slice(-2);
      var number = parseInt(lastThreeLetters, 10);
      if (id[3] === "2") number += 27;
      var x = centerX + gap * number - centerX / 2;
      return x;
    } else if (id[8] === "S") {
      var gap = width / (2.2 * numNodes1);
      var lastThreeLetters = id.slice(-2);
      var number = parseInt(lastThreeLetters, 10);
      if (id[3] === "2") number += 18;
      var x = centerX + gap * number - centerX / 2.2;
      return x;
    }
    return centerX;
  }
  function getYPos(d, i) {
    const { id } = d;
    if (id.substring(0, 4) === "Bhpc") {
      var lastThreeLetters = id.slice(-3);
      var number = parseInt(lastThreeLetters, 10);
      let y = 400;
      // if (number <= 222) y = 400;
      // else if (number > 222 && number <= 444) y = 420;
      // else if (number > 444 && number <= 666) y = 440;
      // else if (number > 666) y = 460;
      return y;
    } else if (id[3] === "W") {
      return 300;
    } else if (id[8] === "L") {
      return 200;
    } else if (id[8] === "S") {
      return 100;
    }
    return centerY;
  }

  function ticked() {
    // Update the position of circles for "hpc" nodes
    node
      .filter(function (d) {
        return d.id.substring(0, 4) === "Bhpc";
      })
      .select("rect")
      .attr("x", function (d) {
        return getXPos(d) - d.value*(width)/(2*maxValues[5]); // Offset half the width of the rectangle
      })
      .attr("y", function (d) {
        return getYPos(d) - 5; // Offset half the height of the rectangle
      });

    // Update the position of rectangles for non-"hpc" nodes
    node
      .filter(function (d) {
        return d.id.substring(0, 4) !== "Bhpc";
      })
      .select("rect")
      .attr("x", function (d) {
        return getXPos(d) - 5; // Offset half the width of the rectangle
      })
      .attr("y", function (d) {
        return getYPos(d) - 5; // Offset half the height of the rectangle
      });

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
  console.log(d.value);

  // Highlight the links connected to the hovered node
  link.attr("stroke", function (linkData) {
    if (linkData.source === d || linkData.target === d) {
      return "red";
    } else return "grey";
  });

  // Show tooltip on mouseover
  tooltip.transition().duration(200).style("opacity", 0.9);
  tooltip.html(d.id);
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

  // Remove the highlight from the links

  link.attr("stroke", "grey");
  // Hide tooltip on mouseout
  tooltip.transition().duration(200).style("opacity", 0);
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  // console.log(d);
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
