# Mobile Engineering (React Native, Flutter, Swift/iOS, Kotlin/Android) Master Interview Question Bank (1 - 50)

> Comprehensive mobile application development interview guide covering React Native New Architecture (TurboModules, Fabric, JSI), Hermes, Flutter Impeller engine, Dart Isolates, Swift ARC, Concurrency & Actors, SwiftUI, Kotlin Coroutines, Flow, Jetpack Compose, and Mobile Security.

---

## Part 1: React Native & Cross-Platform Architecture (1 - 15)

### 1. Explain the React Native New Architecture: TurboModules, Fabric Renderer, Bridgeless Mode, and JSI.
**In Simple Words:**
The legacy React Native architecture relied on an asynchronous, serialized JSON bridge between JavaScript and Native code, causing serialization bottlenecks, asynchronous UI layout sync issues, and frame drops.

The **New Architecture** (enabled by default in RN 0.76+) replaces the bridge with 4 core pillars:
1. **JSI (JavaScript Interface)**: A lightweight C++ abstraction layer allowing JavaScript to hold direct references to C++ host objects and invoke native methods synchronously without JSON serialization overhead.
2. **Fabric Renderer**: The modern rendering system written in C++. It creates the Render Tree directly in C++, computes layouts synchronously using Yoga, and renders UI elements concurrently with React 18 Concurrent Features (Suspense, Transitions).
3. **TurboModules**: Next-gen native modules loaded lazily on-demand rather than eagerly at app startup, drastically improving startup time and memory footprint.
4. **Bridgeless Mode**: Completely removes the legacy bridge runtime, routing all events, modules, and rendering through JSI and Fabric.

### 2. What is the React Native Threading Model and how do threads interact?
**In Simple Words:**
React Native applications run across multiple dedicated threads:
1. **Main UI Thread**: The native platform thread (Android Main / iOS UI thread) responsible for handling user interactions (gestures, touches) and drawing native views on screen.
2. **JavaScript Thread**: Executes the bundled JavaScript code (Hermes engine), business logic, API requests, and React component tree reconciliations.
3. **Shadow / Layout Thread**: Dedicated background thread that uses Meta's Yoga layout engine to compute flexbox layouts into absolute pixel positions before passing them to the UI thread.
4. **Native Modules / Worker Threads**: Background threads spawned for disk I/O, network requests, camera processing, and audio decoding.

In Bridgeless/Fabric architecture, high-priority layout passes can happen synchronously on the UI thread when needed (e.g. text input sizing).

### 3. How do you optimize VirtualizedList / FlatList performance and eliminate memory leaks in React Native?
**In Simple Words:**
Large lists are a common source of frame drops and memory spikes in mobile apps.
**Key Optimization Strategies:**
1. **`getItemLayout`**: Provide fixed item height/offset so FlatList skips dynamic layout measurement passes for off-screen items.
2. **`windowSize`**: Reduce default (21 viewports) to `5` or `7` on memory-constrained mobile devices to render fewer off-screen items.
3. **`maxToRenderPerBatch` & `updateCellsBatchingPeriod`**: Control batch render increments per frame.
4. **`removeClippedSubviews={true}`**: Detaches off-screen native views from the window hierarchy to save GPU memory.
5. **FastImage**: Replace default `<Image>` with `react-native-fast-image` for aggressive native disk/memory caching (Glide on Android, SDWebImage on iOS).
6. **FlashList (Shopify)**: Recycles existing native view components instead of unmounting/remounting, reducing UI thread CPU usage by up to 5x.

### 4. React Navigation: Stack Navigator vs. Native Stack Navigator trade-offs.
**In Simple Words:**
- **JS-Based Stack Navigator (`@react-navigation/stack`)**:
  - Implemented purely in JavaScript using Reanimated and gesture handlers.
  - Highly customizable (custom transition curves, floating headers).
  - *Downside*: Runs JS logic for animations, consumes more JS thread cycles, and lacks 100% native gesture fidelity.
- **Native Stack Navigator (`@react-navigation/native-stack`)**:
  - Built on top of `react-native-screens` using native primitives: `UINavigationController` on iOS and `Fragment` on Android.
  - *Benefits*: 60/120 FPS transitions driven natively by OS; screens off-screen are detached from the view hierarchy, reclaiming native GPU memory; native back gestures and translucent iOS navigation bars work natively.

### 5. Mobile State Management & Storage: Redux/Zustand vs. MMKV vs. AsyncStorage.
**In Simple Words:**
- **AsyncStorage**: The legacy asynchronous key-value storage. Stores data in SQLite (Android) or serialized plist/files (iOS). Calls must cross the bridge asynchronously and serialize/deserialize JSON strings, making it slow for startup configurations and theme state.
- **MMKV (Tencent / react-native-mmkv)**:
  - Memory-mapped file I/O (`mmap`) implemented in C++.
  - Synchronous get/set operations via JSI with **30x–100x faster reads and writes** than AsyncStorage.
  - Data is directly mapped to virtual memory; writes persist even during unexpected OS app kills.
- **State Libraries**: Zustand or Redux Toolkit paired with MMKV storage engine provides instant state rehydration on app launch without visible flickering.

### 6. How do Over-The-Air (OTA) Updates (CodePush, Expo Updates) work, and what are App Store limitations?
**In Simple Words:**
**How It Works:**
A compiled React Native app consists of two parts: the compiled native binary (IPA/APK with C++/Java/Obj-C code) and the JavaScript bundle (plus static assets). OTA update tools host the JS bundle on a CDN. On app launch or background resume:
1. The app queries the OTA server for a hash of the latest JS bundle.
2. If a new version exists, the client downloads the bundle in the background.
3. The app swaps the runtime bundle URL on next restart.

**App Store Compliance (Apple Section 3.3.2):**
OTA updates are permitted **only** if they do not change the fundamental purpose, features, or primary functionality of the app. Adding native dependencies (e.g. Bluetooth, camera plugins) requires a full App Store binary submission.

### 7. Designing an Offline-First Mobile Architecture: WatermelonDB, CRDTs, and Optimistic UI.
**In Simple Words:**
Offline-first design guarantees that users can interact with the app without network latency or connectivity.
**Architectural Components:**
1. **Local Persistent DB**: WatermelonDB (built on SQLite via JSI) uses lazy-loading observable queries; records are loaded into memory only when rendered.
2. **Optimistic UI**: Mutate local state immediately; UI reflects changes in $<16\text{ms}$ with a "pending sync" flag.
3. **Sync Engine**: Queues mutation actions in an append-only transaction log.
4. **Conflict Resolution**:
   - *Last-Write-Wins (LWW)*: Uses server timestamps (simple, but can drop concurrent edits).
   - *CRDTs (Conflict-free Replicated Data Types)*: Mathematically merges concurrent updates without centralized locks.
5. **Reconnection Hook**: Uses NetInfo to monitor connectivity and flush backlogs with exponential backoff.

### 8. React Native Reanimated 3: How Worklets eliminate UI thread bridge hops.
**In Simple Words:**
In standard React Native animations, each frame computes new values on the JS thread, serializes them, and sends them to the native UI thread. If the JS thread is busy fetching data or rendering components, animations drop frames.

**Reanimated 3 Worklets Solution:**
- A **Worklet** is a tiny JavaScript function marked with `"worklet";` compiled by Babel.
- Reanimated spins up a secondary JavaScript runtime directly on the **UI thread**.
- Worklets execute directly inside this UI thread JS context, reading gestures and updating native view styles at 60/120 FPS synchronously without ever touching the main JS thread.

### 9. How does the Hermes JavaScript Engine optimize React Native startup time and memory?
**In Simple Words:**
Traditional engines (JavaScriptCore, V8) download raw JavaScript source code, parse it into an AST, and compile it to bytecode at runtime using a JIT (Just-In-Time) compiler.

**Hermes Innovations:**
1. **AOT (Ahead-Of-Time) Bytecode Compilation**: During the build pipeline, the JS bundle is compiled directly into compact Hermes Bytecode (`.hbc`). The mobile app ships with bytecode; parsing and compilation at runtime are eliminated ($0\text{ms}$ parsing).
2. **Memory-Mapped Bytecode**: Hermes uses `mmap` to read bytecode directly from disk without allocating heap RAM for the entire bundle.
3. **Compact Garbage Collector**: Generational, heap-conscious GC designed specifically for mobile memory constraints.

### 10. Deep Linking vs. iOS Universal Links vs. Android App Links.
**In Simple Words:**
1. **Custom URL Schemes (e.g. `myapp://profile/123`)**:
   - Easy to configure.
   - *Security Risk*: Any malicious app installed on the device can register the exact same scheme and hijack incoming links. Browsers prompt an alert asking for user confirmation.
2. **iOS Universal Links (`https://myapp.com/profile/123`)**:
   - Standard HTTPS URLs.
   - Requires hosting an `apple-app-site-association` (AASA) JSON file at `/.well-known/apple-app-site-association` signed by the Apple Developer Team ID.
   - iOS verifies domain ownership on app install; links open directly in the app with zero browser redirects.
3. **Android App Links (`https://myapp.com/profile/123`)**:
   - Requires hosting an `assetlinks.json` file verifying app package name and SHA-256 cert fingerprint. Opens natively without a disambiguation dialogue.

### 11. How to write High-Performance Custom Native Modules using JSI (C++).
**In Simple Words:**
Instead of inheriting from `NativeModule` and using `@ReactMethod` with Promises over the bridge:
1. Define a C++ class that inherits from `facebook::jsi::HostObject`.
2. Override `get()` and `set()` to expose C++ functions directly to the JSI runtime.
3. Register the host object into `jsiRuntime.global().setProperty(...)`.
4. JavaScript can now call `global.myNativeModule.fastCryptoHash(data)` directly as a regular synchronous C++ function pointer call in $<1\mu\text{s}$.

### 12. Mobile Security: Keystore/Keychain, SSL Pinning, and Jailbreak/Root Detection.
**In Simple Words:**
1. **Secure Storage**: Never store JWTs, private keys, or API tokens in AsyncStorage. Use **iOS Keychain** (hardware-backed Secure Enclave with `kSecAttrAccessibleAfterFirstUnlock`) and **Android Keystore** (AES-256 encrypted SharedPreferences backed by TEE/StrongBox).
2. **SSL / Certificate Pinning**: Hardcode the public key SHA-256 hash (SPKI pinning) of your backend TLS certificate in the mobile network client (TrustKit on iOS, Network Security Config on Android). Prevents Man-in-the-Middle (MitM) attacks via compromised root CAs.
3. **Jailbreak/Root Detection**: Check for test-keys build tags, presence of `/system/app/Superuser.apk`, Cydia paths, Frida injection hooks, or debugger attachment (`ptrace`).

### 13. Push Notification Lifecycle: APNs vs. FCM, Silent Notifications, and Background Handlers.
**In Simple Words:**
1. **APNs (Apple) & FCM (Google)**:
   - Client requests push device token -> sends token to backend -> backend sends payload to APNs/FCM -> OS displays banner.
2. **Silent / Background Push**:
   - iOS: `content-available: 1` with no `alert` title wakes app in background for up to 30 seconds to fetch data. iOS throttles frequency if the device battery is low.
   - Android: High-priority FCM messages wake app via `FirebaseMessagingService.onMessageReceived` even when killed.
3. **Notification Service Extensions**: iOS extension allowing client to decrypt end-to-end encrypted notification content or download rich media before the notification banner renders.

### 14. Privacy Manifests (iOS 17+) and Android Runtime Permissions Model.
**In Simple Words:**
- **iOS 17+ Privacy Manifests (`PrivacyInfo.xcprivacy`)**:
  - Apple mandates that apps and third-party SDKs declare:
    1. Categories of collected data (analytics, crash logs, user identifiers).
    2. Reasons for accessing "Required Reason APIs" (e.g. `FileTimestamp`, `SystemUptime`, `DiskSpace`, `UserDefaults`) to prevent device fingerprinting.
- **Android Runtime Permissions**:
  - Normal permissions (Internet) granted at install.
  - Dangerous permissions (Camera, Location, Microphone, Read Contacts) must be requested at runtime with explanation dialogs. Android 13+ requires explicit `POST_NOTIFICATIONS` permission.

### 15. Mobile Performance Profiling: Flipper, Systrace, Android Profiler, and Xcode Instruments.
**In Simple Words:**
1. **Xcode Instruments**:
   - *Time Profiler*: Samples native call stacks to locate CPU bottlenecks.
   - *Allocations & Leaks*: Identifies retain cycles and unreleased memory objects.
2. **Android Studio Profiler**:
   - Inspects CPU, Memory (Java heap, Native heap, Graphics), Network payload size, and Energy drain.
3. **React Native DevTools**:
   - Hermes Sampling Profiler to identify long-running JavaScript event loop tasks.
   - React DevTools Profiler to detect unnecessary component re-renders.

## Part 2: Flutter Engine & Dart Deep Dive (16 - 30)

### 16. Explain the Flutter Engine Architecture: Embedder, Engine, and Framework.
**In Simple Words:**
Flutter does not wrap native OS controls (like React Native does); it draws every pixel directly to a canvas:
1. **Platform Embedder**: Native platform-specific entry point (Java/Kotlin on Android, Objective-C/Swift on iOS, C++ on desktop). Coordinates with OS for surface rendering, accessibility, and input events.
2. **Flutter Engine (C++)**: Houses the graphics engine (Impeller/Skia), Dart runtime, text layout (LibTxt/HarfBuzz), and platform channels.
3. **Flutter Framework (Dart)**: Developer-facing reactive UI framework:
   - *Rendering Layer*: Handles layout (`RenderObject`) and painting.
   - *Widgets Layer*: Declarative widget compositions.
   - *Material / Cupertino*: Ready-to-use design systems.

### 17. Flutter's Impeller Rendering Engine: How does it eliminate Shader Compilation Jank?
**In Simple Words:**
**The Problem with Skia:**
Skia compiled GLSL shaders just-in-time (JIT) when an animation or graphic effect was first encountered on screen. Compiling shaders on the GPU driver caused dropped frames (100–300ms jank) during initial app animations.

**Impeller's Solution:**
- Impeller precompiles a fixed, complete set of shaders Ahead-Of-Time (AOT) during the Flutter engine build stage into Metal (iOS) or Vulkan (Android) shading languages.
- Eliminates runtime shader compilation entirely, delivering reliable 60/120 FPS animations without first-run stutters.

### 18. Explain the Flutter Stateful Widget Lifecycle in detail.
**In Simple Words:**
1. **`createState()`**: Called when the framework creates a StatefulWidget.
2. **`initState()`**: First method called after the State object is inserted into tree. Used for subscribing to streams, initializing controllers, and starting animations. Called once.
3. **`didChangeDependencies()`**: Called immediately after `initState` and whenever an `InheritedWidget` that this widget depends on changes.
4. **`build()`**: Called frequently to return the widget subtree (must be pure and fast).
5. **`didUpdateWidget(covariant T oldWidget)`**: Called when the parent widget rebuilds and provides a new widget with the same `runtimeType` and `Key`.
6. **`setState()`**: Signals the framework that internal state has changed, scheduling a rebuild.
7. **`deactivate()`**: Called when the State object is temporarily removed from tree.
8. **`dispose()`**: Permanent destruction. Unsubscribe streams, dispose animation and text controllers to prevent memory leaks.

### 19. Explain the Three Trees of Flutter: Widget Tree, Element Tree, and RenderObject Tree.
**In Simple Words:**
1. **Widget Tree**: Lightweight, immutable blueprints of UI configuration. Instantiated and discarded continuously at very low cost.
2. **Element Tree**: The runtime lifecycle coordinator. Elements manage the lifecycle of Widgets and hold references to both the Widget blueprint and its underlying RenderObject. They compare old and new widgets to update instead of recreating.
3. **RenderObject Tree**: Heavyweight mutable objects responsible for layout (measuring dimensions, constraints) and painting (drawing pixels onto the screen canvas via `PaintingContext`). Rebuilt only when layout structure changes.

### 20. Flutter State Management Comparison: Riverpod vs. BLoC vs. Provider.
**In Simple Words:**
- **Provider**: Wrapper around `InheritedWidget`. Simple, but relies on `BuildContext`, meaning providers cannot be accessed outside the UI tree, and type collisions can occur with multiple instances.
- **Riverpod**: Complete rewrite of Provider without `BuildContext`. Compile-safe, global declarations, supports auto-dispose, family modifiers, and easy unit testing without mocking the widget tree.
- **BLoC (Business Logic Component)**:
  - Enforces strict unidirectional data flow: UI emits **Events** -> BLoC processes business logic -> BLoC emits **States** via Dart Streams.
  - Excellent for large enterprise applications with strict audit and event replay requirements.

### 21. Dart Concurrency Model: Event Loop, Microtask Queue, and Isolates.
**In Simple Words:**
Dart is single-threaded by default, driven by an **Event Loop** with two queues:
1. **Microtask Queue**: Higher priority. Used for internal actions that must execute immediately before the next event (e.g. `scheduleMicrotask`).
2. **Event Queue**: Handles I/O, timers, user taps, and drawing events.

**Isolates for Heavy Computing:**
Unlike OS threads, Dart **Isolates** do not share memory heap! Each Isolate has its own independent memory and event loop. They communicate exclusively by passing serialized messages through `SendPort` and `ReceivePort`. Heavy tasks (JSON parsing, image resizing, cryptography) are offloaded using `Isolate.run()` or Flutter's `compute()` helper to prevent UI jank.

### 22. Flutter Platform Channels vs. Dart FFI (Foreign Function Interface).
**In Simple Words:**
- **Platform Channels (`MethodChannel` / `EventChannel`)**:
  - Asynchronous message passing between Dart and host platform (Java/Kotlin/Swift) using standard binary message codecs.
  - Good for high-level OS features (battery level, camera launch).
  - *Downside*: Serialization overhead across the channel.
- **Dart FFI (Foreign Function Interface)**:
  - Allows Dart to directly invoke native C / C++ / Rust libraries synchronously in the same memory space without message serialization.
  - Perfect for high-speed physics engines, SQLite drivers, video processing, and machine learning models.

### 23. When and why should you use Keys in Flutter (ValueKey, ObjectKey, GlobalKey)?
**In Simple Words:**
Flutter matches elements to widgets using `runtimeType` and `key`. If widgets of the same type reorder or remove, Flutter can swap state unexpectedly unless keys are supplied:
1. **ValueKey**: Key based on a primitive value (e.g. database ID `ValueKey(todo.id)`) to preserve widget state during list item reordering or deletion.
2. **ObjectKey**: Key based on object instance identity.
3. **UniqueKey**: Generates an ephemeral unique key; forces recreation of the element every build.
4. **GlobalKey**: Unique across the entire app. Allows accessing an element's State from anywhere (`formKey.currentState!.validate()`) or moving a widget to a different parent without losing its state.

### 24. How does BuildContext work, and what are the dangers of using context across async gaps in Flutter?
**In Simple Words:**
**What is BuildContext?**
`BuildContext` is literally the `Element` associated with the widget. It defines the widget's location in the widget tree hierarchy, enabling lookups like `Theme.of(context)` and `Navigator.of(context)`.

**Danger across Async Gaps:**
If a user triggers an async call (`await fetchUserData()`) and navigates away while the network request is pending, the widget unmounts. Calling `Navigator.of(context).pop()` after `await` throws an exception because the element is no longer in the active tree.
*Fix*: Check `if (!context.mounted) return;` before using `context` after any `await`.

### 25. Flutter CustomPainter: Performance Best Practices & RepaintBoundaries.
**In Simple Words:**
When using `CustomPainter` to draw lines, paths, or charts:
1. **`shouldRepaint`**: Return `false` if painting input parameters have not changed.
2. **`RepaintBoundary`**: Wrap your custom paint widget or animated child in a `RepaintBoundary`. This creates an isolated display list / render layer; repaints inside the boundary will not trigger repaints in the parent or ancestor widget tree.

### 26. Flutter Web: Skwasm vs. CanvasKit vs. HTML Renderer.
**In Simple Words:**
1. **HTML Renderer**: Employs standard HTML, CSS, and SVG elements. Small bundle size (~2MB), quick load, but inconsistent cross-browser rendering fidelity.
2. **CanvasKit**: Compiles Skia to WebAssembly (Wasm) and renders directly to WebGL. 100% pixel-perfect desktop/mobile consistency, but adds ~2MB Wasm download penalty.
3. **Wasm & Skwasm (Flutter 3.22+)**: Full Dart-to-Wasm compilation utilizing browser GC and the multithreaded Skwasm renderer, boosting performance by up to 3x.

### 27. Dart Memory Management & Generational Garbage Collection.
**In Simple Words:**
Dart uses a generational garbage collector with two spaces:
1. **Young Generation (Scavenger / Semi-Space)**:
   - Allocates short-lived objects (like ephemeral widgets created during each build).
   - Fast copying GC: surviving objects are moved to the survivor space; memory allocation is just a pointer bump.
2. **Old Generation (Mark-Sweep / Mark-Compact)**:
   - Objects that survive multiple young-gen cycles are promoted to old space.
   - Collected using an incremental, concurrent mark-sweep pass that avoids stopping the UI thread.

### 28. Flutter App Bundle Size Optimization Techniques.
**In Simple Words:**
1. **Code Shaking**: `flutter build apk --split-per-abi` produces dedicated APKs for `armeabi-v7a`, `arm64-v8a`, and `x86_64` instead of a fat universal APK.
2. **Deferred Components (Android)**: Download secondary features and heavy assets on-demand using Play Feature Delivery.
3. **Asset Optimization**: Use WebP or SVG (`flutter_svg`) instead of PNGs. Remove unused font glyphs using `--tree-shake-icons`.
4. **Analyze Bundle**: Run `flutter build appbundle --analyze-size` to audit transitive package bloat.

### 29. Automated Testing in Flutter: Unit, Widget, and Integration Tests.
**In Simple Words:**
1. **Unit Tests (`test`)**: Tests individual functions, Dart classes, and business logic isolates with zero UI dependencies.
2. **Widget Tests (`testWidgets`)**: Renders widgets in a headless test environment using `WidgetTester`.
   - `tester.pumpWidget(widget)`: Inflates widget.
   - `tester.pumpAndSettle()`: Waits for all scheduled animations and timers to finish.
3. **Integration Tests (`integration_test` / Patrol)**: Runs real end-to-end user flows on a physical device or emulator, interacting with native dialogues, permissions, and external services.

### 30. Automating Mobile Deployment with Fastlane.
**In Simple Words:**
Fastlane automates code signing, building, and publishing mobile apps via a `Fastfile`:
- **Match / Fastlane Match**: Manages iOS certificates and provisioning profiles stored in a private encrypted Git repo, preventing "code signing hell" across developer teams.
- **Gym**: Compiles and packages iOS `.ipa`.
- **Pilot**: Uploads builds to Apple TestFlight.
- **Supply**: Deploys Android APK/AAB and metadata to Google Play Console testing tracks or production.

## Part 3: Native iOS (Swift) & Android (Kotlin) Core Engineering (31 - 50)

### 31. Swift Memory Management: ARC, Strong, Weak, and Unowned references.
**In Simple Words:**
Swift uses **Automatic Reference Counting (ARC)**:
- **Strong Reference**: Default. Increases reference count by 1. The object remains in memory as long as count $> 0$.
- **Weak Reference**: Does not increment reference count. Must be declared as optional (`weak var delegate: SomeDelegate?`). When the referenced object deallocates, ARC automatically sets the pointer to `nil`. Prevents retain cycles (e.g. parent-child, delegate patterns, closure captures).
- **Unowned Reference**: Does not increment count, but is non-optional. Assumes the target object will never be deallocated while accessed. Accessing a deallocated unowned pointer causes a fatal crash.

### 32. Swift Concurrency: async/await, Tasks, Actors, and @MainActor.
**In Simple Words:**
Modern Swift eliminates completion handler "callback hell":
1. **`async/await`**: Suspends execution cooperatively without blocking the underlying OS thread.
2. **`Task`**: Unit of asynchronous work. Supports structured concurrency (parent-child task cancellation).
3. **`Actor`**: Reference type that provides compile-time data race safety. Ensures only one task at a time can access its mutable state.
4. **`@MainActor`**: Global actor that guarantees code executes on the main UI thread (required when updating SwiftUI views or UIKit components).

### 33. SwiftUI vs. UIKit Architectural Differences.
**In Simple Words:**
- **UIKit**: Imperative, event-driven view hierarchy. You instantiate views (`UIView`, `UIViewController`), add them to subviews, and manually update labels when data changes.
- **SwiftUI**: Declarative, state-driven UI framework. Views are immutable structs describing the UI as a function of state: `View = f(State)`. The framework computes diffs and updates views automatically.
- **Interoperability**: Embed UIKit in SwiftUI via `UIViewRepresentable` / `UIViewControllerRepresentable`; embed SwiftUI in UIKit via `UIHostingController`.

### 34. Explain SwiftUI State Management: @State, @Binding, @StateObject, and @ObservedObject.
**In Simple Words:**
1. **`@State`**: Manages local transient state owned by the view struct itself.
2. **`@Binding`**: Creates a two-way connection to state owned by an ancestor view without owning the data.
3. **`@StateObject`**: Instantiates and owns an `ObservableObject` class instance. SwiftUI ensures it persists across view re-renders and is not destroyed on parent rebuilds.
4. **`@ObservedObject`**: Subscribes to an already instantiated `ObservableObject` passed in from outside; does not manage its lifecycle.
5. **`@EnvironmentObject`**: Injects shared dependencies down the view hierarchy without manual prop-drilling.

### 35. iOS App Lifecycle: AppDelegate vs. SceneDelegate.
**In Simple Words:**
- **AppDelegate**: Handles process-level events (app launch, background fetch, push notification registration, memory warnings).
- **SceneDelegate (iOS 13+)**: Manages multi-window UI scenes (especially on iPadOS / macOS):
  - `sceneDidBecomeActive`: Scene is active and receiving events.
  - `sceneWillResignActive`: User is switching away (incoming phone call, app switcher).
  - `sceneDidEnterBackground`: Release shared resources, save user state, pause animations.

### 36. Grand Central Dispatch (GCD) vs. Swift Modern Concurrency.
**In Simple Words:**
- **GCD**: C-based API using dispatch queues (`DispatchQueue.main.async`, `DispatchQueue.global().async`).
  - *Pitfalls*: Thread explosion when launching many concurrent blocks, priority inversion, and difficult cancellation.
- **Swift Modern Concurrency**: Uses cooperative thread pooling (matches thread count to CPU cores), compiler-verified data race freedom via Actors, and automatic task cancellation propagation.

### 37. Swift Protocol-Oriented Programming (POP) vs. OOP Inheritance.
**In Simple Words:**
Swift favors composition over deep class inheritance:
- Classes suffer from single inheritance, reference semantics, and shared mutable state bugs.
- **POP**: Defines capabilities via Protocols and provides default method implementations using Protocol Extensions. Structs and Enums (value types) can adopt multiple protocols, gaining functionality without reference sharing or subclass bloat.

### 38. Kotlin Coroutines: Suspend functions, CoroutineScope, and Dispatchers.
**In Simple Words:**
Coroutines are lightweight cooperative threads:
1. **`suspend` function**: A function that can pause execution without blocking the host thread and resume later.
2. **`CoroutineScope`**: Bounds coroutine lifecycles (e.g. `viewModelScope` cancels all child coroutines when ViewModel is destroyed).
3. **Dispatchers**:
   - `Dispatchers.Main`: Android main UI thread.
   - `Dispatchers.IO`: Optimized for disk, database, and network I/O (elastic thread pool).
   - `Dispatchers.Default`: Optimized for CPU-intensive computing (pool size equals CPU cores).

### 39. Kotlin Flow: StateFlow vs. SharedFlow vs. LiveData.
**In Simple Words:**
- **LiveData**: Android-specific lifecycle-aware data holder. Always executes on the main thread; lacks rich operators.
- **StateFlow**: A hot Flow that emits the current state and subsequent state updates to collectors. Always holds a value (`replay = 1`), deduplicates consecutive identical values (`conflate`). Ideal for UI state in ViewModels.
- **SharedFlow**: A hot Flow that emits events to multiple subscribers (one-off snackbar events, navigation triggers) without keeping a permanent state snapshot.

### 40. Jetpack Compose: Recomposition, Remember, and DerivedStateOf.
**In Simple Words:**
Jetpack Compose is Android's modern declarative UI toolkit:
1. **Recomposition**: When state changes, Compose re-executes composable functions with new data. Compose skips recomposition for functions whose inputs haven't changed.
2. **`remember { ... }`**: Caches a value across recompositions so expensive calculations aren't repeated every frame.
3. **`rememberSaveable`**: Caches data across Android configuration changes (screen rotations) and process death.
4. **`derivedStateOf`**: Batches frequently changing state (e.g. scroll position) so recomposition only fires when a derived condition changes (e.g. `showScrollToTopButton`).

### 41. Android Activity Lifecycle & Configuration Changes.
**In Simple Words:**
Lifecycle callbacks: `onCreate` -> `onStart` -> `onResume` -> `onPause` -> `onStop` -> `onDestroy`.
**Configuration Changes (Screen Rotation, Dark Mode toggle):**
The Android OS destroys and recreates the entire Activity by default!
- State stored in ViewModels survives because the ViewModelStore outlives the Activity.
- Ephemeral UI state (e.g. unsaved text input) is saved via `onSaveInstanceState(Bundle)` and restored in `onCreate`.

### 42. Detecting and Preventing Memory Leaks in Android (LeakCanary).
**In Simple Words:**
**Common Causes of Leaks:**
1. Holding a static reference to an `Activity` or `Context`.
2. Registering listeners / broadcast receivers and forgetting to unregister them in `onDestroy`.
3. Non-static inner classes holding an implicit reference to the enclosing Activity.
**Detection**:
**LeakCanary** monitors retained object references in `onDestroy()`. If an Activity is not garbage collected within 5 seconds, LeakCanary dumps the heap, analyzes the shortest strong reference path, and alerts developers.

### 43. Android IPC Mechanisms: Binder, AIDL, and Messengers.
**In Simple Words:**
Processes on Linux/Android are isolated. Inter-Process Communication (IPC) is powered by:
- **Binder Driver**: A custom Linux kernel driver that passes objects between processes using shared memory copies for maximum speed.
- **AIDL (Android Interface Definition Language)**: Defines programming interfaces that client and service agree upon to speak IPC. Compiles into Java/Kotlin Binder stubs.
- **Messenger**: Lightweight IPC wrapper around Handlers that processes messages sequentially on a single thread.

### 44. Dependency Injection in Android: Hilt / Dagger 2 vs. Koin.
**In Simple Words:**
- **Dagger 2 / Hilt**:
  - Compile-time dependency injection.
  - Generates plain Java code at build time. Zero reflection overhead at runtime; dependency graph errors are caught at compile time.
  - Hilt integrates with Android lifecycles (`@HiltViewModel`, `@AndroidEntryPoint`).
- **Koin**:
  - Pragmatic runtime Service Locator DSL written in pure Kotlin.
  - Faster build times (no annotation processing), but misses graph errors until runtime.

### 45. Android Background Work: WorkManager vs. Foreground Services vs. JobScheduler.
**In Simple Words:**
- **WorkManager**: Recommended for deferrable, guaranteed background work (syncing logs, uploading photos). Respects Doze mode and OS battery constraints; persists jobs across app kills and device reboots.
- **Foreground Service**: Used for urgent, user-perceptible operations (audio playback, turn-by-turn navigation, active recording). Requires displaying a non-dismissible ongoing notification to the user.
- **AlarmManager**: Exact wall-clock triggers (e.g. alarm clock app at 7:00 AM).

### 46. Android Code Shrinking and Obfuscation: ProGuard vs. R8.
**In Simple Words:**
R8 replaces ProGuard in the Android Gradle build pipeline:
1. **Shrinking (Tree Shaking)**: Analyzes entry points (`AndroidManifest.xml`, activities) and strips out unreachable classes, methods, and attributes.
2. **Optimization**: Inlines short methods, removes unused arguments, and rewrites bytecode for faster execution.
3. **Obfuscation**: Renames classes and members to obscure short names (`a.b.c`), reducing DEX size and thwarting reverse engineering. Keep rules (`-keep`) protect reflection and serialization models.

### 47. Mobile Storage Sandboxing: iOS App Sandbox vs. Android Scoped Storage.
**In Simple Words:**
- **iOS App Sandbox**:
  - `Documents/`: User-generated data backed up to iCloud.
  - `Caches/`: Ephemeral cache files, not backed up, OS may clear when low on disk.
  - `tmp/`: Temporary files cleared between app launches.
- **Android Scoped Storage**:
  - Direct access is restricted to app-private directories (`getExternalFilesDir`). Accessing shared media (Photos, Music) requires `MediaStore` APIs; accessing generic files requires the Storage Access Framework (SAF) system picker.

### 48. Biometric Authentication Security: iOS LocalAuthentication vs. Android BiometricPrompt.
**In Simple Words:**
Biometric data (fingerprints, face meshes) is **never** accessible to third-party app code!
- **iOS**: `LocalAuthentication` queries the **Secure Enclave** (isolated hardware processor). The enclave validates the sensor data and returns a cryptographically signed success boolean or unlocks a Keychain item.
- **Android**: `BiometricPrompt` interfaces with the Trusted Execution Environment (TEE) / StrongBox Keymaster to authenticate users with `BIOMETRIC_STRONG` hardware guarantees.

### 49. Mobile App Cold Start vs. Warm Start vs. Hot Start.
**In Simple Words:**
1. **Cold Start**: App is launched from scratch (not in RAM). The OS creates the process, initializes Application/Activity, inflates theme, loads native libs, compiles bytecode, and renders first frame. Target: $<1.5\text{s}$.
2. **Warm Start**: App process is still in memory, but Activity must be recreated from scratch (e.g. after system memory pressure).
3. **Hot Start**: App is running in RAM and brought from background to foreground. Just renders views; fastest start ($<200\text{ms}$).

### 50. Mobile CI/CD & Store Deployment: Provisioning Profiles, Certificates, and Google Play App Signing.
**In Simple Words:**
- **iOS Signing**:
  - **Certificate**: Confirms developer identity (CSR signed by Apple CA).
  - **App ID**: Unique bundle identifier.
  - **Provisioning Profile**: Binds certificate, App ID, and authorized test device UDIDs together.
- **Google Play App Signing**:
  - Developers upload using an **Upload Key**.
  - Google Play strips the upload key, inspects/optimizes the Android App Bundle (AAB), and signs the final APKs distributed to user devices with the secret **App Signing Key** protected in Google Cloud KMS.

