# Modern Swift 6, Memory Safety & Concurrency Master Interview Bank (1 - 35)

> Comprehensive, production-grade technical interview questions covering Swift 6 Language, Automatic Reference Counting (ARC), Value vs Reference Types, Copy-on-Write, Swift Concurrency (async/await, Actors, Sendable), Method Dispatch, Protocols, and Systems Programming.

---

## Part 1: Core Language, Memory & Value Types (1 - 10)

### 1. What are the key differences between Value Types (struct, enum) and Reference Types (class) in Swift?
**In Simple Words:**
The core architectural distinction in Swift:
- **Value Types (`struct`, `enum`, primitives like `Int`, `String`, `Array`)**:
  - Allocated on the **Stack** (fast allocation and deallocation).
  - Copied on assignment or when passed to functions (**Copy-On-Write**).
  - Thread-safe by default because each thread operates on its own isolated copy.
- **Reference Types (`class`, closures)**:
  - Allocated on the **Heap**.
  - Multiple variables point to the **exact same memory address**.
  - Managed by **Automatic Reference Counting (ARC)**; prone to multi-threaded race conditions if not synchronized.

```swift
// Value Type (Independent Copy):
struct Point { var x: Int, y: Int }
var p1 = Point(x: 10, y: 20)
var p2 = p1
p2.x = 99 // p1.x remains 10!

// Reference Type (Shared Pointer):
class User { var name: String; init(name: String) { self.name = name } }
let u1 = User(name: "Alex")
let u2 = u1
u2.name = "Bob" // u1.name is now also "Bob"!
```

---

### 2. How does Automatic Reference Counting (ARC) work in Swift?
**In Simple Words:**
ARC automatically manages memory for class instances on the heap:
- Every time a new reference to an instance is created, ARC increments its **reference count** by 1.
- When a reference goes out of scope or is set to `nil`, ARC decrements the reference count by 1.
- When the reference count drops to **0**, the instance is immediately deallocated from memory, and its `deinit` block is invoked.
- ARC operates at compile-time by injecting `retain` and `release` calls into your code; it is **not a garbage collector**.

---

### 3. What is a Retain Cycle (Strong Reference Cycle) and how do you resolve it?
**In Simple Words:**
A retain cycle occurs when two class instances hold strong references to each other, preventing either reference count from ever reaching 0:
- Result: **Memory Leak**; neither instance can ever be deallocated!
- **Resolution**: Break the cycle using **`weak`** or **`unowned`** references:
  - **`weak`**: Does not increment reference count. Must be an `Optional` (`weak var parent: Person?`). Automatically becomes `nil` when the referenced instance is deallocated.
  - **`unowned`**: Does not increment reference count. Non-optional; expects the referenced instance to **never become `nil`** during its lifetime (crashes if accessed after deallocation).

```swift
class Order {
    var customer: Customer?
}

class Customer {
    // FIX: Declare as weak to break retain cycle!
    weak var activeOrder: Order?
}
```

---

### 4. What is a Capture List in Swift Closures (`[weak self]`)?
**In Simple Words:**
Closures are reference types that strongly capture any variables referenced within their body:
- If a class instance owns a closure (e.g. `onComplete`), and the closure references `self` (`self.refreshUI()`), a **Retain Cycle** is formed (`self -> closure -> self`).
- **Capture List**: `[weak self]` in the closure declaration instructs the closure to capture `self` weakly:
```swift
networkManager.fetchData { [weak self] result in
    guard let self = self else { return } // Safe unwrapping
    self.updateUI(with: result)
}
```

---

### 5. What are Optionals and how do you safely unwrap them in Swift?
**In Simple Words:**
An Optional represents a variable that can either hold a wrapped value or `nil`:
1. **Optional Binding (`if let` / `guard let`)**: Safely unwraps the value (preferred standard).
2. **Nil-Coalescing Operator (`??`)**: Provides a fallback default value (`let name = inputName ?? "Guest"`).
3. **Optional Chaining (`user?.address?.city`)**: Gracefully fails to `nil` if any link in the chain is `nil`.
4. **Forced Unwrapping (`!`)**: Assumes value exists; **fatal crash at runtime** if value is `nil`! Avoid in production.

---

### 6. How does Swift Concurrency (`async/await`) work and how does it replace completion handlers?
**In Simple Words:**
Before Swift 5.5, asynchronous code relied on nested completion handler closures, leading to "Callback Hell" and unhandled error states:
- **`async/await`**: Writes asynchronous code that reads like synchronous procedural code:
- When code hits `await`, the execution thread is **suspended**, freeing the underlying OS thread to do other work.
- When the asynchronous task completes, execution resumes on an available thread.

```swift
// Modern async/await:
func loadProfile(userId: String) async throws -> Profile {
    let url = URL(string: "https://api.com/users/\(userId)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(Profile.self, from: data)
}
```

---

### 7. What are Actors in Swift and how do they eliminate Data Races?
**In Simple Words:**
An `actor` is a reference type that protects its mutable state through **Actor Isolation**:
- Only one task can execute code inside an actor instance at any given time.
- All external calls to an actor's methods or properties must use **`await`**, waiting their turn in an orderly queue.
- Eliminates race conditions and shared mutable state bugs without manual locks or dispatch queues!

```swift
actor BankAccount {
    private var balance: Double = 0.0

    func deposit(amount: Double) {
        balance += amount
    }

    func getBalance() -> Double {
        return balance
    }
}
```

---

### 8. What is `@MainActor` in Swift?
**In Simple Words:**
A globally unique actor that always executes code on the **Main Thread (UI thread)**:
- Annotating a class, function, or view model with `@MainActor` guarantees that all state mutations and UI updates are executed on the main thread, eliminating the classic crash: `UIAccessibilityElement not on main thread`.

```swift
@MainActor
class FeedViewModel: ObservableObject {
    @Published var posts: [Post] = []

    func loadPosts() async {
        let fetched = try? await NetworkService.fetchPosts()
        // Automatically runs on Main Thread!
        self.posts = fetched ?? []
    }
}
```

---

### 9. What is the `Sendable` protocol in Swift 6?
**In Simple Words:**
The cornerstone of **Data-Race Safety** in Swift 6:
- A `Sendable` type is safe to transfer across concurrency boundaries (between tasks or actors).
- **What is Sendable?**: Value types (structs with Sendable members), Actors, and immutable final classes with immutable properties.
- **What is NOT Sendable?**: Mutable classes, pointers, closures without `@Sendable`.
- Swift 6 enforces complete compile-time checking; attempting to pass non-Sendable mutable state across threads triggers a compiler error!

---

### 10. What are Tasks and TaskGroups in Swift Concurrency?
**In Simple Words:**
- **`Task`**: The basic unit of asynchronous execution. Inherits priority and actor context.
- **Structured Concurrency (`async let` / `withTaskGroup`)**:
  - `async let`: Runs multiple independent async calls in parallel and awaits them together.
  - `withTaskGroup`: Runs a dynamic list of concurrent child tasks, automatically propagating cancellation if the parent task fails.

```swift
// Parallel execution using async let:
async let avatar = downloadImage(url: avatarUrl)
async let stats = fetchStats(id: userId)
let profile = try await Profile(avatar: avatar, stats: stats)
```

---


---

## Part 2: Concurrency, Actors & Advanced Architecture (11 - 24)

### 11. What is Copy-On-Write (COW) in Swift and how do you implement it for custom structs?
**In Simple Words:**
Standard Swift collections (`Array`, `Dictionary`, `String`) are value types with Copy-On-Write optimization:
- When you assign `b = a`, memory is **not duplicated immediately**; both variables share the same underlying memory buffer.
- Memory is only duplicated when one of the variables **attempts to mutate data**!
- **Custom Implementation**: Wrap a reference type (`class`) inside a struct and check `isKnownUniquelyReferenced(&ref)` before mutation:
```swift
struct CustomBuffer {
    private var storage = StorageClass()

    mutating func write(data: String) {
        if !isKnownUniquelyReferenced(&storage) {
            storage = storage.copy() // Duplicate buffer only upon mutation!
        }
        storage.data = data
    }
}
```

---

### 12. What are Method Dispatch mechanisms in Swift (Static vs Table vs Message Dispatch)?
**In Simple Words:**
How the CPU determines which executable memory address to jump to when calling a method:
1. **Static / Direct Dispatch (Fastest)**: Resolved at compile time. Inlined by compiler. Used for `struct` methods, `final` class methods, and methods in class extensions.
2. **Table / Witness Table Dispatch (Medium)**: Dynamic dispatch via a virtual function table (vtable for classes, witness table for protocols). Looks up pointer at runtime.
3. **Message Dispatch (Most Dynamic / Slowest)**: Pure Objective-C runtime lookup (`objc_msgSend`). Can be swizzled at runtime. Used for `@objc dynamic` methods.

```text
Swift Dispatch Hierarchy:
Static Dispatch (Inlined, Compile-Time) ◄── struct / final class
Witness Table Dispatch (vtable)        ◄── Class inheritance & Protocols
Message Dispatch (objc_msgSend)        ◄── @objc dynamic & KVO
```

---

### 13. What is Swift 6 Complete Concurrency Checking and how do you migrate legacy code?
**In Simple Words:**
Swift 6 enables strict compile-time concurrency checking by default:
- Flags all data races, unsafe global variables, and non-Sendable type sharing across tasks as compiler errors.
- **Migration Strategy**:
  1. Enable `-warn-concurrency` in Swift 5.10.
  2. Mark shared reference classes as `actor` or wrap in `@MainActor`.
  3. Ensure closure parameters passed across tasks are annotated with `@Sendable`.
  4. Use `@unchecked Sendable` as a last resort when wrapping thread-safe C/Obj-C code with manual OS locks (`os_unfair_lock`).

---

### 14. What are Protocols, Protocol Extensions, and Protocol-Oriented Programming (POP) in Swift?
**In Simple Words:**
Swift prioritizes **composition over class inheritance**. Protocols define contracts of methods and properties. **Protocol Extensions** allow providing default implementations for protocol methods, enabling modular, horizontal code sharing across structs and classes without fragile base class hierarchies.

---

### 15. What is the difference between Opaque Return Types (some) and Existential Any (any)?
**In Simple Words:**
- **`some Protocol` (Opaque Type)**: The function returns a specific concrete type known to the compiler, but hidden from the caller. Preserves type identity and enables compiler static dispatch with zero heap allocation.
- **`any Protocol` (Existential Container)**: A dynamic box holding any type that conforms to the protocol. Incurs runtime existential container overhead (3 word buffer + witness table) and dynamic dispatch.

---

### 16. What are Property Wrappers (@propertyWrapper) and how do they work under the hood?
**In Simple Words:**
A Property Wrapper encapsulates property access logic (validation, caching, persistence). The compiler synthesizes a backing storage property prefixed with an underscore (`_propertyName`) and a projected value (`$propertyName`).

---

### 17. How does ResultBuilder in Swift enable declarative DSL syntax like SwiftUI?
**In Simple Words:**
**`@resultBuilder`** is a compiler transformation feature. It translates a list of sequential statements or expressions inside a closure into a single combined return value by invoking static builder methods (`buildBlock`, `buildEither`, `buildOptional`).

---

### 18. What are KeyPaths and Dynamic Member Lookup in Swift?
**In Simple Words:**
A **`KeyPath<Root, Value>`** is a strongly typed, uninvoked reference to a property of an object. `@dynamicMemberLookup` allows classes/structs to intercept dot-syntax property lookups dynamically at compile time.

---

### 19. How does Structured Concurrency differ from Unstructured Concurrency (Task.detached) in Swift?
**In Simple Words:**
- **Structured (`async let`, `withTaskGroup`)**: Child tasks inherit task priorities, cancellation state, and task-local values from the parent scope. Guarantees that child tasks complete before the parent scope exits.
- **Unstructured (`Task.detached`)**: Spawns an independent background task that does not inherit caller priority or cancellation, requiring manual lifecycle management.

---

### 20. How does Error Handling work in Swift: do-try-catch vs Result<T, E> vs Typed Throws in Swift 6?
**In Simple Words:**
Historically, Swift functions threw untyped `any Error`. Swift 6 introduces **Typed Throws** (`throws(PaymentError)`), allowing the compiler to know the exact error type and eliminating untyped catch-all boilerplate.

---

### 21. What is MemoryLayout<T> and how does Swift handle struct alignment and stride?
**In Simple Words:**
- **Size**: Contiguous bytes of actual data stored.
- **Alignment**: Memory boundary required by CPU architecture (e.g. 8-byte boundary).
- **Stride**: Distance in bytes between successive elements in an array, including padding bytes required for alignment.

---

### 22. What is the Unsafe Pointer API in Swift (UnsafePointer, UnsafeMutableRawPointer)?
**In Simple Words:**
Swift is memory-safe by default. Unsafe pointer types provide direct, unmanaged C-style memory address manipulation for low-level systems programming and C interoperability.

---

### 23. How do Swift Macros (Freestanding vs Attached) transform syntax at compile time?
**In Simple Words:**
Introduced in Swift 5.9, Swift Macros use **SwiftSyntax** to inspect code AST at compile time and emit new Swift code safely in sandboxed out-of-process compiler plugins.

---

### 24. How does C and C++ Interoperability work in modern Swift?
**In Simple Words:**
Swift has native, bidirectional C and C++ interop. You can import C++ headers directly into Swift modules and call C++ templates, vectors, and member functions without writing manual C wrappers.

---


---

## Part 3: Runtime Internals, Swift 6 Safety & Systems Programming (25 - 35)

### 25. What is AsyncSequence and AsyncStream in Swift Concurrency?
**In Simple Words:**
**`AsyncSequence`** represents an asynchronous stream of values delivered over time (like WebSocket frames or notifications) iterated with `for await value in stream`.

---

### 26. How does Whole Module Optimization (WMO) and @inlinable optimize Swift binary performance?
**In Simple Words:**
Standard compilation compiles files individually. **WMO** analyzes all files in a module simultaneously, allowing the compiler to devirtualize protocol witness tables and inline method implementations across files.

---

### 27. What are Generics with where clauses and Primary Associated Types in Swift?
**In Simple Words:**
Primary associated types (`protocol Collection<Element>`) simplify generic code by allowing constraints to be specified inline rather than requiring complex outer `where` clauses.

---

### 28. What is Non-Copyable Types (~Copyable) in Swift 5.9+ and why are they critical for systems programming?
**In Simple Words:**
Types in Swift are copyable by default. Suppressing copyability with **`~Copyable`** guarantees unique ownership of resources (like file handles or hardware locks) with zero ARC retain/release overhead.

---

### 29. How does the Swift Runtime manage weak references via the Side Table?
**In Simple Words:**
Every Swift object has an inline reference count. When an object is referenced by a `weak` pointer, the runtime allocates a **Side Table**, moving reference counts there so the object's inline memory can be freed as soon as strong references reach zero.

---

### 30. What is Dynamic Member Lookup and @dynamicCallable in Swift?
**In Simple Words:**
Allows Swift to interoperate smoothly with dynamic languages like Python or JavaScript, allowing arbitrary method calls and property lookups to be resolved at runtime.

---

### 31. How does String manipulation work in Swift and why does String not support integer indexing?
**In Simple Words:**
Swift strings are collections of **extended grapheme clusters** (Unicode characters can consist of multiple code points, like flags and emojis with skin tones). Because characters vary in byte length, integer indexing cannot be $O(1)$ and is disallowed.

---

### 32. What are Custom Operators and Precedence Groups in Swift?
**In Simple Words:**
Swift allows defining custom infix, prefix, and postfix operators with explicit precedence and associativity rules relative to existing operators.

---

### 33. What is Mutating functions in Structs and how does it relate to the inout parameter?
**In Simple Words:**
Because structs are value types, their methods cannot modify properties by default. Marking a method `mutating` implicitly passes `self` as an `inout` reference, writing changes back to the caller.

---

### 34. How does Enums with Associated Values provide Algebraic Data Types in Swift?
**In Simple Words:**
Swift enums are sum types that can carry strongly typed payloads for each case, making illegal application states unrepresentable.

---

### 35. When should you choose Swift on the Server (Vapor / Hummingbird) over Node.js or Go?
**In Simple Words:**
Choose Server-Side Swift for teams sharing models and validation logic between iOS clients and backend services, combined with high throughput and predictable memory usage without GC pauses.


---

### 36. Swift 6 Complete Concurrency and Data-Race Safety: Strict checking, `@Sendable`, and region-based isolation.

**In Simple Words:**
Swift 6 introduces **Compile-Time Data-Race Freedom**:
- Code that mutates shared mutable state concurrently across threads without protection is rejected at compile time.
- **`@Sendable` Closures**: Closures that can safely cross concurrency boundaries. Cannot capture mutable local variables by reference.
- **Region-Based Isolation**: The compiler tracks the lifetime and mutation regions of non-Sendable objects. If an object is created and passed to another concurrency domain without further local mutation, the compiler proves it is safe and permits the transfer without compiler errors.

---

### 37. Swift Macros (Freestanding vs Attached): Metaprogramming with SwiftSyntax.

**In Simple Words:**
Swift Macros replace fragile pre-processor templates with type-safe compile-time code generation:
- **Freestanding Macros (`#`)**:
  - `#expression`: Produces a value (e.g. `#URL("https://apple.com")` validates the URL at compile time).
  - `#declaration`: Generates one or more declarations (e.g. `#warning`).
- **Attached Macros (`@`)**:
  - `@attached(member)`: Adds new members to a type (e.g. `@Observable` automatically generates getters, setters, and observation registers).
  - `@attached(peer)`: Generates companion declarations alongside the target.

---

### 38. Method Dispatch in Swift: Static vs Table vs Message Dispatch.

**In Simple Words:**
How the CPU resolves which function implementation to execute:
1. **Static / Direct Dispatch (Fastest)**: Resolved at compile time. The CPU jumps directly to memory address. Used for `final` classes, structs, enums, and protocol extensions.
2. **Table Dispatch (V-Table & Witness Table)**: Looked up via function pointer arrays at runtime. Used for standard class inheritance (V-Table) and protocol conformance (Witness Table).
3. **Message Dispatch (Most Dynamic / Slowest)**: Uses Objective-C runtime (`objc_msgSend`). Supports swizzling and dynamic resolution. Enabled with `@objc dynamic`.

---

### 39. ARC Memory Management: Strong, Weak, Unowned, and resolving Retain Cycles.

**In Simple Words:**
Automatic Reference Counting (ARC) automatically tracks and manages memory:
- **Strong Reference**: Increments retain count. Object stays in memory as long as retain count $> 0$.
- **Weak Reference**: Does not increment retain count. Automatically sets pointer to `nil` when target object deallocates (always an optional `weak var`).
- **Unowned Reference**: Does not increment retain count. Assumes the target will *never* be nil during the pointer's lifetime. Accessing after deallocation crashes with a memory fault.
- **Closure Retain Cycle Fix**: Always capture `[weak self]` when a closure is retained by an instance property or callback listener.

---

### 40. Copy-on-Write (CoW) in Custom Value Types: Implementing CoW using `isKnownUniquelyReferenced()`.

**In Simple Words:**
Standard Swift collections (Array, Dictionary, String) are value types that copy cheaply:
- When you assign `b = a`, memory is **not duplicated immediately**; both variables point to the exact same underlying buffer.
- Memory is copied only when one variable attempts a write (**Copy-on-Write**).
- **Custom CoW Implementation**:
  Wrap a reference type class inside a struct, and check `isKnownUniquelyReferenced(&ref)` before modifying the internal buffer. If multiple structs point to the same class buffer, allocate a fresh cloned copy.

---

### 41. Existential Any vs Opaque Some Types (`any Protocol` vs `some Protocol`).

**In Simple Words:**
- **Opaque Types (`some View` / `some Protocol`)**:
  - Represents a specific, fixed concrete type chosen by the implementation, hidden from the caller.
  - Zero performance overhead (static dispatch).
- **Existential Types (`any Protocol`)**:
  - A dynamic box that can hold *any* arbitrary type conforming to the protocol at runtime.
  - Incurs memory heap allocation for values larger than 3 words (Existential Container) and dynamic witness table dispatch.

---

### 42. Property Wrappers (`@propertyWrapper`): Wrapped value, projected value, and composition.

**In Simple Words:**
Adds reusable management logic to property read/write access:
```swift
@propertyWrapper
struct Clamped<T: Comparable> {
  var value: T
  let range: ClosedRange<T>
  var wrappedValue: T {
    get { value }
    set { value = min(max(newValue, range.lowerBound), range.upperBound) }
  }
  var projectedValue: Bool { value == range.upperBound } // Accessed via $
}

struct Player {
  @Clamped(range: 0...100) var health: Int = 100
}
```

---

### 43. Result Builders (`@resultBuilder`): How SwiftUI declarative body DSL is compiled.

**In Simple Words:**
Result builders allow writing declarative list-like syntax without commas or return statements (e.g. SwiftUI `VStack { Text("A"); Text("B") }`):
- The compiler rewrites the block into static calls on the builder type:
  - `buildBlock(_ parts: Component...)`
  - `buildEither(first:)` and `buildEither(second:)` for `if/else` statements.
  - `buildOptional(_:)` for optional statements.

---

### 44. KeyPaths in Swift: Type-safe property referencing and functional composition.

**In Simple Words:**
KeyPaths allow referencing properties as first-class un-invoked values:
```swift
struct User { let name: String; var score: Int }

let nameKeyPath = User.name // KeyPath<User, String>
let user = User(name: "Elena", score: 95)
print(user[keyPath: nameKeyPath]) // "Elena"

// Functional mapping with KeyPaths:
let names = users.map(.name)
let sorted = users.sorted(by: .score)
```

---

### 45. Concurrency: Actors vs Global Actors (`@MainActor`) and Actor Reentrancy hazards.

**In Simple Words:**
- **Actors**: Reference types that protect internal mutable state by synchronizing access through a private serial mailbox queue.
- **`@MainActor`**: A global actor that guarantees code executes strictly on the primary UI thread (crucial for view updates).
- **Actor Reentrancy Hazard**: When an actor method calls `await`, it releases its execution thread while waiting. Other tasks can execute on the actor in the meantime, potentially mutating internal state before the original method resumes! Always re-verify assumptions after every `await` point.

---

### 46. Error Handling: `Result`, typed throws in Swift 6 (`throws(MyError)`), and `rethrows`.

**In Simple Words:**
- **Untyped Throws (Classic Swift)**: `func fetch() throws` erases error types to `any Error`.
- **Typed Throws (Swift 6)**:
  ```swift
  enum NetworkError: Error { case timeout, unauthorized }
  func request() throws(NetworkError) -> Data { ... }
  ```
  Callers receive a strongly typed `NetworkError` in `catch` blocks without type casting!
- **`rethrows`**: A function throws an error only if one of its closure arguments throws an error (e.g. `map`, `filter`).

---

### 47. C and C++ Interoperability: Direct C++20 standard library calls and Objective-C bridging.

**In Simple Words:**
Swift 5.9+ supports bidirectional, zero-overhead C++ interop:
- Include C++ headers directly into Swift modules via `module.modulemap`.
- Swift can directly instantiate C++ classes, invoke methods, and pass `std::string` and `std::vector` without writing Objective-C++ (`.mm`) wrapper shims.

---

### 48. Unsafe Swift: `UnsafePointer`, `UnsafeMutableRawPointer`, and memory alignment.

**In Simple Words:**
Direct manual memory manipulation for high-frequency low-level algorithms:
- `UnsafePointer<T>`: Equivalent to C `const T*`.
- `UnsafeMutablePointer<T>`: Equivalent to C `T*`.
- `UnsafeMutableRawPointer`: Equivalent to C `void*` (untyped byte buffer).
- `MemoryLayout<T>`: Inspects `size` (contiguous bytes), `stride` (distance to next element in array), and `alignment` rules enforced by CPU hardware.

---

### 49. Custom String Interpolation and `ExpressibleByLiteral` protocols.

**In Simple Words:**
- **`ExpressibleByStringLiteral` / `ExpressibleByIntegerLiteral`**: Allows custom types to be initialized directly from literals (`let id: UserID = 1042`).
- **Custom String Interpolation**: Extend `String.StringInterpolation` to create secure, type-safe formatters:
  ```swift
  extension String.StringInterpolation {
    mutating func appendInterpolation(privacy value: String) {
      appendLiteral("***" + value.suffix(4))
    }
  }
  print("SSN: (privacy: ssn)") // "SSN: ***1234"
  ```

---

### 50. Swift Package Manager (SPM): Binary targets, plugins, and dependency resolution.

**In Simple Words:**
SPM is Apple's native dependency manager integrated into Xcode:
- **Binary Targets (`.xcframework`)**: Distributes closed-source, pre-compiled multi-architecture libraries supporting iOS devices, Simulators, and Mac Catalyst in a single bundle.
- **Package Plugins (`BuildToolPlugin`)**: Executes automated code generators (SwiftGen, Sourcery, Protobuf compilers) seamlessly as part of Xcode's native build process.
