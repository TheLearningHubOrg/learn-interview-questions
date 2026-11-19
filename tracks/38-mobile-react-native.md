# React Native & Expo Mobile Architecture Master Interview Bank (1 - 35)

> React Native New Architecture (JSI, Fabric, TurboModules, Codegen), Hermes JavaScript engine, StyleSheet & mobile Flexbox, MMKV vs AsyncStorage, React Navigation, FlatList vs FlashList optimization, Reanimated 3 worklets, Gesture Handler, native modules, and Over-The-Air (OTA) updates.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is React Native and how does it render real native mobile UI?
**In Simple Words:**
React Native is a cross-platform mobile development framework that lets you write mobile apps using JavaScript/TypeScript and React:
- **Not a WebView**: Unlike Cordova or Ionic, React Native does **not** render HTML in a web browser view!
- Instead, your React components (`<View>`, `<Text>`, `<Image>`) map directly to **real platform-native UI elements**:
  - `<View>` on iOS compiles to `UIView`; on Android it compiles to `android.view.ViewGroup`.
- Delivers the native look, feel, performance, and accessibility of native mobile apps.

```text
React Native Component Mapping:
[React Native Code]         [iOS Platform]            [Android Platform]
<View>              ──►     UIView                    android.view.ViewGroup
<Text>              ──►     UILabel / UITextView      android.widget.TextView
<Image>             ──►     UIImageView               android.widget.ImageView
<ScrollView>        ──►     UIScrollView              android.widget.ScrollView
```

### 2. What are the key differences between the Old Architecture (Bridge) and the New Architecture in React Native?
**In Simple Words:**
- **The Old Architecture (Legacy Bridge)**:
  - Relied on an asynchronous **JSON Bridge** over an IPC thread.
  - Every UI update, touch event, and native call had to be serialized into a JSON string, sent over the bridge, and parsed by the other side.
  - **Bottleneck**: High-frequency events (fast scrolling, complex animations) congested the bridge, causing dropped frames and white flashes!
- **The New Architecture (Modern Standard)**:
  - Eliminates the bridge completely using **JSI (JavaScript Interface)**.
  - JavaScript can directly invoke C++ methods and hold direct memory references to native host objects with **zero JSON serialization**!

### 3. What is the Hermes Engine and why is it the default JavaScript engine?
**In Simple Words:**
Hermes is an open-source JavaScript engine optimized by Meta specifically for React Native on Android and iOS:
1. **Bytecode Precompilation (AOT)**: Compiles JavaScript into optimized bytecode at build time, eliminating the expensive parsing and compilation phase on app startup.
2. **Blazing Fast TTI (Time To Interactive)**: App launches up to 50% faster.
3. **Low Memory Footprint**: Uses compact memory allocations, reducing OS background kills.
4. **Optimized Garbage Collection**: Non-blocking GC runs in chunks to avoid UI stutter.

### 4. How does Styling work in React Native and how does its Flexbox differ from Web CSS?
**In Simple Words:**
Styling is written using JavaScript objects via `StyleSheet.create()`:
- **Default Flex Direction**: In React Native, `flexDirection` defaults to **`column`** (vertical mobile layout), whereas on the web it defaults to `row`!
- **Measurement Units**: All dimensions are unit-less numbers representing **Density-independent Pixels (dp)** on Android or Points on iOS (not `px`, `em`, or `rem`).
- No CSS cascade; styles are scoped and applied explicitly via `style={[styles.base, isActive && styles.active]}`.

### 5. What is the difference between `ScrollView` and `FlatList`?
**In Simple Words:**
- **`ScrollView`**: Renders **every single child element in memory simultaneously** upon mount! If you render 1,000 items, it creates 1,000 native views, instantly exhausting mobile RAM and freezing the app.
- **`FlatList`**: Virtualized list. Only renders the small window of items currently visible on screen. As the user scrolls, off-screen items are recycled, allowing smooth scrolling through tens of thousands of records with constant memory usage.

```typescript
// Optimized FlatList Example:
<FlatList
  data={orders}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <OrderItem order={item} />}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### 6. What is the difference between Expo Managed Workflow and Bare Workflow?
**In Simple Words:**
- **Expo Managed Workflow**: Zero native code editing. You write strictly JS/TS; Expo handles native iOS/Android directories, Gradle builds, CocoaPods, and push certificates in the cloud via EAS (Expo Application Services).
- **Bare Workflow**: Full access to native `android/` and `ios/` folders. You can edit Kotlin/Swift code directly and add custom native C++ libraries, but you manage Gradle, CocoaPods, and Xcode configurations manually.
- **Prebuild (`npx expo prebuild`)**: Modern Expo bridges both, allowing custom native code via Expo Config Plugins while retaining managed workflow simplicity.

### 7. What is `SafeAreaView` and why is it needed on modern devices?
**In Simple Words:**
Modern mobile screens feature notches, camera cutouts, rounded corners, and home indicator bars:
- `SafeAreaView` automatically applies padding to ensure content is not clipped by physical device hardware boundaries.
- Best Practice: Use `react-native-safe-area-context` which provides hook-based insets (`useSafeAreaInsets()`) across all orientations.

### 8. What are `Pressable`, `TouchableOpacity`, and `TouchableHighlight`?
**In Simple Words:**
Components for handling user touch interactions:
- **`TouchableOpacity` (Legacy)**: Diminishes view opacity on press.
- **`TouchableHighlight` (Legacy)**: Darkens the background on press.
- **`Pressable` (Modern Standard)**: Core component that exposes multi-stage interaction states: `pressed`, `hovered`, and `focused`. Supports hit slop expansions and native ripple effects.

### 9. What is `Dimensions` vs `useWindowDimensions` hook?
**In Simple Words:**
- **`Dimensions.get('window')`**: Returns initial screen width and height. **Static**: Does not update if screen rotates or folds!
- **`useWindowDimensions()`**: React hook that automatically updates and triggers re-render whenever screen dimensions change (e.g. device rotation, split-screen multitasking, folding phones).

### 10. How does Navigation work in React Native (`@react-navigation/native`)?
**In Simple Words:**
React Navigation is the de facto community navigation library:
- **Stack Navigator (`createNativeStackNavigator`)**: Traditional push/pop screen navigation backed by platform-native navigation controllers (`UINavigationController` on iOS).
- **Bottom Tabs Navigator**: Persistent bottom navigation bar.
- **Drawer Navigator**: Side drawer menu.
- Deep linking is configured declaratively using URL prefix mappings.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What is the JSI (JavaScript Interface) in the New Architecture?
**In Simple Words:**
JSI is a lightweight, general-purpose C++ abstraction layer:
- Allows the JavaScript runtime (Hermes) to directly hold a reference to a C++ Host Object, and vice versa.
- JavaScript can call native C++ and Swift/Kotlin methods **synchronously in nanoseconds** without serializing payloads to JSON or passing through an asynchronous message queue!
- Foundation of modern high-performance libraries like Reanimated 3, MMKV, and VisionCamera.

```text
Old Bridge vs New JSI Architecture:
Old Architecture:  [JS Thread] ──(JSON Stringify)──► [Async Bridge Queue] ──(JSON Parse)──► [Native UI]
New Architecture:  [JS Thread] ◄────────────(Direct JSI C++ Calls)────────────► [Native UI (Fabric)]
```

### 12. What is Fabric (the New UI Renderer)?
**In Simple Words:**
Fabric is React Native's modern C++ rendering engine:
- Replaces the legacy `UIManager`.
- Computes layout (via Yoga C++ layout engine) and creates the native view hierarchy directly from C++, avoiding thread hops.
- **Synchronous Rendering Support**: Supports React 18 Concurrent features (`useTransition`, `Suspense`), eliminating UI jump and blank screen flicker during fast user navigation.

### 13. What are TurboModules?
**In Simple Words:**
TurboModules is the native module system in the New Architecture:
- **Old Native Modules**: All native modules (Camera, Bluetooth, Location, SQLite) were instantiated and initialized in memory on app launch, significantly slowing down app startup!
- **TurboModules**: Loaded **lazily on demand**. A native module is only loaded into memory when JavaScript explicitly calls `TurboModuleRegistry.get('MyModule')`.

### 14. What is Codegen in React Native?
**In Simple Words:**
Codegen enforces compile-time type safety between JavaScript and Native code (Swift/Kotlin/C++):
- You define TypeScript or Flow interfaces for your component props or native module methods.
- At build time, Codegen automatically generates C++ boilerplate, protocol headers, and glue code.
- Guarantees that JavaScript cannot pass invalid data types to native code, eliminating runtime type mismatch crashes.

### 15. What is MMKV and why does it replace `AsyncStorage`?
**In Simple Words:**
- **`AsyncStorage` (Legacy)**: Key-value store backed by SQLite on Android and serial plist files on iOS. **Asynchronous**: Every read/write must await a promise over the bridge. Slow (tens of milliseconds).
- **`react-native-mmkv`**: Key-value storage engine developed by WeChat:
  - Uses memory-mapped files (`mmap`) via C++ and JSI.
  - **Synchronous**: `storage.getString('token')` returns instantly!
  - **Up to 30x faster** than AsyncStorage with zero thread hopping.

```typescript
import { MMKV } from "react-native-mmkv";
export const storage = new MMKV();

// Synchronous read & write:
storage.set("user.theme", "dark");
const theme = storage.getString("user.theme"); // Instant return!
```

### 16. What is FlashList and how does it outperform `FlatList`?
**In Simple Words:**
Developed by Shopify to fix FlatList performance issues:
- **FlatList Recycling Flaw**: When scrolling, FlatList unmounts off-screen native views and creates new ones, causing CPU spikes and white blank squares on fast scrolls.
- **FlashList (View Recycling)**: Implements true Android `RecyclerView` / iOS `UICollectionView` recycling:
  - Never destroys views; it recycles existing views and swaps only the data payload.
  - Renders **up to 10x faster** with zero blank spaces and maintains steady 60fps / 120fps scrolling.

### 17. How does React Native Reanimated 3 work using Worklets?
**In Simple Words:**
Traditional React animations run on the JS thread; if the JS thread is busy fetching data or rendering, animations drop frames:
- **Reanimated 3 Worklets**: Small JavaScript functions annotated with `'worklet'` that are compiled to run directly on the **UI / Native Thread** inside a separate Hermes runtime!
- UI animations, gestures, and layout springs run at buttery smooth 60fps / 120fps even if the main JavaScript thread is completely blocked!

```typescript
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

function BouncingBox() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateY: withSpring(offset.value * 200) }] };
  });

  return <Animated.View style={[styles.box, animatedStyles]} />;
}
```

### 18. What is React Native Gesture Handler?
**In Simple Words:**
Standard touch events in React Native rely on the browser Responder system, which passes touches through the JS thread:
- **Gesture Handler**: Hooks directly into the native operating system touch recognition systems (`UIGestureRecognizer` on iOS, Android Touch Pipeline).
- Gestures (pinch, pan, swipe, fling, long press) are recognized natively, eliminating lag and enabling seamless continuous gesture physics when combined with Reanimated.

### 19. How do you handle App State changes (`AppState`)?
**In Simple Words:**
Tracks whether the application is in the foreground, background, or transitioning:
- States:
  - **`active`**: App is running in the foreground and receiving user interactions.
  - **`background`**: App is minimized or user is on the home screen.
  - **`inactive`** (iOS only): App is transitioning (e.g. app switcher, incoming phone call, Control Center open).
```typescript
useEffect(() => {
  const subscription = AppState.addEventListener("change", (nextState) => {
    if (nextState === "active") {
      syncLatestMessages();
    }
  });
  return () => subscription.remove();
}, []);
```

### 20. What is Over-The-Air (OTA) Updates (EAS Update / CodePush) and its limitations?
**In Simple Words:**
Allows developers to deploy instant bug fixes and JavaScript updates directly to users' devices **without submitting a new build to the App Store or Google Play Store**:
- **What CAN be updated**: JavaScript code, TypeScript assets, React components, images, CSS styling.
- **What CANNOT be updated**: Any changes to native code (`android/`, `ios/`), new native libraries, permissions, or native SDK updates! Attempting to do so crashes the app.
- Must comply with Apple App Store Guidelines (updates must not significantly change the app's primary purpose).

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. How do you write a Custom Native Module using TurboModules in Swift and Kotlin?
**In Simple Words:**
1. **Spec Definition**: Define the TypeScript interface extending `TurboModule`:
   ```typescript
   export interface Spec extends TurboModule {
     getBatteryLevel(): Promise<number>;
   }
   ```
2. **Codegen**: Generates C++ abstract base classes.
3. **Native Implementation**:
   - iOS: Implement Swift/Obj-C class conforming to the generated protocol.
   - Android: Extend the generated Kotlin/Java base class.
4. **Registration**: Expose via JSI with zero bridge serialization.

### 22. What causes Memory Leaks in React Native and how do you profile them?
**In Simple Words:**
Memory leaks in React Native can occur in both the **JavaScript Heap** and the **Native Heap**:
- **JS Leaks**: Uncleaned event listeners (`DeviceEventEmitter`, `AppState`), dangling intervals (`setInterval`), retaining large data arrays in global Redux stores.
- **Native Leaks**: Unreleased image bitmaps in native caches, unclosed SQLite connections.
- **Profiling Tools**:
  - Chrome DevTools / Hermes Memory Profiler (takes JS Heap snapshots).
  - Xcode Instruments (Allocations / Leaks) for iOS native memory.
  - Android Studio Memory Profiler for tracking native Dalvik/ART and C++ allocations.

### 23. What is the Yoga Layout Engine?
**In Simple Words:**
Yoga is an open-source, cross-platform C++ layout engine developed by Meta:
- Implements the W3C Flexbox specification down to bare metal.
- Calculates exact $(x, y, \text{width}, \text{height})$ coordinate boxes for all UI components.
- Shared across iOS, Android, and Windows, guaranteeing identical layout positioning across all devices.

### 24. What are Image Optimization best practices in React Native (`expo-image` vs `react-native-fast-image`)?
**In Simple Words:**
Standard `<Image>` component in React Native suffers from poor caching, flickering, and high memory usage:
- **`expo-image` (Modern Standard)**:
  - Built on top of Glide (Android) and SDWebImage (iOS).
  - Advanced disk and memory LRU caching.
  - Native WebP and AVIF image format decoding.
  - Progressive blur-hash loading placeholders to prevent UI layout jumps.

### 25. How do you implement Offline-First Sync using WatermelonDB?
**In Simple Words:**
WatermelonDB is a reactive database optimized for building high-scale React Native applications:
- Backed by SQLite on native and indexedDB on web.
- **Lazy Loading**: Thousands of records are instantiated only when accessed; memory usage remains minimal.
- **Reactive Queries**: Emits updates automatically using RxJS observables.
- Features built-in incremental synchronization protocols (pushing local change deltas and pulling remote deltas).

### 26. What is the difference between Threading in React Native?
**In Simple Words:**
A React Native app runs on 4 primary threads:
1. **JavaScript Thread**: Executes your business logic, React rendering, API calls, and state management.
2. **UI Thread (Main Thread)**: Android/iOS OS thread responsible for drawing views and handling user touch interactions.
3. **Shadow Thread**: Background C++ thread where the Yoga layout engine computes layout coordinates before passing to UI thread.
4. **Native Modules Thread**: Background thread pool where native platform modules execute tasks (e.g. Geolocation, File system).

```text
React Native Threading Model:
[JS Thread (React Code)] ──► [Shadow Thread (Yoga C++ Layout)]
                                      │
                                      ▼
[Native Thread (Background Tasks)] ──► [UI / Main Thread (Native OS Drawing)]
```

### 27. How does Fastlane automate React Native CI/CD pipelines?
**In Simple Words:**
Fastlane automates mobile release workflows:
- Generates and signs iOS provisioning profiles and certificates (`fastlane match`).
- Increments version codes and build numbers.
- Compiles release binaries (`build_app`).
- Deploys test builds to Apple TestFlight and Google Play Internal Testing tracks (`upload_to_testflight`, `upload_to_play_store`) with a single CLI command in GitHub Actions.

### 28. What is App Size Optimization in React Native?
**In Simple Words:**
1. Enable **Hermes Engine** (cuts JS bundle size).
2. Enable **R8 / ProGuard shrinking and resource shrinking** on Android.
3. Enable **App Bundles (AAB)** and split APKs per CPU architecture.
4. Use SVG vectors or optimized WebP images instead of fat PNG assets.
5. Tree-shake heavy libraries (e.g. replace `lodash` with `lodash-es` or native methods; replace `moment.js` with `date-fns`).

### 29. How do you handle Deep Linking and Universal Links in React Native?
**In Simple Words:**
- **Custom Schemes (`myapp://`)**: Simple, but not secure; any app can register the same scheme.
- **Universal Links (iOS) & App Links (Android)**:
  - Standard HTTPS URLs (`https://myapp.com/item/42`).
  - Requires hosting verification files: `apple-app-site-association` (AASA) on iOS and `assetlinks.json` on Android.
  - OS verifies domain ownership and routes directly into the app, preventing hijacking.

### 30. How do you resolve Android 64K MultiDex limit in React Native?
**In Simple Words:**
A single Dalvik Executable (`.dex`) file can reference at most 65,536 methods:
- Large React Native apps with multiple native libraries easily exceed this limit.
- **MultiDex**: Android splits code into multiple secondary DEX files. Enabled in modern Android by default (minSdkVersion 21+ natively supports MultiDex).

### 31. What is Flipper and how do you debug React Native in production?
**In Simple Words:**
- **Development**: Flipper or modern React Native DevTools inspects React component hierarchies, network requests, MMKV storage, and native logs.
- **Production**: Instrument with **Sentry** or **Bugsnag** for automated crash reporting (captures native C++/Swift/Kotlin stack traces mapped with dSYMs and JavaScript stack traces mapped with Hermes source maps).

### 32. What is Concurrent React (React 18/19) in React Native?
**In Simple Words:**
- **Transitions (`useTransition`, `startTransition`)**: Marks non-urgent UI updates (e.g. search filter results) as interruptible.
- If the user types a new character while an expensive list is rendering, React halts rendering, handles the keystroke immediately, and restarts with the latest query, eliminating keyboard typing lag!

### 33. How does Apple Privacy Manifest (`PrivacyInfo.xcprivacy`) impact React Native apps?
**In Simple Words:**
Required by Apple for all App Store submissions since Spring 2024:
- Apps and third-party SDKs must declare what "Required Reason APIs" they access (File timestamps, System boot time, Disk space, User defaults).
- Must declare tracking domains and whether data is linked to user identity.
- Failing to include compliant privacy manifests in native dependencies results in automatic App Store rejection!

### 34. What is the New Architecture Interop Layer?
**In Simple Words:**
During the multi-year migration to the New Architecture, many legacy third-party libraries have not yet migrated to Fabric or TurboModules:
- **Interop Layer**: An internal compatibility shim provided by React Native that allows legacy ViewManagers and Native Modules to run seamlessly inside the New Architecture without crashing the app!

### 35. When should you choose React Native over Flutter?
**In Simple Words:**
- **Choose React Native**:
  - Existing web team with deep React, JavaScript, or TypeScript expertise.
  - Desired sharing of business logic and state stores between Web (Next.js) and Mobile.
  - Preference for platform-native UI widgets rather than custom canvas painting.
  - Massive, mature npm ecosystem and first-class Expo tooling.
- **Choose Flutter**: When complex, pixel-perfect identical 2D rendering and animations across all platforms with zero reliance on native platform UI widgets is the top priority.
`;
