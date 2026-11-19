# Nuxt 3 Universal Architecture & Nitro Engine Master Interview Bank (1 - 35)

> Nuxt 3 full-stack framework, Nitro server engine, universal data fetching (`useFetch`, `useAsyncData`), file-based routing, auto-imports, Hybrid Rendering (ISR/SWR), server routes (`server/api`), and production optimization.

---

## Part 1: Nuxt 3 Fundamentals (Junior / Entry-Level)

### 1. What is Nuxt 3 and how does it differ from vanilla Vue 3?
**In Simple Words:**
- **Vue 3** is a client-side reactive UI library. Out of the box, it compiles into a Single Page Application (SPA) where the browser receives a blank HTML shell (`<div id="app"></div>`) and JavaScript renders all elements on the client.
- **Nuxt 3** is a full-stack, batteries-included framework built on top of Vue 3, Vite, and the Nitro server engine. It provides universal rendering (Server-Side Rendering (SSR), Static Site Generation (SSG), and Hybrid Rendering), automatic file-based routing, intelligent code-splitting, zero-config auto-imports, SEO metadata management, and built-in full-stack API server endpoints.

| Feature | Vanilla Vue 3 | Nuxt 3 |
| :--- | :--- | :--- |
| **Rendering Modes** | Client-Side SPA by default | Universal (SSR, SSG, SWR/ISR, SPA) |
| **Routing** | Manual `vue-router` configuration | Automatic file-based routing (`pages/`) |
| **Backend API** | Requires external backend (Node/Express/Go) | Built-in Nitro engine (`server/api/`) |
| **Data Fetching** | Standard `fetch` / Axios in `onMounted` | SSR-compatible `useFetch`, `useAsyncData` |
| **SEO** | Hard without pre-rendering | Native `useHead`, `useSeoMeta` with SSR HTML |
| **Imports** | Manual `import { ref } from 'vue'` | Automatic imports for Vue, composables & components |

---

### 2. Explain the Nuxt 3 standard directory structure.
**In Simple Words:**
Nuxt uses convention-over-configuration directories where file placement automatically generates behavior without boilerplate configuration files.

#### Key Directories:
- `pages/`: File-based routing. Creating `pages/about.vue` automatically creates the `/about` route. (If this folder exists, Nuxt imports Vue Router automatically).
- `components/`: Vue components placed here are automatically imported anywhere in the project without `import` statements.
- `composables/`: Custom composition functions (e.g. `useAuth.ts`) placed here are auto-imported globally.
- `layouts/`: Reusable page layouts (`default.vue`, `admin.vue`) wrapping `<slot />`.
- `server/`: Backend server code powered by Nitro. Contains `server/api/`, `server/routes/`, and `server/middleware/`.
- `public/`: Static files served directly at root URL (e.g. `public/favicon.ico` -> `/favicon.ico`).
- `assets/`: Raw assets (CSS, SCSS, images, fonts) processed and hashed by Vite.
- `app.vue`: The top-level component that runs for every page view.
- `nuxt.config.ts`: Central configuration file for modules, runtime config, and nitro presets.

---

### 3. How does file-based routing work in Nuxt 3?
**In Simple Words:**
Every `.vue` file inside the `pages/` directory automatically maps to a corresponding URL path.

#### Routing Patterns:
1. **Static Routes**: `pages/contact.vue` -> `/contact`
2. **Index Routes**: `pages/index.vue` -> `/`, `pages/users/index.vue` -> `/users`
3. **Dynamic Parameters**: `pages/users/[id].vue` -> `/users/:id` (accessed via `useRoute().params.id`).
4. **Catch-All / 404 Routes**: `pages/[...slug].vue` -> matches all unmatched routes (e.g. `/docs/getting-started/setup`).
5. **Nested Routes**: `pages/parent.vue` containing `<NuxtPage />` with `pages/parent/child.vue`.

#### Practical Code Example:
```vue
<!-- pages/products/[id].vue -->
<script setup lang="ts">
const route = useRoute();
const productId = route.params.id; // Type-safe route parameter
</script>

<template>
  <div>
    <h1>Product Details: {{ productId }}</h1>
  </div>
</template>
```

---

### 4. What are Auto-Imports in Nuxt 3 and how do they work?
**In Simple Words:**
In Nuxt 3, you do not need to manually write `import { ref, computed } from 'vue'` or import components and custom composables. Nuxt generates TypeScript declarations in `.nuxt/imports.d.ts` that make them globally accessible while Vite performs tree-shaking so unused helpers do not bloat the final bundle.

#### What gets auto-imported?
1. **Vue 3 APIs**: `ref`, `reactive`, `computed`, `watch`, `onMounted`, `nextTick`.
2. **Nuxt Built-ins**: `useRoute`, `useRouter`, `useFetch`, `useAsyncData`, `useState`, `navigateTo`, `useHead`.
3. **Your Custom Composables**: Any export from `composables/*.ts`.
4. **Your Components**: Any component inside `components/` (subfolders become prefixed: `components/base/Button.vue` -> `<BaseButton />`).

```vue
<!-- No imports required! -->
<script setup lang="ts">
const count = ref(0);
const route = useRoute();
const { user } = useAuth(); // from composables/useAuth.ts
</script>

<template>
  <button @click="count++">Clicked {{ count }} times</button>
</template>
```

---

### 5. What is the difference between `app.vue` and `layouts/default.vue`?
**In Simple Words:**
- `app.vue` is the universal root entry point of your Nuxt application. It persists across all route changes and never re-renders. It is ideal for global providers, notification banners, or loading indicators.
- `layouts/` are reusable structural templates (header, sidebar, footer) that can be swapped dynamically or assigned to specific pages using `definePageMeta({ layout: 'admin' })`.

```vue
<!-- app.vue -->
<template>
  <NuxtLoadingIndicator color="#10b981" :height="3" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

```vue
<!-- layouts/default.vue -->
<template>
  <div class="layout-wrapper">
    <header><nav>Navigation</nav></header>
    <main>
      <slot /> <!-- Page content rendered here -->
    </main>
    <footer>© 2026 Enterprise Inc.</footer>
  </div>
</template>
```

---

### 6. What is the `<NuxtLink>` component and how does it optimize navigation?
**In Simple Words:**
`<NuxtLink>` replaces traditional `<a>` tags for internal and external links. It provides seamless client-side single-page transitions and automated background prefetching.

#### Optimization Features:
1. **Smart Prefetching**: When a `<NuxtLink>` enters the user's viewport, Nuxt automatically prefetches the payload and JavaScript chunks for that target route in the background using `requestIdleCallback`.
2. **Intelligent Protocol Detection**: If the `href` starts with `https://` or `mailto:`, it automatically renders as a standard external link (`rel="noopener noreferrer"`).
3. **Active Class Matching**: Automatically applies `router-link-active` and `router-link-exact-active` CSS classes.

```vue
<template>
  <!-- Automatically prefetched when scrolled into view -->
  <NuxtLink to="/dashboard" prefetch class="nav-btn">
    Dashboard
  </NuxtLink>

  <!-- External link automatically handled -->
  <NuxtLink to="https://github.com" target="_blank">
    GitHub
  </NuxtLink>
</template>
```

---

### 7. What is `<ClientOnly>` and why is it used?
**In Simple Words:**
Certain UI components rely strictly on browser-only Web APIs (`window`, `localStorage`, `document`, canvas, or third-party charting libraries like Chart.js or Leaflet). If executed on the Node.js server during SSR, they crash with `ReferenceError: window is not defined` or trigger a client-side **hydration mismatch**.
Wrapping these elements with `<ClientOnly>` tells Nuxt to skip rendering them on the server and render a placeholder until the client mounts.

```vue
<template>
  <div>
    <h1>Analytics Dashboard</h1>
    
    <ClientOnly>
      <!-- Only mounts and renders inside browser -->
      <BrowserGeoMap :coordinates="coords" />
      <template #fallback>
        <div class="skeleton-loader">Loading interactive map...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

---

### 8. What is `useState()` in Nuxt 3 and how does it prevent SSR memory leaks?
**In Simple Words:**
`useState()` is Nuxt's SSR-friendly reactive state replacement for Vue's `ref()`. 

#### Why not use a global `const state = ref()` in Nuxt?
In an SSR Node.js server, module-level variables are shared across **all incoming HTTP requests from all users**. Storing user-specific data in a global `ref()` causes critical data leaks between different users!
`useState()` creates a unique, request-scoped reactive state that is serialized into the initial HTML payload (under `window.__NUXT__.data`) and cleanly hydrated on the client without re-executing.

```typescript
// composables/useUser.ts
export const useCurrentUser = () => {
  // Key 'auth-user' ensures unique hydration state across client/server
  return useState<User | null>('auth-user', () => null);
};
```

---

### 9. How do you handle SEO metadata with `useHead()` and `useSeoMeta()`?
**In Simple Words:**
Nuxt 3 uses `@unhead/vue` under the hood. `useSeoMeta()` provides type-safe, auto-completing helper functions to define standard meta tags, OpenGraph cards, Twitter preview cards, and canonical links that are injected directly into the server-rendered HTML `<head>`.

```vue
<script setup lang="ts">
const { data: article } = await useFetch('/api/articles/123');

useSeoMeta({
  title: () => article.value?.title ?? 'Default Title',
  description: () => article.value?.excerpt,
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.excerpt,
  ogImage: 'https://cdn.example.com/og-image.jpg',
  twitterCard: 'summary_large_image',
});
</script>
```

---

### 10. How do Nuxt 3 Plugins work and how do you restrict execution?
**In Simple Words:**
Plugins in the `plugins/` directory run before initializing the Vue application. They are used to register global directives, third-party libraries, or global helpers using `defineNuxtPlugin`.

#### File Naming Conventions for Environment Restriction:
- `plugins/analytics.client.ts` -> Runs **only on the client/browser**.
- `plugins/audit-logger.server.ts` -> Runs **only on the server**.
- `plugins/i18n.ts` -> Universal (runs on both client and server).

```typescript
// plugins/toast.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      toast: (msg: string) => {
        alert(msg);
      }
    }
  };
});
// Usage anywhere in app: const { $toast } = useNuxtApp();
```

---

### 11. What is Nuxt Middleware and how do Route Guards work?
**In Simple Words:**
Route middleware runs navigation guards before entering a page. They can redirect unauthorized users, check permissions, or log navigation.

#### Three Types of Middleware:
1. **Anonymous / Inline**: Defined directly inside `definePageMeta({ middleware: [...] })`.
2. **Named Middleware**: Located in `middleware/` (e.g., `middleware/auth.ts`) and loaded on specific pages.
3. **Global Middleware**: Files ending in `.global.ts` (e.g., `middleware/01.auth.global.ts`) that run on every route transition.

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  
  if (!auth.isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login');
  }
});
```

---

### 12. What is the difference between the `public/` and `assets/` directories?
**In Simple Words:**
- `public/`: Files are served as-is at the root URL path without any compilation, bundling, or hash renaming. Used for `robots.txt`, `favicon.ico`, `sitemap.xml`, and legacy scripts.
- `assets/`: Files (SCSS, Less, SVG icons, images) are processed by Vite. Images can be optimized, CSS is minified and prefixed, and filenames receive content hashes for immutable browser caching (`app.a1b2c3d4.css`).

---

## Part 2: Core Architecture & Data Fetching (Mid-Level)

### 13. What is the difference between `useFetch()` and `useAsyncData()`?
**In Simple Words:**
- `useAsyncData()` is the foundational wrapper that manages asynchronous SSR serialization, caching keys, loading states, and hydration reconciliation for *any* promise.
- `useFetch(url)` is a convenient syntactic sugar built directly on top of `useAsyncData()` and `$fetch`. It automatically generates an internal cache key based on the URL and query parameters.

#### Comparison Matrix:
| Feature | `useFetch(url, options)` | `useAsyncData(key, handler)` |
| :--- | :--- | :--- |
| **Primary Use** | Direct HTTP endpoints | Any custom async logic (DB calls, multi-API join, SDKs) |
| **Cache Key** | Auto-generated from URL | Manually supplied string key |
| **Reactivity** | Automatically re-fetches when reactive `query` changes | Requires `watch` option or manual `refresh()` |

```typescript
// useFetch: Simple HTTP endpoint
const { data: user, pending, error, refresh } = await useFetch('/api/user', {
  query: { id: userId }
});

// useAsyncData: Complex promise aggregation
const { data: dashboard } = await useAsyncData('dashboard-data', async () => {
  const [stats, notifications] = await Promise.all([
    $fetch('/api/stats'),
    $fetch('/api/notifications')
  ]);
  return { stats, notifications };
});
```

---

### 14. What is the Nitro Server Engine in Nuxt 3?
**In Simple Words:**
**Nitro** is the next-generation server engine that powers Nuxt 3. Developed by UnJS, Nitro provides a cross-platform, zero-dependency server runtime built on top of `h3` (minimal HTTP framework) and Rollup.

#### Why Nitro is Revolutionary:
1. **Universal Deployment**: Can be deployed to Node.js, Vercel Serverless, Cloudflare Workers, AWS Lambda, Deno, or Bun with zero code changes using presets (`NITRO_PRESET=cloudflare-pages`).
2. **Lightweight Output**: Compiles the entire server into a standalone, minified `.output/` folder that does not require `node_modules` in production.
3. **Built-in Storage & Cache**: Unstorage key-value abstraction and multi-tier response caching.
4. **Server Routes**: Instant API endpoint creation in `server/api/`.

```
                    ┌─────────────────────────┐
                    │    Incoming Request     │
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │  Nitro Engine (h3 Core) │
                    └──────┬───────────┬──────┘
             API Match     │           │   Route Match
      ┌────────────────────┴──┐     ┌──┴─────────────────────┐
      ▼                       ▼     ▼                        ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐
│ server/api/* │     │ Nitro Cache  │     │ Vue SSR Renderer     │
│ JSON Output  │     │ Storage / SWR│     │ Full HTML Payload    │
└──────────────┘     └──────────────┘     └──────────────────────┘
```

---

### 15. How do you create server API endpoints in `server/api/`?
**In Simple Words:**
Files inside `server/api/` automatically become REST endpoints under `/api/*`. You define handlers using `defineEventHandler()` from `h3`.

```typescript
// server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  // Read dynamic URL parameter
  const id = getRouterParam(event, 'id');
  
  // Read query parameters (?sort=desc)
  const query = getQuery(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    });
  }

  const user = await db.user.findUnique({ where: { id: Number(id) } });
  return user; // Nitro automatically serializes to JSON
});
```

---

### 16. What is the role of `server/middleware/` in Nuxt?
**In Simple Words:**
Files inside `server/middleware/` run on **every single server request** before hitting any server route or page renderer. Unlike client route middleware, server middleware runs exclusively on the backend server.
Used for:
- Validating session tokens or JWT cookies.
- Attaching request context (`event.context.user = user`).
- Setting security headers (CSP, CORS).
- Logging HTTP requests.

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token');
  
  if (token) {
    const session = await verifyJwtToken(token);
    event.context.user = session.user; // Accessible in all downstream API handlers
  }
});
```

---

### 17. How does Unstorage work in Nitro?
**In Simple Words:**
**Unstorage** is Nitro's unified key-value storage layer that abstracts away underlying storage drivers. It allows developers to interact with memory, filesystem, Redis, MongoDB, Cloudflare KV, or GitHub using identical async `getItem()`, `setItem()`, and `removeItem()` methods.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    storage: {
      redis: {
        driver: 'redis',
        host: process.env.REDIS_HOST,
        port: 6379
      }
    }
  }
});

// server/api/cache.ts
export default defineEventHandler(async () => {
  const storage = useStorage('redis');
  await storage.setItem('last_cron', new Date().toISOString());
  return await storage.getItem('last_cron');
});
```

---

### 18. What causes Client Hydration Mismatches in Nuxt 3 and how do you fix them?
**In Simple Words:**
A **hydration mismatch** occurs when the HTML generated by the Node.js server does not match the Virtual DOM tree produced during the initial client-side render pass. When Vue detects the divergence, it discards or forcefully repaints the DOM, causing flashing and performance degradation.

#### Common Causes & Fixes:
1. **Invalid HTML Nesting**: Putting a `<div>` inside a `<p>` tag causes browser HTML parsers to auto-close the `<p>`, breaking Vue's node hierarchy.
2. **Accessing Browser-Only State During Render**: Rendering `Date.now()`, `Math.random()`, or `window.innerWidth` directly in templates.
3. **Fix**: Use `<ClientOnly>` for client-only widgets, compute non-deterministic dates on the server and pass via `useState`, or initialize browser values inside `onMounted()`.

---

### 19. What is Hybrid Rendering and Route Rules in Nuxt 3?
**In Simple Words:**
In traditional frameworks, you pick one rendering strategy (SSR or SSG) for the whole application. Nuxt 3 provides **Hybrid Rendering** via `routeRules`, allowing granular per-route rendering rules.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Static Pre-rendered at build time (SSG)
    '/about': { prerender: true },
    '/blog/**': { isr: 3600 }, // Cached for 1 hour, regenerated in background
    '/admin/**': { ssr: false }, // Pure client-side SPA mode
    '/api/v1/**': { cors: true, headers: { 'Cache-Control': 'no-cache' } },
    '/old-route': { redirect: { to: '/new-route', statusCode: 301 } },
  }
});
```

---

### 20. How does SWR / ISR work in Nuxt 3?
**In Simple Words:**
**SWR (Stale-While-Revalidate)** and **ISR (Incremental Static Regeneration)** cache the generated HTML or JSON at the edge server/CDN.
- When User 1 requests a route, the server renders and caches it.
- Subsequent users receive the cached version instantly (sub-millisecond latency).
- Once the cache TTL expires (e.g., 60 seconds), the next request still serves the stale cache instantly, while Nitro triggers an asynchronous background revalidation to generate fresh HTML for future visitors.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/products/**': { swr: 60 } // Cache at edge for 60 seconds
  }
});
```

---

### 21. How do you implement robust error handling with `error.vue` and `createError()`?
**In Simple Words:**
Nuxt provides full-stack error handling across both server and client lifecycles:
1. **Backend / API**: Throwing `createError({ statusCode: 404, statusMessage: 'Not Found' })` halts execution and sends structured JSON or triggers the error page.
2. **Frontend UI**: If an uncaught error occurs during page execution, Nuxt replaces the application with `error.vue` located in the project root.
3. **Clearing Errors**: `clearError({ redirect: '/' })` resets error state and navigates back to safe routes.

```vue
<!-- error.vue (in root) -->
<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const handleClearError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="error-container">
    <h1>Error {{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <button @click="handleClearError">Return to Home</button>
  </div>
</template>
```

---

### 22. What is the Nuxt Module system and how does it extend applications?
**In Simple Words:**
Nuxt Modules are build-time plugins that hook into the Nuxt container lifecycle (`nuxt.hook('nitro:config', ...)`) to configure bundlers, inject components, modify Webpack/Vite settings, or automatically provision routes.
Examples: `@nuxtjs/tailwindcss`, `@pinia/nuxt`, `@nuxt/content`, `@nuxt/image`.

#### Anatomy of a Nuxt Module:
```typescript
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

export default defineNuxtModule({
  meta: { name: 'my-custom-module', configKey: 'myModule' },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    // Add runtime plugin
    addPlugin(resolver.resolve('./runtime/plugin'));
  }
});
```

---

### 23. How does `useCookie()` work across SSR and client?
**In Simple Words:**
`useCookie(name, options)` provides an SSR-friendly, reactive ref for reading and writing cookies.
- **On the Server**: It reads incoming cookies from request headers (`event.node.req.headers.cookie`) and queues `Set-Cookie` response headers when changed.
- **On the Client**: It reads and mutates `document.cookie`.
Because it is reactive, updating `authCookie.value = 'new_token'` synchronizes state immediately.

```typescript
// composables/useAuth.ts
export const useAuthCookie = () => {
  const token = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false // Accessible to JS
  });
  return token;
};
```

---

### 24. What is Runtime Config vs App Config in Nuxt 3?
**In Simple Words:**
- `runtimeConfig`: Used for environment variables, secrets, and deployment-specific settings. Can be updated at runtime using OS environment variables without rebuilding the application (e.g. `NUXT_API_SECRET`).
  - Top-level keys: **Private secrets** accessible only in server routes.
  - `public` keys: Exposed to both client and server code via `useRuntimeConfig().public`.
- `appConfig`: Used for build-time public UI themes, branding, and color schemes via `app.config.ts`.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: 'secret_on_server_only', // Private
    public: {
      apiBaseUrl: 'https://api.example.com' // Public to browser
    }
  }
});
```

---

## Part 3: Advanced Internals, Performance & Production (Senior / Staff)

### 25. Explain the Nuxt 3 compilation pipeline and build outputs.
**In Simple Words:**
When running `nuxi build`, Nuxt performs a dual compilation pass orchestrated by Vite and Nitro:
1. **Client Build (Vite)**: Compiles Vue components, layouts, pages, and styles into browser-executable JS/CSS chunks stored in `.output/public/_nuxt/`.
2. **Server Build (Nitro + Rollup)**: Bundles server-side Vue templates, server routes (`server/api/`), middleware, and Nitro runtime into a self-contained Node/worker bundle in `.output/server/index.mjs`.

```
Source Code (Vue + TS)
       │
       ├──► Vite Client Pass  ──► .output/public/_nuxt/ (Static JS/CSS Chunks)
       │
       └──► Nitro Server Pass  ──► .output/server/index.mjs (Zero-dependency engine)
```

---

### 26. What are Nuxt Layers and how do they enable Multi-App Architectures?
**In Simple Words:**
**Nuxt Layers** allow you to extend another Nuxt project's configurations, components, composables, layouts, and pages using the `extends` property in `nuxt.config.ts`.
This enables enterprise teams to share design systems, authentication flows, and API integrations across multiple micro-applications without copy-pasting code or maintaining standalone npm packages.

```typescript
// apps/ecommerce/nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    '../../packages/core-design-system', // Local shared layer
    'github:org/auth-layer#v2.0.0'       // Remote Git repo layer
  ]
});
```

---

### 27. How does Streaming SSR and Suspense work in Nuxt 3?
**In Simple Words:**
Traditional SSR blocks HTML delivery until every single asynchronous call finishes on the server.
**Streaming SSR** leverages HTTP chunked transfer encoding (`Transfer-Encoding: chunked`) and Vue `<Suspense>`. The server sends the HTML shell, `<head>`, and static navigation immediately so the user sees a painted layout in milliseconds. Once slow backend queries complete, their resolved HTML chunks are streamed over the same open TCP connection and slotted into place.

---

### 28. How do you prevent Server-Side Request Forgery (SSRF) in Nuxt Nitro routes?
**In Simple Words:**
When a Nitro server route fetches external URLs based on user input (e.g. generating link previews, webhooks), attackers can pass internal private IP addresses (`http://169.254.169.254` or `http://localhost:5432`) to steal cloud credentials or query local databases.

#### Defense Strategies:
1. **URL Whitelisting**: Strict protocol check (`https:` only) and allowlist of trusted external hostnames.
2. **DNS Resolution & Private IP Blacklisting**: Resolve the DNS first and block private subnet CIDRs (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.1/8`).
3. **Disable Redirects**: Prevent the HTTP client from following redirects to private internal subnets.

---

### 29. How do you implement Distributed Cache Invalidation with Nitro Cache?
**In Simple Words:**
When scaling Nuxt horizontally across multiple containers or serverless edge instances, local in-memory caches become out of sync.
By configuring Nitro's cached event handlers with a shared Redis driver, cached responses are invalidated across the entire cluster using tags or explicit keys:

```typescript
// server/api/products.get.ts
export default defineCachedEventHandler(async (event) => {
  return await db.product.findMany();
}, {
  maxAge: 60 * 60, // 1 hour
  name: 'products-cache',
  getKey: (event) => 'all-products'
});

// server/api/invalidate.post.ts
export default defineEventHandler(async () => {
  const cache = useStorage('cache');
  await cache.removeItem('nitro:handlers:_:products-cache:all-products.json');
  return { success: true };
});
```

---

### 30. How do you optimize bundle size and analyze dependencies in Nuxt?
**In Simple Words:**
1. **`nuxi analyze`**: Runs Rollup/Vite visualizer to identify bloated dependencies in both client and server bundles.
2. **Component Prefixing & Shaking**: Keep components in focused subdirectories so only referenced UI parts are bundled.
3. **Dynamic Import of Heavy Modules**: Use dynamic `import()` or async components for non-critical dialogs and heavy charting engines.
4. **Font Optimization**: Use `@nuxtjs/fontaine` to eliminate layout shift (CLS) and `@nuxtjs/google-fonts` to download fonts locally.

---

### 31. What is `@nuxt/content` v2 and how does it empower Git-based Headless CMS?
**In Simple Words:**
`@nuxt/content` parses Markdown, YML, CSV, and JSON files inside a `content/` directory into a file-based CMS. It supports **MDC syntax** (Markdown Component syntax), allowing authors to embed live Vue components directly inside standard Markdown text (`::hero{title="Hello"} ::`).

```vue
<template>
  <main>
    <ContentDoc /> <!-- Auto-fetches and renders Markdown matching current route -->
  </main>
</template>
```

---

### 32. What is the recommended Authentication Architecture in Nuxt 3?
**In Simple Words:**
Client-side tokens in `localStorage` are vulnerable to XSS and invisible to the Node SSR server, causing flash of unauthorized content.

#### Production Best Practice:
1. **HTTP-Only, Secure, SameSite Cookies**: Server sets encrypted session/JWT cookies.
2. **Universal Request Interception**: During SSR, Nuxt's server passes the `Cookie` header to downstream microservices using `useRequestFetch()`.
3. **Client Route Guard & Server Middleware**:
   - `server/middleware/auth.ts` verifies token before SSR render.
   - `middleware/auth.global.ts` protects client transitions.

---

### 33. How do you implement WebSockets in Nuxt 3 with CrossWS?
**In Simple Words:**
Nuxt 3 supports native WebSocket handling via Nitro's integration with **CrossWS** (Universal WebSocket layer for Node, Deno, Bun, and Cloudflare):

```typescript
// server/routes/_ws.ts
export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe('chat-room');
    peer.publish('chat-room', `${peer} joined the chat`);
  },
  message(peer, message) {
    peer.publish('chat-room', message.text());
  },
  close(peer) {
    peer.publish('chat-room', `${peer} left`);
  }
});
```

---

### 34. How do you test Nuxt 3 applications with `@nuxt/test-utils`?
**In Simple Words:**
`@nuxt/test-utils` integrates with **Vitest** and **Playwright** to test Nuxt applications in real SSR runtime environments:
- Unit test composables within Nuxt context (`mockNuxtImport`).
- Spin up real test server instances with `setup({ server: true })`.
- Fetch SSR HTML using `$fetch('/')` and assert rendered elements.

```typescript
import { describe, it, expect } from 'vitest';
import { setup, $fetch } from '@nuxt/test-utils/e2e';

describe('Home Page SSR', async () => {
  await setup({ server: true });

  it('renders server-side title correctly', async () => {
    const html = await $fetch('/');
    expect(html).toContain('<h1>Welcome to Enterprise Nuxt</h1>');
  });
});
```

---

### 35. What is the migration roadmap from Nuxt 2 to Nuxt 3?
**In Simple Words:**
Migrating from Nuxt 2 to Nuxt 3 requires bridging the generational gap between Vue 2 and Vue 3:
1. **Bridge First (`@nuxt/bridge`)**: An interim tool enabling Nuxt 3 features (Composition API, Nitro, Vite) inside an existing Nuxt 2 codebase without breaking legacy modules.
2. **Convert Options API to Composition API**: Replace `asyncData({ $axios })` with `useAsyncData()` and `useFetch()`.
3. **Adopt Native Script Setup**: Refactor component methods, computed properties, and props to `<script setup lang="ts">`.
4. **Replace Vuex with Pinia**: Replace Vuex stores with Pinia composables or Nuxt's native `useState()`.
5. **Update Server Middleware**: Migrate Express/Connect middleware to `h3` event handlers.

