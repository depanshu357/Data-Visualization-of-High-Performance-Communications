const fs = require('fs');
const path = require('path');

const convertFolderToCSV = (folderPath,newfolderPath) => {
  // Read the contents of the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    // Iterate over each file in the folder
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Check if the file is a regular file (not a folder)
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error reading file stats:', err);
          return;
        }

        if (stats.isFile()) {
          // Read the file contents
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading file:', err);
              return;
            }

            // Create a new file with the .csv extension
            const newFilePath = path.join(newfolderPath, path.basename(file, path.extname(file)) + '.csv');

            // Write the data to the new file
            fs.writeFile(newFilePath, data, 'utf8', (err) => {
              if (err) {
                console.error('Error writing file:', err);
                return;
              }
              console.log('File converted to CSV:', newFilePath);
            });
          });
        }
      });
    });
  });
};

// Usage example
const folderPath = './Data2'; // Replace with the path to your folder
const newFolderPath = './DataInCsv'
convertFolderToCSV(folderPath,newFolderPath);
