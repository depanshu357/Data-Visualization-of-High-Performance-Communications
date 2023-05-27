const fs = require("fs");

// Specify the input and output file paths
const inputFile = "nodes_link_path.csv";
const outputFile = "output.csv";

// Read data from the input CSV file
fs.readFile(inputFile, "utf8", (error, data) => {
  if (error) {
    console.error("Error reading CSV file:", error);
    return;
  }

  // Split the data by lines
  const lines = data.split("\n");

  // Create the output CSV content
  let outputCsv = "group,variable,value\n";

  // Process each line of data (up to the first 100 lines)
  for (let i = 0; i < Math.min(lines.length, 100); i++) {
    const line = lines[i];

    // Split the line by colons
    const parts = line.split(":");

    // Extract the required values
    const group = parts[0];
    const lastField = parts[parts.length - 1];
    const firstString = lastField.split("->")[0].trim();
    const lastString = lastField.split("->").pop().trim();

    // Append the values to the output CSV content
    // Generate a random number between 0 and 100
    // const randomNumber = Math.floor(Math.random() * 101);
    const randomNumber = 30;

    outputCsv += `${firstString},${lastString},${randomNumber}\n`;
    // outputCsv += `${lastString},${firstString},${randomNumber}\n`;
  }

  // Write the output CSV content to the output file
  fs.writeFile(outputFile, outputCsv, "utf8", (error) => {
    if (error) {
      console.error("Error writing to CSV file:", error);
      return;
    }
    console.log("CSV file has been successfully created.");
  });
});

// Read the input CSV file
fs.readFile("device_counter.csv", "utf8", (err, data) => {
  if (err) throw err;

  // Split the input data into lines
  const lines = data.split("\n");

  // Extract the numbers from the second field of each line (first 100 data values)
  const numbers = lines.slice(0, 100).map((line) => {
    const fields = line.split(":");
    return fields[1] ? Number(fields[1]) : null;
  });

  // console.log(numbers)

  // Read the existing output CSV file
  fs.readFile("output.csv", "utf8", (err, outputData) => {
    if (err) throw err;

    // Split the output data into lines
    const outputLines = outputData.split("\n");

    // Modify the third row using the extracted numbers
    const modifiedOutputLines = outputLines.map((line, index) => {
      if (index >= 0) {
        const outputFields = line.split(":");
        // console.log(outputFields,numbers[index])
        // const element = outputFields[0];
        // console.log(element)
        // const values = element.split(',');
        // const newObj = {
        //   field1: values[0],
        //   field2: values[1],
        //   field3: numbers[index]
        // }
        // return newObj;
        // console.log(newObj)
        // outputFields[2] = numbers[index];
        // console.log(temp)
        // console.log(typeof line)
        const modifiedFields = outputFields.map((field, fieldIndex) => {
          // console.log(typeof field,fieldIndex)
          console.log(field)
          const str = field;
          const newValue = numbers[index];
          const values = str.split(',');
          values[2] = String(newValue);
          const newstr = values.join(',');
          console.log(newstr)
          return newstr;
          if (fieldIndex === 1) {
            // Replace the value with the corresponding extracted number
            return numbers[fieldIndex] !== null ? numbers[fieldIndex] : field;
          } else {
            return field;
          }
        });
        // console.log(modifiedFields.join(":"))
        return modifiedFields.join(":");
      } else {
        return line;
      }
    });
    // console.log(modifiedOutputLines)

    // Write the modified output to a new CSV file
    fs.writeFile(
      "modified_output.csv",
      modifiedOutputLines.join("\n"),
      "utf8",
      (err) => {
        if (err) throw err;
        console.log("Modified output CSV file created successfully.");
      }
    );
  });
});
