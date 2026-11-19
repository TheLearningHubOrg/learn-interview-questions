# Software Testing, QA Automation & Load Testing Master Interview Bank (1 - 30)

> Testing Pyramid, Vitest vs Jest ESM performance, Mock Service Worker (MSW) network interception, Playwright E2E automation & auto-waiting, Pact consumer-driven contract testing, and k6 load testing.

---

### 1. Explain the Practical Testing Pyramid and Cost vs. Confidence Trade-Offs.
**In Simple Words:**
The Testing Pyramid (Martin Fowler / Mike Cohn) structures automated tests by execution speed, maintenance cost, and fidelity:
1. **Unit Tests (Base - 70%)**: Tests isolated functions and pure logic. Fast ($<5\text{ms}$), deterministic, runs locally on every commit. Low cost, high volume.
2. **Integration / Component Tests (Middle - 20%)**: Tests how units interact with databases, HTTP handlers, or component trees. Uses Testcontainers or MSW. Moderate speed ($100\text{ms}$–$1\text{s}$).
3. **End-to-End Tests (Peak - 10%)**: Tests real user journeys across full browser and backend stacks via Playwright. Highest fidelity, but slowest ($5\text{s}$–$30\text{s}$), flakiest, and most expensive to maintain.

### 2. Vitest vs. Jest: Architectural Differences and Performance Benchmarks.
**In Simple Words:**
- **Jest**:
  - Created before native ES modules. Requires transpiling code using Babel or `ts-jest` for every test run.
  - Manages its own custom module resolution and mock caches, which adds heavy overhead in modern TypeScript/ESM projects.
- **Vitest**:
  - Built directly on Vite's dev server pipeline. Shares the same configuration, plugins, and transform pipeline.
  - Executes with native ESM and Worker Threads via Tinypool.
  - Instant HMR (Hot Module Replacement) for tests: only tests importing modified source files re-execute, running tests up to **10x faster** than Jest.

### 3. Test Doubles Taxonomy: Dummy, Stub, Spy, Mock, and Fake.
**In Simple Words:**
According to Gerard Mes

### 4. Why Mock Service Worker (MSW) is superior to module mocking (Axios/Fetch mocks).
**In Simple Words:**
- **Module Mocking (`jest.mock('axios')`)**:
  - Intercepts code inside your application runtime.
  - Couples tests to the specific HTTP client implementation. If you refactor from `axios` to native `fetch`, all unit tests break!
- **MSW (Mock Service Worker)**:
  - Operates at the network protocol layer via Service Workers in the browser and native `node:http` interceptors in Node.
  - The application actually makes real HTTP requests; MSW intercepts the network packets transparently. Tests verify genuine network behavior without coupling to HTTP library details.

### 5. Testing Library Philosophy: Testing User Behavior vs. Implementation Details.
**In Simple Words:**
Kent C. Dodds' guiding principle: *"The more your tests resemble the way your software is used, the more confidence they can give you."*
**Implementation Details to Avoid:**
- Testing component state variable names (`expect(wrapper.state('isOpen')).toBe(true)`).
- Querying by CSS classnames or internal DOM selectors (`.btn-primary`, `div > span`).
**User Behavior Queries (in priority order):**
1. `getByRole('button', { name: /submit/i })` (reflects screen-reader accessibility tree).
2. `getByLabelText('Email Address')`.
3. `getByPlaceholderText('Search...')`.
4. Fallback: `getByTestId('checkout-form')`.

### 6. Snapshot Testing: Legitimate Use Cases vs. Anti-Patterns.
**In Simple Words:**
- **Anti-Pattern**: Dumping massive 500-line DOM HTML snapshots for entire pages. Developers stop reading diffs and blindly run `jest -u` ("snapshot fatigue"), missing genuine regression bugs.
- **Legitimate Use Cases**:
  - Inline snapshots for small deterministic outputs (e.g. error message format, SQL query generator output).
  - Seriali

### 7. Property-Based Testing vs. Example-Based Testing (fast-check / hypothesis).
**In Simple Words:**
- **Example-Based Testing**: Developer writes 3–4 specific handpicked test cases (e.g. `add(2, 3) === 5`). Often misses weird edge cases like negative

### 8. Mutation Testing: Killing Mutants with Stryker to measure test suite quality.
**In Simple Words:**
High line coverage ($100\%$) is meaningless if tests lack assertions!
**How Mutation Testing Works:**
1. **Mutation**: Stryker modifies your source code by introducing subtle bugs ("mutants")—e.g. changing `>` to `>=`, `+` to `-`, or returning `null`.
2. **Execution**: Runs the test suite against the mutant.
   - If a test fails: Mutant is **Killed** (Good! Test detected the bug).
   - If all tests pass: Mutant **Survived** (Bad! Your test suite missed the mutation).
The **Mutation Score** ($(\text{Mutants Killed} / \text{Total Mutants}) \times 100$) represents true assertion effectiveness.

### 9. Understanding Code Coverage Metrics: Line vs. Branch vs. Path Coverage.
**In Simple Words:**
1. **Line / Statement Coverage**: Percentage of code lines executed during tests. Easily cheated by executing functions without assertions.
2. **Branch Coverage**: Checks if every decision branch (both `true` and `false` branches of `if/else` or `switch` statements) was executed.
3. **Path Coverage**: Checks if every possible combination of execution paths through a function was executed. In functions with multiple loops and conditions, paths grow exponentially ($2^n$).

### 10. Consumer-Driven Contract Testing with Pact for Microservices.
**In Simple Words:**
**The Problem:** End-to-end testing between 50 microservices requires deploying all services in staging, which is brittle, slow, and prone to environmental failures.
**Pact Solution:**
1. The **Consumer** writes unit tests defining expected requests and mock responses. Pact generates a JSON **Contract File (Pact)**.
2. The Pact file is published to the Pact Broker.
3. The **Provider** CI pipeline replays the contracts against its real controller endpoints.
4. If a provider introduces a breaking change (renaming fields, changing data types), the contract verification fails *before* deploying to production.

### 11. Database Testing Strategies: Testcontainers vs. In-Memory SQLite vs. Transaction Rollbacks.
**In Simple Words:**
1. **In-Memory SQLite**: Fast, but lacks PostgreSQL/MySQL specific features (JSONB, full-text search, stored procedures, locking semantics). Gives false confidence.
2. **Transaction Rollbacks**: Tests wrap execution in a DB transaction and trigger `ROLLBACK` in teardown. Fast, but cannot test code that manages its own nested transactions or runs concurrent asynchronous queries.
3. **Testcontainers**: Spawns a real, disposable Docker container running genuine PostgreSQL/Redis during test startup. Highest fidelity, identical to production DB engine.

### 12. Detecting, Quarantining, and Eliminating Flaky Tests.
**In Simple Words:**
A flaky test passes or fails nondeterministically without code changes.
**Top Causes:**
1. **Uncontrolled Clocks**: Relying on `Date.now()` instead of fake system timers.
2. **Async Race Conditions**: Checking DOM state before an async mutation finishes (missing `waitFor`).
3. **Shared State**: Leakage across tests via database rows or global singletons.
**Management Strategy:**
- Automatically rerun failed tests in CI (max 2 retries).
- Quarantine tests with $>2\%$ flakiness out of blocking PR gates into a separate monitoring lane.
- Run flaky tests in a stress loop (`vitest run --repeat 100`) to reproduce race conditions locally.

### 13. Concurrency and Race Condition Testing Strategies.
**In Simple Words:**
Testing concurrent systems:
1. **Thread / Concurrency Stress Testing**: Run identical operations concurrently across 50 threads/promises (e.g. bank balance withdrawal or ticket reservation) to verify atomic database transactions and distributed locks (`Redlock`).
2. **ThreadSaniti

### 14. API Testing with Schema Validation (Zod / JSON Schema).
**In Simple Words:**
Instead of checking a few properties like `expect(res.body.id).toBe(1)`:
- Define runtime schemas using **Zod** or JSON Schema.
- Validate the entire response payload structure:
  `UserSchema.parse(response.body)`.
- Catches accidental schema regressions (e.g. nullable fields returned as undefined, number formatted as string) across all API endpoints automatically.

### 15. TDD (Test-Driven Development) vs. BDD (Behavior-Driven Development).
**In Simple Words:**
- **TDD (Red-Green-Refactor)**:
  1. *Red*: Write a failing unit test defining desired API/behavior.
  2. *Green*: Write minimal code to pass the test.
  3. *Refactor*: Clean up code, remove duplication while keeping tests green.
- **BDD (Behavior-Driven Development)**:
  - Focuses on user-centric behavior using Gherkin syntax (`Given-When-Then`) readable by non-technical product owners (e.g. Cucumber, SpecFlow).
  - *Trade-off*: Adds maintenance overhead; best reserved for critical core domain business rules.

## Part 2: End-to-End Automation (Playwright), Performance & Load Testing (k6) (16 - 30)

### 16. Playwright vs. Cypress: Architectural Comparison and Capabilities.
**In Simple Words:**
- **Cypress**:
  - Runs *inside* the browser tab within an iframe.
  - Bound by browser JavaScript sandbox rules. Historically struggled with multi-tabs, popups, multiple domains, and cross-origin authentication.
- **Playwright (Microsoft)**:
  - Controls browsers out-of-process via the **Chrome DevTools Protocol (CDP)** and native browser debugging sockets across Chromium, Firefox, and WebKit.
  - Native support for multiple browser contexts (isolated incognito sessions in a single browser instance), multiple tabs, file downloads, and parallel execution. Up to **3x faster** than Cypress.

### 17. Playwright Auto-Waiting and Web-First Assertions: Why arbitrary sleep() is an anti-pattern.
**In Simple Words:**
Using `await sleep(3000)` makes tests slow, brittle, and flaky.
**Playwright Auto-Waiting Mechanics:**
Before performing any action (e.g. `page.click('button#submit')`), Playwright automatically verifies actionability checks:
1. Element is attached to the DOM.
2. Element is visible.
3. Element is stable (not animating or transitioning).
4. Element is enabled (not disabled).
5. Element is not obscured by other overlays/modals.
**Web-First Assertions (`expect(locator).toBeVisible()`)**: Automatically poll the DOM until the condition is met or timeout is reached.

### 18. Visual Regression Testing: Pixelmatch, Percy, and Diff Tolerance.
**In Simple Words:**
Visual testing captures DOM screenshots and compares them pixel-by-pixel against approved baseline images.
**Challenges & Solutions:**
1. **Dynamic Content**: Mask timestamps, dynamic user avatars, and random banners using bounding box selectors.
2. **Anti-Aliasing Differences**: Font rendering engines differ between Linux CI runners and macOS local machines. Set a visual diff threshold (e.g. `threshold: 0.2`) or run visual tests inside standardi

### 19. Headless vs. Headed Browser Execution & Artifact Diagnostics.
**In Simple Words:**
- **Headless Mode**: Browser runs without rendering UI to an OS display window. Consumes significantly less CPU and RAM; mandatory in headless Linux CI containers.
- **Headed Mode**: Spawns an actual browser window. Used locally for interactive debugging.
**CI Artifact Diagnostics on Failure:**
Modern pipelines save:
1. Full video recording of the failed test session.
2. Playwright Trace Viewer (`trace.

### 20. Load Testing with k6: Virtual Users (VUs), Stages, and Thresholds.
**In Simple Words:**
**Grafana k6** is a modern Go-based load testing tool with JavaScript test scripting:
- **Virtual Users (VUs)**: Lightweight Go goroutines executing the user journey loop concurrently (far lighter than JVM threads in JMeter).
- **Stages**: Ramp-up, steady state, and ramp-down configuration:
  `stages: [{ duration: '2m', target: 500 }, { duration: '5m', target: 500 }, { duration: '1m', target: 0 }]`.
- **Thresholds**: Strict SLO pass/fail gates in CI:
  `thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<300'] }`.

### 21. Load Testing Types: Stress, Spike, Soak (Endurance), and Breakpoint Testing.
**In Simple Words:**
1. **Smoke Testing**: Minimal load (1–5 VUs) to verify test scripts and endpoints work.
2. **Stress Testing**: Tests system behavior beyond normal peak capacity to assess graceful degradation and error handling.
3. **Spike Testing**: Sudden, massive surge of traffic (e.g. Black Friday sale opening) to test autoscaler response and circuit breakers.
4. **Soak / Endurance Testing**: Sustained medium-to-high load over 12–24 hours to uncover memory leaks, database connection pool exhaustion, or log disk saturation.
5. **Breakpoint Testing**: Ramps traffic continuously until the system completely crashes to identify absolute system limits.

### 22. Distributed Load Testing at Scale with k6 and Locust.
**In Simple Words:**
A single generator machine eventually hits OS socket, CPU, or network bandwidth limits.
**Distributed Execution:**
- **k6 Operator for Kubernetes**: Deploys a custom resource (`K6`) that distributes VUs across multiple worker pods, collecting metrics into a centrali

### 23. Mobile E2E Testing Frameworks: Maestro vs. Appium vs. Detox.
**In Simple Words:**
- **Appium**: Black-box automation based on the W3C WebDriver protocol. Cross-platform, but notoriously slow, flaky, and prone to synchroni

### 24. Automated Accessibility (a11y) Testing with axe-core in CI/CD.
**In Simple Words:**
Accessibility testing ensures web applications are usable by people with disabilities (WCAG 2.1/2.2 standards):
- **axe-core**: Industry-standard accessibility testing engine (developed by Deque).
- Integrated into Playwright / Cypress / Jest:
  `const results = await new AxeBuilder({ page }).analy

### 25. Security Testing: SAST vs. DAST vs. IAST vs. Dependency Scanning.
**In Simple Words:**
1. **SAST (Static Application Security Testing)**: Scans source code without executing it (SonarQube, Semgrep, CodeQL) to detect SQL injection, hardcoded secrets, or insecure crypto.
2. **DAST (Dynamic Application Security Testing)**: Scans running application from the outside (OWASP ZAP, Burp Suite) like an external attacker.
3. **SCA (Software Composition Analysis)**: Scans third-party packages for known CVEs (Snyk, Dependabot, npm audit).
4. **IAST (Interactive Application Security Testing)**: Uses agent instrumentation inside the runtime while running automated functional tests.

### 26. Synthetic Monitoring vs. Real User Monitoring (RUM).
**In Simple Words:**
- **Synthetic Monitoring**: Automated headless browser scripts running on scheduled intervals (every 1–5 minutes) from global edge locations.
  - *Pros*: Detects downtime and checkout flow breakage before real users encounter it; tests in controlled clean environments.
- **RUM (Real User Monitoring)**: JavaScript telemetry agent loaded into actual customer browsers.
  - *Pros*: Captures real-world network latency, device fragmentation, ISP slowdowns, and Core Web Vitals (INP, LCP, CLS).

### 27. Chaos Engineering: Principles and Fault Injection (Chaos Mesh, Gremlin).
**In Simple Words:**
Chaos Engineering proactively injects controlled failures into production or staging systems to verify fault tolerance:
**Core Principles:**
1. Formulate a hypothesis based on steady-state behavior (e.g. *"If the Redis cache dies, checkout latency will increase by $<100\text{ms}$ and error rate will stay $<0.01\%"*).
2. Minimi

### 28. Canary Releases, Blue/Green Deployments, and Automated Rollbacks.
**In Simple Words:**
- **Blue/Green Deployment**: Two identical production environments. Blue is live; Green receives new release. Traffic switches instantly at load balancer. Fast rollback, but requires 2x infrastructure cost.
- **Canary Deployment**: Routes a small percentage ($1\% \rightarrow 5\% \rightarrow 25\% \rightarrow 100\%$) of live traffic to the new version (using service meshes like Istio or Argo Rollouts).
- **Automated Rollback**: Monitoring agents observe error rate (5xx), p99 latency, and crash loops. If metrics degrade, traffic reverts automatically to baseline in seconds.

### 29. CI/CD Test Suite Optimization: Test Sharding and Affected Test Execution.
**In Simple Words:**
As test suites grow from 5 minutes to 1 hour, CI becomes a delivery bottleneck:
1. **Test Sharding**: Splitting the test suite across $N$ parallel CI runners (e.g. `playwright test --shard=1/4`). Reduces total pipeline duration from 40 mins to 10 mins.
2. **Affected / Selective Testing**: Using tools like Nx or Turborepo to analy

### 30. Test Data Management: Factories, Fixtures, and Database Seeding.
**In Simple Words:**
- **Fixtures**: Static JSON data files. Easy to write, but brittle; changes to required schema fields require updating do

