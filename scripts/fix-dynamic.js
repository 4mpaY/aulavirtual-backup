const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'route.ts') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if it exports GET
      if (content.includes('export async function GET(') || content.includes('export function GET(')) {
        // Check if it already has export const dynamic
        if (!content.includes('export const dynamic')) {
          content = `export const dynamic = 'force-dynamic'\n\n` + content;
          fs.writeFileSync(fullPath, content);
          console.log(`Added force-dynamic to ${fullPath}`);
        }
      }
    }
  }
}

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
processDirectory(apiDir);
console.log('Complete');
