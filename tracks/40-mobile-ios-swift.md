# iOS & Swift 6 Modern Architecture Master Interview Bank (1 - 35)

> Swift 6 language fundamentals, Value Types vs Reference Types, ARC (Automatic Reference Counting, retain cycles, weak vs unowned), Swift Concurrency (async/await, Tasks, Actors, @MainActor, Sendable protocol), SwiftUI view lifecycle and state management, Combine framework, SwiftData vs Core Data, Keychain & Secure Enclave, and Instruments profiling.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What are the key differences between Value Types (struct, enum) and Reference Types (class) in Swift?
**In Simple Words:**
The core architectural distinction in Swift:
- **Value Types (`struct`, `enum`, primitives like `Int`, `String`, `Array`)**:
  - Allocated on the **Stack** (fast allocation and deallocation).
  - Copied on assignment or when passed to functions (**Copy-On-Write**).
  - Thread-safe by default because each thread operates on its own isolated copy.
- **Reference Types (`class`, closures)**:
  - Allocated on the **Heap**.
  - Multiple variables point to the **exact same memory address**.
  - Managed by **Automatic Reference Counting (ARC)**; prone to multi-threaded race conditions if not synchronized.

```swift
// Value Type (Independent Copy):
struct Point { var x: Int, y: Int }
var p1 = Point(x: 10, y: 20)
var p2 = p1
p2.x = 99 // p1.x remains 10!

// Reference Type (Shared Pointer):
class User { var name: String; init(name: String) { self.name = name } }
let u1 = User(name: "Alex")
let u2 = u1
u2.name = "Bob" // u1.name is now also "Bob"!
```

### 2. How does Automatic Reference Counting (ARC) work in Swift?
**In Simple Words:**
ARC automatically manages memory for class instances on the heap:
- Every time a new reference to an instance is created, ARC increments its **reference count** by 1.
- When a reference goes out of scope or is set to `nil`, ARC decrements the reference count by 1.
- When the reference count drops to **0**, the instance is immediately deallocated from memory, and its `deinit` block is invoked.
- ARC operates at compile-time by injecting `retain` and `release` calls into your code; it is **not a garbage collector**.

### 3. What is a Retain Cycle (Strong Reference Cycle) and how do you resolve it?
**In Simple Words:**
A retain cycle occurs when two class instances hold strong references to each other, preventing either reference count from ever reaching 0:
- Result: **Memory Leak**; neither instance can ever be deallocated!
- **Resolution**: Break the cycle using **`weak`** or **`unowned`** references:
  - **`weak`**: Does not increment reference count. Must be an `Optional` (`weak var parent: Person?`). Automatically becomes `nil` when the referenced instance is deallocated.
  - **`unowned`**: Does not increment reference count. Non-optional; expects the referenced instance to **never become `nil`** during its lifetime (crashes if accessed after deallocation).

```swift
class Order {
    var customer: Customer?
}

class Customer {
    // FIX: Declare as weak to break retain cycle!
    weak var activeOrder: Order?
}
```

### 4. What is a Capture List in Swift Closures (`[weak self]`)?
**In Simple Words:**
Closures are reference types that strongly capture any variables referenced within their body:
- If a class instance owns a closure (e.g. `onComplete`), and the closure references `self` (`self.refreshUI()`), a **Retain Cycle** is formed (`self -> closure -> self`).
- **Capture List**: `[weak self]` in the closure declaration instructs the closure to capture `self` weakly:
```swift
networkManager.fetchData { [weak self] result in
    guard let self = self else { return } // Safe unwrapping
    self.updateUI(with: result)
}
```

### 5. What are Optionals and how do you safely unwrap them in Swift?
**In Simple Words:**
An Optional represents a variable that can either hold a wrapped value or `nil`:
1. **Optional Binding (`if let` / `guard let`)**: Safely unwraps the value (preferred standard).
2. **Nil-Coalescing Operator (`??`)**: Provides a fallback default value (`let name = inputName ?? "Guest"`).
3. **Optional Chaining (`user?.address?.city`)**: Gracefully fails to `nil` if any link in the chain is `nil`.
4. **Forced Unwrapping (`!`)**: Assumes value exists; **fatal crash at runtime** if value is `nil`! Avoid in production.

### 6. What is the difference between SwiftUI and UIKit?
**In Simple Words:**
- **UIKit (Imperative - Legacy/Mature)**: Event-driven UI framework since iOS 2.0. Manages `UIViewController` lifecycles, view hierarchies (`UIView`), and layout constraints (AutoLayout). High manual state synchronization.
- **SwiftUI (Declarative - Modern Standard)**: Introduced in iOS 13+. You declare *what* the UI should look like for a given state using Swift structs. The framework automatically renders, layouts, and updates the UI when state changes.

### 7. What is the SwiftUI View Protocol and why are views structs?
**In Simple Words:**
In SwiftUI, every view conforms to the `View` protocol, requiring a `body` computed property:
- Views are **lightweight structs**, not reference classes!
- Creating, destroying, and recreating struct instances on the stack takes nanoseconds and consumes minimal memory.
- SwiftUI continually recreates view structs to determine UI diffs, updating only the underlying render tree.

```swift
import SwiftUI

struct GreetingView: View {
    let name: String

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: "hand.wave.fill")
                .foregroundColor(.blue)
            Text("Hello, \(name)!")
                .font(.headline)
        }
    }
}
```

### 8. What is the difference between `@State` and `@Binding` in SwiftUI?
**In Simple Words:**
- **`@State`**: Declares local, private source of truth owned by the view. When the value changes, SwiftUI invalidates the view and re-renders `body`.
- **`@Binding`**: Two-way reference to state owned by an ancestor/parent view without owning or duplicating the data:
```swift
struct ToggleView: View {
    @Binding var isEnabled: Bool // Passed from parent view!

    var body: some View {
        Toggle("Notifications", isOn: $isEnabled)
    }
}
```

### 9. What is the difference between `@StateObject` and `@ObservedObject`?
**In Simple Words:**
Both observe classes conforming to `ObservableObject`:
- **`@StateObject` (Owner)**: The view **instantiates and owns** the object. SwiftUI ensures the instance is created only once and survives view re-evaluations.
- **`@ObservedObject` (Consumer)**: The view receives an already-created object from a parent view. If used to instantiate an object inside a view, it will be **destroyed and recreated every time the parent view re-renders**, wiping out local state!
- *Rule*: Create with `@StateObject`; pass down with `@ObservedObject`.

### 10. What is the `@Observable` macro in iOS 17+ (Observation Framework)?
**In Simple Words:**
Replaces the legacy `ObservableObject` and `@Published` property wrappers:
- Just annotate your class with `@Observable`.
- SwiftUI automatically tracks property access down to the specific field level: if a view only reads `user.name`, changes to `user.age` will **NOT trigger a view re-render**!
- Eliminates `@StateObject` and `@ObservedObject` boilerplate entirely.

```swift
@Observable
class UserProfile {
    var name = "Alex"
    var score = 100
}
```

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. How does Swift Concurrency (`async/await`) work and how does it replace completion handlers?
**In Simple Words:**
Before Swift 5.5, asynchronous code relied on nested completion handler closures, leading to "Callback Hell" and unhandled error states:
- **`async/await`**: Writes asynchronous code that reads like synchronous procedural code:
- When code hits `await`, the execution thread is **suspended**, freeing the underlying OS thread to do other work.
- When the asynchronous task completes, execution resumes on an available thread.

```swift
// Modern async/await:
func loadProfile(userId: String) async throws -> Profile {
    let url = URL(string: "https://api.com/users/\(userId)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(Profile.self, from: data)
}
```

### 12. What are Actors in Swift and how do they eliminate Data Races?
**In Simple Words:**
An `actor` is a reference type that protects its mutable state through **Actor Isolation**:
- Only one task can execute code inside an actor instance at any given time.
- All external calls to an actor's methods or properties must use **`await`**, waiting their turn in an orderly queue.
- Eliminates race conditions and shared mutable state bugs without manual locks or dispatch queues!

```swift
actor BankAccount {
    private var balance: Double = 0.0

    func deposit(amount: Double) {
        balance += amount
    }

    func getBalance() -> Double {
        return balance
    }
}
```

### 13. What is `@MainActor` in Swift?
**In Simple Words:**
A globally unique actor that always executes code on the **Main Thread (UI thread)**:
- Annotating a class, function, or view model with `@MainActor` guarantees that all state mutations and UI updates are executed on the main thread, eliminating the classic crash: `UIAccessibilityElement not on main thread`.

```swift
@MainActor
class FeedViewModel: ObservableObject {
    @Published var posts: [Post] = []

    func loadPosts() async {
        let fetched = try? await NetworkService.fetchPosts()
        // Automatically runs on Main Thread!
        self.posts = fetched ?? []
    }
}
```

### 14. What is the `Sendable` protocol in Swift 6?
**In Simple Words:**
The cornerstone of **Data-Race Safety** in Swift 6:
- A `Sendable` type is safe to transfer across concurrency boundaries (between tasks or actors).
- **What is Sendable?**: Value types (structs with Sendable members), Actors, and immutable final classes with immutable properties.
- **What is NOT Sendable?**: Mutable classes, pointers, closures without `@Sendable`.
- Swift 6 enforces complete compile-time checking; attempting to pass non-Sendable mutable state across threads triggers a compiler error!

### 15. What are Tasks and TaskGroups in Swift Concurrency?
**In Simple Words:**
- **`Task`**: The basic unit of asynchronous execution. Inherits priority and actor context.
- **Structured Concurrency (`async let` / `withTaskGroup`)**:
  - `async let`: Runs multiple independent async calls in parallel and awaits them together.
  - `withTaskGroup`: Runs a dynamic list of concurrent child tasks, automatically propagating cancellation if the parent task fails.

```swift
// Parallel execution using async let:
async let avatar = downloadImage(url: avatarUrl)
async let stats = fetchStats(id: userId)
let profile = try await Profile(avatar: avatar, stats: stats)
```

### 16. What is the Combine Framework and what are Publishers, Subscribers, and Operators?
**In Simple Words:**
Apple's reactive declarative framework for processing asynchronous events over time:
- **Publisher**: Emits a sequence of values over time (e.g. `NotificationCenter.default.publisher`, `PassthroughSubject`).
- **Operator**: Transforms, filters, or combines values (`.map`, `.filter`, `.debounce(for:scheduler:)`).
- **Subscriber**: Receives and processes values (`.sink`, `.assign`).
- **`AnyCancellable`**: Holds the subscription lifecycle; if deallocated, the subscription is cancelled.

### 17. What is SwiftData and how does it compare to Core Data?
**In Simple Words:**
- **Core Data (Legacy)**: Powerful object-relational mapping framework. Requires visual `.xcdatamodeld` XML files, `NSManagedObject` subclasses, and verbose `NSManagedObjectContext` code.
- **SwiftData (Modern - iOS 17+)**: Swift-native replacement for Core Data:
  - Models declared using the `@Model` macro directly on pure Swift classes.
  - Queries declared using the `#Predicate` macro with full compile-time type checking.
  - Integrates seamlessly with SwiftUI via `@Query`.
  - Uses the same robust SQLite storage engine under the hood.

```swift
import SwiftData

@Model
class Expense {
    var title: String
    var amount: Double
    var date: Date

    init(title: String, amount: Double, date: Date = .now) {
        self.title = title
        self.amount = amount
        self.date = date
    }
}
```

### 18. What are Keychain Services and how do they differ from `UserDefaults`?
**In Simple Words:**
- **`UserDefaults`**: Plain plist XML file stored on the device. Completely unencrypted! Can be read by anyone inspecting an unencrypted device backup. Never store passwords, tokens, or encryption keys in UserDefaults!
- **Keychain**: Hardware-encrypted, secure SQLite database managed by the OS:
  - Data remains encrypted even if the device is backed up.
  - Supports access control policies: `kSecAttrAccessibleAfterFirstUnlock`.
  - Shared securely between apps from the same developer via Keychain Access Groups.

### 19. What is the Secure Enclave on Apple Devices?
**In Simple Words:**
A dedicated hardware-isolated security coprocessor separate from the main Apple Silicon CPU:
- Generates and stores private cryptographic keys (elliptic curve P-256).
- **The private key never leaves the Secure Enclave!** The main iOS operating system cannot read the private key.
- The main CPU requests the Secure Enclave to perform cryptographic operations (signing, decryption), which execute only after biometric verification (**Face ID / Touch ID**).

### 20. How do you implement Dependency Injection in iOS applications?
**In Simple Words:**
Avoid hardcoding concrete dependencies inside classes:
- **Protocol-Based DI**: Define an interface protocol (`AuthServiceProtocol`), inject it via the class initializer:
```swift
protocol AuthServiceProtocol {
    func login(credentials: Credentials) async throws -> User
}

class LoginViewModel: ObservableObject {
    private let authService: AuthServiceProtocol

    init(authService: AuthServiceProtocol = AuthService()) {
        self.authService = authService
    }
}
```
- Allows injecting mock services (`MockAuthService`) in Unit Tests with 100% test isolation.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. What is Copy-On-Write (COW) in Swift and how do you implement it for custom structs?
**In Simple Words:**
Standard Swift collections (`Array`, `Dictionary`, `String`) are value types with Copy-On-Write optimization:
- When you assign `b = a`, memory is **not duplicated immediately**; both variables share the same underlying memory buffer.
- Memory is only duplicated when one of the variables **attempts to mutate data**!
- **Custom Implementation**: Wrap a reference type (`class`) inside a struct and check `isKnownUniquelyReferenced(&ref)` before mutation:
```swift
struct CustomBuffer {
    private var storage = StorageClass()

    mutating func write(data: String) {
        if !isKnownUniquelyReferenced(&storage) {
            storage = storage.copy() // Duplicate buffer only upon mutation!
        }
        storage.data = data
    }
}
```

### 22. What are Method Dispatch mechanisms in Swift (Static vs Table vs Message Dispatch)?
**In Simple Words:**
How the CPU determines which executable memory address to jump to when calling a method:
1. **Static / Direct Dispatch (Fastest)**: Resolved at compile time. Inlined by compiler. Used for `struct` methods, `final` class methods, and methods in class extensions.
2. **Table / Witness Table Dispatch (Medium)**: Dynamic dispatch via a virtual function table (vtable for classes, witness table for protocols). Looks up pointer at runtime.
3. **Message Dispatch (Most Dynamic / Slowest)**: Pure Objective-C runtime lookup (`objc_msgSend`). Can be swizzled at runtime. Used for `@objc dynamic` methods.

```text
Swift Dispatch Hierarchy:
Static Dispatch (Inlined, Compile-Time) ◄── struct / final class
Witness Table Dispatch (vtable)        ◄── Class inheritance & Protocols
Message Dispatch (objc_msgSend)        ◄── @objc dynamic & KVO
```

### 23. What is Memory Profiling with Xcode Instruments (Allocations vs Leaks)?
**In Simple Words:**
- **Allocations Instrument**: Tracks heap memory growth and object lifecycles over time. Helps identify **Abandoned Memory** (objects that are technically referenced and not leaked, but kept in memory unnecessarily, e.g. unconstrained image caches).
- **Leaks Instrument**: Periodically scans process memory for unreferenced memory blocks and cycles that can never be freed.
- **Generation Analysis**: Marks a baseline before entering a screen and evaluates delta after exiting; any retained memory indicates a leak.

### 24. What is Swift 6 Complete Concurrency Checking and how do you migrate legacy code?
**In Simple Words:**
Swift 6 enables strict compile-time concurrency checking by default:
- Flags all data races, unsafe global variables, and non-Sendable type sharing across tasks as compiler errors.
- **Migration Strategy**:
  1. Enable `-warn-concurrency` in Swift 5.10.
  2. Mark shared reference classes as `actor` or wrap in `@MainActor`.
  3. Ensure closure parameters passed across tasks are annotated with `@Sendable`.
  4. Use `@unchecked Sendable` as a last resort when wrapping thread-safe C/Obj-C code with manual OS locks (`os_unfair_lock`).

### 25. How does SwiftUI Layout and GeometryReader work internally?
**In Simple Words:**
SwiftUI layout operates in 3 distinct phases:
1. **Parent proposes a size** to the child view.
2. **Child chooses its own size** based on its content proposals.
3. **Parent places the child** within its coordinate space.
- **`GeometryReader` Trap**: A `GeometryReader` eagerly expands to fill **all available space proposed by its parent**!
- Using `GeometryReader` indiscriminately destroys intrinsic content sizing and causes layout bugs; use `.visualEffect` or custom `Layout` protocol instead in iOS 17+.

### 26. What is the difference between VIPER, MVVM, and Composable Architecture (TCA)?
**In Simple Words:**
- **MVVM (Model-View-ViewModel)**: Industry standard. Clean separation, views observe ViewModels via Combine/Observation.
- **VIPER (View, Interactor, Presenter, Entity, Router)**: Strict single-responsibility enterprise pattern. Highly testable, but massive boilerplate.
- **TCA (The Composable Architecture)**: Unidirectional data flow inspired by Elm and Redux:
  - Single state tree, Actions, and pure Reducer functions.
  - Guarantees deterministic state transitions, built-in dependency injection, and unparalleled unit testability.

### 27. How does Background Execution work on iOS (BackgroundTasks framework)?
**In Simple Words:**
iOS suspends apps within seconds of entering the background:
- **`BGTaskScheduler`**: Used for scheduling deferrable background maintenance:
  - **`BGAppRefreshTask`**: Short ~30-second window to fetch latest news/feeds.
  - **`BGProcessingTask`**: Long-running background jobs (database cleanup, ML model training); executed only when the device is idle, on Wi-Fi, and connected to power overnight.
- Apps must declare `UIBackgroundModes` in `Info.plist`.

### 28. What are Dynamic Frameworks vs Static Libraries on iOS?
**In Simple Words:**
- **Static Library (`.a`)**: Linked directly into the application executable binary at compile time. Increases binary size, but delivers faster app launch times (zero dynamic loader overhead).
- **Dynamic Framework (`.framework` / `.dylib`)**: Linked dynamically at app launch by `dyld` (Dynamic Linker). Allows sharing code across main app and App Extensions (Widgets), but excessive dynamic frameworks significantly increase **Cold App Launch Time**!

### 29. What is Method Swizzling and why is it dangerous in Swift?
**In Simple Words:**
Method Swizzling uses the Objective-C runtime to swap the implementation of two methods at runtime:
- Often used by analytics SDKs (Firebase, New Relic) to automatically track screen views by swizzling `viewDidAppear`.
- **Dangers**: Breaks compiler type safety, introduces race conditions, causes unpredictable crashes across iOS version updates, and does not work on Swift methods using static dispatch.

### 30. How do you implement App Clip architecture?
**In Simple Words:**
An App Clip is a lightweight, instantaneous mini-slice of your app (< 15 MB) launched via NFC tags, QR codes, or Safari smart banners without downloading the full app from the App Store:
- Must launch in under 3 seconds.
- Built as a dedicated target sharing shared frameworks with the parent app.
- Limited permissions (cannot access background execution, HealthKit, or broad photo libraries).

### 31. How does URLSession connection caching and HTTP/3 support work on iOS?
**In Simple Words:**
- `URLSession` natively supports HTTP/2 multiplexing and HTTP/3 (QUIC over UDP since iOS 15).
- Manages connection pools and TLS session resumption automatically.
- Caching behavior is configured via `URLRequest.CachePolicy` (`useProtocolCachePolicy`, `returnCacheDataElseLoad`) backed by `URLCache` storing cached responses in RAM and disk.

### 32. What is App Store Receipt Validation (Device Check vs App Attest)?
**In Simple Words:**
Prevents piracy and fraud:
- **App Attest (DCAppAttestService)**: Uses the Secure Enclave to generate a hardware-backed cryptographic key pair, asserting to your backend server that API requests are coming from a genuine, un-tampered, non-jailbroken app installed via the App Store.
- Replaces legacy, easily forgeable client-side receipt parsing.

### 33. How does Core Data Faulting and Batch Operations work?
**In Simple Words:**
- **Faulting**: Core Data instantiates `NSManagedObject` instances as lightweight placeholder "faults" without fetching their column data from disk until a property is explicitly accessed, preserving RAM.
- **Batch Operations (`NSBatchUpdateRequest`, `NSBatchDeleteRequest`)**: Executes operations directly on the underlying SQLite database file without loading individual objects into memory, speeding up mass updates by 100x.

### 34. What is the `Layout` protocol in SwiftUI (iOS 16+)?
**In Simple Words:**
Allows creating custom container layouts (e.g. Masonry, FlowLayout, Radial layouts) without falling back to UIKit:
- Requires implementing two methods:
  1. `sizeThatFits(proposal:subviews:cache:)`: Calculates the overall container size for a proposed size.
  2. `placeSubviews(in:proposal:subviews:cache:)`: Sets the exact $(x, y)$ coordinate bounds for each child subview.

### 35. When should you choose Native iOS (Swift + SwiftUI) over Cross-Platform (React Native / Flutter)?
**In Simple Words:**
- **Choose Native iOS**:
  - Apps requiring deep integration with Apple hardware (ARKit, Metal, CoreML, CoreBluetooth, LiDAR).
  - Premium consumer apps where fluid 120Hz ProMotion animations, platform-native gestures, and zero frame jank are core to brand identity.
  - Day-0 adoption of new iOS features (Dynamic Island, Widgets, App Clips, Apple Watch / visionOS companion apps).
- **Choose Cross-Platform**: Content, form-heavy, or internal business apps where time-to-market and identical feature parity across Android and iOS take precedence.
`;
