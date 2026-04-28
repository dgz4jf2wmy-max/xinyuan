const fs = require('fs');

let content = fs.readFileSync('src/pages/plan/execution/analysis/index.tsx', 'utf8');

// Replace shadow classes
content = content.replace(/\b(shadow-xl|drop-shadow-sm|shadow-sm|shadow-inner|shadow|transition-shadow)\b/g, '');
// Clean up double spaces created by the removal
content = content.replace(/\s{2,}/g, ' '); // Be careful with this, string literals?
// Instead, just replace the exact substrings or just replace class space
content = fs.readFileSync('src/pages/plan/execution/analysis/index.tsx', 'utf8');
const classRegex = /\b(shadow-xl|drop-shadow-sm|shadow-sm|shadow-inner|shadow|transition-shadow)\b\s*/g;
content = content.replace(classRegex, '');

fs.writeFileSync('src/pages/plan/execution/analysis/index.tsx', content);
console.log("Shadows removed!");
