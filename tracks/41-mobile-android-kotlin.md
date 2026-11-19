# Native Android, Kotlin Coroutines & Jetpack Compose Master Interview Bank (1 - 9)

> Kotlin Coroutines (suspend, CoroutineScope, Dispatchers), StateFlow vs SharedFlow, Jetpack Compose recomposition & remember, Activity lifecycle, Hilt dependency injection, and WorkManager.

---

### 1. Kotlin Coroutines: Suspend functions, CoroutineScope, and Dispatchers.
**In Simple Words:**
Coroutines are lightweight cooperative threads:
1. **`suspend` function**: A function that can pause execution without blocking the host thread and resume later.
2. **`CoroutineScope`**: Bounds coroutine lifecycles (e.g. `viewModelScope` cancels all child coroutines when ViewModel is destroyed).
3. **Dispatchers**:
   - `Dispatchers.Main`: Android main UI thread.
   - `Dispatchers.IO`: Optimi

### 2. Kotlin Flow: StateFlow vs. SharedFlow vs. LiveData.
**In Simple Words:**
- **LiveData**: Android-specific lifecycle-aware data holder. Always executes on the main thread; lacks rich operators.
- **StateFlow**: A hot Flow that emits the current state and subsequent state updates to collectors. Always holds a value (`replay = 1`), deduplicates consecutive identical values (`conflate`). Ideal for UI state in ViewModels.
- **SharedFlow**: A hot Flow that emits events to multiple subscribers (one-off snackbar events, navigation triggers) without keeping a permanent state snapshot.

### 3. Jetpack Compose: Recomposition, Remember, and DerivedStateOf.
**In Simple Words:**
Jetpack Compose is Android's modern declarative UI toolkit:
1. **Recomposition**: When state changes, Compose re-executes composable functions with new data. Compose skips recomposition for functions whose inputs haven't changed.
2. **`remember { ... }`**: Caches a value across recompositions so expensive calculations aren't repeated every frame.
3. **`rememberSaveable`**: Caches data across Android configuration changes (screen rotations) and process death.
4. **`derivedStateOf`**: Batches frequently changing state (e.g. scroll position) so recomposition only fires when a derived condition changes (e.g. `showScrollToTopButton`).

### 4. Android Activity Lifecycle & Configuration Changes.
**In Simple Words:**
Lifecycle callbacks: `onCreate` -> `onStart` -> `onResume` -> `onPause` -> `onStop` -> `onDestroy`.
**Configuration Changes (Screen Rotation, Dark Mode toggle):**
The Android OS destroys and recreates the entire Activity by default!
- State stored in ViewModels survives because the ViewModelStore outlives the Activity.
- Ephemeral UI state (e.g. unsaved text input) is saved via `onSaveInstanceState(Bundle)` and restored in `onCreate`.

### 5. Detecting and Preventing Memory Leaks in Android (LeakCanary).
**In Simple Words:**
**Common Causes of Leaks:**
1. Holding a static reference to an `Activity` or `Context`.
2. Registering listeners / broadcast receivers and forgetting to unregister them in `onDestroy`.
3. Non-static inner classes holding an implicit reference to the enclosing Activity.
**Detection**:
**LeakCanary** monitors retained object references in `onDestroy()`. If an Activity is not garbage collected within 5 seconds, LeakCanary dumps the heap, analy

### 6. Android IPC Mechanisms: Binder, AIDL, and Messengers.
**In Simple Words:**
Processes on Linux/Android are isolated. Inter-Process Communication (IPC) is powered by:
- **Binder Driver**: A custom Linux kernel driver that passes objects between processes using shared memory copies for maximum speed.
- **AIDL (Android Interface Definition Language)**: Defines programming interfaces that client and service agree upon to speak IPC. Compiles into Java/Kotlin Binder stubs.
- **Messenger**: Lightweight IPC wrapper around Handlers that processes messages sequentially on a single thread.

### 7. Dependency Injection in Android: Hilt / Dagger 2 vs. Koin.
**In Simple Words:**
- **Dagger 2 / Hilt**:
  - Compile-time dependency injection.
  - Generates plain Java code at build time. Zero reflection overhead at runtime; dependency graph errors are caught at compile time.
  - Hilt integrates with Android lifecycles (`@HiltViewModel`, `@AndroidEntryPoint`).
- **Koin**:
  - Pragmatic runtime Service Locator DSL written in pure Kotlin.
  - Faster build times (no annotation processing), but misses graph errors until runtime.

### 8. Android Background Work: WorkManager vs. Foreground Services vs. JobScheduler.
**In Simple Words:**
- **WorkManager**: Recommended for deferrable, guaranteed background work (syncing logs, uploading photos). Respects Do

### 9. Android Code Shrinking and Obfuscation: ProGuard vs. R8.
**In Simple Words:**
R8 replaces ProGuard in the Android Gradle build pipeline:
1. **Shrinking (Tree Shaking)**: Analy

