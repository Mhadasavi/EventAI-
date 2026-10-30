import fs from 'fs';
import path from 'path';

function scan(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      if (entry !== 'node_modules' && entry !== '.git' && entry !== 'dist') {
        scan(full);
      }
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n').length;
      const useStateMatches = content.match(/useState\s*(<|\()/g) || [];
      const useStateCount = useStateMatches.length;
      if (lines > 250 || useStateCount > 4) {
        console.log(`${full} -> lines: ${lines}, useState: ${useStateCount}`);
      }
    }
  }
}

console.log('=== Scan: lines > 250 or useState > 4 ===');
scan('src');
scan('controllers');
scan('routes');
scan('services');
console.log('=== Scan Finished ===');
