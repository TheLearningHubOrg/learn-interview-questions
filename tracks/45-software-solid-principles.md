# SOLID Principles, Object-Oriented Design & Clean Code Master Interview Bank (1 - 35)

> Comprehensive, production-grade technical interview questions covering SOLID Principles (SRP, OCP, LSP, ISP, DIP), High Cohesion & Low Coupling, Composition over Inheritance, Law of Demeter, Code Smells, and Architecture Testing with ArchUnit.

---

## Part 1: Core SOLID Principles & Fundamentals (1 - 10)

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

---

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

---

### 3. How do you implement the Open/Closed Principle (OCP) using Polymorphism?
**In Simple Words:**
You should be able to add new functionality without modifying existing, tested source code:
- **Violation**: Using a massive `switch(paymentType)` statement inside `processPayment()`. Adding ApplePay forces editing existing code!
- **Refactoring**: Define a `PaymentMethod` interface; implement `CreditCardPayment`, `PayPalPayment`, and `ApplePayPayment` as independent classes implementing `pay(amount)`.

---

### 4. What is the Liskov Substitution Principle (LSP) and what is the classic Rectangle-Square violation?
**In Simple Words:**
Subclasses must adhere to the behavioral contract of their parent class:
- **The Rectangle-Square Violation**:
  - `Square` inherits from `Rectangle`.
  - In `Square`, setting `width` automatically sets `height` to maintain a square.
  - A function expecting a `Rectangle` sets `width = 5` and `height = 10` and expects area to be 50.
  - Passing `Square` produces area 100, silently violating mathematical assumptions and breaking caller code!
- **Rule**: If a subtype cannot fulfill all invariants of the parent, use composition instead of inheritance.

---

### 5. What is the Interface Segregation Principle (ISP)?
**In Simple Words:**
Many client-specific, granular interfaces are better than one bloated, "fat" interface:
- **Violation**: A monolithic `Worker` interface with `work()`, `eat()`, and `sleep()`. A `Robot` class implementing `Worker` is forced to implement empty dummy methods for `eat()` and `sleep()`.
- **Refactoring**: Split into `Workable` and `Feedable` interfaces. Humans implement both; robots implement only `Workable`.

---

### 6. What is the Dependency Inversion Principle (DIP) and how does it differ from Dependency Injection (DI)?
**In Simple Words:**
- **Dependency Inversion Principle (DIP - The Design Principle)**: High-level business logic modules should not depend on low-level modules (e.g. databases, HTTP clients); both should depend on abstractions (interfaces).
- **Dependency Injection (DI - The Implementation Pattern)**: A technique where an object receives its dependencies from the outside (e.g. passed via constructor) rather than creating them internally using `new Database()`.

---

### 7. What is High Cohesion and Low Coupling, and how do they balance software design?
**In Simple Words:**
- **High Cohesion**: Elements within a module belong together and focus on performing one single, well-defined task.
- **Low Coupling**: Modules are loosely connected and independent; changes to one module do not ripple through or break other modules.

---

### 8. Why does Composition over Inheritance prevent the Fragile Base Class problem?
**In Simple Words:**
Inheritance is the tightest coupling in OOP because subclasses depend on the internal implementation details of the superclass. A change in the parent class can silently break subclass invariants (**Fragile Base Class**). Composition delegates behavior via interfaces, keeping boundaries clean and independently testable.

---

### 9. What is the Law of Demeter (Principle of Least Knowledge) and how do you spot train-wreck code?
**In Simple Words:**
A method should only call methods on:
1. Itself (`this`).
2. Its parameters.
3. Objects it instantiated directly.
4. Its direct member fields.

#### Train-Wreck Violation:
`order.getCustomer().getAddress().getCity().getZipCode()` exposes the internal structure of 4 classes! Refactor to `order.getShippingZipCode()`.

---

### 10. Explain the Tell, Don't Ask principle and how it avoids Anemic Domain Models?
**In Simple Words:**
Rather than asking an object for its data, performing logic outside, and setting the data back (`Ask`), **tell** the object what to do and let it manipulate its own internal state, encapsulating business rules.

---


---

## Part 2: Object-Oriented Design, Code Smells & Refactoring (11 - 24)

### 11. What is the DRY (Don't Repeat Yourself) principle vs Accidental Duplication?
**In Simple Words:**
DRY states: *Every piece of knowledge must have a single, unambiguous representation within a system.*
- **Crucial Distinction**: Code that looks identical but changes for different business reasons is **Accidental Duplication**. Coupling them into a shared helper creates premature abstraction and breaks SRP.

---

### 12. What are YAGNI and KISS principles and how do they prevent over-engineering?
**In Simple Words:**
- **YAGNI (You Aren't Gonna Need It)**: Never write code or create abstractions based on speculation about future requirements.
- **KISS (Keep It Simple, Stupid)**: Systems work best when kept simple rather than complicated with unnecessary layers.

---

### 13. What is an Anemic Domain Model vs a Rich Domain Model?
**In Simple Words:**
- **Anemic Domain Model**: Classes contain only getters/setters with zero business logic (pure data bags); all business rules reside in procedural Service classes. Considered an anti-pattern by Martin Fowler.
- **Rich Domain Model**: Domain entities encapsulate both data and business logic, defending their own invariants.

---

### 14. How do you defend Domain Invariants inside Domain Entities?
**In Simple Words:**
A domain invariant is a business rule that must **always be true** throughout an entity's lifecycle. Protect invariants by:
1. Making constructors private or validating all invariants upon creation.
2. Eliminating public setters.
3. Exposing intention-revealing methods that enforce validation.

---

### 15. What is Command Query Separation (CQS) at the class and method level?
**In Simple Words:**
Every method should either be:
- **A Command**: Mutates system state, returns `void`.
- **A Query**: Returns a value, has **zero side-effects** on system state.

---

### 16. How do you identify the "God Object" Code Smell and how do you refactor it using SRP?
**In Simple Words:**
A **God Object** knows too much or does too much (thousands of lines, dozens of dependencies). Refactor by grouping methods around distinct business actors and extracting cohesive single-purpose classes.

---

### 17. What is Primitive Obsession and how do Value Objects resolve it?
**In Simple Words:**
Relying on raw primitives (`string email`, `decimal amount`) rather than domain models. A **Value Object** (`EmailAddress`, `Money`) encapsulates validation, formatting, and immutability.

---

### 18. What is Feature Envy and how do you resolve it?
**In Simple Words:**
Occurs when a method in class A accesses getters of class B more than its own data. Resolve by moving the method into class B where the data naturally lives.

---

### 19. How do you design for Testability using the Dependency Inversion Principle?
**In Simple Words:**
High-level classes depend on interface abstractions injected via constructors. In unit tests, inject test doubles (mocks/stubs) without spinning up databases, file systems, or network sockets.

---

### 20. What is Interface Pollution and how does the Interface Segregation Principle prevent it?
**In Simple Words:**
Occurs when an interface accumulates dozens of unrelated methods. Clients are forced to implement dummy methods they never use. Segregate into smaller, role-focused interfaces (`Readable`, `Writable`, `Closeable`).

---

### 21. How does the Liskov Substitution Principle apply to Exception Contracts?
**In Simple Words:**
Subclasses cannot throw broader checked exceptions than their superclasses. A subclass method must honor the exception contract of the base abstraction to prevent unexpected crashes.

---

### 22. What are Preconditions and Postconditions in Design by Contract (LSP)?
**In Simple Words:**
- **Preconditions**: Cannot be strengthened in a subtype (cannot demand stricter inputs).
- **Postconditions**: Cannot be weakened in a subtype (cannot guarantee less outputs).

---

### 23. What is Shotgun Surgery vs Divergent Change?
**In Simple Words:**
- **Divergent Change**: A single class is modified for multiple unrelated reasons (violates SRP).
- **Shotgun Surgery**: A single business change forces dozens of edits across many different classes.

---

### 24. How do you refactor Legacy Code toward SOLID using Automated Characterization Tests?
**In Simple Words:**
Before refactoring legacy code with zero tests, write **Characterization Tests** that capture the current actual behavior of the system (bugs and all) to provide a safety net.

---


---

## Part 3: Enterprise Architecture, Package Design & Enforcement (25 - 35)

### 25. How do SOLID principles apply at the Microservices boundary level?
**In Simple Words:**
- **SRP**: A service owns a single business capability.
- **OCP**: Extend service features via event listeners rather than modifying existing APIs.
- **DIP**: Services communicate via standardized API schemas and contracts.

---

### 26. Explain the Common Closure Principle (CCP) and Common Reuse Principle (CRP)?
**In Simple Words:**
- **CCP**: Classes that change together should be packaged together in the same module.
- **CRP**: Classes that are not used together should not be packaged together.

---

### 27. What is the Acyclic Dependencies Principle (ADP) in enterprise package architecture?
**In Simple Words:**
The dependency graph of packages must contain **no cycles** (no mutual A -> B -> A dependencies). Break cycles by applying DIP and introducing an interface.

---

### 28. What is the Stable Abstractions Principle (SAP) and Stable Dependencies Principle (SDP)?
**In Simple Words:**
- **SDP**: Depend in the direction of stability (depend on modules that are harder to change).
- **SAP**: A stable module should also be abstract (interfaces/abstract classes) so it can be extended.

---

### 29. How do you enforce SOLID and Architectural Rules in CI/CD using ArchUnit or NetArchTest?
**In Simple Words:**
Write automated architectural fitness tests that fail in CI/CD if developers violate SOLID rules (e.g. domain layer depending on infrastructure, or circular package dependencies).

```java
// ArchUnit test enforcing Clean Architecture & DIP in CI/CD
@AnalyzeClasses(packages = "com.company.app")
public class ArchitectureTest {
    @ArchTest
    public static final ArchRule domain_must_not_depend_on_infrastructure =
        noClasses().thatResideInAPackage("..domain..")
            .should().dependOnClassesThatResideInAPackage("..infrastructure..");

    @ArchTest
    public static final ArchRule controllers_must_not_call_repositories_directly =
        noClasses().thatResideInAPackage("..controller..")
            .should().dependOnClassesThatResideInAPackage("..repository..");
}
```

---

### 30. How do you apply SOLID in Functional and Modern Multi-Paradigm Languages (TypeScript, Go, Rust)?
**In Simple Words:**
In languages without classic class inheritance, SOLID is applied via function composition, traits (Rust), implicit interfaces (Go), and structural typing (TypeScript).

---

### 31. What is the Rule of Three in software refactoring and avoiding Premature Abstraction?
**In Simple Words:**
Don't extract a shared abstraction when you see code duplicated once. Wait until you write it for the **third time** so you have enough data points to create the correct abstraction.

---

### 32. How does Encapsulation differ from Information Hiding?
**In Simple Words:**
- **Encapsulation**: Bundling data with methods that operate on that data.
- **Information Hiding**: Concealing design decisions and data structures behind stable interfaces to protect clients from change.

---

### 33. What is Static vs Dynamic Polymorphism and what are their performance trade-offs?
**In Simple Words:**
- **Dynamic Polymorphism**: Virtual method dispatch via v-tables at runtime; flexible but adds pointer indirection.
- **Static Polymorphism**: Generics and templates resolved at compile-time; zero runtime overhead and can be inlined.

---

### 34. How do you refactor an enterprise Payment Processing system adhering to all 5 SOLID principles?
**In Simple Words:**
1. **SRP**: Separate payment validation, gateway API calls, and invoice generation into distinct classes.
2. **OCP**: Add new payment gateways (Stripe, PayPal, Crypto) by implementing `PaymentGateway` interface without modifying existing checkout code.
3. **LSP**: Ensure all gateways return standardized result types and honor timeout contracts.
4. **ISP**: Split gateway interface into `Authorizable`, `Captureable`, and `Refundable`.
5. **DIP**: Inject payment abstractions into the checkout orchestrator.

---

### 35. When does strict adherence to SOLID harm software development velocity and performance?
**In Simple Words:**
Blindly creating 5 interfaces and factories for simple CRUD operations creates excessive indirection and mental fatigue. Balance SOLID with pragmatism: apply principles where business logic actually changes.


---

### 36. Single Responsibility Principle (SRP) and the "Reason to Change": Actor-driven responsibilities.

**In Simple Words:**
Robert C. Martin ("Uncle Bob") refined SRP: *"A module should be responsible to one, and only one, actor (stakeholder/user group)"*:
- **The Violation Example**: An `Employee` class containing `calculatePay()` (owned by CFO/Finance), `reportHours()` (owned by COO/Operations), and `save()` (owned by CTO/Database Admins).
- **The Consequence**: When Finance requests a change to overtime calculation, the edit inadvertently breaks the Operations timesheet report, causing merge conflicts and production bugs.
- **The Fix**: Separate into independent classes (`PayCalculator`, `HourReporter`, `EmployeeRepository`) operating over a shared immutable data structure.

---

### 37. Open/Closed Principle (OCP) via Strategy and Plugin Architectures.

**In Simple Words:**
*"Software entities should be open for extension, but closed for modification"*:
- When adding a new shipping carrier (DHL) to an e-commerce platform, you should **never open and edit existing shipping calculation code with a new `switch(carrier) case DHL:` statement**.
- **Plugin / Strategy Architecture**:
  ```typescript
  interface ShippingStrategy {
    calculateCost(order: Order): Money;
  }
  class DHLShippingStrategy implements ShippingStrategy {
    calculateCost(order: Order): Money { ... }
  }
  ```
- You simply add a new class implementing the interface and register it in the dependency container. Existing tested code remains 100% untouched and closed to edits.

---

### 38. Liskov Substitution Principle (LSP) Contracts: Preconditions, Postconditions, and Invariants.

**In Simple Words:**
Formulated by Barbara Liskov: Subtypes must be substitutable for their base types without altering program correctness.
- **Preconditions cannot be strengthened**: If base method `process(amount)` accepts any positive number ($> 0$), a subclass cannot demand `amount >= 100`.
- **Postconditions cannot be weakened**: If base method guarantees `return value != null`, a subclass cannot return `null`.
- **Invariants must be preserved**: Any internal consistency rule held by the superclass must continue to hold in the subclass.
- **Exception Rule**: A subclass cannot throw new checked exceptions that the caller does not expect from the base type contract.

---

### 39. Interface Segregation Principle (ISP) vs Fat Interfaces.

**In Simple Words:**
*"Clients should not be forced to depend upon interfaces that they do not use"*:
- **Fat Interface Anti-Pattern**: An `AllInOnePrinter` interface declaring `print()`, `scan()`, `fax()`, and `staple()`. A basic office printer implementing this interface must implement empty stubs or throw `UnsupportedOperationException` for scanning and stapling!
- **Role Interfaces**: Split into lean, granular capabilities:
  - `Printer { print() }`
  - `Scanner { scan() }`
  - `FaxMachine { fax() }`
- Classes implement only the specific interfaces matching their true capabilities.

---

### 40. Dependency Inversion Principle (DIP) vs Inversion of Control (IoC) vs Dependency Injection (DI).

**In Simple Words:**
Clarifying the three frequently confused terms:
1. **DIP (Architectural Principle)**: High-level business logic modules must not depend on low-level implementation modules (databases, APIs). Both must depend on abstractions (interfaces).
2. **IoC (Design Pattern / Concept)**: Inverting the traditional control flow. Instead of your custom code calling a framework library, the framework calls your custom code (the "Hollywood Principle": *Don't call us, we'll call you*).
3. **DI (Implementation Technique)**: The mechanism of passing dependencies into an object via constructor or setter rather than having the object construct them itself using `new Database()`.

---

### 41. SOLID in Microservices Architecture.

**In Simple Words:**
Applying object-oriented principles to distributed systems:
- **SRP in Microservices**: Each microservice owns a single business capability and one bounded context database.
- **OCP via Event-Driven Architecture**: An Order Service emits an `OrderPlaced` event to Kafka. When a new Fraud Detection service is introduced, it simply subscribes to the existing topic. The Order Service requires zero modifications!
- **DIP via API Gateways & Contracts**: Microservices communicate through stable OpenAPI/Protobuf contracts, abstracting internal database and language implementations.

---

### 42. SOLID in Functional Programming.

**In Simple Words:**
How SOLID manifests in functional languages (Clojure, Haskell, Elixir, Scala):
- **SRP**: Pure functions that do exactly one thing: accept input, return output, zero side effects.
- **OCP**: Higher-order functions. You extend a function's behavior by passing functional combinators (`map`, `filter`, custom predicate functions) rather than editing internal loops.
- **LSP**: Strong algebraic type systems where sum types and pattern matching guarantee exhaustiveness.
- **ISP**: Small function signatures and single-function typeclasses.
- **DIP**: Passing function references and configurations as arguments (Currying and Partial Application) instead of instantiating global state.

---

### 43. Refactoring God Classes to SRP: Facades and Delegation.

**In Simple Words:**
Refactoring a 5,000-line monolithic `UserManager` class:
1. Identify cohesive clusters of methods:
   - Auth & Passwords -> Extract to `AuthenticationService`.
   - Email Notifications -> Extract to `UserEmailNotifier`.
   - Profile Billing -> Extract to `UserSubscriptionService`.
2. Convert the original `UserManager` into a lightweight **Facade** that delegates calls to the new specialized services.
3. Migrate caller code over time to depend directly on the specialized services, and eventually retire the facade.

---

### 44. The Circle-Ellipse and Square-Rectangle Dilemma in LSP.

**In Simple Words:**
In mathematics, a Square is a special type of Rectangle ($width = height$).
In Object-Oriented Programming, modeling `Square extends Rectangle` **violates LSP**:
```typescript
class Rectangle {
  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }
}
class Square extends Rectangle {
  override setWidth(w: number) { this.width = w; this.height = w; }
  override setHeight(h: number) { this.width = h; this.height = h; }
}
```
- If client code runs:
  ```typescript
  rect.setWidth(5);
  rect.setHeight(10);
  assert(rect.getArea() === 50); // FAILS for Square (Area is 100)!
  ```
- Mathematical "is-a" relationships do not equate to behavioral OOP subtyping.

---

### 45. Interface Pollution and YAGNI: Detecting premature abstraction.

**In Simple Words:**
- **Interface Pollution Anti-Pattern**: Creating an `IUserService` interface for every single `UserService` when there is only ever one concrete implementation and zero intention of creating another.
- Creates indirection, requires clicking through two files in IDEs, and provides zero business value.
- **Rule of Thumb**: Do not extract an interface until you have **at least two distinct implementations** (e.g. real vs mock, or Stripe vs PayPal), or when crossing architectural boundaries (domain core to external database).

---

### 46. DIP in Clean Architecture / Hexagonal Architecture (Ports and Adapters).

**In Simple Words:**
- **The Core Invariant**: The domain layer (Entities and Use Cases) sits at the center and **knows nothing about databases, web frameworks, or third-party APIs**.
- **Ports (Interfaces)**: Defined inside the Domain layer (e.g. `UserRepository`, `EmailSender`).
- **Adapters (Implementations)**: Live on the outside perimeter (e.g. `PostgresUserRepository`, `SendGridEmailSender`).
- Source code dependencies point strictly **inward**. You can replace PostgreSQL with MongoDB without changing a single line of domain business logic!

---

### 47. Testing Benefits of SOLID.

**In Simple Words:**
- **Fast Unit Tests**: When classes follow SRP, they have few dependencies, allowing unit tests to run in microseconds without booting heavy spring/database contexts.
- **Trivial Mocking via DIP**: Because dependencies are injected as interfaces, test suites can pass in-memory fake repositories or mock gateways instantly:
  ```typescript
  const mockRepo = new InMemoryOrderRepository();
  const service = new CheckoutService(mockRepo);
  ```
- Eliminates brittle integration tests that fail due to shared database state.

---

### 48. Anti-Patterns Violating SOLID: Shotgun Surgery vs Divergent Change.

**In Simple Words:**
- **Divergent Change (Violates SRP)**: When one class has to be modified in different ways every time different business requirements change (e.g. modifying `OrderManager` for shipping changes, tax changes, and PDF template changes).
- **Shotgun Surgery (Opposite of SRP)**: When a single business change requires making dozens of small edits scattered across 15 different classes. Indicates responsibilities are fragmented and tightly coupled.
- **Feature Envy**: When a method in Class A spends all its time reading properties and calling methods in Class B. The method belongs inside Class B!

---

### 49. SOLID and Concurrency: Thread safety invariants and immutable value objects.

**In Simple Words:**
In multi-threaded environments, mutable state violates class invariants under concurrent access:
- **Immutable Value Objects**: Making domain entities immutable (e.g. `record` in Java/C#, frozen objects in TypeScript) guarantees that class state can never be observed in an inconsistent intermediate state by another thread.
- Preserves LSP contracts: Subclasses cannot introduce race conditions or unsynchronized mutations.

---

### 50. Pragmatic Architecture: Balancing SOLID with KISS and YAGNI.

**In Simple Words:**
Architecture is about trade-offs, not dogma:
- **KISS (Keep It Simple, Stupid)**: Favor simple, readable code over clever abstractions.
- **YAGNI (You Aren't Gonna Need It)**: Do not build generalized abstract plugin architectures for features that might never be built.
- **The Pragmatic Guideline**: Start with simple, cohesive procedural code. As complexity grows and multiple features share behavior, refactor toward SOLID principles iteratively.
