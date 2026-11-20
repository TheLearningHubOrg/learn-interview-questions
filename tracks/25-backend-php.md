# Modern PHP, Zend Engine Internals & Scalable Web Architecture Master Interview Bank (1 - 35)

> Comprehensive, production-grade technical interview questions covering Modern PHP 8.3+, Zend Engine Architecture, zval Memory Layout, Reference Counting & GC, OPcache, JIT Compiler, Fibers, SPL, and Production Tuning.

---

## Part 1: Core Language, Execution Lifecycle & Types (1 - 10)

### 1. How does the PHP Execution Lifecycle work (SAPI, FastCGI, and PHP-FPM)?
**In Simple Words:**
PHP does not run as a continuous in-memory application server by default. Instead, it follows a **Share-Nothing Architecture** where each incoming HTTP request executes in an isolated process/thread, initializes state, runs code, and completely destroys all memory on request termination.

#### Lifecycle Stages:
1. **Module Init (MINIT)**: Triggered once when PHP-FPM starts. Loads extensions and registers persistent constants.
2. **Request Init (RINIT)**: Triggered for every incoming HTTP request. Allocates request memory pool and initializes `$_GET`, `$_POST`, and `$_SERVER`.
3. **Execution**: The Zend VM executes compiled opcodes.
4. **Request Shutdown (RSHUTDOWN)**: Cleans up user-defined objects, runs output buffering flushes, and frees request memory.
5. **Module Shutdown (MSHUTDOWN)**: Triggered when PHP-FPM stops.

---

### 2. What are the major language features introduced in modern PHP 8.0 through 8.3?
**In Simple Words:**
Modern PHP is a strictly typed, high-performance object-oriented language.

#### Key Highlights:
- **PHP 8.0**: JIT Compiler, Union Types, Attributes (annotations), Named Arguments, Match Expression, Constructor Property Promotion, Nullsafe Operator (`?->`).
- **PHP 8.1**: Enums (Pure & Backed), Readonly Properties, Fibers (lightweight concurrency), First-class Callable Syntax, Intersection Types.
- **PHP 8.2**: Readonly Classes, DNF Types (Disjunctive Normal Form), True/False/Null standalone types.
- **PHP 8.3**: Typed Class Constants, Deep Cloning of Readonly properties, dynamic class constant fetch.

---

### 3. Explain the PHP Type System: Union Types, Intersection Types, and DNF Types?
**In Simple Words:**
- **Union Types (`A|B`)**: Accepts either type A or type B.
- **Intersection Types (`A&B`)**: Accepts a value that must implement *both* type A and type B simultaneously.
- **DNF Types (`(A&B)|C`)**: Disjunctive Normal Form allows combining intersection types wrapped in unions.

```php
// DNF Type: Accepts either a Loggable entity with ArrayAccess OR null:
function process((Loggable & ArrayAccess) | null $data): void {
    if ($data !== null) {
        $data->log();
    }
}
```

---

### 4. What is Constructor Property Promotion in PHP 8+ and how does it reduce boilerplate?
**In Simple Words:**
Declares class visibility and types directly in the constructor arguments, automatically assigning them to class properties.

```php
class OrderDTO {
    public function __construct(
        public readonly string $orderId,
        public readonly int $amount,
        public readonly ?string $notes = null
    ) {}
}
```

---

### 5. How does the Match Expression differ from the classic Switch Statement?
**In Simple Words:**
1. **Strict Type Comparison**: `match` uses identity checks (`===`), whereas `switch` uses loose coercion (`==`).
2. **Returns a Value**: `match` is an expression that returns a value directly.
3. **No Break Required**: No fallthrough bugs; execution stops once a pattern matches.
4. **Exhaustiveness**: Throws `UnhandledMatchError` if an unhandled case is encountered and no `default` is provided.

---

### 6. What are PHP Attributes and how do they replace DocBlock annotations?
**In Simple Words:**
Attributes (`#[Attribute]`) provide native, structured, compile-time metadata on classes, methods, and properties. Unlike docblocks (`/** @Route(...) */`), attributes are first-class language constructs parsed by the Zend Engine rather than parsed through regex strings.

---

### 7. How does String handling work in PHP and what is the difference between single and double quotes?
**In Simple Words:**
- **Single Quotes (`'text'`)**: String is parsed as a pure literal. No variable interpolation or escape sequence processing (except \' and \\). Fast parsing.
- **Double Quotes (`"text"`)**: Evaluates variable expressions (`"Hello $name"`) and escape characters (`\n`, `\t`).

---

### 8. How do PHP Arrays work internally as ordered hash tables (zval buckets)?
**In Simple Words:**
A PHP array is not a simple C array; it is a **HashTable** that preserves insertion order. Each element is stored in a `Bucket` containing the hash, string key or integer index, and a `zval` representing the value.

---

### 9. What are Magic Methods in PHP and what are their performance impacts?
**In Simple Words:**
Magic methods (e.g., `__construct`, `__get`, `__set`, `__call`, `__invoke`, `__clone`) allow classes to intercept operations. However, `__get` and `__call` bypass OPcache direct property lookups, adding slight CPU overhead.

---

### 10. How does the Error and Throwable hierarchy work in modern PHP?
**In Simple Words:**
All exceptions and fatal errors implement the **`Throwable`** interface.
- **`Exception`**: Base class for developer-handled application exceptions.
- **`Error`**: Base class for internal engine fatal errors (e.g., `TypeError`, `ParseError`, `DivisionByZeroError`), allowing fatal engine issues to be caught in `try/catch` blocks.

---


---

## Part 2: Zend Engine Internals, OPcache & Memory Architecture (11 - 24)

### 11. Explain the Zend VM architecture and the zval memory layout?
**In Simple Words:**
Every variable in PHP is represented by an internal C struct called **`zval`** (Zend Value). In PHP 7+, `zval` was redesigned down to 16 bytes. Simple types (integers, floats, booleans) are stored inline directly inside the 16-byte struct, avoiding secondary heap allocations.

---

### 12. How does Reference Counting and the Circular Reference Garbage Collector work in PHP?
**In Simple Words:**
Complex values (strings, arrays, objects) maintain a `refcount` field. When variable assignments point to an object, `refcount` increments; when variables go out of scope, it decrements. When `refcount` hits 0, memory is freed immediately.

#### Circular References:
If object A references B and B references A, their refcounts never reach 0. PHP uses a **Root Buffer Cycle Collector** (runs every 10,000 suspect objects) that runs a trial deletion to detect and free circular memory islands.

---

### 13. How does OPcache work and what are the best production configuration settings?
**In Simple Words:**
PHP compiles script files into **opcodes** (virtual machine instructions). Without OPcache, every HTTP request recompiles all PHP files from scratch. **OPcache** stores compiled opcodes in shared memory, allowing PHP to execute instructions directly with zero parsing overhead.

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0 ; Never check file timestamps in production!
opcache.save_comments=1
```

---

### 14. What is the PHP 8 JIT (Just-In-Time) Compiler and when does it improve performance?
**In Simple Words:**
The **JIT Compiler** compiles frequently executed opcodes into native x86/ARM CPU machine instructions.

#### Reality Check:
- **CPU-Bound Code (Math, AI, 3D rendering, compression)**: 2x to 5x faster.
- **Typical Web Apps (Laravel, WordPress)**: Negligible speedup because real-world web apps are I/O bound (database, network sockets, file reads), not CPU-bound.

---

### 15. What are PHP Fibers and how do they enable Cooperative Multitasking?
**In Simple Words:**
**Fibers** are lightweight, stackful coroutines that allow an execution stack to be paused (`Fiber::suspend()`) and resumed later (`$fiber->resume()`) without blocking the underlying thread. They form the foundation for asynchronous frameworks like Revolt, Amp, and Swoole.

---

### 16. How do Generators and the yield keyword enable memory-efficient streaming of large datasets?
**In Simple Words:**
Standard functions return a complete collection, loading millions of records into memory at once. A **Generator** yields values one at a time on demand, consuming a flat constant amount of memory ($O(1)$ RAM).

```php
function streamCsvRows(string $filePath): Generator {
    $handle = fopen($filePath, 'r');
    while (($row = fgetcsv($handle)) !== false) {
        yield $row; // Yields one row; does not load 10GB file into RAM!
    }
    fclose($handle);
}
```

---

### 17. What are SPL (Standard PHP Library) Data Structures and when should you use them over arrays?
**In Simple Words:**
PHP arrays are general-purpose ordered maps. SPL provides specialized data structures that consume less memory:
- **`SplFixedArray`**: Contiguous C array; uses 50% less RAM than a standard array.
- **`SplQueue` / `SplStack`**: Fast FIFO/LIFO operations with $O(1)$ push/pop.

---

### 18. What is a WeakMap in PHP 8 and how does it prevent memory leaks in caching?
**In Simple Words:**
A **`WeakMap`** holds references to object keys without preventing the Garbage Collector from freeing them. When the object key is destroyed, its corresponding entry in the WeakMap is automatically removed.

---

### 19. How does Composer Autoloading and PSR-4 work under the hood?
**In Simple Words:**
**PSR-4** maps namespace prefixes to relative directory paths. Composer generates an internal class map file (`vendor/composer/autoload_classmap.php`). In production, running `composer dump-autoload -o` creates an authoritative $O(1)$ array lookup, eliminating filesystem lookups entirely.

---

### 20. What are PHP Streams and Stream Wrappers?
**In Simple Words:**
Streams generalize file, network, and data operations into a uniform interface (`fopen('s3://bucket/key')`, `fopen('php://memory')`). Custom Stream Wrappers allow applications to transparently read/write to custom cloud protocols without altering code.

---

### 21. How does PHP handle Cryptography using the libsodium extension?
**In Simple Words:**
PHP 7.2+ bundles **libsodium** as the core cryptographic engine. It provides modern primitives that are resilient against timing attacks (`sodium_crypto_secretbox`, `sodium_crypto_pwhash` using Argon2id).

---

### 22. What are Readonly Classes and Properties and what guarantees do they provide?
**In Simple Words:**
A `readonly` property can only be initialized once within its declared scope and can never be mutated afterward. Declaring `readonly class` enforces immutability across all instance properties.

---

### 23. What is the First-Class Callable Syntax in PHP 8.1+?
**In Simple Words:**
Using `$this->method(...)` creates an anonymous `Closure` object referencing the callable directly, replacing fragile string/array callables like `[$this, 'method']`.

---

### 24. How does Session Locking in PHP-FPM affect concurrent user requests?
**In Simple Words:**
When `session_start()` is invoked, PHP locks the session file on disk. Any subsequent concurrent AJAX requests from the same user stall until the first request completes or calls `session_write_close()`.

---


---

## Part 3: Production Tuning, Asynchronous Workers & High Scale (25 - 35)

### 25. How do you correctly configure and tune PHP-FPM process managers (static vs dynamic)?
**In Simple Words:**
For high-traffic production environments with dedicated RAM, use **`pm = static`** to avoid the process spawning/destroying overhead of `dynamic`.

```ini
pm = static
pm.max_children = 100 ; RAM_Available / Average_PHP_Process_Size (e.g. 8GB / 60MB = ~120)
pm.max_requests = 1000 ; Prevents long-term memory leaks by recycling workers
```

---

### 26. How do you detect and diagnose memory leaks in long-running PHP CLI workers?
**In Simple Words:**
Because PHP was designed to discard memory after each web request, long-running CLI daemons (queue workers) frequently suffer from memory leaks caused by unbounded static collections and event listener registrations.

#### Prevention:
- Track usage with `memory_get_usage(true)`.
- Regularly cycle worker processes after processing $N$ jobs.

---

### 27. What is OPcache Preloading and how does it optimize enterprise framework startup?
**In Simple Words:**
Introduced in PHP 7.4, **OPcache Preloading** compiles specified PHP files into memory once on server startup and keeps all their classes and functions permanently available to all requests without ever calling `require` or `include`.

---

### 28. How do you write performant asynchronous microservices in PHP using Swoole or RoadRunner?
**In Simple Words:**
Application servers like **RoadRunner** (written in Go) or **Swoole** (C++ extension) run PHP as a persistent in-memory process, bypassing the PHP-FPM bootstrap cycle and delivering 10,000+ requests per second.

---

### 29. What are Weak References vs Weak Maps in PHP and how do they assist garbage collection?
**In Simple Words:**
`WeakReference` allows a program to retain a reference to an object that does not prevent that object from being garbage-collected, critical for memory caches.

---

### 30. How do you profile PHP performance in production using Tideways or Blackfire?
**In Simple Words:**
Never run Xdebug in production (causes a 200%+ slowdown). Use **Blackfire** or **Tideways** which use lightweight statistical sampling to generate execution call graphs and pinpoint wall-clock bottlenecks.

---

### 31. How do you safely handle large file uploads without running out of RAM in PHP?
**In Simple Words:**
Never read uploaded files using `file_get_contents()`. Stream bytes chunk-by-chunk using `fopen('php://input', 'rb')` directly to cloud storage (e.g., S3 multipart upload).

---

### 32. What is Copy-On-Write (COW) in PHP memory management?
**In Simple Words:**
When an array is assigned to another variable (`$b = $a`), PHP does not allocate new memory. Both variables point to the same internal array struct. A duplicate copy is allocated **only** when one of the variables is modified.

---

### 33. How do you implement graceful shutdown in PHP queue consumers?
**In Simple Words:**
Listen for POSIX signals (`SIGTERM`, `SIGINT`) using `pcntl_signal()`. When received, allow the currently running job to finish before exiting cleanly.

---

### 34. How does the PHP Garbage Collector manage root buffers to avoid memory spikes?
**In Simple Words:**
The GC root buffer tracks up to 10,000 suspect objects. When full, it performs a color-marking cycle (Purple, Grey, Black, White) to detect references that only point to each other.

---

### 35. When should you choose Modern PHP over Node.js, Python, or Go for backend services?
**In Simple Words:**
Choose Modern PHP for web applications requiring rapid business logic iteration, enterprise ORM capabilities, strict typing, and rock-solid request isolation with near-zero memory leak risk.

---

### 36. Modern PHP Features (PHP 8.1 - 8.4): Enums, Readonly Classes, and Property Hooks.

**In Simple Words:**
Modern PHP has evolved into a strictly typed, expressive object-oriented language:
- **Backed Enums (PHP 8.1)**: Typed enumerations with scalar values (`enum Status: string { case Active = 'A'; }`) that can implement interfaces and contain methods.
- **Readonly Classes (PHP 8.2)**: Declaring `readonly class` makes all properties immutable once initialized.
- **First-Class Callables (PHP 8.1)**: Syntax `strlen(...)` creates closures without string references.
- **Property Hooks (PHP 8.4)**: Native get/set accessors on class properties, eliminating verbose getter/setter boilerplate methods!

```php
// PHP 8.4 Property Hooks and Backed Enums
enum UserRole: string {
    case Admin = 'admin';
    case Customer = 'customer';

    public function canManage(): bool {
        return $this === self::Admin;
    }
}

class UserProfile {
    // Property Hook (PHP 8.4)
    public string $fullName {
        get => "{$this->firstName} {$this->lastName}";
        set (string $value) {
            [$this->firstName, $this->lastName] = explode(' ', $value, 2);
        }
    }

    public function __construct(
        public string $firstName,
        public string $lastName,
        public readonly UserRole $role
    ) {}
}
```

---

### 37. PHP Advanced Type System: Union Types, Intersection Types, and DNF Types.

**In Simple Words:**
- **Union Types (`T1 | T2`)**: Accepts either Type 1 or Type 2 (`int|float`).
- **Intersection Types (`T1 & T2`)**: Value must satisfy **both** interfaces simultaneously (`Countable & Iterator`).
- **Disjunctive Normal Form (DNF Types - PHP 8.2+)**: Combines unions and intersections with parentheses: `(HasTitle & HasAuthor) | null`.
- **`never` return type**: Explicitly marks functions that never return (always throw an exception or call `exit()`).

---

### 38. PHP Fibers: Cooperative Multitasking and Asynchronous I/O.

**In Simple Words:**
Fibers (PHP 8.1+) provide low-level primitives for **coroutine concurrency**:
- A Fiber is an interruptible execution block that can pause itself using `Fiber::suspend()` and resume execution later with `Fiber::resume()`.
- Enables async event loops (like Revolt, Amp, and ReactPHP) to write non-blocking asynchronous code with synchronous-looking syntax.

---

### 39. PHP-FPM (FastCGI Process Manager) Architecture and Tuning.

**In Simple Words:**
PHP-FPM runs a master process that manages worker pools to execute PHP scripts:
- **Share-Nothing Architecture**: Each HTTP request is handled by an isolated worker process. When the request finishes, the entire request memory is wiped clean, preventing memory leaks between requests.
- **Process Manager Modes**:
  - `static`: Fixed number of workers running continuously. Maximum performance for dedicated web servers.
  - `dynamic`: Scales workers between `pm.min_spare_servers` and `pm.max_children` based on traffic.
  - `ondemand`: Spawns workers only when requests arrive (ideal for low-traffic shared hosting).

---

### 40. OPcache, Preloading, and the PHP JIT Compiler.

**In Simple Words:**
- **OPcache**: Caches compiled PHP opcode in shared RAM, eliminating the need to parse and compile PHP source files on every request.
- **OPcache Preloading (`opcache.preload`)**: Compiles framework classes (e.g. Laravel or Symfony core) into shared memory on server startup, making them permanently available to all requests without autoloading!
- **PHP JIT (Just-In-Time) Compiler**: Compiles hot opcode into raw x86/ARM machine code at runtime, boosting CPU-bound workloads (math, image processing, 3D rendering).

---

### 41. PHP Garbage Collection and Memory Management.

**In Simple Words:**
PHP uses **Reference Counting with a Cyclic Garbage Collector**:
- Every variable container (`zval`) has a reference counter (`refcount`). When a reference goes out of scope, `refcount` decrements; when it hits zero, the memory is freed immediately.
- **Circular Reference Collector**: Objects pointing to each other (`$a->b = $b; $b->a = $a;`) prevent `refcount` from reaching zero. PHP runs a background cyclic GC buffer (collecting up to 10,000 root buffers) to detect and reclaim circular memory leaks.

---

### 42. PHP Magic Methods: Metaprogramming and Object Lifecycles.

**In Simple Words:**
Magic methods start with `__` and intercept object behaviors:
- `__get($name)` / `__set($name, $val)`: Intercepts access to inaccessible/undefined properties (powers dynamic ORM models).
- `__call($name, $args)`: Intercepts calls to undefined methods.
- `__invoke()`: Allows an object instance to be called directly as a function.
- `__serialize()` / `__unserialize()`: Secure custom serialization handlers (replaces unsafe `__sleep` / `__wakeup`).

---

### 43. PHP 8 Native Attributes vs Legacy PHPDoc Annotations.

**In Simple Words:**
Prior to PHP 8, frameworks relied on parsing unstructured docblock comments (`/** @Route("/api") */`) via reflection strings.
- **Native Attributes (`#[Route("/api")]`)**: First-class structured metadata evaluated by the PHP compiler. Type-checked, autocompleted by IDEs, and queried in microseconds using `$reflection->getAttributes()`.

---

### 44. Weak References and `WeakMap` in PHP.

**In Simple Words:**
- **`WeakReference`**: Allows referencing an object without increasing its `refcount`.
- **`WeakMap`**: A map where keys are objects. When an object key is unset or goes out of scope anywhere in the application, the entry is **automatically removed from the WeakMap**, preventing memory leaks when building object caches or metadata registries.

---

### 45. Modern Dependency Injection and PSR-11.

**In Simple Words:**
- **PSR-11 (`ContainerInterface`)**: Standardizes how Dependency Injection containers fetch objects (`$container->get('service')`).
- **Autowiring**: Uses Reflection to inspect class constructor type-hints and automatically resolves and instantiates dependency graphs recursively without manual XML/YAML service declarations.

---

### 46. Core PHP-FIG PSR Standards.

**In Simple Words:**
The PHP Framework Interoperability Group (PHP-FIG) standardizes enterprise development:
- **PSR-4**: Autoloading standard mapping namespace paths directly to directory structures.
- **PSR-7 & PSR-15**: Standardizes HTTP message objects (`ServerRequestInterface`, `ResponseInterface`) and HTTP middleware pipelines.
- **PSR-12**: Strict universal code formatting and styling guidelines.

---

### 47. Long-Running Application Servers: RoadRunner and Swoole.

**In Simple Words:**
Traditional PHP boots the framework on every HTTP request and dies. Long-running servers keep the framework in memory:
- **RoadRunner (Go-based worker manager)**: Spawns persistent PHP worker processes communicating via binary IPC. Framework initializes once in memory, processing 10,000+ requests per second with sub-5ms response times.
- **State Reset**: Workers must reset global state, database connections, and memory between requests to prevent data leakage across users.

---

### 48. Security in Modern PHP: Password Hashing and Input Sanitization.

**In Simple Words:**
- **Password Hashing API**: Always use `password_hash($pwd, PASSWORD_ARGON2ID)`. Automatically generates cryptographically secure salts and resists GPU brute-force attacks.
- **Prepared Statements with PDO**: Always use `PDO::prepare()` with parameter placeholders to eliminate SQL injection.
- **Session Security**: Set `session.cookie_httponly = 1`, `session.cookie_secure = 1`, and `session.cookie_samesite = 'Strict'`.

---

### 49. Error Hierarchy: `Throwable`, `Error`, and `Exception`.

**In Simple Words:**
Since PHP 7, fatal engine errors no longer crash the process abruptly:
- All errors and exceptions implement the **`Throwable`** interface.
- **`Error`**: Engine-level failures (`TypeError`, `ParseError`, `DivisionByZeroError`).
- **`Exception`**: Application-level domain exceptions (`DatabaseException`, `ValidationException`).
- Catching `Throwable` guarantees catching both fatal engine errors and application exceptions.

---

### 50. Performance Profiling: Blackfire.io and Xdebug.

**In Simple Words:**
- **Xdebug**: Indispensable for local step-debugging and code coverage, but introduces up to 200% overhead; **never enable in production!**
- **Blackfire.io**: Production-safe profiler that measures exact CPU time, memory allocations, I/O waits, and SQL query counts across function call trees with minimal sampling overhead.
