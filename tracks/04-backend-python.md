# Full-Stack & Backend Python Master Interview Question Bank: FastAPI, AsyncIO, Core & Internals (1 - 65)

> Simple, intuitive, and easy-to-explain technical interview questions and deep-dive answers covering Python 3.12+ internals, CPython memory management, the GIL, AsyncIO concurrency, FastAPI / Starlette, Pydantic v2, SQLAlchemy 2.0, and Celery workflows with practical Python code examples.

---

## Part 1: Candid Experience, Architecture & Intro (1 - 5)

### 1. What is Python, and what are its core architectural characteristics (interpreted, dynamically typed, multi-paradigm)?
**In Simple Words:**
Python is a **high-level, general-purpose, interpreted, dynamically typed, garbage-collected** programming language created by Guido van Rossum in 1991. It emphasizes readability, rapid developer productivity, and clean syntax ("batteries included").

**Core Architectural Characteristics:**
1. **Bytecode Compilation & PVM Execution**: Python source code (`.py`) is first compiled into bytecode (`.pyc`), which is then executed by the CPython Virtual Machine (PVM).
2. **Dynamic & Strong Typing**: Variables are dynamic (they can point to values of any type at runtime), but the language is strongly typed (Python will not silently coerce types, e.g. `"5" + 2` throws a `TypeError`).
3. **Multi-Paradigm**: First-class support for Object-Oriented Programming (classes, multiple inheritance), Functional Programming (map, filter, list comprehensions, lambdas), and Procedural code.
4. **Memory Management**: Automatic memory management combining **Reference Counting** (immediate deallocation when references hit 0) with a **Generational Garbage Collector** (detecting reference cycles in Generations 0, 1, and 2).
5. **The Global Interpreter Lock (GIL)**: A mutex that protects CPython object memory, preventing multiple native threads from executing Python bytecode simultaneously within a single process. Concurrency is achieved via **AsyncIO** (for I/O-bound tasks) or **multiprocessing** (for CPU-bound tasks).

```python
# Dynamic introspection and bytecode disassembly in Python:
import dis
import sys

# 1. Dynamic typing with strong type enforcement
x = 42
print(f"Value: {x}, Type: {type(x)}, RefCount: {sys.getrefcount(x)}")

try:
    result = "100" + x  # Strong typing prevents implicit string/int addition
except TypeError as e:
    print(f"Strong typing in action: {e}")

# 2. Inspecting Python bytecode with dis:
def calculate_square(num: int) -> int:
    return num * num

print("\nCPython Bytecode Disassembly:")
dis.dis(calculate_square)
```

### 2. Walk me through your hands-on experience building Python backend applications, and how you decide between FastAPI, Flask, and Django.
**In Simple Words:**
"I am a Senior Backend and Full-Stack Engineer specializing in high-performance Python, asynchronous microservices, and distributed architectures. I build services using **FastAPI**, **Flask**, and **Django**, integrated with async database drivers (`asyncpg`), message brokers (RabbitMQ, Redis), and background task workers (Celery, ARQ).

My framework decision matrix:
- **FastAPI**: My default choice for modern, high-throughput microservices. Built on Starlette and Pydantic v2, it features native AsyncIO ASGI concurrency, automatic OpenAPI/Swagger documentation, and compile-time type validation.
- **Flask**: Best for small utility microservices and lightweight automation scripts where an un-opinionated, minimal footprint is desired.
- **Django**: Best for full-featured monoliths requiring built-in administrative dashboards, auth systems, and robust ORM features out of the box."

```python
# FastAPI modern async route with Pydantic v2 validation:
from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

app = FastAPI(title="Production Service")

class UserRegisterDTO(BaseModel):
    email: EmailStr
    full_name: str
    age: int

@app.post("/api/v1/users", status_code=201)
async def register_user(dto: UserRegisterDTO):
    return {"status": "success", "user": dto.model_dump()}
```

### 3. Describe a severe Python backend performance bottleneck you resolved.
**How to Explain in an Interview:**
- **Problem**: In a FastAPI ingestion API, request latency jumped from 40ms to 4.2 seconds under heavy load.
- **Root Cause**: A developer used synchronous `requests.get()` and called `json.loads()` on a 25MB payload inside an `async def` route, which **blocked the AsyncIO Event Loop** and froze all other concurrent requests.
- **Fix**: Switched to non-blocking `httpx.AsyncClient`, offloaded heavy JSON parsing to a thread pool with `asyncio.to_thread()`, and upgraded to `orjson` (Rust-based fast serializer), dropping response times back to 35ms.

```python
# Non-blocking HTTP client with thread-offloaded JSON deserialization:
import httpx
import asyncio
import orjson

async def fetch_and_parse(url: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        # Offload CPU-heavy parsing away from the main event loop:
        return await asyncio.to_thread(orjson.loads, response.content)
```

### 4. Strategy for dependency management and packaging:
**In Simple Words:**
I use **uv** (Astral's blazingly fast Rust-based package manager) or **Poetry** with deterministic lockfiles. In Docker, I use **Multi-Stage Builds**:
- *Builder stage*: Compiles C extensions and wheels.
- *Final stage*: Uses a slim image (`python:3.12-slim`), copies only installed packages, and runs as a non-root user (`USER nonroot`).

```dockerfile
# Multi-stage Dockerfile using uv for ultra-fast builds:
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"
USER 10001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 5. Approach to automated testing in Python:
**In Simple Words:**
- `pytest` with `pytest-asyncio` for async tests.
- Wrap tests in **transactional rollbacks** so every test runs in an isolated nested transaction that rolls back on teardown (fast, clean, and avoids database truncation).
- Mock external HTTP APIs using `respx` and run real PostgreSQL/Redis instances in CI with Testcontainers.

```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_create_user(db_session):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/users", json={"email": "test@example.com", "full_name": "Test User", "age": 28})
        assert response.status_code == 201
        assert response.json()["user"]["email"] == "test@example.com"
```

---

## Part 2: Python Core Language, Internals & Runtime (6 - 25)

### 6. Memory management in Python: Reference Counting & Generational GC:
**In Simple Words:**
CPython manages memory in two ways:
1. **Reference Counting (Immediate)**: Every object tracks how many variables point to it (`ob_refcnt`). When it reaches 0, memory is freed immediately.
2. **Generational Cyclic GC (Background)**: Detects circular references (`a.b = b; b.a = a`) where reference counts never hit 0, grouping objects into 3 generations (Gen 0, 1, 2) based on survival age.

```python
import sys, gc

a = []
print(sys.getrefcount(a)) # 2 (variable 'a' + argument passed to getrefcount)

# Creating a reference cycle:
class Node:
    pass

n1, n2 = Node(), Node()
n1.other = n2
n2.other = n1
del n1, n2 # Reference count never hits 0; collected by generational GC:
gc.collect() # Manually triggers cyclic garbage collection
```

### 7. What is the Global Interpreter Lock (GIL) and free-threaded Python?
**In Simple Words:**
The GIL is a mutex in CPython that ensures only one native thread executes Python bytecode at a time, protecting CPython memory management from race conditions.
- **Impact**: Multi-threaded Python cannot run CPU-bound tasks in parallel across multiple CPU cores.
- **Python 3.13+ Free-threaded Mode (PEP 703)**: Introduces an experimental build that removes the GIL for true multi-threaded CPU parallelism.

```python
# To achieve true multi-core CPU parallelism in standard CPython:
from concurrent.futures import ProcessPoolExecutor

def cpu_heavy_task(n):
    return sum(i * i for i in range(n))

if __name__ == '__main__':
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(cpu_heavy_task, [10_000_000, 10_000_000]))
```

### 8. Mutable vs Immutable data types:
**In Simple Words:**
- **Immutable**: `int`, `float`, `str`, `tuple`, `frozenset`, `bytes`. Modifying one creates a brand-new object in memory.
- **Mutable**: `list`, `dict`, `set`. Elements can be modified in-place without changing the object's memory address pointer.

```python
# Dangerous default mutable argument bug:
def append_item(val, target=[]): # target is evaluated ONCE at definition time!
    target.append(val)
    return target

print(append_item(1)) # [1]
print(append_item(2)) # [1, 2] -- UNEXPECTED!

# Safe idiom:
def safe_append(val, target=None):
    if target is None: target = []
    target.append(val)
    return target
```

### 9. `is` vs `==` and Integer Caching:
**In Simple Words:**
- `==`: Compares values (`a == b`).
- `is`: Compares memory identity (`id(a) == id(b)`).
- **Small Integer Caching**: CPython pre-allocates integers between `-5` and `256`, so `a = 100; b = 100; a is b` is `True`.

```python
a = 256
b = 256
print(a is b) # True (cached by CPython runtime)

x = 1000
y = 1000
print(x == y) # True (same values)
print(x is y) # False (different objects in memory)
```

### 10. Python Decorators and `functools.wraps`:
**In Simple Words:**
A decorator is a function that takes another function, wraps its behavior, and returns a new function. `functools.wraps` is essential to preserve the original function's name (`__name__`) and docstring.

```python
import functools, time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"{func.__name__} took {duration:.4f}s")
        return result
    return wrapper

@timer
def compute():
    return sum(range(1_000_000))
```

### 11. Generators and the `yield` keyword:
**In Simple Words:**
A generator produces values on demand one at a time using `yield` instead of returning an entire collection at once, achieving $O(1)$ memory consumption.

```python
def read_large_file(file_path):
    with open(file_path, 'r') as f:
        for line in f:
            yield line.strip() # Memory-efficient lazy evaluation

# Reads gigabytes of logs without running out of RAM:
for log_entry in read_large_file("huge_log.txt"):
    if "ERROR" in log_entry:
        print(log_entry)
```

### 12. The Iterator Protocol:
**In Simple Words:**
An object is an iterator if it implements two dunder methods: `__iter__()` (returns self) and `__next__()` (returns next item or raises `StopIteration`).

```python
class Countdown:
    def __init__(self, start):
        self.count = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.count <= 0: raise StopIteration
        val = self.count
        self.count -= 1
        return val

for num in Countdown(3):
    print(num) # 3, 2, 1
```

### 13. Context Managers and the `with` statement:
**In Simple Words:**
Guarantees resource acquisition and deterministic cleanup (e.g. closing files or DB connections) via `__enter__` and `__exit__`, even if an unhandled exception is raised.

```python
from contextlib import contextmanager

# 1. Class-based:
class DBTransaction:
    def __enter__(self):
        print("BEGIN TRANSACTION")
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type: print("ROLLBACK")
        else: print("COMMIT")
        return False # Propagate exception if any

# 2. Generator-based with @contextmanager:
@contextmanager
def open_resource():
    print("Acquired")
    try: yield "RESOURCE"
    finally: print("Cleaned up")
```

### 14. `*args`, `**kwargs`, positional-only and keyword-only arguments:
**In Simple Words:**
- `*args`: Collects positional arguments into a tuple.
- `**kwargs`: Collects keyword arguments into a dictionary.
- `/`: Everything to the left is **positional-only**.
- `*`: Everything to the right is **keyword-only**.

```python
def configure(host, port, /, timeout=30, *, secure=True):
    return f"{host}:{port} (timeout={timeout}, secure={secure})"

# Valid:
configure("127.0.0.1", 8080, secure=True)

# Invalid (raises TypeError):
# configure(host="127.0.0.1", port=8080)
```

### 15. Dunder methods: `__str__` vs `__repr__`, `__new__` vs `__init__`:
**In Simple Words:**
- `__str__`: User-friendly readable string for end users.
- `__repr__`: Unambiguous string for developers and debugging (`eval(repr(obj)) == obj`).
- `__new__`: Allocates and returns the new instance in memory (used in Singletons and immutable types).
- `__init__`: Initializes the newly created instance attributes.

```python
class User:
    def __init__(self, name: str, id: int):
        self.name = name
        self.id = id

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"User(name={self.name!r}, id={self.id})"
```

### 16. Multiple Inheritance and Method Resolution Order (MRO):
**In Simple Words:**
Python resolves multiple inheritance orders using the **C3 Linearization Algorithm** (depth-first, left-to-right, preserving local precedence). Check it with `ClassName.mro()`.

```python
class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass

print([cls.__name__ for cls in D.mro()])
# Output: ['D', 'B', 'C', 'A', 'object']
```

### 17. Metaclasses in Python:
**In Simple Words:**
A metaclass is a "class of a class" that defines how a class is constructed. Classes are instances of metaclasses (default is `type`). Used in ORMs (Django models) and Pydantic.

```python
class EnforceUpperMeta(type):
    def __new__(mcs, name, bases, attrs):
        # Convert all custom attribute names to uppercase:
        upper_attrs = {k.upper() if not k.startswith("__") else k: v for k, v in attrs.items()}
        return super().__new__(mcs, name, bases, upper_attrs)

class Config(metaclass=EnforceUpperMeta):
    port = 8080

print(Config.PORT) # 8080
```

### 18. `__slots__` and memory reduction:
**In Simple Words:**
By default, Python objects store attributes in a dynamic dictionary (`__dict__`). Defining `__slots__` prevents `__dict__` creation, allocating fixed array pointers and saving up to 60% RAM for millions of objects.

```python
class PointWithSlots:
    __slots__ = ('x', 'y')
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = PointWithSlots(10, 20)
# p.z = 30  # Raises AttributeError: 'PointWithSlots' object has no attribute 'z'
```

### 19. `@staticmethod` vs `@classmethod` vs Instance Methods:
**In Simple Words:**
- **Instance method**: Takes `self`; accesses and mutates instance state.
- **`@classmethod`**: Takes `cls`; accesses class state; ideal for alternative factory constructors.
- **`@staticmethod`**: Takes neither `self` nor `cls`; acts as an isolated pure function inside a class namespace.

```python
class Date:
    def __init__(self, year, month, day):
        self.year, self.month, self.day = year, month, day

    @classmethod
    def from_string(cls, date_str): # Factory constructor
        y, m, d = map(int, date_str.split("-"))
        return cls(y, m, d)

    @staticmethod
    def is_valid_year(year):
        return 1900 <= year <= 2100
```

### 20. Shallow Copy (`copy.copy()`) vs Deep Copy (`copy.deepcopy()`);
**In Simple Words:**
- **Shallow Copy**: Duplicates the outer container, but inserts references to the original nested objects.
- **Deep Copy**: Recursively duplicates the container and all nested objects completely.

```python
import copy

original = [[1, 2, 3], [4, 5, 6]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

original[0][0] = 99
print(shallow[0][0]) # 99 (modified because nested list is shared!)
print(deep[0][0])    # 1 (safe and independent)
```

### 21. Dataclasses vs NamedTuple vs Pydantic:
**In Simple Words:**
- **`dataclass`**: Built-in; automatically generates `__init__`, `__repr__`, and `__eq__`.
- **`NamedTuple`**: Immutable tuple subclass; lightweight with named fields.
- **`Pydantic`**: Full data parsing and runtime validation for APIs with JSON coercion.

```python
from dataclasses import dataclass
from pydantic import BaseModel

@dataclass
class UserDataClass:
    name: str
    age: int

class UserPydantic(BaseModel):
    name: str
    age: int # Coerces "25" to 25 and validates at runtime
```

### 22. Exception Chaining (`raise ... from ...`):
**In Simple Words:**
Preserves the root cause exception trace when re-raising a higher-level custom domain exception using `from e`.

```python
class DatabaseError(Exception): pass

def query_user(user_id):
    try:
        raise ConnectionRefusedError("Connection failed")
    except ConnectionRefusedError as err:
        # Chains exceptions preserving original traceback:
        raise DatabaseError(f"Could not fetch user {user_id}") from err
```

### 23. First-Class Functions:
**In Simple Words:**
In Python, functions are first-class citizens: they can be passed as arguments, returned from other functions, assigned to variables, and stored in data structures.

```python
def shout(text): return text.upper()
def whisper(text): return text.lower()

def format_message(formatter_fn, msg):
    return formatter_fn(msg)

print(format_message(shout, "hello")) # HELLO
```

### 24. List, Dict, and Set Comprehensions:
**In Simple Words:**
Concise, readable syntax for creating collections from iterables with inline filtering.

```python
# List comprehension:
squares = [x * x for x in range(10) if x % 2 == 0]

# Dict comprehension:
user_map = {u["id"]: u["name"] for u in [{"id": 1, "name": "Alice"}]}

# Set comprehension:
unique_lengths = {len(w) for w in ["apple", "banana", "pear", "apple"]}
```

### 25. The `dis` module and CPython Bytecode:
**In Simple Words:**
CPython compiles Python source code into bytecode before executing it on the virtual machine. Use `dis.dis()` to inspect low-level bytecode instructions.

```python
import dis

def add(a, b):
    return a + b

dis.dis(add)
# Shows: LOAD_FAST (a), LOAD_FAST (b), BINARY_OP (+), RETURN_VALUE
```

---

## Part 3: Asynchronous Programming & Concurrency (26 - 40)

### 26. Threading vs Multiprocessing vs AsyncIO:
**In Simple Words:**
- **AsyncIO**: Single-thread cooperative multitasking via an event loop. Best for high-concurrency I/O-bound web sockets and network APIs.
- **Threading**: Multiple OS threads sharing same memory, bounded by the GIL. Best for I/O operations (file reading, external calls).
- **Multiprocessing**: Multiple independent OS processes, each with its own Python interpreter and memory. Bypasses the GIL for CPU-bound computations.

```python
# AsyncIO high-concurrency I/O:
import asyncio

async def fetch_item(item_id):
    await asyncio.sleep(0.01) # Non-blocking I/O simulation
    return item_id

async def main():
    results = await asyncio.gather(*(fetch_item(i) for i in range(1000)))
asyncio.run(main())
```

### 27. AsyncIO: Coroutines, Tasks, and Futures:
**In Simple Words:**
- **Coroutine**: A function declared with `async def` that can pause execution via `await`.
- **Task**: A wrapper that schedules a coroutine to run on the event loop concurrently (`asyncio.create_task()`).
- **Future**: Low-level object representing an eventual result of an async operation.

```python
async def worker(name):
    print(f"Worker {name} started")
    await asyncio.sleep(1)
    return f"{name} done"

async def run_tasks():
    # Schedules both tasks to run concurrently in background:
    t1 = asyncio.create_task(worker("A"))
    t2 = asyncio.create_task(worker("B"))
    res = await asyncio.gather(t1, t2)
    print(res)
```

### 28. Blocking the Event Loop & offloading to threads:
**In Simple Words:**
Running synchronous blocking code (`time.sleep`, `requests.get`, image processing) in an async route freezes the single event loop thread for all users!
**Fix**: Offload to a background thread using `asyncio.to_thread()`.

```python
import time, asyncio

def cpu_heavy_hash(password: str) -> str:
    time.sleep(2) # Synchronous blocking hash simulation
    return f"hashed_{password}"

async def handle_signup(password: str):
    # Runs the blocking function in a separate OS worker thread:
    hashed = await asyncio.to_thread(cpu_heavy_hash, password)
    return {"status": "ok", "hash": hashed}
```

### 29. `asyncio.gather()` vs `asyncio.TaskGroup()`:
**In Simple Words:**
- `asyncio.gather()`: Runs tasks concurrently. If one fails, others keep running by default unless cancelled manually.
- `asyncio.TaskGroup()` (Python 3.11+): Implements **Structured Concurrency**. If one task fails with an unhandled exception, all remaining child tasks are automatically cancelled immediately!

```python
# Modern structured concurrency with TaskGroup:
async def run_pipeline():
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(fetch_user(1))
        task2 = tg.create_task(fetch_orders(1))
    # Both tasks are guaranteed completed or cancelled when exiting context block
    print(task1.result(), task2.result())
```

### 30. `wait()` vs `as_completed()` vs `shield()`:
**In Simple Words:**
- `as_completed()`: Yields results as each task finishes, processing fastest responses first.
- `wait()`: Waits for tasks with return conditions (`FIRST_COMPLETED`, `ALL_COMPLETED`).
- `shield()`: Protects a critical coroutine from being cancelled by its caller.

```python
# Process results as soon as each finishes:
async def process_fastest():
    tasks = [fetch_api_a(), fetch_api_b(), fetch_api_c()]
    for coro in asyncio.as_completed(tasks):
        result = await coro
        print("Got result:", result)
```

### 31. Async Context Managers & Async Iterators:
**In Simple Words:**
- Async Context Manager: Implements `__aenter__` and `__aexit__` with `async with`.
- Async Iterator: Implements `__aiter__` and `__anext__` with `async for`.

```python
class AsyncStreamer:
    def __aiter__(self):
        self.count = 0
        return self

    async def __anext__(self):
        if self.count >= 3: raise StopAsyncIteration
        await asyncio.sleep(0.1)
        self.count += 1
        return self.count

async def test_stream():
    async for item in AsyncStreamer():
        print(item)
```

### 32. CPU-bound vs I/O-bound scaling:
**In Simple Words:**
- **I/O-Bound**: Use AsyncIO or Threading (waiting for DB, network sockets).
- **CPU-Bound**: Use `ProcessPoolExecutor` or background task queues (Celery/RabbitMQ) across multiple CPU cores.

```python
from concurrent.futures import ProcessPoolExecutor
import math

def calculate_primes(n):
    return [x for x in range(2, n) if all(x % d != 0 for d in range(2, int(math.isqrt(x)) + 1))]

# Runs across all machine CPU cores in parallel:
with ProcessPoolExecutor() as pool:
    prime_chunks = list(pool.map(calculate_primes, [100000, 200000, 300000]))
```

### 33. Process Pools vs Thread Pools and Shared State:
**In Simple Words:**
- **Thread Pool**: Shares the same memory space. Fast, but subject to GIL and race conditions.
- **Process Pool**: Separate memory spaces. Requires inter-process communication (IPC / Pickling) to pass data back and forth.

```python
# Multiprocessing shared memory with Value or Array:
from multiprocessing import Process, Value

def increment(counter):
    with counter.get_lock(): # Synchronize access
        counter.value += 1

if __name__ == '__main__':
    shared_counter = Value('i', 0)
    p = Process(target=increment, args=(shared_counter,))
    p.start()
    p.join()
    print(shared_counter.value) # 1
```

### 34. Race Conditions and Locks:
**In Simple Words:**
A race condition occurs when two threads concurrently read and modify shared data. Fix: Protect critical sections using `threading.Lock` or `asyncio.Lock`.

```python
# AsyncIO Lock protecting shared in-memory balance:
balance = 100
lock = asyncio.Lock()

async def withdraw(amount):
    global balance
    async with lock:
        if balance >= amount:
            await asyncio.sleep(0.01) # Context switch
            balance -= amount
            return True
        return False
```

### 35. Deadlocks in multi-threaded applications:
**In Simple Words:**
Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1. Both freeze indefinitely.
**Prevention**: Always acquire multiple locks in identical order across all code paths.

```python
import threading

lock_a = threading.Lock()
lock_b = threading.Lock()

# Safe: Both threads acquire Lock A first, then Lock B
def worker():
    with lock_a:
        with lock_b:
            print("Acquired both safely!")
```

### 36. I/O Multiplexing (`epoll` / `kqueue`):
**In Simple Words:**
OS kernel primitives that monitor thousands of file descriptors and network sockets, waking up the Python event loop only when a socket has data ready to read/write.

```python
# Low-level selectors module wrapping epoll/kqueue:
import selectors, socket

sel = selectors.DefaultSelector() # Uses epoll on Linux, kqueue on macOS
server = socket.socket()
server.bind(('localhost', 9000))
server.listen()
server.setblocking(False)

sel.register(server, selectors.EVENT_READ, data=None)
```

### 37. Graceful AsyncIO Shutdown:
**In Simple Words:**
Catch `SIGTERM` and `SIGINT`, cancel all pending tasks, and wait for them to finish with `asyncio.gather(*tasks, return_exceptions=True)`.

```python
import signal, asyncio

async def shutdown(loop, sig):
    print(f"Received exit signal {sig.name}...")
    tasks = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]
    for t in tasks: t.cancel()
    await asyncio.gather(*tasks, return_exceptions=True)
    loop.stop()
```

### 38. AnyIO and Structured Concurrency:
**In Simple Words:**
AnyIO is an asynchronous compatibility library that works across both AsyncIO and Trio, enforcing structured concurrency where background tasks cannot outlive their enclosing scope.

```python
import anyio

async def run_anyio_tasks():
    async with anyio.create_task_group() as tg:
        tg.start_soon(anyio.sleep, 1)
        tg.start_soon(anyio.sleep, 2)
    # Guaranteed all child tasks completed safely here
```

### 39. Producer-Consumer with `asyncio.Queue`:
**In Simple Words:**
Decouples producers generating work from worker consumers processing work concurrently with flow control.

```python
import asyncio

async def producer(queue: asyncio.Queue):
    for i in range(5):
        await queue.put(i)
        print(f"Produced: {i}")

async def consumer(queue: asyncio.Queue):
    while True:
        item = await queue.get()
        print(f"Consumed: {item}")
        queue.task_done()
```

### 40. Gunicorn with Uvicorn Workers:
**In Simple Words:**
Gunicorn acts as the master process manager, spawning and monitoring multiple worker processes (one per CPU core) running the Uvicorn ASGI event loop.

```bash
# Production deployment command:
gunicorn app.main:app   --workers 4   --worker-class uvicorn.workers.UvicornWorker   --bind 0.0.0.0:8000   --timeout 60
```

---

## Part 4: Web Frameworks, APIs & FastAPI (41 - 55)

### 41. Why FastAPI achieves high performance:
**In Simple Words:**
1. **Starlette**: Built on Starlette for high-throughput asynchronous ASGI routing.
2. **Pydantic v2**: Powered by Pydantic's core written in Rust for 5-10x faster JSON serialization and schema validation.
3. **Async Native**: Runs concurrently on the AsyncIO event loop.

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.post("/items")
async def create_item(item: Item):
    return {"name": item.name, "tax": item.price * 0.2}
```

### 42. WSGI vs ASGI:
**In Simple Words:**
- **WSGI** (Flask, Django): Synchronous request-response specification. One thread per request; cannot handle WebSockets or long-polling efficiently.
- **ASGI** (FastAPI, Starlette): Asynchronous server interface. Handles thousands of concurrent connections and WebSockets on a single thread.

```python
# Raw ASGI application specification:
async def simple_asgi_app(scope, receive, send):
    assert scope['type'] == 'http'
    await send({
        'type': 'http.response.start',
        'status': 200,
        'headers': [[b'content-type', b'text/plain']],
    })
    await send({'type': 'http.response.body', 'body': b'Hello from ASGI!'})
```

### 43. FastAPI Dependency Injection (`Depends()`):
**In Simple Words:**
A declarative mechanism to inject shared resources (database sessions, authentication, configs) into route handlers with automatic lifecycle cleanup.

```python
from fastapi import Depends, HTTPException

async def get_current_user(token: str):
    if token != "secret-token":
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"user": "alice"}

@app.get("/profile")
async def read_profile(user: dict = Depends(get_current_user)):
    return user
```

### 44. Pydantic v2 performance boost:
**In Simple Words:**
Pydantic v2 rewrote its validation engine in Rust (`pydantic-core`), delivering up to 17x faster JSON validation and strict type parsing.

```python
from pydantic import BaseModel, Field, field_validator

class Product(BaseModel):
    title: str = Field(min_length=3)
    price: float = Field(gt=0)

    @field_validator('title')
    @classmethod
    def capitalize_title(cls, v: str) -> str:
        return v.title()
```

### 45. `async def` vs standard `def` in FastAPI endpoints:
**In Simple Words:**
- `async def`: Runs directly on the main AsyncIO event loop thread. Use when calling `await` on non-blocking async libraries.
- Standard `def`: FastAPI automatically offloads standard `def` routes to an internal worker thread pool, preventing blocking code from freezing the event loop!

```python
# Use standard def for legacy synchronous blocking libraries:
import time

@app.get("/sync-task")
def sync_endpoint():
    time.sleep(1) # Safe: FastAPI offloads this to an external thread pool!
    return {"status": "completed"}
```

### 46. BackgroundTasks vs Celery:
**In Simple Words:**
- **FastAPI BackgroundTasks**: Runs in-process in the same service after returning the HTTP response. Best for lightweight tasks (sending a welcome email).
- **Celery**: Distributed task queue backed by Redis/RabbitMQ. Survives process crashes and handles heavy batch processing across external worker fleets.

```python
from fastapi import BackgroundTasks

def send_email_notification(email: str):
    # Simulated email sending
    print(f"Sent email to {email}")

@app.post("/register")
async def register(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email_notification, email)
    return {"message": "Registration successful, email queued"}
```

### 47. FastAPI Middleware:
**In Simple Words:**
Intercepts incoming HTTP requests before reaching endpoints and inspects outgoing responses (e.g. adding request timings or correlation IDs).

```python
import time
from fastapi import Request

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{duration:.4f}s"
    return response
```

### 48. Centralized Exception Handling in FastAPI:
**In Simple Words:**
Catch custom domain exceptions globally and transform them into standardized JSON error responses.

```python
from fastapi import Request
from fastapi.responses import JSONResponse

class ItemNotFoundError(Exception):
    def __init__(self, item_id: int): self.item_id = item_id

@app.exception_handler(ItemNotFoundError)
async def item_not_found_handler(request: Request, exc: ItemNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"error": "ITEM_NOT_FOUND", "item_id": exc.item_id}
    )
```

### 49. Application Factory Pattern in Flask:
**In Simple Words:**
Enables creating multiple instances of a Flask app with different configurations (e.g. testing vs production) by defining a `create_app()` factory function.

```python
from flask import Flask

def create_app(config_name="default"):
    app = Flask(__name__)
    if config_name == "testing":
        app.config["TESTING"] = True
    # Register blueprints & extensions here
    return app
```

### 50. Flask Contexts: Application vs Request Context:
**In Simple Words:**
- **Application Context** (`current_app`, `g`): Bound to the application instance; stores DB connections and global app configs.
- **Request Context** (`request`, `session`): Bound to the current incoming HTTP request; stores cookies, headers, and form data.

```python
from flask import request, g

@app.before_request
def load_user():
    g.user_id = request.headers.get("X-User-ID")
```

### 51. JWT Authentication with Refresh Token Rotation:
**In Simple Words:**
Issue a short-lived Access Token (15m) and a long-lived Refresh Token (7d). On refresh, invalidate the old refresh token and issue a brand new pair.

```python
import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "my_jwt_secret"

def create_access_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
```

### 52. Server-Sent Events (SSE) in FastAPI:
**In Simple Words:**
Stream real-time text events to clients over a persistent HTTP connection using `StreamingResponse`.

```python
import asyncio
from fastapi.responses import StreamingResponse

async def event_generator():
    for i in range(5):
        await asyncio.sleep(1)
        yield f"data: {{"count": {i}}}

"

@app.get("/stream")
async def stream():
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

### 53. API Rate Limiting with Redis:
**In Simple Words:**
Track request count per IP address in Redis with an expiration window. If count exceeds limit, raise HTTP 429 Too Many Requests.

```python
from fastapi import HTTPException
import redis.asyncio as redis

r = redis.from_url("redis://localhost:6379")

async def check_rate_limit(client_ip: str, limit: int = 60):
    key = f"rate:{client_ip}"
    requests = await r.incr(key)
    if requests == 1: await r.expire(key, 60)
    if requests > limit:
        raise HTTPException(status_code=429, detail="Too Many Requests")
```

### 54. OpenAPI (Swagger) Customization in FastAPI:
**In Simple Words:**
Customize API metadata, security schemes, and documentation tags directly on the `FastAPI` app instance.

```python
app = FastAPI(
    title="Customer API",
    version="2.0.0",
    docs_url="/api/docs", # Custom Swagger URL
    redoc_url=None        # Disable ReDoc
)
```

### 55. Secure File Uploads: `UploadFile` vs `bytes`:
**In Simple Words:**
- `bytes`: Reads the entire file directly into RAM (crashes server on large multi-gigabyte files).
- `UploadFile`: Uses a SpooledTemporaryFile; buffers in RAM up to 1MB, then rolls over to disk automatically.

```python
from fastapi import UploadFile, File

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Stream chunks safely without loading entire file into RAM:
    while chunk := await file.read(1024 * 1024): # 1MB chunks
        pass
    return {"filename": file.filename}
```

---

## Part 5: ORMs, Databases & Background Workers (56 - 65)

### 56. SQLAlchemy 2.0 vs Legacy 1.x:
**In Simple Words:**
SQLAlchemy 2.0 unifies the Core and ORM syntax around explicit `select()` statements and provides full native support for type hints and async sessions.

```python
from sqlalchemy import select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase): pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

# Modern SQLAlchemy 2.0 query syntax:
stmt = select(User).where(User.name == "Alice")
```

### 57. Unit of Work and Identity Map:
**In Simple Words:**
- **Identity Map**: Tracks all loaded objects by primary key, ensuring querying the same row twice returns the exact same in-memory object instance.
- **Unit of Work**: Batches all inserts, updates, and deletes, executing them in optimal order upon `session.commit()`.

```python
# Identity Map in action:
user1 = session.get(User, 1)
user2 = session.get(User, 1)
assert user1 is user2 # Same memory address!
```

### 58. Async SQLAlchemy with `asyncpg`:
**In Simple Words:**
Use `create_async_engine` with `postgresql+asyncpg://` and `AsyncSession` to perform non-blocking database queries in FastAPI.

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
async_session = async_sessionmaker(engine, expire_on_commit=False)

async def get_user(user_id: int):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
```

### 59. N+1 Query Elimination in SQLAlchemy:
**In Simple Words:**
Fetching 100 posts and iterating their comments triggers 100 individual queries.
**Fix**: Use `selectinload()` or `joinedload()` to eager-load relations in a single or secondary batched query.

```python
from sqlalchemy.orm import selectinload

# Eager-load all comments using selectinload (eliminates N+1):
stmt = select(Post).options(selectinload(Post.comments))
result = await session.execute(stmt)
posts = result.scalars().all()
```

### 60. Alembic Migration Best Practices:
**In Simple Words:**
- Always inspect autogenerated migrations before applying.
- Use `op.batch_alter_table` for SQLite compatibility.
- Ensure all new columns have default values or are nullable for zero downtime.

```python
# Alembic migration script (versions/xxxx_add_status.py):
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.add_column('orders', sa.Column('status', sa.String(20), server_default='pending'))

def downgrade():
    op.drop_column('orders', 'status')
```

### 61. Celery Architecture: Broker & Result Backend:
**In Simple Words:**
- **Broker (RabbitMQ/Redis)**: Queues task messages.
- **Worker**: Consumes and executes tasks.
- **Result Backend (Redis/DB)**: Stores task return values and statuses.

```python
from celery import Celery

celery_app = Celery(
    'tasks',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/1'
)

@celery_app.task
def generate_pdf_report(user_id: int):
    return f"Report for user {user_id} generated."
```

### 62. Celery Retries & Task Idempotency:
**In Simple Words:**
Use exponential backoff for network failures and ensure tasks are **idempotent** (can be executed multiple times without unintended side effects).

```python
@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def charge_payment(self, payment_id: str, amount: float):
    try:
        call_payment_gateway(payment_id, amount)
    except ConnectionError as exc:
        raise self.retry(exc=exc, countdown=2 ** self.request.retries)
```

### 63. Celery Canvas Workflows:
**In Simple Words:**
- `chain`: Executes tasks sequentially (`task1 | task2`).
- `group`: Executes tasks in parallel.
- `chord`: Executes a group in parallel, then calls a callback when all finish.

```python
from celery import chain, group

# Chain: step1 -> step2 -> step3
workflow = chain(
    fetch_data.s(10),
    transform_data.s(),
    save_to_db.s()
)
workflow.apply_async()
```

### 64. Preventing Worker Memory Leaks:
**In Simple Words:**
Python workers running heavy libraries can suffer from fragmented RAM over time. Configure `max_tasks_per_child` to restart worker processes periodically.

```python
# Celery worker configuration:
celery_app.conf.update(
    worker_max_tasks_per_child=1000, # Restart worker after 1000 tasks
    worker_max_memory_per_child=200000 # 200MB limit
)
```

### 65. Alternatives to Celery (ARQ, Dramatiq):
**In Simple Words:**
- **ARQ**: Ultra-fast asynchronous task queue built on Redis and AsyncIO; ideal for FastAPI.
- **Dramatiq**: Simpler, thread-based alternative to Celery with superior out-of-the-box retry logic and RabbitMQ/Redis backends.

```python
# ARQ task definition:
async def download_file(ctx, url: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    return len(resp.content)
```
