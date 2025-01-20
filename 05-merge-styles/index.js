const fs = require('fs').promises;
const path = require('path');

const goalDirPath = path.join(__dirname, 'project-dist');
const goalFilePath = path.join(goalDirPath, 'bundle.css');
const styleDirPath = path.join(__dirname, 'styles');

async function getFile() {
  try {
    await fs.stat(goalFilePath);
    await fs.rm(goalFilePath, { recursive: true, force: true });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
}

async function createNewStyle() {
  try {
    await getFile();
    const bundle = [];
    const files = await fs.readdir(styleDirPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const date = await fs.readFile(
          path.join(styleDirPath, file.name),
          'utf-8',
        );
        bundle.push(date);
      }
    }

    await fs.writeFile(goalFilePath, bundle.join('\n'), 'utf-8');
  } catch (err) {
    console.error(err.message);
  }
}

createNewStyle();
