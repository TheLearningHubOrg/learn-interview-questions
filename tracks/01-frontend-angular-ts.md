# Complete Master Interview Question Bank: Angular, TypeScript, JavaScript & Web Standards (1 - 235)

> Comprehensive, production-tested technical interview questions and deep-dive answers covering Angular (v2 through v19+), modern TypeScript, core JavaScript internals, live coding algorithms, enterprise architecture, HTML5 semantics, and CSS3 layouts.

---

## Table of Contents
- [Part 1: Interview Intro & Project Experience (1 - 7)](#part-1-interview-intro--project-experience-1---7)
- [Part 2: Angular Interview Questions (8 - 77)](#part-2-angular-interview-questions-8---77)
- [Part 3: JavaScript Core Internals & Advanced Patterns (78 - 160)](#part-3-javascript-core-internals--advanced-patterns-78---160)
- [Part 4: Live Coding & Client Scenarios (161 - 175)](#part-4-live-coding--client-scenarios-161---175)
- [Part 5: HTML5 & Modern Semantics (176 - 185)](#part-5-html5--modern-semantics-176---185)
- [Part 6: Modern CSS3, Layouts & Architecture (186 - 195)](#part-6-modern-css3-layouts--architecture-186---195)
- [Part 7: Enterprise Architecture, Framework Internals & Performance (196 - 225)](#part-7-enterprise-architecture-framework-internals--performance-196---225)
- [Part 8: Advanced TypeScript, Tooling & Performance (226 - 235)](#part-8-advanced-typescript-tooling--performance-226---235)

---

## Part 1: Interview Intro & Project Experience (1 - 7)

### 1. Give a brief introduction (keep it candid, not formal).
**Answer:**
"I am a Senior Frontend / Full-Stack Engineer with over X years of hands-on experience building mission-critical enterprise single-page applications. My core expertise centers on the modern Angular ecosystem, TypeScript, reactive state architectures (RxJS and Angular Signals), and performant web standards. Day-to-day, I focus not just on UI feature delivery, but on component design systems, state boundaries, bundle optimization, and robust integration with backend REST/GraphQL services. I enjoy peeling back framework abstractions to understand how the browser's rendering engine and runtime actually execute code."

### 2. What is your role in your current project? Explain it.
**Answer:**
- **Architecture & Scaffolding**: Designing standalone component trees, modular route architectures with lazy loading and deferrable views (`@defer`), and state management topologies (Signals + RxJS / NgRx).
- **Core Feature Development**: Delivering complex user flows—such as real-time multi-step financial workflows, interactive dashboards, and role-based access control (RBAC) surfaces.
- **Performance & Governance**: Auditing Core Web Vitals (LCP, INP, CLS), establishing custom linting and strict TypeScript boundaries, optimizing Change Detection with `OnPush` and zoneless strategies.
- **Cross-Functional Alignment**: Partnering with UI/UX designers to translate Figma tokens into reusable component libraries and collaborating with backend teams to establish strict OpenAPI / Swagger schema contracts.

### 3. Any experience building APIs or server-side code? (UI role with some API work).
**Answer:**
"Yes. While my primary focus is frontend architecture, I regularly write and maintain backend services. I have built RESTful APIs and middleware using Node.js (Express, NestJS, Fastify) and Python (FastAPI). In modern full-stack workflows, I also handle Angular SSR / hydration with Node engines, design BFF (Backend-for-Frontend) gateway patterns to aggregate upstream microservices, implement JWT authentication flows, and manage database queries using PostgreSQL and Redis caching layers."

### 4. Did you start with Angular? Do you have core JavaScript experience? Are you comfortable coding in plain JavaScript?
**Answer:**
"I started with vanilla JavaScript (ES5/ES6), building DOM manipulations, AJAX wrappers, and closures from scratch before transitioning to AngularJS (1.x) and then modern Angular (2 through 19+). Being grounded in raw JavaScript is essential because frameworks are temporary abstractions over the browser platform. I am completely comfortable writing vanilla JavaScript without any library—implementing custom event emitters, deep-clone utilities, promise polyfills, intersection observers, and prototype manipulation."

### 5. Which is the latest Angular version you have worked with?
**Answer:**
"I actively work with **Angular 17, 18, and 19**. In these modern versions, I utilize:
- **Standalone Components & Directives** (eliminating legacy `NgModule` boilerplate).
- **Angular Signals** (`signal()`, `computed()`, `effect()`, signal inputs `input()`, signal outputs `output()`, and `model()`).
- **Built-in Control Flow Syntax** (`@if`, `@for` with mandatory `track`, `@switch`).
- **Deferrable Views** (`@defer (on viewport; prefetch on idle)`).
- **Experimental Zoneless Change Detection** (`provideExperimentalZonelessChangeDetection()`).
- Modern Vite + esbuild `application` builder."

### 6. Have you worked on custom pipes and custom directives?
**Answer:**
"Yes, extensively:
- **Custom Directives**: Created attribute directives for input masking, character restrictions (e.g., preventing special characters in text inputs), infinite scrolling via `IntersectionObserver`, auto-focus, and role-based element rendering via structural directives.
- **Custom Pipes**: Built pure pipes for currency formatting across multi-tenant currencies, relative time calculation ('3 minutes ago'), file-size byte conversions, and memoized search filter transforms."

### 7. Do you have experience in NgRx and writing test cases?
**Answer:**
"Yes.
- **NgRx**: Architected enterprise state using `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, and the modern `@ngrx/signals` (SignalStore). I leverage selectors with memoization (`createSelector`) to slice state and decouple UI from business logic.
- **Testing**: Proficient with Jasmine/Karma, Jest, and Vitest alongside Angular Testing Library (`render`, `screen`, `fireEvent`). I write unit tests for services, isolated pipe tests, mock HTTP calls using `HttpTestingController`, and write end-to-end tests using Playwright."

---

## Part 2: Angular Interview Questions (8 - 77)

### 8. Why were client-side frameworks like Angular introduced?
**Answer:**
Client-side frameworks were introduced to solve the limitations of traditional server-rendered multi-page applications (MPAs) and messy jQuery-style spaghetti code:
1. **Single Page Architecture (SPA)**: Load assets once; navigate seamlessly without full-page browser reloads.
2. **Declarative Data Binding**: Automatically sync the data model with the DOM.
3. **Component-Based Modularity**: Reusable, encapsulated building blocks combining template, styles, and logic.
4. **Separation of Concerns**: Clear architectural boundaries across Controllers/Components, Services, and Views.
5. **Built-in Enterprise Tooling**: Out-of-the-box routing, dependency injection, HTTP client, form management, and test runners.

### 9. How does an Angular application work?
**Answer:**
1. **Bootstrapping**: The browser loads `index.html`. `main.ts` is executed, calling `bootstrapApplication(RootComponent)` (or `platformBrowserDynamic().bootstrapModule(AppModule)` in legacy setups).
2. **Dependency Injection**: The root injector compiles the dependency tree, instantiating singletons and providers.
3. **Template Compilation & Rendering**: Angular compiles component templates into optimized JavaScript instructions (Ivy compiler) and renders HTML into the root tag `<app-root>`.
4. **Event & Change Detection**: User interactions trigger events. Zone.js (or Signal graphs in zoneless mode) detects mutations, runs Change Detection, reconciles view bindings, and updates the real DOM.

### 10. What are some of the advantages of Angular over other frameworks?
**Answer:**
- **Complete Batteries-Included Framework**: Routing, HTTP client, Reactive & Template forms, animations, and PWA support are first-party and maintained by Google.
- **First-Class TypeScript**: Strict static typing and compile-time verification across both code and templates.
- **Hierarchical Dependency Injection**: Powerful multi-level injector hierarchy enabling scoped service lifecycles.
- **Ivy Rendering Engine**: Incremental compilation, small bundles, tree-shakeable runtime code.
- **Automated CLI Migrations**: `ng update` automatically updates dependencies and rewrites deprecated APIs across major version leaps.

### 11. What are the advantages of Angular over React?
**Answer:**
| Feature | Angular | React |
| :--- | :--- | :--- |
| **Type** | Full-fledged opinionated framework | Lightweight UI library |
| **Ecosystem** | Integrated official solutions (Router, HTTP, Forms) | Fragmented third-party libraries |
| **Dependency Injection** | Built-in hierarchical DI container | Prop drilling / Context API / external DI |
| **Language** | Native TypeScript standard | JavaScript / JSX with optional TypeScript |
| **Templates** | HTML-based templates with scoped CSS | JSX (HTML embedded in JavaScript) |
| **Two-way Binding** | Built-in `[(ngModel)]` / `model()` | Manual handler binding (`value` + `onChange`) |

### 12. List out differences between AngularJS and Angular?
**Answer:**
- **Architecture**: AngularJS (1.x) was MVC/MVVM based on `$scope` and controllers; modern Angular (2+) is entirely component-driven.
- **Language**: AngularJS used JavaScript; Angular is built from the ground up in TypeScript.
- **Mobile & Performance**: AngularJS lacked mobile optimization and suffered from slow digest loops; Angular uses Ivy, hierarchical Change Detection, Ahead-Of-Time (AOT) compilation, and Signals.
- **Routing & DI**: Angular rewritten dependency injection with hierarchical injectors and modern class-based tokens.

### 13. How are Angular expressions different from JavaScript expressions?
**Answer:**
- **Context**: Angular expressions execute in the context of the component instance, not the global `window`.
- **Restricted Syntax**: Cannot execute `eval()`, `new`, bitwise operators `|` or `^`, or assignments with side effects in interpolation.
- **Null Safety**: Angular templates support the safe navigation operator (`user?.address?.city`) and null coalescing.
- **Pipes**: Angular expressions allow pipe syntax (`{{ amount | currency }}`).

### 14. What are Single Page Applications (SPA)?
**Answer:**
A Single Page Application is a web application that loads a single HTML shell (`index.html`) on initial request. Subsequent user interactions and navigations do not trigger full browser reloads; instead, JavaScript dynamically rewrites the DOM by fetching data payloads (JSON) from server APIs and managing browser history via the HTML5 History API (`pushState`, `replaceState`).

### 15. What are templates in Angular?
**Answer:**
Templates are the user-facing declarative view definitions written in HTML augmented with Angular template syntax (interpolation `{{ }}`, property binding `[prop]`, event binding `(event)`, two-way binding `[(model)]`, control flow `@if` / `@for`, and structural directives).

### 16. What are directives in Angular?
**Answer:**
Directives are classes with `@Directive()` metadata that add behavior to DOM elements.
1. **Component Directives**: Directives with an attached HTML template (`@Component()`).
2. **Structural Directives**: Manipulate DOM layout by adding or removing elements (e.g., `*ngIf`, `*ngFor`, `<ng-template>`).
3. **Attribute Directives**: Change the appearance or behavior of an existing element (e.g., `ngClass`, `ngStyle`, or custom mask directives).

### 17. Explain Components, Modules and Services in Angular.
**Answer:**
- **Component**: The core UI building block. Decorates a TypeScript class with `@Component({ selector, templateUrl/template, styleUrls })` holding state and view logic.
- **Module (`NgModule`)**: Legacy organizational container that bundled related components, directives, pipes, and services. In Angular 14+, standalone components make `NgModule` optional.
- **Service**: A reusable class decorated with `@Injectable({ providedIn: 'root' })` dedicated to business logic, state management, HTTP communication, and utility tasks.

### 18. What is the scope?
**Answer:**
In legacy AngularJS, `$scope` was the glue object passing data between the Controller and View. In modern Angular (2+), there is no `$scope` object; the component class instance itself is the scope against which its template bindings evaluate.

### 19. What is data binding in Angular?
**Answer:**
The mechanism that synchronizes data between the TypeScript component class and the HTML template:
- **One-way (Source to View)**: Interpolation `{{ value }}` and Property Binding `[property]="value"`.
- **One-way (View to Source)**: Event Binding `(click)="handleClick($event)"`.
- **Two-way**: `[(ngModel)]="property"` or Signal-based `[(model)]="prop"`.

### 20. What is two way data binding in Angular?
**Answer:**
Two-way data binding synchronizes state bidirectionally: template changes (e.g., typing in an input) immediately update the component variable, and component variable changes immediately re-render in the template.
Syntax: `[(ngModel)]="username"` (the 'banana in a box' syntax), which desugars to property binding `[ngModel]="username"` plus event binding `(ngModelChange)="username = $event"`.

### 21. What are Decorators and their types in Angular?
**Answer:**
Decorators are functions that attach metadata to TypeScript classes, methods, accessors, properties, or parameters.
1. **Class Decorators**: `@Component()`, `@Directive()`, `@Pipe()`, `@Injectable()`, `@NgModule()`.
2. **Property Decorators**: `@Input()`, `@Output()`, `@ViewChild()`, `@HostBinding()`.
3. **Method Decorators**: `@HostListener()`.
4. **Parameter Decorators**: `@Inject()`, `@Optional()`, `@Self()`, `@SkipSelf()`.

### 22. What are annotations in Angular?
**Answer:**
In TypeScript and Angular, "annotations" is an informal term often conflated with Decorators. While annotations in languages like Java simply provide static metadata, Angular Decorators are actual executable functions that modify or augment the class definition at runtime.

### 23. What are pure Pipes?
**Answer:**
A pure pipe (`@Pipe({ name: 'filter', pure: true })` - default) is executed **only** when Angular detects a pure change to the input value:
- For primitive types (string, number, boolean): change in value (`===`).
- For reference types (object, array): change in object reference (`!==`).
Pure pipes are heavily optimized and memoized.

### 24. What are impure pipes?
**Answer:**
An impure pipe (`@Pipe({ name: 'filter', pure: false })`) executes on **every single change detection cycle**, regardless of whether the input reference changed. Useful for detecting internal mutations in arrays or objects, but can severely degrade performance if expensive calculations are run.

### 25. What is Pipe transform Interface in Angular?
**Answer:**
`PipeTransform` is a TypeScript interface that requires implementing the `transform(value: any, ...args: any[]): any` method:
```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20, trail = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
```

### 26. Write a code where you have to share data from the Parent to Child Component?
**Answer:**
```typescript
// Child Component
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: `
    <p>Received: {{ message }}</p>
    <button (click)="notifyParent()">Send Response</button>
  `
})
export class ChildComponent {
  @Input({ required: true }) message!: string;
  @Output() response = new EventEmitter<string>();

  notifyParent() {
    this.response.emit('Hello from Child!');
  }
}

// Parent Component
@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ChildComponent],
  template: `
    <app-child [message]="parentMsg" (response)="onChildResponse($event)"></app-child>
    <p>Child said: {{ childFeedback }}</p>
  `
})
export class ParentComponent {
  parentMsg = 'Data from Parent';
  childFeedback = '';

  onChildResponse(msg: string) {
    this.childFeedback = msg;
  }
}
```

### 27. Create a TypeScript class with a constructor and a function.
**Answer:**
```typescript
export class Employee {
  private id: string;
  public name: string;
  public department: string;

  constructor(id: string, name: string, department: string) {
    this.id = id;
    this.name = name;
    this.department = department;
  }

  public getEmployeeSummary(): string {
    return `ID: ${this.id} | Name: ${this.name} | Dept: ${this.department}`;
  }
}
```

### 28. Angular by default uses client-side rendering. Can one make an Angular application render on the server side?
**Answer:**
Yes, using **Angular SSR** (formerly Angular Universal, now integrated via `@angular/ssr`).
In modern Angular:
- Run `ng add @angular/ssr`.
- Next-gen hydration reuses the server-rendered DOM instead of destroying and re-creating it, preventing layout flicker and boosting LCP.

### 29. What is Eager and Lazy loading?
**Answer:**
- **Eager Loading**: All components and modules are bundled in the initial payload and compiled upfront.
- **Lazy Loading**: Route-level code splitting where bundles are only downloaded over the network when the user navigates to that specific URL path:
```typescript
export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
  }
];
```

### 30. What is view encapsulation in Angular?
**Answer:**
View Encapsulation dictates how component styles are scoped:
1. `ViewEncapsulation.Emulated` (Default): Modifies CSS selectors by adding unique attributes (`_ngcontent-c12`) to prevent styles from leaking out.
2. `ViewEncapsulation.ShadowDom`: Uses native browser Web Components Shadow DOM for strict isolation.
3. `ViewEncapsulation.None`: Injects styles globally into the document head without scoping.

### 31. What is RxJS in Angular?
**Answer:**
RxJS (Reactive Extensions for JavaScript) is a reactive programming library that treats asynchronous events as streams (Observables). Angular uses RxJS across its core: HTTP requests (`HttpClient`), reactive form value streams (`valueChanges`), router events, and state management.

### 32. Explain string interpolation and property binding in Angular.
**Answer:**
- **String Interpolation `{{ expression }}`**: Embeds dynamic string expressions into the HTML text content.
- **Property Binding `[property]="expression"`**: Binds an expression directly to a DOM element property (e.g., `[disabled]="isSubmitting"` or `[src]="imageUrl"`). It preserves non-string data types (booleans, objects, arrays).

### 33. How are observables different from promises?
**Answer:**
| Feature | Promise | Observable (RxJS) |
| :--- | :--- | :--- |
| **Emission** | Emits a single value then resolves | Can emit multiple values over time (stream) |
| **Execution** | Eager (executes upon creation) | Cold/Lazy (does not execute until subscribed) |
| **Cancellation** | Cannot be cancelled natively | Cancelled via `.unsubscribe()` or `takeUntil` |
| **Operators** | Limited (`.then()`, `.catch()`, `.finally()`) | Rich declarative operators (`map`, `filter`, `switchMap`, `debounceTime`) |

### 34. Explain the concept of Dependency Injection?
**Answer:**
Dependency Injection (DI) is a design pattern where a class requests dependencies from an external source (the Injector) rather than instantiating them directly with `new`. Angular provides a hierarchical DI container that manages the creation, caching, and lifecycle of instances.

### 35. What are pipes in Angular? Explain with an example.
**Answer:**
Pipes are simple declarative functions used in templates to transform displayed values without altering the underlying data in the component.
Example: `{{ today | date:'mediumDate' }}` transforms a Date object into 'Nov 6, 2026'.

### 36. What exactly is a parameterized pipe?
**Answer:**
A pipe that accepts one or more arguments separated by colons (`:`):
`{{ salary | currency:'USD':'symbol':'1.2-2' }}`.

### 37. What are class decorators?
**Answer:**
Decorators placed directly on a class definition that provide metadata to the Angular compiler: `@Component()`, `@Directive()`, `@Pipe()`, `@Injectable()`.

### 38. What are Method decorators?
**Answer:**
Decorators applied to a method inside a class to intercept calls or attach DOM listeners: `@HostListener('window:resize', ['$event'])`.

### 39. What are property decorators?
**Answer:**
Decorators applied to class instance properties: `@Input()`, `@Output()`, `@ViewChild()`, `@HostBinding()`.

### 40. What is the Component Decorator in Angular?
**Answer:**
A class decorator that marks a class as an Angular component and supplies configuration metadata: `selector`, `standalone`, `imports`, `templateUrl`/`template`, `styleUrls`/`styles`, `changeDetection`, `encapsulation`.

### 41. What are lifecycle hooks in Angular? Explain a few.
**Answer:**
Methods called during specific phases of a component's lifecycle:
1. `ngOnChanges()`: Called when data-bound `@Input` properties change.
2. `ngOnInit()`: Called once after the first `ngOnChanges`; ideal for initial data fetching.
3. `ngDoCheck()`: Custom change detection checking.
4. `ngAfterViewInit()`: Called after the component's view and child views are fully initialized (DOM available).
5. `ngOnDestroy()`: Cleanup logic before the component is destroyed (unsubscribing, clearing timers).

### 42. What are router links?
**Answer:**
An attribute directive (`routerLink="/dashboard"`) that turns elements into navigation links, updating the browser URL and routing without reloading the page.

### 43. What exactly is the router state?
**Answer:**
`RouterState` is a tree of activated routes (`ActivatedRoute`) representing the current state of the application routing tree, including params, queryParams, data, and fragments.

### 44. What does Angular Material mean?
**Answer:**
Angular Material is Google's official UI component library for Angular implementing Google's Material Design system with built-in accessibility (a11y), theming, and responsive design.

### 45. What is ngOnInit?
**Answer:**
A lifecycle hook called once after Angular has initialized all data-bound properties of a component. It is the best place to execute component setup and trigger initial HTTP requests.

### 46. What is transpiling in Angular?
**Answer:**
The process of compiling high-level TypeScript code into standard JavaScript (ES2022) understood by modern web browsers, performed by tools like `esbuild` or `tsc`.

### 47. What are HTTP interceptors?
**Answer:**
Classes or functions that intercept and transform outgoing HTTP requests and incoming HTTP responses globally (e.g., attaching Bearer authorization tokens, global error handling, logging, caching).

### 48. What is AOT compilation? What are the advantages of AOT?
**Answer:**
Ahead-Of-Time (AOT) compiles Angular HTML templates and TypeScript code into efficient JavaScript during the build process, as opposed to Just-In-Time (JIT) in the browser.
**Advantages**: Faster rendering, smaller download bundle size, template errors caught during build time, improved security (no `eval()` of templates).

### 49. What is Change Detection, and how does the Change Detection Mechanism work?
**Answer:**
The mechanism by which Angular tracks data changes and synchronizes them with the DOM:
- **Default Strategy**: Traverses the entire component tree from root to leaf on any browser event (clicks, timers, HTTP calls via Zone.js).
- **OnPush Strategy**: Skips a component subtree unless its `@Input()` reference changes, an event originates from within the component, an Observable bound via `async` pipe emits, or `markForCheck()` is explicitly called.

### 50. What is a bootstrapping module?
**Answer:**
In NgModule-based applications, the root module (`AppModule`) decorated with `@NgModule({ bootstrap: [AppComponent] })` passed to `bootstrapModule()` in `main.ts` to launch the app.

### 51. Explain MVVM architecture.
**Answer:**
Model-View-ViewModel architecture:
- **Model**: Business entities and data structures.
- **View**: The HTML template rendering the user interface.
- **ViewModel**: The TypeScript component class exposing data and command handlers to the view while keeping view logic separate from data access.

### 52. How do you choose an element from a component template?
**Answer:**
1. Template Reference Variable: `<input #searchInput>`
2. In TypeScript: `@ViewChild('searchInput') inputRef!: ElementRef<HTMLInputElement>;`
3. Access: `this.inputRef.nativeElement.focus();`

### 53. How does one share data between components in Angular?
**Answer:**
1. Parent to Child: `@Input()` or `input()`.
2. Child to Parent: `@Output()` with `EventEmitter` or `output()`.
3. Sibling / Unrelated: Shared singleton Service with Signals or RxJS `BehaviorSubject`.
4. Template access: `@ViewChild()` or Content Projection (`<ng-content>`).
5. Global Store: NgRx / SignalStore.

### 54. How do you deal with errors in observables?
**Answer:**
Using RxJS error-handling operators:
- `catchError()`: Intercepts an error, logs it, and returns a fallback Observable or re-throws.
- `retry()` / `retryWhen()`: Resubscribes to the source Observable a specified number of times with optional backoff.
- `EMPTY`: Silently terminates the stream cleanly.

### 55. How can I include SASS into an Angular project?
**Answer:**
Configure `angular.json`:
```json
"schematics": {
  "@schematics/angular:component": {
    "style": "scss"
  }
}
```
Or create a project using `ng new my-app --style=scss`.

### 56. What happens when you use the script tag within a template?
**Answer:**
Angular treats `<script>` tags inside templates as unsafe and strips them out automatically via its built-in DomSanitizer to prevent Cross-Site Scripting (XSS) attacks.

### 57. What are Angular Signals and how do they differ from RxJS Observables?
**Answer:**
- **Signals**: Synchronous reactive primitives introduced in Angular 16. A signal is a getter that holds a value (`signal(10)`), notifies dependents when updated (`set()`, `update()`), and automatically tracks dependencies in `computed()` and `effect()`. Signals do not require manual unsubscriptions.
- **RxJS Observables**: Asynchronous event streams that deliver multiple values over time, requiring subscriptions, cancellation management, and pipeline operators.

### 58. What are Standalone Components, and how do they eliminate NgModules?
**Answer:**
Components configured with `standalone: true` (default in Angular 17+). They directly declare their own dependencies via their `imports: [...]` array, completely eliminating the need for boilerplate `NgModule` declarations.

### 59. Explain the built-in Control Flow syntax (@if, @for, @switch) vs structural directives (*ngIf, *ngFor).
**Answer:**
- Built into the Angular compiler (no `CommonModule` import required).
- `@for` mandates a `track` expression (preventing common list re-rendering bugs).
- Up to 90% faster template type-checking and lower bundle size.
```html
@if (user.isLoggedIn) {
  <app-profile [user]="user" />
} @else {
  <app-login />
}

@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <p>No items found.</p>
}
```

### 60. What is the difference between Reactive Forms and Template-Driven Forms?
**Answer:**
- **Reactive Forms**: Synchronous, programmatic, scalable, defined in TypeScript (`FormGroup`, `FormControl`, `FormBuilder`). Complete control over validation, testable without DOM.
- **Template-Driven Forms**: Asynchronous, directives-based in HTML (`[(ngModel)]`, `ngForm`). Simpler for basic forms, but harder to unit test and maintain.

### 61. What are Route Guards and Functional Guards?
**Answer:**
Route Guards control navigation access (`canActivate`, `canDeactivate`, `canMatch`). Modern Angular uses **Functional Guards** instead of class-based guards:
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
```

### 62. Explain Content Projection with <ng-content>.
**Answer:**
Content projection allows a component to insert external HTML elements into placeholders inside its own template:
```html
<!-- Card Component -->
<div class="card">
  <div class="header"><ng-content select="[card-header]"></ng-content></div>
  <div class="body"><ng-content></ng-content></div>
</div>
```

### 63. What are the key flattening operators in RxJS (switchMap, mergeMap, concatMap, exhaustMap)?
**Answer:**
- `switchMap`: Cancels the previous inner observable when a new value arrives (ideal for autocomplete/search).
- `mergeMap`: Runs all inner observables concurrently without cancellation.
- `concatMap`: Queues inner observables sequentially, waiting for each to complete.
- `exhaustMap`: Ignores new incoming values while the current inner observable is running (ideal for login/submit buttons).

### 64. How do you prevent memory leaks in Angular subscriptions?
**Answer:**
1. Using the `async` pipe in templates (handles subscription and unsubscription automatically).
2. Using the `takeUntilDestroyed()` operator (Angular 16+).
3. Using `takeUntil(destroy$)` with `Subject` in `ngOnDestroy`.
4. Using `Subscription.add()` and unsubscribing in `ngOnDestroy`.

### 65. What is Deferrable Views (@defer) and how does it improve initial bundle performance?
**Answer:**
`@defer` enables declarative lazy-loading of template sections:
```html
@defer (on viewport; prefetch on idle) {
  <app-heavy-chart />
} @placeholder {
  <div class="skeleton">Chart Loading Placeholder</div>
} @loading (minimum 500ms) {
  <app-spinner />
} @error {
  <p>Failed to load chart.</p>
}
```
The JavaScript bundle for `<app-heavy-chart>` is completely extracted from the main bundle and loaded on-demand.

### 66. What is the difference between @ViewChild, @ViewChildren, @ContentChild, and @ContentChildren?
**Answer:**
- `@ViewChild` / `@ViewChildren`: Queries elements or components within the component's **own template**.
- `@ContentChild` / `@ContentChildren`: Queries projected elements passed into `<ng-content>`.

### 67. How does the Angular Hierarchical Dependency Injection system work?
**Answer:**
Angular has two injector hierarchies:
1. **EnvironmentInjector**: Root, Platform, and Route-scoped injectors.
2. **ElementInjector**: Created at each DOM element hosting a component/directive.
Angular resolution walks upward from the ElementInjector to parent elements, then through the EnvironmentInjector up to Root.

### 68. How do toSignal and toObservable facilitate RxJS and Signals interoperability?
**Answer:**
- `toSignal(observable$)`: Converts an RxJS stream into an Angular Signal, subscribing and cleaning up automatically.
- `toObservable(signal)`: Creates an Observable stream from an Angular Signal that emits whenever the signal value changes.

### 69. What is Zoneless Angular and how does it improve application efficiency?
**Answer:**
Zoneless Angular removes `zone.js` monkey-patching of browser APIs. Change Detection is triggered precisely by Signal updates or explicit notification (`ChangeDetectorRef.markForCheck()`), resulting in smaller bundle size, faster startup, and clearer stack traces.

### 70. What is the difference between inject() and constructor-based Dependency Injection?
**Answer:**
`inject(Service)` allows injecting dependencies during constructor execution or property initialization without declaring constructor parameters, enabling composable functional utilities (functional guards, custom hooks).

### 71. What are Signal-based inputs, outputs, and model bindings?
**Answer:**
- `input()`: Reactive read-only signal input (`name = input<string>('')`).
- `output()`: Modern signal-compatible event emitter (`save = output<User>()`).
- `model()`: Creates a two-way signal binding between parent and child (`count = model<number>(0)`).

### 72. How does the Angular Image Directive (NgOptimizedImage) improve Core Web Vitals?
**Answer:**
Enforces responsive `srcset`, prevents layout shift via automatic width/height attributes, generates resource hints (`priority` adds `fetchpriority="high"` for LCP images), and integrates with image CDNs.

### 73. What is Hydration in Angular SSR, and what is Event Replaying?
**Answer:**
- **Non-destructive Hydration**: Reuses server-rendered DOM nodes rather than clearing and re-rendering them.
- **Event Replaying**: Captures user events (clicks, inputs) that occurred before hydration finished and replays them once JavaScript is interactive.

### 74. What are Custom Form Controls with ControlValueAccessor?
**Answer:**
`ControlValueAccessor` is the interface bridging Angular forms API and native DOM elements:
Requires: `writeValue(val)`, `registerOnChange(fn)`, `registerOnTouched(fn)`, `setDisabledState(isDisabled)`.

### 75. How do you implement Route Preloading Strategies in Angular?
**Answer:**
Preloads lazy modules in the background after initial bundle load:
- `PreloadAllModules`: Preloads all lazy routes.
- Custom Preloading Strategy: Checks route data flags (e.g., `data: { preload: true }`).

### 76. What is the difference between @HostBinding, @HostListener, and the host property in @Component metadata?
**Answer:**
`@HostBinding` and `@HostListener` bind properties and events to the host DOM element. In modern Angular, using the `host: { '[class.active]': 'isActive', '(click)': 'onClick()' }` property in `@Component` metadata is preferred because it avoids decorator runtime overhead.

### 77. What are Dynamic Components and how are they created using ViewContainerRef?
**Answer:**
Components instantiated programmatically at runtime:
```typescript
const container = this.viewContainerRef;
container.clear();
const compRef = container.createComponent(DynamicModalComponent);
compRef.setInput('title', 'Confirmation');
```

---

## Part 3: JavaScript Core Internals & Advanced Patterns (78 - 160)

### 78. What are the different data types present in JavaScript?
**Answer:**
- **7 Primitives**: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`.
- **Reference Types**: `Object` (including `Array`, `Function`, `Date`, `RegExp`, `Map`, `Set`).

### 79. Explain Hoisting in JavaScript.
**Answer:**
Hoisting is JavaScript's default behavior of moving variable and function declarations to the top of their containing scope during the compilation phase:
- `var` is hoisted and initialized with `undefined`.
- `function` declarations are hoisted with their complete implementation.
- `let` and `const` are hoisted but remain uninitialized in the **Temporal Dead Zone (TDZ)** until their declaration line is executed.

### 80. Why do we use the word "debugger" in JavaScript?
**Answer:**
The `debugger;` statement acts as a programmatic breakpoint. If browser developer tools are open, execution pauses immediately at that line, allowing inspection of variables and call stack.

### 81. Difference between "==" and "===" operators.
**Answer:**
- `==` (Loose Equality): Performs type coercion if the operands are of different types before comparing values.
- `===` (Strict Equality): Compares both value and type without coercion.

### 82. Difference between var and let keyword in JavaScript.
**Answer:**
- `var`: Function-scoped, can be re-declared, hoisted with `undefined`.
- `let`: Block-scoped (`{}`), cannot be re-declared in same scope, hoisted into TDZ.

### 83. Explain Implicit Type Coercion in JavaScript.
**Answer:**
Automatic conversion of values from one data type to another:
- String coercion: `1 + '2' === '12'`.
- Number coercion: `'6' / '2' === 3`, `+'5' === 5`, `true + 1 === 2`.
- Boolean coercion in conditionals: `0`, `""`, `null`, `undefined`, `NaN` coerce to `false`.

### 84. Is JavaScript a statically typed or a dynamically typed language?
**Answer:**
Dynamically typed: Variable types are determined and checked at runtime rather than compile-time. A variable can hold a number and later be assigned a string.

### 85. What is NaN property in JavaScript?
**Answer:**
`NaN` stands for "Not-a-Number", representing a computational error resulting from an undefined or unrepresentable numerical operation (`'abc' / 2`). Type of `NaN` is `'number'`. `NaN !== NaN`; check using `Number.isNaN(val)`.

### 86. Explain passed by value and passed by reference.
**Answer:**
- **Primitives**: Passed by value (a copy of the actual value is passed into functions; mutating it does not affect the original).
- **Objects/Arrays**: Passed by value of the reference (the reference address is copied; mutating object properties modifies the original object, but reassigning the variable does not replace the original reference).

### 87. What is an Immediately Invoked Function in JavaScript?
**Answer:**
An IIFE is a function that executes immediately upon definition:
```javascript
(function() {
  const privateToken = 'secret';
  // Scoped variables do not leak into global namespace
})();
```

### 88. What do you mean by strict mode in JavaScript and its characteristics?
**Answer:**
Enforced by `'use strict';`:
- Prevents accidental global variables (`x = 10;` throws ReferenceError).
- Throws errors on non-writable properties.
- Disallows duplicate parameter names (`function(a, a) {}`).
- Makes `this` inside standard functions `undefined` instead of `window`.

### 89. Explain Higher Order Functions in JavaScript.
**Answer:**
A function that accepts one or more functions as arguments, or returns a function as its result (e.g., `map()`, `filter()`, `reduce()`, function decorators).

### 90. Explain "this" keyword.
**Answer:**
`this` refers to the object executing the current function:
1. **Default Binding**: Global object (`window` or `undefined` in strict mode).
2. **Implicit Binding**: Object before the dot (`obj.method()` -> `this` is `obj`).
3. **Explicit Binding**: Set via `call()`, `apply()`, or `bind()`.
4. **New Binding**: Newly constructed object in constructor functions.
5. **Arrow Functions**: Lexically inherits `this` from enclosing scope.

### 91. What do you mean by Self Invoking Functions?
**Answer:**
Another term for IIFEs (Immediately Invoked Function Expressions) that invoke themselves without an explicit call by name.

### 92. Explain call(), apply(), and bind() methods.
**Answer:**
- `fn.call(thisArg, arg1, arg2)`: Invokes `fn` immediately with provided `this` and comma-separated arguments.
- `fn.apply(thisArg, [args])`: Invokes `fn` immediately with provided `this` and an array of arguments.
- `fn.bind(thisArg, arg1)`: Returns a **new function** with `this` permanently bound.

### 93. What is the difference between exec() and test() methods in JavaScript?
**Answer:**
- `regex.test(str)`: Returns boolean `true` or `false` indicating match existence.
- `regex.exec(str)`: Returns an array with match details, capture groups, and index, or `null`.

### 94. What is currying in JavaScript?
**Answer:**
Transforming a function with multiple arguments `fn(a, b, c)` into a sequence of functions each taking a single argument `fn(a)(b)(c)`.

### 95. What are some advantages of using External JavaScript?
**Answer:**
Separation of HTML and JavaScript logic, browser caching of `.js` files, cleaner code, and code reusability across multiple pages.

### 96. Explain Scope and Scope Chain in JavaScript.
**Answer:**
- **Scope**: Current context of execution determining visibility of identifiers (Global, Function, Block).
- **Scope Chain**: When a variable is referenced, the JS engine searches the local scope; if not found, it traverses outer parent lexical scopes up to the global scope.

### 97. Explain Closures in JavaScript.
**Answer:**
A closure is the combination of a function bundled together with references to its surrounding lexical environment, allowing an inner function to access an outer function's scope even after the outer function has returned.

### 98. Mention some advantages of JavaScript.
**Answer:**
Runs natively in all browsers, supports asynchronous and event-driven architecture, vast ecosystem (npm), cross-platform (Node.js, mobile via React Native), rich UI interactivity.

### 99. What are object prototypes?
**Answer:**
Every JavaScript object has an internal `[[Prototype]]` link. When a property or method is accessed on an object and not found, JavaScript searches up the Prototype Chain until it reaches `Object.prototype` or `null`.

### 100. What are callbacks?
**Answer:**
A function passed as an argument to another function, intended to be executed after the parent function has completed an operation (frequently asynchronous).

### 101. What are the types of errors in JavaScript?
**Answer:**
`SyntaxError`, `ReferenceError`, `TypeError`, `RangeError`, `URIError`, `EvalError`.

### 102. What is memoization?
**Answer:**
An optimization technique that speeds up programs by caching the results of expensive pure function calls and returning the cached result when the same inputs occur again.

### 103. What is recursion in a programming language?
**Answer:**
A programming pattern where a function calls itself directly or indirectly to solve smaller instances of the same problem until a base condition is met.

### 104. What is the use of a constructor function in JavaScript?
**Answer:**
Used with the `new` keyword to create and initialize multiple instances of an object with shared properties and prototype methods.

### 105. What is DOM?
**Answer:**
Document Object Model: A tree-like programmatic representation of an HTML document where every node represents an element, attribute, or piece of text, accessible via JavaScript.

### 106. Which method is used to retrieve a character from a certain index?
**Answer:**
`str.charAt(index)` or `str.at(index)` (which supports negative indices) or bracket notation `str[index]`.

### 107. What do you mean by BOM?
**Answer:**
Browser Object Model: Provides objects representing the browser environment beyond the document (e.g., `window`, `navigator`, `location`, `history`, `screen`).

### 108. What is the distinction between client-side and server-side JavaScript?
**Answer:**
- **Client-Side (Browser)**: Has access to DOM, BOM, LocalStorage, Fetch; restricted from direct OS filesystem and network socket access.
- **Server-Side (Node.js)**: Has access to filesystem (`fs`), OS threads, raw sockets, process signals; lacks DOM/window.

### 109. What are arrow functions?
**Answer:**
Compact ES6 function expressions (`() => {}`):
- Do not have their own `this`, `arguments`, `super`, or `new.target`.
- Cannot be used as constructor functions with `new`.

### 110. What do you mean by prototype design pattern?
**Answer:**
A design pattern where objects serve as prototypes to create new objects via cloning or delegation (`Object.create()`), avoiding class overhead.

### 111. Differences between declaring variables using var, let and const.
**Answer:**
- `var`: Function-scoped, re-declarable, mutable, hoisted with `undefined`.
- `let`: Block-scoped, non-re-declarable in same scope, mutable, TDZ.
- `const`: Block-scoped, non-re-declarable, immutable binding (must be initialized immediately; object properties can still mutate).

### 112. What is the rest parameter and spread operator?
**Answer:**
- **Rest Parameter (`...args`)**: Gathers remaining function arguments into a genuine array.
- **Spread Operator (`...arr`)**: Expands an iterable into individual elements.

### 113. In JavaScript, how many different methods can you make an object?
**Answer:**
1. Object Literal: `{ a: 1 }`
2. Constructor Function: `new Person()`
3. ES6 Class: `new User()`
4. `Object.create(proto)`
5. `Object.assign({}, source)`
6. Factory Function returning an object.

### 114. What is the use of promises in JavaScript?
**Answer:**
An abstraction representing the eventual completion (or failure) of an asynchronous operation and its resulting value, avoiding nested callback hell.

### 115. What are classes in JavaScript?
**Answer:**
Syntactic sugar over JavaScript's existing prototype-based inheritance model, providing clearer syntax for constructors, methods, getters/setters, and inheritance via `extends`.

### 116. What are generator functions?
**Answer:**
Functions declared with `function*` that can be paused mid-execution using `yield` and resumed using `.next()`, returning an iterator object `{ value, done }`.

### 117. Explain WeakSet in JavaScript.
**Answer:**
A Set collection holding only weakly held objects:
- Objects can be garbage collected if there are no other references to them.
- Not iterable (no `.size`, no `forEach()`).

### 118. Why do we use callbacks?
**Answer:**
To handle asynchronous events (I/O, timer completion, network requests) non-blockingly without freezing the browser's single main thread.

### 119. Explain WeakMap in JavaScript.
**Answer:**
A key-value map where keys must be objects and are held weakly. If an object key is dereferenced elsewhere, the entry is automatically garbage-collected.

### 120. What is Object Destructuring?
**Answer:**
An ES6 expression unpacking properties from objects into distinct variables: `const { name, age } = user;`.

### 121. Difference between prototypal and classical inheritance.
**Answer:**
- **Classical**: Classes are blueprints; instances are created by copying class definitions.
- **Prototypal**: Objects inherit directly from other objects through prototype delegation links.

### 122. What is a Temporal Dead Zone?
**Answer:**
The phase between the start of a block scope and the line where a `let` or `const` variable is declared. Accessing the variable within the TDZ throws a `ReferenceError`.

### 123. What do you mean by JavaScript Design Patterns?
**Answer:**
Standardized architectural solutions to recurring software engineering problems: Singleton, Factory, Observer/Pub-Sub, Module, Strategy, and Decorator.

### 124. Is JavaScript a pass-by-reference or pass-by-value language?
**Answer:**
JavaScript is strictly **pass-by-value**. When passing an object, the value passed is the copy of the memory address reference.

### 125. Difference between Async/Await and Generators usage to achieve the same functionality.
**Answer:**
Async/Await is built specifically for Promise resolution and runs automatically via the runtime. Generators require an external runner (like `co`) to automatically step through yielded promises.

### 126. What are the primitive data types in JavaScript?
**Answer:**
`string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`.

### 127. What is the role of deferred scripts in JavaScript?
**Answer:**
`<script defer src="...">` downloads the script in parallel with HTML parsing, but delays execution until the entire HTML document is parsed, executing in document order before `DOMContentLoaded`.

### 128. What has to be done in order to put Lexical Scoping into practice?
**Answer:**
Define functions nested inside outer functions. Inner functions retain access to their outer lexical scopes naturally based on where they were authored in the source code.

### 129. What is the purpose of the nested closure check()() code?
**Answer:**
Illustrates currying and private state persistence across invocations where the outer call returns an inner function that closes over outer variables.

### 130. Output prediction: setTimeout scoping and event loop order.
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```
**Output**: `1, 4, 3, 2` (Synchronous -> Microtasks -> Macrotasks).

### 131. Output prediction: Object keys coercion.
```javascript
const a = {}, b = { key: 'b' }, c = { key: 'c' };
a[b] = 123;
a[c] = 456;
console.log(a[b]);
```
**Output**: `456`. Object keys coerce to string `'[object Object]'`. Both `a[b]` and `a[c]` write to `a['[object Object]']`.

### 132. Output prediction: Nested IIFE hoisting with var x = 21.
```javascript
var x = 21;
var girl = function () {
    console.log(x);
    var x = 20;
};
girl();
```
**Output**: `undefined`. Inside `girl()`, local `var x` is hoisted to the top of the function and initialized with `undefined`.

### 133. Output prediction: hero.getPower context loss.
```javascript
const hero = {
  power: 99,
  getPower() { return this.power; }
};
const fn = hero.getPower;
console.log(fn());
```
**Output**: `undefined` (or error in strict mode). When assigned to `fn`, the implicit `hero` binding is lost; `this` defaults to global.

### 134. Output prediction: Loop timer closures.
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```
**Output**: `3, 3, 3`. `var` is function-scoped; all callbacks share the single mutated `i`. Fix: replace `var` with `let`.

### 135. Write a function that performs binary search on a sorted array.
```javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

### 136. Implement right rotation of array by r positions.
```javascript
function rotateRight(arr, r) {
  const k = r % arr.length;
  return [...arr.slice(-k), ...arr.slice(0, arr.length - k)];
}
```

### 137. Code for dynamically inserting new nodes in the DOM.
```javascript
const parent = document.getElementById('container');
const newElement = document.createElement('div');
newElement.className = 'card-item';
newElement.textContent = 'Dynamically Inserted Item';
parent.appendChild(newElement);
```

### 138. Check if two strings are anagrams.
```javascript
function isAnagram(s1, s2) {
  const clean = s => s.toLowerCase().replace(/[^a-z0-9]/g, '').split('').sort().join('');
  return clean(s1) === clean(s2);
}
```

### 139. Find number of vowels in a string.
```javascript
function countVowels(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}
```

### 140. Turn an Object into an Array.
```javascript
const obj = { a: 1, b: 2 };
Object.keys(obj);    // ['a', 'b']
Object.values(obj);  // [1, 2]
Object.entries(obj); // [['a', 1], ['b', 2]]
```

### 141. Output prediction: let vs var in setTimeout loop.
With `let`, a new block scope binding is created per iteration: `0, 1, 2`.

### 142. What is the Event Loop, and how do Microtasks and Macrotasks differ?
- **Call Stack**: Executes synchronous frames.
- **Microtask Queue**: Promises (`.then`), `queueMicrotask`, `MutationObserver`. Drains **completely** after every stack execution before the next render.
- **Macrotask Queue**: `setTimeout`, `setInterval`, I/O, UI rendering events. Executes one task per tick.

### 143. Difference between shallow copy and deep copy, and how to achieve each?
- **Shallow Copy**: Copies first-level properties; nested references are shared (`{ ...obj }`, `Object.assign()`).
- **Deep Copy**: Clones all nested objects recursively (`structuredClone(obj)` or custom recursive cloning).

### 144. Debouncing and Throttling.
- **Debounce**: Delays execution until $N$ ms have elapsed since the *last* invocation (search inputs).
- **Throttle**: Guarantees execution at most once every $N$ ms (scroll, resize).

### 145. Event Bubbling, Event Capturing, and Event Delegation.
- **Capturing (Trickling)**: Event travels down from `window` to the target.
- **Bubbling**: Event bubbles up from target to `window`.
- **Delegation**: Attaching a single listener to a parent element to handle events on dynamic children via `e.target`.

### 146. Proxy and Reflect objects in JavaScript.
`Proxy` wraps an object to intercept fundamental operations (`get`, `set`, `deleteProperty`). `Reflect` provides standard methods to forward intercepted operations to target objects cleanly.

### 147. Differences between Promise combinators.
- `Promise.all`: Rejects immediately if any promise rejects; resolves array of all when all resolve.
- `Promise.allSettled`: Waits for all to complete; never rejects early; returns array of `{ status, value/reason }`.
- `Promise.race`: Settles as soon as the first promise settles (resolves or rejects).
- `Promise.any`: Resolves as soon as the first promise fulfills; rejects if all reject (`AggregateError`).

### 148. Differences between Map, Set, WeakMap, and WeakSet.
`Map` allows arbitrary keys (objects, primitives). `Set` stores unique values. `WeakMap`/`WeakSet` accept only objects as keys/values, allow garbage collection, and are non-iterable.

### 149. What are Web Workers and when should they be used?
Web Workers run JavaScript in a separate OS thread without blocking the browser UI main thread. Used for heavy CPU tasks (image processing, large data parsing).

### 150. Implement custom Array.prototype.myMap and Array.prototype.myReduce.
```javascript
Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) result[i] = callback(this[i], i, this);
  }
  return result;
};

Array.prototype.myReduce = function(callback, initialValue) {
  let acc = initialValue !== undefined ? initialValue : this[0];
  let startIndex = initialValue !== undefined ? 0 : 1;
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) acc = callback(acc, this[i], i, this);
  }
  return acc;
};
```

### 151. Flatten a deeply nested array without Array.prototype.flat.
```javascript
function flatten(arr) {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}
```

### 152. Memory Leaks in JavaScript: Common causes.
1. Accidental global variables (`window.leak = ...`).
2. Forgotten timers or intervals (`setInterval`).
3. Uncleared event listeners on detached DOM elements.
4. Stale closures holding references to large objects.

### 153. How does V8 optimize JavaScript execution (Hidden Classes & Inline Caching)?
V8 assigns hidden classes (Shapes) based on property creation order. Initializing properties in identical order allows V8 to use Inline Caching (IC) for fast direct property offset access.

### 154. How does the AbortController API work?
Provides a signal to cancel ongoing async tasks:
```javascript
const controller = new AbortController();
fetch('/api/data', { signal: controller.signal });
controller.abort(); // Immediately cancels network request
```

### 155. WeakRef and FinalizationRegistry.
`WeakRef` creates a reference to an object without preventing garbage collection. `FinalizationRegistry` registers a callback to trigger after an object has been garbage collected.

### 156. Robust deep clone handling circular references without structuredClone.
```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj);
  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, clone);
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], hash);
  }
  return clone;
}
```

### 157. Polyfill for Promise.all.
```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve(results);
    promises.forEach((p, index) => {
      Promise.resolve(p).then(val => {
        results[index] = val;
        completed++;
        if (completed === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

### 158. Implement a Pub/Sub (Event Emitter) pattern.
```javascript
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, listener) {
    (this.events[event] = this.events[event] || []).push(listener);
    return () => this.off(event, listener);
  }
  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(l => l(...args));
  }
}
```

### 159. Output prediction: Tricky coercion.
```javascript
[] + [];    // ""
[] + {};    // "[object Object]"
{} + [];    // 0 (when parsed as block statement) or "[object Object]"
```

### 160. Implement an LRU Cache in JavaScript.
```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // JavaScript Map retains insertion order
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // Move to most recently used
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      this.map.delete(this.map.keys().next().value); // Evict oldest
    }
    this.map.set(key, value);
  }
}
```

---

## Part 4: Live Coding & Client Scenarios (161 - 175)

### 161. Live Coding: Reverse word order and capitalize 3rd letter of each word without replace().
```javascript
function reverseAndCapitalize(sentence) {
  const words = sentence.trim().split(/\s+/).reverse();
  const transformed = words.map(word => {
    if (word.length < 3) return word;
    return word.slice(0, 2) + word[2].toUpperCase() + word.slice(3);
  });
  return transformed.join(' ');
}
```

### 162. Live Coding: Given [1, 2, 3, 4, 5, 6], insert 7 after 3 and remove 5.
```javascript
const arr = [1, 2, 3, 4, 5, 6];
// Insert 7 after 3: 3 is at index 2, so insert at index 3
arr.splice(3, 0, 7); // [1, 2, 3, 7, 4, 5, 6]
// Find and remove 5:
const idx5 = arr.indexOf(5);
if (idx5 !== -1) arr.splice(idx5, 1);
// Result: [1, 2, 3, 7, 4, 6]
```

### 163. Live Coding: Restrict characters (@, <, >) in an input field via Angular Directive.
```typescript
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestrictChars]',
  standalone: true
})
export class RestrictCharsDirective {
  private forbidden = /[@<>]/;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.forbidden.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    if (this.forbidden.test(pasteData)) {
      event.preventDefault();
    }
  }
}
```

### 164. Live Coding: Character frequency map (case-insensitive) for "HelloAbinash".
```javascript
function charFrequency(str) {
  const freq = {};
  for (const char of str.toLowerCase()) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}
// For 'HelloAbinash': { h: 2, e: 1, l: 2, o: 1, a: 2, b: 1, i: 1, n: 1, s: 1 }
```

### 165. Scope Output Prediction: var, let, const in if block.
```javascript
if (true) {
  var a = 20;
  let b = 30;
  const c = 40;
}
console.log(a); // 20 (var escapes block scope)
console.log(b); // ReferenceError: b is not defined
```

### 166. Live Coding (Morgan Stanley): Build nested menu tree from flat JSON array.
```javascript
function buildTree(items) {
  const itemMap = new Map();
  const rootNodes = [];

  for (const item of items) {
    itemMap.set(item.id, { ...item, children: [] });
  }

  for (const item of items) {
    const node = itemMap.get(item.id);
    if (item.parentId === null || !itemMap.has(item.parentId)) {
      rootNodes.push(node);
    } else {
      itemMap.get(item.parentId).children.push(node);
    }
  }

  return rootNodes;
}
```

### 167. Tree Follow-ups: Why add empty children array? Why copy with `...item`?
- **Empty children array**: Guarantees consumers can safely access `.children.length` without checking for `null`/`undefined`.
- **Shallow copy `{ ...item }`**: Avoids mutating the original input array objects, preventing accidental side-effects.

### 168. Single Login API: Summary popup vs full profile derivation.
Use **Angular Signals** (`computed()`) or RxJS `map()` to derive a lightweight summary object synchronously from the master profile state without triggering redundant API calls.

### 169. Dashboard Journey Tracking: SendBeacon, batching, and cache architecture.
Use `navigator.sendBeacon(url, data)` to guarantee analytics delivery during page unloads without blocking navigation. Batch events in memory and flush periodically or upon visibility change.

### 170. Custom Dashboard Persistence: Cheapest practical approach.
Persist user column layout, widget coordinates, and theme preferences to `localStorage` immediately, and debounce sync to a user-settings database endpoint.

### 171. Default vs OnPush Change Detection: Will mutating an object property trigger OnPush?
**No**. `OnPush` only checks object reference equality (`prevInput !== currentInput`). In-place mutation keeps the same reference, so `OnPush` components will skip rendering until a new reference is emitted or an internal event fires.

### 172. Bootstrapping Custom Component: Can we bootstrap DashboardComponent instead of AppComponent?
**Yes**. In `main.ts`, simply supply `bootstrapApplication(DashboardComponent)` or configure `bootstrap: [DashboardComponent]` in `AppModule`.

### 173. RxJS & State Management: Managing unsubscriptions, multi-async pipe re-renders.
Use `shareReplay(1)` to multicasting a single HTTP response across multiple `async` pipes in the template, preventing duplicated network requests.

### 174. Signals vs RxJS Decision: When to use which?
- Use **Signals** for synchronous UI state, local component state, derived values (`computed`), and fine-grained DOM updates.
- Use **RxJS** for asynchronous streaming, complex event timing, web sockets, debouncing, and cancelable HTTP calls.

### 175. Route Guards: What does canDeactivate do and what are its return types?
`canDeactivate` determines if a user can leave the current route (e.g., warning about unsaved form changes). Return types: `boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>`.

---

## Part 5: HTML5 & Modern Semantics (176 - 185)

### 176. Semantic HTML elements: Accessibility & SEO.
Elements like `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` give structural meaning to screen readers and search bots, creating accessibility trees and rich search snippets.

### 177. Script execution: `<script>`, `<script async>`, and `<script defer>`.
- `<script>`: Blocks HTML parsing; downloads and executes immediately.
- `<script async>`: Downloads in parallel; executes immediately when ready (can execute out of order).
- `<script defer>`: Downloads in parallel; executes after HTML parsing completes in exact document order.

### 178. Storage comparison: localStorage, sessionStorage, Cookies.
- `localStorage`: 5-10MB, persistent until explicitly cleared, client-only.
- `sessionStorage`: 5MB, persists only for browser tab session, client-only.
- `cookies`: 4KB, sent to server with every HTTP request, configurable with `HttpOnly`, `Secure`, `SameSite`.

### 179. Custom HTML data-* attributes.
- In HTML: `<div data-user-id="42">`
- In JS: `element.dataset.userId`
- In CSS: `div::after { content: attr(data-user-id); }`

### 180. Web Workers vs Service Workers.
- **Web Workers**: Dedicated to running background CPU-intensive calculations.
- **Service Workers**: Network proxies running between the browser and network, enabling offline caching, PWAs, and push notifications.

### 181. Canvas API vs SVG.
- **Canvas (Pixel/Raster)**: Best for high-frequency frame updates (games, real-time particle simulations).
- **SVG (Vector/DOM-based)**: Best for resolution-independent icons, UI charts, scalable diagrams, and CSS-styleable graphics.

### 182. Responsive images: `<picture>`, `srcset`, and `sizes`.
`<picture>` enables art direction (serving different aspect ratios per breakpoint). `srcset` and `sizes` provide alternative pixel resolutions for the browser to pick based on device DPI.

### 183. HTML <template> and <slot> elements.
`<template>` holds markup not rendered until cloned via JavaScript. `<slot>` defines projection insertion points inside Web Component Shadow DOM trees.

### 184. Rendering approaches: CSR, SSR, and SSG.
- **CSR**: Blank HTML shell; JS builds the DOM in the browser.
- **SSR**: Server generates full HTML on every request.
- **SSG**: HTML pre-compiled at build time and served via CDN.

### 185. ARIA accessibility roles and properties.
`role`, `aria-label`, `aria-live="polite"` provide accessibility semantics when native HTML cannot, communicating state to screen readers.

---

## Part 6: Modern CSS3, Layouts & Architecture (186 - 195)

### 186. Fixed vs Sticky positioning.
- `position: fixed`: Positioned relative to the viewport; removed from document flow.
- `position: sticky`: Behaves like `relative` until a scroll threshold is crossed, then sticks within its parent container.

### 187. CSS Box Model: content-box vs border-box.
- `content-box`: `width = content`. (Padding and border add extra size).
- `border-box`: `width = content + padding + border`. Layout math is predictable.

### 188. Flexbox (1D) vs CSS Grid (2D).
- Flexbox: 1-dimensional (row OR column); content-driven layouts.
- Grid: 2-dimensional (rows AND columns simultaneously); structural design systems.

### 189. CSS Specificity calculation.
Score: `(Inline styles, IDs, Classes/Attributes/Pseudo-classes, Elements/Pseudo-elements)`.
`!important` overrides normal specificity.

### 190. CSS Custom Properties vs SCSS Variables.
CSS variables (`--var`) are dynamic at runtime in the browser DOM, inherited through cascades, and changeable via JavaScript. SCSS variables are statically compiled to fixed values during build.

### 191. 3 modern ways to center an element.
```css
/* 1. Flexbox */
.parent { display: flex; justify-content: center; align-items: center; }

/* 2. Grid */
.parent { display: grid; place-items: center; }

/* 3. Absolute positioning with transform */
.child { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
```

### 192. CSS units comparison.
`px` (absolute), `em` (relative to parent font), `rem` (relative to root font), `vw`/`vh` (viewport percent), `dvh`/`svh` (dynamic and small viewport units accounting for mobile address bars).

### 193. Stacking Context triggers beyond z-index.
Triggered by: `opacity < 1`, `transform !== none`, `filter !== none`, `contain: paint`, `will-change`.

### 194. CSS Container Queries (@container) vs Media Queries.
Media queries evaluate the entire viewport; Container queries evaluate the dimensions of the immediate parent container, enabling truly responsive component libraries.

### 195. CSS @layer and :has() selector.
- `@layer`: Explicitly defines cascade priority layers regardless of selector specificity.
- `:has()`: The parent selector; targets an element based on its descendant state (`form:has(input:invalid)`).

---

## Part 7: Enterprise Architecture, Framework Internals & Performance (196 - 225)

### 196. Declarations, imports, exports, and providers in NgModule.
- `declarations`: Components, directives, pipes belonging to this module.
- `imports`: Other modules whose exported components are needed.
- `exports`: Subset of declarations made available to importing modules.
- `providers`: Services injected into this module's injector.

### 197. Angular Router navigation & LocationStrategy.
Navigates using `PathLocationStrategy` (HTML5 `pushState`) without reloading the page, or `HashLocationStrategy` (`/#/path`) for legacy servers without rewrite support.

### 198. Custom Validators in Reactive Forms.
- **Synchronous**: Returns `ValidationErrors | null`.
- **Asynchronous**: Returns `Observable<ValidationErrors | null> | Promise<ValidationErrors | null>`.

### 199. NgZone (run vs runOutsideAngular).
- `run()`: Executes code inside Angular zone, triggering change detection.
- `runOutsideAngular()`: Bypasses Zone.js for high-frequency events (canvas rendering, mousemove) to avoid unnecessary change detection passes.

### 200. trackBy in *ngFor / track in @for.
Identifies list items uniquely. Prevents Angular from destroying and recreating all DOM nodes when an array is reordered or updated.

### 201. Subject types in RxJS.
- `Subject`: Multicast; no initial value; subscribers only receive values emitted after subscription.
- `BehaviorSubject`: Holds a current value; immediately emits current value upon subscription.
- `ReplaySubject`: Buffers $N$ past emissions and replays them to new subscribers.
- `AsyncSubject`: Emits only the last value upon completion.

### 202. ElementRef, TemplateRef, ViewRef, and ComponentRef.
- `ElementRef`: Wrapper around native DOM element.
- `TemplateRef`: Represents embedded `<ng-template>`.
- `ViewRef`: Represents a view container.
- `ComponentRef`: Handle to a dynamically instantiated component.

### 203. HTTP Interceptor caching.
Intercepts requests, checks an in-memory `Map` cache; if found, returns `of(new HttpResponse({ body: cached }))`; otherwise forwards and caches response.

### 204. APP_INITIALIZER vs ENVIRONMENT_INITIALIZER.
- `APP_INITIALIZER`: Blocks application bootstrapping until returned promise/observable resolves.
- `ENVIRONMENT_INITIALIZER`: Runs when an EnvironmentInjector is created (modern standalone setup).

### 205. Multi-tab synchronization in Angular.
Implemented using `BroadcastChannel` API or listening to `window.addEventListener('storage', ...)`.

### 206. null vs undefined.
`null` is an intentional assignment representing no value (`typeof null === 'object'`). `undefined` is a variable declared but not yet assigned (`typeof undefined === 'undefined'`).

### 207. Event delegation benefits.
Attaches 1 listener instead of 1,000 listeners, saving memory and automatically supporting dynamically inserted child elements.

### 208. Object.freeze() vs Object.seal().
- `freeze()`: Makes object completely read-only (cannot add, delete, or modify properties).
- `seal()`: Prevents adding or deleting properties, but existing writable properties can still be modified.

### 209. Microtasks vs Macrotasks execution order.
Call stack -> All microtasks in queue -> Browser render -> One macrotask -> Repeat.

### 210. Generator functions: yield vs return.
`yield` pauses execution and emits a value with `{ done: false }`. `return` terminates the generator with `{ done: true }`.

### 211. window vs document vs screen.
- `window`: Global browser tab execution environment.
- `document`: The DOM tree of the loaded page.
- `screen`: Physical monitor display specs.

### 212. Detect circular references in an object.
```javascript
function hasCircularReference(obj) {
  const seen = new WeakSet();
  function detect(val) {
    if (val && typeof val === 'object') {
      if (seen.has(val)) return true;
      seen.add(val);
      for (const k in val) {
        if (detect(val[k])) return true;
      }
    }
    return false;
  }
  return detect(obj);
}
```

### 213. Map vs standard JavaScript Object.
`Map` maintains insertion order, supports any type for keys, has constant-time `.size`, and avoids prototype key pollution.

### 214. Service Worker lifecycle events.
`install` -> `activate` -> `fetch` / `message`.

### 215. Tagged Template Literals.
Functions passed a template literal, receiving raw strings array and interpolated values array as arguments (`styled.div` pattern).

### 216. Critical Rendering Path (CRP) optimization.
HTML parsing -> DOM tree + CSSOM tree -> Render Tree -> Layout -> Paint. Optimized by minifying CSS/JS, inlining critical CSS, deferring scripts.

### 217. Reflow vs Repaint & Layout Thrashing.
- **Reflow**: Recalculating geometry of elements.
- **Repaint**: Redrawing pixels without changing geometry.
- **Thrashing**: Rapid interleaved reads and writes to layout properties (e.g., `offsetWidth` followed by `style.width`).

### 218. CSS content-visibility property.
`content-visibility: auto` skips rendering of off-screen elements until they approach the viewport, boosting initial load speed on large pages.

### 219. CSS Grid auto-fit vs auto-fill.
`auto-fill` creates empty column tracks to fill space; `auto-fit` collapses empty tracks and expands existing columns to fill available space.

### 220. display: none vs visibility: hidden.
- `display: none`: Removes element completely from layout and accessibility tree.
- `visibility: hidden`: Hides element visually, but preserves its occupied space in document layout.

### 221. Responsive Images: `<picture>` vs `srcset`.
`<picture>` for art direction (swapping formats/ratios); `srcset` for resolution density switching.

### 222. Why CSS transforms and opacity animations are GPU-accelerated.
They do not trigger Reflow or Repaint; the browser composites them directly on separate GPU layers.

### 223. CSS Container Queries (@container) vs Media Queries.
Container queries respond to the component container's width, enabling portable component design systems independent of viewport size.

### 224. CSS :has() parent selector.
Enables selecting a parent element based on its children's state or existence: `a:has(img) { border: none; }`.

### 225. BFC (Block Formatting Context) vs IFC (Inline Formatting Context).
- **BFC**: Box layout area where margins do not collapse across boundaries and floats are contained.
- **IFC**: Formatting context where inline elements sit horizontally side-by-side until line wraps.

---

## Part 8: Advanced TypeScript, Tooling & Performance (226 - 235)

### 226. What is the difference between any, unknown, and never in TypeScript?
**Answer:**
- `any`: Disables all type checking. Can be assigned to anything and called arbitrarily.
- `unknown`: Type-safe counterpart of `any`. Must be narrowed using type guards (`typeof`, `instanceof`) before performing operations.
- `never`: Represents values that never occur (e.g., a function that always throws an exception or an infinite loop).

### 227. How do TypeScript Utility Types prevent state mutation bugs?
**Answer:**
- `Partial<T>`: Makes all properties optional.
- `Pick<T, K>`: Constructs a type picking specified keys.
- `Omit<T, K>`: Constructs a type omitting specified keys.
- `Readonly<T>`: Enforces compile-time immutability, preventing state mutation bugs.
- `Record<K, T>`: Constructs mapped dictionary structures.

### 228. How does Angular's modern application builder (Vite + esbuild) differ from the legacy Webpack builder?
**Answer:**
- **Development**: Uses Vite's native ESM dev server with pre-bundling via esbuild, providing near-instant hot module replacement (HMR).
- **Production**: Uses esbuild for compilation, achieving 3x to 5x faster production build times and smaller bundle outputs compared to legacy Webpack pipelines.

### 229. What is INP (Interaction to Next Paint), why did it replace FID, and how do you optimize it?
**Answer:**
INP measures page responsiveness by tracking the latency of all user interactions (clicks, key presses) throughout the entire page lifecycle, replacing First Input Delay (FID), which only measured the very first interaction.
**Optimization**: Break long tasks using `scheduler.yield()`, avoid synchronous layout recalculations, and offload CPU tasks to Web Workers.

### 230. Where should JWTs and session tokens be stored in a Single Page Application, and why is localStorage vulnerable?
**Answer:**
- **Best Practice**: Store tokens in **HttpOnly, Secure, SameSite=Strict Cookies**. JavaScript cannot read `HttpOnly` cookies, completely shielding tokens from Cross-Site Scripting (XSS) extraction.
- **LocalStorage Risk**: Any third-party script or injected XSS payload can execute `localStorage.getItem('token')` and exfiltrate user credentials.

### 231. How do you implement Stale-While-Revalidate caching using Angular Service Workers?
**Answer:**
In `ngsw-config.json`, configure a `performance` data group strategy:
```json
{
  "name": "api-cache",
  "urls": ["/api/v1/products/**"],
  "cacheConfig": {
    "maxSize": 100,
    "maxAge": "1h",
    "strategy": "performance"
  }
}
```
The Service Worker returns cached data immediately while fetching fresh data in the background.

### 232. What is IndexedDB and when should you choose it over localStorage?
**Answer:**
IndexedDB is a transactional, asynchronous, indexed NoSQL database in the browser capable of storing hundreds of megabytes of structured data (blobs, objects). Choose IndexedDB over `localStorage` when storing large datasets or when synchronous `localStorage` operations would freeze the main thread.

### 233. How does Clickjacking work, and how do X-Frame-Options and CSP frame-ancestors prevent it?
**Answer:**
Clickjacking embeds a malicious transparent `<iframe>` over a legitimate UI button, tricking the user into clicking unintended actions. Prevented by headers:
- `X-Frame-Options: DENY`
- `Content-Security-Policy: frame-ancestors 'none'`

### 234. What is scheduler.yield() and how does it prevent main-thread freezing?
**Answer:**
`scheduler.yield()` is a modern browser API that pauses the current JavaScript execution, yields control back to the browser main thread to process pending user input and render frames, and then resumes execution immediately.

### 235. How do you write generic typed Angular components using standalone Signal inputs?
**Answer:**
```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  standalone: true,
  template: `
    <table>
      @for (row of data(); track trackKey()(row)) {
        <tr>
          <td>{{ row }}</td>
        </tr>
      }
    </table>
  `
})
export class DataTableComponent<T> {
  data = input.required<T[]>();
  trackKey = input.required<(item: T) => any>();
}
```
In template: `<app-data-table [data]="users" [trackKey]="userTracker" />` where `T` is automatically inferred as `User`.

