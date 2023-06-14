/* Formatting function for row details - modify as you need */
function format(d) {
  // `d` is the original data object for the row
  return (
    '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
    "<tr>" +
    "<td>Full name:</td>" +
    "<td>" +
    d.name +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Extension number:</td>" +
    "<td>" +
    d.extn +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td>Extra info:</td>" +
    "<td>And any further details here (images etc)...</td>" +
    "</tr>" +
    "</table>"
  );
}

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
    $(this).toggleClass("selected");
  });

  $("#button").click(function () {
    alert(table.rows(".selected").data().length + " row(s) selected");
  });
});
