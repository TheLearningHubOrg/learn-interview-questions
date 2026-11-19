# HTML5 & Semantic Web Architecture Master Interview Bank (1 - 35)

> HTML5 semantic structure, DOM tokenization, Forms & Constraint Validation API, `<dialog>`, Popover API, Resource Hints, Web Components (Shadow DOM), Web Workers, Service Workers, and browser parsing pipelines.

---

## Part 1: Basic & Foundational Concepts (Junior / Entry-Level)

### 1. What is HTML5 and what is the role of `<!DOCTYPE html>`?
**In Simple Words:**
- **HTML5** is the standard markup language for structuring web pages. It introduced native semantic tags, audio/video multimedia, the canvas 2D drawing API, local offline storage, and modern web form controls.
- **`<!DOCTYPE html>`**: An essential declaration placed on the very first line of an HTML document. It informs the browser's rendering engine to parse and render the document in **Standards Mode** according to the modern HTML specification, rather than **Quirks Mode** (which emulates buggy behaviors of 1990s browsers like Netscape Navigator and Internet Explorer 5).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semantic HTML Document</title>
  </head>
  <body>
    <!-- Document content -->
  </body>
</html>
```

---

### 2. What are Semantic HTML5 elements and why are they critical?
**In Simple Words:**
Semantic elements clearly describe their meaning to both the browser and the developer (e.g., `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`) instead of generic unsemantic containers like `<div>` and `<span>`.

#### Why Semantic HTML is Essential:
1. **Accessibility (a11y)**: Screen readers use semantic landmarks to allow visually impaired users to jump directly to navigation (`<nav>`) or primary content (`<main>`).
2. **Search Engine Optimization (SEO)**: Search engine crawlers (Googlebot) parse semantic headings and articles to understand page hierarchy and index content accurately.
3. **Maintainability**: Clean, self-documenting code structure that avoids "div soup" (`<div class="header-nav-list-item-wrapper">`).

```html
<header>
  <nav aria-label="Main Navigation">
    <ul><li><a href="/">Home</a></li></ul>
  </nav>
</header>
<main>
  <article>
    <h1>Understanding Modern HTML5</h1>
    <p>Semantic markup transforms accessibility.</p>
  </article>
</main>
<footer>
  <p>&copy; 2026 Developer Hub</p>
</footer>
```

---

### 3. What is the difference between `<article>` and `<section>`?
**In Simple Words:**
- **`<article>`**: Represents a complete, self-contained piece of content that could be distributed and syndicated independently (e.g., a blog post, news story, forum comment, or product card). If you can extract it and publish it in an RSS feed or on another website and it still makes sense on its own, use `<article>`.
- **`<section>`**: Represents a thematic grouping of content, typically with a heading. It is part of a larger whole (e.g., "Introduction", "Features", "Pricing" sections of a single page).

```html
<!-- An article containing thematic sections -->
<article>
  <h1>Designing Distributed Systems</h1>
  <section>
    <h2>1. The CAP Theorem</h2>
    <p>Consistency, Availability, and Partition Tolerance...</p>
  </section>
  <section>
    <h2>2. Consensus Algorithms</h2>
    <p>Raft and Paxos...</p>
  </section>
</article>
```

---

### 4. What is the HTML DOM and how is it constructed from HTML tokens?
**In Simple Words:**
The **Document Object Model (DOM)** is an in-memory, tree-structured object representation of an HTML document that JavaScript can inspect and manipulate.

#### The 5-Step Pipeline from Raw Bytes to DOM:
```
[ Raw Bytes (0101...) ]
          | (Decoded using charset e.g. UTF-8)
          v
[ Characters ('<', 'h', 't', 'm', 'l', '>') ]
          | (Tokenization: identifies start tags, end tags, attributes)
          v
[ Tokens (StartTag: html, StartTag: body, Text: "Hello") ]
          | (Node Creation: tokens converted into Node objects)
          v
[ Nodes (ElementNode, TextNode, CommentNode) ]
          | (Tree Construction based on parent-child tag hierarchy)
          v
[ DOM Tree ]
```

---

### 5. How do standard HTML forms work and what are the native form controls?
**In Simple Words:**
A `<form>` collects user input and transmits it to a server endpoint via an HTTP method:
- **`action`**: The server URL endpoint to which data is submitted.
- **`method`**: The HTTP method (`GET` appends form data to the URL query string; `POST` transmits data in the HTTP request body).
- **Core Form Elements**:
  - `<input>`: Single-line input with diverse types.
  - `<textarea>`: Multi-line text input.
  - `<select>` & `<option>`: Dropdown picker.
  - `<fieldset>` & `<legend>`: Groups related form controls semantically with a caption.

```html
<form action="/api/v1/subscribe" method="POST">
  <fieldset>
    <legend>Newsletter Subscription</legend>
    <label for="user-email">Email Address:</label>
    <input id="user-email" name="email" type="email" required autocomplete="email" />
    <button type="submit">Subscribe</button>
  </fieldset>
</form>
```

---

### 6. What are the modern `<input>` types and native validation attributes?
**In Simple Words:**
HTML5 introduced specialized input types that provide native mobile keyboard layouts and browser validation:
- **Types**: `email`, `tel` (opens number pad on phones), `url`, `number`, `date`, `color`, `file`, `range`.
- **Native Validation Attributes**:
  - `required`: Field must not be empty.
  - `minlength` & `maxlength`: String length constraints.
  - `min` & `max`: Numeric or date boundaries.
  - `pattern="[A-Z]{3}-[0-9]{4}"`: Regex validation pattern.
  - Browser automatically blocks form submission and displays native localized tooltip errors if inputs violate these constraints!

---

### 7. What is the difference between `type="submit"`, `type="button"`, and `type="reset"`?
**In Simple Words:**
- **`<button type="submit">` (Default behavior inside `<form>`)**: Submits the form data to the `action` URL when clicked or when the user presses Enter in an input field.
- **`<button type="button">`**: Does **nothing** by default. Designed exclusively for JavaScript event listeners (`onclick`). Always specify `type="button"` for modal close buttons or tabs inside forms, or clicking them will accidentally submit the form!
- **`<button type="reset">`**: Resets all form fields back to their original default values.

---

### 8. How does media embedding work with `<picture>`, `<source>`, and `<img>`?
**In Simple Words:**
While `<img>` displays a single image, the **`<picture>`** element enables art direction and responsive format selection:

```html
<picture>
  <!-- Serve ultra-lightweight AVIF to supporting browsers -->
  <source srcset="hero.avif" type="image/avif" />
  <!-- Fallback to WebP -->
  <source srcset="hero.webp" type="image/webp" />
  <!-- Responsive mobile crop -->
  <source media="(max-width: 600px)" srcset="hero-mobile.jpg" />
  <!-- Default fallback image with responsive srcset and sizes -->
  <img src="hero-desktop.jpg"
       srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
       sizes="(max-width: 600px) 100vw, 800px"
       alt="Conference keynote presentation"
       loading="lazy"
       width="800"
       height="450" />
</picture>
```

---

### 9. What are the differences between `defer`, `async`, and standard `<script>` loading?
**In Simple Words:**
```
HTML Parsing:    ====================[BLOCKED]=====================>
Standard Script:                     [Download][Execute]

HTML Parsing:    ==================================================>
Async Script:           [Download]
Execution:                        [Execute BLOCKS Parsing]

HTML Parsing:    ==================================================> (HTML Finishes)
Defer Script:           [Download]                          [Execute]
```

- **Standard `<script src="...">`**: Pauses HTML parsing immediately while the script downloads and executes. Blocks rendering!
- **`<script async src="...">`**: Downloads in background without pausing HTML parsing. The moment downloading finishes, HTML parsing is paused to execute the script immediately. Execution order is **non-deterministic** (independent scripts like Google Analytics).
- **`<script defer src="...">`**: Downloads in background. Executes **only after HTML parsing is completely finished**, strictly in the order the scripts appear in the document. **The best practice for application code.**

---

### 10. What is the purpose of the `<meta name="viewport">` tag in responsive design?
**In Simple Words:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
- By default, mobile browsers assume desktop websites and render pages inside an artificial 980px virtual viewport, zooming out until text is microscopic.
- `width=device-width`: Tells the browser to set the viewport width to the physical pixel width of the device screen.
- `initial-scale=1.0`: Sets the default 1:1 zoom level, enabling responsive CSS media queries and flexbox layouts to work correctly.

---

### 11. What are HTML entities and why must user inputs be escaped?
**In Simple Words:**
In HTML, characters like `<` and `>` are reserved for tag syntax.
- If a user submits a comment containing `<script>alert('hacked')</script>` and you render it unescaped, the browser interprets it as executable code (**Cross-Site Scripting - XSS**).
- **HTML Entities** encode reserved characters into safe character entities:
  - `<` -> `&lt;`
  - `>` -> `&gt;`
  - `&` -> `&amp;`
  - `"` -> `&quot;`
  - `'` -> `&#x27;`

---

### 12. What is the difference between `id`, `class`, and `name` attributes?
**In Simple Words:**
- **`id`**: Unique identifier for an element. Must be unique across the entire DOM. Used for anchor links (`#section-1`), form label associations (`<label for="email">`), and JavaScript lookups (`document.getElementById`).
- **`class`**: Non-unique identifier shared across multiple elements for CSS styling and DOM querying (`document.querySelectorAll('.card')`).
- **`name`**: The key submitted in HTTP form payloads (`?name=value`). Also groups radio buttons together so only one can be checked at a time.

---

## Part 2: Core Architecture & Implementation (Mid-Level)

### 13. What is the native HTML `<dialog>` element (`.showModal()` vs. `.show()`)?
**In Simple Words:**
Before HTML5 `<dialog>`, building accessible modal dialogs required hundreds of lines of JavaScript to manage focus traps, overlay backdrops, and ESC key handling.
The native `<dialog>` handles all of this automatically:

```html
<dialog id="confirm-modal">
  <form method="dialog">
    <p>Are you sure you want to delete this repository?</p>
    <button value="cancel">Cancel</button>
    <button value="confirm" autofocus>Delete</button>
  </form>
</dialog>
```

```javascript
const dialog = document.getElementById('confirm-modal');

// 1. .showModal(): Opens as true MODAL
// - Placed in the browser's native Top Layer (above all z-indices!)
// - Injects native ::backdrop pseudo-element
// - Automatically traps keyboard focus inside dialog
// - Automatically closes on ESC key press
dialog.showModal();

// 2. .show(): Opens as non-modal inline popup (does not trap focus or dim background)
```

---

### 14. What is the Popover API (`popover="auto|manual"`)?
**In Simple Words:**
Introduced natively in modern browsers (Baseline 2024), the **Popover API** creates tooltips, menus, and dropdowns without writing JavaScript event listeners:

```html
<!-- Trigger Button -->
<button popovertarget="my-menu">Open Menu</button>

<!-- Popover Container -->
<div id="my-menu" popover="auto">
  <p>Account Settings</p>
  <p>Billing</p>
  <p>Sign Out</p>
</div>
```

- **`popover="auto"`**:
  - Automatically rendered in the browser's **Top Layer** (never clipped by `overflow: hidden` parent containers).
  - Built-in **Light Dismiss**: Clicking outside or pressing ESC automatically closes the popover.
  - Automatically closes other open popovers when a new one opens.

---

### 15. What are Resource Hints (`preload`, `prefetch`, `preconnect`, `dns-prefetch`)?
**In Simple Words:**
Informs the browser's network stack about resources before the HTML parser discovers them:

1. **`rel="preconnect"`**: Initiates early DNS lookup, TCP handshake, and TLS negotiation to an external origin (e.g., Google Fonts or Cloudinary CDN):
   ```html
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   ```
2. **`rel="preload"`**: Tells the browser to download a critical resource needed for the **current page** immediately with high priority (hero images, critical fonts, main JS bundle):
   ```html
   <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
   ```
3. **`rel="prefetch"`**: Low-priority background download of resources likely needed for the **next page navigation** (e.g. checkout bundle while on cart page).

---

### 16. Web Storage Comparison: `localStorage` vs. `sessionStorage` vs. `IndexedDB` vs. `Cookies`.
**In Simple Words:**

| Storage API | Capacity | Scope & Lifecycle | Server Access | Use Cases |
|---|---|---|---|---|
| **Cookies** | ~4KB | Set by server or JS; expires per timestamp | Transmitted in every HTTP request header | Auth session tokens (`HttpOnly`, `SameSite`) |
| **`sessionStorage`** | ~5MB | Single browser tab; cleared when tab closes | Client-only | Multi-step form drafts, temporary filter state |
| **`localStorage`** | ~5-10MB | Persistent across tabs & restarts; never expires | Client-only | Theme preference (dark/light), UI state |
| **`IndexedDB`** | Gigabytes (>50% disk) | Asynchronous NoSQL database; persistent | Client-only | Offline PWA caching, local document stores |

---

### 17. What is the HTML5 Drag and Drop API?
**In Simple Words:**
Enables native dragging of elements and external files:
```html
<div draggable="true" id="card-1">Drag Me</div>
<div id="drop-target">Drop Here</div>
```
```javascript
const card = document.getElementById('card-1');
const target = document.getElementById('drop-target');

card.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', card.id);
  e.dataTransfer.effectAllowed = 'move';
});

target.addEventListener('dragover', (e) => {
  e.preventDefault(); // MANDATORY: Default blocks drops!
});

target.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  target.appendChild(document.getElementById(id));
});
```

---

### 18. What are Custom Data Attributes (`data-*`)?
**In Simple Words:**
Allows storing extra custom metadata on standard HTML elements without violating specifications:
```html
<button class="user-card" data-user-id="usr_89" data-role="admin">Alex</button>
```
- **Access in JavaScript**:
  ```javascript
  const btn = document.querySelector('.user-card');
  console.log(btn.dataset.userId); // "usr_89" (camelCased automatically)
  console.log(btn.dataset.role);   // "admin"
  ```
- **Access in CSS**:
  ```css
  button[data-role="admin"] { border: 2px solid gold; }
  ```

---

### 19. What is the `<template>` element?
**In Simple Words:**
The `<template>` tag holds client-side HTML markup that is **parsed but not rendered** on page load:
```html
<template id="comment-template">
  <div class="comment">
    <strong class="author"></strong>
    <p class="body"></p>
  </div>
</template>
```
- Its contents do not execute scripts, load images, or apply styles until cloned into the live DOM using JavaScript:
  ```javascript
  const template = document.getElementById('comment-template');
  const clone = template.content.cloneNode(true); // Deep clone
  clone.querySelector('.author').textContent = 'Alice';
  document.getElementById('comments-list').appendChild(clone);
  ```

---

### 20. What are Web Components and Custom Elements (`customElements.define`)?
**In Simple Words:**
**Web Components** are a suite of native browser APIs that allow you to create reusable, encapsulated custom HTML elements that work across any framework (React, Vue, Angular, or vanilla JS):

```javascript
class UserBadge extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'Anonymous';
    this.innerHTML = `<span class="badge">👤 ${name}</span>`;
  }
}

// Register custom tag
customElements.define('user-badge', UserBadge);
```
```html
<!-- Use custom tag directly in HTML -->
<user-badge name="Jordan"></user-badge>
```

---

### 21. What is the Shadow DOM (`attachShadow({ mode: 'open' })`)?
**In Simple Words:**
Provides true DOM and CSS scoping isolation:
- Styles defined inside a **Shadow Root** never leak out into the main document.
- Global styles in the main document never bleed into the Shadow DOM.
```javascript
class EncapsulatedWidget extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        /* Scoped styles! Does not affect any button outside this widget */
        button { background: purple; color: white; padding: 10px; }
      </style>
      <button>Scoped Button</button>
    `;
  }
}
customElements.define('encapsulated-widget', EncapsulatedWidget);
```

---

### 22. How does the `loading="lazy"` attribute work on `<img>` and `<iframe>`?
**In Simple Words:**
Natively defers fetching off-screen images and iframes until the user scrolls near them:
```html
<img src="large-image.jpg" loading="lazy" alt="Product" width="600" height="400" />
```
- The browser calculates distance using internal heuristics (typically 1,000px threshold).
- Completely eliminates the need for custom JavaScript IntersectionObserver libraries.
- *Critical rule*: Always provide `width` and `height` attributes to prevent Cumulative Layout Shift (CLS) when the image loads!

---

### 23. What are `iframe` security attributes (`sandbox`, `allow`, `referrerpolicy`)?
**In Simple Words:**
Embedding untrusted third-party content (ads, widgets) introduces security vulnerabilities:
- **`sandbox`**: Implements extreme restrictions by default (blocks scripts, forms, popups, top-navigation):
  ```html
  <iframe src="https://untrusted.com"
          sandbox="allow-scripts allow-forms"
          referrerpolicy="no-referrer"></iframe>
  ```
- **`allow="camera 'none'; microphone 'none'"`**: Permissions Policy attribute controlling access to hardware sensors.

---

### 24. What is the HTML Constraint Validation API?
**In Simple Words:**
Allows custom JavaScript validation while leveraging native browser error reporting:
```javascript
const emailInput = document.getElementById('email');

emailInput.addEventListener('input', () => {
  if (emailInput.value.endsWith('@disallowed.com')) {
    emailInput.setCustomValidity('Corporate addresses not permitted.');
  } else {
    emailInput.setCustomValidity(''); // Empty string marks field as VALID!
  }
  emailInput.reportValidity(); // Displays native browser tooltip error
});
```

---

## Part 3: Advanced Internals, Scale & Production Architecture (Senior / Lead)

### 25. Deep Dive into the HTML Parser: Tokenization, Speculative Preload Scanner, and Render-Blocking Resources.
**In Simple Words:**
The HTML parser processes markup sequentially from top to bottom.
- When it encounters a `<script src="app.js">` without `defer`/`async`, parsing **halts completely** while the network fetches and executes the file.
- **Speculative / Preload Scanner**:
  - A secondary, lightweight thread that scans ahead in the raw HTML stream while the main parser is blocked.
  - Detects external resources (`<img>`, `<link rel="stylesheet">`, `<script>`) and initiates background network requests early, preventing network idle time.
- CSS is **render-blocking** (the browser will not render pixels until CSSOM is constructed, preventing Flash of Unstyled Content - FOUC).

---

### 26. Web Workers: Offloading CPU-Intensive Tasks from the Main Thread.
**In Simple Words:**
JavaScript runs on a single thread. Running a 3-second data encryption or image filtering computation freezes the entire UI, rendering animations choppy and blocking user clicks.
**Web Workers** execute JavaScript on a separate background OS thread:

```javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: massiveDataset });

worker.onmessage = (e) => {
  console.log('Result from worker:', e.data);
};
```
```javascript
// worker.js (Background thread - No access to DOM or window!)
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};
```

---

### 27. Service Workers: Lifecycle (`install`, `activate`, `fetch`) and Offline PWAs.
**In Simple Words:**
A **Service Worker** is an event-driven programmable network proxy sitting between the browser, the web application, and the network:

```
[ Web Application ] <==== HTTP Request ====> [ Service Worker Proxy ] <====> [ Network ]
                                                      |
                                                      v
                                              [ Cache Storage ]
```

#### The 3 Lifecycle Phases:
1. **`install`**: Service worker downloads and precaches static assets (`cache.addAll(['/', '/style.css', '/bundle.js'])`).
2. **`activate`**: Cleans up old, stale cache versions from previous service workers.
3. **`fetch`**: Intercepts every network request made by the web application. Can return cached data instantly (`Cache-First`), fall back to the network (`Network-First`), or use `Stale-While-Revalidate`.

---

### 28. Structured Data for SEO: JSON-LD, Microdata, and Schema.org.
**In Simple Words:**
Search engines use structured data to display **Rich Snippets** (star ratings, event dates, pricing, recipe cooking times):
- **JSON-LD (Google's Recommended Standard)**: Embedded inside a `<script type="application/ld+json">` tag in the `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "High-Performance Mechanical Keyboard",
  "image": "https://example.com/keyboard.jpg",
  "offers": {
    "@type": "Offer",
    "price": "149.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

---

### 29. Cross-Site Scripting (XSS) Prevention: Context-Aware Escaping and Content Security Policy (CSP).
**In Simple Words:**
Preventing malicious scripts from stealing session cookies or redirecting users:
1. **Never use `element.innerHTML` with untrusted data**: Always use `textContent` or sanitize with **DOMPurify** (`DOMPurify.sanitize(userInput)`).
2. **Content Security Policy (CSP)**: An HTTP response header instructing the browser which domains are permitted to execute scripts:
   ```http
   Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; object-src 'none';
   ```
   Blocks inline scripts (`<script>alert(1)</script>`) and untrusted third-party script injection!

---

### 30. The Popover API vs. `<dialog>`: Architectural Differences.
**In Simple Words:**
| Dimension | Native `<dialog>` | Popover API (`popover`) |
|---|---|---|
| **Primary Intent** | Modal dialogues requiring user action (Confirmations, Alerts) | Ephemeral UI disclosures (Dropdowns, tooltips, menus) |
| **Modal Mode** | Yes (`.showModal()` blocks background interaction) | Non-modal by default (Interactions pass through) |
| **Top Layer** | Only when opened via `.showModal()` | Always rendered in Top Layer |
| **Light Dismiss** | Requires custom JS click listeners | Built-in native light dismiss on outside click |
| **Accessibility Role** | Implicit `role="dialog"` | No implicit role (Accessible attributes required) |

---

### 31. Canvas (`<canvas>`) vs. SVG (`<svg>`): Performance and Architectural Trade-Offs.
**In Simple Words:**
- **SVG (Scalable Vector Graphics)**:
  - Vector-based XML DOM elements. Infinitely sharp scaling.
  - Each shape (`<circle>`, `<path>`) is an individual node in the browser DOM.
  - *Bottleneck*: Having $> 5,000$ SVG DOM nodes causes severe layout thrashing and DOM memory bloat.
  - *Best for*: Icons, charts, logos, user interfaces.
- **Canvas (`<canvas>`)**:
  - Immediate-mode bitmap pixel surface rendered via JavaScript 2D context or WebGL.
  - The browser sees only a single DOM element (`<canvas>`).
  - *Best for*: High-performance games, 100,000 data points scatterplots, real-time video manipulation.

---

### 32. File System Access API (`showOpenFilePicker`): Direct File Operations.
**In Simple Words:**
Replaces legacy `<input type="file">` by allowing web applications to read, edit, and save files directly to the user's local operating system:
```javascript
// Opens native OS file picker
const [fileHandle] = await window.showOpenFilePicker({
  types: [{ description: 'Text Files', accept: { 'text/plain': ['.txt'] } }]
});

// Read contents
const file = await fileHandle.getFile();
const contents = await file.text();

// Save modifications back to the exact same file!
const writable = await fileHandle.createWritable();
await writable.write('Updated content');
await writable.close();
```

---

### 33. Web Components Lifecycle Hooks.
**In Simple Words:**
The 4 native lifecycle callback methods of custom elements:
1. **`connectedCallback()`**: Invoked each time the custom element is appended into a document-connected DOM tree. (Initialize listeners, fetch data).
2. **`disconnectedCallback()`**: Invoked when removed from the DOM. (Clean up timers and event listeners).
3. **`adoptedCallback()`**: Invoked when moved to a new document (e.g. across `<iframe>` boundaries).
4. **`attributeChangedCallback(name, oldValue, newValue)`**: Invoked when an observed attribute (listed in `static get observedAttributes()`) is updated.

---

### 34. BroadcastChannel API and Web Locks API for Multi-Tab Coordination.
**In Simple Words:**
1. **`BroadcastChannel`**: Allows different browser tabs or windows from the same origin to communicate in real-time:
   ```javascript
   const authChannel = new BroadcastChannel('auth');
   // Tab A logs out:
   authChannel.postMessage({ action: 'LOGOUT' });

   // Tab B receives message and redirects to login:
   authChannel.onmessage = (e) => {
     if (e.data.action === 'LOGOUT') window.location.href = '/login';
   };
   ```
2. **Web Locks API (`navigator.locks.request`)**: Acquires an atomic lock across all browser tabs, preventing race conditions (e.g., ensuring only ONE tab synchronizes offline data to the server at a time).

---

### 35. The WHATWG Living Standard Governance and Feature Lifecycles.
**In Simple Words:**
Unlike older standards (HTML 4.01, XHTML) managed by the W3C with slow 5-year version freezes:
- HTML is now governed by the **WHATWG (Web Hypertext Application Technology Working Group)** as a continuously evolving **Living Standard**.
- Browser vendors (Google, Apple, Mozilla, Microsoft) collaborate directly.
- **TC39 & W3C Collaboration**: Features progress through standardized incubation stages (proposal, prototype behind flags, cross-engine interoperability via **Interop**, and final Baseline inclusion).

