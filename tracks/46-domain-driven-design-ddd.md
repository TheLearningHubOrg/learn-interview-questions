# Domain-Driven Design (DDD) Enterprise Architecture Master Interview Bank (1 - 35)

> Strategic DDD vs Tactical DDD, Ubiquitous Language, Bounded Contexts, Context Mapping, Entities vs Value Objects, Aggregates and Aggregate Roots, Domain Events, Domain Services vs Application Services, Repositories, Anemic vs Rich Domain Models, SAGA distributed patterns, and CQRS / Event Sourcing.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Domain-Driven Design (DDD) and what problem does it solve?
**In Simple Words:**
Domain-Driven Design (introduced by Eric Evans) is an approach to software development that centers the entire system design around a deep, evolving model of the core business problem (**The Domain**):
- **Problem It Solves**: In large enterprise software, complexity is usually not in the technical framework (React, Spring, Docker); it is in the **intricate, conflicting business rules and edge cases**.
- DDD bridges the communication gap between technical engineers and business domain experts, ensuring software architecture directly reflects real-world business models rather than database tables.

### 2. What is the difference between Strategic DDD and Tactical DDD?
**In Simple Words:**
- **Strategic DDD (The Big Picture - High-Level Architecture)**: Focuses on decomposing a large complex enterprise into clear subsystems:
  - **Ubiquitous Language**, **Bounded Contexts**, **Subdomains (Core, Supporting, Generic)**, and **Context Maps**.
  - Determines microservice boundaries and team ownership.
- **Tactical DDD (The Implementation Details - Code-Level Modeling)**: Focuses on how to structure object-oriented code inside a single Bounded Context:
  - **Entities**, **Value Objects**, **Aggregates**, **Aggregate Roots**, **Domain Events**, and **Repositories**.

```text
Strategic vs Tactical DDD:
┌────────────────────────────────────────────────────────┐
│ STRATEGIC DDD: Architecture & Organization Boundaries │
│ • Bounded Contexts • Subdomains • Context Mapping       │
└──────────────────────────┬─────────────────────────────┘
                           │ Contains
┌──────────────────────────▼─────────────────────────────┐
│ TACTICAL DDD: Building Blocks Inside One Bounded Context│
│ • Entities • Value Objects • Aggregates • Domain Events │
└────────────────────────────────────────────────────────┘
```

### 3. What is the Ubiquitous Language and why is it essential?
**In Simple Words:**
A single, unambiguous, shared vocabulary created jointly by software developers and business domain experts:
- **Rule**: The exact same terminology used in business discussions must be used **verbatim** in requirements docs, user stories, class names, method names, and database fields!
- If the business calls a policy cancellation "Revocation", the code must say `policy.revoke()`, **not** `policy.setStatus("CANCELLED")` or `policy.delete()`.
- Eliminates translation misunderstandings and hidden bugs.

### 4. What is a Bounded Context?
**In Simple Words:**
A linguistic and conceptual boundary within which a specific domain model and Ubiquitous Language applies strictly and consistently:
- In an enterprise e-commerce system, the word **"Product"** means completely different things to different teams:
  - In **Sales Context**: A Product has a price, marketing copy, and photos.
  - In **Warehouse Context**: A Product has a weight, physical box dimensions, and shelf location.
  - In **Shipping Context**: A Product is a packaged parcel with a tracking barcode.
- Instead of building a disastrous 100-column "Global Product" model, DDD creates **separate Bounded Contexts**, each with its own clean model of `Product`.

### 5. What are the three types of Subdomains (Core, Supporting, Generic)?
**In Simple Words:**
1. **Core Domain**: The primary competitive advantage of your business. What makes your company money and sets you apart from competitors (e.g. Uber's real-time ride matching algorithm). Deserves your best senior engineers and custom bespoke code.
2. **Supporting Subdomain**: Complements the core business. Necessary, but not a competitive differentiator (e.g. custom internal fleet tracking). Usually custom-built internally.
3. **Generic Subdomain**: Universal business problems with zero competitive differentiation (e.g. Billing, Identity/Auth, Invoicing). Best solved by buying off-the-shelf SaaS or commercial software (Stripe, Auth0).

### 6. What is the difference between an Entity and a Value Object?
**In Simple Words:**
The most fundamental distinction in Tactical DDD:
- **Entity**: Defined by its **persistent Identity (ID)**, not by its attributes. Two entities with identical attributes are different objects if their IDs differ (e.g. two `Customer` objects named "John Smith" born on the same day). Entities are mutable over time.
- **Value Object**: Defined entirely by the **combination of its attributes**, with **NO identity**. Value objects are strictly **Immutable**:
  - Example: `Money(amount: 50, currency: "USD")` or `Address(street, zip)`.
  - Two `Money` objects with the same amount and currency are 100% equal! To modify money, you create a new Value Object (`money.add(otherMoney)`).

```typescript
// Value Object: Immutable with Value Equality:
class Money {
  constructor(public readonly amount: number, public readonly currency: string) {
    if (amount < 0) throw new Error("Amount cannot be negative");
  }
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
```

### 7. What is an Aggregate and an Aggregate Root?
**In Simple Words:**
- **Aggregate**: A cluster of associated domain objects (Entities and Value Objects) treated as a **single unit for data changes and transactional consistency**:
  - Example: An `Order` (Aggregate Root) containing multiple `OrderItem` entities and a `ShippingAddress` value object.
- **Aggregate Root**: The single master Entity that serves as the **only gateway** to the aggregate:
  - Outside code **CANNOT reference or modify internal child entities directly** (e.g. code cannot directly modify an `OrderItem`).
  - All operations must pass through methods on the Aggregate Root (`order.addItem()`, `order.cancel()`), allowing the root to enforce business invariants.

### 8. What is a Domain Invariant?
**In Simple Words:**
A business rule that must be **true at all times** within an Aggregate's lifecycle:
- Examples:
  - "The total cost of an Order cannot exceed the customer's credit limit."
  - "An order cannot have more than 50 items."
  - "A shipment cannot be created without at least one item."
- The Aggregate Root is strictly responsible for validating and guaranteeing that invariants are never violated before persisting changes.

### 9. What is a Domain Service and when should you use it?
**In Simple Words:**
A stateless service that encapsulates business domain logic that naturally **does not belong to any single Entity or Value Object**:
- **Use Case**: Operations that involve multiple aggregates or external calculations (e.g. `FundsTransferService.transfer(fromAccount, toAccount, amount)`).
- **Rule**: Keep business logic in entities whenever possible; use Domain Services only when forcing logic into an entity feels awkward or creates unnatural coupling.

### 10. What is an Anemic Domain Model and why is it considered an Anti-Pattern?
**In Simple Words:**
An anemic model is where domain classes are just dumb property bags with public getters and setters (`get/set`), containing **zero business logic**:
- All validation, calculations, and invariants are pushed into bloated procedural service classes (`OrderService`).
- **Why It Fails**: Invariants cannot be guaranteed because any developer can call `order.setStatus("COMPLETED")` without executing required payment checks or firing events!
- Tactical DDD replaces anemic models with **Rich Domain Models** that encapsulate their own rules.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What is a Domain Event and how does it represent business facts?
**In Simple Words:**
A record of something meaningful that has **already happened in the domain in the past**:
- **Characteristics**: Immutable, named in the past tense (`OrderPlaced`, `PaymentReceived`, `UserRegistered`).
- Captures the exact point-in-time snapshot of the state change:
```typescript
class OrderPlacedEvent {
  public readonly occurredAt = new Date();
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly totalAmount: number
  ) {}
}
```
- Emitted by the Aggregate Root to trigger side-effects in other aggregates or downstream bounded contexts without direct coupling.

### 12. What is the difference between Domain Events, Integration Events, and Application Events?
**In Simple Words:**
- **Domain Event**: Internal to a single Bounded Context. Handled synchronously or in-memory to update local aggregates.
- **Integration Event**: Published externally across network boundaries (via Kafka, RabbitMQ, EventBridge) to notify **other Bounded Contexts** (e.g. Billing Context notifies Shipping Context). Payloads are versioned and sanitize internal domain implementation details.
- **Application Event**: Framework-level events (e.g. user logged in, HTTP request started, cache cleared).

### 13. What is the difference between Domain Services, Application Services, and Infrastructure Services?
**In Simple Words:**
Three distinct service layers in DDD architectures:
1. **Domain Service**: Pure business logic that spans multiple aggregates (e.g. `PricingEngineService`). Zero dependencies on databases, UI, or frameworks.
2. **Application Service**: Orchestration layer (Use Cases). Coordinates domain objects, loads aggregates from repositories, manages transactions, and sends notifications (e.g. `CreateOrderCommandHandler`). Contains zero domain business rules.
3. **Infrastructure Service**: Concrete technical adapters for external concerns (e.g. `SmtpEmailSender`, `PostgreSqlOrderRepository`, `S3FileUploader`).

```text
DDD Service Layers:
[Application Service (Use Case)] ──► Loads Aggregate from [Repository]
               │
               ▼
[Domain Model / Domain Service]  ──► Executes Pure Business Invariants
               │
               ▼
[Infrastructure Service]         ──► Writes to DB / Sends Email / Kafka
```

### 14. What are Context Maps and the standard Context Relationships?
**In Simple Words:**
A Context Map visualizes the structural and political relationships between different Bounded Contexts in an enterprise:
- **Shared Kernel**: Two contexts share a common core domain model and database subset (requires tight coordination).
- **Customer / Supplier (Upstream / Downstream - U/D)**: Upstream ($U$) provides data; Downstream ($D$) consumes it. Downstream requirements influence Upstream delivery.
- **Conformist**: Downstream conforms strictly to Upstream's model without negotiation.
- **Anti-Corruption Layer (ACL)**: Downstream builds a translation layer to insulate itself from an archaic Upstream model.
- **Open Host Service (OHS) / Published Language (PL)**: Upstream provides a standardized public API (e.g. REST/JSON or Protobuf) for multiple consumers.

```text
Context Mapping Relationships:
[Billing Context (Upstream - U)] ──(Open Host Service)──► [Anti-Corruption Layer] ──► [Mobile App (Downstream - D)]
```

### 15. How does the Anti-Corruption Layer (ACL) protect domain models?
**In Simple Words:**
When integrating with an external vendor or legacy system:
- Never let external terminology and bad data structures leak into your domain!
- The ACL acts as a bidirectional translator:
  - Takes raw external JSON/XML, parses it, validates it, and maps it into clean, strongly typed internal **Domain Entities and Value Objects**.
  - If the external vendor alters their API, only the ACL adapter breaks; your core business domain remains 100% untouched.

### 16. What is the Repository Pattern in DDD and what is its strict contract?
**In Simple Words:**
A Repository simulates an in-memory collection of Aggregate Roots:
- **Rule 1**: Only **Aggregate Roots** can have Repositories! You create an `OrderRepository`, but you **NEVER create an `OrderItemRepository`**.
- **Rule 2**: The repository interface lives in the **Domain Layer**, but its implementation lives in the **Infrastructure Layer** (DIP):
```typescript
// Domain Layer:
interface OrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  save(order: Order): Promise<void>;
}
```

### 17. How should Aggregate boundaries be sized?
**In Simple Words:**
The #1 beginner mistake in DDD is creating massive, bloated aggregates (e.g. a `Customer` aggregate containing all historical orders, invoices, reviews, and tickets):
- Large aggregates cause severe database locking contention, high memory consumption, and transaction deadlocks!
- **Best Practice (Small Aggregates)**:
  - Make aggregates as small as possible while preserving strict immediate business invariants.
  - References between independent aggregates should be by **ID only** (`customerId: CustomerId`), never direct object pointers!
  - Use **Eventual Consistency** across aggregates via Domain Events.

### 18. What is the difference between Immediate Consistency and Eventual Consistency in DDD?
**In Simple Words:**
- **Immediate (Strong) Consistency**: Enforced strictly **within the boundary of a single Aggregate** using database ACID transactions.
- **Eventual Consistency**: Used **across multiple Aggregates or across Bounded Contexts**.
  - When Aggregate A changes, it publishes a Domain Event.
  - A background handler updates Aggregate B moments later.
  - Aligns with real-world business: in the physical world, an order is taken immediately, and warehouse inventory is adjusted asynchronously moments later!

### 19. How do Factories work in Domain-Driven Design?
**In Simple Words:**
When creating an Aggregate Root requires complex validation, default invariants, or assembly of nested value objects:
- Encapsulate the creation logic inside a dedicated **Factory** (method or class):
- Guarantees that an entity can **never exist in an invalid, half-initialized state**:
```typescript
class OrderFactory {
  static createNewOrder(customerId: CustomerId, items: CartItem[]): Order {
    if (items.length === 0) throw new DomainException("Order must have items");
    const orderItems = items.map(i => new OrderItem(i.sku, i.quantity, i.price));
    return new Order(OrderId.generate(), customerId, orderItems, OrderStatus.Pending);
  }
}
```

### 20. What is Event Storming and how does it discover Bounded Contexts?
**In Simple Words:**
A rapid, collaborative workshop method that brings together developers and business domain experts around a large paper roll:
1. **Orange Sticky Notes (Domain Events)**: Participants write down all business events in past tense ("Order Placed", "Invoice Generated").
2. **Blue Notes (Commands)**: What triggered the event? ("Place Order").
3. **Yellow Notes (Aggregates)**: What entity accepted the command? ("Order").
4. **Identify Boundaries**: Clustering related events and commands organically reveals natural **Bounded Contexts** and subdomains!

---

## Part 3: Advanced Architecture & Production Patterns (Senior / Lead)

### 21. How do you implement the Outbox Pattern with Domain Events in production?
**In Simple Words:**
To ensure Domain Events are never lost if the message broker is unreachable:
1. When saving an Aggregate, the Repository extracts all uncommitted domain events recorded by the aggregate.
2. In the **same atomic database transaction**, it writes the aggregate row AND inserts the events into an `outbox` table.
3. A background process (or Debezium CDC) streams events from the outbox table to Kafka/RabbitMQ and marks them published.

```typescript
// Inside Transactional Repository:
async save(order: Order): Promise<void> {
  await this.db.transaction(async (trx) => {
    await trx('orders').insert(order.toRow());
    for (const event of order.pullDomainEvents()) {
      await trx('outbox').insert({
        event_type: event.constructor.name,
        payload: JSON.stringify(event),
        created_at: new Date()
      });
    }
  });
}
```

### 22. What is the SAGA Pattern (Choreography vs Orchestration) in DDD microservices?
**In Simple Words:**
Manages distributed business transactions across multiple Bounded Contexts without 2PC:
- **Choreography**: Event-driven. Each service listens for events and independently executes its local transaction:
  - `OrderService` emits `OrderCreated` -> `PaymentService` listens and charges card -> emits `PaymentCompleted` -> `InventoryService` reserves stock.
  - Simple for small workflows; difficult to track and debug as services scale.
- **Orchestration**: A central **Saga Orchestrator** microservice (e.g. using Temporal, AWS Step Functions, or custom state machine) sends explicit commands to services and tracks status. If a step fails, the orchestrator triggers compensating transactions to roll back.

```text
Saga Patterns:
Choreography:   [Service A] ──(Event)──► [Service B] ──(Event)──► [Service C]
Orchestration:  [Saga Orchestrator]
                 ├─► Command 1 ──► [Service A]
                 ├─► Command 2 ──► [Service B]
                 └─► (If Fail) ──► Compensate A
```

### 23. What are Compensating Transactions in Sagas?
**In Simple Words:**
Because distributed transactions cannot execute a database `ROLLBACK` across independent microservices, Sagas use compensating actions:
- A compensating transaction is an **explicit business operation that semantically reverses a prior committed action**:
  - Original action: `CreditCardCharged ($100)` -> Compensating action: `RefundIssued ($100)`.
  - Original action: `SeatReserved (Seat 4A)` -> Compensating action: `SeatReleased (Seat 4A)`.
- Leaves an immutable audit trail showing the attempt, failure, and compensation.

### 24. What is CQRS (Command Query Responsibility Segregation) in DDD?
**In Simple Words:**
Splits the application into two independent models:
- **Write Side (Commands)**: Uses Tactical DDD. Loads full Aggregates, validates invariants, and commits state transitions.
- **Read Side (Queries)**: Bypasses domain aggregates and repositories completely! Queries read-optimized projections or materialized views directly using lightweight DTOs.
- Allows scaling read performance independently (e.g. 100,000 queries/sec on read replicas) without burdening transactional write aggregates.

### 25. What is Event Sourcing and how does it integrate with DDD Aggregates?
**In Simple Words:**
In an Event-Sourced aggregate, the state of the entity is **reconstructed dynamically by replaying its domain events**:
- The database stores an `events` stream table: `(aggregate_id, version, event_type, payload)`.
- When loading an aggregate:
  1. Fetch all events where `aggregate_id = 'ORD-101'` ordered by version.
  2. Instantiate an empty `Order` object.
  3. Apply each event sequentially (`apply(OrderCreated)`, `apply(ItemAdded)`).
- **Snapshotting**: To prevent replaying 100,000 events, take a state snapshot every 100 events, replaying only events occurring after the snapshot.

### 26. How do you model Complex Business Rules using the Specification Pattern?
**In Simple Words:**
Encapsulates a business rule or validation predicate into an independent, reusable boolean specification object:
- Allows chaining specifications using boolean logic (`and`, `or`, `not`):
```typescript
interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
}

class CustomerEligibleForDiscountSpec implements Specification<Customer> {
  isSatisfiedBy(customer: Customer): boolean {
    return customer.accountAgeInYears >= 2 && customer.totalSpend > 5000;
  }
}
```
- Can be used for in-memory entity validation, repository database query construction, or UI rule evaluation.

### 27. How do you handle Concurrency and Race Conditions on Aggregate Roots?
**In Simple Words:**
Use **Optimistic Concurrency Control (OCC)**:
- Store a `version` integer on the Aggregate Root.
- When committing updates via the repository:
  `UPDATE orders SET status = 'CANCELLED', version = 4 WHERE id = 'ORD-101' AND version = 3;`
- If another concurrent request already updated the aggregate (version is already 4), the update affects 0 rows.
- The repository throws a `ConcurrencyException`, and the application service reloads the latest state and retries the business operation.

### 28. What is the Open Host Service (OHS) and Published Language (PL)?
**In Simple Words:**
When an Upstream Bounded Context must serve multiple Downstream consumer teams:
- Instead of building custom custom integrations for each client:
- **Open Host Service (OHS)**: Upstream exposes a stable, documented public subsystem (REST API, gRPC service).
- **Published Language (PL)**: Standardized data exchange format (e.g. JSON Schema, Protobuf contracts) that remains stable across internal domain model changes.

### 29. What is the Separate Ways pattern in Strategic DDD?
**In Simple Words:**
When the coordination, political overhead, and network integration cost between two teams exceeds the benefit of software integration:
- Both teams deliberately choose to **go their separate ways** and build independent solutions tailored to their specific needs.
- Often far cheaper and faster than forcing two enterprise departments into an artificial, rigid shared framework!

### 30. How do you model Temporal / Time-Series data in DDD?
**In Simple Words:**
Time is an explicit first-class citizen in business domains:
- Never store just a mutable status without context.
- Use explicit **Date Range Value Objects**: `DateRange(start: Date, end: Date)` with intersection and overlap methods (`rangeA.overlaps(rangeB)`).
- Model domain events with explicit business timestamps (`occurredAt`) rather than relying on technical database insertion timestamps.

### 31. What is the Customer / Supplier relationship in Context Mapping?
**In Simple Words:**
An Upstream (Supplier) / Downstream (Customer) relationship where the Upstream team's priorities are directly driven by Downstream needs:
- Downstream team submits feature requests and requirements.
- Upstream team plans and prioritizes their sprint backlogs to satisfy Downstream deliverables.
- Typical between Core Domain teams and supporting infrastructure services.

### 32. How do you implement Idempotency in Domain Event Consumers?
**In Simple Words:**
Message brokers (Kafka, RabbitMQ) provide **at-least-once delivery**, meaning event handlers will occasionally receive the exact same event multiple times:
- **Idempotent Consumer Pattern**:
  1. Consumer inspects incoming `eventId` (UUID).
  2. Queries a local `processed_events` database table.
  3. If `eventId` exists -> Acknowledge and discard immediately!
  4. If not -> Process business logic, insert `eventId` into `processed_events`, and commit in a single atomic transaction.

### 33. What is the difference between Domain Exceptions and Technical Exceptions?
**In Simple Words:**
- **Technical Exceptions**: Unexpected infrastructure failures (network timeout, database connection dropped, disk full). Handled with retries or circuit breakers.
- **Domain Exceptions**: Expected business invariant violations (e.g. `InsufficientFundsException`, `ProductOutOfStockException`, `OrderAlreadyShippedException`).
- Should be strongly typed, informative, and treated as regular business workflow outcomes.

### 34. How do you prevent Microservices from becoming a "Distributed Monolith" using DDD?
**In Simple Words:**
A distributed monolith happens when microservices are cut along technical layers (UI service, Logic service, Database service) or share database tables:
- **DDD Solution**:
  - Cut microservices strictly along **Bounded Context boundaries**.
  - **Shared Nothing**: Each microservice owns its private database. Other services can only access data through public APIs or events.
  - Minimize synchronous REST/RPC dependencies; maximize asynchronous event-driven decoupling.

### 35. When is Domain-Driven Design (DDD) an Anti-Pattern?
**In Simple Words:**
Applying full Tactical DDD to simple software:
1. **Simple CRUD applications**: If an app simply reads and writes forms to database tables with minimal business rules, applying Aggregates, Repositories, and Value Objects is pure over-engineering.
2. **Short-lived throwaway prototypes / MVPs**: Focus on product-market fit first before investing in deep domain models.
3. **Pure algorithmic or ETL pipelines**: Systems focused on data transformations rather than evolving business rules.
`;
