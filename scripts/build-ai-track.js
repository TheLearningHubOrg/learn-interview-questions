const fs = require('fs');
const path = require('path');

const part1 = require('./ai-track-part1');
const part2 = require('./ai-track-part2');
const part3 = require('./ai-track-part3');
const part4 = require('./ai-track-part4');
const part5 = require('./ai-track-part5');

const allQuestions = [...part1, ...part2, ...part3, ...part4, ...part5];

console.log(`Total questions loaded: ${allQuestions.length}`);

if (allQuestions.length !== 50) {
  console.error(`ERROR: Expected 50 questions, got ${allQuestions.length}`);
  process.exit(1);
}

// Verify sequential numbering 1 to 50
for (let i = 0; i < 50; i++) {
  const expectedNum = i + 1;
  const q = allQuestions[i];
  if (q.number !== expectedNum) {
    console.error(`ERROR: Gap or misorder at index ${i}. Expected Q${expectedNum}, got Q${q.number}`);
    process.exit(1);
  }
}

console.log('✓ Sequence check passed: Q1 to Q50 verified without gaps.');

// Build markdown file
let markdown = `# Section 13: AI Engineering, LLM Architecture & Agentic Systems Master (50 Qs)\n\n`;
markdown += `The definitive 50 AI engineering interview questions and deep-dive architectural answers covering RAG pipelines, Vector Search (HNSW/IVF-PQ), LLM Inference optimization (KV Cache, vLLM PagedAttention, FlashAttention, Speculative Decoding), Autonomous Agents (ReAct, LangGraph, Model Context Protocol MCP), LLM Security & Safety (OWASP Top 10 for LLMs, Prompt Injection), and Model Fine-Tuning (LoRA, QLoRA, DPO).\n\n`;

let currentPart = '';

for (const q of allQuestions) {
  if (q.part !== currentPart) {
    currentPart = q.part;
    markdown += `\n---\n\n## ${currentPart}\n\n`;
  }
  markdown += `### ${q.number}. ${q.title}\n\n`;
  markdown += `${q.content.trim()}\n\n`;
}

const outputPath = path.join(__dirname, '..', 'tracks', '13-ai-engineering-llm.md');
fs.writeFileSync(outputPath, markdown, 'utf8');

const stats = fs.statSync(outputPath);
console.log(`✓ Successfully written to ${outputPath}`);
console.log(`✓ File size: ${stats.size} bytes (${(stats.size / 1024).toFixed(2)} KB)`);

