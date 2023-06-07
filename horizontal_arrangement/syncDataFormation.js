const fs = require("fs");
const util = require("util");

const inputFile = "nodes_link_path.csv";
const inputFile2 = "device_counter.csv";
const outputFile = "output3.json";


// Function to read and process a CSV file
function processCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (error, csvData) => {
      if (error) {
        console.error("Error reading CSV file:", error);
        return;
      }
      var sumMap = new Map();
      var maxValue  = -1;
      var maxValuehpc = -1;
      var maxValueLeaf = -1;
      var maxValueDirector = -1;
      var maxValueSpine = -1;
      var minValue = 0;

      // Split the CSV data into rows
      const data = csvData.split("\n");

      for (var i = 0; i < data.length - 1; i++) {
        var row = data[i];
        // Split the row by colon delimiter
        var values = row.split(":");

        // Get the values from the second and third columns
        var value1 = parseInt(values[2]) / 100000000;
        var value2 = parseInt(values[3]) / 100000000;

        // Normalize the values
        var normalizedValue = value1 + value2;
        if(values[0][0]==='h'){
            if(maxValuehpc < normalizedValue) maxValuehpc = normalizedValue;
        }else if(values[0][3]==='W'){
          if(maxValueLeaf < normalizedValue) maxValueLeaf = normalizedValue;
        }else if(values[0][8]==='L'){
          if(maxValueDirector < normalizedValue) maxValueDirector = normalizedValue;
        }else if(values[0][8]==='S'){
          if(maxValueSpine < normalizedValue) maxValueSpine = normalizedValue;
        }
        if(maxValue < normalizedValue){
          maxValue = normalizedValue;
        }

        // Get the value from the first column
        var key = values[0];

        // Calculate the sum and store it in the map
        if (sumMap.has(key)) {
          // If the key already exists in the map, add the normalized values
          var sum = sumMap.get(key);
          sum[0] = normalizedValue;
        } else {
          // If the key doesn't exist in the map, initialize the sum
          sumMap.set(key, [normalizedValue]);
        }
      }
      resolve({sumMap,maxValue,maxValuehpc,maxValueLeaf,maxValueDirector,maxValueSpine});
    });
  });
}

function processSecondCSVFile(sumMap, filePath,maxValue,maxValuehpc,maxValueLeaf,maxValueDirector,maxValueSpine) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (error, csvData) => {
      if (error) {
        console.error("Error reading CSV file:", error);
        return;
      }
      // Initialize nodes and links arrays
      const maxValues = [maxValue,maxValuehpc,maxValueLeaf,maxValueDirector,maxValueSpine];
      const nodes = [];
      const links = [];
      let groupValue = 5;
      for (let i = 0; i <= 888; i++) {
        let paddedNumber = ("000" + i).slice(-3);
        let nodeId = "hpc" + paddedNumber;
        groupValue = 4;
        var value = [];
        if (sumMap.has(nodeId)) {
          value = sumMap.get(nodeId);
        } else {
          value = [0];
        }
        const node = { id: nodeId, group: groupValue, value: value[0] };
        nodes.push(node);
        // console.log(node);
      }
      for (let i = 1; i <= 52; i++) {
        let paddedNumber = ("00" + i).slice(-2);
        let nodeId = "IBSW_" + paddedNumber;
        groupValue = 3;
        let value;
        if (sumMap.has(nodeId)) {
          value = sumMap.get(nodeId);
        } else value = [0];
        const node = { id: nodeId, group: groupValue, value: value[0] };
        nodes.push(node);
      }
      for (let i = 1; i <= 27; i++) {
        let paddedNumber = ("00" + i).slice(-2);
        let nodeId = "IBB1_SW_L" + paddedNumber;
        groupValue = 2;
        let value;
        if (sumMap.has(nodeId)) {
          value = sumMap.get(nodeId);
        } else value = [0];
        const node = { id: nodeId, group: groupValue, value: value[0] };
        nodes.push(node);
      }
      for (let i = 1; i <= 27; i++) {
        let paddedNumber = ("00" + i).slice(-2);
        let nodeId = "IBB2_SW_L" + paddedNumber;
        groupValue = 2;
        let value;
        if (sumMap.has(nodeId)) {
          value = sumMap.get(nodeId);
        } else value = [0];
        const node = { id: nodeId, group: groupValue, value: value[0] };
        nodes.push(node);
      }
      for (let i = 1; i <= 18; i++) {
        let paddedNumber = ("00" + i).slice(-2);
        let nodeId = "IBB1_SW_S" + paddedNumber;
        groupValue = 1;
        let value;
        if (sumMap.has(nodeId)) {
          value = sumMap.get(nodeId);
        } else value = [0];
        const node = { id: nodeId, group: groupValue, value: value[0] };
        nodes.push(node);
      }
      for (let i = 1; i <= 18; i++) {
        let paddedNumber = ("00" + i).slice(-2);
        let nodeId = "IBB2_SW_S" + paddedNumber;
        groupValue = 1;
        let value;
        if (sumMap.has(nodeId)) {
          value = sumMap.get(nodeId);
        } else value = [0];
        const node = { id: nodeId, group: groupValue, value: value[0] };
        nodes.push(node);
      }
      // Split the CSV data into rows
      const rows = csvData.split("\n");
      // Iterate over each row
      rows.forEach((row) => {
        // Split the row into columns
        const columns = row.split(":");
        const connections = columns[3].split("->");

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

      // console.log(nodes);

      // Create the JSON object
      const jsonData = {
        maxValues : maxValues,
        nodes: nodes,
        links: links,
      };

      // Convert the JSON object to a JSON string
      const jsonString = JSON.stringify(jsonData);
      resolve(jsonString);
    });
  });
}

// Process the first CSV file
processCSVFile(inputFile2)
  .then((firstFileData) => {
    console.log('Processed first file:', firstFileData);
    // Process the second CSV file after processing the first file
    // return processCSVFile("secondFile.csv");
    const {sumMap,maxValue,maxValuehpc,maxValueLeaf,maxValueDirector,maxValueSpine} = firstFileData;
    return processSecondCSVFile(sumMap, inputFile,maxValue,maxValuehpc,maxValueLeaf,maxValueDirector,maxValueSpine);
  })
  .then((secondFileData) => {
    var json = JSON.parse(secondFileData)
    console.log("Processed second file:", json.links);

    // Write the output CSV content to the output file
  fs.writeFile(outputFile, secondFileData, "utf8", (error) => {
    if (error) {
      console.error("Error writing to CSV file:", error);
      return;
    }
    console.log("CSV file has been successfully created.");
  });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
