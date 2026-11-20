# Kotlin Language, Coroutines & Functional Architecture Master Interview Bank (1 - 35)

> Comprehensive, production-grade technical interview questions covering Kotlin 2.0 Language, Null Safety, Coroutines Architecture, Kotlin Flow, StateFlow vs SharedFlow, Structured Concurrency, K2 Compiler, KSP, and Functional Programming.

---

## Part 1: Core Language, Type System & Syntax (1 - 10)

### 1. What is the difference between `val` and `var` in Kotlin?
**In Simple Words:**
- **`val` (Value)**: Read-only reference (immutable pointer). Once initialized, it cannot be reassigned (similar to `final` in Java or `const` in TypeScript).
- **`var` (Variable)**: Mutable reference. Can be reassigned to different values of the same type.

---

---

### 2. How does Kotlin Coroutines integrate with Android Lifecycles (Dispatchers & Scopes)?
**In Simple Words:**
Coroutines provide lightweight, non-blocking asynchronous programming on Android:
- **Dispatchers**:
  - **`Dispatchers.Main`**: Executes on the Android UI thread. For UI updates and small operations.
  - **`Dispatchers.IO`**: Optimized for disk and network I/O operations (Room queries, Retrofit HTTP calls).
  - **`Dispatchers.Default`**: Optimized for CPU-intensive background computation (parsing large JSON arrays, image filtering).
- **Lifecycle Scopes**:
  - **`viewModelScope`**: Tied to the ViewModel lifecycle; automatically cancels all running coroutines when the ViewModel is cleared, preventing memory leaks!
  - **`lifecycleScope`**: Tied to an Activity or Fragment lifecycle.

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {
    fun fetchUserProfile(userId: String) {
        viewModelScope.launch {
            // Automatically switches to Dispatchers.IO under the hood:
            val user = repository.getUser(userId)
            // Resumes on Dispatchers.Main to update UI state:
            _uiState.value = UserUiState.Success(user)
        }
    }
}
```

---

### 3. What is the difference between `LiveData`, `StateFlow`, and `SharedFlow`?
**In Simple Words:**
- **`LiveData` (Legacy Jetpack)**: Lifecycle-aware observable data holder. Conflates data to latest value, but tightly coupled to Android platform APIs and always runs on the Main thread.
- **`StateFlow` (Modern Standard)**: Kotlin-native hot state holder Flow. Always holds a current value (`stateFlow.value`), conflates emissions, and provides state emissions across all application layers.
- **`SharedFlow`**: Hot event bus Flow without an initial value. Emits one-time events to multiple subscribers (e.g. navigation events, Snackbar toast messages).

---

### 4. How does Kotlin enforce Null Safety at compile-time and what is the bytecode difference for nullable types?
**In Simple Words:**
Kotlin distinguishes between nullable (`String?`) and non-nullable (`String`) types at compile-time. For non-nullable types, the compiler inserts `Intrinsics.checkNotNullParameter()` bytecode checks, eliminating `NullPointerException` (NPE) at runtime.

---

### 5. What are Data Classes in Kotlin and what methods does the compiler automatically generate?
**In Simple Words:**
Declaring `data class` generates: `equals()`, `hashCode()`, `toString()`, `copy()`, and component functions (`component1()`, `component2()`) for destructuring declarations.

---

### 6. How do Extension Functions work under the hood in Kotlin?
**In Simple Words:**
Extension functions do not modify the target class. The compiler translates `fun String.removeSpaces()` into a static method with the receiver instance passed as the first argument (`public static String removeSpaces(String $this)`).

---

### 7. Explain Kotlin Scope Functions: let, run, with, apply, and also?
**In Simple Words:**
- **`apply`**: Context is `this`, returns context object (ideal for object initialization).
- **`also`**: Context is `it`, returns context object (ideal for side-effects/logging).
- **`let`**: Context is `it`, returns lambda result (ideal for null-checks `?.let`).
- **`run`**: Context is `this`, returns lambda result (ideal for computation on object).
- **`with`**: Non-extension function taking object as argument, returns lambda result.

---

### 8. What is Smart Casting in Kotlin and when does the compiler fail to smart cast?
**In Simple Words:**
After an `is` type check or `!= null` check, Kotlin automatically casts the variable. It fails if the variable is a mutable `var` accessible by other threads or custom getters.

---

### 9. What are Sealed Classes and Sealed Interfaces and how do they enable exhaustive when checks?
**In Simple Words:**
Sealed hierarchies restrict subclassing to the same package and compilation module. The compiler guarantees that all possible subclasses are known, allowing `when` expressions to be exhaustive without an `else` branch.

---

### 10. How does Inlining work with inline, noinline, and crossinline in Kotlin?
**In Simple Words:**
Passing lambdas creates function object allocations on the heap. Marking a higher-order function `inline` copies the function body and lambda body directly into the call site, eliminating heap allocations. `noinline` excludes specific parameters from inlining; `crossinline` forbids non-local returns inside nested contexts.

---


---

## Part 2: Coroutines, Flow & Concurrency Architecture (11 - 24)

### 11. How do Delegated Properties work in Kotlin (by lazy, by observable, and custom delegates)?
**In Simple Words:**
Property delegation delegates `getValue()` and `setValue()` to an external helper object via the operator convention. `lazy` thread-safely defers computation until first property access.

---

### 12. Explain Generics Variance in Kotlin: Declaration-site variance (out / in) vs Java wildcard variance?
**In Simple Words:**
Instead of specifying variance on every method call like Java (`? extends T`), Kotlin uses **declaration-site variance**: `out T` (producer/covariant) or `in T` (consumer/contravariant) on the interface definition directly.

---

### 13. What are Reified Type Parameters (inline fun <reified T>) in Kotlin and how do they bypass type erasure?
**In Simple Words:**
Because inlined functions copy bytecode directly to the call site, marking a type parameter `reified` allows the compiler to inject the concrete class literal (`T::class.java`) directly into the calling bytecode, bypassing JVM type erasure!

---

### 14. How do Suspend Functions work internally using Continuation-Passing Style (CPS) and State Machines?
**In Simple Words:**
The Kotlin compiler transforms every `suspend` function by adding an implicit hidden parameter: `Continuation<T>`. It generates an internal state machine class with a switch statement where each suspension point becomes a state label, allowing the thread to resume execution seamlessly.

---

### 15. What is Structured Concurrency in Kotlin Coroutines and how does cancellation propagate?
**In Simple Words:**
Coroutines are organized in a parent-child hierarchy. If a parent coroutine is cancelled, all child coroutines are automatically cancelled. If a child fails with an exception, it cancels the parent and siblings (unless running in a `SupervisorJob`).

---

### 16. Compare CoroutineScope vs SupervisorScope vs coroutineScope?
**In Simple Words:**
- **`coroutineScope`**: Standard scope. Failure of any child cancels the scope and all other children immediately.
- **`supervisorScope`**: Failure of a child does not cancel siblings or the scope; children manage their own failures independently.

---

### 17. What is the difference between Dispatchers.Default, Dispatchers.IO, and Dispatchers.Main?
**In Simple Words:**
- **`Dispatchers.Default`**: Sized to CPU core count ($N$ threads). For CPU-intensive tasks (sorting, JSON parsing).
- **`Dispatchers.IO`**: Dynamically scales up to 64 threads. For blocking I/O (files, network, database).
- **`Dispatchers.Main`**: Single UI thread on Android.

---

### 18. What is Kotlin Flow and how do Cold Streams differ from Hot Streams?
**In Simple Words:**
- **Cold Stream (`Flow`)**: Does not produce items until a terminal operator (`collect`) is called. Each collector starts an independent execution.
- **Hot Stream (`StateFlow`, `SharedFlow`)**: Produces items regardless of whether subscribers are currently listening.

---

### 19. What is the difference between StateFlow, SharedFlow, and Channels in Kotlin?
**In Simple Words:**
- **`StateFlow`**: Hot state holder that always has a current value and emits updates to collectors (conflates duplicate values).
- **`SharedFlow`**: Hot event stream that can broadcast one-time events to multiple subscribers with configurable replay buffers.
- **`Channel`**: Point-to-point communication where each value is delivered to exactly one consumer.

---

### 20. How does Backpressure handling work in Kotlin Flow (buffer, conflate, collectLatest)?
**In Simple Words:**
- **`buffer()`**: Runs emissions concurrently with collector in a separate buffer.
- **`conflate()`**: Drops intermediate emissions if collector is too slow, delivering only the newest item.
- **`collectLatest()`**: Cancels the current collector block and restarts it whenever a new value arrives.

---

### 21. What is the Kotlin 2.0 K2 Compiler and what architectural improvements does it bring?
**In Simple Words:**
The **K2 Compiler** completely rewrites the compiler frontend into a unified pipeline (FIR - Frontend Intermediate Representation), doubling compilation speed and bringing consistent type inference across JVM, JS, and Native targets.

---

### 22. How does Kotlin Multiplatform (KMP) share business logic across iOS and Android?
**In Simple Words:**
KMP compiles common Kotlin business logic (networking, databases, models) into JVM bytecode for Android and native Objective-C/Swift frameworks for iOS using `expect` and `actual` declarations for platform-specific capabilities.

---

### 23. What is Kotlin Symbol Processing (KSP) and why is it 2x faster than KAPT?
**In Simple Words:**
**KAPT** converts Kotlin code into Java stubs so Java annotation processors can run, which takes substantial build time. **KSP** inspects Kotlin AST directly without generating Java stubs.

---

### 24. What are Inline Value Classes (@JvmInline value class) and how do they eliminate heap allocations?
**In Simple Words:**
Wraps a single primitive or value in a type-safe domain wrapper (e.g. `@JvmInline value class UserId(val id: Long)`). The compiler inlines the underlying primitive directly in bytecode, providing zero-overhead type safety.

---


---

## Part 3: K2 Compiler, KMP, Advanced Metaprogramming & Optimization (25 - 35)

### 25. How do you build Type-Safe DSLs in Kotlin using Lambda with Receiver and @DslMarker?
**In Simple Words:**
Lambdas with receiver (`HTML.() -> Unit`) allow method calls within closures without explicit object references. `@DslMarker` prevents inner scopes from calling outer receiver methods accidentally.

---

### 26. What is Cooperative Cancellation in Coroutines and how does yield() / ensureActive() work?
**In Simple Words:**
Coroutine cancellation is cooperative: if a coroutine executes a tight CPU loop without calling suspending functions, it will not stop. Call `ensureActive()` or `yield()` periodically to check the cancellation flag.

---

### 27. How does Exception Handling work in Coroutines and why does try-catch around launch fail?
**In Simple Words:**
`launch` fires an asynchronous task; exceptions are delivered to the `CoroutineExceptionHandler` or parent job, not caught by outer synchronous `try-catch`. Use `async` with `.await()` or attach a `CoroutineExceptionHandler` to capture exceptions.

---

### 28. What are Operator Overloading conventions in Kotlin?
**In Simple Words:**
Functions marked with `operator` override standard language operators: `plus()` for `+`, `get()` for `[]`, `contains()` for `in`, `invoke()` for `()`.

---

### 29. How does Const Val differ from Val in Kotlin?
**In Simple Words:**
- **`const val`**: Compile-time constant inlined directly at bytecode call sites; must be primitive or String at top-level/object.
- **`val`**: Runtime immutable reference; can be assigned from function calls.

---

### 30. When should you choose Kotlin over Java for enterprise backend microservices?
**In Simple Words:**
Choose Kotlin for backend microservices to eliminate null pointer bugs at compile time, leverage coroutines for high-throughput asynchronous execution, and achieve cleaner domain models with less boilerplate.

---

### 31. What is the difference between Array<T> and primitive arrays like IntArray in Kotlin?
**In Simple Words:**
- **`Array<Int>`**: Maps to Java's `Integer[]` reference array on the JVM, incurring boxing overhead for every element.
- **`IntArray` / `ByteArray`**: Maps directly to native primitive Java `int[]` on the JVM, storing values unboxed in contiguous memory with zero allocation overhead.

---

### 32. How does Tailrec Optimization (tail-call elimination) work in Kotlin?
**In Simple Words:**
Marking a recursive function with the `tailrec` modifier informs the compiler to optimize recursive calls into an iterative `while` loop in bytecode, preventing `StackOverflowError` even for millions of recursions.

---

### 33. How does kotlinx.serialization differ from reflection-based serializers like Gson or Jackson?
**In Simple Words:**
`kotlinx.serialization` uses a compiler plugin to generate strongly typed serializer and deserializer classes at compile time, eliminating runtime reflection overhead and supporting JSON, Protocol Buffers, and CBOR across all KMP platforms.

---

### 34. What is runCatching and Result<T> in Kotlin and how does it compare to try-catch?
**In Simple Words:**
`runCatching { ... }` executes a block and encapsulates the outcome into an inline `Result<T>` value. It enables functional chaining via `map`, `recover`, and `onFailure` without throwing unhandled exceptions.

---

### 35. How does Kotlin Reflection (kotlin-reflect) work and what is its performance overhead?
**In Simple Words:**
Kotlin reflection via `KClass`, `KProperty`, and `KFunction` reads Kotlin-specific metadata annotations (`@Metadata`) stored in compiled class bytecode. Because the `kotlin-reflect.jar` adds ~2.5MB and has runtime lookup costs, compile-time alternatives like KSP or Source Generators are strongly preferred in performance-critical code.
