const { Transform } = require('stream');

let count = 0;
module.exports = () =>
  Transform({
    transform(word, _, done) {
      count++;
      count < 10 ? done(null, word) : process.exit();
    }
  });
