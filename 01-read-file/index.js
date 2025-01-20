const fs = require('fs');
const path = require('path');
const { stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(pathToFile, 'utf-8');

stream.pipe(stdout);

stream.on('error', (err) => {
  console.error(err.message);
});
