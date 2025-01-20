const fs = require('fs').promises;
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const projectDistPath = path.join(__dirname, 'project-dist');
const assetsOrigPath = path.join(__dirname, 'assets');
const stylesPath = path.join(__dirname, 'styles');

async function projectDistExists(path) {
  try {
    await fs.stat(path);
    await fs.rm(path, { recursive: true, force: true });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
}

async function indexFromComponents() {
  try {
    await projectDistExists(projectDistPath);
    await fs.mkdir(projectDistPath, { recursive: true });

    const regex = /{{(.*?)}}/g;
    let text = await fs.readFile(templatePath, 'utf-8');

    const componentsFiles = await fs.readdir(componentsPath);

    for (const match of text.match(regex)) {
      const componentName = match.slice(2, -2).trim();
      const componentFile = componentsFiles.find(
        (file) => path.basename(file, path.extname(file)) === componentName,
      );

      if (componentFile) {
        const componentContent = await fs.readFile(
          path.join(componentsPath, componentFile),
          'utf-8',
        );
        text = text.replace(match, componentContent);
      }
    }

    await fs.writeFile(path.join(projectDistPath, 'index.html'), text, 'utf-8');
  } catch (err) {
    console.error(err.message);
  }
}

async function copyStyles() {
  try {
    const distStylesPath = path.join(projectDistPath, 'style.css');
    await projectDistExists(distStylesPath);
    const styleFiles = await fs.readdir(stylesPath);
    const styles = [];

    for (const file of styleFiles) {
      const filePath = path.join(stylesPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile() && path.extname(file) === '.css') {
        const styleContent = await fs.readFile(filePath, 'utf-8');
        styles.push(styleContent);
      }
    }

    await fs.writeFile(
      path.join(projectDistPath, 'style.css'),
      styles.join('\n'),
      'utf-8',
    );
  } catch (err) {
    console.error(err.message);
  }
}

async function copyAssets() {
  try {
    const assetsPath = path.join(projectDistPath, 'assets');
    await projectDistExists(assetsPath);
    await fs.mkdir(assetsPath, { recursive: true });

    const assetsFiles = await fs.readdir(assetsOrigPath, {
      withFileTypes: true,
    });

    for (const file of assetsFiles) {
      const newPath = path.join(assetsPath, file.name);
      const origPath = path.join(assetsOrigPath, file.name);
      const stats = await fs.stat(origPath);

      if (stats.isDirectory()) {
        await fs.mkdir(newPath, { recursive: true });
        await assetsDir(origPath, newPath);
      } else if (stats.isFile()) {
        await fs.copyFile(origPath, newPath);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function assetsDir(orig, newAccets) {
  const recursiveAssetsFiles = await fs.readdir(orig, { withFileTypes: true });
  for (const file of recursiveAssetsFiles) {
    const origPath = path.join(orig, file.name);
    const newPath = path.join(newAccets, file.name);
    const stats = await fs.stat(origPath);

    if (stats.isDirectory()) {
      await fs.mkdir(newPath, { recursive: true });
      await assetsDir(origPath, newPath);
    } else {
      await fs.copyFile(origPath, newPath);
    }
  }
}

async function build() {
  await indexFromComponents();
  await copyStyles();
  await copyAssets();
}

build();
