# Vue 3 & Nuxt 3 Modern Fullstack Master Interview Bank (1 - 35)

> Vue 3 Composition API, Reactivity system internals (JavaScript Proxy), ref() vs reactive(), script setup syntax sugar, computed vs watch vs watchEffect, Pinia state management, Vue Router 4, Nuxt 3 Nitro server engine, SSR vs SSG, useFetch vs useAsyncData, Hydration mismatch debugging, and performance optimization (v-memo, shallowRef).

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What are the key differences between Vue 2 (Options API) and Vue 3 (Composition API)?
**In Simple Words:**
- **Options API (Vue 2)**: Code organized by component options (`data()`, `methods`, `computed`, `watch`, `mounted`).
  - *Problem*: In complex components, logic for a single feature is scattered across multiple options, making code hard to read and reuse.
- **Composition API (Vue 3)**: Code organized by **logical concern / feature**:
  - Functions, reactive state, and lifecycle hooks for a specific feature are colocated together inside composables (`useUser()`, `useCart()`).
  - Better TypeScript support, superior tree-shaking, and higher code reusability.

```vue
<!-- Vue 3 Composition API with <script setup> -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const doubleCount = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">Count: {{ count }} (Double: {{ doubleCount }})</button>
</template>
```

### 2. How does the Vue 3 Reactivity System work internally using JavaScript `Proxy`?
**In Simple Words:**
- **Vue 2 (Object.defineProperty)**: Wrapped existing properties with getters/setters. **Flaws**: Could not detect property additions, property deletions, or array index mutations (`arr[0] = x`) without `Vue.set()`.
- **Vue 3 (`Proxy`)**: Wraps the entire object in an ES6 `Proxy`:
  - Intercepts all operations: `get` (tracks dependencies in a `Dep` set), `set` (triggers re-rendering of dependent effects), `deleteProperty`, and `has`.
  - Natively tracks dynamic property additions and array mutations with zero performance penalties!

```text
Vue 3 Reactivity Flow:
Target Object ──► [ES6 Proxy Interceptor]
                         │
        ┌────────────────┴────────────────┐
        ▼ (get)                           ▼ (set)
  [track() Dependency]              [trigger() Effects]
  (Records Active Effect)           (Re-runs Component Render Effect)
```

### 3. What is the difference between `ref()` and `reactive()` in Vue 3?
**In Simple Words:**
- **`ref(initialValue)`**:
  - Can hold **any data type** (primitives like `number`, `string`, `boolean`, as well as objects and arrays).
  - Must access/mutate via **`.value`** in `<script>` (`count.value++`); automatically unwrapped in `<template>`.
  - Reassigning the value preserves reactivity (`count.value = 10`).
- **`reactive(initialObject)`**:
  - Only accepts **Objects, Arrays, Maps, Sets** (cannot hold primitives!).
  - Access properties directly without `.value` (`state.count++`).
  - **Caution**: Destructuring a reactive object (`const { count } = state`) breaks reactivity unless wrapped in `toRefs(state)`!

### 4. What is the difference between `computed()` and `watch()`?
**In Simple Words:**
- **`computed()`**: Calculates a derived value from existing reactive state:
  - **Cached based on dependencies**: Re-evaluates **only when its reactive dependencies change**.
  - Must be a **pure function** with zero side-effects.
- **`watch(source, callback)`**: Observes reactive state and executes **side-effects** whenever the value changes (e.g. triggering an API fetch, saving to localStorage, logging).
  - Lazy by default (runs only when the watched source changes).

### 5. What is `watchEffect()` and how does it differ from `watch()`?
**In Simple Words:**
- **`watch()`**: Explicit. You declare exactly what data source to watch (`watch(userId, ...)`). Provides both new and old values (`(newVal, oldVal)`).
- **`watchEffect()`**: Automatic. Runs immediately on setup, and **automatically tracks any reactive property accessed inside its execution body**:
```typescript
const userId = ref(1);

// Runs immediately, and re-runs whenever userId.value changes!
watchEffect(() => {
  console.log(`Fetching data for user: ${userId.value}`);
});
```

### 6. What is the `<script setup>` syntax sugar in Vue 3?
**In Simple Words:**
A compile-time syntactic sugar for using the Composition API inside Single-File Components (SFCs):
- Top-level bindings (variables, functions, imported components) are **automatically exposed directly to the `<template>`** without returning an object!
- Better runtime performance (compiles template into inline render function in same scope).
- Clean TypeScript ergonomics with compiler macros (`defineProps`, `defineEmits`, `defineExpose`).

### 7. What are the Vue 3 Lifecycle Hooks?
**In Simple Words:**
Imported directly from `'vue'` inside `<script setup>`:
- `onBeforeMount()` / `onMounted()`: Component inserted into the DOM (ideal for initializing third-party libraries, DOM element measurement).
- `onBeforeUpdate()` / `onUpdated()`: DOM updated due to reactive state change.
- `onBeforeUnmount()` / `onUnmounted()`: Component removed from the DOM (cleanup intervals, event listeners).
- Note: `beforeCreate` and `created` are replaced by code executed directly at the top level of `<script setup>`.

### 8. What is `v-model` and two-way data binding in Vue 3?
**In Simple Words:**
Syntactic sugar combining property binding and event emission:
- On native inputs: `v-model="text"` expands to `:value="text"` and `@input="text = $event.target.value"`.
- **On Custom Components**: Uses `modelValue` prop and `update:modelValue` event.
- **Vue 3.4+ (`defineModel()`)**:
```vue
<!-- Child.vue -->
<script setup>
const model = defineModel<string>();
</script>
<template>
  <input v-model="model" />
</template>
```

### 9. What are Slots in Vue (`default`, `named`, `scoped`)?
**In Simple Words:**
Slots allow passing template content from parent into child component:
- **Default Slot**: `<slot />` placeholder.
- **Named Slots**: `<slot name="header" />`, filled via `<template #header>`.
- **Scoped Slots**: Passes data **from the child component up to the parent template slot**:
```vue
<!-- Child.vue -->
<slot :user="currentUser" />

<!-- Parent.vue -->
<Child v-slot="{ user }">
  <p>User: {{ user.name }}</p>
</Child>
```

### 10. What is the `Teleport` built-in component?
**In Simple Words:**
Allows rendering a piece of a component's template into a different part of the DOM tree **outside the component's parent hierarchy** (e.g. directly into `document.body`):
- Essential for Modals, Tooltips, and Notification Toasts to prevent CSS `overflow: hidden` or `z-index` clipping from parent containers:
```vue
<Teleport to="body">
  <div v-if="isOpen" class="modal-backdrop">...</div>
</Teleport>
```

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What is Pinia and why does it replace Vuex in Vue 3?
**In Simple Words:**
Pinia is the official, modern state management library for Vue:
- **No Mutations**: Unlike Vuex, Pinia eliminates mutations entirely! State is modified directly or via `actions`.
- **First-Class TypeScript**: Full type inference out of the box without complex helper wrappers.
- **Modular by Design**: No nested module namespaces; define independent stores (`useUserStore()`, `useCartStore()`) that can import and compose each other.
- **Setup Stores**: Can be written using Composition API syntax (`ref()` = state, `computed()` = getters, `function()` = actions).

```typescript
// stores/cart.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const items = ref<Item[]>([]);
  const totalCost = computed(() => items.value.reduce((sum, i) => sum + i.price, 0));

  function addItem(item: Item) {
    items.value.push(item);
  }

  return { items, totalCost, addItem };
});
```

### 12. How does Component Communication work in Vue 3 (`defineProps`, `defineEmits`, `provide` / `inject`)?
**In Simple Words:**
- **Props & Emits (Parent <-> Direct Child)**:
  - Parent passes down data via `:propName`.
  - Child notifies parent via `defineEmits(['submit'])`.
- **Provide / Inject (Deep Ancestor <-> Any Descendant)**:
  - Ancestor provides data: `provide('theme', currentTheme)`.
  - Deep nested child injects data: `const theme = inject('theme')`.
  - Eliminates "Prop Drilling" through 5 intermediate components.

### 13. What is the `KeepAlive` component and what are its lifecycle hooks?
**In Simple Words:**
Caches inactive component instances in memory instead of destroying them:
- When switching tabs (`<component :is="activeTab" />`), wrapping in `<KeepAlive>` preserves form input, scroll position, and component state!
- **Lifecycle Hooks**:
  - **`onActivated()`**: Called when the cached component is inserted into the DOM.
  - **`onDeactivated()`**: Called when the component is removed from the DOM and cached.

### 14. How does Vue Router 4 handle Navigation Guards?
**In Simple Words:**
Controls route access, authentication checks, and redirects:
- **Global Before Guards (`router.beforeEach`)**:
```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});
```
- Supports Per-Route Guards (`beforeEnter`) and In-Component Guards (`onBeforeRouteUpdate`, `onBeforeRouteLeave`).

### 15. What is Nuxt 3 and how does it compare to standard Vue SPA?
**In Simple Words:**
Nuxt 3 is an intuitive, fullstack framework built on top of Vue 3:
- **Vue SPA**: Client-side rendering only. Empty HTML shell downloaded; blank white screen until JS loads; poor SEO.
- **Nuxt 3**: Fullstack framework:
  - File-based routing (`pages/index.vue` -> `/`).
  - Auto-imported components and composables.
  - Multi-rendering modes: **SSR (Server-Side Rendering)**, **SSG (Static Site Generation)**, Hybrid rendering.
  - Powered by the **Nitro engine** for deploying to serverless edge runtimes (Cloudflare Workers, Vercel, Node.js).

### 16. What is the Nitro Engine in Nuxt 3?
**In Simple Words:**
Nitro is the next-generation server engine powering Nuxt 3:
- **Universal Deployment**: Zero-config compilation to any target: Node.js, Vercel, AWS Lambda, Cloudflare Workers, Deno, Bun.
- **Built-in API Routes**: Place files in `server/api/` (e.g. `server/api/users.ts`) to build backend API endpoints powered by H3 micro-framework.
- **Storage Layer (Unstorage)**: Unified key-value caching abstraction supporting Redis, memory, and filesystem.

### 17. What is the difference between `useFetch` and `useAsyncData` in Nuxt 3?
**In Simple Words:**
- **`useFetch(url)`**: High-level convenience composable. Wraps `useAsyncData` and `$fetch`. Automatically generates unique cache keys based on URL and query params.
- **`useAsyncData(key, handler)`**: Low-level composable. Use when wrapping multiple asynchronous calls, custom SDK requests, or complex logic:
```typescript
// useAsyncData with multiple parallel calls:
const { data, status } = await useAsyncData('dashboard-data', async () => {
  const [user, stats] = await Promise.all([fetchUser(), fetchStats()]);
  return { user, stats };
});
```
- Both ensure data is fetched on the server during SSR and **transferred to the client state payload without duplicate network requests on hydration**!

### 18. What is Hydration and what causes Hydration Mismatches in Nuxt 3?
**In Simple Words:**
- **Hydration**: The process where client-side Vue takes over static server-rendered HTML, attaches event listeners, and makes the page interactive.
- **Hydration Mismatch**: Occurs when the server-rendered HTML does **not match the initial client-rendered DOM**:
  - *Causes*: Using browser-only APIs (`window.innerWidth`, `localStorage`), rendering current time (`Date.now()`), or invalid HTML nesting (e.g. `<div>` inside `<p>`).
  - *Fix*: Wrap client-only elements in `<ClientOnly>` component.

### 19. What is Hybrid Rendering and Route Rules in Nuxt 3?
**In Simple Words:**
Allows defining different caching and rendering strategies **per route** in `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },              // Static SSG generated at build time
    '/blog/**': { isr: 3600 },             // Incremental Static Regeneration (1 hour)
    '/dashboard/**': { ssr: false },       // Client-side only SPA
    '/api/**': { cors: true, cache: { maxAge: 60 } } // Server API with caching
  }
});
```

### 20. What is `shallowRef()` and `shallowReactive()`?
**In Simple Words:**
Performance optimizations that track reactivity only at the **root level**:
- Standard `ref()` recursively wraps all nested object properties in proxies, which is expensive for large collections (e.g. a list of 10,000 table rows).
- **`shallowRef(largeObject)`**: Only `.value = newObject` triggers reactivity; mutating `largeObject.value.foo = 1` does **NOT** trigger updates.
- Huge performance gain for large datasets or third-party instances (e.g. Three.js canvas objects, Leaflet maps).

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. What is the `v-memo` directive in Vue 3 and how does it optimize List Rendering?
**In Simple Words:**
A performance directive that conditionally skips VNode sub-tree re-rendering:
- Caches the virtual DOM sub-tree and re-renders **only if the specified condition array changes**:
```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id === selectedId]">
  <p>{{ item.name }} - {{ item.status }}</p>
</div>
```
- In a list of 1,000 items, changing `selectedId` re-renders **only the 2 affected items** (the newly selected and previously selected item), skipping the other 998 items entirely!

### 22. What is Custom Directive creation in Vue 3 and what are its lifecycle hooks?
**In Simple Words:**
Directives provide direct low-level DOM access:
- Hook Lifecycle: `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted`.
```typescript
// Click-outside custom directive:
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) binding.value(event);
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside);
  }
};
```

### 23. What are Composables and the Best Practices for Authoring them?
**In Simple Words:**
Composables are functions that leverage Vue's Composition API to encapsulate stateful logic:
- **Best Practices**:
  1. Name starts with `use` (e.g. `useMouseCoordinates()`).
  2. Accept `MaybeRefOrGetter<T>` parameters using `toValue()` to support raw values, refs, or getters.
  3. Return a plain object of refs (allows easy destructuring in components):
```typescript
export function useCounter(initial = 0) {
  const count = ref(initial);
  const inc = () => count.value++;
  return { count, inc };
}
```

### 24. How does the Vue 3 Virtual DOM Diffing Algorithm work (Block Tree & Patch Flags)?
**In Simple Words:**
Vue 3 uses compile-time hints to make runtime VDOM diffing blazing fast:
- **Patch Flags**: The compiler tags dynamic elements with a bitmask integer (e.g. `TEXT = 1`, `CLASS = 2`). The runtime checks only the specific flagged dynamic attribute, skipping all static nodes!
- **Block Tree**: The template is split into "Blocks". A Block tracks only its dynamic descendants in a flat array, completely bypassing tree traversal of static HTML!

### 25. How do you implement Server-Side State Synchronization (Hydration State Serialization)?
**In Simple Words:**
When Nuxt fetches data during SSR, it must serialize that data into the HTML payload so the client does not re-fetch it:
- Nuxt serializes state into an inlined `<script id="__NUXT_DATA__" type="application/json">` using **devalue** (handles recursive references, Dates, Regex, BigInt).
- Client deserializes this payload during boot, populating `useState()` and `useAsyncData()` instantly.

### 26. What is `defineAsyncComponent` and Code Splitting in Vue?
**In Simple Words:**
Allows lazy-loading components on demand:
- The component code is split into a separate JavaScript bundle chunk that is only downloaded when the component is rendered:
```typescript
import { defineAsyncComponent } from 'vue';

const HeavyAdminChart = defineAsyncComponent(() =>
  import('./components/AdminChart.vue')
);
```

### 27. What is `toRef()` vs `toRefs()`?
**In Simple Words:**
- **`toRefs(reactiveObject)`**: Converts every property of a reactive object into an independent `ref`, allowing safe destructuring:
  `const { name, age } = toRefs(userState);`
- **`toRef(object, 'key')`**: Creates a ref for a single property, maintaining bidirectional reactivity with the parent source.

### 28. What are Nuxt Plugins and Middleware execution order?
**In Simple Words:**
1. **Server Middleware (`server/middleware/`)**: Runs on every incoming HTTP request before reaching Nuxt.
2. **Nuxt Plugins (`plugins/`)**: Initialized during Nuxt app creation (registering global libraries, analytics).
3. **Route Middleware (`middleware/`)**: Global middleware -> Named page middleware -> Inline page middleware.
4. **Page & Component Setup**.

### 29. What is SEO optimization in Nuxt 3 (`useHead` vs `useSeoMeta`)?
**In Simple Words:**
- **`useHead()`**: General-purpose `<head>` manipulation (scripts, links, meta).
- **`useSeoMeta()` (Best Practice)**: Fully typed composable supporting over 100 SEO and OpenGraph tags with compile-time checking:
```typescript
useSeoMeta({
  title: 'Cloud Architecture Guide 2026',
  ogTitle: 'Cloud Architecture Guide 2026',
  description: 'Comprehensive guide to modern distributed systems.',
  ogImage: 'https://example.com/og.png',
  twitterCard: 'summary_large_image'
});
```

### 30. How do you optimize Bundle Size in Vue / Nuxt applications?
**In Simple Words:**
1. Analyze bundles using `npx nuxi analyze` or `rollup-plugin-visualizer`.
2. Replace heavy dependencies with lightweight alternatives (e.g. `lucide-vue-next` with unplugin-icons).
3. Use auto-imports to ensure only used components are included in chunks.
4. Use `shallowRef` for large non-reactive objects.

### 31. What is the Suspense component in Vue 3?
**In Simple Words:**
A built-in component that orchestrates nested asynchronous dependencies in the component tree:
- Renders fallback loading UI (`#fallback` slot) until all asynchronous setup functions (`async setup()`) or asynchronous components in the `#default` slot resolve.

### 32. What are Custom Renderers in Vue 3 (`createRenderer`)?
**In Simple Words:**
Vue 3 completely decouples the Reactivity and Core Runtime from the DOM:
- **`createRenderer()`**: You can define custom node manipulation functions (`createElement`, `insert`, `patchProp`) to render Vue components onto **Canvas, WebGL, Terminal (Ink), or native iOS/Android** surfaces!

### 33. How do you debug Vue 3 Performance using the Performance API?
**In Simple Words:**
- Enable `app.config.performance = true` in development.
- Inspect the Chrome DevTools **Performance Tab**:
  - Displays custom user timing marks for component initialization, compile, render, and patch times.

### 34. What is the difference between `v-if` and `v-show`?
**In Simple Words:**
- **`v-if`**: Real conditional rendering. If `false`, the component and its children are **completely unmounted and destroyed from the DOM**. Higher toggle cost; lower initial load cost.
- **`v-show`**: The element is always rendered in the DOM; it simply toggles CSS **`display: none`**. Higher initial load cost; near-instantaneous toggle cost.

### 35. When should you choose Nuxt 3 over Next.js?
**In Simple Words:**
- **Choose Nuxt 3**:
  - Teams prioritizing developer velocity, cleaner syntax, and the intuitive Vue reactivity model.
  - Fullstack applications requiring flexible multi-cloud edge deployment (Cloudflare Workers, Node.js, Vercel) powered by Nitro.
  - Preference for built-in auto-imports, file-based routing, and Pinia state management without boilerplate.
- **Choose Next.js**: When deeply invested in the React ecosystem, React Server Components (RSC), or massive corporate enterprise React talent pools.
`;
