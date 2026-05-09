import fs from 'fs';
import path from 'path';

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', 'dist', '.git'].includes(file)) {
        search(fullPath);
      }
    } else if (fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('value={') && !lines[i].includes('??') && !lines[i].includes('||')) {
          console.log(`${fullPath}:${i + 1}: ${lines[i].trim()}`);
        }
      }
    }
  }
}

search('src');
