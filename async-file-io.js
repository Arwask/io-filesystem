'use strict';

const { readFile } = require('fs');

const file = process.argv[2] ? process.argv[2] : process.exit()
readFile(`${file}`, (err, data) => {
    if(err) throw(err);
    console.log(data.toString());
})