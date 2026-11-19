# Core Web Vitals & Web Performance Master Interview Bank (1 - 35)

> Largest Contentful Paint (LCP), Interaction to Next Paint (INP), Cumulative Layout Shift (CLS), Long Animation Frames (LoAF), `scheduler.yield()`, Speculation Rules API, PerformanceObserver, and browser rendering optimization.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What are Google's Core Web Vitals and why do they matter?
**In Simple Words:**
**Core Web Vitals** are a set of three specific, user-centric performance metrics established by Google that measure real-world user experience on the web:
1. **LCP (Largest Contentful Paint)**: Measures **loading performance** (How fast does the main content appear?).
2. **INP (Interaction to Next Paint)**: Measures **interactivity and responsiveness** (How fast does the UI update when a user clicks or types?).
3. **CLS (Cumulative Layout Shift)**: Measures **visual stability** (Does content jump around unexpectedly while loading?).

#### Why They Matter:
- **Google Search Ranking**: Core Web Vitals are an explicit ranking signal in Google Search algorithms.
- **Conversion & Revenue**: A 100ms improvement in site speed increases e-commerce conversion rates by up to 8% and slashes bounce rates.

---

### 2. What is Largest Contentful Paint (LCP) and what are its thresholds?
**In Simple Words:**
**LCP** measures the time from when the user initiates page loading until the largest image, video thumbnail, or text block within the initial viewport is completely rendered on screen.

#### LCP Performance Thresholds:
- **Good (Green)**: $\le 2.5\text{ seconds}$ (Target: 75% of page visits should meet this).
- **Needs Improvement (Orange)**: Between $2.5\text{s}$ and $4.0\text{s}$.
- **Poor (Red)**: $> 4.0\text{ seconds}$.

#### Qualifying LCP Elements:
- `<img>` elements.
- Image elements inside an SVG (`<image>`).
- Video poster images or `<video>` elements.
- Block-level elements containing large text nodes (e.g. `<h1>` hero titles).

---

### 3. What is Interaction to Next Paint (INP) and how did it replace FID?
**In Simple Words:**
- **FID (First Input Delay - Legacy)**: Measured *only the very first user click* on a page, and measured only the input delay (waiting for the main thread), ignoring how long the browser took to actually paint the resulting frame.
- **INP (Interaction to Next Paint - Effective March 2024)**:
  - Observes **all click, tap, and keyboard interactions** throughout the entire lifespan of the page visit.
  - Represents the **longest interaction latency** (typically the 98th percentile).
  - Measures the full end-to-end duration from user action until the next frame is physically painted on screen.

#### INP Thresholds:
- **Good**: $\le 200\text{ ms}$.
- **Needs Improvement**: $200\text{ms} - 500\text{ms}$.
- **Poor**: $> 500\text{ ms}$.

---

### 4. What is Cumulative Layout Shift (CLS) and how is it calculated?
**In Simple Words:**
**CLS** measures the unexpected movement of visible elements during page loading.
If a user is about to click "Cancel", and an un-dimensioned advertisement suddenly pops in, shifting the page down and causing them to click "Confirm Order", that is a catastrophic layout shift.

$$\text{Layout Shift Score} = \text{Impact Fraction} \times \text{Distance Fraction}$$
- **Impact Fraction**: Percentage of the viewport occupied by unstable elements in both the before and after frames.
- **Distance Fraction**: Greatest distance the unstable element moved relative to the viewport height.

#### CLS Thresholds:
- **Good**: $\le 0.1$.
- **Needs Improvement**: $0.1 - 0.25$.
- **Poor**: $> 0.25$.

---

### 5. What is Time to First Byte (TTFB) and how does it impact frontend performance?
**In Simple Words:**
**TTFB** measures the time between the browser sending the initial HTTP request and receiving the very first byte of response data from the web server:
- Components: `DNS Lookup + TCP Handshake + TLS Negotiation + Server Processing Time`.
- **Why Critical**: TTFB is the baseline foundation for all other metrics. If your backend takes 2.0 seconds to respond with HTML, achieving a 2.5s LCP is mathematically impossible!
- **Good TTFB**: $\le 800\text{ ms}$ (Edge CDNs achieve $<100\text{ms}$).

---

### 6. First Contentful Paint (FCP) vs. Largest Contentful Paint (LCP).
**In Simple Words:**
- **FCP (First Contentful Paint)**: Marks the moment when the browser renders the **first bit of DOM content** (a background color change, a navigation bar, or a spinner). Reassures the user that the site is alive.
- **LCP (Largest Contentful Paint)**: Marks when the **primary content that the user came to see** (the main article heading or product hero image) is rendered.

---

### 7. How does the browser measure Web Vitals programmatically (`PerformanceObserver`)?
**In Simple Words:**
The modern browser exposes the **`PerformanceObserver`** API:
```javascript
// Observing Largest Contentful Paint (LCP)
const observer = new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP Candidate:', lastEntry.renderTime || lastEntry.loadTime);
});
observer.observe({ type: 'largest-contentful-paint', buffered: true });
```
`buffered: true` retrieves performance entries that occurred *before* the script initialized.

---

### 8. Lab Data (Synthetic / Lighthouse) vs. Field Data (CrUX / RUM).
**In Simple Words:**
- **Lab Data (Synthetic)**: Tests run in a controlled environment with simulated hardware (emulated Moto G4 phone, throttled 4G network). Perfect for debugging and local development. *Limitation*: Cannot measure INP accurately because no real humans are interacting with the page.
- **Field Data (Real User Monitoring - RUM / Chrome UX Report - CrUX)**: Telemetry captured from millions of real human users browsing on actual devices across global networks. **This is the exact data Google uses for search rankings.**

---

### 9. What causes high CLS on modern web pages and what are the simplest fixes?
**In Simple Words:**
#### Top Causes:
1. Images, ads, or iframes without explicit dimensions.
2. Dynamically injected content (banners, newsletter prompts) inserted above existing content.
3. Web fonts swapping (FOUT - Flash of Unstyled Text).

#### The 3 Universal Fixes:
1. Always include `width` and `height` attributes on `<img>` tags, or use CSS `aspect-ratio: 16 / 9;`.
2. Reserve space for dynamic ads and banners using CSS `min-height`.
3. Use `font-display: optional` or CSS font descriptor overrides to prevent font reflow.

---

### 10. How do CSR, SSR, and SSG compare regarding Web Vitals?
**In Simple Words:**
- **CSR (Client-Side Rendering)**: Fast TTFB, but **horrible LCP and FCP**. The browser must download, parse, and execute a large JS bundle before any HTML content is rendered.
- **SSR (Server-Side Rendering)**: Great FCP and LCP because pre-rendered HTML arrives immediately. *Risk*: Can have slow TTFB if backend queries are slow, and poor INP if hydration blocks the main thread.
- **SSG (Static Site Generation)**: **The Gold Standard for Web Vitals**. Sub-50ms TTFB delivered from global CDN edges, instant FCP/LCP, and minimal hydration overhead.

---

### 11. Font Loading Strategies: `font-display: swap` vs. `optional`.
**In Simple Words:**
- **`font-display: swap`**:
  - Displays fallback system font immediately while web font downloads. Swaps to the web font once downloaded.
  - *Risk*: Causes visible text reflow and **layout shifts (CLS)** if glyph widths differ!
- **`font-display: optional` (Recommended for Zero CLS)**:
  - Gives the custom font an extremely short window (~100ms) to load.
  - If it misses the window, the fallback font is used for the entire session. The custom font is cached in the background for the user's *next* page navigation. **Guarantees zero layout shift!**

---

### 12. Why Image Dimensions (`width`/`height` or `aspect-ratio`) prevent layout shifts.
**In Simple Words:**
When an image tag has `<img src="hero.jpg" width="800" height="400">`:
- The browser calculates the intrinsic aspect ratio ($800/400 = 2:1$).
- Before the image file finishes downloading over the network, the browser immediately calculates the height and **reserves the exact box space in the DOM layout**.
- Surrounding text does not jump when the image pixels finally arrive.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 13. Breaking down LCP into its 4 Sub-Parts.
**In Simple Words:**
To optimize LCP, you must measure its four distinct sub-components:

$$\text{Total LCP} = \text{TTFB} + \text{Resource Load Delay} + \text{Resource Load Duration} + \text{Element Render Delay}$$

1. **TTFB (Time to First Byte)**: Time to receive initial HTML response.
2. **Resource Load Delay**: Time between HTML arrival and when the browser discovers the LCP image URL. (Reduce to 0ms by placing images directly in HTML `<img>` rather than CSS `background-image`).
3. **Resource Load Duration**: Time spent downloading the image file. (Optimize with AVIF/WebP, responsive srcset, CDN).
4. **Element Render Delay**: Time between image download completion and when pixels paint to screen. (Caused by render-blocking CSS or main thread locking).

---

### 14. How does `fetchpriority="high"` accelerate LCP image discovery?
**In Simple Words:**
Browsers typically prioritize CSS, fonts, and scripts over images. If a page has 20 images, the hero LCP image sits in the low-priority queue:
```html
<img src="hero.webp" fetchpriority="high" alt="Product Hero" width="800" height="400" />
```
- `fetchpriority="high"` tells the browser's preload scanner: *"This is the most critical element on the entire page. Prioritize its TCP socket streams ahead of all other images and non-critical scripts."*
- Cuts LCP by **500ms to 1.5 seconds** on mobile devices.

---

### 15. Breaking down INP into its 3 Phases.
**In Simple Words:**
When a user clicks a button:

```
[ User Clicks ]
       |
       v
+--------------------------+
| 1. Input Delay           | -> Waiting for main thread to finish running earlier tasks
+--------------------------+
       |
       v
+--------------------------+
| 2. Processing Duration   | -> Executing event callbacks (onClick, state updates)
+--------------------------+
       |
       v
+--------------------------+
| 3. Presentation Delay    | -> Re-rendering DOM, recalculating styles, GPU compositing
+--------------------------+
       |
       v
[ Next Frame Painted on Screen ]
```

---

### 16. How does `scheduler.yield()` break up Long Tasks to improve INP?
**In Simple Words:**
A JavaScript loop running for 300ms locks the main thread, delaying all user clicks.
Historically developers used `setTimeout(..., 0)` which adds unpredictable 4ms timer clamp delays.
**`scheduler.yield()` (Web Standard)**:
Yields control back to the browser's event loop to paint frames and process pending user clicks, then immediately resumes execution:

```javascript
async function processMassiveList(items) {
  for (let i = 0; i < items.length; i++) {
    computeItem(items[i]);

    // Check if main thread has been running for > 50ms
    if (navigator.scheduling?.isInputPending?.() || i % 100 === 0) {
      await scheduler.yield(); // Pauses, lets user click process, then resumes!
    }
  }
}
```

---

### 17. How do Web Workers offload JavaScript to maintain 0ms Input Delay?
**In Simple Words:**
Moving heavy JSON parsing, cryptography, audio processing, or search filtering off the main thread:
- Main thread handles ONLY user input and DOM painting.
- Background Worker handles data processing.
- The UI stays responsive at 60 FPS with near-zero INP input delay even during heavy compute operations.

---

### 18. What are Long Tasks (>50ms) and Long Animation Frames (LoAF)?
**In Simple Words:**
- **Long Task**: Any JavaScript execution that monopolizes the browser main thread for **longer than 50 milliseconds**.
  - 50ms threshold: Human eyes perceive lag if a system fails to respond within 100ms. If a task takes $>50\text{ms}$, user input arriving mid-task will experience $>100\text{ms}$ delay.
- **LoAF (Long Animation Frames API)**:
  - The modern replacement for the Long Tasks API.
  - Attributes exactly *which script URL, function name, and execution duration* caused frame delays $>50\text{ms}$.

---

### 19. How do Resource Hints optimize the Critical Rendering Path?
**In Simple Words:**
```html
<!-- Early DNS + TLS handshake to payment gateway / CDN -->
<link rel="preconnect" href="https://assets.store.com" crossorigin />

<!-- High priority download of critical web font -->
<link rel="preload" href="/fonts/custom.woff2" as="font" type="font/woff2" crossorigin />

<!-- Speculative preload of next page module -->
<link rel="modulepreload" href="/checkout.js" />
```

---

### 20. What is the Speculation Rules API and how does it enable 0ms navigations?
**In Simple Words:**
The modern browser standard replacing legacy prerendering:
```html
<script type="speculationrules">
{
  "prerender": [
    {
      "where": { "href_matches": "/products/*" },
      "eagerness": "moderate"
    }
  ]
}
</script>
```
- When a user hovers over a link, the browser **fully pre-renders the next page in an invisible background tab**.
- When the user actually clicks the link, the page activates instantly ($0\text{ms}$ load time, 100/100 Core Web Vitals score!).

---

### 21. How does CSS `content-visibility: auto` cut render times?
**In Simple Words:**
```css
.article-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 350px;
}
```
Instructs the rendering engine to skip layout and painting for elements that are currently outside the viewport. As the user scrolls, the elements render just-in-time, cutting initial paint times by 80%.

---

### 22. Measuring and Reporting RUM Web Vitals with the `web-vitals` Library.
**In Simple Words:**
```javascript
import { onLCP, onINP, onCLS } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // "good" | "needs-improvement" | "poor"
    delta: metric.delta,
    id: metric.id,
  });

  // Non-blocking beacon transmission
  navigator.sendBeacon('/api/vitals', body);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

---

### 23. Reducing Total Blocking Time (TBT) with Dynamic Imports.
**In Simple Words:**
- **Total Blocking Time (TBT)**: The lab proxy for INP. Measures total time between FCP and Time to Interactive (TTI) where tasks exceeded 50ms.
- **Dynamic Imports**:
  ```javascript
  // Don't import heavy chart at initial load
  button.addEventListener('click', async () => {
    const { renderChart } = await import('./HeavyChart.js');
    renderChart();
  });
  ```
  Splits monolithic bundles into on-demand chunks, keeping the main thread clear during initial load.

---

### 24. Modern Image Formats: AVIF vs. WebP vs. JPEG XL.
**In Simple Words:**
- **AVIF (AV1 Image File Format)**:
  - 50% smaller than JPEG, 20% smaller than WebP at identical visual quality.
  - Supports HDR, wide color gamut (P3), and alpha transparency.
- **WebP**: Universally supported across all modern browsers.
- Always use `<picture>` with AVIF first, WebP second, and JPEG as legacy fallback.

---

## Part 3: Advanced Internals, Scale & Production Architecture (Senior / Lead)

### 25. Deep Dive into the INP Measurement Algorithm.
**In Simple Words:**
How Chrome computes your site's INP score:
1. Every click, tap, and keypress interaction event (consisting of `pointerdown`, `pointerup`, `click`) is tracked as a group.
2. The duration of an interaction is calculated as the time from the earliest event to when the next frame finishes painting.
3. For pages with $<50$ interactions, the **worst interaction** is the INP.
4. For pages with $>50$ interactions, Chrome ignores 1 high interaction for every 50 interactions (to eliminate statistical outliers) and takes the 98th percentile.

---

### 26. Profiling Frontend Memory Leaks in Chrome DevTools.
**In Simple Words:**
Memory leaks cause browser tabs to consume gigabytes of RAM, triggering garbage collection thrashing that cripples INP:
1. **Three Snapshot Technique**:
   - Take Heap Snapshot 1.
   - Perform action (e.g. Open & Close Modal).
   - Take Heap Snapshot 2.
   - Perform action again.
   - Take Heap Snapshot 3.
2. In Snapshot 3, filter by **Objects allocated between Snapshot 1 and 2**.
3. Inspect **Retaining Tree** to find references preventing GC (e.g. uncleared intervals, unremoved global event listeners, detached DOM nodes).

---

### 27. Analyzing LoAF (Long Animation Frames API) in Production.
**In Simple Words:**
Capturing actionable diagnostic data on slow scripts:
```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Long Frame duration:', entry.duration);
    for (const script of entry.scripts) {
      console.log('Culprit script:', script.sourceURL, 'Invoker:', script.invokerType);
    }
  }
});
observer.observe({ type: 'long-animation-frame', buffered: true });
```
Pinpoints third-party tag managers or analytics SDKs responsible for UI freezes.

---

### 28. Advanced Zero-CLS Font Metric Matching with `@font-face` Overrides.
**In Simple Words:**
When custom web fonts swap with system fallback fonts, line-wrapping changes because letter dimensions differ:
```css
@font-face {
  font-family: 'FallbackFont';
  src: local('Arial');
  ascent-override: 90%;
  descent-override: 20%;
  line-gap-override: 0%;
  size-adjust: 105%; /* Calibrated to match custom font metrics exactly! */
}
```
Ensures the fallback font occupies the **exact same vertical and horizontal space**, completely eliminating FOUT-induced layout shifts!

---

### 29. Third-Party Script Governance and Partytown.
**In Simple Words:**
Marketing scripts (GTM, Meta Pixel, Hotjar, HubSpot) execute hundreds of kilobytes of unoptimized JavaScript on the main thread:
- **Partytown**:
  - Relocates third-party scripts to run inside a **Web Worker**.
  - Proxies DOM and cookie access synchronously via Service Workers and `Atomics`.
  - Frees 100% of the main thread for user UI interactions, slashing TBT to 0ms.

---

### 30. High-Performance Caching: Stale-While-Revalidate and Edge CDNs.
**In Simple Words:**
```http
Cache-Control: public, max-age=60, s-maxage=3600, stale-while-revalidate=86400
```
- Users always receive cached responses from the nearest CDN edge PoP in $<30\text{ms}$.
- In the background, the CDN fetches fresh content from the origin server when `s-maxage` expires without delaying user requests.

---

### 31. HTTP/3 & QUIC: Eliminating Head-of-Line Blocking for Web Vitals.
**In Simple Words:**
- In HTTP/2 (over TCP): If a single network packet is lost, TCP stalls **all multiplexed streams** until the missing packet is retransmitted (TCP Head-of-Line Blocking).
- In HTTP/3 (over UDP / QUIC): Each request stream is independent. A lost packet on an image download does not block the CSS or HTML stream, preserving fast TTFB and LCP on lossy mobile cellular connections.

---

### 32. Service Worker Caching Strategies for Instant LCP.
**In Simple Words:**
Using Workbox or native Service Workers:
- **Cache-First (Stale-While-Revalidate) for Shell**: HTML shell and core CSS are served directly from device storage in $<10\text{ms}$.
- Dynamic data is fetched and streamed concurrently.
- Result: LCP completes in under $300\text{ms}$ on repeat visits even on 2G connections.

---

### 33. Preventing Memory Bloat in Single Page Applications (SPAs).
**In Simple Words:**
In apps running for hours without full-page reloads:
1. Always unsubscribe from RxJS observables or remove DOM event listeners in unmount lifecycle hooks.
2. Avoid accumulating data indefinitely in client-side caches (e.g. Apollo Client, TanStack Query); enforce maximum cache age and garbage collection limits.
3. Use WeakMap / WeakSet for caching DOM element references so elements can be garbage collected when removed from the DOM.

---

### 34. Real-World Performance Budgets in CI/CD.
**In Simple Words:**
Preventing regressions from entering production:
- Use **Lighthouse CI (LHCI)** in GitHub Actions:
  ```json
  {
    "ci": {
      "assert": {
        "assertions": {
          "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
          "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
          "total-blocking-time": ["error", {"maxNumericValue": 200}]
        }
      }
    }
  }
  ```
  Fails PR builds if code additions degrade performance metrics!

---

### 35. Enterprise Web Performance Architecture: SRE for Frontend.
**In Simple Words:**
1. **SLO Formulation**: 95% of real-world page views must have LCP $< 2.5\text{s}$, INP $< 200\text{ms}$, and CLS $< 0.1$.
2. **Alerting**: PagerDuty alerts triggered if 7-day rolling CrUX P75 INP breaches 250ms.
3. **Automated Rollback**: If a deployment spikes INP or CLS in real-time RUM telemetry, edge routing reverts to the previous canary version within 2 minutes.
