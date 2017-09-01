'use strict';

const fs = require('fs');

const { Writable, Transform } = require('stream');

const UpperCaser = Transform();

const WriteStuff = Writable();
UpperCaser._transform = (buffer, utf8, callback) => {
    callback(null, buffer.toString().toUpperCase())
};

WriteStuff._write = (buffer, utf8, next) => {
    fs.writeFile('file-io-caps.json', buffer, (err) => {
        if(err) throw err;
    });
    next();
}
fs.createReadStream('file-io.json').pipe(UpperCaser).pipe(WriteStuff)