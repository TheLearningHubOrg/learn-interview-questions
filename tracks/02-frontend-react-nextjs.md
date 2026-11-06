# Full-Stack Frontend Master Interview Question Bank: React, Next.js, Modern Web & Core JS (1 - 160)

> Comprehensive, production-level technical interview questions and deep-dive answers covering React 18 & 19 internals, Next.js App Router & Pages Router, React Server Components (RSC), SSR/SSG/ISR, modern HTML5 semantics, CSS3 layouts, JavaScript event loop, and state management.

---

## Table of Contents
- [Part 1: Intro & Candid Experience (1 - 10)](#part-1-intro--candid-experience-1---10)
- [Part 2: HTML5 & Modern Web Semantics (11 - 35)](#part-2-html5--modern-web-semantics-11---35)
- [Part 3: Modern CSS3, Architecture & Performance (36 - 60)](#part-3-modern-css3-architecture--performance-36---60)
- [Part 4: JavaScript Core, Event Loop & Advanced Patterns (61 - 95)](#part-4-javascript-core-event-loop--advanced-patterns-61---95)
- [Part 5: React 18 & 19 Architecture, Hooks & State (96 - 130)](#part-5-react-18--19-architecture-hooks--state-96---130)
- [Part 6: Next.js (App Router & Pages Router), SSR & Full-Stack Patterns (131 - 160)](#part-6-nextjs-app-router--pages-router-ssr--full-stack-patterns-131---160)

---

## Part 1: Intro & Candid Experience (1 - 10)

### 1. Give a brief introduction (keep it candid, not formal).
**Answer:**
"I am a Senior Frontend and Full-Stack Engineer with deep experience architecting modern web applications using React, Next.js, TypeScript, and Node.js. My career has spanned building scalable SaaS platforms, high-throughput e-commerce storefronts, and internal financial dashboards. I care deeply about real-world user performance—Core Web Vitals, streaming SSR, bundle size discipline, and accessible component architectures. I treat libraries as tools rather than dogmatic religions, focusing on clean separation of concerns and robust API contracts."

### 2. What is your role in your current project? Walk through your day-to-day architecture responsibilities.
**Answer:**
- **System Architecture**: Designing route structures, choosing between Client and Server Components in Next.js, and defining caching topologies (e.g., Tag-based revalidation, edge caching).
- **Design System & Component Library**: Maintaining reusable, accessible UI component primitives with Radix UI, Tailwind CSS, or CSS Modules.
- **Data Fetching & State Layer**: Enforcing server-cache boundaries with TanStack Query or native Next.js fetch cache, paired with lightweight client state stores (Zustand).
- **Quality & Performance**: Setting up automated CI/CD checks (Lighthouse CI, bundle analyzers, Vitest, Playwright E2E suites) and mentoring junior engineers through code reviews.

### 3. Any experience building APIs, server-side code, or backend integrations?
**Answer:**
"Yes, I work across the full stack. In Next.js, I build Route Handlers (`app/api/...`), Server Actions with Zod validation, and Edge Middleware for authentication and geolocation redirects. Outside Next.js, I build REST and GraphQL APIs using Node.js (NestJS, Fastify, Express) and Python (FastAPI), connecting to PostgreSQL using Prisma or Drizzle ORM, and integrating Redis for distributed session caching and rate-limiting."

### 4. Did you start with frameworks or core JavaScript? How comfortable are you writing raw, vanilla JavaScript without libraries?
**Answer:**
"I started with vanilla JavaScript, manipulating the DOM directly, building AJAX request abstractions with `XMLHttpRequest` and Promises, and understanding prototype chains and event delegation. Being comfortable with vanilla JS is critical when debugging library bugs, optimizing rendering bottlenecks, writing performant custom utility libraries, and authoring polyfills without third-party dependencies."

### 5. How do you decide between choosing React (with Vite or Next.js) versus Angular for a greenfield enterprise project?
**Answer:**
- **Choose Next.js / React** when:
  - SEO, fast initial load, and progressive enhancement are critical (e-commerce, public SaaS, content portals).
  - You need flexibility in architectural choices, lightweight state stores, and a massive component ecosystem.
  - The team values full-stack colocation via Server Components and Server Actions.
- **Choose Angular** when:
  - The organization mandates a strictly opinionated, batteries-included standard across hundreds of teams (unified router, HTTP client, forms, dependency injection).
  - Heavy reliance on RxJS streaming and hierarchical dependency injection is standard in company engineering culture.

### 6. Describe a time you encountered a serious frontend performance bottleneck. How did you debug and resolve it?
**Answer:**
"In a real-time trading dashboard, users experienced input lag and dropped frames during market spikes. Using Chrome DevTools Performance Profiler, I identified two issues:
1. **Layout Thrashing**: An interval was reading element geometry (`offsetHeight`) and immediately modifying styles inside a loop. I batched DOM reads and writes using `requestAnimationFrame`.
2. **Excessive React Re-renders**: A high-frequency WebSocket feed was pushing updates into a top-level Context, causing the entire table to re-render. I extracted the subscription into a dedicated Zustand store with fine-grained selectors, virtualized the table using TanStack Virtual, and reduced main-thread blocking time from 480ms to under 16ms."

### 7. How do you approach cross-functional collaboration with UI/UX designers, backend engineers, and product managers?
**Answer:**
- **With Designers**: Establish shared Design Tokens (spacing, color scales, typography) in Figma that map 1:1 to Tailwind or CSS custom properties. Use Storybook for living component documentation.
- **With Backend Engineers**: Agree on OpenAPI / Swagger specs before frontend coding starts. Generate TypeScript types automatically using tools like `openapi-typescript` to ensure end-to-end type safety.
- **With Product Managers**: Break large user stories into iterative vertical slices, define clear acceptance criteria, and surface technical debt or performance constraints transparently.

### 8. What is your preferred state management philosophy in modern applications?
**Answer:**
"Separate state into three distinct buckets:
1. **Server State (Cache)**: Handled by Next.js RSC fetch cache or TanStack Query. Covers caching, re-fetching, pagination, and optimistic updates.
2. **URL State**: Handled by router query parameters (`useSearchParams`). Crucial for filters, search queries, pagination, and shareable links.
3. **Client UI State**: Minimalist local state (`useState` / `useReducer`). If global UI state is necessary (e.g., sidebar collapse, multi-step modal state), use a lightweight store like Zustand over heavy boilerplate stores like legacy Redux."

### 9. How do you approach automated testing across large-scale frontend repositories?
**Answer:**
- **Unit & Component Testing**: Use Vitest and React Testing Library following the user-centric testing philosophy (query by role, label, and text rather than implementation details or CSS selectors).
- **Integration Testing**: Test complex flows (forms with validation, multi-step checkout) with mocked network layers using MSW (Mock Service Worker).
- **End-to-End Testing**: Playwright running against production builds in CI pipelines to test critical business user journeys (Authentication, Payment, Core Dashboard workflows).

### 10. Which modern web platform feature or framework update has most influenced your recent code?
**Answer:**
"**React Server Components (RSC) and Partial Prerendering (PPR) in Next.js**. They represent a paradigm shift: moving heavy data transformations, database querying, and large parsing libraries (like markdown or date parsers) entirely to the server, resulting in 0 KB client bundle overhead for those components while retaining instant interactive islands on the client."

---

## Part 2: HTML5 & Modern Web Semantics (11 - 35)

### 11. What are Semantic HTML elements, and why are they critical for accessibility (a11y) and SEO?
**Answer:**
Semantic elements clearly describe their meaning to both browser and developer (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`).
- **Accessibility**: Screen readers build a landmark navigation map, enabling visually impaired users to jump directly to `<main>` or `<nav>` via keyboard shortcuts.
- **SEO**: Search engine crawlers parse page hierarchy accurately, weighting headings (`<h1>` - `<h6>`) and `<article>` content higher for search indexing.

### 12. Explain the exact behavioral differences between `<script>`, `<script async>`, and `<script defer>`.
**Answer:**
| Tag | Download | Execution Timing | Execution Order |
| :--- | :--- | :--- | :--- |
| `<script>` | Blocks HTML parsing | Immediately (blocks parsing until done) | In document order |
| `<script async>` | In parallel with HTML parsing | Immediately upon download completion (interrupts parsing) | Out of order (first downloaded, first executed) |
| `<script defer>` | In parallel with HTML parsing | After HTML parsing finishes, before `DOMContentLoaded` | Guaranteed in document order |

### 13. What is the difference between localStorage, sessionStorage, and Cookies?
**Answer:**
- `localStorage`: ~5-10MB, persistent indefinitely until explicitly cleared, accessible only via client JavaScript.
- `sessionStorage`: ~5MB, scoped to the current browser tab lifecycle; destroyed when tab closes.
- `Cookies`: ~4KB, sent automatically with every matching HTTP request to the server, support security flags (`HttpOnly` prevents JS access, `Secure` enforces HTTPS, `SameSite` prevents CSRF).

### 14. What are custom HTML data-* attributes, and how do you access them via JavaScript and CSS?
**Answer:**
Allow storing extra custom data on standard HTML elements:
- In HTML: `<button data-user-id="101" data-role="admin">Click</button>`
- In JS: `btn.dataset.userId; // '101'`
- In CSS: `button[data-role="admin"] { border: 2px solid red; }`

### 15. How do Web Workers differ from Service Workers in modern web applications?
**Answer:**
- **Web Worker**: Runs background scripts on a separate thread to handle intensive CPU operations (crypto, image crunching) without freezing the UI thread. Cannot intercept network traffic.
- **Service Worker**: Acts as a programmable network proxy between browser, web application, and network. Runs in background even when page is closed; enables offline caching, PWAs, push notifications, and background sync.

### 16. Compare the HTML Canvas API vs SVG: when should you choose one over the other?
**Answer:**
- **Canvas (Raster / Pixel-based)**: High performance for high-frequency updates, thousands of interactive objects, video frame manipulation, and 3D games (WebGL). Lacks DOM nodes and built-in accessibility.
- **SVG (Vector / DOM-based)**: Resolution-independent at any zoom level, styled via CSS, accessible via screen readers, ideal for charts, UI icons, and interactive infographics with few DOM nodes.

### 17. Explain the purpose and syntax of the `<picture>` element versus using `<img>` with `srcset` and `sizes`.
**Answer:**
- `<img>` with `srcset` & `sizes`: Resolution switching. Provides multiple pixel densities of the **same image** for the browser to choose based on viewport width and display DPR.
- `<picture>`: Art direction. Allows serving **different crops, aspect ratios, or modern formats (AVIF, WebP)** depending on media queries:
```html
<picture>
  <source media="(max-width: 600px)" srcset="mobile-square.avif" type="image/avif">
  <source srcset="desktop-wide.webp" type="image/webp">
  <img src="fallback.jpg" alt="Hero Banner" loading="lazy">
</picture>
```

### 18. What are HTML `<template>` and `<slot>` elements, and how are they used in Web Components?
**Answer:**
- `<template>`: Inert markup that the browser parses but does not render or execute until instantiated via JavaScript (`template.content.cloneNode(true)`).
- `<slot>`: Defines placeholder insertion points inside a Shadow DOM where consumers can project external light DOM content.

### 19. Explain the difference between CSR, SSR, and SSG from an HTML document delivery perspective.
**Answer:**
- **CSR**: Server returns an empty HTML shell (`<div id="root"></div>`) and JavaScript bundle. Browser downloads JS, executes it, calls APIs, and builds DOM.
- **SSR**: Server generates full HTML on every single HTTP request and streams it to the browser. Fast TTFB and complete SEO.
- **SSG**: Full HTML is rendered ahead-of-time during build and hosted statically on CDNs. Fastest response time.

### 20. How do ARIA roles, states, and properties improve screen reader accessibility?
**Answer:**
Accessible Rich Internet Applications (ARIA) provide semantic metadata when native HTML cannot:
- `role="dialog"` or `role="alert"` announces element purpose.
- `aria-expanded="true/false"` announces toggle state.
- `aria-live="polite"` announces dynamic content updates without interrupting current speech.

### 21. What is the difference between inline, block, and inline-block display modes in HTML?
**Answer:**
- `block`: Starts on a new line, takes full available container width, respects `width`, `height`, `margin`, and `padding`.
- `inline`: Flows along with text, ignores `width`, `height`, and vertical margins.
- `inline-block`: Flows inline with surrounding content, but respects `width`, `height`, and all margins/paddings.

### 22. What are rel="noopener" and rel="noreferrer" attributes on anchor tags?
**Answer:**
When using `target="_blank"`:
- `noopener`: Prevents the new page from accessing `window.opener`, protecting against reverse tabnabbing security attacks.
- `noreferrer`: Includes `noopener` and additionally prevents the browser from sending the `Referer` header to the destination URL.

### 23. How does the browser determine rendering quirks mode versus standards mode using `<!DOCTYPE html>`?
**Answer:**
Without a valid `<!DOCTYPE html>` declaration at the top of an HTML document, browsers fall back to **Quirks Mode** (emulating bugs of Netscape 4 and IE5). Including `<!DOCTYPE html>` enforces **Standards Mode** (W3C standard box model and CSS rules).

### 24. What is the role of the `<meta name="viewport">` tag in mobile responsive rendering?
**Answer:**
`<meta name="viewport" content="width=device-width, initial-scale=1.0">`:
Tells mobile browsers to render the page at the device's actual physical screen width rather than defaulting to an emulated 980px desktop viewport and zooming out.

### 25. What are the key differences between standard forms and multipart/form-data encoding types?
**Answer:**
- `application/x-www-form-urlencoded` (Default): Key-value pairs joined with `&` and URL-encoded. Suitable for plain text data.
- `multipart/form-data`: Divides data into distinct mime boundaries. Mandatory when uploading binary files (images, PDFs) alongside form fields.

### 26. How does the browser prefetch, preload, and preconnect resources via `<link rel="...">`?
**Answer:**
- `preload`: Tells browser to download a high-priority resource needed on the **current** page (hero fonts, LCP image).
- `prefetch`: Low-priority background download of resources likely needed on the **next** user navigation.
- `preconnect`: Initiates early DNS lookup, TCP handshake, and TLS negotiation to an external origin before requesting resources.

### 27. What is the difference between iframe sandboxing attributes and postMessage communication security?
**Answer:**
- `sandbox` attribute: Restricts iframe permissions (`allow-scripts`, `allow-same-origin`, `allow-forms`).
- `window.postMessage(data, targetOrigin)`: Enables secure cross-origin communication. Security requires verifying `event.origin` on the receiver side before trusting payloads.

### 28. How do native HTML dialog elements (`<dialog>`) handle accessibility and backdrop layering via showModal()?
**Answer:**
Calling `dialog.showModal()` automatically:
- Renders the dialog in the browser's native **Top Layer** (above all `z-index` stacks).
- Renders a styleable `::backdrop` overlay.
- Enforces focus trapping and closes on `Esc` key press natively.

### 29. What are microdata, Schema.org schemas, and JSON-LD?
**Answer:**
Structured data formats that provide search engines with explicit information about page entities (Products, Reviews, Articles, FAQ). Modern best practice uses **JSON-LD** embedded in a `<script type="application/ld+json">` tag.

### 30. What is the difference between the hidden attribute, CSS display: none, and aria-hidden="true"?
**Answer:**
- `hidden` attribute: Native HTML boolean attribute behaving identically to `display: none`.
- `display: none`: Removes element from visual rendering and accessibility tree.
- `aria-hidden="true"`: Hides element from screen readers while keeping it visually visible in the DOM.

### 31. Progressive form enhancement with native HTML5 input validation.
**Answer:**
Using attributes like `required`, `pattern="[0-9]{5}"`, `min`, `max`, `type="email"` provides built-in browser validation before JavaScript executes, paired with `:valid` and `:invalid` CSS pseudo-classes.

### 32. Void (Self-Closing) Elements in HTML5.
**Answer:**
Elements that cannot have child nodes or closing tags: `<input>`, `<img>`, `<br>`, `<hr>`, `<meta>`, `<link>`. In HTML5, writing `<img />` or `<img>` is treated identically.

### 33. How does the browser construct the DOM from raw HTML bytes?
**Answer:**
Bytes -> Characters -> Tokens (start tag, end tag) -> Nodes -> DOM Tree. Parsing occurs incrementally as network chunks arrive.

### 34. ContentEditable elements and rich-text editor pitfalls.
**Answer:**
`<div contenteditable="true">` allows direct typing into DOM elements. Pitfalls: Inconsistent cross-browser DOM mutations on Enter/Backspace (some insert `<div>`, others `<p>` or `<br>`), messy pasted markup, and difficulty maintaining single-source-of-truth state.

### 35. Font loading optimization: FOIT vs FOUT.
**Answer:**
- **FOIT (Flash of Invisible Text)**: Browser hides text until custom font finishes downloading.
- **FOUT (Flash of Unstyled Text)**: Browser shows fallback font immediately, then swaps.
- **Solution**: Use `font-display: swap` in `@font-face` or Next.js `next/font` which self-hosts fonts and inlines critical font fallbacks with matching metric overrides.

---

## Part 3: Modern CSS3, Architecture & Performance (36 - 60)

### 36. CSS Box Model: content-box vs border-box.
- `box-sizing: content-box`: Declared `width` applies only to content. Padding and borders expand the box size outwards.
- `box-sizing: border-box`: Declared `width` includes content, padding, and border. Highly predictable for layouts.

### 37. Flexbox (1D) vs CSS Grid (2D).
- Flexbox: Lays out items along a single axis (row or column). Ideal for navbars, button groups, and fluid dynamic item flows.
- Grid: Lays out items simultaneously across rows and columns. Ideal for overall page layouts and complex cards dashboards.

### 38. Specificity calculation across selectors.
Calculated as: `(Inline styles, IDs, Classes/Attributes/Pseudo-classes, Elements/Pseudo-elements)`.
Example: `#nav .menu li a:hover` = `0, 1, 2, 2`.

### 39. CSS Custom Properties vs Sass/SCSS variables.
- CSS Variables (`var(--color)`): Live in the DOM at runtime, react to DOM cascades and media queries, readable and writable via JavaScript (`setProperty`).
- Sass Variables (`$color`): Evaluated statically at build time; compiled to fixed static values.

### 40. 3 distinct modern ways to center an element.
```css
/* Method 1: Flexbox */
.container { display: flex; justify-content: center; align-items: center; }

/* Method 2: Grid */
.container { display: grid; place-items: center; }

/* Method 3: Margin Auto in Grid/Flexbox */
.container { display: flex; }
.child { margin: auto; }
```

### 41. CSS units comparison: rem, em, dvh, svh, lvh.
- `rem`: Relative to root `<html>` font size (default 16px). Consistent across document.
- `em`: Relative to immediate parent element's font size.
- `dvh` (Dynamic Viewport Height): Adapts dynamically as mobile address bars expand and collapse.
- `svh` (Small Viewport Height): Height when address bar is fully visible.
- `lvh` (Large Viewport Height): Height when address bar is retracted.

### 42. Stacking Context triggers beyond z-index.
Triggered by: `opacity < 1`, `transform !== none`, `filter !== none`, `clip-path`, `perspective`, `isolation: isolate`, or `contain: paint`.

### 43. CSS Container Queries (@container) vs Media Queries.
Media queries evaluate overall viewport dimensions. Container queries evaluate the width of the parent component:
```css
.card-container { container-type: inline-size; }
@container (min-width: 400px) {
  .card { display: flex; flex-direction: row; }
}
```

### 44. The :has() relational parent selector.
Enables styling a parent or preceding sibling based on descendant state:
`form:has(input:invalid) { border: 2px solid red; }`
`figure:has(figcaption) { padding-bottom: 1rem; }`

### 45. CSS Cascade Layers (@layer).
Allows grouping CSS into explicit precedence tiers regardless of specificity:
```css
@layer reset, framework, components, utilities;
```
Selectors in `@layer utilities` always override `@layer framework`, eliminating `!important` specificity wars.

### 46. position: fixed vs position: sticky.
- `fixed`: Placed relative to the viewport; completely removed from normal flow.
- `sticky`: Acts like `relative` until scrolling passes its threshold, then sticks within its parent container. Will fail if any ancestor has `overflow: hidden`.

### 47. Reflow vs Repaint & Layout Thrashing.
- **Reflow**: Recalculating element positions and geometry (caused by reading/writing `offsetWidth`, changing fonts, adding DOM nodes).
- **Repaint**: Redrawing pixels on screen without altering geometry (`color`, `background-color`).
- **Layout Thrashing**: Interleaving reads and writes to geometry properties inside a loop, forcing repeated synchronous layout passes.

### 48. Critical Rendering Path (CRP) optimization.
Minimizing render-blocking resources: Inline critical above-the-fold CSS, asynchronously load non-critical stylesheets (`media="print"` trick), defer JavaScript execution, and optimize web fonts.

### 49. CSS content-visibility property.
`content-visibility: auto`: Directs the browser rendering engine to skip layout and painting for off-screen elements until the user scrolls near them, dramatically speeding up initial rendering on long pages.

### 50. Grid repeat(auto-fit, minmax(...)) vs repeat(auto-fill, ...).
- `auto-fill`: Allocates as many column tracks as can fit, leaving empty tracks if items do not fill the row.
- `auto-fit`: Drops empty tracks and expands the remaining items to fill the entire row width.

### 51. display: none vs visibility: hidden.
- `display: none`: Removes element from layout calculation and accessibility tree; occupies 0px.
- `visibility: hidden`: Hides element visually, but preserves its exact width and height footprint in document flow.

### 52. Why CSS transforms and opacity animations are GPU-accelerated.
They bypass the browser's Layout and Paint stages entirely. The browser creates a distinct GPU compositor layer and delegates rendering to the graphics processor.

### 53. Block Formatting Context (BFC) creation.
Established by: `display: flow-root` (modern standard), `overflow: hidden`, `float: left/right`, or `display: flex/grid`. Prevents margin collapsing and clears internal floats.

### 54. Fluid typography using clamp().
`font-size: clamp(1rem, 2.5vw, 2.5rem);`:
Sets a minimum font size of 1rem, a fluid viewport scaling rate of 2.5vw, and a maximum ceiling of 2.5rem.

### 55. CSS pseudo-classes vs pseudo-elements.
- **Pseudo-classes (`:`)**: Target elements in specific states (`:hover`, `:focus`, `:nth-child(2)`, `:is()`).
- **Pseudo-elements (`::`)**: Style specific sub-parts of an element (`::before`, `::after`, `::placeholder`, `::backdrop`).

### 56. CSS Subgrid.
Allows a nested child grid to adopt and align directly with the row and column tracks of its parent grid (`grid-template-columns: subgrid;`), ensuring card headers and footers across different cards align horizontally.

### 57. CSS @supports feature query.
Enables progressive enhancement by checking browser CSS support:
```css
@supports (display: grid) {
  .container { display: grid; }
}
```

### 58. Performance trade-offs: CSS-in-JS vs Zero-Runtime / Utility CSS.
- **Runtime CSS-in-JS (Styled-Components, Emotion)**: Incurs JavaScript runtime overhead, parses CSS strings on the client, generates dynamic `<style>` tags causing style re-evaluations, and is incompatible with React Server Components.
- **Zero-Runtime (Tailwind CSS, Vanilla Extract)**: Pre-compiled at build time into pure static CSS files; 0ms client runtime overhead; full RSC compatibility.

### 59. Clean dark mode theming with CSS variables.
```css
:root {
  --bg: #ffffff;
  --text: #09090b;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #09090b;
    --text: #fafafa;
  }
}
[data-theme="dark"] {
  --bg: #09090b;
  --text: #fafafa;
}
```

### 60. Cumulative Layout Shift (CLS) prevention with aspect-ratio.
Reserving container dimensions using `aspect-ratio: 16 / 9` prevents elements from collapsing to 0px before images or video embeds load, completely eliminating layout shifting.

---

## Part 4: JavaScript Core, Event Loop & Advanced Patterns (61 - 95)

### 61. 7 primitive data types and memory allocation.
Primitives: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`.
Primitives are stored directly on the Stack (or in immutable V8 heap slots for large strings). Reference types (Objects, Arrays) allocate mutable data on the Heap, while variables store only memory address pointers on the Stack.

### 62. Hoisting and Temporal Dead Zone (TDZ).
- `var`: Hoisted to top of function scope and initialized with `undefined`.
- `let` and `const`: Hoisted into block scope, but uninitialized. The phase between scope entry and declaration line execution is the TDZ; accessing variables here throws `ReferenceError`.
- `function declarations`: Fully hoisted with implementation.

### 63. Loose (==) vs Strict (===) equality & coercion.
- `==`: Converts operands to a common type before comparison (e.g., `'0' == 0` is true; `null == undefined` is true).
- `===`: Returns true only if both value and type are identical (`'0' === 0` is false).

### 64. Execution context, Call Stack, and Closures.
Every function call creates an Execution Context containing Variable Environment, Lexical Environment, and `this` binding. Closures occur when an inner function retains a reference to its outer lexical scope via `[[Environment]]` even after the outer function's execution context has popped off the Call Stack.

### 65. The "this" keyword binding rules.
1. **Default**: Window (or `undefined` in strict mode).
2. **Implicit**: Object left of the invocation dot (`user.getName()`).
3. **Explicit**: Forced via `.call()`, `.apply()`, or `.bind()`.
4. **New**: Newly instantiated object in `new Constructor()`.
5. **Lexical**: Arrow functions do not bind `this`; they capture `this` from enclosing scope.

### 66. JavaScript Event Loop: Microtasks vs Macrotasks.
- **Call Stack**: Executes synchronous code.
- **Microtask Queue**: Resolved Promises, `queueMicrotask`, `MutationObserver`. Drained completely after every stack completion before UI rendering.
- **Macrotask Queue**: `setTimeout`, `setInterval`, `setImmediate`, I/O. One task processed per Event Loop tick.

### 67. Shallow copy vs Deep copy.
- **Shallow Copy**: `{ ...obj }` or `Object.assign()`. Clones only primitive values; nested objects share the same memory reference.
- **Deep Copy**: Clones all nested levels. Achieved using `structuredClone(obj)` natively or recursive traversal with `WeakMap`.

### 68. Debouncing and Throttling implementation.
```typescript
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle<T extends (...args: any[]) => void>(fn: T, limit: number) {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### 69. Event Bubbling, Capturing, and Delegation.
Events propagate in 3 phases: Capturing (down from `window` to target) -> Target phase -> Bubbling (up from target to `window`).
**Event Delegation**: Attaching 1 listener to parent container:
```javascript
table.addEventListener('click', (e) => {
  const btn = e.target.closest('button.delete-btn');
  if (btn) handleDelete(btn.dataset.id);
});
```

### 70. Proxy and Reflect objects.
`Proxy` wraps an object to intercept core operations (`get`, `set`, `has`). Modern frameworks (Vue 3, MobX) use Proxies to track property access and trigger fine-grained reactivity:
```javascript
const user = new Proxy({ name: 'Alex' }, {
  get(target, prop, receiver) {
    console.log(`Accessing ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  }
});
```

### 71. Promise combinators comparison.
- `Promise.all`: Resolves array of results when all fulfill; rejects immediately on first rejection.
- `Promise.allSettled`: Always waits for all promises; returns array of `{ status: 'fulfilled'|'rejected', value/reason }`.
- `Promise.race`: Resolves or rejects as soon as the first promise settles.
- `Promise.any`: Resolves on the first fulfilled promise; rejects with `AggregateError` only if all reject.

### 72. Map, Set, WeakMap, and WeakSet.
- `Map`: Keys can be any type; preserves insertion order; `.size`.
- `Set`: Unique values; fast lookup.
- `WeakMap` / `WeakSet`: Keys must be objects; held weakly without blocking garbage collection; not iterable; no `.size`.

### 73. Generator Functions (`function*`).
Functions that pause execution via `yield` and resume via `.next()`. Used in custom iterables, state machines, and streaming pipelines.

### 74. V8 Hidden Classes & Inline Caching.
V8 creates internal Hidden Classes (Shapes) based on property assignment order. Initializing properties in identical order allows V8 to bypass expensive hash table lookups via Inline Caches.

### 75. Common causes of JavaScript Memory Leaks.
1. Uncleared `setInterval` or `setTimeout`.
2. Forgotten event listeners on removed DOM elements.
3. Detached DOM trees held by JavaScript variables.
4. Closures inadvertently retaining large outer objects.

### 76. AbortController API usage.
Cancels fetch requests and DOM listeners cleanly:
```javascript
const controller = new AbortController();
fetch('/api/search', { signal: controller.signal });
// Later, to cancel:
controller.abort();
```

### 77. WeakRef and FinalizationRegistry.
- `WeakRef`: Holds a weak reference to an object, dereferenced via `ref.deref()`.
- `FinalizationRegistry`: Triggers a cleanup callback when a registered object is garbage-collected.

### 78. Polyfills for Array.prototype.map and reduce.
```javascript
Array.prototype.myMap = function(cb, thisArg) {
  const res = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) res[i] = cb.call(thisArg, this[i], i, this);
  }
  return res;
};
```

### 79. Flatten nested array recursively.
```javascript
function flattenArray(arr) {
  let result = [];
  for (const item of arr) {
    if (Array.isArray(item)) result.push(...flattenArray(item));
    else result.push(item);
  }
  return result;
}
```

### 80. Detect circular references in an object.
```javascript
function isCircular(obj) {
  const visited = new WeakSet();
  function check(val) {
    if (val !== null && typeof val === 'object') {
      if (visited.has(val)) return true;
      visited.add(val);
      for (const key of Object.keys(val)) {
        if (check(val[key])) return true;
      }
    }
    return false;
  }
  return check(obj);
}
```

### 81. Publisher-Subscriber (Event Emitter) Class.
```typescript
class EventEmitter {
  private events = new Map<string, Function[]>();

  on(event: string, fn: Function) {
    const list = this.events.get(event) || [];
    list.push(fn);
    this.events.set(event, list);
    return () => this.off(event, fn);
  }

  off(event: string, fn: Function) {
    const list = this.events.get(event);
    if (!list) return;
    this.events.set(event, list.filter(cb => cb !== fn));
  }

  emit(event: string, ...args: any[]) {
    const list = this.events.get(event);
    if (list) list.forEach(cb => cb(...args));
  }
}
```

### 82. Least Recently Used (LRU) Cache in JavaScript.
```javascript
class LRUCache {
  constructor(limit) {
    this.limit = limit;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.limit) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}
```

### 83. Live Coding: Reverse word order and capitalize 3rd letter of each word without replace().
```javascript
function formatSentence(str) {
  return str.trim().split(/\s+/).reverse().map(word => {
    if (word.length < 3) return word;
    return word.slice(0, 2) + word[2].toUpperCase() + word.slice(3);
  }).join(' ');
}
```

### 84. Live Coding: Build nested tree hierarchy from flat JSON array.
```javascript
function flatToTree(items) {
  const map = new Map();
  const roots = [];
  items.forEach(item => map.set(item.id, { ...item, children: [] }));
  items.forEach(item => {
    const node = map.get(item.id);
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}
```

### 85. Live Coding: Character frequency map (case-insensitive).
```javascript
function charCount(str) {
  const count = {};
  for (const c of str.toLowerCase()) {
    count[c] = (count[c] || 0) + 1;
  }
  return count;
}
```

### 86. Output prediction: Scope evaluation of var inside if-block vs let.
`var` is function-scoped; it leaks out of `if` blocks into the enclosing function or global scope. `let` and `const` remain block-scoped.

### 87. Output prediction: splice vs slice.
- `splice(start, count)`: Mutates the original array and returns removed items.
- `slice(start, end)`: Pure function; returns a shallow copy of the sub-array without modifying original.

### 88. Synchronous vs Asynchronous execution under single-threaded model.
JavaScript has one Call Stack. Asynchronous tasks (timers, fetch) are delegated to the browser runtime (Web APIs). When finished, their callbacks are pushed to task queues and picked up by the Event Loop once the Call Stack is empty.

### 89. Infinite Currying implementation.
```javascript
function add(a) {
  return function(b) {
    if (b !== undefined) return add(a + b);
    return a;
  };
}
// add(1)(2)(3)() === 6
```

### 90. ES Modules (ESM) vs CommonJS (CJS).
- ESM (`import` / `export`): Static, asynchronous, analyzed at compile-time, supports tree-shaking and top-level await.
- CJS (`require` / `module.exports`): Dynamic, synchronous, evaluated at runtime, default in older Node.js.

### 91. Object.freeze() vs Object.seal().
`Object.freeze()` makes all existing properties immutable and read-only. `Object.seal()` prevents adding or deleting keys, but allows editing existing writable property values.

### 92. Tagged Template Literals.
Allows parsing template literals with a custom function:
```javascript
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => `${acc}${str}<strong>${values[i] || ''}</strong>`, '');
}
```

### 93. MutationObserver vs legacy DOM mutation events.
`MutationObserver` batches DOM tree changes asynchronously before rendering, avoiding severe performance degradation of legacy synchronous DOM events.

### 94. Floating-point arithmetic errors (0.1 + 0.2 !== 0.3).
Numbers follow IEEE 754 double-precision format (64-bit). Decimals like 0.1 have repeating binary fractions. Fix: Use integer cents (`Math.round`), `Number.EPSILON`, or `BigInt` / Decimal libraries for currency.

### 95. Interaction to Next Paint (INP) and scheduler.yield().
INP tracks worst interaction latency across the entire page visit. Yielding the main thread via `await scheduler.yield()` splits long loops, allowing the browser to render frames between chunk processing.

---

## Part 5: React 18 & 19 Architecture, Hooks & State (96 - 130)

### 96. Virtual DOM and React Fiber Architecture.
The Virtual DOM is an in-memory lightweight representation of the UI. Fiber is React's reconciliation engine that rewrote React into a cooperative scheduler: it breaks rendering work into incremental units, allowing React to pause, abort, or prioritize high-priority user interactions over background updates.

### 97. Core Rules of React Hooks.
1. Only call hooks at the **top level** of components or custom hooks (never inside loops, conditions, or nested functions).
2. Only call hooks from React function components or custom hooks.
Reason: React relies on the call order of hooks across re-renders to match up internal linked list state cells.

### 98. useState vs useReducer.
- Use `useState` for simple, independent primitive or single-object state.
- Use `useReducer` when state transitions are complex, involve multiple sub-values, or when the next state depends heavily on the previous state.

### 99. Lifecycle of useEffect.
Runs after paint.
1. Setup: Runs after initial render and when dependencies change.
2. Cleanup: Runs *before* the component re-executes the effect on dependency change, and upon component unmount.
Empty dependency array `[]` runs setup once on mount and cleanup once on unmount.

### 100. useMemo vs useCallback.
- `useMemo(() => computeValue(a, b), [a, b])`: Memoizes the **result of a calculation**.
- `useCallback(fn, deps)`: Memoizes the **function reference itself** to prevent re-renders of memoized child components (`React.memo`).
Premature memoization wastes memory and adds comparison overhead for cheap operations.

### 101. useRef primary use cases.
1. Direct DOM manipulation (focusing an input, measuring element size, scrolling).
2. Storing mutable values that persist across re-renders without triggering a component re-render when modified (e.g., timer IDs).

### 102. useLayoutEffect vs useEffect.
- `useLayoutEffect`: Runs synchronously *after* DOM mutations but *before* the browser paints the screen. Use only when calculating DOM measurements to avoid visual flickering.
- `useEffect`: Runs asynchronously *after* browser paint; does not block the UI.

### 103. React Context API and preventing consumer re-renders.
Every component consuming a Context via `useContext(MyContext)` re-renders whenever the context `value` changes.
**Prevention**: Split context into separate State and Dispatch contexts, or memoize context value with `useMemo`.

### 104. Controlled vs Uncontrolled components.
- **Controlled**: Form data is handled by React state (`value={name}` + `onChange={e => setName(e.target.value)}`). Single source of truth.
- **Uncontrolled**: Form data is handled by the DOM itself, accessed imperatively via `ref`.

### 105. HOCs & Render Props vs Custom Hooks.
Higher-Order Components and Render Props caused deep component nesting ("wrapper hell"). Custom Hooks extract stateful logic cleanly into reusable JavaScript functions without modifying component hierarchy.

### 106. React Synthetic Events & Event Delegation in React 17+.
React wraps native browser events in cross-browser `SyntheticEvent` instances. Prior to React 17, React attached listeners to `document`. In React 17+, event listeners attach to the root DOM container (`#root`), enabling multiple React root apps to coexist safely.

### 107. React.memo() shallow comparison.
`React.memo` wraps a component, skipping re-rendering if its props are shallowly equal (`prevProps[key] === nextProps[key]`). If passing inline functions or new object literals, wrap them in `useCallback` or `useMemo`.

### 108. React Error Boundaries.
Components that catch JavaScript errors anywhere in their child component tree, log them, and display a fallback UI. Must currently be class components implementing `componentDidCatch` or `getDerivedStateFromError`.

### 109. Concurrent React: startTransition and useTransition.
Differentiates urgent updates (typing in an input) from non-urgent transitions (switching tabs, filtering a 10,000-row list):
```typescript
const [isPending, startTransition] = useTransition();
function handleChange(e) {
  setInputValue(e.target.value); // Urgent
  startTransition(() => {
    setFilterQuery(e.target.value); // Non-urgent: can be interrupted
  });
}
```

### 110. useDeferredValue vs Debouncing.
- Debounce: Enforces an arbitrary time delay before firing.
- `useDeferredValue`: React starts updating the deferred value immediately in the background, yielding to urgent user interactions automatically.

### 111. React Suspense.
Coordinates declarative loading states for child trees that are fetching data or code-split via `React.lazy`:
`<Suspense fallback={<Skeleton />}> <UserProfile /> </Suspense>`.

### 112. The useId hook.
Generates unique, stable accessibility IDs that are guaranteed identical between server-rendered HTML and client hydration, eliminating hydration mismatch warnings.

### 113. useSyncExternalStore.
Safely subscribes to external non-React state stores (Zustand, Redux, browser APIs) in Concurrent React without experiencing visual tearing (inconsistent UI states).

### 114. useImperativeHandle and forwardRef.
Customizes the instance value exposed to parent components when using `ref`:
```typescript
useImperativeHandle(ref, () => ({
  focusInput: () => inputRef.current?.focus(),
  reset: () => setValue('')
}));
```

### 115. React.StrictMode double-invocations in development.
Intentionally mounts, unmounts, and re-mounts components in development to detect unhandled side-effects, missing cleanups in `useEffect`, and deprecated lifecycle usages.

### 116. React 19: useActionState and useFormStatus.
- `useActionState(fn, initialState)`: Handles form action execution, pending states, and returned state data.
- `useFormStatus()`: Child component hook reading whether the parent `<form>` is currently submitting (`pending`).

### 117. React 19 use() API.
Can unwrap Promises and Context directly inside render functions, even inside conditional blocks and loops where traditional hooks are forbidden.

### 118. React 19 Server Actions.
Async functions defined with `'use server'` that execute on the server, invokable directly from client form actions with automatic state reconciliation.

### 119. Eliminating Prop Drilling.
Strategies: Component composition (passing JSX children), Context API for global preferences (theming, auth), and external state stores (Zustand).

### 120. Automatic State Batching in React 18+.
Batches all state updates automatically inside promises, `setTimeout`, and native event handlers into a single re-render pass.

### 121. Debugging infinite re-render loops.
Caused by updating state unconditionally during render or inside a `useEffect` whose dependency array includes the mutated state.

### 122. Custom Hook design for data fetching.
```typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => { if (err.name !== 'AbortError') setError(err); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```

### 123. Component Identity: Element position vs key prop.
React tracks component identity by its position in the tree. To force a complete remount and state reset, pass a different `key` prop (`<UserProfile key={userId} />`).

### 124. Why array index as a key is an anti-pattern.
If items are reordered, inserted at the top, or deleted, index keys cause React to preserve child DOM nodes incorrectly, leading to UI bugs in inputs and animation glitches.

### 125. React Portals (ReactDOM.createPortal).
Renders children into a different DOM subtree outside parent CSS clipping or `z-index` bounds while preserving standard React event bubbling.

### 126. Hydration Mismatch in React SSR.
Occurs when server HTML differs from initial client render (e.g., using `new Date()` or `window.innerWidth` during render). Fix: Move client-only checks into `useEffect`.

### 127. Zustand vs Redux Toolkit.
- **Zustand**: Minimalist, hook-based, zero boilerplate, no Provider wrapper required, ideal for modern React applications.
- **Redux Toolkit**: Structured, opinionated, includes RTK Query for server caching, ideal for massive legacy enterprise teams requiring strict action logging.

### 128. CSS Modules vs Tailwind CSS.
- **CSS Modules**: Scoped standard CSS classes per file; ideal for custom component styling.
- **Tailwind CSS**: Utility-first, zero runtime CSS output, enforces consistent design token spacing, highly productive.

### 129. Virtualizing large lists (TanStack Virtual).
Renders only the DOM nodes currently visible within the viewport window plus a small buffer, allowing smooth 60fps scrolling over 100,000+ items.

### 130. Unit testing with React Testing Library.
Test behavior from user perspective:
```typescript
test('increments counter on button click', async () => {
  render(<Counter />);
  const btn = screen.getByRole('button', { name: /increment/i });
  await userEvent.click(btn);
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

---

## Part 6: Next.js (App Router & Pages Router), SSR & Full-Stack Patterns (131 - 160)

### 131. App Router (app/) vs Pages Router (pages/).
- **Pages Router**: Page-level routing; data fetching via `getServerSideProps` / `getStaticProps`; client components by default.
- **App Router**: Nested routing with layouts; React Server Components (RSC) by default; streaming SSR; route handlers; colocation.

### 132. React Server Components (RSC) vs Client Components ('use client').
- **Server Components**: Run exclusively on the server; zero bundle size sent to client; direct access to databases/filesystems; cannot use state or browser hooks.
- **Client Components ('use client')**: Hydrated and interactive on the client; can use hooks (`useState`, `useEffect`) and browser APIs.

### 133. Passing Server Components into Client Components.
A Client Component cannot import a Server Component directly. Instead, pass the Server Component as a `children` prop:
```tsx
// Client Component
'use client';
export function Modal({ children }: { children: React.ReactNode }) {
  return <div className="modal">{children}</div>;
}

// Parent Server Component
<Modal> <ServerDataList /> </Modal>
```

### 134. 4 Next.js Rendering Strategies: CSR, SSR, SSG, ISR.
- **CSR**: Client-only rendering.
- **SSR**: Server-rendered on each request (`dynamic = 'force-dynamic'`).
- **SSG**: Pre-rendered at build time (`generateStaticParams`).
- **ISR**: Incremental Static Regeneration; static page rebuilt in background after cache expiration.

### 135. Incremental Static Regeneration (ISR).
- **Time-based**: `fetch('url', { next: { revalidate: 60 } })` rebuilds the static page in the background after 60 seconds.
- **On-demand**: Triggered via `revalidatePath('/posts')` or `revalidateTag('products')` inside a Server Action or webhook.

### 136. App Router special file conventions.
- `layout.tsx`: Shared UI wrapping route segments; preserves state on navigation.
- `page.tsx`: Unique UI for a route.
- `loading.tsx`: Instant fallback UI powered by React Suspense.
- `error.tsx`: Error boundary wrapping route segment.
- `not-found.tsx`: 404 UI.
- `template.tsx`: Similar to layout, but remounts and creates fresh instance on navigation.

### 137. layout.tsx vs template.tsx.
`layout.tsx` preserves component state and does not re-render between child route transitions. `template.tsx` instantiates a fresh DOM instance and re-executes effects on navigation (ideal for enter animations or page view logs).

### 138. Route Handlers (route.ts).
Replaces Pages Router API routes; provides standard Web Request/Response handlers:
```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello API' });
}
```

### 139. Next.js Extended fetch API.
Extends native `fetch` with caching options:
- `{ cache: 'force-cache' }`: Cached indefinitely (SSG).
- `{ cache: 'no-store' }`: Fresh fetch on every request (SSR).
- `{ next: { revalidate: 3600, tags: ['posts'] } }`: ISR caching with tag invalidation.

### 140. Next.js Middleware.
Runs before a request completes on the Edge Runtime:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session-token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
export const config = { matcher: ['/dashboard/:path*'] };
```

### 141. Route segments: [slug], [...slug], [[...slug]].
- `[slug]`: Single segment (`/posts/1`).
- `[...slug]`: Catch-all (`/docs/a/b/c`).
- `[[...slug]]`: Optional catch-all (matches `/docs` as well as `/docs/a/b`).

### 142. Route Groups ((group)).
Organizes folder structure without affecting URL paths (`app/(marketing)/about` -> `/about`). Allows defining separate root layouts for different sections of an application.

### 143. Parallel (@slot) and Intercepting ((.)) Routes.
- **Parallel Routes (`@modal`)**: Renders multiple pages simultaneously within the same layout.
- **Intercepting Routes (`(.)photo/[id]`)**: Intercepts a route to show a modal overlay when navigating client-side, while preserving direct URL link sharing for a full-page view.

### 144. next/image Core Web Vitals optimization.
Automatically serves modern formats (WebP, AVIF), resizes images per device viewport, prevents CLS with intrinsic aspect-ratio sizing, and lazy-loads off-screen images.

### 145. next/font optimization.
Self-hosts Google fonts and local fonts at build time, eliminating external network requests to Google Fonts, and automatically injects matching fallback metric overrides to eliminate FOUT/CLS.

### 146. Next.js Server Actions with optimistic UI.
```tsx
'use client';
import { useOptimistic } from 'react';

export function CommentList({ comments, addCommentAction }) {
  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (state, newComment: string) => [...state, { text: newComment, pending: true }]
  );

  async function handleSubmit(formData: FormData) {
    const text = formData.get('comment') as string;
    addOptimistic(text);
    await addCommentAction(text);
  }

  return (
    <form action={handleSubmit}>
      {optimisticComments.map((c, i) => <p key={i}>{c.text}</p>)}
      <input name="comment" />
      <button>Submit</button>
    </form>
  );
}
```

### 147. Streaming SSR with React Suspense.
Streams server HTML in chunks over a single HTTP connection. Non-critical slow data components are wrapped in `<Suspense>`, allowing the rest of the page to render instantly while slow components stream in later.

### 148. Dynamic vs Static route segment configuration.
- `export const dynamic = 'auto'`: Default caching.
- `export const dynamic = 'force-dynamic'`: Forces SSR on every request.
- `export const dynamic = 'force-static'`: Forces static rendering.

### 149. generateStaticParams.
Replaces `getStaticPaths` in the App Router:
```typescript
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```

### 150. generateMetadata for dynamic SEO.
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  return {
    title: product.title,
    description: product.description,
    openGraph: { images: [product.image] }
  };
}
```

### 151. redirect() vs permanentRedirect().
- `redirect(url)`: Returns a temporary 307 redirect.
- `permanentRedirect(url)`: Returns a permanent 308 redirect, instructing search crawlers and browsers to cache the new URL.

### 152. Secure Authentication in Next.js.
Store session tokens in `HttpOnly, Secure, SameSite=Lax` cookies. Verify authentication in Edge Middleware for fast route protection, and re-verify permissions inside Server Actions and Route Handlers.

### 153. Partial Prerendering (PPR).
Combines static prerendering and dynamic streaming in the same route: The static shell (navbar, headers) is served instantly from CDN, while dynamic holes wrapped in Suspense stream in from the server.

### 154. Node.js Runtime vs Edge Runtime in Next.js.
- **Node.js Runtime**: Full access to all Node.js APIs (`fs`, `crypto`, native modules); standard container execution.
- **Edge Runtime**: Lightweight V8 isolate engine; sub-millisecond cold starts; limited to Web standard APIs (Fetch, Request, Response).

### 155. Turbopack vs Webpack.
Turbopack is written in Rust by the creator of Webpack. It compiles incremental changes up to 10x faster than Webpack by caching function-level computation graphs.

### 156. Environment variable boundaries.
- `NEXT_PUBLIC_*`: Inlined into client JavaScript bundles at build time. Never place API secrets here.
- Standard variables (without `NEXT_PUBLIC_`): Accessible only on the server runtime.

### 157. server-only package protection.
Importing `import 'server-only'` into a backend data utility throws a build-time compiler error if any client component attempts to import it, guaranteeing private secrets never leak into client bundles.

### 158. Internationalized routing (i18n) in App Router.
Implemented using dynamic root segments: `app/[lang]/page.tsx` with Middleware detecting the `Accept-Language` header and redirecting to the matching locale segment.

### 159. Standalone Docker deployment for Next.js.
Enable `output: 'standalone'` in `next.config.js`. Next.js automatically traces required dependencies and outputs a minimal standalone Node.js server container (~80MB instead of ~1GB).

### 160. Monitoring production Core Web Vitals in Next.js.
Use the built-in `useReportWebVitals` hook to stream real-user metric (RUM) payloads (LCP, CLS, INP, TTFB) to analytics endpoints or monitoring platforms (Datadog, OpenTelemetry).
