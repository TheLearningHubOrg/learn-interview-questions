# The Master Full-Stack, Cloud, React, Angular & Core JavaScript Interview Question Bank 🚀

> **1,600+ Production-Tested Master Interview Questions and Deep-Dive Answers** across Angular 2-19, Core React, React 18/19, Core JavaScript Internals, Frontend, Backend, Databases, Cloud Architecture, and Algorithms.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![The Learning Hub](https://img.shields.io/badge/Org-TheLearningHubOrg-orange.svg)](https://github.com/TheLearningHubOrg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/TheLearningHubOrg/learn-interview-questions/pulls)
[![Curriculum: 8 Tracks](https://img.shields.io/badge/Tracks-8%20Specialized%20Tracks-purple.svg)](#-curriculum-overview--tracks)
[![Questions: 1600+](https://img.shields.io/badge/Questions-1600%2B%20Master%20Bank-success.svg)](#-curriculum-overview--tracks)

---

## 🧭 Master Navigation & Tracks

| Track | Focus Tech Stack | Questions | Link |
| :--- | :--- | :---: | :--- |
| **Track 1: Complete Angular Master** | Enterprise Bank: 283 Qs: Angular 2-19, Signals, Control Flow, Directives, DI, RxJS, NgRx | **283** | [Open Track 1](tracks/01-frontend-angular-ts.md) |
| **Track 2: Complete React Master** | Full Stack Bank: 445 Qs: React 18/19, JSX, Fiber, Hooks, Redux, Router v6, SSR, Legacy Internals | **445** | [Open Track 2](tracks/02-frontend-react-nextjs.md) |
| **Track 3: Databases & System Design** | PostgreSQL, MySQL, ACID, Indexing, MongoDB, DynamoDB, Redis, Scalability | **60** | [Open Track 3](tracks/03-backend-databases-system-design.md) |
| **Track 4: Backend Python** | Python 3.12+, CPython Internals, AsyncIO, FastAPI, SQLAlchemy 2.0, Celery | **65** | [Open Track 4](tracks/04-backend-python.md) |
| **Track 5: Backend Node.js** | Node.js Runtime, V8, Libuv Event Loop, Streams, Buffers, Express, Fastify | **60** | [Open Track 5](tracks/05-backend-nodejs.md) |
| **Track 6: AWS Cloud Architecture** | AWS Well-Architected, VPC, Fargate, Lambda, S3, Aurora, IAM, KMS, SQS | **65** | [Open Track 6](tracks/06-cloud-aws-architecture.md) |
| **Track 7: Data Structures & Algorithms** | Blind 75, NeetCode 150 Patterns, Two Pointers, Trees, Graphs, DP | **100** | [Open Track 7](tracks/07-data-structures-algorithms.md) |
| **Track 8: Core JavaScript Internals** | Core Language Bank: 518 Qs: Prototypes, Closures, Event Loop, ES6+, Web APIs, V8 | **518** | [Open Track 8](tracks/08-frontend-javascript.md) |
| **TOTAL** | **Full-Stack, Cloud & Core JavaScript Mastery** | **1,596** | — |

---

## 📚 Curriculum Breakdown

### ⚛️ [Track 2: Complete React Master (1 - 445)](tracks/02-frontend-react-nextjs.md)
1. **Core React, JSX & Component Architecture (Q1 - Q77)**: React evolution from XHP/FaxJS, JSX transpilation, Virtual DOM, React Fiber scheduling, controlled vs uncontrolled components, reconciliation, fragments, portals, static type checking, synthetic events, prop validation, inline styles, error boundaries.
2. **React Router & Navigation (Q78 - Q88)**: React Router v6 architecture, `<BrowserRouter>`, `<Routes>`, programmatic navigation with `useNavigate`, `push` vs `replace`, query parameters, 404 fallback routing.
3. **React Internationalization (Q89 - Q94)**: React Intl (`IntlProvider`, `FormattedMessage`, `FormattedNumber`), pluralization, currency formatting, locale switching.
4. **React Testing & Jest (Q95 - Q100)**: Shallow Renderer, TestRenderer, Jest test runner, parallel execution, snapshot testing, mocking dependencies.
5. **React Redux State Management (Q101 - Q134)**: Flux vs Redux unidirectional flow, 3 Core Principles, pure reducers, `useSelector` & `useDispatch`, Redux Thunk vs Redux Saga generators, Redux DevTools time-travel debugging, Reselect memoization.
6. **React Native Architecture (Q135 - Q138)**: Native views vs HTML DOM, bridge architecture, Hermes JS engine, mobile test tools.
7. **Supported Libraries, Styling & Integrations (Q139 - Q151)**: Reselect selectors, Flow vs TypeScript, Styled Components CSS-in-JS, Relay GraphQL fragments, DevTools troubleshooting.
8. **Advanced React Patterns, Portals & Performance (Q152 - Q261)**: Render hijacking, code splitting with `React.lazy` and `<Suspense>`, windowing with `react-window`, Context API default values, diffing algorithm rules, refs usage, React 18 Automatic Batching, React StrictMode double rendering, immutable state array updates.
9. **React Hooks Deep Dive (Q262 - Q316)**: `useState` vs `useReducer`, `useContext`, `useEffect` dependency array & cleanup mechanics, `useLayoutEffect` DOM measurements, `useRef` mutable containers, `useMemo` vs `useCallback`, Custom Hooks, `useId`, `useTransition`, `useDeferredValue`, `useSyncExternalStore`, `useInsertionEffect`.
10. **Modern React 18, React 19 & Next.js Patterns (Q317 - Q353)**: React 18 Concurrent Rendering, React 19 Actions, `use()` hook for promises & context, Server Actions, `useOptimistic`, `useFormStatus`, React Compiler (React Forget), Streaming SSR (`renderToPipeableStream`), Next.js App Router vs Pages Router, Server Components vs Client Components.
11. **Legacy Architecture, Migration Patterns & Historical Internals (Q354 - Q445)**: React 15 vs 16 migration paths, `unstable_handleError`, deprecated lifecycles (`componentWillMount`, `componentWillReceiveProps`), `replaceState`, Mixins deprecation, string refs vs callback refs, `renderToNodeStream` vs `renderToPipeableStream`, `create-react-app` internals, class component reconciliation details.

---

### 🟨 [Track 8: Core JavaScript Master (1 - 518)](tracks/08-frontend-javascript.md)
1. **Core Objects, Prototypes, Functions & Scope (Q1 - Q50)**: Ways to create objects, prototype chains, `call`/`apply`/`bind`, Map vs Object, arrow functions, currying, pure functions, `let` vs `var`, TDZ, IIFE, memoization, hoisting, closures, scopes, service workers, IndexedDB, cookies & web storage.
2. **Promises, Callbacks, Async & Strict Mode (Q51 - Q100)**: Web workers, Promise states, callback hell, SSE, promise chaining, `Promise.all()`, strict mode, `typeof`, `null` vs `undefined`, `window` vs `document`, event flow, bubbling & capturing, SOP, compiled vs interpreted, case-sensitivity.
3. **DOM, Event Flow, Timers & Browser APIs (Q101 - Q170)**: `preventDefault()` vs `stopPropagation()`, single-threaded model, event delegation, ECMAScript vs JS, `clearTimeout` / `clearInterval`, URL location properties, loops, polyfills, tree shaking, regex patterns, breakpoints.
4. **Prototypes, Object Methods & Event Loop (Q171 - Q250)**: `Object.freeze` vs `Object.seal`, `Object.is()`, `Object.assign()`, Proxy objects, WeakSet & WeakMap, accessors, getters & setters, error objects, Intl API, iterators, event loop, call stack & event queue.
5. **ES6+ Modern Syntax, Classes, Modules & Destructuring (Q251 - Q325)**: Comma operator, TypeScript differences, class constructors & `super()`, prototype getters/setters, non-extensible objects, minification & obfuscation, constraint validation, ES6 features, template literals, destructuring, typed arrays.
6. **Async Internals, Memory, Microtasks & Web APIs (Q326 - Q400)**: PostMessage security, JS paradigms, `~~` operator, `ArrayBuffer`, shallow vs deep copy, mixins, reflow vs repaint, AJAX, zero timeout, microtask queues, observables & RxJS.
7. **Execution Context, Functional JS & V8 Engine (Q401 - Q460)**: Babel, Node.js concurrency, `this` keyword, memory leak causes, V8 optimization (hidden classes, inline caching), HOFs, ASI, compose & pipe functions.
8. **Modern JavaScript APIs, WeakRef, Proxy & Performance (Q461 - Q518)**: Lexical scope, dark mode detection, `requestAnimationFrame`, `globalThis`, shadowing, `structuredClone`, `Promise.any()`, BigInt, private class fields, Array `.at()`, top-level await, WeakRef & FinalizationRegistry, Temporal API, Symbols, AbortController, Intersection Observer, Mutation Observer, Atomics API, bundle size optimization.

---

### 🔷 [Track 1: Complete Angular Master (1 - 283)](tracks/01-frontend-angular-ts.md)
1. **Core Angular Architecture, TypeScript & Components (Q1 - Q30)**: Angular vs AngularJS, TypeScript fundamentals, architecture overview, components & directives, lifecycle hooks (`ngOnInit`, `ngOnChanges`, `ngOnDestroy`), data binding & interpolation, template statements & expressions.
2. **Templates, Directives, Pipes & View Encapsulation (Q31 - Q60)**: Custom directives, pure vs impure pipes, ViewEncapsulation modes (Emulated, ShadowDom, None), template reference variables (`#var`), content projection (`<ng-content>`), ViewChild & ContentChild queries.
3. **Services, Dependency Injection & Hierarchical Injectors (Q61 - Q90)**: `@Injectable()`, `providedIn: 'root'`, hierarchical injector trees, injection tokens, multi-providers, factory providers, singleton services.
4. **Angular Forms: Template-Driven & Reactive Forms (Q91 - Q120)**: `FormControl`, `FormGroup`, `FormArray`, built-in & custom validators, async validators, cross-field validation, valueChanges observables.
5. **Angular Routing, Guards & Navigation (Q121 - Q150)**: Router configuration, route parameters & query params, router outlets, Route Guards (`CanActivateFn`, `CanDeactivateFn`, `ResolveFn`), lazy loading modules and standalone routes.
6. **HTTP Client, Interceptors & RxJS Observables (Q151 - Q180)**: `HttpClient`, HTTP interceptors (`HttpInterceptorFn`), error handling with `catchError`, retry logic, RxJS Subject vs BehaviorSubject vs ReplaySubject, flattening operators (`switchMap`, `mergeMap`, `concatMap`, `exhaustMap`).
7. **Angular Animations, Internationalization & Service Workers (Q181 - Q210)**: BrowserAnimationsModule, trigger, state, transition, animate, i18n tooling, Service Worker PWA support, Web Workers integration.
8. **Angular Ivy, Universal (SSR) & Security (Q211 - Q240)**: Ivy compiler benefits, differential loading, Angular Universal / SSR hydration, XSS prevention, DomSanitizer, CSP configuration.
9. **Angular CLI, Testing, Schematics & Modern Tooling (Q241 - Q270)**: Angular CLI commands, Karma & Jasmine unit tests, component fixture testing, mocking services, custom Schematics, ESLint migration, standalone components.
10. **Modern Angular 17-19, Signals & NgRx State Management (Q271 - Q283)**: Angular Signals (`signal`, `computed`, `effect`), built-in Control Flow (`@if`, `@for`, `@switch`), Deferrable Views (`@defer`), NgRx architecture (Store, Actions, Reducers, Effects, Selectors).

---

### 🗄️ [Track 3: Databases, SQL, NoSQL & System Design (1 - 60)](tracks/03-backend-databases-system-design.md)
1. **Candid Experience & Production Scenarios (Q1 - Q5)**: Production database selection, zero-downtime schema migrations (Expand/Contract pattern), debugging connection pool exhaustion and slow queries with `pg_stat_statements`.
2. **Relational Databases (PostgreSQL / MySQL) (Q6 - Q25)**: ACID enforcement mechanisms, Normalization (1NF - BCNF) vs Denormalization, SQL Transaction Isolation levels (Read Committed, Repeatable Read, Serializable), B-Tree & B+Tree internal structures, Clustered vs Secondary indexes, Leftmost prefix rule, `EXPLAIN ANALYZE` (Seq Scan vs Index Scan vs Bitmap Scan), Join algorithms (Nested Loop, Hash Join, Merge Join), PostgreSQL JSONB with GIN indexes, PgBouncer transaction pooling, MVCC & autovacuum, WAL & Point-In-Time Recovery (PITR), N+1 query elimination.
3. **NoSQL & Document Stores (MongoDB, DynamoDB) (Q26 - Q40)**: CAP Theorem positioning, Embedding vs Referencing, Aggregation Pipeline (`$match`, `$group`, `$lookup`), Replica Sets vs Sharding, Oplog & Change Streams, DynamoDB Partition (HASH) and Sort (RANGE) keys, Hot Partitions, Single-Table Design, GSI vs LSI, Optimistic vs Pessimistic concurrency control.
4. **In-Memory Caching & Fast Data Stores (Redis) (Q41 - Q50)**: Single-threaded event loop throughput, Redis data structures (Strings, Hashes, Lists, Sets, ZSET), Caching patterns (Cache-Aside, Write-Through, Write-Behind), Cache Stampede / Avalanche / Penetration defense, Eviction policies (`allkeys-lru`, `volatile-lfu`), RDB vs AOF persistence, Sliding window rate limiter in Lua, Redlock distributed locking.
5. **Real-Time Architecture, Replication & Scale (Q51 - Q60)**: Read-Write splitting, Change Data Capture (CDC with Debezium), Database sharding algorithms, Consensus failover (Raft/Paxos), Transactional Outbox Pattern, Elasticsearch vs `tsvector`, Time-series hypertables, Vector embeddings indexing (HNSW with pgvector), RPO vs RTO disaster recovery.

---

### 🐍 [Track 4: Python Backend, FastAPI, AsyncIO & Internals (1 - 65)](tracks/04-backend-python.md)
1. **Candid Experience & Scaffolding (Q1 - Q5)**: FastAPI vs Flask vs Django selection criteria, resolving event loop blocking incidents, package management with `uv` and Poetry, multi-stage Docker builds, isolated testing with Pytest and Testcontainers.
2. **Python Core Internals & Runtime (Q6 - Q25)**: Reference counting and generational cyclic GC, Global Interpreter Lock (GIL) and PEP 703 free-threaded Python, mutable vs immutable memory models, integer caching and string interning, custom decorators with `functools.wraps`, Generator expressions and Iterator protocol, Context Managers (`__enter__` / `__exit__`), Dunder methods (`__new__` vs `__init__`, `__repr__`), C3 Linearization MRO, `__slots__` memory optimization, Dataclasses vs NamedTuple vs Pydantic v2, CPython bytecode disassembly via `dis`.
3. **Async Programming & Concurrency (Q26 - Q40)**: Multi-threading vs Multi-processing vs AsyncIO, Coroutines, Tasks and Futures, offloading blocking synchronous calls via `asyncio.to_thread()`, Structured Concurrency with `asyncio.TaskGroup()`, `asyncio.Queue` producer-consumer architectures, graceful shutdown on SIGINT/SIGTERM, Gunicorn with Uvicorn worker process topology.
4. **FastAPI, Flask & Web API Architecture (Q41 - Q55)**: Starlette + Pydantic + ASGI synergy, Dependency Injection (`Depends()`) for DB sessions and RBAC, Pydantic v2 Rust core speedup, BackgroundTasks vs Celery, custom Starlette middlewares, centralized exception handling, Flask application factory pattern and contexts, JWT authentication with refresh token rotation, Server-Sent Events (SSE) streaming.
5. **ORMs, Data Persistence & Distributed Tasks (Q56 - Q65)**: SQLAlchemy 2.0 type-annotated syntax (`Mapped`, `mapped_column`), Unit of Work & Identity Map patterns, Async SQLAlchemy with `asyncpg`, N+1 query elimination (`joinedload`, `selectinload`), Alembic production migration guardrails, Celery broker and result backends, exponential backoff retries and task idempotency, Celery Canvas workflows (`chain`, `group`, `chord`), worker memory leak prevention via `--max-tasks-per-child`.

---

### 🟢 [Track 5: Node.js Backend, Libuv, Streams & Fastify (1 - 60)](tracks/05-backend-nodejs.md)
1. **Intro & Enterprise Architecture (Q1 - Q5)**: Layered Controller-Service-Repository architecture, resolving Event Loop latency spikes, Express vs Fastify vs NestJS selection criteria, integration testing with Supertest and Testcontainers.
2. **Runtime Internals, Libuv & The Event Loop (Q6 - Q20)**: V8 engine, Libuv architecture, 6 Event Loop phases in exact order (Timers, Pending Callbacks, Idle/Prepare, Poll, Check, Close), `process.nextTick()` vs `setImmediate()`, Libuv Thread Pool operations (`fs`, `crypto`, `dns`) vs native OS non-blocking I/O (`epoll`/`kqueue`), `UV_THREADPOOL_SIZE` scaling, `perf_hooks` Event Loop delay monitoring, V8 GC generations (Scavenge vs Mark-Sweep-Compact), Buffer allocation (`Buffer.alloc` vs `Buffer.allocUnsafe`), CJS vs ESM module resolution, graceful shutdown on SIGTERM.
3. **Streams, Buffers & Core Modules (Q21 - Q35)**: Readable, Writable, Duplex, and Transform streams, Stream Backpressure and `pipeline()`, EventEmitter error handling gotchas, `fs.readFile` vs `fs.createReadStream`, Clustering vs Worker Threads (`worker_threads`) vs Child Processes, Worker thread communication via `MessagePort` and `SharedArrayBuffer`, `AsyncLocalStorage` for distributed request context.
4. **Express, Fastify, APIs & Middleware (Q36 - Q50)**: Express middleware execution mechanics, centralized 4-parameter error middleware, Fastify high throughput via Radix tree router and compile-time JSON schema serialization, Rate limiting with Redis, CORS preflight checks, direct streaming file uploads to S3, Server-Sent Events (SSE), WebSocket horizontal scaling via Redis Pub/Sub, API security (Prototype Pollution, ReDoS, Helmet).
5. **Production Scale, Deployment & Observability (Q51 - Q60)**: Containerized Docker best practices (PID 1 handling with `tini`, non-root user), PM2 vs Kubernetes orchestration, database connection pool management under surges, Transactional Outbox pattern, Liveness vs Readiness health checks, Pino structured logging, zero-downtime rolling vs blue-green updates, Bun and Deno runtime comparisons.

---

### ☁️ [Track 6: Cloud Architecture AWS & Enterprise Infrastructure (1 - 65)](tracks/06-cloud-aws-architecture.md)
1. **Intro & Well-Architected Framework (Q1 - Q5)**: 6 Pillars of AWS Well-Architected Framework, evaluating architectural trade-offs, resolving severe Lambda concurrency throttles and NAT gateway bottlenecks, EC2 vs Fargate vs Lambda compute selection, FinOps cost governance.
2. **Networking, VPC & Traffic Routing (Q6 - Q20)**: Secure 3-tier VPC design across multiple AZs, reserved IP addresses in subnet CIDRs, Security Groups (stateful) vs Network ACLs (stateless), Internet Gateway vs NAT Gateway vs NAT Instance, VPC Peering vs Transit Gateway vs PrivateLink, ALB (Layer 7) vs NLB (Layer 4) vs GWLB, ALB Connection Draining, VPC Flow Logs with Athena, S3 & DynamoDB Gateway Endpoints, Route 53 routing policies (Latency, Weighted, Failover, Geolocation), Alias vs CNAME records, Direct Connect vs Site-to-Site VPN, Global Accelerator vs CloudFront.
3. **Compute, Containers & Serverless (21 - 35)**: EC2 instance families and Graviton ARM migration, EC2 pricing models (Spot, Savings Plans, Reserved), Placement Groups (Cluster, Spread, Partition), EBS vs Instance Store ephemeral storage, Auto Scaling Groups (Target Tracking, Step Scaling), Lambda Firecracker execution model, Lambda Cold Start mitigations and Hyperplane ENI VPC networking, ECS Fargate vs EKS Kubernetes, ECR image immutability and vulnerability scanning, Step Functions Standard vs Express workflows.
4. **Storage, Content Delivery & Databases (Q36 - Q50)**: S3 vs EBS vs EFS, S3 Storage Classes and Lifecycle rules, 11 9s durability mechanics, S3 Block Public Access and Bucket Policies, Multipart Uploads, Object Lock (WORM), CloudFront Edge Locations and Regional Edge Caches, Signed URLs vs Signed Cookies, CloudFront Functions vs Lambda@Edge, RDS Multi-AZ (HA) vs Read Replicas (scaling), Aurora 6-way replicated storage engine and Serverless v2, DynamoDB Single-Table design and Streams.
5. **Security, IAM, Messaging & Enterprise Deployments (Q51 - Q65)**: AWS Shared Responsibility Model, IAM User vs Role vs Policy, IAM evaluation logic (Explicit Deny priority), IAM Instance Profiles, AWS Organizations and SCPs, KMS Envelope Encryption, Secrets Manager vs SSM Parameter Store, SQS vs SNS, SQS FIFO queues and Dead-Letter Queues (DLQ), EventBridge schema routing, CloudWatch vs CloudTrail, Blue/Green and Canary deployments with CodeDeploy, Infrastructure as Code (CDK vs Terraform), Disaster Recovery RPO/RTO strategies (Backup & Restore, Pilot Light, Warm Standby, Active-Active).

---

### 🧠 [Track 7: Data Structures & Algorithms (1 - 100)](tracks/07-data-structures-algorithms.md)
1. **Intro & Approach (Q1 - Q5)**: Step-by-step interview problem-solving framework, Big-O / Big-$\Omega$ / Big-$\Theta$ asymptotic notation, Master Theorem, recursion stack vs heap memory bounds, constraint-based pattern recognition.
2. **Arrays, Strings & Hash Maps (Q6 - Q18)**: Two Sum ($O(N)$), Longest Consecutive Sequence ($O(N)$), Group Anagrams, Product of Array Except Self ($O(1)$ space), Kadane’s Algorithm for Maximum Subarray, Subarray Sum Equals K (prefix sums), Next Permutation, Merge & Insert Intervals.
3. **Two Pointers & Sliding Window (Q19 - Q28)**: Valid Palindrome, Two Sum II (sorted array), 3Sum ($O(N^2)$), Container With Most Water, Trapping Rain Water ($O(1)$ space), Longest Substring Without Repeating Characters, Minimum Window Substring ($O(N+M)$), Sliding Window Maximum (Monotonic Deque).
4. **Stacks & Queues (Q29 - Q36)**: Valid Parentheses, Min Stack ($O(1)$ all ops), Evaluate Reverse Polish Notation, Daily Temperatures (Monotonic Stack), Largest Rectangle in Histogram ($O(N)$), Implement Queue using Stacks.
5. **Linked Lists (Q37 - Q45)**: Reverse Linked List (iterative and recursive), Merge Two Sorted Lists, Floyd’s Cycle Detection (Tortoise and Hare), Remove Nth Node From End (single pass), Reorder List, Copy List with Random Pointer (node interweaving), Merge K Sorted Lists (Min-Heap).
6. **Binary Search (Q46 - Q52)**: Binary search on sorted boundaries without integer overflow, Search a 2D Matrix ($O(\log(M \cdot N))$), Search in Rotated Sorted Array, Find Minimum in Rotated Sorted Array, Koko Eating Bananas (Binary Search on Answer Range), Median of Two Sorted Arrays.
7. **Trees & Tries (Q53 - Q65)**: Invert Binary Tree, Maximum Depth & Diameter, Balanced Binary Tree, Lowest Common Ancestor (BST & Binary Tree), Level Order Traversal (BFS), Validate BST, Kth Smallest Element in BST, Construct Tree from Preorder & Inorder, Trie (Prefix Tree) implementation.
8. **Heaps & Priority Queues (Q66 - Q72)**: Kth Largest Element (Min-Heap vs QuickSelect), Top K Frequent Elements (Bucket Sort in $O(N)$), Find Median from Data Stream (Dual Heaps), Task Scheduler, Design Twitter feed (Multi-way Heap Merge), Reorganize String.
9. **Backtracking (Q73 - Q79)**: Subsets (Power Set $O(2^N)$), Combination Sum, Permutations ($O(N!)$), Subsets II (duplicate handling), Word Search in Grid, Palindrome Partitioning, N-Queens.
10. **Graphs (BFS, DFS, Topological Sort & Union-Find) (Q80 - Q90)**: Number of Islands, Clone Graph, Rotting Oranges (Multi-source BFS), Pacific Atlantic Water Flow, Course Schedule I & II (Kahn’s Algorithm In-degree BFS), Number of Connected Components & Disjoint Set Union (DSU with Path Compression & Union by Rank), Redundant Connection, Word Ladder, Network Delay Time (Dijkstra’s Algorithm $O((V+E)\log V)$), Alien Dictionary.
11. **1D & 2D Dynamic Programming (Q91 - Q100)**: Climbing Stairs, Min Cost Climbing Stairs, House Robber I & II (circular), Coin Change, Longest Increasing Subsequence ($O(N \log N)$ Patience Sorting), Word Break, Unique Paths, Longest Common Subsequence (LCS), Best Time to Buy and Sell Stock with Cooldown, 0/1 Knapsack & Partition Equal Subset Sum.

---

## 💻 Interactive Next.js Web Application

This repository includes a full-fledged **Next.js 14 App Router** web portal providing an interactive study experience with Markdown rendering, instant search, copyable code blocks, and responsive layouts.

### 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/TheLearningHubOrg/learn-interview-questions.git
cd learn-interview-questions

# Install dependencies
npm install

# Start local Next.js development server
npm run dev
# -> Open http://localhost:3000 in your browser

# Build production static bundle
npm run build

# Start production server
npm run start
```

### ⚡ Web App Features
- **Instant Global Search (`⌘K` / `Ctrl+K`)**: Search across all 745+ questions with live filtering and jump links.
- **Table of Contents Sidebar**: Sticky scroll-spy outline for every track.
- **Code Block Utilities**: One-click code copying and language tags.
- **Server-Side Generation (SSG)**: Zero runtime markdown overhead with pre-rendered pages.
- **Sleek Dark Theme**: Built with Tailwind CSS, custom obsidian color scales, and smooth transitions.

---

## 🎯 How to Use This Question Bank
1. **Targeted Track Review**: Jump straight into the track corresponding to your upcoming technical round (e.g., Frontend System Design, Backend API Deep-Dive, Cloud Architecture, or Live Coding DSA).
2. **Mock Interview Simulation**: Practice explaining questions candidly out loud using the structured answers, code snippets, and comparative tables.
3. **Architecture Reference**: Use the detailed design patterns (Expand/Contract migrations, Transactional Outbox, Sliding Window rate limiters, Next.js Server Components, Angular Signals) as production architectural blueprints for real-world projects.

---

## 🤝 Contributing
Contributions, enhancements, and additional real-world interview scenarios are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/new-interview-topic`).
3. Commit your Changes (`git commit -m 'Add new interview questions'`).
4. Push to the Branch (`git push origin feature/new-interview-topic`).
5. Open a Pull Request.

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE).
Part of **[The Learning Hub Org](https://github.com/TheLearningHubOrg)**.

