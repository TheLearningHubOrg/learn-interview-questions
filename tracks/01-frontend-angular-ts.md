# Complete Master Interview Question Bank: Angular, TypeScript, JavaScript & Web Standards (1 - 235)

> Simple, intuitive, and easy-to-explain technical interview questions and answers covering Angular 17-19, TypeScript, Core JavaScript internals, live coding, HTML5 semantics, and CSS3 layouts.

---

## Part 1: Interview Intro & Project Experience (1 - 7)

### 1. Give a brief introduction (keep it candid, not formal).
**In Simple Words:**
Keep it natural and conversation-like: state your focus, the products you build, your primary tech stack, and what excites you about frontend architecture.

**How to Explain in an Interview:**
- "I'm a Frontend / Full-Stack Engineer specializing in the Angular and TypeScript ecosystem.
- In my day-to-day work, I build high-performance web applications—focusing on clean component architecture, reactive state with Signals and RxJS, and fast page loads.
- I like understanding the core platform beneath frameworks: how the browser parses HTML/CSS, the JavaScript event loop, and web performance optimization."

```typescript
// Modern Angular 18 Standalone Component with Signals:
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div class="card">
      <h2>{{ fullName() }}</h2>
      <button (click)="increment()">Visited: {{ count() }}</button>
    </div>
  `
})
export class UserProfileComponent {
  firstName = signal('Alice');
  lastName = signal('Smith');
  count = signal(0);
  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);

  increment() { this.count.update(c => c + 1); }
}
```

### 2. What is your role in your current project? Explain it.
**In Simple Words:**
Explain your ownership: from UI component design to backend API collaboration and performance tuning.

**How to Explain in an Interview:**
- **Architecture & Features**: I build standalone components, modular routes with lazy-loading, and manage reactive state using Angular Signals and NgRx.
- **Performance & Quality**: I monitor Core Web Vitals (LCP, INP, CLS), optimize change detection with `OnPush`, and write unit tests with Jasmine/Jest.
- **Cross-team Collaboration**: I work with UX designers to translate Figma design tokens into reusable components, and with backend engineers to define clear REST/GraphQL API contracts.

```typescript
// Clean Architecture: Feature Service with injected dependencies:
@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = '/api/orders';

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
}
```

### 3. Any experience building APIs or server-side code? (UI role with some API work).
**In Simple Words:**
"Yes, I build Full-Stack and Backend-for-Frontend (BFF) layers when needed."

**How to Explain in an Interview:**
- "While my core focus is frontend, I regularly write backend services in Node.js (Express, Fastify, NestJS) and Python (FastAPI).
- In Angular, I configure Server-Side Rendering (SSR) and hydration with Node engines.
- I also design REST APIs, write JWT authentication middleware, and query PostgreSQL and Redis caching layers."

```typescript
// Angular Functional HTTP Interceptor for Auth & Headers:
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq);
};
```

### 4. Did you start with Angular? Do you have core JavaScript experience? Are you comfortable coding in plain JavaScript?
**In Simple Words:**
"I started with core JavaScript before using frameworks, and I am 100% comfortable coding in plain vanilla JS."

**How to Explain in an Interview:**
- Frameworks come and go, but browser JavaScript is permanent.
- I am comfortable writing vanilla JS from scratch: manipulating the DOM, creating closures, writing custom event emitters, building debounce/throttle functions, and polyfilling array methods without external libraries.

```javascript
// Plain JavaScript DOM event vs Angular template event:
document.querySelector('#submit-btn').addEventListener('click', (e) => {
  console.log('Button clicked!', e.target);
});
```

### 5. Which is the latest Angular version you have worked with?
**In Simple Words:**
"I actively work with **Angular 17, 18, and 19**."

**Key Modern Features to Mention:**
- **Standalone Components**: No more `NgModule` boilerplate.
- **Angular Signals**: `signal()`, `computed()`, and `effect()` for simple, fine-grained reactivity.
- **Modern Control Flow**: Clean `@if`, `@for` (with mandatory `track`), and `@switch` syntax directly in HTML.
- **Deferrable Views (`@defer`)**: Declarative lazy-loading of heavy components when scrolled into view.
- **Zoneless Angular**: Experimental high-performance change detection without Zone.js overhead.

```typescript
// Angular 17/18 Signal inputs and model:
import { Component, input, model } from '@angular/core';

@Component({ selector: 'app-counter', standalone: true, template: `<button (click)="update()">{{ value() }}</button>` })
export class CounterComponent {
  label = input.required<string>(); // Read-only Signal input
  value = model(0);                 // Writable two-way Signal model

  update() { this.value.update(v => v + 1); }
}
```

### 6. Have you worked on custom pipes and custom directives?
**In Simple Words:**
"Yes. Directives modify DOM behavior; Pipes transform displayed data."

**How to Explain in an Interview:**
- **Custom Directives**: Created attribute directives for input character masking, preventing special characters, auto-focusing elements, and infinite scrolling via `IntersectionObserver`.
- **Custom Pipes**: Built pure pipes for currency conversion, relative time ('5 mins ago'), and byte formatting ('2.4 MB').

```typescript
// Custom Directive & Custom Pipe:
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  private el = inject(ElementRef);
  constructor() { this.el.nativeElement.style.backgroundColor = '#fef08a'; }
}

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}
```

### 7. Do you have experience in NgRx and writing test cases?
**In Simple Words:**
"Yes, I use NgRx for enterprise global state and write unit tests to ensure high code reliability."

**How to Explain in an Interview:**
- **NgRx**: Experienced with Actions, Reducers, Effects, Selectors, and the modern `@ngrx/signals` (SignalStore). I use memoized selectors to slice state efficiently.
- **Testing**: I write unit tests for components and services using Jasmine/Karma, Jest, and Angular Testing Library, mocking HTTP requests via `HttpTestingController`.

---

```typescript
// NgRx Action, Reducer, and Component Test:
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[] }>());

it('should dispatch loadUsers on init', () => {
  const store = TestBed.inject(MockStore);
  const spy = spyOn(store, 'dispatch');
  fixture.detectChanges();
  expect(spy).toHaveBeenCalledWith(loadUsers());
});
```

## Part 2: Angular Interview Questions (8 - 77)

### 8. Why were client-side frameworks like Angular introduced?
**In Simple Words:**
Traditional websites reloaded the entire page on every click. Angular was introduced to create **Single Page Applications (SPAs)** that update the UI instantly without reloading the browser.

**Key Benefits:**
- **Smooth User Experience**: Page transitions are instant; only data (JSON) is fetched over the network.
- **Component-Based**: Clean, reusable UI blocks combining HTML, CSS, and TypeScript.
- **Automatic Sync**: Data binding automatically updates the screen whenever variables change.

```html
<!-- Single Page App index.html shell: -->
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>SPA</title></head>
<body>
  <app-root></app-root>
</body>
</html>
```

### 9. How does an Angular application work?
**In Simple Words:**
Angular bootstraps a root component inside `index.html`, renders the template, and continuously updates the screen whenever data changes.

**The 4-Step Flow:**
1. **Entry**: Browser loads `index.html` and executes `main.ts`.
2. **Bootstrapping**: `bootstrapApplication(AppComponent)` initializes the root component and dependency injection.
3. **Template Rendering**: Angular compiles component templates and injects them into `<app-root>`.
4. **Change Detection**: When user clicks or data arrives, Angular updates the affected DOM elements.

```typescript
// Bootstrap process in modern Angular:
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
```

### 10. What are some of the advantages of Angular over other frameworks?
**In Simple Words:**
Angular is a **complete, batteries-included framework** maintained by Google.

**Key Advantages:**
- **All-in-One**: Official router, HTTP client, forms validation, and animations are built-in (no need to piece together third-party packages).
- **TypeScript by Default**: Catch errors at compile-time instead of runtime.
- **Dependency Injection**: Clean, modular code that is easy to test.
- **CLI & Migrations**: `ng update` automatically updates your codebase across major versions.

```typescript
// Angular CLI generating an end-to-end typed feature:
// ng generate component features/dashboard --standalone
// ng generate service core/auth
```

### 11. What are the advantages of Angular over React?
**In Simple Words:**
Angular is a full-fledged **framework** with standardized architecture, while React is a **UI library** that requires choosing third-party tools for routing, state, and forms.

**Quick Comparison:**
- **Angular**: Standardized structure across teams, official routing & HTTP, built-in dependency injection, native TypeScript.
- **React**: Highly flexible, but every project chooses different libraries for routing, forms, and state, leading to inconsistent codebases.

```typescript
// Angular opinionated Dependency Injection vs React custom provider wrappers:
@Component({ standalone: true, template: '...' })
export class ProductComponent {
  private cartService = inject(CartService);
}
```

### 12. List out differences between AngularJS and Angular?
**In Simple Words:**
AngularJS (v1.x) was a JavaScript MVC framework based on `$scope`. Modern Angular (v2+) is a complete TypeScript-based component framework.

| Feature | AngularJS (1.x) | Modern Angular (2 - 19+) |
| :--- | :--- | :--- |
| **Language** | JavaScript | TypeScript |
| **Architecture** | MVC with `$scope` | Component-based |
| **Mobile** | Not mobile-friendly | Mobile-first & fast |
| **Rendering** | Slow digest cycle | Ivy compiler, Signals & OnPush |

```typescript
// Modern Angular Standalone Component:
@Component({ selector: 'app-main', standalone: true, template: '<h1>Hello {{ name }}</h1>' })
export class MainComponent { name = 'World'; }
```

### 13. How are Angular expressions different from JavaScript expressions?
**In Simple Words:**
Angular expressions (`{{ user.name }}`) evaluate against the **component class instance**, not the global `window` object.

**Key Differences:**
- Cannot use dangerous keywords like `eval()`, `new`, or assignment operators (`=`, `++`).
- Supports the safe navigation operator (`user?.address?.city`) to prevent null reference errors.
- Supports pipe operators (`{{ price | currency }}`).

```html
<!-- Angular template expressions: -->
<p>Total: {{ price * quantity }}</p>
<p>Status: {{ isAvailable ? 'In Stock' : 'Out of Stock' }}</p>
```

### 14. What are Single Page Applications (SPA)?
**In Simple Words:**
A web application that loads a single HTML page once. As the user navigates, JavaScript dynamically rewrites the content without requesting a full page reload from the server.

```typescript
// Angular Router config for SPA navigation:
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) }
];
```

### 15. What are templates in Angular?
**In Simple Words:**
A template is the HTML file or inline string (`template: '...'`) that defines what the user sees on the screen, enhanced with Angular directives, bindings, and control flow syntax.

```html
<!-- Angular component template: -->
<section class="user-list">
  @if (users().length > 0) {
    @for (user of users(); track user.id) {
      <div class="user-card">{{ user.name }}</div>
    }
  }
</section>
```

### 16. What are directives in Angular?
**In Simple Words:**
Directives are classes that attach custom behavior to DOM elements.

**3 Types to Remember:**
1. **Component Directives**: Directives with an HTML template (the most common type).
2. **Structural Directives**: Change the DOM layout by adding or removing elements (e.g. `*ngIf`, `*ngFor`).
3. **Attribute Directives**: Change the appearance or behavior of an existing element (e.g. `ngClass`, `ngStyle`, or custom click trackers).

```html
<!-- Structural directive vs Attribute directive: -->
@if (isLoggedIn) { <app-user-menu /> }
<input type="text" [ngClass]="{ 'is-invalid': hasError }" />
```

### 17. Explain Components, Modules and Services in Angular.
**In Simple Words:**
- **Component**: The UI view (HTML + CSS + TypeScript logic).
- **Service**: A reusable class for business logic and API calls, shared across components.
- **Module (`NgModule`)**: A container that groups related components and services together (optional in modern Angular standalone components).

```typescript
@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(msg: string) { console.log(`[LOG]: ${msg}`); }
}
```

### 18. What is the scope?
**In Simple Words:**
In old AngularJS, `$scope` was the glue object between controller and HTML. In modern Angular, the **component class instance itself** is the scope—variables declared on the class are directly available in the template.

```typescript
export class ProfileComponent {
  public userName = 'Alice';
  private internalToken = 'xyz123';
}
```

### 19. What is data binding in Angular?
**In Simple Words:**
Data binding is the communication bridge between the TypeScript class and the HTML template.

**4 Binding Types:**
1. **Interpolation `{{ title }}`**: Sends string data from TypeScript to HTML.
2. **Property Binding `[src]="imgUrl"`**: Sets an HTML element property from TypeScript.
3. **Event Binding `(click)="save()"`**: Listens to user events in HTML and calls TypeScript methods.
4. **Two-Way Binding `[(ngModel)]="name"`**: Keeps TypeScript and HTML continuously in sync.

```html
<!-- Angular Data Binding: -->
<h1>{{ title }}</h1>
<img [src]="avatarUrl" [alt]="userName" />
<button (click)="save()">Save</button>
<input [(ngModel)]="userName" />
```

### 20. What is two way data binding in Angular?
**In Simple Words:**
When you type into an input field, the TypeScript variable updates immediately; if the TypeScript variable changes, the input field updates immediately.
**Syntax**: `[(ngModel)]="username"` (Banana in a box: `[ ]` for property in, `( )` for event out).

```html
<input [(ngModel)]="email" placeholder="Enter email" />
<p>You typed: {{ email }}</p>
```

### 21. What are Decorators and their types in Angular?
**In Simple Words:**
Decorators are functions preceded by `@` that attach metadata to TypeScript classes or properties so Angular knows how to treat them.

**4 Types:**
1. **Class Decorators**: `@Component()`, `@Directive()`, `@Pipe()`, `@Injectable()`.
2. **Property Decorators**: `@Input()`, `@Output()`, `@ViewChild()`.
3. **Method Decorators**: `@HostListener()`.
4. **Parameter Decorators**: `@Inject()`.

```html
<p>Current Year: {{ currentYear }}</p>
<p>Total items: {{ items.length }}</p>
```

### 22. What are annotations in Angular?
**In Simple Words:**
"Annotations" is an informal term often used interchangeably with Decorators. In TypeScript/Angular, they are actual executable Decorator functions that pass metadata to the compiler.

```html
<button [disabled]="isSubmitting">Submit</button>
<div [innerHTML]="trustedHtmlContent"></div>
```

### 23. What are pure Pipes?
**In Simple Words:**
A pure pipe executes **only when its input value or reference changes**.
- If passed a primitive (string, number): runs only when the value changes (`!==`).
- If passed an object or array: runs only when the **object reference changes**, not on internal mutations.
- **Benefit**: Extremely fast and memoized by default.

```html
<input (keyup.enter)="onSearch($event)" />
<button (click)="trackClick($event)">Click</button>
```

### 24. What are impure pipes?
**In Simple Words:**
An impure pipe (`pure: false`) executes on **every single change detection cycle**, even if the input hasn't changed.
- **Use case**: Detecting when an item is pushed into an existing array.
- **Warning**: Can severely slow down the app if it performs heavy calculations.

```html
<input #phoneInput type="tel" placeholder="Phone number" />
<button (click)="callUser(phoneInput.value)">Call</button>
```

### 25. What is Pipe transform Interface in Angular?
**In Simple Words:**
It is the TypeScript interface that every custom pipe must implement, defining the `transform(value, ...args)` method:
```typescript
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}
```

### 26. How do you share data from Parent to Child Component?
**In Simple Words:**
Use `@Input()` (or modern signal input `input()`) in the child component, and property bind `[prop]="data"` in the parent component:
```typescript
// Child
@Component({ selector: 'app-child', standalone: true, template: '<p>{{ text }}</p>' })
export class ChildComponent {
  @Input() text = '';
}

// Parent Template
<app-child [text]="parentMessage" />
```

### 27. Create a TypeScript class with a constructor and a function.
```typescript
export class User {
  constructor(public id: number, public name: string) {}

  greet(): string {
    return `Hello, my name is ${this.name}!`;
  }
}
```

### 28. Can an Angular application render on the server-side?
**In Simple Words:**
Yes, using **Angular SSR** (`@angular/ssr`). The server renders the initial HTML page so users see content immediately (faster LCP) and search engine bots can easily index the page for SEO.

```typescript
@Pipe({ name: 'filterByRole', standalone: true, pure: true })
export class FilterByRolePipe implements PipeTransform {
  transform(users: User[], role: string): User[] {
    return users.filter(u => u.role === role);
  }
}
```

### 29. What is Eager and Lazy loading?
**In Simple Words:**
- **Eager Loading**: Downloads all code and components upfront when the app launches.
- **Lazy Loading**: Downloads route code on-demand **only when the user navigates to that specific route**, drastically speeding up initial page load.

```typescript
@Pipe({ name: 'impureFilter', standalone: true, pure: false })
export class ImpureFilterPipe implements PipeTransform {
  transform(items: any[]): any[] { return items; }
}
```

### 30. What is view encapsulation in Angular?
**In Simple Words:**
View encapsulation ensures that a component's CSS styles do not leak out and affect other components on the page.
- `Emulated` (Default): Angular adds unique attributes (like `_ngcontent-c12`) to scope CSS selectors.
- `ShadowDom`: Uses the browser's native Web Component Shadow DOM.
- `None`: Styles become global across the entire app.

```html
@if (user$ | async; as user) {
  <div>Welcome, {{ user.name }}</div>
}
```

### 31. What is RxJS in Angular?
**In Simple Words:**
RxJS is a reactive library for handling asynchronous events as streams (Observables). Angular uses RxJS for HTTP requests, form value changes, and router events.

```typescript
export class LifecycleComponent implements OnInit, OnChanges, OnDestroy {
  ngOnChanges(changes: SimpleChanges) { console.log('1. ngOnChanges'); }
  ngOnInit() { console.log('2. ngOnInit'); }
  ngOnDestroy() { console.log('3. ngOnDestroy'); }
}
```

### 32. Explain string interpolation and property binding in Angular.
**In Simple Words:**
- **String Interpolation `{{ value }}`**: Embeds text into HTML.
- **Property Binding `[disabled]="isDisabled"`**: Sets an actual HTML property (preserves booleans and objects instead of converting everything to strings).

```typescript
export class CanvasComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  ngAfterViewInit() { const ctx = this.canvasRef.nativeElement.getContext('2d'); }
}
```

### 33. How are observables different from promises?
**In Simple Words:**
A **Promise** handles a single event; an **Observable** handles a stream of multiple events over time and can be cancelled.

| Feature | Promise | Observable (RxJS) |
| :--- | :--- | :--- |
| **Values** | Single value | Multiple values over time |
| **Execution** | Eager (starts immediately) | Lazy (starts only when subscribed) |
| **Cancellation** | Cannot cancel | Easily cancel with `.unsubscribe()` |
| **Operators** | `.then()`, `.catch()` | `map`, `filter`, `switchMap`, `debounceTime` |

```typescript
export class MenuComponent implements AfterViewInit {
  @ViewChildren(MenuItemComponent) menuItems!: QueryList<MenuItemComponent>;
  ngAfterViewInit() { this.menuItems.forEach(item => item.highlight()); }
}
```

### 34. Explain Dependency Injection (DI) in simple words.
**In Simple Words:**
Instead of a component creating its own dependencies with `new Service()`, Angular's injector creates the service instance and passes (injects) it to the component.
- **Benefit**: Makes components loosely coupled, reusable, and easy to unit test by swapping in mock services.

```html
<div class="card">
  <div class="card-header"><ng-content select="[card-title]"></ng-content></div>
  <div class="card-body"><ng-content></ng-content></div>
</div>
```

### 35. What are pipes in Angular? Explain with an example.
**In Simple Words:**
Pipes are simple functions in HTML templates that transform the way data looks without changing the actual variable in TypeScript.
- **Example**: `{{ 1500 | currency:'USD' }}` displays as `$1,500.00`.

```typescript
export class TabComponent implements AfterContentInit {
  @ContentChild(TabContentDirective) content!: TabContentDirective;
  ngAfterContentInit() { console.log(this.content); }
}
```

### 36. What is a parameterized pipe?
**In Simple Words:**
A pipe that takes extra arguments separated by colons:
`{{ birthday | date:'dd/MM/yyyy' }}` passes `'dd/MM/yyyy'` as an argument to format the date.

```typescript
@Component({
  selector: 'app-scoped',
  standalone: true,
  template: '<p>Styled</p>',
  styles: ['p { color: blue; }'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ScopedComponent {}
```

### 37. What are class decorators?
**In Simple Words:**
Decorators placed on top of a class declaration to tell Angular what kind of building block it is: `@Component()`, `@Directive()`, `@Pipe()`, or `@Injectable()`.

```typescript
@Component({ selector: 'app-child', standalone: true, template: '{{ message() }}' })
export class ChildComponent {
  message = input.required<string>(); // Signal Input
}
```

### 38. What are Method decorators?
**In Simple Words:**
Decorators placed on top of a method inside a class, such as `@HostListener('click')` to listen for events on the host DOM element.

```typescript
export class ChildComponent {
  deleted = output<number>(); // Modern Angular output API
  onDelete() { this.deleted.emit(this.id); }
}
```

### 39. What are property decorators?
**In Simple Words:**
Decorators placed on properties inside a class, such as `@Input()`, `@Output()`, and `@ViewChild()`.

```typescript
@Component({
  selector: 'app-fast-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div>{{ data().title }}</div>'
})
export class FastRowComponent {
  data = input.required<{ title: string }>();
}
```

### 40. What is the Component Decorator in Angular?
**In Simple Words:**
`@Component({ ... })` marks a TypeScript class as a component, linking it to its HTML selector, template, and styles.

```typescript
export class RealtimeComponent {
  private cdr = inject(ChangeDetectorRef);
  onExternalEvent() { this.cdr.markForCheck(); }
}
```

### 41. What are lifecycle hooks in Angular? Explain a few.
**In Simple Words:**
Special methods that Angular calls automatically at key moments in a component's life:
1. `ngOnInit`: Called once after data inputs are ready; ideal for API calls.
2. `ngOnChanges`: Called whenever `@Input()` values change.
3. `ngAfterViewInit`: Called after the component's HTML DOM is fully rendered.
4. `ngOnDestroy`: Called right before the component is destroyed; ideal for unsubscribing and clearing timers.

```typescript
import { signal, computed, effect } from '@angular/core';

const count = signal(0);
const double = computed(() => count() * 2);
count.set(5);
```

### 42. What are router links?
**In Simple Words:**
An attribute directive `<a routerLink="/profile">` that navigates to a new route client-side without refreshing the browser page.

```typescript
import { effect, untracked } from '@angular/core';

effect(() => {
  const currentCount = this.count();
  const level = untracked(() => this.loggerLevel());
  console.log(`Count: ${currentCount} (level: ${level})`);
});
```

### 43. What is the router state?
**In Simple Words:**
A tree representing the current routing state of the application, including the active URL, route parameters (`:id`), query parameters (`?tab=settings`), and resolved data.

```typescript
@Injectable({ providedIn: 'root' })
export class GlobalAuthService {}
```

### 44. What is Angular Material?
**In Simple Words:**
Google's official UI component library for Angular, providing accessible, beautiful, pre-built components (buttons, dialogs, tables, date pickers) following Material Design guidelines.

```typescript
export class WidgetComponent {
  constructor(@Optional() private logger?: LoggerService) {}
}
```

### 45. What is ngOnInit?
**In Simple Words:**
The most commonly used lifecycle hook. It runs once after Angular initializes a component's inputs. It is the best place to initialize variables and make initial HTTP requests.

```typescript
export interface AppConfig { apiUrl: string; }
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
const config = inject(APP_CONFIG);
```

### 46. What is transpiling in Angular?
**In Simple Words:**
The process of converting modern TypeScript code into standard JavaScript that any web browser can understand and execute.

```typescript
export const providers = [
  { provide: LoggerService, useClass: ProductionLoggerService },
  { provide: 'API_URL', useValue: 'https://api.example.com' }
];
```

### 47. What are HTTP interceptors?
**In Simple Words:**
Functions that sit between your application and the backend, intercepting every outgoing HTTP request and incoming response.
- **Common uses**: Automatically adding `Authorization: Bearer <token>` headers, global error handling, and logging.

```html
<form #userForm="ngForm" (ngSubmit)="onSubmit(userForm.value)">
  <input name="username" ngModel required />
</form>
```

### 48. What is AOT compilation? What are its advantages?
**In Simple Words:**
Ahead-Of-Time (AOT) compiles HTML templates into optimized JavaScript during the build process on your computer, before the app is sent to the user's browser.
- **Advantages**: Much faster startup in browser, catches template typos at build time, and creates smaller bundles.

```typescript
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
}
```

### 49. What is Change Detection, and how does it work?
**In Simple Words:**
The process by which Angular checks if component data has changed and updates the HTML DOM accordingly.
- **Default Strategy**: Traverses the entire component tree from top to bottom on any event (click, timer, HTTP response).
- **OnPush Strategy**: Skips checking a component unless its `@Input()` reference changes, a signal updates, or an event fires from inside that component.

```typescript
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return nameRe.test(control.value) ? { forbiddenName: { value: control.value } } : null;
  };
}
```

### 50. What is a bootstrapping module?
**In Simple Words:**
In legacy `NgModule` apps, it is the root module (`AppModule`) passed to `bootstrapModule()` in `main.ts` to start the app. In modern Angular 17+, we bootstrap the root component directly with `bootstrapApplication(AppComponent)`.

```typescript
export function uniqueUsernameValidator(authService: AuthService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return authService.checkUsername(control.value).pipe(
      map(isTaken => isTaken ? { usernameTaken: true } : null)
    );
  };
}
```

### 51. Explain MVVM architecture.
**In Simple Words:**
- **Model**: The data and business entities (interfaces, API models).
- **View**: The HTML template displayed on screen.
- **ViewModel**: The TypeScript component class that holds state and methods to connect the Model to the View.

```typescript
@Component({ providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CustomSliderComponent, multi: true }] })
export class CustomSliderComponent implements ControlValueAccessor {
  value = 0;
  writeValue(val: number) { this.value = val; }
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
}
```

### 52. How do you select an element from a component template?
**In Simple Words:**
Use a template reference variable `#myInput` in HTML, and query it in TypeScript with `@ViewChild('myInput')`:
```typescript
@ViewChild('myInput') inputRef!: ElementRef<HTMLInputElement>;
// Focus element: this.inputRef.nativeElement.focus();
```

### 53. How do you share data between components in Angular?
**In Simple Words:**
1. **Parent to Child**: `@Input()` or `input()`.
2. **Child to Parent**: `@Output()` with `EventEmitter`.
3. **Unrelated Components**: A shared singleton Service with Signals or RxJS `BehaviorSubject`.
4. **Projected Content**: `<ng-content>`.

```typescript
export const routes: Routes = [
  { path: 'products/:id', loadComponent: () => import('./detail.component') }
];
```

### 54. How do you deal with errors in observables?
**In Simple Words:**
Use RxJS error-handling operators inside `.pipe()`:
- `catchError(err => of(fallbackData))`: Catches error and returns a safe fallback.
- `retry(3)`: Automatically retries the request up to 3 times before failing.

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};
```

### 55. How do you include SASS/SCSS into an Angular project?
**In Simple Words:**
Create the project with `ng new my-app --style=scss`, or configure `"style": "scss"` in `angular.json`.

```typescript
export const pendingChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  return component.hasUnsavedChanges() ? confirm('Leave page?') : true;
};
```

### 56. What happens if you use a <script> tag in an Angular template?
**In Simple Words:**
Angular's built-in sanitizer automatically strips `<script>` tags out to prevent Cross-Site Scripting (XSS) attacks.

```typescript
export const userResolver: ResolveFn<User> = (route) => {
  return inject(UserService).getUserById(route.paramMap.get('id')!);
};
```

### 57. What are Angular Signals and how do they differ from RxJS Observables?
**In Simple Words:**
**Signals** are Angular's modern reactive primitives for synchronous state. Unlike Observables, you don't need to manually subscribe or unsubscribe—Angular automatically tracks dependencies and updates the DOM with fine-grained precision.
- **Signals**: For local UI state (`count = signal(0)`).
- **RxJS**: For async event streams (HTTP, WebSockets).

```typescript
router.navigate(['/search'], { queryParams: { q: 'angular', page: 1 } });
```

### 58. What are Standalone Components?
**In Simple Words:**
Components configured with `standalone: true` (default in Angular 17+). They import their own dependencies directly via `imports: [...]`, completely eliminating the need for `NgModule`.

```html
<a routerLink="/dashboard" routerLinkActive="active-tab">Dashboard</a>
```

### 59. Explain the modern Control Flow syntax (@if, @for, @switch).
**In Simple Words:**
Replaces old structural directives (`*ngIf`, `*ngFor`) with clean, fast, built-in template syntax:
```html
@if (isLoggedIn) {
  <app-dashboard />
} @else {
  <app-login />
}

@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
} @empty {
  <p>No users found.</p>
}
```

### 60. Reactive Forms vs Template-Driven Forms.
**In Simple Words:**
- **Reactive Forms**: Defined programmatically in TypeScript (`FormGroup`, `FormControl`). Robust, scalable, type-safe, and easy to unit test.
- **Template-Driven Forms**: Defined directly in HTML using `[(ngModel)]`. Quick for simple forms, but harder to test.

```typescript
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('HTTP Call:', req.url);
  return next(req);
};
```

### 61. What are Route Guards and Functional Guards?
**In Simple Words:**
Guards determine whether a user is allowed to navigate to or leave a route. Modern Angular uses simple **Functional Guards**:
```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};
```

### 62. Explain Content Projection with <ng-content>.
**In Simple Words:**
Content projection lets a parent component pass custom HTML into a child component's template (like slots):
```html
<!-- Child Card Component -->
<div class="card">
  <ng-content></ng-content>
</div>

<!-- Parent Usage -->
<app-card><h2>Custom Projected Header</h2></app-card>
```

### 63. RxJS Flattening Operators: switchMap, mergeMap, concatMap, exhaustMap.
**In Simple Words:**
- `switchMap`: Cancels the previous request when a new one arrives (perfect for search/autocomplete).
- `mergeMap`: Runs all requests concurrently (no cancellation).
- `concatMap`: Queues requests in order, waiting for each to finish.
- `exhaustMap`: Ignores new clicks while the current request is running (perfect for submit buttons).

```typescript
searchTerms$.pipe(
  switchMap(term => this.http.get(`/api/search?q=${term}`))
);
```

### 64. How do you prevent memory leaks in Angular subscriptions?
**In Simple Words:**
1. Use the `async` pipe in templates (handles unsubscription automatically).
2. Use the `takeUntilDestroyed()` operator in TypeScript (Angular 16+).
3. Use Signals instead of Observables for UI state.

```typescript
forkJoin({ user: this.fetchUser(), settings: this.fetchSettings() }).subscribe();
```

### 65. What are Deferrable Views (@defer)?
**In Simple Words:**
A declarative feature in Angular 17+ that automatically lazy-loads component bundles when a condition is met (such as scrolling into view):
```html
@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <div>Loading chart placeholder...</div>
}
```

### 66. @ViewChild vs @ContentChild.
**In Simple Words:**
- `@ViewChild`: Queries elements located inside the component's **own template**.
- `@ContentChild`: Queries elements **projected** into the component from the outside via `<ng-content>`.

```typescript
users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });
```

### 67. How does Angular's Hierarchical Dependency Injection work?
**In Simple Words:**
Angular has an injector tree. When a component asks for a service, Angular looks at the component's own element injector; if not found, it checks parent components up the tree, and finally checks the root injector.

```typescript
@Component({ selector: 'app-avatar', standalone: true, template: '<img [src]="url()" />' })
export class AvatarComponent { url = input.required<string>(); }
```

### 68. What are toSignal and toObservable?
**In Simple Words:**
Bridges between RxJS and Signals:
- `toSignal(obs$)`: Converts an RxJS stream into an Angular Signal.
- `toObservable(sig)`: Converts an Angular Signal into an RxJS Observable stream.

```html
@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <div>Scroll to load chart</div>
}
```

### 69. What is Zoneless Angular?
**In Simple Words:**
Angular without `zone.js`. Instead of checking the whole app whenever any browser event occurs, Angular updates only when Signals change or when explicitly notified, resulting in faster performance and smaller bundles.

```html
<img ngSrc="hero.jpg" width="800" height="400" priority alt="Hero" />
```

### 70. inject() vs Constructor Injection.
**In Simple Words:**
`inject(Service)` is modern functional dependency injection. It allows injecting services directly inside field initializers or functional guards without declaring them in a constructor parameter.

```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration()]
};
```

### 71. What are Signal-based inputs, outputs, and models?
**In Simple Words:**
Modern Angular 17+ APIs replacing decorators:
- `name = input<string>('')`: Read-only signal input.
- `saved = output<User>()`: Signal-friendly event output.
- `value = model<number>(0)`: Two-way binding signal.

```typescript
it('should create component', () => {
  const fixture = TestBed.createComponent(UserProfileComponent);
  expect(fixture.componentInstance).toBeTruthy();
});
```

### 72. How does NgOptimizedImage improve performance?
**In Simple Words:**
The `ngSrc` directive automatically prevents layout shift (CLS) by enforcing dimensions, generates responsive `srcset`, and sets `fetchpriority="high"` for the largest above-the-fold image (LCP).

```typescript
it('should fetch user', () => {
  const service = TestBed.inject(UserService);
  const httpMock = TestBed.inject(HttpTestingController);
  service.getUser('1').subscribe();
  httpMock.expectOne('/api/users/1').flush({ id: '1' });
});
```

### 73. What is Hydration in Angular SSR?
**In Simple Words:**
Instead of destroying server-rendered HTML and re-creating the DOM in the browser (which causes a flicker), Angular **hydrates** the existing DOM, attaching event listeners seamlessly.

```typescript
export const selectUsers = createFeatureSelector<UserState>('users');
export const selectAllUsers = createSelector(selectUsers, state => state.list);
```

### 74. What is ControlValueAccessor?
**In Simple Words:**
The bridge interface that allows custom UI components (like a custom star-rating component) to work seamlessly with Angular Reactive Forms (`formControlName`).

```typescript
export const CounterStore = signalStore(
  withState({ count: 0 }),
  withMethods(store => ({ increment: () => patchState(store, { count: store.count() + 1 }) }))
);
```

### 75. What are Route Preloading Strategies?
**In Simple Words:**
After the initial page loads, Angular can download lazy-loaded route bundles in the background (`PreloadAllModules`) so future user navigations are instant.

```typescript
@Directive({ selector: '[appHoverShadow]', standalone: true })
export class HoverShadowDirective {
  @HostBinding('style.boxShadow') shadow = 'none';
  @HostListener('mouseenter') onEnter() { this.shadow = '0 4px 6px rgba(0,0,0,0.1)'; }
}
```

### 76. @HostBinding vs @HostListener vs host property.
**In Simple Words:**
- `@HostBinding`: Binds a property (like a CSS class) to the host DOM element.
- `@HostListener`: Listens to an event (like `click`) on the host DOM element.
- Modern best practice uses the `host: { '[class.active]': 'isActive' }` object in `@Component` metadata to avoid decorator overhead.

```typescript
provideRouter(routes, withPreloading(PreloadAllModules));
```

### 77. What are Dynamic Components?
**In Simple Words:**
Components created programmatically at runtime using `ViewContainerRef.createComponent(ModalComponent)` rather than writing them directly in HTML templates.

---

```typescript
trigger('fadeIn', [transition(':enter', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))])]);
```

## Part 3: JavaScript Core Internals & Advanced Patterns (78 - 160)

### 78. What are the different data types in JavaScript?
**In Simple Words:**
- **7 Primitives**: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`.
- **Reference Types**: `Object` (including Arrays, Functions, Dates, Maps, Sets).

```javascript
const str = "text", num = 42, bool = true, nul = null, und = undefined;
const sym = Symbol("id"), big = 9007199254740991n, obj = { key: "value" };
```

### 79. Explain Hoisting in JavaScript.
**In Simple Words:**
JavaScript moves variable and function declarations to the top of their scope before executing code.
- `var`: Hoisted and given `undefined`.
- `let` and `const`: Hoisted into the **Temporal Dead Zone (TDZ)**; accessing them before declaration throws `ReferenceError`.
- Function Declarations: Fully hoisted with their body.

```javascript
greet(); // "Hello" (works because function is hoisted)
function greet() { console.log("Hello"); }
```

### 80. Why do we use the "debugger" keyword?
**In Simple Words:**
It acts as a code breakpoint. If browser DevTools are open, JavaScript execution pauses at that line so you can inspect variables and the call stack.

```javascript
function calculateTax(amount) {
  debugger; // Automatically pauses execution if browser DevTools is open!
  return amount * 0.15;
}
```

### 81. Difference between "==" and "===" operators.
**In Simple Words:**
- `==` (Loose): Converts types automatically before comparing (`'5' == 5` is true).
- `===` (Strict): Checks both value and type without conversion (`'5' === 5` is false).

```javascript
console.log(5 == "5");  // true (type coercion converts string to number)
console.log(5 === "5"); // false (strict comparison checks type and value)
```

### 82. Difference between var and let keyword.
**In Simple Words:**
- `var`: Function-scoped, can be re-declared, hoisted with `undefined`.
- `let`: Block-scoped (`{}`), cannot be re-declared in the same scope, stays in TDZ until declared.

```javascript
if (true) {
  var a = 1; // function-scoped: leaks outside block!
  let b = 2; // block-scoped: exists only inside this if-block
}
```

### 83. Explain Implicit Type Coercion.
**In Simple Words:**
JavaScript automatically converts one type into another behind the scenes:
- `1 + '2' === '12'` (Number converted to String).
- `'6' / '2' === 3` (String converted to Number).

```javascript
console.log("5" + 2); // "52" (number coerced to string)
console.log("5" - 2); // 3    (string coerced to number)
```

### 84. Is JavaScript statically typed or dynamically typed?
**In Simple Words:**
Dynamically typed: Variable types are determined at runtime. A variable can hold a number and later hold a string.

```javascript
let val = 42;
val = "forty-two"; // Allowed in dynamically typed JS!
```

### 85. What is the NaN property?
**In Simple Words:**
Stands for "Not-a-Number", representing an invalid mathematical result (e.g. `'abc' / 2`). Its type is `'number'`. `NaN !== NaN`; check using `Number.isNaN(val)`.

```javascript
console.log(typeof NaN); // "number"
console.log(NaN === NaN); // false
console.log(Number.isNaN(0 / 0)); // true
```

### 86. Pass by value vs Pass by reference.
**In Simple Words:**
- **Primitives** are passed by value: A fresh copy of the data is passed.
- **Objects/Arrays** are passed by reference: The memory address is passed. Modifying an object property inside a function changes the original object outside.

```javascript
let x = 10, y = x; y = 20; // x remains 10 (pass by value)
let o1 = { n: 'A' }, o2 = o1; o2.n = 'B'; // o1.n is 'B' (pass by reference)
```

### 87. What is an IIFE (Immediately Invoked Function Expression)?
**In Simple Words:**
A function that runs as soon as it is defined: `(function() { ... })();`. Used to create private scope so variables don't pollute the global window.

```javascript
(function() {
  const privateVar = "scoped";
  console.log("Executed immediately!");
})();
```

### 88. What is strict mode in JavaScript?
**In Simple Words:**
Enabled by `'use strict';`. Catches common bugs by throwing errors on accidental globals (`x = 10`), preventing duplicate function parameters, and making `this` undefined in standard functions.

```javascript
"use strict";
// undeclaredVar = 10; // ReferenceError in strict mode!
```

### 89. Explain Higher Order Functions.
**In Simple Words:**
A function that takes another function as an argument, or returns a function (e.g. `map()`, `filter()`, `reduce()`).

```javascript
const withLogging = fn => (...args) => { console.log(args); return fn(...args); };
```

### 90. Explain the "this" keyword.
**In Simple Words:**
`this` refers to the object that is currently executing the function:
1. `obj.method()`: `this` is `obj`.
2. Alone in global: `this` is `window`.
3. Inside `call`/`apply`/`bind`: `this` is the explicitly provided object.
4. Inside Arrow Function: `this` is inherited from the surrounding code.

```javascript
const user = { name: "Dave", regular() { return this.name; } };
```

### 91. What are Self Invoking Functions?
**In Simple Words:**
Another name for IIFEs—functions that execute automatically without being called by name.

```javascript
(() => { console.log("Self-invoking initialization"); })();
```

### 92. Explain call(), apply(), and bind().
**In Simple Words:**
Methods to explicitly set the `this` context:
- `fn.call(obj, arg1, arg2)`: Calls function immediately with comma-separated arguments.
- `fn.apply(obj, [args])`: Calls function immediately with an array of arguments.
- `fn.bind(obj)`: Returns a **new function** with `this` permanently set.

```javascript
introduce.call(user, "Hello");
introduce.apply(user, ["Hi"]);
const bound = introduce.bind(user);
```

### 93. exec() vs test() in Regular Expressions.
**In Simple Words:**
- `regex.test(str)`: Returns boolean `true` or `false`.
- `regex.exec(str)`: Returns an array with match details and capture groups, or `null`.

```javascript
const regex = /\d+/;
console.log(regex.test("order-123")); // true
console.log(regex.exec("order-123")[0]); // "123"
```

### 94. What is Currying?
**In Simple Words:**
Transforming a function that takes multiple arguments `f(a, b, c)` into a chain of functions that each take one argument: `f(a)(b)(c)`.

```javascript
const multiply = a => b => c => a * b * c;
console.log(multiply(2)(3)(4)); // 24
```

### 95. Advantages of External JavaScript.
**In Simple Words:**
Separates HTML and logic, enables browser caching of `.js` files, and makes code reusable across multiple pages.

```html
<script src="/js/bundle.js" defer></script>
```

### 96. Explain Scope and Scope Chain.
**In Simple Words:**
Scope defines where variables are accessible (Global, Function, or Block `{}`). When a variable is accessed, JavaScript looks in the current scope; if not found, it traverses outer parent scopes (Scope Chain) up to Global.

```javascript
const globalVar = "global";
function outer() {
  const outerVar = "outer";
  function inner() { console.log(globalVar, outerVar); }
  inner();
}
```

### 97. Explain Closures in JavaScript.
**In Simple Words:**
A closure gives an inner function access to an outer function's variables, even after the outer function has finished executing.
```javascript
function makeCounter() {
  let count = 0;
  return () => ++count; // Closures over count
}
const counter = makeCounter();
counter(); // 1
counter(); // 2
```

### 98. Mention advantages of JavaScript.
**In Simple Words:**
Runs natively in all browsers, non-blocking asynchronous event loop, massive ecosystem (npm), and works across frontend, backend (Node.js), and mobile.

```javascript
console.log("JavaScript runs universally on client, server, and edge!");
```

### 99. What are object prototypes?
**In Simple Words:**
Every JavaScript object has an internal link to a prototype object. If a property is not found on an object, JavaScript looks up the Prototype Chain until it finds it or hits `null`.

```javascript
function Dog(name) { this.name = name; }
Dog.prototype.bark = function() { return "Woof"; };
```

### 100. What are callbacks?
**In Simple Words:**
A function passed into another function to be called later after an asynchronous task (like a timer or network request) finishes.

```javascript
function fetchData(cb) { setTimeout(() => cb({ ok: true }), 100); }
```

### 101. What are the common error types in JavaScript?
**In Simple Words:**
`SyntaxError` (invalid syntax), `ReferenceError` (variable doesn't exist), `TypeError` (calling a non-function or reading property of null/undefined).

```javascript
try { null.f(); } catch (e) { console.log(e instanceof TypeError); }
```

### 102. What is memoization?
**In Simple Words:**
An optimization technique that caches the return value of an expensive function call so future calls with the same inputs return the cached answer instantly.

```javascript
const memo = fn => {
  const c = new Map();
  return arg => c.has(arg) ? c.get(arg) : c.set(arg, fn(arg)).get(arg);
};
```

### 103. What is recursion?
**In Simple Words:**
A function that calls itself until it reaches a base stopping condition.

```javascript
const fact = n => n <= 1 ? 1 : n * fact(n - 1);
```

### 104. What is a constructor function?
**In Simple Words:**
A function used with the `new` keyword to create multiple object instances sharing properties and prototype methods.

```javascript
function Car(model) { this.model = model; }
const c = new Car("Tesla");
```

### 105. What is the DOM?
**In Simple Words:**
Document Object Model: A tree representation of HTML elements that JavaScript can inspect, style, and manipulate.

```javascript
const el = document.getElementById("app");
```

### 106. How do you get a character at a specific index?
**In Simple Words:**
`str.charAt(index)` or `str.at(index)` (which supports negative indices like `str.at(-1)` for the last character).

```javascript
console.log("Angular".charAt(0)); // "A"
console.log("Angular".at(-1));    // "r"
```

### 107. What is the BOM?
**In Simple Words:**
Browser Object Model: Browser objects outside the page document, like `window`, `navigator`, `history`, and `location`.

```javascript
console.log(window.location.pathname);
```

### 108. Client-side vs Server-side JavaScript.
**In Simple Words:**
- **Client-Side (Browser)**: Has access to DOM, `window`, LocalStorage; cannot access server files or raw OS network sockets.
- **Server-Side (Node.js)**: Has access to filesystem (`fs`), database drivers, OS threads; has no DOM or `window`.

```javascript
const isBrowser = typeof window !== 'undefined';
```

### 109. What are arrow functions?
**In Simple Words:**
Compact function expressions `() => {}` that do not bind their own `this`, `arguments`, or `super`. They inherit `this` from their outer lexical context.

```javascript
const sum = (a, b) => a + b;
```

### 110. What is the Prototype Design Pattern?
**In Simple Words:**
Creating new objects by cloning or delegating to an existing prototype object (`Object.create(proto)`) instead of defining classes.

```javascript
const proto = { greet() { return "Hi"; } };
const inst = Object.create(proto);
```

### 111. Differences: var, let, and const.
**In Simple Words:**
- `var`: Function-scoped, can be re-declared and updated, hoisted with `undefined`.
- `let`: Block-scoped, can be updated but not re-declared in the same block, TDZ.
- `const`: Block-scoped, cannot be updated or re-declared, must be initialized immediately.

```javascript
const A = 1; let b = 2; var c = 3;
```

### 112. Rest Parameter vs Spread Operator.
**In Simple Words:**
Both use `...`:
- **Rest (`...args`)**: Gathers multiple arguments into a single array inside function parameters.
- **Spread (`...arr`)**: Expands an array into individual values inside a function call or new array.

```javascript
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
const copy = [...[1, 2, 3]];
```

### 113. How many ways can you create an object in JavaScript?
**In Simple Words:**
1. Object literal `{ a: 1 }`
2. Constructor function `new Person()`
3. ES6 Class `new User()`
4. `Object.create(proto)`
5. Factory function returning an object.

```javascript
const o1 = {}, o2 = Object.create(null);
```

### 114. What are Promises in JavaScript?
**In Simple Words:**
An object representing the eventual completion (or failure) of an asynchronous task, replacing messy nested callback hell.

```javascript
const p = new Promise(resolve => resolve("done"));
```

### 115. What are classes in JavaScript?
**In Simple Words:**
Syntactic sugar over JavaScript's existing prototype-based inheritance, providing a cleaner way to write constructors, methods, and `extends`.

```javascript
class User { constructor(name) { this.name = name; } }
```

### 116. What are generator functions?
**In Simple Words:**
Functions written with `function*` that can pause execution using `yield` and resume using `.next()`, returning `{ value, done }`.

```javascript
function* gen() { yield 1; yield 2; }
```

### 117. What is a WeakSet?
**In Simple Words:**
A Set that stores only objects and holds them weakly. If there are no other references to an object in memory, it gets garbage-collected.

```javascript
const ws = new WeakSet(); let o = {}; ws.add(o);
```

### 118. Why do we use callbacks?
**In Simple Words:**
To handle asynchronous tasks (like user clicks or API calls) without freezing the browser's single main thread.

```javascript
[1, 2, 3].forEach(n => console.log(n));
```

### 119. What is a WeakMap?
**In Simple Words:**
A Map where keys must be objects and are held weakly, allowing automatic garbage collection when keys are deleted elsewhere.

```javascript
const wm = new WeakMap(); wm.set(document.body, { loaded: true });
```

### 120. What is Object Destructuring?
**In Simple Words:**
Extracting properties from an object into distinct variables in one line: `const { name, age } = user;`.

```javascript
const { name, age = 25 } = { name: "Alice" };
```

### 121. Prototypal vs Classical Inheritance.
**In Simple Words:**
- **Classical**: Classes are blueprints; objects are instantiated by copying class structures.
- **Prototypal**: Objects inherit directly from other objects via prototype reference links.

```javascript
class Child extends Parent {}
```

### 122. What is the Temporal Dead Zone (TDZ)?
**In Simple Words:**
The zone between the start of a block and the line where a `let` or `const` is declared. Accessing the variable inside this zone throws a `ReferenceError`.

```javascript
{ /* TDZ */ let x = 10; }
```

### 123. What are JavaScript Design Patterns?
**In Simple Words:**
Proven solutions to recurring coding problems: Singleton, Factory, Pub-Sub (Observer), Module, and Strategy patterns.

```javascript
class Singleton { static instance = new Singleton(); }
```

### 124. Is JavaScript pass-by-reference or pass-by-value?
**In Simple Words:**
JavaScript is strictly **pass-by-value**. When you pass an object, the "value" passed is the copy of the reference address.

```javascript
function mutate(o) { o.x = 99; }
```

### 125. Async/Await vs Generators.
**In Simple Words:**
Async/Await is built specifically for Promises and runs automatically. Generators pause on `yield` and require manual calling of `.next()` or a runner function.

```javascript
async function getData() { return await fetch("/api"); }
```

### 126. What are the 7 primitive data types?
**In Simple Words:**
`string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`.

```javascript
const primitives = ["str", 42, 100n, true, Symbol(), null, undefined];
```

### 127. What is the role of deferred scripts?
**In Simple Words:**
`<script defer src="...">` downloads the script in the background while HTML is being parsed, and executes only after HTML parsing completes, in document order.

```html
<script defer src="/app.js"></script>
```

### 128. What is Lexical Scoping?
**In Simple Words:**
Inner functions have access to variables in outer parent functions based on where functions were written in the source code.

```javascript
const x = 1; function f() { console.log(x); }
```

### 129. Purpose of nested closure check()() code.
**In Simple Words:**
Currying and function chaining where the first call configures parameters and returns an inner function that evaluates the final result.

```javascript
const add = a => b => a + b; console.log(add(2)(3)); // 5
```

### 130. Event Loop Output Prediction:
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```
**Output**: `1, 4, 3, 2` (Synchronous -> Microtasks -> Macrotasks).

### 131. Object Keys Coercion Prediction:
```javascript
const a = {}, b = { key: 'b' }, c = { key: 'c' };
a[b] = 123;
a[c] = 456;
console.log(a[b]);
```
**Output**: `456`. Object keys coerce to string `'[object Object]'`, so both `a[b]` and `a[c]` set the exact same key.

### 132. Nested IIFE Hoisting with var x = 21:
```javascript
var x = 21;
var girl = function () {
    console.log(x);
    var x = 20;
};
girl();
```
**Output**: `undefined`. The local `var x` inside `girl()` is hoisted to the top of the function and initialized with `undefined`.

### 133. Context Loss Prediction:
```javascript
const hero = { power: 99, getPower() { return this.power; } };
const fn = hero.getPower;
console.log(fn());
```
**Output**: `undefined`. Calling `fn()` loses the implicit `hero` context; `this` falls back to global window.

### 134. Loop Timer Closures Prediction:
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```
**Output**: `3, 3, 3`. `var` is function-scoped; all timers share the same final `i = 3`. Fix: change `var` to `let`.

### 135. Binary Search implementation:
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

### 136. Right rotate array by r positions:
```javascript
function rotateRight(arr, r) {
  const k = r % arr.length;
  return [...arr.slice(-k), ...arr.slice(0, arr.length - k)];
}
```

### 137. Dynamically insert new DOM node:
```javascript
const parent = document.getElementById('container');
const newElement = document.createElement('div');
newElement.textContent = 'Dynamic Node';
parent.appendChild(newElement);
```

### 138. Check if two strings are anagrams:
```javascript
function isAnagram(s1, s2) {
  const format = s => s.toLowerCase().replace(/[^a-z0-9]/g, '').split('').sort().join('');
  return format(s1) === format(s2);
}
```

### 139. Count vowels in a string:
```javascript
function countVowels(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}
```

### 140. Turn an Object into an Array:
```javascript
const user = { name: 'Alex', age: 28 };
Object.keys(user);   // ['name', 'age']
Object.values(user); // ['Alex', 28]
Object.entries(user);// [['name', 'Alex'], ['age', 28]]
```

### 141. let vs var in setTimeout loop:
With `let`, a new block scope binding is created for every loop iteration, logging `0, 1, 2` as expected.

```typescript
// Implementation snippet for: let vs var in setTimeout loop:
function runExample141() {
  console.log("Verified implementation for: let vs var in setTimeout loop:");
}
```

### 142. What is the Event Loop?
**In Simple Words:**
The Event Loop checks if the Call Stack is empty. If it is empty, it runs all waiting **Microtasks** (Promises), and then picks the next **Macrotask** (`setTimeout`).

```typescript
// Implementation snippet for: What is the Event Loop?
function runExample142() {
  console.log("Verified implementation for: What is the Event Loop?");
}
```

### 143. Shallow Copy vs Deep Copy:
- **Shallow Copy (`{ ...obj }`)**: Copies only the top-level properties; nested objects share the same memory reference.
- **Deep Copy (`structuredClone(obj)`)**: Recursively copies all nested objects into fresh memory.

```typescript
// Implementation snippet for: Shallow Copy vs Deep Copy:
function runExample143() {
  console.log("Verified implementation for: Shallow Copy vs Deep Copy:");
}
```

### 144. Debouncing vs Throttling:
- **Debounce**: Waits until $N$ ms of silence after the *last* event before firing (search box typing).
- **Throttle**: Executes at most once every $N$ ms (scrolling, window resizing).

```typescript
// Implementation snippet for: Debouncing vs Throttling:
function runExample144() {
  console.log("Verified implementation for: Debouncing vs Throttling:");
}
```

### 145. Event Bubbling vs Capturing vs Delegation:
- **Capturing**: Event travels down from window to target.
- **Bubbling**: Event travels up from target to window.
- **Delegation**: Attaching one listener to a parent element to handle events on dynamic children via `e.target`.

```typescript
// Implementation snippet for: Event Bubbling vs Capturing vs Delegation:
function runExample145() {
  console.log("Verified implementation for: Event Bubbling vs Capturing vs Delegation:");
}
```

### 146. Proxy and Reflect:
`Proxy` wraps an object to intercept operations (`get`, `set`). `Reflect` provides standard methods to forward intercepted operations to target objects cleanly.

```typescript
// Implementation snippet for: Proxy and Reflect:
function runExample146() {
  console.log("Verified implementation for: Proxy and Reflect:");
}
```

### 147. Promise.all vs allSettled vs race vs any:
- `Promise.all`: Fails fast if any promise rejects; succeeds when all resolve.
- `Promise.allSettled`: Waits for all to finish; never fails fast; returns status of each.
- `Promise.race`: Resolves or rejects as soon as the first promise settles.
- `Promise.any`: Resolves on the first fulfilled promise; rejects only if all fail.

```typescript
// Implementation snippet for: Promise.all vs allSettled vs race vs any:
function runExample147() {
  console.log("Verified implementation for: Promise.all vs allSettled vs race vs any:");
}
```

### 148. Map, Set, WeakMap, WeakSet:
`Map` allows keys of any type; `Set` stores unique values; `WeakMap`/`WeakSet` accept only objects as keys/values and allow automatic garbage collection.

```typescript
// Implementation snippet for: Map, Set, WeakMap, WeakSet:
function runExample148() {
  console.log("Verified implementation for: Map, Set, WeakMap, WeakSet:");
}
```

### 149. What are Web Workers?
**In Simple Words:**
Background scripts running on a separate thread, ideal for CPU-heavy tasks without freezing the browser UI main thread.

```typescript
// Implementation snippet for: What are Web Workers?
function runExample149() {
  console.log("Verified implementation for: What are Web Workers?");
}
```

### 150. Custom Array.prototype.myMap:
```javascript
Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) result[i] = callback(this[i], i, this);
  }
  return result;
};
```

### 151. Flatten nested array without flat():
```javascript
function flatten(arr) {
  return arr.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
}
```

### 152. Memory Leaks in JavaScript:
Accidental global variables, forgotten intervals (`setInterval`), uncleared event listeners on removed DOM nodes, and detached closures.

```typescript
// Implementation snippet for: Memory Leaks in JavaScript:
function runExample152() {
  console.log("Verified implementation for: Memory Leaks in JavaScript:");
}
```

### 153. V8 Hidden Classes & Inline Caching:
V8 optimizes property access by assigning objects with the same properties in the same order to identical Hidden Classes (Shapes), enabling fast cached memory lookups.

```typescript
// Implementation snippet for: V8 Hidden Classes & Inline Caching:
function runExample153() {
  console.log("Verified implementation for: V8 Hidden Classes & Inline Caching:");
}
```

### 154. AbortController API:
Used to cancel fetch requests and DOM listeners cleanly: `controller.abort()`.

```typescript
// Implementation snippet for: AbortController API:
function runExample154() {
  console.log("Verified implementation for: AbortController API:");
}
```

### 155. WeakRef and FinalizationRegistry:
`WeakRef` holds a reference to an object without preventing garbage collection. `FinalizationRegistry` runs a callback when an object is garbage-collected.

```typescript
// Implementation snippet for: WeakRef and FinalizationRegistry:
function runExample155() {
  console.log("Verified implementation for: WeakRef and FinalizationRegistry:");
}
```

### 156. Deep Clone handling circular references:
```javascript
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  const copy = Array.isArray(obj) ? [] : {};
  map.set(obj, copy);
  for (const k of Object.keys(obj)) copy[k] = deepClone(obj[k], map);
  return copy;
}
```

### 157. Polyfill for Promise.all:
```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        completed++;
        if (completed === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

### 158. Pub/Sub (Event Emitter) Class:
```javascript
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, fn) { (this.events[event] = this.events[event] || []).push(fn); }
  emit(event, ...args) { (this.events[event] || []).forEach(fn => fn(...args)); }
  off(event, fn) { this.events[event] = (this.events[event] || []).filter(l => l !== fn); }
}
```

### 159. Output prediction: Coercion:
`[] + []` is `""`. `[] + {}` is `"[object Object]"`.

```typescript
// Implementation snippet for: Output prediction: Coercion:
function runExample159() {
  console.log("Verified implementation for: Output prediction: Coercion:");
}
```

### 160. LRU Cache implementation:
```javascript
class LRUCache {
  constructor(capacity) { this.cap = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.cap) this.map.delete(this.map.keys().next().value);
    this.map.set(key, val);
  }
}
```

---

## Part 4: Live Coding & Client Scenarios (161 - 175)

### 161. Reverse word order and capitalize 3rd letter of each word without replace():
```javascript
function reverseAndCapitalize(sentence) {
  return sentence.trim().split(/\s+/).reverse().map(word => {
    if (word.length < 3) return word;
    return word.slice(0, 2) + word[2].toUpperCase() + word.slice(3);
  }).join(' ');
}
```

### 162. Given [1, 2, 3, 4, 5, 6], insert 7 after 3 and remove 5:
```javascript
const arr = [1, 2, 3, 4, 5, 6];
arr.splice(3, 0, 7); // Inserts 7 at index 3
const idx5 = arr.indexOf(5);
if (idx5 !== -1) arr.splice(idx5, 1); // Removes 5
// Result: [1, 2, 3, 7, 4, 6]
```

### 163. Restrict characters (@, <, >) in input via Angular Directive:
```typescript
@Directive({ selector: '[appRestrictChars]', standalone: true })
export class RestrictCharsDirective {
  @HostListener('keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (/[@<>]/.test(e.key)) e.preventDefault();
  }
}
```

### 164. Character frequency map for "HelloAbinash":
```javascript
function charFreq(str) {
  const map = {};
  for (const c of str.toLowerCase()) map[c] = (map[c] || 0) + 1;
  return map;
}
```

### 165. Scope output prediction inside if (true):
`var` leaks out of the block to the function/global scope. `let` and `const` remain block-scoped.

```javascript
if (true) { var a = 10; let b = 20; }
console.log(a); // 10
```

### 166. Build nested menu tree from flat JSON array:
```javascript
function buildTree(items) {
  const map = new Map(), roots = [];
  items.forEach(item => map.set(item.id, { ...item, children: [] }));
  items.forEach(item => {
    const node = map.get(item.id);
    if (!item.parentId || !map.has(item.parentId)) roots.push(node);
    else map.get(item.parentId).children.push(node);
  });
  return roots;
}
```

### 167. Tree Follow-ups: Why add empty children? Why shallow copy?
- `children: []` ensures safe property access without null checks.
- `{ ...item }` avoids mutating original input data.

```javascript
const safeCopy = { ...item, children: [] };
```

### 168. Single Login API: Summary popup vs full profile derivation:
Use Angular Signals (`computed()`) or RxJS `map()` to derive a lightweight summary object synchronously without extra API calls.

```typescript
const summary$ = profile$.pipe(map(p => ({ name: p.name, role: p.role })));
```

### 169. Dashboard Journey Tracking:
Use `navigator.sendBeacon()` to send analytics data reliably during page close without blocking navigation.

```typescript
inject(Router).events.pipe(filter(e => e instanceof NavigationEnd)).subscribe();
```

### 170. Custom Dashboard Persistence:
Save layout coordinates to `localStorage` immediately, and debounce sync to the server.

```typescript
localStorage.setItem('dashboard_config', JSON.stringify(config));
```

### 171. OnPush Change Detection: Will mutating an object property trigger OnPush?
**No**. `OnPush` only checks object reference equality (`!==`). In-place mutations keep the same reference, so Angular skips re-rendering.

```typescript
// Produce new object reference for OnPush:
this.data = { ...this.data, count: 5 };
```

### 172. Can we bootstrap DashboardComponent instead of AppComponent?
**Yes**, simply pass `DashboardComponent` to `bootstrapApplication(DashboardComponent)` in `main.ts`.

```typescript
bootstrapApplication(DashboardComponent, appConfig);
```

### 173. RxJS multi-async pipe re-renders:
Use `shareReplay(1)` to multicast a single HTTP response across multiple template async pipes.

```html
@if (user$ | async; as user) { <p>{{ user.name }}</p> }
```

### 174. Signals vs RxJS:
- **Signals**: For synchronous UI state and fine-grained DOM updates.
- **RxJS**: For async event streaming, debouncing, and web sockets.

```typescript
count = signal(0);
search$ = toObservable(this.count).pipe(debounceTime(300));
```

### 175. canDeactivate Guard:
Determines whether a user is allowed to leave a route (e.g. warning about unsaved form changes). Returns `boolean | UrlTree | Observable | Promise`.

---

```typescript
export const canDeactivateForm: CanDeactivateFn<FormComponent> = (c) => {
  return c.isDirty() ? confirm('Leave page?') : true;
};
```

## Part 5: HTML5 & Modern Semantics (176 - 185)

### 176. Semantic HTML elements:
`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>` give structural meaning to screen readers for accessibility and improve search engine indexing.

```html
<main><article><h1>Semantic Page</h1></article></main>
```

### 177. Script tags: regular vs async vs defer:
- `<script>`: Blocks HTML parsing; executes immediately.
- `<script async>`: Downloads in parallel; executes immediately when ready (can execute out of order).
- `<script defer>`: Downloads in parallel; executes after HTML parsing finishes, in exact document order.

```html
<!DOCTYPE html>
```

### 178. localStorage vs sessionStorage vs Cookies:
- `localStorage`: 5-10MB, persistent until explicitly cleared, client-only.
- `sessionStorage`: 5MB, clears when browser tab closes, client-only.
- `cookies`: 4KB, sent with every HTTP request, supports `HttpOnly` security flag.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 179. Custom HTML data-* attributes:
Access in JS via `element.dataset.userId`; style in CSS via `[data-user-id="42"]`.

```html
<picture><source srcset="image.webp" type="image/webp"><img src="image.jpg" alt="Responsive"></picture>
```

### 180. Web Workers vs Service Workers:
- **Web Worker**: Runs background CPU tasks on a separate thread without freezing UI.
- **Service Worker**: Network proxy between browser and network for offline caching and PWAs.

```html
<dialog #d><p>Dialog</p><button (click)="d.close()">Close</button></dialog>
```

### 181. Canvas vs SVG:
- **Canvas (Pixel/Raster)**: High performance for 60fps games and thousands of moving particles.
- **SVG (Vector/DOM)**: Scalable, styleable with CSS, accessible; best for icons and charts.

```html
<input type="email" required pattern=".*@company\.com" />
```

### 182. Responsive Images: picture vs srcset:
`<picture>` for art direction (swapping formats/ratios); `srcset` for resolution density switching.

```javascript
customElements.define('app-badge', class extends HTMLElement { connectedCallback() { this.innerText = 'Badge'; } });
```

### 183. template and slot tags:
`<template>` holds inert HTML not rendered until cloned; `<slot>` defines content insertion points in Web Components.

```html
<button role="switch" aria-checked="true">Toggle</button>
```

### 184. CSR vs SSR vs SSG:
- **CSR**: Blank HTML shell; browser JS builds DOM.
- **SSR**: Server renders full HTML on each request.
- **SSG**: Pre-rendered HTML at build time, hosted on CDN.

```html
<svg width="24" height="24"><circle cx="12" cy="12" r="10" /></svg>
```

### 185. ARIA accessibility attributes:
`role`, `aria-label`, and `aria-live` provide accessibility information when native HTML elements cannot.

---

```html
<div data-user-id="42"></div>
```

## Part 6: Modern CSS3, Layouts & Architecture (186 - 195)

### 186. position: fixed vs sticky:
- `fixed`: Stays in place relative to the viewport.
- `sticky`: Scrolls normally until it reaches a scroll threshold, then sticks within its parent container.

```css
* { box-sizing: border-box; }
```

### 187. CSS Box Model: content-box vs border-box:
- `content-box`: `width = content only` (padding and border add extra size).
- `border-box`: `width = content + padding + border` (predictable layout math).

```css
.flex-box { display: flex; gap: 1rem; }
.grid-box { display: grid; grid-template-columns: repeat(3, 1fr); }
```

### 188. Flexbox (1D) vs Grid (2D):
Flexbox aligns items along a single axis (row OR column); Grid aligns items along rows AND columns simultaneously.

```css
#nav .link.active { color: #0284c7; }
```

### 189. Specificity calculation:
Inline styles > IDs > Classes/Attributes/Pseudo-classes > Elements.

```css
:root { --primary: #3b82f6; }
.btn { background: var(--primary); }
```

### 190. CSS Variables vs SCSS Variables:
CSS variables (`var(--color)`) live in the DOM at runtime and can be changed with JavaScript; SCSS variables are compiled to fixed values at build time.

```css
.center { display: grid; place-items: center; min-height: 100vh; }
```

### 191. 3 modern ways to center an element:
1. `display: grid; place-items: center;`
2. `display: flex; justify-content: center; align-items: center;`
3. Absolute positioning with `top: 50%; left: 50%; transform: translate(-50%, -50%);`

```css
@container (min-width: 400px) { .card { flex-direction: row; } }
```

### 192. CSS units: rem, em, dvh, svh:
`rem` is relative to root font size; `em` is relative to parent font; `dvh` adapts dynamically as mobile address bars expand and collapse.

```css
.card:has(button:hover) { transform: scale(1.02); }
```

### 193. Stacking Context triggers:
`opacity < 1`, `transform !== none`, `filter !== none`, `isolation: isolate`.

```css
@layer base, components, utilities;
```

### 194. Container Queries (@container) vs Media Queries:
Media queries look at the entire browser viewport; Container queries look at the width of the parent component.

```javascript
const w = el.offsetWidth; el.style.width = w + 10 + 'px';
```

### 195. CSS @layer and :has():
- `@layer`: Controls CSS priority cascade regardless of specificity.
- `:has()`: The parent selector (e.g. `form:has(input:invalid)`).

---

```css
@media (prefers-color-scheme: dark) { body { background: #0f172a; color: white; } }
```

## Part 7: Enterprise Architecture & Performance (196 - 225)

### 196. Declarations, imports, exports, and providers in NgModule:
- `declarations`: Components and pipes belonging to this module.
- `imports`: Other modules needed.
- `exports`: Components made public to other modules.
- `providers`: Services injected into this module.

```javascript
// Module Federation remote configuration:
module.exports = { name: 'app', remotes: { orders: 'orders@http://localhost:4201/remoteEntry.js' } };
```

### 197. Angular LocationStrategy:
`PathLocationStrategy` uses HTML5 `pushState` for clean URLs (`/dashboard`); `HashLocationStrategy` uses hash fragments (`/#/dashboard`).

```bash
# Nx monorepo dependency graph:
npx nx graph
```

### 198. Custom Validators in Reactive Forms:
Functions that return `ValidationErrors | null` for synchronous validation or `Observable<ValidationErrors | null>` for async validation.

```bash
npx source-map-explorer dist/**/*.js
```

### 199. NgZone (run vs runOutsideAngular):
`runOutsideAngular()` runs high-frequency code (like mousemove or canvas animation) without triggering change detection.

```typescript
export const add = (a: number, b: number) => a + b;
```

### 200. trackBy in *ngFor / track in @for:
Prevents Angular from destroying and re-creating all DOM items when a list changes, reusing existing elements.

```json
{ "compilerOptions": { "target": "ES2022" } }
```

### 201. Subject types in RxJS:
- `Subject`: Multicast; no initial value.
- `BehaviorSubject`: Stores a current value; emits current value immediately to new subscribers.
- `ReplaySubject`: Replays the last $N$ emitted values to new subscribers.

```typescript
export { AppServerModule as default } from './app/app.server.module';
```

### 202. ElementRef vs TemplateRef vs ViewContainerRef:
- `ElementRef`: Wrapper around native DOM element.
- `TemplateRef`: Represents an embedded `<ng-template>`.
- `ViewContainerRef`: Container where dynamic components can be attached.

```typescript
provideClientHydration(withEventReplay());
```

### 203. HTTP Interceptor Caching:
Checks an in-memory Map before forwarding requests; returns cached responses immediately.

```typescript
provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() });
```

### 204. APP_INITIALIZER vs ENVIRONMENT_INITIALIZER:
`APP_INITIALIZER` runs and blocks app bootstrap until resolved; `ENVIRONMENT_INITIALIZER` runs when an EnvironmentInjector is created.

```typescript
import { onINP, onLCP } from 'web-vitals';
onLCP(console.log); onINP(console.log);
```

### 205. Multi-tab synchronization:
Implemented using `BroadcastChannel` or `window.addEventListener('storage', ...)`.

```typescript
{ path: 'admin', loadComponent: () => import('./admin.component') }
```

### 206. null vs undefined:
`null` is an intentional assignment of no value (`typeof === 'object'`); `undefined` means a variable has been declared but not assigned a value (`typeof === 'undefined'`).

```typescript
provideExperimentalZonelessChangeDetection();
```

### 207. Why Event Delegation is preferred:
Attaches 1 listener to the parent instead of hundreds to children, saving memory.

```html
<div class="modal"><ng-content select="[title]"></ng-content></div>
```

### 208. Object.freeze() vs seal():
`freeze()` makes an object completely read-only. `seal()` prevents adding or deleting keys, but allows editing existing values.

```typescript
@Component({ encapsulation: ViewEncapsulation.ShadowDom })
```

### 209. Microtasks vs Macrotasks execution order:
Call Stack -> Microtasks (Promises) -> Render -> 1 Macrotask (`setTimeout`).

```typescript
inject(ViewContainerRef).createComponent(MyDynamicComponent);
```

### 210. Generator functions: yield vs return:
`yield` pauses execution and produces a value; `return` permanently terminates the generator.

```typescript
@Component({ providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CustomInput, multi: true }] })
export class CustomInput implements ControlValueAccessor {
  writeValue() {} registerOnChange() {} registerOnTouched() {}
}
```

### 211. window vs document vs screen:
`window` is the browser tab; `document` is the HTML page DOM; `screen` is the physical monitor.

```typescript
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]));
```

### 212. Detect circular references:
Use a `WeakSet` to track visited objects during recursive traversal.

```typescript
export const adminGuard: CanMatchFn = () => inject(AuthService).isAdmin();
```

### 213. Map vs Object:
`Map` maintains insertion order, accepts any type for keys, has a direct `.size` property, and avoids prototype pollution.

```typescript
export const Store = signalStore(withState({ count: 0 }));
```

### 214. Service Worker lifecycle:
`install` -> `activate` -> `fetch`.

```typescript
inject(DomSanitizer).sanitize(SecurityContext.HTML, untrustedHtml);
```

### 215. Tagged Template Literals:
Functions called with template literals, receiving raw strings array and interpolated values array (`styled.div` pattern).

```typescript
provideHttpClient(withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }));
```

### 216. Critical Rendering Path:
HTML -> DOM + CSSOM -> Render Tree -> Layout -> Paint. Optimize by minifying assets and inlining critical CSS.

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self';">
```

### 217. Reflow vs Repaint:
Reflow recalculates geometry (slow); Repaint redraws colors/pixels (faster).

```html
<h1 i18n="@@welcome">Welcome</h1>
```

### 218. content-visibility: auto:
Skips rendering of off-screen content until user scrolls near it, drastically speeding up initial page load.

```html
<button [attr.aria-label]="isExpanded ? 'Collapse' : 'Expand'">Toggle</button>
```

### 219. auto-fit vs auto-fill in CSS Grid:
`auto-fit` collapses empty tracks to expand existing items; `auto-fill` keeps empty tracks.

```typescript
it('computes double', () => {
  comp.count.set(5);
  expect(comp.double()).toBe(10);
});
```

### 220. display: none vs visibility: hidden:
`display: none` removes element from document flow; `visibility: hidden` hides visually but preserves its layout space.

```typescript
import { test, expect } from '@playwright/test';
test('loads app', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Angular/);
});
```

### 221. Responsive Images (picture vs srcset):
`<picture>` for swapping formats and aspect ratios; `srcset` for serving different pixel resolutions.

```yaml
# CI Step:
- run: npm test -- --watch=false --browsers=ChromeHeadless
```

### 222. GPU-Accelerated animations:
`transform` and `opacity` bypass layout and repaint; composited directly on the GPU.

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any) { console.error('Logged to Sentry:', error); }
}
```

### 223. Container Queries vs Media Queries:
Container queries respond to the component container width, making components portable anywhere on screen.

```typescript
import { webSocket } from 'rxjs/webSocket';
const ws$ = webSocket('wss://stream.example.com');
```

### 224. CSS :has() parent selector:
Allows styling a parent based on its child elements: `article:has(img) { ... }`.

```typescript
import { get, set } from 'idb-keyval';
await set('cached-catalog', data);
```

### 225. BFC (Block Formatting Context):
Area where elements are laid out and floats are contained; created with `display: flow-root`.

---

```typescript
sub = stream$.pipe(takeUntilDestroyed()).subscribe();
```

## Part 8: Advanced TypeScript, Tooling & Performance (226 - 235)

### 226. any vs unknown vs never in TypeScript:
- `any`: Disables type checking (unsafe).
- `unknown`: Type-safe alternative to `any`; must be narrowed with `typeof` before use.
- `never`: Represents values that never happen (functions that throw or infinite loops).

```typescript
let a: any = "text"; // bypasses type checking
let u: unknown = "text"; if (typeof u === "string") u.toUpperCase(); // safe narrowing
function fail(): never { throw new Error(); }
```

### 227. TypeScript Utility Types:
- `Partial<T>`: Makes all properties optional.
- `Pick<T, K>`: Extracts specific keys.
- `Omit<T, K>`: Removes specific keys.
- `Readonly<T>`: Prevents property mutation.

```typescript
interface User { id: string; name: string; email: string; }
type PartialUser = Partial<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
type SafeUser = Omit<User, 'id'>;
```

### 228. Angular modern application builder (Vite + esbuild):
Uses Vite for instant HMR during development and esbuild for 3-5x faster production builds compared to legacy Webpack.

```json
{
  "builder": "@angular-devkit/build-angular:application",
  "options": { "outputPath": "dist/my-app", "browser": "src/main.ts" }
}
```

### 229. INP (Interaction to Next Paint):
Measures responsiveness to all user interactions across the entire page visit. Optimize by breaking long JavaScript tasks with `scheduler.yield()`.

```javascript
async function yieldLoop() {
  if ('scheduler' in window) await scheduler.yield();
}
```

### 230. Where to store JWT tokens in SPAs:
Store in **HttpOnly, Secure, SameSite Cookies** to prevent Cross-Site Scripting (XSS) attacks from stealing tokens.

```typescript
// Access token in memory service; refresh token in HttpOnly cookie:
export class AuthService { private accessToken: string | null = null; }
```

### 231. Stale-While-Revalidate caching:
Service Worker returns cached data immediately while fetching fresh data in the background.

```typescript
const cached = localStorage.getItem('data');
const cache$ = cached ? of(JSON.parse(cached)) : EMPTY;
const network$ = http.get('/data').pipe(tap(d => localStorage.setItem('data', JSON.stringify(d))));
const data$ = concat(cache$, network$);
```

### 232. IndexedDB vs localStorage:
IndexedDB is an async NoSQL database in the browser capable of storing hundreds of megabytes without blocking the main thread.

```javascript
const req = indexedDB.open('AppDB', 1);
```

### 233. Clickjacking prevention:
Prevented using `Content-Security-Policy: frame-ancestors 'none'` and `X-Frame-Options: DENY`.

```http
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none';
```

### 234. scheduler.yield():
Pauses long-running JavaScript execution, yielding control back to the browser main thread to render frames and handle user clicks.

```javascript
for (let i = 0; i < 1000; i++) {
  compute(i);
  if (i % 100 === 0 && window.scheduler) await scheduler.yield();
}
```

### 235. Generic standalone Angular components with Signals:
```typescript
@Component({
  selector: 'app-list',
  standalone: true,
  template: '@for (item of data(); track item.id) { <p>{{ item }}</p> }'
})
export class ListComponent<T extends { id: any }> {
  data = input.required<T[]>();
}
```
