'use strict';

const { readFileSync } = require('fs');

const exit = () => {
    console.log("No file specified!");
    process.exit();
}
let file = process.argv[2] ? process.argv[2] : exit();

const text = readFileSync(`${file}`);

process.stdout.write(text);
