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
`

---

### 36. New Architecture Deep Dive: JSI (JavaScript Interface), Fabric, and TurboModules.

**In Simple Words:**
The legacy React Native architecture relied on an asynchronous JSON bridge across three threads (JS, Native, Shadow), causing serialization lag during fast scrolling:
- **JSI (JavaScript Interface)**: Replaces the JSON bridge with direct C++ host objects. JavaScript holds direct references to native C++/Java/Objective-C objects and invokes methods synchronously without string serialization.
- **Fabric (New Renderer)**: Uses JSI to construct the C++ shadow tree directly, unifying rendering across platforms and supporting React 18 concurrent features.
- **TurboModules**: Native modules are loaded lazily on demand instead of initializing all native code at app launch, dramatically slashing cold startup times.

---

### 37. Hermes JavaScript Engine: Ahead-of-Time (AOT) bytecode compilation and low memory footprint.

**In Simple Words:**
Standard V8 or JavaScriptCore compiles JS text to bytecode on the user's mobile device at app launch, consuming CPU and causing launch lag:
- **Hermes**: Built by Meta specifically for mobile devices.
- **AOT Compilation**: Compiles JavaScript into optimized binary bytecode (`.hbc`) during the build process on your developer machine or CI server.
- **Benefits**:
  - Near-instantaneous cold startup time (Time to Interactive - TTI).
  - 50% smaller memory footprint on budget Android devices.
  - Generational garbage collection tuned for mobile memory limits.

---

### 38. Reanimated 3 and Gesture Handler: Running 60/120fps animations on the native UI thread via worklets.

**In Simple Words:**
Standard React Native animations run on the JavaScript thread. If the JS thread is busy parsing JSON, animations drop frames and feel sluggish:
- **Worklets**: Tiny JavaScript functions compiled to bytecode that execute directly on the **Native UI Thread**.
- **Reanimated 3 & Gesture Handler**:
  - Touch gestures and physics-based animations (springs, friction) execute synchronously on the display refresh loop (60Hz / 120Hz ProMotion).
  - JavaScript thread can be 100% blocked on heavy calculations, while the bottom sheet or swipe animation glides at butter-smooth 120 FPS.

---

### 39. Offline-First State Synchronization: WatermelonDB vs MMKV vs SQLite with background syncing.

**In Simple Words:**
Mobile apps frequently operate in subways or poor cell reception:
- **MMKV (Tencent)**: In-memory mapped key-value store using C++ `mmap`. 30x faster than `AsyncStorage`; ideal for user preferences, auth tokens, and session flags.
- **WatermelonDB**: High-performance SQLite-backed reactive database:
  - Lazy loading: loads only visible rows into memory.
  - Observable queries: UI automatically re-renders when local database rows mutate.
  - Built-in sync engine: Tracks `created_at` and `updated_at` columns to exchange compact JSON deltas with backend endpoints during network recovery.

---

### 40. Fastlane Automation: Automating App Store and Google Play signing, metadata, and deployment.

**In Simple Words:**
Manually uploading IPAs and APKs through Xcode and web consoles is error-prone:
- **Fastlane**: Open-source automation toolchain driven by Ruby `Fastfile`:
  ```ruby
  lane :beta do
    match(type: "appstore") # Automated iOS code signing certificates via Git
    increment_build_number
    build_app(workspace: "MyApp.xcworkspace", scheme: "MyApp")
    upload_to_testflight
    upload_to_play_store(track: "internal")
  end
  ```
- Handles code signing, provisioning profiles, asset generation, and automated App Store submission in one terminal command.

---

### 41. Over-the-Air (OTA) Updates: Expo Updates vs CodePush and App Store compliance rules.

**In Simple Words:**
Pushing a hotfix through the App Store review process takes 24-48 hours. **OTA Updates** download new JavaScript bundles and assets directly to users' phones in seconds:
- **How it works**: On app launch, the native shell checks an update server. If a new hash exists, it downloads the `index.android.bundle` in the background and applies it on next restart.
- **Apple Guideline 3.3.2 Compliance**: Permitted strictly for JavaScript/asset updates that do not alter the fundamental primary purpose of the application. Native code modifications (C++/Swift/Java) still require full App Store review.

---

### 42. Expo Application Services (EAS): EAS Build, EAS Submit, and Prebuild architecture.

**In Simple Words:**
- **Prebuild (`npx expo prebuild`)**: Generates transient `android/` and `ios/` native directories dynamically from `app.json` config plugins without committing thousands of fragile native files into Git.
- **EAS Build**: Cloud-hosted CI/CD infrastructure with dedicated macOS M-series and Linux build runners that compile native binaries with managed certificates.
- **EAS Submit**: Automatically pushes completed binaries directly to Apple App Store Connect and Google Play Console.

---

### 43. FlatList vs FlashList (Shopify): Recycling strategies and fixing list scroll stuttering.

**In Simple Words:**
- **`FlatList`**: Unmounts components offscreen, creating and destroying hundreds of native view elements during fast scrolling, leading to blank white spaces and memory spikes.
- **`FlashList` (Shopify)**: Implements **View Recycling**:
  - Keeps a small pool of native views alive.
  - As rows scroll offscreen, their views are instantly recycled and re-bound with new row data without destroying or allocating new native memory.
  - Delivers consistent 60 FPS scrolling even across lists of 100,000+ complex items.

---

### 44. Memory Leak Detection in Mobile Apps: Native retain cycles, orphaned listeners, and profiling tools.

**In Simple Words:**
Detecting why an app crashes after 30 minutes of usage:
1. **JavaScript Retain Cycles**: Forgotten global event listeners (`AppState.addEventListener`, `setInterval`) that are never cleaned up on component unmount.
2. **Native Retain Cycles (Swift/Kotlin)**: Strong reference cycles between closures and ViewControllers (resolve with `[weak self]`).
3. **Profiling**: Use **Xcode Instruments (Allocations & Leaks)** on iOS and **Android Studio Memory Profiler** to inspect native heap memory graphs and identify un-garbage-collected objects.

---

### 45. Push Notifications Architecture: APNs, FCM, and background silent push handling.

**In Simple Words:**
- **APNs (iOS)** & **FCM (Android)**: Device registers with the OS and obtains an ephemeral push token sent to the backend database.
- **Visual Notifications**: Displayed in the OS notification shade with title, body, sound, and action buttons.
- **Silent Background Push (`content-available: 1`)**: Wakes up the app in the background for up to 30 seconds to fetch fresh data (e.g. download new chat messages) so content is ready the instant the user taps the app icon.

---

### 46. Biometric Authentication & Secure Storage: Keychain and KeyStore.

**In Simple Words:**
Never store JWT refresh tokens or passwords in unencrypted `AsyncStorage` or `MMKV`:
- **iOS Keychain** & **Android KeyStore**: Hardware-encrypted security enclaves.
- **Biometric Binding**: Use `react-native-keychain` with biometric flags:
  ```typescript
  await Keychain.setGenericPassword('auth_token', token, {
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  ```
- Hardware automatically prompts for FaceID / TouchID / Fingerprint before returning the secret token to JavaScript.

---

### 47. Native Module Authoring with Codegen specs in the New Architecture.

**In Simple Words:**
In the New Architecture, native modules are strictly type-safe across JavaScript and C++/Swift/Kotlin:
1. Define the interface in TypeScript using Flow or TypeScript Spec:
   ```typescript
   // NativeBattery.ts
   import type { TurboModule } from 'react-native';
   import { TurboModuleRegistry } from 'react-native';

   export interface Spec extends TurboModule {
     getBatteryLevel(): Promise<number>;
   }
   export default TurboModuleRegistry.getEnforcing<Spec>('NativeBattery');
   ```
2. Run **Codegen**: Generates C++ glue headers enforcing that your native Swift/Kotlin methods match the exact parameter types at compile time.

---

### 48. App Startup Time Optimization (Time to Interactive - TTI).

**In Simple Words:**
Slashing cold launch time from 4 seconds down to sub-1 second:
1. **Enable Hermes Engine**: Eliminates runtime JS parsing overhead.
2. **Inline Requires**: Defer importing heavy modules until they are actually rendered (`require('moment')` inside the function).
3. **Optimize Splash Screen**: Keep native splash screen visible until initial critical layout renders to avoid layout jank.
4. **Reduce Native Module Overhead**: Convert legacy synchronous native modules to lazy TurboModules.

---

### 49. Microfrontends in Mobile: Super Apps architecture using Re.Pack.

**In Simple Words:**
In massive enterprise apps (e.g. Uber, WeChat, Amazon), multiple independent teams cannot deploy inside a single monolithic Git repository:
- **Re.Pack (Webpack / Rspack for React Native)**: Enables **Module Federation** for mobile.
- **Super App Architecture**:
  - The "Shell" app downloads dynamic JavaScript feature mini-bundles over the network (e.g., Food Delivery bundle, Ride Sharing bundle).
  - Teams develop, test, and release mini-apps independently without waiting for other teams' release schedules.

---

### 50. Battery and Network Consumption Tuning: Background tasks and throttling.

**In Simple Words:**
Preventing your app from draining user battery in the background:
- **iOS `BGTaskScheduler` & Android `WorkManager`**: Schedule background jobs with battery-friendly constraints (e.g. execute sync strictly when connected to Wi-Fi and device is charging).
- **Batching Network Requests**: Group periodic analytics telemetry pings into single batches every 5 minutes rather than firing cellular radio chips on every click.
- **Adaptive Geolocation**: Switch GPS from continuous high-accuracy tracking to coarse cell-tower geofencing when the user is stationary.
