/* Formatting function for row details - modify as you need */
function format(d) {
  // `d` is the original data object for the row
  return (
    '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
    "<tr>" +
    "<td>NodeList:</td>" +
    "<td>" +
    d.NodeList +
    "</td>" +
    "</tr>" +
    "</table>"
  );
}

let colorIndex = 0;
var colorArray = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#FFC0CB",
  "#00FF7F",
  "#9370DB",
];

function getDifferentColors() {
  // colorIndex++;
  colorIndex = colorIndex % 10;
  return colorArray[colorIndex];
}

const jobMap = new Map();

$(document).ready(function () {
  var table = $("#example").DataTable({
    ajax: {
      url: "./outputData/output3.json", // Replace with the actual path to your JSON file
      dataSrc: "table", // Specify the property containing the array of objects in the JSON data
    },
    columns: [
      {
        className: "dt-control",
        orderable: false,
        data: null,
        defaultContent: "",
      },
      { data: "JobID" },
      { data: "UserName" },
      { data: "QueueName" },
      { data: "TotalNodes" },
      { data: "TotalCores" },
      { data: "RequiredTime" },
      { data: "JobState" },
      { data: "ElapsedTime" },
    ],
    order: [[1, "asc"]],
    scrollY: 200,
    scrollX: true,
  });

  // Add event listener for opening and closing details
  $("#example tbody").on("click", "td.dt-control", function () {
    var tr = $(this).closest("tr");
    var row = table.row(tr);
    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass("shown");
    } else {
      // Open this row
      row.child(format(row.data())).show();
      tr.addClass("shown");
    }
  });

  $("#example tbody").on("click", "tr", function () {
    $("#example tbody tr").removeClass("selected"); // Remove "selected" class from all rows
    $(this).toggleClass("selected");
  });

  $("#button").click(function () {
    // alert(table.rows(".selected").data());
    console.log(table.rows(".selected").data().toArray());
  });
});

// ############### For highlighting of links on clicking a particular job id #########################

$(document).ready(function () {
  d3.json(file2, function (error, graph) {
    if (error) throw error;

    console.log(graph.jobs.length);
    console.log(graph.jobs)
    for (const item of graph.jobs) {
      const { job, nodes } = item;
      // console.log(nodes);
      if (jobMap.has(job)) {
        // If the job already exists in the map, append the nodes to the existing array
        jobMap.get(job).push(nodes);
      } else {
        // If the job is encountered for the first time, create a new array with the nodes
        jobMap.set(job, [nodes]);
      }
    }
    let selected = document.querySelector(".selected");

    $("#example tbody").on("click", "tr", function () {
      const sorting1Element = $(this).find("td.sorting_1");
      const content = sorting1Element.text();
      // console.log(selected);
      colorIndex++;
      console.log(colorIndex);
      const arrayForKey = jobMap.get(content);
      console.log(arrayForKey);
      link
        .attr("stroke", function (linkData) {
          for (let i = 0; i < arrayForKey.length - 1; i++) {
            if (
              (linkData.source.id === arrayForKey[i]) ||
              (linkData.target.id === arrayForKey[i]) 
            ) {
              console.log("colorit")
              return getDifferentColors();
            }else if(arrayForKey[i].substring(0,3) === "hpc"){
              return getDifferentColors();
              
            }else if(arrayForKey[i+1].substring(0,3) === "hpc"){
              return getDifferentColors();

            }
          }
          return "grey";
        })
        .attr("stroke-width", function (linkData) {
          for (let i = 0; i < arrayForKey.length; i++) {
            if (
              linkData.source.id == arrayForKey[i] ||
              linkData.target.id == arrayForKey[i]
            ) {
              return 2; // Set the desired width for red links
            }
          }
          return 0.5; // Set the default width for grey links
        });
    });
  });
});
