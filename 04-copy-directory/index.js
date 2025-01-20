const fs = require('fs').promises;
const path = require('path');

const originalPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

async function getDir() {
  try {
    await fs.stat(copyPath);
    await fs.rm(copyPath, { recursive: true, force: true });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
}

async function getFiles() {
  try {
    await getDir();
    await fs.mkdir(copyPath, { recursive: true });

    const files = await fs.readdir(originalPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(originalPath, file),
        path.join(copyPath, file),
      );
    }
  } catch (err) {
    console.error(err.message);
  }
}

getFiles();
