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
