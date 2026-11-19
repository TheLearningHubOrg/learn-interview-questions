# Rust & Systems Programming Master Interview Bank (1 - 35)

> Rust ownership model, borrow checker rules, explicit lifetimes ('a), Stack vs Heap memory, Smart Pointers (Box, Rc, Arc, RefCell, Mutex), Interior Mutability, Traits and Dynamic Dispatch (dyn Trait), Error handling (Result, Option, ?), Send & Sync concurrency, Async Rust (Future, Pin, Tokio runtime), Unsafe Rust, and zero-cost abstractions.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Rust's Ownership Model and what are its three fundamental rules?
**In Simple Words:**
Ownership is Rust's unique memory management system that guarantees memory safety without a runtime Garbage Collector:
1. **Rule 1**: Each value in Rust has an **owner** variable.
2. **Rule 2**: There can be **only one owner at a time**.
3. **Rule 3**: When the owner goes out of scope, the value is automatically **dropped and its memory is freed immediately** (`RAII` pattern).

```rust
{
    let s = String::from("hello"); // s is the owner
} // Scope ends: Rust automatically calls drop() and deallocates heap memory!
```

### 2. What is Move Semantics in Rust?
**In Simple Words:**
When assigning a heap-allocated variable to another, Rust **moves ownership** rather than making a deep copy:
- `let s1 = String::from("hello");`
- `let s2 = s1;`
- **Ownership of the heap buffer is transferred to `s2`**.
- Variable `s1` is invalidated by the compiler! Attempting to access `s1` results in a compile-time error: `use of moved value: s1`.
- Prevents double-free memory bugs at compile time with zero runtime cost.

### 3. What is Borrowing and what are the Borrow Checker Rules?
**In Simple Words:**
Instead of transferring ownership, a function or variable can **borrow** a reference using `&`:
- **Rule 1**: You may have **any number of immutable references (`&T`)** to a resource at a given time.
- **Rule 2**: OR you may have **exactly one mutable reference (`&mut T`)** at a given time.
- **Rule 3**: References must **always be valid** (the data cannot be dropped while a reference exists).
- Eliminates Data Races at compile time!

```rust
let mut data = vec![1, 2, 3];
let r1 = &data; // Immutable borrow
let r2 = &data; // OK: Multiple readers
// let r3 = &mut data; // COMPILE ERROR: Cannot borrow as mutable while immutable borrows exist!
```

### 4. What is the difference between the Stack and the Heap in Rust?
**In Simple Words:**
- **Stack**: Fixed-size, contiguous memory allocated in LIFO order:
  - Stores primitive values known at compile time (`i32`, `bool`, `f64`, arrays `[i32; 5]`, references `&T`). Blazing fast allocation/deallocation (adjusts stack pointer).
- **Heap**: Dynamic memory for data whose size can grow at runtime (`String`, `Vec<T>`, `HashMap`):
  - Requires OS syscall to find memory, returns a pointer. Slower allocation.
  - Managed strictly by ownership and smart pointers.

### 5. What is the difference between `Copy` and `Clone` traits?
**In Simple Words:**
- **`Copy` Trait**: Implicit, low-cost bitwise memcpy on the **Stack**:
  - Implemented for fixed-size scalar types (`i32`, `bool`, tuples of Copy types).
  - `let y = x;` copies the bits; `x` remains completely valid.
- **`Clone` Trait**: Explicit deep copy that may duplicate **Heap memory**:
  - Requires calling `.clone()` explicitly (`let s2 = s1.clone();`).
  - Signals to the developer that an expensive heap memory allocation is occurring.

### 6. What are the `Option<T>` and `Result<T, E>` enums?
**In Simple Words:**
Rust does **not have `null` or exceptions**!
- **`Option<T>`**: Represents either a value (`Some(T)`) or absence of a value (`None`):
  - Eliminates the billion-dollar Null Pointer Exception at compile time.
- **`Result<T, E>`**: Represents either success with a value (`Ok(T)`) or failure with an error (`Err(E)`).
- Must be handled exhaustively using `match`, `if let`, or the `?` operator.

```rust
fn divide(numerator: f64, denominator: f64) -> Result<f64, String> {
    if denominator == 0.0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(numerator / denominator)
    }
}
```

### 7. How does the question mark (`?`) operator work in error handling?
**In Simple Words:**
The `?` operator provides ergonomic error propagation:
- If the result is `Ok(val)`, it unwraps and returns `val`.
- If the result is `Err(e)`, it **returns early from the current function immediately**, passing the error up the call stack!
- Automatically converts error types if an implementation of `From` exists.

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut file = File::open("username.txt")?; // Early return on error!
    let mut username = String::new();
    file.read_to_string(&mut username)?;
    Ok(username)
}
```

### 8. What are Rust Enums and Algebraic Data Types (Pattern Matching)?
**In Simple Words:**
Rust enums can hold **associated data** in each variant (Tagged Unions / Sum Types):
```rust
enum WebEvent {
    PageLoad,
    KeyPress(char),
    Paste(String),
    Click { x: i64, y: i64 },
}
```
- Handled exhaustively using `match`: the compiler guarantees every possible enum variant is handled, preventing unhandled edge case bugs.

### 9. What is a Slice (`&[T]` and `&str`)?
**In Simple Words:**
A slice is a two-word view into a contiguous sequence of elements in memory:
- Contains:
  1. A pointer to the starting memory address.
  2. The length of the slice.
- Does not own the underlying data; it is a reference.
- `&str` is a string slice (view into a UTF-8 string buffer); `&[i32]` is a slice of an integer array or vector.

### 10. What are Packages, Crates, and Modules in Cargo?
**In Simple Words:**
- **Module (`mod`)**: Organizes code scope and privacy (`pub`) within a file or folder.
- **Crate**: A compilation unit. Either a **Binary Crate** (compiles to executable, `src/main.rs`) or a **Library Crate** (compiles to reusable dependency, `src/lib.rs`).
- **Package**: A Cargo bundle described by `Cargo.toml` that contains one or more crates.
- **Cargo**: Rust's official package manager, build tool, and test runner.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What are Lifetimes (`'a`) in Rust and why are they needed?
**In Simple Words:**
Lifetimes are compile-time generic annotations that describe **how long a reference remains valid**:
- The borrow checker ensures that references never outlive the data they point to (**Dangling Pointer Prevention**).
- When a function accepts two references and returns a reference, the compiler cannot deduce which input parameter's lifetime the return value is tied to:
```rust
// 'a specifies that the returned reference is valid for as long as
// BOTH input references remain valid:
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```
- Lifetimes have **zero runtime performance overhead**; they are erased during compilation.

### 12. What are the Lifetime Elision Rules?
**In Simple Words:**
In common code patterns, the Rust compiler infers lifetimes automatically without explicit annotations:
1. Each input reference parameter gets its own distinct lifetime parameter (`fn foo<'a, 'b>(x: &'a str, y: &'b str)`).
2. If there is exactly one input reference, its lifetime is assigned to all output references.
3. If there are multiple input references, but one of them is `&self` or `&mut self` (a method), the lifetime of `self` is assigned to all output references.

### 13. What is the `'static` lifetime?
**In Simple Words:**
The `'static` lifetime means the data can **live for the entire duration of the program**:
- String literals (`let s: &'static str = "hello";`) are stored directly in the read-only data segment of the compiled binary file.
- Owned types (`T: 'static`) mean the type does not contain any borrowed references with shorter lifetimes (essential for passing data into multi-threaded `thread::spawn`).

### 14. What is `Box<T>` and when should you use it?
**In Simple Words:**
`Box<T>` is the simplest smart pointer that allocates memory on the **Heap**:
- When the box goes out of scope, its heap data is freed.
- **Primary Use Cases**:
  1. Storing data of unknown size at compile time (e.g. Recursive Data Types like Linked Lists or Abstract Syntax Trees):
     ```rust
     enum List {
         Cons(i32, Box<List>), // Recursive type requires Box!
         Nil,
     }
     ```
  2. Transferring ownership of large data structures without copying thousands of bytes on the stack.
  3. Trait Objects (`Box<dyn Trait>`).

### 15. What are `Rc<T>` and `Arc<T>` (Reference Counting Smart Pointers)?
**In Simple Words:**
Used when multiple owners must share access to the same heap data:
- **`Rc<T>` (Reference Counted)**: Single-threaded shared ownership. Tracks reference count via non-atomic integers (blazing fast, but not thread-safe).
- **`Arc<T>` (Atomic Reference Counted)**: Thread-safe shared ownership. Uses atomic operations (`fetch_add`, `fetch_sub`) to track reference counts safely across multiple OS threads. Higher CPU overhead than `Rc`.

### 16. What is Interior Mutability and how do `RefCell<T>` and `Mutex<T>` work?
**In Simple Words:**
Allows mutating data even when there is an immutable reference (`&T`) to that data:
- **`RefCell<T>` (Single-Threaded)**: Moves borrow checking from **compile-time to runtime**:
  - `borrow()` grants an immutable reference; `borrow_mut()` grants a mutable reference.
  - If borrow rules are violated at runtime, it **panics**!
- **`Mutex<T>` (Multi-Threaded)**: Provides mutual exclusion across threads. A thread must call `lock()` to acquire the lock and access the interior data; the lock automatically releases when the `MutexGuard` goes out of scope.

### 17. What are Traits and the difference between Static Dispatch (`impl Trait`) and Dynamic Dispatch (`dyn Trait`)?
**In Simple Words:**
Traits define shared behavior (interfaces):
- **Static Dispatch (`fn process(item: impl Printable)`)**:
  - Uses **Monomorphization** at compile time. The compiler generates a dedicated, specialized copy of the function for each concrete type.
  - **Zero runtime overhead**, inlines functions, but increases binary size.
- **Dynamic Dispatch (`fn process(item: &dyn Printable)`)**:
  - Uses **Trait Objects** with a **vtable (virtual method table)** at runtime.
  - Slightly slower due to pointer indirection, but allows storing collections of heterogeneous types (`Vec<Box<dyn Widget>>`).

```text
Static vs Dynamic Dispatch:
Static:  process(item: impl Drawable) ──► Compiler generates process_Circle(), process_Square()
Dynamic: process(item: &dyn Drawable)  ──► Runtime vtable lookup: item.vtable->draw()
```

### 18. What are Associated Types vs Generic Parameters in Traits?
**In Simple Words:**
- **Generic Trait (`trait From<T>`)**: Allows a single type to implement the trait **multiple times** for different types (`impl From<u8> for Number`, `impl From<u16> for Number`).
- **Associated Type (`trait Iterator { type Item; }`)**: A type can only implement the trait **once**. Prevents having to annotate the type parameter in every function signature (`Iterator<Item = i32>` vs `Iterator<i32>`).

### 19. What is RAII (Resource Acquisition Is Initialization) and the `Drop` trait?
**In Simple Words:**
In Rust, resource allocation is tied to object lifetime:
- When an object goes out of scope, the compiler automatically invokes its **`Drop` trait**:
  ```rust
  impl Drop for DatabaseConnection {
      fn drop(&mut self) {
          self.close_socket();
          println!("Connection closed safely");
      }
  }
  ```
- Prevents resource leaks: files, sockets, locks, and heap buffers are guaranteed to be closed upon exiting a function, even if a panic occurs!

### 20. What are Closures in Rust and the three Closure Traits (`Fn`, `FnMut`, `FnOnce`)?
**In Simple Words:**
Anonymous functions that can capture their enclosing environment:
1. **`FnOnce`**: Consumes captured variables by value (ownership moved). Can only be called **once**.
2. **`FnMut`**: Mutates captured variables. Can be called multiple times.
3. **`Fn`**: Borrows captured variables immutably. Pure read-only; can be called concurrently.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. What are the `Send` and `Sync` marker traits in Rust Concurrency?
**In Simple Words:**
The foundation of Rust's "Fearless Concurrency":
- **`Send`**: Indicates that ownership of the type can be safely transferred across thread boundaries.
  - Almost all types are `Send`. Exception: `Rc<T>` is NOT `Send` because non-atomic reference count updates cause race conditions!
- **`Sync`**: Indicates that it is safe to share references to the type across multiple threads (`&T` is `Send`).
  - A type is `Sync` if and only if `&T` is thread-safe. `RefCell<T>` is NOT `Sync`; `Mutex<T>` is `Sync`.
- Automatically implemented by the compiler if all struct members are `Send` and `Sync`.

### 22. How does Async Rust work under the hood (The `Future` Trait & Poll Model)?
**In Simple Words:**
Unlike Node.js or C# which use push-based event callbacks:
- **Rust uses a Pull-Based (Poll) Model**:
  - An async function does **zero work** until its `Future` is actively polled:
  ```rust
  pub trait Future {
      type Output;
      fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
  }
  ```
  - Returns `Poll::Ready(result)` when done, or `Poll::Pending` if waiting on I/O.
- **Waker**: When an I/O event completes, the OS driver triggers the `Waker`, signaling the runtime executor (Tokio) to poll the future again!

```text
Rust Async Poll Pipeline:
[Tokio Executor] ──► Calls future.poll(cx) ──► Returns Poll::Pending
                                                     │ (Waiting on I/O)
                                                     ▼
[OS Socket Event] ──► Waker.wake() signals runtime ──► Re-poll future! ──► Returns Poll::Ready(data)
```

### 23. What is `Pin<P>` and why is it required for self-referential async structs?
**In Simple Words:**
When an async function awaits, the compiler compiles the function into a state machine:
- The state machine frequently contains **self-referential pointers** (a pointer to a variable stored in its own stack frame).
- If that struct were moved in memory, the internal pointer would point to the **old invalid memory address**, causing memory corruption!
- **`Pin`**: Wraps a pointer and guarantees that the underlying data **cannot be moved in memory** until it is dropped, preserving memory safety for self-referential futures.

### 24. What is the Tokio Runtime and its Multithreaded Work-Stealing Scheduler?
**In Simple Words:**
Rust does not have a built-in async runtime; **Tokio** is the de facto standard:
- **Work-Stealing Architecture**:
  - Runs a thread pool with one worker thread per CPU core.
  - Each worker thread maintains its own local run queue of tasks.
  - If a worker finishes its tasks, it **steals tasks** from the queues of busier sibling worker threads, maximizing multi-core CPU utilization with minimal global lock contention.

### 25. What is Unsafe Rust and what are the 5 superpowers it unlocks?
**In Simple Words:**
A keyword block (`unsafe { ... }`) that tells the compiler: "Trust me, I have verified the memory invariants myself":
- **The 5 Superpowers**:
  1. Dereferencing raw pointers (`*const T`, `*mut T`).
  2. Calling unsafe functions or foreign C APIs (`extern "C"`).
  3. Implementing unsafe traits (`Send`/`Sync` manually).
  4. Mutating mutable static variables.
  5. Accessing fields of `union`s.
- Safe abstractions (like `Vec`, `String`, and `Mutex`) use small, tightly audited `unsafe` blocks internally to deliver peak bare-metal performance while exposing a 100% safe public API!

### 26. What are Raw Pointers (`*const T` and `*mut T`) vs References (`&T` and `&mut T`)?
**In Simple Words:**
- **References (`&T`, `&mut T`)**: Always guaranteed by the compiler to be non-null, aligned, and pointing to valid data with bounded lifetimes.
- **Raw Pointers (`*const T`, `*mut T`)**: Similar to C pointers:
  - Allowed to be `null` or dangling.
  - Ignore borrowing rules (can have multiple mutable raw pointers to the same address).
  - Can only be dereferenced inside an `unsafe` block.

### 27. What is Zero-Cost Abstractions in Rust?
**In Simple Words:**
> "What you don't use, you don't pay for. And further: what you do use, you couldn't hand code any better." — Bjarne Stroustrup
- High-level abstractions (iterators, closures, pattern matching, async state machines) are compiled down to the **exact same optimized machine code** as handwritten assembly or C loops!
- Writing `vec.iter().map(|x| x * 2).filter(|x| x > 10).sum()` compiles to a single vectorized CPU SIMD loop with zero heap allocation.

### 28. How does Foreign Function Interface (FFI) work between Rust and C?
**In Simple Words:**
Allows calling C libraries from Rust and exposing Rust libraries to C/Python/Node.js:
```rust
// Calling C standard library 'puts' from Rust:
extern "C" {
    fn puts(s: *const std::os::raw::c_char) -> std::os::raw::c_int;
}

fn main() {
    let msg = std::ffi::CString::new("Hello from C FFI").unwrap();
    unsafe {
        puts(msg.as_ptr());
    }
}
```
- Uses `#[no_mangle]` and `extern "C"` to preserve C ABI naming conventions.

### 29. What is the difference between `std::panic!` and `std::process::exit`?
**In Simple Words:**
- **`panic!`**: Triggers stack unwinding by default: traverses the call stack and executes all `drop()` destructors for active variables, releasing memory and closing files safely. Can be caught using `std::panic::catch_unwind()`.
- **`process::exit()`**: Terminates the OS process immediately; **skips all `drop()` destructors**!
- In `Cargo.toml`, you can set `panic = "abort"` to disable unwinding and reduce binary size.

### 30. What is Link-Time Optimization (LTO) in Cargo?
**In Simple Words:**
A compiler optimization technique enabled in release profiles:
- Standard compilation compiles crates into independent object files and links them.
- **LTO (`lto = "fat"`)**: Allows the LLVM compiler to perform optimizations (inlining, dead code elimination, devirtualization) **across crate boundaries**:
  - Significantly reduces binary size.
  - Boosts runtime performance by 10-20% at the expense of longer compilation times.

### 31. How do you implement the Newtype Pattern in Rust?
**In Simple Words:**
Wrapping an existing type in a single-element tuple struct:
```rust
struct UserId(u64);
struct OrderId(u64);
```
- **Benefits**: Guarantees type safety at compile time with **zero runtime memory overhead**!
- Prevents passing a `UserId` into a function expecting an `OrderId`, eliminating common ID-swap bugs.

### 32. What is Type State Pattern in Rust?
**In Simple Words:**
Uses the type system to encode an entity's lifecycle state into compile-time types:
- Example: An HTTP connection that transitions from `Draft` -> `Connected` -> `Sent`:
```rust
struct Draft;
struct Sent;
struct Request<State> { state: State, body: String }

impl Request<Draft> {
    fn send(self) -> Request<Sent> { ... }
}
// Calling send() on an already Sent request is impossible to compile!
```
- Eliminates runtime checks like `if (!isConnected) throw Error()`.

### 33. What are GATs (Generic Associated Types)?
**In Simple Words:**
Allows associated types in traits to have their own generic or lifetime parameters:
```rust
trait LendingIterator {
    type Item<'a> where Self: 'a;
    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>>;
}
```
- Enables streaming iterators that yield references to data owned by the iterator itself, a pattern previously impossible under standard Rust borrow rules!

### 34. What is Miri and how do you test for Undefined Behavior in Rust?
**In Simple Words:**
Miri is an interpreter for Rust's intermediate representation (MIR):
- Runs test suites (`cargo miri test`) and detects:
  - Out-of-bounds memory accesses and buffer overflows.
  - Use-after-free and dangling pointers in `unsafe` code.
  - Data races across concurrent threads.
  - Violations of the Aliasing model (Stacked Borrows).

### 35. When should you choose Rust over Go or C++?
**In Simple Words:**
- **Choose Rust**:
  - High-performance systems where GC pauses are unacceptable (databases, browser engines, blockchain nodes, game engines, OS kernels).
  - WebAssembly (Wasm) modules running in browsers with native speed.
  - Absolute memory safety guarantees where memory bugs represent multi-million dollar security exploits.
- **Choose Go**: Microservices, web APIs, and DevOps tooling where fast compile times, developer onboarding, and simplicity take priority over maximum raw CPU throughput.
`;
