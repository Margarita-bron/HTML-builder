const fs = require('fs');
const { stdin: input, stdout: output } = process;
const readline = require('readline');
const path = require('path');

const outputFile = path.join(__dirname, 'file.txt');
const writeStream = fs.createWriteStream(outputFile);

// eslint-disable-next-line quotes
output.write("Enter text or 'exit' to exit the stream\n");

const rl = readline.createInterface({ input, output });

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    writeStream.end();
    rl.close();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on('close', () => {
  output.write('stream closed');
  process.exit(0);
});

rl.on('SIGINT', () => {
  writeStream.end();
  rl.close();
});
