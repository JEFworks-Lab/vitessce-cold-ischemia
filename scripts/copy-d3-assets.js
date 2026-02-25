const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const sources = [
  {
    from: path.join(projectRoot, 'src', 'd3_app.js'),
    to: path.join(publicDir, 'd3_app.js'),
  },
  {
    from: path.join(projectRoot, 'src', 'styles.css'),
    to: path.join(publicDir, 'd3_styles.css'),
  },
  {
    from: path.join(projectRoot, 'src', 'd3_app.html'),
    to: path.join(publicDir, 'd3_app.html'),
  },
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFile(source, destination) {
  if (!fs.existsSync(source)) {
    console.warn(`[copy-d3-assets] Missing file: ${source}`);
    return;
  }
  ensureDir(path.dirname(destination));
  fs.copyFileSync(source, destination);
  console.log(`[copy-d3-assets] Copied ${source} -> ${destination}`);
}

ensureDir(publicDir);
sources.forEach(({ from, to }) => copyFile(from, to));
