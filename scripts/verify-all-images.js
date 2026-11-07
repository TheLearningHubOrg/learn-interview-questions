const fs = require('fs');
const path = require('path');

const tracksDir = path.join(__dirname, '..', 'tracks');
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const trackFiles = fs.readdirSync(tracksDir).filter(f => f.endsWith('.md'));

let totalRefs = 0;
let missingFiles = 0;

trackFiles.forEach(file => {
  const content = fs.readFileSync(path.join(tracksDir, file), 'utf8');
  const imgRegex = /!\[.*?\]\((.*?)\)/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    totalRefs++;
    let imgPath = match[1];
    // Strip leading /
    imgPath = imgPath.replace(/^\//, '');
    const diskPath = path.join(__dirname, '..', 'public', imgPath.replace(/^images\//, 'images/'));
    
    // Also try decoding
    const decodedDiskPath = path.join(__dirname, '..', 'public', decodeURIComponent(imgPath).replace(/^images\//, 'images/'));

    if (!fs.existsSync(diskPath) && !fs.existsSync(decodedDiskPath)) {
      missingFiles++;
      console.error(`Missing image in ${file}: ${imgPath} -> ${diskPath}`);
    }
  }
});

console.log(`\nImage check completed: ${totalRefs} image references checked, ${missingFiles} missing files.`);

