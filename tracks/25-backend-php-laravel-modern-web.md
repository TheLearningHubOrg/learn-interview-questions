# PHP 8.3 & Laravel 11 Modern Web Architecture Master Interview Bank (1 - 35)

> Modern PHP 8.1 - 8.3 features (Enums, Readonly classes, Match expressions, Fibers), PHP-FPM request lifecycle, Laravel request lifecycle, Service Container and Dependency Injection, Eloquent ORM, N+1 query problem, Middleware pipeline, Queues and Horizon, Laravel Octane (Swoole/RoadRunner), and Pest PHP testing.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What are the key features introduced in modern PHP (PHP 8.0 to 8.3)?
**In Simple Words:**
Modern PHP has undergone a massive evolution into a strictly typed, high-performance language:
- **JIT Compiler (PHP 8.0)**: Compiles opcode into machine code for CPU-intensive tasks.
- **Named Arguments & Match Expressions**: `match($val)` replaces clunky `switch` statements with strict type comparison and return expressions.
- **Attributes**: Native metadata annotations (`#[Route('/api')]`) replacing DocBlock comments.
- **Constructor Property Promotion**: Declares and assigns class properties directly in the constructor signature.
- **Enums & Readonly Classes (PHP 8.1/8.2)**: First-class typed enums and immutable classes.
- **Typed Class Constants & Dynamic Class Constant Fetch (PHP 8.3)**.

```php
// Modern PHP 8.2 / 8.3 Syntax:
enum OrderStatus: string {
    case Pending = 'pending';
    case Shipped = 'shipped';
    case Cancelled = 'cancelled';
}

readonly class UserDTO {
    public function __construct(
        public int $id,
        public string $email,
        public OrderStatus $status
    ) {}
}
```

### 2. How does the PHP Execution Lifecycle work (CGI vs FastCGI vs PHP-FPM)?
**In Simple Words:**
PHP traditionally runs in a **Share-Nothing Architecture**:
1. Nginx receives an incoming HTTP request.
2. Nginx forwards the request over a Unix Domain Socket to **PHP-FPM (FastCGI Process Manager)**.
3. PHP-FPM assigns the request to an idle pre-forked worker process.
4. The worker boots the application, executes the PHP script, renders output, and sends the HTTP response back.
5. **Memory Clean**: The worker process **wipes all memory and state clean**, ready for the next request! Zero memory leaks across requests, but requires bootstrapping the framework on every hit.

### 3. What is the Laravel Request Lifecycle (`public/index.php` to HTTP Kernel)?
**In Simple Words:**
The entry-to-exit journey of a Laravel request:
1. All traffic enters `public/index.php`.
2. Composer autoloader is initialized.
3. `bootstrap/app.php` initializes the **Service Container** and builds the **HTTP Kernel**.
4. The HTTP Kernel bootstraps critical providers: Error handling, Logging, Environment (`.env`), Configuration files.
5. The request passes through the **Global Middleware Pipeline** (Sessions, CSRF, Cookies).
6. **Routing**: Matches URL, resolves route-specific middleware, executes Controller action.
7. Controller returns a `Response`; middleware pipeline executes post-response tasks; sent back to client.

```text
Laravel Request Lifecycle:
[HTTP Request] ──► [public/index.php] ──► [Service Container Boot]
                                                    │
                                                    ▼
[HTTP Response] ◄── [Controller Action] ◄── [Middleware Pipeline]
```

### 4. What is the Service Container in Laravel?
**In Simple Words:**
The Service Container is the central Dependency Injection (DI) and Inversion of Control (IoC) engine of Laravel:
- Manages class dependencies and performs automatic **Constructor Injection** using PHP Reflection.
- If a controller requests `UserRepository` in its constructor, the container automatically inspects the type-hint, instantiates dependencies recursively, and injects them!

```php
class OrderController extends Controller {
    // Automatically injected by the Service Container!
    public function __construct(
        private OrderRepository $orders,
        private PaymentGateway $payment
    ) {}
}
```

### 5. What are Service Providers and what are their two main methods (`register` vs `boot`)?
**In Simple Words:**
Service Providers are the central place where application components and package services are configured and bound into the Service Container:
- **`register()`**: Used strictly to **bind things into the Service Container**. You should never register event listeners, routes, or business logic inside `register()`.
- **`boot()`**: Called **after all other service providers have been registered**. Safe to register event listeners, view composers, macros, and route bindings!

### 6. What is the difference between `bind`, `singleton`, and `scoped` in Laravel?
**In Simple Words:**
- **`$this->app->bind(Interface::class, Concrete::class)`**: Returns a **brand new instance** every single time the class or interface is resolved.
- **`$this->app->singleton(...)`**: Instantiates the object once on the first resolution, caching and reusing that **exact same instance** for subsequent calls during the request.
- **`$this->app->scoped(...)`**: Similar to singleton within a single request, but resets automatically between requests in persistent long-running environments like **Laravel Octane**.

### 7. What is Eloquent ORM and the Active Record Pattern?
**In Simple Words:**
Eloquent is Laravel's built-in Object-Relational Mapper (ORM) implementing the **Active Record Pattern**:
- Each database table corresponds to a Model class (`User` -> `users` table).
- An instance of a model represents a single row in that table.
- Database operations are invoked directly on the model instance:
```php
$user = User::find(1);
$user->email = 'new@example.com';
$user->save(); // Generates UPDATE users SET email = ... WHERE id = 1
```

### 8. What is the N+1 Query Problem in Eloquent and how do you resolve it?
**In Simple Words:**
Occurs when querying parent records and accessing their relationships in a loop without eager loading:
```php
// BAD: 1 query for users + 100 queries for profiles = 101 SQL queries!
$users = User::all();
foreach ($users as $user) {
    echo $user->profile->bio; // Triggers a separate SQL query per user!
}

// GOOD: Eager Loading using with() = Strictly 2 SQL queries!
$users = User::with('profile')->get();
// SELECT * FROM users;
// SELECT * FROM profiles WHERE user_id IN (1, 2, 3, ...);
```
- In Laravel 10+, prevent it globally in development: `Model::preventLazyLoading(!app()->isProduction());`.

### 9. What are Eloquent Relationships (One-to-Many, Many-to-Many, Polymorphic)?
**In Simple Words:**
- **One-to-Many (`hasMany` / `belongsTo`)**: User has many Posts.
- **Many-to-Many (`belongsToMany`)**: Users and Roles joined via an intermediate pivot table (`role_user`).
- **Polymorphic (`morphTo` / `morphMany`)**: A single target model can belong to multiple different parent models on a single table (e.g. `Comment` model belongs to either a `Post` OR a `Video` via `commentable_id` and `commentable_type`).

### 10. What are Middleware in Laravel?
**In Simple Words:**
Middleware act as HTTP filters surrounding the application request:
- Inspects or modifies incoming requests before they reach controllers, or modifies responses before they return to clients.
- Examples: `Authenticate` (checks login), `VerifyCsrfToken` (guards against CSRF), `ThrottleRequests` (rate limits API calls).

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What are Eloquent Scopes (Local vs Global Scopes)?
**In Simple Words:**
- **Local Scope**: Reusable query constraints prefixed with `scope`:
  ```php
  // In User model:
  public function scopeActive($query) {
      return $query->where('status', 'active');
  }
  // Usage:
  $activeUsers = User::active()->where('country', 'US')->get();
  ```
- **Global Scope**: Automatically applied to **every query** executed on the model (e.g. Soft Deletes uses a global scope: `WHERE deleted_at IS NULL`).

### 12. How does Laravel handle Authentication and Authorization (Gates vs Policies)?
**In Simple Words:**
- **Authentication**: Verifies *who* the user is (handled via Laravel Breeze, Jetstream, or Fortify).
- **Authorization**: Verifies *what* the user is allowed to do:
  - **Gates**: Closure-based authorization for simple, ad-hoc actions:
    `Gate::define('edit-settings', fn(User $user) => $user->isAdmin);`
  - **Policies**: Dedicated classes organized around specific Eloquent models:
    `$this->authorize('update', $post);` calls `PostPolicy::update(User $user, Post $post)`.

### 13. What is Laravel Sanctum and how does it handle SPA and Mobile Token Authentication?
**In Simple Words:**
A featherweight authentication system for SPAs (Vue/React/Next.js) and mobile APIs:
- **SPA Authentication**: Uses stateful, secure cookie-based session authentication with CSRF protection without managing complex OAuth2 infrastructure.
- **API Token Authentication**: Issues cryptographically hashed Personal Access Tokens (similar to GitHub PATs) with granular ability scopes (e.g. `['orders:create', 'orders:read']`).

### 14. How does the Queue System work in Laravel?
**In Simple Words:**
Offloads time-consuming tasks (sending confirmation emails, processing video encoding, generating PDFs) to run asynchronously in the background:
- **Jobs**: Dispatched classes implementing `ShouldQueue`:
  `ProcessPodcast::dispatch($podcast)->onQueue('high-priority');`
- **Queue Drivers**: Redis, Amazon SQS, Database, Beanstalkd.
- **Workers**: Continuous background CLI processes (`php artisan queue:work`) that poll the queue and execute jobs with automated retry logic and exponential backoff.

### 15. What is Laravel Horizon?
**In Simple Words:**
A beautiful dashboard and code-driven configuration manager for Redis-powered queues in Laravel:
- Configures auto-scaling queue worker processes based on current queue workload.
- Monitors throughput (jobs/min), runtime latency, wait times, and provides a UI to inspect and retry failed jobs with full stack traces.

### 16. How do Events and Listeners work in Laravel?
**In Simple Words:**
Implements the Observer pattern to decouple application workflows:
- **Event**: Pure data class representing a business milestone:
  `event(new OrderPlaced($order));`
- **Listener**: Class that reacts to the event. Listeners can implement `ShouldQueue` to run asynchronously in the background without slowing down the HTTP user request!
- A single event can trigger multiple independent listeners (e.g. `SendOrderConfirmationEmail`, `UpdateInventoryStats`, `NotifySlackChannel`).

### 17. What are Form Requests and Custom Validation Rules?
**In Simple Words:**
Custom request classes that encapsulate authorization and validation logic outside of controllers:
- Validates incoming parameters **before the controller method is ever executed**:
```php
class StoreUserRequest extends FormRequest {
    public function authorize(): bool {
        return $this->user()->can('create', User::class);
    }
    public function rules(): array {
        return [
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()]
        ];
    }
}
```
- If validation fails, it automatically redirects back with error messages or returns a 422 JSON response.

### 18. What is Caching in Laravel and how do Cache Tags work?
**In Simple Words:**
Unified caching API supporting Redis, Memcached, DynamoDB, and file drivers:
- **Cache Tags (`tags()`)**: Allows grouping related cache entries:
```php
// Tag and store:
Cache::tags(['people', 'artists'])->put('John', $john, $seconds);
Cache::tags(['people', 'authors'])->put('Anne', $anne, $seconds);

// Flush ALL cache entries tagged with 'people' in a single line!
Cache::tags('people')->flush();
```
- Supported in Redis and Memcached; not supported in file/database drivers.

### 19. What are Database Migrations and Seeders?
**In Simple Words:**
- **Migrations**: Version control for your database schema. Allows defining tables, columns, and indexes using declarative PHP code (`Schema::create(...)`), making database changes repeatable across team environments.
- **Seeders & Model Factories**: Populates the database with realistic test dummy data using the Faker library for testing and local development.

### 20. What is the difference between Pest PHP and PHPUnit?
**In Simple Words:**
- **PHPUnit (Traditional)**: Class-based testing framework. Requires boilerplate class declarations, annotations, and verbose assertions (`$this->assertEquals(...)`).
- **Pest PHP (Modern Standard)**: Elegant, expressive testing framework built on top of PHPUnit:
  - Functional syntax inspired by Jest and Vitest (`it('calculates total correctly', function() { ... })`).
  - Built-in architecture testing (`arch()->expect('App\Models')->toBeClasses()`).
  - First-class mutation testing and parallel test execution.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. What is Laravel Octane and how does it achieve 5x - 10x throughput?
**In Simple Words:**
Traditionally, PHP-FPM boots the entire framework and tears it down on every single HTTP request:
- **Laravel Octane**: Boots the application in memory **ONCE** using high-performance application servers (**Swoole** or **RoadRunner**):
  - Keeps the framework, container, and route tables resident in RAM.
  - Subsequent requests are served in **single-digit milliseconds (sub-2ms)**!
- **State Leak Warning**: Because memory persists across requests, static properties and global singletons are shared across different users! Developers must reset scoped services to prevent cross-tenant data leaks.

```text
Standard PHP-FPM vs Laravel Octane:
PHP-FPM:  Request ──► [Boot Framework] ──► [Execute] ──► [Wipe Memory!] (Repeats on every hit)
Octane:   [Boot Framework Once in RAM]
                ├─► Request 1 ──► [Execute in 2ms]
                └─► Request 2 ──► [Execute in 2ms] (Zero Boot Overhead!)
```

### 22. What are PHP Fibers and how do they enable Asynchronous concurrency?
**In Simple Words:**
Introduced in PHP 8.1:
- Fibers are lightweight, stackful coroutines (cooperative multitasking primitives).
- Allow pausing (`Fiber::suspend()`) and resuming (`$fiber->resume()`) execution stack states anywhere in a function.
- Foundation of modern async PHP frameworks (Revolt, Amp, ReactPHP) allowing asynchronous, non-blocking I/O operations without callback hell.

### 23. What are Laravel Custom Casts and Value Objects?
**In Simple Words:**
Allows converting database column values directly into rich Value Objects upon retrieval, and serializing them back upon saving:
```php
class MoneyCast implements CastsAttributes {
    public function get($model, string $key, $value, array $attributes): Money {
        return new Money($value, $attributes['currency'] ?? 'USD');
    }
    public function set($model, string $key, $value, array $attributes): array {
        return [$key => $value->amount];
    }
}
```

### 24. How do you implement Zero-Downtime Deployment for Laravel applications?
**In Simple Words:**
Using tools like Laravel Envoyer, Deployer, or Docker:
1. Clone new release code into a timestamped release directory (`/releases/20260315120000`).
2. Run `composer install --no-dev --optimize-autoloader`.
3. Pre-compile caches: `php artisan config:cache`, `route:cache`, `view:cache`.
4. Run database migrations: `php artisan migrate --force`.
5. Symlink `/releases/2026...` to `/current` atomically.
6. Reload PHP-FPM and restart queue workers (`php artisan queue:restart`).

### 25. What is the difference between Lazy Collections and standard Collections?
**In Simple Words:**
- **Standard Collection (`collect()`)**: Loads the entire dataset into RAM at once. Loading 500,000 database rows exhausts PHP memory limit (`Allowed memory size exhausted`).
- **Lazy Collection (`LazyCollection`)**: Leverages PHP Generators (`yield`):
  - Streams records from the database in chunks (e.g. 1,000 rows at a time).
  - Keeps only a single record in RAM at any moment, allowing you to process multi-gigabyte datasets with only 10 MB of RAM!

### 26. How do you optimize OPcache in production?
**In Simple Words:**
OPcache stores pre-compiled PHP bytecode in shared memory, skipping the parsing phase on every request:
- **`opcache.validate_timestamps = 0`**: Never checks if `.php` files on disk were modified! Delivers maximum speed; requires restarting PHP-FPM during deployments to clear cache.
- **`opcache.memory_consumption = 256`**: Allocates 256 MB of RAM.
- **`opcache.max_accelerated_files = 20000`**: Increases maximum cached script files.
- **Preloading (`opcache.preload`)**: Compiles core framework files into shared memory on server boot.

### 27. What is Database Connection Pooling and Sharding in Laravel?
**In Simple Words:**
- **Read/Write Splitting**: Laravel natively supports separate read and write connections:
  ```php
  'mysql' => [
      'read' => ['host' => ['192.168.1.1', '192.168.1.2']],
      'write' => ['host' => '192.168.1.3'],
      'sticky' => true, // Reads immediate writes from master to prevent replication lag!
  ]
  ```
- **Connection Poolers**: Use ProxySQL in front of MySQL to pool thousands of PHP requests over a small set of persistent database connections.

### 28. How does Soft Deleting work in Eloquent?
**In Simple Words:**
Adds a `deleted_at` timestamp column to the table:
- When `$user->delete()` is called, Eloquent sets `deleted_at = NOW()` instead of executing a SQL `DELETE`.
- Automatically injects a Global Scope on all queries: `WHERE deleted_at IS NULL`.
- Access soft-deleted records via `User::withTrashed()->get()` or restore them via `$user->restore()`.

### 29. How do you prevent and resolve Race Conditions in Laravel using Atomic Locks?
**In Simple Words:**
Avoid double-spending or duplicate actions using Redis cache atomic locks:
```php
$lock = Cache::lock('process-payment-'.$order->id, 10);

if ($lock->get()) {
    try {
        // Execute payment processing safely...
    } finally {
        $lock->release();
    }
} else {
    // Lock already held by another request!
}
```

### 30. What are Rate Limiting and Dynamic Rate Limiting in Laravel?
**In Simple Words:**
Defined in `AppServiceProvider` using `RateLimiter::for`:
- Limits requests based on user ID or IP address:
```php
RateLimiter::for('api', function (Request $request) {
    return $request->user()?->isVip()
        ? Limit::none()
        : Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});
```

### 31. What is Laravel Scout and Full-Text Search?
**In Simple Words:**
Scout provides a driver-based solution for searching Eloquent models:
- Automatically syncs search indexes whenever an Eloquent model is saved or deleted via model observers.
- Pluggable drivers: **Meilisearch**, **Algolia**, or database full-text search (`PostgreSQL / MySQL FULLTEXT`).

### 32. How do you manage Database Transactions with retries?
**In Simple Words:**
`DB::transaction()` automatically begins a transaction and commits on success, rolling back if an exception is thrown:
```php
DB::transaction(function () {
    // Complex balance transfer operations...
}, 5); // Automatically retries up to 5 times if a database Deadlock occurs!
```

### 33. What are Broadcast Channels and WebSockets in Laravel (Reverb / Echo)?
**In Simple Words:**
- **Laravel Reverb**: First-party, blazing fast WebSocket server written natively in PHP.
- **Event Broadcasting**: When an event implements `ShouldBroadcast`, Laravel broadcasts the event to WebSocket channels (Public, Private, or Presence channels).
- Frontend uses **Laravel Echo** to listen for events in real-time.

### 34. What is the difference between Single-Action Controllers (`__invoke`) and Resource Controllers?
**In Simple Words:**
- **Resource Controller**: Contains standard RESTful CRUD actions (`index`, `create`, `store`, `show`, `edit`, `update`, `destroy`).
- **Single-Action Controller (`__invoke()`)**: Dedicated controller class responsible for **strictly one complex operation** (e.g. `GenerateMonthlyInvoiceController`). Promotes the Single Responsibility Principle.

### 35. When should you choose Laravel over Node.js (NestJS) or Go?
**In Simple Words:**
- **Choose Laravel**:
  - Full-stack web applications and SaaS platforms requiring the absolute highest development velocity.
  - Complete, battle-tested ecosystem out-of-the-box: Auth, Queues, Mail, Caching, Migrations, Admin panels (Filament).
  - Unmatched developer productivity with clean, expressive syntax.
- **Choose Go / Node.js**: Ultra-high-concurrency WebSocket gateways, raw network proxies, or microservices requiring sub-millisecond bare-metal CPU throughput.
`;
