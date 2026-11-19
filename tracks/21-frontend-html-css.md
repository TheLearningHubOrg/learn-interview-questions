# Modern HTML5, CSS3 & Responsive Layouts Master Interview Bank (1 - 15)

> Semantic HTML5 elements, CSS Grid vs Flexbox, Container Queries (@container), Subgrid, Cascade Layers (@layer), CSS custom properties, and responsive design systems.

---

### 1. What is Semantic HTML5, and why is it essential for Accessibility (a11y), SEO, and Browser Parsers?
**In Simple Words:**
Semantic HTML uses tags that convey the meaning of the content enclosed (`<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`) rather than purely presentational generic containers (`<div>`, `<span>`).

Benefits:
1. **Accessibility (a11y)**: Screen readers build an Accessible Name and Landmark Tree from semantic elements. A screen reader user can jump directly to the `<nav>` or `<main>` region without reading through 50 lines of boilerplate markup.
2. **SEO**: Search engine crawlers prioriti

### 2. Difference between `<article>`, `<section>`, and `<div>`: When should you choose which?
**In Simple Words:**
- **`<article>`**: Represents a complete, self-contained composition that makes sense on its own and could be syndicated independently (e.g. blog post, product card, forum comment, tweet).
- **`<section>`**: Represents a standalone thematic grouping of content, typically with its own heading (`<h2>` or `<h3>`) (e.g. "Customer Testimonials", "Features", "Pricing Table").
- **`<div>`**: A non-semantic container used purely for styling or layout hooks when no semantic tag is appropriate.

### 3. Modern Responsive Images: `<picture>` vs. `<img>` with `srcset` and `sizes`.
**In Simple Words:**
- **`<img>` with `srcset` and `si

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
- **Flexbox (1-Dimensional)**: Positions elements along a single axis (row OR column). Content-driven layout: elements resi

### 7. What are CSS Container Queries (`@container`), and how do they replace Viewport Media Queries?
**In Simple Words:**
Traditional `@media (min-width: 768px)` queries inspect the **entire browser viewport**. A reusable card component placed inside a narrow 300px sidebar has the exact same viewport width as a card placed in a 1200px main area, breaking responsive layout.

**Container Queries (`@container`)**:
Allow a component to adapt its styling based on the width of its **direct parent container** rather than the viewport.

```css
/* Define container context on parent */
.sidebar, .main-feed {
  container-type: inline-si

### 8. Explain CSS Specificity Hierarchy and the `:is()`, `:where()`, and `:has()` Parent Selectors.
**In Simple Words:**
Specificity calculation: `(Inline, IDs, Classes/Attributes/Pseudo-classes, Elements)`.
- **`:where()`**: Has **

### 9. CSS Grid vs. Flexbox: Architectural Decision Matrix.
**In Simple Words:**
- **Flexbox (1D - One-Dimensional)**: Layout along a single row or column. Content-driven sizing. Best for navigation bars, form input groups, chip lists, and media objects.
- **CSS Grid (2D - Two-Dimensional)**: Layout aligned along both rows and columns simultaneously. Layout-driven sizing. Best for page dashboards, magazine layouts, and photo galleries.

### 10. CSS Container Queries (@container) vs. Media Queries (@media).
**In Simple Words:**
- **Media Queries (`@media`)**: Query the dimensions of the entire browser **viewport**. Breaks component reusability when the same card component appears in a wide main area vs. a narrow sidebar.
- **Container Queries (`@container`)**: Query the dimensions of the component's **parent container element** (`container-type: inline-size`). The component rearranges its internal layout based on its immediate available space.

### 11. CSS Subgrid: Inheriting Track Sizing across Nesting.
**In Simple Words:**
Historically, nested grid items created independent grid contexts; card headers and footers in different grid cells could not align with each other.
- **`grid-template-rows: subgrid`**: Allows the child element to adopt the track definitions and gaps of its parent grid, ensuring card headers, body text, and button footers align across different cards.

### 12. CSS Cascade Layers (@layer): Resolving Specificity Wars.
**In Simple Words:**
Cascade Layers give developers explicit control over CSS precedence regardless of selector specificity:
`@layer reset, base, components, utilities;`
- Rules inside `@layer utilities` always override rules inside `@layer components`, even if the component selector has higher specificity (e.g. `#sidebar .btn`). Eliminates the need for `!important`.

### 13. Modern CSS Color Formats: OKLCH and Color Gamuts (Display-P3).
**In Simple Words:**
- **OKLCH (Lightness, Chroma, Hue)**: Perceptually uniform color space. Unlike HSL (where yellow at 50% lightness appears much brighter than blue at 50%), OKLCH maintains consistent perceived lightness across all hues.
- Supports the wide **Display-P3** color gamut supported on modern iPhones and OLED screens, producing richer, more saturated greens and purples.

### 14. CSS Containment (contain: content, contain-intrinsic-size) for Rendering Performance.
**In Simple Words:**
`content-visibility: auto` tells the browser engine to skip layout and painting for off-screen DOM elements until the user scrolls near them.
- `contain-intrinsic-size`: Provides a placeholder height so the scrollbar does not jump as elements come into view, boosting initial page render speeds by up to 10x on long articles.

### 15. Fluid Typography with clamp(min, preferred, max).
**In Simple Words:**
`font-size: clamp(1rem, 2.5vw + 0.5rem, 2.5rem);`
- Eliminates multiple breakpoint media queries.
- Font smoothly scales with viewport width between a guaranteed minimum (16px) and maximum (40px) without ever overflowing on mobile or under-sizing on ultra-wide screens.

