# React Native & Cross-Platform Mobile Master Interview Bank (1 - 15)

> React Native New Architecture (TurboModules, Fabric Renderer, Bridgeless mode, JSI), Hermes bytecode pre-compilation, Reanimated 3 UI worklets, FlatList memory profiling, and MMKV storage.

---

### 1. Explain the React Native New Architecture: TurboModules, Fabric Renderer, Bridgeless Mode, and JSI.
**In Simple Words:**
The legacy React Native architecture relied on an asynchronous, seriali

### 2. What is the React Native Threading Model and how do threads interact?
**In Simple Words:**
React Native applications run across multiple dedicated threads:
1. **Main UI Thread**: The native platform thread (Android Main / iOS UI thread) responsible for handling user interactions (gestures, touches) and drawing native views on screen.
2. **JavaScript Thread**: Executes the bundled JavaScript code (Hermes engine), business logic, API requests, and React component tree reconciliations.
3. **Shadow / Layout Thread**: Dedicated background thread that uses Meta's Yoga layout engine to compute flexbox layouts into absolute pixel positions before passing them to the UI thread.
4. **Native Modules / Worker Threads**: Background threads spawned for disk I/O, network requests, camera processing, and audio decoding.

In Bridgeless/Fabric architecture, high-priority layout passes can happen synchronously on the UI thread when needed (e.g. text input si

### 3. How do you optimize VirtualizedList / FlatList performance and eliminate memory leaks in React Native?
**In Simple Words:**
Large lists are a common source of frame drops and memory spikes in mobile apps.
**Key Optimi

### 4. React Navigation: Stack Navigator vs. Native Stack Navigator trade-offs.
**In Simple Words:**
- **JS-Based Stack Navigator (`@react-navigation/stack`)**:
  - Implemented purely in JavaScript using Reanimated and gesture handlers.
  - Highly customi

### 5. Mobile State Management & Storage: Redux/Zustand vs. MMKV vs. AsyncStorage.
**In Simple Words:**
- **AsyncStorage**: The legacy asynchronous key-value storage. Stores data in SQLite (Android) or seriali

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
1. **Local Persistent DB**: WatermelonDB (built on SQLite via JSI) uses la

### 8. React Native Reanimated 3: How Worklets eliminate UI thread bridge hops.
**In Simple Words:**
In standard React Native animations, each frame computes new values on the JS thread, seriali

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
   - iOS verifies domain ownership on app install; links open directly in the app with

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
   - Inspects CPU, Memory (Java heap, Native heap, Graphics), Network payload si

