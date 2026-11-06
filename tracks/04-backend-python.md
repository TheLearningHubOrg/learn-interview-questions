# Full-Stack & Backend Python Master Interview Question Bank: FastAPI, AsyncIO, Core & Internals (1 - 65)

> Simple, intuitive, and easy-to-explain technical interview questions and deep-dive answers covering Python 3.12+ internals, CPython memory management, the GIL, AsyncIO concurrency, FastAPI / Starlette, Pydantic v2, SQLAlchemy 2.0, and Celery workflows.

---

## Part 1: Candid Experience, Architecture & Intro (1 - 5)

### 1. Give a candid introduction highlighting your experience building Python backend applications.
**In Simple Words:**
"I am a Senior Backend and Full-Stack Engineer specializing in high-performance Python, asynchronous microservices, and distributed systems. I build services using **FastAPI**, **Flask**, and **Django**, integrated with async database drivers (`asyncpg`), message brokers (RabbitMQ, Redis), and background task workers (Celery, ARQ). I focus on event loop performance, type safety with Mypy, and clean separation between API routes and domain business logic."

### 2. How do you decide between FastAPI, Flask, and Django?
**In Simple Words:**
- **FastAPI**: My default choice for high-throughput APIs and microservices. Native async ASGI support, automatic OpenAPI/Swagger docs, and fast Pydantic v2 validation.
- **Flask**: Best for small utility microservices and simple automation scripts where minimal dependencies are preferred.
- **Django**: Best for monolithic web applications needing an all-in-one ecosystem (built-in Admin panel, ORM, auth system, and template rendering).

### 3. Describe a severe Python backend performance bottleneck you resolved.
**How to Explain in an Interview:**
- **Problem**: In a FastAPI ingestion API, request latency jumped from 40ms to 4.2 seconds under heavy load.
- **Root Cause**: A developer used synchronous `requests.get()` and called `json.loads()` on a 25MB payload inside an `async def` route, which **blocked the AsyncIO Event Loop** and froze all other concurrent requests.
- **Fix**: Switched to non-blocking `httpx.AsyncClient`, offloaded heavy JSON parsing to a thread pool with `asyncio.to_thread()`, and upgraded to `orjson` (Rust-based fast serializer), dropping response times back to 35ms.

### 4. Strategy for dependency management and packaging:
**In Simple Words:**
I use **uv** (Astral's blazingly fast Rust-based package manager) or **Poetry** with deterministic lockfiles. In Docker, I use **Multi-Stage Builds**:
- *Builder stage*: Compiles C extensions and wheels.
- *Final stage*: Uses a slim image (`python:3.12-slim`), copies only installed packages, and runs as a non-root user (`USER nonroot`).

### 5. Approach to automated testing in Python:
**In Simple Words:**
- `pytest` with `pytest-asyncio` for async tests.
- Wrap tests in **transactional rollbacks** so every test runs in an isolated nested transaction that rolls back on teardown (fast, clean, and avoids database truncation).
- Mock external HTTP APIs using `respx` and run real PostgreSQL/Redis instances in CI with Testcontainers.

---

## Part 2: Python Core Language, Internals & Runtime (6 - 25)

### 6. Memory management in Python: Reference Counting & Generational GC:
**In Simple Words:**
CPython manages memory in two ways:
1. **Reference Counting (Immediate)**: Every object tracks how many variables point to it (`ob_refcnt`). When it reaches 0, memory is freed immediately.
2. **Generational Cyclic GC (Background)**: Detects circular references (`a.b = b; b.a = a`) where reference counts never hit 0, grouping objects into 3 generations (Gen 0, 1, 2) based on survival age.

### 7. What is the Global Interpreter Lock (GIL) and free-threaded Python?
**In Simple Words:**
The GIL is a mutex in CPython that ensures only one native thread executes Python bytecode at a time, protecting CPython memory management from race conditions.
- **Impact**: Multi-threaded Python cannot run CPU-bound tasks in parallel across multiple CPU cores.
- **Python 3.13+ Free-threaded Mode (PEP 703)**: Introduces an experimental build that removes the GIL for true multi-threaded CPU parallelism.

### 8. Mutable vs Immutable data types:
- **Immutable**: `int`, `float`, `str`, `tuple`, `frozenset`, `bytes`. Modifying one creates a brand-new object in memory.
- **Mutable**: `list`, `dict`, `set`. Elements can be modified in-place without changing the object's memory address pointer.

### 9. `is` vs `==` and Integer Caching:
- `==`: Compares values (`a == b`).
- `is`: Compares memory identity (`id(a) == id(b)`).
- **Small Integer Caching**: CPython pre-allocates integers between `-5` and `256`, so `a = 100; b = 100; a is b` is `True`.

### 10. Python Decorators and `functools.wraps`:
**In Simple Words:**
A decorator is a function that takes another function, wraps its behavior, and returns a new function. `functools.wraps` is essential to preserve the original function's name (`__name__`) and docstring:
```python
import functools, time

def time_it(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        res = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.4f}s")
        return res
    return wrapper
```

### 11. Generators and the `yield` keyword:
**In Simple Words:**
Generators produce items on-demand (lazy evaluation) one at a time instead of storing an entire list in RAM, keeping memory usage constant at $O(1)$ even for millions of rows.

### 12. The Iterator Protocol:
- **Iterable**: Implements `__iter__()` returning an Iterator.
- **Iterator**: Implements `__next__()` returning the next item, raising `StopIteration` when finished.

### 13. Context Managers and the `with` statement:
**In Simple Words:**
Ensures cleanup logic (closing file handles, releasing DB locks) runs reliably even if an exception occurs:
```python
from contextlib import contextmanager

@contextmanager
def open_resource():
    print("Acquiring resource")
    yield "Resource"
    print("Cleaned up resource")
```

### 14. `*args`, `**kwargs`, positional-only and keyword-only arguments:
- `*args`: Collects extra positional arguments into a tuple.
- `**kwargs`: Collects extra keyword arguments into a dictionary.
- `/`: Marks parameters before it as **positional-only** (`def f(x, /): ...`).
- `*`: Marks parameters after it as **keyword-only** (`def f(*, timeout=30): ...`).

### 15. Dunder methods: `__str__` vs `__repr__`, `__new__` vs `__init__`:
- `__str__`: Human-friendly string for end users (`print(obj)`).
- `__repr__`: Formal developer string (`eval(repr(obj)) == obj`).
- `__new__`: Actually creates and allocates the instance in memory.
- `__init__`: Initializes attributes on the newly created instance.

### 16. Multiple Inheritance and Method Resolution Order (MRO):
Python uses the **C3 Linearization Algorithm** to determine the exact order in which parent classes are searched for methods, resolving the Diamond Problem. Inspect via `Class.mro()`.

### 17. Metaclasses in Python:
A metaclass is the "class of a class". Just as an object is an instance of a class, a class is an instance of a metaclass (`type`). Used to validate class schemas or auto-register plugins.

### 18. `__slots__` and memory reduction:
By default, Python stores object attributes in a dynamic dictionary `__dict__`. Defining `__slots__ = ('name', 'age')` replaces the dictionary with a fixed-size C array, reducing memory by 40-70% for millions of objects.

### 19. `@staticmethod` vs `@classmethod` vs Instance Methods:
- **Instance method**: Takes `self`; operates on specific instance.
- **`@classmethod`**: Takes `cls`; operates on class (great for alternative constructors like `User.from_json()`).
- **`@staticmethod`**: Takes neither `self` nor `cls`; an isolated utility function grouped in class namespace.

### 20. Shallow Copy (`copy.copy()`) vs Deep Copy (`copy.deepcopy()`):
Shallow copy clones the outer container; inner nested objects still share memory addresses. Deep copy recursively duplicates all nested objects.

### 21. Dataclasses vs NamedTuple vs Pydantic:
- `@dataclass`: Standard library, lightweight class with auto-generated `__init__` and `__repr__`.
- `NamedTuple`: Immutable tuple with named fields; ultra-low memory.
- `Pydantic`: Built for runtime data parsing, schema coercion, and strict validation in APIs.

### 22. Exception Chaining (`raise ... from ...`):
Preserves the root cause stack trace when re-raising exceptions: `raise ServiceError("Failed") from original_err`.

### 23. First-Class Functions:
Functions can be passed as arguments, assigned to variables, stored in dictionaries, and returned from other functions.

### 24. List, Dict, and Set Comprehensions:
Concise syntax for constructing collections: `[x * 2 for x in nums if x > 0]`. Use generator expressions `(x * 2 for x in nums)` when datasets are huge to avoid allocating memory.

### 25. The `dis` module and CPython Bytecode:
Python compiles `.py` files into `.pyc` bytecode instructions (`LOAD_FAST`, `BINARY_OP`) executed by CPython. The `dis` module disassembles bytecode for performance inspection.

---

## Part 3: Async Programming & Concurrency (26 - 40)

### 26. Threading vs Multiprocessing vs AsyncIO:
- **AsyncIO**: Single-threaded cooperative multitasking for high-concurrency network I/O.
- **Threading**: Multi-threaded for I/O-bound tasks where C extensions release the GIL. Constrained by GIL for CPU tasks.
- **Multiprocessing**: Spawns separate OS processes across multiple CPU cores for CPU-heavy tasks.

### 27. AsyncIO: Coroutines, Tasks, and Futures:
- **Coroutine**: A function defined with `async def`. Pauses on `await`.
- **Task**: A scheduled coroutine running on the Event Loop.
- **Future**: A low-level object representing an eventual result of an async operation.

### 28. Blocking the Event Loop & offloading to threads:
Running synchronous code (like `time.sleep()`) freezes the single Event Loop thread.
**Fix**: Offload it to a thread pool: `await asyncio.to_thread(sync_func, arg)`.

### 29. `asyncio.gather()` vs `asyncio.TaskGroup()`:
`asyncio.gather()` runs awaitables concurrently; if one fails, others may run orphaned. `asyncio.TaskGroup()` (Python 3.11+) enforces **Structured Concurrency**: if any task fails, all sibling tasks are cancelled and cleaned up automatically.

### 30. `wait()` vs `as_completed()` vs `shield()`:
- `wait()`: Waits on tasks with conditions (`FIRST_COMPLETED`).
- `as_completed()`: Yields tasks in real-time as they finish.
- `shield()`: Protects an awaitable from being cancelled if parent coroutine is cancelled.

### 31. Async Context Managers & Async Iterators:
- **Async Iterator**: Implements `__aiter__()` and `__anext__()`, consumed with `async for`.
- **Async Context Manager**: Implements `__aenter__()` and `__aexit__()`, consumed with `async with`.

### 32. CPU-bound vs I/O-bound scaling:
- **I/O-Bound**: Waiting on network or disk; scaled easily with `asyncio`.
- **CPU-Bound**: Heavy computations; must use `multiprocessing.Pool` or `ProcessPoolExecutor` to utilize multiple physical CPU cores.

### 33. Process Pools vs Thread Pools and Shared State:
Processes have separate memory spaces. Sharing data across processes requires IPC primitives (`multiprocessing.Queue`, `Value`, `Manager`).

### 34. Race Conditions and Locks:
Occurs when multiple threads mutate shared state without synchronization. Protected via `threading.Lock` (mutex) or `Semaphore` (limits concurrent access).

### 35. Deadlocks in multi-threaded applications:
Two threads mutually hold one lock and wait for the other. Prevented by enforcing strict lock acquisition order or using timeouts: `lock.acquire(timeout=5.0)`.

### 36. I/O Multiplexing (`epoll` / `kqueue`):
Kernel mechanisms that monitor thousands of network sockets and notify Python when one is ready to read/write, powering AsyncIO without thread-per-connection overhead.

### 37. Graceful AsyncIO Shutdown:
Catch SIGINT/SIGTERM, cancel all pending tasks with `t.cancel()`, wait for tasks with `asyncio.gather(*tasks, return_exceptions=True)`, close DB pools, and stop the loop cleanly.

### 38. AnyIO and Structured Concurrency:
Guarantees that background tasks cannot outlive the function block that created them, preventing leaked background coroutines.

### 39. Producer-Consumer with `asyncio.Queue`:
Producers put tasks into `asyncio.Queue(maxsize=100)`; worker coroutines run in an infinite loop pulling items via `await queue.get()`, processing them, and calling `queue.task_done()`.

### 40. Gunicorn with Uvicorn Workers:
Gunicorn manages the master process, handling worker restarts and rolling reloads. Each worker runs an asynchronous `UvicornWorker` on a dedicated CPU core.

---

## Part 4: FastAPI, Flask & Web API Architecture (41 - 55)

### 41. Why FastAPI achieves high performance:
Combines **Starlette** (fast async ASGI web framework), **Pydantic** (data validation compiled in Rust), and native **ASGI** non-blocking event loop execution.

### 42. WSGI vs ASGI:
- **WSGI (Flask, Django)**: Synchronous; 1 request per worker thread; cannot handle concurrent WebSockets or streaming.
- **ASGI (FastAPI)**: Asynchronous; handles thousands of concurrent HTTP requests, WebSockets, and Server-Sent Events on the event loop.

### 43. FastAPI Dependency Injection (`Depends()`):
Declarative system used to inject database sessions per-request, verify JWT auth tokens, and enforce role-based access control (RBAC):
```python
@app.get("/profile")
async def get_profile(user: User = Depends(get_current_user)):
    return user
```

### 44. Pydantic v2 performance boost:
Rewrote its core parsing engine in **Rust** (`pydantic-core`), delivering a 5x to 20x speedup over pure-Python v1.

### 45. `async def` vs standard `def` in FastAPI endpoints:
- `async def`: Runs directly on the main event loop thread; must contain non-blocking async code.
- `def`: FastAPI automatically offloads standard synchronous endpoints to an external thread pool so they don't block the event loop.

### 46. BackgroundTasks vs Celery:
- `BackgroundTasks`: In-process tasks running after the response is sent. Good for small jobs (sending an email). If server restarts, queued tasks are lost.
- **Celery**: Persistent distributed task queue backed by RabbitMQ/Redis. Mandatory for mission-critical jobs (billing, video processing).

### 47. FastAPI Middleware:
Intercepts every incoming request and outgoing response:
```python
@app.middleware("http")
async def add_timing(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Process-Time"] = f"{time.perf_counter() - start:.4f}s"
    return response
```

### 48. Centralized Exception Handling in FastAPI:
Use `@app.exception_handler(CustomException)` to catch domain exceptions globally and return consistent JSON error responses with status codes.

### 49. Application Factory Pattern in Flask:
Encapsulates app creation inside `create_app(config)`: avoids circular imports, allows different configs for unit testing, and modularizes blueprints.

### 50. Flask Contexts: Application vs Request Context:
- **Application Context (`current_app`, `g`)**: Bound to application config and state.
- **Request Context (`request`, `session`)**: Bound to a specific incoming HTTP request.

### 51. JWT Authentication with Refresh Token Rotation:
- Access Token: Short-lived (15 mins), signed with private key.
- Refresh Token: Long-lived (7 days), stored in database; every use invalidates the old token and issues a new pair to prevent reuse attacks.

### 52. Server-Sent Events (SSE) in FastAPI:
Stream events using `StreamingResponse(event_generator(), media_type="text/event-stream")`.

### 53. API Rate Limiting with Redis:
Store request counts per IP in Redis with a 60-second expiration. If count exceeds limit, return HTTP 429 Too Many Requests.

### 54. OpenAPI (Swagger) Customization in FastAPI:
FastAPI automatically derives OpenAPI docs from Pydantic types. Customize with `tags`, `summary`, `response_model`, and security schemes.

### 55. Secure File Uploads: `UploadFile` vs `bytes`:
`bytes` reads the whole file directly into RAM (dangerous for large files). `UploadFile` streams chunks to temporary disk storage once exceeding 1MB.

---

## Part 5: ORMs, Data Persistence & Distributed Tasks (56 - 65)

### 56. SQLAlchemy 2.0 vs Legacy 1.x:
Unifies Core and ORM syntax around `select(Model).where(...)`, fully adopts Python type annotations (`Mapped[int] = mapped_column()`), and natively supports async execution.

### 57. Unit of Work and Identity Map:
- **Unit of Work**: Tracks all model mutations in a transaction and flushes them in a single coordinated SQL batch.
- **Identity Map**: Ensures that each database row is represented by exactly one Python object per `Session`.

### 58. Async SQLAlchemy with `asyncpg`:
```python
engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
async_session = async_sessionmaker(engine, class_=AsyncSession)
```

### 59. N+1 Query Elimination in SQLAlchemy:
- `joinedload()`: Uses a SQL `LEFT JOIN` to fetch related 1-to-1 or 1-to-few objects.
- `selectinload()`: Emits a second query with `WHERE parent_id IN (...)` to fetch 1-to-many collections efficiently.

### 60. Alembic Migration Best Practices:
Always inspect generated SQL with `alembic upgrade --sql`, add new columns as nullable first, and create PostgreSQL indexes concurrently.

### 61. Celery Architecture: Broker & Result Backend:
- **Broker (RabbitMQ/Redis)**: Stores serialized pending task messages.
- **Workers**: Distributed background processes executing tasks.
- **Result Backend (Redis/Postgres)**: Stores return values and task status.

### 62. Celery Retries & Task Idempotency:
```python
@app.task(bind=True, max_retries=5)
def charge_user(self, user_id):
    try:
        call_gateway(user_id)
    except GatewayError as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
```
Tasks must be **idempotent** so that retrying a task produces identical results without double-charging users.

### 63. Celery Canvas Workflows:
- `chain(t1 | t2)`: Executes tasks sequentially, passing results forward.
- `group([t1, t2])`: Runs tasks in parallel.
- `chord(group([t1, t2]) | callback)`: Runs tasks in parallel and invokes callback when all finish.

### 64. Preventing Worker Memory Leaks:
Configure `--max-tasks-per-child=1000` to automatically restart worker processes after processing $N$ tasks, releasing leaked C library memory.

### 65. Alternatives to Celery (ARQ, Dramatiq):
- **ARQ**: AsyncIO-native task queue backed by Redis; lightweight and fast.
- **Dramatiq**: Simpler, more reliable alternative to Celery with built-in retries and actor model.
