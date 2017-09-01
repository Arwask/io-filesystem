'use strict';

const { readFile } = require('fs');

const file = process.argv[2] ? process.argv[2] : process.exit()
readFile(`${file}`,'utf8', (err, data) => {
    if(err) throw(err);
    process.stdout.write(data);
    console.log(data);
})