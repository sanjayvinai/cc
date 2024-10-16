#!/usr/bin/env node
import fs from "fs";

const args = process.argv.slice(2); // Get command-line arguments

console.log(args);

if (!args.length || args.length < 2) {
  console.log(`Please provide an argument like "ccwc -<flag> <file name>`);
  process.exit(1);
}

let filePath = args[1];

fs.stat(filePath, (err, stat) => {
  if (err) {
    console.log(`Error: ${err.message}`);
    return;
  }
  if (args[0] === "-c") {
    console.log(stat);
    console.log(`Number of bytes: ${stat.size}`);
  } else if (args[0] === "-l") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.log(`Error: ${err.message}`);
        return;
      }
      const lines = data.split("\n").length;
      console.log(`Number of lines: ${lines}`);
    });
  } else if (args[0] === "-w") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.log(`Error: ${err.message}`);
        return;
      }
      const words = data.split(/\s+/).length;
      console.log(`Number of words: ${words}`);
    });
  } else if (args[0] === "-m") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.log(`Error: ${err.message}`);
        return;
      }
      const lines = data.split("").length;
      console.log(`Number of chars: ${lines}`);
    });
  } else {
    console.log(`Invalid flag: ${args[0]}`);
  }
});
