var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
svg.attr("height", 350);

var file1 = "output.json";
var file2 = "./outputData/output_140620231744.json";

// ################### For file selection ################
// Array of names
let outputFiles = [
  "./outputData/output_050620230156.json",
  "./outputData/output_050620231007.json",
  "./outputData/output_050620231133.json",
  "./outputData/output_050620231311.json",
  "./outputData/output_050620231410.json",
  "./outputData/output_050620231535.json",
  "./outputData/output_050620231651.json",
  "./outputData/output_050620231719.json",
  "./outputData/output_050620231846.json",
  "./outputData/output_050620232028.json",
  "./outputData/output_050620232121.json",
  "./outputData/output_050620232213.json",
  "./outputData/output_050620232228.json",
  "./outputData/output_060620231131.json",
  "./outputData/output_060620231236.json",
  "./outputData/output_070620230121.json",
  "./outputData/output_070620230941.json",
  "./outputData/output_080620231337.json",
  "./outputData/output_080620231403.json",
  "./outputData/output_090620230100.json",
  "./outputData/output_090620231144.json",
  "./outputData/output_090620231219.json",
  "./outputData/output_090620231720.json",
  "./outputData/output_090620232106.json",
  "./outputData/output_090620232237.json",
  "./outputData/output_100620231126.json",
  "./outputData/output_100620231153.json",
  "./outputData/output_100620231246.json",
  "./outputData/output_110620231106.json",
  "./outputData/output_110620232042.json",
  "./outputData/output_120620230048.json",
  "./outputData/output_120620231215.json",
  "./outputData/output_120620231538.json",
  "./outputData/output_120620232151.json",
  "./outputData/output_130620231132.json",
  "./outputData/output_130620232047.json",
  "./outputData/output_140620231238.json",
  "./outputData/output_140620231744.json",
];

// Create select input element
const select = document.createElement("select");

// Add options to select input
outputFiles.forEach((name) => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  select.appendChild(option);
});

// Add event listener to log the selected name
select.addEventListener("change", (event) => {
  const selectedName = event.target.value;
  let container = d3.select("svg");
  container.selectAll("*").remove();
  file2 = selectedName;
  makeGraph();
  console.log("Selected Name:", selectedName);
});

// Append select input to the body
document.body.appendChild(select);
// #######################################################

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

function makeGraph() {
  d3.json(file2, function (error, graph) {
    if (error) throw error;
    console.log("called");
    const maxValues = graph.maxValues;
    // console.log(maxValues);

    // Define the color scale
    const colorScaleHPC = d3
      .scaleLinear()
      .domain([0, maxValues[6]]) // Specify the minimum and maximum values in your range
      .range(["#fda766", "#ff6200"]); // Specify the desired color range
    const colorScaleLeaf = d3
      .scaleLinear()
      .domain([0, maxValues[2]]) // Specify the minimum and maximum values in your range
      .range(["#00FF00", "#008000"]); // Specify the desired color range
    const colorScaleDirector = d3
      .scaleLinear()
      .domain([0, maxValues[3]]) // Specify the minimum and maximum values in your range
      .range(["#ADD8E6", "#000080"]); // Specify the desired color range
    const colorScaleSpine = d3
      .scaleLinear()
      .domain([0, maxValues[4]]) // Specify the minimum and maximum values in your range
      .range(["#DDA0DD", "#8A2BE2"]); // Specify the desired color range
    //
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
      .attr("width", (d, i) => {
        if (d.value === 0) return 0;
        return (d.value * width) / maxValues[5];
      })
      .attr("height", 12)
      .attr("fill", (d, i) => colorScaleHPC(d.value))
      .style("stroke", "white");

    // Append rectangles for other nodes
    node
      .filter(function (d) {
        return d.id.substring(0, 5) === "IB_SW";
      })
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", (d, i) => colorScaleLeaf(d.value));

    node
      .filter(function (d) {
        return d.id[5] === "L";
      })
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", (d, i) => colorScaleDirector(d.value));

    node
      .filter(function (d) {
        return d.id[5] === "S";
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
    for (let i = 0; i <= 52; i++) {
      previousWidthofBhpc.push(0);
    }
    for (let i = 0; i <= 52; i++) {
      let row = graph.nodes[i];

      let widthOfBhpc = (row.value * width) / maxValues[5];
      if (i > 0) {
        previousWidthofBhpc[i] = widthOfBhpc + previousWidthofBhpc[i - 1];
      } else previousWidthofBhpc[i] = widthOfBhpc;
    }
    // console.log(previousWidthofBhpc);
    function getXPos(d, i) {
      const { id, value } = d;
      if (id.substring(0, 4) === "Bhpc") {
        var gap = width / ((numNodes5 + 1) * 1.1);
        var lastTwoLetters = id.slice(-2);
        var number = parseInt(lastTwoLetters, 10);
        var widthOfBhpc = (value * width) / maxValues[5];
        // number = Math.max(1,number)
        var x = 0;
        if (number > 0) {
          x = previousWidthofBhpc[number - 1] + widthOfBhpc / 2;
        }
        // previousWidthofBhpc = previousWidthofBhpc + widthOfBhpc;
        // console.log(x)
        return x;
      } else if (id[4] === "W") {
        var gap = width / (1.5 * numNodes3);
        var lastThreeLetters = id.slice(-2);
        var number = parseInt(lastThreeLetters, 10);
        var x = centerX + gap * number - centerX / 1.5;
        return x;
      } else if (id[5] === "L") {
        var gap = width / (1.6 * numNodes2);
        var lastThreeLetters = id.slice(-2);
        var number = parseInt(lastThreeLetters, 10);
        if (id[3] === "2") number += 27;
        var x = centerX + gap * number - centerX / 1.6;
        return x;
      } else if (id[5] === "S") {
        var gap = width / (1.6 * numNodes1);
        var lastThreeLetters = id.slice(-2);
        var number = parseInt(lastThreeLetters, 10);
        if (id[3] === "2") number += 18;
        var x = centerX + gap * number - centerX / 1.6;
        return x;
      }
      return centerX;
    }
    function getYPos(d, i) {
      const { id } = d;
      if (id.substring(0, 4) === "Bhpc") {
        var lastThreeLetters = id.slice(-3);
        var number = parseInt(lastThreeLetters, 10);
        let y = 320;
        // if (number <= 222) y = 400;
        // else if (number > 222 && number <= 444) y = 420;
        // else if (number > 444 && number <= 666) y = 440;
        // else if (number > 666) y = 460;
        return y;
      } else if (id[4] === "W") {
        return 220;
      } else if (id[5] === "L") {
        return 120;
      } else if (id[5] === "S") {
        return 20;
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
          return getXPos(d) - (d.value * width) / (2 * maxValues[5]); // Offset half the width of the rectangle
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
          let y1 = getYPos(d.source, i);
          let y2 = getYPos(d.target, i);
          if (y1 === 20) return 31;
          if (y1 < y2) y1 = y1 + 6;
          else y1 = y1 - 6;
          return y1;
        })
        .attr("x2", function (d, i) {
          return getXPos(d.target, i);
        })
        .attr("y2", function (d, i) {
          let y1 = getYPos(d.source, i);
          let y2 = getYPos(d.target, i);
          if (y2 === 20) return 31;
          if (y1 < y2) y2 = y2 - 6;
          else y2 = y2 + 6;
          return y2;
        });
    }
    // console.log(jobMap);
  });
}
// var row = document.querySelector()

function handleMouseOver(d) {
  console.log(d.value);

  // Highlight the links connected to the hovered node
  link
    .attr("stroke", function (linkData) {
      if (linkData.source === d || linkData.target === d) {
        return "red";
      } else return "grey";
    })
    .attr("opacity", 0.3);

  // Show tooltip on mouseover
  // tooltip.transition().duration(200).style("opacity", 0.9);
  // tooltip.html(d.id);

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
