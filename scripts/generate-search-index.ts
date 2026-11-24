import fs from 'fs/promises';
import path from 'path';
import { getGlobalSearchIndex } from '../lib/tracks';

async function main() {
  console.log('Generating public/search-index.json...');
  const items = await getGlobalSearchIndex();
  const publicDir = path.join(process.cwd(), 'public');
  await fs.mkdir(publicDir, { recursive: true });
  const outPath = path.join(publicDir, 'search-index.json');
  await fs.writeFile(outPath, JSON.stringify(items));
  const sizeKb = (Buffer.byteLength(JSON.stringify(items)) / 1024).toFixed(1);
  console.log(`Successfully generated public/search-index.json with ${items.length} questions (${sizeKb} KB).`);
}

main().catch((err) => {
  console.error('Failed to generate search index:', err);
  process.exit(1);
});
