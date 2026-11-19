# Android & Kotlin Modern Mobile Architecture Master Interview Bank (1 - 35)

> Android Jetpack Compose, Activity & Fragment lifecycles, State hoisting, LaunchedEffect vs rememberCoroutineScope, ViewModel & SavedStateHandle, Kotlin Coroutines on Android (Dispatchers, Flow vs StateFlow), Hilt dependency injection, Room database, WorkManager, Scoped Storage, and memory leak profiling (LeakCanary).

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is the Activity Lifecycle in Android and what are its core callback states?
**In Simple Words:**
An Activity represents a single focused screen that the user can interact with. Its lifecycle transitions through 6 core callbacks:
1. **`onCreate()`**: Activity is initialized; setup UI views, data bindings, and ViewModel observers.
2. **`onStart()`**: Activity becomes visible to the user, but not yet interactive.
3. **`onResume()`**: Activity enters the foreground; interactive and receiving user input.
4. **`onPause()`**: Activity partially obscured (e.g. permission dialog, multi-window mode) or about to enter background; pause animations or video playback.
5. **`onStop()`**: Activity is no longer visible to the user.
6. **`onDestroy()`**: Final cleanup before the activity is destroyed by the system or `finish()` is called.

```text
Activity Lifecycle State Flow:
[onCreate] ──► [onStart] ──► [onResume] (Interactive in Foreground)
                                 │
                            [onPause] (Partially Obscured)
                                 │
                            [onStop]  (Hidden in Background)
                                 │
                           [onDestroy] (Deallocated from RAM)
```

### 2. What is Jetpack Compose and how does it differ from traditional XML-based Views?
**In Simple Words:**
Jetpack Compose is Android's modern declarative UI toolkit:
- **Imperative XML Views (Legacy)**: UI declared in XML layout files; mutated imperatively in Kotlin/Java code by traversing the view hierarchy (`findViewById()`, `setText()`, `setVisibility()`). Prone to state synchronization bugs.
- **Declarative Compose (Modern)**: UI is defined as Kotlin `@Composable` functions that describe what the UI should look like for a given state. When state changes, Compose automatically **recomposes** only the affected composable functions!

```kotlin
// Jetpack Compose Example:
@Composable
fun CounterButton() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Clicked $count times")
    }
}
```

### 3. What is an Intent in Android (Explicit vs Implicit)?
**In Simple Words:**
An Intent is an asynchronous messaging object used to request an action from another app component:
- **Explicit Intent**: Specifies the exact target component class name (e.g. launching an internal `ProfileActivity` from `MainActivity`).
- **Implicit Intent**: Specifies an abstract action (e.g. `ACTION_VIEW`, `ACTION_SEND`, `ACTION_DIAL`). Android matches the intent against all installed apps registered in their `AndroidManifest.xml` via **Intent Filters** (e.g. opening a web link in Chrome).

### 4. What is a ViewModel in Android Architecture Components and why does it survive configuration changes?
**In Simple Words:**
A `ViewModel` stores and manages UI-related data in a lifecycle-conscious way:
- **Configuration Change Problem**: Rotating the phone or switching to dark mode destroys and recreates the `Activity`. Regular variables in the activity are lost!
- **ViewModel Lifecycle**: The `ViewModel` remains retained in memory in the `ViewModelStore` throughout the configuration change until the Activity is permanently finished (`onDestroy()`), preventing redundant network requests and UI re-fetching.

### 5. What is the difference between `remember` and `rememberSaveable` in Compose?
**In Simple Words:**
- **`remember { mutableStateOf(...) }`**: Preserves state across **recompositions** (when the composable function re-runs). However, the state is **lost if the Activity is recreated** (screen rotation or system configuration change).
- **`rememberSaveable { mutableStateOf(...) }`**: Preserves state across both recompositions **AND configuration changes / process death** by saving values into the Android `SavedStateHandle` / `Bundle`.

### 6. What is State Hoisting in Jetpack Compose?
**In Simple Words:**
State hoisting is a programming pattern of moving state up to a caller component to make a composable **stateless**:
- Replaces internal state with two parameters:
  1. `value: T`: The current value to display.
  2. `onValueChange: (T) -> Unit`: An event callback lambda requesting the value to change.
- **Benefits**: Makes composables reusable, decoupled, and easy to unit test.

```kotlin
// Stateless hoisted composable:
@Composable
fun NameInput(name: String, onNameChange: (String) -> Unit) {
    TextField(value = name, onValueChange = onValueChange, label = { Text("Name") })
}
```

### 7. What is the Android Manifest (`AndroidManifest.xml`)?
**In Simple Words:**
The root configuration file of every Android application:
- Declares the application package name, app icon, theme, and version.
- Declares all 4 core Android components: Activities, Services, Broadcast Receivers, and Content Providers.
- Declares hardware requirements and system permissions (`android.permission.INTERNET`, `android.permission.CAMERA`).

### 8. What are Android App Permissions (Install-time vs Runtime Permissions)?
**In Simple Words:**
- **Install-time Permissions (Normal)**: Automatically granted upon downloading from Google Play Store (e.g. `INTERNET`, `ACCESS_NETWORK_STATE`).
- **Runtime Permissions (Dangerous)**: Involve user privacy or device control (e.g. `CAMERA`, `ACCESS_FINE_LOCATION`, `RECORD_AUDIO`). Apps must explicitly prompt the user at runtime in context, handling both grant and denial states.

### 9. What is Room Database in Android Jetpack?
**In Simple Words:**
Room is an abstraction layer over SQLite that provides robust database access:
- **`@Entity`**: Represents a table in the database.
- **`@Dao` (Data Access Object)**: Defines SQL query methods with compile-time SQL verification.
- **`@Database`**: The database holder class that serves as the main access point.
- Natively supports reactive streaming of query results using Kotlin `Flow`.

### 10. What is the difference between `val` and `var` in Kotlin?
**In Simple Words:**
- **`val` (Value)**: Read-only reference (immutable pointer). Once initialized, it cannot be reassigned (similar to `final` in Java or `const` in TypeScript).
- **`var` (Variable)**: Mutable reference. Can be reassigned to different values of the same type.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. How does Kotlin Coroutines integrate with Android Lifecycles (Dispatchers & Scopes)?
**In Simple Words:**
Coroutines provide lightweight, non-blocking asynchronous programming on Android:
- **Dispatchers**:
  - **`Dispatchers.Main`**: Executes on the Android UI thread. For UI updates and small operations.
  - **`Dispatchers.IO`**: Optimized for disk and network I/O operations (Room queries, Retrofit HTTP calls).
  - **`Dispatchers.Default`**: Optimized for CPU-intensive background computation (parsing large JSON arrays, image filtering).
- **Lifecycle Scopes**:
  - **`viewModelScope`**: Tied to the ViewModel lifecycle; automatically cancels all running coroutines when the ViewModel is cleared, preventing memory leaks!
  - **`lifecycleScope`**: Tied to an Activity or Fragment lifecycle.

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {
    fun fetchUserProfile(userId: String) {
        viewModelScope.launch {
            // Automatically switches to Dispatchers.IO under the hood:
            val user = repository.getUser(userId)
            // Resumes on Dispatchers.Main to update UI state:
            _uiState.value = UserUiState.Success(user)
        }
    }
}
```

### 12. What is the difference between `LiveData`, `StateFlow`, and `SharedFlow`?
**In Simple Words:**
- **`LiveData` (Legacy Jetpack)**: Lifecycle-aware observable data holder. Conflates data to latest value, but tightly coupled to Android platform APIs and always runs on the Main thread.
- **`StateFlow` (Modern Standard)**: Kotlin-native hot state holder Flow. Always holds a current value (`stateFlow.value`), conflates emissions, and provides state emissions across all application layers.
- **`SharedFlow`**: Hot event bus Flow without an initial value. Emits one-time events to multiple subscribers (e.g. navigation events, Snackbar toast messages).

### 13. What are Side-Effects in Jetpack Compose: `LaunchedEffect` vs `rememberCoroutineScope` vs `DisposableEffect`?
**In Simple Words:**
A Composable function should be pure and free of side-effects. Side-Effect handlers safely execute asynchronous tasks:
1. **`LaunchedEffect(key)`**: Launches a coroutine when the composable enters the composition. If `key` changes, the ongoing coroutine is cancelled and relaunched.
2. **`rememberCoroutineScope()`**: Creates a coroutine scope bounded to the composable's lifecycle, used to launch coroutines in response to **user event callbacks** (e.g. button clicks).
3. **`DisposableEffect(key)`**: Used for side-effects that require cleanup (e.g. registering/unregistering system broadcast receivers or location listeners). Invokes `onDispose { ... }` when leaving the composition.

```kotlin
@Composable
fun UserScreen(userId: String, viewModel: UserViewModel) {
    // Runs when userId changes:
    LaunchedEffect(userId) {
        viewModel.loadUser(userId)
    }

    val coroutineScope = rememberCoroutineScope()
    Button(onClick = {
        coroutineScope.launch { viewModel.refresh() }
    }) { Text("Refresh") }
}
```

### 14. What is Dependency Injection with Hilt and what are the standard Component Scopes?
**In Simple Words:**
Hilt is Google's recommended dependency injection library for Android, built on top of Dagger:
- Eliminates manual boilerplate by generating Dagger components for Android lifecycles:
  - **`@Singleton` (`SingletonComponent`)**: Lives for the entire application lifetime.
  - **`@ActivityRetainedScoped` (`ActivityRetainedComponent`)**: Survives configuration changes (shared across ViewModels).
  - **`@ViewModelScoped` (`ViewModelComponent`)**: Injected into ViewModels; cleared with the ViewModel.
  - **`@ActivityScoped` (`ActivityComponent`)**: Lives for the lifecycle of a single Activity.

```kotlin
@HiltViewModel
class OrderViewModel @Inject constructor(
    private val orderRepository: OrderRepository
) : ViewModel() { ... }
```

### 15. How does Retrofit manage networking and JSON serialization on Android?
**In Simple Words:**
Retrofit is a type-safe HTTP client for Android and Kotlin:
- Translates an interface with HTTP annotations (`@GET`, `@POST`, `@Path`, `@Query`, `@Body`) into a live REST client.
- Uses **OkHttp** as the underlying HTTP engine (connection pooling, TLS 1.3, interceptors).
- Uses converters (e.g. `Converter.Factory` with Kotlinx Serialization or Moshi) to serialize/deserialize JSON payloads directly into Kotlin `data class` objects.

### 16. What are OkHttp Interceptors (Application vs Network Interceptors)?
**In Simple Words:**
Interceptors inspect, modify, or retry outbound HTTP requests and inbound responses:
- **Application Interceptor**: Sits between application code and OkHttp. Always invoked once per request; ideal for appending global `Authorization: Bearer <token>` headers or logging.
- **Network Interceptor**: Sits between OkHttp and the physical network socket. Observes actual network redirects, caching behavior, and raw wire data.

### 17. What is WorkManager and when should it be used over Coroutines?
**In Simple Words:**
WorkManager is the recommended solution for **persistent, deferrable background work**:
- **Coroutines**: Bound to app process memory. If the user swipes the app away or Android OS kills the process in low-RAM conditions, coroutines are killed immediately!
- **WorkManager**: Persists task jobs to an internal SQLite database. Guarantees execution **even if the app is killed or the phone is rebooted**!
- Allows setting execution constraints: `setRequiredNetworkType(NetworkType.UNMETERED)` (only on Wi-Fi), `setRequiresCharging(true)`.

### 18. What are Android Services (Foreground, Background, Bound)?
**In Simple Words:**
A Service is an application component that performs long-running operations in the background without a UI:
- **Foreground Service**: Performs operations noticeable to the user (e.g. music playback, GPS navigation, active file download). **Must display a non-dismissible notification** in the system tray.
- **Background Service**: Restricted heavily in modern Android (Android 8+ kills background services after minutes to preserve battery; use WorkManager instead).
- **Bound Service**: Acts as a client-server interface, allowing Activities to bind via IPC and interact with the service.

### 19. What is Scoped Storage in Android?
**In Simple Words:**
Introduced in Android 10+ to protect user privacy and eliminate wide access to external storage:
- Apps have an **isolated, app-specific internal directory** (`context.filesDir`) that other apps cannot view.
- Apps cannot access arbitrary file paths on external storage (`/sdcard/`).
- To access shared media (Photos, Videos, Audio), apps must use the **MediaStore API** or the system **Storage Access Framework (SAF)** file picker without requiring broad storage permissions.

### 20. What is ProGuard / R8 and how does it optimize Android APK/AAB size?
**In Simple Words:**
R8 is the default compiler and code shrinker for Android builds:
1. **Shrinking**: Tree-shakes and strips unused classes, fields, and library methods.
2. **Optimization**: Inlines functions, removes dead branches, and optimizes bytecode.
3. **Obfuscation**: Renames classes and methods to short unreadable names (`a.b.c()`), reducing DEX file size and preventing reverse engineering.
- Requires maintaining **Proguard Rules** (`-keep class ...`) for classes accessed via reflection (e.g. JSON data models).

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. How does Recomposition work internally in Jetpack Compose?
**In Simple Words:**
Recomposition is the process of re-running composable functions when state inputs change:
- **Slot Table**: Compose stores composable hierarchy and remembered state in an internal continuous in-memory array called a **Slot Table**.
- **Positional Memoization**: Compose identifies UI elements by their call-site execution position in the Slot Table.
- **Smart Recomposition (Skipping)**: If a composable function is marked `@Stable` and its input parameters have not changed (`equals() == true`), Compose **skips execution entirely**, saving massive CPU time!

```text
Compose Internal Pipeline:
State Change ──► Snapshot System Notified
                      │
           (Smart Skipping Check)
                      │
            Recompose Only Changed Functions
                      │
           Update In-Memory Slot Table
                      │
           Apply Changes to Android Layout / Drawing
```

### 22. What makes a Composable function "Skippable" and what are `@Stable` and `@Immutable`?
**In Simple Words:**
Compose skips recomposition only if all parameter types are **Stable**:
- Primitive types (`Int`, `String`), functional lambdas, and classes marked with `@Immutable` are considered stable.
- **The Stability Trap**: Standard Kotlin `List<T>` is an interface; Compose treats it as **unstable** because a subclass could be mutable (`ArrayList`), causing the composable to **recompose on every parent update**!
- **Fix**: Use Kotlinx Immutable Collections (`ImmutableList<T>`), or annotate the data class with `@Immutable`.

### 23. What are Memory Leaks on Android and how do you detect them using LeakCanary?
**In Simple Words:**
A memory leak occurs when an object that is no longer needed (e.g. an Activity destroyed on screen rotation) is retained in memory because an active object holds a strong reference to it:
- **Common Causes**: Static variables referencing Context, non-static inner classes, long-running coroutines holding Activity references, uncancelled broadcast listeners.
- **LeakCanary**: A memory leak detection library:
  - Hooks into `ActivityLifecycleCallbacks`.
  - On `onDestroy()`, wraps the instance in a `WeakReference`.
  - If the garbage collector has not reclaimed the weak reference after 5 seconds, LeakCanary triggers a heap dump (`.hprof`), analyzes the shortest path from GC Roots, and displays a graphical notification with the exact leaking reference chain!

### 24. What is the difference between APK and Android App Bundle (AAB)?
**In Simple Words:**
- **APK (Legacy)**: Fat binary containing all compiled DEX code, resources for all screen densities (hdpi, xhdpi, xxxhdpi), languages, and CPU architectures (armeabi-v7a, arm64-v8a, x86). Large download size.
- **AAB (App Bundle - Required since 2021)**: Uploaded to Google Play Console. Google Play dynamically generates and serves a **tailored, split APK** containing only the specific CPU architecture, screen density, and language of the user's device, cutting download size by 35-50%!

### 25. How do you implement Offline-First Architecture on Android?
**In Simple Words:**
The UI observes local persistent storage as the **Single Source of Truth (SSOT)**:
1. UI collects from a Room Database `Flow<List<Item>>`.
2. A Repository triggers an asynchronous network request in the background.
3. Network response is written directly into the local Room database (`INSERT OR REPLACE`).
4. Room automatically emits the updated data to the Flow, updating the UI smoothly without network loading spinners!
5. Outbound mutations are queued in an offline SyncQueue in Room, processed when connectivity is restored via WorkManager.

```text
Offline-First Architecture:
[UI (Compose)] ◄─── Observes Flow ───► [Room Database (Local SSOT)]
                                                ▲
                                                │ (Writes updates)
[Remote API (Retrofit)] ◄── Network Sync ───────┘
```

### 26. What is the ART (Android Runtime) and how does AOT and JIT Compilation work?
**In Simple Words:**
ART executes Dalvik bytecode (`.dex` files) on modern Android devices:
- **Dalvik (Ancient)**: Pure JIT (Just-In-Time) compilation on every app launch; slow and battery intensive.
- **Android 5.0 (Pure AOT)**: Ahead-Of-Time compilation during app install. Fast launches, but app installs took 10 minutes and consumed gigabytes of storage!
- **Android 7.0+ (Profile-Guided Hybrid Compilation)**: Combines JIT, AOT, and Cloud Profiles.
  - Apps launch with fast JIT.
  - ART profiles hot code methods and compiles them to AOT machine code when the device is idle and charging.
  - **Baseline Profiles**: Developers ship pre-compiled profiles with their AAB, delivering **up to 40% faster initial app launch time**!

### 27. How does the Android Looper, Handler, and MessageQueue work under the hood?
**In Simple Words:**
The foundation of thread communication and the Android Main (UI) thread:
- **`MessageQueue`**: A low-level unbounded linked list of messages and runnables to be processed.
- **`Looper`**: An infinite loop running on a thread (`Looper.loop()`) that continuously polls the `MessageQueue` for work and dispatches messages.
- **`Handler`**: An interface used by background threads to enqueue messages or `post(runnable)` to a specific Looper's MessageQueue.

### 28. What is App Startup Optimization and how does Jetpack App Startup work?
**In Simple Words:**
Many third-party libraries (Firebase, WorkManager, LeakCanary) automatically initialize themselves during app launch using hidden `ContentProvider`s:
- Having 10 ContentProviders slows down Cold Start time significantly because each provider is initialized sequentially before `Application.onCreate()`.
- **Jetpack App Startup**: Initializes all libraries within a **single shared ContentProvider**, reducing initialization overhead and enabling explicit dependency ordering.

### 29. How do you implement Custom Canvas drawing in Jetpack Compose?
**In Simple Words:**
When standard Compose layouts are insufficient, use the `Canvas` composable:
- Grants access to a `DrawScope` for hardware-accelerated 2D rendering:
```kotlin
@Composable
fun CircularProgress(progress: Float) {
    Canvas(modifier = Modifier.size(100.dp)) {
        drawArc(
            color = Color.Blue,
            startAngle = -90f,
            sweepAngle = 360f * progress,
            useCenter = false,
            style = Stroke(width = 8.dp.toPx(), cap = StrokeCap.Round)
        )
    }
}
```

### 30. How does Android handle Process Death and State Restoration?
**In Simple Words:**
When an app is in the background, Android OS can terminate the app process at any time to reclaim RAM for other apps:
- When the user navigates back, the system creates a brand new process and calls `onCreate(savedInstanceState: Bundle?)`.
- **`SavedStateHandle`**: In modern ViewModels, inject `SavedStateHandle` to save and restore critical IDs and draft form text automatically across system-initiated process termination.

### 31. What is the difference between Cold Start, Warm Start, and Hot Start?
**In Simple Words:**
- **Cold Start (Slowest)**: App launches from scratch. System must create a new OS process, initialize the `Application` class, and inflate the first Activity.
- **Warm Start**: App process is already in memory, but the Activity was destroyed and must be recreated (e.g. rotation, or returning after background kill).
- **Hot Start (Fastest)**: App and Activity are already resident in memory; system simply brings the Activity back to the foreground (`onStart()` -> `onResume()`).

### 32. What is Dynamic Feature Delivery with Play Feature Delivery?
**In Simple Words:**
Allows breaking an app into dynamic feature modules that are downloaded **on demand** rather than bundled in the initial install:
- Example: An AR Camera filter module (40 MB) is downloaded only when the user taps "Open AR Camera", saving initial download bandwidth.
- Modules can also be uninstalled programmatically to reclaim device storage.

### 33. How does Deep Linking work in Android (Deep Links vs Web Links vs Android App Links)?
**In Simple Words:**
- **Deep Links (Custom Scheme)**: e.g. `myapp://profile/101`. If multiple apps support the scheme, Android shows an app disambiguation chooser dialog.
- **Web Links (HTTP/HTTPS without verification)**: e.g. `https://myapp.com/profile/101`. Often opens in the user's default browser instead of the app.
- **Android App Links (Verified HTTPS)**: Digital Asset Links JSON file (`/.well-known/assetlinks.json`) hosted on your web domain verifies app ownership. Android automatically opens your app directly without prompting the user.

### 34. How do you benchmark and profile UI performance using Macrobenchmark?
**In Simple Words:**
- Traditional microbenchmarks test small code loops in isolation.
- **Macrobenchmark**: Runs on a real Android device/emulator, driving the app through end-to-end user journeys (scrolling a list, app cold start).
- Measures frame drops (Jank, > 16ms per frame for 60fps), Time to Initial Display (TTID), and Time to Full Display (TTFD), generating Systrace dumps.

### 35. When should you build a Native Android app vs React Native or Flutter?
**In Simple Words:**
- **Build Native Android (Kotlin + Compose)**:
  - Apps requiring deep hardware integration (Bluetooth Low Energy, custom USB peripherals, camera camera2 API).
  - High-performance 3D graphics, real-time audio DSP, or complex background services (WorkManager, VPNs).
  - High-consequence enterprise applications where zero bridge latency, immediate access to Day-0 Android OS APIs, and absolute smallest APK size are paramount.
- **Choose Cross-Platform (RN/Flutter)**: Standard e-commerce, content, or SaaS applications where developer velocity and unified iOS/Android codebase cut time-to-market in half.
`;
