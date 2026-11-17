import { STUDY_PLANS } from './study-plans';

export type QuestionLevel = 'junior' | 'mid' | 'senior';

export interface QuestionClassification {
  level: QuestionLevel;
  isMostAsked: boolean;
  hasCode: boolean;
  hasDiagram: boolean;
  tags: string[];
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

// Rich curated list of engineering topics and matchers for tagging
const COMMON_TOPICS: { tag: string; matchers: string[] }[] = [
  { tag: 'Directives', matchers: ['directive', 'directives'] },
  { tag: 'CLI', matchers: ['cli', 'command line', 'ng generate', 'npm', 'npx'] },
  { tag: 'Signals', matchers: ['signal', 'signals', 'computed(', 'effect('] },
  { tag: 'RxJS', matchers: ['rxjs', 'observable', 'pipeable', 'subject', 'switchmap', 'mergemap', 'exhaustmap'] },
  { tag: 'Dependency Injection', matchers: ['dependency injection', 'injectable', 'injector', 'injection token'] },
  { tag: 'Components', matchers: ['component', 'components', 'template', 'data binding', 'props'] },
  { tag: 'Hooks', matchers: ['hooks', 'useeffect', 'usestate', 'usememo', 'usecallback', 'custom hook', 'usecontext'] },
  { tag: 'State Management', matchers: ['state management', 'redux', 'ngrx', 'pinia', 'zustand', 'actions', 'reducers', 'selectors'] },
  { tag: 'Routing', matchers: ['routing', 'router', 'navigation', 'route guard', 'lazy loading'] },
  { tag: 'Forms', matchers: ['form', 'forms', 'reactive forms', 'formarray', 'formgroup', 'validation'] },
  { tag: 'Lifecycle', matchers: ['lifecycle', 'ngoninit', 'componentdidmount', 'componentwillunmount', 'ondestroy'] },
  { tag: 'Performance', matchers: ['performance', 'optimization', 'onpush', 'memoization', 'profiling', 'tree shaking'] },
  { tag: 'Change Detection', matchers: ['change detection', 'zone.js', 'zoneless'] },
  { tag: 'Pipes', matchers: ['pipe', 'pipes', 'pure pipe', 'impure pipe'] },
  { tag: 'SSR & Hydration', matchers: ['ssr', 'server-side rendering', 'hydration', 'prerender', 'universal'] },
  { tag: 'Testing', matchers: ['testing', 'unit test', 'karma', 'jasmine', 'jest', 'cypress', 'playwright', 'testbed', 'harness'] },
  { tag: 'Async & Promises', matchers: ['async', 'promise', 'promises', 'await'] },
  { tag: 'Event Loop', matchers: ['event loop', 'microtask', 'macrotask', 'call stack', 'libuv'] },
  { tag: 'Closures & Scope', matchers: ['closure', 'closures', 'lexical scope', 'hoisting', 'scope chain'] },
  { tag: 'Prototypes', matchers: ['prototype', 'prototypal', '__proto__', 'prototype inheritance'] },
  { tag: 'Memory Management', matchers: ['memory leak', 'garbage collect', 'heap', 'stack', 'v8 engine'] },
  { tag: 'TypeScript', matchers: ['typescript', 'generic', 'interface', 'type guard', 'decorator', 'enum'] },
  { tag: 'Security & Auth', matchers: ['security', 'xss', 'csrf', 'jwt', 'cors', 'auth', 'oauth', 'token', 'encryption'] },
  { tag: 'Docker & Containers', matchers: ['docker', 'container', 'dockerfile', 'compose', 'image'] },
  { tag: 'Kubernetes', matchers: ['kubernetes', 'k8s', 'pod', 'deployment', 'ingress', 'service mesh', 'helm'] },
  { tag: 'CI/CD & DevOps', matchers: ['ci/cd', 'pipeline', 'github actions', 'jenkins', 'devops', 'terraform'] },
  { tag: 'System Design', matchers: ['system design', 'architecture', 'distributed', 'high availability', 'load balancer', 'cache', 'caching', 'sharding', 'scalability'] },
  { tag: 'Databases & SQL', matchers: ['sql', 'database', 'postgres', 'mysql', 'nosql', 'mongodb', 'acid', 'indexing', 'b-tree', 'transaction'] },
  { tag: 'Microservices', matchers: ['microservice', 'microservices', 'service mesh', 'grpc', 'api gateway', 'message queue', 'kafka', 'rabbitmq'] },
  { tag: 'Algorithms', matchers: ['binary search', 'dynamic programming', 'two pointer', 'bfs', 'dfs', 'sorting', 'recursion'] },
  { tag: 'Data Structures', matchers: ['tree', 'graph', 'linked list', 'array', 'hash map', 'stack', 'queue', 'trie', 'heap'] },
  { tag: 'Behavioral', matchers: ['behavioral', 'star method', 'leadership', 'conflict', 'culture', 'teamwork'] },
  { tag: 'HTTP & REST APIs', matchers: ['http', 'rest', 'api', 'graphql', 'status code', 'fetch', 'axios', 'endpoint'] },
];

/**
 * Extracts 1-3 high-relevance topic tags from question title, part, and track metadata.
 */
export function extractQuestionTags(params: {
  title: string;
  part: string;
  trackTitle?: string;
  maxTags?: number;
}): string[] {
  const { title, part, trackTitle, maxTags = 3 } = params;
  const text = `${title} ${part}`.toLowerCase();
  const matched = new Set<string>();

  for (const item of COMMON_TOPICS) {
    if (item.matchers.some((m) => text.includes(m))) {
      matched.add(item.tag);
      if (matched.size >= maxTags) break;
    }
  }

  // If no tag matched, extract a clean topic from trackTitle or part
  if (matched.size === 0) {
    if (trackTitle) {
      const cleanTrack = trackTitle.split('&')[0].trim();
      if (cleanTrack) matched.add(cleanTrack);
    }
    const cleanPart = part
      .replace(/^Part\s+\d+:\s*/i, '')
      .replace(/\s*\(\d+\s*-\s*\d+\)$/, '')
      .split(/[,&]/)[0]
      ?.trim();
    if (cleanPart && cleanPart.length > 2 && cleanPart.length < 25) {
      matched.add(cleanPart);
    }
  }

  return Array.from(matched).slice(0, maxTags);
}

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

  // 4. Extract Topic Tags
  const tags = extractQuestionTags({
    title,
    part,
    trackTitle: trackSlug,
    maxTags: 3,
  });

  return {
    level,
    isMostAsked,
    hasCode,
    hasDiagram,
    tags,
  };
}
