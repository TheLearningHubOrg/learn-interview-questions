# Svelte 5 Runes & SvelteKit Architecture Master Interview Bank (1 - 35)

> Svelte 5 compiler architecture, Runes ($state, $derived, $effect, $props), fine-grained push-pull signal graph, Snippets, SvelteKit routing, Form Actions, load functions, and edge adapters.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Svelte and how does its compiler-based architecture differ from Virtual DOM frameworks?
**In Simple Words:**
- **Virtual DOM Frameworks (React, Vue)**:
  - Ship a heavy framework runtime (~40KB-130KB) to the user's browser.
  - At runtime, every state change builds an in-memory Virtual DOM tree, diffs it against the previous tree, and calculates DOM mutations.
- **Svelte**:
  - Svelte is a **Compiler**, not a runtime library.
  - At build time, Svelte compiles your `.svelte` components into tiny, highly-optimized, vanilla JavaScript instructions that **surgically update the exact DOM node** when state changes.
  - No Virtual DOM overhead, zero runtime diffing, lightning-fast initial load, and minimal memory footprint.

---

### 2. What are Svelte 5 Runes and why were they introduced?
**In Simple Words:**
**Runes** are Svelte 5's modern signal-based reactivity primitives, signaled with a `$` prefix.
In Svelte 3 and 4, reactivity was based on variable assignment (`let count = 0; count++`) which worked *only* at the top level of `.svelte` files.
In Svelte 5:
- Runes make reactivity **universal**—they work identically inside components, plain `.svelte.js` files, classes, and nested functions.
- Runes replace magic compiler syntax with explicit, predictable function-based signals: `$state()`, `$derived()`, `$effect()`, `$props()`.

---

### 3. How does `$state()` declare fine-grained reactive state?
**In Simple Words:**
`$state()` creates a reactive signal. When the value changes, only the exact DOM nodes reading that state re-render:

```svelte
<script>
  let count = $state(0);
  let user = $state({ name: 'Alex', loggedIn: true });

  function increment() {
    count += 1; // Fine-grained mutation
    user.name = 'Jordan'; // Deeply reactive!
  }
</script>

<button onclick={increment}>
  {user.name} clicked {count} times
</button>
```
*Note*: Unlike React where you must write `setUser({ ...user, name: 'Jordan' })`, Svelte 5 proxies objects so mutating properties directly (`user.name = 'Jordan'`) triggers surgical updates!

---

### 4. How do `$derived()` and `$derived.by()` work in Svelte 5?
**In Simple Words:**
- **`$derived(expression)`**: Declares state that automatically tracks its reactive dependencies and recomputes only when dependencies change (similar to Vue's `computed` or MobX).
- **`$derived.by(fn)`**: Used for complex, multi-line computed logic.

```svelte
<script>
  let items = $state([10, 20, 30]);

  // Simple derived signal
  let total = $derived(items.reduce((sum, n) => sum + n, 0));

  // Complex multi-line derived signal
  let stats = $derived.by(() => {
    const sum = items.reduce((a, b) => a + b, 0);
    return { sum, avg: sum / items.length };
  });
</script>
```

---

### 5. How do `$effect()` and `$effect.pre()` handle side effects?
**In Simple Words:**
- **`$effect(() => { ... })`**: Runs after the component has mounted and after any reactive dependencies read inside it change. Replaces Svelte 4's `$: { ... }` and React's `useEffect`.
  - It automatically tracks any `$state()` or `$derived()` signals accessed inside the function—no manual dependency arrays!
  - Can return a cleanup function.
- **`$effect.pre()`**: Executes *before* the DOM is updated (useful for measuring scroll positions before layout changes).

```svelte
<script>
  let count = $state(0);

  $effect(() => {
    console.log(`The count is now ${count}`);

    const timer = setInterval(() => console.log('tick'), 1000);
    return () => clearInterval(timer); // Cleanup on dependency change or unmount
  });
</script>
```

---

### 6. What are Component Props in Svelte 5 using `$props()`?
**In Simple Words:**
In Svelte 4, props were declared using `export let name = 'default'`.
In Svelte 5, all props are accessed via the **`$props()`** rune using standard JavaScript destructuring:

```svelte
<script>
  // Props declaration with defaults and TypeScript types
  let {
    title = 'Default Title',
    count = 0,
    onincrement
  } = $props<{
    title?: string;
    count?: number;
    onincrement?: () => void;
  }>();
</script>

<h1>{title} ({count})</h1>
<button onclick={onincrement}>Increment</button>
```

---

### 7. How does event handling work in Svelte 5 (`onclick` vs. `on:click`)?
**In Simple Words:**
- In Svelte 4: Used custom directive syntax (`on:click={handleClick}`).
- In Svelte 5: Aligns with modern web standards using standard HTML property attributes:
  ```svelte
  <!-- Svelte 5: Standard HTML attribute syntax -->
  <button onclick={handleClick}>Click Me</button>
  <input oninput={(e) => text = e.currentTarget.value} />
  ```
  Component event dispatchers (`createEventDispatcher`) are deprecated in favor of passing callback props (`let { onchange } = $props()`).

---

### 8. Control Flow in Svelte Templates: `{#if}`, `{#each}`, and `{#await}`.
**In Simple Words:**
Svelte provides clean declarative template blocks:
```svelte
<!-- Conditional rendering -->
{#if status === 'loading'}
  <Spinner />
{:else if status === 'error'}
  <ErrorMessage />
{:else}
  <Dashboard />
{/if}

<!-- List iteration with unique key -->
{#each users as user (user.id)}
  <li>{user.name}</li>
{:else}
  <p>No users found.</p>
{/each}

<!-- Direct Promise resolution in template -->
{#await fetchUserData()}
  <p>Loading profile...</p>
{:then data}
  <h1>Welcome {data.name}</h1>
{:catch error}
  <p>Failed to load: {error.message}</p>
{/await}
```

---

### 9. Form Bindings: Two-Way Data Binding in Svelte.
**In Simple Words:**
Instead of writing manual `value={val}` and `onChange={(e) => val = e.target.value}`, Svelte provides the concise `bind:` directive:
```svelte
<script>
  let email = $state('');
  let agreed = $state(false);
  let color = $state('red');
</script>

<input type="text" bind:value={email} />
<input type="checkbox" bind:checked={agreed} />

<select bind:value={color}>
  <option value="red">Red</option>
  <option value="blue">Blue</option>
</select>
```

---

### 10. Svelte Scoped CSS: How does the compiler hash styles?
**In Simple Words:**
Inside `.svelte` files, any `<style>` block is **automatically scoped** to that component:
- The Svelte compiler generates a unique CSS class hash (e.g. `svelte-1t5k8q`) and appends it to both the CSS selectors and the corresponding HTML elements:
  ```css
  /* What you write */
  p { color: purple; }

  /* What Svelte compiles */
  p.svelte-1t5k8q { color: purple; }
  ```
- Styles never bleed into child or parent components. Use `:global()` for global selectors.

---

### 11. Svelte Transitions (`transition:fade`) and Animations (`animate:flip`).
**In Simple Words:**
Svelte features first-class built-in transition directives that execute CSS hardware-accelerated animations when elements enter or leave the DOM:
```svelte
<script>
  import { fade, slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  let items = $state([1, 2, 3]);
</script>

{#each items as item (item)}
  <div transition:slide animate:flip={{ duration: 300 }}>
    Item {item}
  </div>
{/each}
```

---

### 12. Svelte Actions (`use:action`): Direct DOM Node Lifecycle Management.
**In Simple Words:**
An **Action** is a function invoked when a DOM element is mounted. It receives the DOM node as an argument:
```svelte
<script>
  function clickOutside(node, callback) {
    const handleClick = (e) => {
      if (!node.contains(e.target)) callback();
    };
    document.addEventListener('click', handleClick);

    return {
      destroy() {
        document.removeEventListener('click', handleClick);
      }
    };
  }

  let showModal = $state(true);
</script>

<div use:clickOutside={() => showModal = false}>
  Modal Content
</div>
```

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 13. Svelte 5's Signal Graph: How Push-Pull Reactivity Works Under the Hood.
**In Simple Words:**
Svelte 5 implements a fine-grained **Push-Pull Reactive Graph**:
1. **Push Phase (Dirty Notification)**: When a `$state()` signal changes value, it pushes a notification down the dependency tree marking dependent `$derived()` signals and `$effect()` nodes as "dirty". No values are recalculated yet!
2. **Pull Phase (Lazy Evaluation)**: When the DOM or an effect actually reads the derived signal, it "pulls" the new value, executing calculations only once on-demand.
3. If a derived signal computes the exact same value as before, propagation stops immediately, preventing downstream re-renders.

---

### 14. Universal Reactivity: Using Runes inside plain `.svelte.js` files and classes.
**In Simple Words:**
In Svelte 4, sharing reactive state required `writable()` stores.
In Svelte 5, you can use `$state()` directly inside regular JavaScript/TypeScript files (with a `.svelte.ts` extension):

```typescript
// src/lib/cart.svelte.ts
export class ShoppingCart {
  items = $state<{ id: string; price: number }[]>([]);

  total = $derived(this.items.reduce((acc, item) => acc + item.price, 0));

  addItem(item: { id: string; price: number }) {
    this.items.push(item);
  }
}

export const cart = new ShoppingCart();
```

---

### 15. Snippets in Svelte 5 (`{#snippet}` vs. Legacy `<slot>`).
**In Simple Words:**
In Svelte 4, template composition relied on `<slot>` elements, which had limited scoping and typing.
In Svelte 5, **Snippets** treat template chunks as first-class reusable functions:

```svelte
<!-- Declaration -->
{#snippet userRow(user, index)}
  <div class="row">
    <span>#{index}</span>
    <strong>{user.name}</strong>
  </div>
{/snippet}

<!-- Invocation -->
{@render userRow({ name: 'Alice' }, 1)}
{@render userRow({ name: 'Bob' }, 2)}
```

---

### 16. Context API in Svelte: `setContext()` vs. `getContext()`.
**In Simple Words:**
Allows parent components to provide state to deeply nested children without prop-drilling:
```svelte
<!-- Parent.svelte -->
<script>
  import { setContext } from 'svelte';
  let theme = $state('dark');
  setContext('app-theme', { getTheme: () => theme, toggle: () => theme = theme === 'dark' ? 'light' : 'dark' });
</script>

<!-- DeepChild.svelte -->
<script>
  import { getContext } from 'svelte';
  const theme = getContext('app-theme');
</script>

<button onclick={theme.toggle}>Theme: {theme.getTheme()}</button>
```

---

### 17. SvelteKit Architecture: File-Based Routing, `+page.svelte`, `+page.server.ts`, and `+layout.svelte`.
**In Simple Words:**
**SvelteKit** is the official full-stack application framework for Svelte:
- **`+page.svelte`**: The visual UI component rendered for that route.
- **`+page.server.ts`**: Runs **exclusively on the server**. Handles database calls, secret API keys, and form action mutations.
- **`+page.ts`**: Universal load function. Runs on server during initial SSR, and runs in the browser on client-side navigations.
- **`+layout.svelte`**: Wraps all child pages with shared UI (navigation header, footer, sidebar) without re-rendering on page changes.
- **`+error.svelte`**: Catches errors thrown during route loading.

---

### 18. Server Load Functions (`+page.server.ts`) vs. Universal Load Functions (`+page.ts`).
**In Simple Words:**
- **Server Load (`+page.server.ts`)**:
  - Runs **only on the server**.
  - Can safely query databases directly (Prisma, PostgreSQL, MongoDB) or use private environment variables (`$env/static/private`).
  - Serializes return data to JSON and transmits it to the client page component.
- **Universal Load (`+page.ts`)**:
  - Runs on the server during initial page load, but runs **in the browser** during client-side navigation.
  - Useful for client-side API fetches or when data is already cached in memory.

---

### 19. Form Actions in SvelteKit: Progressive Enhancement without JavaScript.
**In Simple Words:**
SvelteKit provides native **Form Actions** that handle data mutations via standard HTML `<form>` submissions:

```typescript
// src/routes/login/+page.server.ts
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    await db.login(email);
    return { success: true };
  }
};
```
```svelte
<!-- src/routes/login/+page.svelte -->
<script>
  import { enhance } from '$app/forms';
</script>

<!-- Works with ZERO JS enabled! With JS enabled, use:enhance handles it via fetch() smoothly -->
<form method="POST" use:enhance>
  <input name="email" type="email" required />
  <button>Log In</button>
</form>
```

---

### 20. SvelteKit API Server Routes (`+server.ts`).
**In Simple Words:**
Create standalone REST or webhook endpoints:
```typescript
// src/routes/api/users/+server.ts
import { json } from '@sveltejs/kit';

export async function GET() {
  const users = await db.users.findMany();
  return json(users);
}

export async function POST({ request }) {
  const body = await request.json();
  const newUser = await db.users.create({ data: body });
  return json(newUser, { status: 201 });
}
```

---

### 21. SvelteKit Server Hooks (`hooks.server.ts`): Request Authentication Middleware.
**In Simple Words:**
Intercepts every incoming HTTP request:
```typescript
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session_id');

  if (token) {
    event.locals.user = await validateSession(token);
  }

  // Protect private routes
  if (event.url.pathname.startsWith('/admin') && !event.locals.user?.isAdmin) {
    return new Response('Unauthorized', { status: 403 });
  }

  return resolve(event);
};
```

---

### 22. Preventing Memory Leaks in `$effect()` and Untracking Dependencies with `untrack()`.
**In Simple Words:**
1. **Unintentional Dependency Tracking**: If you read a state variable inside an `$effect()` simply for logging or analytics, the effect will re-run every time that state changes!
2. **`untrack(fn)`**: Prevents the effect from registering the signal as a dependency:
   ```svelte
   <script>
     import { untrack } from 'svelte';
     let count = $state(0);
     let analyticsId = $state('a1');

     $effect(() => {
       // Tracks ONLY count. If analyticsId changes, effect does NOT re-run!
       console.log(`Count changed to ${count}`);
       sendMetric(count, untrack(() => analyticsId));
     });
   </script>
   ```

---

### 23. Migrating from Svelte 3/4 Writable Stores to Svelte 5 Universal Signals.
**In Simple Words:**
- **Legacy Store**: Required `$store` auto-subscription syntax, `subscribe()` methods, and RxJS-like contract.
- **Svelte 5 Universal Signal**: A plain JavaScript class with `$state()` properties. Can be passed anywhere and accessed directly with dot notation (`store.count`).

---

### 24. Component Error Boundaries in Svelte 5: `<svelte:boundary>`.
**In Simple Words:**
Svelte 5 introduces native declarative error boundaries:
```svelte
<svelte:boundary>
  <HeavyUserProfile />
  {#snippet failed(error, reset)}
    <div class="error-card">
      <p>Failed to load profile: {error.message}</p>
      <button onclick={reset}>Retry</button>
    </div>
  {/snippet}
</svelte:boundary>
```
Catches client-side rendering crashes and renders a fallback snippet without crashing the entire page!

---

## Part 3: Advanced Internals, Scale & Production Architecture (Senior / Lead)

### 25. Svelte 5 Compiler Internals: Fine-Grained DOM Surgery vs. VDOM Diffing.
**In Simple Words:**
- In React: When state changes, the entire component function re-executes from top to bottom, generating dozens of VDOM objects and running reconciliation diffs.
- In Svelte 5:
  ```javascript
  // Compiled output of <h1>{count}</h1>
  function ($$anchor, $$props) {
    const h1 = document.createElement('h1');
    const text = document.createTextNode('');
    h1.appendChild(text);

    $effect(() => {
      text.nodeValue = count.v; // Direct surgical text mutation!
    });
  }
  ```
  The component code does **not** re-execute. Only the tiny effect closure updating `text.nodeValue` runs, achieving $\mathcal{O}(1)$ update performance.

---

### 26. Hydration Mismatch Debugging and Resolving SSR Differences.
**In Simple Words:**
- **Hydration Mismatch**: Occurs when server-rendered HTML diverges from client render (e.g. `new Date()` or `window.innerWidth`).
- **Fix**: Check `browser` flag from `$app/environment`:
  ```svelte
  <script>
    import { browser } from '$app/environment';
    let width = $state(browser ? window.innerWidth : 1024);
  </script>
  ```

---

### 27. Streaming Server-Side Rendering (SSR) and Deferred Data in SvelteKit.
**In Simple Words:**
Avoid blocking page rendering on slow database queries:
```typescript
// src/routes/+page.server.ts
export const load = async () => {
  return {
    fastData: await getFastStats(),
    // Return a Promise directly without awaiting!
    slowStreamedData: getSlowAnalytics()
  };
};
```
In template: use `{#await data.slowStreamedData}`. The fast HTML is sent immediately; the slow data streams down when ready.

---

### 28. Server-Sent Events (SSE) and Streaming in SvelteKit.
**In Simple Words:**
Real-time server push over standard HTTP:
```typescript
// src/routes/api/events/+server.ts
export function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const timer = setInterval(() => {
        controller.enqueue(`data: ${JSON.stringify({ time: Date.now() })}\n\n`);
      }, 1000);
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
```

---

### 29. SvelteKit Adapters Architecture: Cloudflare Pages, Vercel Edge, and Node.
**In Simple Words:**
SvelteKit decouples the application from hosting infrastructure via **Adapters**:
- `@sveltejs/adapter-cloudflare`: Compiles routes to run on Cloudflare Workers edge V8 isolates with sub-5ms cold starts.
- `@sveltejs/adapter-node`: Compiles to a production Node.js Express/Polka server for hosting on Docker / Kubernetes.
- `@sveltejs/adapter-static`: Generates pre-rendered static HTML/CSS files for CDN hosting.

---

### 30. CSRF Protection and Security Hardening in SvelteKit Form Actions.
**In Simple Words:**
1. **CSRF Protection**: SvelteKit automatically blocks cross-origin POST requests on Form Actions unless `origin == host`.
2. **Content Security Policy (CSP)**: SvelteKit injects cryptographic nonces into all inline script tags:
   ```javascript
   // svelte.config.js
   csp: {
     mode: 'auto',
     directives: { 'script-src': ['self'] }
   }
   ```

---

### 31. High-Performance Caching in SvelteKit Load Functions.
**In Simple Words:**
```typescript
export const load = async ({ setHeaders }) => {
  setHeaders({
    'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'
  });
  return { data: await getProducts() };
};
```
Edge CDNs serve cached pages instantly while revalidating in the background.

---

### 32. Testing Svelte 5 Components with Vitest and `@testing-library/svelte`.
**In Simple Words:**
```typescript
import { render, screen, fireEvent } from '@testing-library/svelte';
import Counter from './Counter.svelte';

test('increments counter on button click', async () => {
  render(Counter, { initialCount: 5 });
  const button = screen.getByRole('button', { name: /clicks: 5/i });

  await fireEvent.click(button);
  expect(button).toHaveTextContent('Clicks: 6');
});
```

---

### 33. State Management at Scale: Sharing Signal Classes Across Deep Component Trees.
**In Simple Words:**
Combine Universal Signal Classes with Svelte Context:
```typescript
// context.ts
const CART_KEY = Symbol('CART');
export const setCart = (cart: ShoppingCart) => setContext(CART_KEY, cart);
export const getCart = () => getContext<ShoppingCart>(CART_KEY);
```
Guarantees singletons per route/tenant without global state pollution.

---

### 34. Client-Side Routing Cache Invalidation (`invalidateAll()`).
**In Simple Words:**
After an external mutation (e.g. WebSocket message received):
```javascript
import { invalidateAll } from '$app/navigation';

socket.on('order_updated', () => {
  invalidateAll(); // Re-runs all active load() functions and refreshes page data!
});
```

---

### 35. Architectural Decision Matrix: Svelte 5 / SvelteKit vs. React 19 / Next.js 15.
**In Simple Words:**
- **Choose Svelte 5 / SvelteKit when**:
  - You want minimal JavaScript bundle sizes (<15KB vs 85KB+).
  - You prioritize clean, readable syntax without hook dependency arrays or `useMemo`/`useCallback` boilerplate.
  - You are building rich interactive SPAs or full-stack web applications.
- **Choose Next.js 15 when**:
  - You have massive existing React component ecosystem investments.
  - You require shared code with React Native mobile apps.

