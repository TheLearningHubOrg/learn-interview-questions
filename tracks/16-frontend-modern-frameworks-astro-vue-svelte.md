# Modern Frontend Frameworks Master Interview Question Bank: Astro, Vue 3, Nuxt 3 & Svelte 5 (1 - 50)

> Comprehensive, production-grade interview questions and architectural deep-dives covering Astro (Islands Architecture, Server Islands, Content Collections, Zero-JS), Vue 3 & Nuxt 3 (Composition API, Proxy Reactivity, Nitro Engine, Pinia), and Svelte 5 (Runes, surgical DOM compilation, SvelteKit).

---

## Part 1: Astro Architecture, Islands & Zero-JS Web (1 - 15)

### 1. What is the Astro Islands architecture (Component Islands), and how does it achieve "Zero JavaScript by Default"?
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

### 2. Explain Astro Client Hydration Directives: `client:load`, `client:idle`, `client:visible`, `client:media`, and `client:only`.
**In Simple Words:**
Client directives tell Astro when and how to hydrate an interactive component island:
1. `client:load`: High-priority hydration. Downloads and executes component JS immediately as soon as the page loads. Use for critical UI like mobile navigation toggles or primary search bars.
2. `client:idle`: Lower-priority hydration. Hydrates as soon as the main thread is idle (using `requestIdleCallback`). Use for non-critical widgets like notifications or secondary carousels.
3. `client:visible`: Lazy hydration. Hydrates only when the element enters the user's viewport (using `IntersectionObserver`). Best for below-the-fold content, comment sections, or embedded calculators.
4. `client:media="{query}"`: Conditional hydration based on CSS media queries (e.g. `client:media="(max-width: 768px)"`).
5. `client:only="{framework}"`: Skips server-side rendering entirely. The component only runs on the client. Useful for components requiring browser APIs (`localStorage`, WebGL, Canvas).

```astro
<!-- Examples of Astro Directives -->
<SearchBar client:load />
<AnalyticsWidget client:idle />
<CommentsList client:visible />
<MobileNav client:media="(max-width: 640px)" />
<ThreeJsCanvas client:only="react" />
```

### 3. What are Astro Server Islands (`server:defer`), and how do they solve personalized content caching?
**In Simple Words:**
**Server Islands** allow you to cache an entire page at the CDN/Edge statically, while delegating dynamic or personalized sections (e.g. user avatar, cart count, personalized recommendations) to execute on the server on demand without blocking initial page delivery.

When the page loads, the static HTML renders instantly with a fallback placeholder. In parallel, the browser fetches the server island markup via an automated endpoint and injects it seamlessly.

```astro
---
import UserProfile from '../components/UserProfile.astro';
import GenericSkeleton from '../components/GenericSkeleton.astro';
---

<header>
  <h1>Public Static Store Header (Cached on CDN forever)</h1>
  
  <!-- Server Island: Executed dynamically on server, replaces fallback -->
  <UserProfile server:defer>
    <GenericSkeleton slot="fallback" />
  </UserProfile>
</header>
```

### 4. How do Astro Content Collections work, and how does the Zod schema provide compile-time type safety?
**In Simple Words:**
**Content Collections** provide a structured, type-safe system for managing Markdown, MDX, JSON, or YAML content files in `src/content/`. 

By defining a schema with **Zod** in `src/content/config.ts`, Astro validates frontmatter properties at build time. If an author forgets a required field or enters an invalid date format, the build fails immediately with a descriptive error.

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(80),
    publishedDate: z.date(),
    author: z.string().default('Editorial Team'),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
```

### 5. Static Site Generation (SSG) vs. Server-Side Rendering (SSR) in Astro: How does output mode configuration work?
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

### 6. How do Astro View Transitions (`<ClientRouter />`) work without requiring a heavy SPA JavaScript bundle?
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

### 7. How does Astro enable using multiple UI frameworks (React, Vue, Svelte) inside the same project?
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

### 8. What are Astro API Endpoints (`src/pages/api/...`), and how do they handle REST methods?
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

### 9. How does Astro Middleware work for request interception and authentication guards?
**In Simple Words:**
Astro middleware runs before every request in SSR mode. Defined in `src/middleware.ts`, the `onRequest` function intercepts incoming requests, accesses cookies, inspects session tokens, adds properties to `locals`, and optionally redirects unauthorized users.

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get('session_token')?.value;

  if (context.url.pathname.startsWith('/dashboard') && !token) {
    return context.redirect('/login');
  }

  // Populate locals for downstream pages
  context.locals.userId = token ? 'user_9921' : null;
  return next();
});
```

### 10. How does the Astro `<Image />` component optimize core web vitals compared to standard HTML images?
**In Simple Words:**
Astro's built-in `astro:assets` service automatically processes local images at build time:
- Automatically converts heavy PNGs/JPEGs into modern **AVIF** and **WebP** formats.
- Infers intrinsic width, height, and aspect ratio to prevent Cumulative Layout Shift (CLS).
- Automatically sets `loading="lazy"` and `decoding="async"`.

```astro
---
import { Image } from 'astro:assets';
import myHeroImage from '../assets/hero-banner.png';
---

<!-- Converted to WebP/AVIF, resized, and CLS protected -->
<Image 
  src={myHeroImage} 
  alt="Engineering team collaboration" 
  width={800} 
  height={450} 
  format="webp" 
/>
```

### 11. How does scoped styling work in Astro components by default?
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

### 12. How does the Markdown and MDX rendering pipeline work in Astro?
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

### 13. How does Internationalization (i18n) routing work natively in Astro?
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

### 14. How do you deploy Astro to Edge and Serverless runtimes (Vercel, Cloudflare Pages, AWS)?
**In Simple Words:**
Astro relies on official adapters to generate platform-specific serverless/edge functions:
- `@astrojs/vercel`: Deploys SSR routes to Vercel Serverless or Edge functions with automatic ISR support.
- `@astrojs/cloudflare`: Deploys to Cloudflare Pages Functions running on the V8 Workers runtime.
- `@astrojs/node`: Packages the app into a high-performance standalone Node.js server.

```bash
# Adding Vercel adapter
npx astro add vercel
```

### 15. When should you choose Astro over Next.js, Remix, or a traditional SPA?
**In Simple Words:**
**Choose Astro when**:
- The project is content-driven (documentation, marketing sites, blogs, e-commerce storefronts, portfolios).
- Maximum Lighthouse performance, zero JS by default, and instant Core Web Vitals are primary metrics.
- You want to use multiple frameworks or avoid single-vendor React lock-in.

**Choose Next.js / Remix / SPA when**:
- The app is a heavy, dashboard-style, highly authenticated web application where every screen is stateful and interactive.
- You rely heavily on React-specific server ecosystem features (React Server Actions, React Compiler).

---

## Part 2: Vue 3 & Nuxt 3 Architecture & Reactivity (16 - 32)

### 16. How does the Vue 3 Reactivity System work internally using JavaScript `Proxy` vs. Vue 2's `Object.defineProperty`?
**In Simple Words:**
Vue 2 used `Object.defineProperty` to convert object properties into getters and setters. This had severe limitations: it could not detect newly added properties, deleted properties, or direct array index modifications (`arr[0] = val`).

Vue 3 replaced this with ES6 **`Proxy`**:
- A `Proxy` wraps the target object and intercepts operations at the meta-level (`get`, `set`, `deleteProperty`, `has`).
- When a property is read in a reactive effect (e.g. template render), Vue's `track()` function records the active effect as a subscriber.
- When a property is mutated, Vue's `trigger()` function re-executes all subscribed effects.
- Nested objects are proxied lazily only when accessed, significantly reducing memory consumption.

```javascript
// Conceptual Vue 3 Proxy Reactivity
const targetMap = new WeakMap();
let activeEffect = null;

function reactive(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      track(obj, key);
      const res = Reflect.get(obj, key, receiver);
      return typeof res === 'object' && res !== null ? reactive(res) : res;
    },
    set(obj, key, value, receiver) {
      const res = Reflect.set(obj, key, value, receiver);
      trigger(obj, key);
      return res;
    }
  });
}
```

### 17. `ref()` vs. `reactive()` in Vue 3: What are the differences, pitfalls, and best practices?
**In Simple Words:**
- `ref(val)`: Accepts both primitives (`string`, `number`, `boolean`) and objects. Wraps the value in an object with a `.value` property. In templates, it automatically unwraps so you don't need `.value`.
- `reactive(obj)`: Only accepts objects/arrays. Uses a Proxy directly on the object.

**Pitfalls of `reactive()`**:
1. Destructuring breaks reactivity: `const { count } = reactiveState;` loses reactive connection. Must use `toRefs(reactiveState)`.
2. Cannot reassign the whole object: `state = reactive({ new: 1 })` destroys the original Proxy reference.

*Best Practice*: Most modern Vue 3 teams standardize on `ref()` for consistency across primitives and objects.

```vue
<script setup>
import { ref, reactive, toRefs } from 'vue';

// 1. ref: Works for everything
const count = ref(0);
count.value++;

// 2. reactive: Object only
const user = reactive({ name: 'Alice', role: 'Admin' });
// To destructure safely:
const { name, role } = toRefs(user);
</script>
```

### 18. Vue 3 Composition API vs. Options API: Architectural and Code Organization benefits.
**In Simple Words:**
- **Options API**: Organizes code by option types (`data`, `methods`, `computed`, `watch`, `mounted`). In large components, logic for a single feature is scattered across 5 different options.
- **Composition API**: Organizes code by **logical concern**. All state, computed properties, methods, and lifecycle hooks for a specific feature can be grouped together or extracted into a reusable composable function (`useUserProfile()`).

```vue
<!-- Vue 3 Composition API with <script setup> -->
<script setup>
import { ref, onMounted } from 'vue';
import { useWindowSize } from './composables/useWindowSize';

// Feature A: Counter logic
const count = ref(0);
const increment = () => count.value++;

// Feature B: Reusable composable
const { width, height } = useWindowSize();
</script>
```

### 19. `computed()` vs. `watch()` vs. `watchEffect()` in Vue 3: Execution timing and caching.
**In Simple Words:**
- `computed()`: Pure, cached derived state. Only re-evaluates when reactive dependencies change. Should not cause side effects.
- `watch(source, callback)`: Lazy watcher. Explicitly monitors specified sources. Provides both new and old values. Ideal for async operations (e.g. fetching data when an ID changes).
- `watchEffect(callback)`: Eager watcher. Immediately runs the callback and automatically tracks any reactive dependencies read inside it.

```javascript
import { ref, computed, watch, watchEffect } from 'vue';

const userId = ref(1);

// Computed: Cached derived value
const userEndpoint = computed(() => `/api/users/${userId.value}`);

// Watch: Explicit source, gets old and new values
watch(userId, (newId, oldId) => {
  console.log(`User changed from ${oldId} to ${newId}`);
});

// watchEffect: Implicit dependency tracking with automatic cleanup
watchEffect((onCleanup) => {
  const controller = new AbortController();
  fetch(`/api/users/${userId.value}`, { signal: controller.signal });
  onCleanup(() => controller.abort());
});
```

### 20. How does the `<script setup>` syntax work at compile time in Vue 3?
**In Simple Words:**
`<script setup>` is compile-time syntactic sugar for writing Single-File Components (SFCs) with the Composition API:
- Any top-level variable, function, or import declared inside `<script setup>` is automatically exposed to the template without needing a `return { ... }` block.
- Eliminates boilerplate code and compiles into an inline `setup()` function.
- Delivers better runtime performance because template expressions are compiled into the same scope as setup variables, avoiding proxy lookup overhead.

```vue
<script setup>
// Automatically available in the template!
import MyButton from './MyButton.vue';
const message = 'Hello Vue 3!';
const handleClick = () => console.log('Clicked');
</script>

<template>
  <MyButton @click="handleClick">{{ message }}</MyButton>
</template>
```

### 21. How does Provide / Inject work in Vue 3, and how do you maintain reactivity across deeply nested components?
**In Simple Words:**
**Provide / Inject** solves prop drilling by allowing an ancestor component to supply dependencies to any descendant component in its subtree, regardless of depth.

To keep provided values reactive, pass a `ref` or `reactive` object. To ensure unidirectional data flow, provide mutation methods alongside the state and wrap the exposed state in `readonly()`.

```typescript
// Ancestor Component
import { provide, ref, readonly } from 'vue';

const theme = ref('dark');
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

provide('themeState', {
  theme: readonly(theme),
  toggleTheme,
});

// Deep Descendant Component
import { inject } from 'vue';

const { theme, toggleTheme } = inject('themeState')!;
```

### 22. What are Custom Vue 3 Composables, and what rules must they follow for SSR safety?
**In Simple Words:**
A **Composable** is a function that leverages the Vue Composition API to encapsulate and reuse stateful logic (the Vue equivalent of a React Custom Hook).

Rules for SSR safety:
1. Naming convention: Start with `use` (e.g. `useAuth`, `useFetch`).
2. Do not access browser globals (`window`, `document`, `localStorage`) in the root setup scope; wrap them in `onMounted()` or verify `typeof window !== 'undefined'`.
3. Always clean up timers, intervals, or event listeners in `onUnmounted()`.

```typescript
// composables/useEventListener.ts
import { onMounted, onUnmounted } from 'vue';

export function useEventListener(target: EventTarget, event: string, handler: EventListener) {
  onMounted(() => target.addEventListener(event, handler));
  onUnmounted(() => target.removeEventListener(event, handler));
}
```

### 23. Explain Vue 3's Template Compiler Optimizations: Static Hoisting, Block Tree, and Patch Flags.
**In Simple Words:**
Vue 3's compiler analyzes templates at build time to dramatically speed up runtime virtual DOM diffing:
1. **Static Hoisting**: Elements without dynamic bindings are hoisted completely outside the render function. They are created once and reused across all re-renders.
2. **Patch Flags**: Dynamic bindings are tagged with bitwise integers (e.g. `1` for dynamic text, `2` for dynamic class). During re-renders, the diff algorithm skips checking everything except the specific flagged attribute.
3. **Block Tree**: The template is partitioned into dynamic blocks. Virtual DOM reconciliation iterates over an array of dynamic children directly, ignoring the static DOM tree entirely.

```html
<!-- Vue 3 Compiler adds Patch Flag 1 (TEXT) -->
<div>
  <span>Static title (Hoisted)</span>
  <p>{{ dynamicMessage /* PatchFlag: 1 TEXT */ }}</p>
</div>
```

### 24. What is Nuxt 3, and how does the Nitro server engine work?
**In Simple Words:**
**Nuxt 3** is the premier full-stack web framework built on Vue 3. At its core is **Nitro**, a lightweight, cross-platform server engine.

Key Nitro capabilities:
- **Universal deployment**: Compiles code into serverless, edge, or Node targets without configuration changes (Vercel, Cloudflare Workers, Deno, AWS Lambda).
- Built-in API server: Routes inside `server/api/` compile into fast, lightweight HTTP handlers with automatic type generation.
- Storage layer: Built-in unstorage driver supporting Redis, filesystem, memory, and S3.

```typescript
// server/api/health.ts (Nitro Endpoint)
export default defineEventHandler((event) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
});
```

### 25. How do `useAsyncData` and `useFetch` work in Nuxt 3, and how do they prevent duplicate client-side requests?
**In Simple Words:**
When a page renders on the server in Nuxt 3, `useFetch` executes the request on the server and serializes the result into Nuxt's payload payload state (`window.__NUXT__`).

When the client hydrates in the browser, Nuxt reads the cached data directly from the payload instead of re-fetching over the network, completely eliminating hydration flicker and redundant network calls.

```vue
<script setup>
// Server executes fetch and serializes data; client reuses it without re-fetching
const { data: products, pending, error } = await useFetch('/api/products', {
  lazy: false,
  transform: (res) => res.data,
});
</script>
```

### 26. How do Auto-Imports work in Nuxt 3, and does it impact bundle size?
**In Simple Words:**
Nuxt 3 automatically imports Vue APIs (`ref`, `computed`, `watch`), Nuxt composables (`useFetch`, `useRoute`), and all components located in `components/` and `composables/`.

It does NOT pollute the global namespace or increase bundle size because the Nuxt compiler analyzes AST usage and injects explicit `import` statements during the build, preserving tree-shaking.

```vue
<!-- No import statements needed! -->
<script setup>
const route = useRoute();
const count = ref(0);
</script>
```

### 27. How does Route Middleware work in Nuxt 3 (Global vs. Named vs. Inline)?
**In Simple Words:**
Route middleware in Nuxt 3 executes before navigating to a route:
1. **Global Middleware**: Files named with `.global.ts` in `middleware/`. Runs on every navigation.
2. **Named Middleware**: Defined in `middleware/` and explicitly linked in a page via `definePageMeta({ middleware: 'auth' })`.
3. **Inline Middleware**: Defined directly inside `definePageMeta` on a specific page.

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCurrentUser();
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login');
  }
});
```

### 28. Why is Pinia the official state management store for Vue 3 instead of Vuex?
**In Simple Words:**
**Pinia** replaces Vuex as the official state management library because:
- **No Mutations**: Mutations were removed; actions can be synchronous or asynchronous.
- **First-class TypeScript Support**: Autocomplete for state, getters, and actions without complex manual type boilerplate.
- **Modular by Default**: No nested module namespacing; stores are defined as independent functions (`useUserStore`, `useCartStore`).
- **DevTools Integration**: Deep support for time-travel debugging and hot module replacement.

```typescript
// stores/cart.ts
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] as string[] }),
  getters: {
    count: (state) => state.items.length,
  },
  actions: {
    addItem(item: string) {
      this.items.push(item);
    },
  },
});
```

### 29. How do `<Teleport>` and `<Suspense>` work in Vue 3?
**In Simple Words:**
- `<Teleport to="body">`: Renders a component's template into a different DOM node outside the parent component's DOM hierarchy, while retaining the component's reactive state and event bubbling. Ideal for modals and tooltips.
- `<Suspense>`: Orchestrates asynchronous dependencies (async setup or async components) by rendering a fallback template until all async child operations resolve.

```vue
<template>
  <button @click="isOpen = true">Open Modal</button>

  <!-- Teleported directly to <body> -->
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content">
        <p>Teleported Modal</p>
        <button @click="isOpen = false">Close</button>
      </div>
    </div>
  </Teleport>
</template>
```

### 30. How do you create and register a Custom Directive in Vue 3?
**In Simple Words:**
Custom directives are used for low-level direct DOM manipulation. A directive object defines lifecycle hooks: `created`, `beforeMount`, `mounted`, `updated`, `beforeUnmount`, `unmounted`.

```typescript
// v-autofocus directive
const vAutofocus = {
  mounted: (el: HTMLElement) => el.focus(),
};

// Template usage:
// <input v-autofocus />
```

### 31. What causes SSR Hydration Mismatches in Vue 3 and Nuxt 3, and how do you resolve them?
**In Simple Words:**
A hydration mismatch occurs when the DOM rendered on the server differs from the initial virtual DOM generated in the browser.

Common causes:
1. Using client-only APIs (`window.innerWidth`, `Date.now()`, `Math.random()`) during initial render.
2. Invalid HTML nesting (e.g. `<p>` wrapping a `<div>`).

**Resolution**:
- Wrap client-specific dynamic sections in `<ClientOnly>`.
- Initialize values with defaults and update them in `onMounted()`.

```vue
<template>
  <ClientOnly fallback-tag="span" fallback="Loading timestamp...">
    <span>{{ new Date().toLocaleTimeString() }}</span>
  </ClientOnly>
</template>
```

### 32. What are Nuxt 3 Server Components (`.server.vue`) and Hybrid Rendering?
**In Simple Words:**
**Nuxt Server Components** (`Component.server.vue`) are rendered purely on the server and send zero client-side JavaScript to the browser.

Combined with **Hybrid Rendering** (route rules defined in `nuxt.config.ts`), you can configure different caching and rendering strategies per route:
- `/blog/**`: Static pre-rendering (SSG).
- `/dashboard/**`: Client-side SPA (`ssr: false`).
- `/products/**`: SWR (Stale-While-Revalidate caching).

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/products/**': { swr: 3600 },
    '/admin/**': { ssr: false },
  },
});
```

---

## Part 3: Svelte 5 & SvelteKit Architecture (33 - 45)

### 33. What are Svelte 5 Runes, and how does `$state()` provide fine-grained reactivity without a Virtual DOM?
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

### 34. How does `$derived()` and `$derived.by()` work in Svelte 5?
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

### 35. What is `$effect()` in Svelte 5, and how does cleanup handling work?
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

### 36. How are Component Props handled in Svelte 5 using `$props()` and `$bindable()`?
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

### 37. How does Svelte compile components directly into surgical DOM instructions instead of using a Virtual DOM?
**In Simple Words:**
React and Vue ship a runtime Virtual DOM engine to the user's browser, comparing virtual trees on every update.

Svelte shifts the work from runtime to **compile time**:
- During the build, Svelte analyzes the template and generates JavaScript instructions that directly call `element.setAttribute()`, `element.textContent = ...`, or `parentNode.insertBefore()`.
- When state changes, only the specific compiled update instruction executes.
- Result: Smaller bundle size, lower memory footprint, and high execution speed.

### 38. Explain SvelteKit's File-Based Routing System: `+page.svelte`, `+layout.svelte`, and `+error.svelte`.
**In Simple Words:**
SvelteKit organizes routes under `src/routes/`:
- `+page.svelte`: Defines the UI for the route.
- `+layout.svelte`: Wraps child pages with persistent navigation, sidebars, and layouts.
- `+error.svelte`: Fallback UI displayed when an error occurs in a page or load function.
- Dynamic route parameters are specified with brackets: `src/routes/users/[id]/+page.svelte`.

### 39. Data Loading in SvelteKit: `+page.js` vs. `+page.server.js` (`load` functions).
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

### 40. How do Form Actions work in SvelteKit for progressive enhancement?
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

### 41. How do SvelteKit Server Endpoints work with `+server.js`?
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

### 42. What are SvelteKit Hooks, and how does the `handle` hook manage authentication sessions?
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

### 43. How do Transitions and Animations work in Svelte?
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

### 44. How do legacy Svelte Stores (`writable`, `readable`) relate to Svelte 5 Runes?
**In Simple Words:**
In Svelte 3/4, global reactive state was managed using **Stores** (`writable`, `readable`), accessed in templates with the `$` auto-subscription prefix (`$cartStore`).

In Svelte 5, stores are still fully supported for backwards compatibility, but **Runes in `.svelte.js` files** are the modern recommended pattern because signals can be read and mutated like standard JavaScript objects without store subscriptions.

### 45. What are SvelteKit Adapters, and how do you configure deployment targets?
**In Simple Words:**
SvelteKit compiles your app into platform-neutral artifacts. **Adapters** convert those artifacts into the target hosting environment:
- `@sveltejs/adapter-auto`: Automatically detects Vercel, Netlify, or Cloudflare during deployment.
- `@sveltejs/adapter-node`: Generates a standalone Node.js server.
- `@sveltejs/adapter-static`: Prerenders the entire app into static HTML files.

---

## Part 4: Modern Build Tooling & Comparative Architecture (46 - 50)

### 46. How does Vite work internally: Native ES Modules in development vs. Rollup in production?
**In Simple Words:**
Traditional bundlers (Webpack) bundle the entire dependency graph before starting the development server.

**Vite**:
- **In Development**: Divides application code into dependencies (pre-bundled with blazing-fast **esbuild** in Go) and source code (served as native browser **ES Modules** over HTTP). The server starts instantly, and Hot Module Replacement (HMR) is decoupled from application size.
- **In Production**: Bundles code with **Rollup** for tree-shaking, code-splitting, and CSS extraction.

### 47. Explain Hydration Costs: Progressive Hydration vs. Resumability (Qwik) vs. Islands Architecture (Astro).
**In Simple Words:**
1. **Full Hydration** (React/Vue SPA): The entire page HTML is downloaded, then the entire JS bundle is downloaded, and the entire component tree executes to attach event listeners. High Total Blocking Time (TBT).
2. **Islands Architecture** (Astro): Only designated interactive components are hydrated. Static parts send zero JS.
3. **Resumability** (Qwik): Zero hydration. Event listeners are serialized directly into HTML attributes (`q:action="foo"`). JavaScript is only downloaded when a user actually clicks an element.

### 48. Micro-Frontends vs. Island Architecture: When should you use which?
**In Simple Words:**
- **Island Architecture**: Best for a single application where parts of a page are static and parts are interactive. All islands share a single build and deployment pipeline.
- **Micro-Frontends**: Best for large enterprise organizations where completely separate autonomous teams develop, test, and deploy independent web applications that are dynamically assembled at runtime (e.g. via Module Federation).

### 49. How do modern frameworks optimize Core Web Vitals (INP, LCP, and CLS)?
**In Simple Words:**
1. **INP (Interaction to Next Paint)**: Minimized by reducing main-thread JavaScript execution via Island hydration and debounced state mutations.
2. **LCP (Largest Contentful Paint)**: Optimized via server-side pre-rendering, modern image formats (AVIF/WebP), and preloading critical hero assets.
3. **CLS (Cumulative Layout Shift)**: Prevented by assigning fixed aspect ratios to images/video and using fallback containers for dynamic server islands.

### 50. Senior Architect Matrix: How do you choose between React, Angular, Vue, Svelte, and Astro in 2026?
**In Simple Words:**
| Framework | Primary Sweet Spot | Key Superpower |
| :--- | :--- | :--- |
| **Astro** | Content sites, marketing, docs, e-commerce | Zero JavaScript by default, multi-framework islands |
| **React / Next.js** | Mass-market web apps, large hiring pool | Ecosystem size, React Server Components (RSC) |
| **Angular** | Large enterprise banking, ERP, regulated suites | Batteries-included, strict opinions, Signals + DI |
| **Vue / Nuxt 3** | Full-stack web applications, medium-to-large teams | Gentle learning curve, elegant reactivity, Nitro engine |
| **Svelte 5** | High-performance interactive tools, lean teams | No Virtual DOM, surgical bundle size, Runes |
