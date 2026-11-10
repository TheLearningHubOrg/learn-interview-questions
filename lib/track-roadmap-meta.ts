export interface RoadmapStageMeta {
  shortTitle: string;
  subtitle: string;
  iconName?: string;
}

export const TRACK_ROADMAP_META: Record<string, Record<number, RoadmapStageMeta>> = {
  // Track 10: Large-Scale System Design & Distributed Architecture
  'system-design': {
    1: {
      shortTitle: 'Foundations & CAP',
      subtitle: 'Latency vs Throughput, CAP & PACELC, Partitioning',
    },
    2: {
      shortTitle: 'High-Scale Architectures',
      subtitle: 'Redis Cache, Rate Limiters, Snowflake IDs, Shorteners',
    },
    3: {
      shortTitle: 'Transactions & Consensus',
      subtitle: '2PC, Saga Pattern, Raft & Paxos, Eventual Consistency',
    },
    4: {
      shortTitle: 'API, Edge & Networking',
      subtitle: 'Envoy, NGINX, L7 Load Balancer, WebSockets, gRPC',
    },
    5: {
      shortTitle: 'Capacity Estimation',
      subtitle: 'Back-of-Envelope Math, QPS, IOPS & Storage Sizing',
    },
  },

  // Track 13: AI Engineering, LLM Architecture & Agentic Systems
  'ai-engineering-llm': {
    1: {
      shortTitle: 'RAG & Vector Search',
      subtitle: 'Chunking, HNSW Indexing, Hybrid Search, RRF',
    },
    2: {
      shortTitle: 'Inference & KV Cache',
      subtitle: 'vLLM PagedAttention, FlashAttention, Memory Math',
    },
    3: {
      shortTitle: 'Agents & MCP Protocols',
      subtitle: 'Tool Calling, ReAct Loop, Anthropic MCP, LangGraph',
    },
    4: {
      shortTitle: 'LLM Security & Defense',
      subtitle: 'Prompt Injection, Jailbreaks, Guardrails, Poisoning',
    },
    5: {
      shortTitle: 'Fine-Tuning & Alignment',
      subtitle: 'LoRA, QLoRA, DPO Alignment, Evaluation Metrics',
    },
  },

  // Track 07: Data Structures & Algorithms Patterns
  'dsa': {
    1: { shortTitle: 'Complexity & Big-O', subtitle: 'Asymptotic Analysis & Memory Constraints' },
    2: { shortTitle: 'Arrays & Hash Maps', subtitle: 'Prefix Sums, Frequency Maps, Invariants' },
    3: { shortTitle: 'Pointers & Window', subtitle: 'Two Pointers, Sliding Window Subarrays' },
    4: { shortTitle: 'Stacks & Queues', subtitle: 'Monotonic Stacks, Deques, Histograms' },
    5: { shortTitle: 'Linked Lists & Cycles', subtitle: 'Fast/Slow Pointers, Reversal, Merging' },
    6: { shortTitle: 'Binary Search Space', subtitle: 'Left/Right Bounds, Search on Answer' },
    7: { shortTitle: 'Trees & BSTs', subtitle: 'BFS/DFS Traversals, LCA, Tree Validation' },
    8: { shortTitle: 'Heaps & Tries', subtitle: 'Top-K Elements, Prefix Trees, Priority Queues' },
    9: { shortTitle: 'Backtracking', subtitle: 'Subsets, Permutations, Branch Pruning' },
    10: { shortTitle: 'Graphs & Topo Sort', subtitle: 'BFS, DFS, Dijkstra, Kahn’s Algorithm, DSU' },
    11: { shortTitle: 'Dynamic Programming', subtitle: '1D/2D Memoization, Knapsack, Intervals' },
  },

  // Track 12: Web Security, Application Defense & OWASP Top 10
  'web-security-owasp': {
    1: { shortTitle: 'Threat Modeling', subtitle: 'STRIDE, Defense in Depth, Least Privilege' },
    2: { shortTitle: 'OWASP Top 10 Deep-Dive', subtitle: 'SQLi, XSS, SSRF, BOLA, Broken Access' },
    3: { shortTitle: 'Auth & Cryptography', subtitle: 'OAuth 2.0 PKCE, JWT Hardening, Passkeys' },
    4: { shortTitle: 'Browser Hardening', subtitle: 'CSP Nonces, CORS Preflights, HSTS, Cookies' },
    5: { shortTitle: 'DevSecOps & Incidents', subtitle: 'Secrets Scanning, SAST/DAST, Zero-Trust' },
  },

  // Track 01: Angular Architecture & Signals
  'angular-ts': {
    1: { shortTitle: 'Core Components', subtitle: 'Templates, Data Binding, Component Lifecycle' },
    2: { shortTitle: 'Signals & State', subtitle: 'Signal Graph, Writable/Computed, Effects' },
    3: { shortTitle: 'Control Flow & Directives', subtitle: '@if, @for, Structural vs Attribute Directives' },
    4: { shortTitle: 'Dependency Injection', subtitle: 'Hierarchical Injectors, provideIn, InjectionToken' },
    5: { shortTitle: 'RxJS & Reactive Streams', subtitle: 'Observables, Pipeable Operators, Subjects' },
    6: { shortTitle: 'NgRx State Management', subtitle: 'Actions, Reducers, Selectors, Effects' },
    7: { shortTitle: 'Routing & Navigation', subtitle: 'Lazy Loading, Resolvers, Route Guards' },
    8: { shortTitle: 'Forms & Validation', subtitle: 'Reactive Forms, Async Validators, FormArray' },
    9: { shortTitle: 'Performance & SSR', subtitle: 'OnPush, Zoneless, Hydration, Defer Blocks' },
    10: { shortTitle: 'Enterprise Testing', subtitle: 'Jasmine, Karma, Testbed, Component Harnesses' },
  },

  // Track 02: React Architecture & Modern Internals
  'react-nextjs': {
    1: { shortTitle: 'Core React & JSX', subtitle: 'Virtual DOM, Elements vs Components, Reconciliation' },
    2: { shortTitle: 'Hooks & Modern State', subtitle: 'useState, useEffect, useMemo, useCallback' },
    3: { shortTitle: 'Fiber & Concurrent Mode', subtitle: 'Lanes, Time Slicing, Transitions, Suspense' },
    4: { shortTitle: 'Context & State Trees', subtitle: 'Prop Drilling, Context API, Redux Toolkit' },
    5: { shortTitle: 'Component Patterns', subtitle: 'Render Props, Compound Components, HOCs' },
    6: { shortTitle: 'Forms & User Input', subtitle: 'Controlled vs Uncontrolled, React Hook Form' },
    7: { shortTitle: 'Performance Profiling', subtitle: 'React.memo, Re-render Optimization, Profiler' },
    8: { shortTitle: 'Next.js App Router', subtitle: 'Server Components, Streaming, Route Handlers' },
    9: { shortTitle: 'React 19 Actions', subtitle: 'useActionState, useOptimistic, Server Actions' },
    10: { shortTitle: 'Security & Sanitization', subtitle: 'XSS Prevention, dangerouslySetInnerHTML' },
    11: { shortTitle: 'Testing & Architecture', subtitle: 'React Testing Library, Mocking, Vitest' },
  },
};
