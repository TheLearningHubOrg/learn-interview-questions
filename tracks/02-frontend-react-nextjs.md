# Full-Stack Frontend Master Interview Question Bank: React, Next.js, Modern Web & Core JS (1 - 160)

> Simple, intuitive, and easy-to-explain technical interview questions and deep-dive answers covering React 18 & 19, Next.js App Router, React Server Components (RSC), SSR/SSG/ISR, modern HTML5, CSS3, and JavaScript internals.

---

## Part 1: Intro & Candid Experience (1 - 10)

### 1. Give a brief introduction (keep it candid, not formal).
**In Simple Words:**
"I am a Senior Frontend / Full-Stack Engineer specializing in React, Next.js, TypeScript, and modern web performance. I build scalable web platforms focusing on fast initial page loads, clean component architecture, and modern state management. I enjoy working close to the platform—understanding browser rendering, streaming SSR, and Core Web Vitals."

### 2. What is your role in your current project?
**How to Explain in an Interview:**
- **Architecture**: Designing Next.js App Router routes, separating Server Components from Client Components, and defining caching strategies.
- **Component System**: Building accessible UI components with Tailwind CSS and Radix UI primitives.
- **State & Data**: Managing server cache with TanStack Query and lightweight global UI state with Zustand.
- **Testing & Standards**: Setting up Vitest, React Testing Library, and Playwright E2E tests.

### 3. Any experience building APIs or backend integrations?
**In Simple Words:**
"Yes, I build Full-Stack features regularly."
- In Next.js, I build Route Handlers (`app/api/...`), Server Actions with Zod validation, and Edge Middleware for auth and redirects.
- Outside Next.js, I write REST APIs in Node.js (NestJS, Fastify) and Python (FastAPI), querying PostgreSQL and Redis.

### 4. Did you start with frameworks or core JavaScript?
**In Simple Words:**
"I started with vanilla JavaScript, building DOM apps and understanding prototypes, closures, and the event loop before learning React. Being grounded in core JS makes debugging framework issues and performance bottlenecks straightforward."

### 5. How do you decide between React/Next.js versus Angular?
**In Simple Words:**
- **Choose Next.js/React** for public web apps, SaaS products, and e-commerce where SEO, streaming SSR, rich UI ecosystems, and fast initial page loads are top priorities.
- **Choose Angular** for large corporate teams that require a single, highly opinionated standard (built-in routing, forms, HTTP client, and dependency injection).

### 6. Describe a severe frontend performance issue you resolved.
**How to Explain in an Interview:**
- **Problem**: In a dashboard with live WebSockets, the page experienced severe input lag (high INP) and dropped frames.
- **Root Cause**: High-frequency WebSocket updates were triggering state re-renders across the entire table tree, causing layout thrashing.
- **Fix**: Extracted state into a Zustand store with fine-grained selectors, virtualized the 5,000-row table using TanStack Virtual, and reduced main-thread blocking time from 400ms down to under 16ms.

### 7. How do you collaborate with UI/UX designers and backend engineers?
**In Simple Words:**
- **Designers**: We establish shared Design Tokens in Figma that map directly to Tailwind CSS classes, using Storybook for living component documentation.
- **Backend Engineers**: We agree on OpenAPI / Swagger specs upfront, generating TypeScript types automatically to guarantee type safety between client and server.

### 8. What is your state management philosophy?
**In Simple Words:**
Divide state into 3 clean buckets:
1. **Server Cache**: Managed by Next.js fetch cache or TanStack Query (caching, revalidation, optimistic updates).
2. **URL State**: Managed by query params (`useSearchParams`) for filters, search, and pagination.
3. **Client UI State**: Minimal `useState` / `useReducer`, or Zustand for global UI toggles (modals, sidebar).

### 9. How do you approach automated testing?
**In Simple Words:**
- **Unit & Component**: Vitest and React Testing Library testing user behavior (clicking buttons, reading labels) rather than internal state.
- **API Mocking**: Mock Service Worker (MSW) to test network edge cases.
- **E2E**: Playwright running against production builds in CI for critical user journeys (Login, Checkout).

### 10. Which recent modern web feature has most influenced your code?
**In Simple Words:**
**React Server Components (RSC) and Partial Prerendering (PPR) in Next.js**. They move heavy database queries and parsing libraries to the server, resulting in 0 KB JavaScript sent to the client while keeping the page interactive.

---

## Part 2: HTML5 & Modern Web Semantics (11 - 35)

### 11. What are Semantic HTML elements and why do they matter?
**In Simple Words:**
Semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) clearly describe their purpose to browsers and screen readers.
- **Accessibility**: Screen readers allow visually impaired users to jump directly to `<main>` or `<nav>`.
- **SEO**: Search crawlers understand your page hierarchy and weight content appropriately.

### 12. Difference between `<script>`, `<script async>`, and `<script defer>`:
- `<script>`: Blocks HTML parsing; downloads and runs immediately.
- `<script async>`: Downloads in parallel; runs immediately when ready (can run out of order).
- `<script defer>`: Downloads in parallel; runs only after HTML parsing completes, in document order.

### 13. localStorage vs sessionStorage vs Cookies:
- `localStorage`: 5-10MB, permanent until cleared, client-only.
- `sessionStorage`: 5MB, deleted when browser tab closes, client-only.
- `cookies`: 4KB, sent to server with every HTTP request, supports `HttpOnly` security flag.

### 14. Custom HTML data-* attributes:
Store custom data on HTML elements: `<div data-user-id="42">`. Read in JS via `el.dataset.userId`; style in CSS via `[data-user-id="42"]`.

### 15. Web Workers vs Service Workers:
- **Web Worker**: Runs background CPU calculations on a separate thread without freezing the UI.
- **Service Worker**: Acts as a network proxy between browser and server, enabling offline caching, PWAs, and push notifications.

### 16. Canvas API vs SVG:
- **Canvas (Pixel/Raster)**: Blazingly fast for 60fps animations, thousands of particles, and game rendering.
- **SVG (Vector/DOM)**: Scalable at any resolution, styleable with CSS, accessible; best for icons and UI charts.

### 17. picture tag vs srcset:
`<picture>` allows **art direction** (swapping image crops and modern formats like AVIF based on media queries). `srcset` allows **resolution switching** (browser picks best size based on device pixel density).

### 18. template and slot tags in Web Components:
`<template>` holds inert HTML not rendered until instantiated with JavaScript; `<slot>` defines placeholders inside Shadow DOM where users can inject content.

### 19. CSR vs SSR vs SSG:
- **CSR (Client-Side Rendering)**: Blank HTML; browser JS builds DOM.
- **SSR (Server-Side Rendering)**: Server generates full HTML on every request.
- **SSG (Static Site Generation)**: HTML is pre-rendered at build time and served via CDN.

### 20. ARIA roles, states, and properties:
Provide accessible semantics when standard HTML is insufficient (e.g. `role="dialog"`, `aria-expanded="true"`, `aria-live="polite"`).

### 21. inline vs block vs inline-block:
- `block`: Starts on a new line, takes full width, respects width/height.
- `inline`: Flows within text, ignores width/height and vertical margins.
- `inline-block`: Flows inline with text, but respects width, height, and margins.

### 22. rel="noopener noreferrer" on anchor tags:
When using `target="_blank"`:
- `noopener`: Prevents the new page from accessing `window.opener` (stops reverse tabnabbing attacks).
- `noreferrer`: Hides the `Referer` header from the destination site.

### 23. Why `<!DOCTYPE html>` is required:
It tells the browser to render the page in **Standards Mode** (W3C box model and CSS rules) instead of buggy legacy Quirks Mode.

### 24. Role of `<meta name="viewport">`:
Tells mobile browsers to render the page at the device's real physical screen width rather than zooming out on an emulated 980px desktop view.

### 25. Standard form encoding vs multipart/form-data:
`application/x-www-form-urlencoded` sends text key-value pairs; `multipart/form-data` is mandatory when uploading binary files (images, documents).

### 26. prefetch vs preload vs preconnect:
- `preload`: Tells browser to download a critical resource for the **current** page immediately (e.g. hero font).
- `prefetch`: Low-priority background download for resources needed on the **next** page.
- `preconnect`: Performs early DNS lookup and TLS handshake to an external domain.

### 27. iframe sandboxing vs postMessage:
The `sandbox` attribute restricts iframe permissions; `window.postMessage` allows safe cross-origin messaging by checking `event.origin`.

### 28. Native `<dialog>` element and showModal():
Calling `dialog.showModal()` automatically places the dialog in the browser's top layer, creates a `::backdrop`, traps keyboard focus, and closes on `Esc`.

### 29. Structured Data: Schema.org & JSON-LD:
Format embedded in `<script type="application/ld+json">` that gives search engines structured data about products, reviews, and FAQs for rich search snippets.

### 30. hidden vs display: none vs aria-hidden="true":
- `hidden` and `display: none`: Remove element from visual display and accessibility tree.
- `aria-hidden="true"`: Hides element from screen readers while keeping it visually visible.

### 31. Progressive form enhancement:
Using native HTML5 attributes (`required`, `type="email"`, `pattern`) ensures basic form validation works even if JavaScript fails to load.

### 32. Void (Self-Closing) Elements:
Elements that cannot hold child tags (`<img>`, `<input>`, `<br>`, `<meta>`). In HTML5, `<img />` and `<img>` are treated identically.

### 33. How browser constructs DOM from HTML:
Raw Bytes -> Characters -> Tokens (start/end tag) -> Nodes -> DOM Tree.

### 34. ContentEditable elements pitfalls:
Browser differences when pressing Enter (some insert `<p>`, others `<div>` or `<br>`), messy pasted markup, and difficulty keeping React state synchronized.

### 35. Font loading: FOIT vs FOUT:
- **FOIT (Flash of Invisible Text)**: Browser hides text until custom font finishes downloading.
- **FOUT (Flash of Unstyled Text)**: Browser shows fallback font immediately, then swaps.
- **Fix**: Use `font-display: swap` or Next.js `next/font` which self-hosts fonts and matches fallback metrics.

---

## Part 3: Modern CSS3, Architecture & Performance (36 - 60)

### 36. CSS Box Model: content-box vs border-box:
- `content-box`: `width = content only` (padding and border expand the box).
- `border-box`: `width = content + padding + border` (predictable layout math).

### 37. Flexbox (1D) vs CSS Grid (2D):
Flexbox aligns items along a single row or column; CSS Grid lays out items simultaneously across rows and columns.

### 38. Specificity calculation:
Inline styles (`1,0,0,0`) > IDs (`0,1,0,0`) > Classes/Attributes (`0,0,1,0`) > Elements (`0,0,0,1`).

### 39. CSS Custom Properties vs SCSS Variables:
CSS variables (`var(--primary)`) live in the DOM at runtime and can be updated dynamically with JavaScript; SCSS variables are compiled to fixed values at build time.

### 40. 3 modern ways to center an element:
1. `display: grid; place-items: center;`
2. `display: flex; justify-content: center; align-items: center;`
3. Absolute positioning with `top: 50%; left: 50%; transform: translate(-50%, -50%);`

### 41. CSS units: rem, em, dvh, svh:
`rem` is relative to root font size; `em` is relative to parent font; `dvh` (dynamic viewport height) resizes smoothly as mobile address bars expand and collapse.

### 42. What triggers a Stacking Context beyond z-index?
`opacity < 1`, `transform !== none`, `filter !== none`, `isolation: isolate`.

### 43. CSS Container Queries (@container) vs Media Queries:
Media queries look at the whole browser window; Container queries evaluate the width of the parent component, enabling reusable responsive UI components.

### 44. The :has() relational parent selector:
Allows styling a parent based on its child elements: `form:has(input:invalid) { border: 2px solid red; }`.

### 45. CSS Cascade Layers (@layer):
Allows grouping CSS into explicit precedence layers (`reset`, `framework`, `utilities`) so utility classes always win regardless of selector specificity.

### 46. position: fixed vs sticky:
- `fixed`: Stays in place relative to the viewport.
- `sticky`: Scrolls normally until it reaches a scroll offset, then sticks within its parent container.

### 47. Reflow vs Repaint & Layout Thrashing:
- **Reflow**: Recalculating geometry of elements (expensive).
- **Repaint**: Redrawing colors and pixels without changing layout.
- **Layout Thrashing**: Rapidly interleaving reads and writes to geometry (`offsetWidth` followed by `style.width`).

### 48. Critical Rendering Path (CRP) optimization:
Minimizing render-blocking resources: Inline critical above-the-fold CSS, defer non-critical JS scripts, and optimize fonts.

### 49. CSS content-visibility: auto:
Skips layout and rendering of off-screen elements until the user scrolls near them, dramatically accelerating initial page load.

### 50. Grid repeat(auto-fit, minmax(...)) vs repeat(auto-fill, ...):
`auto-fill` preserves empty column tracks; `auto-fit` collapses empty tracks to expand existing items across the row.

### 51. display: none vs visibility: hidden:
- `display: none`: Removes element from DOM layout and accessibility tree (0px space).
- `visibility: hidden`: Hides element visually, but preserves its occupied space on the page.

### 52. Why CSS transforms and opacity animations are GPU-accelerated:
They bypass the browser's Layout and Paint phases entirely; the browser composites them directly on separate GPU layers.

### 53. How to create a Block Formatting Context (BFC):
Use `display: flow-root`. Contains internal floats and prevents margin collapsing.

### 54. Fluid typography with clamp():
`font-size: clamp(1rem, 2.5vw, 2.5rem);` sets a minimum size of 1rem, scales with 2.5vw, and caps at 2.5rem.

### 55. Pseudo-classes vs Pseudo-elements:
- **Pseudo-classes (`:`)**: State of an element (`:hover`, `:focus`, `:nth-child(2)`).
- **Pseudo-elements (`::`)**: Sub-part of an element (`::before`, `::after`, `::placeholder`).

### 56. CSS Subgrid:
Allows a child grid to inherit the exact row and column tracks of its parent grid, aligning card headers and footers across columns.

### 57. CSS @supports feature query:
Checks browser feature support before applying styles: `@supports (display: grid) { ... }`.

### 58. CSS-in-JS vs Zero-Runtime / Tailwind CSS:
- **Runtime CSS-in-JS (Emotion, Styled-Components)**: Adds JS runtime overhead, causes style recalculations, and is incompatible with React Server Components.
- **Zero-Runtime (Tailwind CSS)**: Pre-compiled static CSS; 0ms runtime cost; 100% RSC compatible.

### 59. Dark mode theming with CSS variables:
Define CSS variables on `:root` and override them inside `@media (prefers-color-scheme: dark)` or `[data-theme="dark"]`.

### 60. CLS prevention with aspect-ratio:
Setting `aspect-ratio: 16 / 9` on image/video containers reserves layout space before media loads, preventing layout shifts.

---

## Part 4: JavaScript Core & Event Loop (61 - 95)

### 61. 7 primitive types and memory allocation:
`string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Primitives are immutable and stored on the stack; Objects are stored on the heap with memory address references on the stack.

### 62. Hoisting and Temporal Dead Zone (TDZ):
`var` is hoisted and initialized with `undefined`. `let` and `const` are hoisted into the TDZ; accessing them before declaration throws `ReferenceError`.

### 63. Loose (==) vs Strict (===) equality:
`==` converts types automatically before comparison; `===` checks both value and type without conversion.

### 64. Execution context and Closures:
An execution context holds variables and `this`. Closures occur when an inner function retains access to its outer lexical scope even after the outer function has returned.

### 65. The "this" keyword rules:
1. `obj.fn()`: `this` is `obj`.
2. Plain function: `this` is `window` (or `undefined` in strict mode).
3. `call`/`apply`/`bind`: Explicitly passed object.
4. Arrow function: Captures `this` from outer lexical scope.

### 66. Event Loop: Microtasks vs Macrotasks:
- **Call Stack**: Executes synchronous code.
- **Microtasks Queue (Promises, queueMicrotask)**: Drains **completely** immediately after the current stack, before rendering.
- **Macrotasks Queue (setTimeout, setInterval, I/O)**: Runs one task per loop cycle.

### 67. Shallow Copy vs Deep Copy:
- **Shallow Copy (`{ ...obj }`)**: Copies only first-level properties; nested objects share the same memory address.
- **Deep Copy (`structuredClone(obj)`)**: Recursively copies all nested objects into new memory.

### 68. Debouncing vs Throttling:
- **Debounce**: Waits for a pause in events before running (search input).
- **Throttle**: Runs at most once every $N$ ms (scrolling, resize).

### 69. Event Bubbling, Capturing, and Delegation:
- **Capturing**: Event travels down from window to target.
- **Bubbling**: Event travels up from target to window.
- **Delegation**: Attaching one listener to a parent element to handle events on dynamic children via `e.target`.

### 70. Proxy and Reflect objects:
`Proxy` intercepts object operations (`get`, `set`); `Reflect` forwards intercepted operations to target objects cleanly. Powers modern reactivity in Vue and MobX.

### 71. Promise.all vs allSettled vs race vs any:
- `Promise.all`: Rejects fast if any promise rejects; succeeds when all resolve.
- `Promise.allSettled`: Waits for all to complete; returns status array of all.
- `Promise.race`: Resolves or rejects as soon as the first promise settles.
- `Promise.any`: Resolves on the first fulfilled promise; rejects only if all fail.

### 72. Map, Set, WeakMap, WeakSet:
`Map` allows keys of any type and preserves order; `Set` stores unique values; `WeakMap`/`WeakSet` accept only objects as keys/values and allow automatic garbage collection.

### 73. Generator Functions:
Functions with `function*` that pause execution using `yield` and resume using `.next()`.

### 74. V8 Hidden Classes & Inline Caching:
V8 optimizes property access by assigning objects with identical property order to shared Hidden Classes (Shapes), enabling fast memory lookups.

### 75. Common causes of Memory Leaks:
Accidental global variables, forgotten timers (`setInterval`), uncleared event listeners on removed DOM elements, and detached closures.

### 76. AbortController API:
Used to cancel fetch requests and DOM listeners: `controller.abort()`.

### 77. WeakRef and FinalizationRegistry:
`WeakRef` creates a reference without preventing garbage collection; `FinalizationRegistry` runs a callback when an object is garbage-collected.

### 78. Polyfill for Array.prototype.map:
```javascript
Array.prototype.myMap = function(cb) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) res[i] = cb(this[i], i, this);
  }
  return res;
};
```

### 79. Flatten nested array recursively:
```javascript
function flatten(arr) {
  return arr.reduce((acc, v) => Array.isArray(v) ? acc.concat(flatten(v)) : acc.concat(v), []);
}
```

### 80. Detect circular references in an object:
```javascript
function isCircular(obj, seen = new WeakSet()) {
  if (obj && typeof obj === 'object') {
    if (seen.has(obj)) return true;
    seen.add(obj);
    for (const k of Object.keys(obj)) {
      if (isCircular(obj[k], seen)) return true;
    }
  }
  return false;
}
```

### 81. Publisher-Subscriber (Event Emitter) Class:
```javascript
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, fn) { (this.events[event] = this.events[event] || []).push(fn); }
  emit(event, ...args) { (this.events[event] || []).forEach(fn => fn(...args)); }
  off(event, fn) { this.events[event] = (this.events[event] || []).filter(l => l !== fn); }
}
```

### 82. Least Recently Used (LRU) Cache:
```javascript
class LRUCache {
  constructor(cap) { this.cap = cap; this.map = new Map(); }
  get(k) {
    if (!this.map.has(k)) return -1;
    const v = this.map.get(k);
    this.map.delete(k);
    this.map.set(k, v);
    return v;
  }
  put(k, v) {
    if (this.map.has(k)) this.map.delete(k);
    else if (this.map.size >= this.cap) this.map.delete(this.map.keys().next().value);
    this.map.set(k, v);
  }
}
```

### 83. Reverse word order and capitalize 3rd letter:
```javascript
function formatSentence(str) {
  return str.trim().split(/\s+/).reverse().map(word => {
    if (word.length < 3) return word;
    return word.slice(0, 2) + word[2].toUpperCase() + word.slice(3);
  }).join(' ');
}
```

### 84. Build nested tree from flat JSON array:
```javascript
function flatToTree(items) {
  const map = new Map(), roots = [];
  items.forEach(i => map.set(i.id, { ...i, children: [] }));
  items.forEach(i => {
    const node = map.get(i.id);
    if (i.parentId && map.has(i.parentId)) map.get(i.parentId).children.push(node);
    else roots.push(node);
  });
  return roots;
}
```

### 85. Character frequency map:
```javascript
function charCount(str) {
  const count = {};
  for (const c of str.toLowerCase()) count[c] = (count[c] || 0) + 1;
  return count;
}
```

### 86. var inside if-block vs let:
`var` is function-scoped and leaks outside the `if` block; `let` remains block-scoped inside the `{}`.

### 87. splice vs slice:
- `splice(start, count)`: Mutates original array and returns removed items.
- `slice(start, end)`: Pure function; returns a shallow copy of the sub-array without modifying original.

### 88. Synchronous vs Asynchronous execution in single-threaded JS:
JS has 1 Call Stack. Async tasks (timers, fetch) are handed to browser Web APIs; when complete, their callbacks join task queues and the Event Loop pushes them to the stack when empty.

### 89. Infinite Currying implementation:
```javascript
function add(a) {
  return function(b) {
    if (b !== undefined) return add(a + b);
    return a;
  };
}
// add(1)(2)(3)() === 6
```

### 90. ES Modules (ESM) vs CommonJS (CJS):
- **ESM (`import`/`export`)**: Static, asynchronous, analyzed at compile time, supports tree-shaking and top-level await.
- **CJS (`require`/`module.exports`)**: Dynamic, synchronous, evaluated at runtime.

### 91. Object.freeze() vs Object.seal():
`freeze()` makes all properties read-only. `seal()` prevents adding or deleting keys, but allows editing existing values.

### 92. Tagged Template Literals:
Allows calling a function with template literals without parentheses: `styled.div` pattern.

### 93. MutationObserver vs legacy DOM mutation events:
`MutationObserver` batches DOM changes asynchronously before rendering, avoiding severe performance degradation of legacy events.

### 94. Floating-point arithmetic errors (0.1 + 0.2 !== 0.3):
Numbers follow IEEE 754 floating-point format (64-bit). Fix: Work in integer cents (`Math.round`) or use BigInt / Decimal libraries for currency.

### 95. INP (Interaction to Next Paint) and scheduler.yield():
INP measures page responsiveness across user clicks. `await scheduler.yield()` pauses long loops, allowing the browser to render frames between chunk processing.

---

## Part 5: React 18 & 19 Architecture, Hooks & State (96 - 130)

### 96. Virtual DOM and React Fiber Architecture:
The Virtual DOM is a lightweight JS tree. Fiber is React's reconciliation engine that breaks rendering into small units of work, allowing React to pause, resume, or abort background renders for urgent user input.

### 97. Core Rules of React Hooks:
1. Only call hooks at the **top level** (never inside loops, conditions, or nested functions).
2. Only call hooks from React function components or custom hooks.

### 98. useState vs useReducer:
- Use `useState` for simple, independent state.
- Use `useReducer` when state transitions are complex, involve multiple sub-values, or when the next state depends heavily on the previous state.

### 99. Lifecycle of useEffect:
Runs after browser paint:
1. Setup: Runs after initial render and when dependencies change.
2. Cleanup: Runs *before* the next effect and upon unmount.
`[]` empty dependency array runs setup on mount and cleanup on unmount.

### 100. useMemo vs useCallback:
- `useMemo(() => compute(), [deps])`: Memoizes the **result of a calculation**.
- `useCallback(fn, [deps])`: Memoizes the **function reference itself** to prevent re-renders of memoized children (`React.memo`).

### 101. useRef primary use cases:
1. Direct DOM access (focusing an input, measuring element size).
2. Storing mutable values that persist across renders without triggering a re-render when modified.

### 102. useLayoutEffect vs useEffect:
- `useLayoutEffect`: Runs synchronously *after* DOM mutations but *before* the browser paints (use only for measuring layout to avoid visual flickering).
- `useEffect`: Runs asynchronously *after* paint; does not block the UI.

### 103. React Context API and preventing consumer re-renders:
Every component consuming a context re-renders whenever the context `value` changes.
**Fix**: Split context into separate State and Dispatch contexts, or memoize value with `useMemo`.

### 104. Controlled vs Uncontrolled components:
- **Controlled**: Form data is handled by React state (`value` + `onChange`).
- **Uncontrolled**: Form data is handled by the DOM itself, accessed via `ref`.

### 105. Custom Hooks vs HOCs:
Custom Hooks extract stateful logic into simple reusable functions without wrapping components or creating deep nesting.

### 106. React Synthetic Events:
React wraps native browser events in cross-browser `SyntheticEvent` instances, delegating listeners to the root DOM container (`#root`).

### 107. React.memo() shallow comparison:
Skips re-rendering a component if its props haven't changed (`prevProps === nextProps`). Wrap function props in `useCallback` to avoid breaking memoization.

### 108. React Error Boundaries:
Components that catch JavaScript errors in their child tree and display a fallback UI. Must currently be class components with `componentDidCatch`.

### 109. Concurrent React: startTransition and useTransition:
Marks state updates as non-urgent transitions (e.g. tab switching) that can be interrupted by urgent user typing:
```typescript
const [isPending, startTransition] = useTransition();
startTransition(() => setFilter(value));
```

### 110. useDeferredValue vs Debouncing:
- Debounce enforces a fixed time delay.
- `useDeferredValue` starts updating immediately in the background, yielding to user clicks automatically.

### 111. React Suspense:
Coordinates declarative loading fallbacks for components that are fetching data or lazy-loaded: `<Suspense fallback={<Spinner />}> <Profile /> </Suspense>`.

### 112. The useId hook:
Generates unique, stable accessibility IDs that are guaranteed identical between server-rendered HTML and client hydration.

### 113. useSyncExternalStore:
Safely subscribes to external non-React state stores (Zustand, browser APIs) in Concurrent React without visual tearing.

### 114. useImperativeHandle and forwardRef:
Customizes the imperative methods exposed to parent components when using `ref`:
```typescript
useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));
```

### 115. React.StrictMode double-invocations:
Intentionally mounts, unmounts, and re-mounts components in development to detect unhandled side-effects and missing cleanups in `useEffect`.

### 116. React 19: useActionState and useFormStatus:
- `useActionState(fn, initial)`: Handles form action execution, pending states, and returned data.
- `useFormStatus()`: Child hook reading whether the parent `<form>` is submitting (`pending`).

### 117. React 19 use() API:
Unwraps Promises and Context directly inside render, even inside conditional blocks and loops.

### 118. React 19 Server Actions:
Async functions defined with `'use server'` that execute on the server, invokable directly from client form actions.

### 119. Eliminating Prop Drilling:
Component composition (passing JSX children), Context API for global preferences, and Zustand for global UI state.

### 120. Automatic State Batching:
React 18+ automatically batches multiple state updates inside promises, timeouts, and native event handlers into a single re-render.

### 121. Debugging infinite re-render loops:
Caused by updating state unconditionally during render or inside a `useEffect` whose dependency array includes the mutated state.

### 122. Custom Hook design for data fetching:
```typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData).finally(() => setLoading(false));
  }, [url]);
  return { data, loading };
}
```

### 123. Component Identity: Element position vs key prop:
React tracks component identity by its position in the tree. To force a complete remount, pass a different `key` prop.

### 124. Why array index as key is an anti-pattern:
If items are reordered or deleted, index keys cause React to preserve child DOM nodes incorrectly, leading to UI input bugs.

### 125. React Portals:
`ReactDOM.createPortal(children, document.body)` renders modals outside parent CSS clipping while preserving React event bubbling.

### 126. Hydration Mismatch in React SSR:
Occurs when server HTML differs from client render (e.g. using `new Date()` or `window`). Fix: Move client-only checks into `useEffect`.

### 127. Zustand vs Redux Toolkit:
- **Zustand**: Minimalist, hook-based, zero boilerplate, no Provider wrapper required.
- **Redux Toolkit**: Structured, opinionated, includes RTK Query; best for large legacy enterprise teams.

### 128. CSS Modules vs Tailwind CSS:
- **CSS Modules**: Scoped standard CSS per file.
- **Tailwind CSS**: Utility-first, zero runtime CSS output, fast design token alignment.

### 129. Virtualizing large lists (TanStack Virtual):
Renders only the DOM nodes currently visible within the viewport window, allowing smooth 60fps scrolling over 100,000+ items.

### 130. Unit testing with React Testing Library:
Query by accessible role and text rather than implementation details: `screen.getByRole('button', { name: /save/i })`.

---

## Part 6: Next.js (App Router & Pages Router), SSR & Full-Stack Patterns (131 - 160)

### 131. App Router (app/) vs Pages Router (pages/):
- **Pages Router**: Page-level routing; data fetching via `getServerSideProps` / `getStaticProps`; client components by default.
- **App Router**: Nested routing with layouts; React Server Components (RSC) by default; streaming SSR; route handlers.

### 132. Server Components (RSC) vs Client Components ('use client'):
- **Server Components (Default)**: Run **only on the server**; 0 KB client bundle size; direct access to database/files; cannot use hooks.
- **Client Components ('use client')**: Hydrated and interactive on client; can use hooks (`useState`, `useEffect`) and browser events.

### 133. Passing Server Components into Client Components:
A Client Component cannot import a Server Component directly. Instead, pass the Server Component as a `children` prop:
`<ClientModal> <ServerDataList /> </ClientModal>`.

### 134. 4 Rendering Strategies: CSR, SSR, SSG, ISR:
- **CSR**: Client-only rendering.
- **SSR**: Server-rendered on every request (`dynamic = 'force-dynamic'`).
- **SSG**: Pre-rendered at build time (`generateStaticParams`).
- **ISR**: Incremental Static Regeneration; static page rebuilt in background after cache expiration.

### 135. Incremental Static Regeneration (ISR):
- **Time-based**: `fetch(url, { next: { revalidate: 60 } })` rebuilds static page after 60 seconds.
- **On-demand**: Triggered via `revalidatePath('/posts')` or `revalidateTag('products')` in a Server Action.

### 136. App Router file conventions:
`layout.tsx` (shared UI, preserves state), `page.tsx` (unique route UI), `loading.tsx` (instant Suspense fallback), `error.tsx` (error boundary), `not-found.tsx` (404 UI).

### 137. layout.tsx vs template.tsx:
`layout.tsx` preserves component state across child navigation; `template.tsx` remounts and creates fresh instance on every navigation.

### 138. Route Handlers (route.ts):
Replaces Pages Router API routes with standard Web Request/Response handlers (`export async function GET()`).

### 139. Next.js Extended fetch API:
- `{ cache: 'force-cache' }`: Cached indefinitely (SSG).
- `{ cache: 'no-store' }`: Fresh fetch on every request (SSR).
- `{ next: { revalidate: 3600 } }`: ISR caching.

### 140. Next.js Middleware:
Runs on the Edge Runtime before a request completes; ideal for auth redirects, bot detection, and header manipulation.

### 141. Route segments: [slug], [...slug], [[...slug]]:
- `[slug]`: Single segment (`/posts/1`).
- `[...slug]`: Catch-all (`/docs/a/b/c`).
- `[[...slug]]`: Optional catch-all (matches `/docs` as well as `/docs/a/b`).

### 142. Route Groups ((group)):
Organizes folders without affecting URL paths (`app/(marketing)/about` -> `/about`). Allows separate root layouts.

### 143. Parallel (@slot) and Intercepting ((.)) Routes:
- **Parallel Routes (`@modal`)**: Renders multiple pages simultaneously within the same layout.
- **Intercepting Routes (`(.)photo/[id]`)**: Intercepts a route to show a modal overlay while preserving direct URL link sharing.

### 144. next/image Core Web Vitals optimization:
Automatically serves modern formats (WebP, AVIF), resizes per device viewport, prevents CLS with intrinsic sizing, and lazy-loads off-screen images.

### 145. next/font optimization:
Self-hosts Google fonts at build time, eliminating external network requests, and automatically injects matching fallback metric overrides to eliminate FOUT.

### 146. Next.js Server Actions with optimistic UI:
Server functions with `'use server'` that execute on server, paired with `useOptimistic` hook to update the UI immediately before server confirmation.

### 147. Streaming SSR with React Suspense:
Streams server HTML in chunks over a single HTTP connection. Fast parts of the page render immediately while slow components stream in later.

### 148. Dynamic vs Static route segment config:
`export const dynamic = 'force-dynamic'` forces SSR on every request; `export const dynamic = 'force-static'` forces static rendering.

### 149. generateStaticParams:
Replaces `getStaticPaths` in App Router, returning an array of slug objects to pre-render at build time.

### 150. generateMetadata for dynamic SEO:
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  return { title: product.name, description: product.description };
}
```

### 151. redirect() vs permanentRedirect():
- `redirect(url)`: Returns a temporary 307 redirect.
- `permanentRedirect(url)`: Returns a permanent 308 redirect, instructing search crawlers to cache the new URL.

### 152. Secure Authentication in Next.js:
Store session tokens in `HttpOnly, Secure, SameSite=Lax` cookies. Verify in Edge Middleware for fast route protection, and re-verify permissions inside Server Actions.

### 153. Partial Prerendering (PPR):
Combines static prerendering and dynamic streaming in the same route: static shell is served instantly from CDN, while dynamic holes wrapped in Suspense stream in from server.

### 154. Node.js Runtime vs Edge Runtime:
- **Node.js Runtime**: Full access to all Node.js APIs (`fs`, native modules).
- **Edge Runtime**: Lightweight V8 isolate engine; sub-millisecond cold starts; limited to Web standard APIs.

### 155. Turbopack vs Webpack:
Turbopack is written in Rust by the creator of Webpack. It compiles incremental changes up to 10x faster by caching function-level computation graphs.

### 156. Environment variable boundaries:
`NEXT_PUBLIC_*` is inlined into client JavaScript bundles at build time. Variables without `NEXT_PUBLIC_` are accessible only on the server runtime.

### 157. server-only package protection:
Importing `import 'server-only'` into a backend data module throws a build-time compiler error if any client component attempts to import it, guaranteeing private secrets never leak into client bundles.

### 158. Internationalized routing (i18n):
Implemented using dynamic root segments: `app/[lang]/page.tsx` with Middleware detecting `Accept-Language` header and redirecting to matching locale.

### 159. Standalone Docker deployment:
Enable `output: 'standalone'` in `next.config.js`. Next.js traces required dependencies and outputs a minimal standalone server container (~80MB instead of ~1GB).

### 160. Monitoring production Core Web Vitals:
Use the built-in `useReportWebVitals` hook to stream real-user metric payloads (LCP, CLS, INP, TTFB) to analytics endpoints or monitoring platforms.
