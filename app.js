const fs = require("fs");
const path = require("path");
const { processOperations } = require("./app/services/operations");

/**
 * Main function to read input file and process the operations
 * @param {string} filePath - Path to the input file
 */
const main = async (filePath) => {
  fs.readFile(path.resolve(__dirname, filePath), "utf8", async (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      process.exit(1);
    }

    const operations = JSON.parse(data);
    try {
      const results = await processOperations(operations);
      results.forEach((result) => console.log(result));
    } catch (error) {
      console.error("Error processing operations:", error);
      process.exit(1);
    }
  });
};

// Execute main function with the input file path argument
if (process.argv.length !== 3) {
  console.error("Usage: node app.js <input_file_path>");
  process.exit(1);
}

const inputFilePath = process.argv[2];
main(inputFilePath);
