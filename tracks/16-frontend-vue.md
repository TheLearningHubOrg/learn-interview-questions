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


---

### 36. Vue 3 `toRef` vs `toRefs` vs `toValue`: Deep Dive into Reactivity Utilities.

**In Simple Words:**
- **`toRef`**: Creates a ref tracking a single property from a reactive object or converts a getter/value into a ref.
- **`toRefs`**: Converts all properties of a reactive object into individual refs, preserving reactivity when destructuring.
- **`toValue`** (Vue 3.3+): Normalizes values, refs, or getter functions to raw values, simplifying composable parameter handling.

```typescript
import { reactive, toRef, toRefs, toValue, MaybeRefOrGetter } from 'vue';

const state = reactive({ count: 0, title: 'Vue 3' });

// 1. toRef for a single property
const countRef = toRef(state, 'count');
countRef.value++; // state.count is now 1

// 2. toRefs for safe destructuring
const { count, title } = toRefs(state);

// 3. toValue in composables (Vue 3.3+)
function useDoubler(input: MaybeRefOrGetter<number>) {
  // toValue unwraps refs OR executes getter functions transparently
  return computed(() => toValue(input) * 2);
}
```

---

### 37. Custom Directives in Vue 3: Lifecycle Hooks and Practical Implementations.

**In Simple Words:**
Custom Directives allow direct low-level DOM manipulations on elements. In Vue 3, directive hooks mirror component lifecycles (`created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeUnmount`, `unmounted`).

```typescript
// v-click-outside directive implementation
import { Directive } from 'vue';

export const vClickOutside: Directive = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event); // Invoke passed callback
      }
    };
    document.addEventListener('click', el._clickOutsideHandler);
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler);
  }
};

// Usage in template:
// <div v-click-outside="closeDropdown">...</div>
```

---

### 38. Vue 3 Reactivity Caveats: Loss of Reactivity During Destructuring and How to Preserve It.

**In Simple Words:**
Destructuring properties from a `reactive()` object strips their reactive link because JavaScript passes primitive values (`number`, `string`, `boolean`) by value, not by reference.

- **The Problem**: Destructuring `const { count } = reactive({ count: 0 })` creates an isolated primitive local variable that never updates when the store changes.
- **The Solution**: Use `toRefs()` to wrap each key in a getter/setter ref object before destructuring.

```typescript
import { reactive, toRefs } from 'vue';

const userStore = reactive({ username: 'Alex', karma: 120 });

// ❌ Anti-pattern: Reactivity lost!
const { username } = userStore;

// ✅ Optimal Pattern: Reactivity preserved!
const { username: liveUsername, karma } = toRefs(userStore);
```

---

### 39. `v-model` Modifiers in Vue 3: Built-in vs Custom Modifier Implementation.

**In Simple Words:**
`v-model` modifiers adjust how user input is bound to component state.
- **Built-in Modifiers**: `.lazy` (syncs on `change` event instead of `input`), `.number` (typecasts input string to number via `parseFloat`), `.trim` (strips leading/trailing whitespace).
- **Custom Modifiers**: Accessed via `defineProps<{ modelModifiers?: { capitalize?: boolean } }>()` in child components.

```vue
<!-- ChildComponent.vue with custom .capitalize modifier -->
<script setup lang="ts">
const [model, modifiers] = defineModel({
  set(val: string) {
    if (modifiers.capitalize) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
    return val;
  }
});
</script>

<template>
  <input v-model="model" />
</template>
```

---

### 40. Vue 3 `defineModel` Macro (Vue 3.4+): Two-Way State Binding.

**In Simple Words:**
`defineModel` eliminates boilerplate prop/emit pairings for `v-model`. Previously, two-way binding required declaring `defineProps(['modelValue'])` and `defineEmits(['update:modelValue'])`. With `defineModel`, the compiler automatically handles the prop declaration and event emission as a synchronous ref.

```vue
<!-- Child.vue with defineModel (Vue 3.4+) -->
<script setup lang="ts">
// Declares 'modelValue' prop and 'update:modelValue' emit automatically
const count = defineModel<number>({ default: 0 });

// Multiple models are supported with custom names:
const title = defineModel<string>('title', { required: true });
</script>

<template>
  <button @click="count++">Count is {{ count }}</button>
  <input v-model="title" />
</template>
```

---

### 41. Vue 3 Slots Deep Dive: Default, Named, Scoped Slots, and Dynamic Slot Names.

**In Simple Words:**
- **Default Slot**: Injects content without a name (`<slot />`).
- **Named Slots**: Target specific outlets (`<slot name="header" />`) using `<template #header>`.
- **Scoped Slots**: Pass data from child up to parent template (`<slot :item="item" />`), allowing parents to customize render logic while children control data loops.

```vue
<!-- Child: VirtualList.vue with Scoped Slot -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot name="row" :item="item" :index="item.id">
        <!-- Default fallback content -->
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>

<!-- Parent Component Usage -->
<VirtualList :items="products">
  <template #row="{ item, index }">
    <span class="font-bold">#{{ index }}</span>: {{ item.name }} (${{ item.price }})
  </template>
</VirtualList>
```

---

### 42. `provide` / `inject` vs Pinia: Patterns for Hierarchical Component Trees.

**In Simple Words:**
- **`provide` / `inject`**: Dependency injection across parent-to-deep-child ancestor trees. Best for reusable component libraries (e.g. `Tabs` providing state to `TabPanel`) without coupling to global state.
- **Pinia**: Global application state with devtools time-travel, plugins, actions, and cross-route persistence.

```typescript
// InjectionKey pattern for type-safe DI in TypeScript
import { provide, inject, InjectionKey, Ref, ref } from 'vue';

interface ThemeContext {
  isDark: Ref<boolean>;
  toggleTheme: () => void;
}

export const ThemeKey: InjectionKey<ThemeContext> = Symbol('ThemeContext');

// In Parent / Provider:
const isDark = ref(true);
provide(ThemeKey, {
  isDark,
  toggleTheme: () => { isDark.value = !isDark.value; }
});

// In Deep Child:
const theme = inject(ThemeKey); // Type is inferred as ThemeContext | undefined
```

---

### 43. Vue 3 Error Handling Architecture: `onErrorCaptured` vs `app.config.errorHandler`.

**In Simple Words:**
- **`onErrorCaptured`**: Component-level hook that intercepts errors bubbling up from descendant components. Returning `false` stops error propagation to the global handler, functioning like a React Error Boundary.
- **`app.config.errorHandler`**: Global catch-all handler for reporting unhandled errors to observability systems (Sentry, Datadog).

```typescript
// main.ts: Global Sentry integration
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Global Error]', { err, info });
  Sentry.captureException(err, { extra: { lifecycleHook: info } });
};

// ErrorBoundary.vue: Reusable Component Error Boundary
import { onErrorCaptured, ref } from 'vue';

const error = ref<Error | null>(null);

onErrorCaptured((err, instance, info) => {
  error.value = err as Error;
  return false; // Stop error from bubbling to global handler
});
```

---

### 44. Dynamic and Async Components in Vue 3: `<component :is="...">` and `defineAsyncComponent`.

**In Simple Words:**
- **Dynamic Components (`<component :is="view">`)**: Dynamically swaps active components based on reactive state or tabs.
- **Async Components (`defineAsyncComponent`)**: Splits large components into separate lazy bundles loaded on demand, with built-in loading and error fallback states.

```typescript
import { defineAsyncComponent, shallowRef } from 'vue';

const AsyncChart = defineAsyncComponent({
  loader: () => import('./HeavyAnalyticsChart.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorFallback,
  delay: 200,      // Display loading component after 200ms delay
  timeout: 10000,  // Timeout error triggered after 10s
});

// Using shallowRef to store component definitions prevents unnecessary deep reactivity
const currentTab = shallowRef(AsyncChart);
```

---

### 45. Vue 3 `<Teleport>`: Escaping Stacking Contexts for Modals and Popovers.

**In Simple Words:**
`<Teleport>` renders a component's template DOM node into a different part of the document body (e.g. `to="body"` or `to="#modal-target"`) while preserving Vue component reactivity, props, and emit hierarchies.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);
</script>

<template>
  <button @click="isOpen = true">Open Dialog</button>

  <!-- Content escapes overflow:hidden and z-index traps of parent container -->
  <Teleport to="body" :disabled="!isOpen">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl">
        <h3>Portal Modal</h3>
        <button @click="isOpen = false">Close</button>
      </div>
    </div>
  </Teleport>
</template>
```

---

### 46. Vue 3 `<Transition>` and `<TransitionGroup>`: Classes, Hooks, and FLIP Animations.

**In Simple Words:**
- **`<Transition>`**: Applies CSS enter/leave transition classes (`v-enter-from`, `v-enter-active`, `v-enter-to`, `v-leave-from`, `v-leave-active`, `v-leave-to`) to single elements or dynamic components.
- **`<TransitionGroup>`**: Animates lists of items when elements are inserted, removed, or reordered using FLIP (First, Last, Invert, Play) algorithms with the `.v-move` class.

```vue
<template>
  <!-- List animation using TransitionGroup -->
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
</template>

<style scoped>
.list-move, /* Applied to moving elements during reorder */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.list-leave-active {
  position: absolute; /* Ensures smooth reordering of remaining elements */
}
</style>
```

---

### 47. Vue 3 Compiler Internals: Block Trees, Patch Flags, Static Hoisting, and Cache Handlers.

**In Simple Words:**
Vue 3's compiler optimizes virtual DOM reconciliation through ahead-of-time (AOT) template analysis:
1. **Patch Flags**: Numbers embedded in VNodes telling the runtime exactly what needs updating (e.g. `1` for text, `2` for class, `8` for dynamic props), skipping unchanging properties.
2. **Static Hoisting**: Unchanging VNodes and props are created once outside render functions and reused across renders without garbage collection churn.
3. **Cache Handlers**: Inline event handlers (`@click="count++"`) are cached as constant functions, preventing unnecessary child re-renders.
4. **Block Trees**: Dynamic nodes are organized into flat block arrays (`dynamicChildren`), enabling diffing in $O(\text{dynamic nodes})$ instead of $O(\text{all template nodes})$.

---

### 48. Vue 3 Render Functions & JSX: When to Drop Down from Templates.

**In Simple Words:**
Render functions use the `h()` function to programmatically create Virtual DOM nodes (VNodes). While templates are declarative and optimized, render functions provide full JavaScript flexibility for highly dynamic scenarios (e.g. dynamic heading tags `h(props.tag, slots.default())` or building form schema renderers).

```typescript
import { h, defineComponent } from 'vue';

export const DynamicHeading = defineComponent({
  props: {
    level: { type: Number, required: true },
    title: { type: String, required: true }
  },
  setup(props, { slots }) {
    // Generates <h1>, <h2>, etc. dynamically without 6 v-if branches in template
    return () => h(`h${props.level}`, { class: 'heading-style' }, slots.default ? slots.default() : props.title);
  }
});
```

---

### 49. State Persistence and Plugins in Pinia.

**In Simple Words:**
Pinia plugins extend stores with cross-cutting concerns like persistence, logging, and error tracking. The `$subscribe` API listens for mutations and saves state to `localStorage` or `sessionStorage`.

```typescript
import { PiniaPluginContext } from 'pinia';

export function piniaLocalStoragePlugin({ store }: PiniaPluginContext) {
  const storageKey = `pinia_${store.$id}`;
  const savedState = localStorage.getItem(storageKey);
  if (savedState) {
    store.$patch(JSON.parse(savedState));
  }

  // Subscribe to changes and persist automatically
  store.$subscribe((mutation, state) => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  });
}

// In main.ts:
// const pinia = createPinia();
// pinia.use(piniaLocalStoragePlugin);
```

---

### 50. Vue 3 Memory Leaks: Common Pitfalls and Profiling Techniques.

**In Simple Words:**
Vue 3 automates most memory management, but common developer oversights cause detached DOM trees and memory bloat:
1. **Uncleaned Window / Document Listeners**: Adding `window.addEventListener('resize', fn)` without removing it in `onUnmounted`.
2. **Lingering Timers**: `setInterval` continuing to run after component teardown.
3. **Global Event Buses / External Subscriptions**: Subscribing to an RxJS Subject or WebSocket without unsubscribing on component unmount.
4. **Reactive Map / Set Retention**: Adding objects to global `reactive(new Map())` without pruning deleted records.
5. **Detection**: Use Chrome DevTools Memory tab -> "Heap snapshot" and filter by "Detached HTMLDivElement" to identify leaks.
