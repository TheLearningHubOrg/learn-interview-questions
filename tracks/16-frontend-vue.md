# Vue 3 Core & Composition API Master Interview Bank (1 - 35)

> Vue 3 Proxy reactivity (`ref`, `reactive`, `track`, `trigger`), Composition API, `<script setup>`, `defineModel`, Pinia state management, compiler optimizations (Patch Flags, Block Tree), and Composables architecture.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Vue 3 and what are the main differences between the Options API and Composition API?
**In Simple Words:**
- **Options API (Vue 2 & Vue 3 Legacy)**:
  - Code is split across predefined options blocks: `data()`, `methods`, `computed`, `watch`, `mounted()`.
  - *Limitation*: In complex components, logic for a single feature (e.g. user search) is fragmented across 5 different options blocks, forcing developers to scroll up and down.
- **Composition API (Vue 3 Modern Standard)**:
  - Code is organized by **logical concern / feature** using imported functions (`ref`, `computed`, `onMounted`).
  - Related state, methods, and lifecycle hooks live together.
  - Enables clean, reusable logic extraction into **Composables** with first-class TypeScript support.

---

### 2. How does Vue 3's Proxy-based Reactivity System work compared to Vue 2?
**In Simple Words:**
- **Vue 2 (`Object.defineProperty`)**:
  - Intercepted properties using getters and setters.
  - *Severe Limitations*: Could not detect dynamically added or deleted properties (`this.obj.newProp = 123` required `Vue.set()`), and could not detect direct array index mutations (`arr[0] = 5`).
- **Vue 3 (`Proxy`)**:
  - Uses native ES6 `Proxy` to wrap entire objects.
  - Intercepts 13 low-level traps (`get`, `set`, `deleteProperty`, `has`, `ownKeys`).
  - Automatically detects property additions, deletions, and array index assignments with zero boilerplate and significantly faster memory allocation.

---

### 3. What is the difference between `ref()` and `reactive()` in Vue 3?
**In Simple Words:**
- **`ref(value)`**:
  - Works with **primitives** (strings, numbers, booleans) as well as objects.
  - Wraps the value in a reactive container object with a `.value` property.
  - In `<script setup>`, you must access `.value` (`count.value++`); in `<template>`, Vue **unwraps it automatically** (`<button>{{ count }}</button>`).
- **`reactive(object)`**:
  - Works **only with objects and arrays** (cannot take primitives).
  - Returns a deeply reactive Proxy directly (no `.value` needed).
  - *Risk*: Destructuring a reactive object (`const { x, y } = reactiveObj`) **destroys reactivity** unless you use `toRefs()`.
- *Industry Best Practice*: Many teams standardize on using `ref()` exclusively for consistency.

---

### 4. How do `computed()` and `watch()` work in Vue 3?
**In Simple Words:**
- **`computed(() => ...)`**:
  - Derives a new reactive value from existing state.
  - **Cached**: Recomputes only when its reactive dependencies change.
  - Read-only by default (can define custom getter/setter).
- **`watch(source, callback)`**:
  - Executes a side-effect (making an API call, logging, setting local storage) in response to state changes.
  - **Lazy by default**: Does not run until the watched state actually changes (unless `{ immediate: true }` is set).
  - Provides both the `newValue` and `oldValue`.

---

### 5. What is `watchEffect()` and how does it differ from `watch()`?
**In Simple Words:**
- **`watch(source, cb)`**:
  - You must explicitly define what state to watch (`watch(userId, ...)`).
  - Separates the watched dependency from the side effect.
- **`watchEffect(cb)`**:
  - **Runs immediately on initialization**.
  - **Automatically tracks** any reactive variables read inside the callback function.
  - If you read `count.value` inside `watchEffect`, it automatically re-runs whenever `count.value` changes.

```typescript
// watch: Explicit dependency
watch(userId, async (newId) => {
  userData.value = await fetchUser(newId);
});

// watchEffect: Automatic dependency tracking
watchEffect(async () => {
  userData.value = await fetchUser(userId.value);
});
```

---

### 6. What is the `<script setup>` syntax sugar?
**In Simple Words:**
`<script setup>` is the compiled syntactic sugar for using the Composition API inside Single-File Components (SFCs):
- **No boilerplate**: Top-level variables, functions, and imports are **automatically exposed to the template** without an explicit `export default { setup() { return { ... } } }`.
- **Better runtime performance**: Compiles directly into the component's render function, avoiding the overhead of proxying the setup return object.
- First-class TypeScript support with `defineProps`, `defineEmits`, and `defineModel`.

---

### 7. What are the essential Vue 3 Lifecycle Hooks?
**In Simple Words:**
In the Composition API, lifecycle hooks are imported and invoked inside `setup()`:
- `onMounted()`: Component has finished initial rendering and DOM nodes are accessible. (Fetch initial API data, attach window listeners).
- `onUpdated()`: DOM has updated following a reactive state mutation.
- `onUnmounted()`: Component has been destroyed and removed from DOM. (Clean up timers, cancel network requests).
- `onErrorCaptured()`: Error boundary hook catching child component errors.
- *Note*: `beforeCreate` and `created` do not exist in `<script setup>` because code inside `<script setup>` executes during component creation naturally!

---

### 8. How does Two-Way Data Binding work with `v-model` and `defineModel()`?
**In Simple Words:**
- In Vue 2: `v-model` was limited to a single property (`value` + `input` event).
- In Vue 3: A component can have **multiple `v-model` bindings**:
  ```html
  <UserCard v-model:first-name="first" v-model:last-name="last" />
  ```
- **`defineModel()` (Vue 3.4+)**:
  Eliminates tedious manual prop declaration and event emission:
  ```vue
  <!-- CustomInput.vue -->
  <script setup>
  const model = defineModel<string>();
  </script>
  <template>
    <input v-model="model" />
  </template>
  ```

---

### 9. What are `defineProps` and `defineEmits` in `<script setup>`?
**In Simple Words:**
Compiler macros (no need to import them!) used to declare component API contracts:
```vue
<script setup lang="ts">
// Typed Props with defaults
const props = withDefaults(defineProps<{
  title: string;
  count?: number;
}>(), {
  count: 0
});

// Typed Emits
const emit = defineEmits<{
  (e: 'change', id: number): void;
  (e: 'close'): void;
}>();

function handleClick() {
  emit('change', 42);
}
</script>
```

---

### 10. `v-if` vs. `v-show`: Performance and DOM Differences.
**In Simple Words:**
- **`v-if` (Conditional Rendering)**:
  - "Real" conditional rendering: elements are **physically added or removed from the DOM**.
  - Destroys and recreates child component instances and triggers lifecycle hooks (`onMounted` / `onUnmounted`).
  - High toggle cost; low initial render cost if condition is false.
- **`v-show` (CSS Display Toggle)**:
  - Element is **always rendered in the DOM**.
  - Only toggles the CSS `display: none` property.
  - Low toggle cost; higher initial render cost.
- *Rule*: Use `v-show` for elements that toggle frequently (dropdowns, tabs); use `v-if` for elements that rarely change.

---

### 11. How do Slots, Named Slots, and Scoped Slots work in Vue 3?
**In Simple Words:**
- **Default Slot**: Injects child content (`<slot />`).
- **Named Slots (`#name`)**: Injects content into specific slots:
  ```vue
  <!-- BaseModal.vue -->
  <header><slot name="header" /></header>
  <main><slot /></main>
  ```
  ```vue
  <!-- Parent.vue -->
  <BaseModal>
    <template #header><h1>Delete Record</h1></template>
    <p>Are you sure?</p>
  </BaseModal>
  ```
- **Scoped Slots**: Child passes data back up to the parent template:
  ```vue
  <!-- List.vue -->
  <slot :item="item" />
  <!-- Parent: <template #default="{ item }">{{ item.name }}</template> -->
  ```

---

### 12. What is the native `<Teleport>` component?
**In Simple Words:**
Allows you to render a component's DOM subtree into a **different location in the DOM** outside the component hierarchy (typically `body`), while preserving the component's logical parent-child state and event communication:
```vue
<template>
  <button @click="isOpen = true">Open Modal</button>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal-content">Modal rendered in body!</div>
    </div>
  </Teleport>
</template>
```
Prevents modals and tooltips from being clipped by parent CSS `overflow: hidden` or `z-index` stacking contexts.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 13. What is Pinia and why did it replace Vuex?
**In Simple Words:**
**Pinia** is the official state management library for Vue 3:
- **No Mutations**: In Vuex, modifying state required writing verbose `mutations` and `actions`. In Pinia, you modify state directly (`store.count++`) or call actions.
- **First-Class TypeScript**: 100% type-safe autocomplete without magic strings or complex generic wrappers.
- **Modular by Design**: No nested module hell; you define independent stores (`useUserStore`, `useCartStore`) and import them on demand.
- **Setup Stores**: Can write stores using the exact same Composition API syntax:
  ```typescript
  export const useCartStore = defineStore('cart', () => {
    const items = ref<Item[]>([]);
    const total = computed(() => items.value.reduce((s, i) => s + i.price, 0));
    function addItem(item: Item) { items.value.push(item); }
    return { items, total, addItem };
  });
  ```

---

### 14. How do you structure Composables in Vue 3?
**In Simple Words:**
A **Composable** is a function that leverages Vue's Composition API to encapsulate and share stateful logic:

```typescript
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event: MouseEvent) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}
```
*Best Practice Rules*: Name begins with `use`, returns a plain object of refs, cleans up side-effects in `onUnmounted`.

---

### 15. What are Template Refs in the Composition API?
**In Simple Words:**
Direct access to rendered DOM elements or child component instances:
```vue
<script setup>
import { ref, onMounted } from 'vue';

// Variable name must match the ref attribute in template!
const inputElement = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputElement.value?.focus();
});
</script>

<template>
  <input ref="inputElement" />
</template>
```

---

### 16. Dependency Injection with `provide()` and `inject()`.
**In Simple Words:**
Passes state from an ancestor component down to deeply nested children without prop drilling:
```typescript
// Ancestor.vue
import { provide, ref } from 'vue';
const theme = ref('dark');
provide('theme-key', theme);

// DeepChild.vue
import { inject } from 'vue';
const theme = inject('theme-key', 'light'); // with fallback
```

---

### 17. What is `<KeepAlive>` and its lifecycle hooks?
**In Simple Words:**
Caches inactive component instances in memory rather than destroying them when switching views:
```vue
<KeepAlive :include="['UserList', 'ProductCatalog']">
  <component :is="activeComponent" />
</KeepAlive>
```
- **`onActivated()`**: Invoked when the cached component is re-inserted into the DOM.
- **`onDeactivated()`**: Invoked when the component is removed from the DOM and cached in memory.

---

### 18. What are Custom Directives in Vue 3?
**In Simple Words:**
Low-level DOM manipulation abstractions:
```typescript
// v-focus directive
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
};
```
In template: `<input v-focus />`.

---

### 19. Optimizing Performance with `shallowRef()` and `shallowReactive()`.
**In Simple Words:**
Standard `ref()` and `reactive()` recursively convert all nested properties into Proxies.
If you fetch a massive array of 50,000 read-only table records from an API:
- Deep reactivity creates 500,000 Proxies, burning memory and freezing the browser.
- **`shallowRef(massiveArray)`**: Only tracks `.value` reassignment. Nested object mutations are not tracked, saving **90% of memory overhead**!

---

### 20. What is `v-memo` and how does it optimize virtual DOM sub-tree updates?
**In Simple Words:**
Introduced in Vue 3.2, `v-memo="[dep1, dep2]"` memoizes a chunk of the template:
```vue
<div v-for="user in users" :key="user.id" v-memo="[user.id === selectedId]">
  <p>{{ user.name }}</p>
  <p>{{ user.details }}</p>
</div>
```
If `user.id === selectedId` has not changed, Vue **skips Virtual DOM diffing completely for that entire sub-tree**, speeding up large lists by up to **10x**!

---

### 21. Preserving Reactivity: `toRef()`, `toRefs()`, and `toValue()`.
**In Simple Words:**
- Destructuring a reactive object breaks reactivity: `const { count } = state;` -> loses proxy connection!
- **`toRefs(state)`**: Converts every property into an independent `ref` that stays linked to the source object:
  ```typescript
  const { count } = toRefs(state); // Reactivity preserved!
  ```
- **`toValue(refOrGetterOrValue)`**: Normalizes refs, getter functions, or raw values into a plain value (essential for composable arguments).

---

### 22. Transitions: `<Transition>` and `<TransitionGroup>`.
**In Simple Words:**
Applies automated CSS enter/leave animation classes:
- Classes applied automatically: `v-enter-from`, `v-enter-active`, `v-enter-to`, `v-leave-from`, `v-leave-active`, `v-leave-to`.
- `<TransitionGroup>`: Handles lists with smooth positional layout transitions via FLIP animations (`v-move`).

---

### 23. Async Components (`defineAsyncComponent`).
**In Simple Words:**
Lazy-loads components on-demand using dynamic imports:
```typescript
import { defineAsyncComponent } from 'vue';

const HeavyChart = defineAsyncComponent(() =>
  import('@/components/HeavyChart.vue')
);
```
Splits the component into a separate JavaScript chunk, keeping initial bundle size minimal.

---

### 24. Vue Router 4 Composition API Integration.
**In Simple Words:**
```typescript
import { useRouter, useRoute } from 'vue-router';

const router = useRouter(); // Programmatic navigation
const route = useRoute();   // Reactive params and query

function handleSearch() {
  router.push({ path: '/search', query: { q: 'vue' } });
}
```

---

## Part 3: Advanced Internals, Scale & Production Architecture (Senior / Lead)

### 25. Deep Dive into Vue 3 Reactivity Internals: `track()`, `trigger()`, and `TargetMap`.
**In Simple Words:**
Under the hood, Vue's reactivity engine uses a global WeakMap:
```
TargetMap: WeakMap<TargetObject, Map<PropertyKey, Set<ReactiveEffect>>>
```
1. **`track(target, key)` (During Property Read - Getter)**:
   - When active code (e.g. a component render function or `computed`) reads a property, `track` adds the currently running `ReactiveEffect` into the property's `Set` of subscribers.
2. **`trigger(target, key)` (During Property Write - Setter)**:
   - When a property is modified, `trigger` looks up all effects registered in the property's `Set` and executes them.

---

### 26. Vue 3 Compiler Optimizations: Block Tree and Patch Flags.
**In Simple Words:**
Unlike React (which diffs the entire Virtual DOM tree blindly), Vue 3 analyzes templates at compile-time:
1. **Patch Flags**: The compiler tags dynamic bindings with binary bitmasks:
   ```html
   <div><h1>Static Title</h1><p :id="id">{{ text }}</p></div>
   ```
   Compiled: The `<h1>` is marked static. The `<p>` is tagged with `/* TEXT, PROPS */` flag `9`.
2. **Block Tree**: The runtime skips the static `<h1>` entirely during re-render and inspects **only the elements flagged with dynamic patch flags**, achieving near compile-time speed.

---

### 27. Custom Renderers: The `createRenderer` API.
**In Simple Words:**
Vue 3 separates the core runtime from the browser DOM:
- You can create custom renderers targeting Canvas, WebGL (TresJS), Terminal CLI (Ink-like), or Native Mobile by implementing standard node ops (`createElement`, `insert`, `remove`, `patchProp`).

---

### 28. Managing Enterprise Pinia Stores: Plugins and SSR Hydration.
**In Simple Words:**
- **Pinia Plugins**: Global interceptors for state persistence (`localStorage`) or telemetry:
  ```typescript
  pinia.use(({ store }) => {
    store.$subscribe((mutation, state) => {
      saveToAnalytics(mutation.type, store.$id);
    });
  });
  ```
- **SSR Hydration**: Pinia serializes state on the server into `window.__INITIAL_STATE__`, and the client store hydrates instantly without double-fetching.

---

### 29. Memory Leak Prevention in Long-Running Vue 3 SPAs.
**In Simple Words:**
1. **Unregistered Listeners**: Always remove window event listeners in `onUnmounted`.
2. **Third-Party Libraries**: Explicitly call `.destroy()` on Chart.js, TinyMCE, or Leaflet map instances in `onUnmounted`.
3. **Uncleared Watchers**: Watchers created outside of component `setup()` must be stopped manually by calling the returned unwatch function.

---

### 30. Error Handling in Vue 3: `onErrorCaptured` and Global Handlers.
**In Simple Words:**
- **`onErrorCaptured`**: Component-level error boundary.
- **Global Handler**:
  ```typescript
  app.config.errorHandler = (err, instance, info) => {
    Sentry.captureException(err, { extra: { component: instance?.$options.name, info } });
  };
  ```

---

### 31. Performance Benchmarks: Vue 3 vs. Svelte 5 vs. React 19.
**In Simple Words:**
- **Vue 3**: Hybrid model. Compile-time template analysis (Patch Flags) makes Virtual DOM diffing fast. Lowest memory allocation among VDOM engines.
- **Svelte 5**: No Virtual DOM. Compiler generates surgical DOM updates.
- **React 19**: Full VDOM diffing with Fiber concurrency. Relies on React Compiler for automatic memoization.

---

### 32. Testing Vue 3 Components with Vitest and `@vue/test-utils`.
**In Simple Words:**
```typescript
import { mount } from '@vue/test-utils';
import Counter from './Counter.vue';

test('increments count on button click', async () => {
  const wrapper = mount(Counter, { props: { initial: 5 } });
  await wrapper.find('button').trigger('click');
  expect(wrapper.text()).toContain('6');
});
```

---

### 33. TypeScript Generics in `<script setup lang="ts">`.
**In Simple Words:**
Generic components (e.g. a reusable `<DataTable<T>>`):
```vue
<script setup lang="ts" generic="T extends { id: string }">
defineProps<{
  items: T[];
  selected: T;
}>();
</script>
```

---

### 34. Microfrontends with Vue 3.
**In Simple Words:**
Package Vue 3 components as standard Web Components using `defineCustomElement()`:
```typescript
import { defineCustomElement } from 'vue';
import WidgetSFC from './Widget.vue';

const CustomWidget = defineCustomElement(WidgetSFC);
customElements.define('my-widget', CustomWidget);
```
Host applications (React, Angular, or plain HTML) can consume the widget without knowing it was built with Vue!

---

### 35. The 10 Principles of High-Performance Enterprise Vue 3 Architecture.
**In Simple Words:**
1. **Standardize on `<script setup>` and Composition API**.
2. **Use `shallowRef` for large read-only datasets**.
3. **Leverage `v-memo` in long list renders**.
4. **Prefer Pinia Setup Stores over Options Stores**.
5. **Always provide unique `:key` attributes on `v-for`**.
6. **Keep template logic minimal; compute complex values in `computed()`**.
7. **Clean up all event listeners and timers in `onUnmounted`**.
8. **Lazy-load routes and heavy components with `defineAsyncComponent`**.
9. **Enforce TypeScript strict mode across all props and emits**.
10. **Use `<Teleport>` for modals to preserve semantic layering**.

