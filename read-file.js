// const { EOF } = 'dns';

//Sync file read method

// const {readFileSync} = require('fs'); // it stops all other async processes

// const fileArg = process.argv[2];

// if(fileArg) {
//     try {
//         const data = readFileSync(fileArg);
//         process.stdout.write(data.toString());
//     } catch(err) {
//         console.log("Error:", err.stack); //full stack of the error for details
//     }
// }
// else {
//     console.log("No file entered to read")
//     process.exit();
// }
// }

// <---------------- async method --------------->

// const { readFile } = require('fs'); //async  method
// const fileArg = process.argv[2];

// if(fileArg) {
//     readFile( fileArg, ( err, data) => { //error-first pattern
//         if(err)
// return console.error(err);
//         process.stdout.write(data);
//     });
// } else {
//     console.log('No file specified to read');
//     process.exit();
// }
// console.log("Async version");

//-----> streaming - pull necessary data and work with it and meanwhile keep pulling the rest

// const { createReadStream, createWriteStream, appendFile, writeFile } = require('fs');

// const { Transform, Writable } = require('stream');

// const upperCasify = Transform();

// const writeStream = Writable();

// upperCasify._transform = (buffer, _, callback) => {
//   // property name with _ is private method can never be directly accessed. _ in argument means going for the default encoding UTF-8
//   callback(null, buffer.toString().toUpperCase()); // null- no error(error first handling)
// };

// writeStream._write = (buffer, _, next) => {
//   //next to indicate chaining events like .then()
//   //   appendFile('msgNew.txt', buffer, err => {
//   writeFile('msgNew.txt', buffer + '\n', err => {
//     if (err) throw err;
//     console.log(buffer.toString(), 'Data was added to file');
//   });
//   next();
// };

// createReadStream('msg.txt')
//   .pipe(upperCasify)
//   .pipe(writeStream); //syncronous process
// console.log('Here');
// createReadStream('msg2.txt')
//   .pipe(upperCasify)
//   .pipe(writeStream); //syncronous process

//<-------- difficult one ---------------------------->

const { createReadStream } = require('fs');
const { Writable } = require('stream');
const { map, split } = require('event-stream');
const limitToTen = require('./limit-ten.js');

const userInput = process.argv[2] ? process.argv[2].toLowerCase() : null;
const writeStream = Writable();
const worldListStream = createReadStream('msg.txt');
let count = 0;
writeStream._write = (word, _, next) => {
  //not even called if no match
  process.stdout.write(word);
  next();
};

if (!userInput) {
  console.log('Usage: ./word-search [search term]');
  process.exit();
}

worldListStream
  .pipe(split())
  .pipe(
    map((word, done) => {
      if (
        word
          .toString()
          .toLowerCase()
          .includes(userInput)
      ) {
        done(null, word + '\n');
      } else if (count > 0) {
        //if the count (below) adds up this high, the whole list has been checked with no matches
        console.log('Sorry, no matches found!');
        process.exit();
      } else {
        count++; //increment this to see if every single word has been checked and failed to contain the user input
        done();
      }
    })
  )
  .pipe(limitToTen())
  .pipe(writeStream);

worldListStream.on('end', function() {
  console.log('No more matches found');
});
