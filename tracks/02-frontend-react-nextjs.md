# Full-Stack Frontend Master Interview Question Bank: React, Next.js, Modern Web & Core JS (1 - 160)

> Simple, intuitive, and easy-to-explain technical interview questions and deep-dive answers covering React 18 & 19, Next.js App Router, React Server Components (RSC), SSR/SSG/ISR, modern HTML5, CSS3, and JavaScript internals.

---

## Part 1: Intro & Candid Experience (1 - 10)

### 1. Give a brief introduction (keep it candid, not formal).
**In Simple Words:**
"I am a Senior Frontend / Full-Stack Engineer specializing in React, Next.js, TypeScript, and modern web performance. I build scalable web platforms focusing on fast initial page loads, clean component architecture, and modern state management. I enjoy working close to the platform—understanding browser rendering, streaming SSR, and Core Web Vitals."

```tsx
// Modern React 19 + TypeScript component architecture:
interface DashboardProps {
  userId: string;
}

export default async function Dashboard({ userId }: DashboardProps) {
  const profile = await fetchUserProfile(userId); // Server Component async fetch
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Welcome, {profile.name}</h1>
    </main>
  );
}
```

### 2. What is your role in your current project?
**How to Explain in an Interview:**
- **Architecture**: Designing Next.js App Router routes, separating Server Components from Client Components, and defining caching strategies.
- **Component System**: Building accessible UI components with Tailwind CSS and Radix UI primitives.
- **State & Data**: Managing server cache with TanStack Query and lightweight global UI state with Zustand.
- **Testing & Standards**: Setting up Vitest, React Testing Library, and Playwright E2E tests.

```typescript
// Shared domain logic / custom hook structure:
export function useFeatureFlag(flagName: string): boolean {
  const flags = useAppSelector(state => state.config.flags);
  return Boolean(flags[flagName]);
}
```

### 3. Any experience building APIs or backend integrations?
**In Simple Words:**
"Yes, I build Full-Stack features regularly."
- In Next.js, I build Route Handlers (`app/api/...`), Server Actions with Zod validation, and Edge Middleware for auth and redirects.
- Outside Next.js, I write REST APIs in Node.js (NestJS, Fastify) and Python (FastAPI), querying PostgreSQL and Redis.

```typescript
// Typed API client with resilient error handling:
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers }
  });
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  return res.json();
}
```

### 4. Did you start with frameworks or core JavaScript?
**In Simple Words:**
"I started with vanilla JavaScript, building DOM apps and understanding prototypes, closures, and the event loop before learning React. Being grounded in core JS makes debugging framework issues and performance bottlenecks straightforward."

```javascript
// Vanilla DOM manipulation vs React Declarative UI:
// Vanilla:
const btn = document.createElement('button');
btn.textContent = 'Count: 0';
let count = 0;
btn.onclick = () => { count++; btn.textContent = `Count: ${count}`; };

// React Declarative:
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```

### 5. How do you decide between React/Next.js versus Angular?
**In Simple Words:**
- **Choose Next.js/React** for public web apps, SaaS products, and e-commerce where SEO, streaming SSR, rich UI ecosystems, and fast initial page loads are top priorities.
- **Choose Angular** for large corporate teams that require a single, highly opinionated standard (built-in routing, forms, HTTP client, and dependency injection).

```tsx
// React (Functional Hooks):
function UserGreeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Angular equivalent (Component Decorator & Signal):
// @Component({ selector: 'user-greeting', template: '<h1>Hello, {{ name() }}!</h1>' })
// export class UserGreetingComponent { name = input.required<string>(); }
```

### 6. Describe a severe frontend performance issue you resolved.
**How to Explain in an Interview:**
- **Problem**: In a dashboard with live WebSockets, the page experienced severe input lag (high INP) and dropped frames.
- **Root Cause**: High-frequency WebSocket updates were triggering state re-renders across the entire table tree, causing layout thrashing.
- **Fix**: Extracted state into a Zustand store with fine-grained selectors, virtualized the 5,000-row table using TanStack Virtual, and reduced main-thread blocking time from 400ms down to under 16ms.

```tsx
// Resolving large bundle sizes with React.lazy and Suspense:
import React, { Suspense, lazy } from 'react';

const HeavyChart = lazy(() => import('./HeavyAnalyticsChart'));

export function AnalyticsSection() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200" />}>
      <HeavyChart />
    </Suspense>
  );
}
```

### 7. How do you collaborate with UI/UX designers and backend engineers?
**In Simple Words:**
- **Designers**: We establish shared Design Tokens in Figma that map directly to Tailwind CSS classes, using Storybook for living component documentation.
- **Backend Engineers**: We agree on OpenAPI / Swagger specs upfront, generating TypeScript types automatically to guarantee type safety between client and server.

```typescript
// Shared design token interface aligning UI/UX and Frontend:
export interface ButtonTokens {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
}
```

### 8. What is your state management philosophy?
**In Simple Words:**
Divide state into 3 clean buckets:
1. **Server Cache**: Managed by Next.js fetch cache or TanStack Query (caching, revalidation, optimistic updates).
2. **URL State**: Managed by query params (`useSearchParams`) for filters, search, and pagination.
3. **Client UI State**: Minimal `useState` / `useReducer`, or Zustand for global UI toggles (modals, sidebar).

```typescript
// Zustand lightweight client state store:
import { create } from 'zustand';

interface CartState {
  items: string[];
  addItem: (item: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] }))
}));
```

### 9. How do you approach automated testing?
**In Simple Words:**
- **Unit & Component**: Vitest and React Testing Library testing user behavior (clicking buttons, reading labels) rather than internal state.
- **API Mocking**: Mock Service Worker (MSW) to test network edge cases.
- **E2E**: Playwright running against production builds in CI for critical user journeys (Login, Checkout).

```tsx
// Component test with React Testing Library:
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments counter on click', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /count/i });
  fireEvent.click(button);
  expect(button).toHaveTextContent('Count: 1');
});
```

### 10. Which recent modern web feature has most influenced your code?
**In Simple Words:**
**React Server Components (RSC) and Partial Prerendering (PPR) in Next.js**. They move heavy database queries and parsing libraries to the server, resulting in 0 KB JavaScript sent to the client while keeping the page interactive.

---

```tsx
// React 19 Server Actions mutating data without API routes:
export default function NewsletterForm() {
  async function subscribe(formData: FormData) {
    'use server';
    const email = formData.get('email');
    await db.subscribers.create({ email });
  }

  return (
    <form action={subscribe}>
      <input name="email" type="email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}
```

## Part 2: HTML5 & Modern Web Semantics (11 - 35)

### 11. What are Semantic HTML elements and why do they matter?
**In Simple Words:**
Semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) clearly describe their purpose to browsers and screen readers.
- **Accessibility**: Screen readers allow visually impaired users to jump directly to `<main>` or `<nav>`.
- **SEO**: Search crawlers understand your page hierarchy and weight content appropriately.

```html
<!-- Semantic HTML page structure: -->
<header>
  <nav aria-label="Main Navigation">
    <ul><li><a href="/">Home</a></li></ul>
  </nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <section><p>Article content...</p></section>
  </article>
</main>
<footer><p>&copy; 2026</p></footer>
```

### 12. Difference between `<script>`, `<script async>`, and `<script defer>`:
- `<script>`: Blocks HTML parsing; downloads and runs immediately.
- `<script async>`: Downloads in parallel; runs immediately when ready (can run out of order).
- `<script defer>`: Downloads in parallel; runs only after HTML parsing completes, in document order.

```html
<!-- Standard blocking script (blocks HTML parsing): -->
<script src="blocking.js"></script>

<!-- Async: Downloads in parallel, executes immediately when ready (unordered): -->
<script async src="analytics.js"></script>

<!-- Defer: Downloads in parallel, executes after HTML parsing completes (ordered): -->
<script defer src="main.js"></script>
```

### 13. localStorage vs sessionStorage vs Cookies:
- `localStorage`: 5-10MB, permanent until cleared, client-only.
- `sessionStorage`: 5MB, deleted when browser tab closes, client-only.
- `cookies`: 4KB, sent to server with every HTTP request, supports `HttpOnly` security flag.

```javascript
// localStorage (persistent across browser restarts):
localStorage.setItem('theme', 'dark');

// sessionStorage (cleared when browser tab closes):
sessionStorage.setItem('formDraft', JSON.stringify({ step: 1 }));

// Cookie (sent to server on every HTTP request; supports HttpOnly & Secure):
document.cookie = "sessionId=xyz; SameSite=Strict; Secure; path=/";
```

### 14. Custom HTML data-* attributes:
Store custom data on HTML elements: `<div data-user-id="42">`. Read in JS via `el.dataset.userId`; style in CSS via `[data-user-id="42"]`.

```html
<div id="user-card" data-user-id="101" data-role="admin">Alice</div>

<script>
  const el = document.getElementById('user-card');
  console.log(el.dataset.userId); // "101"
  console.log(el.dataset.role);   // "admin"
</script>
```

### 15. Web Workers vs Service Workers:
- **Web Worker**: Runs background CPU calculations on a separate thread without freezing the UI.
- **Service Worker**: Acts as a network proxy between browser and server, enabling offline caching, PWAs, and push notifications.

```javascript
// Web Worker for heavy CPU calculations off main UI thread:
const worker = new Worker('fibonacci-worker.js');
worker.postMessage({ n: 45 });
worker.onmessage = (e) => {
  console.log('Result from worker:', e.data.result);
};
```

### 16. Canvas API vs SVG:
- **Canvas (Pixel/Raster)**: Blazingly fast for 60fps animations, thousands of particles, and game rendering.
- **SVG (Vector/DOM)**: Scalable at any resolution, styleable with CSS, accessible; best for icons and UI charts.

```html
<!-- SVG (Vector-based, sharp at any zoom level, DOM-inspectable): -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
</svg>

<!-- Canvas (Pixel raster-based, high performance for 60fps games): -->
<canvas id="myCanvas" width="200" height="100"></canvas>
<script>
  const ctx = document.getElementById('myCanvas').getContext('2d');
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0, 0, 150, 75);
</script>
```

### 17. picture tag vs srcset:
`<picture>` allows **art direction** (swapping image crops and modern formats like AVIF based on media queries). `srcset` allows **resolution switching** (browser picks best size based on device pixel density).

```html
<!-- Responsive image with picture and modern AVIF/WebP formats: -->
<picture>
  <source srcset="hero-dark.avif" media="(prefers-color-scheme: dark)" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Company Hero Banner" loading="lazy" width="1200" height="600">
</picture>
```

### 18. template and slot tags in Web Components:
`<template>` holds inert HTML not rendered until instantiated with JavaScript; `<slot>` defines placeholders inside Shadow DOM where users can inject content.

```html
<template id="card-template">
  <div class="card">
    <h2><slot name="title">Default Title</slot></h2>
    <div class="content"><slot>Default content</slot></div>
  </div>
</template>
```

### 19. CSR vs SSR vs SSG:
- **CSR (Client-Side Rendering)**: Blank HTML; browser JS builds DOM.
- **SSR (Server-Side Rendering)**: Server generates full HTML on every request.
- **SSG (Static Site Generation)**: HTML is pre-rendered at build time and served via CDN.

```tsx
// Next.js: Explicit render mode selection:
// SSG (Static Site Generation):
export const dynamic = 'force-static';

// SSR (Server-Side Rendering per request):
export const dynamic = 'force-dynamic';

// ISR (Incremental Static Regeneration every 60s):
export const revalidate = 60;
```

### 20. ARIA roles, states, and properties:
Provide accessible semantics when standard HTML is insufficient (e.g. `role="dialog"`, `aria-expanded="true"`, `aria-live="polite"`).

```html
<!-- Accessible accordion using ARIA roles and states: -->
<button 
  aria-expanded="false" 
  aria-controls="section-1" 
  id="accordion-btn-1"
  onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true')"
>
  Toggle Section
</button>
<div id="section-1" role="region" aria-labelledby="accordion-btn-1" hidden>
  Accordion content details...
</div>
```

### 21. inline vs block vs inline-block:
- `block`: Starts on a new line, takes full width, respects width/height.
- `inline`: Flows within text, ignores width/height and vertical margins.
- `inline-block`: Flows inline with text, but respects width, height, and margins.

```css
/* Inline (no width/height, inline flow): */
span { display: inline; }

/* Block (takes full line width, breaks line): */
div { display: block; width: 300px; height: 100px; }

/* Inline-block (respects width/height, stays inline): */
button { display: inline-block; width: 120px; height: 40px; }
```

### 22. rel="noopener noreferrer" on anchor tags:
When using `target="_blank"`:
- `noopener`: Prevents the new page from accessing `window.opener` (stops reverse tabnabbing attacks).
- `noreferrer`: Hides the `Referer` header from the destination site.

```html
<!-- Securing external target="_blank" links: -->
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  Visit external partner
</a>
```

### 23. Why `<!DOCTYPE html>` is required:
It tells the browser to render the page in **Standards Mode** (W3C box model and CSS rules) instead of buggy legacy Quirks Mode.

```html
<!DOCTYPE html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Standard Mode</title></head>
  <body><p>Rendered in HTML5 standard standards-compliant mode.</p></body>
</html>
```

### 24. Role of `<meta name="viewport">`:
Tells mobile browsers to render the page at the device's real physical screen width rather than zooming out on an emulated 980px desktop view.

```html
<!-- Mobile responsive viewport meta tag: -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

### 25. Standard form encoding vs multipart/form-data:
`application/x-www-form-urlencoded` sends text key-value pairs; `multipart/form-data` is mandatory when uploading binary files (images, documents).

```html
<!-- Multipart form for binary file uploads: -->
<form action="/api/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="avatar" accept="image/*" />
  <button type="submit">Upload</button>
</form>
```

### 26. prefetch vs preload vs preconnect:
- `preload`: Tells browser to download a critical resource for the **current** page immediately (e.g. hero font).
- `prefetch`: Low-priority background download for resources needed on the **next** page.
- `preconnect`: Performs early DNS lookup and TLS handshake to an external domain.

```html
<!-- Preload critical font (high priority): -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- Preconnect to external API origin: -->
<link rel="preconnect" href="https://api.myapp.com">

<!-- Prefetch page for next user navigation: -->
<link rel="prefetch" href="/dashboard">
```

### 27. iframe sandboxing vs postMessage:
The `sandbox` attribute restricts iframe permissions; `window.postMessage` allows safe cross-origin messaging by checking `event.origin`.

```html
<!-- Sandboxed iframe with postMessage communication: -->
<iframe id="childFrame" src="https://embed.example.com" sandbox="allow-scripts"></iframe>

<script>
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://embed.example.com') return; // Security check
    console.log('Received from iframe:', event.data);
  });
</script>
```

### 28. Native `<dialog>` element and showModal():
Calling `dialog.showModal()` automatically places the dialog in the browser's top layer, creates a `::backdrop`, traps keyboard focus, and closes on `Esc`.

```html
<dialog id="favDialog">
  <form method="dialog">
    <p>Are you sure you want to delete this?</p>
    <button value="cancel">Cancel</button>
    <button value="confirm">Confirm</button>
  </form>
</dialog>

<button onclick="document.getElementById('favDialog').showModal()">Open Modal</button>
```

### 29. Structured Data: Schema.org & JSON-LD:
Format embedded in `<script type="application/ld+json">` that gives search engines structured data about products, reviews, and FAQs for rich search snippets.

```html
<!-- Structured Schema.org JSON-LD for SEO: -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wireless Headphones",
  "image": "https://example.com/photos/1x1/photo.jpg",
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD"
  }
}
</script>
```

### 30. hidden vs display: none vs aria-hidden="true":
- `hidden` and `display: none`: Remove element from visual display and accessibility tree.
- `aria-hidden="true"`: Hides element from screen readers while keeping it visually visible.

```html
<!-- 1. hidden attribute (semantic hide): -->
<div hidden>Hidden from everyone</div>

<!-- 2. display: none (removes from visual and accessibility tree): -->
<div style="display: none;">Invisible</div>

<!-- 3. aria-hidden="true" (visual only, hidden from screen readers): -->
<span aria-hidden="true">🎉</span>
```

### 31. Progressive form enhancement:
Using native HTML5 attributes (`required`, `type="email"`, `pattern`) ensures basic form validation works even if JavaScript fails to load.

```html
<!-- Progressive enhancement: works with JS disabled, enhanced with JS: -->
<form action="/search" method="GET" id="search-form">
  <input type="text" name="q" placeholder="Search..." required />
  <button type="submit">Search</button>
</form>
```

### 32. Void (Self-Closing) Elements:
Elements that cannot hold child tags (`<img>`, `<input>`, `<br>`, `<meta>`). In HTML5, `<img />` and `<img>` are treated identically.

```html
<!-- Valid self-closing void elements (no closing tag allowed): -->
<img src="photo.jpg" alt="Sample" />
<input type="text" name="username" />
<br />
<hr />
```

### 33. How browser constructs DOM from HTML:
Raw Bytes -> Characters -> Tokens (start/end tag) -> Nodes -> DOM Tree.

```javascript
// Inspecting the DOM tree programmatically:
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM construction finished; ready for manipulation!');
});
```

### 34. ContentEditable elements pitfalls:
Browser differences when pressing Enter (some insert `<p>`, others `<div>` or `<br>`), messy pasted markup, and difficulty keeping React state synchronized.

```tsx
// Sanitizing contentEditable updates to prevent XSS:
function EditableBox() {
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const rawText = e.currentTarget.innerText; // Plain text only; blocks HTML XSS injection
  };
  return <div contentEditable onInput={handleInput} className="border p-2" />;
}
```

### 35. Font loading: FOIT vs FOUT:
- **FOIT (Flash of Invisible Text)**: Browser hides text until custom font finishes downloading.
- **FOUT (Flash of Unstyled Text)**: Browser shows fallback font immediately, then swaps.
- **Fix**: Use `font-display: swap` or Next.js `next/font` which self-hosts fonts and matches fallback metrics.

---

```css
/* Eliminates FOIT (Flash of Invisible Text) by using fallback font immediately: */
@font-face {
  font-family: 'CustomSans';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* Immediate fallback -> swaps when loaded */
}
```

## Part 3: Modern CSS3, Architecture & Performance (36 - 60)

### 36. CSS Box Model: content-box vs border-box:
- `content-box`: `width = content only` (padding and border expand the box).
- `border-box`: `width = content + padding + border` (predictable layout math).

```css
/* Universal border-box reset: padding & borders included in width */
*, *::before, *::after {
  box-sizing: border-box;
}
```

### 37. Flexbox (1D) vs CSS Grid (2D):
Flexbox aligns items along a single row or column; CSS Grid lays out items simultaneously across rows and columns.

```css
/* Flexbox (1D: row or column alignment): */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* CSS Grid (2D: rows AND columns simultaneously): */
.photo-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
```

### 38. Specificity calculation:
Inline styles (`1,0,0,0`) > IDs (`0,1,0,0`) > Classes/Attributes (`0,0,1,0`) > Elements (`0,0,0,1`).

```css
/* Specificity calculation:
   Inline styles = 1,0,0,0
   IDs (#header) = 0,1,0,0
   Classes/Attributes (.btn, [type]) = 0,0,1,0
   Elements (div, p) = 0,0,0,1
*/
#nav .menu-item.active a:hover {
  /* 0,1,2,1 = Specificity score 121 */
  color: #0070f3;
}
```

### 39. CSS Custom Properties vs SCSS Variables:
CSS variables (`var(--primary)`) live in the DOM at runtime and can be updated dynamically with JavaScript; SCSS variables are compiled to fixed values at build time.

```css
/* CSS Custom Properties (dynamic runtime cascade & JS access): */
:root {
  --primary-color: #3b82f6;
}
.btn {
  background-color: var(--primary-color);
}
```

### 40. 3 modern ways to center an element:
1. `display: grid; place-items: center;`
2. `display: flex; justify-content: center; align-items: center;`
3. Absolute positioning with `top: 50%; left: 50%; transform: translate(-50%, -50%);`

```css
/* Method 1: CSS Grid place-items (shortest modern way): */
.center-grid { display: grid; place-items: center; height: 100vh; }

/* Method 2: Flexbox margin auto: */
.center-flex { display: flex; height: 100vh; }
.center-flex > div { margin: auto; }

/* Method 3: Absolute transform: */
.center-abs { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
```

### 41. CSS units: rem, em, dvh, svh:
`rem` is relative to root font size; `em` is relative to parent font; `dvh` (dynamic viewport height) resizes smoothly as mobile address bars expand and collapse.

```css
/* Modern mobile-friendly viewport units: */
.full-screen-hero {
  height: 100dvh; /* Dynamic Viewport Height: adapts to mobile address bar! */
  padding: 1.5rem; /* 1.5 * root font size (usually 24px) */
}
```

### 42. What triggers a Stacking Context beyond z-index?
`opacity < 1`, `transform !== none`, `filter !== none`, `isolation: isolate`.

```css
/* Creating an isolated Stacking Context without hacks: */
.modal-overlay {
  isolation: isolate; /* Creates fresh stacking context for child elements */
  z-index: 10;
}
```

### 43. CSS Container Queries (@container) vs Media Queries:
Media queries look at the whole browser window; Container queries evaluate the width of the parent component, enabling reusable responsive UI components.

```css
/* Container Query: adapts component based on its container size, NOT viewport! */
.card-container {
  container-type: inline-size;
}

@container (min-width: 450px) {
  .card {
    display: flex; /* Switches to horizontal layout when container is wide */
  }
}
```

### 44. The :has() relational parent selector:
Allows styling a parent based on its child elements: `form:has(input:invalid) { border: 2px solid red; }`.

```css
/* :has() relational parent selector: */
/* Style the card only if it contains an image: */
.card:has(img) {
  grid-column: span 2;
}

/* Style form label if input is invalid: */
label:has(+ input:invalid) {
  color: red;
}
```

### 45. CSS Cascade Layers (@layer):
Allows grouping CSS into explicit precedence layers (`reset`, `framework`, `utilities`) so utility classes always win regardless of selector specificity.

```css
/* Cascade Layers: control specificity hierarchy explicitly: */
@layer reset, base, components, utilities;

@layer components {
  .btn { background: blue; }
}

@layer utilities {
  .bg-red { background: red; } /* Wins over components layer! */
}
```

### 46. position: fixed vs sticky:
- `fixed`: Stays in place relative to the viewport.
- `sticky`: Scrolls normally until it reaches a scroll offset, then sticks within its parent container.

```css
/* Fixed: relative to the viewport window */
.fixed-nav {
  position: fixed;
  top: 0;
  width: 100%;
}

/* Sticky: scrolls normally until threshold, then sticks */
.sticky-header {
  position: sticky;
  top: 0;
}
```

### 47. Reflow vs Repaint & Layout Thrashing:
- **Reflow**: Recalculating geometry of elements (expensive).
- **Repaint**: Redrawing colors and pixels without changing layout.
- **Layout Thrashing**: Rapidly interleaving reads and writes to geometry (`offsetWidth` followed by `style.width`).

```javascript
// Avoiding Layout Thrashing by batching DOM reads and writes:
// BAD: Interleaving reads & writes causes repeated synchronous reflows
// GOOD: Read all dimensions first, then write styles:
const w1 = el1.offsetWidth;
const w2 = el2.offsetWidth;
el1.style.width = w1 + 10 + 'px';
el2.style.width = w2 + 10 + 'px';
```

### 48. Critical Rendering Path (CRP) optimization:
Minimizing render-blocking resources: Inline critical above-the-fold CSS, defer non-critical JS scripts, and optimize fonts.

```html
<!-- Critical CSS inlined in <head> for instant First Contentful Paint (FCP): -->
<head>
  <style>/* Critical above-the-fold styles here */</style>
  <link rel="preload" href="/styles/non-critical.css" as="style" onload="this.rel='stylesheet'">
</head>
```

### 49. CSS content-visibility: auto:
Skips layout and rendering of off-screen elements until the user scrolls near them, dramatically accelerating initial page load.

```css
/* content-visibility: skips rendering off-screen elements until scrolled near: */
.long-feed-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 450px; /* Estimated height to prevent scrollbar jumping */
}
```

### 50. Grid repeat(auto-fit, minmax(...)) vs repeat(auto-fill, ...):
`auto-fill` preserves empty column tracks; `auto-fit` collapses empty tracks to expand existing items across the row.

```css
/* auto-fit: stretches columns to fill full container width */
.grid-autofit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* auto-fill: preserves column slots even if empty */
.grid-autofill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

### 51. display: none vs visibility: hidden:
- `display: none`: Removes element from DOM layout and accessibility tree (0px space).
- `visibility: hidden`: Hides element visually, but preserves its occupied space on the page.

```css
/* display: none removes element from DOM layout completely: */
.hidden-box { display: none; }

/* visibility: hidden hides visually, but reserves layout space: */
.invisible-box { visibility: hidden; }
```

### 52. Why CSS transforms and opacity animations are GPU-accelerated:
They bypass the browser's Layout and Paint phases entirely; the browser composites them directly on separate GPU layers.

```css
/* GPU-accelerated animation (runs on compositor thread without reflow): */
.smooth-slide {
  transform: translate3d(100px, 0, 0);
  opacity: 0.8;
  will-change: transform, opacity;
  transition: transform 0.3s ease;
}
```

### 53. How to create a Block Formatting Context (BFC):
Use `display: flow-root`. Contains internal floats and prevents margin collapsing.

```css
/* Modern BFC creation without clipping issues: */
.bfc-container {
  display: flow-root; /* Creates a clean Block Formatting Context */
}
```

### 54. Fluid typography with clamp():
`font-size: clamp(1rem, 2.5vw, 2.5rem);` sets a minimum size of 1rem, scales with 2.5vw, and caps at 2.5rem.

```css
/* Fluid responsive typography without media queries: */
h1 {
  /* clamp(min, preferred, max) */
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}
```

### 55. Pseudo-classes vs Pseudo-elements:
- **Pseudo-classes (`:`)**: State of an element (`:hover`, `:focus`, `:nth-child(2)`).
- **Pseudo-elements (`::`)**: Sub-part of an element (`::before`, `::after`, `::placeholder`).

```css
/* Pseudo-class (state of element): */
button:hover { background: #2563eb; }

/* Pseudo-element (virtual sub-element): */
button::after { content: ' →'; }
```

### 56. CSS Subgrid:
Allows a child grid to inherit the exact row and column tracks of its parent grid, aligning card headers and footers across columns.

```css
/* CSS Subgrid: Child grid aligns perfectly to parent grid tracks: */
.parent-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.child-card {
  grid-column: span 2;
  display: grid;
  grid-template-columns: subgrid; /* Inherits parent column tracks */
}
```

### 57. CSS @supports feature query:
Checks browser feature support before applying styles: `@supports (display: grid) { ... }`.

```css
/* Feature query (@supports): */
@supports (display: grid) {
  .container { display: grid; }
}
@supports not (display: grid) {
  .container { display: flex; } /* Fallback */
}
```

### 58. CSS-in-JS vs Zero-Runtime / Tailwind CSS:
- **Runtime CSS-in-JS (Emotion, Styled-Components)**: Adds JS runtime overhead, causes style recalculations, and is incompatible with React Server Components.
- **Zero-Runtime (Tailwind CSS)**: Pre-compiled static CSS; 0ms runtime cost; 100% RSC compatible.

```tsx
// Zero-runtime Tailwind CSS vs Runtime CSS-in-JS:
// Tailwind compiles at build-time to tiny utility classes (zero JS runtime):
export function Card() {
  return <div className="p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition" />;
}
```

### 59. Dark mode theming with CSS variables:
Define CSS variables on `:root` and override them inside `@media (prefers-color-scheme: dark)` or `[data-theme="dark"]`.

```css
/* Dark mode theming with CSS variables: */
:root {
  --bg-color: #ffffff;
  --text-color: #111827;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #0f172a;
    --text-color: #f8fafc;
  }
}
body { background: var(--bg-color); color: var(--text-color); }
```

### 60. CLS prevention with aspect-ratio:
Setting `aspect-ratio: 16 / 9` on image/video containers reserves layout space before media loads, preventing layout shifts.

---

```css
/* Eliminating Cumulative Layout Shift (CLS) on responsive media: */
.video-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

## Part 4: JavaScript Core & Event Loop (61 - 95)

### 61. 7 primitive types and memory allocation:
`string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Primitives are immutable and stored on the stack; Objects are stored on the heap with memory address references on the stack.

```javascript
// 7 Primitives in JS (allocated on stack or immutable value storage):
const str = "hello";
const num = 42;
const bool = true;
const nul = null;
const und = undefined;
const sym = Symbol("id");
const big = 9007199254740991n;
```

### 62. Hoisting and Temporal Dead Zone (TDZ):
`var` is hoisted and initialized with `undefined`. `let` and `const` are hoisted into the TDZ; accessing them before declaration throws `ReferenceError`.

```javascript
// Temporal Dead Zone (TDZ) demonstration:
console.log(varVariable); // undefined (hoisted and initialized)
var varVariable = 1;

// console.log(letVariable); // ReferenceError: Cannot access before initialization!
let letVariable = 2; // TDZ ends here
```

### 63. Loose (==) vs Strict (===) equality:
`==` converts types automatically before comparison; `===` checks both value and type without conversion.

```javascript
// Loose (==) performs type coercion:
console.log(0 == false);   // true
console.log("" == 0);       // true
console.log(null == undefined); // true

// Strict (===) compares without coercion:
console.log(0 === false);  // false
```

### 64. Execution context and Closures:
An execution context holds variables and `this`. Closures occur when an inner function retains access to its outer lexical scope even after the outer function has returned.

```javascript
// Closure retaining outer lexical scope:
function makeCounter() {
  let count = 0; // Private enclosed state
  return {
    increment: () => ++count,
    get: () => count
  };
}
const counter = makeCounter();
console.log(counter.increment()); // 1
```

### 65. The "this" keyword rules:
1. `obj.fn()`: `this` is `obj`.
2. Plain function: `this` is `window` (or `undefined` in strict mode).
3. `call`/`apply`/`bind`: Explicitly passed object.
4. Arrow function: Captures `this` from outer lexical scope.

```javascript
// 'this' binding rules:
const user = {
  name: 'Alice',
  greet: function() { return this.name; },
  arrowGreet: () => this.name // Inherits lexical enclosing 'this'
};
console.log(user.greet()); // 'Alice'
```

### 66. Event Loop: Microtasks vs Macrotasks:
- **Call Stack**: Executes synchronous code.
- **Microtasks Queue (Promises, queueMicrotask)**: Drains **completely** immediately after the current stack, before rendering.
- **Macrotasks Queue (setTimeout, setInterval, I/O)**: Runs one task per loop cycle.

```javascript
// Event loop execution order:
console.log('1. Synchronous');
setTimeout(() => console.log('4. Macrotask (Timer)'), 0);
Promise.resolve().then(() => console.log('3. Microtask (Promise)'));
queueMicrotask(() => console.log('2. Microtask (queueMicrotask)'));
```

### 67. Shallow Copy vs Deep Copy:
- **Shallow Copy (`{ ...obj }`)**: Copies only first-level properties; nested objects share the same memory address.
- **Deep Copy (`structuredClone(obj)`)**: Recursively copies all nested objects into new memory.

```javascript
// Deep clone with built-in structuredClone:
const original = { user: { name: 'Bob' }, date: new Date() };
const clone = structuredClone(original);
clone.user.name = 'Charlie';
console.log(original.user.name); // 'Bob' (completely unaffected)
```

### 68. Debouncing vs Throttling:
- **Debounce**: Waits for a pause in events before running (search input).
- **Throttle**: Runs at most once every $N$ ms (scrolling, resize).

```javascript
// Debounce: waits until user stops typing:
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

### 69. Event Bubbling, Capturing, and Delegation:
- **Capturing**: Event travels down from window to target.
- **Bubbling**: Event travels up from target to window.
- **Delegation**: Attaching one listener to a parent element to handle events on dynamic children via `e.target`.

```javascript
// Event Delegation on parent container:
document.getElementById('todo-list').addEventListener('click', (e) => {
  if (e.target.matches('button.delete-btn')) {
    const id = e.target.closest('li').dataset.id;
    console.log('Delete item:', id);
  }
});
```

### 70. Proxy and Reflect objects:
`Proxy` intercepts object operations (`get`, `set`); `Reflect` forwards intercepted operations to target objects cleanly. Powers modern reactivity in Vue and MobX.

```javascript
// Proxy and Reflect: Reactive data observation
const state = new Proxy({ count: 0 }, {
  set(target, prop, value, receiver) {
    console.log(`Property ${String(prop)} changed to ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
});
state.count = 1; // Logs change!
```

### 71. Promise.all vs allSettled vs race vs any:
- `Promise.all`: Rejects fast if any promise rejects; succeeds when all resolve.
- `Promise.allSettled`: Waits for all to complete; returns status array of all.
- `Promise.race`: Resolves or rejects as soon as the first promise settles.
- `Promise.any`: Resolves on the first fulfilled promise; rejects only if all fail.

```javascript
// Promise.allSettled: handles individual failures without aborting:
const results = await Promise.allSettled([
  fetch('/api/user'),
  fetch('/api/notifications')
]);
results.forEach(res => {
  if (res.status === 'fulfilled') console.log('Value:', res.value);
  else console.error('Failed:', res.reason);
});
```

### 72. Map, Set, WeakMap, WeakSet:
`Map` allows keys of any type and preserves order; `Set` stores unique values; `WeakMap`/`WeakSet` accept only objects as keys/values and allow automatic garbage collection.

```javascript
// WeakMap allows keys to be garbage-collected:
const privateData = new WeakMap();

class SecureAccount {
  constructor(secret) {
    privateData.set(this, secret);
  }
  getSecret() { return privateData.get(this); }
}
```

### 73. Generator Functions:
Functions with `function*` that pause execution using `yield` and resume using `.next()`.

```javascript
// Infinite ID Generator with Generators:
function* idGenerator() {
  let id = 1;
  while (true) yield id++;
}
const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

### 74. V8 Hidden Classes & Inline Caching:
V8 optimizes property access by assigning objects with identical property order to shared Hidden Classes (Shapes), enabling fast memory lookups.

```javascript
// V8 Hidden Class optimization: Always initialize properties in identical order:
function Point(x, y) {
  this.x = x;
  this.y = y; // Shares single hidden class
}
```

### 75. Common causes of Memory Leaks:
Accidental global variables, forgotten timers (`setInterval`), uncleared event listeners on removed DOM elements, and detached closures.

```javascript
// Memory leak fix: Always clear timers and listeners:
class DataPoller {
  start() {
    this.intervalId = setInterval(() => this.poll(), 5000);
  }
  stop() {
    clearInterval(this.intervalId); // Prevents memory leak!
  }
}
```

### 76. AbortController API:
Used to cancel fetch requests and DOM listeners: `controller.abort()`.

```javascript
// Cancelling in-flight fetch with AbortController:
const controller = new AbortController();
setTimeout(() => controller.abort(), 2000); // 2s timeout

try {
  const res = await fetch('/api/data', { signal: controller.signal });
} catch (err) {
  if (err.name === 'AbortError') console.log('Request was cancelled!');
}
```

### 77. WeakRef and FinalizationRegistry:
`WeakRef` creates a reference without preventing garbage collection; `FinalizationRegistry` runs a callback when an object is garbage-collected.

```javascript
// WeakRef and FinalizationRegistry for memory cleanup notification:
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Object ${heldValue} was garbage collected!`);
});
let obj = { data: 'heavy' };
registry.register(obj, 'heavy-object-id');
obj = null; // Eligible for GC
```

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

```javascript
// Variable scoping comparison:
if (true) {
  var varLeaked = 'leaks to outer function';
  let letScoped = 'contained in block';
}
console.log(varLeaked); // accessible!
// console.log(letScoped); // ReferenceError
```

### 87. splice vs slice:
- `splice(start, count)`: Mutates original array and returns removed items.
- `slice(start, end)`: Pure function; returns a shallow copy of the sub-array without modifying original.

```javascript
const arr = [1, 2, 3, 4, 5];
// slice: non-mutating shallow copy
const sliced = arr.slice(1, 3); // [2, 3], original untouched

// splice: mutating in-place removal/insertion
arr.splice(1, 2); // removes 2 elements starting at index 1 -> arr is now [1, 4, 5]
```

### 88. Synchronous vs Asynchronous execution in single-threaded JS:
JS has 1 Call Stack. Async tasks (timers, fetch) are handed to browser Web APIs; when complete, their callbacks join task queues and the Event Loop pushes them to the stack when empty.

```javascript
// Single-threaded non-blocking concurrency:
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');
// Output: A -> C -> B
```

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

```javascript
// ESM (static import/export):
export const greet = (name) => `Hello, ${name}`;
import { greet } from './greet.mjs';

// CJS (dynamic require):
module.exports = { greet };
const { greet } = require('./greet.js');
```

### 91. Object.freeze() vs Object.seal():
`freeze()` makes all properties read-only. `seal()` prevents adding or deleting keys, but allows editing existing values.

```javascript
// Object.freeze (immutable: no add, delete, or modify):
const frozen = Object.freeze({ x: 1 });
// frozen.x = 2; // Fails in strict mode

// Object.seal (can modify existing properties; cannot add or delete):
const sealed = Object.seal({ y: 1 });
sealed.y = 99; // Allowed!
```

### 92. Tagged Template Literals:
Allows calling a function with template literals without parentheses: `styled.div` pattern.

```javascript
// Tagged Template Literal:
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => `${acc}${str}<strong>${values[i] || ''}</strong>`, '');
}
const user = 'Alice';
console.log(highlight`Welcome ${user}!`); // "Welcome <strong>Alice</strong>!"
```

### 93. MutationObserver vs legacy DOM mutation events:
`MutationObserver` batches DOM changes asynchronously before rendering, avoiding severe performance degradation of legacy events.

```javascript
// Observing DOM mutations:
const observer = new MutationObserver((mutations) => {
  mutations.forEach(m => console.log('DOM changed:', m.type));
});
observer.observe(document.body, { childList: true, subtree: true });
```

### 94. Floating-point arithmetic errors (0.1 + 0.2 !== 0.3):
Numbers follow IEEE 754 floating-point format (64-bit). Fix: Work in integer cents (`Math.round`) or use BigInt / Decimal libraries for currency.

```javascript
// Safe floating-point comparison with Number.EPSILON:
function areFloatsEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
console.log(areFloatsEqual(0.1 + 0.2, 0.3)); // true!
```

### 95. INP (Interaction to Next Paint) and scheduler.yield():
INP measures page responsiveness across user clicks. `await scheduler.yield()` pauses long loops, allowing the browser to render frames between chunk processing.

---

```javascript
// Breaking long task to avoid INP (Interaction to Next Paint) latency:
async function processBatch(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    if (i % 100 === 0 && 'scheduler' in window) {
      await scheduler.yield(); // Gives control back to browser to render user clicks!
    }
  }
}
```

## Part 5: React 18 & 19 Architecture, Hooks & State (96 - 130)

### 96. Virtual DOM and React Fiber Architecture:
The Virtual DOM is a lightweight JS tree. Fiber is React's reconciliation engine that breaks rendering into small units of work, allowing React to pause, resume, or abort background renders for urgent user input.

```typescript
// React Fiber Node representation:
interface FiberNode {
  tag: number;           // Component type (Function, Class, HostRoot)
  key: null | string;
  stateNode: any;        // Real DOM element reference
  child: FiberNode | null;
  sibling: FiberNode | null;
  return: FiberNode | null; // Parent fiber
}
```

### 97. Core Rules of React Hooks:
1. Only call hooks at the **top level** (never inside loops, conditions, or nested functions).
2. Only call hooks from React function components or custom hooks.

```tsx
// Obeying Rules of Hooks (Top level only, no conditionals):
function UserProfile({ id }: { id: string | null }) {
  // CORRECT: Always invoked in the same order
  const [data, setData] = useState(null);

  // WRONG: if (id) useState(); // NEVER put hooks inside 'if' conditions!
  return <div>{data}</div>;
}
```

### 98. useState vs useReducer:
- Use `useState` for simple, independent state.
- Use `useReducer` when state transitions are complex, involve multiple sub-values, or when the next state depends heavily on the previous state.

```tsx
// useReducer for complex multi-action state transitions:
type Action = { type: 'INCREMENT' } | { type: 'RESET' };

function counterReducer(state: number, action: Action): number {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'RESET': return 0;
  }
}
const [count, dispatch] = useReducer(counterReducer, 0);
```

### 99. Lifecycle of useEffect:
Runs after browser paint:
1. Setup: Runs after initial render and when dependencies change.
2. Cleanup: Runs *before* the next effect and upon unmount.
`[]` empty dependency array runs setup on mount and cleanup on unmount.

```tsx
// useEffect with subscription cleanup to prevent memory leaks:
useEffect(() => {
  const handler = () => console.log('Resized');
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler); // Cleanup on unmount!
}, []);
```

### 100. useMemo vs useCallback:
- `useMemo(() => compute(), [deps])`: Memoizes the **result of a calculation**.
- `useCallback(fn, [deps])`: Memoizes the **function reference itself** to prevent re-renders of memoized children (`React.memo`).

```tsx
// useMemo (caches computed value) vs useCallback (caches function reference):
const expensiveTotal = useMemo(() => items.reduce((a, b) => a + b.price, 0), [items]);
const handleClick = useCallback(() => console.log('Clicked item'), []);
```

### 101. useRef primary use cases:
1. Direct DOM access (focusing an input, measuring element size).
2. Storing mutable values that persist across renders without triggering a re-render when modified.

```tsx
// useRef for DOM access and persistent mutable value without re-renders:
function TextInputWithFocus() {
  const inputEl = useRef<HTMLInputElement>(null);
  const clickCount = useRef(0); // Updates without triggering re-render!

  const onButtonClick = () => {
    inputEl.current?.focus();
    clickCount.current++;
  };
  return <input ref={inputEl} type="text" />;
}
```

### 102. useLayoutEffect vs useEffect:
- `useLayoutEffect`: Runs synchronously *after* DOM mutations but *before* the browser paints (use only for measuring layout to avoid visual flickering).
- `useEffect`: Runs asynchronously *after* paint; does not block the UI.

```tsx
// useLayoutEffect runs synchronously before browser paints (prevents visual flicker):
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setTooltipPosition(height + 10);
}, []);
```

### 103. React Context API and preventing consumer re-renders:
Every component consuming a context re-renders whenever the context `value` changes.
**Fix**: Split context into separate State and Dispatch contexts, or memoize value with `useMemo`.

```tsx
// React Context with custom hook wrapper:
const ThemeContext = createContext<'light' | 'dark'>('light');

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}
```

### 104. Controlled vs Uncontrolled components:
- **Controlled**: Form data is handled by React state (`value` + `onChange`).
- **Uncontrolled**: Form data is handled by the DOM itself, accessed via `ref`.

```tsx
// Controlled (state-driven) vs Uncontrolled (DOM-driven):
// Controlled:
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled:
<input ref={inputRef} defaultValue="John" />
```

### 105. Custom Hooks vs HOCs:
Custom Hooks extract stateful logic into simple reusable functions without wrapping components or creating deep nesting.

```typescript
// Reusable custom hook:
export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}
```

### 106. React Synthetic Events:
React wraps native browser events in cross-browser `SyntheticEvent` instances, delegating listeners to the root DOM container (`#root`).

```tsx
// React SyntheticEvent stops propagation across component trees:
function Button() {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents bubbling to parent handlers
  };
  return <button onClick={handleClick}>Click me</button>;
}
```

### 107. React.memo() shallow comparison:
Skips re-rendering a component if its props haven't changed (`prevProps === nextProps`). Wrap function props in `useCallback` to avoid breaking memoization.

```tsx
// React.memo with custom comparison function:
export const UserCard = React.memo(function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}, (prevProps, nextProps) => prevProps.user.id === nextProps.user.id);
```

### 108. React Error Boundaries:
Components that catch JavaScript errors in their child tree and display a fallback UI. Must currently be class components with `componentDidCatch`.

```tsx
// Class-based Error Boundary catching render exceptions:
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error('Logged crash:', error); }
  render() {
    return this.state.hasError ? <h2>Something went wrong.</h2> : this.props.children;
  }
}
```

### 109. Concurrent React: startTransition and useTransition:
Marks state updates as non-urgent transitions (e.g. tab switching) that can be interrupted by urgent user typing:
```typescript
const [isPending, startTransition] = useTransition();
startTransition(() => setFilter(value));
```

### 110. useDeferredValue vs Debouncing:
- Debounce enforces a fixed time delay.
- `useDeferredValue` starts updating immediately in the background, yielding to user clicks automatically.

```tsx
// useDeferredValue defers re-rendering heavy list until main render finishes:
const deferredQuery = useDeferredValue(query);
const results = useMemo(() => filterItems(deferredQuery), [deferredQuery]);
```

### 111. React Suspense:
Coordinates declarative loading fallbacks for components that are fetching data or lazy-loaded: `<Suspense fallback={<Spinner />}> <Profile /> </Suspense>`.

```tsx
// Suspense boundary for async component loading:
<Suspense fallback={<ProductCardSkeleton />}>
  <AsyncProductDetails productId={id} />
</Suspense>
```

### 112. The useId hook:
Generates unique, stable accessibility IDs that are guaranteed identical between server-rendered HTML and client hydration.

```tsx
// useId generates accessible, unique, hydration-stable IDs:
function FormInput({ label }: { label: string }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </>
  );
}
```

### 113. useSyncExternalStore:
Safely subscribes to external non-React state stores (Zustand, browser APIs) in Concurrent React without visual tearing.

```typescript
// Subscribing to external store without tearing:
const isOnline = useSyncExternalStore(
  (callback) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  },
  () => navigator.onLine
);
```

### 114. useImperativeHandle and forwardRef:
Customizes the imperative methods exposed to parent components when using `ref`:
```typescript
useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));
```

### 115. React.StrictMode double-invocations:
Intentionally mounts, unmounts, and re-mounts components in development to detect unhandled side-effects and missing cleanups in `useEffect`.

```tsx
// StrictMode intentionally mounts -> unmounts -> re-mounts effects in development:
useEffect(() => {
  const socket = connectSocket();
  return () => socket.disconnect(); // Verified to run cleanly twice in development!
}, []);
```

### 116. React 19: useActionState and useFormStatus:
- `useActionState(fn, initial)`: Handles form action execution, pending states, and returned data.
- `useFormStatus()`: Child hook reading whether the parent `<form>` is submitting (`pending`).

```tsx
// React 19 useActionState and useFormStatus:
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Submit'}</button>;
}
```

### 117. React 19 use() API:
Unwraps Promises and Context directly inside render, even inside conditional blocks and loops.

```tsx
// React 19 use() API unravelling Promises and Context conditionally:
import { use } from 'react';

function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // Directly unwraps promise inside component!
  return <h1>{user.name}</h1>;
}
```

### 118. React 19 Server Actions:
Async functions defined with `'use server'` that execute on the server, invokable directly from client form actions.

```tsx
// React 19 Server Action declared inline with 'use server':
export default function AddUserForm() {
  async function createUser(formData: FormData) {
    'use server';
    await db.user.create({ data: { name: formData.get('name') as string } });
  }
  return <form action={createUser}><input name="name" /><button>Add</button></form>;
}
```

### 119. Eliminating Prop Drilling:
Component composition (passing JSX children), Context API for global preferences, and Zustand for global UI state.

```tsx
// Eliminating prop drilling with Component Composition:
function Page({ user }: { user: User }) {
  // Instead of passing user through 5 layers, pass finished component as child:
  return <Layout header={<UserBadge user={user} />} />;
}
```

### 120. Automatic State Batching:
React 18+ automatically batches multiple state updates inside promises, timeouts, and native event handlers into a single re-render.

```tsx
// React 18 automatic batching: Only 1 re-render occurs even inside async timeouts:
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 18 batches both into a SINGLE render cycle!
}, 1000);
```

### 121. Debugging infinite re-render loops:
Caused by updating state unconditionally during render or inside a `useEffect` whose dependency array includes the mutated state.

```tsx
// Fixing infinite re-render loop by memoizing object reference in dependencies:
const options = useMemo(() => ({ id }), [id]); // Stable object reference!

useEffect(() => {
  fetchData(options);
}, [options]); // No longer triggers infinite re-renders on every render!
```

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

```tsx
// Resetting component state cleanly by changing its 'key' prop:
<AccountEditForm key={currentUserId} userId={currentUserId} />
```

### 124. Why array index as key is an anti-pattern:
If items are reordered or deleted, index keys cause React to preserve child DOM nodes incorrectly, leading to UI input bugs.

```tsx
// Array index as key causes state bugs on item deletion:
// BAD: {items.map((item, index) => <TodoItem key={index} {...item} />)}

// GOOD: Always use unique, stable entity IDs:
{items.map(item => <TodoItem key={item.id} {...item} />)}
```

### 125. React Portals:
`ReactDOM.createPortal(children, document.body)` renders modals outside parent CSS clipping while preserving React event bubbling.

```tsx
import { createPortal } from 'react-dom';

function Modal({ children }: { children: React.ReactNode }) {
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">{children}</div>,
    document.body
  );
}
```

### 126. Hydration Mismatch in React SSR:
Occurs when server HTML differs from client render (e.g. using `new Date()` or `window`). Fix: Move client-only checks into `useEffect`.

```tsx
// Fixing Hydration Mismatch for client-only timestamps:
function ClientClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => setTime(new Date().toLocaleTimeString()), []);
  return <span>{time ?? 'Loading...'}</span>;
}
```

### 127. Zustand vs Redux Toolkit:
- **Zustand**: Minimalist, hook-based, zero boilerplate, no Provider wrapper required.
- **Redux Toolkit**: Structured, opinionated, includes RTK Query; best for large legacy enterprise teams.

```typescript
// Zustand lightweight store without boilerplate:
import { create } from 'zustand';

export const useStore = create<{ count: number; inc: () => void }>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 }))
}));
```

### 128. CSS Modules vs Tailwind CSS:
- **CSS Modules**: Scoped standard CSS per file.
- **Tailwind CSS**: Utility-first, zero runtime CSS output, fast design token alignment.

```tsx
// Tailwind utility styling vs CSS Module:
// Tailwind:
<button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium" />
```

### 129. Virtualizing large lists (TanStack Virtual):
Renders only the DOM nodes currently visible within the viewport window, allowing smooth 60fps scrolling over 100,000+ items.

```tsx
// Virtualizing 100,000 rows with TanStack Virtual:
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: 100000,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35,
});
```

### 130. Unit testing with React Testing Library:
Query by accessible role and text rather than implementation details: `screen.getByRole('button', { name: /save/i })`.

---

```tsx
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

test('renders user email', () => {
  render(<UserProfile user={{ name: 'Alice', email: 'alice@example.com' }} />);
  expect(screen.getByText('alice@example.com')).toBeInTheDocument();
});
```

## Part 6: Next.js (App Router & Pages Router), SSR & Full-Stack Patterns (131 - 160)

### 131. App Router (app/) vs Pages Router (pages/):
- **Pages Router**: Page-level routing; data fetching via `getServerSideProps` / `getStaticProps`; client components by default.
- **App Router**: Nested routing with layouts; React Server Components (RSC) by default; streaming SSR; route handlers.

```tsx
// Next.js App Router (app/page.tsx) with React Server Component by default:
export default async function HomePage() {
  const data = await db.query('SELECT * FROM items');
  return <ul>{data.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}
```

### 132. Server Components (RSC) vs Client Components ('use client'):
- **Server Components (Default)**: Run **only on the server**; 0 KB client bundle size; direct access to database/files; cannot use hooks.
- **Client Components ('use client')**: Hydrated and interactive on client; can use hooks (`useState`, `useEffect`) and browser events.

```tsx
// Server Component (RSC) importing Client Component:
import ClientSearchInput from './ClientSearchInput'; // 'use client'

export default async function ProductPage() {
  const products = await getProducts(); // Direct server-side DB query!
  return (
    <div>
      <ClientSearchInput />
      <ProductList items={products} />
    </div>
  );
}
```

### 133. Passing Server Components into Client Components:
A Client Component cannot import a Server Component directly. Instead, pass the Server Component as a `children` prop:
`<ClientModal> <ServerDataList /> </ClientModal>`.

```tsx
// Passing Server Component into Client Component as children:
// ClientWrapper has 'use client'
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return <div>{isOpen && children}</div>;
}
```

### 134. 4 Rendering Strategies: CSR, SSR, SSG, ISR:
- **CSR**: Client-only rendering.
- **SSR**: Server-rendered on every request (`dynamic = 'force-dynamic'`).
- **SSG**: Pre-rendered at build time (`generateStaticParams`).
- **ISR**: Incremental Static Regeneration; static page rebuilt in background after cache expiration.

```tsx
// Segment Configuration for rendering strategy:
export const dynamic = 'auto'; // Default
export const revalidate = 3600; // ISR: revalidate cache every hour
export const fetchCache = 'force-cache';
```

### 135. Incremental Static Regeneration (ISR):
- **Time-based**: `fetch(url, { next: { revalidate: 60 } })` rebuilds static page after 60 seconds.
- **On-demand**: Triggered via `revalidatePath('/posts')` or `revalidateTag('products')` in a Server Action.

```tsx
// Incremental Static Regeneration (ISR) in Next.js App Router:
export const revalidate = 60; // Regenerate static page in background every 60s

export default async function StockTicker() {
  const price = await fetchStockPrice();
  return <div>Current Price: ${price}</div>;
}
```

### 136. App Router file conventions:
`layout.tsx` (shared UI, preserves state), `page.tsx` (unique route UI), `loading.tsx` (instant Suspense fallback), `error.tsx` (error boundary), `not-found.tsx` (404 UI).

```
app/
  layout.tsx    // Root layout shared across all routes
  page.tsx      // Route UI for /
  loading.tsx   // Instant loading skeleton using React Suspense
  error.tsx     // Error boundary for runtime errors ('use client')
  not-found.tsx // 404 page
```

### 137. layout.tsx vs template.tsx:
`layout.tsx` preserves component state across child navigation; `template.tsx` remounts and creates fresh instance on every navigation.

```tsx
// template.tsx creates a NEW instance on navigation (resets state/animations):
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fadeIn">{children}</div>;
}
```

### 138. Route Handlers (route.ts):
Replaces Pages Router API routes with standard Web Request/Response handlers (`export async function GET()`).

```typescript
// Next.js Route Handler (app/api/users/route.ts):
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const users = await db.users.findMany();
  return NextResponse.json(users);
}
```

### 139. Next.js Extended fetch API:
- `{ cache: 'force-cache' }`: Cached indefinitely (SSG).
- `{ cache: 'no-store' }`: Fresh fetch on every request (SSR).
- `{ next: { revalidate: 3600 } }`: ISR caching.

```typescript
// Next.js extended fetch with granular caching controls:
// Cached permanently (SSG):
const staticData = await fetch('https://api.com/data', { cache: 'force-cache' });

// Dynamic per request (SSR):
const liveData = await fetch('https://api.com/prices', { cache: 'no-store' });

// Time-based ISR:
const timedData = await fetch('https://api.com/news', { next: { revalidate: 300 } });
```

### 140. Next.js Middleware:
Runs on the Edge Runtime before a request completes; ideal for auth redirects, bot detection, and header manipulation.

```typescript
// Next.js middleware.ts for auth token validation & redirect:
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session-token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### 141. Route segments: [slug], [...slug], [[...slug]]:
- `[slug]`: Single segment (`/posts/1`).
- `[...slug]`: Catch-all (`/docs/a/b/c`).
- `[[...slug]]`: Optional catch-all (matches `/docs` as well as `/docs/a/b`).

```typescript
// Segment param types:
// [slug] -> params: { slug: string }
// [...slug] -> params: { slug: string[] } (catches /a/b/c)
// [[...slug]] -> optional catch-all (matches / AND /a/b)
```

### 142. Route Groups ((group)):
Organizes folders without affecting URL paths (`app/(marketing)/about` -> `/about`). Allows separate root layouts.

```
app/
  (marketing)/
    about/page.tsx   // Accessible at /about (folder name omitted from URL!)
  (dashboard)/
    settings/page.tsx // Accessible at /settings
```

### 143. Parallel (@slot) and Intercepting ((.)) Routes:
- **Parallel Routes (`@modal`)**: Renders multiple pages simultaneously within the same layout.
- **Intercepting Routes (`(.)photo/[id]`)**: Intercepts a route to show a modal overlay while preserving direct URL link sharing.

```
app/
  feed/
    page.tsx
    @modal/          // Parallel route slot
      default.tsx
      (.)photo/[id]/ // Intercepts /photo/[id] to show modal in-place!
        page.tsx
```

### 144. next/image Core Web Vitals optimization:
Automatically serves modern formats (WebP, AVIF), resizes per device viewport, prevents CLS with intrinsic sizing, and lazy-loads off-screen images.

```tsx
import Image from 'next/image';

export function HeroImage() {
  return (
    <Image
      src="/hero.png"
      alt="Hero banner"
      width={1200}
      height={630}
      priority // Preloads image to optimize Largest Contentful Paint (LCP)
    />
  );
}
```

### 145. next/font optimization:
Self-hosts Google fonts at build time, eliminating external network requests, and automatically injects matching fallback metric overrides to eliminate FOUT.

```typescript
// Zero layout-shift font loading with next/font:
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={inter.className}><body>{children}</body></html>;
}
```

### 146. Next.js Server Actions with optimistic UI:
Server functions with `'use server'` that execute on server, paired with `useOptimistic` hook to update the UI immediately before server confirmation.

```tsx
// Server Action triggering path revalidation:
'use server';
import { revalidatePath } from 'next/cache';

export async function addComment(formData: FormData) {
  await db.comments.create({ content: formData.get('comment') });
  revalidatePath('/posts/[id]'); // Purges and regenerates cached page!
}
```

### 147. Streaming SSR with React Suspense:
Streams server HTML in chunks over a single HTTP connection. Fast parts of the page render immediately while slow components stream in later.

```tsx
// Streaming SSR with Suspense:
export default function Page() {
  return (
    <main>
      <h1>Page Title (Renders Instantly)</h1>
      <Suspense fallback={<p>Loading heavy recommendations...</p>}>
        <AsyncRecommendations />
      </Suspense>
    </main>
  );
}
```

### 148. Dynamic vs Static route segment config:
`export const dynamic = 'force-dynamic'` forces SSR on every request; `export const dynamic = 'force-static'` forces static rendering.

```typescript
// Enforcing Edge runtime on specific route:
export const runtime = 'edge'; // Executes on Cloudflare / Vercel Edge nodes
```

### 149. generateStaticParams:
Replaces `getStaticPaths` in App Router, returning an array of slug objects to pre-render at build time.

```typescript
// Pre-rendering all static blog post routes at build time:
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

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

```typescript
import { redirect, permanentRedirect } from 'next/navigation';

export async function ProfilePage({ user }: { user: User | null }) {
  if (!user) redirect('/login'); // HTTP 307 temporary redirect
  if (user.hasLegacyUrl) permanentRedirect('/new-profile'); // HTTP 308 permanent
}
```

### 152. Secure Authentication in Next.js:
Store session tokens in `HttpOnly, Secure, SameSite=Lax` cookies. Verify in Edge Middleware for fast route protection, and re-verify permissions inside Server Actions.

```typescript
// Validating authentication session in Server Component:
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminPanel() {
  const session = await auth();
  if (!session || session.user.role !== 'admin') redirect('/unauthorized');
  return <h1>Admin Controls</h1>;
}
```

### 153. Partial Prerendering (PPR):
Combines static prerendering and dynamic streaming in the same route: static shell is served instantly from CDN, while dynamic holes wrapped in Suspense stream in from server.

```typescript
// Partial Prerendering (PPR) in next.config.mjs:
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true, // Combines static shell with dynamic streamed components
  },
};
export default nextConfig;
```

### 154. Node.js Runtime vs Edge Runtime:
- **Node.js Runtime**: Full access to all Node.js APIs (`fs`, native modules).
- **Edge Runtime**: Lightweight V8 isolate engine; sub-millisecond cold starts; limited to Web standard APIs.

```typescript
// Node.js Runtime vs Edge Runtime:
// Default: Node.js (Full access to fs, crypto, child_process, 4GB memory)
// Edge: Fast V8 isolates (Web standards only, sub-10ms global cold starts)
export const runtime = 'nodejs';
```

### 155. Turbopack vs Webpack:
Turbopack is written in Rust by the creator of Webpack. It compiles incremental changes up to 10x faster by caching function-level computation graphs.

```bash
# Run Next.js with Rust-powered Turbopack for up to 10x faster HMR:
next dev --turbo
```

### 156. Environment variable boundaries:
`NEXT_PUBLIC_*` is inlined into client JavaScript bundles at build time. Variables without `NEXT_PUBLIC_` are accessible only on the server runtime.

```typescript
// Environment variable boundaries:
// Exposed to client bundle:
const clientKey = process.env.NEXT_PUBLIC_STRIPE_KEY;

// Server-only (never bundled into client JS):
const secretKey = process.env.STRIPE_SECRET_KEY;
```

### 157. server-only package protection:
Importing `import 'server-only'` into a backend data module throws a build-time compiler error if any client component attempts to import it, guaranteeing private secrets never leak into client bundles.

```typescript
// Enforce that sensitive database logic can NEVER be imported by client components:
import 'server-only';

export async function querySecretDatabase() {
  return db.query('SELECT secret FROM keys');
}
```

### 158. Internationalized routing (i18n):
Implemented using dynamic root segments: `app/[lang]/page.tsx` with Middleware detecting `Accept-Language` header and redirecting to matching locale.

```
app/
  [lang]/
    page.tsx // Matches /en, /es, /fr, /de
    layout.tsx
```

### 159. Standalone Docker deployment:
Enable `output: 'standalone'` in `next.config.js`. Next.js traces required dependencies and outputs a minimal standalone server container (~80MB instead of ~1GB).

```javascript
// next.config.mjs standalone output for minimal Docker images (< 100MB):
const nextConfig = {
  output: 'standalone',
};
export default nextConfig;
```

### 160. Monitoring production Core Web Vitals:
Use the built-in `useReportWebVitals` hook to stream real-user metric payloads (LCP, CLS, INP, TTFB) to analytics endpoints or monitoring platforms.

```tsx
// Monitoring Core Web Vitals in App Router (app/reportWebVitals.ts):
export function reportWebVitals(metric: any) {
  // Logs LCP, FID, CLS, INP metrics to analytics collector
  console.log(metric.name, metric.value);
}
```
