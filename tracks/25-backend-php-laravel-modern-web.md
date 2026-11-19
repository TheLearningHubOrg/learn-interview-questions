# Modern PHP 8.3+ & Laravel 11 Enterprise Architecture Master Interview Question Bank (1 - 15)

> Comprehensive, production-grade interview questions covering Modern PHP 8.3+ (JIT Compiler, Fibers, Typed Properties, Readonly Classes, Attributes), Laravel 11 Architecture (Service Container, Eloquent ORM, Queues, Octane, and Microservices).

---

## Part 1: Modern PHP 8.1 - 8.3+ Language Features (1 - 15)

### 1. What are the key innovations in PHP 8.0 - 8.3+ (JIT, Readonly Classes, Enumerations, and Typed Properties)?
**In Simple Words:**
Modern PHP is a strictly typed, compiled-bytecode language with modern OOP capabilities:
1. **JIT (Just-In-Time) Compiler**: Compiles OPcache bytecode into raw CPU machine code at runtime for compute-intensive tasks.
2. **Readonly Classes & Properties**: `readonly class User { public function __construct(public string $id) {} }` enforces complete immutability after construction.
3. **Backed Enums**: Strongly typed enumerations with integer or string serialization: `enum OrderStatus: string { case Paid = 'paid'; case Pending = 'pending'; }`.
4. **Constructor Property Promotion**: Declares and assigns class properties directly in the constructor signature, eliminating boilerplate.
5. **Attributes (Annotations)**: Native metadata declarations (`#[Route('/api/users')]`).

### 2. How does OPcache work, and how does Preloading eliminate framework boot overhead?
**In Simple Words:**
Without caching, PHP parses and compiles `.php` source files into Zend Bytecode on every single HTTP request.
- **OPcache**: Stores compiled bytecode directly in shared RAM, skipping lexing and parsing on subsequent requests.
- **OPcache Preloading**: Added in PHP 7.4+. On server startup, PHP compiles framework core classes (Laravel, Symfony) into server memory once and binds them permanently into the global engine scope. Eliminates framework bootstrap latency completely!

### 3. What are PHP Fibers, and how do they enable Asynchronous Concurrency?
**In Simple Words:**
**Fibers** are lightweight, stackful, cooperative coroutines. They allow code execution to pause (`Fiber::suspend()`) during non-blocking I/O (e.g. database query, external HTTP call) and resume (`$fiber->resume()`) when data is ready.
Forms the foundation for modern async PHP engines like **Revolt**, **Amp**, and **Laravel Octane (Swoole)**.

---

## Part 2: Laravel 11 Architecture & Service Container (16 - 35)

### 4. How does the Laravel Service Container work (Binding, Resolving, Singletons, and Contextual Binding)?
**In Simple Words:**
The **Service Container** is Laravel's central dependency injection tool:
- **Binding**: Registering how an interface maps to a concrete class:
  `$this->app->bind(PaymentGateway::class, StripeGateway::class);`.
- **Singleton**: Registered once and shared across requests:
  `$this->app->singleton(MetricsCollector::class);`.
- **Automatic Resolution (Zero-Config DI)**: When a controller method type-hints a dependency in its constructor, the container uses PHP **Reflection** to inspect parameter types and instantiate the entire dependency graph automatically!

### 5. Eloquent ORM: Eager Loading vs. Lazy Loading and Preventing N+1 Queries with `Model::preventLazyLoading()`.
**In Simple Words:**
- **Lazy Loading**: Accessing an un-loaded relationship inside a loop executes an individual database query for every row ($1 + N$ queries).
- **Eager Loading (`with('relation')`)**: Pre-fetches related records in a single query using `WHERE IN (...)`.
- **Strict Mode in Laravel 11**: Placing `Model::preventLazyLoading(!app()->isProduction());` in `AppServiceProvider` throws an immediate exception in development if lazy loading occurs, guaranteeing zero N+1 queries reach production!

```php
// Eager Loading fix (2 queries instead of 101)
$users = User::with('posts')->get();
```

### 6. What is Laravel Octane (Swoole / RoadRunner), and what are Memory Leak gotchas in long-running PHP processes?
**In Simple Words:**
Traditional PHP follows the **Shared-Nothing Architecture**: the entire application is booted on every request and completely destroyed on response.
**Laravel Octane**:
Boots the application once into RAM using high-performance server daemons (**Swoole** or **RoadRunner**) and keeps it alive in memory across millions of requests, delivering **4x–10x higher throughput**.

**Memory Leak Gotchas**:
Static variables and singleton services persist between requests! If you append data to a static array or retain user authentication state in a singleton, memory leaks accumulate and bleed user sessions across requests. Always clear state using Octane listeners (`OperationTerminated`).

---

## Part 3: Queues, Events & Enterprise Architecture (36 - 50)

### 7. How does Laravel Queue Architecture work with Redis, SQS, and Horizon?
**In Simple Words:**
Long-running jobs (sending emails, generating PDFs, charging Stripe) are pushed to a background queue (`dispatch(new ProcessPodcast($podcast))`).
- Workers run continuously: `php artisan queue:work --tries=3 --timeout=60`.
- **Laravel Horizon**: Real-time Redis dashboard monitoring queue throughput, worker auto-scaling, job runtimes, and failed job retries.

### 8. API Authentication in Laravel: Sanctum vs. Passport.
**In Simple Words:**
- **Laravel Sanctum**: Lightweight token-based authentication. Supports both SPA cookie-based session auth (CSRF-protected, stateful) and mobile/API bearer tokens. Best for 95% of modern web & mobile apps.
- **Laravel Passport**: Full-blown OAuth 2.0 server implementation (Authorization Code grant, Client Credentials, Refresh tokens). Best when exposing public third-party developer APIs.

### 9. Senior Laravel Architect Conclusion: Core Principles.
**In Simple Words:**
1. Leverage strict types (`declare(strict_types=1);`) across all modern PHP classes.
2. Guard against N+1 query disasters using `Model::preventLazyLoading()`.
3. Offload all external network calls and I/O tasks to queues via Horizon.
4. Use Laravel Octane for high-throughput microservices while observing strict memory hygiene.

### 10. PHP 8.3 Readonly Classes and Deep Cloning.
**In Simple Words:**
- In PHP 8.2+, marking a class as `readonly` automatically applies `readonly` to all declared properties, enforcing immutability after constructor initialization.
- In PHP 8.3, readonly properties can now be re-initialized once inside the `__clone()` magic method, enabling deep cloning of immutable value objects and domain entities.

### 11. Laravel 11 Service Container & Dependency Injection.
**In Simple Words:**
The **Service Container** is the heart of Laravel:
- Automatically resolves dependencies via PHP Reflection:
  `$this->app->singleton(PaymentGatewayInterface::class, StripePaymentGateway::class);`.
- Contextual binding: specify different implementations for different controllers.
- Method injection: controller actions automatically resolve typed dependencies (`public function store(OrderRequest $request, InvoiceService $invoices)`).

### 12. Laravel Octane: Swoole vs. RoadRunner High-Throughput Execution.
**In Simple Words:**
Traditional PHP-FPM spawns a process, boots Laravel from scratch, executes the request, and destroys the process on every HTTP call ($20\text{ms}$ bootstrapping overhead).
- **Laravel Octane** boots the application once in RAM and serves thousands of requests concurrently using **Swoole** or **RoadRunner** worker loops, reducing response times to $<2\text{ms}$.

### 13. Eloquent ORM: Preventing N+1 Query Problems with Eager Loading.
**In Simple Words:**
Accessing relationships in loops (`foreach ($posts as $p) { echo $p->author->name; }`) triggers $N$ individual SQL queries.
- **Eager Loading**: `Post::with('author')->get()` executes exactly 2 queries: one for posts and one `WHERE author_id IN (...)`.
- Laravel 11 strict mode: `Model::preventLazyLoading()` throws an exception in local development if lazy loading is attempted.

### 14. Laravel Queues and Horizon Redis Monitoring.
**In Simple Words:**
- **Queues**: Offload heavy jobs (sending emails, video transcoding, external API sync) to background Redis queues.
- **Laravel Horizon**: Real-time dashboard and configuration system for Redis queues. Provides metrics on job throughput, wait times, failure rates, and auto-scales queue worker processes based on queue depth.

### 15. PHP Fibers: Cooperative Multitasking Internals.
**In Simple Words:**
Introduced in PHP 8.1, **Fibers** are lightweight, stackable coroutines that can pause (`Fiber::suspend()`) and resume (`$fiber->resume()`) execution.
- Enables asynchronous I/O frameworks (like Revolt / Amp) to run non-blocking concurrent network requests without blocking the single PHP thread.

