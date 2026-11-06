# Full-Stack & Backend Python Master Interview Question Bank: FastAPI, AsyncIO, Core & Internals (1 - 65)

> Comprehensive, production-level technical interview questions and deep-dive answers covering Python 3.11 - 3.13 internals, CPython memory management, the GIL, AsyncIO concurrency, FastAPI / Starlette architecture, Pydantic v2, SQLAlchemy 2.0, Alembic, and Celery distributed workflows.

---

## Table of Contents
- [Part 1: Candid Experience, Architecture & Intro (1 - 5)](#part-1-candid-experience-architecture--intro-1---5)
- [Part 2: Python Core Language, Internals & Runtime (6 - 25)](#part-2-python-core-language-internals--runtime-6---25)
- [Part 3: Async Programming & Concurrency (26 - 40)](#part-3-async-programming--concurrency-26---40)
- [Part 4: FastAPI, Flask & Web API Architecture (41 - 55)](#part-4-fastapi-flask--web-api-architecture-41---55)
- [Part 5: ORMs, Data Persistence & Distributed Tasks (56 - 65)](#part-5-orms-data-persistence--distributed-tasks-56---65)

---

## Part 1: Candid Experience, Architecture & Intro (1 - 5)

### 1. Give a candid introduction highlighting your experience building Python backend applications.
**Answer:**
"I am a Senior Backend and Full-Stack Engineer specializing in high-performance Python architectures, asynchronous microservices, and distributed systems. Over the past several years, I have architected and deployed services using **FastAPI**, **Flask**, and **Django**, integrated with asynchronous database drivers (`asyncpg`), message brokers (RabbitMQ, Redis, Kafka), and background task queues (Celery, ARQ). I place strong emphasis on Python runtime profiling, memory leak diagnosis, type hint enforcement with Mypy, and strict boundary separation across domain models and presentation layers."

### 2. How do you decide between FastAPI, Flask, and Django when scaffolding a new service?
**Answer:**
- **FastAPI**: My default choice for high-throughput RESTful/GraphQL APIs, microservices, and real-time streaming services. Benefits from native ASGI async support, automatic OpenAPI/Swagger documentation, and Pydantic validation.
- **Flask**: Best for lightweight microservices, internal automation tools, or simple utility proxies where complete framework freedom and minimal dependency footprint are prioritized.
- **Django**: Best for monolithic web applications requiring a mature batteries-included ecosystem (Admin panel, built-in ORM, authentication system, CSRF protection, and SSR templating).

### 3. Describe a severe Python backend performance bottleneck you encountered. How did you resolve it?
**Answer:**
"In a FastAPI data ingestion microservice, request latencies ballooned from 40ms to 4.2 seconds under heavy load, causing uvicorn worker timeouts.
**Debugging**: I used `py-spy` for non-intrusive sampling and flame graph generation. I discovered that a developer was making a synchronous `requests.get()` call and calling `json.loads()` on a 25MB payload inside an `async def` endpoint. Because it was synchronous and running on the main thread, it **blocked the AsyncIO Event Loop**, freezing all other concurrent incoming requests.
**Resolution**:
1. Replaced `requests` with non-blocking `httpx.AsyncClient`.
2. Offloaded the CPU-heavy JSON parsing to a thread pool via `asyncio.to_thread()`.
3. Upgraded to `orjson` (Rust-based fast serializer).
Response times dropped back to 35ms."

### 4. What is your strategy for dependency management, packaging, and isolated environments?
**Answer:**
"I use modern tooling like **uv** (Astral's blazingly fast Rust-based package manager) or **Poetry** with deterministic lockfiles (`poetry.lock` / `uv.lock`). In production Docker images, I implement **Multi-Stage Builds**:
- *Builder stage*: Installs build dependencies (C compilers) and compiles Python wheels.
- *Final stage*: Uses a slim runtime image (`python:3.12-slim`), copies only installed site-packages, runs as a non-root user (`USER nonroot`), and avoids installing dev dependencies."

### 5. How do you approach automated testing in Python?
**Answer:**
- **Test Runner**: `pytest` with `pytest-asyncio` for native async testing.
- **Database Isolation**: Wrap tests in transactional rollbacks: every test runs inside a nested transaction that rolls back on teardown, avoiding slow database truncation between test runs.
- **Mocking**: Use `unittest.mock` / `respx` for mocking external HTTP APIs, and Testcontainers for spinning up real PostgreSQL and Redis instances in integration CI pipelines.

---

## Part 2: Python Core Language, Internals & Runtime (6 - 25)

### 6. Memory management in Python: Reference Counting & Generational GC.
**Answer:**
CPython employs two memory management mechanisms:
1. **Reference Counting (Primary)**: Every Python object has an `ob_refcnt`. When assigned, incremented; when out of scope or deleted, decremented. When reaching 0, memory is deallocated immediately.
2. **Generational Garbage Collector (Cycle Detector)**: Reference counting fails with circular references (`a.b = b; b.a = a`). The cyclic GC groups objects into 3 generations (Gen 0, 1, 2) based on survival age. Gen 0 is checked frequently; long-lived objects are promoted to Gen 1 and Gen 2.

### 7. The Global Interpreter Lock (GIL) and free-threaded Python.
**Answer:**
The GIL is a mutex in CPython that ensures only one native OS thread executes Python bytecode at any given moment, simplifying CPython's C memory management and thread-safety.
- **Impact**: Multi-threaded Python code cannot utilize multiple CPU cores for CPU-bound tasks.
- **PEP 703 (Free-threaded Python 3.13+)**: Adds a build mode that disables the GIL, introducing biased reference counting and fine-grained locking to enable true multi-core parallel execution.

### 8. Mutable vs Immutable data types in memory.
**Answer:**
- **Immutable**: `int`, `float`, `str`, `tuple`, `frozenset`, `bytes`. Modifying creates a brand-new object in memory with a new `id()`.
- **Mutable**: `list`, `dict`, `set`, `bytearray`. Properties can be mutated in-place without altering the object's memory address pointer.

### 9. `is` vs `==` and String Interning / Integer Caching.
**Answer:**
- `==`: Value equality (evaluates `a.__eq__(b)`).
- `is`: Identity check (verifies if two variables point to the exact same memory address `id(a) == id(b)`).
- **Small Integer Caching**: CPython pre-allocates integers between `-5` and `256`. Therefore, `a = 250; b = 250; a is b` evaluates to `True`.

### 10. Python Decorators and `functools.wraps`.
**Answer:**
A decorator is a callable that accepts a function, wraps its behavior, and returns a modified function. `functools.wraps` is critical to preserve the wrapped function's original docstring and metadata (`__name__`):
```python
import functools
import time

def timing_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"{func.__name__} took {duration:.4f}s")
        return result
    return wrapper
```

### 11. Generators and the `yield` keyword.
**Answer:**
Generators produce values on demand (lazy evaluation) rather than allocating entire lists in memory. Calling a generator returns a generator iterator. State is frozen at each `yield` and resumed on `next()`, maintaining constant $O(1)$ memory space for millions of items.

### 12. The Iterator Protocol: `__iter__()` and `__next__()`.
**Answer:**
- An **Iterable** implements `__iter__()` returning an Iterator.
- An **Iterator** implements `__next__()` returning the next item. When items are exhausted, it must raise `StopIteration`.

### 13. Context Managers and the `with` statement.
**Answer:**
Ensures deterministic resource allocation and cleanup (closing file handles, releasing DB locks).
Implemented via class implementing `__enter__()` and `__exit__(exc_type, exc_val, exc_tb)`, or with `@contextlib.contextmanager`:
```python
from contextlib import contextmanager

@contextmanager
def managed_resource():
    print("Acquiring")
    yield "Resource"
    print("Releasing cleanly")
```

### 14. `*args`, `**kwargs`, keyword-only and positional-only arguments.
**Answer:**
- `*args`: Collects positional arguments into a tuple.
- `**kwargs`: Collects keyword arguments into a dictionary.
- `/`: Marks all preceding parameters as **positional-only** (`def fn(x, /): pass`).
- `*`: Marks all following parameters as **keyword-only** (`def fn(*, timeout=30): pass`).

### 15. Dunder methods: `__str__` vs `__repr__`, `__new__` vs `__init__`.
**Answer:**
- `__str__`: Human-readable string representation for end users (`print(obj)`).
- `__repr__`: Unambiguous, formal representation for developers (`eval(repr(obj)) == obj`).
- `__new__`: Static method that actually **creates** the new instance in memory.
- `__init__`: Initializes the newly created instance with attributes.

### 16. Multiple Inheritance and Method Resolution Order (MRO).
**Answer:**
Python resolves method lookups in multiple inheritance hierarchies using the **C3 Linearization Algorithm**, which guarantees monotonicity and preserves local precedence order, eliminating ambiguity in the Diamond Problem. Inspect via `Class.mro()`.

### 17. Metaclasses in Python.
**Answer:**
A metaclass is the "class of a class". Just as an object is an instance of a class, a class is an instance of a metaclass (`type`). Used to intercept class creation, validate class structures, or register plugins before instantiation.

### 18. `__slots__` and memory reduction.
**Answer:**
By default, Python stores instance attributes in a dynamic dictionary `__dict__`, which incurs significant memory overhead. Defining `__slots__ = ('name', 'age')` replaces `__dict__` with a fixed-size C array, reducing memory usage by 40-70% for millions of objects.

### 19. `@staticmethod` vs `@classmethod` vs Instance Methods.
**Answer:**
- **Instance method**: Receives `self` as the first argument; operates on specific instance state.
- **`@classmethod`**: Receives `cls` as first argument; operates on the class itself (commonly used for alternative constructors).
- **`@staticmethod`**: Receives neither `self` nor `cls`; acts as an isolated pure utility function grouped within the class namespace.

### 20. Shallow Copy (`copy.copy()`) vs Deep Copy (`copy.deepcopy()`).
**Answer:**
- `copy.copy()`: Duplicates the container object; elements inside still point to original nested references.
- `copy.deepcopy()`: Recursively copies all nested objects, creating completely independent copies.

### 21. Dataclasses (`@dataclass`) vs NamedTuple vs Pydantic.
**Answer:**
- `@dataclass`: Standard library class generator; auto-creates `__init__`, `__repr__`, `__eq__`. Fast, lightweight.
- `NamedTuple`: Immutable tuple subclass with named attributes; very low memory overhead.
- `Pydantic`: Built for runtime data parsing and strict type validation with automated error conversion; ideal for API request/response models.

### 22. Exception Handling and Exception Chaining (`raise ... from ...`).
**Answer:**
Exception chaining preserves the root cause trace when wrapping exceptions:
```python
try:
    connect_db()
except ConnectionError as err:
    raise ServiceUnavailable("Database down") from err
```
Displays both tracebacks clearly in logs.

### 23. First-Class Functions and Higher-Order Functions.
**Answer:**
Functions in Python are first-class citizens: they can be assigned to variables, passed as arguments to other functions, stored in data structures, and returned as values from functions.

### 24. List, Dict, and Set Comprehensions.
**Answer:**
Concise declarative syntax for building collections. Becomes an anti-pattern when expressions become overly complex, have side-effects, or when a generator expression `(x for x in data)` should be used to avoid allocating huge memory lists.

### 25. The `dis` module and CPython Bytecode.
**Answer:**
Python compiles `.py` files into `.pyc` bytecode instructions executed by the CPython virtual machine. The `dis` module disassembles bytecode, allowing developers to inspect instructions like `LOAD_FAST`, `BINARY_OP`, and `STORE_NAME`.

---

## Part 3: Async Programming & Concurrency (26 - 40)

### 26. Concurrency vs Parallelism in Python: Threading vs Multiprocessing vs Asyncio.
**Answer:**
- **AsyncIO (Single-threaded Concurrency)**: Cooperative multitasking for high-concurrency I/O-bound workloads (network calls, web sockets). Low memory overhead.
- **Threading (`threading`)**: Preemptive multi-threading. Suitable for I/O-bound tasks where C libraries release the GIL. Constrained by GIL for CPU tasks.
- **Multiprocessing (`multiprocessing`)**: True parallelism across multiple CPU cores by spawning separate OS processes with independent Python interpreters and GIL instances.

### 27. Asyncio Event Loop: Coroutines, Tasks, and Futures.
**Answer:**
- **Coroutine**: A function defined with `async def`. Pauses execution on `await`.
- **Task**: A wrapper scheduling a Coroutine onto the Event Loop; subclasses Future.
- **Future**: Low-level object representing an eventual result of an asynchronous operation.

### 28. Blocking the Event Loop & offloading to threads.
**Answer:**
Running blocking synchronous code (e.g., `time.sleep(5)`) inside an async function blocks the single thread running the Event Loop, stopping all concurrent requests.
**Fix**: Offload to a background thread pool:
```python
await asyncio.to_thread(blocking_io_function, arg1)
```

### 29. `asyncio.gather()` vs `asyncio.TaskGroup()`.
**Answer:**
- `asyncio.gather()`: Concurrently runs awaitables; if one fails, others may continue running orphaned (unstructured concurrency).
- `asyncio.TaskGroup()` (Python 3.11+): Implements **Structured Concurrency**. If any task inside the group raises an exception, all other sibling tasks are immediately cancelled and cleaned up properly.

### 30. `asyncio.wait()`, `asyncio.as_completed()`, and `asyncio.shield()`.
**Answer:**
- `wait()`: Waits on a collection of tasks with conditions (`FIRST_COMPLETED`, `ALL_COMPLETED`).
- `as_completed()`: Returns an iterator yielding tasks as they finish in real-time order.
- `shield()`: Protects an awaitable from being cancelled if the outer parent coroutine is cancelled.

### 31. Async Context Managers and Async Iterators.
**Answer:**
- **Async Iterator**: Implements `__aiter__()` and `__anext__()`, consumed via `async for`.
- **Async Context Manager**: Implements `__aenter__()` and `__aexit__()`, consumed via `async with`.

### 32. CPU-bound vs I/O-bound scaling.
**Answer:**
- **I/O-Bound**: The program waits for external responses (database, disk, API). Scaled efficiently via `asyncio` or thread pools.
- **CPU-Bound**: The program consumes 100% CPU cycles on computation. Must use `multiprocessing.Pool` or `ProcessPoolExecutor` to utilize multiple physical CPU cores.

### 33. Process Pools vs Thread Pools and Shared State.
**Answer:**
`ProcessPoolExecutor` spawns separate processes with isolated memory spaces. Sharing state across processes requires Inter-Process Communication (IPC) primitives: `multiprocessing.Queue`, `Value`, `Array`, or a `Manager`.

### 34. Race Conditions and Synchronization Primitives.
**Answer:**
Occurs when multiple threads read and mutate shared mutable state concurrently without synchronization. Protected via `threading.Lock` (mutex), `RLock` (re-entrant lock), or `Semaphore` (limiting concurrent resource access).

### 35. Deadlocks in multi-threaded applications.
**Answer:**
Two threads mutually hold one lock and wait for the other. Prevented by:
- Enforcing global lock acquisition order.
- Using lock timeouts: `lock.acquire(timeout=5.0)`.

### 36. I/O Multiplexing: `epoll`, `kqueue`, and `select`.
**Answer:**
OS kernel mechanisms that monitor thousands of file descriptors (network sockets) and notify the application when one is ready for read/write. Linux uses `epoll`, macOS uses `kqueue`. Powers AsyncIO without thread-per-connection overhead.

### 37. Graceful AsyncIO Shutdown on SIGINT/SIGTERM.
**Answer:**
1. Catch signal via `loop.add_signal_handler()`.
2. Cancel all pending tasks: `[t.cancel() for t in asyncio.all_tasks(loop)]`.
3. Wait for tasks to handle `CancelledError`: `await asyncio.gather(*tasks, return_exceptions=True)`.
4. Close async resources (DB connection pools, HTTP clients).
5. Stop the loop cleanly.

### 38. AnyIO, Trio, and Structured Concurrency.
**Answer:**
Structured concurrency dictates that concurrent tasks have clear lifetimes bounded by their parent scope: no background task can outlive the block that created it. AnyIO provides a compatibility layer over AsyncIO and Trio implementing these patterns.

### 39. Asynchronous Producer-Consumer with `asyncio.Queue`.
**Answer:**
```python
queue = asyncio.Queue(maxsize=100)

async def producer():
    for item in items:
        await queue.put(item)
    await queue.join()

async def worker():
    while True:
        item = await queue.get()
        await process(item)
        queue.task_done()
```

### 40. Gunicorn with Uvicorn Workers.
**Answer:**
Gunicorn acts as a pre-fork process master managing worker lifecycles, graceful restarts, and zero-downtime reloads. Each worker runs a high-performance ASGI `UvicornWorker` executing its own AsyncIO event loop on a dedicated CPU core.

---

## Part 4: FastAPI, Flask & Web API Architecture (41 - 55)

### 41. How FastAPI achieves high performance: Starlette, Pydantic, ASGI.
**Answer:**
- **Starlette**: Ultra-lightweight ASGI web framework handling routing, WebSockets, and HTTP primitives.
- **Pydantic**: Compiles schema validation rules down to compiled Rust code (`pydantic-core`).
- **ASGI**: Fully asynchronous non-blocking event loop execution.

### 42. WSGI vs ASGI.
**Answer:**
- **WSGI (Web Server Gateway Interface)**: Synchronous specification (Flask, Django). Only one request per worker thread; cannot handle concurrent long-lived WebSockets or streaming.
- **ASGI (Asynchronous Server Gateway Interface)**: Asynchronous specification (FastAPI, Starlette). Handles HTTP, WebSockets, and background streaming natively on the event loop.

### 43. FastAPI Dependency Injection (`Depends()`).
**Answer:**
A declarative dependency injection system supporting hierarchical sub-dependencies. Used for acquiring database sessions per-request, extracting bearer tokens, and enforcing Role-Based Access Control (RBAC):
```python
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User: ...
@app.get("/items")
async def read_items(user: User = Depends(get_current_user)): ...
```

### 44. Pydantic v2 performance boost.
**Answer:**
Pydantic v2 rewrote its core validation and JSON serialization logic in **Rust** (`pydantic-core`), delivering a 5x to 20x performance speedup over pure-Python v1.

### 45. `async def` vs standard `def` in FastAPI endpoints.
**Answer:**
- `async def`: Executed directly on the main AsyncIO event loop thread. Must only contain non-blocking async code.
- `def`: FastAPI automatically offloads standard synchronous endpoints to an external thread pool (`ThreadPoolExecutor`) to prevent them from blocking the event loop.

### 46. Background Tasks in FastAPI vs Celery.
**Answer:**
- `BackgroundTasks`: In-process tasks running after the response is sent. Suitable for small jobs (sending an email). If server restarts, queued tasks are lost.
- **Celery / Distributed Queues**: Out-of-process, persistent broker-backed queues with retries and worker auto-scaling. Mandatory for heavy, mission-critical tasks (video encoding, billing exports).

### 47. FastAPI / Starlette Middlewares.
**Answer:**
Intercepts every incoming request and outgoing response:
```python
@app.middleware("http")
async def add_process_time(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{duration:.4f}s"
    return response
```

### 48. Centralized Global Exception Handling in FastAPI.
**Answer:**
```python
@app.exception_handler(DomainException)
async def domain_exception_handler(request: Request, exc: DomainException):
    return JSONResponse(status_code=400, content={"error": exc.message, "code": exc.code})
```

### 49. Application Factory Pattern in Flask.
**Answer:**
Encapsulating app creation inside a function `create_app(config)`: Enables instantiating isolated app instances with different configurations for unit tests, prevents circular imports, and allows modular blueprint registration.

### 50. Flask Contexts: Application vs Request Context.
**Answer:**
- **Application Context (`current_app`, `g`)**: Bound to application-level state and config.
- **Request Context (`request`, `session`)**: Bound to a specific incoming HTTP request.

### 51. JWT Authentication, Refresh Token Rotation & Password Hashing.
**Answer:**
- Passwords hashed using `argon2id` or `bcrypt` with unique salts.
- **Access Token**: Short-lived (15 minutes), signed with asymmetric RSA/ECDSA private key.
- **Refresh Token**: Long-lived (7 days), stored in database with rotation: every use invalidates the old refresh token and issues a new pair.

### 52. Streaming Responses & SSE in FastAPI.
**Answer:**
```python
from fastapi.responses import StreamingResponse

async def event_generator():
    for i in range(10):
        yield f"data: Message {i}\n\n"
        await asyncio.sleep(1)

@app.get("/stream")
async def stream():
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

### 53. Rate-Limiting using Redis Token Bucket.
**Answer:**
Maintains a token count and timestamp in Redis. Every incoming request decrements tokens; tokens refill at a steady rate. If empty, returns HTTP 429 Too Many Requests.

### 54. OpenAPI and JSON Schema Customization in FastAPI.
**Answer:**
FastAPI automatically derives OpenAPI specifications from Pydantic types. Customization is achieved via `openapi_tags`, `summary`, `response_description`, and security schemes (`HTTPBearer`).

### 55. Secure File Uploads: `UploadFile` vs `bytes`.
**Answer:**
- `bytes`: Reads the entire file directly into RAM, risking memory exhaustion with large files.
- `UploadFile`: Spools files to temporary disk storage once exceeding 1MB, streaming chunks safely without blowing up memory.

---

## Part 5: ORMs, Data Persistence & Distributed Tasks (56 - 65)

### 56. SQLAlchemy 2.0 vs Legacy 1.x.
**Answer:**
SQLAlchemy 2.0 unifies the Core and ORM APIs around `select(Model).where(...)`, fully adopts Python type annotations via `Mapped[T]` and `mapped_column()`, and natively supports async execution.

### 57. Unit of Work and Identity Map Pattern.
**Answer:**
- **Unit of Work**: Tracks all database changes within a business transaction and flushes them atomically in a single coordinated batch.
- **Identity Map**: Ensures that each database row is represented by exactly one Python object instance per `Session`, avoiding inconsistent duplicate objects.

### 58. Async SQLAlchemy with `asyncpg`.
**Answer:**
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db", echo=False)
async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with async_session() as session:
        yield session
```

### 59. Lazy, Joined, and Selectin Loading in SQLAlchemy.
**Answer:**
- **Lazy Loading (Default)**: Emits a separate query when an unpopulated relation is accessed (causes N+1 query bugs).
- **Joined Loading (`joinedload`)**: Uses a single SQL `LEFT OUTER JOIN` to fetch parent and children together. Best for 1-to-1 or 1-to-few relations.
- **Selectin Loading (`selectinload`)**: Emits a second query using `WHERE parent_id IN (...)`. Highly efficient for 1-to-many collections.

### 60. Alembic Production Migration Safety.
**Answer:**
- Never run auto-generated migrations blindly: always inspect generated SQL using `alembic upgrade --sql`.
- Add column migrations as nullable first.
- In PostgreSQL, create indexes concurrently to prevent table locks.
- Ensure every migration has a valid `downgrade()` implementation.

### 61. Celery Architecture: Broker and Result Backend.
**Answer:**
- **Broker (RabbitMQ/Redis)**: Message queue holding pending serialized task payloads.
- **Celery Workers**: Distributed processes polling the broker, deserializing tasks, and executing them.
- **Result Backend (Redis/PostgreSQL)**: Stores return values and task statuses.

### 62. Celery Retries, Exponential Backoff & Idempotency.
**Answer:**
```python
@celery_app.task(bind=True, max_retries=5, default_retry_delay=60)
def process_payment(self, payment_id):
    try:
        call_gateway(payment_id)
    except GatewayError as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
```
Tasks must be **idempotent** so that executing the same task twice produces identical results without double-charging users.

### 63. Celery Canvas Primitives: chain, group, chord.
**Answer:**
- `chain(t1 | t2 | t3)`: Executes tasks sequentially, passing the output of `t1` as input to `t2`.
- `group([t1, t2, t3])`: Executes tasks in parallel.
- `chord(group([t1, t2]) | callback)`: Runs tasks in parallel, and executes `callback` once all finish.

### 64. Preventing Memory Leaks in Celery Workers.
**Answer:**
Certain Python libraries leak memory over time in long-running processes. Configure `--max-tasks-per-child=1000` or `CELERY_WORKER_MAX_MEMORY_PER_CHILD = 300000`, which recycles worker processes automatically after processing $N$ tasks or reaching memory thresholds.

### 65. Alternatives to Celery: ARQ, Dramatiq, RQ.
**Answer:**
- **ARQ**: AsyncIO-native job queue backed by Redis. Ideal when the existing application is already built with AsyncIO.
- **Dramatiq**: Simpler, more reliable alternative to Celery with built-in retries, thread pools, and actor model semantics.
- **RQ (Redis Queue)**: Minimalist, lightweight queue built specifically for Redis.
