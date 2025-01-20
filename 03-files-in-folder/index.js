const fs = require('fs').promises;
const path = require('path');

const taskPath = path.join(__dirname, 'secret-folder');

async function readSecretFolder() {
  try {
    const files = await fs.readdir(taskPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        let newPath = path.join(__dirname, 'secret-folder', file.name);
        let fileExtension = path.extname(newPath);

        const stats = await fs.stat(newPath);

        console.log(
          `${file.name.split('.')[0]} - ${fileExtension.slice(1)} - ${
            stats.size
          } bytes`,
        );
      } else continue;
    }
  } catch (error) {
    console.error(error.message);
  }
}

readSecretFolder();
