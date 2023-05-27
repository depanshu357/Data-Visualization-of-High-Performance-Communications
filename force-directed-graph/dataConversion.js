const fs = require("fs");

const inputFile = "nodes_link_path.csv";
const outputFile = "output.json";

// Read data from the input CSV file
fs.readFile(inputFile, "utf8", (error, csvData) => {
  if (error) {
    console.error("Error reading CSV file:", error);
    return;
  }

  //   const csvData = `981629.09,hpc210,hpc256,hpc260,hpc279,hpc334,hpc434,hpc457:Nodes hpc139 <-> hpc193:hpc139->IBSW_08->IBB1_SW_L04->IBB1_SW_S09->IBB1_SW_L06->IBSW_11->hpc193`;

  // Initialize nodes and links arrays
  const nodes = [];
  const links = [];
  const uniqueNodeIds = new Set(); // To keep track of unique node IDs


  // Split the CSV data into rows
  const rows = csvData.split("\n");

  // Iterate over each row
  rows.forEach((row) => {
    // Split the row into columns
    const columns = row.split(":");

    // Extract the node IDs from the first column
    // Extract the node IDs from the fourth column, including switches
    const nodeIds = columns[3].split("->").map((node) => node.trim());

    // Extract the connection details from the second column
    console.log(columns);
    const connections = columns[3].split("->");

        // Create nodes and links data structure
        nodeIds.forEach((nodeId) => {
          if (!uniqueNodeIds.has(nodeId)) {
            uniqueNodeIds.add(nodeId);
    
            var groupValue = 5;
            if (nodeId[0] === "h") {
              groupValue = 4;
            } else if (nodeId[3] === "W") {
              groupValue = 3;
            } else if (nodeId[3] === "1") {
              groupValue = 2;
            }else if(nodeId[3] === '2'){
              groupValue = 1;
            }
    
            const node = { id: nodeId, group: groupValue }; // Assuming group value is always 3 for nodes
            nodes.push(node);
          }
        });

    // Create links data structure
    for (let i = 0; i < connections.length - 1; i++) {
      const link = {
        source: connections[i].trim(),
        target: connections[i + 1].trim(),
        value: Math.random(), // Assign a random value to the link (you can modify this as per your requirement)
      };
      links.push(link);
    }
  });

  // Create the JSON object
  const jsonData = {
    nodes: nodes,
    links: links,
  };

  // Convert the JSON object to a JSON string
  const jsonString = JSON.stringify(jsonData);

  // Display the JSON string
  console.log(jsonString);

  // Write the output CSV content to the output file
  fs.writeFile(outputFile, jsonString, "utf8", (error) => {
    if (error) {
      console.error("Error writing to CSV file:", error);
      return;
    }
    console.log("CSV file has been successfully created.");
  });
});
