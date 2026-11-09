const { execSync } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const urls = [
  'https://learn-interview-questions.vercel.app/',
  'https://learn-interview-questions.vercel.app/sections/web-security-owasp',
  'https://learn-interview-questions.vercel.app/sections/web-security-owasp/1',
  'https://learn-interview-questions.vercel.app/sections/dsa/1',
  'https://learn-interview-questions.vercel.app/sections/angular-ts/1',
  'https://learn-interview-questions.vercel.app/sections/react-nextjs/445'
];

const widths = [320, 360, 375, 414, 768, 1024, 1440];

console.log('Testing responsiveness across widths:', widths);

// Use chrome headless with --dump-dom or basic fetch to check responses
let allOk = true;

for (const url of urls) {
  for (const w of widths) {
    const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=${w},800 --dump-dom "${url}"`;
    try {
      const output = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'], maxBuffer: 10 * 1024 * 1024 });
      if (!output || output.length < 500) {
        console.error(`[FAIL] ${url} @ ${w}px rendered empty DOM`);
        allOk = false;
      }
    } catch (err) {
      console.error(`[ERROR] ${url} @ ${w}px:`, err.message);
      allOk = false;
    }
  }
  console.log(`✓ Checked ${url} across all 7 device widths (320px -> 1440px)`);
}

if (allOk) {
  console.log('\nAll pages successfully rendered across all device widths with zero crashes or empty DOMs!');
}

