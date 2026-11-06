# Full-Stack & Backend Node.js Master Interview Question Bank: Express, Fastify, Libuv, Streams & Architecture (1 - 60)

> Comprehensive, production-level technical interview questions and deep-dive answers covering Node.js runtime internals (V8, Libuv event loop, thread pool), Streams, Buffers, Worker Threads, clustering, Express vs Fastify, API security, and high-concurrency production deployments.

---

## Table of Contents
- [Part 1: Intro, Candid Experience & Architecture (1 - 5)](#part-1-intro-candid-experience--architecture-1---5)
- [Part 2: Runtime Internals, Libuv & The Event Loop (6 - 20)](#part-2-runtime-internals-libuv--the-event-loop-6---20)
- [Part 3: Streams, Buffers & Core Modules (21 - 35)](#part-3-streams-buffers--core-modules-21---35)
- [Part 4: Express, Fastify, APIs & Middleware (36 - 50)](#part-4-express-fastify-apis--middleware-36---50)
- [Part 5: Production Scale, Deployment & Observability (51 - 60)](#part-5-production-scale-deployment--observability-51---60)

---

## Part 1: Intro, Candid Experience & Architecture (1 - 5)

### 1. Walk me through your hands-on experience building backend microservices, REST APIs, and realtime services in Node.js.
**Answer:**
"I am a Senior Backend and Full-Stack Engineer with extensive experience building high-throughput services using Node.js, TypeScript, and modern frameworks including **Express**, **Fastify**, and **NestJS**. Over the course of my career, I have architected event-driven microservices handling millions of events daily, implemented real-time bidirectional WebSocket systems using Redis Pub/Sub backplanes, designed streaming file transformation pipelines using Node.js Streams, and integrated PostgreSQL, MongoDB, and Redis data layers. I place major focus on Event Loop latency monitoring, graceful process shutdowns, memory leak avoidance, and strict schema validation."

### 2. How do you design and structure enterprise Node.js projects?
**Answer:**
"I adhere to **Layered Architecture (Controller-Service-Repository)** with Clean Architecture boundaries:
- **Presentation Layer (Controllers/Routes)**: Handles HTTP request parsing, DTO validation using Zod, and returns HTTP responses.
- **Domain & Service Layer**: Contains business rules, orchestration, domain entities, and domain exceptions; completely decoupled from HTTP frameworks.
- **Data Access Layer (Repositories)**: Encapsulates database queries (Prisma, TypeORM, Drizzle, or raw SQL clients).
- **Cross-Cutting Concerns**: Centralized middleware for authentication, correlation ID propagation (`AsyncLocalStorage`), error handling, and structured logging."

### 3. Describe a critical production incident or performance bottleneck you resolved in Node.js.
**Answer:**
"In an Express payment processing gateway, service instances intermittently stopped responding, leading to Kubernetes liveness probe failures and container restart loops.
**Root Cause**: A CPU-intensive PDF invoice generation library was being invoked synchronously inside request handlers, blocking the single-threaded Node.js Event Loop for up to 3.8 seconds per request. Because the main thread was completely frozen, Node.js could not process inbound health check TCP pings.
**Resolution**:
1. Extracted PDF generation to a dedicated **Worker Thread pool** using Piscina, running computation on isolated OS worker threads.
2. Implemented `monitorEventLoopDelay` from `perf_hooks` to expose Event Loop lag metrics to Prometheus.
Container CPU leveled out, and health check timeouts were eliminated."

### 4. How do you decide between choosing Express, Fastify, or NestJS?
**Answer:**
- **Express**: The battle-tested industry standard. Best when team familiarity, vast third-party middleware compatibility, and straightforward lightweight setups are preferred.
- **Fastify**: High-throughput microservices. Delivers up to 2x higher throughput than Express via compile-time JSON schema serialization (`fast-json-stringify`) and Radix Tree routing (`find-my-way`).
- **NestJS**: Large enterprise teams requiring an opinionated, TypeScript-first framework with built-in Dependency Injection, modular architecture, and microservice transport adapters (gRPC, RabbitMQ, Kafka).

### 5. What is your strategy for automated backend testing in Node.js?
**Answer:**
- **Unit Testing**: Vitest or Jest for fast isolated tests of business logic and domain services with mocked repository dependencies.
- **Integration Testing**: Supertest against real Fastify/Express HTTP servers, paired with **Testcontainers** to spin up ephemeral PostgreSQL and Redis Docker containers in CI, verifying real queries and migrations.
- **Database Rollbacks**: Running test transactions with rollbacks or schema isolation to ensure complete test hermeticity.

---

## Part 2: Runtime Internals, Libuv & The Event Loop (6 - 20)

### 6. Node.js fundamental architecture: V8, Libuv, c-ares, llhttp.
**Answer:**
- **V8**: Google's open-source JavaScript and WebAssembly engine that compiles JS to native machine code.
- **Libuv**: High-performance C library that provides the Event Loop and asynchronous I/O abstractions (thread pool, epoll, kqueue).
- **c-ares**: C library for asynchronous DNS requests.
- **llhttp**: Ultra-fast HTTP 1.1 request/response parser in C.
- **C++ Bindings**: Connect Node.js internal C/C++ libraries with the JavaScript runtime.

### 7. Node.js Event Loop Phases in exact order.
**Answer:**
1. **Timers**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration (e.g., TCP socket errors).
3. **Idle, Prepare**: Used internally by Node.js.
4. **Poll**: Retrieves new I/O events, executes I/O-related callbacks (file read, network sockets). If no timers are pending, blocks and waits for connections.
5. **Check**: Executes callbacks registered by `setImmediate()`.
6. **Close Callbacks**: Executes close events (e.g., `socket.on('close', ...)`).

### 8. `process.nextTick()` vs `setImmediate()`.
**Answer:**
- `process.nextTick()`: Not technically part of the Event Loop phases; it drains its queue **immediately after the current operation completes**, before the Event Loop moves to any other phase. Starves the event loop if called recursively.
- `setImmediate()`: Scheduled to execute specifically in the **Check phase** on the next tick of the Event Loop.

### 9. Microtasks execution relative to Macrotasks in Node.js.
**Answer:**
The microtask queue (Promise callbacks, `queueMicrotask`) executes immediately after `process.nextTick` callbacks drain, between every phase transition of the event loop.

### 10. The Libuv Thread Pool.
**Answer:**
By default, the thread pool has 4 worker threads. It handles asynchronous operations that cannot be performed non-blockingly via OS asynchronous notification mechanisms:
- File system operations (`fs.*`).
- DNS lookup operations (`dns.lookup`).
- Cryptographic functions (`crypto.pbkdf2`, `crypto.randomBytes`, `crypto.scrypt`).
- Compression (`zlib.*`).
Network sockets (TCP/UDP, HTTP) do **not** use the thread pool; they use native non-blocking OS primitives (`epoll` on Linux, `kqueue` on macOS).

### 11. Scaling the thread pool with `UV_THREADPOOL_SIZE`.
**Answer:**
Can be increased up to 128 by setting the environment variable: `UV_THREADPOOL_SIZE=16 node app.js`. Must be set before any async operations execute. If saturated by heavy cryptographic hashing, file I/O operations will stall in the queue.

### 12. Detecting Event Loop delay in production.
**Answer:**
Use the `perf_hooks` built-in module:
```javascript
const { monitorEventLoopDelay } = require('perf_hooks');
const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  console.log(`Event Loop p99 delay: ${histogram.percentile(99) / 1e6} ms`);
}, 5000);
```

### 13. V8 Garbage Collection in Node.js.
**Answer:**
- **Scavenge (Young Generation)**: Two semi-spaces (From/To). Fast, frequent collection using Cheney's copying algorithm for short-lived objects.
- **Mark-Sweep-Compact (Old Generation)**: Marks surviving long-lived objects, sweeps unmarked memory, and compacts fragmented pages to optimize pointer allocation.

### 14. Common causes of Memory Leaks in Node.js.
**Answer:**
1. Global variables holding references to large objects.
2. Uncleared event listeners on persistent event emitters (e.g., sockets).
3. Unclosed streams or caching without size bounds in plain JavaScript objects.
4. Closures holding outer scope variables.
**Diagnosis**: Generate heap snapshots via `v8.writeHeapSnapshot()` and inspect retaining paths in Chrome DevTools Memory panel.

### 15. Buffers: `Buffer.alloc()` vs `Buffer.allocUnsafe()`.
**Answer:**
Buffers allocate raw binary memory outside the V8 heap in native C++ memory.
- `Buffer.alloc(size)`: Initializes memory and zeroes out all bytes. Safe.
- `Buffer.allocUnsafe(size)`: Allocates raw memory without zeroing it out. Faster, but exposes old sensitive memory remnants (passwords, tokens) to the application.

### 16. CommonJS (`require`) vs ES Modules (`import`) resolution.
**Answer:**
- **CommonJS**: Synchronous, dynamic (`require()` can be inside conditionals), loads and executes script immediately, caches exports in `require.cache`.
- **ES Modules**: Asynchronous, static analysis at parse-time, supports top-level await, handles cyclic dependencies via live bindings.

### 17. Operational pitfalls of mixing CJS and ESM.
**Answer:**
- ESM cannot import named exports from CJS without default import wrappers.
- `__dirname` and `__filename` are not defined in ESM; must be derived via `import.meta.url`:
```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
```

### 18. Unhandled Promise Rejections & Uncaught Exceptions.
**Answer:**
- `process.on('uncaughtException', (err) => ...)`: Synchronous uncaught error. The application is in an undefined state and must perform cleanup and exit with non-zero code.
- `process.on('unhandledRejection', (reason, promise) => ...)`: Promise rejected without a `.catch()`. In modern Node.js, terminates process if unhandled.

### 19. Graceful Shutdown implementation.
**Answer:**
```javascript
function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('Closed remaining HTTP connections.');
    await dbPool.end();
    await redisClient.quit();
    process.exit(0);
  });
  // Force shutdown after timeout
  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

### 20. Profiling Node.js applications with Flame Graphs.
**Answer:**
Run Node.js with `--prof` flag, then process generated v8.log with `node --prof-process isolate-*.log > processed.txt`. Or use **Clinic.js Flame** (`clinic flame -- node server.js`) to generate interactive flame graphs pinpointing hot code paths.

---

## Part 3: Streams, Buffers & Core Modules (21 - 35)

### 21. What are Node.js Streams and why are they essential?
**Answer:**
Streams process data sequentially chunk by chunk instead of reading the entire payload into RAM at once. Enables handling multi-gigabyte files or network payloads with constant, minimal memory consumption.

### 22. 4 Fundamental Stream Types.
**Answer:**
1. **Readable**: Source of data (`fs.createReadStream`, HTTP request).
2. **Writable**: Destination for data (`fs.createWriteStream`, HTTP response).
3. **Duplex**: Both Readable and Writable (e.g., net.Socket).
4. **Transform**: Duplex stream that modifies or transforms data while reading and writing (e.g., `zlib.createGzip()`).

### 23. Stream Backpressure and `pipeline()`.
**Answer:**
- **Backpressure**: Occurs when a Readable stream produces data faster than a Writable stream can consume and flush it to disk/network, leading to RAM exhaustion.
- **Solution**: Use `pipeline` from `stream/promises`. It manages backpressure automatically and properly destroys all streams if an error occurs:
```javascript
const { pipeline } = require('stream/promises');
await pipeline(readableStream, transformStream, writableStream);
```

### 24. Custom Transform Stream implementation.
**Answer:**
```javascript
const { Transform } = require('stream');

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}
```

### 25. The EventEmitter Class & `MaxListenersExceededWarning`.
**Answer:**
Maintains internal arrays of listener functions per event name. Default warning threshold is 10 listeners per event. If exceeded, Node.js logs a warning to prevent memory leaks from forgotten listeners.

### 26. Unhandled 'error' events in EventEmitter.
**Answer:**
If an EventEmitter emits an `'error'` event and has no listeners registered for `'error'`, Node.js prints the stack trace and **crashes the entire process**. Always attach `.on('error', handler)`.

### 27. `fs.promises` vs callback-based vs synchronous `fs`.
**Answer:**
Synchronous methods (`fs.readFileSync`) block the entire Event Loop thread until disk I/O completes. Always use `fs.promises` (`await fs.readFile(...)`) or streaming methods in web request handlers.

### 28. `fs.readFile()` vs `fs.createReadStream()`.
**Answer:**
- `fs.readFile()`: Loads the entire file content into a memory Buffer before calling the callback. Fails with out-of-memory errors on large files.
- `fs.createReadStream()`: Streams the file in 64KB chunks, allowing concurrent processing with minimal RAM footprint.

### 29. The `cluster` module.
**Answer:**
Spawns multiple child processes sharing the same server port. The master process receives incoming TCP connections and distributes them to worker processes using Round-Robin scheduling via IPC channels.

### 30. Worker Threads vs Child Processes vs Clustering.
**Answer:**
- **Clustering**: Multiple independent OS processes running identical server code; no shared memory.
- **Child Processes (`child_process`)**: Spawns external shell commands or programs; heavy OS overhead.
- **Worker Threads (`worker_threads`)**: Multiple threads within the **same OS process**, sharing the same memory heap and using `SharedArrayBuffer` for zero-copy data transfer.

### 31. Worker Thread communication.
**Answer:**
Communicates via `MessagePort` using `postMessage(data)` and listening on `parentPort.on('message', ...)`. For high-throughput zero-copy access, uses `SharedArrayBuffer` with `Atomics` for thread-safe synchronization.

### 32. `child_process.exec` vs `execFile` vs `spawn` vs `fork`.
**Answer:**
- `exec()`: Spawns a shell and buffers full output in memory. Vulnerable to shell command injection attacks.
- `execFile()`: Invokes an executable directly without a shell. Safer.
- `spawn()`: Streams process stdout/stderr in chunks; ideal for long-running processes.
- `fork()`: Special `spawn()` dedicated to spawning Node.js scripts with built-in IPC communication channels.

### 33. The `crypto` module: Secure password hashing.
**Answer:**
Use `crypto.scrypt()` or `crypto.pbkdf2()` with salt and high work factors for password hashing, or modern native algorithms like Argon2 via dedicated bindings.

### 34. `http.IncomingMessage` and `http.ServerResponse`.
**Answer:**
- `IncomingMessage`: Implements a **Readable Stream**, emitting `'data'` chunks as HTTP body bytes arrive.
- `ServerResponse`: Implements a **Writable Stream**, allowing `res.write()` streaming chunks and `res.end()`.

### 35. `AsyncLocalStorage` and Distributed Request Tracing.
**Answer:**
Provides thread-local-style storage across asynchronous operations, allowing Trace IDs and user session context to be accessible anywhere in the codebase without passing them through every function parameter:
```javascript
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

// In Middleware:
asyncLocalStorage.run({ traceId: req.headers['x-trace-id'] || uuidv4() }, () => {
  next();
});

// Deep inside a repository:
const store = asyncLocalStorage.getStore();
console.log(`Current Trace ID: ${store?.traceId}`);
```

---

## Part 4: Express, Fastify, APIs & Middleware (36 - 50)

### 36. Express Middleware Execution Pipeline.
**Answer:**
Middleware functions form an array queue. Each function receives `(req, res, next)`. Calling `next()` advances execution to the next middleware in the chain. Calling `res.send()` terminates the pipeline.

### 37. `next(err)` vs throwing asynchronous errors in Express.
**Answer:**
In Express 4, throwing an error inside an asynchronous Promise handler unhandled will crash the process or hang the request unless passed via `next(err)`. (Express 5 natively catches rejected promises from async handlers).

### 38. Centralized Global Error Handler in Express.
**Answer:**
Must accept **exactly 4 parameters** `(err, req, res, next)` so Express's reflection inspects `fn.length === 4` to recognize it as an error-handling middleware:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message });
});
```

### 39. Why Fastify achieves significantly higher throughput.
**Answer:**
1. **Radix Tree Routing**: Uses `find-my-way` for $O(K)$ route matching where $K$ is route length.
2. **Pre-Compiled JSON Serializer**: Uses `fast-json-stringify` which compiles JSON schemas into optimized C-like string concatenators, bypassing slow `JSON.stringify()`.
3. **Optimized Object Allocations**: Minimizes garbage collection pressure per request.

### 40. Fastify JSON Schema Validation (Ajv).
**Answer:**
Schemas validate request parameters, query, and body at compile-time:
```javascript
fastify.route({
  method: 'POST',
  url: '/users',
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 }
      }
    }
  },
  handler: async (request, reply) => { ... }
});
```

### 41. Authentication layer with JWT and Refresh Tokens.
**Answer:**
- Authenticate credentials -> Issue Access Token (short-lived, 15m) and Refresh Token (long-lived, 7d).
- Store Refresh Token in `HttpOnly, Secure, SameSite=Strict` Cookie.
- Middleware verifies Access Token signature and extracts claims on incoming requests.

### 42. Rate Limiting Middleware with Redis.
**Answer:**
Tracks IP or API key hit count in Redis with a 60-second sliding expiration window. If count exceeds limit, returns HTTP 429 with `Retry-After` header.

### 43. CORS and Preflight OPTIONS requests.
**Answer:**
Preflight OPTIONS requests are sent by browsers for requests with non-simple methods (`PUT`, `DELETE`, `PATCH`) or custom headers (`Authorization`, `Content-Type: application/json`).
Safe configuration specifies explicit `origin` whitelist instead of wildcard `*`.

### 44. File Uploads in Express: `multer` vs direct streaming.
**Answer:**
- `multer`: Parses `multipart/form-data` and buffers files to disk or RAM.
- **Direct S3 Streaming (`busboy`)**: Streams chunks directly from the incoming HTTP stream into AWS S3 via `@aws-sdk/lib-storage` `Upload`, eliminating local disk space requirements.

### 45. Input Sanitization with Zod.
**Answer:**
```typescript
const UserSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
});
const validated = UserSchema.parse(req.body);
```

### 46. Server-Sent Events (SSE) in Node.js.
**Answer:**
```javascript
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`);
  }, 1000);
  req.on('close', () => clearInterval(interval));
});
```

### 47. Scaling WebSockets across multiple Node.js instances.
**Answer:**
Use the **Redis Pub/Sub Adapter** (or Redis Streams). When a client on Instance A sends a message to a room, Instance A publishes the event to Redis, which broadcasts it to all other Node instances holding active WebSocket clients in that room.

### 48. Security vulnerabilities: Prototype Pollution and ReDoS.
**Answer:**
- **Prototype Pollution**: Merging untrusted user objects directly into existing objects mutating `__proto__`. Fix: Use `Object.create(null)` or validate inputs with Zod.
- **ReDoS (Regular Expression Denial of Service)**: Evil regexes with catastrophic backtracking freeze the Event Loop. Fix: Avoid nested quantifiers and use safe regex engines like `re2`.

### 49. The role of `helmet` middleware.
**Answer:**
Sets critical HTTP security headers automatically: `Content-Security-Policy`, `Strict-Transport-Security` (HSTS), `X-Frame-Options`, `X-Content-Type-Options`, and removes `X-Powered-By: Express`.

### 50. Correlation IDs with `AsyncLocalStorage`.
**Answer:**
Inject an `X-Correlation-ID` header into every outgoing HTTP request or log message, reading from `AsyncLocalStorage` to enable distributed tracing across microservice boundaries.

---

## Part 5: Production Scale, Deployment & Observability (51 - 60)

### 51. Containerized Docker Best Practices for Node.js.
**Answer:**
1. Use multi-stage builds.
2. Run on slim Alpine or distroless images.
3. Run as non-root user (`USER node`).
4. Use `tini` as init process (`ENTRYPOINT ["tini", "--"]`) to properly reap zombie child processes and handle signal forwarding (PID 1 problem).

### 52. Process Management: PM2 vs Kubernetes.
**Answer:**
- **PM2**: Excellent for standalone virtual machines (EC2). Manages clustering, log aggregation, and autorestarts on crashes.
- **Kubernetes**: Standard for cloud-native enterprise deployments. Handles pod replication, horizontal autoscaling (HPA), rolling updates, and self-healing across nodes.

### 53. Managing DB Connection Pools during surges.
**Answer:**
Set maximum pool size based on PostgreSQL capacity (`max_connections = (cores * 2) + disk_spindles`). Deploy a proxy pooler (PgBouncer) between Node instances and the database to prevent overwhelming the DB during autoscaling bursts.

### 54. The Outbox Pattern in Node.js.
**Answer:**
Write business state mutations and domain event payloads into an `outbox` database table within the **same atomic database transaction**. A separate background worker tails the outbox table and publishes events to RabbitMQ or Kafka.

### 55. Cache-Aside pattern with Redis in Node.js.
**Answer:**
```javascript
async function getProduct(id) {
  const cached = await redis.get(`product:${id}`);
  if (cached) return JSON.parse(cached);
  const product = await db.products.findById(id);
  if (product) await redis.set(`product:${id}`, JSON.stringify(product), 'EX', 3600);
  return product;
}
```

### 56. Health Check Endpoints: Liveness vs Readiness.
**Answer:**
- `/healthz/liveness`: Checks if the Node.js process is alive and its Event Loop is unblocked. If failing, Kubernetes restarts the pod.
- `/healthz/readiness`: Checks if the application can accept user traffic (verifies database and Redis connectivity). If failing, Kubernetes stops sending requests to this pod.

### 57. Structured Logging with Pino & OpenTelemetry.
**Answer:**
Use **Pino** for fast JSON logging (asynchronously writes logs to stdout without blocking main thread). Export OpenTelemetry metrics and distributed spans to collectors like Jaeger or Datadog.

### 58. Zero-Downtime Deployments (Rolling vs Blue-Green).
**Answer:**
- **Rolling Update**: Kubernetes updates pods incrementally, waiting for readiness probes before terminating older pods.
- **Blue-Green**: Provisions an entirely new green environment, verifies health, and switches traffic instantly at the load balancer level.

### 59. Node.js Event-Driven I/O vs Multi-Threaded Runtimes (Java/Go).
**Answer:**
Node.js uses a single event loop thread with non-blocking I/O, consuming ~30MB RAM for 10,000 idle connections. Java traditionally allocates 1MB stack per thread, consuming gigabytes of RAM. Go uses lightweight user-space goroutines (~2KB stack) for multi-threaded concurrency.

### 60. Modern Alternative Runtimes: Deno and Bun.
**Answer:**
- **Bun**: Built in Zig with JavaScriptCore engine. Blazingly fast startup, built-in package manager, bundled test runner, and native TypeScript support.
- **Deno**: Built in Rust with V8. Emphasizes secure-by-default sandbox permissions, Web standard APIs, built-in tooling, and native TypeScript compilation.
