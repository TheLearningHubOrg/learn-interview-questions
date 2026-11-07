const fs = require('fs');
const path = require('path');

const dsaContent = fs.readFileSync(path.join(__dirname, '..', 'tracks', '07-data-structures-algorithms.md'), 'utf8');
const questions = dsaContent.split(/^### \d+\. /m).slice(1);

console.log(`Total DSA Questions: ${questions.length}`);
let multiLangCount = 0;
questions.forEach((q, idx) => {
  const hasPy = /####\s+Python/i.test(q);
  const hasJs = /####\s+JavaScript/i.test(q);
  const hasTs = /####\s+TypeScript/i.test(q);
  const hasJava = /####\s+Java\b/i.test(q);
  const hasCpp = /####\s+C\+\+/i.test(q);
  if (hasPy && hasJs && hasTs && hasJava && hasCpp) {
    multiLangCount++;
  } else {
    console.log(`Q${idx + 1} missing: ${!hasPy ? 'Py ' : ''}${!hasJs ? 'Js ' : ''}${!hasTs ? 'Ts ' : ''}${!hasJava ? 'Java ' : ''}${!hasCpp ? 'Cpp' : ''}`);
  }
});

console.log(`Questions with all 5 languages (Python 3, JavaScript, TypeScript, Java, C++): ${multiLangCount} / ${questions.length}`);

