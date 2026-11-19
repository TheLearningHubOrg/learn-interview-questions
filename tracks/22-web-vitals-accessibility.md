# Core Web Vitals & Web Accessibility (WCAG 2.2) Master Interview Bank (1 - 35)

> Core Web Vitals (LCP, INP, CLS), FCP and TTFB optimization, Priority Hints (fetchpriority), Interaction to Next Paint (INP) execution sub-phases, scheduler.yield(), Cumulative Layout Shift (CLS) prevention, WCAG 2.2 principles (POUR), WAI-ARIA best practices, Keyboard navigation & focus traps, screen readers (aria-live), and automated axe-core testing.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What are Google's Core Web Vitals and what do they measure?
**In Simple Words:**
Core Web Vitals are the standardized, real-world user experience metrics Google uses to evaluate web page quality and determine search ranking signals:
1. **LCP (Largest Contentful Paint)**: Measures **Loading Performance**. Marks when the largest text block or image finishes rendering on the screen (Target: $\le 2.5\text{s}$).
2. **INP (Interaction to Next Paint)**: Measures **Interactivity & Responsiveness**. Replaced FID in March 2024; tracks the latency of user interactions (clicks, taps, keypresses) throughout the entire page lifecycle (Target: $\le 200\text{ms}$).
3. **CLS (Cumulative Layout Shift)**: Measures **Visual Stability**. Quantifies unexpected layout shifts where content jumps around as the page loads (Target: $\le 0.1$).

```text
Google Core Web Vitals Benchmarks:
┌──────────┬─────────────────────────┬──────────────┬──────────────┬──────────────┐
│ Metric   │ Measures                │ Good (Green) │ Needs Work   │ Poor (Red)   │
├──────────┼─────────────────────────┼──────────────┼──────────────┼──────────────┤
│ LCP      │ Loading Speed           │ <= 2.5s      │ 2.5s - 4.0s  │ > 4.0s       │
│ INP      │ Interaction Latency     │ <= 200ms     │ 200ms - 500ms│ > 500ms      │
│ CLS      │ Visual Layout Stability │ <= 0.1       │ 0.1 - 0.25   │ > 0.25       │
└──────────┴─────────────────────────┴──────────────┴──────────────┴──────────────┘
```

### 2. What is Largest Contentful Paint (LCP) and what elements are considered?
**In Simple Words:**
LCP measures the perceived loading speed of a page:
- Only considers elements visible within the initial viewport:
  - `<img>` elements.
  - `<image>` inside an `<svg>`.
  - Video poster images (`<video poster="...">`).
  - Elements with background images loaded via `url(...)`.
  - Block-level text elements (`<h1>`, `<p>`, `<div>` with text).
- **Good Threshold**: $\le 2.5$ seconds for the 75th percentile of mobile and desktop users.

### 3. What is Interaction to Next Paint (INP) and why did it replace First Input Delay (FID)?
**In Simple Words:**
- **FID (Legacy)**: Only measured the input delay of the *very first* user interaction upon landing on the page. It completely ignored all subsequent clicks, and ignored the time JavaScript took to actually render visual feedback!
- **INP (Modern Standard)**: Evaluates **all user interactions** (mouse clicks, mobile screen taps, keyboard strokes) that occur throughout the entire visit. It reports the worst latency (or near-worst 98th percentile), measuring from user touch until the next frame is physically painted to the display.

### 4. What is Cumulative Layout Shift (CLS) and how is it calculated?
**In Simple Words:**
CLS measures unexpected layout movement:
- **Calculation**: $\text{Layout Shift Score} = \text{Impact Fraction} \times \text{Distance Fraction}$.
  - *Impact Fraction*: How much of the viewport area was affected by unstable elements.
  - *Distance Fraction*: How far unstable elements moved relative to screen dimensions.
- Target: $\le 0.1$.
- Any shift within 500ms of a user interaction (e.g. clicking an accordion toggle) is excluded as an *expected* layout shift.

### 5. What are Time to First Byte (TTFB) and First Contentful Paint (FCP)?
**In Simple Words:**
- **TTFB (Time to First Byte)**: Time from user clicking a link until the browser receives the very first byte of the HTML document from the server (DNS + TCP + TLS + Server Processing). Target: $\le 800\text{ms}$.
- **FCP (First Contentful Paint)**: Time until the browser renders the very first DOM element (text, header, SVG) to the screen. Target: $\le 1.8\text{s}$.

### 6. What are the 4 Principles of WCAG 2.2 (POUR)?
**In Simple Words:**
The Web Content Accessibility Guidelines (WCAG) are organized under 4 core principles:
1. **Perceivable**: Information and UI components must be presentable to users in ways they can perceive (e.g. text alternatives for images, captions for audio).
2. **Operable**: UI components and navigation must be operable by all input methods (e.g. full keyboard accessibility, no keyboard traps).
3. **Understandable**: Information and operation of the UI must be understandable (clear error messages, readable text, predictable navigation).
4. **Robust**: Content must be robust enough that it can be reliably interpreted by a wide variety of user agents, including assistive technologies (screen readers).

### 7. What are the WCAG Conformance Levels (A, AA, AAA)?
**In Simple Words:**
- **Level A (Minimum / Basic)**: Essential accessibility features. Failing Level A makes the site virtually impossible for people with disabilities to use (e.g. missing keyboard navigation, missing alt text).
- **Level AA (Industry / Legal Standard)**: Required by global laws (ADA in the US, European Accessibility Act). Enforces 4.5:1 color contrast, visible focus indicators, consistent navigation, and clear form error handling.
- **Level AAA (Specialized / Highest)**: Enhanced standard (7:1 contrast, sign language interpretation). Aimed at specialized government or accessibility-first platforms.

### 8. What is the First Rule of ARIA?
**In Simple Words:**
> "If you can use a native HTML element or attribute with the semantics and behavior already built in, then do so. **Do not re-invent native elements with ARIA!**"
- **Bad**: `<div role="button" tabindex="0" onclick="...">Click Me</div>` (requires manual keyboard `Enter`/`Space` handlers, focus styling, and aria state).
- **Good**: `<button type="button">Click Me</button>` (natively accessible to screen readers, keyboards, and mobile touch out of the box).

### 9. What is the difference between `aria-label`, `aria-labelledby`, and `aria-describedby`?
**In Simple Words:**
- **`aria-label`**: Directly provides an invisible text string as the accessible name for an element without visible text (e.g. `<button aria-label="Close modal"><svg>...</svg></button>`).
- **`aria-labelledby`**: Points to the `id` of an existing visible element on the page that acts as the accessible name (e.g. `<div role="dialog" aria-labelledby="modal-title">`).
- **`aria-describedby`**: Points to the `id` of an element providing auxiliary descriptive or error text (e.g. linking an `<input>` to its validation error `<p id="err">Password too short</p>`).

### 10. What are the WCAG Color Contrast Ratio requirements?
**In Simple Words:**
Ensures text is legible against background colors for users with low vision or color blindness:
- **Normal Text (< 18pt or < 14pt bold)**: Minimum **4.5:1** contrast ratio (Level AA).
- **Large Text ($\ge 18\text{pt}$ or $\ge 14\text{pt}$ bold)**: Minimum **3:1** contrast ratio (Level AA).
- **UI Components & Icons**: Minimum **3:1** contrast ratio against adjacent backgrounds.
- Level AAA requires **7:1** for normal text and **4.5:1** for large text.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 11. What are the 4 sub-phases of LCP and how do you optimize each?
**In Simple Words:**
LCP is mathematically broken down into:
$$\text{LCP} = \text{TTFB} + \text{Resource Load Delay} + \text{Resource Load Duration} + \text{Element Render Delay}$$
1. **TTFB (Time to First Byte)**: Use Edge CDN caching, optimize server SSR queries.
2. **Resource Load Delay**: Time until browser discovers the LCP image.
   - *Fix*: Do **NOT** lazy-load LCP images (`loading="lazy"` on LCP is a critical bug!). Use `<link rel="preload">` or `fetchpriority="high"`.
3. **Resource Load Duration**: Download time of the asset.
   - *Fix*: Use modern WebP/AVIF formats, responsive `srcset`, resize to display dimensions.
4. **Element Render Delay**: Time from download finish until pixel display.
   - *Fix*: Eliminate render-blocking synchronous JavaScript and heavy CSS.

```html
<!-- The Ideal LCP Hero Image: -->
<img
  src="/hero-1200.avif"
  srcset="/hero-600.avif 600w, /hero-1200.avif 1200w"
  sizes="(max-width: 768px) 100vw, 1200px"
  fetchpriority="high"
  decoding="async"
  alt="Modern Cloud Architecture Diagram"
/>
```

### 12. What is `fetchpriority="high"` and how does it optimize Critical Resources?
**In Simple Words:**
Tells the browser's preload scanner to prioritize fetching a specific resource ahead of other images and scripts:
- By default, images have low network priority until layout occurs.
- Adding `fetchpriority="high"` to your LCP hero image signals the browser to download it immediately in parallel with critical CSS, shaving up to **1 second off LCP**!

### 13. What are the 3 execution phases of Interaction to Next Paint (INP)?
**In Simple Words:**
$$\text{INP} = \text{Input Delay} + \text{Processing Duration} + \text{Presentation Delay}$$
1. **Input Delay**: Time the user interaction sits waiting in the queue because the Main Thread is busy running background JavaScript (Long Tasks > 50ms).
2. **Processing Duration**: Time spent executing your event listener callbacks (`onClick`, `onKeyDown`).
3. **Presentation Delay**: Time browser takes to recalculate style layout, composite layers, and paint the next physical frame to the display buffer.

```text
INP Interaction Lifecycle:
User Clicks ──► [Input Delay] ──► [Processing Duration] ──► [Presentation Delay] ──► Next Frame Painted!
                (Main Thread busy)  (Your Event Handlers)    (Browser Layout/Paint)
```

### 14. How do you break up Long Tasks (> 50ms) using `scheduler.yield()`?
**In Simple Words:**
A Long Task (> 50ms) locks the Main Thread, causing high INP:
- **`scheduler.yield()`**: Native browser API that pauses long-running JavaScript execution, yields control back to the browser to paint the screen or handle incoming user clicks, and resumes processing:
```javascript
async function processLargeBatch(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    // Yield every 50 items to keep UI responsive:
    if (i % 50 === 0 && 'scheduler' in window && 'yield' in scheduler) {
      await scheduler.yield();
    }
  }
}
```

### 15. How do you prevent Cumulative Layout Shift (CLS) for Images, Ads, and Web Fonts?
**In Simple Words:**
1. **Images and Videos**: Always declare explicit `width` and `height` attributes, or use CSS `aspect-ratio: 16 / 9` so the browser reserves space in layout before the image downloads.
2. **Dynamic Banner Ads & Embeds**: Reserve minimum placeholder heights using CSS min-height (`min-height: 250px`).
3. **Web Fonts (Flash of Invisible / Unstyled Text - FOIT / FOUT)**:
   - Use `font-display: swap` paired with `@font-face` size-adjust metrics to match fallback font dimensions, preventing layout shift when the custom font loads.

### 16. How do you make a Custom Modal Dialog fully Accessible?
**In Simple Words:**
A modal dialog must fulfill 4 accessibility requirements:
1. **HTML & ARIA Attributes**: `<div role="dialog" aria-modal="true" aria-labelledby="modal-title">`.
2. **Focus Management**: Upon opening, automatically shift keyboard focus to the first focusable element inside the modal.
3. **Focus Trap**: Pressing `Tab` or `Shift+Tab` must cycle focus **strictly within the modal elements**, never escaping to the background page.
4. **Escape Key & Dismissal**: Pressing the `Escape` key must close the modal and return focus back to the button that originally opened it!

### 17. How do `aria-live` regions work (`polite` vs `assertive`)?
**In Simple Words:**
Notifies screen reader users of dynamic content updates without requiring page reloads (e.g. chat messages, toast notifications, shopping cart counters):
- **`aria-live="polite"` (Standard)**: Screen reader waits until the user finishes their current task or pauses before announcing the update (best for notifications, search result count).
- **`aria-live="assertive"` (Urgent)**: Screen reader interrupts whatever it is currently reading immediately to announce the update (reserved strictly for critical errors, system timeouts, server connection lost).

```html
<div aria-live="polite" role="status" id="cart-alert">
  Item added to cart! Total: 2 items.
</div>
```

### 18. What is Keyboard Navigation and how does `tabindex` work (`0`, `-1`, positive)?
**In Simple Words:**
Ensures all interactive elements are reachable using only the `Tab` key:
- **`tabindex="0"`**: Places the element into the natural sequential keyboard tab order. Use when making custom widgets (e.g. custom slider) focusable.
- **`tabindex="-1"`**: Removes element from the tab order, but allows it to be focused programmatically via JavaScript (`element.focus()`). Essential for modal dialogs and skip links.
- **`tabindex="1+"` (Anti-Pattern)**: Forces positive tab order. Destroys natural DOM navigation; **strictly avoid in production**!

### 19. What are Skip Links (Skip to Main Content) and why are they required?
**In Simple Words:**
A hidden link placed as the very first element in the `<body>`:
- Visually hidden until a keyboard user presses `Tab`:
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<nav><!-- 50 navigation links --></nav>
<main id="main-content">...</main>
```
- Allows keyboard and screen reader users to bypass repetitive header navigation links and jump directly to the page content!

### 20. What is the difference between `display: none`, `visibility: hidden`, and `.sr-only` (Screen Reader Only)?
**In Simple Words:**
- **`display: none`**: Removes element from visual rendering **AND completely hides it from Screen Readers**.
- **`visibility: hidden`**: Hides element visually (preserves layout space), but **completely hides it from Screen Readers**.
- **`.sr-only` / `.visually-hidden` (Accessibility Standard)**:
  - Hides content visually off-screen using CSS clipping, but **keeps it 100% accessible to screen readers**:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Part 3: Advanced Internals, Scale & Production Patterns (Senior / Lead)

### 21. How do you measure Real User Monitoring (RUM) Core Web Vitals in production?
**In Simple Words:**
Lab testing (Lighthouse) runs on synthetic throttled hardware; Google search ranking is determined strictly by real-world field data (**Chrome User Experience Report - CrUX**):
- **Web Vitals JavaScript Library**:
```javascript
import { onLCP, onINP, onCLS } from 'web-vitals';

function sendToAnalytics(metric) {
  navigator.sendBeacon('/analytics', JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    id: metric.id
  }));
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

### 22. What is Speculative Loading (Speculation Rules API)?
**In Simple Words:**
Allows websites to prerender pages in the background before the user even clicks a link:
- Replaces legacy `<link rel="prerender">` with the modern W3C **Speculation Rules API**:
```html
<script type="speculationrules">
{
  "prerender": [
    {
      "source": "list",
      "urls": ["/checkout", "/pricing"],
      "eagerness": "moderate"
    }
  ]
}
</script>
```
- When the user hovers over the checkout button, the browser fetches, compiles, and renders the entire page into a hidden background tab. Clicking the link displays the page in **0 milliseconds (instant navigation)**!

### 23. What are CSS Containment (`contain`) and `content-visibility: auto`?
**In Simple Words:**
Tells the browser's layout engine to isolate subtrees of the DOM:
- **`content-visibility: auto`**: The browser completely skips rendering, layout, and style calculations for off-screen elements until the user scrolls near them!
- Can reduce initial rendering time on large 5,000-word articles or long product feeds by **up to 70%**.
- Pair with `contain-intrinsic-size` to prevent CLS layout shifts when elements scroll into view.

### 24. How do Accessible Form Validations work with `aria-invalid` and `aria-describedby`?
**In Simple Words:**
When a user submits an invalid form field:
1. Mark the input with `aria-invalid="true"`.
2. Connect the input to the error message container via `aria-describedby="email-error"`.
3. Shift focus to the first invalid input:
```html
<label for="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error" role="alert">Please enter a valid business email address.</p>
```
- When a blind user tabs to the input, the screen reader automatically announces: *"Email Address, invalid entry, Please enter a valid business email address"*.

### 25. What is the difference between `role="status"` and `role="alert"`?
**In Simple Words:**
- **`role="status"`**: Equivalent to `aria-live="polite"`. Used for non-emergency advisory notices (e.g. "Draft auto-saved", "5 results found").
- **`role="alert"`**: Equivalent to `aria-live="assertive"`. Used for critical errors or urgent warnings that demand immediate user attention (e.g. "Session expiring in 60 seconds", "Credit card declined").

### 26. How do you implement Accessible Focus Rings (`:focus-visible` vs `:focus`)?
**In Simple Words:**
- **`:focus`**: Triggers whenever an element is focused, including mouse clicks. Historically, developers stripped outlines with `outline: none` because mouse users disliked the blue outline, which **completely destroyed keyboard accessibility**!
- **`:focus-visible` (Modern CSS Standard)**: Only displays the focus outline when the browser detects that the user is navigating via **keyboard (Tab)** or assistive device, remaining hidden on mouse clicks:
```css
/* Accessible Modern Focus Styling */
:focus {
  outline: none; /* Safe only when focus-visible is defined! */
}

:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

### 27. How does the Performance Observer API track layout shifts and long tasks in JavaScript?
**In Simple Words:**
The low-level browser API used to monitor performance metrics dynamically:
```javascript
// Monitor Layout Shifts in Real-Time:
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      console.log('Layout shift detected! Value:', entry.value);
    }
  }
});
observer.observe({ type: 'layout-shift', buffered: true });
```

### 28. What are Back/Forward Cache (bfcache) and `pageshow` event?
**In Simple Words:**
bfcache is an in-memory hardware snapshot that restores pages instantly when clicking the browser's Back/Forward button:
- Delivers instant 0ms navigation.
- **bfcache Blockers (Must Avoid)**:
  - Using `unload` event listeners (use `pagehide` instead!).
  - Unclosed WebSockets or `IndexedDB` transaction locks.
  - Setting `Cache-Control: no-store` on the HTML document.
- Listen for `window.addEventListener('pageshow', (e) => { if (e.persisted) { ... } })` to detect bfcache restores.

### 29. How do you automate Accessibility Testing using `axe-core` and Playwright?
**In Simple Words:**
Integrate accessibility auditing into CI/CD pipelines to catch 50%+ of accessibility violations automatically:
```typescript
// Playwright E2E Test with axe-core:
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Should pass WCAG 2.2 AA accessibility audit', async ({ page }) => {
  await page.goto('https://myapp.com/checkout');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 30. What is Target Size (Minimum) in WCAG 2.2 (Success Criterion 2.5.8)?
**In Simple Words:**
Introduced in WCAG 2.2 for mobile touchscreen accessibility:
- Any touch target (button, icon, link) must have a minimum bounding size of **$24 \times 24$ CSS pixels** (or sufficient spacing from adjacent targets so that a 24px diameter circle centered on the target does not intersect another target).
- Best Practice: Design touch targets with a minimum clickable area of **$44 \times 44$ pixels** for mobile thumb usability.

### 31. What is Document Outline and Headings Hierarchy (`<h1>` to `<h6>`) in Accessibility?
**In Simple Words:**
Screen reader users navigate web pages primarily by jumping between headings (using the `H` key):
- **Rule 1**: Every page should have exactly **one `<h1>`** describing the primary page topic.
- **Rule 2**: Never skip heading levels (e.g. jumping from `<h2>` directly to `<h4>` for visual styling); use CSS classes for sizing instead.
- Maintains a clean logical table of contents for blind users.

### 32. What is Reduced Motion (`prefers-reduced-motion`)?
**In Simple Words:**
Users with vestibular motion disorders experience dizziness and nausea from zooming animations, parallax scrolling, and bouncing transitions:
- CSS media query detects operating system accessibility preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 33. How does Critical CSS extraction optimize First Contentful Paint (FCP)?
**In Simple Words:**
By default, `<link rel="stylesheet">` is **render-blocking**: the browser halts all HTML painting until the entire CSS file is downloaded and parsed:
- **Critical CSS**: Extracts the minimal CSS required to render the above-the-fold viewport content.
- Inlines the critical CSS directly into `<style>` in the HTML `<head>`.
- Loads the remaining non-critical CSS asynchronously (`media="print" onload="this.media='all'"`), achieving sub-second FCP!

### 34. What is the difference between Accessible Name and Accessible Description?
**In Simple Words:**
- **Accessible Name**: The primary identity of the control announced first by screen readers (e.g. "Submit Button", "Search Input"). Calculated from text content, `aria-label`, or `<label>`.
- **Accessible Description**: Secondary contextual help announced after the name (e.g. "Must contain at least 8 characters"). Calculated via `aria-describedby`.

### 35. When should you use Server-Side Rendering (SSR) vs Static Site Generation (SSG) for Core Web Vitals?
**In Simple Words:**
- **SSG (Static Site Generation / Edge Prerender)**: Delivers the **absolute best Core Web Vitals** (lowest TTFB, fastest LCP). HTML files reside on Edge CDN nodes, responding in 20-50ms worldwide.
- **SSR (Server-Side Rendering)**: Necessary for personalized or real-time dynamic data. Must optimize database queries and edge streaming to keep TTFB under 500ms to avoid degrading LCP.
`;
