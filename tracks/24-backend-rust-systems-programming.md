# Rust Systems Programming, Concurrency & High-Performance Web Services Master Interview Question Bank (1 - 50)

> Comprehensive, production-grade technical interview questions and architectural deep-dives covering Rust (Ownership, Borrow Checker, Lifetimes, Smart Pointers, Tokio Async Runtime, Axum Web, Fearless Concurrency, and Zero-Cost Abstractions).

---

## Part 1: Ownership, Borrowing & Lifetimes (1 - 15)

### 1. What is the Rust Ownership Model, and how does it guarantee Memory Safety without a Garbage Collector?
**In Simple Words:**
Rust achieves memory safety at compile time through three non-negotiable **Ownership Rules**:
1. Each value in Rust has an **owner** variable.
2. There can only be **one owner at a time**.
3. When the owner goes out of scope, the value is automatically dropped (freed from memory via the `Drop` trait, similar to C++ RAII).

Because memory reclamation is deterministic and planned entirely at compile time, Rust eliminates:
- Dangling pointers.
- Double-free bugs.
- Memory leaks caused by forgotten frees.
- Runtime Garbage Collection stop-the-world pauses.

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // MOVE occurs! s1 is invalidated, ownership transferred to s2.
    // println!("{}", s1); // COMPILE ERROR: value borrowed here after move!
    println!("{}", s2);
}
```

### 2. Explain the Borrow Checker Rules: Shared References (`&T`) vs. Mutable References (`&mut T`).
**In Simple Words:**
You can borrow references to a value without transferring ownership, governed by the **Aliasing XOR Mutability** rule:
At any given point in time, you can have:
- **EITHER** any number of immutable references (`&T`) to a resource.
- **OR** exactly one mutable reference (`&mut T`).
- **NEVER BOTH SIMULTANEOUSLY**.

This compile-time rule mathematically eliminates **Data Races**: a data race requires concurrent access where at least one thread is writing. By preventing aliasing while writing, data races are impossible in safe Rust.

### 3. What are Rust Lifetimes (`'a`), and how does the compiler prevent Dangling References?
**In Simple Words:**
A **Lifetime** is the scope for which a reference is valid. The compiler's borrow checker compares the lifetime of a reference against the lifetime of the underlying data to guarantee the data is never dropped while a reference still points to it.

**Lifetime Annotations**:
Do not change how long a value lives; they describe the relationship between lifetimes of multiple references to help the compiler verify safety:

```rust
// Explicit lifetime 'a: the returned reference lives as long as the SHORTEST of x and y
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

### 4. Smart Pointers in Rust: `Box<T>`, `Rc<T>`, `Arc<T>`, and `RefCell<T>`.
**In Simple Words:**
- **`Box<T>`**: Heap allocation. Stores a value on the heap with a pointer on the stack. Single ownership. Used for recursive types (linked lists, AST nodes) whose size is unknown at compile time.
- **`Rc<T>` (Reference Counted)**: Shared ownership on the heap in single-threaded code. Increments count on `clone()`, drops when count hits zero.
- **`Arc<T>` (Atomic Reference Counted)**: Thread-safe shared ownership across multiple threads using atomic operations.
- **`RefCell<T>`**: Interior mutability in single-threaded code. Moves borrow check rules from compile-time to **runtime** (panics if multiple mutable borrows occur).

### 5. What is the difference between `String` and `&str` in Rust?
**In Simple Words:**
- **`String`**: Heap-allocated, growable, owned UTF-8 byte buffer (`pointer`, `len`, `cap`).
- **`&str` (String Slice)**: An immutable borrow/view pointing to a sequence of UTF-8 bytes located anywhere (in binary static memory `"hello"`, on the heap, or on the stack). Always accept `&str` as function arguments for maximum flexibility.

---

## Part 2: Traits, Generics & Error Handling (16 - 32)

### 6. Explain Error Handling in Rust: `Result<T, E>`, `Option<T>`, and the `?` Operator.
**In Simple Words:**
Rust has no exceptions. Errors are typed enum values:
- **`Option<T>`**: Represents presence (`Some(T)`) or absence (`None`).
- **`Result<T, E>`**: Represents success (`Ok(T)`) or recoverable failure (`Err(E)`).
- **The `?` Operator**: Unwraps an `Ok(T)` or returns early from the surrounding function with the `Err(E)`, automatically converting error types via the `From` trait.

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("username.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
```

### 7. Static Dispatch vs. Dynamic Dispatch: `impl Trait` vs. `dyn Trait` (vtable).
**In Simple Words:**
- **Static Dispatch (`impl Trait` / Generics with Trait Bounds)**:
  - Compiler generates a specialized copy of the function for each concrete type (**Monomorphization**).
  - Fast: zero runtime overhead, enables inlining.
  - Can slightly increase binary size.
- **Dynamic Dispatch (`Box<dyn Trait>`)**:
  - Resolves methods at runtime via a fat pointer containing a **vtable (virtual method table)** pointer.
  - Slower: involves pointer indirection and inhibits compiler inlining, but allows storing heterogenous collections of different types implementing the same trait.

### 8. What is the `Drop` Trait and RAII (Resource Acquisition Is Initialization)?
**In Simple Words:**
The `Drop` trait provides a `drop(&mut self)` method executed automatically when an object leaves scope.
Used to release file handles, close network sockets, unlock mutexes, and free heap memory deterministically. You cannot call `val.drop()` manually (to prevent double-free); call `std::mem::drop(val)` to drop early.

---

## Part 3: Concurrency & The Tokio Async Runtime (33 - 50)

### 9. Fearless Concurrency in Rust: `Send` and `Sync` Marker Traits.
**In Simple Words:**
- **`Send`**: Indicates ownership of the type can be transferred across thread boundaries safely.
- **`Sync`**: Indicates it is safe to share references to the type (`&T`) across multiple threads simultaneously (`T` is `Sync` if and only if `&T` is `Send`).
- Automatically implemented by the compiler: if all fields of a struct are `Send` and `Sync`, the struct is `Send` and `Sync`.
- `Rc<T>` is NOT `Send` (its reference count is non-atomic); the compiler physically refuses to compile code attempting to pass an `Rc` to another thread!

### 10. How do Async/Await and Futures work internally in Rust?
**In Simple Words:**
Unlike JavaScript (where promises execute immediately on creation), **Rust Futures are LAZY**:
- A Future does nothing until it is explicitly polled via `poll(cx)` or driven to completion by an **Async Runtime** (like **Tokio**).
- When a future cannot progress (e.g. waiting for a network socket), it registers a `Waker` and returns `Poll::Pending`.
- When the socket becomes readable, the OS notifies the runtime via epoll/kqueue, the waker awakens the task, and the runtime schedules it on an available worker thread.
- Compiled into a **Zero-Allocation State Machine**.

```rust
// High-performance HTTP handler in Axum (Tokio-based)
use axum::{routing::get, Router};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(|| async { "Hello, High-Performance Rust!" }));
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    axum::serve(tokio::net::TcpListener::bind(&addr).await.unwrap(), app)
        .await
        .unwrap();
}
```

### 11. What is `unsafe` Rust, and when is it justified?
**In Simple Words:**
`unsafe` gives the programmer superpower by disabling 5 borrow checker checks:
1. Dereferencing raw pointers (`*const T`, `*mut T`).
2. Calling unsafe functions or foreign C functions (FFI).
3. Implementing unsafe traits.
4. Mutating mutable static variables.
5. Accessing fields of a `union`.

*Justification*: Building foundational high-performance primitives (e.g. `Vec`, `Arc`, hardware drivers, OS kernels). Safe Rust code wraps unsafe primitives in a bulletproof, 100% safe public API!
