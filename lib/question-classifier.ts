import { STUDY_PLANS } from './study-plans';

export type QuestionLevel = 'junior' | 'mid' | 'senior';

export interface QuestionClassification {
  level: QuestionLevel;
  isMostAsked: boolean;
  hasCode: boolean;
  hasDiagram: boolean;
}

// Build a fast lookup set of all sprint question IDs ("trackSlug:questionNumber")
const sprintQuestionKeySet = new Set<string>();
for (const plan of STUDY_PLANS) {
  for (const day of plan.days) {
    for (const q of day.questions) {
      sprintQuestionKeySet.add(`${q.trackSlug}:${q.questionNumber}`);
    }
  }
}

// Senior / Staff technical indicators
const SENIOR_KEYWORDS = [
  'internal', 'under the hood', 'architecture', 'distributed', 'consensus',
  'raft', 'paxos', 'trade-off', 'tradeoff', 'scale', 'scaling', 'sharding',
  'replication', 'concurrency', 'race condition', 'deadlock', 'memory leak',
  'garbage collect', 'fiber', 'v8', 'libuv', 'reconciliation', 'kv cache',
  'pagedattention', 'quantization', 'lora', 'zero-trust', 'pkce', 'oauth2',
  'b-tree', 'mvcc', 'isolation level', 'acid', 'wal', 'write-ahead',
  'cap theorem', 'pacelc', 'consistent hashing', 'backpressure', 'circuit breaker',
  'high availability', 'failover', 'disaster recovery', 'post-mortem',
  'postmortem', 'split-brain', '2pc', 'two-phase commit', 'onpush',
  'zone.js', 'micro-frontend', 'microfrontend', 'monorepo', 'staff', 'principal',
  'ast', 'compiler', 'speculative', 'dpo', 'rlhf', 'threat model', 'side-channel'
];

// Junior / Foundational technical indicators
const JUNIOR_KEYWORDS = [
  'what is', 'what are', 'difference between', 'syntax', 'how do you create',
  'how do you define', 'basic', 'introduction', 'primitive', 'types of',
  'let vs var', 'props vs state', 'html5', 'css', 'crud', 'data binding',
  'string method', 'array method', 'interpolation', 'template statement',
  'purpose of', 'definition', 'overview', 'hello world', 'cli command',
  'getter', 'setter', 'naming convention'
];

// Interview staple patterns that are universally "Most Asked"
const HIGH_YIELD_PATTERNS = [
  'closure', 'event loop', 'prototype', 'hoisting', 'this keyword',
  'promise', 'async/await', 'debounce', 'throttle', 'virtual dom',
  'fiber', 'useeffect', 'custom hook', 'state management', 'redux',
  'signals', 'change detection', 'dependency injection', 'rxjs',
  'tinyurl', 'rate limit', 'load balancer', 'consistent hashing',
  'cache', 'caching', 'acid', 'index', 'b-tree', 'nosql',
  'docker', 'kubernetes', 'pod', 'ci/cd', 'xss', 'csrf', 'jwt',
  'cors', 'rag', 'vector', 'two sum', 'lru cache', 'star method',
  'binary search', 'linked list', 'valid parentheses'
];

/**
 * Classifies a question deterministically based on title, content, part name, and study plan metadata.
 */
export function classifyQuestion(params: {
  trackSlug?: string;
  questionNumber: number;
  title: string;
  part: string;
  content?: string;
}): QuestionClassification {
  const { trackSlug, questionNumber, title, part, content = '' } = params;

  // 1. Detect Code & Diagrams
  const hasCode = content.includes('```');
  const hasDiagram = content.includes('```mermaid') || content.includes('flowchart') || content.includes('sequenceDiagram');

  // 2. Check Most Asked / High Yield
  const key = trackSlug ? `${trackSlug}:${questionNumber}` : '';
  const inSprint = sprintQuestionKeySet.has(key);

  const lowerTitle = title.toLowerCase();
  const lowerPart = part.toLowerCase();
  const lowerContent = content.slice(0, 500).toLowerCase();

  const matchesHighYield = HIGH_YIELD_PATTERNS.some(
    (pattern) => lowerTitle.includes(pattern) || lowerPart.includes(pattern)
  );

  const isMostAsked = inSprint || matchesHighYield;

  // 3. Determine Seniority Level
  let level: QuestionLevel = 'mid';

  // Check Senior triggers
  const isSenior = 
    SENIOR_KEYWORDS.some((kw) => lowerTitle.includes(kw) || lowerPart.includes(kw)) ||
    lowerPart.includes('internals') ||
    lowerPart.includes('distributed') ||
    lowerPart.includes('architecture');

  // Check Junior triggers
  const isJunior = 
    !isSenior &&
    (JUNIOR_KEYWORDS.some((kw) => lowerTitle.includes(kw)) ||
     (questionNumber <= 15 && (lowerPart.includes('core') || lowerPart.includes('intro') || lowerPart.includes('basic'))));

  if (isSenior) {
    level = 'senior';
  } else if (isJunior) {
    level = 'junior';
  } else {
    level = 'mid';
  }

  return {
    level,
    isMostAsked,
    hasCode,
    hasDiagram,
  };
}
