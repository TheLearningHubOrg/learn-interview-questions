const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'tracks', '01-frontend-angular-ts.md');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Upgraded Q21
const q21New = `### 21. What is the purpose of *ngFor directive?

Angular templates provide iterative rendering to display collections of items. You can render collections using either the **Classic Built-in Structural Directive (\`*ngFor\`)** or the modern **Built-in Control Flow (\`@for\`)** introduced in Angular 17+.

#### 1. Classic Built-in Syntax: \`*ngFor\` Directive

The \`*ngFor\` structural directive iterates over an iterable (such as an Array) and instantiates a template block for each item.

\`\`\`html
<!-- Classic *ngFor syntax (requires CommonModule or NgFor import) -->
<ul>
  <li *ngFor="let user of users; let i = index; trackBy: trackByUserId">
    {{ i + 1 }}. {{ user.name }} ({{ user.role }})
  </li>
  <li *ngIf="users.length === 0">No users found.</li>
</ul>
\`\`\`

In your TypeScript component:
\`\`\`typescript
trackByUserId(index: number, user: User): number {
  return user.id;
}
\`\`\`

#### 2. Modern Built-in Control Flow: \`@for\` Block (Angular 17+)

Angular 17 introduced declarative built-in control flow directly into the template compiler. The \`@for\` block requires zero imports (\`CommonModule\` is unnecessary) and provides a **mandatory** \`track\` expression for optimal DOM reconciliation:

\`\`\`html
<!-- Modern Built-in Control Flow syntax (Angular 17+) -->
<ul>
  @for (user of users; track user.id; let i = $index) {
    <li>{{ i + 1 }}. {{ user.name }} ({{ user.role }})</li>
  } @empty {
    <li>No users found.</li>
  }
</ul>
\`\`\`

#### 3. Side-by-Side Comparison: Classic vs Built-in Control Flow

| Feature | Classic \`*ngFor\` Directive | Modern \`@for\` Built-in Block |
| :--- | :--- | :--- |
| **Imports Required** | Requires \`CommonModule\` or \`NgFor\` | ⚡ **Zero imports** (built directly into template compiler) |
| **Tracking / Keys** | Optional \`trackBy: fn\` (leads to DOM thrashing if omitted) | 🛡️ **Mandatory \`track\` expression** (\`track item.id\` or \`track $index\`) |
| **Empty State** | Requires separate \`*ngIf="users.length === 0"\` | Built-in \`@empty { ... }\` block |
| **Contextual Variables** | \`let i = index; let f = first\` | Built-in \`$index\`, \`$first\`, \`$last\`, \`$even\`, \`$odd\`, \`$count\` |
| **Runtime Performance** | Directive wrapper and comment anchor overhead | **Up to 90% faster** execution in benchmarks |`;

// 2. Upgraded Q22
const q22New = `### 22. What is the purpose of *ngIf directive?

Angular provides conditional rendering to show or hide portions of the DOM based on a truthy/falsy condition. You can implement conditional rendering using the **Classic Built-in Structural Directive (\`*ngIf\`)** or the modern **Built-in Control Flow (\`@if\`)** introduced in Angular 17+.

#### 1. Classic Built-in Syntax: \`*ngIf\` Directive

The \`*ngIf\` directive conditionally adds or removes elements from the DOM. An optional \`else\` clause references an \`<ng-template>\` element via a template reference variable:

\`\`\`html
<!-- Classic *ngIf with else template (requires CommonModule or NgIf import) -->
<div *ngIf="isLoggedIn; else loginPrompt">
  <p>Welcome back, {{ currentUser.name }}!</p>
  <button (click)="logout()">Sign Out</button>
</div>

<ng-template #loginPrompt>
  <p>Please log in to continue.</p>
  <button (click)="login()">Sign In</button>
</ng-template>
\`\`\`

#### 2. Modern Built-in Control Flow: \`@if\` Block (Angular 17+)

The modern \`@if\` control flow replaces the verbose \`<ng-template>\` else pattern with intuitive JavaScript-like control blocks, supporting \`@else if\` and \`@else\` natively:

\`\`\`html
<!-- Modern Built-in Control Flow syntax (Angular 17+) -->
@if (isLoggedIn) {
  <p>Welcome back, {{ currentUser.name }}!</p>
  <button (click)="logout()">Sign Out</button>
} @else if (isGuest) {
  <p>Browsing as guest. Some features are restricted.</p>
  <button (click)="login()">Upgrade Account</button>
} @else {
  <p>Please log in to continue.</p>
  <button (click)="login()">Sign In</button>
}
\`\`\`

#### 3. Side-by-Side Comparison: Classic vs Built-in Control Flow

| Feature | Classic \`*ngIf\` Directive | Modern \`@if\` Built-in Block |
| :--- | :--- | :--- |
| **Imports Required** | Requires \`CommonModule\` or \`NgIf\` | ⚡ **Zero imports** |
| **Else Branching** | Requires \`<ng-template #ref>\` boilerplate | Intuitive \`@else { ... }\` block |
| **Else-If Chaining** | Clunky nesting of multiple \`*ngIf\` containers | Native \`@else if (condition) { ... }\` |
| **Type Narrowing** | Basic type narrowing | Advanced automatic TypeScript type narrowing across branches |
| **DOM Behavior** | Adds/removes element from DOM tree | Adds/removes element from DOM tree (optimized AST) |`;

// 3. Upgraded Q25
const q25New = `### 25. What are template expressions?

A **template expression** in Angular produces a value similar to any JavaScript expression. Angular executes the expression during change detection and assigns the computed result to a property of a binding target—such as an HTML element attribute, a component \`@Input()\`, or a directive property.

#### 1. Common Template Expression Usages

- **Property Binding (\`[property]="expression"\`)**:
  \`\`\`html
  <button [disabled]="isSubmitting || !userForm.valid">Save Changes</button>
  <img [src]="userProfile.avatarUrl" [alt]="userProfile.displayName" />
  \`\`\`
- **Interpolation (\`{{ expression }}\`)**:
  \`\`\`html
  <h3>{{ user.firstName + ' ' + user.lastName }}, welcome to Angular!</h3>
  \`\`\`

#### 2. Prohibited JavaScript Expressions in Template Expressions

Angular deliberately restricts template expressions to keep templates declarative, secure, idempotent, and free of side effects. Template expressions **must not alter application state** because expressions are evaluated repeatedly on change detection cycles.

| Prohibited Syntax | Example | Reason for Prohibition |
| :--- | :--- | :--- |
| **Assignments** | \`count = 5\`, \`user.name = 'John'\`, \`a += 1\` | Violates unidirectional data flow; causes \`ExpressionChangedAfterItHasBeenCheckedError\`. |
| **Object Instantiation** | \`new Date()\`, \`new UserService()\` | Creates new object references on every render pass, destroying memoization and triggering infinite change detection loops. |
| **Chaining Operators** | \`;\` (semicolon) or \`,\` (comma) | Templates should not execute sequences of imperative statements. |
| **Increment / Decrement** | \`count++\`, \`--total\` | Modifies variable state during rendering (unintended side effect). |
| **Bitwise Operators** | \`a \\| b\`, \`x & y\` | Ambiguous conflict with Angular template pipe syntax (\`\\|\`). |

> [!NOTE]
> **Idempotence & Purity**: Angular template expressions should be **idempotent**—invoking the expression multiple times with identical inputs must return the exact same result without mutating application state. If an expression alters a component property during evaluation, Angular's change detection throws \`ExpressionChangedAfterItHasBeenCheckedError\` in development mode.

#### 3. Allowed vs Prohibited Syntax Comparison

\`\`\`html
<!-- ✅ VALID: Pure, idempotent evaluation -->
<div [class.active]="selectedTab === 'profile'">
  <span>Balance: {{ formatCurrency(account.balance) }}</span>
  <p>Items: {{ items.length > 0 ? items.join(', ') : 'None' }}</p>
</div>

<!-- ❌ INVALID: Prohibited syntax causes compile-time Template parse error -->
<!-- <div [title]="currentCount++"></div> -->
<!-- <span>{{ new Date().toLocaleTimeString() }}</span> -->
<!-- <button [disabled]="status = 'pending'"></button> -->
\`\`\``;

// 4. Upgraded Q26
const q26New = `### 26. What are template statements?

A **template statement** responds to an event raised by a binding target, such as an HTML element, component output (\`@Output()\`), or directive. Template statements appear in quotes to the right of the \`(event)\` symbol in event binding syntax: \`(event)="statement"\`.

#### 1. Event Binding Syntax Examples

\`\`\`html
<!-- Calling a component method -->
<button (click)="onSaveProfile()">Save Profile</button>

<!-- Calling a method with the DOM event object ($event) -->
<input (input)="onSearchQueryChange($event)" placeholder="Search..." />

<!-- Inline statement execution -->
<button (click)="isExpanded = !isExpanded">Toggle</button>
\`\`\`

#### 2. Template Expressions vs. Template Statements Comparison

| Dimension | Template Expression (\`[prop]="expr"\`, \`{{ expr }}\`) | Template Statement (\`(event)="stmt"\`) |
| :--- | :--- | :--- |
| **Primary Purpose** | Read data and compute a view value | Respond to user interactions and trigger actions |
| **Side Effects** | ❌ **Strictly Prohibited** (must be pure & idempotent) | ✅ **Allowed & Expected** (updates component state, triggers APIs) |
| **Return Value** | Required (assigned to binding target) | Ignored (typically returns \`void\`) |
| **Execution Timing** | Automatically on every Change Detection tick | Only when the bound DOM or component event fires |
| **Chaining (\`;\`)** | ❌ Prohibited | ✅ Allowed (e.g., \`(click)="save(); closeModal()"\`) |
| **Assignment (\`=\`)** | ❌ Prohibited | ✅ Allowed (e.g., \`(click)="isOpen = false"\`) |

#### 3. Prohibited Syntax in Template Statements

Even though template statements allow side effects, Angular still disallows certain JavaScript constructs for security and sanity:
- \`new\` keyword (instantiating classes should happen in TypeScript component logic).
- Increment and decrement operators (\`++\` and \`--\`).
- Bitwise operators (\`|\` and \`&\`).
- Template pipe operators (\`|\` cannot be used inside event statements).`;

// 5. Upgraded Q201
const q201New = `### 201. What is the difference between ngIf and hidden property?

Both \`*ngIf\` (or modern \`@if\`) and the HTML \`[hidden]\` property control whether content is visible to the user, but they work through fundamentally different mechanisms with significant performance and lifecycle implications.

#### 1. Technical Differences Breakdown

| Feature | \`*ngIf\` / Modern \`@if\` (Conditional Rendering) | \`[hidden]\` (CSS Display Toggling) |
| :--- | :--- | :--- |
| **DOM Tree State** | **Physically adds or removes** elements from the DOM tree. | **Keeps element in the DOM tree**; toggles CSS \`display: none\`. |
| **Component Lifecycle** | Destroys components on \`false\` (\`ngOnDestroy\`), recreates on \`true\` (\`ngOnInit\`). | Components remain alive; no lifecycle hooks fire on toggle. |
| **Memory Footprint** | Low: frees memory and destroys subscriptions/event listeners when false. | High: retains DOM nodes, component instances, and listeners in memory. |
| **Toggle Performance** | Slower toggle: DOM creation, compilation, and layout thrashing. | **Instant toggle**: only triggers a browser style recalculation. |
| **Security / Inspection**| Secure: sensitive data is never present in the client DOM when false. | ⚠️ Insecure: elements and content remain visible via Browser DevTools! |
| **Initial Render Cost** | Fast initial render if condition is false (skips child compilation). | Slower initial render (all elements must be created and styled). |

#### 2. Code Comparison: Classic vs Modern Built-in Flow

\`\`\`html
<!-- 1. Modern Built-in Control Flow (@if) - Recommended for conditional lifecycles -->
@if (hasAdminPrivileges) {
  <admin-audit-panel [metrics]="systemMetrics" />
}

<!-- 2. Classic Structural Directive (*ngIf) -->
<admin-audit-panel *ngIf="hasAdminPrivileges" [metrics]="systemMetrics"></admin-audit-panel>

<!-- 3. [hidden] Binding - Best for lightweight, frequently toggled UI like accordion tabs -->
<div [hidden]="activeTab !== 'overview'" class="tab-pane">
  <p>Frequently toggled content (preserves form inputs and scroll position)</p>
</div>
\`\`\``;

// 6. Upgraded Q203
const q203New = `### 203. What is index property in ngFor directive?

The \`index\` property returns the zero-based numeric position of each item during a template iteration. Angular provides contextual variables in both the **Classic Built-in Directive (\`*ngFor\`)** and the **Modern Built-in Control Flow (\`@for\`)**.

#### 1. Classic \`*ngFor\` Contextual Variables

In classic \`*ngFor\`, you declare template input variables using the \`let varName = property\` syntax:

\`\`\`html
<ul>
  <li *ngFor="let todo of todos; let i = index; let isFirst = first; let isLast = last; let isEven = even; let isOdd = odd; let total = count">
    [{{ i + 1 }} of {{ total }}] {{ todo.name }}
    <span *ngIf="isFirst" class="badge">FIRST</span>
    <span *ngIf="isLast" class="badge">LAST</span>
  </li>
</ul>
\`\`\`

#### 2. Modern Built-in Control Flow: \`@for\` Variables (Angular 17+)

In modern \`@for\`, Angular provides built-in contextual variables prefixed with \`$\` that are accessible directly inside the loop:

\`\`\`html
<ul>
  @for (todo of todos; track todo.id; let i = $index, total = $count) {
    <li [class.even-row]="$even" [class.odd-row]="$odd">
      [{{ i + 1 }} of {{ total }}] {{ todo.name }}
      @if ($first) { <span class="badge">FIRST</span> }
      @if ($last) { <span class="badge">LAST</span> }
    </li>
  }
</ul>
\`\`\`

#### 3. Available Contextual Variables Reference Table

| Variable Name (\`*ngFor\`) | Built-in Variable (\`@for\`) | Type | Description |
| :--- | :--- | :--- | :--- |
| \`index\` | \`$index\` | \`number\` | Zero-based index of the current item (0, 1, ...). |
| \`count\` | \`$count\` | \`number\` | Total number of items in the iterable. |
| \`first\` | \`$first\` | \`boolean\` | \`true\` if current item is the first item. |
| \`last\` | \`$last\` | \`boolean\` | \`true\` if current item is the last item. |
| \`even\` | \`$even\` | \`boolean\` | \`true\` if current index is an even number. |
| \`odd\` | \`$odd\` | \`boolean\` | \`true\` if current index is an odd number. |`;

// 7. Upgraded Q204
const q204New = `### 204. What is the purpose of ngFor trackBy?

The \`trackBy\` function in \`*ngFor\` (and mandatory \`track\` in \`@for\`) is a critical performance optimization mechanism for DOM reconciliation when rendering collections.

#### 1. The Problem: Default Reference Checking

By default, without identity tracking, when an array changes (e.g., when refreshed from an API), Angular compares object references (\`===\`). Even if the items contain identical data, new object references cause Angular to:
1. Tear down all existing DOM elements in the list.
2. Re-create and re-insert new DOM elements from scratch.
3. Cause screen flickering, loss of scroll position, and loss of focused input states.

#### 2. Classic Built-in Syntax: \`*ngFor\` with \`trackBy\`

In classic \`*ngFor\`, you write a method in your component and pass it via \`trackBy: trackById\`:

\`\`\`typescript
// Component TypeScript logic
trackById(index: number, todo: Todo): number {
  return todo.id; // Returns unique identity
}
\`\`\`

\`\`\`html
<!-- Component Template -->
<div *ngFor="let todo of todos; trackBy: trackById">
  ({{ todo.id }}) {{ todo.name }}
</div>
\`\`\`

#### 3. Modern Built-in Control Flow: Mandatory \`track\` in \`@for\` (Angular 17+)

In Angular 17+, \`track\` is **strictly mandatory** in \`@for\`. You can write the identity expression directly in the template without creating helper functions in the component:

\`\`\`html
<!-- Direct property tracking (Zero component boilerplate) -->
@for (todo of todos; track todo.id) {
  <div>({{ todo.id }}) {{ todo.name }}</div>
}

<!-- Fallback for primitive arrays without unique IDs -->
@for (item of tags; track $index) {
  <span class="tag">{{ item }}</span>
}
\`\`\`

#### 4. Performance Comparison: With vs Without Tracking

\`\`\`text
Without track / trackBy:
[Item A (0x01), Item B (0x02)] -> API Reload -> [Item A (0x03), Item B (0x04)]
Angular destroys 2 DOM nodes and creates 2 new DOM nodes!

With track / trackBy (track item.id):
[Item A (id=1), Item B (id=2)] -> API Reload -> [Item A (id=1), Item B (id=2)]
Angular detects id=1 and id=2 exist! Re-uses identical DOM nodes, only updating changed text!
\`\`\``;

// 8. Upgraded Q205
const q205New = `### 205. What is the purpose of ngSwitch directive?

The \`ngSwitch\` directive conditionally swaps DOM elements based on a matching expression, functioning like a JavaScript \`switch\` statement. Angular supports both the **Classic Built-in Directives (\`ngSwitch\`, \`*ngSwitchCase\`, \`*ngSwitchDefault\`)** and the **Modern Built-in Control Flow (\`@switch\`, \`@case\`, \`@default\`)**.

#### 1. Classic Built-in Directives: \`ngSwitch\`

Classic \`ngSwitch\` requires a parent container with the \`[ngSwitch]\` property binding, combined with \`*ngSwitchCase\` and \`*ngSwitchDefault\` structural directives on child elements:

\`\`\`html
<!-- Classic ngSwitch syntax (requires CommonModule or NgSwitch import) -->
<div [ngSwitch]="userRole">
  <admin-dashboard *ngSwitchCase="'admin'" [user]="currentUser"></admin-dashboard>
  <moderator-panel *ngSwitchCase="'moderator'" [user]="currentUser"></moderator-panel>
  <editor-view *ngSwitchCase="'editor'" [user]="currentUser"></editor-view>
  <standard-user-view *ngSwitchDefault [user]="currentUser"></standard-user-view>
</div>
\`\`\`

#### 2. Modern Built-in Control Flow: \`@switch\` (Angular 17+)

The modern \`@switch\` block eliminates the need for wrapper HTML elements, provides cleaner indentation, and supports strict type narrowing:

\`\`\`html
<!-- Modern Built-in Control Flow syntax (Angular 17+) -->
@switch (userRole) {
  @case ('admin') {
    <admin-dashboard [user]="currentUser" />
  }
  @case ('moderator') {
    <moderator-panel [user]="currentUser" />
  }
  @case ('editor') {
    <editor-view [user]="currentUser" />
  }
  @default {
    <standard-user-view [user]="currentUser" />
  }
}
\`\`\`

#### 3. Key Differences: Classic vs Built-in \`@switch\`

| Feature | Classic \`[ngSwitch]\` Directives | Modern \`@switch\` Built-in Block |
| :--- | :--- | :--- |
| **Imports** | Requires \`CommonModule\`, \`NgSwitch\`, \`NgSwitchCase\`, \`NgSwitchDefault\` | ⚡ **Zero imports required** |
| **Container Element** | Requires a host DOM element (e.g., \`<div>\` or \`<ng-container>\`) | No container element needed |
| **Type Checking** | Loose type checking on case values | **Strict type narrowing** across branches |
| **Performance** | Three separate directive instances per case | Single optimized compiler instruction |`;

// 9. Upgraded Q269
const q269New = `### 269. How to set ngFor and ngIf on the same element?

In Angular, placing both \`*ngFor\` and \`*ngIf\` on the same HTML element is invalid and throws a compile-time template error:

\`\`\`cmd
Template parse errors: Can't have multiple template bindings on one element. Use only one attribute prefixed with *
\`\`\`

This error occurs because Angular expands asterisk (\`*\`) syntax into an \`<ng-template>\` wrapper. Having two asterisks on a single tag creates an ambiguous nesting hierarchy for the template compiler.

#### 1. Classic Solution: Using \`<ng-container>\`

In classic Angular, you resolve this by placing one of the structural directives on an \`<ng-container>\` wrapper. The \`<ng-container>\` is a logical grouping element that Angular does not render into the final DOM:

\`\`\`html
<!-- Scenario A: Render the list only if items array exists -->
<ng-container *ngIf="users && users.length > 0; else noUsersTemplate">
  <ul>
    <li *ngFor="let user of users; trackBy: trackById">
      {{ user.name }}
    </li>
  </ul>
</ng-container>

<ng-template #noUsersTemplate>
  <p>No users registered.</p>
</ng-template>

<!-- Scenario B: Filter items inside the loop (only render active users) -->
<ul>
  <ng-container *ngFor="let user of users; trackBy: trackById">
    <li *ngIf="user.isActive">
      {{ user.name }}
    </li>
  </ng-container>
</ul>
\`\`\`

#### 2. Modern Solution: Built-in Control Flow (\`@if\` and \`@for\`) (Angular 17+)

In modern Angular (v17+), built-in control flow completely eliminates the multiple-structural-directive conflict because \`@if\` and \`@for\` are native template blocks rather than directive attributes:

\`\`\`html
<!-- Clean, natural nesting with zero dummy containers -->
@if (users && users.length > 0) {
  <ul>
    @for (user of users; track user.id) {
      @if (user.isActive) {
        <li>{{ user.name }}</li>
      }
    }
  </ul>
} @else {
  <p>No users registered.</p>
}
\`\`\`

#### 3. Best Practice Architectural Recommendation

> [!TIP]
> **Filtering in Templates vs. Component Signals**: While nesting \`@if\` inside \`@for\` works, filtering large collections directly in the template can hurt performance. Instead, use a **computed Signal** in your component to pre-filter items:
> \`\`\`typescript
> activeUsers = computed(() => this.users().filter(u => u.isActive));
> \`\`\`
> In template:
> \`\`\`html
> @for (user of activeUsers(); track user.id) {
>   <li>{{ user.name }}</li>
> }
> \`\`\``;

// Helper to replace a question between "### N." and "### N+1."
function replaceQuestion(num, nextNum, newContent) {
  const startMarker = '### ' + num + '.';
  const nextMarker = '### ' + nextNum + '.';
  const startIndex = content.indexOf(startMarker);
  const nextIndex = content.indexOf(nextMarker);
  if (startIndex === -1 || nextIndex === -1) {
    throw new Error('Could not find markers for Q' + num + ' or Q' + nextNum);
  }
  content = content.slice(0, startIndex) + newContent + '\n\n' + content.slice(nextIndex);
}

replaceQuestion(21, 22, q21New);
replaceQuestion(22, 23, q22New);
replaceQuestion(25, 26, q25New);
replaceQuestion(26, 27, q26New);
replaceQuestion(201, 202, q201New);
replaceQuestion(203, 204, q203New);
replaceQuestion(204, 205, q204New);
replaceQuestion(205, 206, q205New);
replaceQuestion(269, 270, q269New);

// Remove any remaining raw horizontal dashes like "----------------------------------"
content = content.replace(/^[-]{4,}$/gm, '');

// Clean up unspaced lists across the file:
// When a regular prose line is immediately followed by a list item without a blank line
const lines = content.split('\n');
const fixedLines = [];
let inCodeBlock = false;
let listFixCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.trim().startsWith('```')) {
    inCodeBlock = !inCodeBlock;
    fixedLines.push(line);
    continue;
  }
  
  if (!inCodeBlock && i > 0) {
    const prevLine = lines[i - 1];
    const isListItem = /^\s*(?:\d+\.|\-|\*)\s+/.test(line);
    const prevIsListItem = /^\s*(?:\d+\.|\-|\*)\s+/.test(prevLine);
    const prevIsBlank = prevLine.trim() === '';
    const prevIsHeading = prevLine.trim().startsWith('#');
    const prevIsTable = prevLine.trim().startsWith('|');
    const prevIsBlockquote = prevLine.trim().startsWith('>');
    
    // Only insert if prevLine is regular prose and this is the start of a list
    if (isListItem && !prevIsListItem && !prevIsBlank && !prevIsHeading && !prevIsTable && !prevIsBlockquote) {
      fixedLines.push('');
      listFixCount++;
    }
  }
  fixedLines.push(line);
}

content = fixedLines.join('\n');
console.log('Fixed unspaced list starts:', listFixCount);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated tracks/01-frontend-angular-ts.md');
