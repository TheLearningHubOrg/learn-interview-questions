# HTML5, Modern CSS, Responsive Design, Accessibility (a11y) & Web Vitals Master Interview Question Bank (1 - 50)

> Comprehensive, production-grade interview questions and architectural deep-dives covering Semantic HTML5, CSS Grid, Flexbox, Container Queries, Subgrid, Cascade Layers, Tailwind Architecture, WCAG 2.2 / WAI-ARIA Accessibility, and Core Web Vitals (INP, LCP, CLS).

---

## Part 1: Semantic HTML5 & Web Standards (1 - 15)

### 1. What is Semantic HTML5, and why is it essential for Accessibility (a11y), SEO, and Browser Parsers?
**In Simple Words:**
Semantic HTML uses tags that convey the meaning of the content enclosed (`<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`) rather than purely presentational generic containers (`<div>`, `<span>`).

Benefits:
1. **Accessibility (a11y)**: Screen readers build an Accessible Name and Landmark Tree from semantic elements. A screen reader user can jump directly to the `<nav>` or `<main>` region without reading through 50 lines of boilerplate markup.
2. **SEO**: Search engine crawlers prioritize content inside semantic tags (`<h1>`, `<article>`, `<time datetime="...">`) over generic `<div>` wrappers.
3. **Browser Automation & Reader Mode**: Safari Reader Mode and browser extensions rely on semantic boundaries to strip ads and render clean reading views.

```html
<!-- Anti-pattern: Div Soup -->
<div class="header">
  <div class="nav-link" onclick="navigate()">Home</div>
</div>

<!-- Accessible Semantic HTML5 -->
<header>
  <nav aria-label="Main Navigation">
    <a href="/home">Home</a>
  </nav>
</header>
```

### 2. Difference between `<article>`, `<section>`, and `<div>`: When should you choose which?
**In Simple Words:**
- **`<article>`**: Represents a complete, self-contained composition that makes sense on its own and could be syndicated independently (e.g. blog post, product card, forum comment, tweet).
- **`<section>`**: Represents a standalone thematic grouping of content, typically with its own heading (`<h2>` or `<h3>`) (e.g. "Customer Testimonials", "Features", "Pricing Table").
- **`<div>`**: A non-semantic container used purely for styling or layout hooks when no semantic tag is appropriate.

### 3. Modern Responsive Images: `<picture>` vs. `<img>` with `srcset` and `sizes`.
**In Simple Words:**
- **`<img>` with `srcset` and `sizes` (Resolution Switching)**: Serves the *same image* in different resolutions or pixel densities ($1	imes, 2	imes, 3	imes$ Retina). The browser's preload scanner chooses the best image based on viewport width and device DPI before rendering the DOM.
- **`<picture>` element (Art Direction & Format Switching)**:
  - **Art Direction**: Crop or change the composition entirely for mobile vs desktop.
  - **Format Switching**: Serve next-gen formats (**AVIF**, **WebP**) with automatic fallback to JPEG for legacy browsers.

```html
<!-- Format Switching and Art Direction -->
<picture>
  <source srcset="/hero-banner.avif" type="image/avif" />
  <source srcset="/hero-banner.webp" type="image/webp" />
  <img 
    src="/hero-banner.jpg" 
    alt="Developer collaboration" 
    width="1200" 
    height="675" 
    loading="lazy" 
    decoding="async" 
  />
</picture>
```

### 4. What is the difference between `async` and `defer` script loading attributes?
**In Simple Words:**
- Default (`<script src="...">`): HTML parsing pauses immediately; script is downloaded and executed before HTML parsing resumes (Parser-Blocking).
- **`async`**: Script is downloaded asynchronously in parallel with HTML parsing. The moment downloading finishes, **HTML parsing is paused immediately** to execute the script. Execution order is non-deterministic (whichever downloads first runs first). Best for independent analytics scripts (Google Analytics).
- **`defer`**: Script is downloaded in parallel with HTML parsing, but **execution is deferred until the HTML document has been fully parsed** (before `DOMContentLoaded`). Scripts execute in the exact order declared in the DOM. Best for application bundles requiring access to DOM elements.

### 5. What are the Content Security Policy (CSP) and Preload / Prefetch Resource Hints?
**In Simple Words:**
- **`rel="preload"`**: High-priority instruction telling the browser to fetch a critical resource immediately because it will be needed on the *current* page (e.g. hero font, above-the-fold banner image).
- **`rel="prefetch"`**: Low-priority instruction telling the browser to download a resource during idle time for a *future* navigation (e.g. the next page in a multi-step checkout flow).
- **`rel="preconnect"`**: Resolves DNS, TCP handshake, and TLS negotiation ahead of time for third-party origins (e.g. `https://fonts.googleapis.com`).

---

## Part 2: Modern CSS Architecture, Layouts & Specificity (16 - 32)

### 6. Explain CSS Grid vs. Flexbox: 1D vs. 2D Layouts and When to Choose Which.
**In Simple Words:**
- **Flexbox (1-Dimensional)**: Positions elements along a single axis (row OR column). Content-driven layout: elements resize and distribute based on their own content sizes. Best for navigation bars, card internal alignments, button groups, and centerings.
- **CSS Grid (2-Dimensional)**: Positions elements across columns AND rows simultaneously. Layout-driven structure: elements conform to a defined grid template. Best for overall page skeletons, responsive dashboards, photo galleries, and overlapping layouts.

```css
/* Responsive auto-fit grid without media queries */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

### 7. What are CSS Container Queries (`@container`), and how do they replace Viewport Media Queries?
**In Simple Words:**
Traditional `@media (min-width: 768px)` queries inspect the **entire browser viewport**. A reusable card component placed inside a narrow 300px sidebar has the exact same viewport width as a card placed in a 1200px main area, breaking responsive layout.

**Container Queries (`@container`)**:
Allow a component to adapt its styling based on the width of its **direct parent container** rather than the viewport.

```css
/* Define container context on parent */
.sidebar, .main-feed {
  container-type: inline-size;
  container-name: card-container;
}

/* Card adapts when its container exceeds 500px, regardless of screen size! */
@container card-container (min-width: 500px) {
  .product-card {
    display: flex;
    flex-direction: row;
  }
}
```

### 8. Explain CSS Specificity Hierarchy and the `:is()`, `:where()`, and `:has()` Parent Selectors.
**In Simple Words:**
Specificity calculation: `(Inline, IDs, Classes/Attributes/Pseudo-classes, Elements)`.
- **`:where()`**: Has **zero specificity (0,0,0)**. Allows authoring reset styles and design system defaults that can be easily overridden by any standard class.
- **`:is()`**: Takes the specificity of its **most specific argument**.
- **`:has()` (The Parent Selector)**: Styles a parent element based on its children or descendants:

```css
/* Style form group if any input inside it is invalid */
.form-group:has(input:invalid) {
  border-left: 4px solid red;
}
```

### 9. What are CSS Cascade Layers (`@layer`), and how do they solve Specificity Wars?
**In Simple Words:**
**Cascade Layers** group styles into explicitly ordered priority layers:
```css
@layer reset, base, components, utilities;
```
Styles declared in a higher layer (e.g. `utilities`) **ALWAYS beat** styles declared in a lower layer (e.g. `components`), regardless of selector specificity or source order! This eliminates the need for `!important` hacks when overriding component library styles.

### 10. Subgrid in Modern CSS: Aligning Nested Elements Across Grid Tracks.
**In Simple Words:**
In standard CSS Grid, a child element with `display: grid` establishes its own independent coordinate grid system; its child items cannot align with the parent grid tracks.
With **`grid-template-rows: subgrid`**, child elements inherit the parent's row/column tracks directly. This allows sibling cards to align their headers, descriptions, and buttons along identical horizontal baselines, even when card text lengths vary.

---

## Part 3: Web Accessibility (a11y / WCAG) (33 - 42)

### 11. What is the Accessibility Tree, and how does the browser generate it from the DOM?
**In Simple Words:**
The browser parses the HTML DOM and CSSOM to build the **Accessibility Tree (AOM)**, which exposes semantic objects to assistive technologies (screen readers like NVDA, JAWS, VoiceOver).
Each accessible node contains:
1. **Role**: What it is (`button`, `checkbox`, `heading`, `dialog`).
2. **Name**: What it is called (computed from text content, `aria-label`, or `aria-labelledby`).
3. **State**: Current condition (`expanded: true`, `checked: false`, `disabled: true`).
4. **Value**: Current metric (`progressbar: 75%`).

### 12. Explain Common ARIA Attributes: `aria-live`, `aria-expanded`, `aria-hidden`, and `aria-modal`.
**In Simple Words:**
- **`aria-live="polite" / "assertive"`**: Announces dynamic DOM updates to screen reader users without page reloads (e.g. toast notifications, search suggestions).
- **`aria-expanded="true/false"`**: Communicates accordion or dropdown open/closed state.
- **`aria-hidden="true"`**: Hides purely decorative elements (icons, graphics) from the accessibility tree so screen readers skip them.
- **`aria-modal="true"`**: Indicates that elements outside the active modal dialog are inert and non-interactive.

### 13. What is Focus Management and Keyboard Trapping in Modal Dialogs?
**In Simple Words:**
When a modal dialog opens:
1. Focus must be programmatically moved inside the dialog (usually to the first focusable element or close button).
2. **Focus Trap**: Pressing `Tab` on the last focusable element in the modal must wrap focus back to the first focusable element; pressing `Shift+Tab` on the first wraps to the last. Focus MUST NOT leak into the background page behind the modal!
3. Pressing `Escape` must close the modal.
4. When the modal closes, focus must be returned to the original button that triggered it.
*Native Solution*: The HTML5 `<dialog>` element with `dialog.showModal()` provides native focus trapping and backdrop dimming out of the box!

---

## Part 4: Core Web Vitals & Web Performance Optimization (43 - 50)

### 14. Explain Core Web Vitals: INP, LCP, and CLS.
**In Simple Words:**
Google's official user experience metrics:
1. **LCP (Largest Contentful Paint)**: Measures perceived load speed. Time taken to render the largest visible text block or image in the viewport. **Target: $le 2.5$ seconds**.
2. **INP (Interaction to Next Paint - Replaced FID in 2024)**: Measures overall page responsiveness. The latency between a user interaction (click, keypress, tap) and the next visual frame paint. **Target: $le 200$ milliseconds**.
3. **CLS (Cumulative Layout Shift)**: Measures visual stability. Sum of layout shift scores for unexpected shifts during page rendering. **Target: $le 0.1$**.

### 15. How do you prevent Cumulative Layout Shift (CLS) in production web apps?
**In Simple Words:**
1. **Always specify explicit `width` and `height` (or CSS `aspect-ratio`)** on all `<img>`, `<video>`, and iframe elements. The browser allocates layout space before the image bytes download.
2. **Reserve space for dynamic ad banners and widgets** with CSS min-height placeholders or skeletons.
3. Use `font-display: optional` or preload critical web fonts to prevent FOIT/FOUT font swapping shifts.
4. Never inject dynamic content (banners, notifications) above existing content without user interaction.
