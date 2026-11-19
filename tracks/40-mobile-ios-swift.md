# Native iOS, Swift 6 & SwiftUI Master Interview Bank (1 - 11)

> Automatic Reference Counting (ARC), strong/weak/unowned references, Swift Concurrency (async/await, Tasks, Actors, @MainActor), SwiftUI state management (@State, @StateObject), GCD, and Secure Enclave.

---

### 1. Swift Memory Management: ARC, Strong, Weak, and Unowned references.
**In Simple Words:**
Swift uses **Automatic Reference Counting (ARC)**:
- **Strong Reference**: Default. Increases reference count by 1. The object remains in memory as long as count $> 0$.
- **Weak Reference**: Does not increment reference count. Must be declared as optional (`weak var delegate: SomeDelegate?`). When the referenced object deallocates, ARC automatically sets the pointer to `nil`. Prevents retain cycles (e.g. parent-child, delegate patterns, closure captures).
- **Unowned Reference**: Does not increment count, but is non-optional. Assumes the target object will never be deallocated while accessed. Accessing a deallocated unowned pointer causes a fatal crash.

### 2. Swift Concurrency: async/await, Tasks, Actors, and @MainActor.
**In Simple Words:**
Modern Swift eliminates completion handler "callback hell":
1. **`async/await`**: Suspends execution cooperatively without blocking the underlying OS thread.
2. **`Task`**: Unit of asynchronous work. Supports structured concurrency (parent-child task cancellation).
3. **`Actor`**: Reference type that provides compile-time data race safety. Ensures only one task at a time can access its mutable state.
4. **`@MainActor`**: Global actor that guarantees code executes on the main UI thread (required when updating SwiftUI views or UIKit components).

### 3. SwiftUI vs. UIKit Architectural Differences.
**In Simple Words:**
- **UIKit**: Imperative, event-driven view hierarchy. You instantiate views (`UIView`, `UIViewController`), add them to subviews, and manually update labels when data changes.
- **SwiftUI**: Declarative, state-driven UI framework. Views are immutable structs describing the UI as a function of state: `View = f(State)`. The framework computes diffs and updates views automatically.
- **Interoperability**: Embed UIKit in SwiftUI via `UIViewRepresentable` / `UIViewControllerRepresentable`; embed SwiftUI in UIKit via `UIHostingController`.

### 4. Explain SwiftUI State Management: @State, @Binding, @StateObject, and @ObservedObject.
**In Simple Words:**
1. **`@State`**: Manages local transient state owned by the view struct itself.
2. **`@Binding`**: Creates a two-way connection to state owned by an ancestor view without owning the data.
3. **`@StateObject`**: Instantiates and owns an `ObservableObject` class instance. SwiftUI ensures it persists across view re-renders and is not destroyed on parent rebuilds.
4. **`@ObservedObject`**: Subscribes to an already instantiated `ObservableObject` passed in from outside; does not manage its lifecycle.
5. **`@EnvironmentObject`**: Injects shared dependencies down the view hierarchy without manual prop-drilling.

### 5. iOS App Lifecycle: AppDelegate vs. SceneDelegate.
**In Simple Words:**
- **AppDelegate**: Handles process-level events (app launch, background fetch, push notification registration, memory warnings).
- **SceneDelegate (iOS 13+)**: Manages multi-window UI scenes (especially on iPadOS / macOS):
  - `sceneDidBecomeActive`: Scene is active and receiving events.
  - `sceneWillResignActive`: User is switching away (incoming phone call, app switcher).
  - `sceneDidEnterBackground`: Release shared resources, save user state, pause animations.

### 6. Grand Central Dispatch (GCD) vs. Swift Modern Concurrency.
**In Simple Words:**
- **GCD**: C-based API using dispatch queues (`DispatchQueue.main.async`, `DispatchQueue.global().async`).
  - *Pitfalls*: Thread explosion when launching many concurrent blocks, priority inversion, and difficult cancellation.
- **Swift Modern Concurrency**: Uses cooperative thread pooling (matches thread count to CPU cores), compiler-verified data race freedom via Actors, and automatic task cancellation propagation.

### 7. Swift Protocol-Oriented Programming (POP) vs. OOP Inheritance.
**In Simple Words:**
Swift favors composition over deep class inheritance:
- Classes suffer from single inheritance, reference semantics, and shared mutable state bugs.
- **POP**: Defines capabilities via Protocols and provides default method implementations using Protocol Extensions. Structs and Enums (value types) can adopt multiple protocols, gaining functionality without reference sharing or subclass bloat.

### 8. Mobile Storage Sandboxing: iOS App Sandbox vs. Android Scoped Storage.
**In Simple Words:**
- **iOS App Sandbox**:
  - `Documents/`: User-generated data backed up to iCloud.
  - `Caches/`: Ephemeral cache files, not backed up, OS may clear when low on disk.
  - `tmp/`: Temporary files cleared between app launches.
- **Android Scoped Storage**:
  - Direct access is restricted to app-private directories (`getExternalFilesDir`). Accessing shared media (Photos, Music) requires `MediaStore` APIs; accessing generic files requires the Storage Access Framework (SAF) system picker.

### 9. Biometric Authentication Security: iOS LocalAuthentication vs. Android BiometricPrompt.
**In Simple Words:**
Biometric data (fingerprints, face meshes) is **never** accessible to third-party app code!
- **iOS**: `LocalAuthentication` queries the **Secure Enclave** (isolated hardware processor). The enclave validates the sensor data and returns a cryptographically signed success boolean or unlocks a Keychain item.
- **Android**: `BiometricPrompt` interfaces with the Trusted Execution Environment (TEE) / StrongBox Keymaster to authenticate users with `BIOMETRIC_STRONG` hardware guarantees.

### 10. Mobile App Cold Start vs. Warm Start vs. Hot Start.
**In Simple Words:**
1. **Cold Start**: App is launched from scratch (not in RAM). The OS creates the process, initiali

### 11. Mobile CI/CD & Store Deployment: Provisioning Profiles, Certificates, and Google Play App Signing.
**In Simple Words:**
- **iOS Signing**:
  - **Certificate**: Confirms developer identity (CSR signed by Apple CA).
  - **App ID**: Unique bundle identifier.
  - **Provisioning Profile**: Binds certificate, App ID, and authori

