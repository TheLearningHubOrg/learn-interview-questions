# Svelte 5 Runes & Astro Islands Master Interview Bank (1 - 33)

> Svelte 5 Runes ($state, $derived, $effect), compiler reactivity without Virtual DOM, SvelteKit SSR, Astro Islands architecture, Zero-JS by default, and Content Collections.

---

### 1. What are Svelte 5 Runes, and how does `$state()` provide fine-grained reactivity without a Virtual DOM?
**In Simple Words:**
**Runes** are Svelte 5's modern signal-based reactivity primitives, signaled with a `$` prefix.

In previous Svelte versions, reactivity was based on variable assignment (`let count = 0; count++`) which only worked inside `.svelte` files. In Svelte 5, `$state()` creates a true universal signal that works inside components, classes, and standalone `.svelte.js` files.

Because Svelte compiles templates into direct DOM operations, updating `$state()` surgically updates only the exact text node or attribute without re-executing component render functions or diffing a Virtual DOM.

```svelte
<script>
  // Svelte 5 Rune
  let count = $state(0);
  let user = $state({ name: 'Alex', loggedIn: true });

  function increment() {
    count += 1; // Fine-grained DOM update
  }
</script>

<button onclick={increment}>
  Clicks: {count}
</button>
```

### 2. How does `$derived()` and `$derived.by()` work in Svelte 5?
**In Simple Words:**
`$derived(expression)` declares state that depends on other reactive signals. It automatically tracks any reactive values read inside the expression and updates only when dependencies change.

For complex, multi-line derived logic, use `$derived.by(fn)`.

```svelte
<script>
  let items = $state([10, 20, 30]);

  // Derived signal
  let total = $derived(items.reduce((sum, n) => sum + n, 0));

  // Complex multi-line derived signal
  let stats = $derived.by(() => {
    const sum = items.reduce((a, b) => a + b, 0);
    return { sum, avg: sum / items.length };
  });
</script>
```

### 3. What is `$effect()` in Svelte 5, and how does cleanup handling work?
**In Simple Words:**
`$effect(fn)` is a rune for running side effects when reactive state changes. It replaces lifecycle hooks like `afterUpdate`.

- Runs only in the browser (never on the server during SSR).
- Runs after the DOM has been updated.
- Returning a function from the effect registers a **cleanup function** that executes before the effect re-runs or when the component is unmounted.

```svelte
<script>
  let count = $state(0);

  $effect(() => {
    const timer = setInterval(() => {
      console.log('Count is currently:', count);
    }, 1000);

    // Cleanup on re-run or unmount
    return () => clearInterval(timer);
  });
</script>
```

### 4. How are Component Props handled in Svelte 5 using `$props()` and `$bindable()`?
**In Simple Words:**
In Svelte 5, `export let foo = bar;` is replaced by the `$props()` rune. You can destructure props with default values and full TypeScript typing.

If a child component needs to support two-way binding (`bind:value`), the prop must be declared with `$bindable()`.

```svelte
<!-- ChildComponent.svelte -->
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
    value?: string;
  }

  let { title, count = 0, value = $bindable('') }: Props = $props();
</script>

<input bind:value={value} />
```

### 5. How does Svelte compile components directly into surgical DOM instructions instead of using a Virtual DOM?
**In Simple Words:**
React and Vue ship a runtime Virtual DOM engine to the user's browser, comparing virtual trees on every update.

Svelte shifts the work from runtime to **compile time**:
- During the build, Svelte analy

### 6. Explain SvelteKit's File-Based Routing System: `+page.svelte`, `+layout.svelte`, and `+error.svelte`.
**In Simple Words:**
SvelteKit organi

### 7. Data Loading in SvelteKit: `+page.js` vs. `+page.server.js` (`load` functions).
**In Simple Words:**
- `+page.js`: Universal `load` function. Runs on both server (during SSR) and client (during client-side SPA navigation). Best for public API fetches.
- `+page.server.js`: Server-only `load` function. **Only runs on the server**. Safe for database queries, private environment variables (`DATABASE_URL`), and secret API keys.

```typescript
// src/routes/posts/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async () => {
  const posts = await db.post.findMany({ take: 10 });
  return { posts };
};
```

### 8. How do Form Actions work in SvelteKit for progressive enhancement?
**In Simple Words:**
**Form Actions** in SvelteKit let you handle data mutations without writing custom API routes or client fetch logic. Defined in `+page.server.js`, actions execute when an HTML `<form method="POST">` is submitted.

With `use:enhance`, SvelteKit progressively enhances the form: if JavaScript is enabled, it uses `fetch()` without a full page reload; if JavaScript is disabled, the form works via standard HTTP POST.

```typescript
// src/routes/contact/+page.server.ts
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    if (!email) return fail(400, { missing: true });
    return { success: true };
  }
};
```

### 9. How do SvelteKit Server Endpoints work with `+server.js`?
**In Simple Words:**
You can create standalone REST API endpoints by adding a `+server.ts` file in any route directory and exporting HTTP method functions (`GET`, `POST`, `DELETE`).

```typescript
// src/routes/api/users/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({ users: ['Alice', 'Bob'] });
};
```

### 10. What are SvelteKit Hooks, and how does the `handle` hook manage authentication sessions?
**In Simple Words:**
Hooks are app-wide server lifecycle functions defined in `src/hooks.server.ts`. The `handle` hook intercepts every request sent to the SvelteKit server, allowing you to validate session cookies and populate `event.locals`.

```typescript
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get('session');
  event.locals.user = sessionToken ? { id: 'usr_123', name: 'Sam' } : null;

  return await resolve(event);
};
```

### 11. How do Transitions and Animations work in Svelte?
**In Simple Words:**
Svelte provides built-in declarative animation and transition primitives (`fade`, `fly`, `slide`, `scale`, `crossfade`). Because they are compiled into CSS animations, they run on the browser's compositor thread without JavaScript frame drops.

```svelte
<script>
  import { fade, fly } from 'svelte/transition';
  let visible = $state(true);
</script>

{#if visible}
  <div transition:fly={{ y: 20, duration: 300 }}>
    Smooth Notification
  </div>
{/if}
```

### 12. How do legacy Svelte Stores (`writable`, `readable`) relate to Svelte 5 Runes?
**In Simple Words:**
In Svelte 3/4, global reactive state was managed using **Stores** (`writable`, `readable`), accessed in templates with the `$` auto-subscription prefix (`$cartStore`).

In Svelte 5, stores are still fully supported for backwards compatibility, but **Runes in `.svelte.js` files** are the modern recommended pattern because signals can be read and mutated like standard JavaScript objects without store subscriptions.

### 13. What are SvelteKit Adapters, and how do you configure deployment targets?
**In Simple Words:**
SvelteKit compiles your app into platform-neutral artifacts. **Adapters** convert those artifacts into the target hosting environment:
- `@sveltejs/adapter-auto`: Automatically detects Vercel, Netlify, or Cloudflare during deployment.
- `@sveltejs/adapter-node`: Generates a standalone Node.js server.
- `@sveltejs/adapter-static`: Prerenders the entire app into static HTML files.

---

## Part 4: Modern Build Tooling & Comparative Architecture (46 - 50)

### 14. How does Vite work internally: Native ES Modules in development vs. Rollup in production?
**In Simple Words:**
Traditional bundlers (Webpack) bundle the entire dependency graph before starting the development server.

**Vite**:
- **In Development**: Divides application code into dependencies (pre-bundled with bla

### 15. Explain Hydration Costs: Progressive Hydration vs. Resumability (Qwik) vs. Islands Architecture (Astro).
**In Simple Words:**
1. **Full Hydration** (React/Vue SPA): The entire page HTML is downloaded, then the entire JS bundle is downloaded, and the entire component tree executes to attach event listeners. High Total Blocking Time (TBT).
2. **Islands Architecture** (Astro): Only designated interactive components are hydrated. Static parts send

### 16. Micro-Frontends vs. Island Architecture: When should you use which?
**In Simple Words:**
- **Island Architecture**: Best for a single application where parts of a page are static and parts are interactive. All islands share a single build and deployment pipeline.
- **Micro-Frontends**: Best for large enterprise organi

### 17. How do modern frameworks optimize Core Web Vitals (INP, LCP, and CLS)?
**In Simple Words:**
1. **INP (Interaction to Next Paint)**: Minimi

### 18. Senior Architect Matrix: How do you choose between React, Angular, Vue, Svelte, and Astro in 2026?
**In Simple Words:**
| Framework | Primary Sweet Spot | Key Superpower |
| :--- | :--- | :--- |
| **Astro** | Content sites, marketing, docs, e-commerce | Zero JavaScript by default, multi-framework islands |
| **React / Next.js** | Mass-market web apps, large hiring pool | Ecosystem si

### 19. What is the Astro Islands architecture (Component Islands), and how does it achieve "Zero JavaScript by Default"?
**In Simple Words:**
Astro Islands (Component Islands) refers to an architectural pattern where an HTML document is rendered as purely static, server-generated HTML, and only small, isolated interactive UI widgets ("islands") are hydrated with client-side JavaScript.

By default, even if you write components using React, Vue, or Svelte inside an Astro project, Astro strips out all client-side JavaScript during build time and renders static HTML and CSS. JavaScript is only downloaded and executed in the user's browser if you explicitly opt-in with a client directive (e.g. `client:load` or `client:visible`).

```astro
---
// Astro Component (Zero JS sent to browser by default)
import StaticHeader from '../components/StaticHeader.astro';
import InteractiveCounter from '../components/InteractiveCounter.jsx';
import NewsletterSignup from '../components/NewsletterSignup.vue';
---

<html>
  <body>
    <!-- 100% Static HTML. 0kB client-side JS bundled -->
    <StaticHeader />

    <!-- Hydrated immediately when page loads -->
    <InteractiveCounter client:load initialCount={0} />

    <!-- Hydrated ONLY when scrolled into the browser viewport -->
    <NewsletterSignup client:visible />
  </body>
</html>
```

### 20. Explain Astro Client Hydration Directives: `client:load`, `client:idle`, `client:visible`, `client:media`, and `client:only`.
**In Simple Words:**
Client directives tell Astro when and how to hydrate an interactive component island:
1. `client:load`: High-priority hydration. Downloads and executes component JS immediately as soon as the page loads. Use for critical UI like mobile navigation toggles or primary search bars.
2. `client:idle`: Lower-priority hydration. Hydrates as soon as the main thread is idle (using `requestIdleCallback`). Use for non-critical widgets like notifications or secondary carousels.
3. `client:visible`: La

### 21. What are Astro Server Islands (`server:defer`), and how do they solve personalized content caching?
**In Simple Words:**
**Server Islands** allow you to cache an entire page at the CDN/Edge statically, while delegating dynamic or personali

### 22. How do Astro Content Collections work, and how does the Zod schema provide compile-time type safety?
**In Simple Words:**
**Content Collections** provide a structured, type-safe system for managing Markdown, MDX, JSON, or YAML content files in `src/content/`. 

By defining a schema with **Zod** in `src/content/config.ts`, Astro validates frontmatter properties at build time. If an author forgets a required field or enters an invalid date format, the build fails immediately with a descriptive error.

```typescript
// src/content/config.ts
import { defineCollection,

### 23. Static Site Generation (SSG) vs. Server-Side Rendering (SSR) in Astro: How does output mode configuration work?
**In Simple Words:**
Astro supports both **static pre-rendering (SSG)** and **on-demand server rendering (SSR)** via an adapter (Node, Vercel, Cloudflare).

In Astro, you configure `output: 'static'` (default) or `output: 'server'`. Even in static mode, individual routes can opt into SSR using `export const prerender = false;`, and in server mode, routes can be statically pre-rendered with `export const prerender = true;` (Hybrid Rendering).

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // On-demand SSR
  adapter: node({
    mode: 'standalone',
  }),
});
```

### 24. How do Astro View Transitions (`<ClientRouter />`) work without requiring a heavy SPA JavaScript bundle?
**In Simple Words:**
Astro's View Transitions intercept link clicks on the client, fetch the next page's HTML via `fetch()`, swap the `document.body`, and animate elements between pages using the native browser **View Transitions API** (`document.startViewTransition`).

This provides seamless SPA-like page transitions, persistent audio players, and smooth morphing animations while maintaining a lightweight multi-page architecture (MPA).

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
<body>
  <!-- Morph this image seamlessly across pages -->
  <img 
    src="/avatar.jpg" 
    transition:name="user-hero-avatar" 
    transition:animate="slide" 
  />
</body>
```

### 25. How does Astro enable using multiple UI frameworks (React, Vue, Svelte) inside the same project?
**In Simple Words:**
Astro treats UI frameworks as component compilers. Each framework plugin (`@astrojs/react`, `@astrojs/vue`, `@astrojs/svelte`) compiles its respective components into static HTML during server rendering.

You can import and render a React component, a Vue component, and a Svelte component on the same Astro page. Communication between different framework islands is achieved via standard browser CustomEvents or lightweight state stores like **Nano Stores**.

```typescript
// Shared state with Nano Stores across React and Svelte
import { atom } from 'nanostores';

export const $cartCount = atom(0);

export function addToCart() {
  $cartCount.set($cartCount.get() + 1);
}
```

### 26. What are Astro API Endpoints (`src/pages/api/...`), and how do they handle REST methods?
**In Simple Words:**
In Astro, any `.ts` or `.js` file placed in `src/pages/` can export HTTP method handlers (`GET`, `POST`, `PUT`, `DELETE`, `ALL`). They run on the server and return standard web API `Response` objects.

```typescript
// src/pages/api/feedback.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  if (!data.message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, received: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### 27. How does Astro Middleware work for request interception and authentication guards?
**In Simple Words:**
Astro middleware runs before every request in SSR mode. Defined in `src/middleware.ts`, the `onRequest` function intercepts incoming requests, accesses cookies, inspects session tokens, adds properties to `locals`, and optionally redirects unauthori

### 28. How does the Astro `<Image />` component optimize core web vitals compared to standard HTML images?
**In Simple Words:**
Astro's built-in `astro:assets` service automatically processes local images at build time:
- Automatically converts heavy PNGs/JPEGs into modern **AVIF** and **WebP** formats.
- Infers intrinsic width, height, and aspect ratio to prevent Cumulative Layout Shift (CLS).
- Automatically sets `loading="la

### 29. How does scoped styling work in Astro components by default?
**In Simple Words:**
Inside an `.astro` file, CSS written in a `<style>` tag is automatically **scoped** to that component by default. Astro generates a unique data attribute (e.g. `data-astro-cid-357jx4n`) and appends it to CSS selectors, preventing style leakage.

To opt out for specific global styles, use the `<style is:global>` directive.

```astro
<div class="card">
  <p>Scoped Text</p>
</div>

<style>
  /* Only styles .card inside THIS component */
  .card {
    background: #f4f4f5;
    padding: 1.5rem;
    border-radius: 12px;
  }
</style>
```

### 30. How does the Markdown and MDX rendering pipeline work in Astro?
**In Simple Words:**
Astro has native support for Markdown and MDX. It compiles markdown files using **Remark** (for markdown AST transformations) and **Rehype** (for HTML AST transformations).

You can easily configure remark/rehype plugins in `astro.config.mjs` to automatically add syntax highlighting (Shiki), autolink headers, or math equations (KaTeX).

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: 'dracula' },
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
  },
});
```

### 31. How does Internationalization (i18n) routing work natively in Astro?
**In Simple Words:**
Astro has built-in routing for multilingual websites. You configure supported locales and default locale in `astro.config.mjs`. Astro automatically handles subpath routing (e.g. `/en/about`, `/fr/about`) and locale fallback.

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

### 32. How do you deploy Astro to Edge and Serverless runtimes (Vercel, Cloudflare Pages, AWS)?
**In Simple Words:**
Astro relies on official adapters to generate platform-specific serverless/edge functions:
- `@astrojs/vercel`: Deploys SSR routes to Vercel Serverless or Edge functions with automatic ISR support.
- `@astrojs/cloudflare`: Deploys to Cloudflare Pages Functions running on the V8 Workers runtime.
- `@astrojs/node`: Packages the app into a high-performance standalone Node.js server.

```bash
# Adding Vercel adapter
npx astro add vercel
```

### 33. When should you choose Astro over Next.js, Remix, or a traditional SPA?
**In Simple Words:**
**Choose Astro when**:
- The project is content-driven (documentation, marketing sites, blogs, e-commerce storefronts, portfolios).
- Maximum Lighthouse performance,

