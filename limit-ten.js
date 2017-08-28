const { Transform } = require('stream');

let count = 0;
module.exports = () => Transform({
    _transform(word, _, done) {
        count ++;
        count <= 10 ? done(null, word) : process.exit();
    }
})