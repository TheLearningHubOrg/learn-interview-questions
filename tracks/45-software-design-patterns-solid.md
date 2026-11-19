# Software Design Patterns & SOLID Architecture Master Interview Bank (1 - 35)

> Gang of Four (GoF) design patterns, SOLID principles (SRP, OCP, LSP, ISP, DIP), Creational patterns (Factory, Builder, Singleton), Structural patterns (Adapter, Decorator, Facade, Proxy), Behavioral patterns (Strategy, Observer, Command, State), and Clean / Hexagonal Architecture (Ports and Adapters).

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What are the SOLID Principles and why are they fundamental to software engineering?
**In Simple Words:**
SOLID is an acronym for 5 object-oriented design principles introduced by Robert C. Martin (Uncle Bob):
- **S - Single Responsibility Principle (SRP)**: A class should have one, and only one, reason to change.
- **O - Open/Closed Principle (OCP)**: Software entities should be open for extension, but closed for modification.
- **L - Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types without altering program correctness.
- **I - Interface Segregation Principle (ISP)**: Clients should not be forced to depend on methods they do not use.
- **D - Dependency Inversion Principle (DIP)**: Depend upon abstractions, not concretions.
- **Goal**: Prevents code fragility, rigid coupling, and technical debt as codebases grow.

```text
SOLID Principles:
┌───┬──────────────────────────────────┬─────────────────────────────┐
│ S │ Single Responsibility Principle  │ One class, one responsibility│
│ O │ Open/Closed Principle            │ Open to extend, closed to edit│
│ L │ Liskov Substitution Principle    │ Subtypes don't break contracts│
│ I │ Interface Segregation Principle  │ Small, client-specific APIs │
│ D │ Dependency Inversion Principle   │ Depend on interfaces, not code│
└───┴──────────────────────────────────┴─────────────────────────────┘
```

### 2. How do you implement the Single Responsibility Principle (SRP) in practice?
**In Simple Words:**
A class should focus on a single concern:
- **Violation**: An `Invoice` class that calculates taxes, prints invoices to PDF, and saves invoices to a PostgreSQL database (3 reasons to change!).
- **Refactoring**:
  - `Invoice`: Manages line items and calculations.
  - `InvoicePdfGenerator`: Handles PDF formatting.
  - `InvoiceRepository`: Handles database persistence.

```typescript
// SRP Refactored:
class Invoice {
  constructor(public items: LineItem[]) {}
  calculateTotal(): number { /* business logic */ }
}

class InvoiceRepository {
  save(invoice: Invoice): Promise<void> { /* SQL INSERT */ }
}
```

### 3. How do you implement the Open/Closed Principle (OCP) using Polymorphism?
**In Simple Words:**
You should be able to add new functionality without modifying existing, tested source code:
- **Violation**: Using a massive `switch(paymentType)` statement inside `processPayment()`. Adding ApplePay forces editing existing code!
- **Refactoring**: Define a `PaymentMethod` interface; implement `CreditCardPayment`, `PayPalPayment`, and `ApplePayPayment` as independent classes implementing `pay(amount)`.

### 4. What is the Liskov Substitution Principle (LSP) and what is the classic Rectangle-Square violation?
**In Simple Words:**
Subclasses must adhere to the behavioral contract of their parent class:
- **The Rectangle-Square Violation**:
  - `Square` inherits from `Rectangle`.
  - In `Square`, setting `width` automatically sets `height` to maintain a square.
  - A function expecting a `Rectangle` sets `width = 5` and `height = 10` and expects area to be 50.
  - Passing `Square` produces area 100, silently violating mathematical assumptions and breaking caller code!
- **Rule**: If a subtype cannot fulfill all invariants of the parent, use composition instead of inheritance.

### 5. What is the Interface Segregation Principle (ISP)?
**In Simple Words:**
Many client-specific, granular interfaces are better than one bloated, "fat" interface:
- **Violation**: A monolithic `Worker` interface with `work()`, `eat()`, and `sleep()`. A `Robot` class implementing `Worker` is forced to implement empty dummy methods for `eat()` and `sleep()`.
- **Refactoring**: Split into `Workable` and `Feedable` interfaces. Humans implement both; robots implement only `Workable`.

### 6. What is the Dependency Inversion Principle (DIP) and how does it differ from Dependency Injection (DI)?
**In Simple Words:**
- **Dependency Inversion Principle (DIP - The Design Principle)**: High-level business logic modules should not depend on low-level modules (e.g. databases, HTTP clients); both should depend on abstractions (interfaces).
- **Dependency Injection (DI - The Implementation Pattern)**: A technique where an object receives its dependencies from the outside (e.g. passed via constructor) rather than creating them internally using `new Database()`.

### 7. What are the three Gang of Four (GoF) Pattern Categories?
**In Simple Words:**
1. **Creational Patterns**: Deal with object creation mechanisms, increasing flexibility and reuse of existing code (Factory, Builder, Singleton, Prototype).
2. **Structural Patterns**: Explain how to assemble objects and classes into larger structures while keeping them flexible and efficient (Adapter, Decorator, Facade, Proxy, Composite).
3. **Behavioral Patterns**: Concerned with algorithms and the assignment of responsibilities between objects (Strategy, Observer, Command, State, Iterator).

### 8. What is the Singleton Pattern and how do you implement it thread-safely?
**In Simple Words:**
Ensures a class has only one instance and provides a global access point to it:
- Private constructor prevents direct instantiation.
- Static instance variable and public static getter.
- **Double-Checked Locking (in Java / C#)**:
```csharp
public sealed class DatabaseConnection {
    private static DatabaseConnection _instance;
    private static readonly object _lock = new object();

    private DatabaseConnection() {}

    public static DatabaseConnection Instance {
        get {
            if (_instance == null) {
                lock (_lock) {
                    if (_instance == null) {
                        _instance = new DatabaseConnection();
                    }
                }
            }
            return _instance;
        }
    }
}
```

### 9. What is the Factory Method Pattern?
**In Simple Words:**
Defines an interface for creating an object, but lets subclasses decide which class to instantiate:
- Decouples client code from concrete implementation classes:
```typescript
interface Notification {
  send(message: string): void;
}

class EmailNotification implements Notification {
  send(msg: string) { console.log(`Sending Email: ${msg}`); }
}

class SMSNotification implements Notification {
  send(msg: string) { console.log(`Sending SMS: ${msg}`); }
}

class NotificationFactory {
  static create(type: "email" | "sms"): Notification {
    if (type === "email") return new EmailNotification();
    if (type === "sms") return new SMSNotification();
    throw new Error("Unknown notification type");
  }
}
```

### 10. What is the Builder Pattern and when should you use it?
**In Simple Words:**
Separates the construction of a complex object from its representation, allowing the same construction process to create different representations:
- **Use Case**: Eliminates "Telescoping Constructors" where a class constructor has 10 parameters, most of which are optional:
```typescript
const httpRequest = new HttpRequestBuilder()
  .setUrl("https://api.com/users")
  .setMethod("POST")
  .setHeader("Authorization", "Bearer token")
  .setBody({ name: "Alex" })
  .setTimeout(5000)
  .build();
```

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What is the Adapter Pattern and how does it reconcile incompatible interfaces?
**In Simple Words:**
Acts as a translator / wrapper between two incompatible interfaces:
- **Analogy**: A US-to-European power plug adapter.
- Example: Your legacy application expects an interface `LegacyPaymentGateway.charge(cents)`, but a new third-party SDK provides `StripeService.createCharge(dollars)`.
- **The Adapter**: Implements the legacy interface, wraps the Stripe service internally, converts cents to dollars, and forwards the call.

```typescript
class StripeAdapter implements LegacyPaymentGateway {
  constructor(private stripe: StripeService) {}

  charge(cents: number): void {
    const dollars = cents / 100;
    this.stripe.createCharge(dollars);
  }
}
```

### 12. What is the Decorator Pattern and how does it differ from Inheritance?
**In Simple Words:**
Attaches new behaviors to objects dynamically at runtime by placing them inside special wrapper objects:
- **Inheritance**: Static (compile-time) and causes class explosion (e.g. `EspressoWithMilk`, `EspressoWithMilkAndCaramel`).
- **Decorator**: You wrap a base object with multiple decorators dynamically:
```typescript
let coffee: Beverage = new Espresso();
coffee = new MilkDecorator(coffee);
coffee = new CaramelDecorator(coffee);
console.log(coffee.cost()); // Dynamically sums cost!
```

### 13. What is the Facade Pattern and how does it simplify complex subsystems?
**In Simple Words:**
Provides a simple, unified, high-level interface to a complex library, framework, or set of classes:
- **Analogy**: A customer service representative who handles your order, billing, and shipping behind the scenes.
- Instead of client code orchestrating 10 classes (`AudioCodec`, `VideoBuffer`, `HardwareDecoder`, `ColorCorrection`), you provide a simple `VideoPlayerFacade.play(filename)`.

### 14. What is the Proxy Pattern and what are its common types (Virtual, Protection, Remote)?
**In Simple Words:**
Provides a surrogate or placeholder object that controls access to the real object:
1. **Virtual Proxy (Lazy Loading)**: Defers the creation of an expensive object (e.g. a 50 MB high-resolution image) until it is actually requested.
2. **Protection Proxy (Security & RBAC)**: Verifies caller permissions before forwarding requests to sensitive services.
3. **Remote Proxy**: Represents an object located on a remote server (e.g. gRPC stub).
4. **Caching Proxy**: Intercepts requests and returns cached results if available.

### 15. What is the Strategy Pattern and how does it eliminate `if/else` ladders?
**In Simple Words:**
Defines a family of interchangeable algorithms, encapsulates each one, and makes them interchangeable at runtime:
- **Context**: Holds a reference to a Strategy interface.
- Client passes the desired strategy dynamically:
```typescript
interface CompressionStrategy {
  compress(files: string[]): void;
}

class ZipCompression implements CompressionStrategy {
  compress(files: string[]) { /* zip logic */ }
}

class RarCompression implements CompressionStrategy {
  compress(files: string[]) { /* rar logic */ }
}

class Archiver {
  constructor(private strategy: CompressionStrategy) {}
  setStrategy(strategy: CompressionStrategy) { this.strategy = strategy; }
  createArchive(files: string[]) { this.strategy.compress(files); }
}
```

### 16. What is the Observer Pattern and how does it implement Pub/Sub?
**In Simple Words:**
Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically:
- **Subject**: Maintains a list of observers; provides `subscribe()` and `unsubscribe()`.
- **Observer**: Defines an `update()` method called by the Subject.
- Foundation of event-driven architectures, DOM event listeners, and RxJS streams.

```typescript
class Subject {
  private observers: Observer[] = [];

  subscribe(observer: Observer) { this.observers.push(observer); }
  notify(data: any) { this.observers.forEach(o => o.update(data)); }
}
```

### 17. What is the Command Pattern and how does it enable Undo / Redo?
**In Simple Words:**
Encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support reversible operations:
- Every command object implements `execute()` and **`undo()`**.
- An **Invoker** maintains a history stack:
  - Running a command: Calls `cmd.execute()` and pushes to stack.
  - Undo: Pops command from stack and calls `cmd.undo()`!

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class InsertTextCommand implements Command {
  constructor(private doc: Document, private text: string) {}
  execute() { this.doc.append(this.text); }
  undo() { this.doc.deleteLast(this.text.length); }
}
```

### 18. What is the State Pattern and how does it differ from the Strategy Pattern?
**In Simple Words:**
Allows an object to alter its behavior when its internal state changes, appearing as if the object changed its class:
- **Strategy vs State**:
  - **Strategy**: Client explicitly chooses which algorithm strategy to inject; strategies rarely know about other strategies.
  - **State**: The context's behavior changes automatically as internal states transition between themselves (e.g. `DraftState` -> `ReviewState` -> `PublishedState`).

### 19. What is the Template Method Pattern?
**In Simple Words:**
Defines the skeleton of an algorithm in an abstract base class, deferring some steps to subclasses without changing the algorithm's overall structure:
- Uses invariant steps and abstract **hooks**:
```typescript
abstract class DataMiner {
  // Template Method: Defines overall flow
  public mine(path: string) {
    const rawData = this.readFile(path);
    const parsed = this.parseData(rawData); // Abstract step
    this.saveToDatabase(parsed);
  }
  protected abstract parseData(raw: string): any;
  private readFile(path: string) { /* file read */ }
  private saveToDatabase(data: any) { /* save */ }
}
```

### 20. What is the Chain of Responsibility Pattern?
**In Simple Words:**
Passes a request along a dynamic chain of handlers:
- Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.
- The standard pattern behind **HTTP Middleware pipelines** (Express, Koa, ASP.NET Core) and authentication filters.

---

## Part 3: Architectural Patterns & Enterprise Systems (Senior / Lead)

### 21. What is Clean Architecture (The Onion / Hexagonal Architecture)?
**In Simple Words:**
Introduced by Uncle Bob to create systems independent of frameworks, databases, and UI:
- **Dependency Rule**: Dependencies always point **inwards** toward the core domain!
  1. **Entities (Core Domain)**: Pure business rules and models (Zero external dependencies).
  2. **Use Cases (Application Business Rules)**: Orchestrates data flow to/from entities.
  3. **Interface Adapters (Controllers, Gateways, Presenters)**: Translates data between use cases and external formats.
  4. **Frameworks & Drivers (External)**: UI, Database (SQL/NoSQL), Web Server, Third-party APIs.
- The core business domain does not care whether data is stored in PostgreSQL, MongoDB, or an in-memory JSON file.

```text
Clean Architecture Layers:
┌───────────────────────────────────────────────┐
│     Frameworks & Drivers (DB, UI, Devices)   │
│   ┌───────────────────────────────────────┐   │
│   │   Interface Adapters (Controllers)    │   │
│   │   ┌───────────────────────────────┐   │   │
│   │   │      Application Use Cases    │   │   │
│   │   │   ┌───────────────────────┐   │   │   │
│   │   │   │   Entities (Domain)   │   │   │   │
│   │   │   └───────────────────────┘   │   │   │
│   │   └───────────────────────────────┘   │   │
│   └───────────────────────────────────────┘   │
└───────────────────────────────────────────────┘
Dependency Arrow: External ───────► Inward (Domain)
```

### 22. What is Hexagonal Architecture (Ports and Adapters)?
**In Simple Words:**
Created by Alistair Cockburn:
- The core application resides inside a hexagon, isolated from the outside world:
  - **Ports**: Inward-facing application interfaces (e.g. `OrderRepositoryPort`, `PaymentProcessorPort`).
  - **Adapters**: Outward-facing concrete implementations that plug into ports:
    - *Driving Adapters*: Initiate calls to the app (REST API controller, CLI, GraphQL resolver).
    - *Driven Adapters*: Invoked by the app (PostgresOrderAdapter, StripePaymentAdapter).
- Allows running the entire application with mock in-memory adapters for instant unit testing!

### 23. What is the Repository Pattern and what are its benefits?
**In Simple Words:**
Mediates between the domain and data mapping layers, acting like an in-memory collection of domain objects:
- Encapsulates database query logic (`SELECT`, `INSERT`) behind a collection-like interface (`findById`, `save`, `delete`).
- Decouples domain logic from ORMs (Prisma, TypeORM, Hibernate) and SQL dialects.

### 24. What is the Unit of Work Pattern?
**In Simple Words:**
Maintains a list of business objects affected by a business transaction and coordinates the writing out of changes:
- Instead of saving every entity modification to the database immediately (incurring 10 separate SQL round-trips):
- The Unit of Work tracks all dirty, new, and deleted objects in memory, and commits them inside a **single atomic database transaction** upon completion.

### 25. What is the CQRS (Command Query Responsibility Segregation) Pattern?
**In Simple Words:**
Segregates the data model for write operations (**Commands**) from the data model for read operations (**Queries**):
- **Command Model**: Optimized strictly for validating business rules, transactions, and maintaining invariants (writes to normalized relational DB).
- **Query Model**: Optimized strictly for fast read performance (denormalized views stored in Elasticsearch, Redis, or read replicas).
- Eliminates the tension of trying to design a single database schema that is optimal for both high-concurrency writes and complex analytical queries.

```text
CQRS Architecture:
[User Action]
   │
   ├─► [Command Path] ──► [Domain Model] ──► [Write DB (ACID)]
   │                                                │ (Event Stream / CDC)
   │                                                ▼
   └─► [Query Path]   ◄── [Read DB (Denormalized Cache / Elastic)]
```

### 26. What is the Event Sourcing Pattern?
**In Simple Words:**
Instead of storing only the *current state* of an entity, Event Sourcing stores the **entire append-only sequence of immutable domain events** that led to that state:
- Bank Account Balance is **not** stored as `$500`.
- Instead, the database stores:
  1. `AccountCreated (+$0)`
  2. `MoneyDeposited (+$1000)`
  3. `MoneyWithdrawn (-$500)`
- **Benefits**: Perfect 100% audit log, time-travel debugging (replay events to inspect state at any second in history), zero update locks.

### 27. What is the Outbox Pattern and how does it guarantee Dual-Write consistency?
**In Simple Words:**
When an app must update a database AND publish an event to a message broker (Kafka/RabbitMQ):
- **The Dual-Write Problem**: If the database commit succeeds but the network fails before publishing to Kafka, data is out-of-sync!
- **Transactional Outbox Pattern**:
  1. App writes entity update AND inserts an event record into an **`outbox` table in the SAME database transaction**.
  2. A Change Data Capture (CDC) tool (e.g. Debezium) tails the database transaction log and guarantees publishing the outbox events to Kafka with at-least-once reliability!

```text
Transactional Outbox Pattern:
[Application Transaction]
 ├─► UPDATE orders SET status = 'PAID'
 └─► INSERT INTO outbox_table (event_type, payload)
           │ (Single Atomic SQL Transaction!)
           ▼
[Debezium CDC / Poller] ──► Publishes to [Apache Kafka]
```

### 28. What is the SAGA Pattern for Distributed Transactions?
**In Simple Words:**
Replaces slow 2-Phase Commit (2PC) across microservices with a sequence of local transactions:
- Each service executes a local transaction and publishes an event that triggers the next service's transaction.
- **Compensating Transactions**: If Service 3 fails (e.g. payment rejected), the saga executes a series of compensating transactions in reverse order to roll back earlier changes (e.g. release reserved inventory).
- Implemented via **Choreography** (services react to events) or **Orchestration** (central saga orchestrator directs steps).

### 29. What is the Circuit Breaker Pattern in distributed systems?
**In Simple Words:**
Prevents cascading failures when a downstream microservice is down:
- **Closed State**: Normal operation; requests pass through.
- **Open State**: When failure rate exceeds a threshold (e.g. 50% timeouts), the circuit opens immediately. All requests **fail fast without calling the remote service**, preventing thread exhaustion.
- **Half-Open State**: After a timeout, sends a single test probe request. If it succeeds -> reset to Closed; if it fails -> remain Open.

### 30. What is the Bulkhead Pattern?
**In Simple Words:**
Inspired by nautical ship bulkheads that compartmentalize hulls so a leak in one compartment doesn't sink the entire ship:
- Isolates critical resources into independent pools (thread pools, connection pools, CPU allocations).
- Example: Allocate 30 threads for standard customer checkout, and 5 threads for third-party analytics. If analytics hangs, the checkout pool continues running unaffected!

### 31. What is the Anti-Corruption Layer (ACL) in Domain-Driven Design?
**In Simple Words:**
A translation layer placed between a modern domain model and a legacy system or third-party service:
- Translates legacy data models and terminology into clean domain objects before they enter your domain core.
- Prevents legacy system bad practices and archaic concepts from "corrupting" your modern domain design.

### 32. What is the difference between Anemic Domain Model and Rich Domain Model?
**In Simple Words:**
- **Anemic Domain Model (Anti-Pattern)**: Entities are purely dumb data holders with public getters/setters (`class Order { public items, status; }`). All business logic and invariant validation is scattered across giant procedural service classes.
- **Rich Domain Model (Best Practice)**: Entities encapsulate both data **and the business logic that operates on that data** (`order.cancel()`, `order.addItem()`). Setters are private; entities enforce their own invariants.

### 33. What is the Strangler Fig Pattern for monolithic migration?
**In Simple Words:**
A pattern to incrementally migrate a legacy monolithic application to microservices without a risky "Big Bang" rewrite:
- Place an API Gateway in front of the monolith.
- Implement new features or carve out individual capabilities (e.g. Authentication) as new microservices.
- Route specific traffic endpoints to the new services while leaving legacy traffic going to the monolith.
- Over time, the new services "strangle" the monolith until the legacy system is completely decommissioned.

### 34. What is the Sidecar Pattern in Cloud-Native architectures?
**In Simple Words:**
Deploys components of an application into a separate process or container to provide supporting features without modifying the primary application code:
- Common examples in Kubernetes Pods:
  - **Envoy Proxy sidecar** (Service Mesh for mTLS, traffic routing, metrics).
  - **Fluentd / Datadog sidecar** (Log harvesting).
  - **Vault Agent sidecar** (Secret rotation).

### 35. When does Design Pattern Over-Engineering harm software projects?
**In Simple Words:**
Applying GoF patterns blindly where simple procedural code is sufficient ("Patternitis"):
- Introducing 5 layers of Factories, Builders, and Adapters for a CRUD service that will only ever query a single PostgreSQL table.
- Increases cognitive load, makes debugging painful, and inflates codebase size.
- **Rule of Thumb**: Follow **YAGNI (You Aren't Gonna Need It)** and the **Rule of Three**: write simple code first; refactor to a design pattern only when duplication and complexity organically demand it.
`;
