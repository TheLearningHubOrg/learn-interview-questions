# Software Design Patterns, SOLID Principles & Domain-Driven Design Master Interview Question Bank (1 - 50)

> Comprehensive, senior-level interview questions and architectural deep-dives covering Gang of Four (GoF) Design Patterns (Creational, Structural, Behavioral), SOLID Engineering Principles, Domain-Driven Design (DDD), and Microservices Architectural Patterns.

---

## Part 1: SOLID Principles Deep-Dive (1 - 15)

### 1. Explain the Single Responsibility Principle (SRP) with a practical before/after refactoring example.
**In Simple Words:**
"A class or module should have one, and only one, reason to change."
It does not mean a class should only have one method; it means the class should only be responsible to a **single actor or stakeholder**.

**Violation**: An `Employee` class that calculates pay (Accounting actor), reports hours (HR actor), and saves to the database (Database DBA actor). Changes to the payroll calculation risk breaking HR reporting.
**Solution**: Separate into `PayCalculator`, `HourReporter`, and `EmployeeRepository`.

### 2. Explain the Open/Closed Principle (OCP): How to design software open for extension but closed for modification.
**In Simple Words:**
You should be able to extend a module's behavior without modifying its existing source code.
Achieved through **abstraction, polymorphism, and dependency inversion**:
Instead of writing a gigantic `switch(paymentMethod)` statement inside a payment service (which forces modifying existing code every time a new payment provider is added), define a `PaymentGateway` interface. New payment providers (Stripe, PayPal, Crypto) simply implement the interface without touching existing tested logic.

### 3. Explain the Liskov Substitution Principle (LSP): Why a Square is NOT a Rectangle in OOP.
**In Simple Words:**
"Subtypes must be substitutable for their base types without altering the correctness of the program."

**Classic Violation (Square extends Rectangle)**:
A rectangle has independent width and height setters. If `Square` inherits from `Rectangle` and overrides `setWidth(w)` to also mutate `height`, any client expecting a rectangle's width and height to change independently will fail unit tests:
```typescript
function testArea(rect: Rectangle) {
  rect.setWidth(5);
  rect.setHeight(10);
  // Expected area: 50. If Square is passed, area is 100! LSP VIOLATION.
  assert(rect.getArea() === 50);
}
```
**Fix**: Favor composition or create an immutable shape hierarchy.

### 4. Explain the Interface Segregation Principle (ISP): Avoiding Fat Interfaces.
**In Simple Words:**
"Clients should not be forced to depend upon interfaces that they do not use."
Instead of one massive, monolithic interface with 30 methods (`IWorker`), break it into smaller, cohesive, role-specific interfaces (`IWorkable`, `IFeedable`, `ISleepable`).
A `Robot` worker only implements `IWorkable`, completely avoiding useless empty stub implementations for `eat()` or `sleep()`.

### 5. Explain the Dependency Inversion Principle (DIP) vs. Dependency Injection (DI) vs. Inversion of Control (IoC).
**In Simple Words:**
1. **DIP (Principle)**: High-level business modules should not depend on low-level modules (e.g. database drivers, HTTP clients). Both should depend on **abstractions (interfaces)**.
2. **IoC (Architecture Pattern)**: Inverting the flow of control; instead of your code calling a library, an underlying framework (Spring, NestJS, Angular) calls your code.
3. **DI (Mechanism)**: A design pattern implementing DIP where dependencies are passed into an object (via constructor, setter, or field) rather than instantiated with `new` inside the class.

---

## Part 2: Gang of Four (GoF) Design Patterns (16 - 35)

### 6. Creational Patterns: Factory Method vs. Abstract Factory vs. Builder vs. Singleton.
**In Simple Words:**
- **Factory Method**: Defines an interface for creating an object, but lets subclasses decide which concrete class to instantiate.
- **Abstract Factory**: Creates **families of related or dependent objects** without specifying their concrete classes (e.g. `MacButton` + `MacCheckbox` vs. `WinButton` + `WinCheckbox`).
- **Builder**: Separates the construction of a complex object from its representation, allowing step-by-step construction of complex objects with method chaining.
- **Singleton**: Guarantees a class has only one instance and provides a global access point. (Caution: Can become an anti-pattern if overused; hide behind DI).

### 7. Structural Patterns: Adapter vs. Decorator vs. Facade vs. Proxy.
**In Simple Words:**
- **Adapter**: Converts the interface of a class into another interface clients expect (wraps an incompatible legacy third-party class).
- **Decorator**: Dynamically adds behavior or responsibilities to an object without modifying its structure or using inheritance (e.g. adding caching, logging, or encryption wrappers).
- **Facade**: Provides a simplified, high-level interface to a complex subsystem (e.g. a single `OrderFacade.placeOrder()` orchestrating inventory, payment, billing, and shipping subsystems).
- **Proxy**: Provides a surrogate or placeholder for another object to control access, perform lazy loading, or manage security permissions.

### 8. Behavioral Patterns: Strategy vs. Observer vs. Command vs. Chain of Responsibility.
**In Simple Words:**
- **Strategy**: Defines a family of interchangeable algorithms, encapsulates each one, and makes them selectable at runtime (e.g. `CreditCardStrategy`, `PayPalStrategy`).
- **Observer**: Defines a one-to-many dependency so that when one object changes state, all its dependents are notified automatically (pub/sub, event listeners).
- **Command**: Encapsulates a request as an object, enabling parameterizing clients with queues, requests, undo/redo operations, and logging.
- **Chain of Responsibility**: Passes a request along a dynamic chain of handlers. Each handler decides either to process the request or pass it to the next handler in the chain (e.g. HTTP Middleware pipelines).

---

## Part 3: Domain-Driven Design (DDD) & Microservices Patterns (36 - 50)

### 9. Core DDD Concepts: Bounded Contexts, Ubiquitous Language, and Subdomains.
**In Simple Words:**
- **Ubiquitous Language**: A shared, rigorous vocabulary agreed upon by both domain business experts and developers, reflected directly in the source code.
- **Bounded Context**: An explicit boundary within which a domain model applies. In an e-commerce platform, a `User` in the **Identity Context** means credentials and roles, but in the **Shipping Context**, it means physical delivery address. Bounded Contexts form the natural architectural boundaries for microservices.
- **Subdomains**: Core (competitive advantage), Supporting (custom feature supporting core), and Generic (off-the-shelf software like billing/auth).

### 10. Strategic DDD: Entities vs. Value Objects vs. Aggregates.
**In Simple Words:**
- **Entity**: An object defined by its distinct, immutable identity (`UUID`) rather than its attributes (e.g. `User`, `Order`). Two users with the same name are distinct entities.
- **Value Object**: An immutable object defined entirely by its attributes with no conceptual identity (e.g. `Money(amount: 100, currency: USD)`, `Address`). Two money objects with identical values are equal.
- **Aggregate**: A cluster of domain entities and value objects treated as a single unit for data changes. Every aggregate has an **Aggregate Root** (the only gateway through which external objects can read or mutate the aggregate). Enforces all business invariants.

### 11. What is the Strangler Fig Pattern in Enterprise Modernization?
**In Simple Words:**
A pattern for safely migrating a legacy monolithic application to microservices by incrementally replacing specific features with new microservices.
An API Gateway intercepts traffic: legacy endpoints route to the monolith, while modernized endpoints route to the new microservice. Over time, the monolith shrinks until it can be retired completely with zero downtime.

### 12. Explain the SAGA Pattern: Orchestration vs. Choreography for Distributed Transactions.
**In Simple Words:**
Because distributed 2-Phase Commit (2PC) locks database tables and does not scale across microservices, SAGA coordinates a sequence of local transactions:
- **Choreography**: Event-driven; each service listens to events, performs its action, and publishes the next event. If a failure occurs, services publish compensating rollback events.
- **Orchestration**: A centralized Orchestrator service commands each participant service sequentially and manages compensating rollbacks if any step fails.

### 13. Senior Software Architect Conclusion: Design Principles.
**In Simple Words:**
1. Premature abstraction is the root of all complexity: do not apply design patterns until a real need emerges.
2. Align software architecture with business domain boundaries using Domain-Driven Design.
3. Code to interfaces, favor composition over inheritance, and keep aggregates small and consistent.
