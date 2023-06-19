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
      { data: 'JobID' },
      { data: 'UserName' },
      { data: 'QueueName' },
      { data: 'TotalNodes' },
      { data: 'TotalCores' },
      { data: 'RequiredTime' },
      { data: 'JobState' },
      { data: 'ElapsedTime' },
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
    for (const item of graph.jobs) {
      const { job, nodes } = item;
      jobMap.set(job, nodes);
    }
    $("#example tbody").on("click", "tr", function () {
      const sorting1Element = $(this).find("td.sorting_1");
      const content = sorting1Element.text();
      const arrayForKey = jobMap.get(content);
      link.attr("stroke", function (linkData) {
        // console.log(linkData.source.id,content)
        // console.log(arrayForKey)
        for(let i =0;i<arrayForKey.length;i++){
          if (linkData.source.id == arrayForKey[i] || linkData.target.id == arrayForKey[i]) {
            // console.log(arrayForKey[i])
            return "red";
          }
        }
        return "grey";
      });
      
    });
  })
})
