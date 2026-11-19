# Next.js App Router, React Server Components (RSC) & Server Actions Master Interview Bank (1 - 37)

> Production-grade Next.js interview questions covering App Router vs Pages Router, React Server Components (RSC), Server Actions, dynamic rendering, ISR, Turbopack, route handlers, middleware, and edge runtime.

---

### 1. What are the key features introduced in React 18?
React 18, released in March 2022, introduced several groundbreaking features focused on performance and user experience:

#### 1. **Automatic Batching**
Batch multiple state updates together (even in async code) to reduce re-renders.
```jsx
// Before React 18: Only batched in event handlers
// After React 18: Batched everywhere
setTimeout(() => {
setCount(c => c + 1);
setFlag(f => !f);
// Only 1 re-render in React 18!
}, 1000);
```

#### 2. **Concurrent Features**
- **useTransition**: Mark updates as non-urgent
- **useDeferredValue**: Defer expensive re-renders
- **Suspense on Server**: SSR with Suspense support

#### 3. **New createRoot API**
```jsx
// Old way (React 17)
ReactDOM.render(<App />, document.getElementById('root'));

// New way (React 18)
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

#### 4. **Streaming SSR with Suspense**
Stream HTML from server and hydrate components as they arrive.

#### 5. **New Hooks**
- `useId`: Generate unique IDs for accessibility
- `useSyncExternalStore`: Subscribe to external stores
- `useInsertionEffect`: For CSS-in-JS libraries

#### 6. **Strict Mode Improvements**
Double-invokes effects in development to catch bugs.

---

### 2. What are the key features introduced in React 19?
React 19 (released 2024) brings major improvements for full-stack React applications:

#### 1. **React Compiler (formerly React Forget)**
Automatic memoi

### 3. What is the use() hook in React 19?
The `use()` hook allows you to read the value of a resource (Promise or Context) during render, with Suspense integration.

#### Reading Promises
```jsx
import { use, Suspense } from 'react';

function UserProfile({ userPromise }) {
const user = use(userPromise); // Suspends until resolved

return (
  <div>
    <h1>{user.name}</h1>
    <p>{user.email}</p>
  </div>
);
}

function App() {
const userPromise = fetchUser(123);

return (
  <Suspense fallback={<div>Loading...</div>}>
    <UserProfile userPromise={userPromise} />
  </Suspense>
);
}
```

#### Reading Context
```jsx
import { use } from 'react';
import { ThemeContext } from './context';

function Button() {
const theme = use(ThemeContext);
return <button className={theme}>Click me</button>;
}
```

#### Key Differences from Other Hooks

| Feature | use() | useContext() | useState() |
|---------|-------|--------------|------------|
| Can be called conditionally | ✅ Yes | ❌ No | ❌ No |
| Can be called in loops | ✅ Yes | ❌ No | ❌ No |
| Suspends for Promises | ✅ Yes | ❌ N/A | ❌ N/A |
| Reads Context | ✅ Yes | ✅ Yes | ❌ N/A |

#### Conditional Usage (Unique!)
```jsx
function Component({ showUser, userPromise }) {
// ✅ This is allowed with use()!
const user = showUser ? use(userPromise) : null;

return user ? <div>{user.name}</div> : <div>No user</div>;
}
```

---

### 4. What are Server Actions in React 19?
**Server Actions** allow you to call server-side functions directly from client components without writing API endpoints.

#### Basic Server Action
```jsx
// app/actions.js
'use server'

export async function createPost(formData) {
const title = formData.get('title');
const content = formData.get('content');

const post = await db.posts.create({
  title,
  content,
  userId: await getCurrentUser()
});

revalidatePath('/posts');
redirect(`/posts/${post.id}`);
}
```

#### Using in Forms
```jsx
// app/new-post.jsx
import { createPost } from './actions';

export default function NewPost() {
return (
  <form action={createPost}>
    <input name="title" required />
    <textarea name="content" required />
    <button type="submit">Create Post</button>
  </form>
);
}
```

#### With useFormState for Loading States
```jsx
'use client'
import { useFormState } from 'react-dom';
import { createPost } from './actions';

export default function NewPost() {
const [state, formAction] = useFormState(createPost, { message: '' });

return (
  <form action={formAction}>
    <input name="title" required />
    <textarea name="content" required />
    <button type="submit">Create Post</button>
    {state.message && <p>{state.message}</p>}
  </form>
);
}
```

#### Progressive Enhancement
Server Actions work even if JavaScript is disabled!
```jsx
// This form works without JavaScript
<form action={serverAction}>
<input name="email" type="email" />
<button>Subscribe</button>
</form>
```

#### Security
- Automatically CSRF protected
- Always run on server (never exposed to client)
- Can use server-only packages safely

---

### 5. What are useFormState and useFormStatus hooks?
These hooks simplify form handling with Server Actions in React 19.

#### useFormState
Manages form state and handles server responses:
```jsx
'use client'
import { useFormState } from 'react-dom';
import { loginAction } from './actions';

export default function LoginForm() {
const [state, formAction] = useFormState(loginAction, {
  errors: {},
  message: ''
});

return (
  <form action={formAction}>
    <input name="email" type="email" />
    {state.errors.email && <p>{state.errors.email}</p>}
    
    <input name="password" type="password" />
    {state.errors.password && <p>{state.errors.password}</p>}
    
    <button type="submit">Login</button>
    {state.message && <p>{state.message}</p>}
  </form>
);
}
```

#### useFormStatus
Get the pending state of parent form:
```jsx
'use client'
import { useFormStatus } from 'react-dom';

function SubmitButton() {
const { pending, data, method, action } = useFormStatus();

return (
  <button type="submit" disabled={pending}>
    {pending ? 'Submitting...' : 'Submit'}
  </button>
);
}

// Must be used in a child component of <form>
export default function MyForm() {
return (
  <form action={serverAction}>
    <input name="email" />
    <SubmitButton />
  </form>
);
}
```

#### Combining Both
```jsx
'use client'
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
const { pending } = useFormStatus();
return (
  <button disabled={pending}>
    {pending ? '⏳ Saving...' : '💾 Save'}
  </button>
);
}

export default function EditProfile() {
const [state, formAction] = useFormState(updateProfile, null);

return (
  <form action={formAction}>
    <input name="name" defaultValue={user.name} />
    <input name="bio" defaultValue={user.bio} />
    <SubmitButton />
    {state?.success && <p>✅ Profile updated!</p>}
    {state?.error && <p>❌ {state.error}</p>}
  </form>
);
}
```

#### Key Points
- `useFormState`: For managing server responses and errors
- `useFormStatus`: For UI feedback during submission
- `useFormStatus` must be used in a child component of the form
- Works seamlessly with Server Actions

---

### 6. What is the useOptimistic hook?
`useOptimistic` enables optimistic UI updates - showing changes immediately before server confirmation.

#### Basic Usage
```jsx
import { useOptimistic } from 'react';

function TodoList({ todos, addTodo }) {
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (currentTodos, newTodo) => [...currentTodos, { ...newTodo, pending: true }]
);

async function handleSubmit(formData) {
  const title = formData.get('title');
  
  // Immediately show optimistic update
  addOptimisticTodo({ id: Date.now(), title });
  
  // Send to server
  await addTodo(title);
  // Component re-renders with real data when complete
}

return (
  <>
    <form action={handleSubmit}>
      <input name="title" />
      <button>Add</button>
    </form>
    
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id} style={{ opacity: todo.pending ? 0.5 : 1 }}>
          {todo.title}
          {todo.pending && ' ⏳'}
        </li>
      ))}
    </ul>
  </>
);
}
```

#### With Server Actions
```jsx
'use client'
import { useOptimistic } from 'react';
import { likePost } from './actions';

export default function Post({ post, likes }) {
const [optimisticLikes, addOptimisticLike] = useOptimistic(
  likes,
  (currentLikes, amount) => currentLikes + amount
);

async function handleLike() {
  addOptimisticLike(1); // Immediate UI update
  await likePost(post.id); // Server update
}

return (
  <div>
    <h2>{post.title}</h2>
    <button onClick={handleLike}>
      ❤️ {optimisticLikes} Likes
    </button>
  </div>
);
}
```

#### Complex Example with Error Handling
```jsx
function ShoppingCart({ items, removeItem }) {
const [optimisticItems, removeOptimistic] = useOptimistic(
  items,
  (current, removedId) => current.filter(item => item.id !== removedId)
);

async function handleRemove(itemId) {
  removeOptimistic(itemId); // Immediate removal from UI
  
  try {
    await removeItem(itemId);
  } catch (error) {
    // Automatic rollback on error!
    toast.error('Failed to remove item');
  }
}

return (
  <ul>
    {optimisticItems.map(item => (
      <li key={item.id}>
        {item.name}
        <button onClick={() => handleRemove(item.id)}>Remove</button>
      </li>
    ))}
  </ul>
);
}
```

#### When to Use
- ✅ Toggling likes/favorites
- ✅ Adding/removing items from lists
- ✅ Sending messages in chat
- ✅ Any action where immediate feedback improves UX
- ❌ Financial transactions (wait for confirmation)
- ❌ Critical operations requiring server validation

---

### 7. What is the React Compiler (React Forget)?
The **React Compiler** (formerly known as React Forget) automatically optimi

### 8. What is Streaming SSR and how does React 18+ improve it?
**Streaming SSR** sends HTML to the browser in chunks as it's generated, rather than waiting for the entire page. React 18+ dramatically improves this with Suspense integration.

#### Traditional SSR (Pre-React 18)
```
Server: Wait for ALL data → Generate ALL HTML → Send to client
Client: Receive HTML → Download ALL JS → Hydrate ALL components
Problem: Slow components block entire page!
```

#### Streaming SSR (React 18+)
```
Server: Send HTML as it's ready, wrap slow parts in <Suspense>
Client: Render immediately, hydrate progressively
Benefit: User sees content faster!
```

#### Basic Example
```jsx
import { Suspense } from 'react';

export default function Page() {
return (
  <html>
    <body>
      {/* Sent immediately */}
      <header>
        <h1>My App</h1>
      </header>

      {/* Sent immediately with fallback */}
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments /> {/* Streamed when ready */}
      </Suspense>

      {/* Also streamed separately */}
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <Recommendations /> {/* Streamed when ready */}
      </Suspense>

      <footer>© 2026</footer>
    </body>
  </html>
);
}
```

#### Server Component with Data Fetching
```jsx
// This is a Server Component (async!)
async function Comments() {
const comments = await db.comments.findMany();

return (
  <ul>
    {comments.map(comment => (
      <li key={comment.id}>{comment.text}</li>
    ))}
  </ul>
);
}
```

#### How It Works
1. Server starts sending HTML immediately
2. When it hits `<Suspense>`, it sends the fallback
3. Continues streaming rest of the page
4. When data is ready, sends the actual component
5. Client replaces fallback with real content
6. Hydration happens independently per component

#### Selective Hydration
```jsx
function App() {
return (
  <div>
    <header>Header</header> {/* Hydrates first */}
    
    <Suspense fallback={<Spinner />}>
      <HeavyComponent /> {/* Hydrates when user interacts */}
    </Suspense>
    
    <Suspense fallback={<Spinner />}>
      <Comments /> {/* Hydrates independently */}
    </Suspense>
  </div>
);
}
```

#### Benefits
- **Faster TTFB** (Time to First Byte): User sees content sooner
- **Better UX**: Progressive loading instead of blank screen
- **Prioriti

### 9. What is renderToPipeableStream and how is it different from renderToString?
`renderToPipeableStream` is the React 18+ Node.js streaming SSR API from `react-dom/server`. It streams HTML in chunks, so users can see content earlier and React can coordinate Suspense boundaries during server rendering.

`renderToString` is the older API that generates the entire HTML string first and sends it only after rendering is fully complete.

#### Key Differences

| Aspect | `renderToString` | `renderToPipeableStream` |
| --- | --- | --- |
| Rendering model | All-at-once | Streaming/chunked |
| Suspense on server | Limited fallback behavior | First-class Suspense streaming |
| Time to first byte | Usually slower for large pages | Faster, can flush shell early |
| UX for slow data | Entire page waits | Progressive reveal with fallbacks |
| Best for | Small/simple SSR pages | Modern SSR apps with async data |

#### `renderToString` example

```javascript
import express from "express";
import { renderToString } from "react-dom/server";
import App from "./App";

const app = express();

app.get("/", (req, res) => {
const html = renderToString(<App />);
res.send(`<!doctype html><html><body><div id="root">${html}</div></body></html>`);
});
```

#### `renderToPipeableStream` example

```javascript
import express from "express";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";

const app = express();

app.get("/", (req, res) => {
const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    res.setHeader("Content-Type", "text/html");
    res.write("<!doctype html><html><body><div id=\"root\">");
    pipe(res);
  },
  onAllReady() {
    res.end("</div></body></html>");
  },
  onError(error) {
    console.error(error);
  },
});
});
```

In practice, prefer `renderToPipeableStream` for React 18+ SSR because it improves perceived performance and works naturally with Suspense-driven progressive loading.

---

### 10. What is the difference between HOCs and Hooks?
Both **Higher-Order Components (HOCs)** and **Hooks** let you reuse logic across components, but they solve that problem in very different ways.

| Aspect | Higher-Order Components (HOCs) | Hooks |
| --- | --- | --- |
| Pattern | A function that takes a component and returns a new, enhanced component | A function called directly inside a function component |
| Component tree | Adds an extra wrapper component, which can lead to "wrapper hell" with multiple HOCs | Adds no extra components to the tree |
| Sharing logic | Injects props/behavior into the wrapped component | Shares stateful logic directly via custom hooks (`useX`) |
| Prop handling | Can cause prop name collisions when composing multiple HOCs | No prop collisions since state lives inside the component itself |
| Debugging | Harder to trace which HOC injected which prop (often needs `displayName`) | Easier to trace; shows up as plain hook calls in React DevTools |
| Usage | Works with both class and function components | Can only be used in function components (or other hooks) |

#### Example: sharing "toggle" logic

**Using a HOC:**

```jsx
function withToggle(WrappedComponent) {
return function Enhanced(props) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((prev) => !prev);
  return <WrappedComponent {...props} on={on} toggle={toggle} />;
};
}

const Modal = withToggle(BaseModal);
```

**Using a custom Hook:**

```jsx
function useToggle(initial = false) {
const [on, setOn] = useState(initial);
const toggle = () => setOn((prev) => !prev);
return [on, toggle];
}

function Modal() {
const [on, toggle] = useToggle();
// ...
}
```

In short, Hooks were introduced to solve the same logic-reuse problem as HOCs (and render props), but without adding extra components to the render tree—avoiding wrapper hell and making the code easier to read, type, and debug. See also [Do Hooks replace render props and higher-order components?](#do-hooks-replace-render-props-and-higher-order-components).

---

### 11. Does React.memo prevent Context consumers from re-rendering?
**No.** `React.memo` only performs a shallow comparison of a component's **props** — it has no visibility into context. If a component reads a value via `useContext`/`Context.Consumer`, that component re-renders whenever the **context value** changes, regardless of whether it's wrapped in `React.memo` and regardless of whether its own props changed.

```jsx
const CountContext = React.createContext();

// Wrapping with React.memo does NOT help here
const Display = React.memo(function Display() {
const count = useContext(CountContext);
return <div>{count}</div>;
});

function App() {
const [count, setCount] = useState(0);
return (
  <CountContext.Provider value={count}>
    <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    <Display />
  </CountContext.Provider>
);
}
```

Every time `count` changes, `Display` re-renders even though it takes no props and is memoi

### 12. How would you create a reusable Context?
A **reusable Context** bundles the `createContext` call, its `Provider` (with local state/logic), and a custom hook to consume it into a single module. This hides the raw `Context` object from consumers, provides a clear API, and lets you validate that the hook is used within its provider.

```jsx
// ThemeContext.js
import { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
const [theme, setTheme] = useState("light");

const toggleTheme = () =>
  setTheme((prev) => (prev === "light" ? "dark" : "light"));

// Memoi

### 13. Why is Redux Toolkit recommended over Redux?
**Redux Toolkit (RTK)** is the official, opinionated way to write Redux logic today. It's built on top of plain Redux and re-exports its APIs, but wraps them with utilities that remove most of the boilerplate and footguns of hand-written Redux.

| Problem with plain Redux | How Redux Toolkit fixes it |
| --- | --- |
| Verbose store setup (`combineReducers`, manual middleware wiring) | `configureStore()` sets up the store, `redux-thunk`, and Redux DevTools automatically |
| Hand-written action types/creators and switch-based reducers | `createSlice()` generates action types, action creators, and a reducer from a single object |
| Reducers must return new state immutably (easy to mutate by mistake) | Uses **Immer** internally, so you can write "mutating" logic that's safely converted to immutable updates |
| Async logic needs extra middleware setup (thunk/saga boilerplate) | `createAsyncThunk()` standardi

### 14. What is the difference between client state and server state?
**Client state** is data that lives entirely in the browser and is owned by the UI — it doesn't need to be synchroni

### 15. How do you prevent unnecessary Redux re-renders?
By default, `useSelector` re-renders a component whenever the **selected value's reference** changes between renders (it uses strict `===` comparison). Most unnecessary re-renders come from selectors that return a *new* object/array/function on every call, so React-Redux thinks the data changed even though it didn't. Ways to prevent this:

1.  **Select the smallest piece of state you need** instead of the whole slice:

```javascript
  // BAD: re-renders whenever ANY field in `user` changes
  const user = useSelector((state) => state.user);

  // GOOD: only re-renders when `name` changes
  const name = useSelector((state) => state.user.name);
```

2.  **Memoi

### 16. What is createSelector?
`createSelector` (from **Reselect**, which Redux Toolkit re-exports) creates **memoi

### 17. What is normalized Redux state?
**Normali

### 18. Why is normalized state important for performance?
1.  **O(1) lookups by ID** instead of scanning/`find()`-ing through an array every time a component needs one item.
2.  **Updates are locali

### 19. What is Redux middleware?
**Middleware** provides a way to extend Redux with custom logic that runs **between dispatching an action and the moment it reaches the reducer**. It's the standard extension point for side effects (logging, crash reporting, async calls, analytics) since reducers themselves must stay pure and synchronous.

```javascript
import { configureStore } from "@reduxjs/toolkit";

const logger = (store) => (next) => (action) => {
console.log("dispatching", action);
const result = next(action);
console.log("next state", store.getState());
return result;
};

const store = configureStore({
reducer: rootReducer,
middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
```

Common middleware includes `redux-thunk` (dispatch functions for async logic), `redux-saga` (generator-based side effects), `redux-logger` (action/state logging), and RTK's built-in seriali

### 20. What is the Redux middleware signature?
Middleware is written as **three nested (curried) functions**:

```javascript
const exampleMiddleware = (store) => (next) => (action) => {
// store  => { getState, dispatch }
// next   => calls the next middleware in the chain (or the reducer if last)
// action => the action currently being dispatched
return next(action);
};
```

- `store` gives access to `getState()` and `dispatch()`.
- `next` passes the action along to the next middleware (or the root reducer, if this is the last middleware).
- `action` is the action object being processed.

Middleware **must** call `next(action)` (or `dispatch(...)` for a different action) to keep the chain moving — forgetting to call `next` silently swallows every action.

---

### 21. What happens when you dispatch an action?
1.  `store.dispatch(action)` is called with a plain action object (`{ type, payload }`).
2.  The action passes through the **middleware chain** in order (e.g., logger → thunk → your custom middleware); async/thunk middleware may intercept it here (e.g., a thunk function is invoked instead of being forwarded, or a Promise/generator is handled) or asynchronous side-effects can trigger further dispatches later.
3.  Once every middleware calls `next(action)`, the action reaches the **root reducer**.
4.  The root reducer (usually built with `combineReducers` or RTK's `configureStore`) forwards the action to **every slice reducer**, each returning either its unchanged state or a new state object.
5.  The store **replaces its internal state tree** with the combined result and marks the update complete.
6.  The store notifies all **subscribers** (React-Redux's `Provider`/`useSelector` internals) that state changed.
7.  Each connected component's selector is **re-run and compared** (via `===` or a custom equality function) against its previous result; components only re-render if their selected slice actually changed.

#### Practical Code Example

```text
// Action Dispatch Cycle:
// dispatch(action) -> Middlewares intercept -> Reducer calculates nextState ->
// Store updates -> Subscribed selectors notify components -> Components re-render
```

---

### 22. How would you structure Redux in a large application?
The recommended approach (and what Redux Toolkit is designed around) is a **"feature folder" / "ducks"** structure rather than splitting by technical type (`actions/`, `reducers/`, `constants/`):

```
src/
app/
  store.js            # configureStore() + root reducer wiring
features/
  posts/
    postsSlice.js     # createSlice: reducer + actions + thunks
    postsSelectors.js # createSelector-based selectors
    PostList.jsx       # components using useSelector/useDispatch
  users/
    usersSlice.js
    usersSelectors.js
```

Guidelines:

1.  **Colocate** a feature's slice, selectors, thunks, and components in one folder instead of scattering related code across parallel `actions/reducers/constants` folders.
2.  **One slice per domain concept** (posts, users, cart), created with `createSlice`, combined once in `store.js`.
3.  **Keep components decoupled from the store shape** by reading data only through selectors, never `state.posts.entities` directly in a component.
4.  **Normali

### 23. How do you handle cross-slice communication?
Since each `createSlice` only manages its own piece of state, a few patterns let one slice react to actions or data from another:

1.  **`extraReducers`**: listen for another slice's action type without importing its reducer.

```javascript
  const notificationsSlice = createSlice({
    name: "notifications",
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(postsSlice.actions.postAdded, (state, action) => {
        state.push({ message: `New post: ${action.payload.title}` });
      });
    },
  });
```

2.  **Thunks that touch multiple slices**: a single `createAsyncThunk`/thunk can `dispatch` actions belonging to several slices, or read `getState()` to combine data before deciding what to dispatch.
3.  **Selectors that combine slices**: a `createSelector` can take input selectors from different slices (e.g., posts + users) and join them together for the UI, without the slices knowing about each other.
4.  **Listener middleware / sagas**: `createListenerMiddleware` (RTK) or `redux-saga`'s `takeEvery` can watch for an action dispatched by one slice and, in response, dispatch actions belonging to a completely different slice.

In all cases, slices stay decoupled — they communicate only through dispatched actions or shared selectors, never by directly importing and mutating each other's reducer state.

---

### 24. What are Redux serializable values?
Redux (and Redux Toolkit's default middleware) expects **state and actions to contain only plain, seriali

### 25. How do you handle race conditions in Redux?
A race condition happens when multiple async requests are in flight and they **resolve out of order** — e.g., a user types quickly in a search box, an older request for "re" resolves *after* the newer request for "react", overwriting the correct results with stale ones.

1.  **`createAsyncThunk` + request tracking**: store the latest `requestId` and ignore results from stale requests.

```javascript
  const fetchResults = createAsyncThunk("search/fetch", async (query) => {
    const res = await fetch(`/api/search?q=${query}`);
    return res.json();
  });

  builder.addCase(fetchResults.fulfilled, (state, action) => {
    // Only apply the result if it belongs to the most recent request
    if (action.meta.requestId === state.currentRequestId) {
      state.results = action.payload;
    }
  });
```

2.  **Abort stale requests** using `AbortController`, which `createAsyncThunk` supports via `thunkAPI.signal` — cancel the previous request when a new one starts.
3.  **Debounce/throttle the trigger** (e.g., debounce keystrokes) so fewer overlapping requests are made in the first place.
4.  **Use RTK Query**, which automatically de-duplicates in-flight requests, cancels/ignores stale ones, and keeps the cache consistent without manual bookkeeping.

---

### 26. How do you persist Redux state?
**`redux-persist`** is the standard library for persisting and rehydrating a Redux store across page reloads/app restarts. It wraps your root reducer so selected slices are automatically saved to storage (e.g., `localStorage` on web, `AsyncStorage` on React Native) and restored on startup.

```javascript
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

const rootReducer = combineReducers({ user: userReducer, cart: cartReducer });

const persistConfig = {
key: "root",
storage,
whitelist: ["cart"], // only persist the `cart` slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
reducer: persistedReducer,
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({ seriali

### 27. How do you debug a Redux performance problem?
A practical, step-by-step approach:

1.  **Confirm it's actually Redux**: use the React DevTools **Profiler** to see which components re-render and how often, before assuming Redux is the culprit.
2.  **Inspect actions/state with Redux DevTools**: check how frequently actions are dispatched and how large/deeply nested the state diffs are on each action.
3.  **Look for unstable selector results**: a selector that returns a new object/array/function on every call (e.g., `state => state.items.filter(...)`) breaks `useSelector`'s reference equality check and forces re-renders even when nothing meaningful changed. Wrap it in `createSelector` (Q335).
4.  **Check for over-broad `useSelector` calls**: selecting an entire slice (`state.user`) instead of the specific field needed (`state.user.name`) causes re-renders on unrelated field changes (Q334).
5.  **Verify normali

### 28. What should be stored in Redux vs derived with selectors?
A common mistake is storing **computed/derived values** in Redux state itself, which then has to be kept in sync manually every time the source data changes. The rule of thumb: **store the minimal raw data, and compute everything else with selectors.**

| Store in Redux (source of truth) | Derive with selectors (computed) |
| --- | --- |
| Raw entities fetched from the server (`items`, `users`) | Filtered/sorted/paginated views of that list |
| Simple flags representing real state (`isLoggedIn`, `selectedId`) | Aggregates like totals, counts, averages |
| IDs of selected/active items | The full object looked up by that ID |
| Form field values | Validation results / "is form valid" flags |

```javascript
// BAD: `total` is derived data stored redundantly in state
// Now every reducer that touches `items` must also recompute `total`
{ items: [...], total: 42 }

// GOOD: store only `items`; compute `total` with a memoi

### 29. Would you put all API data into Redux?
**No** — not by default. Server data (see [client state vs server state](#what-is-the-difference-between-client-state-and-server-state)) has different needs than plain client state: caching, background refetching, deduplication of in-flight requests, invalidation, pagination, and loading/error tracking. Hand-rolling all of that inside Redux slices reinvents a data-fetching layer.

Guidance:

- **Use RTK Query (or React Query/SWR) for server data** — these libraries already integrate with the Redux store (RTK Query lives inside your Redux store) and handle caching/invalidation/refetching for you.
- **Use plain Redux slices for genuine client state**: UI state, auth/session flags, user preferences, multi-step form state, feature toggles — anything that isn't just a mirror of server data.
- **Avoid duplicating server data into a separate hand-written slice** "just in case" — it creates two sources of truth that can drift out of sync (e.g., a `users` slice updated manually alongside an RTK Query cache for the same endpoint).
- It's fine to **combine both**: e.g., store the *currently selected* item's ID in a normal slice, while the actual item data comes from an RTK Query/React Query cache keyed by that ID.

In short, Redux (or any store) is best reserved for state your UI truly owns; let a dedicated data-fetching layer own anything that mirrors the server.

#### Practical Code Example

```text
// Would you put all API data into Redux?
// NO. Modern best practice separates Server Cache (TanStack Query / RTK Query) from Client UI State.
```

---

### 30. What is the difference between BrowserRouter, HashRouter, and MemoryRouter?
All three are drop-in `<Router>` implementations from `react-router-dom` (see [What are the `<Router>` components of React Router v6?](#what-are-the-router-components-of-react-router-v6)) that wrap a different `history` implementation, so your app's routes work the same way — only how the URL is stored/read differs.

| Aspect | `<BrowserRouter>` | `<HashRouter>` | `<MemoryRouter>` |
| --- | --- | --- | --- |
| URL format | Clean URLs using the HTML5 History API (`/about`) | Uses a URL hash fragment (`/#/about`) | No URL at all — history is kept purely in memory |
| Where history lives | Browser's `window.history` | Browser's `window.location.hash` | An in-memory array/stack, not tied to the browser |
| Server requirement | Server must be configured to return `index.html` for every route (fallback routing), otherwise a hard refresh on `/about` 404s | None — the part after `#` is never sent to the server, so any static server works with

### 31. What are dynamic routes and what are route parameters?
A **dynamic route** is a route path that contains a placeholder segment (a *route parameter*) instead of a fixed, hard-coded value, so a single route definition can match many different URLs. **Route parameters** are the named placeholder segments (prefixed with `:` in React Router) whose actual values are extracted from the matched URL at runtime.

```jsx
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

function UserProfile() {
// useParams() returns an object of all dynamic segments matched for this route
const { userId } = useParams();
return <div>Profile for user: {userId}</div>;
}

function App() {
return (
  <BrowserRouter>
    <Routes>
      {/* :userId is a route parameter — matches /users/1, /users/abc, etc. */}
      <Route path="/users/:userId" element={<UserProfile />} />
    </Routes>
  </BrowserRouter>
);
}
```

A route can also define **multiple parameters** and an **optional catch-all (splat) parameter**:

```jsx
// Multiple params: /posts/2024/react-hooks-guide
<Route path="/posts/:year/:slug" element={<Post />} />

// Optional segment (v6.4+): matches /shop and /shop/electronics
<Route path="/shop/:category?" element={<Shop />} />

// Splat/wildcard param: matches any depth, e.g. /docs/a/b/c
<Route path="/docs/*" element={<Docs />} />
```

```jsx
function Post() {
const { year, slug } = useParams();
// year -> "2024", slug -> "react-hooks-guide"
return <h1>{slug} ({year})</h1>;
}
```

Key points:

- Route params are always returned as **strings** by `useParams()` — convert them (e.g., `Number(id)`) if you need a number.
- Static routes (`/about`) are matched exactly; dynamic routes (`/users/:userId`) match a whole family of URLs and are essential for detail/edit pages, pagination, category filters, etc.
- Route params are different from **query/search params** (`?sort=asc`), which are read with `useSearchParams()` instead and are meant for optional, non-hierarchical data like filters or sorting.
- Because dynamic segments can match unexpected values, always validate/guard params (e.g., check the fetched resource exists) rather than assuming the value is always well-formed.

---

### 32. How do you navigate programmatically in React Router?
In React Router v6+, programmatic navigation (redirecting from code rather than a user clicking a link) is done with the **`useNavigate`** hook, which replaces the old `history.push()`/`this.props.history.push()` approach from v4/v5 (see [How do you programmatically navigate using React Router v4?](#how-do-you-programmatically-navigate-using-react-router-v4)).

```jsx
import { useNavigate } from "react-router-dom";

function LoginForm() {
const navigate = useNavigate();

async function handleSubmit(e) {
  e.preventDefault();
  await login();
  navigate("/dashboard");        // push a new entry (like clicking a link)
  // navigate("/dashboard", { replace: true }); // replace current entry (no back button to login)
  // navigate(-1);                 // go back, like history.back()
  // navigate("/users/42", { state: { from: "login" } }); // pass state to the next route
}

return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

Key points:

- `navigate(to)` pushes a new history entry; `navigate(to, { replace: true })` replaces the current one (useful after login/logout so the back button doesn't return to the old page).
- `navigate(delta)` with a number (e.g., `navigate(-1)`, `navigate(1)`) moves through history like the browser back/forward buttons.
- `useNavigate` can only be called inside components rendered under a `<Router>`; it can't be used outside React (for that, some apps keep a module-level history object created with `createBrowserRouter`/`history` package instead).
- Prefer declarative navigation (`<Link>`/`<NavLink>`) for user-initiated clicks, and reserve `useNavigate` for navigation triggered by logic — form submissions, redirects after auth, timers, etc.

---

### 33. What is the difference between Link, NavLink, and <a>?
All three render an anchor tag in the DOM, but they behave very differently when clicked:

| Aspect | `<a href>` | `<Link to>` | `<NavLink to>` |
| --- | --- | --- | --- |
| Navigation | Full page reload — browser makes a fresh request and the whole app (JS, CSS) reloads | Client-side navigation via History API — no reload, app state is preserved | Same as `Link` — client-side, no reload |
| Active styling | None built-in | None built-in | Automatically knows if it matches the current URL and exposes that via a class/style/children render function |
| Typical use | Linking to external sites/domains outside the app | Regular in-app navigation (e.g., a card linking to a detail page) | Navigation menus/tabs where you need to highlight the current section |

```jsx
import { Link, NavLink } from "react-router-dom";

// Plain in-app link — no active-state awareness
<Link to="/about">About</Link>;

// NavLink automatically applies the "active" class (or your own style function)
// when the current URL matches "/dashboard"
<NavLink
to="/dashboard"
className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
>
Dashboard
</NavLink>;

// Plain <a> — causes a full browser navigation/reload, breaks SPA behavior
<a href="/dashboard">Dashboard (avoid for in-app links)</a>;
```

Rule of thumb: use `<Link>`/`<NavLink>` for any route inside your React Router tree, and reserve a plain `<a href>` for links leaving your app (external URLs, mailto:, downloadable files) or for non-SPA full-reload cases.

---

### 34. How do you implement protected/private routes?
A protected (or private) route only renders its content when the user meets some condition (usually "is authenticated"), otherwise it redirects them elsewhere (e.g., to `/login`). In React Router v6+, the cleanest way is a small wrapper component that renders `<Outlet />` for its children or a `<Navigate>` redirect:

```jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth() {
const { user } = useAuth(); // your own auth hook/context
const location = useLocation();

if (!user) {
  // Redirect to login, remembering where the user was headed
  return <Navigate to="/login" state={{ from: location }} replace />;
}

return <Outlet />; // render the matched child route
}
```

```jsx
import { Routes, Route } from "react-router-dom";

function App() {
return (
  <Routes>
    <Route path="/login" element={<Login />} />

    {/* Every nested route below requires auth */}
    <Route element={<RequireAuth />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
  </Routes>
);
}
```

After a successful login, read `location.state?.from` (set above) and `navigate(from, { replace: true })` to send the user back to the page they originally tried to reach.

Key points:

- Wrapping with a layout route (`<Route element={<RequireAuth />}>`) that renders `<Outlet />` lets you protect many nested routes at once, instead of guarding each `element` individually.
- Use `replace` on the redirect so the protected URL isn't left in history (prevents "back button" from flashing the protected page).
- For role-based protection (e.g., admin-only), generali

### 35. How do you handle 404 / Not Found routes?
React Router matches routes top-to-bottom/most-specific-first, so a catch-all route with `path="*"` placed last will match any URL that didn't match an earlier route — this is the v6+ equivalent of the older approach in [How do you implement a default or NotFound page?](#how-to-implement-default-or-notfound-page).

```jsx
import { Routes, Route } from "react-router-dom";

function App() {
return (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/users/:userId" element={<UserProfile />} />

    {/* Catch-all — must be last; matches any unmatched path */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
}

function NotFound() {
return <h1>404 — Page Not Found</h1>;
}
```

For apps using the newer data router APIs (`createBrowserRouter`), a route-level `errorElement` handles both unmatched paths and thrown errors/loader failures for that branch:

```jsx
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
{
  path: "/",
  element: <Root />,
  errorElement: <ErrorPage />, // renders on 404s and unhandled loader/action errors
  children: [{ path: "users/:userId", element: <UserProfile />, loader: userLoader }],
},
]);
```

Key points:

- Always keep the `path="*"` route **last** — route matching order matters, and an earlier catch-all would shadow every route after it.
- Return a real **HTTP 404 status** from your server for true not-found responses when doing SSR, so search engines and monitoring tools see the correct status code (the client-only SPA route doesn't set the HTTP status by itself).
- Distinguish "route not found" (bad URL) from "resource not found" (valid route, but e.g. `/users/999` doesn't exist) — the latter is usually handled inside the page component after a failed fetch/loader, not by the router itself.

---

### 36. What are loaders, actions, and data APIs in modern React Router?
Starting with React Router v6.4, the library ships **data APIs** (`createBrowserRouter`, `loader`, `action`, `useLoaderData`, `useActionData`, `useFetcher`) that move data fetching and mutations out of components and into the route definitions themselves — conceptually similar to Next.js server components/actions, but framework-agnostic.

- **Loader**: a function attached to a route that fetches the data that route needs *before* (or in parallel with) rendering, eliminating loading-state waterfalls ("render-then-fetch").
- **Action**: a function attached to a route that handles data **mutations** (form submissions — create/update/delete), typically triggered via `<Form>` or `useFetcher()`.
- **`useLoaderData()` / `useActionData()`**: hooks that read the data returned by the matching route's `loader`/`action` inside the rendered component.

```jsx
import { createBrowserRouter, RouterProvider, useLoaderData, Form, redirect } from "react-router-dom";

// Loader: runs before the route renders, its return value is available via useLoaderData()
async function userLoader({ params }) {
const res = await fetch(`/api/users/${params.userId}`);
if (!res.ok) throw new Response("Not Found", { status: 404 });
return res.json();
}

// Action: runs when a <Form> on this route is submitted
async function updateUserAction({ request, params }) {
const formData = await request.formData();
await fetch(`/api/users/${params.userId}`, { method: "PUT", body: formData });
return redirect(`/users/${params.userId}`); // navigate after a successful mutation
}

function UserProfile() {
const user = useLoaderData(); // already-fetched data, no useEffect needed
return (
  <Form method="put">
    <input name="name" defaultValue={user.name} />
    <button type="submit">Save</button>
  </Form>
);
}

const router = createBrowserRouter([
{
  path: "/users/:userId",
  element: <UserProfile />,
  loader: userLoader,
  action: updateUserAction,
  errorElement: <ErrorPage />,
},
]);

function App() {
return <RouterProvider router={router} />;
}
```

Key points:

- Loaders run **before** the route component renders, so data is ready immediately — no `useEffect` + `isLoading` flicker for the initial fetch.
- Errors thrown inside a `loader`/`action` (including thrown `Response`s for status codes) are caught by the nearest route's `errorElement`, unifying error handling for fetch failures and render errors.
- `useFetcher()` lets you call loaders/actions **without** navigating (e.g., optimistic "like" buttons, inline edits in a list).
- This pattern requires the data-router setup (`createBrowserRouter` + `<RouterProvider>`) instead of the plain `<BrowserRouter>`/`<Routes>` components — it's opt-in, existing `<Routes>`-based apps keep working unchanged.

---

### 37. How do query parameters work?
Query (search) parameters are the `?key=value&key2=value2` portion of a URL. Unlike route params (see [What are dynamic routes and what are route parameters?](#what-are-dynamic-routes-and-what-are-route-parameters)), they aren't part of the route's `path` definition — they're read and updated with the **`useSearchParams`** hook, which mirrors the browser's `URLSearchParams` API.

```jsx
import { useSearchParams } from "react-router-dom";

function ProductList() {
// URL: /products?category=shoes&sort=price&page=2
const [searchParams, setSearchParams] = useSearchParams();

const category = searchParams.get("category"); // "shoes"
const sort = searchParams.get("sort");           // "price"
const page = Number(searchParams.get("page") ?? "1"); // params are always strings

function handleSortChange(nextSort) {
  // Updates the URL (?sort=...) and triggers a re-render with the new value
  setSearchParams((prev) => {
    prev.set("sort", nextSort);
    return prev;
  });
}

return (
  <div>
    <select value={sort ?? ""} onChange={(e) => handleSortChange(e.target.value)}>
      <option value="price">Price</option>
      <option value="rating">Rating</option>
    </select>
    {/* render products filtered by category, sorted by sort, paginated by page */}
  </div>
);
}
```

Key points:

- `useSearchParams()` returns `[searchParams, setSearchParams]`, similar to `useState` — `searchParams` is a read-only `URLSearchParams` instance (`.get()`, `.getAll()`, `.has()`), and `setSearchParams()` updates the URL (and re-renders).
- Updating search params pushes a new history entry by default; pass `{ replace: true }` as a second argument to `setSearchParams` to avoid cluttering back/forward history (useful for things like live search-as-you-type).
- Query params are ideal for **optional, non-hierarchical, shareable UI state** — filters, sorting, pagination, search text — because the resulting URL can be bookmarked/shared and still reproduces the same view.
- Unlike route params, missing query params don't cause a 404/no-match; `searchParams.get("missing")` simply returns `null`, so always provide sensible defaults.

---

## Part 11: Legacy Architecture, Migration Patterns & Historical Internals (354 - 445)

