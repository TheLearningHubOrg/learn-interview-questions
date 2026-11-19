# Domain-Driven Design (DDD) & Clean Architecture Master Interview Bank (1 - 10)

> Strategic DDD (Bounded Contexts, Ubiquitous Language, Context Mapping), Tactical DDD (Aggregates, Aggregate Roots, Entities, Value Objects, Domain Events), Hexagonal / Onion Architecture, and SAGA pattern.

---

### 1. Structural Patterns: Adapter vs. Decorator vs. Facade vs. Proxy.
**In Simple Words:**
- **Adapter**: Converts the interface of a class into another interface clients expect (wraps an incompatible legacy third-party class).
- **Decorator**: Dynamically adds behavior or responsibilities to an object without modifying its structure or using inheritance (e.g. adding caching, logging, or encryption wrappers).
- **Facade**: Provides a simplified, high-level interface to a complex subsystem (e.g. a single `OrderFacade.placeOrder()` orchestrating inventory, payment, billing, and shipping subsystems).
- **Proxy**: Provides a surrogate or placeholder for another object to control access, perform la

### 2. Behavioral Patterns: Strategy vs. Observer vs. Command vs. Chain of Responsibility.
**In Simple Words:**
- **Strategy**: Defines a family of interchangeable algorithms, encapsulates each one, and makes them selectable at runtime (e.g. `CreditCardStrategy`, `PayPalStrategy`).
- **Observer**: Defines a one-to-many dependency so that when one object changes state, all its dependents are notified automatically (pub/sub, event listeners).
- **Command**: Encapsulates a request as an object, enabling parameteri

### 3. Core DDD Concepts: Bounded Contexts, Ubiquitous Language, and Subdomains.
**In Simple Words:**
- **Ubiquitous Language**: A shared, rigorous vocabulary agreed upon by both domain business experts and developers, reflected directly in the source code.
- **Bounded Context**: An explicit boundary within which a domain model applies. In an e-commerce platform, a `User` in the **Identity Context** means credentials and roles, but in the **Shipping Context**, it means physical delivery address. Bounded Contexts form the natural architectural boundaries for microservices.
- **Subdomains**: Core (competitive advantage), Supporting (custom feature supporting core), and Generic (off-the-shelf software like billing/auth).

### 4. Strategic DDD: Entities vs. Value Objects vs. Aggregates.
**In Simple Words:**
- **Entity**: An object defined by its distinct, immutable identity (`UUID`) rather than its attributes (e.g. `User`, `Order`). Two users with the same name are distinct entities.
- **Value Object**: An immutable object defined entirely by its attributes with no conceptual identity (e.g. `Money(amount: 100, currency: USD)`, `Address`). Two money objects with identical values are equal.
- **Aggregate**: A cluster of domain entities and value objects treated as a single unit for data changes. Every aggregate has an **Aggregate Root** (the only gateway through which external objects can read or mutate the aggregate). Enforces all business invariants.

### 5. What is the Strangler Fig Pattern in Enterprise Modernization?
**In Simple Words:**
A pattern for safely migrating a legacy monolithic application to microservices by incrementally replacing specific features with new microservices.
An API Gateway intercepts traffic: legacy endpoints route to the monolith, while moderni

### 6. Explain the SAGA Pattern: Orchestration vs. Choreography for Distributed Transactions.
**In Simple Words:**
Because distributed 2-Phase Commit (2PC) locks database tables and does not scale across microservices, SAGA coordinates a sequence of local transactions:
- **Choreography**: Event-driven; each service listens to events, performs its action, and publishes the next event. If a failure occurs, services publish compensating rollback events.
- **Orchestration**: A centrali

### 7. Entities vs. Value Objects in Domain-Driven Design (DDD).
**In Simple Words:**
- **Entity**: Has an explicit, unique identity that persists across time and state changes (e.g. `User` with UUID `usr_123`). Two entities with identical attributes but different IDs are different.
- **Value Object**: Defined purely by its attribute values; has **no identity** and is strictly **immutable** (e.g. `Money(50, 'USD')`, `Address`, `DateRange`). If two Value Objects have the same values, they are completely equal.

### 8. Aggregates and Aggregate Roots: Enforcing Consistency Boundaries.
**In Simple Words:**
- An **Aggregate** is a cluster of associated Entities and Value Objects treated as a single transactional unit.
- **Aggregate Root**: The primary entity through which all external code must interact with the aggregate (e.g. `Order` is the Aggregate Root for `OrderItem` entities). External services cannot mutate an `OrderItem` directly; all changes must pass through `order.addItem(...)` to ensure business invariants (e.g. total order price, inventory checks) are never violated.

### 9. Hexagonal Architecture (Ports and Adapters) vs. Onion Architecture.
**In Simple Words:**
Both architectures isolate business logic from infrastructure:
- **Core Domain**: Contains pure business rules, entities, and use cases with zero external dependencies (no database, no HTTP framework).
- **Ports**: Interfaces defined by the domain (e.g. `OrderRepositoryPort`, `NotificationServicePort`).
- **Adapters**: Infrastructure implementations outside the core (e.g. `PostgresOrderRepositoryAdapter`, `SendGridNotificationAdapter`). The database and UI depend on the domain; the domain never depends on the database!

### 10. Strangler Fig Pattern for Monolith-to-Microservices Migration.
**In Simple Words:**
Instead of a high-risk "Big Bang" rewrite of a legacy monolith:
1. Place an API Gateway or reverse proxy in front of the legacy monolith.
2. Build new features or extract domain bounded contexts into new microservices.
3. Route specific endpoints (`/orders`) to the new microservice while other requests continue hitting the monolith.
4. Over time, the new services "strangle" and replace the monolith until the legacy codebase can be safely decommissioned.

