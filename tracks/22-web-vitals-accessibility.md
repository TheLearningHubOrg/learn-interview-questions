# Web Accessibility (WCAG 2.2) & Core Web Vitals Master Interview Bank (1 - 12)

> Web Content Accessibility Guidelines (WCAG 2.2 AA/AAA), WAI-ARIA roles & attributes, keyboard navigation, screen-reader compatibility, and Core Web Vitals (INP, LCP, CLS, TTFB).

---

### 1. What are CSS Cascade Layers (`@layer`), and how do they solve Specificity Wars?
**In Simple Words:**
**Cascade Layers** group styles into explicitly ordered priority layers:
```css
@layer reset, base, components, utilities;
```
Styles declared in a higher layer (e.g. `utilities`) **ALWAYS beat** styles declared in a lower layer (e.g. `components`), regardless of selector specificity or source order! This eliminates the need for `!important` hacks when overriding component library styles.

### 2. Subgrid in Modern CSS: Aligning Nested Elements Across Grid Tracks.
**In Simple Words:**
In standard CSS Grid, a child element with `display: grid` establishes its own independent coordinate grid system; its child items cannot align with the parent grid tracks.
With **`grid-template-rows: subgrid`**, child elements inherit the parent's row/column tracks directly. This allows sibling cards to align their headers, descriptions, and buttons along identical hori

### 3. What is the Accessibility Tree, and how does the browser generate it from the DOM?
**In Simple Words:**
The browser parses the HTML DOM and CSSOM to build the **Accessibility Tree (AOM)**, which exposes semantic objects to assistive technologies (screen readers like NVDA, JAWS, VoiceOver).
Each accessible node contains:
1. **Role**: What it is (`button`, `checkbox`, `heading`, `dialog`).
2. **Name**: What it is called (computed from text content, `aria-label`, or `aria-labelledby`).
3. **State**: Current condition (`expanded: true`, `checked: false`, `disabled: true`).
4. **Value**: Current metric (`progressbar: 75%`).

### 4. Explain Common ARIA Attributes: `aria-live`, `aria-expanded`, `aria-hidden`, and `aria-modal`.
**In Simple Words:**
- **`aria-live="polite" / "assertive"`**: Announces dynamic DOM updates to screen reader users without page reloads (e.g. toast notifications, search suggestions).
- **`aria-expanded="true/false"`**: Communicates accordion or dropdown open/closed state.
- **`aria-hidden="true"`**: Hides purely decorative elements (icons, graphics) from the accessibility tree so screen readers skip them.
- **`aria-modal="true"`**: Indicates that elements outside the active modal dialog are inert and non-interactive.

### 5. What is Focus Management and Keyboard Trapping in Modal Dialogs?
**In Simple Words:**
When a modal dialog opens:
1. Focus must be programmatically moved inside the dialog (usually to the first focusable element or close button).
2. **Focus Trap**: Pressing `Tab` on the last focusable element in the modal must wrap focus back to the first focusable element; pressing `Shift+Tab` on the first wraps to the last. Focus MUST NOT leak into the background page behind the modal!
3. Pressing `Escape` must close the modal.
4. When the modal closes, focus must be returned to the original button that triggered it.
*Native Solution*: The HTML5 `<dialog>` element with `dialog.showModal()` provides native focus trapping and backdrop dimming out of the box!

---

## Part 4: Core Web Vitals & Web Performance Optimi

### 6. Explain Core Web Vitals: INP, LCP, and CLS.
**In Simple Words:**
Google's official user experience metrics:
1. **LCP (Largest Contentful Paint)**: Measures perceived load speed. Time taken to render the largest visible text block or image in the viewport. **Target: $le 2.5$ seconds**.
2. **INP (Interaction to Next Paint - Replaced FID in 2024)**: Measures overall page responsiveness. The latency between a user interaction (click, keypress, tap) and the next visual frame paint. **Target: $le 200$ milliseconds**.
3. **CLS (Cumulative Layout Shift)**: Measures visual stability. Sum of layout shift scores for unexpected shifts during page rendering. **Target: $le 0.1$**.

### 7. Interaction to Next Paint (INP): Measurement, Optimization, and React 18 Transitions.
**In Simple Words:**
INP replaced First Input Delay (FID) as a Core Web Vital in March 2024.
- Measures the latency of **all** user interactions (clicks, taps, keypresses) throughout the entire page lifecycle and reports the longest interaction.
- **Target**: $<200\text{ms}$ for Good.
- **Optimization**:
  1. Break long JavaScript event loop tasks ($>50\text{ms}$) using `scheduler.yield()` or `setTimeout`.
  2. Use React 18 `startTransition` for non-urgent re-renders so the main thread yields to user typing immediately.

### 8. Largest Contentful Paint (LCP): Preloading, Fetchpriority, and CDN Edge Delivery.
**In Simple Words:**
LCP measures render time of the largest visible image or text block in the initial viewport.
- **Target**: $<2.5\text{s}$.
- **Optimization**:
  1. Add `fetchpriority="high"` to the hero image element.
  2. Add `<link rel="preload" as="image" href="..." />` in the HTML head.
  3. Never lazy-load the LCP hero image (`loading="lazy"` on hero images ruins LCP!).
  4. Serve modern image formats (AVIF/WebP) resized to viewport width via an edge CDN.

### 9. Cumulative Layout Shift (CLS): Layout Shifts and Dimension Attributes.
**In Simple Words:**
CLS measures unexpected layout movement during page load.
- **Target**: $<0.1$.
- **Causes & Fixes**:
  1. Images without `width` and `height` attributes: Browser reserves zero height initially, then shifts content downward when the image loads. Always specify aspect-ratio or explicit dimensions.
  2. Dynamic ad banners or cookie banners injecting content above the fold without reserved min-height containers.
  3. FOIT / FOUT with web fonts: Use `font-display: optional` or `font-display: swap` with size-adjust fallbacks.

### 10. WAI-ARIA: The First Rule of ARIA and Common Accessibility Anti-Patterns.
**In Simple Words:**
**The First Rule of ARIA**: *"If you can use a native HTML element or attribute with the semantics and behavior you require, then do so instead of re-purposing an element and adding ARIA."*
- Using `<div onClick={...}>Submit</div>` requires adding `role="button"`, `tabIndex={0}`, Enter key listener, Space key listener, and disabled styling. Native `<button>` gets all this for free from the browser.

### 11. Accessible Dialog / Modal Management (Focus Trapping, Escape, and inert).
**In Simple Words:**
A fully accessible modal dialog must:
1. Trap keyboard focus inside the modal using a focus trap (prevent Tab from cycling to background elements).
2. Apply the `inert` attribute to background page root elements so screen readers cannot navigate into obscured background content.
3. Close immediately on `Escape` keypress.
4. Return focus to the trigger button that originally opened the dialog upon modal dismissal.

### 12. Color Contrast Ratios: WCAG 2.2 AA vs. AAA Compliance.
**In Simple Words:**
- **WCAG AA (Standard Compliance)**:
  - Normal text ($<18\text{pt}$ / $<24\text{px}$): Minimum **$4.5:1$** contrast ratio.
  - Large text ($>18\text{pt}$ or $>14\text{pt}$ bold): Minimum **$3:1$** contrast ratio.
  - UI components and graphical objects (borders of input fields, icons): Minimum **$3:1$**.
- **WCAG AAA (Enhanced Compliance)**:
  - Normal text: Minimum **$7:1$** contrast ratio.
  - Large text: Minimum **$4.5:1$** contrast ratio.

