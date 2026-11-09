const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.join('C:\\Users\\manth\\.gemini\\antigravity\\brain\\ee4d023d-f241-4fff-86a5-a3d58a5bd89a\\scratch\\screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: 'home_mobile_375', url: 'https://learn-interview-questions.vercel.app/', w: 375, h: 812 },
  { name: 'home_tablet_768', url: 'https://learn-interview-questions.vercel.app/', w: 768, h: 1024 },
  { name: 'home_desktop_1440', url: 'https://learn-interview-questions.vercel.app/', w: 1440, h: 900 },
  { name: 'section_mobile_375', url: 'https://learn-interview-questions.vercel.app/sections/web-security-owasp', w: 375, h: 812 },
  { name: 'section_desktop_1440', url: 'https://learn-interview-questions.vercel.app/sections/web-security-owasp', w: 1440, h: 900 },
  { name: 'question_mobile_375', url: 'https://learn-interview-questions.vercel.app/sections/web-security-owasp/1', w: 375, h: 812 },
  { name: 'question_desktop_1440', url: 'https://learn-interview-questions.vercel.app/sections/web-security-owasp/1', w: 1440, h: 900 },
  { name: 'dsa_mobile_375', url: 'https://learn-interview-questions.vercel.app/sections/dsa/1', w: 375, h: 812 }
];

console.log('Capturing responsive screenshots via Chrome headless...');
for (const vp of viewports) {
  const dest = path.join(outDir, `${vp.name}.png`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=${vp.w},${vp.h} --screenshot="${dest}" ${vp.url}`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    const stat = fs.statSync(dest);
    console.log(`✓ ${vp.name} (${vp.w}x${vp.h}): ${stat.size} bytes`);
  } catch (err) {
    console.error(`✗ ${vp.name} failed:`, err.message);
  }
}

