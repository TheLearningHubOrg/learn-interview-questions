# Astro & Component Islands Master Interview Bank (1 - 35)

> Astro Zero-JS by default, Component Islands architecture, Client Hydration directives (`client:load`, `client:visible`), Content Collections with Zod schemas, View Transitions API, Hybrid SSR, and Multi-Framework integration.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Astro and how does its Zero-JS-by-Default philosophy work?
**In Simple Words:**
**Astro** is a modern web framework designed for content-rich websites (blogs, marketing sites, documentation, e-commerce storefronts).
- **Zero JavaScript by Default**:
  - Astro renders components to **pure HTML and CSS** on the server at build/request time.
  - It ships **0KB of client-side JavaScript** to the browser by default.
  - A traditional Next.js or React page might download 250KB of JS to show static text; Astro delivers 0KB, achieving instant Core Web Vitals and 100/100 Lighthouse performance scores.

---

### 2. What is the Astro Component Islands Architecture?
**In Simple Words:**
Pioneered by Jason Miller and popularized by Astro:
- An **Island** is an isolated pocket of interactive UI embedded within an otherwise static HTML document.
- Instead of hydrating the *entire page* with a massive monolithic JS bundle, Astro loads and hydrates **only the specific interactive islands that need it**.

```
+-----------------------------------------------------------+
| Static Header (0KB JS - Pure HTML)                        |
+-----------------------------------------------------------+
| Static Sidebar (0KB JS)  |  [ Interactive Image Carousel ]| <- Island: 15KB JS
|                          |  (client:visible)              |
|                          +--------------------------------+
|                          | Static Article Body (0KB JS)   |
+-----------------------------------------------------------+
| [ Interactive Buy Button ]                                | <- Island: 4KB JS
| (client:load)                                             |
+-----------------------------------------------------------+
| Static Footer (0KB JS)                                    |
+-----------------------------------------------------------+
```

---

### 3. What is the syntax of an `.astro` file (Frontmatter vs. Template)?
**In Simple Words:**
Astro files (`.astro`) combine Markdown frontmatter with HTML-like templates:
```astro
---
// Server-side code fence (runs ONLY on the server during build/render)
// Never shipped to the browser!
import UserCard from '../components/UserCard.astro';
const response = await fetch('https://api.example.com/users');
const users = await response.json();
---

<!-- HTML Template -->
<div class="user-list">
  {users.map((user) => (
    <UserCard name={user.name} email={user.email} />
  ))}
</div>

<style>
  /* Scoped CSS by default! */
  .user-list { display: grid; gap: 1rem; }
</style>
```

---

### 4. How does File-Based Routing work in Astro (`src/pages/`)?
**In Simple Words:**
Astro uses the filesystem structure inside `src/pages/` to generate routes:
- `src/pages/index.astro` -> `/`
- `src/pages/about.astro` -> `/about`
- `src/pages/blog/[slug].astro` -> Dynamic route `/blog/:slug`
- `src/pages/api/checkout.ts` -> Server endpoint API route returning JSON.

---

### 5. What are Astro Client Hydration Directives?
**In Simple Words:**
By default, UI framework components (React, Svelte, Vue) in Astro render as static HTML. To make them interactive on the client, you attach a **`client:*` directive**:

1. **`client:load`**: Hydrates JavaScript immediately upon page load. (Use for critical above-the-fold UI like navigation headers).
2. **`client:idle`**: Hydrates after the main thread is free (when `requestIdleCallback` fires).
3. **`client:visible`**: Hydrates only when the component enters the user's viewport using `IntersectionObserver`. (Perfect for footer carousels or comments).
4. **`client:media="(max-width: 768px)"`**: Hydrates only if a CSS media query matches (e.g. mobile-only sidebar).
5. **`client:only="svelte"`**: Skips server-rendering completely; renders exclusively on the client (for canvas or WebGL components).

---

### 6. How does Multi-Framework Component Integration work in Astro?
**In Simple Words:**
Astro allows you to use multiple frontend frameworks simultaneously in the same project:
```astro
---
import ReactCarousel from '../components/ReactCarousel.jsx';
import SvelteForm from '../components/SvelteForm.svelte';
import VueWidget from '../components/VueWidget.vue';
---

<h1>Multi-Framework Dashboard</h1>
<ReactCarousel client:visible />
<SvelteForm client:load />
<VueWidget client:idle />
```
Astro orchestrates independent client runtimes for each island.

---

### 7. What are Layouts and Slots in Astro?
**In Simple Words:**
- **Layout Component (`src/layouts/BaseLayout.astro`)**: Shared shell wrapping pages with `<html>`, `<head>`, navigation, and footer.
- **`<slot />`**: Defines where page-specific child content is injected inside the layout:
  ```astro
  ---
  // BaseLayout.astro
  const { title } = Astro.props;
  ---
  <html>
    <head><title>{title}</title></head>
    <body>
      <nav>Header</nav>
      <slot /> <!-- Injects page content here -->
      <footer>Footer</footer>
    </body>
  </html>
  ```

---

### 8. How does Astro handle Scoped CSS?
**In Simple Words:**
Inside `.astro` files, styles written in `<style>` tags are automatically scoped using generated attribute selectors (e.g., `h1[data-astro-cid-j7pv25f6]`).
- Styles never leak to parent or child components.
- Supports Sass, Less, and Tailwind CSS natively with zero extra configuration.

---

### 9. How does Astro Image Optimization (`<Image />`) work?
**In Simple Words:**
Astro includes a built-in image optimization service:
```astro
---
import { Image } from 'astro:assets';
import myHero from '../assets/hero.jpg';
---

<!-- Automatically converts JPG/PNG to modern WebP/AVIF, generates srcset, and prevents CLS -->
<Image src={myHero} alt="Product Hero" width={800} height={400} format="webp" />
```
Prevents layout shifts (CLS) by automatically inferring width/height and compresses image bytes by up to 80%.

---

### 10. SSG vs. SSR in Astro (`output: 'static' | 'server' | 'hybrid'`).
**In Simple Words:**
Configure rendering strategy in `astro.config.mjs`:
- **`output: 'static'` (Default)**: Builds pre-rendered HTML files at build time. Ultra-fast, hostable on any static CDN (Cloudflare Pages, S3).
- **`output: 'server'`**: Renders HTML dynamically on every request via a Node or Edge adapter. Used for dynamic dashboards, user authentication, and personalized content.
- **`output: 'hybrid'` (PPR)**: Pre-renders everything statically by default, but allows individual routes to opt-in to SSR with `export const prerender = false;`.

---

### 11. How do Dynamic Routes (`[slug].astro`) and `getStaticPaths()` work?
**In Simple Words:**
When generating static pages (`SSG`) for dynamic routes (`[slug].astro`):
```astro
---
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<h1>{post.data.title}</h1>
<Content />
```

---

### 12. What are Astro Endpoints (`src/pages/api/...ts`)?
**In Simple Words:**
Create standalone REST API endpoints that return JSON, XML, or binary data:
```typescript
// src/pages/api/health.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: 'ok', uptime: process.uptime() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 13. What are Astro Content Collections (`src/content/`)?
**In Simple Words:**
Astro provides a structured, type-safe content engine inside `src/content/`:
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    author: z.string().default('Anonymous'),
    tags: z.array(z.string()),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog };
```
- If a markdown file has a missing `publishDate` or invalid YAML format, the Astro compiler throws a build error with line numbers!
- Queries are fully typed: `const posts = await getCollection('blog');`.

---

### 14. What is the Astro View Transitions API (`<ViewTransitions />`)?
**In Simple Words:**
Multi-Page Applications (MPAs) traditionally suffered from a white flash during full-page reloads.
Astro incorporates the native browser **View Transitions API**:
```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```
- Automatically intercepts link clicks, fetches the next page HTML via `fetch()`, and morphs the DOM with smooth cross-fade or slide animations.
- Eliminates the need for heavy client-side routers (React Router).

---

### 15. How do you persist state across page navigations with `transition:persist`?
**In Simple Words:**
When navigating between pages with View Transitions, all DOM elements are replaced.
Adding `transition:persist` tells Astro to **keep that specific DOM node alive across navigations**:
```astro
<aside transition:persist="sidebar">
  <VideoPlayer src="tutorial.mp4" autoplay />
</aside>
```
The video continues playing uninterrupted without pausing or resetting while the user navigates through different pages!

---

### 16. How do independent Islands communicate with each other (Nano Stores)?
**In Simple Words:**
Because islands run in isolated component trees (e.g. a Svelte Header and a React Cart modal):
- **Nano Stores (`nanostores`)**: A lightweight (<1KB), framework-agnostic state manager:
  ```typescript
  // src/stores/cart.ts
  import { atom } from 'nanostores';
  export const cartItems = atom<string[]>([]);
  ```
  Both the React island and the Svelte island can import and subscribe to `cartItems`. When the React button calls `cartItems.set(...)`, the Svelte badge updates reactively!

---

### 17. Partial Prerendering (PPR) in Astro.
**In Simple Words:**
Combines the speed of static CDN caching with dynamic personalized data:
- The static layout shell (header, sidebar, marketing copy) is pre-rendered at build time and cached on global CDN edge nodes (0ms TTFB).
- Dynamic personalized sections (user profile, shopping cart count) stream from server edge functions using HTTP chunked streaming and `<Suspense>`.

---

### 18. How do Astro Middleware functions work (`src/middleware.ts`)?
**In Simple Words:**
Runs on every incoming HTTP request before page rendering:
```typescript
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get('session')?.value;

  if (!token && context.url.pathname.startsWith('/admin')) {
    return context.redirect('/login');
  }

  // Pass user to Astro components via locals
  context.locals.user = await getUserFromToken(token);
  return next();
});
```

---

### 19. Native Internationalization (i18n) in Astro.
**In Simple Words:**
Astro includes native multi-language routing:
```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de'],
    routing: { prefixDefaultLocale: false }
  }
});
```
Automatically maps `/es/about` to Spanish templates with localized route helpers (`getRelativeLocaleUrl()`).

---

### 20. What are Astro Integrations and how do they extend the build pipeline?
**In Simple Words:**
Integrations hook into Astro's lifecycle hooks (`astro:config:setup`, `astro:build:done`):
- Run `npx astro add tailwind` or `npx astro add sitemap`.
- Injects custom Vite plugins, configures compilers, or generates sitemaps and RSS feeds automatically on build completion.

---

### 21. MDX in Astro: Embedding Interactive Components in Markdown.
**In Simple Words:**
Using `@astrojs/mdx`, content creators can write Markdown combined with interactive framework components:
```mdx
# Launch Announcement

Welcome to our new platform! Here is an interactive pricing calculator:

import PricingCalculator from '../components/PricingCalculator.jsx';

<PricingCalculator client:visible />
```

---

### 22. Server-Side Session and Cookie Management in Astro SSR.
**In Simple Words:**
In SSR mode, read and write HTTP-only cookies securely:
```astro
---
// Read cookie
const sessionId = Astro.cookies.get('session_id')?.value;

// Set cookie on form action
if (Astro.request.method === 'POST') {
  Astro.cookies.set('session_id', newSession, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  });
}
---
```

---

### 23. Configuring SEO and OpenGraph Tags cleanly in Astro.
**In Simple Words:**
Create a reusable `<BaseHead />` component:
```astro
---
const { title, description, image = '/default-og.png' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<link rel="canonical" href={canonicalURL} />
<title>{title}</title>
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:image" content={new URL(image, Astro.site)} />
<meta name="twitter:card" content="summary_large_image" />
```

---

### 24. Managing Environment Variables in Astro (`import.meta.env`).
**In Simple Words:**
- **Server-Only Variables**: `import.meta.env.DB_PASSWORD` (Stripped from any client-side JavaScript!).
- **Client-Exposed Variables**: Must be prefixed with `PUBLIC_` (`import.meta.env.PUBLIC_ANALYTICS_ID`).

---

## Part 3: Advanced Internals, Scale & Production Architecture (Senior / Lead)

### 25. Deep Dive into the Astro Islands Hydration Engine.
**In Simple Words:**
How Astro loads islands without client overhead:
- The server serializes the component props into JSON attributes: `<astro-island component-url="/_astro/BuyButton.js" props="{...}">`.
- Astro injects an ultra-lightweight client script (<1.5KB) that parses island elements and attaches an `IntersectionObserver` (for `client:visible`) or `requestIdleCallback` (for `client:idle`).
- The framework bundle (React or Svelte runtime) is downloaded **only when the hydration condition is met**, keeping initial page load lightning fast.

---

### 26. Microfrontends Architecture with Astro.
**In Simple Words:**
Enterprise architectures:
- Search team owns a React search widget.
- Recommendations team owns a Svelte recommendation slider.
- Checkout team owns a Vue cart modal.
- Astro serves as the unifying host shell, aggregating static HTML and hydrating independent framework islands without shared runtime conflicts.

---

### 27. Dynamic OpenGraph Social Image Generation on the Edge.
**In Simple Words:**
Generate customized social preview PNG cards on-demand:
- Use Astro server endpoints (`src/pages/og/[slug].png.ts`) using `@resvg/resvg-js` or Satori to render HTML/CSS into high-resolution social share images at build time or edge request time.

---

### 28. Deploying Astro to Cloudflare Workers, Vercel Edge, and Netlify.
**In Simple Words:**
Astro provides official adapters for zero-cold-start edge deployments:
- `@astrojs/cloudflare`: Deploys to Cloudflare Workers edge network.
- `@astrojs/vercel`: Deploys to Vercel Serverless and Edge functions.
- `@astrojs/node`: Deploys as a standalone containerized Node.js server.

---

### 29. High-Performance Caching in Astro SSR.
**In Simple Words:**
In Astro frontmatter:
```astro
---
Astro.response.headers.set(
  'Cache-Control',
  'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'
);
---
```
Edge CDNs serve cached pages instantly while revalidating in the background.

---

### 30. Auditing Lighthouse 100/100 Scores in Astro: Eliminating Script Bloat.
**In Simple Words:**
1. Zero runtime JS by default ensures 100 on Performance.
2. Native `<Image />` component guarantees zero CLS and optimal LCP.
3. Self-hosted fonts with `@fontsource` eliminates external font render delays.

---

### 31. Incremental Content Builds for 100,000+ Page Sites.
**In Simple Words:**
For massive e-commerce catalogs or news publications:
- Use Astro's Content Layer API (introduced in Astro 5) to stream and cache content data from external headless CMSs (Contentful, Sanity, Strapi) incrementally, cutting build times by 90%.

---

### 32. Security Best Practices in Astro: Preventing Content Injection.
**In Simple Words:**
- In Astro templates, all expressions `{untrustedString}` are **automatically HTML-escaped**.
- If rendering raw HTML with `set:html`, always sanitize using DOMPurify or sanitize-html to prevent XSS.

---

### 33. Cross-Island State Synchronization with Nano Stores.
**In Simple Words:**
Using deep computed stores in Nano Stores:
```typescript
import { computed } from 'nanostores';
import { cartItems } from './cart';

export const cartTotal = computed(cartItems, (items) =>
  items.reduce((sum, item) => sum + item.price, 0)
);
```

---

### 34. Real-World E-Commerce Architecture with Astro.
**In Simple Words:**
- 95% of the page (Product description, specifications, image gallery, SEO reviews) is pre-rendered static HTML delivered from CDN edge.
- Only the "Add to Cart" button and "Real-Time Stock Counter" are dynamic React islands hydrated with `client:load`.
- Yields the fastest e-commerce experience on the web.

---

### 35. Architectural Decision Matrix: Astro vs. Next.js vs. SvelteKit vs. Gatsby.
**In Simple Words:**
- **Choose Astro when**: Building content-driven websites (blogs, docs, e-commerce storefronts, marketing pages). Zero-JS baseline and Islands architecture deliver unmatched Lighthouse performance scores.
- **Choose SvelteKit when**: Building rich, interactive, state-heavy web applications (SaaS dashboards, real-time collaboration tools).
- **Choose Next.js when**: The team is deeply invested in the React ecosystem or requires React Native cross-platform code sharing.
- **Avoid Gatsby**: Outdated architecture with slow build times and heavy client-side GraphQL runtime overhead.
