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
//     readFile( fileArg, ( err, data) => { //error first pattern
//         if(err) return console.error(err);
//         process.stdout.write(data);
//     });
// } else {
//     console.log('No file specified to read');
//     process.exit();
// }
// console.log("Async version"); 


// streaming - pull necessary data and work with it and meanwhile keep pulling the rest

// const { createReadStream, createWriteStream, appendFile, writeFile } = require('fs');

// const { Transform, Writable } = require('stream');

// const upperCasify = Transform();

// const writeStream = Writable();

// upperCasify._transform  = (buffer, _, callback) => { // property name with _ is private method can never be directly accessed. _ in argument means going for the default encoding UTF-8
//     callback(null, buffer.toString().toUpperCase()); 
// };

// writeStream._write = (buffer, _, next ) => { //next to indicate chaining events like .then()
//     appendFile('msgNew.txt', buffer, (err) => {
//         if(err) throw err;
//         console.log("Data was added to file");
//     });
//     next();
// };

// createReadStream('msg.txt').pipe(upperCasify).pipe(writeStream); //syncronous process


//<-------- difficult one ---------------------------->

const { createReadStream } = require('fs');
const { Writable } = require('stream');
const { map, split } = require('event-stream'); //for map and split methods
const userInput = process.argv[2] ? process.argv[2].toLowerCase() : null;
const writeStream = Writable();
const wordListStream = createReadStream('msg.txt');
const limitToTen = require('./limit-ten')
writeStream._write = (word, _, next) => {
    const output = word || "No matching word found."
    process.stdout.write(output);
    next();
};

if(!userInput) {
    console.log("Usage: ./readfile.js [search Tearm]");
    process.exit();
}

wordListStream
.pipe( split())
.pipe(map( (word, done) => {
    word.toString().toLowerCase().includes(userInput) ? done(null, word + "\n") : done()
})
)
.pipe(limitToTen)
.pipe(writeStream);

wordListStream.on('end', () => {
    console.log("Finished");
})