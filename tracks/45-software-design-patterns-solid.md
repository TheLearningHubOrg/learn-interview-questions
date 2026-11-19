# Software Design Patterns & SOLID Principles Master Interview Bank (1 - 10)

> SOLID principles in enterprise architecture, Gang of Four (GoF) Creational patterns (Factory, Singleton, Builder), Structural patterns (Adapter, Decorator, Facade), and Behavioral patterns (Observer, Strategy).

---

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

### 7. Factory Method vs. Abstract Factory Pattern.
**In Simple Words:**
- **Factory Method**: Uses inheritance. Defines an interface for creating a single object, but leaves the choice of its concrete type to subclasses.
- **Abstract Factory**: Uses object composition. Provides an interface for creating entire families of related or dependent objects without specifying their concrete classes (e.g. `GUIFactory` producing `MacButton` + `MacCheckbox` vs. `WinButton` + `WinCheckbox`).

### 8. Strategy Pattern vs. State Pattern.
**In Simple Words:**
Both patterns encapsulate behavior into interchangeable classes:
- **Strategy Pattern**: The client configures the context with a specific algorithm strategy (e.g. `PaymentProcessor` configured with `PayPalStrategy` or `StripeStrategy`). Strategies are usually unaware of each other.
- **State Pattern**: The context object automatically transitions its behavior based on its internal state (e.g. `Order` transitioning from `PendingState` -> `PaidState` -> `ShippedState`). States know about and trigger transitions to other states.

### 9. Observer Pattern vs. Pub/Sub Pattern.
**In Simple Words:**
- **Observer Pattern**: Synchronous, in-memory. The Subject maintains a list of Observers and notifies them directly by invoking their callback method (`observer.update()`). Both components must exist in the same memory address space.
- **Publish/Subscribe (Pub/Sub)**: Decoupled, asynchronous. Publishers and Subscribers never know each other exists; all communication routes through an external **Message Broker** or Event Bus (RabbitMQ, Kafka, Redis Pub/Sub).

### 10. Decorator Pattern vs. Proxy Pattern.
**In Simple Words:**
Both patterns wrap an underlying target object and share the same interface:
- **Decorator Pattern**: Focuses on **adding new responsibilities/features** dynamically without subclassing (e.g. `GzipCompressionStream` wrapping `FileOutputStream`).
- **Proxy Pattern**: Focuses on **controlling access** to the underlying object (e.g. Virtual Proxy for lazy loading, Protection Proxy for auth checks, Remote Proxy for RPC stubs).

