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
    // console.log(file2)
    // console.log(graph.jobs)
    for (const item of graph.jobs) {
      const { job, nodes,nodesM } = item;
      // console.log(item)
      jobMap.set(job, nodesM);
    }
    // console.log(jobMap)
    $("#example tbody").on("click", "tr", function () {
      // console.log(jobMap)
      // console.log(jobMap.get("1008448.un05"))
      const sorting1Element = $(this).find("td.sorting_1");
      const content = sorting1Element.text();
      console.log(content)
      let arrayForKey = jobMap.get(content);
      // console.log(content,arrayForKey)
      link.attr("stroke", function (linkData) {
        // console.log(linkData.source.id,content)
        // console.log(arrayForKey)
        if(arrayForKey)
        for (let i = 0; i < arrayForKey.length; i++) {
          // console.log(arrayForKey[i]);
          if (
            linkData.source.id == arrayForKey[i][0] &&
            linkData.target.id == arrayForKey[i][1]
          ) {
            return "red";
          }else if("hpc"== arrayForKey[i][0].substring(0,3) &&
            linkData.target.id == arrayForKey[i][1]){
              return "red";
            }else if("hpc"== arrayForKey[i][1].substring(0,3) &&
            linkData.target.id == arrayForKey[i][0]){
              return "red"
            }
        }
        return "grey";
      });
    });
  });
});
