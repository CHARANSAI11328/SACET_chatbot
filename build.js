const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

// Remove existing dist if any
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((child) => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy static assets to dist
copyRecursiveSync(path.join(srcDir, 'index.html'), path.join(distDir, 'index.html'));
copyRecursiveSync(path.join(srcDir, 'css'), path.join(distDir, 'css'));
copyRecursiveSync(path.join(srcDir, 'js'), path.join(distDir, 'js'));
copyRecursiveSync(path.join(srcDir, 'data'), path.join(distDir, 'data'));

console.log('✅ SACET Static Build Complete: dist/ folder created with index.html, css/, js/, and data/.');
