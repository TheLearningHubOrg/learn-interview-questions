# Core Java 21, JVM Internals & Concurrency Master Interview Bank (1 - 35)

> Comprehensive, production-grade technical interview questions covering Core Java 17/21, JVM Memory Model & Garbage Collection (G1/ZGC), Multithreading & Virtual Threads (Project Loom), High-Throughput Concurrency, ClassLoaders, Memory Leak Debugging, NIO.2, and Performance Tuning.

---

## Part 1: Core Language, Memory Model & Collections (1 - 10)

### 1. What are the key differences between the JVM, JRE, and JDK, and what happens during Java bytecode execution?
**In Simple Words:**
- **JDK (Java Development Kit)**: The complete developer SDK containing compiler (`javac`), debugger, monitoring tools (`jcmd`, `jconsole`), and the JRE.
- **JRE (Java Runtime Environment)**: The runtime libraries and the JVM needed to run compiled Java applications.
- **JVM (Java Virtual Machine)**: The abstract computing machine that loads `.class` bytecode files, verifies them, compiles hot execution paths into native machine code via the JIT compiler (Just-In-Time), and executes instructions on the host CPU.

```java
// Execution Flow:
// 1. Source code (OrderService.java)
// 2. Compilation: javac OrderService.java -> OrderService.class (Bytecode)
// 3. ClassLoader: Loading -> Linking (Verification, Preparation, Resolution) -> Initialization
// 4. Execution Engine: Interpreter -> JIT Compiler (C1 / C2) -> Native CPU Instructions
public class OrderService {
    public static void main(String[] args) {
        System.out.println("JVM Bytecode executed on OS: " + System.getProperty("os.name"));
    }
}
```

---

---

### 2. Explain the JVM Memory Model: Heap vs. Stack vs. Metaspace.
**In Simple Words:**
- **Stack Memory**: Thread-private, stores method call frames, primitive local variables, and object references. Allocation and deallocation are instantaneous as methods push and pop.
- **Heap Memory**: Shared across all threads, stores all Java object instances and arrays. Managed by the Garbage Collector (Young Gen: Eden + Survivor S0/S1, and Old/Tenured Gen).
- **Metaspace**: Native OS memory (replacing PermGen in Java 8+) that stores class metadata, method bytecode, and static constant pools. Scales dynamically unless bounded by `-XX:MaxMetaspaceSize`.

```java
public class MemoryDemo {
    // Stored in Heap inside the MemoryDemo instance
    private String instanceData = "Heap Data";

    public void executeProcess() {
        // 'localValue' and the reference 'demoRef' are stored on the thread Stack
        int localValue = 42; 
        MemoryDemo demoRef = new MemoryDemo(); // New object instance allocated on the Heap
    }
}
```

---

---

### 3. How does Garbage Collection work in modern Java (G1GC vs. ZGC)?
**In Simple Words:**
Java GC automatically recovers heap memory allocated to unreferenced objects using mark-and-sweep and copying algorithms:
- **G1GC (Garbage-First GC)**: The default collector since Java 9. Divides the heap into equal-sized regions (1MB to 32MB). It tracks region liveness and collects regions with the most garbage first to meet user-defined pause targets (`-XX:MaxGCPauseMillis=200`).
- **ZGC (Z Garbage Collector)**: A low-latency, scalable collector in Java 17/21 designed for sub-millisecond pauses (`< 1ms`) regardless of heap size (from megabytes to 16TB). It uses colored pointers and load barriers to perform concurrent marking, relocation, and compaction.

```bash
# Production JVM Flags for Low-Latency Spring Boot microservices:
java -XX:+UseZGC -XX:+ZGenerational -Xms4g -Xmx4g -jar app.jar
```

---

---

### 4. What are Virtual Threads in Java 21 (Project Loom), and how do they differ from Platform Threads?
**In Simple Words:**
- **Platform Threads**: 1:1 mapping to Operating System kernel threads. Heavy (~1MB stack), expensive to create, context switching requires OS kernel transition. A server with 5,000 idle platform threads can exhaust system memory.
- **Virtual Threads**: Lightweight user-space threads managed directly by the JVM (M:N mapping). Millions can run concurrently with tiny footprint (~few hundred bytes). When a virtual thread blocks on I/O (database, REST call), the JVM unmounts it from the carrier OS thread and mounts another virtual thread, maximizing throughput without reactive complexity.

```java
// Java 21: Starting 10,000 concurrent Virtual Threads effortlessly:
try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        final int taskId = i;
        executor.submit(() -> {
            Thread.sleep(java.time.Duration.ofMillis(100)); // Non-blocking to carrier thread
            return "Task " + taskId + " complete";
        });
    }
} // Auto-closes and awaits termination
```

---

---

### 5. What are Java Records, Sealed Classes, and Pattern Matching?
**In Simple Words:**
- **Records (Java 16+)**: Immutable data carrier classes that automatically generate `equals()`, `hashCode()`, `toString()`, and private final fields.
- **Sealed Classes (Java 17+)**: Restricts which classes or interfaces may extend or implement them using `permits`, enabling exhaustive compile-time domain modeling.
- **Pattern Matching for Switch (Java 21+)**: Type pattern matching with guard clauses (`when`), replacing ugly chains of `instanceof` casts.

```java
// Domain modeling with Sealed Interface and Records
public sealed interface PaymentStatus permits Approved, Declined, Pending {}

public record Approved(String transactionId, double amount) implements PaymentStatus {}
public record Declined(String reasonCode) implements PaymentStatus {}
public record Pending(long queuedAtTimestamp) implements PaymentStatus {}

// Pattern Matching Switch
public String processPayment(PaymentStatus status) {
    return switch (status) {
        case Approved a when a.amount() > 10_000 -> "Large Approval: " + a.transactionId();
        case Approved a -> "Standard Approval: " + a.transactionId();
        case Declined d -> "Declined: " + d.reasonCode();
        case Pending p -> "Waiting for gateway";
    };
}
```

---

---

### 6. What is the contract between `equals()` and `hashCode()`?
**In Simple Words:**
1. If two objects are equal according to `equals(Object)`, their `hashCode()` must return the identical integer value.
2. If two objects have the same hash code, they are NOT necessarily equal (hash collision).
3. If you override `equals()`, you MUST override `hashCode()`. Failing to do so breaks hash-based collections (`HashMap`, `HashSet`), causing lookups to fail even when the key object exists.

```java
public class UserKey {
    private final String userId;

    public UserKey(String userId) { this.userId = userId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserKey other)) return false;
        return Objects.equals(this.userId, other.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }
}
```

---

---

### 7. How does `HashMap` work internally in Java 8+?
**In Simple Words:**
`HashMap` is an array of buckets (`Node<K,V>[]`).
1. **Put**: Computes `hash(key)`. Uses `(n - 1) & hash` to find bucket index. If empty, inserts node.
2. **Collision**: If bucket is occupied, checks `equals()`. If not equal, appends to linked list.
3. **Treeification (Java 8+)**: If a bucket's linked list length exceeds `TREEIFY_THRESHOLD` (8) and array capacity is at least 64, the linked list converts to a Red-Black Tree (`TreeNode<K,V>`), reducing worst-case lookup from `O(n)` to `O(log n)`.
4. **Resize**: When size exceeds `capacity * loadFactor` (default `0.75`), capacity doubles (e.g., 16 -> 32).

---

---

### 8. What is the difference between `Comparable` and `Comparator`?
**In Simple Words:**
- `Comparable<T>`: Defines natural ordering inside the class itself via `int compareTo(T o)`. Modifies class code.
- `Comparator<T>`: Defines custom, pluggable sorting strategies external to the class via `int compare(T o1, T o2)`.

```java
public record Employee(int id, String name, double salary) implements Comparable<Employee> {
    @Override
    public int compareTo(Employee other) {
        return Integer.compare(this.id, other.id); // Natural order by ID
    }
}

// Custom Comparators using lambdas:
Comparator<Employee> bySalaryDesc = Comparator.comparingDouble(Employee::salary).reversed();
Comparator<Employee> byNameThenSalary = Comparator.comparing(Employee::name)
                                                  .thenComparingDouble(Employee::salary);
```

---

---

### 9. Explain the Java Memory Model (JMM): `volatile` vs. `synchronized` vs. `AtomicReference`.
**In Simple Words:**
- `volatile`: Ensures visibility across CPU core caches and prevents compiler instruction reordering. Writes are immediately flushed to main memory. Does NOT guarantee atomicity for compound operations like `count++`.
- `synchronized`: Ensures mutual exclusion (only one thread enters critical section at a time) AND memory visibility.
- `Atomic*` (e.g. `AtomicInteger`, `AtomicReference`): Non-blocking lock-free thread safety using CPU-level **CAS (Compare-And-Swap)** instructions.

```java
public class CounterDemo {
    private volatile boolean running = true;
    private final AtomicInteger requestCounter = new AtomicInteger(0);

    public void increment() {
        requestCounter.incrementAndGet(); // Lock-free atomic increment
    }

    public void stop() {
        running = false; // Immediately visible to all reading threads
    }
}
```

---

---

### 10. How do Java Streams work, and what is the difference between intermediate and terminal operations?
**In Simple Words:**
A Stream is a sequence of elements supporting functional-style pipeline operations:
- **Intermediate Operations**: Lazy; return a new Stream without executing (e.g., `filter()`, `map()`, `sorted()`, `distinct()`). Execution is deferred until a terminal operation is called.
- **Terminal Operations**: Eager; triggers the processing pipeline and produces a result or side-effect (e.g., `collect()`, `forEach()`, `reduce()`, `count()`, `findFirst()`). Once consumed, a Stream cannot be reused.

```java
List<String> topEarners = employees.stream()
    .filter(e -> e.salary() > 100_000)               // Intermediate (lazy)
    .sorted(Comparator.comparing(Employee::salary).reversed()) // Intermediate
    .map(Employee::name)                              // Intermediate
    .limit(5)                                         // Intermediate
    .collect(Collectors.toList());                    // Terminal (triggers execution)
```

---

---

## Part 2: Advanced Concurrency, Memory & Modern Java Architecture (11 - 24)

### 11. What is the difference between ArrayList and LinkedList, and why is ArrayList almost always preferred?
**In Simple Words:**
- **ArrayList** is backed by a contiguous, resizable array. It provides $O(1)$ constant-time random access by index via direct memory pointer arithmetic.
- **LinkedList** is a doubly linked list where each element is an independent object node holding references to the previous and next nodes. It provides $O(1)$ insertion at head/tail but $O(N)$ traversal for any indexed access.

#### Why ArrayList Outperforms LinkedList in Practice:
1. **CPU Cache Locality (L1/L2/L3)**: Because `ArrayList` stores references in a contiguous block of memory, the CPU hardware prefetcher loads sequential elements into ultra-fast CPU cache lines (64 bytes). `LinkedList` allocates node objects randomly on the heap, resulting in constant CPU cache misses (pointer chasing).
2. **Memory Overhead**: Each node in `LinkedList` consumes 24 bytes of object overhead plus two 8-byte pointers (32 bytes total per node) just to hold a single 8-byte reference. `ArrayList` has zero per-element object overhead.

```java
List<String> arrayList = new ArrayList<>(1000); // Pre-allocated contiguous memory
List<String> linkedList = new LinkedList<>();    // Dispersed heap nodes

// Benchmark insight: Even for middle insertions, copying contiguous memory via System.arraycopy()
// in ArrayList is typically faster than traversing scattered nodes in LinkedList!
```

#### Under the Hood:
When `ArrayList` exceeds capacity, it grows by 50% (`newCapacity = oldCapacity + (oldCapacity >> 1)`) and invokes `Arrays.copyOf()` which delegates to the native CPU instruction `memmove` via `System.arraycopy()`.

---

### 12. How does ConcurrentHashMap achieve high-throughput thread safety without locking the whole map in Java 8+?
**In Simple Words:**
Unlike `Hashtable` or `Collections.synchronizedMap()` which lock the entire map on every read or write, Java 8+ **ConcurrentHashMap** uses **bucket-level fine-grained locking** with **CAS (Compare-And-Swap)** and `synchronized` on the single root node of the target hash bucket.

#### Architectural Mechanics:
1. **Lock-Free Reads**: Read operations (`get()`) are completely lock-free and never block. Value fields and node pointers are declared `volatile`, guaranteeing that writes by other threads are immediately visible.
2. **CAS for Empty Buckets**: When inserting a new key into an empty bucket (`table[i] == null`), it uses lock-free hardware CAS (`sun.misc.Unsafe.compareAndSwapObject`). If no collision occurs, no thread lock is ever acquired.
3. **Synchronized per Bucket**: If a collision occurs (the bucket already has a head node), the writing thread locks *only* that individual head node using Java's built-in `synchronized(node)`. All other buckets remain open for concurrent writes by other threads.

```java
ConcurrentMap<String, Long> userBalances = new ConcurrentHashMap<>();

// Atomic compute operation executed lock-free using CAS retry loops:
userBalances.compute("user_42", (key, oldVal) -> (oldVal == null) ? 100L : oldVal + 50L);
```

#### Treeification:
Just like `HashMap`, if any single bucket experiences more than 8 collisions and the table size reaches 64, that specific bucket transforms from a linked list into a balanced Red-Black Tree (`TreeBin`), preventing hash-flooding DoS attacks ($O(\log N)$ worst-case search).

---

### 13. What is CopyOnWriteArrayList and when should you choose it over synchronized lists?
**In Simple Words:**
A **CopyOnWriteArrayList** is a thread-safe `List` implementation where every write operation (`add`, `set`, `remove`) creates a brand-new internal copy of the underlying array.

#### Ideal Use Case:
- **Read-Heavy, Write-Rare**: Perfect for observer/listener lists, system configuration caches, or routing tables where iterations happen thousands of times per second but mutations happen infrequently.

#### Key Mechanics:
1. **Zero Locking on Iteration**: Iterators operate on an immutable snapshot taken at the exact millisecond the iterator was created. It will **never** throw `ConcurrentModificationException`.
2. **Expensive Writes**: Mutating operations acquire a reentrant lock, allocate an entirely new array of size $N+1$, copy all existing elements, insert the new element, and point the `volatile` array reference to the new array.

```java
CopyOnWriteArrayList<EventListener> listeners = new CopyOnWriteArrayList<>();

// Fast, non-blocking iteration:
for (EventListener listener : listeners) {
    listener.onEvent(event); // Snapshot iteration; no locks, no exceptions!
}
```

---

### 14. How does Type Erasure work in Java Generics and what are its runtime implications?
**In Simple Words:**
**Type Erasure** is the mechanism where the Java compiler enforces type constraints at compile time, but removes (erases) all generic type information when emitting bytecode (.class file). At runtime, generic types like `List<String>` and `List<Integer>` are identical: both are simply the raw type `List`.

#### Why Type Erasure Exists:
To maintain backward compatibility with legacy Java 1.4 codebases when generics were introduced in Java 5 (2004).

#### Runtime Limitations Caused by Erasure:
1. Cannot instantiate generic types directly: `new T()` is illegal.
2. Cannot create generic arrays: `new T[10]` is illegal.
3. Cannot use primitive types in generics: `List<int>` is invalid (must use wrapper `List<Integer>`).
4. Cannot check `instanceof List<String>` (only `instanceof List<?>` is allowed).

```java
// What you write in Java:
List<String> names = new ArrayList<>();
names.add("Alice");
String first = names.get(0);

// What bytecode actually executes (decompiled equivalent):
List names = new ArrayList();
names.add("Alice");
String first = (String) names.get(0); // Compiler injects automatic cast
```

---

### 15. What is the difference between Runnable, Callable, and Future in Java Concurrency?
**In Simple Words:**
- **`Runnable`**: Represents a task that runs asynchronously on a thread. Its `run()` method returns **void** and cannot throw checked exceptions.
- **`Callable<V>`**: Represents an asynchronous computation. Its `call()` method returns a typed value `V` and can throw checked exceptions.
- **`Future<V>`**: Represents the eventual result of an asynchronous computation. It provides methods to inspect if the computation is complete (`isDone()`), cancel it (`cancel()`), or block waiting for the result (`get()`).

```java
ExecutorService executor = Executors.newFixedThreadPool(2);

Callable<Integer> calculationTask = () -> {
    Thread.sleep(100);
    return 42 * 2;
};

Future<Integer> future = executor.submit(calculationTask);
// Blocking get with timeout:
Integer result = future.get(1, TimeUnit.SECONDS);
System.out.println("Computed result: " + result);
executor.shutdown();
```

#### Limitation of Future:
A standard `Future` cannot be chained (no callbacks like `thenApply`) and has no way to combine multiple independent futures without blocking thread resources.

---

### 16. How does CompletableFuture enable non-blocking asynchronous pipelines in Java 8+?
**In Simple Words:**
**`CompletableFuture<T>`** implements `Future<T>` and `CompletionStage<T>`. It allows developers to compose complex asynchronous reactive pipelines with non-blocking callbacks, error recovery, and parallel aggregation without ever calling blocking `.get()`.

#### Core Pipeline Stages:
1. **`thenApply(fn)`**: Transforms the result synchronously when the stage completes ($T \rightarrow U$).
2. **`thenApplyAsync(fn, executor)`**: Dispatches the transformation to a separate thread pool.
3. **`thenCompose(fn)`**: Flattens nested futures ($T \rightarrow \text{CompletableFuture}<U>$), equivalent to monadic flatMap.
4. **`thenCombine(other, biFunction)`**: Executes two futures in parallel and combines both results when both complete.
5. **`allOf(...)`**: Returns a future that completes only when all supplied futures finish.

```java
CompletableFuture.supplyAsync(() -> fetchUser(userId), executor)
    .thenCompose(user -> CompletableFuture.supplyAsync(() -> fetchOrders(user.id()), executor))
    .thenApply(orders -> calculateTotal(orders))
    .exceptionally(ex -> {
        log.error("Failed to calculate order total", ex);
        return BigDecimal.ZERO;
    })
    .thenAccept(total -> updateDashboard(total));
```

---

### 17. How do you correctly configure and size ThreadPoolExecutor in production?
**In Simple Words:**
Never use `Executors.newCachedThreadPool()` (unbounded thread creation causes OOM) or `Executors.newFixedThreadPool()` (unbounded `LinkedBlockingQueue` exhausts memory under load). Always construct **`ThreadPoolExecutor`** explicitly with bounded queues and saturation rejection policies.

#### Key Parameters:
- **`corePoolSize`**: Minimum number of threads kept alive in the pool.
- **`maximumPoolSize`**: Ceiling of threads allowed when work queue fills.
- **`workQueue`**: Bounded queue (e.g., `ArrayBlockingQueue(1000)`).
- **`RejectedExecutionHandler`**: Action when queue and max threads are saturated (`CallerRunsPolicy`, `AbortPolicy`, `DiscardOldestPolicy`).

```java
int cores = Runtime.getRuntime().availableProcessors();
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    cores * 2,                                 // core pool size
    cores * 4,                                 // maximum pool size
    60L, TimeUnit.SECONDS,                     // keep alive for idle threads
    new ArrayBlockingQueue<>(5000),            // bounded task queue
    new ThreadFactoryBuilder().setNameFormat("order-worker-%d").build(),
    new ThreadPoolExecutor.CallerRunsPolicy()  // Backpressure: executes task on caller thread!
);
```

#### Sizing Rule of Thumb:
- **CPU-Bound Tasks**: $N_{\text{threads}} = N_{\text{cores}} + 1$ (avoids CPU context switching).
- **IO-Bound Tasks (Database, HTTP calls)**: $N_{\text{threads}} = N_{\text{cores}} \times (1 + \frac{\text{Wait Time}}{\text{Service Time}})$.

---

### 18. What are Java Reflection and MethodHandles, and why is MethodHandles faster?
**In Simple Words:**
- **Reflection (`java.lang.reflect`)**: Allows code to inspect classes, fields, and methods at runtime and invoke private members dynamically. However, it performs expensive access-permission checks on *every single invocation* and prevents JIT compiler inlining.
- **`MethodHandles` (`java.lang.invoke`)**: Introduced in Java 7, `MethodHandles` provides typed, directly executable references to underlying methods.

#### Why MethodHandles Outperforms Classic Reflection:
1. **One-Time Access Check**: Security and visibility permissions are checked once during lookup (`MethodHandles.Lookup`), not on each execution.
2. **JIT Inlining**: The JVM treats a `MethodHandle` as direct bytecode instructions (`invokevirtual` / `invokespecial`), allowing the JIT compiler to inline the call target just like ordinary direct method invocations.

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType type = MethodType.methodType(String.class, int.class);
MethodHandle handle = lookup.findVirtual(CustomerService.class, "getCustomerName", type);

CustomerService service = new CustomerService();
String name = (String) handle.invokeExact(service, 101);
```

---

### 19. What is the difference between Java IO (Streams) and NIO.2 (Channels, Buffers, Selectors)?
**In Simple Words:**
- **Standard Java IO (`java.io`)**: Stream-oriented and **blocking**. When a thread executes `inputStream.read()`, the thread goes into the blocked state until bytes arrive from the OS socket or disk. One thread is required per connection (Thread-per-Request).
- **Java NIO.2 (`java.nio`)**: Buffer-oriented and **non-blocking**. Channels transfer bytes via native OS buffers, and a single thread can monitor thousands of active network sockets using an OS event demultiplexer (**`Selector`** backed by Linux `epoll` or BSD `kqueue`).

```java
// NIO.2 Non-Blocking Socket Channel:
ServerSocketChannel serverChannel = ServerSocketChannel.open();
serverChannel.bind(new InetSocketAddress(8080));
serverChannel.configureBlocking(false); // Non-blocking mode!

Selector selector = Selector.open();
serverChannel.register(selector, SelectionKey.OP_ACCEPT);

// A single selector thread handles 10,000+ idle client sockets!
```

#### Key Architectural Components:
1. **Buffer**: A contiguous block of memory with `position`, `limit`, and `capacity`.
2. **Channel**: A bidirectional pipe directly to an OS file or network socket.
3. **Selector**: Registers channels to receive notification of ready states (Accept, Connect, Read, Write).

---

### 20. Why is standard Java Serialization considered harmful, and what are modern alternatives?
**In Simple Words:**
Java standard serialization (`implements Serializable`) automatically reconstructs arbitrary object graphs from binary streams without invoking class constructors, creating a massive **remote code execution (RCE) vulnerability vector** known as "deserialization gadget chains".

#### The Core Vulnerability:
Attackers inject serialized payloads containing crafted classes (e.g., Apache Commons Collections gadgets) that execute arbitrary OS commands when `readObject()` triggers method lookups during deserialization.

#### Modern Alternatives:
1. **JSON / Jackson**: Schema-less, human-readable, safe with explicit typing controls.
2. **Protocol Buffers (Protobuf) / gRPC**: Ultra-compact binary format, strict schema enforcement, backward/forward compatibility, and 5x faster than Java serialization.
3. **Apache Avro / Kryo**: High-speed binary serializers widely used in Spark and Kafka data pipelines.

```java
// If you MUST use Java ObjectInputStream, ALWAYS use ObjectInputFilter (Java 9+):
ObjectInputFilter filter = ObjectInputFilter.Config.createFilter(
    "com.mycompany.dto.*;java.base/*;!*" // Whitelist only trusted packages!
);
objectInputStream.setObjectInputFilter(filter);
```

---

### 21. What is the String Constant Pool and how does String.intern() affect heap memory?
**In Simple Words:**
The **String Constant Pool** is a specialized hashtable located in the Java Heap memory. When a string literal like `"hello"` is declared, the JVM checks if an identical string already exists in the pool. If found, it returns the cached reference; otherwise, it creates and stores a new entry.

#### Key Differences:
- `String s1 = "test";` -> Reuses pool reference ($O(1)$ memory).
- `String s2 = new String("test");` -> Forces creation of a distinct new `String` object in normal heap memory.
- `s2.intern()` -> Queries the pool; returns the canonical reference from the pool.

```java
String a = "hello";
String b = new String("hello");
System.out.println(a == b);          // false (different heap memory addresses)
System.out.println(a == b.intern()); // true (intern points to constant pool reference)
```

#### Production Warning on String.intern():
The pool is managed by an internal native hashtable (`-XX:StringTableSize`). Interning millions of unique, high-cardinality strings (like UUIDs) can cause massive lock contention and garbage collection pauses.

---

### 22. What are Strong, Soft, Weak, and Phantom References in Java and how do they interact with GC?
**In Simple Words:**
Java provides four levels of object reachability to give developers control over memory lifecycle:

1. **Strong Reference**: Default reference (`Object obj = new Object()`). As long as an object has a strong reference chain from a GC root, it is **never** collected.
2. **Soft Reference (`SoftReference<T>`)**: Collected **only** when the JVM runs critically low on memory before throwing `OutOfMemoryError`. Ideal for in-memory memory-sensitive caches.
3. **Weak Reference (`WeakReference<T>`)**: Collected eagerly on the **very next GC cycle** if no strong references exist. Ideal for canonical mappings (`WeakHashMap`).
4. **Phantom Reference (`PhantomReference<T>`)**: Used with `ReferenceQueue` to track when an object has been finalized and its memory reclaimed by the OS. Replaced `finalize()` for releasing native, off-heap OS resources.

```java
// Weak reference allows object to be reclaimed on next GC run:
WeakReference<HeavyReport> weakReport = new WeakReference<>(new HeavyReport());
System.gc();
HeavyReport report = weakReport.get(); // Returns null if GC collected it!
```

---

### 23. What are final, finally, and finalize, and why was finalize() deprecated?
**In Simple Words:**
- **`final`**: Keyword indicating immutability. A `final` variable cannot be reassigned; a `final` method cannot be overridden; a `final` class cannot be subclassed.
- **`finally`**: Block following a `try-catch` block that is guaranteed to execute regardless of whether an exception is thrown or caught (except in `System.exit()`).
- **`finalize()`**: Deprecated method on `java.lang.Object` originally intended to clean up resources before an object was garbage-collected.

#### Why finalize() was Deprecated in Java 9 & Removed:
1. **Unpredictable Execution**: The JVM gives zero guarantee on *when* or *if* `finalize()` will run.
2. **Performance Degradation**: Finalizable objects survive multiple GC generations, bloating young generation promotion and causing massive GC pauses.
3. **Object Resurrection**: A poorly written finalizer can reassign `this` to a static variable, resurrecting an already dead object!
4. **Modern Replacement**: Always use **`AutoCloseable`** with `try-with-resources` or **`java.lang.ref.Cleaner`**.

---

### 24. What is Structured Concurrency and Scoped Values in Java 21+?
**In Simple Words:**
**Structured Concurrency** treats multiple tasks running in separate threads as a single unit of work, ensuring that child threads never outlive their parent scope. **Scoped Values** provide a safe, immutable alternative to `ThreadLocal` for sharing data across millions of virtual threads.

#### The Problem with Unstructured Concurrency:
In classic Java, if one subtask fails or times out, sibling threads continue running in the background as orphaned "thread leaks", consuming CPU, memory, and database sockets.

```java
// Structured Concurrency in Java 21+ (Preview):
Response handleRequest() throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
        Supplier<User> userTask = scope.fork(() -> fetchUser());
        Supplier<Order> orderTask = scope.fork(() -> fetchOrder());

        scope.join();           // Join both concurrent subtasks
        scope.throwIfFailed();  // Propagate exception if either subtask failed!

        return new Response(userTask.get(), orderTask.get());
    } // Both virtual threads are guaranteed to be closed here!
}
```

---

## Part 3: JVM Internals, Low-Latency Systems & Production Tuning (25 - 35)

### 25. How does the JIT Compiler work (Tiered Compilation C1 vs C2) and what is Escape Analysis?
**In Simple Words:**
The JVM starts executing code via the **Interpreter** for instant startup. As methods are called thousands of times ("hot spots"), the **JIT (Just-In-Time) Compiler** compiles bytecode directly into native machine code (x86/ARM instructions).

#### Tiered Compilation Architecture:
- **Level 0 (Interpreter)**: Raw bytecode interpretation.
- **Level 1-3 (C1 Client Compiler)**: Fast native compilation with basic optimizations and profiling hooks.
- **Level 4 (C2 Server Compiler)**: Heavy, aggressive native optimizations including loop unrolling, speculative devirtualization, and method inlining.

#### Escape Analysis:
The C2 compiler analyzes whether an object allocated within a method escapes outside its scope (e.g., returned or passed to another thread). If the object **does not escape**:
1. **Scalar Replacement**: The JVM eliminates the heap allocation entirely and maps object fields directly to CPU hardware registers!
2. **Lock Elision**: If a `synchronized` block locks an object that only one thread can ever see, the lock is completely stripped out.

---

### 26. How do you detect, analyze, and resolve a Java Memory Leak using Heap Dumps?
**In Simple Words:**
A Java memory leak occurs when objects are no longer needed by application logic, but remain reachable via an unintended strong reference path from a **GC Root** (e.g., static collections, unclosed listeners, un-cleared `ThreadLocal` variables in pooled threads).

#### Production Diagnostics Workflow:
1. **Capture Heap Dump automatically on OOM**:
   ```bash
   -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/dumps/heap.hprof
   ```
2. **Capture Live Dump manually via `jcmd`**:
   ```bash
   jcmd <pid> GC.heap_dump /var/dumps/manual_dump.hprof
   ```
3. **Analyze using Eclipse MAT (Memory Analyzer Tool)**:
   - Run the **Leak Suspects Report**.
   - Inspect the **Dominator Tree**: Identifies the single object instance retaining the largest retained heap size.
   - Trace the **Path to GC Roots** excluding weak/soft references to discover the exact leak culprit.

---

### 27. What causes 100% CPU spikes in Java applications and how do you diagnose them using Thread Dumps?
**In Simple Words:**
100% CPU spikes in Java are typically caused by:
1. **GC Thrashing**: When the heap is 99% full, GC threads run continuously in an infinite loop trying to free bytes before crashing with `OutOfMemoryError: GC overhead limit exceeded`.
2. **Infinite Loops or Busy-Waiting**: Threads spinning in lock-free CAS loops or bad while loops without yielding.
3. **High Lock Contention**: Thousands of threads battling for synchronized locks causing massive kernel context switching.

#### Fast Production Diagnosis via Linux:
```bash
# 1. Identify the high-CPU OS thread ID:
top -H -p <pid> # Find thread ID (e.g., 4210)

# 2. Convert Thread ID to Hexadecimal:
printf '%x
' 4210 # Output: 1072

# 3. Capture thread dump and grep for the nid (native thread id):
jcmd <pid> Thread.dump | grep -A 30 "nid=0x1072"
```
This pinpointed stack trace reveals the exact line of code consuming the CPU cores.

---

### 28. How does the Java ClassLoader hierarchy work and how does Parent Delegation prevent security breaches?
**In Simple Words:**
Java loads classes dynamically on-demand using a tree of **ClassLoaders**. Under the **Parent Delegation Model**, when a ClassLoader is requested to load a class, it always delegates the request to its parent ClassLoader *first* before searching its own classpath.

#### Hierarchy:
```
Bootstrap ClassLoader (Native C++ core JVM classes: java.lang.*)
       ▲
Platform / Extension ClassLoader (Java modules / extensions)
       ▲
Application / System ClassLoader (Application classpath / JARs)
       ▲
Custom ClassLoaders (Plugin loaders, Web server classloaders)
```

#### Security Protection:
Prevents malicious code from injecting a rogue version of critical classes like `java.lang.String` or `java.lang.System`. Because delegation reaches the Bootstrap ClassLoader first, the official JVM core class is always loaded, rejecting fraudulent user overrides.

---

### 29. Compare G1GC, ZGC, and Shenandoah Garbage Collectors for high-throughput and low-latency systems?
**In Simple Words:**
- **G1GC (Garbage-First)**: The default collector since Java 9. Divides the heap into equal regions (1MB-32MB). Balances throughput and latency with configurable pause targets (`-XX:MaxGCPauseMillis=200`). Suitable for heaps up to 32GB with acceptable 50ms-200ms pauses.
- **ZGC (Z Garbage Collector)**: Low-latency, scalable collector. Performs almost all phases (marking, relocation, reference processing) **concurrently** with application threads. Pauses are guaranteed under **1 millisecond**, regardless of whether the heap is 16MB or 16 Terabytes!
- **Shenandoah**: Ultra-low-latency collector developed by Red Hat. Performs concurrent evacuation using Brooks Pointers / Load Reference Barriers to maintain low pauses.

```bash
# Enable Generational ZGC in Java 21+ for production:
java -XX:+UseZGC -XX:+ZGenerational -Xmx32g -jar app.jar
```

---

### 30. How does the Java Memory Model define happens-before relationships and instruction reordering?
**In Simple Words:**
Modern CPUs and compilers reorder machine instructions aggressively to maximize CPU pipeline execution throughput. The **Java Memory Model (JMM)** defines formal rules called **happens-before** to guarantee that memory writes performed by one thread are predictably visible to other threads.

#### Core Happens-Before Rules:
1. **Program Order Rule**: Each action in a single thread happens-before every subsequent action in that same thread.
2. **Volatile Variable Rule**: A write to a `volatile` variable happens-before every subsequent read of that same variable.
3. **Monitor Lock Rule**: An unlock on a monitor lock happens-before every subsequent lock on that same monitor.
4. **Thread Start Rule**: A call to `Thread.start()` happens-before any action in the started thread.
5. **Transitivity**: If A happens-before B, and B happens-before C, then A happens-before C.

---

### 31. What is the LMAX Disruptor pattern and how does lock-free ring-buffer architecture achieve millions of ops/sec?
**In Simple Words:**
The **LMAX Disruptor** is a high-performance inter-thread messaging library that replaces standard `BlockingQueue` implementations to achieve tens of millions of operations per second with sub-microsecond latency.

#### Why Standard Queues Suffer:
`ArrayBlockingQueue` relies on lock contention between producers and consumers, and generates **False Sharing** where multiple threads invalidate each other's CPU L1/L2 cache lines.

#### Disruptor Innovations:
1. **Circular RingBuffer**: Pre-allocated array of events. No memory allocations or garbage collection during runtime.
2. **Lock-Free Sequencing**: Uses atomic sequence numbers (`AtomicLong` / CAS) to claim slots.
3. **Cache Line Padding**: Inserts unused dummy variables (64 bytes) around sequence counters so that no two counters share the same CPU cache line, eliminating false sharing.

---

### 32. What is the Foreign Function & Memory API (Project Panama) and how does it replace JNI?
**In Simple Words:**
Introduced in Java 22 as a final feature, the **Foreign Function & Memory (FFM) API** allows Java programs to safely interoperate with native C/C++ libraries and allocate off-heap memory without the fragile, unsafe, and slow machinery of **JNI (Java Native Interface)**.

#### Advantages Over JNI:
- **No C Glue Code Required**: Bind directly to native shared libraries (`.so`, `.dll`) purely from Java code.
- **Memory Safety**: `Arena` and `MemorySegment` provide deterministic, bounded off-heap allocation that avoids JVM heap GC overhead while preventing use-after-free and buffer overflow bugs.

```java
Linker linker = Linker.nativeLinker();
SymbolLookup stdlib = linker.defaultLookup();
MethodHandle strlen = linker.downcallHandle(
    stdlib.find("strlen").orElseThrow(),
    FunctionDescriptor.of(ValueLayout.JAVA_LONG, ValueLayout.ADDRESS)
);

try (Arena arena = Arena.ofConfined()) {
    MemorySegment cString = arena.allocateFrom("High-Performance Java");
    long length = (long) strlen.invokeExact(cString);
    System.out.println("C string length: " + length);
} // Native off-heap memory is deterministically freed here!
```

---

### 33. How do you tune JVM flags for containerized microservices in Docker and Kubernetes?
**In Simple Words:**
Historically, the JVM inspected the host physical machine's RAM and CPU cores rather than the Linux cgroups limits set by Docker or Kubernetes, causing pods to be killed by the Linux **OOM Killer**.

#### Essential Container Flags:
```bash
java -XX:+UseContainerSupport \
     -XX:MaxRAMPercentage=75.0 \
     -XX:InitialRAMPercentage=50.0 \
     -XX:+UseZGC -XX:+ZGenerational \
     -XX:+ExitOnOutOfMemoryError \
     -jar app.jar
```

#### Why MaxRAMPercentage=75% (Not 100%):
The JVM process consumes memory beyond the heap:
1. **Metaspace** (loaded class definitions)
2. **Thread Stacks** (1MB per platform thread)
3. **Direct Byte Buffers / Off-Heap Memory** (Netty / NIO)
4. **JIT Code Cache**
Allocating 100% to heap guarantees that the container will breach Kubernetes limits and trigger `OOMKilled` (Exit Code 137).

---

### 34. How do you write reliable micro-benchmarks in Java using JMH (Java Microbenchmark Harness)?
**In Simple Words:**
Never benchmark Java code with `System.currentTimeMillis()` in a simple `for` loop! The JIT compiler optimizes away unused code (Dead Code Elimination), inlines methods dynamically, and distorts results during initial cold interpretation. **JMH** is the official OpenJDK toolchain for measuring nano-second and micro-second execution times accurately.

#### JMH Safeguards:
1. **Warmup Iterations**: Exercises the code to ensure C2 JIT compilation reaches steady state.
2. **`Blackhole`**: Consumes computation results to prevent the JIT from eliminating "dead code".
3. **Forking**: Spawns clean JVM processes to avoid profile pollution from previous runs.

```java
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@State(Scope.Thread)
@Fork(2)
@Warmup(iterations = 3)
public class StringBenchmark {
    @Benchmark
    public void testStringConcat(Blackhole bh) {
        String s = "Hello" + " " + "World";
        bh.consume(s); // Prevents compiler dead-code elimination!
    }
}
```

---

### 35. How does GraalVM Native Image compile Java to standalone native executables and what are its trade-offs?
**In Simple Words:**
**GraalVM Native Image** compiles Java bytecode Ahead-Of-Time (AOT) into a standalone platform-native binary (ELF executable) that includes application code, dependencies, and a stripped-down runtime called **SubstrateVM**.

#### The Massive Benefits:
- **Instant Startup**: Sub-millisecond startup times (e.g., 10ms vs 3-5 seconds for standard JVM).
- **Tiny Memory Footprint**: Runs in as little as 30MB RAM because there is no JIT compiler, bytecode interpreter, or class metadata stored in memory. Perfect for Serverless (AWS Lambda) and autoscaling Kubernetes pods.

#### The Trade-Offs (Closed World Assumption):
1. **No Dynamic ClassLoading**: All reachable classes must be known at build time.
2. **Reflection & Dynamic Proxies Configuration**: Requires explicit JSON reflection configuration metadata.
3. **Peak Throughput**: Long-running JIT compilation with PGO can theoretically achieve higher peak throughput than static AOT compilation because it optimizes against live runtime CPU profile traces.
