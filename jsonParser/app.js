#!/usr/bin/env node

import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
// console.log(args);

const [filePath, ...test] = args;

if (!fs.existsSync(filePath)) {
  console.log("file does not exist");
  process.exit(1);
}
if (fs.statSync(filePath).isDirectory()) {
  console.log("file is a directory");
  process.exit(1);
}

const main = async () => {
  await fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(`Error: ${err.message}`);
      process.exit(1);
      return;
    }
    if (data.length === 0 || data.length < 2) {
      console.log("not valid Json file");
      process.exit(1);
    }

    let val = parseJson(data);
    console.log(val, typeof val);
  });
};

const parseJson = (data) => {
  let index = 0;
  const char = () => data[index];

  const skipSpaces = () => {
    while (index < data.length && /\s/.test(char())) {
      index++;
    }
  };

  const parseString = () => {
    index++;
    let str = "";

    while (char() !== `"`) {
      str += char();
      index++;
    }

    index++;
    return str;
  };

  const parseBoolean = () => {
    if (char() === "t") {
      index += 4;
      return true;
    } else if (char() === "f") {
      index += 5;
      return false;
    }
  };

  const parseNull = () => {
    index += 4;
    return null;
  };

  const parseNo = () => {
    let no = "";
    while (/\d/.test(char())) {
      no += char();
      index++;
    }
    return Number(no);
  };

  const parseArray = () => {
    let arr = [];
    index++;

    while (true) {
      skipSpaces();
      let value = "";
      if (char() === `"`) {
        value = parseString();
      } else if (
        data.slice(index, index + 4) === "true" ||
        data.slice(index, index + 5) === "false"
      ) {
        value = parseBoolean();
      } else if (data.slice(index, index + 4) === "null") {
        value = parseNull();
      } else if (/\d/.test(char())) {
        value = parseNo();
      } else if (char() === "[") {
        value = parseArray();
      } else if (char() === "{") {
        value = parseObj();
      }
      skipSpaces();
      if (char() === "]") {
        index++;
        return arr;
      }
      if (char() !== ",") {
        console.log("not valid json");
        process.exit(1);
      }
      index++;
    }
  };

  const parseObj = () => {
    let obj = {};
    index++;

    while (true) {
      skipSpaces();

      if (char() === "}") {
        index++;
        return obj;
      }

      let key = "";
      if (char() === `"`) {
        key = parseString();
      }

      skipSpaces();
      if (char() !== ":") {
        console.log("not valid json");
        process.exit(1);
      }
      index++;
      skipSpaces();

      let value = "";
      if (char() === `"`) {
        value = parseString();
      } else if (
        data.slice(index, index + 4) === "true" ||
        data.slice(index, index + 5) === "false"
      ) {
        value = parseBoolean();
      } else if (data.slice(index, index + 4) === "null") {
        value = parseNull();
      } else if (/\d/.test(char())) {
        value = parseNo();
      } else if (char() === "[") {
        value = parseArray();
      } else if (char() === "{") {
        value = parseObj();
      } else {
        console.log("not valid json");
        process.exit(1);
      }
      skipSpaces();

      obj[key] = value;

      if (char() === "}") {
        index++;
        return obj;
      }

      if (char() !== ",") {
        console.log("not valid json");
        process.exit(1);
      }
      index++;
    }
  };

  const parseValue = () => {
    skipSpaces();
    if (char() === `{`) {
      return parseObj();
    }
  };

  return parseValue();
};

main();
