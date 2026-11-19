# Flutter & Dart Cross-Platform Mobile Master Interview Bank (1 - 35)

> Flutter architectural layers (Framework, Engine, Embedder), Widget Tree vs Element Tree vs RenderObject Tree, Impeller rendering engine vs Skia (shader compilation jank), StatefulWidget lifecycle, Dart event loop (Microtasks, Event queue, Isolates), Keys, State management (BLoC, Riverpod, Provider), Platform Channels, and GoRouter.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is Flutter and how does its rendering model differ from React Native?
**In Simple Words:**
Flutter is Google's open-source multi-platform UI framework written in Dart:
- **React Native Model**: Maps JavaScript components to native operating system widgets (`UIView`, `android.widget.TextView`) via a bridge/JSI.
- **Flutter Model (Self-Contained Canvas)**: Does **not use native OS UI widgets at all**!
  - Flutter acts like a modern gaming engine: it ships its own rendering engine (**Impeller / Skia**) and paints every single pixel, button, shadow, and text character directly onto a hardware-accelerated Skia/Vulkan/Metal canvas at 60fps / 120fps!
  - Guarantees 100% pixel-perfect identical visual output across iOS, Android, macOS, Windows, Linux, and Web.

```text
Rendering Model Comparison:
React Native: [React Component] ──► [Bridge / JSI] ──► [Native OS Widget (UIView)]
Flutter:      [Flutter Widget]  ──► [Flutter Engine] ──► [Paints Directly to GPU Canvas]
```

### 2. What are the three architectural layers of Flutter (Framework, Engine, Embedder)?
**In Simple Words:**
1. **Framework (Dart)**: High-level reactive UI layer used by developers: Material/Cupertino design widgets, Animation system, Gestures, Foundation.
2. **Engine (C / C++)**: Low-level core engine providing graphics rasterization (**Impeller** on iOS/Android), Dart runtime & garbage collection, text layout (LibTxt / HarfBuzz), and platform channels.
3. **Embedder (Platform-Specific: Swift/Java/C++)**: The platform-specific host entry point (Android Activity, iOS UIViewController) that initializes the surface, captures touch events, and renders the engine's output.

### 3. What is the difference between `StatelessWidget` and `StatefulWidget`?
**In Simple Words:**
- **`StatelessWidget`**: Immutable. Its UI configuration depends solely on arguments passed into its constructor. It has no internal mutable state that changes over time (e.g. `Text`, `Icon`). Overrides `Widget build(BuildContext context)`.
- **`StatefulWidget`**: Mutable. Maintains state that can change during the widget's lifetime (e.g. user input, check boxes, network data).
  - Composed of two classes: the immutable `StatefulWidget` configuration and the persistent `State<T>` object that holds mutable fields and calls `setState()`.

### 4. What is the complete lifecycle of a `StatefulWidget`?
**In Simple Words:**
The `State` object transitions through these methods in order:
1. **`createState()`**: Called by Flutter to instantiate the state object.
2. **`initState()`**: Called exactly once when the widget enters the tree. Used to initialize controllers, subscribe to streams, and setup animations.
3. **`didChangeDependencies()`**: Called immediately after `initState()` and whenever an `InheritedWidget` it depends on changes.
4. **`build()`**: Called repeatedly whenever `setState()` is called or dependencies update; returns the widget subtree.
5. **`didUpdateWidget(oldWidget)`**: Called when parent widget re-evaluates and passes new configuration props.
6. **`deactivate()`**: Called when widget is temporarily removed from the tree.
7. **`dispose()`**: Permanent teardown; unregister listeners, close streams, dispose controllers (`AnimationController`, `TextEditingController`) to prevent memory leaks.

```text
StatefulWidget Lifecycle:
[createState] ──► [initState] ──► [didChangeDependencies] ──► [build] ◄──┐
                                                                 │        │ (setState)
                                                            [dispose] ────┘
```

### 5. What are the Three Trees in Flutter (Widget Tree, Element Tree, RenderObject Tree)?
**In Simple Words:**
The foundation of Flutter's high-speed rendering:
1. **Widget Tree**: Lightweight, immutable blueprints of the UI. Created, destroyed, and rebuilt cheaply on every frame.
2. **Element Tree**: The persistent skeleton that manages the lifecycle of widgets and coordinates updates (instantiates either `ComponentElement` or `RenderObjectElement`).
3. **RenderObject Tree**: The heavy, low-level tree responsible for computing exact physical layout (sizing, constraints), hit testing, and painting pixels to the GPU canvas.
- Rebuilding a Widget tree does **not** recreate the RenderObject tree; Flutter diffs elements and updates existing render objects!

```text
The Three Trees:
[Widget Tree]       (Immutable Blueprints: Rebuilt cheaply)
     │
[Element Tree]      (Persistent Lifecycles: Compares & Diffs)
     │
[RenderObject Tree] (Heavy Layout & GPU Painting)
```

### 6. What is `BuildContext` and why is it needed?
**In Simple Words:**
`BuildContext` is a handle to the location of a widget in the **Element Tree**:
- Every widget's `build()` method receives a `BuildContext`.
- Used to look up ancestor widgets and data providers higher up in the tree (e.g. `Theme.of(context)`, `MediaQuery.of(context)`, `Navigator.of(context)`).
- Determines theme colors, screen dimensions, and navigation controllers based on where the widget sits in the hierarchy.

### 7. What is the difference between `hot reload` and `hot restart`?
**In Simple Words:**
- **Hot Reload (`r`)**: Injects updated Dart source code directly into the running Dart VM. **Preserves the current application state** in memory! Fast (< 500ms). Perfect for rapid UI iteration.
- **Hot Restart (`R`)**: Destroys current app state and restarts the Dart app from `main()`. Clears memory; takes 1-2 seconds. Required when modifying static fields, global variables, or `initState()` methods.

### 8. What are `const` constructors and why are they critical for Flutter performance?
**In Simple Words:**
When a widget constructor is marked `const` (`const Text("Hello")`):
- Flutter creates **a single canonical instance in memory at compile-time**.
- When the parent widget rebuilds, Flutter knows with 100% certainty that the `const` widget has not changed, and **skips rebuilding it and its entire subtree**!
- Using `const` aggressively eliminates redundant widget builds and maximizes frame rate.

### 9. What are Keys in Flutter and when must you use them?
**In Simple Words:**
A `Key` is an identifier for Widgets, Elements, and Semantics nodes:
- Most widgets do not need keys.
- **When Required**: When modifying a collection of **StatefulWidgets of the same type** (reordering, inserting, or removing items from a list).
- Without keys, the Element tree matches by type, causing state to attach to the wrong widgets (e.g. checking item 1 checks item 2 when item 1 is deleted!).
- Types: `ValueKey`, `ObjectKey`, `UniqueKey`, `PageStorageKey`, `GlobalKey`.

### 10. What is a `GlobalKey` and why should you avoid overusing it?
**In Simple Words:**
A `GlobalKey` is globally unique across the entire app:
- Allows accessing the state of a widget from anywhere in the app (e.g. validating forms via `_formKey.currentState!.validate()`).
- Allows reparenting a stateful widget to a different location in the tree without losing its internal state.
- **Caution**: Extremely expensive to maintain; overusing GlobalKeys destroys Flutter's element diffing optimizations.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What is the Impeller Rendering Engine and how does it eliminate Shader Compilation Jank?
**In Simple Words:**
The legacy Skia rendering engine compiled GPU graphics shaders on-the-fly at runtime:
- **The Jank Problem**: The first time a complex animation or shadow appeared, Skia spent 20-50ms compiling the shader on the CPU, causing a visible dropped frame ("jank").
- **Impeller (Default on iOS and modern Android)**:
  - **Ahead-Of-Time (AOT) Shader Precompilation**: All shaders are pre-compiled at build time into platform-native GPU shaders (Metal on iOS, Vulkan on Android).
  - Zero runtime shader compilation; guarantees steady 60fps / 120fps animations on first render!

### 12. How does the Dart Event Loop work (Microtask Queue vs Event Queue)?
**In Simple Words:**
Dart is single-threaded and runs an event loop with two FIFO queues:
1. **Microtask Queue (High Priority)**: Processes critical internal asynchronous tasks before returning control to the event queue (e.g. `scheduleMicrotask()`).
2. **Event Queue (Standard Priority)**: Handles external events: user touch gestures, timer ticks, drawing frames, network I/O, file reads.
- **Execution Order**: The event loop executes **ALL microtasks** until empty, then processes ONE item from the event queue, then checks the microtask queue again.

```text
Dart Event Loop Priority:
[Event Loop] ──► Check [Microtask Queue] ──► (Drain All Microtasks)
                        │ (When Empty)
                        ▼
                 Process ONE item from [Event Queue] ──► Loop!
```

### 13. What are Dart Isolates and how do you achieve true multithreading?
**In Simple Words:**
Because Dart is single-threaded, a heavy calculation (e.g. parsing a 20 MB JSON payload) freezes the UI frame rate:
- **Isolate**: An independent execution worker with its **own isolated memory heap and event loop**.
- Isolates share zero memory with each other! Data is passed strictly via message passing ports (`ReceivePort`, `SendPort`).
- **`Isolate.run()` / `compute()`**: Spawns an isolate, executes a heavy function on another CPU core, and returns the result asynchronously without dropping a single UI frame.

```dart
// Run heavy computation in background Isolate:
List<User> parseLargeJson(String jsonString) { ... }

Future<List<User>> loadUsers(String rawData) async {
  return await Isolate.run(() => parseLargeJson(rawData));
}
```

### 14. What are the primary State Management approaches in Flutter (BLoC vs Riverpod vs Provider)?
**In Simple Words:**
- **Provider (Basic)**: Built on top of `InheritedWidget`. Good for simple apps, but prone to runtime `ProviderNotFoundException`.
- **Riverpod (Modern Standard)**: Complete rewrite of Provider by the same author. Compile-time safe, independent of `BuildContext`, supports easy dependency overriding and auto-dispose.
- **BLoC (Business Logic Component)**: Enterprise standard based on reactive streams (`rxdart`). Enforces strict separation of Events, States, and BLoC transformers. Highly predictable, traceable, and unit-testable for large teams.

### 15. How does the BLoC (Business Logic Component) Pattern work?
**In Simple Words:**
Enforces unidirectional reactive data flow:
1. **UI triggers an Event** (e.g. `LoginButtonPressed(email, password)`).
2. The **BLoC receives the event**, executes business logic (API call), and emits new immutable **States** (`LoginLoading` -> `LoginSuccess`).
3. The UI listens via `BlocBuilder` or `BlocConsumer` and re-renders according to the current state.
- Zero business logic inside UI widgets!

```dart
// BLoC Event & State:
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository repo;
  AuthBloc(this.repo) : super(AuthInitial()) {
    on<LoginSubmitted>((event, emit) async {
      emit(AuthLoading());
      try {
        final user = await repo.login(event.email, event.pass);
        emit(AuthSuccess(user));
      } catch (e) {
        emit(AuthFailure(e.toString()));
      }
    });
  }
}
```

### 16. What are Platform Channels (MethodChannel, EventChannel, BasicMessageChannel)?
**In Simple Words:**
Used to communicate between Dart code and native platform code (Swift/Kotlin):
- **`MethodChannel`**: For asynchronous one-off remote procedure calls (e.g. querying battery level or triggering a native camera scanner).
- **`EventChannel`**: For streaming continuous data from native to Dart (e.g. accelerometer sensors, network connectivity changes).
- **`BasicMessageChannel`**: For passing raw string or binary messages.

```dart
// Dart side:
const platform = MethodChannel('com.app.battery');
final int batteryLevel = await platform.invokeMethod('getBatteryLevel');
```

### 17. How does Navigation work in Flutter (Navigator 1.0 vs Navigator 2.0 / GoRouter)?
**In Simple Words:**
- **Navigator 1.0 (Imperative)**: Simple `Navigator.push()` and `pop()`. Great for basic mobile apps, but struggles with deep linking and web browser history.
- **Navigator 2.0 (Declarative)**: Pages are declared as a list based on application state.
- **GoRouter (Official Recommendation)**: Simplifies Navigator 2.0 using clean, declarative URL routing, route redirection (auth guards), nested shell routes (bottom tab navigation), and deep linking out of the box.

### 18. What is `InheritedWidget` and how does `of(context)` work under the hood?
**In Simple Words:**
`InheritedWidget` is the base class for widgets that efficiently propagate data down the widget tree:
- When a descendant widget calls `MyInherited.of(context)`, Flutter registers the descendant's `Element` as a dependent.
- When the `InheritedWidget` rebuilds with new data (`updateShouldNotify() == true`), Flutter **automatically rebuilds only the registered dependent descendant widgets**, skipping non-dependent siblings!

### 19. What is `CustomPainter` and how do you paint directly onto the Canvas?
**In Simple Words:**
When no existing widget can render your design, `CustomPainter` gives you access to low-level graphics commands:
- Subclass `CustomPainter` and implement:
  - `paint(Canvas canvas, Size size)`: Draw lines, circles, paths, arcs, gradients, and text.
  - `shouldRepaint(CustomPainter oldDelegate)`: Return `true` only when parameters change, avoiding redundant GPU redraws.

### 20. What is `RepaintBoundary` and why is it used for animation performance?
**In Simple Words:**
By default, when a child widget repaints, its parent and sibling widgets on the same canvas may also be forced to repaint:
- Wrapping an animated widget in **`RepaintBoundary`** isolates it into a separate, cached display list layer.
- When the animation runs, **only the isolated layer repaints**; the rest of the screen remains untouched, saving massive GPU rasterization time.

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. How does Layout work in Flutter: "Constraints Go Down, Sizes Go Up, Parent Sets Position"?
**In Simple Words:**
The golden rule of the Flutter layout pipeline:
1. **Constraints Go Down**: A parent widget passes minimum and maximum width/height constraints (`BoxConstraints`) down to its child.
2. **Sizes Go Up**: The child determines its own dimensions within those constraints and passes its calculated `Size` back up to the parent.
3. **Parent Sets Position**: The parent places the child at an $(x, y)$ coordinate position within its coordinate space.
- An unconstrained widget (e.g. placing `ListView` inside `Column` without `Expanded`) causes the fatal crash: `Vertical viewport was given unbounded height`.

```text
The Flutter Layout Rule:
      [Parent Widget]
       │           ▲
       │ (Constraints: Min/Max Width & Height)
       ▼           │ (Calculated Size: Width & Height)
      [Child Widget]
       │
 (Parent places Child at x, y position)
```

### 22. What is the difference between `unbounded` constraints and `tight` constraints?
**In Simple Words:**
- **Tight Constraints**: Minimum constraint equals maximum constraint (e.g. `minWidth == maxWidth == 300`). The child **must** take that exact size.
- **Loose Constraints**: Minimum constraint is 0, maximum constraint is bounded (e.g. `minWidth == 0, maxWidth == 300`). The child can choose any size up to 300.
- **Unbounded Constraints**: Maximum constraint is infinity (`double.infinity`). Common in scrolling directions (`ListView`). Children must have an intrinsic or explicit size, otherwise layout fails.

### 23. What are RenderObjects and how do they implement `performLayout()` and `paint()`?
**In Simple Words:**
A `RenderObject` handles the low-level layout and rendering logic:
- Extends `RenderBox` for Cartesian 2D box layouts.
- **`performLayout()`**: Reads `constraints`, computes dimensions (`size`), and calls `child.layout()`.
- **`paint(PaintingContext context, Offset offset)`**: Draws shapes or passes painting to child layers.
- Most developers use high-level widgets, but understanding RenderObjects is critical for building custom high-performance gestures and complex charts.

### 24. What is App Size Optimization in Flutter?
**In Simple Words:**
1. Build release binaries with **`--split-debug-info`** and **`--obfuscate`** (strips debug symbols and shortens identifiers).
2. Use **`--split-per-abi`** on Android to produce split APKs for `arm64-v8a`, `armeabi-v7a`, cutting download size by 60%.
3. Compress image assets to WebP or vector SVGs.
4. Use **Deferred Components** to download features dynamically on demand.

### 25. What is FFI (Foreign Function Interface) in Dart and how does it compare to Platform Channels?
**In Simple Words:**
Dart FFI (`dart:ffi`) allows Dart to call native **C / C++ / Rust** shared libraries directly in memory:
- **Platform Channels**: Incurs asynchronous serialization and thread-switching overhead.
- **Dart FFI**: Synchronous, zero-copy, direct memory pointer access.
- Ideal for high-performance audio synthesis, video processing, cryptography, and running embedded SQLite engines.

### 26. How do you implement Offline-First Local Persistence with Isar or Drift?
**In Simple Words:**
- **SharedPreferences**: Strictly for lightweight key-value settings.
- **Drift (formerly Moor)**: Reactive, type-safe SQLite database with compile-time SQL verification and stream queries.
- **Isar Database**: Ultra-fast NoSQL database created specifically for Flutter:
  - Static typing, composite indexing, multi-criteria filtering, full-text search.
  - Queries return reactive streams that automatically update Flutter UI without boilerplate.

### 27. What causes Frame Drops (Jank) and how do you profile Flutter using Flutter DevTools?
**In Simple Words:**
To achieve 60fps, every frame must render within **16.6ms** (or 8.3ms for 120fps):
- **DevTools Timeline View**: Visualizes the UI thread and Raster (GPU) thread:
  - If **UI Thread is slow**: Heavy CPU work in `build()` or event handlers (move heavy computation to Dart Isolates!).
  - If **Raster Thread is slow**: Complex GPU shaders, excessive save layers (`saveLayer()`), or rendering unconstrained large images.

### 28. What is `saveLayer()` and why is it expensive for GPU performance?
**In Simple Words:**
`saveLayer()` redirects rendering to an off-screen intermediate texture buffer before composite-rendering it back to the screen:
- Triggered by `Opacity` (when applied to complex subtrees), `ShaderMask`, and `ClipRRect`.
- Forces GPU pipeline flushes and consumes high memory bandwidth.
- **Optimization**: Avoid wrapping complex lists in `Opacity`; use color opacity (`Color.withOpacity()`) directly instead.

### 29. How does Garbage Collection work in Dart?
**In Simple Words:**
Dart uses a generational garbage collector with two spaces:
1. **Young Generation (Scavenger)**: For short-lived objects (e.g. Flutter widgets created during rebuilds). Uses Cheney's copying algorithm to reclaim dead objects in sub-milliseconds without stopping the world.
2. **Old Generation (Mark-Sweep / Mark-Compact)**: For objects that survive multiple young-gen cycles (singletons, state stores). Runs infrequently in the background to avoid UI stutter.

### 30. What are Deferred Components in Flutter?
**In Simple Words:**
Flutter's implementation of dynamic code splitting and on-demand delivery for Android:
- Mark non-critical modules (e.g. onboarding flow, camera AR filter) as deferred using `deferred as`:
  `import 'features/camera.dart' deferred as camera_feature;`
- Downloaded from the Play Store only when `camera_feature.loadLibrary()` is invoked, keeping base app download size under 15 MB.

### 31. What is the difference between `Sliver` widgets and standard widgets?
**In Simple Words:**
Standard widgets render in fixed boxes; **Slivers** are portions of a scrollable area that lazily configure their layout based on scroll offsets:
- Allow creating collapsible headers, sticky app bars (`SliverAppBar`), and staggered lists inside a single unified `CustomScrollView`.
- Virtualizes child item rendering to consume minimal memory.

### 32. How do you test Flutter apps (Unit, Widget, and Integration tests)?
**In Simple Words:**
Flutter provides a comprehensive three-tier testing framework:
1. **Unit Tests (`test()`)**: Tests pure Dart business logic, ViewModels, and BLoCs with zero UI dependencies.
2. **Widget Tests (`testWidgets()`)**: Uses `WidgetTester` to inflate widgets in memory, simulate clicks/drags, and assert UI tree state without launching an emulator.
3. **Integration Tests (`integration_test`)**: Drives the compiled app on real physical devices or emulators, testing end-to-end user journeys and verifying performance.

### 33. What is the Semantics Widget and Accessibility in Flutter?
**In Simple Words:**
Because Flutter paints its own pixels, it must explicitly describe its visual elements to operating system accessibility engines (TalkBack on Android, VoiceOver on iOS):
- **Semantics Widget**: Annotates widgets with labels, hints, and traits for screen readers.
- Standard Material widgets come with built-in semantics; custom widgets should be wrapped in `Semantics(label: "...", button: true)`.

### 34. What are Mixins in Dart and how do they differ from abstract classes?
**In Simple Words:**
A `mixin` enables reusing class code across multiple class hierarchies without traditional multiple inheritance:
- Applied using the **`with`** keyword:
```dart
mixin LoggerMixin {
  void log(String msg) => print("[LOG]: $msg");
}

class UserService with LoggerMixin {
  void register() => log("User registered");
}
```
- Cannot be instantiated, and cannot have generative constructors.

### 35. When should you choose Flutter over Native development?
**In Simple Words:**
- **Choose Flutter**:
  - Apps requiring 100% brand consistency, identical custom design systems, and animations across iOS and Android.
  - Startups and enterprise teams aiming for maximum velocity with a single unified engineering team.
  - Multi-platform targets: deploying simultaneously to Mobile (iOS/Android), Desktop (macOS/Windows), and Web.
- **Choose Native**: When building complex hardware accessories (Bluetooth peripherals), lock screen widgets, or deep OS integrations where platform-specific UI conventions must be strictly preserved.
`;
