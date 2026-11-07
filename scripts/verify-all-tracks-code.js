const fs = require('fs');
const path = require('path');

const tracksDir = path.join(__dirname, '..', 'tracks');
const files = fs.readdirSync(tracksDir).filter(f => f.endsWith('.md')).sort();

let totalQuestions = 0;
let totalMissing = 0;

files.forEach(file => {
  const content = fs.readFileSync(path.join(tracksDir, file), 'utf8');
  const questions = content.split(/^### \d+\. /m).slice(1);
  let missingCode = 0;
  questions.forEach((q, idx) => {
    if (!q.includes('```')) {
      missingCode++;
      console.log(`  ${file} missing code in Q${idx + 1}`);
    }
  });
  totalQuestions += questions.length;
  totalMissing += missingCode;
  console.log(`${file}: ${questions.length} questions, ${missingCode} missing code (${((questions.length - missingCode)/questions.length*100).toFixed(1)}% coverage)`);
});

console.log(`\nOverall: ${totalQuestions} questions across ${files.length} tracks, ${totalMissing} missing code.`);

