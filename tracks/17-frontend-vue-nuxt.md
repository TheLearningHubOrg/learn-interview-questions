# Vue 3 & Nuxt 3 Frameworks Master Interview Bank (1 - 17)

> Vue 3 Composition API, Proxy-based reactivity system, script setup, Pinia store, Nuxt 3 Nitro SSR engine, server routes, auto-imports, and SEO meta composables.

---

### 1. How does the Vue 3 Reactivity System work internally using JavaScript `Proxy` vs. Vue 2's `Object.defineProperty`?
**In Simple Words:**
Vue 2 used `Object.defineProperty` to convert object properties into getters and setters. This had severe limitations: it could not detect newly added properties, deleted properties, or direct array index modifications (`arr[0] = val`).

Vue 3 replaced this with ES6 **`Proxy`**:
- A `Proxy` wraps the target object and intercepts operations at the meta-level (`get`, `set`, `deleteProperty`, `has`).
- When a property is read in a reactive effect (e.g. template render), Vue's `track()` function records the active effect as a subscriber.
- When a property is mutated, Vue's `trigger()` function re-executes all subscribed effects.
- Nested objects are proxied la

### 2. `ref()` vs. `reactive()` in Vue 3: What are the differences, pitfalls, and best practices?
**In Simple Words:**
- `ref(val)`: Accepts both primitives (`string`, `number`, `boolean`) and objects. Wraps the value in an object with a `.value` property. In templates, it automatically unwraps so you don't need `.value`.
- `reactive(obj)`: Only accepts objects/arrays. Uses a Proxy directly on the object.

**Pitfalls of `reactive()`**:
1. Destructuring breaks reactivity: `const { count } = reactiveState;` loses reactive connection. Must use `toRefs(reactiveState)`.
2. Cannot reassign the whole object: `state = reactive({ new: 1 })` destroys the original Proxy reference.

*Best Practice*: Most modern Vue 3 teams standardi

### 3. Vue 3 Composition API vs. Options API: Architectural and Code Organization benefits.
**In Simple Words:**
- **Options API**: Organi

### 4. `computed()` vs. `watch()` vs. `watchEffect()` in Vue 3: Execution timing and caching.
**In Simple Words:**
- `computed()`: Pure, cached derived state. Only re-evaluates when reactive dependencies change. Should not cause side effects.
- `watch(source, callback)`: La

### 5. How does the `<script setup>` syntax work at compile time in Vue 3?
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

### 6. How does Provide / Inject work in Vue 3, and how do you maintain reactivity across deeply nested components?
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

### 7. What are Custom Vue 3 Composables, and what rules must they follow for SSR safety?
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

### 8. Explain Vue 3's Template Compiler Optimizations: Static Hoisting, Block Tree, and Patch Flags.
**In Simple Words:**
Vue 3's compiler analy

### 9. What is Nuxt 3, and how does the Nitro server engine work?
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

### 10. How do `useAsyncData` and `useFetch` work in Nuxt 3, and how do they prevent duplicate client-side requests?
**In Simple Words:**
When a page renders on the server in Nuxt 3, `useFetch` executes the request on the server and seriali

### 11. How do Auto-Imports work in Nuxt 3, and does it impact bundle size?
**In Simple Words:**
Nuxt 3 automatically imports Vue APIs (`ref`, `computed`, `watch`), Nuxt composables (`useFetch`, `useRoute`), and all components located in `components/` and `composables/`.

It does NOT pollute the global namespace or increase bundle si

### 12. How does Route Middleware work in Nuxt 3 (Global vs. Named vs. Inline)?
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

### 13. Why is Pinia the official state management store for Vue 3 instead of Vuex?
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

### 14. How do `<Teleport>` and `<Suspense>` work in Vue 3?
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

### 15. How do you create and register a Custom Directive in Vue 3?
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

### 16. What causes SSR Hydration Mismatches in Vue 3 and Nuxt 3, and how do you resolve them?
**In Simple Words:**
A hydration mismatch occurs when the DOM rendered on the server differs from the initial virtual DOM generated in the browser.

Common causes:
1. Using client-only APIs (`window.innerWidth`, `Date.now()`, `Math.random()`) during initial render.
2. Invalid HTML nesting (e.g. `<p>` wrapping a `<div>`).

**Resolution**:
- Wrap client-specific dynamic sections in `<ClientOnly>`.
- Initiali

### 17. What are Nuxt 3 Server Components (`.server.vue`) and Hybrid Rendering?
**In Simple Words:**
**Nuxt Server Components** (`Component.server.vue`) are rendered purely on the server and send

