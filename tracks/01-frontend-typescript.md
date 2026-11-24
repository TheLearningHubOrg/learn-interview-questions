# TypeScript 5.x Master Architecture & Type Systems Master Interview Bank (1 - 50)

> TypeScript 5.x compiler, type systems, generics, conditional types, `infer`, mapped types, template literal types, utility types, `satisfies`, nominal branding, compiler internals, and enterprise monorepo configuration.

---

## Part 1: Basic & Foundational TypeScript (Junior / Entry-Level)

### 1. What is TypeScript and how does it relate to JavaScript?
**In Simple Words:**
**TypeScript** is a strongly typed programming language developed by Microsoft that builds on JavaScript by adding optional static typing.
- **Syntactic Superset**: Any valid JavaScript code is automatically valid TypeScript code (`.js` files can be renamed to `.ts`).
- **Compile-Time Only**: Browsers and Node.js cannot execute TypeScript directly. The TypeScript compiler (`tsc`) type-checks the code and **erases all type annotations**, emitting clean, standard JavaScript.
- **Zero Runtime Overhead**: Types do not exist at runtime; they do not alter performance or memory consumption in the browser.

---

### 2. What are Primitive Types vs Object Types in TypeScript?
**In Simple Words:**
- **Primitive Types**: Built-in immutable JavaScript primitives: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`.
- **Object Types**: Non-primitive structures: `object`, arrays (`number[]`), interfaces, classes, tuples, and functions.
- **Convention Note**: Always use lowercase primitive types (`string`, `number`, `boolean`). Capitalized types (`String`, `Number`, `Boolean`) refer to JavaScript's boxed object wrapper prototypes and should never be used as types.

---

### 3. Compare `any`, `unknown`, and `never`.
**In Simple Words:**
| Type | Meaning | Type Safety | Operations Allowed |
| :--- | :--- | :--- | :--- |
| **`any`** | Completely disables type checking | None (escapes compiler) | Anything (calling methods, accessing properties) |
| **`unknown`** | Type is unknown at compile time (Top Type) | High (type-safe) | **No operations allowed** until narrowed with type guards |
| **`never`** | Value that can never occur (Bottom Type) | Maximum | No value can be assigned to `never` (except `never`) |

```typescript
// 'any' is unsafe
let valAny: any = "hello";
valAny.nonExistentMethod(); // Compiles fine, crashes at runtime!

// 'unknown' is safe
let valUnknown: unknown = "hello";
// valUnknown.toUpperCase(); // Error: Object is of type 'unknown'
if (typeof valUnknown === "string") {
  console.log(valUnknown.toUpperCase()); // Safe! Type narrowed to string
}

// 'never' represents unreachable code
function throwError(msg: string): never {
  throw new Error(msg);
}
```

---

### 4. What is the difference between `type` alias and `interface`?
**In Simple Words:**
Both define the shape of objects, but they have key architectural differences:

| Feature | `interface` | `type` Alias |
| :--- | :--- | :--- |
| **Declaration Merging** | Yes (multiple interfaces with same name merge automatically) | No (duplicate names throw compile error) |
| **Union & Primitive Types** | Cannot directly define unions (`A \| B`) or primitives | Can define unions, tuples, primitives (`type ID = string \| number`) |
| **Extensibility** | Extends via `extends` keyword | Extends via intersection operator (`&`) |
| **Compiler Performance** | Slightly faster cached lookups in older TS compilers | Equivalent in modern TS 5.x |
| **Best Practice** | Ideal for public API contracts and object schemas | Ideal for unions, utility types, and complex mapped/conditional types |

```typescript
// Interface declaration merging
interface User { name: string; }
interface User { age: number; }
// User now has both: { name: string; age: number; }

// Type union (cannot be done with interface)
type Status = "pending" | "approved" | "rejected";
```

---

### 5. How do Function Signatures and Return Types (`void` vs `never`) work?
**In Simple Words:**
- `void`: Indicates a function completes execution without returning a value (returns `undefined` implicitly).
- `never`: Indicates a function **never finishes successfully**—either it throws an uncaught exception or enters an infinite loop (`while(true)`).

```typescript
function logMessage(msg: string): void {
  console.log(msg);
}

function fail(msg: string): never {
  throw new Error(msg);
}
```

---

### 6. Why does modern TypeScript favor String Union Types over Enums?
**In Simple Words:**
Numeric and standard Enums in TypeScript generate real JavaScript code during compilation (creating reverse-mapping object tables).
- **Enums**: Pollute the compiled bundle with runtime object overhead and can produce unsafe numeric assignments (`enum Status { Active, Inactive }`).
- **String Literal Unions (`type Status = 'active' | 'inactive'`)**: Fully erased at compile time, zero runtime code generated, fully serializable to JSON, and fully type-checked.

---

### 7. What are Tuples and `as const` assertions?
**In Simple Words:**
- **Tuple**: An array with a fixed length and known types at specific indices: `[string, number]`.
- **`as const` (Const Assertion)**: Tells the compiler to infer the most specific, literal, readonly type possible. Prevents type widening from `'admin'` to `string`.

```typescript
// Standard array (widened to string[])
const roles1 = ['admin', 'editor']; 

// Tuple with immutable literal types: readonly ['admin', 'editor']
const roles2 = ['admin', 'editor'] as const;
```

---

### 8. What is the difference between Type Assertions (`as`) and Type Casting?
**In Simple Words:**
- **Type Casting** in languages like C# or Java converts data representations at runtime (e.g. converting float bytes to integer).
- **Type Assertion (`as Type`)** in TypeScript is purely a compile-time instruction telling the compiler: *"Trust me, I know the type better than you do."* It does not convert or sanitize any runtime data!
- **Non-null Assertion (`obj!.prop`)**: Asserts that `obj` is neither `null` nor `undefined`. If it actually is `null` at runtime, it triggers a crash!

---

### 9. What is Structural Typing (Duck Typing)?
**In Simple Words:**
TypeScript uses **structural typing**, not nominal typing. Two types are considered identical if they have the **same structure (shape)**, regardless of their declared names:

```typescript
interface Point2D { x: number; y: number; }
class Coordinate { x = 0; y = 0; }

let p: Point2D = new Coordinate(); // Perfectly valid! Structure matches.
```
If an object looks like a duck and quacks like a duck, TypeScript treats it as a duck.

---

### 10. What are Generics and why are they necessary?
**In Simple Words:**
Generics allow you to write reusable, type-safe functions, classes, and interfaces that work over a variety of types rather than a single fixed type, capturing the argument type dynamically:

```typescript
// Without Generics: Loses type safety (returns 'any')
function getFirstAny(arr: any[]): any { return arr[0]; }

// With Generics: Preserves exact type
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]); // Type inferred as number
const str = getFirst(["a", "b"]); // Type inferred as string
```

---

### 11. How do Generic Constraints (`extends`) work?
**In Simple Words:**
By default, generic `<T>` can be anything. Using `T extends Shape` constrains `T` to types that contain specific required properties:

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): number {
  return item.length;
}

logLength("hello"); // Valid (string has .length)
logLength([1, 2, 3]); // Valid (array has .length)
// logLength(123); // Error: Argument of type 'number' is not assignable to 'HasLength'
```

---

### 12. What is the `keyof` operator and Indexed Access types?
**In Simple Words:**
- **`keyof T`**: Produces a union of all property keys of type `T`.
- **`T[K]` (Indexed Access)**: Extracts the type of a specific property `K` on type `T`.

```typescript
interface User {
  id: string;
  name: string;
  age: number;
}

type UserKeys = keyof User; // "id" | "name" | "age"
type AgeType = User["age"]; // number

// Type-safe property getter
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

---

### 13. What are Discriminated Unions (Tagged Unions)?
**In Simple Words:**
A pattern where multiple object types share a common, unique literal property (the "discriminant" or "tag"). TypeScript automatically narrows the union inside a `switch` or `if` block:

```typescript
interface LoadingState { state: "loading"; }
interface SuccessState { state: "success"; response: string[]; }
interface ErrorState   { state: "error"; error: Error; }

type NetworkState = LoadingState | SuccessState | ErrorState;

function handleResponse(res: NetworkState) {
  switch (res.state) {
    case "loading":
      return "Loading spinner...";
    case "success":
      return `Loaded ${res.response.length} items`; // Safe! TS knows res has response
    case "error":
      return `Failed: ${res.error.message}`;       // Safe! TS knows res has error
  }
}
```

---

### 14. How do Type Narrowing and Custom Type Guards (`is`) work?
**In Simple Words:**
TypeScript automatically narrows types within conditional branches using:
- `typeof x === 'string'`
- `x instanceof Date`
- `'property' in obj`

When checking complex runtime objects, you write a **User-Defined Type Guard** returning `arg is TargetType`:

```typescript
interface Fish { swim: () => void; }
interface Bird { fly: () => void; }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // TS guarantees pet is Fish here
  } else {
    pet.fly();  // TS guarantees pet is Bird here
  }
}
```

---

### 15. What are the essential flags in `tsconfig.json`?
**In Simple Words:**
- `"strict": true`: Enables all strict type-checking options (the single most important flag).
- `"target": "ES2022"`: Target ECMAScript version for output JS.
- `"module": "NodeNext"`: Module system for code generation.
- `"noImplicitAny": true`: Raises an error on any variable whose type defaults to `any`.
- `"strictNullChecks": true`: Prevents assigning `null` or `undefined` to types unless explicitly declared in a union (`string | null`).
- `"noUncheckedIndexedAccess": true`: Treats array indexing (`arr[0]`) as `T | undefined` instead of assuming the element exists.

---

## Part 2: Advanced Type System & Metaprogramming (Mid-Level)

### 16. What are Conditional Types and Distributive Conditional Types?
**In Simple Words:**
Conditional types choose one of two possible types based on a subtyping relationship:
`T extends U ? X : Y`

#### Distributive Behavior:
When a conditional type operates on a generic union type (a "naked" type parameter), it automatically distributes over each union member:

```typescript
type ToArray<T> = T extends any ? T[] : never;

type Result = ToArray<string | number>;
// Distributes as: ToArray<string> | ToArray<number>
// Evaluates to: string[] | number[]
```

---

### 17. How does the `infer` keyword work in conditional types?
**In Simple Words:**
`infer` allows you to declare a type variable inside the condition to **extract or unwrap** an unknown subtype:

```typescript
// Extract return type of a function
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: "Alice" };
}
type User = MyReturnType<typeof getUser>; // { id: number; name: string; }

// Unwrap a Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type RawData = UnwrapPromise<Promise<string>>; // string
```

---

### 18. What are Mapped Types and Key Remapping (`as`)?
**In Simple Words:**
Mapped types build new types by transforming each property in an existing type:

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Key remapping using 'as' (introduced in TS 4.1)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person { name: string; age: number; }
type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }
```

---

### 19. What are Template Literal Types?
**In Simple Words:**
Template literal types bring JavaScript template string interpolation syntax directly into the type system:

```typescript
type Event = "click" | "hover";
type Target = "button" | "link";

type HandlerName = `on_${Event}_${Target}`;
// "on_click_button" | "on_click_link" | "on_hover_button" | "on_hover_link"
```

---

### 20. Explain Standard Utility Types: `Partial`, `Required`, `Readonly`, `Record`.
**In Simple Words:**
- `Partial<T>`: Makes all properties optional (`?`).
- `Required<T>`: Removes all optional modifiers (`-?`).
- `Readonly<T>`: Adds `readonly` to all properties.
- `Record<K, T>`: Constructs an object type with property keys `K` and value type `T`.

```typescript
interface Config { port: number; host?: string; }

type AllOptional = Partial<Config>;   // { port?: number; host?: string; }
type AllRequired = Required<Config>;  // { port: number; host: string; }
type RouteMap = Record<string, () => void>;
```

---

### 21. Explain Filtering Utility Types: `Pick`, `Omit`, `Exclude`, `Extract`.
**In Simple Words:**
- `Pick<T, K>`: Constructs a type by picking specific keys `K` from object `T`.
- `Omit<T, K>`: Constructs a type by omitting keys `K` from object `T`.
- `Exclude<T, U>`: Excludes from union `T` all members assignable to `U`.
- `Extract<T, U>`: Extracts from union `T` all members assignable to `U`.

```typescript
interface User { id: string; name: string; email: string; passwordHash: string; }

type PublicProfile = Omit<User, "passwordHash">; // { id, name, email }
type Credentials = Pick<User, "email">;         // { email }

type AllTypes = string | number | boolean;
type OnlyStrings = Extract<AllTypes, string>;   // string
type NoStrings = Exclude<AllTypes, string>;     // number | boolean
```

---

### 22. What is the `satisfies` operator in TypeScript 4.9+?
**In Simple Words:**
Before `satisfies`, you had a dilemma:
- If you annotated `const palette: Colors = { ... }`, you validated the shape, but lost the specific inferred property types (property values widened to `string`).
- If you omitted the annotation `const palette = { ... }`, you kept specific types, but had zero validation of required keys.

The **`satisfies` operator** validates that an expression matches a type **without changing or widening the inferred type**!

```typescript
type Colors = Record<string, string | number[]>;

// Validated against Colors, BUT keeps exact RGB tuple type!
const theme = {
  primary: "#10b981",
  secondary: [255, 0, 0],
} satisfies Colors;

// Keeps specific methods:
theme.primary.toLowerCase(); // Perfectly safe! TS knows it's a string, not string | number[]
```

---

### 23. How do you implement a Deep Partial or Deep Readonly type?
**In Simple Words:**
Standard `Partial<T>` is shallow (only makes top-level keys optional). Using recursive conditional types, we can make every nested level optional:

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface NestedConfig {
  database: {
    connection: {
      host: string;
      port: number;
    }
  }
}

const override: DeepPartial<NestedConfig> = {
  database: { connection: { port: 5432 } } // host is optional!
};
```

---

### 24. What are Overloaded Function Signatures?
**In Simple Words:**
Function overloading allows a function to accept different combinations of parameters and return different types. You define multiple public function signatures followed by a single private implementation:

```typescript
// Overload signatures (public API)
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): number;

// Implementation signature (internal)
function format(value: string | number | boolean): string | number {
  if (typeof value === "boolean") return value ? 1 : 0;
  return value.toString();
}

const r1 = format("hello"); // Type: string
const r2 = format(true);    // Type: number
```

---

### 25. What are Ambient Declarations and `.d.ts` files?
**In Simple Words:**
Ambient declarations describe the shape of existing JavaScript code that has no built-in types (e.g., globals on `window`, external C-modules, or legacy npm packages).
Defined using the `declare` keyword in `.d.ts` files. They contain **zero executable JavaScript**—only type definitions.

```typescript
// types/global.d.ts
declare const __BUILD_TIMESTAMP__: string;

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}
```

---

### 26. What are `const` Type Parameters (TypeScript 5.0+)?
**In Simple Words:**
In TypeScript 5.0, you can prefix a generic parameter with `const` to enforce that calls automatically infer `as const` literal types without forcing callers to write `as const` manually!

```typescript
// TS 5.0+ const generic
function defineRoutes<const T extends readonly string[]>(routes: T): T {
  return routes;
}

// Inferred as readonly ["/home", "/about"], NOT string[]!
const routes = defineRoutes(["/home", "/about"]);
```

---

### 27. What is Variance in TypeScript (Covariance vs Contravariance)?
**In Simple Words:**
Variance describes how subtyping of complex types relates to subtyping of their component types:
- **Covariance (Output positions)**: If `Dog` extends `Animal`, then `Dog[]` extends `Animal[]`, and `() => Dog` extends `() => Animal`.
- **Contravariance (Input/Parameter positions)**: Function parameters are contravariant under `strictFunctionTypes`. `(a: Animal) => void` is assignable to `(d: Dog) => void` (a function that can handle any animal can safely handle a dog).

---

### 28. What is the `asserts` condition operator?
**In Simple Words:**
The `asserts` keyword defines an assertion function. If the function returns without throwing, TypeScript narrows the type of the argument for all subsequent lines in that scope:

```typescript
function assertIsString(val: any): asserts val is string {
  if (typeof val !== "string") {
    throw new Error("Not a string!");
  }
}

function processValue(x: unknown) {
  assertIsString(x);
  console.log(x.toUpperCase()); // Safe! TS knows x is string from here on
}
```

---

### 29. What are Excess Property Checks?
**In Simple Words:**
TypeScript normally allows passing an object with extra properties where fewer properties are expected (structural typing).
However, when passing an **object literal directly**, TypeScript triggers **Excess Property Checks** to prevent typos:

```typescript
interface Options { title: string; }

// Error: 'colour' does not exist in type 'Options' (Did you mean 'color'?)
const opt: Options = { title: "App", colour: "red" }; 

// Allowed when assigned to an intermediate variable first:
const raw = { title: "App", colour: "red" };
const opt2: Options = raw; // Compiles!
```

---

### 30. How do ECMAScript Stage 3 Decorators work in TypeScript 5.x?
**In Simple Words:**
TypeScript 5.0 adopted the official ECMAScript standard Decorators (replacing the legacy `experimentalDecorators` flag).
Decorators are functions applied to classes, methods, accessors, and fields to wrap or replace them:

```typescript
function logged(target: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  return function (this: any, ...args: any[]) {
    console.log(`Calling ${methodName} with args:`, args);
    return target.apply(this, args);
  };
}

class Calculator {
  @logged
  add(a: number, b: number) { return a + b; }
}
```

---

## Part 3: Enterprise Architecture, Compiler Internals & Performance (Senior / Staff)

### 31. Explain the TypeScript Compiler Architecture and Compilation Pipeline.
**In Simple Words:**
The `tsc` compiler operates across five sequential stages:
1. **Scanner**: Reads source text and converts characters into **Tokens**.
2. **Parser**: Consumes tokens and builds the **Abstract Syntax Tree (AST)**.
3. **Binder**: Traverses the AST and connects declarations to **Symbols** (scoping and symbol table).
4. **Checker**: The core of TypeScript. Performs type checking, verifies assignments, and computes inferred types.
5. **Emitter**: Erases type annotations and writes target JavaScript (`.js`) and declaration (`.d.ts`) files.

```
Source Code ──► Scanner ──► Parser (AST) ──► Binder (Symbols) ──► Checker ──► Emitter (.js / .d.ts)
```

---

### 32. How do you implement Nominal Typing (Branded Types) in TypeScript?
**In Simple Words:**
Because TypeScript is structurally typed, a `UserId` (string) and an `OrderId` (string) are completely interchangeable, leading to catastrophic runtime bugs where an order ID is passed into a user deletion function!
**Branded Types** attach a unique compile-time phantom property:

```typescript
declare const __brand: unique symbol;
type Brand<B> = { readonly [__brand]: B };

export type UserId = string & Brand<"UserId">;
export type OrderId = string & Brand<"OrderId">;

function createUserId(id: string): UserId { return id as UserId; }
function createOrderId(id: string): OrderId { return id as OrderId; }

function deleteUser(id: UserId) { /* ... */ }

const userId = createUserId("usr_123");
const orderId = createOrderId("ord_456");

deleteUser(userId);  // Valid
// deleteUser(orderId); // Compile Error: Type 'OrderId' is not assignable to 'UserId'!
```

---

### 33. How do you optimize TypeScript compilation speed in massive enterprise codebases?
**In Simple Words:**
1. **`skipLibCheck: true`**: Skips type-checking of all `.d.ts` declaration files inside `node_modules` (saves up to 50% compilation time).
2. **`incremental: true`**: Saves compilation state to a `.tsbuildinfo` cache file for fast incremental builds.
3. **Project References (`tsc --build`)**: Decompose a large monolithic project into smaller independent projects with composite flags.
4. **`isolatedDeclarations: true` (TS 5.5+)**: Enforces that exported functions declare explicit return types, allowing bundlers like esbuild or oxc to generate `.d.ts` files 20x faster in parallel.

---

### 34. What are Project References and Composite Projects?
**In Simple Words:**
In a monorepo with 50 packages, running `tsc` across all 50 packages in a single run exhausts memory and takes minutes.
**Project References** (`"composite": true`, `"references": [{ "path": "../core" }]`) allow `tsc --build` to compile sub-projects incrementally, rebuilding only packages whose source files changed and reusing cached `.d.ts` declarations.

---

### 35. How does Runtime Validation (Zod) synchronize with Compile-Time TypeScript?
**In Simple Words:**
TypeScript types vanish at runtime and cannot validate incoming API payloads from external users.
**Zod** provides runtime schema validation that automatically infers static TypeScript types using `z.infer`:

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
});

// Infer static compile-time TypeScript type from runtime schema
export type User = z.infer<typeof UserSchema>;

// Validate incoming API request at runtime
export function handlePost(data: unknown): User {
  return UserSchema.parse(data); // Throws at runtime if invalid, returns typed User
}
```

---

### 36. How do you build a strongly-typed Event Emitter?
**In Simple Words:**
By mapping event names to their payload types, you can enforce that `emit` and `on` require exact payload signatures:

```typescript
type EventMap = {
  login: { userId: string; timestamp: number };
  logout: { userId: string };
  error: { code: number; message: string };
};

class TypedEventEmitter {
  on<K extends keyof EventMap>(event: K, listener: (data: EventMap[K]) => void) {}
  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {}
}

const emitter = new TypedEventEmitter();
emitter.emit("login", { userId: "123", timestamp: Date.now() }); // Valid
// emitter.emit("logout", { foo: "bar" }); // Compile error!
```

---

### 37. How do you implement Deep Tuple Reverse using Recursive Conditional Types?
**In Simple Words:**
Deep tuple reversal uses recursive conditional types with variadic tuple unpacking and the `infer` keyword to peel off the first element and append it to the recursively reversed tail.

#### Code Example
```typescript
type Reverse<T extends readonly any[]> = 
  T extends readonly [infer First, ...infer Rest]
    ? [...Reverse<Rest>, First]
    : [];

type Original = [1, 2, 3, 4];
type Reversed = Reverse<Original>; // [4, 3, 2, 1]
```

---

### 38. How do you diagnose and debug slow types in a TypeScript codebase?
**In Simple Words:**
Complex recursive conditional types or massive union combinations can freeze `tsc`.
- Run `tsc --extendedDiagnostics`: Displays total check time, number of types created, and memory usage.
- Run `tsc --generateTrace trace_dir`: Generates Chrome DevTools performance traces. Inspect in `chrome://tracing` or using `@typescript/analyze-trace` to identify the exact file and line causing exponential type recursion!

---

### 39. What causes the error `Type instantiation is excessively deep and possibly infinite`?
**In Simple Words:**
TypeScript caps recursive type evaluations (around 1,000 recursive steps in modern versions) to prevent compiler stack overflows.
- **Cause**: Recursive mapped types lacking a proper base case or operating over circular data structures.
- **Fix**: Add a termination guard (e.g. depth counter tuple `Depth extends [any, any, any, any, any] ? never : ...`) or simplify the type abstraction.

---

### 40. Explain TypeScript Module Resolution Modes (`Node16`, `NodeNext`, `Bundler`).
**In Simple Words:**
- `Node16` / `NodeNext`: Adheres strictly to Node.js ESM rules (requires explicit file extensions in imports like `import './utils.js'`, respects `package.json` `exports` map).
- `Bundler`: Introduced in TS 5.0 for modern bundlers (Vite, Webpack, Turbopack) that resolve extensions and paths without requiring `.js` extensions.

---

### 41. What is the difference between `declare module` and `declare global`?
**In Simple Words:**
- `declare module "some-package"`: Augments or provides types for an external npm package.
- `declare global`: Augments the top-level global environment (adding properties to `window`, `globalThis`, or `document`) from within a module file.

---

### 42. How do you enforce Exhaustive Type Checking in `switch` statements?
**In Simple Words:**
Assigning the unhandled case to a `never` variable guarantees that if a new member is added to a union, the TypeScript compiler will fail until all cases are handled:

```typescript
type Action = "start" | "stop" | "pause";

function handleAction(action: Action) {
  switch (action) {
    case "start": return 1;
    case "stop": return 0;
    case "pause": return 2;
    default:
      const _exhaustiveCheck: never = action; // Error if any Action case is forgotten!
      return _exhaustiveCheck;
  }
}
```

---

### 43. What is the difference between Method Signatures and Property Signatures in Interfaces?
**In Simple Words:**
```typescript
interface Comparer {
  method(a: number): void;         // Bivariant (under strictFunctionTypes)
  property: (a: number) => void;   // Contravariant (strictly checked)
}
```
Method shorthand syntax preserves legacy bivariance for compatibility with arrays, whereas function property syntax enforces strict contravariance under `strictFunctionTypes`.

---

### 44. What is `exactOptionalPropertyTypes`?
**In Simple Words:**
By default with `strict: true`, an optional property `foo?: string` allows assigning `foo = undefined`.
Enabling `"exactOptionalPropertyTypes": true` enforces that an optional property must either be present with the exact type (`foo: "hello"`) or completely omitted (`{}`), but **never explicitly assigned `undefined`**.

---

### 45. How do you implement a Type-Safe Router or Path Parameter Parser?
**In Simple Words:**
Using recursive template literal types, we can infer dynamic URL parameters from a route string:

```typescript
type ExtractParams<Path extends string> = 
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : Path extends `${string}:${infer Param}`
    ? Param
    : never;

type Route = "/users/:userId/posts/:postId";
type Params = ExtractParams<Route>; // "userId" | "postId"
```

---

### 46. What is the `noUncheckedIndexedAccess` flag and why is it essential?
**In Simple Words:**
In standard TypeScript:
```typescript
const arr = [1, 2, 3];
const item = arr[100]; // Inferred as 'number' by default!
item.toFixed(2);       // Compiles, but crashes with TypeError: cannot read property of undefined!
```
With `"noUncheckedIndexedAccess": true`, `item` is correctly inferred as `number | undefined`, forcing you to check `if (item !== undefined)` before using it!

---

### 47. How do you write an Abstract Syntax Tree (AST) Transformer in TypeScript?
**In Simple Words:**
TypeScript provides the `ts.transform` API allowing compiler plugins to inspect and modify AST nodes during compilation:
- Walks the AST using `ts.visitEachChild`.
- Detects specific nodes (e.g. `ts.isCallExpression`).
- Rewrites or inserts new AST nodes (e.g. replacing `console.log` with empty statements in production).

---

### 48. What is the recommended strategy for migrating a 500k-line legacy JS codebase to strict TS?
**In Simple Words:**
1. **Enable TypeScript in loose mode**: Set `"allowJs": true`, `"checkJs": false`, `"strict": false`.
2. **Setup CI with `--noEmit`**: Type check files without generating build assets.
3. **Migrate leaf files first**: Convert utilities and core constants (`.js` -> `.ts`).
4. **Turn on strict flags incrementally**: First `noImplicitAny`, then `strictNullChecks`, followed by full `strict: true`.
5. **Use JSDoc as a transition step**: Add `@param` and `@type` comments in `.js` files to get IDE type checking before renaming.

---

### 49. How do you write Type-Safe SQL queries with Kysely or Slonik?
**In Simple Words:**
Instead of ORMs that hide SQL or raw strings with zero type checking, type-safe query builders like **Kysely** use TypeScript's mapped and indexed access types:
- Database schema is defined as a TypeScript interface.
- Kysely's query builder autocompletes table and column names and infers the exact return type of `SELECT` expressions.

---

### 50. What are the flagship innovations introduced in TypeScript 5.0 through 5.5+?
**In Simple Words:**
- **TS 5.0**: Standard ECMAScript Decorators, `const` type parameters, multiple config inheritance (`extends: [...]`).
- **TS 5.1**: Unrelated types for getters and setters, decoupled JSX namespaces for React Server Components.
- **TS 5.2**: `using` declarations (Explicit Resource Management / Disposable pattern).
- **TS 5.3**: Import attributes and type-only imports (`import type ... with { type: "json" }`).
- **TS 5.4**: `NoInfer<T>` utility type to block unwanted inference in generic functions.
- **TS 5.5+**: Inferred Type Predicates (functions like `arr.filter(x => x !== null)` automatically narrow to non-null), and `isolatedDeclarations` for ultrafast parallel toolchain builds.

