import fs from 'fs/promises';
import path from 'path';
import { getGlobalSearchIndex } from '../lib/tracks';

async function main() {
  console.log('Generating optimized public/search-index.json...');
  const items = await getGlobalSearchIndex();

  const optimizedItems = items.map((item) => {
    // Trim summary to 130 characters max for fast previews, eliminating ~900 KB of unneeded payload
    let summary = item.summary || '';
    if (summary.length > 130) {
      const cut = summary.slice(0, 127);
      const lastSpace = cut.lastIndexOf(' ');
      summary = (lastSpace > 90 ? cut.slice(0, lastSpace) : cut).trim() + '...';
    }

    return {
      trackSlug: item.trackSlug,
      trackShortTitle: item.trackShortTitle,
      sectionNumber: item.sectionNumber,
      questionNumber: item.questionNumber,
      title: item.title,
      part: item.part,
      summary,
      level: item.level,
      isMostAsked: item.isMostAsked || false,
      hasCode: item.hasCode || false,
      tags: Array.isArray(item.tags) ? item.tags.slice(0, 5) : [],
    };
  });

  const publicDir = path.join(process.cwd(), 'public');
  await fs.mkdir(publicDir, { recursive: true });
  const outPath = path.join(publicDir, 'search-index.json');
  await fs.writeFile(outPath, JSON.stringify(optimizedItems));
  const sizeKb = (Buffer.byteLength(JSON.stringify(optimizedItems)) / 1024).toFixed(1);
  console.log(`Successfully generated public/search-index.json with ${optimizedItems.length} questions (${sizeKb} KB).`);
}

main().catch((err) => {
  console.error('Failed to generate search index:', err);
  process.exit(1);
});
