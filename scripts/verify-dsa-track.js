const fs = require('fs');
const path = require('path');

const dsaContent = fs.readFileSync(path.join(__dirname, '..', 'tracks', '07-data-structures-algorithms.md'), 'utf8');
const questions = dsaContent.split(/^### \d+\. /m).slice(1);

console.log(`Total DSA Questions: ${questions.length}`);
let multiLangCount = 0;
questions.forEach((q, idx) => {
  const hasPy = /####\s+Python/i.test(q);
  const hasJava = /####\s+Java/i.test(q);
  const hasCpp = /####\s+C\+\+/i.test(q);
  const hasTs = /####\s+TypeScript/i.test(q);
  if (hasPy && hasJava && hasCpp && hasTs) {
    multiLangCount++;
  } else {
    console.log(`Q${idx + 1} missing: ${!hasPy ? 'Py ' : ''}${!hasJava ? 'Java ' : ''}${!hasCpp ? 'Cpp ' : ''}${!hasTs ? 'Ts' : ''}`);
  }
});

console.log(`Questions with all 4 languages (Python, Java, C++, TypeScript): ${multiLangCount} / ${questions.length}`);

