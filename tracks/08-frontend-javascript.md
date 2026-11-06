# Core JavaScript Master Interview Question Bank (518 Questions)

## Part 1: Core Objects, Prototypes, Functions & Scope (1 - 50)

### 1. What are the possible ways to create objects in JavaScript

There are many ways to create objects in javascript as mentioned below:

1. **Object literal syntax:**

   The object literal syntax (or object initializer), is a comma-separated set of name-value pairs wrapped in curly braces.

   ```javascript
   var object = {
     name: "Sudheer",
     age: 34,
   };
   ```

   Object literal property values can be of any data type, including array, function, and nested object.

   **Note:** This is one of the easiest ways to create an object and it's most commonly used for creating simple, ad-hoc objects.

2. **Object constructor:**

   The simplest way to create an empty object is using the `Object` constructor. Currently this approach is not recommended.

   ```javascript
   var object = new Object();
   ```

   The `Object()` is a built-in constructor function so "new" keyword is not required for creating plain objects. The above code snippet can be re-written as:

   ```javascript
   var object = Object();
   ```
   However, `Object()` can be used to either create a plain object or convert a given value into its corresponding object wrapper, whereas `new Object()` is specifically used to explicitly create a new object instance.
   
3. **Object's create method:**

   The `create` method of Object is used to create a new object by passing the specified prototype object and properties as arguments, i.e., this pattern is helpful to create new objects based on existing objects. In other words, this is useful for setting up **prototypal inheritance**. The second argument is optional and it is used to create properties on a newly created object.

   The following code creates a new empty object whose prototype is null.

   ```javascript
   var object = Object.create(null);
   ```

   The following example creates an object along with additional new properties.

   ```javascript
   let vehicle = {
     wheels: "4",
     fuelType: "Gasoline",
     color: "Green",
   };
   let carProps = {
     type: {
       value: "Volkswagen",
     },
     model: {
       value: "Golf",
     },
   };

   var car = Object.create(vehicle, carProps);
   console.log(car);
   ```

4. **Function constructor:**

   In this approach, create any function and apply the new operator to create object instances. This was the main way to do constructor-based OOP before ES6 classes.

   ```javascript
   function Person(name) {
     this.name = name;
     this.age = 21;
   }
   var object = new Person("Sudheer");
   ```
5. **Function constructor with prototype:**

   This is similar to function constructor but it uses prototype for their properties and methods. Using prototype means you're sharing methods/properties across instances, which saves memory and improve performance.

   ```javascript
   function Person() {}
   Person.prototype.name = "Sudheer";
   var object = new Person();
   ```

   This is equivalent to creating an instance with `Object.create` method with a function prototype and then calling that function with an instance and parameters as arguments.

   ```javascript
   function func(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
   }

   var instance = new func(1, 2, 3);
   ```

   **(OR)**

   ```javascript
   function func(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
   }
   // Create a new instance using function prototype.
   var newInstance = Object.create(func.prototype);

   // Call the function
   var result = func.call(newInstance, 1, 2, 3);

   // If the result is a non-null object then use it otherwise just use the new instance.
   console.log(result && typeof result === 'object' ? result : newInstance);
   ```

6. **Object's assign method:**

   The `Object.assign` method is used to copy all the properties from one or more source objects and stores them into a target object. This is mainly used for cloning and merging

   The following code creates a new staff object by copying properties of his working company and the car he owns.

   ```javascript
   const orgObject = { company: "XYZ Corp" };
   const carObject = { name: "Toyota" };
   const staff = Object.assign({}, orgObject, carObject);
   ```

7. **ES6 Class syntax:**

   ES6 introduces class feature to create objects. This is syntactic sugar over the prototype-based system.

   ```javascript
   class Person {
     constructor(name) {
       this.name = name;
     }
   }

   var object = new Person("Sudheer");
   ```

8. **Singleton pattern:**

   A Singleton is an object which can only be instantiated one time. Repeated calls to its constructor return the same instance. This way one can ensure that they don't accidentally create multiple instances.

    ##### Singleton with Closure (Classic JS Pattern)
    ```javascript
    const Singleton = (function () {
    let instance;

    function createInstance() {
      return { name: "Sudheer" };
    }

    return {
      getInstance: function () {
        if (!instance) {
          instance = createInstance();
        }
        return instance;
      }
    };
    })();

    // Usage
    const obj1 = Singleton.getInstance();
    const obj2 = Singleton.getInstance();

    console.log(obj1 === obj2); // true
    ```
     In modern JavaScript applications, singletons are commonly implemented using ES6 modules for their built-in caching behavior, or closures for encapsulated state management.

### 2. What is a prototype chain

The prototype chain is a core concept in JavaScript’s inheritance model. It allows objects to inherit properties and methods from other objects. When you try to access a property or method on an object, JavaScript first looks for it on that object itself. If it’s not found, the engine looks up the object's internal `[[Prototype]]` reference (accessible via `Object.getPrototypeOf(obj)` or the deprecated `__proto__` property) and continues searching up the chain until it finds the property or reaches the end (usually `null`).

For objects created via constructor functions, the prototype chain starts with the instance, then refers to the constructor’s `.prototype` object, and continues from there. For example:

```javascript
function Person() {}
const person1 = new Person();

console.log(Object.getPrototypeOf(person1) === Person.prototype); // true
```

This mechanism allows for property and method sharing among objects, enabling code reuse and a form of inheritance.

**Summary:**

*   The prototype chain enables inheritance in JavaScript.
*   If a property isn’t found on an object, JavaScript looks up its prototype chain.
*   The prototype of an object instance can be accessed with `Object.getPrototypeOf(obj)` or `__proto__`.
*   The prototype of a constructor function is available via `Constructor.prototype`.
*   The chain ends when the prototype is `null`.

The prototype chain among objects appears as below, 

![Screenshot](images/prototype_chain.png)

### 3. What is the Difference Between call, apply, and bind

In JavaScript, `call`, `apply`, and `bind` are methods that allow you to control the context (`this` value) in which a function is executed. While their purposes are similar, they differ in how they handle arguments and when the function is invoked.

---

#### `call`

- **Description:**  
The `call()` method invokes a function immediately, allowing you to specify the value of `this` and pass arguments individually (comma-separated).

- **Syntax:**  
```js
func.call(thisArg, arg1, arg2, ...)
```

- **Example:**
```js
var employee1 = { firstName: "John", lastName: "Rodson" };
var employee2 = { firstName: "Jimmy", lastName: "Baily" };

function invite(greeting1, greeting2) {
  console.log(
    greeting1 + " " + this.firstName + " " + this.lastName + ", " + greeting2
  );
}

invite.call(employee1, "Hello", "How are you?"); // Hello John Rodson, How are you?
invite.call(employee2, "Hello", "How are you?"); // Hello Jimmy Baily, How are you?
```

---

#### `apply`

- **Description:**  
The `apply()` method is similar to `call()`, but it takes the function arguments as an array (or array-like object) instead of individual arguments.

- **Syntax:**  
```js
func.apply(thisArg, [argsArray])
```

- **Example:**
```js
var employee1 = { firstName: "John", lastName: "Rodson" };
var employee2 = { firstName: "Jimmy", lastName: "Baily" };

function invite(greeting1, greeting2) {
  console.log(
    greeting1 + " " + this.firstName + " " + this.lastName + ", " + greeting2
  );
}

invite.apply(employee1, ["Hello", "How are you?"]); // Hello John Rodson, How are you?
invite.apply(employee2, ["Hello", "How are you?"]); // Hello Jimmy Baily, How are you?
```

---

#### `bind`

- **Description:**  
The `bind()` method creates a new function with a specific `this` value and, optionally, preset initial arguments. Unlike `call` and `apply`, `bind` does **not** immediately invoke the function; instead, it returns a new function that you can call later.

- **Syntax:**  
```js
var boundFunc = func.bind(thisArg[, arg1[, arg2[, ...]]])
```

- **Example:**
```js
var employee1 = { firstName: "John", lastName: "Rodson" };
var employee2 = { firstName: "Jimmy", lastName: "Baily" };

function invite(greeting1, greeting2) {
  console.log(
    greeting1 + " " + this.firstName + " " + this.lastName + ", " + greeting2
  );
}

var inviteEmployee1 = invite.bind(employee1);
var inviteEmployee2 = invite.bind(employee2);

inviteEmployee1("Hello", "How are you?"); // Hello John Rodson, How are you?
inviteEmployee2("Hello", "How are you?"); // Hello Jimmy Baily, How are you?
```

---

#### Summary

| Method | Invokes Function Immediately? | How Arguments Are Passed         | Returns      |
|--------|-------------------------------|----------------------------------|--------------|
| `call` | Yes                           | Comma-separated list             | Function's result |
| `apply`| Yes                           | Array or array-like object       | Function's result |
| `bind` | No                            | (Optional) preset, then rest     | New function      |

---

## Key Points

- **`call`** and **`apply`** are almost interchangeable; both invoke the function immediately, but differ in how arguments are passed.
  - _Tip:_ "Call is for Comma-separated, Apply is for Array."
- **`bind`** does not execute the function immediately. Instead, it creates a new function with the specified `this` value and optional arguments, which can be called later.

- Use `call` or `apply` when you want to immediately invoke a function with a specific `this` context. Use `bind` when you want to create a new function with a specific `this` context to be invoked later.

---

### 4. What is JSON and its common operations

**JSON (JavaScript Object Notation)** is a lightweight, text-based data format that uses JavaScript object syntax for structuring data. It was popularized by Douglas Crockford and is widely used for transmitting data between a server and a client in web applications. JSON files typically have a `.json` extension and use the MIME type `application/json`. 

#### Common Operations with JSON

1. **Parsing**: Transforming a JSON-formatted string into a native JavaScript object.
  ```js
  const obj = JSON.parse(jsonString);
  ```
  - Example:  
    ```js
    const jsonString = '{"name":"John","age":30}';
    const obj = JSON.parse(jsonString);  // { name: "John", age: 30 }
    ```

2. **Stringification**: Converting a JavaScript object into a JSON-formatted string, commonly used for data transmission or storage.
  ```js
  const jsonString = JSON.stringify(object);
  ```
  - Example:  
    ```js
    const obj = { name: "Jane", age: 25 };
    const jsonString = JSON.stringify(obj);  // '{"name":"Jane","age":25}'
    ```

### 5. What is the purpose of the array slice method

The `slice()` method in JavaScript is used to extract a section of an array, returning a new array containing the selected elements. It does not modify the original array. The method takes two arguments:

- **start**: The index at which extraction begins (inclusive).
- **end** (optional): The index before which to end extraction (exclusive). If omitted, extraction continues to the end of the array.

You can also use negative indices, which count from the end of the array.

#### Examples:

```js
let arrayIntegers = [1, 2, 3, 4, 5];

let arrayIntegers1 = arrayIntegers.slice(0, 2);    // [1, 2]
let arrayIntegers2 = arrayIntegers.slice(2, 3);    // [3]
let arrayIntegers3 = arrayIntegers.slice(4);       // [5]
let arrayIntegers4 = arrayIntegers.slice(-3, -1);  // [3, 4]
```

**Note:**  
The `slice()` method does **not** mutate (change) the original array; instead, it returns a new array containing the extracted elements.

### 6. What is the purpose of the array splice method

The `splice()` method in JavaScript is used to add, remove, or replace elements within an array. Unlike `slice()`, which creates a shallow copy and does not alter the original array, `splice()` **modifies the original array in place** and returns an array containing the removed elements.

#### Syntax

```javascript
array.splice(start, deleteCount, item1, item2, ...)
```
- **start:** The index at which to start changing the array.
- **deleteCount:** (Optional) The number of elements to remove from the array. If omitted, all elements from the start index to the end of the array will be removed.
- **item1, item2, ...:** (Optional) Elements to add to the array, starting at the start position.

#### Examples

```javascript
let arrayIntegersOriginal1 = [1, 2, 3, 4, 5];
let arrayIntegersOriginal2 = [1, 2, 3, 4, 5];
let arrayIntegersOriginal3 = [1, 2, 3, 4, 5];

// Remove the first two elements
let arrayIntegers1 = arrayIntegersOriginal1.splice(0, 2); 
// arrayIntegers1: [1, 2]
// arrayIntegersOriginal1 (after): [3, 4, 5]

// Remove all elements from index 3 onwards
let arrayIntegers2 = arrayIntegersOriginal2.splice(3);     
// arrayIntegers2: [4, 5]
// arrayIntegersOriginal2 (after): [1, 2, 3]

// Remove 1 element at index 3, then insert "a", "b", "c" at that position
let arrayIntegers3 = arrayIntegersOriginal3.splice(3, 1, "a", "b", "c"); 
// arrayIntegers3: [4]
// arrayIntegersOriginal3 (after): [1, 2, 3, "a", "b", "c", 5]
```

**Note:**  
- The `splice()` method **modifies the original array**.
- It returns an array containing the elements that were removed (if any).
- You can use it both to remove and insert elements in a single operation.

### 7. What is the difference between slice and splice

Here are the key differences between `slice()` and `splice()` methods in JavaScript arrays:

| `slice()`                                         | `splice()`                                          |
| ------------------------------------------------- | --------------------------------------------------- |
| Does **not** modify the original array (immutable) | Modifies the original array (mutable)               |
| Returns a **shallow copy** (subset) of selected elements | Returns an array of the **removed** elements           |
| Used to **extract** elements from an array         | Used to **add**, **remove**, or **replace** elements in an array |
| Syntax: `array.slice(start, end)`                  | Syntax: `array.splice(start, deleteCount, ...items)`             |

**Summary:**  
- Use `slice()` when you want to copy or extract elements without altering the original array.
- Use `splice()` when you need to add, remove, or replace elements and want to change the original array.

#### Practical Code Example

```javascript
// slice(): Non-mutating (returns shallow copy of portion)
const original = ['a', 'b', 'c', 'd', 'e'];
const sliced = original.slice(1, 4);
console.log(sliced);   // ['b', 'c', 'd']
console.log(original); // ['a', 'b', 'c', 'd', 'e'] (unchanged)

// splice(): Mutating (adds/removes elements in place)
const fruits = ['apple', 'banana', 'cherry', 'date'];
const removed = fruits.splice(1, 2, 'blueberry', 'mango');
console.log(removed); // ['banana', 'cherry']
console.log(fruits);  // ['apple', 'blueberry', 'mango', 'date'] (mutated!)
```

### 8. How do you compare Object and Map

**Objects** and **Maps** both allow you to associate keys with values, retrieve those values, delete keys, and check if a key exists. Historically, Objects have been used as Maps, but there are several key differences that make `Map` a better choice in certain scenarios:

| Feature                  | Object                                              | Map                                                      |
|--------------------------|-----------------------------------------------------|----------------------------------------------------------|
| **Key Types**            | Only strings and symbols are valid keys             | Any value can be used as a key (objects, functions, primitives) |
| **Key Order**            | Keys are unordered (in practice, insertion order is mostly preserved for string keys, but not guaranteed) | Keys are ordered by insertion; iteration follows insertion order |
| **Size Property**        | No built-in way to get the number of keys; must use `Object.keys(obj).length` | Use the `.size` property for the number of entries        |
| **Iterability**          | Not directly iterable; must use `Object.keys`, `Object.values`, or `Object.entries` | Directly iterable with `for...of`, `.keys()`, `.values()`, `.entries()` |
| **Prototype**            | Has a prototype chain; may have default properties that can collide with custom keys (can be avoided with `Object.create(null)`) | Does not have a prototype, so there are no default keys   |
| **Performance**          | May be less efficient for frequent additions/removals | Optimized for frequent additions and deletions            |
| **Serialization**        | Can be easily serialized to JSON                    | Cannot be directly serialized to JSON                     |

#### Practical Code Example

```javascript
// Object: String/Symbol keys only, no built-in size property
const obj = { name: 'Alice', age: 28 };
console.log(Object.keys(obj).length); // 2

// Map: Any key type (objects, functions, primitives), tracks insertion order
const map = new Map();
const userKey = { id: 101 };

map.set(userKey, 'Admin Profile');
map.set(42, 'Answer');

console.log(map.get(userKey)); // 'Admin Profile'
console.log(map.size);          // 2
console.log(map.has(42));       // true
```

### 9. What is the difference between == and === operators

JavaScript provides two types of equality operators:

- **Loose equality (`==`, `!=`)**: Performs type conversion if the types differ, comparing values after converting them to a common type.
- **Strict equality (`===`, `!==`)**: Compares both value and type, without any type conversion.

#### Strict Equality (`===`)
- Two strings are strictly equal if they have exactly the same sequence of characters and length.
- Two numbers are strictly equal if they have the same numeric value.
  - **Special cases:**
    - `NaN === NaN` is `false`
    - `+0 === -0` is `true`
- Two booleans are strictly equal if both are `true` or both are `false`.
- Two objects are strictly equal if they refer to the **same object** in memory.
- `null` and `undefined` are **not** strictly equal.

#### Loose Equality (`==`)
- Converts operands to the same type before making the comparison.
- `null == undefined` is `true`.
- `"1" == 1` is `true` because the string is converted to a number.
- `0 == false` is `true` because `false` is converted to `0`.

#### Examples:

```javascript
0 == false            // true      (loose equality, type coercion)
0 === false           // false     (strict equality, different types)
1 == "1"              // true      (string converted to number)
1 === "1"             // false     (different types)
null == undefined     // true      (special case)
null === undefined    // false     (different types)
'0' == false          // true      ('0' is converted to 0)
'0' === false         // false     (different types)
NaN == NaN            // false     (NaN is never equal to itself)
NaN === NaN           // false
[] == []              // false     (different array objects)
[] === []             // false
{} == {}              // false     (different object references)
{} === {}             // false
```

### 10. What are lambda expressions or arrow functions

**Arrow functions** (also known as "lambda expressions") provide a concise syntax for writing function expressions in JavaScript. Introduced in ES6, arrow functions are often shorter and more readable, especially for simple operations or callbacks.

#### Key Features:
- Arrow functions do **not** have their own `this`, `arguments`, `super`, or `new.target` bindings. They inherit these from their surrounding (lexical) context.
- They are best suited for non-method functions, such as callbacks or simple computations.
- Arrow functions **cannot** be used as constructors and do not have a `prototype` property.
- They also cannot be used with `new`, `yield`, or as generator functions.

#### Syntax Examples:

```javascript
const arrowFunc1 = (a, b) => a + b;    // Multiple parameters, returns a + b
const arrowFunc2 = a => a * 10;        // Single parameter (parentheses optional), returns a * 10
const arrowFunc3 = () => {};           // No parameters, returns undefined
const arrowFunc4 = (a, b) => {
  // Multiple statements require curly braces and explicit return
  const sum = a + b;
  return sum * 2;
};
```

### 11. What is a first class function

In JavaScript, **first-class functions(first-class citizens)** mean that functions are treated like any other variable. That means:

1. You can assign a function to a variable.
2. You can pass a function as an argument to another function.
3. You can return a function from another function.

This capability enables powerful patterns like callbacks, higher-order functions, event handling, and functional programming in JavaScript.

For example, the handler function below is assigned to a variable and then passed as an argument to the `addEventListener` method.

```javascript
const handler = () => console.log("This is a click handler function");
document.addEventListener("click", handler);
```

### 12. What is a first order function

A first-order function is a function that doesn’t accept another function as an argument and doesn’t return a function as its return value. i.e,  It's a regular function that works with primitive or non-function values.

```javascript
const firstOrder = () => console.log("I am a first order function!");
```

### 13. What is a higher order function

A higher-order function is a function that either accepts another function as an argument, returns a function as its result, or both. This concept is a core part of JavaScript's functional programming capabilities and is widely used for creating modular, reusable, and expressive code.

The syntactic structure of higher order function will be explained with an example as follows,

  ```javascript
  // First-order function (does not accept or return another function)
  const firstOrderFunc = () => 
    console.log("Hello, I am a first-order function");

  // Higher-order function (accepts a function as an argument)
  const higherOrder = (callback) => callback();

  // Passing the first-order function to the higher-order function
  higherOrder(firstOrderFunc);
  ```

In this example:

1. `firstOrderFunc` is a regular (first-order) function.

2. `higherOrder` is a higher-order function because it takes another function as an argument.

3. `firstOrderFunc` is also called a **callback function** because it is passed to and executed by another function.

### 14. What is a unary function

A unary function (also known as a **monadic** function) is a function that **accepts exactly one argument**. The term "unary" simply refers to the function's arity—the number of arguments it takes.

Let us take an example of unary function,

```javascript
const unaryFunction = (a) => console.log(a + 10); // This will add 10 to the input and log the result
unaryFunction(5); // Output: 15
```
In this example:

- `unaryFunction` takes a single parameter `a`, making it a unary function.
- It performs a simple operation: adding 10 to the input and printing the result.

### 15. What is the currying function

**Currying** is the process of transforming a function with **multiple arguments** into a sequence of **nested functions**, each accepting **only one argument** at a time.

This concept is named after mathematician **Haskell Curry**, and is commonly used in functional programming to enhance modularity and reuse.


## Before Currying (Normal n-ary Function)

```javascript
const multiArgFunction = (a, b, c) => a + b + c;

console.log(multiArgFunction(1, 2, 3)); // Output: 6
```
This is a standard function that takes three arguments at once.

## After Currying (Unary Function Chain)
```javascript
const curryUnaryFunction = (a) => (b) => (c) => a + b + c;

console.log(curryUnaryFunction(1));       // Returns: function (b) => ...
console.log(curryUnaryFunction(1)(2));    // Returns: function (c) => ...
console.log(curryUnaryFunction(1)(2)(3)); // Output: 6

```
Each function in the chain accepts one argument and returns the next function, until all arguments are provided and the final result is computed.

## Benefits of Currying
  - Improves code reusability
  → You can partially apply functions with known arguments.

  - Enhances functional composition
  → Easier to compose small, pure functions.

  - Encourages clean, modular code
  → You can split logic into smaller single-responsibility functions.

### 16. What is a pure function

A **pure function** is a function whose output depends only on its input arguments and produces no side effects. This means that given the same inputs, a pure function will always return the same output, and it does not modify any external state or data.

Let's take an example to see the difference between pure and impure functions,

#### Example: Pure vs. Impure Functions

```javascript
// Impure Function
let numberArray = [];
const impureAddNumber = (number) => numberArray.push(number);

// Pure Function
const pureAddNumber = (number) => (inputArray) =>
  inputArray.concat([number]);

// Usage
console.log(impureAddNumber(6)); // returns 1
console.log(numberArray);        // returns [6]

console.log(pureAddNumber(7)(numberArray)); // returns [6, 7]
console.log(numberArray);                   // remains [6]
```
- `impureAddNumber` changes the external variable numberArray and returns the new length of the array, making it impure.
- `pureAddNumber` creates a new array with the added number and does not modify the original array, making it pure.

### 17. What are the benefits of pure functions

Some of the major benefits of pure functions are listed below,

- **Easier testing:** Since output depends only on input, pure functions are simple to test.
- **Predictability:** No hidden side effects make behavior easier to reason about.
- **Immutability:** Pure functions align with ES6 best practices, such as preferring const over let, supporting safer and more maintainable code.
- **No side effects:** Reduces bugs related to shared state or mutation.

#### Practical Code Example

```javascript
// 1. Referential Transparency & Predictability
const add = (a, b) => a + b; // Always returns same output for same inputs

// 2. Easy Memoization / Caching
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
};

const memoizedAdd = memoize(add);
console.log(memoizedAdd(5, 10)); // Computed: 15
console.log(memoizedAdd(5, 10)); // Served from cache: 15
```

### 18. What is the purpose of the let keyword

The `let` keyword in JavaScript is used to declare a **block-scoped local variable**. This means that variables declared with `let` are only accessible within the block, statement, or expression where they are defined. This is a significant improvement over the older `var` keyword, which is function-scoped (or globally-scoped if declared outside a function), and does not respect block-level scoping.

#### Key Features of `let`:
- **Block Scope:** The variable exists only within the nearest enclosing block (e.g., inside an `{}` pair).
- **No Hoisting Issues:** While `let` declarations are hoisted, they are not initialized until the code defining them is executed. Accessing them before declaration results in a ReferenceError (temporal dead zone).
- **No Redeclaration:** The same variable cannot be declared twice in the same scope with `let`.

#### Example:

```javascript
let counter = 30;
if (counter === 30) {
  let counter = 31;
  console.log(counter); // Output: 31 (block-scoped variable inside if-block)
}
console.log(counter); // Output: 30 (outer variable, unaffected by inner block)
```

In this example, the `counter` inside the `if` block is a separate variable from the one outside. The `let` keyword ensures that both have their own distinct scope.

In summary, you need to use `let` when you want variables to be limited to the block in which they are defined, preventing accidental overwrites and bugs related to variable scope.

### 19. What is the difference between let and var

You can list out the differences in a tabular format

| var                                                            | let                                           |
| -------------------------------------------------------------- | --------------------------------------------- |
| It has been available from the beginning of JavaScript         | Introduced as part of ES6                     |
| It has function scope                                          | It has block scope                            |
| Variable declaration will be hoisted, initialized as undefined | Hoisted but not initialized                   |
| It is possible to re-declare the variable in the same scope    | It is not possible to re-declare the variable |

Let's take an example to see the difference,

```javascript
function userDetails(username) {
  if (username) {
    console.log(salary); // undefined due to hoisting
    console.log(age); // ReferenceError: Cannot access 'age' before initialization
    let age = 30;
    var salary = 10000;
  }
  console.log(salary); //10000 (accessible due to function scope)
  console.log(age); //error: age is not defined(due to block scope)
}
userDetails("John");
```

### 20. What is the reason to choose the name let as a keyword

The keyword `let` was chosen because it originates from mathematical notation, where "let" is used to introduce new variables (for example, "let x = 5"). This term was adopted by several early programming languages such as Scheme and BASIC, establishing a tradition in computer science. JavaScript follows this convention by using `let` to declare variables with block scope, providing a modern alternative to `var`. The choice helps make the language more familiar to programmers coming from other languages and aligns with the mathematical practice of variable assignment.

#### Practical Code Example

```javascript
// 'let' originated from mathematical notation: 'Let x = 10 in expression'
// In JavaScript, it explicitly signals block-scoped binding:
function calculateDiscount(price) {
  let finalPrice = price; // scoped to function
  if (price > 100) {
    let discount = 20;    // scoped strictly to this if-block
    finalPrice -= discount;
  }
  // console.log(discount); // ReferenceError: discount is not defined
  return finalPrice;
}
console.log(calculateDiscount(150)); // 130
```

### 21. How do you redeclare variables in a switch block without an error

When you try to redeclare variables using `let` or `const` in multiple `case` clauses of a `switch` statement, you will get a SyntaxError. This happens because, in JavaScript, all `case` clauses within a `switch` statement share the same block scope. For example:

```javascript
let counter = 1;
switch (x) {
  case 0:
    let name;
    break;
  case 1:
    let name; // SyntaxError: Identifier 'name' has already been declared
    break;
}
```

To avoid this error, you can create a new block scope within each `case` clause by wrapping the code in curly braces `{}`. This way, each `let` or `const` declaration is scoped only to that block, and redeclaration errors are avoided:

```javascript
let counter = 1;
switch (x) {
  case 0: {
    let name;
    // code for case 0
    break;
  }
  case 1: {
    let name; // No SyntaxError
    // code for case 1
    break;
  }
}
```

That means, to safely redeclare variables in different cases of a switch statement, wrap each case’s code in its own block using curly braces. This ensures each variable declaration is scoped to its specific case block.

### 22. What is the Temporal Dead Zone

The **Temporal Dead Zone (TDZ)** refers to the period between the start of a block and the point where a variable declared with `let` or `const` is initialized. During this time, the variable exists in scope but **cannot be accessed**, and attempting to do so results in a `ReferenceError`.

This behavior is part of **JavaScript's ES6 (ECMAScript 2015)** specification and applies **only to variables declared with `let` and `const`**, not `var`. Variables declared with `var` are **hoisted** and initialized with `undefined`, so accessing them before the declaration does not throw an error, though it can lead to unexpected results.

#### Example

```javascript
function someMethod() {
    console.log(counter1); // Output: undefined (due to var hoisting)
    console.log(counter2); // Throws ReferenceError (TDZ for let)

    var counter1 = 1;
    let counter2 = 2;
}
```

### 23. What is an IIFE (Immediately Invoked Function Expression)

IIFE (Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is defined. The signature of it would be as below,

```javascript
(function () {
  // logic here
})();
```

The primary reason to use an IIFE is to obtain data privacy because any variables declared within the IIFE cannot be accessed by the outside world. i.e, If you try to access variables from the IIFE then it throws an error as below,

```javascript
(function () {
  var message = "IIFE";
  console.log(message);
})();
console.log(message); //Error: message is not defined
```

### 24. How do you decode or encode a URL in JavaScript?

`encodeURI()` function is used to encode an URL. This function requires a URL string as a parameter and return that encoded string.
`decodeURI()` function is used to decode an URL. This function requires an encoded URL string as parameter and return that decoded string.

**Note:** If you want to encode characters such as `/ ? : @ & = + $ #` then you need to use `encodeURIComponent()`.

```javascript
let uri = "employeeDetails?name=john&occupation=manager";
let encoded_uri = encodeURI(uri);
let decoded_uri = decodeURI(encoded_uri);
```

### 25. What is memoization

Memoization is a functional programming technique which attempts to increase a function’s performance by caching its previously computed results. Each time a memoized function is called, its parameters are used to index the cache. If the data is present, then it can be returned, without executing the entire function. Otherwise the function is executed and then the result is added to the cache.
Let's take an example of adding function with memoization,

```javascript
const memoizeAddition = () => {
  let cache = {};
  return (value) => {
    if (value in cache) {
      console.log("Fetching from cache");
      return cache[value]; // Here, cache.value cannot be used as property name starts with the number which is not a valid JavaScript  identifier. Hence, can only be accessed using the square bracket notation.
    } else {
      console.log("Calculating result");
      let result = value + 20;
      cache[value] = result;
      return result;
    }
  };
};
// returned function from memoizeAddition
const addition = memoizeAddition();
console.log(addition(20)); //output: 40 calculated
console.log(addition(20)); //output: 40 cached
```

### 26. What is Hoisting

Hoisting is JavaScript's default behavior where **variable and function declarations** are moved to the top of their scope before code execution. This means you can access certain variables and functions even before they are defined in the code.


Example of variable hoisting:

```js
console.log(message); // Output: undefined
var message = "The variable has been hoisted";
```

```js
var message;
console.log(message); // undefined
message = "The variable has been hoisted";
```

Example of function hoisting:

```js
message("Good morning"); // Output: Good morning

function message(name) {
console.log(name);
}
```

Because of hoisting, functions can be used before they are declared.

### 27. What are classes in ES6

In ES6, JavaScript classes are primarily syntactic sugar over JavaScript’s existing prototype-based inheritance.
For example, the prototype based inheritance written in function expression as below,

```javascript
function Bike(model, color) {
  this.model = model;
  this.color = color;
}

Bike.prototype.getDetails = function () {
  return this.model + " bike has" + this.color + " color";
};
```

Whereas ES6 classes can be defined as an alternative

```javascript
class Bike {
  constructor(color, model) {
    this.color = color;
    this.model = model;
  }

  getDetails() {
    return this.model + " bike has" + this.color + " color";
  }
}
```

### 28. What are closures

A closure is the combination of a function bundled(enclosed) together with its lexical environment within which that function was declared. i.e, It is an inner function that has access to the outer or enclosing function’s variables, functions and other data even after the outer function has finished its execution. The closure has three scope chains.

1. Own scope where variables defined between its curly brackets
2. Outer function's variables
3. Global variables

Let's take an example of closure concept,

```javascript
function Welcome(name) {
  var greetingInfo = function (message) {
    console.log(message + " " + name);
  };
  return greetingInfo;
}
var myFunction = Welcome("John");
myFunction("Welcome "); //Output: Welcome John
myFunction("Hello Mr."); //output: Hello Mr. John
```

As per the above code, the inner function(i.e, greetingInfo) has access to the variables in the outer function scope(i.e, Welcome) even after the outer function has returned.

### 29. What are modules

Modules refer to small units of independent, reusable code and also act as the foundation of many JavaScript design patterns. Most of the JavaScript modules export an object literal, a function, or a constructor

#### Practical Code Example

```javascript
// mathUtils.js (ES Module definition)
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export default function square(n) {
  return n * n;
}

// app.js (Importing module)
import square, { add, multiply } from './mathUtils.js';

console.log(add(3, 4));    // 7
console.log(square(5));    // 25
```

### 30. Why do you need modules

Below are the list of benefits using modules in javascript ecosystem

1. Maintainability
2. Reusability
3. Namespacing

#### Practical Code Example

```javascript
// Without modules: Global namespace collisions
// file1.js: var user = 'Alice';
// file2.js: var user = 'Bob'; (overwrites file1!)

// With ES Modules: Encapsulated private scope
// userService.js
const privateSecret = 'secret_key_123'; // Not visible outside
export function getUser(id) {
  return { id, auth: privateSecret };
}
```

### 31. What is scope in javascript

Scope is the accessibility of variables, functions, and objects in some particular part of your code during runtime. In other words, scope determines the visibility of variables and other resources in areas of your code.

#### Practical Code Example

```javascript
// Global Scope
const globalVar = 'Global';

function outer() {
  // Function / Lexical Scope
  const outerVar = 'Outer';

  if (true) {
    // Block Scope (let & const)
    let blockVar = 'Block';
    var functionScopedVar = 'Var inside block';
    console.log(globalVar, outerVar, blockVar); // Accessible
  }

  // console.log(blockVar); // ReferenceError: blockVar is not defined
  console.log(functionScopedVar); // 'Var inside block' (var ignores block scope)
}
outer();
```

### 32. What is a service worker

A Service worker is basically a script (JavaScript file) that runs in the background, separate from a web page and provides features that don't need a web page or user interaction. Some of the major features of service workers are Rich offline experiences(offline first web application development), periodic background syncs, push notifications, intercept and handle network requests and programmatically managing a cache of responses.

#### Practical Code Example

```javascript
// Registering a Service Worker in main browser thread:
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log('ServiceWorker registered with scope:', reg.scope))
      .catch((err) => console.error('ServiceWorker registration failed:', err));
  });
}
```

### 33. How do you manipulate DOM using a service worker

Service worker can't access the DOM directly. But it can communicate with the pages it controls by responding to messages sent via the `postMessage` interface, and those pages can manipulate the DOM.

#### Practical Code Example

```javascript
// Service Worker does NOT have direct access to 'window' or 'document' DOM.
// Communication must happen via PostMessage:

// In Service Worker (sw.js)
self.addEventListener('push', (event) => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'NEW_NOTIFICATION', payload: 'New Message!' });
    });
  });
});

// In Web Page (main.js)
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.type === 'NEW_NOTIFICATION') {
    document.getElementById('badge').textContent = event.data.payload; // Updates DOM!
  }
});
```

### 34. How do you reuse information across service worker restarts

The problem with service worker is that it gets terminated when not in use, and restarted when it's next needed, so you cannot rely on global state within a service worker's `onfetch` and `onmessage` handlers. In this case, service workers will have access to IndexedDB API in order to persist and reuse across restarts.

#### Practical Code Example

```javascript
// Service Workers are terminated when idle. Global variables are wiped on restart.
// To persist state across restarts, use IndexedDB or CacheStorage:

// Inside Service Worker (sw.js)
async function persistState(key, val) {
  const cache = await caches.open('sw-state-cache');
  await cache.put(new Request(key), new Response(JSON.stringify(val)));
}

async function getState(key) {
  const cache = await caches.open('sw-state-cache');
  const response = await cache.match(new Request(key));
  return response ? await response.json() : null;
}
```

### 35. What is IndexedDB

IndexedDB is a low-level API for client-side storage of larger amounts of structured data, including files/blobs. This API uses indexes to enable high-performance searches of this data.

#### Practical Code Example

```javascript
// IndexedDB: Transactional NoSQL client-side database
const request = indexedDB.open('AppDatabase', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('users', { keyPath: 'id' });
  store.createIndex('email', 'email', { unique: true });
};

request.onsuccess = (event) => {
  const db = event.target.result;
  const tx = db.transaction('users', 'readwrite');
  const store = tx.objectStore('users');
  store.add({ id: 1, name: 'Alex', email: 'alex@example.com' });
};
```

### 36. What is web storage

Web storage is an API that provides a mechanism by which browsers can store key/value pairs locally within the user's browser, in a much more intuitive fashion than using cookies. The web storage provides two mechanisms for storing data on the client.

1. **Local storage:** It stores data for current origin with no expiration date.
2. **Session storage:** It stores data for one session and the data is lost when the browser tab is closed.

#### Practical Code Example

```javascript
// Web Storage API: localStorage and sessionStorage
// 1. localStorage (persists until manually cleared, ~5-10MB limit)
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme')); // 'dark'

// 2. sessionStorage (cleared when browser tab/session closes)
sessionStorage.setItem('currentStep', 'step2');
console.log(sessionStorage.getItem('currentStep')); // 'step2'
```

### 37. What is a post message

Post message is a method that enables cross-origin communication between Window objects.(i.e, between a page and a pop-up that it spawned, or between a page and an iframe embedded within it). Generally, scripts on different pages are allowed to access each other if and only if the pages follow same-origin policy(i.e, pages share the same protocol, port number, and host).

#### Practical Code Example

```javascript
// Sending Window (e.g. Parent window sending to iframe)
const iframe = document.getElementById('myIframe');
iframe.contentWindow.postMessage({ action: 'GREET', msg: 'Hello IFrame' }, 'https://trusted.com');

// Receiving Window (in iframe)
window.addEventListener('message', (event) => {
  // Always verify origin for security!
  if (event.origin !== 'https://trusted.com') return;
  console.log('Received message:', event.data);
});
```

### 38. What is a Cookie

A cookie is a piece of data that is stored on your computer to be accessed by your browser. Cookies are saved as key/value pairs.
For example, you can create a cookie named username as below,

```javascript
document.cookie = "username=John";
```

![Screenshot](images/cookie.png)

### 39. Why do you need a Cookie

Cookies are used to remember information about the user profile(such as username). It basically involves two steps,

1. When a user visits a web page, the user profile can be stored in a cookie.
2. Next time the user visits the page, the cookie remembers the user profile.

#### Practical Code Example

```javascript
// Setting an HTTP-cookie or client cookie for session identification:
document.cookie = "sessionId=xyz987; Secure; SameSite=Strict; max-age=86400; path=/";

// Reading all available cookies
console.log(document.cookie); // "sessionId=xyz987"
```

### 40. What are the options in a cookie

There are few below options available for a cookie,

1. By default, the cookie is deleted when the browser is closed but you can change this behavior by setting expiry date (in UTC time).

```javascript
document.cookie = "username=John; expires=Sat, 8 Jun 2019 12:00:00 UTC";
```

2. By default, the cookie belongs to a current page. But you can tell the browser what path the cookie belongs to using a path parameter.

```javascript
document.cookie = "username=John; path=/services";
```

### 41. How do you delete a cookie

You can delete a cookie by setting the expiry date as a passed date. You don't need to specify a cookie value in this case.
For example, you can delete a username cookie in the current page as below.

```javascript
document.cookie =
  "username=; expires=Fri, 07 Jun 2019 00:00:00 UTC; path=/;";
```

**Note:** You should define the cookie path option to ensure that you delete the right cookie. Some browsers doesn't allow to delete a cookie unless you specify a path parameter.

### 42. What are the differences between cookie, local storage and session storage

Below are some of the differences between cookie, local storage and session storage,

| Feature                           | Cookie                                                                                                              | Local storage         | Session storage     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------- |
| Accessed on client or server side | Both server-side & client-side. The `set-cookie` HTTP response header is used by server inorder to send it to user. | client-side only      | client-side only    |
| Expiry                            | Manually configured using Expires option                                                                            | Forever until deleted | until tab is closed |
| SSL support                       | Supported                                                                                                           | Not supported         | Not supported       |
| Maximum data size                 | 4KB                                                                                                                 | 5 MB                  | 5MB                 |
| Accessible from                   | Any window                                                                                                          | Any window            | Same tab            |
| Sent with requests                | Yes                                                                                                                 | No                    | No                  |

#### Practical Code Example

```javascript
// Comparison of Client Storage Primitives:
// 1. Cookie (~4KB, sent automatically on every HTTP request header)
document.cookie = 'token=abc; SameSite=Lax';

// 2. LocalStorage (~5-10MB, persists forever, client-side only)
localStorage.setItem('cachedUserData', JSON.stringify({ name: 'Sam' }));

// 3. SessionStorage (~5MB, isolated per tab, destroyed on tab close)
sessionStorage.setItem('tempFilter', 'active');
```

### 43. What is the main difference between localStorage and sessionStorage

LocalStorage is the same as SessionStorage but it persists the data even when the browser is closed and reopened(i.e it has no expiration time) whereas in sessionStorage data gets cleared when the page session ends.

#### Practical Code Example

```javascript
// Tab 1:
localStorage.setItem('app_setting', 'v1');
sessionStorage.setItem('tab_session', 'session_tab_1');

// If the user opens Tab 2 on the same domain:
// localStorage.getItem('app_setting') -> 'v1' (SHARED!)
// sessionStorage.getItem('tab_session') -> null (ISOLATED TO TAB 1!)
```

### 44. How do you access web storage

The Window object implements the `WindowLocalStorage` and `WindowSessionStorage` objects which has `localStorage`(window.localStorage) and `sessionStorage`(window.sessionStorage) properties respectively. These properties create an instance of the Storage object, through which data items can be set, retrieved and removed for a specific domain and storage type (session or local).
For example, you can read and write on local storage objects as below

```javascript
localStorage.setItem("logo", document.getElementById("logo").value);
localStorage.getItem("logo");
```

### 45. What are the methods available on session storage

The session storage provided methods for reading, writing and clearing the session data

```javascript
// Save data to sessionStorage
sessionStorage.setItem("key", "value");

// Get saved data from sessionStorage
let data = sessionStorage.getItem("key");

// Remove saved data from sessionStorage
sessionStorage.removeItem("key");

// Remove all saved data from sessionStorage
sessionStorage.clear();
```

### 46. What is a storage event and its event handler

The StorageEvent is an event that fires when a storage area has been changed in the context of another document. Whereas onstorage property is an EventHandler for processing storage events.
The syntax would be as below

```javascript
window.onstorage = functionRef;
```

Let's take the example usage of onstorage event handler which logs the storage key and it's values

```javascript
window.onstorage = function (e) {
  console.log(
    "The " +
      e.key +
      " key has been changed from " +
      e.oldValue +
      " to " +
      e.newValue +
      "."
  );
};
```

### 47. Why do you need web storage

Web storage is more secure, and large amounts of data can be stored locally, without affecting website performance. Also, the information is never transferred to the server. Hence this is a more recommended approach than Cookies.

#### Practical Code Example

```javascript
// Why Web Storage: Unlike cookies, Web Storage avoids transmitting data in HTTP headers!
// Saving high-volume UI state without adding 5KB to every API request:
const userDraft = { title: 'Post Draft', content: 'Lorem ipsum...' };
localStorage.setItem('post_draft_autosave', JSON.stringify(userDraft));

const recovered = JSON.parse(localStorage.getItem('post_draft_autosave'));
console.log(recovered.title); // 'Post Draft'
```

### 48. How do you check web storage browser support

You need to check browser support for localStorage and sessionStorage before using web storage,

```javascript
if (typeof Storage !== "undefined") {
  // Code for localStorage/sessionStorage.
} else {
  // Sorry! No Web Storage support..
}
```

### 49. How do you check web workers browser support

You need to check browser support for web workers before using it

```javascript
if (typeof Worker !== "undefined") {
  // code for Web worker support.
} else {
  // Sorry! No Web Worker support..
}
```

### 50. Give an example of a web worker

You need to follow below steps to start using web workers for counting example

1. Create a Web Worker File: You need to write a script to increment the count value. Let's name it as counter.js

```javascript
let i = 0;

function timedCount() {
  i = i + 1;
  postMessage(i);
  setTimeout("timedCount()", 500);
}

timedCount();
```

Here postMessage() method is used to post a message back to the HTML page

2. Create a Web Worker Object: You can create a web worker object by checking for browser support. Let's name this file as web_worker_example.js

```javascript
if (typeof w == "undefined") {
  w = new Worker("counter.js");
}
```

and we can receive messages from web worker

```javascript
w.onmessage = function (event) {
  document.getElementById("message").innerHTML = event.data;
};
```

3. Terminate a Web Worker:
   Web workers will continue to listen for messages (even after the external script is finished) until it is terminated. You can use the terminate() method to terminate listening to the messages.

```javascript
w.terminate();
```

4. Reuse the Web Worker: If you set the worker variable to undefined you can reuse the code

```javascript
w = undefined;
```



## Part 2: Promises, Callbacks, Async & Strict Mode (51 - 100)

### 51. What are the restrictions of web workers on DOM

WebWorkers don't have access to below javascript objects since they are defined in an external files

1. Window object
2. Document object
3. Parent object

#### Practical Code Example

```javascript
// Inside worker.js:
// document.getElementById('heading').textContent = 'Hi'; // ReferenceError: document is not defined!
// window.alert('Notice');                                // ReferenceError: window is not defined!

// Workers can only process data and send results back via postMessage:
self.onmessage = (event) => {
  const result = event.data * 2; // CPU computation
  self.postMessage(result);      // send back to main UI thread
};
```

### 52. What is a promise

A **Promise** is a JavaScript object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It acts as a placeholder for a value that may not be available yet but will be resolved in the future.

A Promise can be in one of **three states**:
- `pending`: Initial state, neither fulfilled nor rejected.
- `fulfilled`: The operation completed successfully.
- `rejected`: The operation failed (e.g., due to a network error).


#### Promise Syntax

```javascript
const promise = new Promise(function (resolve, reject) {
  // Perform async operation
});
```
#### Example: Creating and Using a Promise
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("I'm a Promise!");
  }, 5000);
});

promise
  .then((value) => console.log(value)) // Logs after 5 seconds: "I'm a Promise!"
  .catch((error) => console.error(error))  // Handles any rejection
  .finally(() => console.log("Done"));     // Runs regardless of success or failure
```
In the above example:

*   A `Promise` is created to handle an asynchronous operation with `resolve` and `reject` callbacks.
*   The `setTimeout` resolves the promise with a value after 5 seconds.
*   `.then()`, `.catch()`, and `.finally()` are used to handle success, errors, and cleanup respectively.

The action flow of a promise will be as below,

![Screenshot](images/promises.png)

### 53. Why do you need a promise

Promises are **used to handle asynchronous operations**, especially in languages like JavaScript, which often work with non-blocking operations such as network requests, file I/O, and timers. When an operation is asynchronous, it doesn't immediately return a result; instead, it works in the background and provides the result later. Handling this in a clean, organized way can be difficult without a structured approach.

Promises are used to:

1.  **Handle asynchronous operations**.
2.  **Provide a cleaner alternative to callbacks**.
3.  **Avoid callback hell**.
4.  **Make code more readable and maintainable**.

#### Practical Code Example

```javascript
// Before Promises: Callback Hell / Pyramid of Doom
getUser(id, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetails(orders[0].id, (details) => {
      console.log(details);
    });
  });
});

// With Promises: Linear, composable, clean error handling
getUser(id)
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => console.log(details))
  .catch((err) => console.error('Caught error anywhere in chain:', err));
```

### 54. Explain the three states of promise

Promises have three states:

1. **Pending:** This is an initial state of the Promise before an operation begins
2. **Fulfilled:** This state indicates that the specified operation was completed.
3. **Rejected:** This state indicates that the operation did not complete. In this case an error value will be thrown.

#### Practical Code Example

```javascript
// 1. Pending: Initial state, neither fulfilled nor rejected
const p = new Promise((resolve, reject) => {
  // Currently pending...
  setTimeout(() => resolve('Data loaded'), 1000); // Transitions to Fulfilled
  // or reject(new Error('Failed'))               // Transitions to Rejected
});

console.log(p); // Promise { <pending> }
p.then(result => console.log('Fulfilled:', result));
```

### 55. What is a callback function

A callback function is a function passed into another function as an argument. This function is invoked inside the outer function to complete an action.
Let's take a simple example of how to use callback function

```javascript
function callbackFunction(name) {
  console.log("Hello " + name);
}

function outerFunction(callback) {
  let name = prompt("Please enter your name.");
  callback(name);
}

outerFunction(callbackFunction);
```

### 56. Why do we need callbacks

The callbacks are needed because javascript is an event driven language. That means instead of waiting for a response, javascript will keep executing while listening for other events.
Let's take an example with the first function invoking an API call(simulated by setTimeout) and the next function which logs the message.

```javascript
function firstFunction() {
  // Simulate a code delay
  setTimeout(function () {
    console.log("First function called");
  }, 1000);
}
function secondFunction() {
  console.log("Second function called");
}
firstFunction();
secondFunction();

// Output:
// Second function called
// First function called
```

As observed from the output, javascript didn't wait for the response of the first function and the remaining code block got executed. So callbacks are used in a way to make sure that certain code doesn’t execute until the other code finishes execution.

### 57. What is a callback hell

Callback Hell is an anti-pattern with multiple nested callbacks which makes code hard to read and debug when dealing with asynchronous logic. The callback hell looks like below,

```javascript
async1(function(){
    async2(function(){
        async3(function(){
            async4(function(){
                ....
            });
        });
    });
});
```

### 58. What are server-sent events

Server-sent events (SSE) is a server push technology enabling a browser to receive automatic updates from a server via HTTP connection without resorting to polling. These are a one way communications channel - events flow from server to client only. This has been used in Facebook/Twitter/X updates, stock price updates, news feeds etc.

#### Practical Code Example

```javascript
// Server-Sent Events (SSE): Unidirectional real-time stream from server to client
const eventSource = new EventSource('/api/live-stock-prices');

eventSource.onopen = () => console.log('SSE connection established');

eventSource.onmessage = (event) => {
  const stock = JSON.parse(event.data);
  console.log('Live price update:', stock.symbol, stock.price);
};

eventSource.onerror = (err) => {
  console.error('SSE Error or server reconnecting:', err);
};
```

### 59. How do you receive server-sent event notifications

The EventSource object is used to receive server-sent event notifications. For example, you can receive messages from server as below,

```javascript
if (typeof EventSource !== "undefined") {
  var source = new EventSource("sse_generator.js");
  source.onmessage = function (event) {
    document.getElementById("output").innerHTML += event.data + "<br>";
  };
}
```

### 60. How do you check browser support for server-sent events

You can perform browser support for server-sent events before using it as below,

```javascript
if (typeof EventSource !== "undefined") {
  // Server-sent events supported. Let's have some code here!
} else {
  // No server-sent events supported
}
```

### 61. What are the events available for server sent events

Below are the list of events available for server sent events
| Event | Description |
|---- | ---------
| onopen | It is used when a connection to the server is opened |
| onmessage | This event is used when a message is received |
| onerror | It happens when an error occurs|

#### Practical Code Example

```javascript
const source = new EventSource('/events');

// Built-in standard events:
source.onopen = () => console.log('Connection opened');
source.onmessage = (event) => console.log('Default message:', event.data);
source.onerror = (error) => console.log('Connection error');

// Custom named events from server ('event: priceChange'):
source.addEventListener('priceChange', (event) => {
  console.log('Custom event triggered:', event.data);
});
```

### 62. What are the main rules of promise

A promise must follow a specific set of rules:

1. A promise is an object that supplies a standard-compliant `.then()` method
2. A pending promise may transition into either fulfilled or rejected state
3. A fulfilled or rejected promise is settled and it must not transition into any other state.
4. Once a promise is settled, the value must not change.

#### Practical Code Example

```javascript
// Key Promise Rules:
// 1. Immutable State: Once resolved or rejected, state cannot change.
// 2. Guaranteed Asynchronous execution (always runs on Microtask Queue).
// 3. Chainable: .then() always returns a new Promise.
const promise = new Promise((resolve, reject) => {
  resolve('Value 1');
  resolve('Value 2'); // Ignored! State is already fulfilled.
});

promise.then((val) => console.log(val)); // Logs: 'Value 1'
```

### 63. What is callback in callback

You can nest one callback inside in another callback to execute the actions sequentially one by one. This is known as callbacks in callbacks. Beware, too many levels of nesting lead to [Callback hell](https://github.com/sudheerj/javascript-interview-questions?tab=readme-ov-file#what-is-a-callback-hell)

```javascript
loadScript("/script1.js", function (script) {
  console.log("first script is loaded");

  loadScript("/script2.js", function (script) {
    console.log("second script is loaded");

    loadScript("/script3.js", function (script) {
      console.log("third script is loaded");
      // after all scripts are loaded
    });
  });
});
```

### 64. What is promise chaining

The process of executing a sequence of asynchronous tasks one after another using promises is known as Promise chaining. Let's take an example of promise chaining for calculating the final result,

```javascript
new Promise(function (resolve, reject) {
  setTimeout(() => resolve(1), 1000);
})
  .then(function (result) {
    console.log(result); // 1
    return result * 2;
  })
  .then(function (result) {
    console.log(result); // 2
    return result * 3;
  })
  .then(function (result) {
    console.log(result); // 6
    return result * 4;
  });
```

In the above handlers, the result is passed to the chain of .then() handlers with the below work flow,

1. The initial promise resolves in 1 second,
2. After that `.then` handler is called by logging the result(1) and then return a promise with the value of result \* 2.
3. After that the value passed to the next `.then` handler by logging the result(2) and return a promise with result \* 3.
4. Finally the value passed to the last `.then` handler by logging the result(6) and return a promise with result \* 4.

### 65. What is promise.all

`Promise.all()` is a built-in JavaScript method used to handle multiple asynchronous operations together. It accepts an iterable of promises (usually an array) and returns a single promise that resolves only when all the input promises have successfully resolved.

If any one of the promises rejects, the whole `Promise.all()` call rejects immediately and the error is passed to the `.catch()` block. The result array contains values in the same order as the input promises, even if they finish at different times.

```javascript
const fetchUser = () => Promise.resolve({ id: 1, name: "John" });
const fetchOrders = () =>
  new Promise((resolve) => setTimeout(() => resolve([101, 102]), 200));
const fetchProfile = () => Promise.resolve("active");

Promise.all([fetchUser(), fetchOrders(), fetchProfile()])
  .then(([user, orders, status]) => {
    console.log(user); // { id: 1, name: 'John' }
    console.log(orders); // [101, 102]
    console.log(status); // 'active'
  })
  .catch((error) => {
    console.log("One of the requests failed:", error);
  });
```

Let's consider a case where one promise rejects:

```javascript
Promise.all([
  Promise.resolve("A"),
  Promise.reject(new Error("Request failed")),
  Promise.resolve("C"),
])
  .then((values) => console.log(values))
  .catch((error) => console.log(error.message)); // Request failed
```

**Key points:**

1. It waits for all promises to resolve.
2. It rejects as soon as any promise fails.
3. The output order matches the input order, not the completion order.
4. Non-promise values are treated as resolved values automatically.

`Promise.all()` is useful when you need to run multiple independent async tasks concurrently and continue only after all of them are done, such as fetching multiple API endpoints together.

### 66. Does Promise.all() cancel the other Promises?

No. `Promise.all()` does not cancel the other promises. It only waits for all of them to finish, and if any one rejects, the overall `Promise.all()` call rejects immediately.

A JavaScript promise does not have a built-in cancel API. Once a promise starts, it keeps running unless the underlying async operation supports cancellation on its own. For example, `fetch()` supports cancellation using `AbortController`.

```javascript
const controller = new AbortController();
const signal = controller.signal;

const requestA = fetch("/api/a", { signal });
const requestB = Promise.reject(new Error("Server error"));
const requestC = fetch("/api/c", { signal });

Promise.all([requestA, requestB, requestC])
  .then((results) => console.log(results))
  .catch((error) => {
    console.log("Promise.all rejected:", error.message);
    controller.abort(); // Cancels the fetch requests still in progress
  });
```

In the example above, if `requestB` rejects, `Promise.all()` rejects, but `requestA` and `requestC` are not automatically canceled. They continue unless you explicitly abort them using the underlying API or custom logic.

**How to cancel async work:**

1. Use an API that supports cancellation, such as `fetch()` with `AbortController`.
2. For custom promises, you can add a `cancel()` method or a flag to stop work internally.
3. If the work is not cancelable, the promise cannot be truly canceled from outside.

**Note:** `Promise.all()` is about aggregation, not cancellation. It waits for all promises to settle, but it does not stop the other async operations by itself.



#### What is the difference between `return` and `return await` in async functions

In an `async` function, `return value` simply returns the value or promise. If the value is a rejected promise, the rejection is not caught by a surrounding `try/catch` unless you `await` it first.

`return await value` pauses the function until the promise settles, so a `try/catch` around it can handle errors properly.

```javascript
async function withoutAwait() {
  try {
    return Promise.reject(new Error("Something failed"));
  } catch (error) {
    console.log("This will not run");
    return "fallback";
  }
}

async function withAwait() {
  try {
    return await Promise.reject(new Error("Something failed"));
  } catch (error) {
    console.log("Caught inside the function:", error.message);
    return "fallback";
  }
}

withoutAwait().catch((err) => console.log("outside catch:", err.message));
withAwait().then((value) => console.log("withAwait result:", value));
```

Output:

```javascript
outside catch: Something failed
Caught inside the function: Something failed
withAwait result: fallback
```

In short:

- `return promise` returns the promise without waiting for it.
- `return await promise` waits for the promise and allows the surrounding `try/catch` to catch errors.

`return await` is especially useful when you want to clean up or handle the error inside the same async function before it exits.

### 67. What is the purpose of the race method in promise

Promise.race() method will return the promise instance which is firstly resolved or rejected. Let's take an example of race() method where promise2 is resolved first

```javascript
var promise1 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 500, "one");
});
var promise2 = new Promise(function (resolve, reject) {
  setTimeout(resolve, 100, "two");
});

Promise.race([promise1, promise2]).then(function (value) {
  console.log(value); // "two" // Both promises will resolve, but promise2 is faster
});
```

### 68. What is a strict mode in javascript

JavaScript’s "use strict" directive is used to opt into a stricter parsing and error-handling mode for your scripts or functions. It helps catch common bugs, makes your code more secure, and prepares it for future versions of JavaScript.

Strict Mode is a new feature in ECMAScript 5 that allows you to place a program, or a function, in a “strict” operating context. This way it prevents certain actions from being taken and throws more exceptions. The literal expression `"use strict";` instructs the browser to use the javascript code in the Strict mode. This also enables block-scoped variables.

#### Practical Code Example

```javascript
'use strict';

// 1. Prevents accidental global variable creation
// typoVariable = 42; // ReferenceError: typoVariable is not defined

// 2. Disallows deleting undeletable properties
// delete Object.prototype; // TypeError: Cannot delete property

// 3. Prevents duplicate parameter names
// function sum(a, a, c) {} // SyntaxError: Duplicate parameter name
```

### 69. Why do you need strict mode

Strict mode is useful to write "secure" JavaScript by notifying "bad syntax" into real errors. For example, it eliminates accidentally creating a global variable by throwing an error and also throws an error for assignment to a non-writable property, a getter-only property, a non-existing property, a non-existing variable, or a non-existing object.

#### Practical Code Example

```javascript
// Why Strict Mode is essential:
// In non-strict mode:
function loose() {
  undeclared = 'leaked to global window!';
}
loose();
console.log(window.undeclared); // 'leaked to global window!' (silent bug)

// In strict mode:
function strict() {
  'use strict';
  // undeclared = 'error'; // ReferenceError: undeclared is not defined
}
```

### 70. How do you declare strict mode

The strict mode is declared by adding "use strict"; to the beginning of a script or a function.
If declared at the beginning of a script, it has global scope.

```javascript
"use strict";
x = 3.14; // This will cause an error because x is not declared
```

and if you declare inside a function, it has local scope

```javascript
x = 3.14; // This will not cause an error.
myFunction();

function myFunction() {
  "use strict";
  y = 3.14; // This will cause an error
}
```

### 71. What is the purpose of double exclamation

The double exclamation or negation(!!) ensures the resulting type is a boolean. If it was falsey (e.g. 0, null, undefined, etc.), it will be false, otherwise, it will be true.
For example, you can test IE version using this expression as below,

```javascript
let isIE8 = false;
isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
console.log(isIE8); // returns true or false
```

If you don't use this expression then it returns the original value.

```javascript
console.log(navigator.userAgent.match(/MSIE 8.0/)); // returns either an Array or null
```

**Note:** The expression !! is not an operator, but it is just twice of ! operator.

### 72. What is the purpose of the delete operator

The delete operator is used to delete the property as well as its value.

```javascript
var user = { firstName: "John", lastName: "Doe", age: 20 };
delete user.age;

console.log(user); // {firstName: "John", lastName:"Doe"}
```

### 73. What is typeof operator

You can use the JavaScript typeof operator to find the type of a JavaScript variable. It returns the type of a variable or an expression.

```javascript
typeof "John Abraham"; // Returns "string"
typeof (1 + 2); // Returns "number"
typeof [1, 2, 3]; // Returns "object" because all arrays are also objects
```

### 74. What is undefined property

The undefined property indicates that a variable has not been assigned a value, or declared but not initialized at all. The type of undefined value is undefined too.

```javascript
var user; // Value is undefined, type is undefined
console.log(typeof user); //undefined
```

Any variable can be emptied by setting the value to undefined.

```javascript
user = undefined;
```

### 75. What is null value

The value null represents the intentional absence of any object value. It is one of JavaScript's primitive values. The type of null value is object.
You can empty the variable by setting the value to null.

```javascript
var user = null;
console.log(typeof user); //object
```

### 76. What is the difference between null and undefined

Below are the main differences between null and undefined,

| Null                                                                                            | Undefined                                                                                               |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| It is an assignment value which indicates that variable points to no object.                    | It is not an assignment value where a variable has been declared but has not yet been assigned a value. |
| Type of null is object                                                                          | Type of undefined is undefined                                                                          |
| The null value is a primitive value that represents the null, empty, or non-existent reference. | The undefined value is a primitive value used when a variable has not been assigned a value.            |
| Indicates the absence of a value for a variable                                                 | Indicates absence of variable itself                                                                    |
| Converted to zero (0) while performing primitive operations                                     | Converted to NaN while performing primitive operations                                                  |

#### Practical Code Example

```javascript
// undefined: Variable declared but not assigned a value
let a;
console.log(a);               // undefined
console.log(typeof undefined); // 'undefined'

// null: Intentional absence of any object value
let b = null;
console.log(b);               // null
console.log(typeof null);     // 'object' (famous JavaScript legacy bug)

// Comparison:
console.log(null == undefined);  // true (loose equality)
console.log(null === undefined); // false (strict equality)
```

### 77. What is eval

The eval() function evaluates JavaScript code represented as a string. The string can be a JavaScript expression, variable, statement, or sequence of statements.

```javascript
console.log(eval("1 + 2")); //  3
```

### 78. What is the difference between window and document

Below are the main differences between window and document,

| Window                                                                        | Document                                                                                       |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| It is the root level element in any web page                                  | It is the direct child of the window object. This is also known as Document Object Model (DOM) |
| By default window object is available implicitly in the page                  | You can access it via window.document or document.                                             |
| It has methods like alert(), confirm() and properties like document, location | It provides methods like getElementById, getElementsByTagName, createElement etc               |

#### Practical Code Example

```javascript
// 'window' = Global execution context / Browser Object Model (BOM)
console.log(window.innerWidth);    // Viewport width
console.log(window.location.href); // Current URL

// 'document' = Document Object Model (DOM) root representing the loaded HTML page
console.log(document.title);                     // Page title
console.log(document.getElementById('root'));   // DOM element
console.log(window.document === document);       // true (document is property of window)
```

### 79. How do you access history in javascript

The window.history object contains the browser's history. You can load previous and next URLs in the history using back() and next() methods.

```javascript
function goBack() {
  window.history.back();
}
function goForward() {
  window.history.forward();
}
```

**Note:** You can also access history without window prefix.

### 80. How do you detect caps lock key turned on or not

The `mouseEvent getModifierState()` is used to return a boolean value that indicates whether the specified modifier key is activated or not. The modifiers such as CapsLock, ScrollLock and NumLock are activated when they are clicked, and deactivated when they are clicked again.

Let's take an input element to detect the CapsLock on/off behavior with an example:

```html
<input type="password" onmousedown="enterInput(event)" />

<p id="feedback"></p>

<script>
  function enterInput(e) {
    var flag = e.getModifierState("CapsLock");
    if (flag) {
      document.getElementById("feedback").innerHTML = "CapsLock activated";
    } else {
      document.getElementById("feedback").innerHTML =
        "CapsLock not activated";
    }
  }
</script>
```

### 81. What is isNaN

The isNaN() function is used to determine whether a value is an illegal number (Not-a-Number) or not. i.e, This function returns true if the value equates to NaN. Otherwise it returns false.

```javascript
isNaN("Hello"); //true
isNaN("100"); //false
```

### 82. What are the differences between undeclared and undefined variables

Below are the major differences between undeclared(not defined) and undefined variables,

| undeclared                                                                                  | undefined                                                                              |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| These variables do not exist in a program and are not declared                              | These variables declared in the program but have not assigned any value                |
| If you try to read the value of an undeclared variable, then a runtime error is encountered | If you try to read the value of an undefined variable, an undefined value is returned. |

```javascript
var a;
a; // yields undefined

b; // Throws runtime error like "Uncaught ReferenceError: b is not defined"
```
This can be confusing, because it says `not defined` instead of `not declared` (Chrome)

### 83. What are global variables

Global variables are those that are available throughout the length of the code without any scope. The var keyword is used to declare a local variable but if you omit it then it will become global variable

```javascript
msg = "Hello"; // var is missing, it becomes global variable
```

### 84. What are the problems with global variables

The problem with global variables is the conflict of variable names of local and global scope. It is also difficult to debug and test the code that relies on global variables.

#### Practical Code Example

```javascript
// Danger 1: Accidental overwrites and collisions across scripts
var currentUser = 'Alice'; // Script A

// In third-party script B:
var currentUser = { id: 99 }; // Overwrites Script A without warning!

// Danger 2: Memory leaks (globals stay in memory for page lifetime)
window.hugeArray = new Array(1000000).fill('data');
```

### 85. What is NaN property

The NaN property is a global property that represents "Not-a-Number" value. i.e, It indicates that a value is not a legal number. It is very rare to use NaN in a program but it can be used as return value for few cases

```javascript
Math.sqrt(-1);
parseInt("Hello");
```

### 86. What is the purpose of isFinite function

The isFinite() function is used to determine whether a number is a finite, legal number. It returns false if the value is +infinity, -infinity, or NaN (Not-a-Number), otherwise it returns true.

```javascript
isFinite(Infinity); // false
isFinite(NaN); // false
isFinite(-Infinity); // false

isFinite(100); // true
```

### 87. What is an event flow

Event flow refers to the order in which events are handled in the browser when a user interacts with elements on a webpage like clicking, typing, hovering, etc.

When you click an element that is nested in various other elements, before your click actually reaches its destination, or target element, it must trigger the click event for each of its parent elements first, starting at the top with the global window object.

Hence, there are three phases in JavaScript’s event flow:

1. Event Capturing(Top to Bottom): The event starts from the window/document and moves down the DOM tree toward the target element.
2. Target phase: The event reaches the target element — the element that was actually interacted with.
3. Event Bubbling(Bottom to Top): The event then bubbles back up from the target element to the root.

#### Practical Code Example

```javascript
// Event Flow: 1. Capturing Phase -> 2. Target Phase -> 3. Bubbling Phase
const parent = document.getElementById('parent');
const child = document.getElementById('child');

// Capturing listener (3rd argument = true)
parent.addEventListener('click', () => console.log('1. Parent Capturing'), true);

// Bubbling listeners (default or 3rd argument = false)
child.addEventListener('click', () => console.log('2. Child Target/Bubbling'));
parent.addEventListener('click', () => console.log('3. Parent Bubbling'));
```

### 88. What is event capturing

Event capturing is a phase of event propagation in which an event is first intercepted by the outermost ancestor element, then travels downward through the DOM hierarchy until it reaches the target (innermost) element.

To handle events during the capturing phase, you need to pass `true` as the third argument to the `addEventListener` method.

 ```javascript
  <div>
    <button class="child">Hello</button>
  </div>

  <script>
    const parent = document.querySelector("div");
    const child = document.querySelector(".child");

    // Capturing phase: parent listener (runs first)
    parent.addEventListener("click", function () {
      console.log("Parent (capturing)");
    }, true); // `true` enables capturing

    // Bubbling phase: child listener (runs after)
    child.addEventListener("click", function () {
      console.log("Child (bubbling)");
    });
  </script>
  // Parent (capturing)
  // Child (bubbling)
 ```

### 89. What is event bubbling

Event bubbling is a type of event propagation in which an event first triggers on the innermost target element (the one the user interacted with), and then bubbles up through its ancestors in the DOM hierarchy — eventually reaching the outermost elements, like the document or window.

By default, event listeners in JavaScript are triggered during the bubbling phase, unless specified otherwise.

```javascript
<div>
  <button class="child">Hello</button>
</div>

<script>
  const parent = document.querySelector("div");
  const child = document.querySelector(".child");

  // Bubbling phase (default)
  parent.addEventListener("click", function () {
    console.log("Parent");
  });

  child.addEventListener("click", function () {
    console.log("Child");
  });
</script>
//Child
//Parent
```

Here, at first, the event triggers on the child button. Thereafter it bubbles up and triggers the parent div's event handler.

### 90. How do you submit a form using JavaScript

You can submit a form using `document.forms[0].submit()`. All the form input's information is submitted using onsubmit event handler

```javascript
function submit() {
  document.forms[0].submit();
}
```

### 91. How do you find operating system details

The window.navigator object contains information about the visitor's browser OS details. Some of the OS properties are available under platform property,

```javascript
console.log(navigator.platform);
```

### 92. What is the difference between document load and DOMContentLoaded events

The `DOMContentLoaded` event is fired when the initial HTML document has been completely loaded and parsed, without waiting for assets(stylesheets, images, and subframes) to finish loading. Whereas The load event is fired when the whole page has loaded, including all dependent resources(stylesheets, images).

#### Practical Code Example

```javascript
// DOMContentLoaded: HTML parsed & DOM tree constructed (scripts ready, images still loading)
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready for manipulation!');
});

// window.onload: Everything finished loading (including stylesheets, images, iframes)
window.addEventListener('load', () => {
  console.log('All images and resources fully loaded');
});
```

### 93. What is the difference between native, host and user objects

`Native objects` are objects that are part of the JavaScript language defined by the ECMAScript specification. For example, String, Math, RegExp, Object, Function etc core objects defined in the ECMAScript spec.
`Host objects` are objects provided by the browser or runtime environment (Node).

For example, window, XmlHttpRequest, DOM nodes etc are considered as host objects.
`User objects` are objects defined in the javascript code. For example, User objects created for profile information.

#### Practical Code Example

```javascript
// 1. Native Objects: Defined by ECMAScript spec (Array, Object, Date, Math, RegExp)
const arr = new Array(1, 2, 3);

// 2. Host Objects: Supplied by browser/Node runtime environment (window, document, fetch)
console.log(window.location.hostname);

// 3. User Objects: Created in application code
class Developer {
  constructor(name) { this.name = name; }
}
const dev = new Developer('Alex');
```

### 94. What are the tools or techniques used for debugging JavaScript code

You can use below tools or techniques for debugging javascript

1. Chrome Devtools
2. debugger statement
3. Good old console.log statement

#### Practical Code Example

```javascript
// Modern JavaScript Debugging Tools:
// 1. Conditional Breakpoint with debugger statement:
function calculateTax(amount) {
  if (amount > 10000) {
    debugger; // Pauses DevTools only when amount > 10000
  }
  return amount * 0.15;
}

// 2. Advanced Console formatting:
console.table([{ name: 'Dev', role: 'Frontend' }, { name: 'Bob', role: 'Backend' }]);
console.time('fetchTimer');
// ... async work ...
console.timeEnd('fetchTimer');
```

### 95. What are the pros and cons of promises over callbacks

Below are the list of pros and cons of promises over callbacks,

**Pros:**

1. It avoids callback hell which is unreadable
2. Easy to write sequential asynchronous code with .then()
3. Easy to write parallel asynchronous code with Promise.all()
4. Solves some of the common problems of callbacks(call the callback too late, too early, many times and swallow errors/exceptions)

**Cons:**

5. It makes little complex code
6. You need to load a polyfill if ES6 is not supported

#### Practical Code Example

```javascript
// Callback Hell vs Promise Chain:
// Callback: Inversion of control, no centralized error bubbling
fetchUser(id, (err, user) => {
  if (err) return handleErr(err);
  fetchPermissions(user, (err, perms) => {
    if (err) return handleErr(err);
    // ...
  });
});

// Promise: Guaranteed resolution, centralized .catch(), clean async/await
async function load() {
  try {
    const user = await fetchUser(id);
    const perms = await fetchPermissions(user);
  } catch (err) {
    handleErr(err);
  }
}
```

### 96. What is the difference between an attribute and a property

Attributes are defined on the HTML markup whereas properties are defined on the DOM. For example, the below HTML element has 2 attributes: `type` and `value`,

```javascript
<input type="text" value="Name:">
```

You can retrieve the attribute value as below, for example after typing "Good morning" into the input field:

```javascript
const input = document.querySelector("input");
console.log(input.getAttribute("value")); // Good morning
console.log(input.value); // Good morning
```

And after you change the value of the text field to "Good evening", it becomes like

```javascript
console.log(input.getAttribute("value")); // Good evening
console.log(input.value); // Good evening
```

### 97. What is same-origin policy

The same-origin policy is a policy that prevents JavaScript from making requests across domain boundaries. An origin is defined as a combination of URI scheme, hostname, and port number. If you enable this policy then it prevents a malicious script on one page from obtaining access to sensitive data on another web page using Document Object Model(DOM).

#### Practical Code Example

```javascript
// Same-Origin Policy requires Protocol, Host, and Port to match:
// Page origin: https://example.com:443

// Allowed:
// https://example.com/api/data (Same origin)

// Blocked by Browser SOP unless CORS headers are present:
// http://example.com/api/data  (Different protocol: HTTP != HTTPS)
// https://api.example.com/data (Different subdomain/host)
// https://example.com:8080/data (Different port)
```

### 98. What is the purpose of void 0

Void(0) is used to prevent the page from refreshing. This will be helpful to eliminate the unwanted side-effect, because it will return the undefined primitive value. It is commonly used for HTML documents that use href="JavaScript:Void(0);" within an `<a>` element. i.e, when you click a link, the browser loads a new page or refreshes the same page. But this behavior will be prevented using this expression.
For example, the below link notify the message without reloading the page

```javascript
<a href="JavaScript:void(0);" onclick="alert('Well done!')">
  Click Me!
</a>
```

### 99. Is JavaScript a compiled or interpreted language

JavaScript is an interpreted language, not a compiled language. An interpreter in the browser reads over the JavaScript code, interprets each line, and runs it. Nowadays modern browsers use a technology known as Just-In-Time (JIT) compilation, which compiles JavaScript to executable bytecode just as it is about to run.

#### Practical Code Example

```javascript
// JavaScript is JIT-compiled (Just-In-Time compiled) in modern engines (V8, SpiderMonkey)
// 1. Source code is parsed into an Abstract Syntax Tree (AST)
// 2. Interpreter (Ignition) converts AST to bytecode for immediate execution
// 3. Optimizing compiler (TurboFan) monitors hot functions and compiles them to native machine code:

function add(a, b) {
  return a + b; // Hot path compiled directly to assembly instructions
}
for (let i = 0; i < 100000; i++) add(i, 1);
```

### 100. Is JavaScript a case-sensitive language

Yes, JavaScript is a case sensitive language. The language keywords, variables, function & object names, and any other identifiers must always be typed with a consistent capitalization of letters.

#### Practical Code Example

```javascript
// JavaScript is strictly case-sensitive:
let myVariable = 'First';
let MyVariable = 'Second';
let MYVARIABLE = 'Third';

console.log(myVariable); // 'First'
console.log(MyVariable); // 'Second'
console.log(MYVARIABLE); // 'Third' (3 completely separate identifiers)
```



## Part 3: DOM, Event Flow, Timers & Browser APIs (101 - 170)

### 101. Is there any relation between Java and JavaScript

No, they are entirely two different programming languages and have nothing to do with each other. But both of them are Object Oriented Programming languages and like many other languages, they follow similar syntax for basic features(if, else, for, switch, break, continue etc).

#### Practical Code Example

```javascript
// Java and JavaScript have NO architectural relation:
// 'Java is to JavaScript as Car is to Carpet'

// JavaScript: Dynamic, prototype-based, interpreted/JIT, weakly typed
const jsObj = { role: 'Frontend' };
jsObj.newProp = 42; // Dynamic addition

// Java: Static, class-based, bytecode on JVM, strongly typed:
// public class User { private String role = "Backend"; }
```

### 102. What are events

Events are "things" that happen to HTML elements. When JavaScript is used in HTML pages, JavaScript can `react` on these events. Some of the examples of HTML events are,

  1. Web page has finished loading
  2. Input field was changed
  3. Button was clicked

  Let's describe the behavior of click event for button element,

  ```javascript
  <!doctype html>
  <html>
   <head>
     <script>
       function greeting() {
         alert('Hello! Good morning');
       }
     </script>
   </head>
   <body>
     <button type="button" onclick="greeting()">Click me</button>
   </body>
  </html>
  ```

### 103. Who created javascript

JavaScript was created by Brendan Eich in 1995 during his time at Netscape Communications. Initially it was developed under the name `Mocha`, but later the language was officially called `LiveScript` when it first shipped in beta releases of Netscape.

#### Practical Code Example

```javascript
// JavaScript was created in May 1995 by Brendan Eich at Netscape Communications:
const languageInfo = {
  creator: 'Brendan Eich',
  createdInDays: 10,
  initialName: 'Mocha',
  secondName: 'LiveScript',
  finalName: 'JavaScript'
};
console.log(languageInfo.creator); // 'Brendan Eich'
```

### 104. What is the use of preventDefault method

The preventDefault() method cancels the event if it is cancelable, meaning that the default action or behaviour that belongs to the event will not occur. For example, prevent form submission when clicking on submit button and prevent opening the page URL when clicking on hyperlink are some common use cases.

  ```javascript
  document
    .getElementById("link")
    .addEventListener("click", function (event) {
      event.preventDefault();
    });
  ```

  **Note:** Remember that not all events are cancelable.

### 105. What is the use of stopPropagation method

The stopPropagation method is used to stop the event from bubbling up the event chain. For example, the below nested divs with stopPropagation method prevents default event propagation when clicking on nested div(Div1)

  ```javascript
  <p>Click DIV1 Element</p>
  <div onclick="secondFunc()">DIV 2
    <div onclick="firstFunc(event)">DIV 1</div>
  </div>

  <script>
  function firstFunc(event) {
    alert("DIV 1");
    event.stopPropagation();
  }

  function secondFunc() {
    alert("DIV 2");
  }
  </script>
  ```

### 106. What are the steps involved in return false usage

The return false statement in event handlers performs the below steps,

  1. First it stops the browser's default action or behaviour.
  2. It prevents the event from propagating the DOM
  3. Stops callback execution and returns immediately when called.

#### Practical Code Example

```javascript
// In traditional inline DOM event handlers:
// <a href="https://example.com" onclick="return handleClick();">Link</a>

function handleClick(event) {
  // 'return false' performs two actions:
  // 1. event.preventDefault() (stops link navigation / form submit)
  // 2. event.stopPropagation() (stops bubbling up the DOM tree)
  return false;
}
```

### 107. What is BOM

The Browser Object Model (BOM) allows JavaScript to "talk to" the browser. It consists of the objects navigator, history, screen, location and document which are children of the window. The Browser Object Model is not standardized and can change based on different browsers.

  ![Screenshot](images/bom.png)

#### Practical Code Example

```javascript
// Browser Object Model (BOM) exposes browser window capabilities:
console.log(window.navigator.userAgent); // Browser identity
console.log(window.screen.width);        // Physical screen resolution
console.log(window.location.href);       // URL manipulation
console.log(window.history.length);      // Session history stack
```

### 108. What is the use of setTimeout

The setTimeout() method is used to call a function or evaluate an expression after a specified number of milliseconds. For example, let's log a message after 2 seconds using setTimeout method,

  ```javascript
  setTimeout(function () {
    console.log("Good morning");
  }, 2000);
  ```

### 109. What is the use of setInterval

The setInterval() method is used to call a function or evaluate an expression at specified intervals (in milliseconds). For example, let's log a message after 2 seconds using setInterval method,

  ```javascript
  setInterval(function () {
    console.log("Good morning");
  }, 2000);
  ```

### 110. Why is JavaScript treated as Single threaded

JavaScript is a single-threaded language. Because the language specification does not allow the programmer to write code so that the interpreter can run parts of it in parallel in multiple threads or processes. Whereas languages like java, go, C++ can make multi-threaded and multi-process programs.

#### Practical Code Example

```javascript
// Single-threaded: Only ONE call stack executes JavaScript code at any moment.
// Asynchronous operations are delegated to browser Web APIs / libuv thread pool:

console.log('1. Call Stack');

setTimeout(() => {
  console.log('3. Web API Callback via Event Loop');
}, 0);

console.log('2. Call Stack Continues');
// Output: 1 -> 2 -> 3
```

### 111. What is an event delegation

Event delegation is a technique where you attach **one event listener to a parent element** instead of adding listeners to each child element. It works because events bubble up from the target element to its parents.

  For example, if you wanted to detect field changes inside a specific form, you can use event delegation technique,

  ```javascript
  var form = document.querySelector("#registration-form");

  // Listen for changes to fields inside the form
  form.addEventListener(
    "input",
    function (event) {
      // Log the field that was changed
      console.log(event.target);
    },
    false
  );
  ```

### 112. What is ECMAScript

ECMAScript is the scripting language that forms the basis of JavaScript. ECMAScript standardized by the ECMA International standards organization in the ECMA-262 and ECMA-402 specifications. The first edition of ECMAScript was released in 1997.

#### Practical Code Example

```javascript
// ECMAScript: The standardized language specification (ECMA-262)
// JavaScript: The real-world implementation containing ECMAScript core + Web APIs (DOM, fetch)
const esFeatures = ['ES6 (2015)', 'ES2020 (Optional Chaining)', 'ES2022 (Top-level await)'];
console.log(esFeatures.join(' -> '));
```

### 113. What is JSON

JSON (JavaScript Object Notation) is a lightweight format that is used for data interchanging. It is based on a subset of JavaScript language in the way objects are built in JavaScript.

#### Practical Code Example

```javascript
// JSON (JavaScript Object Notation): Lightweight text data-interchange format
const jsonString = '{"name":"Devin","skills":["TS","React"]}';

// Parsing to JS Object:
const parsed = JSON.parse(jsonString);
console.log(parsed.name); // 'Devin'

// Serializing to JSON string:
const serialized = JSON.stringify(parsed);
console.log(typeof serialized); // 'string'
```

### 114. What are the syntax rules of JSON

Below are the list of syntax rules of JSON

  1. The data is in name/value pairs
  2. The data is separated by commas
  3. Curly braces hold objects
  4. Square brackets hold arrays

#### Practical Code Example

```javascript
// JSON Syntax Rules:
// 1. Keys must be double-quoted strings
// 2. Values: string, number, object, array, boolean, null (NO functions or undefined)
// 3. No trailing commas allowed
const validJson = `{
  "title": "Interview Guide",
  "version": 2,
  "isActive": true,
  "tags": ["js", "frontend"]
}`;
JSON.parse(validJson);
```

### 115. What is the purpose JSON stringify

When sending data to a web server, the data has to be in a string format. You can achieve this by converting JSON object into a string using stringify() method.

  ```javascript
  var userJSON = { name: "John", age: 31 };
  var userString = JSON.stringify(userJSON);
  console.log(userString); //"{"name":"John","age":31}"
  ```

### 116. How do you parse JSON string

When receiving the data from a web server, the data is always in a string format. But you can convert this string value to a javascript object using parse() method.

  ```javascript
  var userString = '{"name":"John","age":31}';
  var userJSON = JSON.parse(userString);
  console.log(userJSON); // {name: "John", age: 31}
  ```

### 117. Why do you need JSON

When exchanging data between a browser and a server, the data can only be text. Since JSON is text only, it can easily be sent to and from a server, and used as a data format by any programming language.

#### Practical Code Example

```javascript
// Why JSON: Language-independent, human-readable, natively parsed across all web platforms:
fetch('/api/user')
  .then(res => res.json()) // Native rapid serialization
  .then(data => console.log('Interchange format:', data));
```

### 118. What are PWAs

Progressive web applications (PWAs) are a type of mobile app delivered through the web, built using common web technologies including HTML, CSS and JavaScript. These PWAs are deployed to servers, accessible through URLs, and indexed by search engines.

#### Practical Code Example

```javascript
// Progressive Web Apps (PWAs) combine web reach with native app capabilities:
// 1. Web App Manifest (manifest.json for installability)
// 2. Service Worker (sw.js for offline caching & background sync)
// 3. HTTPS secure origin

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### 119. What is the purpose of clearTimeout method

The clearTimeout() function is used in javascript to clear the timeout which has been set by setTimeout()function before that. i.e, The return value of setTimeout() function is stored in a variable and it’s passed into the clearTimeout() function to clear the timer.

  For example, the below setTimeout method is used to display the message after 3 seconds. This timeout can be cleared by the clearTimeout() method.

  ```javascript
  <script>
       var msg;
       function greeting() {
          alert('Good morning');
       }
       function start() {
         msg =setTimeout(greeting, 3000);

       }

       function stop() {
           clearTimeout(msg);
       }
  </script>
  ```

### 120. What is the purpose of clearInterval method

The clearInterval() function is used in javascript to clear the interval which has been set by setInterval() function. i.e, The return value returned by setInterval() function is stored in a variable and it’s passed into the clearInterval() function to clear the interval.

  For example, the below setInterval method is used to display the message for every 3 seconds. This interval can be cleared by the clearInterval() method.

  ```javascript
  <script>
       var msg;
       function greeting() {
          alert('Good morning');
       }
       function start() {
         msg = setInterval(greeting, 3000);

       }

       function stop() {
           clearInterval(msg);
       }
  </script>
  ```

### 121. How do you redirect new page in javascript

In vanilla javascript, you can redirect to a new page using the `location` property of window object. The syntax would be as follows,

  ```javascript
  function redirect() {
    window.location.href = "newPage.html";
  }
  ```

### 122. How do you check whether a string contains a substring

There are 3 possible ways to check whether a string contains a substring or not,

  1. **Using includes:** ES6 provided `String.prototype.includes` method to test a string contains a substring

  ```javascript
  var mainString = "hello",
    subString = "hell";
  mainString.includes(subString);
  ```

  2. **Using indexOf:** In an ES5 or older environment, you can use `String.prototype.indexOf` which returns the index of a substring. If the index value is not equal to -1 then it means the substring exists in the main string.

  ```javascript
  var mainString = "hello",
    subString = "hell";
  mainString.indexOf(subString) !== -1;
  ```

  3. **Using RegEx:** The advanced solution is using Regular expression's test method(`RegExp.test`), which allows for testing for against regular expressions

  ```javascript
  var mainString = "hello",
    regex = /hell/;
  regex.test(mainString);
  ```

### 123. How do you validate an email in javascript

You can validate an email in javascript using regular expressions. It is recommended to do validations on the server side instead of the client side. Because the javascript can be disabled on the client side.

  ```javascript
  function validateEmail(email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  ```

  

  The above regular expression accepts unicode characters.

### 124. How do you get the current url with javascript

You can use `window.location.href` expression to get the current url path and you can use the same expression for updating the URL too. You can also use `document.URL` for read-only purposes but this solution has issues in FF.

  ```javascript
  console.log("location.href", window.location.href); // Returns full URL
  ```

### 125. What are the various url properties of location object

The below `Location` object properties can be used to access URL components of the page,

  1. href - The entire URL
  2. protocol - The protocol of the URL
  3. host - The hostname and port of the URL
  4. hostname - The hostname of the URL
  5. port - The port number in the URL
  6. pathname - The path name of the URL
  7. search - The query portion of the URL
  8. hash - The anchor portion of the URL

#### Practical Code Example

```javascript
// Given URL: https://example.com:8080/dashboard?user=123#analytics
console.log(window.location.protocol); // 'https:'
console.log(window.location.host);     // 'example.com:8080'
console.log(window.location.hostname); // 'example.com'
console.log(window.location.port);     // '8080'
console.log(window.location.pathname); // '/dashboard'
console.log(window.location.search);   // '?user=123'
console.log(window.location.hash);     // '#analytics'
```

### 126. How do you get query string values in javascript

You can use URLSearchParams to get query string values in javascript. Let's see an example to get the client code value from URL query string,

  ```javascript
  const urlParams = new URLSearchParams(window.location.search);
  const clientCode = urlParams.get("clientCode");
  ```

### 127. How do you check if a key exists in an object

You can check whether a key exists in an object or not using three approaches,

  1. **Using in operator:** You can use the in operator whether a key exists in an object or not

     ```javascript
     "key" in obj;
     ```

     and If you want to check if a key doesn't exist, remember to use parenthesis,

     ```javascript
     !("key" in obj);
     ```

  2. **Using hasOwnProperty method:** You can use `hasOwnProperty` to particularly test for properties of the object instance (and not inherited properties)

     ```javascript
     obj.hasOwnProperty("key"); // true
     ```

  3. **Using undefined comparison:** If you access a non-existing property from an object, the result is undefined. Let’s compare the properties against undefined to determine the existence of the property.

     ```javascript
     const user = {
       name: "John",
     };

     console.log(user.name !== undefined); // true
     console.log(user.nickName !== undefined); // false
     ```

### 128. How do you loop through or enumerate javascript object

You can use the `for-in` loop to loop through javascript object. You can also make sure that the key you get is an actual property of an object, and doesn't come from the prototype using `hasOwnProperty` method.

  ```javascript
  var object = {
    k1: "value1",
    k2: "value2",
    k3: "value3",
  };

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      console.log(key + " -> " + object[key]); // k1 -> value1 ...
    }
  }
  ```

### 129. How do you test for an empty object

There are different solutions based on ECMAScript versions

  1. **Using Object entries(ECMA 7+):** You can use object entries length along with constructor type.

  ```javascript
  Object.entries(obj).length === 0 && obj.constructor === Object; // Since date object length is 0, you need to check constructor check as well
  ```

  2. **Using Object keys(ECMA 5+):** You can use object keys length along with constructor type.

  ```javascript
  Object.keys(obj).length === 0 && obj.constructor === Object; // Since date object length is 0, you need to check constructor check as well
  ```

  3. **Using for-in with hasOwnProperty(Pre-ECMA 5):** You can use a for-in loop along with hasOwnProperty.

  ```javascript
  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }
  ```

### 130. What is an arguments object

The arguments object is an Array-like object accessible inside functions that contains the values of the arguments passed to that function. For example, let's see how to use arguments object inside sum function,

  ```javascript
  function sum() {
    var total = 0;
    for (var i = 0, len = arguments.length; i < len; ++i) {
      total += arguments[i];
    }
    return total;
  }

  sum(1, 2, 3); // returns 6
  ```

  **Note:** You can't apply array methods on arguments object. But you can convert into a regular array as below.

  ```javascript
  var argsArray = Array.prototype.slice.call(arguments);
  ```

### 131. How do you make first letter of the string in an uppercase

You can create a function which uses a chain of string methods such as charAt, toUpperCase and slice methods to generate a string with the first letter in uppercase.

  ```javascript
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  ```

### 132. What are the pros and cons of for loops

The for-loop is a commonly used iteration syntax in javascript. It has both pros and cons

  #### Pros

  1. Works on every environment
  2. You can use break and continue flow control statements

  #### Cons

  3. Too verbose
  4. Imperative
  5. You might face off-by-one errors.

#### Practical Code Example

```javascript
// Standard for loop:
// Pro: Fastest raw performance, supports break and continue
// Con: Verbose syntax, manual counter tracking prone to off-by-one bugs
const items = [10, 20, 30, 40];
for (let i = 0; i < items.length; i++) {
  if (items[i] === 30) break;
  console.log(items[i]);
}

// for...of:
// Pro: Clean, iterable-friendly, supports break/continue
for (const item of items) {
  console.log(item);
}
```

### 133. How do you display the current date in javascript

You can use `new Date()` to generate a new Date object containing the current date and time. For example, let's display the current date in mm/dd/yyyy

  ```javascript
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  document.write(today);
  ```

### 134. How do you compare two date objects

You need to use date.getTime() method in order to compare unix timestamp values

  ```javascript
  var d1 = new Date();
  var d2 = new Date(d1);
  console.log(d1.getTime() === d2.getTime()); //True
  console.log(d1 === d2); // False
  ```

### 135. How do you check if a string starts with another string

You can use ECMAScript 6's `String.prototype.startsWith()` method to check if a string starts with another string or not. But it is not yet supported in all browsers. Let's see an example to see this usage,

  ```javascript
  "Good morning".startsWith("Good"); // true
  "Good morning".startsWith("morning"); // false
  ```

### 136. How do you trim a string in javascript

JavaScript provided a trim method on string types to trim any whitespaces present at the beginning or ending of the string.

  ```javascript
  "  Hello World   ".trim(); //Hello World
  ```

  If your browser(<IE9) doesn't support this method then you can use below polyfill.

  ```javascript
  if (!String.prototype.trim) {
    (function () {
      // Make sure we trim BOM and NBSP
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function () {
        return this.replace(rtrim, "");
      };
    })();
  }
  ```

### 137. How do you add a key value pair in javascript

There are two possible solutions to add new properties to an object.

  Let's take a simple object to explain these solutions.

  ```javascript
  var object = {
    key1: value1,
    key2: value2,
  };
  ```

  1. **Using dot notation:** This solution is useful when you know the name of the property

  ```javascript
  object.key3 = "value3";
  ```

  2. **Using square bracket notation:** This solution is useful when the name of the property is dynamically determined or the key's name is non-JS like "user-name"

  ```javascript
  obj["key3"] = "value3";
  ```

### 138. Is the !-- notation represents a special operator

No,that's not a special operator. But it is a combination of 2 standard operators one after the other,

  1. A logical not (!)
  2. A prefix decrement (--)

  At first, the value decremented by one and then tested to see if it is equal to zero or not for determining the truthy/falsy value.

#### Practical Code Example

```javascript
// '<!--' is NOT a special operator. It is legacy HTML comment syntax:
// In browser script tags, it is parsed identically to a single line '//' comment:
<!-- console.log('This line is commented out in browsers');
console.log('This line executes');
```

### 139. How do you assign default values to variables

You can use the logical or operator `||` in an assignment expression to provide a default value. The syntax looks like as below,

  ```javascript
  var a = b || c;
  ```

  As per the above expression, variable 'a 'will get the value of 'c' only if 'b' is falsy (if is null, false, undefined, 0, empty string, or NaN), otherwise 'a' will get the value of 'b'.

### 140. How do you define multiline strings

You can define multiline string literals using the '\n' character followed by line terminator('\').

  ```javascript
  var str = "This is a \n very lengthy \n sentence!";
  console.log(str);
  ```

  But if you have a space after the '\n' character, there will be indentation inconsistencies.

### 141. What is an app shell model

An application shell (or app shell) architecture is one way to build a Progressive Web App that reliably and instantly loads on your users' screens, similar to what you see in native applications. It is useful for getting some initial HTML to the screen fast without a network.

#### Practical Code Example

```javascript
// App Shell Architecture separates the static UI container from dynamic data:
// 1. Cache App Shell (Header, Nav, CSS) immediately on install:
caches.open('app-shell-v1').then(cache => {
  return cache.addAll(['/', '/index.html', '/shell.css', '/shell.js']);
});
// 2. Render Shell instantly on navigation, then fetch dynamic content via API.
```

### 142. Can we define properties for functions

Yes, we can define properties for functions because functions are also objects.

  ```javascript
  fn = function (x) {
    //Function code goes here
  };

  fn.name = "John";

  fn.profile = function (y) {
    //Profile code goes here
  };
  ```

### 143. What is the way to find the number of parameters expected by a function

You can use `function.length` syntax to find the number of parameters expected by a function. Let's take an example of `sum` function to calculate the sum of numbers,

  ```javascript
  function sum(num1, num2, num3, num4) {
    return num1 + num2 + num3 + num4;
  }
  sum.length; // 4 is the number of parameters expected.
  ```

### 144. What is a polyfill

A polyfill is a piece of JS code used to provide modern functionality on older browsers that do not natively support it. For example, Silverlight plugin polyfill can be used to mimic the functionality of an HTML Canvas element on Microsoft Internet Explorer 7.

  There are two main polyfill libraries available,

  1. **Core.js**: It is a modular javascript library used for cutting-edge ECMAScript features.
  2. **Polyfill.io:** It provides polyfills that are required for browser needs.

#### Practical Code Example

```javascript
// Polyfill: Custom code replicating modern browser feature on legacy engines:
if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement) {
    return this.indexOf(searchElement) !== -1;
  };
}
console.log([1, 2, 3].includes(2)); // Works even in legacy engines!
```

### 145. What are break and continue statements

The break statement is used to "jump out" of a loop. i.e, It breaks the loop and continues executing the code after the loop.

  ```javascript
  for (i = 0; i < 10; i++) {
    if (i === 5) {
      break;
    }
    text += "Number: " + i + "<br>";
  }
  ```

  The continue statement is used to "jump over" one iteration in the loop. i.e, It breaks one iteration (in the loop), if a specified condition occurs, and continues with the next iteration in the loop.

  ```javascript
  for (i = 0; i < 10; i++) {
    if (i === 5) {
      continue;
    }
    text += "Number: " + i + "<br>";
  }
  ```

### 146. What are js labels

The label statement allows us to name loops and blocks in JavaScript. We can then use these labels to refer back to the code later. For example, the below code with labels avoids printing the numbers when they are same,

  ```javascript
  var i, j;

  loop1: for (i = 0; i < 3; i++) {
    loop2: for (j = 0; j < 3; j++) {
      if (i === j) {
        continue loop1;
      }
      console.log("i = " + i + ", j = " + j);
    }
  }

  // Output is:
  //   "i = 1, j = 0"
  //   "i = 2, j = 0"
  //   "i = 2, j = 1"
  ```

### 147. What are the benefits of keeping declarations at the top

It is recommended to keep all declarations at the top of each script or function. The benefits of doing this are,

  1. Gives cleaner code
  2. It provides a single place to look for local variables
  3. Easy to avoid unwanted global variables
  4. It reduces the possibility of unwanted re-declarations

#### Practical Code Example

```javascript
// Benefit: Clear variable scope visibility and eliminates TDZ (Temporal Dead Zone) gotchas
function processOrder(order) {
  // Declare all state variables at top of scope:
  let subtotal = 0;
  let tax = 0;
  let total = 0;

  subtotal = order.items.reduce((sum, item) => sum + item.price, 0);
  tax = subtotal * 0.08;
  total = subtotal + tax;
  return total;
}
```

### 148. What are the benefits of initializing variables

It is recommended to initialize variables because of the below benefits,

  1. It gives cleaner code
  2. It provides a single place to initialize variables
  3. Avoid undefined values in the code

#### Practical Code Example

```javascript
// Benefits of variable initialization:
// 1. Avoids unexpected 'undefined' runtime bugs
// 2. V8 engine optimizes hidden classes when types are initialized predictably:
let userCount = 0;        // Initialized to Number
let activeStatus = false; // Initialized to Boolean
let userList = [];        // Initialized to Array
```

### 149. What are the recommendations to create new object

It is recommended to avoid creating new objects using `new Object()`. Instead you can initialize values based on it's type to create the objects.

  1. Assign {} instead of new Object()
  2. Assign "" instead of new String()
  3. Assign 0 instead of new Number()
  4. Assign false instead of new Boolean()
  5. Assign [] instead of new Array()
  6. Assign /()/ instead of new RegExp()
  7. Assign function (){} instead of new Function()

  You can define them as an example,

  ```javascript
  var v1 = {};
  var v2 = "";
  var v3 = 0;
  var v4 = false;
  var v5 = [];
  var v6 = /()/;
  var v7 = function () {};
  ```

### 150. How do you define JSON arrays

JSON arrays are written inside square brackets and arrays contain javascript objects. For example, the JSON array of users would be as below,

  ```javascript
  "users":[
    {"firstName":"John", "lastName":"Abrahm"},
    {"firstName":"Anna", "lastName":"Smith"},
    {"firstName":"Shane", "lastName":"Warn"}
  ]
  ```

### 151. How do you generate random integers

You can use `Math.random()` with `Math.floor()` to return random integers. For example, if you want generate random integers between 1 to 10, the multiplication factor should be 10,

  ```javascript
  Math.floor(Math.random() * 10) + 1; // returns a random integer from 1 to 10
  Math.floor(Math.random() * 100) + 1; // returns a random integer from 1 to 100
  ```

  **Note:** `Math.random()` returns a random number between 0 (inclusive), and 1 (exclusive)

### 152. Can you write a random integers function to print integers within a range

Yes, you can create a proper random function to return a random number between min and max (both included)

  ```javascript
  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  randomInteger(1, 100); // returns a random integer from 1 to 100
  randomInteger(1, 1000); // returns a random integer from 1 to 1000
  ```

### 153. What is tree shaking

Tree shaking is a form of dead code elimination. It means that unused modules will not be included in the bundle during the build process and for that it relies on the static structure of ES2015 module syntax,( i.e. import and export). Initially this has been popularized by the ES2015 module bundler `rollup`, these days practically all bundlers use this technique.

#### Practical Code Example

```javascript
// Tree Shaking (Dead Code Elimination):
// math.js
export const add = (a, b) => a + b;
export const unusedHugeMathFunction = () => { /* 50KB code */ };

// main.js
import { add } from './math.js';
console.log(add(2, 3));
// Bundler (Webpack/esbuild/Rollup) strips 'unusedHugeMathFunction' from production bundle!
```

### 154. What is the need of tree shaking

Tree Shaking can significantly reduce the code size in any application. i.e, The less code we send over the wire the more performant the application will be. For example, if we just want to create a “Hello World” Application using SPA frameworks then it will take around a few MBs, but by tree shaking it can bring down the size to just a few hundred KBs. Tree shaking is implemented in Rollup and Webpack bundlers.

#### Practical Code Example

```javascript
// Need for Tree Shaking: Smaller JavaScript bundles lead to:
// 1. Faster download over mobile networks
// 2. Less CPU parse and compile time in browser V8 engine
// 3. Lower Interaction to Next Paint (INP) and faster Time to Interactive (TTI)
```

### 155. Is it recommended to use eval

No, it allows arbitrary code to be run which causes a security problem. As we know that the eval() function is used to run text as code. In most of the cases, it should not be necessary to use it.

#### Practical Code Example

```javascript
// Why eval() is strongly discouraged:
// 1. Severe Security Risk (Code Injection / XSS)
// 2. Performance degradation: V8 engine cannot optimize code containing eval()

// Bad:
// eval('var result = ' + userInput);

// Good:
const safeResult = JSON.parse('{"value": 42}');
console.log(safeResult.value);
```

### 156. What is a Regular Expression

A regular expression is a sequence of characters that forms a search pattern. You can use this search pattern for searching data in a text. These can be used to perform all types of text search and text replace operations. Let's see the syntax format now,

  ```javascript
  /pattern/modifiers;
  ```

  For example, the regular expression or search pattern with case-insensitive username would be,

  ```javascript
  /John/i;
  ```

### 157. What are the string methods that accept Regular expression

There are six string methods: `search()`, `replace()`, `replaceAll()`, `match()`, `matchAll()`, and `split()`.

  The `search()` method uses an expression to search for a match, and returns the position of the match.

  ```javascript
  var msg = "Hello John";
  var n = msg.search(/John/i); // 6
  ```

  The `replace()` and `replaceAll()` methods are used to return a modified string where the pattern is replaced.

  ```javascript
  var msg = "ball bat";
  var n1 = msg.replace(/b/i, "c"); // call bat
  var n2 = msg.replaceAll(/b/i, "c"); // call cat
  ```

  The `match()` and `matchAll()` methods are used to return the matches when matching a string against a regular expression.

  ```javascript
  var msg = "Hello John";
  var n1 = msg.match(/[A-Z]/g); // ["H", "J"]
  var n2 = msg.matchAll(/[A-Z]/g); // this returns an iterator
  ```

  The `split()` method is used to split a string into an array of substrings, and returns the new array.

  ```javascript
  var msg = "Hello John";
  var n = msg.split(/\s/); // ["Hello", "John"]
  ```

### 158. What are modifiers in regular expression

Modifiers can be used to perform case-insensitive and global searches. Let's list some of the modifiers,

  | Modifier | Description                                             |
  | -------- | ------------------------------------------------------- |
  | i        | Perform case-insensitive matching                       |
  | g        | Perform a global match rather than stops at first match |
  | m        | Perform multiline matching                              |

  Let's take an example of global modifier,

  ```javascript
  var text = "Learn JS one by one";
  var pattern = /one/g;
  var result = text.match(pattern); // one,one
  ```

### 159. What are regular expression patterns

Regular Expressions provide a group of patterns in order to match characters. Basically they are categorized into 3 types,

  1. **Brackets:** These are used to find a range of characters.
     For example, below are some use cases,
     1. [abc]: Used to find any of the characters between the brackets(a,b,c)
     2. [0-9]: Used to find any of the digits between the brackets
     3. (a|b): Used to find any of the alternatives separated with |
  2. **Metacharacters:** These are characters with a special meaning.
     For example, below are some use cases,
     1. \\d: Used to find a digit
     2. \\s: Used to find a whitespace character
     3. \\b: Used to find a match at the beginning or ending of a word
  3. **Quantifiers:** These are useful to define quantities.
     For example, below are some use cases,
     1. n+: Used to find matches for any string that contains at least one n
     2. n\*: Used to find matches for any string that contains zero or more occurrences of n
     3. n?: Used to find matches for any string that contains zero or one occurrences of n

#### Practical Code Example

```javascript
// Common Regular Expression Patterns:
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const digitsOnly = /^\d+$/;
const phonePattern = /^\(\d{3}\)\s\d{3}-\d{4}$/;

console.log(emailPattern.test('dev@example.com')); // true
console.log(digitsOnly.test('12345a'));            // false
```

### 160. What is a RegExp object

RegExp object is a regular expression object with predefined properties and methods. Let's see the simple usage of RegExp object,

  ```javascript
  var regexp = new RegExp("\\w+");
  console.log(regexp);
  // expected output: /\w+/
  ```

### 161. How do you search a string for a pattern

You can use the `test()` method of regular expression in order to search a string for a pattern, and return true or false depending on the result.

  ```javascript
  var pattern = /you/;
  console.log(pattern.test("How are you?")); //true
  ```

### 162. What is the purpose of exec method

The purpose of exec method is similar to test method but it executes a search for a match in a specified string and returns a result array, or null instead of returning true/false.

  ```javascript
  var pattern = /you/;
  console.log(pattern.exec("How are you?")); //["you", index: 8, input: "How are you?", groups: undefined]
  ```

### 163. How do you change the style of a HTML element

You can change inline style or classname of a HTML element using javascript DOM-manipulation

  1. **Using style property:** You can modify inline style using style property

  ```javascript
  document.getElementById("title").style.fontSize = "30px";
  ```

  2. **Using ClassName property:** It is easy to modify element class using className property

  ```javascript
  document.getElementById("title").className = "custom-title";
  ```

### 164. What would be the result of 1+2+'3'

The output is going to be `33`. Since `1` and `2` are numeric values, the result of the first two digits is going to be a numeric value `3`. The next digit is a string type value because of that the addition of numeric value `3` and string type value `3` is just going to be a concatenation value `33`. Other operations like `3 * '3'` do yield correct results because the string is coerced into a number.

#### Practical Code Example

```javascript
// Evaluated from left to right:
// 1. 1 + 2 = 3 (numeric addition)
// 2. 3 + '3' = '33' (string concatenation coercion)
const result = 1 + 2 + '3';
console.log(result);         // '33'
console.log(typeof result);  // 'string'
```

### 165. What is a debugger statement

The debugger statement invokes any available debugging functionality, such as setting a breakpoint. If no debugging functionality is available, this statement has no effect.
  For example, in the below function a debugger statement has been inserted. So
  execution is paused at the debugger statement just like a breakpoint in the script source.

  ```javascript
  function getProfile() {
    // code goes here
    debugger;
    // code goes here
  }
  ```

### 166. What is the purpose of breakpoints in debugging

You can set breakpoints in the javascript code once the debugger statement is executed and the debugger window pops up. At each breakpoint, javascript will stop executing, and let you examine the JavaScript values. After examining values, you can resume the execution of code using the play button.

#### Practical Code Example

```javascript
// Breakpoints pause code execution in DevTools to inspect Call Stack, Scope, and Memory:
function calculateDiscount(price, userType) {
  let discount = 0;
  if (userType === 'VIP') {
    discount = 0.25; // Set conditional breakpoint here: e.g. 'price > 500'
  }
  return price * (1 - discount);
}
calculateDiscount(600, 'VIP');
```

### 167. Can I use reserved words as identifiers

No, you cannot use the reserved words as variables, labels, object or function names. Let's see one simple example,

  ```javascript
  var else = "hello"; // Uncaught SyntaxError: Unexpected token else
  ```

### 168. How do you detect a mobile browser

You can use regex which returns a true or false value depending on whether or not the user is browsing with a mobile.

  ```javascript
  window.mobilecheck = function () {
    var mobileCheck = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        mobileCheck = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return mobileCheck;
  };
  ```

### 169. How do you detect a mobile browser without regexp

You can detect mobile browsers by simply running through a list of devices and checking if the useragent matches anything. This is an alternative solution for RegExp usage,

  ```javascript
  function detectmob() {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    } else {
      return false;
    }
  }
  ```

### 170. How do you get the image width and height using JS

You can programmatically get the image and check the dimensions(width and height) using JavaScript.

  ```javascript
  var img = new Image();
  img.onload = function () {
    console.log(this.width + "x" + this.height);
  };
  img.src = "http://www.google.com/intl/en_ALL/images/logo.gif";
  ```



## Part 4: Prototypes, Object Methods & Event Loop (171 - 250)

### 171. How do you make synchronous HTTP request

Browsers provide an XMLHttpRequest object which can be used to make synchronous HTTP requests from JavaScript.

  ```javascript
  function httpGet(theUrl) {
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", theUrl, false); // false for synchronous request
    xmlHttpReq.send(null);
    return xmlHttpReq.responseText;
  }
  ```

### 172. How do you make asynchronous HTTP request

Browsers provide an XMLHttpRequest object which can be used to make asynchronous HTTP requests from JavaScript by passing the 3rd parameter as true.

  ```javascript
  function httpGetAsync(theUrl, callback) {
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.onreadystatechange = function () {
      if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200)
        callback(xmlHttpReq.responseText);
    };
    xmlHttpReq.open("GET", theUrl, true); // true for asynchronous
    xmlHttpReq.send(null);
  }
  ```

  Today this is considered deprecated, because an async `fetch` call (in browsers later than 2016) is simpler and more robust.

### 173. How do you convert date to another timezone in javascript

You can use the toLocaleString() method to convert dates in one timezone to another. For example, let's convert current date to British English timezone as below,

  ```javascript
  console.log(new Date().toLocaleString("en-GB", { timeZone: "UTC" })); //29/06/2019, 09:56:00
  ```

### 174. What are the properties used to get size of window

You can use innerWidth, innerHeight, clientWidth, clientHeight properties of windows, document element and document body objects to find the size of a window. Let's use a combination of these properties to calculate the size of a window or document,

  ```javascript
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  var height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  ```

### 175. What is a conditional operator in javascript

The conditional (ternary) operator is the only JavaScript operator that takes three operands which acts as a shortcut for `if` statements.

  ```javascript
  var isAuthenticated = false;
  console.log(
    isAuthenticated ? "Hello, welcome" : "Sorry, you are not authenticated"
  ); // Sorry, you are not authenticated
  ```

### 176. Can you apply chaining on conditional operator

Yes, you can apply chaining on conditional operators similar to **`if … else if … else if … else`** chain. The syntax is going to be as below,

  ```javascript
  function traceValue(someParam) {
    return condition1
      ? value1
      : condition2
      ? value2
      : condition3
      ? value3
      : value4;
  }

  // The above conditional operator is equivalent to:

  function traceValue(someParam) {
    if (condition1) {
      return value1;
    } else if (condition2) {
      return value2;
    } else if (condition3) {
      return value3;
    } else {
      return value4;
    }
  }
  ```

### 177. What are the ways to execute javascript after a page load

You can execute javascript after page load in many different ways,

  1. **window.onload:**

  ```javascript
  window.onload = function ...
  ```

  2. **document.onload:**

  ```javascript
  document.onload = function ...
  ```

  3. **body onload:**

  ```javascript
  <body onload="script();">
  ```

### 178. What is the difference between proto and prototype

The `__proto__` object is the actual object that is used in the lookup chain to resolve methods, etc. Whereas `prototype` is the object that is used to build `__proto__` when you create an object with the `new` operator (a special variant of a function call).

  ```javascript
  new Employee().__proto__ === Employee.prototype;
  new Employee().prototype === undefined;
  ```

  There are few more differences,

  | feature    | Prototype                                                    | proto                                                      |
  | ---------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
  | Access     | All function constructors have prototype properties.         | All objects have \_\_proto\_\_ property                    |
  | Purpose    | Used to reduce memory wastage with a single copy of function | Used in lookup chain to resolve methods, constructors etc. |
  | ECMAScript | Introduced in ES6                                            | Introduced in ES5                                          |
  | Usage      | Frequently used                                              | Rarely used                                                |

### 179. Can you give an example of when you really need a semicolon

It is recommended to use semicolons after every statement in JavaScript. For example, in the below case (that is an IIFE = Immediately Invoked Function Expression) it throws an error ".. is not a function" at runtime due to missing semicolon.

  ```javascript
  // define a function
  var fn = (function () {
    //...
  })(
    // semicolon missing at this line

    // then execute some code inside a closure
    function () {
      //...
    }
  )();
  ```

  and it will be interpreted as

  ```javascript
  var fn = (function () {
    //...
  })(function () {
    //...
  })();
  ```

  In this case, we are passing the second function as an argument to the first function and then trying to call the result of the first function call as a function. Hence, the second function will fail with a "... is not a function" error at runtime.

### 180. What is the freeze method

The **`freeze()`** method is used to freeze an object. Freezing an object does not allow adding new properties to an object, prevents removing, and prevents changing the enumerability, configurability, or writability of existing properties. i.e. It returns the passed object and does not create a frozen copy.

  ```javascript
  const obj = {
    prop: 100,
  };

  Object.freeze(obj);
  obj.prop = 200; // Throws an error in strict mode

  console.log(obj.prop); //100
  ```

  Remember freezing is only applied to the top-level properties in objects but not for nested objects.
  For example, let's try to freeze user object which has employment details as nested object and observe that details have been changed.

  ```javascript
  const user = {
    name: "John",
    employment: {
      department: "IT",
    },
  };

  Object.freeze(user);
  user.employment.department = "HR";
  ```

  **Note:** It causes a TypeError if the argument passed is not an object.

### 181. What is the purpose of the freeze method

Below are the main benefits of using freeze method,

  1. It is used for freezing objects and arrays.
  2. It is used to make an object immutable.

#### Practical Code Example

```javascript
// Object.freeze(): Makes an object completely immutable
const config = { apiEndpoint: 'https://api.v1.com' };
Object.freeze(config);

config.apiEndpoint = 'https://hacked.com'; // Fails silently (or throws TypeError in strict mode)
config.newProp = 'fail';                   // Cannot add new properties
delete config.apiEndpoint;                 // Cannot delete properties

console.log(config.apiEndpoint); // 'https://api.v1.com'
```

### 182. Why do I need to use the freeze method

In the Object-oriented paradigm, an existing API contains certain elements that are not intended to be extended, modified, or re-used outside of their current context. Hence it works as the `final` keyword which is used in various languages.

#### Practical Code Example

```javascript
// Why use freeze: Prevents accidental mutation of global constants, Redux initial states, or library configs:
export const APP_CONFIG = Object.freeze({
  ENV: 'production',
  MAX_RETRIES: 3,
  TIMEOUT_MS: 5000
});
```

### 183. How do you detect a browser language preference

You can use the navigator object to detect a browser language preference as below,

  ```javascript
  var language =
    (navigator.languages && navigator.languages[0]) || // Chrome / Firefox
    navigator.language || // All browsers
    navigator.userLanguage; // IE <= 10

  console.log(language);
  ```

### 184. How to convert a string to title case with javascript

Title case means that the first letter of each word is capitalized. You can convert a string to title case using the below function,

  ```javascript
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }
  toTitleCase("good morning john"); // Good Morning John
  ```

### 185. How do you detect if javascript is disabled on the page

You can use the `<noscript>` tag to detect whether JavaScript is disabled or not. The code block inside `<noscript>` gets executed when JavaScript is disabled, and is typically used to display alternative content when the page is generated in JavaScript.

  ```javascript
  <script type="javascript">
      // JS related code goes here
  </script>
  <noscript>
      <a href="next_page.html?noJS=true">JavaScript is disabled in the page. Please click Next Page</a>
  </noscript>
  ```

### 186. What are various operators supported by javascript

An operator is capable of manipulating(mathematical and logical computations) a certain value or operand. There are various operators supported by JavaScript as below,

  1. **Arithmetic Operators:** Includes + (Addition), – (Subtraction), \* (Multiplication), / (Division), % (Modulus), ++ (Increment) and – – (Decrement)
  2. **Comparison Operators:** Includes == (Equal), != (Not Equal), === (Equal with type), > (Greater than), >= (Greater than or Equal to), < (Less than), <= (Less than or Equal to)
  3. **Logical Operators:** Includes && (Logical AND), || (Logical OR), ! (Logical NOT)
  4. **Assignment Operators:** Includes = (Assignment Operator), += (Add and Assignment Operator), –= (Subtract and Assignment Operator), \*= (Multiply and Assignment), /= (Divide and Assignment), %= (Modules and Assignment)
  5. **Ternary Operators:** It includes conditional(: ?) Operator
  6. **typeof Operator:** It uses to find type of variable. The syntax looks like `typeof variable`

#### Practical Code Example

```javascript
// Various Operator Types in JavaScript:
let x = 10;
x += 5;                    // Assignment & Arithmetic
const isAdult = x >= 18;   // Comparison
const canVote = isAdult && true; // Logical
const status = isAdult ? 'Adult' : 'Minor'; // Conditional (Ternary)
const name = null ?? 'Default';             // Nullish Coalescing
const street = user?.address?.street;        // Optional Chaining
```

### 187. What is a rest parameter

Rest parameter is an improved way to handle function parameters which allows us to represent an indefinite number of arguments as an array. The syntax would be as below,

  ```javascript
  function f(a, b, ...theArgs) {
    // ...
  }
  ```

  For example, let's take a sum example to calculate on dynamic number of parameters,

  ```javascript
  function sum(...args) {
    let total = 0;
    for (const i of args) {
      total += i;
    }
    return total;
  }

  console.log(sum(1, 2)); //3
  console.log(sum(1, 2, 3)); //6
  console.log(sum(1, 2, 3, 4)); //10
  console.log(sum(1, 2, 3, 4, 5)); //15
  ```

  **Note:** Rest parameter is added in ES2015 or ES6

### 188. What happens if you do not use rest parameter as a last argument

The rest parameter should be the last argument, as its job is to collect all the remaining arguments into an array. For example, if you define a function like below it doesn’t make any sense and will throw an error.

  ```javascript
  function someFunc(a,…b,c){
  //You code goes here
  return;
  }
  ```

### 189. What are the bitwise operators available in javascript

Below are the list of bitwise logical operators used in JavaScript

  1. Bitwise AND ( & )
  2. Bitwise OR ( | )
  3. Bitwise XOR ( ^ )
  4. Bitwise NOT ( ~ )
  5. Left Shift ( << )
  6. Sign Propagating Right Shift ( >> )
  7. Zero fill Right Shift ( >>> )

#### Practical Code Example

```javascript
// Bitwise Operators manipulate 32-bit binary representations:
const READ = 1;    // 0001
const WRITE = 2;   // 0010
const EXECUTE = 4; // 0100

let permission = READ | WRITE; // 0011 (Bitwise OR: combine flags)
console.log((permission & READ) !== 0);    // true  (Bitwise AND: test flag)
console.log((permission & EXECUTE) !== 0); // false
```

### 190. What is a spread operator

Spread operator allows iterables( arrays / objects / strings ) to be expanded into single arguments/elements. Let's take an example to see this behavior,

  ```javascript
  function calculateSum(x, y, z) {
    return x + y + z;
  }

  const numbers = [1, 2, 3];

  console.log(calculateSum(...numbers)); // 6
  ```

### 191. How do you determine whether object is frozen or not

`Object.isFrozen()` method is used to determine if an object is frozen or not.An object is frozen if all of the below conditions hold true,

  1. If it is not extensible.
  2. If all of its properties are non-configurable.
  3. If all its data properties are non-writable.
     The usage is going to be as follows,

  ```javascript
  const object = {
    property: "Welcome JS world",
  };
  Object.freeze(object);
  console.log(Object.isFrozen(object));
  ```

### 192. How do you determine two values same or not using object

The `Object.is()` method determines whether two values are the same value. For example, the usage with different types of values would be,

  ```javascript
  Object.is("hello", "hello"); // true
  Object.is(window, window); // true
  Object.is([], []); // false
  ```

  Two values are considered identical if one of the following holds:

  1. both undefined
  2. both null
  3. both true or both false
  4. both strings of the same length with the same characters in the same order
  5. both the same object (means both object have same reference)
  6. both numbers and
     both +0
     both -0
     both NaN
     both non-zero and both not NaN and both have the same value.

### 193. What is the purpose of using object is method

Some of the applications of Object's `is` method are follows,

  1. It is used for comparison of two strings.
  2. It is used for comparison of two numbers.
  3. It is used for comparing the polarity of two numbers.
  4. It is used for comparison of two objects.

#### Practical Code Example

```javascript
// Object.is() determines if two values are the same value (SameValue algorithm):
// Key differences with ===:
console.log(NaN === NaN);            // false
console.log(Object.is(NaN, NaN));    // true (Handles NaN identity correctly!)

console.log(-0 === +0);              // true
console.log(Object.is(-0, +0));      // false (Distinguishes negative zero)
```

### 194. How do you copy properties from one object to other

You can use the `Object.assign()` method which is used to copy the values and properties from one or more source objects to a target object. It returns the target object which has properties and values copied from the source objects. The syntax would be as below,

  ```javascript
  Object.assign(target, ...sources);
  ```

  Let's take example with one source and one target object,

  ```javascript
  const target = { a: 1, b: 2 };
  const source = { b: 3, c: 4 };

  const returnedTarget = Object.assign(target, source);

  console.log(target); // { a: 1, b: 3, c: 4 }

  console.log(returnedTarget); // { a: 1, b: 3, c: 4 }
  ```

  As observed in the above code, there is a common property(`b`) from source to target so it's value has been overwritten.

### 195. What are the applications of the assign method

Below are the some of main applications of `Object.assign()` method,

  1. It is used for cloning an object.
  2. It is used to merge objects with the same properties.

#### Practical Code Example

```javascript
// Applications of Object.assign():
// 1. Merging objects:
const defaults = { theme: 'light', fontSize: 14 };
const userPrefs = { theme: 'dark' };
const merged = Object.assign({}, defaults, userPrefs);
console.log(merged); // { theme: 'dark', fontSize: 14 }

// 2. Cloning an object (shallow copy):
const clone = Object.assign({}, merged);
```

### 196. What is a proxy object

The Proxy object is used to define custom behavior for fundamental operations such as property lookup, assignment, enumeration, function invocation, etc.

  A proxy is created with two parameters: a target object which you want to proxy and a handler object which contains methods to intercept fundamental operations. The syntax would be as follows,

  ```javascript
  var p = new Proxy(target, handler);
  ```

  Let's take a look at below examples of proxy object and how the get method which customize the lookup behavior,

  ```javascript
  //Example1:

  const person = {
    name: "Sudheer Jonna",
    age: 35,
  };

  const handler = {
    get(target, prop) {
      if (prop === "name") {
        return "Mr. " + target[prop];
      }
      return target[prop];
    },
  };

  const proxy = new Proxy(person, handler);

  //Example2:

  var handler1 = {
    get: function (obj, prop) {
      return prop in obj ? obj[prop] : 100;
    },
  };

  var p = new Proxy({}, handler1);
  p.a = 10;
  p.b = null;

  console.log(p.a, p.b); // 10, null
  console.log("c" in p, p.c); // false, 100
  ```

  In the above code, it uses `get` handler which define the behavior of the proxy when an operation is performed on it. These proxies are mainly used for some of the below cross-cutting concerns.

  1. Logging
  2. Authentication or Authorization
  3. Data binding and observables
  4. Function parameter validation

  **Note:** This feature was introduced with ES6.

### 197. What is the purpose of the seal method

The `Object.seal()` method is used to seal an object, by preventing new properties from being added to it and marking all existing properties as non-configurable. But **values of present properties can still be changed as long as they are writable**. The next level of immutability would be the [`Object.freeze()`](#what-is-a-freeze-method) method. Let's see the below example to understand more about `seal()` method

  ```javascript
  const object = {
    property: "Welcome JS world",
  };
  Object.seal(object);
  object.property = "Welcome to object world";
  console.log(Object.isSealed(object)); // true
  delete object.property; // You cannot delete when sealed
  console.log(object.property); //Welcome to object world
  ```

### 198. What are the applications of the seal method

Below are the main applications of `Object.seal()` method,

  1. It is used for sealing objects and arrays.
  2. It is used to make properties of an object non-configurable.

#### Practical Code Example

```javascript
// Applications of Object.seal():
// When you want a fixed schema (no properties added or removed), but property values can be updated:
const record = { id: 101, status: 'pending' };
Object.seal(record);

record.status = 'approved'; // Allowed!
record.newField = 123;      // Blocked!
delete record.id;           // Blocked!
console.log(record.status); // 'approved'
```

### 199. What are the differences between the freeze and seal methods

If an object is frozen using the `Object.freeze()` method then its properties become immutable and no changes can be made in them whereas if an object is sealed using the `Object.seal()` method then the changes can be made in the existing properties of the object.

#### Practical Code Example

```javascript
// Object.freeze() vs Object.seal():
// freeze: Read-only. Cannot add, cannot delete, CANNOT modify existing values.
// seal: Fixed keys. Cannot add, cannot delete, CAN modify existing values.

const frozen = Object.freeze({ count: 1 });
frozen.count = 2; // Fails! Value remains 1

const sealed = Object.seal({ count: 1 });
sealed.count = 2; // Succeeds! Value updated to 2
```

### 200. How do you determine if an object is sealed or not

The `Object.isSealed()` method is used to determine if an object is sealed or not. An object is sealed if all of the below conditions hold true

  1. If it is not extensible.
  2. If all of its properties are non-configurable.
  3. If it is not removable (but not necessarily non-writable).
     Let's see it in the action

  ```javascript
  const object = {
    property: "Hello, Good morning",
  };

  Object.seal(object); // Using seal() method to seal the object

  console.log(Object.isSealed(object)); // checking whether the object is sealed or not
  ```

### 201. How do you get enumerable key and value pairs

The `Object.entries()` method is used to return an array of a given object's own enumerable string-keyed property [key, value] pairs, in the same order as that provided by a `for...in` loop. Let's see the functionality of `object.entries()` method in an example,

  ```javascript
  const object = {
    a: "Good morning",
    b: 100,
  };

  for (let [key, value] of Object.entries(object)) {
    console.log(`${key}: ${value}`); // a: 'Good morning'
    // b: 100
  }
  ```

  **Note:** The order is not guaranteed as object defined.

### 202. What is the main difference between Object.values and Object.entries method

The `Object.values()` method's behavior is similar to `Object.entries()` method but it returns an array of values instead [key,value] pairs.

  ```javascript
  const object = {
    a: "Good morning",
    b: 100,
  };

  for (let value of Object.values(object)) {
    console.log(`${value}`); // 'Good morning \n100'
  }
  ```

### 203. How can you get the list of keys of any object

You can use the `Object.keys()` method which is used to return an array of a given object's own property names, in the same order as we get with a normal loop. For example, you can get the keys of a user object,

  ```javascript
  const user = {
    name: "John",
    gender: "male",
    age: 40,
  };

  console.log(Object.keys(user)); //['name', 'gender', 'age']
  ```

### 204. How do you create an object with a prototype

The `Object.create()` method is used to create a new object with the specified prototype object and properties. i.e, It uses an existing object as the prototype of the newly created object. It returns a new object with the specified prototype object and properties.

  ```javascript
  const user = {
    name: "John",
    printInfo: function () {
      console.log(`My name is ${this.name}.`);
    },
  };

  const admin = Object.create(user);

  admin.name = "Nick"; // Remember that "name" is a property set on "admin" but not on "user" object

  admin.printInfo(); // My name is Nick
  ```

### 205. What is a WeakSet

A `WeakSet` is used to store a collection of weakly(weak references) held objects. The syntax would be as follows,

  ```javascript
  new WeakSet([iterable]);
  ```

  Let's see the below example to explain it's behavior,

  ```javascript
  var ws = new WeakSet();
  var user = {};
  ws.add(user);
  ws.has(user); // true
  ws.delete(user); // removes user from the set
  ws.has(user); // false, user has been removed
  ```

### 206. What are the differences between WeakSet and Set

The main difference is that references to objects in `Set` are strong while references to objects in `WeakSet` are weak. i.e, An object in `WeakSet` can be garbage collected if there is no other reference to it.
  Other differences are:

  1. `Set` can store any value whereas `WeakSet` can store only collections of objects
  2. `WeakSet` does not have size property unlike `Set`
  3. `WeakSet` does not have methods such as clear, keys, values, entries, forEach.
  4. `WeakSet` is not iterable.

#### Practical Code Example

```javascript
// WeakSet vs Set:
// 1. WeakSet only holds OBJECT references (no primitives)
// 2. Objects are held weakly (garbage collected if no other references exist)
// 3. WeakSet is NOT iterable and has no .size property:

const visited = new WeakSet();
let node = { id: 'dom-node-1' };
visited.add(node);
console.log(visited.has(node)); // true

node = null; // Object is automatically cleaned up by garbage collection!
```

### 207. List down the collection of methods available on WeakSet

Below are the list of methods available on `WeakSet`,

  1. `add(value)`: A new object is appended with the given value
  2. `delete(value)`: Deletes the value from the collection.
  3. `has(value)`: It returns true if the value is present in the collection, otherwise it returns false.

  Let's see the functionality of all the above methods in an example,

  ```javascript
  var weakSetObject = new WeakSet();
  var firstObject = {};
  var secondObject = {};
  // add(value)
  weakSetObject.add(firstObject);
  weakSetObject.add(secondObject);
  console.log(weakSetObject.has(firstObject)); //true
  weakSetObject.delete(secondObject);
  ```

### 208. What is a WeakMap

A `WeakMap` object is a collection of key/value pairs in which the keys are weakly referenced. In this case, keys must be objects and the values can be arbitrary values. The syntax looks like the following:

  ```javascript
  new WeakMap([iterable]);
  ```

  Let's see the below example to explain it's behavior,

  ```javascript
  var ws = new WeakMap();
  var user = {};
  ws.set(user);
  ws.has(user); // true
  ws.delete(user); // removes user from the map
  ws.has(user); // false, user has been removed
  ```

### 209. What are the differences between WeakMap and Map

The main difference is that references to key objects in `Map` are strong while references to key objects in `WeakMap` are weak. i.e, A key object in `WeakMap` can be garbage collected if there is no other reference to it.
  Other differences are,

  1. `Map` can store any key type whereas `WeakMap` can store only collections of key objects
  2. `WeakMap` does not have size property unlike `Map`
  3. `WeakMap` does not have methods such as clear, keys, values, entries, forEach.
  4. `WeakMap` is not iterable.

#### Practical Code Example

```javascript
// WeakMap vs Map:
// WeakMap keys MUST be objects and are weakly referenced (auto-GC):
const privateData = new WeakMap();

class User {
  constructor(name, ssn) {
    this.name = name;
    privateData.set(this, { ssn }); // Private state hidden from inspection!
  }
  getSSN() {
    return privateData.get(this).ssn;
  }
}

const user = new User('Sarah', '123-45-6789');
console.log(user.name);     // 'Sarah'
console.log(user.getSSN()); // '123-45-6789'
```

### 210. List down the collection of methods available on WeakMap

Below are the list of methods available on `WeakMap`,

  1. `set(key, value)`: Sets the value for the key in the `WeakMap` object. Returns the `WeakMap` object.
  2. `delete(key)`: Removes any value associated to the key.
  3. `has(key)`: Returns a Boolean asserting whether a value has been associated to the key in the `WeakMap` object or not.
  4. `get(key)`: Returns the value associated to the key, or undefined if there is none.
     Let's see the functionality of all the above methods in an example,

  ```javascript
  var weakMapObject = new WeakMap();
  var firstObject = {};
  var secondObject = {};
  // set(key, value)
  weakMapObject.set(firstObject, "John");
  weakMapObject.set(secondObject, 100);
  console.log(weakMapObject.has(firstObject)); //true
  console.log(weakMapObject.get(firstObject)); // John
  weakMapObject.delete(secondObject);
  ```

### 211. What is the purpose of uneval

The `uneval()` is an builtin function which is used to create a string representation of the source code of an Object. It is a top-level function and is not associated with any object. Let's see the below example to know more about it's functionality,

  ```javascript
  var a = 1;
  uneval(a); // returns a String containing 1
  uneval(function user() {}); // returns "(function user(){})"
  ```

  The `uneval()` function has been deprecated. It is recommended to use `toString()` for functions and `JSON.stringify()` for other cases.

  ```javascript
  function user() {}
  console.log(user.toString()); // returns "(function user(){})"
  ```

### 212. How do you encode an URL

The `encodeURI()` function is used to encode complete URI which has special characters except (, / ? : @ & = + $ #) characters.

  ```javascript
  var uri = "https://mozilla.org/?x=шеллы";
  var encoded = encodeURI(uri);
  console.log(encoded); // https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B
  ```

### 213. How do you decode an URL

The `decodeURI()` function is used to decode a Uniform Resource Identifier (URI) previously created by `encodeURI()`.

  ```javascript
  var uri = "https://mozilla.org/?x=шеллы";
  var encoded = encodeURI(uri);
  console.log(encoded); // https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B
  try {
    console.log(decodeURI(encoded)); // "https://mozilla.org/?x=шеллы"
  } catch (e) {
    // catches a malformed URI
    console.error(e);
  }
  ```

### 214. How do you print the contents of web page

The `window` object provides a `print()` method which is used to print the contents of the current window. It opens a Print dialog box which lets you choose between various printing options. Let's see the usage of print method in an example,

  ```html
  <input type="button" value="Print" onclick="window.print()" />
  ```

  **Note:** In most browsers, it will block while the print dialog is open.

### 215. What is the difference between uneval and eval

The `uneval` function returns the source of a given object; whereas the `eval` function does the opposite, by evaluating that source code in a different memory area. Let's see an example to clarify the difference,

  ```javascript
  var msg = uneval(function greeting() {
    return "Hello, Good morning";
  });
  var greeting = eval(msg);
  greeting(); // returns "Hello, Good morning"
  ```

### 216. What is an anonymous function

An anonymous function is a function without a name! Anonymous functions are commonly assigned to a variable name or used as a callback function. The syntax would be as below,

  ```javascript
  function (optionalParameters) {
    //do something
  }

  const myFunction = function(){ //Anonymous function assigned to a variable
    //do something
  };

  [1, 2, 3].map(function(element){ //Anonymous function used as a callback function
    //do something
  });
  ```

  Let's see the above anonymous function in an example,

  ```javascript
  var x = function (a, b) {
    return a * b;
  };
  var z = x(5, 10);
  console.log(z); // 50
  ```

### 217. What is the precedence order between local and global variables

A local variable takes precedence over a global variable with the same name. Let's see this behavior in an example.

  ```javascript
  var msg = "Good morning";
  function greeting() {
    msg = "Good Evening";
    console.log(msg); // Good Evening
  }
  greeting();
  ```

### 218. What are javascript accessors

ECMAScript 5 introduced javascript object accessors or computed properties through getters and setters. Getters uses the `get` keyword whereas Setters uses the `set` keyword.

  ```javascript
  var user = {
    firstName: "John",
    lastName: "Abraham",
    language: "en",
    get lang() {
      return this.language;
    },
    set lang(lang) {
      this.language = lang;
    },
  };
  console.log(user.lang); // getter access lang as en
  user.lang = "fr";
  console.log(user.lang); // setter used to set lang as fr
  ```

### 219. How do you define property on Object constructor

The `Object.defineProperty()` static method is used to define a new property directly on an object, or modify an existing property on an object, and returns the object. Let's see an example to know how to define property,

  ```javascript
  const newObject = {};

  Object.defineProperty(newObject, "newProperty", {
    value: 100,
    writable: false,
  });

  console.log(newObject.newProperty); // 100

  newObject.newProperty = 200; // It throws an error in strict mode due to writable setting
  ```

### 220. What is the difference between get and defineProperty

Both have similar results unless you use classes. If you use `get` the property will be defined on the prototype of the object whereas using `Object.defineProperty()` the property will be defined on the instance it is applied to.

#### Practical Code Example

```javascript
// 1. Using getter in object literal syntax:
const user = {
  first: 'John',
  last: 'Doe',
  get fullName() { return `${this.first} ${this.last}`; }
};
console.log(user.fullName); // 'John Doe'

// 2. Using Object.defineProperty (allows setting enumerable, configurable):
Object.defineProperty(user, 'greeting', {
  get() { return `Hello, ${this.fullName}`; },
  enumerable: false
});
console.log(user.greeting); // 'Hello, John Doe'
```

### 221. What are the advantages of Getters and Setters

Below are the list of benefits of Getters and Setters,

  1. They provide simpler syntax
  2. They are used for defining computed properties, or accessors in JS.
  3. Useful to provide equivalence relation between properties and methods
  4. They can provide better data quality
  5. Useful for doing things behind the scenes with the encapsulated logic.

#### Practical Code Example

```javascript
// Advantages of Getters & Setters:
// 1. Data Validation: Validate inputs before saving
// 2. Encapsulation: Compute virtual properties on the fly without breaking external API
class BankAccount {
  #balance = 0;

  get balance() { return this.#balance; }
  set balance(amount) {
    if (amount < 0) throw new Error('Balance cannot be negative');
    this.#balance = amount;
  }
}
const acc = new BankAccount();
acc.balance = 100;
console.log(acc.balance); // 100
```

### 222. Can I add getters and setters using defineProperty method

Yes, You can use the `Object.defineProperty()` method to add Getters and Setters. For example, the below counter object uses increment, decrement, add and subtract properties,

  ```javascript
  var obj = { counter: 0 };

  // Define getters
  Object.defineProperty(obj, "increment", {
    get: function () {
      this.counter++;
      return this.counter;
    },
  });
  Object.defineProperty(obj, "decrement", {
    get: function () {
      this.counter--;
      return this.counter;
    },
  });

  // Define setters
  Object.defineProperty(obj, "add", {
    set: function (value) {
      this.counter += value;
    },
  });
  Object.defineProperty(obj, "subtract", {
    set: function (value) {
      this.counter -= value;
    },
  });

  obj.add = 10;
  obj.subtract = 5;
  console.log(obj.increment); //6
  console.log(obj.decrement); //5
  ```

### 223. What is the purpose of switch-case

The `switch case` statement in JavaScript is used for decision making purposes. In a few cases, using the `switch case` statement is going to be more convenient than `if-else` statements. The syntax would be as below,

  ```javascript
  switch (expression)
  {
      case value1:
          statement1;
          break;
      case value2:
          statement2;
          break;
      .
      .
      case valueN:
          statementN;
          break;
      default:
          statementDefault;
  }
  ```

  The above multi-way branch statement provides an easy way to dispatch execution to different parts of code based on the value of the expression.

### 224. What are the conventions to be followed for the usage of switch case

Below are the list of conventions should be taken care,

  1. The expression can be of type either number or string.
  2. Duplicate values are not allowed for the expression.
  3. The default statement is optional. If the expression passed to switch does not match with any case value then the statement within default case will be executed.
  4. The break statement is used inside the switch to terminate a statement sequence.
  5. The break statement is optional. But if it is omitted, the execution will continue on into the next case.

#### Practical Code Example

```javascript
// Best practices for switch-case:
// 1. Always use 'break' or 'return' to prevent accidental fall-through
// 2. Always provide a 'default' fallback
// 3. Use block scoping '{ }' if declaring let/const inside a case
function getHttpStatusDescription(code) {
  switch (code) {
    case 200:
      return 'OK';
    case 404: {
      const msg = 'Not Found';
      return msg;
    }
    default:
      return 'Unknown Status';
  }
}
```

### 225. What are primitive data types

A primitive data type is data that has a primitive value (which has no properties or methods). There are 7 types of primitive data types.

  1. string
  2. number
  3. boolean
  4. null
  5. undefined
  6. bigint
  7. symbol

#### Practical Code Example

```javascript
// 7 Primitive Data Types in JavaScript (stored by value, immutable):
const str = "hello";       // string
const num = 42;            // number
const big = 9007199254740991n; // bigint
const bool = true;         // boolean
const sym = Symbol("id");  // symbol
const und = undefined;     // undefined
const nul = null;          // null
```

### 226. What are the different ways to access object properties

There are 3 possible ways for accessing the property of an object.

  1. **Dot notation:** It uses dot for accessing the properties

  ```javascript
  objectName.property;
  ```

  2. **Square brackets notation:** It uses square brackets for property access

  ```javascript
  objectName["property"];
  ```

  3. **Expression notation:** It uses expression in the square brackets

  ```javascript
  objectName[expression];
  ```

### 227. What are the function parameter rules

JavaScript functions follow below rules for parameters,

  1. The function definitions do not specify data types for parameters.
  2. Do not perform type checking on the passed arguments.
  3. Do not check the number of arguments received.
     i.e, The below function follows the above rules,

  ```javascript
  function functionName(parameter1, parameter2, parameter3) {
    console.log(parameter1); // 1
  }
  functionName(1);
  ```

### 228. What is an error object

An error object is a built in error object that provides error information when an error occurs. It has two properties: name and message. For example, the below function logs error details,

  ```javascript
  try {
    greeting("Welcome");
  } catch (err) {
    console.log(err.name + "<br>" + err.message);
  }
  ```

### 229. When do you get a syntax error

A SyntaxError is thrown if you try to evaluate code with a syntax error. For example, the below missing quote for the function parameter throws a syntax error

  ```javascript
  try {
    eval("greeting('welcome)"); // Missing ' will produce an error
  } catch (err) {
    console.log(err.name);
  }
  ```

### 230. What are the different error names from error object

There are 7 different types of error names returned from error object,
  | Error Name | Description |
  |---- | ---------
  | `AggregateError` | An error indicating that multiple errors occurred |
  | `EvalError` | An error has occurred in the eval() function |
  | `RangeError` | An error has occurred with a number "out of range" |
  | `ReferenceError` | An error due to an illegal reference|
  | `SyntaxError` | An error due to a syntax error|
  | `TypeError` | An error due to a type error |
  | `URIError` | An error due to encodeURI() |

#### Practical Code Example

```javascript
// Core Error Names in JavaScript:
try {
  // null.f();        // TypeError
  // undeclaredVar;   // ReferenceError
  // eval('foo bar'); // SyntaxError
  // decodeURI('%');  // URIError
  // new Array(-1);   // RangeError
} catch (err) {
  console.log(err.name);    // e.g., 'TypeError'
  console.log(err.message); // Explanatory message
}
```

### 231. What are the various statements in error handling

Below are the list of statements used in an error handling,

  1. **try:** This statement is used to test a block of code for errors
  2. **catch:** This statement is used to handle the error
  3. **throw:** This statement is used to create custom errors.
  4. **finally:** This statement is used to execute code after try and catch regardless of the result.

#### Practical Code Example

```javascript
// Error Handling Statements:
try {
  throw new Error('Something went wrong!'); // throw statement
} catch (err) {
  console.error('Caught:', err.message);    // catch statement
} finally {
  console.log('Cleanup always executes');   // finally statement
}
```

### 232. What are the two types of loops in javascript

1. **Entry Controlled loops:** In this kind of loop type, the test condition is tested before entering the loop body. For example, For Loop and While Loop comes under this category.
  2. **Exit Controlled Loops:** In this kind of loop type, the test condition is tested or evaluated at the end of the loop body. i.e, the loop body will execute at least once irrespective of test condition true or false. For example, do-while loop comes under this category.

#### Practical Code Example

```javascript
// 1. Entry-Controlled Loops (condition tested before execution):
let i = 0;
while (i < 2) { console.log('while:', i++); }
for (let j = 0; j < 2; j++) { console.log('for:', j); }

// 2. Exit-Controlled Loops (body executes at least once before condition):
let k = 10;
do {
  console.log('do-while executed at least once:', k);
} while (k < 5);
```

### 233. What is nodejs

Node.js is a server-side platform built on Chrome's JavaScript runtime for easily building fast and scalable network applications. It is an event-based, non-blocking, asynchronous I/O runtime that uses Google's V8 JavaScript engine and libuv library.

#### Practical Code Example

```javascript
// Node.js: Asynchronous event-driven JavaScript runtime built on Chrome's V8 engine:
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ runtime: 'Node.js', status: 'ready' }));
});
// server.listen(3000);
```

### 234. What is the Intl object

The `Intl` object is the namespace for the ECMAScript Internationalization API, which provides language sensitive string comparison, number formatting, and date and time formatting. It provides access to several constructors and language sensitive functions.

#### Practical Code Example

```javascript
// Intl Object: ECMAScript Internationalization API namespace
const date = new Date(Date.UTC(2026, 10, 6, 12, 0, 0));

// Formats dates according to German locale
console.log(new Intl.DateTimeFormat('de-DE').format(date)); // '6.11.2026'

// Formats currencies according to US Dollar
console.log(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1250.5));
// '$1,250.50'
```

### 235. How do you perform language specific date and time formatting

You can use the `Intl.DateTimeFormat` object which is a constructor for objects that enable language-sensitive date and time formatting. Let's see this behavior with an example,

  ```javascript
  var date = new Date(Date.UTC(2019, 07, 07, 3, 0, 0));
  console.log(new Intl.DateTimeFormat("en-GB").format(date)); // 07/08/2019
  console.log(new Intl.DateTimeFormat("en-AU").format(date)); // 07/08/2019
  ```

### 236. What is an Iterator

An iterator is an object which defines a sequence and a return value upon its termination. It implements the Iterator protocol with a `next()` method which returns an object with two properties: `value` (the next value in the sequence) and `done` (which is true if the last value in the sequence has been consumed).

#### Practical Code Example

```javascript
// Iterator Protocol: Object with a next() method returning { value, done }
function makeIterator(array) {
  let nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true };
    }
  };
}
const it = makeIterator(['A', 'B']);
console.log(it.next()); // { value: 'A', done: false }
console.log(it.next()); // { value: 'B', done: false }
console.log(it.next()); // { value: undefined, done: true }
```

### 237. How does synchronous iteration works

Synchronous iteration was introduced in ES6 and it works with below set of components,

  **Iterable:** It is an object which can be iterated over via a method whose key is Symbol.iterator.

  **Iterator:** It is an object returned by invoking `[Symbol.iterator]()` on an iterable. This iterator object wraps each iterated element in an object and returns it via `next()` method one by one.

  **IteratorResult:** It is an object returned by `next()` method. The object contains two properties; the `value` property contains an iterated element and the `done` property determines whether the element is the last element or not.

  Let's demonstrate synchronous iteration with an array as below

  ```javascript
  const iterable = ["one", "two", "three"];
  const iterator = iterable[Symbol.iterator]();
  console.log(iterator.next()); // { value: 'one', done: false }
  console.log(iterator.next()); // { value: 'two', done: false }
  console.log(iterator.next()); // { value: 'three', done: false }
  console.log(iterator.next()); // { value: 'undefined, done: true }
  ```

### 238. What is the event loop

The event loop is a process that continuously monitors both the call stack and the event queue and checks whether or not the call stack is empty. If the call stack is empty and there are pending events in the event queue, the event loop dequeues the event from the event queue and pushes it to the call stack. The call stack executes the event, and any additional events generated during the execution are added to the end of the event queue.

  **Note:** The event loop allows Node.js to perform non-blocking I/O operations, even though JavaScript is single-threaded, by offloading operations to the system kernel whenever possible. Since most modern kernels are multi-threaded, they can handle multiple operations executing in the background.

#### Practical Code Example

```javascript
// The Event Loop continuously checks if Call Stack is empty.
// If empty, it pushes tasks from Microtask Queue first, then Macrotask Queue:
console.log('Call Stack: Script Start');

setTimeout(() => console.log('Macrotask: setTimeout'), 0);
Promise.resolve().then(() => console.log('Microtask: Promise.then'));

console.log('Call Stack: Script End');
// Output Order: Script Start -> Script End -> Promise.then -> setTimeout
```

### 239. What is the call stack

Call Stack is a data structure for javascript interpreters to keep track of function calls(creates execution context) in the program. It has two major actions,

  1. Whenever you call a function for its execution, you are pushing it to the stack.
  2. Whenever the execution is completed, the function is popped out of the stack.

  Let's take an example and it's state representation in a diagram format

  ```javascript
  function hungry() {
    eatFruits();
  }
  function eatFruits() {
    return "I'm eating fruits";
  }

  // Invoke the `hungry` function
  hungry();
  ```

  The above code processed in a call stack as below,

  3. Add the `hungry()` function to the call stack list and execute the code.
  4. Add the `eatFruits()` function to the call stack list and execute the code.
  5. Delete the `eatFruits()` function from our call stack list.
  6. Delete the `hungry()` function from the call stack list since there are no items anymore.

  ![Screenshot](images/call-stack.png)

### 240. What is the event queue

The event queue follows the queue data structure. It stores async callbacks to be added to the call stack. It is also known as the Callback Queue or Macrotask Queue.

  Whenever the call stack receives an async function, it is moved into the Web API. Based on the function, Web API executes it and awaits the result. Once it is finished, it moves the callback into the event queue (the callback of a promise is moved into the microtask queue).

  The event loop constantly checks whether or not the call stack is empty. Once the call stack is empty and there is a callback in the event queue, the event loop moves the callback into the call stack. But if there is a callback in the microtask queue as well, it is moved first. The microtask queue has a higher priority than the event queue.

#### Practical Code Example

```javascript
// Event Queue (Task Queue): Holds messages/callbacks from completed asynchronous APIs
// (such as DOM events, AJAX responses, and timers) waiting to be executed by the Event Loop:
button.addEventListener('click', () => {
  // Pushed to Event Queue when user clicks, dequeued when stack clears
  console.log('Button click callback executed from Event Queue');
});
```

### 241. What is a decorator

A decorator is an expression that evaluates to a function and that takes the target, name, and decorator descriptor as arguments. Also, it optionally returns a decorator descriptor to install on the target object. Let's define admin decorator for user class at design time,

  ```javascript
  function admin(isAdmin) {
     return function(target) {
         target.isAdmin = isAdmin;
     }
  }

  @admin(true)
  class User() {
  }
  console.log(User.isAdmin); //true

   @admin(false)
   class User() {
   }
   console.log(User.isAdmin); //false
  ```

### 242. What are the properties of the Intl object

Below are the list of properties available on the `Intl` object,

  1. **Collator:** These are the objects that enable language-sensitive string comparison.
  2. **DateTimeFormat:** These are the objects that enable language-sensitive date and time formatting.
  3. **ListFormat:** These are the objects that enable language-sensitive list formatting.
  4. **NumberFormat:** Objects that enable language-sensitive number formatting.
  5. **PluralRules:** Objects that enable plural-sensitive formatting and language-specific rules for plurals.
  6. **RelativeTimeFormat:** Objects that enable language-sensitive relative time formatting.

#### Practical Code Example

```javascript
// Key Constructors on the Intl Namespace:
console.log(typeof Intl.Collator);       // String comparison for sorting
console.log(typeof Intl.DateTimeFormat); // Date/Time formatting
console.log(typeof Intl.NumberFormat);   // Currency and percent formatting
console.log(typeof Intl.PluralRules);    // Language-specific plural rules
console.log(typeof Intl.RelativeTimeFormat); // e.g., '3 days ago'
```

### 243. What is an Unary operator

The unary(+) operator is used to convert a variable to a number.If the variable cannot be converted, it will still become a number but with the value NaN. Let's see this behavior in an action.

  ```javascript
  var x = "100";
  var y = +x;
  console.log(typeof x, typeof y); // string, number

  var a = "Hello";
  var b = +a;
  console.log(typeof a, typeof b, b); // string, number, NaN
  ```

### 244. How do you sort elements in an array

The `sort()` method is used to sort the elements of an array in place and returns the sorted array. The default sort order is ascending, based on the string Unicode order. The example usage would be as below,

  ```javascript
  var months = ["Aug", "Sep", "Jan", "June"];
  months.sort();
  console.log(months); //  ["Aug", "Jan", "June", "Sep"]
  ```

  **Beware:** `sort()` is changing the original array.

### 245. What is the purpose of compareFunction while sorting arrays

The compareFunction is used to define the sort order. If omitted, the array elements are converted to strings, then sorted according to each character's Unicode code point value.

  Let's take an example to see the usage of compareFunction,

  ```javascript
  let numbers = [1, 2, 5, 3, 4];
  numbers.sort((a, b) => b - a);
  console.log(numbers); // [5, 4, 3, 2, 1]
  ```

### 246. How do you reverse an array

You can use the `reverse()` method to reverse the elements in an array. This method is useful to sort an array in descending order. Let's see the usage of `reverse()` method in an example,

  ```javascript
  let numbers = [1, 2, 5, 3, 4];
  numbers.sort((a, b) => b - a);
  numbers.reverse();
  console.log(numbers); // [1, 2, 3, 4 ,5]
  ```

### 247. How do you find the min and max values in an array

You can use `Math.min` and `Math.max` methods on array variables to find the minimum and maximum elements within an array. Let's create two functions to find the min and max value with in an array,

  ```javascript
  var marks = [50, 20, 70, 60, 45, 30];
  function findMin(arr) {
    return Math.min.apply(null, arr);
  }
  function findMax(arr) {
    return Math.max.apply(null, arr);
  }

  console.log(findMin(marks));
  console.log(findMax(marks));
  ```

### 248. How do you find the min and max values without Math functions

You can write functions which loop through an array comparing each value with the lowest value or highest value to find the min and max values. Let's create those functions to find min and max values,

  ```javascript
  var marks = [50, 20, 70, 60, 45, 30];
  function findMin(arr) {
    var length = arr.length;
    var min = Infinity;
    while (length--) {
      if (arr[length] < min) {
        min = arr[length];
      }
    }
    return min;
  }

  function findMax(arr) {
    var length = arr.length;
    var max = -Infinity;
    while (length--) {
      if (arr[length] > max) {
        max = arr[length];
      }
    }
    return max;
  }

  console.log(findMin(marks));
  console.log(findMax(marks));
  ```

### 249. What is an empty statement and purpose of it

The empty statement is a semicolon (;) indicating that no statement will be executed, even if JavaScript syntax requires one. Since there is no action with an empty statement you might think that it's usage is quite less, but the empty statement is occasionally useful when you want to create a loop that has an empty body. For example, you can initialize an array with zero values as below,

  ```javascript
  // Initialize an array a
  for (let i = 0; i < a.length; a[i++] = 0);
  ```

### 250. How do you get the metadata of a module

You can use the `import.meta` object which is a meta-property exposing context-specific meta data to a JavaScript module. It contains information about the current module, such as the module's URL. In browsers, you might get different meta data than NodeJS.

  ```javascript
  <script type="module" src="welcome-module.js"></script>;
  console.log(import.meta); // { url: "file:///home/user/welcome-module.js" }
  ```



## Part 5: ES6+ Modern Syntax, Classes, Modules & Destructuring (251 - 325)

### 251. What is the comma operator

The comma operator is used to evaluate each of its operands from left to right and returns the value of the last operand. This is totally different from comma usage within arrays, objects, and function arguments and parameters. For example, the usage for numeric expressions would be as below,

  ```javascript
  var x = 1;
  x = (x++, x);

  console.log(x); // 2
  ```

### 252. What is the advantage of the comma operator

It is normally used to include multiple expressions in a location that requires a single expression. One of the common usages of this comma operator is to supply multiple parameters in a `for` loop. For example, the below for loop uses multiple expressions in a single location using comma operator,

  ```javascript
  for (var a = 0, b =10; a <= 10; a++, b--)
  ```

  You can also use the comma operator in a return statement where it processes before returning.

  ```javascript
  function myFunction() {
    var a = 1;
    return (a += 10), a; // 11
  }
  ```

### 253. What is typescript

TypeScript is a typed superset of JavaScript created by Microsoft that adds optional types, classes
  and many other features, and compiles to plain JavaScript. Angular is built entirely in TypeScript and it is used as the primary language there. You can install it globally as

  ```bash
  npm install -g typescript
  ```

  Let's see a simple example of TypeScript usage,

  ```typescript
  function greeting(name: string): string {
    return "Hello, " + name;
  }

  let user = "Sudheer";

  console.log(greeting(user));
  ```

  The greeting method allows only string type as argument.

### 254. What are the differences between javascript and typescript

Below are the list of differences between javascript and typescript,

  | feature             | typescript                            | javascript                                      |
  | ------------------- | ------------------------------------- | ----------------------------------------------- |
  | Language paradigm   | Object oriented programming language  | Multi-paradigm language                         |
  | Typing support      | Supports static typing                | Dynamic typing                                  |
  | Modules             | Supported                             | Not supported                                   |
  | Interface           | It has interfaces concept             | Doesn't support interfaces                      |
  | Optional parameters | Functions support optional parameters | No support of optional parameters for functions |

#### Practical Code Example

```typescript
// JavaScript (Dynamic, runtime checking):
function calculate(price, tax) {
  return price + tax; // If passed strings, accidentally concatenates!
}

// TypeScript (Static compile-time checking):
interface Order {
  price: number;
  tax: number;
}
function calculateStrict(order: Order): number {
  return order.price + order.tax; // Compile error if invalid types passed
}
```

### 255. What are the advantages of typescript over javascript

Below are some of the advantages of typescript over javascript,

  1. TypeScript is able to find compile time errors at the development time only and it makes sures less runtime errors. Whereas javascript is an interpreted language.
  2. TypeScript is strongly-typed or supports static typing which allows for checking type correctness at compile time. This is not available in javascript.
  3. TypeScript compiler can compile the .ts files into ES3,ES4 and ES5 unlike ES6 features of javascript which may not be supported in some browsers.

#### Practical Code Example

```typescript
// Advantages of TypeScript:
// 1. Compile-time error catch before production
// 2. Rich IDE autocompletion and refactoring tools
// 3. Self-documenting interfaces and types:
type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';
function authorize(role: UserRole) {
  // Autocompletes exact strings, rejects invalid roles!
}
```

### 256. What is an object initializer

An object initializer is an expression that describes the initialization of an Object. The syntax for this expression is represented as a comma-delimited list of zero or more pairs of property names and associated values of an object, enclosed in curly braces ({}). This is also known as literal notation. It is one of the ways to create an object.

  ```javascript
  var initObject = { a: "John", b: 50, c: {} };

  console.log(initObject.a); // John
  ```

### 257. What is a constructor method

The constructor method is a special method for creating and initializing an object created within a class. If you do not specify a constructor method, a default constructor is used. The example usage of constructor would be as below,

  ```javascript
  class Employee {
    constructor() {
      this.name = "John";
    }
  }

  var employeeObject = new Employee();

  console.log(employeeObject.name); // John
  ```

### 258. What happens if you write constructor more than once in a class

The "constructor" in a class is a special method and it should be defined only once in a class. i.e, If you write a constructor method more than once in a class it will throw a `SyntaxError` error.

  ```javascript
   class Employee {
     constructor() {
       this.name = "John";
     }
     constructor() {   //  Uncaught SyntaxError: A class may only have one constructor
       this.age = 30;
     }
   }

   var employeeObject = new Employee();

   console.log(employeeObject.name);
  ```

  This constructor is called by using the special function call `new` (see example above).

### 259. How do you call the constructor of a parent class

You can use the `super` keyword to call the constructor of a parent class. Remember that `super()` must be called before using `this` reference. Otherwise it will cause a reference error. Let's the usage of it,

  ```javascript
  class Square extends Rectangle {
    constructor(length) {
      super(length, length);
      this.name = "Square";
    }

    get area() {
      return this.width * this.height;
    }

    set area(value) {
      this.area = value;
    }
  }
  ```

### 260. How do you get the prototype of an object

You can use the `Object.getPrototypeOf(obj)` method to return the prototype of the specified object. i.e. The value of the internal `prototype` property. If there are no inherited properties then `null` value is returned.

  ```javascript
  const newPrototype = {};
  const newObject = Object.create(newPrototype);

  console.log(Object.getPrototypeOf(newObject) === newPrototype); // true
  ```

### 261. What happens If I pass string type for getPrototype method

In ES5, it will throw a TypeError exception if the obj parameter isn't an object. Whereas in ES2015, the parameter will be coerced to an `Object`.

  ```javascript
  // ES5
  Object.getPrototypeOf("James"); // TypeError: "James" is not an object
  // ES2015
  Object.getPrototypeOf("James"); // String.prototype
  ```

### 262. How do you set the prototype of one object to another

You can use the `Object.setPrototypeOf()` method that sets the prototype (i.e., the internal `Prototype` property) of a specified object to another object or null. For example, if you want to set prototype of a square object to rectangle object would be as follows,

  ```javascript
  Object.setPrototypeOf(Square.prototype, Rectangle.prototype);
  Object.setPrototypeOf({}, null);
  ```

### 263. How do you check whether an object can be extended or not

The `Object.isExtensible()` method is used to determine if an object is extendable or not. i.e, Whether it can have new properties added to it or not.

  ```javascript
  const newObject = {};
  console.log(Object.isExtensible(newObject)); //true
  ```

  **Note:** By default, all the objects are extendable. i.e, The new properties can be added or modified.

### 264. How do you prevent an object from being extend

The `Object.preventExtensions()` method is used to prevent new properties from ever being added to an object. In other words, it prevents future extensions to the object. Let's see the usage of this property,

  ```javascript
  const newObject = {};
  Object.preventExtensions(newObject); // NOT extendable

  try {
    Object.defineProperty(newObject, "newProperty", {
      // Adding new property
      value: 100,
    });
  } catch (e) {
    console.log(e); // TypeError: Cannot define property newProperty, object is not extensible
  }
  ```

### 265. What are the different ways to make an object non-extensible

You can mark an object non-extensible in 3 ways,

  1. `Object.preventExtensions`
  2. `Object.seal`
  3. `Object.freeze`

  ```javascript
  var newObject = {};

  Object.preventExtensions(newObject); // Prevent objects are non-extensible
  Object.isExtensible(newObject); // false

  var sealedObject = Object.seal({}); // Sealed objects are non-extensible
  Object.isExtensible(sealedObject); // false

  var frozenObject = Object.freeze({}); // Frozen objects are non-extensible
  Object.isExtensible(frozenObject); // false
  ```

### 266. How do you define multiple properties on an object

The `Object.defineProperties()` method is used to define new or modify existing properties directly on an object and returning the object. Let's define multiple properties on an empty object,

  ```javascript
  const newObject = {};

  Object.defineProperties(newObject, {
    newProperty1: {
      value: "John",
      writable: true,
    },
    newProperty2: {},
  });
  ```

### 267. What is the MEAN stack

The MEAN (MongoDB, Express, AngularJS, and Node.js) stack is the most popular open-source JavaScript software tech stack available for building dynamic web apps where you can write both the server-side and client-side halves of the web project entirely in JavaScript.

#### Practical Code Example

```javascript
// MEAN Stack Architecture:
// M - MongoDB (NoSQL JSON document database)
// E - Express.js (Node.js web application framework)
// A - Angular (Client-side TypeScript SPA framework)
// N - Node.js (V8 server-side JavaScript execution runtime)
```

### 268. What is obfuscation in javascript

Obfuscation is the deliberate act of creating obfuscated javascript code(i.e, source or machine code) that is difficult for humans to understand. It is something similar to encryption, but a machine can understand the code and execute it.
  Let's see the below function before Obfuscation,

  ```javascript
  function greeting() {
    console.log("Hello, welcome to JS world");
  }
  ```

  And after the code Obfuscation, it would be appeared as below,

  ```javascript
  eval(
    (function (p, a, c, k, e, d) {
      e = function (c) {
        return c;
      };
      if (!"".replace(/^/, String)) {
        while (c--) {
          d[c] = k[c] || c;
        }
        k = [
          function (e) {
            return d[e];
          },
        ];
        e = function () {
          return "\\w+";
        };
        c = 1;
      }
      while (c--) {
        if (k[c]) {
          p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
        }
      }
      return p;
    })(
      "2 1(){0.3('4, 7 6 5 8')}",
      9,
      9,
      "console|greeting|function|log|Hello|JS|to|welcome|world".split("|"),
      0,
      {}
    )
  );
  ```

### 269. Why do you need Obfuscation

Below are the few reasons for Obfuscation,

  1. The Code size will be reduced. So data transfers between server and client will be fast.
  2. It hides the business logic from outside world and protects the code from others
  3. Reverse engineering is highly difficult
  4. The download time will be reduced

#### Practical Code Example

```javascript
// Obfuscation: Transforms source code into difficult-to-understand representations
// protecting proprietary IP against reverse engineering:

// Original:
function login(username, password) { return password === 'secret'; }

// Obfuscated representation:
// function _0x2a(_0x1b,_0x3c){return _0x3c===String.fromCharCode(115,101,99,114,101,116);}
```

### 270. What is Minification

Minification is the process of removing all unnecessary characters(empty spaces are removed) and variables will be renamed without changing it's functionality. It is also a type of obfuscation .

#### Practical Code Example

```javascript
// Minification: Strips whitespace, comments, and shortens variable names:
// Before Minification (120 bytes):
function addNumbers(firstNumber, secondNumber) {
  // Add two numbers
  return firstNumber + secondNumber;
}

// After Minification (32 bytes):
function addNumbers(a,b){return a+b}
```

### 271. What are the advantages of minification

Normally it is recommended to use minification for heavy traffic and intensive requirements of resources. It reduces file sizes with below benefits,

  1. Decreases loading times of a web page
  2. Saves bandwidth usages

#### Practical Code Example

```javascript
// Advantages of Minification:
// 1. Reduced file size (often 40-70% smaller)
// 2. Faster network transmission over HTTP
// 3. Lower memory footprint and faster browser script parsing
```

### 272. What are the differences between obfuscation and Encryption

Below are the main differences between obfuscation and encryption,

  | Feature            | Obfuscation                                     | Encryption                                                              |
  | ------------------ | ----------------------------------------------- | ----------------------------------------------------------------------- |
  | Definition         | Changing the form of any data in any other form | Changing the form of information to an unreadable format by using a key |
  | A key to decode    | It can be decoded without any key               | It is required                                                          |
  | Target data format | It will be converted to a complex form          | Converted into an unreadable format                                     |

#### Practical Code Example

```javascript
// Obfuscation vs Encryption:
// Obfuscation: Code remains valid runnable JavaScript, just hard for humans to read.
// Encryption: Transforms plaintext into unreadable ciphertext that CANNOT run without decryption key:
// const encrypted = AES.encrypt('code', 'key'); // Cannot execute directly!
```

### 273. What are the common tools used for minification

There are many online/offline tools to minify the javascript files,

  1. Google's Closure Compiler
  2. UglifyJS2
  3. jsmin
  4. javascript-minifier.com/
  5. prettydiff.com

#### Practical Code Example

```javascript
// Common JavaScript Minification Tools:
// 1. Terser (Industry standard JS minifier used by Webpack)
// 2. esbuild (Extremely fast Go-based minifier)
// 3. SWC (Rust-based modern compiler & minifier used by Next.js)
// 4. UglifyJS (Legacy predecessor)
```

### 274. How do you perform form validation using javascript

JavaScript can be used to perform HTML form validation. For example, if the form field is empty, the function needs to notify, and return false, to prevent the form being submitted.
  Let's perform user login in an html form,

  ```html
  <form name="myForm" onsubmit="return validateForm()" method="post">
    User name:
    <input type="text" name="uname" />
    <input type="submit" value="Submit" />
  </form>
  ```

  And the validation on user login is below,

  ```javascript
  function validateForm() {
    var x = document.forms["myForm"]["uname"].value;
    if (x == "") {
      alert("The username shouldn't be empty");
      return false;
    }
  }
  ```

### 275. How do you perform form validation without javascript

You can perform HTML form validation automatically without using javascript. The validation enabled by applying the `required` attribute to prevent form submission when the input is empty.

  ```html
  <form method="post">
    <input type="text" name="uname" required />
    <input type="submit" value="Submit" />
  </form>
  ```

  **Note:** Automatic form validation does not work in Internet Explorer 9 or earlier.

### 276. What are the DOM methods available for constraint validation

The below DOM methods are available for constraint validation on an invalid input,

  1. `checkValidity()`: It returns true if an input element contains valid data.
  2. `setCustomValidity()`: It is used to set the `validationMessage` property of an input element.
     Let's take an user login form with DOM validations

  ```javascript
  function myFunction() {
    var userName = document.getElementById("uname");
    if (!userName.checkValidity()) {
      document.getElementById("message").innerHTML =
        userName.validationMessage;
    } else {
      document.getElementById("message").innerHTML =
        "Entered a valid username";
    }
  }
  ```

### 277. What are the available constraint validation DOM properties

Below are the list of some of the constraint validation DOM properties available,

  1. `validity`: It provides a list of boolean properties related to the validity of an input element.
  2. `validationMessage`: It displays the message when the validity is false.
  3. `willValidate`: It indicates if an input element will be validated or not.

#### Practical Code Example

```javascript
// HTML5 Constraint Validation DOM Properties on form inputs:
const input = document.getElementById('userEmail');

console.log(input.validity);         // ValidityState object
console.log(input.validationMessage);// Browser error message string
console.log(input.willValidate);     // Boolean whether element participates in validation
```

### 278. What are the validity properties

The validity property of an input element provides a set of properties related to the validity of data.

  1. `customError`: It returns true, if a custom validity message is set.
  2. `patternMismatch`: It returns true, if an element's value does not match its pattern attribute.
  3. `rangeOverflow`: It returns true, if an element's value is greater than its max attribute.
  4. `rangeUnderflow`: It returns true, if an element's value is less than its min attribute.
  5. `stepMismatch`: It returns true, if an element's value is invalid according to step attribute.
  6. `tooLong`: It returns true, if an element's value exceeds its maxLength attribute.
  7. `typeMismatch`: It returns true, if an element's value is invalid according to type attribute.
  8. `valueMissing`: It returns true, if an element with a required attribute has no value.
  9. `valid`: It returns true, if an element's value is valid.

#### Practical Code Example

```javascript
// ValidityState Properties:
const val = input.validity;
console.log(val.valueMissing);    // true if 'required' field is empty
console.log(val.typeMismatch);    // true if not a valid email/url
console.log(val.patternMismatch); // true if regex pattern fails
console.log(val.tooLong);         // true if exceeds maxlength
console.log(val.valid);           // true if all constraints pass
```

### 279. Give an example usage of the rangeOverflow property

If an element's value is greater than its max attribute then the `rangeOverflow` property is true. For example, the below form submission throws an error if the value is more than 100,

  ```html
  <input id="age" type="number" max="100" />
  <button onclick="myOverflowFunction()">OK</button>
  ```

  ```javascript
  function myOverflowFunction() {
    if (document.getElementById("age").validity.rangeOverflow) {
      alert("The mentioned age is not allowed");
    }
  }
  ```

### 280. Are enums available in javascript

No, javascript does not natively support enums. But there are different kinds of solutions to simulate them even though they may not provide exact equivalents. For example, you can use freeze or seal on object,

  ```javascript
  var DaysEnum = Object.freeze({"monday":1, "tuesday":2, "wednesday":3, ...})
  ```

### 281. What is an enum

An enum is a type restricting variables to one value from a predefined set of constants. JavaScript has no enums but typescript provides built-in enum support.

  ```javascript
  enum Color {
   RED, GREEN, BLUE
  }
  ```

### 282. How do you list all properties of an object

You can use the `Object.getOwnPropertyNames()` method which returns an array of all properties found directly in a given object. Let's see the usage of this in an example below:

  ```javascript
  const newObject = {
    a: 1,
    b: 2,
    c: 3,
  };

  console.log(Object.getOwnPropertyNames(newObject));
  ["a", "b", "c"];
  ```

### 283. How do you get property descriptors of an object

You can use the `Object.getOwnPropertyDescriptors()` method which returns all own property descriptors of a given object. The example usage of this method is below,

  ```javascript
  const newObject = {
    a: 1,
    b: 2,
    c: 3,
  };
  const descriptorsObject = Object.getOwnPropertyDescriptors(newObject);
  console.log(descriptorsObject.a.writable); //true
  console.log(descriptorsObject.a.configurable); //true
  console.log(descriptorsObject.a.enumerable); //true
  console.log(descriptorsObject.a.value); // 1
  ```

### 284. What are the attributes provided by a property descriptor

A property descriptor is a record which has the following attributes

  1. `value`: The value associated with the property
  2. `writable`: Determines whether the value associated with the property can be changed or not
  3. `configurable`: Returns true if the type of this property descriptor can be changed and if the property can be deleted from the corresponding object.
  4. `enumerable`: Determines whether the property appears during enumeration of the properties on the corresponding object or not.
  5. `set`: A function which serves as a setter for the property
  6. `get`: A function which serves as a getter for the property

#### Practical Code Example

```javascript
// Property Descriptor Attributes:
const descriptor = Object.getOwnPropertyDescriptor({ x: 10 }, 'x');
console.log(descriptor);
// {
//   value: 10,
//   writable: true,      // Can value be changed?
//   enumerable: true,    // Does it appear in for...in / Object.keys()?
//   configurable: true   // Can descriptor be modified or deleted?
// }
```

### 285. How do you extend classes

The `extends` keyword is used in class declarations/expressions to create a class which is a child of another class. It can be used to subclass custom classes as well as built-in objects. The syntax would be as below,

  ```javascript
  class ChildClass extends ParentClass { ... }
  ```

  Let's take an example of Square subclass from Polygon parent class,

  ```javascript
  class Square extends Rectangle {
    constructor(length) {
      super(length, length);
      this.name = "Square";
    }

    get area() {
      return this.width * this.height;
    }

    set area(value) {
      this.area = value;
    }
  }
  ```

### 286. How do I modify the url without reloading the page

The `window.location.href` property will be helpful to modify the url but it reloads the page. HTML5 introduced the `history.pushState()` and `history.replaceState()` methods, which allow you to add and modify history entries, respectively. For example, you can use pushState as below,

  ```javascript
  window.history.pushState("page2", "Title", "/page2.html");
  ```

  This mechanism is used by routing libraries of frameworks like React and Angular in order to simulate the behaviour of a multi-page-website, even though they are only SPA (Single Page Applications).

### 287. How do you check whether or not an array includes a particular value

The `Array#includes()` method is used to determine whether an array includes a particular value among its entries by returning either true or false. Let's see an example to find an element(numeric and string) within an array.

  ```javascript
  var numericArray = [1, 2, 3, 4];
  console.log(numericArray.includes(3)); // true

  var stringArray = ["green", "yellow", "blue"];
  console.log(stringArray.includes("blue")); //true
  ```

### 288. How do you compare scalar arrays

You can use length and every method of arrays to compare two scalars (compared directly using `===`) arrays. The combination of these expressions can give the expected result,

  ```javascript
  const arrayFirst = [1, 2, 3, 4, 5];
  const arraySecond = [1, 2, 3, 4, 5];
  console.log(
    arrayFirst.length === arraySecond.length &&
      arrayFirst.every((value, index) => value === arraySecond[index])
  ); // true
  ```

  If you would like to compare arrays irrespective of order then you should sort them before,

  ```javascript
  const arrayFirst = [2, 3, 1, 4, 5];
  const arraySecond = [1, 2, 3, 4, 5];
  console.log(
    arrayFirst.length === arraySecond.length &&
      arrayFirst
        .sort()
        .every((value, index) => value === arraySecond[index])
  ); //true
  ```

### 289. How to get the value from get parameters

The `new URL()` object accepts the url string and `searchParams` property of this object can be used to access the get parameters.

  ```javascript
  let urlString = "http://www.some-domain.com/about.html?x=1&y=2&z=3"; //window.location.href
  let url = new URL(urlString);
  let parameterZ = url.searchParams.get("z");
  console.log(parameterZ); // 3
  ```

### 290. How do you print numbers with commas as thousand separators

You can use the `Number.prototype.toLocaleString()` method which returns a string with a language-sensitive representation such as thousand separator, currency etc. of this number.

  ```javascript
  function convertToThousandFormat(x) {
    return x.toLocaleString(); // 12,345.679
  }

  console.log(convertToThousandFormat(12345.6789));
  ```

### 291. What is the difference between java and javascript

Both are totally unrelated programming languages and no relation between them. Java is statically typed, compiled, runs on its own VM. Whereas JavaScript is dynamically typed, interpreted, and runs in a browser and nodejs environments. Let's see the major differences in a tabular format,
  | Feature | Java | JavaScript |
  |---- | ---- | -----
  | Typed | It's a strongly typed language | It's a dynamic typed language |
  | Paradigm | Object oriented programming | Prototype based programming |
  | Scoping | Block scoped | Function-scoped, block scoped since ES6 |
  | Concurrency | Thread based | event based |

#### Practical Code Example

```javascript
// Java vs JavaScript differences:
// Java: Statically typed, runs on JVM, multi-threaded concurrency model
// JavaScript: Dynamically typed, runs in browser/Node engine, single-threaded event loop

// JS dynamic typing:
let data = 100;
data = "now a string"; // Valid in JavaScript, illegal in Java
```

### 292. Does JavaScript support namespaces

JavaScript doesn’t support namespaces by default. So if you create any element (function, method, object, variable) then it becomes global and pollutes the global namespace. Let's take an example of defining two functions without any namespace,

  ```javascript
  function func1() {
    console.log("This is a first definition");
  }
  function func1() {
    console.log("This is a second definition");
  }
  func1(); // This is a second definition
  ```

  It always calls the second function definition. In this case, namespaces will solve the name collision problem.

### 293. How do you declare a namespace

Even though JavaScript lacks namespaces, we can use Objects, an IIFE (Immediately Invoked Function Expression) or `let`/`const` to create namespaces.

  1. **Using Object Literal Notation:** Let's wrap variables and functions inside an Object literal which acts as a namespace. After that you can access them using object notation

     ```javascript
     var namespaceOne = {
         function func1() {
             console.log("This is a first definition");
         }
     }
     var namespaceTwo = {
           function func1() {
               console.log("This is a second definition");
           }
       }
     namespaceOne.func1(); // This is a first definition
     namespaceTwo.func1(); // This is a second definition
     ```

  2. **Using IIFE (Immediately invoked function expression):** The outer pair of parentheses of IIFE creates a local scope for all the code inside of it and makes the anonymous function a function expression. Due to that, you can create the same function in two different function expressions to act as a namespace.

     ```javascript
     (function () {
       function fun1() {
         console.log("This is a first definition");
       }
       fun1();
     })();

     (function () {
       function fun1() {
         console.log("This is a second definition");
       }
       fun1();
     })();
     ```

  3. **Using a block and a let/const declaration:** In ECMAScript 6, you can simply use a block and a let declaration to restrict the scope of a variable to a block.

     ```javascript
     {
       let myFunction = function fun1() {
         console.log("This is a first definition");
       };
       myFunction();
     }
     //myFunction(): ReferenceError: myFunction is not defined.

     {
       let myFunction = function fun1() {
         console.log("This is a second definition");
       };
       myFunction();
     }
     //myFunction(): ReferenceError: myFunction is not defined.
     ```

### 294. How do you invoke javascript code in an iframe from the parent page

Initially iFrame needs to be accessed using either `document.getElementBy` or `window.frames`. After that `contentWindow` property of iFrame gives the access for targetFunction

  ```javascript
  document.getElementById("targetFrame").contentWindow.targetFunction();
  window.frames[0].frameElement.contentWindow.targetFunction(); // Accessing iframe this way may not work in latest versions chrome and firefox
  ```

### 295. How do you get the timezone offset of a date object

You can use the `getTimezoneOffset` method of the date object. This method returns the time zone difference, in minutes, from current locale (host system settings) to UTC

  ```javascript
  var offset = new Date().getTimezoneOffset();
  console.log(offset); // -480
  ```

### 296. How do you load CSS and JS files dynamically

You can create both link and script elements in the DOM and append them as child to head tag. Let's create a function to add script and style resources as below,

  ```javascript
  function loadAssets(filename, filetype) {
    if (filetype == "css") {
      // External CSS file
      var fileReference = document.createElement("link");
      fileReference.setAttribute("rel", "stylesheet");
      fileReference.setAttribute("type", "text/css");
      fileReference.setAttribute("href", filename);
    } else if (filetype == "js") {
      // External JavaScript file
      var fileReference = document.createElement("script");
      fileReference.setAttribute("type", "text/javascript");
      fileReference.setAttribute("src", filename);
    }
    if (typeof fileReference != "undefined")
      document.getElementsByTagName("head")[0].appendChild(fileReference);
  }
  ```

### 297. What are the different methods to find HTML elements in DOM

If you want to access any element in an HTML page, you need to start with accessing the document object. Later you can use any of the below methods to find the HTML element,

  1. `document.getElementById(id)`: It finds an element by Id
  2. `document.getElementsByTagName(name)`: It finds an element by tag name (returns an node list)
  3. `document.getElementsByClassName(name)`: It finds an element by class name (returns an node list)
  4. `document.querySelector(cssSelector)`: It finds an element by css selector
  5. `document.querySelectorAll(cssSelector)`: It finds all elements by css selector (returns a node list)

#### Practical Code Example

```javascript
// Methods to find HTML elements in the DOM:
document.getElementById('header');          // Single element by ID
document.getElementsByClassName('nav-item'); // Live HTMLCollection
document.getElementsByTagName('p');          // Live HTMLCollection
document.querySelector('.card > p:first-child'); // First matching CSS selector
document.querySelectorAll('.active-tab');        // Static NodeList of all matches
```

### 298. What is jQuery

jQuery is a popular cross-browser JavaScript library that provides Document Object Model (DOM) traversal, event handling, animations and AJAX interactions by minimizing the discrepancies across browsers. It is widely famous with its philosophy of “Write less, do more”. For example, you can display welcome message on the page load using jQuery as below,

  ```javascript
  $(document).ready(function () {
    // It selects the document and apply the function on page load
    alert("Welcome to jQuery world");
  });
  ```

  **Note:** You can download it from jquery's official site or install it from CDNs, like google.

### 299. What is V8 JavaScript engine

V8 is an open source high-performance JavaScript engine used by the Google Chrome browser, written in C++. It is also being used in the node.js project. It implements ECMAScript and WebAssembly, and runs on Windows 7 or later, macOS 10.12+, and Linux systems that use x64, IA-32, ARM, or MIPS processors.
  **Note:** It can run standalone, or can be embedded into any C++ application.

#### Practical Code Example

```javascript
// Google Chrome V8 Engine Pipeline:
// 1. Parser: Generates Abstract Syntax Tree (AST)
// 2. Ignition: Fast byte-code interpreter
// 3. Sparkplug: Fast baseline compiler
// 4. TurboFan: Optimizing JIT compiler that generates fast native machine instructions
```

### 300. Why do we call javascript as dynamic language

JavaScript is a loosely typed or a dynamic language because variables in JavaScript are not directly associated with any particular value type, and any variable can be assigned/reassigned with values of all types.

  ```javascript
  let age = 50; // age is a number now
  age = "old"; // age is a string now
  age = true; // age is a boolean
  ```

### 301. What is a void operator

The `void` operator evaluates the given expression and then returns `undefined` (i.e, without returning value). The syntax would be as below,

  ```javascript
  void expression;
  void expression;
  ```

  Let's display a message without any redirection or reload

  ```javascript
  <a href="javascript:void(alert('Welcome to JS world'))">
    Click here to see a message
  </a>
  ```

  **Note:** This operator is often used to obtain the undefined primitive value, using `void(0)`. Also it can be used to call asynchronous functions without waiting for the result.

### 302. How to set the cursor to wait

The cursor can be set to wait in JavaScript by using the property `cursor`. Let's perform this behavior on page load using the below function.

  ```javascript
  function myFunction() {
    window.document.body.style.cursor = "wait";
  }
  ```

  and this function invoked on page load

  ```html
  <body onload="myFunction()"></body>
  ```

### 303. How do you create an infinite loop

You can create infinite loops using for and while loops without using any expressions. The for loop construct or syntax is better approach in terms of ESLint and code optimizer tools,

  ```javascript
  for (;;) {}
  while (true) {}
  ```

### 304. Why do you need to avoid with statement

JavaScript's with statement was intended to provide a shorthand for writing recurring accesses to objects. So it can help reduce file size by reducing the need to repeat a lengthy object reference without performance penalty. Let's take an example where it is used to avoid redundancy when accessing an object several times.

  ```javascript
  a.b.c.greeting = "welcome";
  a.b.c.age = 32;
  ```

  Using `with` it turns this into:

  ```javascript
  with (a.b.c) {
    greeting = "welcome";
    age = 32;
  }
  ```

  But this `with` statement creates performance problems since one cannot predict whether an argument will refer to a real variable or to a property inside the with argument.

### 305. What is the output of the following for loops

```javascript
  for (var i = 0; i < 4; i++) {
    // global scope
    setTimeout(() => console.log(i));
  }

  for (let i = 0; i < 4; i++) {
    // block scope
    setTimeout(() => console.log(i));
  }
  ```

  The output of the above for loops is 4 4 4 4 and 0 1 2 3

  **Explanation:** Due to the event queue/loop of javascript, the `setTimeout` callback function is called after the loop has been executed. Since the variable i is declared with the `var` keyword it became a global variable and the value was equal to 4 using iteration when the time `setTimeout` function is invoked. Hence, the output of the second loop is `4 4 4 4`.

  Whereas in the second loop, the variable i is declared as the `let` keyword it becomes a block scoped variable and it holds a new value(0, 1 ,2 3) for each iteration. Hence, the output of the first loop is `0 1 2 3`.

### 306. List down some of the features of ES6

Below are the list of some new features of ES6,

  1. Support for constants or immutable variables
  2. Block-scope support for variables, constants and functions
  3. Arrow functions
  4. Default parameters
  5. Rest and Spread Parameters
  6. Template Literals
  7. Multi-line Strings
  8. Destructuring Assignment
  9. Enhanced Object Literals
  10. Promises
  11. Classes
  12. Modules

#### Practical Code Example

```javascript
// Prominent ES6 (ECMAScript 2015) Features:
const arrow = () => 'Arrow function';
const { a, b } = { a: 1, b: 2 }; // Destructuring
const template = `Value: ${a}`;    // Template Literals
class App {}                     // Classes
const p = new Promise(res => res('ES6')); // Promises
```

### 307. What is ES6

ES6 is the sixth edition of the javascript language and it was released in June 2015. It was initially known as ECMAScript 6 (ES6) and later renamed to ECMAScript 2015. Almost all the modern browsers support ES6 but for the old browsers there are many transpilers, like Babel.js etc.

#### Practical Code Example

```javascript
// ES6 (ECMAScript 2015): The most significant update in JavaScript history:
// Introduced classes, modules, arrow functions, let/const, promises, symbols,
// default parameters, template strings, iterators, and generators.
```

### 308. Can I redeclare let and const variables

No, you cannot redeclare let and const variables. If you do, it throws below error

  ```bash
  Uncaught SyntaxError: Identifier 'someVariable' has already been declared
  ```

  **Explanation:** The variable declaration with `var` keyword refers to a function scope and the variable is treated as if it were declared at the top of the enclosing scope due to hoisting feature. So all the multiple declarations contributing to the same hoisted variable without any error. Let's take an example of re-declaring variables in the same scope for both var and let/const variables.

  ```javascript
  var name = "John";
  function myFunc() {
    var name = "Nick";
    var name = "Abraham"; // Re-assigned in the same function block
    alert(name); // Abraham
  }
  myFunc();
  alert(name); // John
  ```

  The block-scoped multi-declaration throws syntax error,

  ```javascript
  let name = "John";
  function myFunc() {
    let name = "Nick";
    let name = "Abraham"; // Uncaught SyntaxError: Identifier 'name' has already been declared
    alert(name);
  }

  myFunc();
  alert(name);
  ```

### 309. Does the const variable make the value immutable

No, the `const` variable doesn't make the value immutable. But it disallows subsequent assignments(i.e, You can declare with assignment but can't assign another value later)

  ```javascript
  const userList = [];
  userList.push("John"); // Can mutate even though it can't re-assign
  console.log(userList); // ['John']
  ```

### 310. What are default parameters

In ES5, we need to depend on logical OR operators to handle default values of function parameters. Whereas in ES6, Default function parameters feature allows parameters to be initialized with default values if no value or undefined is passed. Let's compare the behavior with an examples,

  ```javascript
  //ES5
  var calculateArea = function (height, width) {
    height = height || 50;
    width = width || 60;

    return width * height;
  };
  console.log(calculateArea()); //300
  ```

  The default parameters makes the initialization more simpler,

  ```javascript
  //ES6
  var calculateArea = function (height = 50, width = 60) {
    return width * height;
  };

  console.log(calculateArea()); //300
  ```

### 311. What are template literals

Template literals or template strings are string literals allowing embedded expressions. These are enclosed by the back-tick (`) character instead of double or single quotes.
  In ES6, this feature enables using dynamic expressions as below,

  ```javascript
  var greeting = `Welcome to JS World, Mr. ${firstName} ${lastName}.`;
  ```

  In ES5, you need break string like below,

  ```javascript
  var greeting = 'Welcome to JS World, Mr. ' + firstName + ' ' + lastName.`
  ```

  **Note:** You can use multi-line strings and string interpolation features with template literals.

### 312. How do you write multi-line strings in template literals

In ES5, you would have to use newline escape characters('\\n') and concatenation symbols(+) in order to get multi-line strings.

  ```javascript
  console.log("This is string sentence 1\n" + "This is string sentence 2");
  ```

  Whereas in ES6, You don't need to mention any newline sequence character,

  ```javascript
  console.log(`This is string sentence
  'This is string sentence 2`);
  ```

### 313. What are nesting templates

The nesting template is a feature supported within template literals syntax to allow inner backticks inside a placeholder ${ } within the template. For example, the below nesting template is used to display the icons based on user permissions whereas outer template checks for platform type,

  ```javascript
  const iconStyles = `icon ${
    isMobilePlatform()
      ? ""
      : `icon-${user.isAuthorized ? "submit" : "disabled"}`
  }`;
  ```

  You can write the above use case without nesting template features as well. However, the nesting template feature is more compact and readable.

  ```javascript
  //Without nesting templates
  const iconStyles = `icon ${
    isMobilePlatform()
      ? ""
      : user.isAuthorized
      ? "icon-submit"
      : "icon-disabled"
  }`;
  ```

### 314. What are tagged templates

Tagged templates are the advanced form of templates in which tags allow you to parse template literals with a function. The tag function accepts the first parameter as an array of strings and remaining parameters as expressions. This function can also return manipulated strings based on parameters. Let's see the usage of this tagged template behavior of an IT professional skill set in an organization,

  ```javascript
  var user1 = "John";
  var skill1 = "JavaScript";
  var experience1 = 15;

  var user2 = "Kane";
  var skill2 = "JavaScript";
  var experience2 = 5;

  function myInfoTag(strings, userExp, experienceExp, skillExp) {
    var str0 = strings[0]; // "Mr/Ms. "
    var str1 = strings[1]; // " is a/an "
    var str2 = strings[2]; // "in"

    var expertiseStr;
    if (experienceExp > 10) {
      expertiseStr = "expert developer";
    } else if (skillExp > 5 && skillExp <= 10) {
      expertiseStr = "senior developer";
    } else {
      expertiseStr = "junior developer";
    }

    return `${str0}${userExp}${str1}${expertiseStr}${str2}${skillExp}`;
  }

  var output1 = myInfoTag`Mr/Ms. ${user1} is a/an ${experience1} in ${skill1}`;
  var output2 = myInfoTag`Mr/Ms. ${user2} is a/an ${experience2} in ${skill2}`;

  console.log(output1); // Mr/Ms. John is a/an expert developer in JavaScript
  console.log(output2); // Mr/Ms. Kane is a/an junior developer in JavaScript
  ```

### 315. What are raw strings

ES6 provides a raw strings feature using the `String.raw()` method which is used to get the raw string form of template strings. This feature allows you to access the raw strings as they were entered, without processing escape sequences. For example, the usage would be as below,

  ```javascript
  var calculationString = String.raw`The sum of numbers is \n${
    1 + 2 + 3 + 4
  }!`;
  console.log(calculationString); // The sum of numbers is \n10!
  ```

  If you don't use raw strings, the newline character sequence will be processed by displaying the output in multiple lines

  ```javascript
  var calculationString = `The sum of numbers is \n${1 + 2 + 3 + 4}!`;
  console.log(calculationString);
  // The sum of numbers is
  // 10!
  ```

  Also, the raw property is available on the first argument to the tag function

  ```javascript
  function tag(strings) {
    console.log(strings.raw[0]);
  }
  ```

### 316. What is destructuring assignment

The destructuring assignment is a JavaScript expression that makes it possible to unpack values from arrays or properties from objects into distinct variables.
  Let's get the month values from an array using destructuring assignment

  ```javascript
  var [one, two, three] = ["JAN", "FEB", "MARCH"];

  console.log(one); // "JAN"
  console.log(two); // "FEB"
  console.log(three); // "MARCH"
  ```

  and you can get user properties of an object using destructuring assignment,

  ```javascript
  var { name, age } = { name: "John", age: 32 };

  console.log(name); // John
  console.log(age); // 32
  ```

### 317. What are default values in destructuring assignment

A variable can be assigned a default value when the value unpacked from the array or object is undefined during destructuring assignment. It helps to avoid setting default values separately for each assignment. Let's take an example for both arrays and object use cases,

  **Arrays destructuring:**

  ```javascript
  var x, y, z;

  [x = 2, y = 4, z = 6] = [10];
  console.log(x); // 10
  console.log(y); // 4
  console.log(z); // 6
  ```

  **Objects destructuring:**

  ```javascript
  var { x = 2, y = 4, z = 6 } = { x: 10 };

  console.log(x); // 10
  console.log(y); // 4
  console.log(z); // 6
  ```

### 318. How do you swap variables in destructuring assignment

If you don't use destructuring assignment, swapping two values requires a temporary variable. Whereas using a destructuring feature, two variable values can be swapped in one destructuring expression. Let's swap two number variables in array destructuring assignment,

  ```javascript
  var x = 10,
    y = 20;

  [x, y] = [y, x];
  console.log(x); // 20
  console.log(y); // 10
  ```

### 319. What are enhanced object literals

Object literals make it easy to quickly create objects with properties inside the curly braces. For example, it provides shorter syntax for common object property definition as below.

  ```javascript
  //ES6
  var x = 10,
    y = 20;
  obj = { x, y };
  console.log(obj); // {x: 10, y:20}
  //ES5
  var x = 10,
    y = 20;
  obj = { x: x, y: y };
  console.log(obj); // {x: 10, y:20}
  ```

### 320. What are dynamic imports

The dynamic imports using `import()` function syntax allows us to load modules on demand by using promises or the async/await syntax. Currently this feature is in [stage4 proposal](https://github.com/tc39/proposal-dynamic-import). The main advantage of dynamic imports is reduction of our bundle's sizes, the size/payload response of our requests and overall improvements in the user experience.
  The syntax of dynamic imports would be as below,

  ```javascript
  import("./Module").then((Module) => Module.method());
  ```

### 321. What are the use cases for dynamic imports

Below are some of the use cases of using dynamic imports over static imports,

  1. Import a module on-demand or conditionally. For example, if you want to load a polyfill on legacy browser

     ```javascript
     if (isLegacyBrowser()) {
         import(···)
         .then(···);
     }
     ```

  2. Compute the module specifier at runtime. For example, you can use it for internationalization.

     ```javascript
     import(`messages_${getLocale()}.js`).then(···);
     ```

  3. Import a module from within a regular script instead a module.

### 322. What are typed arrays

Typed arrays are array-like objects from ECMAScript 6 API for handling binary data. JavaScript provides 12 Typed array types,

  1. Int8Array: An array of 8-bit signed integers
  2. Uint8Array: An array of 8-bit unsigned integers
  3. Uint8ClampedArray: An array of 8-bit unsigned integers clamped to 0-255
  4. Int16Array: An array of 16-bit signed integers
  5. Uint16Array: An array of 16-bit unsigned integers
  6. Int32Array: An array of 32-bit signed integers
  7. Uint32Array: An array of 32-bit unsigned integers
  8. BigInt64Array: An array of 64-bit signed BigInts
  9. BigUint64Array: An array of 64-bit unsigned BigInts
  10. Float16Array: An array of 16-bit floating point numbers
  11. Float32Array: An array of 32-bit floating point numbers
  12. Float64Array: An array of 64-bit floating point numbers

  For example, you can create an array of 8-bit signed integers as below

  ```javascript
  const a = new Int8Array();
  // You can pre-allocate n bytes
  const bytes = 1024;
  const a = new Int8Array(bytes);
  ```

### 323. What are the advantages of module loaders

The module loaders provides the below features,

  1. Dynamic loading
  2. State isolation
  3. Global namespace isolation
  4. Compilation hooks
  5. Nested virtualization

#### Practical Code Example

```javascript
// Advantages of Module Loaders:
// 1. Dependency Resolution: Ensures libraries load in correct order
// 2. Namespace protection: Avoids global pollution
// 3. On-demand dynamic loading:
import('./largeChartLibrary.js').then((chart) => {
  chart.render();
});
```

### 324. What is collation

Collation is used for sorting a set of strings and searching within a set of strings. It is parameterized by locale and aware of Unicode. Let's take comparison and sorting features,

  1. **Comparison:**

  ```javascript
  var list = ["ä", "a", "z"]; // In German,  "ä" sorts with "a" Whereas in Swedish, "ä" sorts after "z"
  var l10nDE = new Intl.Collator("de");
  var l10nSV = new Intl.Collator("sv");
  console.log(l10nDE.compare("ä", "z") === -1); // true
  console.log(l10nSV.compare("ä", "z") === +1); // true
  ```

  2. **Sorting:**

  ```javascript
  var list = ["ä", "a", "z"]; // In German,  "ä" sorts with "a" Whereas in Swedish, "ä" sorts after "z"
  var l10nDE = new Intl.Collator("de");
  var l10nSV = new Intl.Collator("sv");
  console.log(list.sort(l10nDE.compare)); // [ "a", "ä", "z" ]
  console.log(list.sort(l10nSV.compare)); // [ "a", "z", "ä" ]
  ```

### 325. What is for...of statement

The for...of statement creates a loop iterating over iterable objects or elements such as built-in String, Array, Array-like objects (like arguments or NodeList), TypedArray, Map, Set, and user-defined iterables. The basic usage of for...of statement on arrays would be as below,

  ```javascript
  let arrayIterable = [10, 20, 30, 40, 50];

  for (let value of arrayIterable) {
    value++;
    console.log(value); // 11 21 31 41 51
  }
  ```



## Part 6: Async Internals, Memory, Microtasks & Web APIs (326 - 400)

### 326. What is the output of below spread operator array

```javascript
  [..."John Resig"];
  ```

  The output of the array is ['J', 'o', 'h', 'n', ' ', 'R', 'e', 's', 'i', 'g']

  **Explanation:** The string is an iterable type and the spread operator within an array maps every character of an iterable to one element. Hence, each character of a string becomes an element within an Array.

### 327. Is PostMessage secure

Yes, postMessages can be considered very secure as long as the programmer/developer is careful about checking the origin and source of an arriving message. But if you try to send/receive a message without verifying its source will create cross-site scripting attacks.

#### Practical Code Example

```javascript
// PostMessage is only secure if you explicitly validate event.origin:
// Vulnerable:
// window.addEventListener('message', e => eval(e.data));

// Secure:
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://trusted-domain.com') return; // Enforce origin check!
  console.log('Secure data:', event.data);
});
```

### 328. What are the problems with postmessage target origin as wildcard

The second argument of postMessage method specifies which origin is allowed to receive the message. If you use the wildcard “\*” as an argument then any origin is allowed to receive the message. In this case, there is no way for the sender window to know if the target window is at the target origin when sending the message. If the target window has been navigated to another origin, the other origin would receive the data. Hence, this may lead to XSS vulnerabilities.

  ```javascript
  targetWindow.postMessage(message, "*");
  ```

### 329. How do you avoid receiving postMessages from attackers

Since the listener listens for any message, an attacker can trick the application by sending a message from the attacker’s origin, which gives an impression that the receiver received the message from the actual sender’s window. You can avoid this issue by validating the origin of the message on the receiver's end using the “message.origin” attribute.

  For example, let's check the sender's origin [http://www.some-sender.com](http://www.some-sender.com) on receiver side [www.some-receiver.com](www.some-receiver.com),

  ```javascript
  //Listener on http://www.some-receiver.com/
  window.addEventListener("message", function(message){
      if(/^http://www\.some-sender\.com$/.test(message.origin)){
           console.log('You received the data from valid sender', message.data);
     }
  });
  ```

### 330. Can I avoid using postMessages completely

You cannot avoid using postMessages completely(or 100%). Even though your application doesn’t use postMessage considering the risks, a lot of third party scripts use postMessage to communicate with the third party service. So your application might be using postMessage without your knowledge.

#### Practical Code Example

```javascript
// Can you avoid postMessage?
// If communicating cross-origin between tabs/iframes, postMessage is the ONLY secure browser mechanism.
// For same-origin communication, you can use BroadcastChannel or Web Locks API:
const channel = new BroadcastChannel('app_updates');
channel.postMessage({ status: 'user_logged_in' });
```

### 331. Is postMessages synchronous

The postMessages are synchronous in IE8 browser but they are asynchronous in IE9 and all other modern browsers (i.e, IE9+, Firefox, Chrome, Safari).Due to this asynchronous behaviour, we use a callback mechanism when the postMessage is returned.

#### Practical Code Example

```javascript
// Is postMessage synchronous?
// NO. postMessage is asynchronous. The message is queued and delivered via the browser event loop:
console.log('1. Before postMessage');
window.postMessage('hello', '*');
console.log('2. After postMessage');
// Listener will execute in the next tick of the event loop!
```

### 332. What paradigm is Javascript

JavaScript is a multi-paradigm language, supporting imperative/procedural programming, Object-Oriented Programming and functional programming. JavaScript supports Object-Oriented Programming with prototypical inheritance.

#### Practical Code Example

```javascript
// JavaScript is a Multi-Paradigm Language:
// 1. Prototype-based Object-Oriented Programming (OOP)
class User { constructor(name) { this.name = name; } }

// 2. Functional Programming (First-class functions, pure functions, immutability)
const double = x => x * 2;
[1, 2, 3].map(double);

// 3. Event-Driven Asynchronous Programming
setTimeout(() => console.log('Event driven'), 100);
```

### 333. What is the difference between internal and external javascript

**Internal JavaScript:** It is the source code within the script tag.
  **External JavaScript:** The source code is stored in an external file(stored with .js extension) and referred with in the tag.

#### Practical Code Example

```javascript
// 1. Internal JavaScript (inlined directly within <script> tags in HTML document)
// <script>console.log('Internal script');</script>

// 2. External JavaScript (loaded from external .js file)
// <script src="/js/main.js" defer></script>
// Advantage of external: Browser caches file across page loads!
```

### 334. Is JavaScript faster than server side script

Yes, JavaScript is faster than server side scripts. Because JavaScript is a client-side script it does not require any web server’s help for its computation or calculation. So JavaScript is always faster than any server-side script like ASP, PHP, etc.

#### Practical Code Example

```javascript
// JavaScript client-side execution is faster for UI rendering and validation
// because it runs locally on the user's device without a network round-trip:
function validateEmailInstant(email) {
  return email.includes('@'); // Runs in < 1ms on client without server latency
}
```

### 335. How do you get the status of a checkbox

You can apply the `checked` property on the selected checkbox in the DOM. If the value is `true` it means the checkbox is checked, otherwise it is unchecked. For example, the below HTML checkbox element can be access using javascript as below:

  ```html
  <input type="checkbox" id="checkboxname" value="Agree" />
  Agree the conditions
  <br />
  ```

  ```javascript
  console.log(document.getElementById(‘checkboxname’).checked); // true or false
  ```

### 336. What is the purpose of double tilde operator

The double tilde operator(~~) is known as double NOT bitwise operator. This operator is a slightly quicker substitute for Math.floor().

#### Practical Code Example

```javascript
// Double Tilde (~~) Operator: Fast bitwise shortcut for Math.trunc():
console.log(~~4.9);   // 4
console.log(~~-4.9);  // -4
console.log(~~"42");  // 42 (also coerces numeric strings)
```

### 337. How do you convert character to ASCII code

You can use the `String.prototype.charCodeAt()` method to convert string characters to ASCII numbers. For example, let's find ASCII code for the first letter of 'ABC' string,

  ```javascript
  "ABC".charCodeAt(0); // returns 65
  ```

  Whereas `String.fromCharCode()` method converts numbers to equal ASCII characters.

  ```javascript
  String.fromCharCode(65, 66, 67); // returns 'ABC'
  ```

### 338. What is ArrayBuffer

An ArrayBuffer object is used to represent a generic, fixed-length raw binary data buffer. You can create it as below,

  ```javascript
  let buffer = new ArrayBuffer(16); // create a buffer of length 16
  alert(buffer.byteLength); // 16
  ```

  To manipulate an ArrayBuffer, we need to use a “view” object.

  ```javascript
  //Create a DataView referring to the buffer
  let view = new DataView(buffer);
  ```

### 339. What is the output of below string expression

```javascript
  console.log("Welcome to JS world"[0]);
  ```

  The output of the above expression is "W".
  **Explanation:** The bracket notation with specific index on a string returns the character at a specific location. Hence, it returns the character "W" of the string. Since this is not supported in IE7 and below versions, you may need to use the .charAt() method to get the desired result.

### 340. What is the purpose of Error object

The Error constructor creates an error object and the instances of error objects are thrown when runtime errors occur. The Error object can also be used as a base object for user-defined exceptions. The syntax of error object would be as below,

  ```javascript
  new Error([message[, fileName[, lineNumber]]])
  ```

  You can throw user defined exceptions or errors using Error object in try...catch block as below,

  ```javascript
  try {
    if (withdraw > balance)
      throw new Error("Oops! You don't have enough balance");
  } catch (e) {
    console.log(e.name + ": " + e.message);
  }
  ```

### 341. What is the purpose of EvalError object

The EvalError object indicates an error regarding the global `eval()` function. Even though this exception is not thrown by JavaScript anymore, the EvalError object remains for compatibility. The syntax of this expression would be as below,

  ```javascript
  new EvalError([message[, fileName[, lineNumber]]])
  ```

  You can throw EvalError with in try...catch block as below,

  ```javascript
  try {
    throw new EvalError('Eval function error', 'someFile.js', 100);
  } catch (e) {
    console.log(e.message, e.name, e.fileName);              // "Eval function error", "EvalError", "someFile.js"
  ```

### 342. What are the list of cases error thrown from non-strict mode to strict mode

When you apply 'use strict'; syntax, some of the below cases will throw a SyntaxError before executing the script

  1. When you use Octal syntax

  ```javascript
  var n = 022;
  ```

  2. Using `with` statement
  3. When you use delete operator on a variable name
  4. Using eval or arguments as variable or function argument name
  5. When you use newly reserved keywords
  6. When you declare a function in a block and access it from outside of the block

  ```javascript
  if (someCondition) {
    function f() {}
  }
  f(); // ReferenceError: f is not defined
  ```

  Hence, the errors from above cases are helpful to avoid errors in development/production environments.

### 343. Do all objects have prototypes

No. All objects have prototypes except two exceptions:
  *  **Object.prototype** itself — This is the base object in the prototype chain, and **its prototype is** `null`.
  *   **Objects created with** `**Object.create(null)**` — These are deliberately created with **no prototype**, so they don’t inherit from `Object.prototype`.

  All other standard objects do have a prototype.

#### Practical Code Example

```javascript
// Do ALL objects have prototypes?
// NO! Objects created with Object.create(null) have NO prototype:
const normalObj = {};
console.log(Object.getPrototypeOf(normalObj) === Object.prototype); // true

const bareObj = Object.create(null);
console.log(Object.getPrototypeOf(bareObj)); // null (No toString, valueOf, etc.)
```

### 344. What is the difference between a parameter and an argument

Parameter is the variable name of a function definition whereas an argument represents the value given to a function when it is invoked. Let's explain this with a simple function

  ```javascript
  function myFunction(parameter1, parameter2, parameter3) {
    console.log(arguments[0]); // "argument1"
    console.log(arguments[1]); // "argument2"
    console.log(arguments[2]); // "argument3"
  }
  myFunction("argument1", "argument2", "argument3");
  ```

### 345. What is the purpose of some method in arrays

The some() method is used to test whether at least one element in the array passes the test implemented by the provided function. The method returns a boolean value. Let's take an example to test for any odd elements,

  ```javascript
  var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  var odd = (element) => element % 2 !== 0;

  console.log(array.some(odd)); // true (the odd element exists)
  ```

### 346. How do you combine two or more arrays

The concat() method is used to join two or more arrays by returning a new array containing all the elements. The syntax would be as below,

  ```javascript
  array1.concat(array2, array3, ..., arrayX)
  ```

  Let's take an example of array's concatenation with veggies and fruits arrays,

  ```javascript
  var veggies = ["Tomato", "Carrot", "Cabbage"];
  var fruits = ["Apple", "Orange", "Pears"];
  var veggiesAndFruits = veggies.concat(fruits);
  console.log(veggiesAndFruits); // Tomato, Carrot, Cabbage, Apple, Orange, Pears
  ```

### 347. What is the difference between Shallow and Deep copy

There are two ways to copy an object,

  **Shallow Copy:**
  Shallow copy is a bitwise copy of an object. A new object is created that has an exact copy of the values in the original object. If any of the fields of the object are references to other objects, just the reference addresses are copied i.e., only the memory address is copied.

  **Example**

  ```javascript
  var empDetails = {
    name: "John",
    age: 25,
    expertise: "Software Developer",
  };
  ```

  to create a duplicate

  ```javascript
  var empDetailsShallowCopy = empDetails; //Shallow copying!
  ```

  if we change some property value in the duplicate one like this:

  ```javascript
  empDetailsShallowCopy.name = "Johnson";
  ```

  The above statement will also change the name of `empDetails`, since we have a shallow copy. That means we're losing the original data as well.

  **Deep copy:**
  A deep copy copies all fields, and makes copies of dynamically allocated memory pointed to by the fields. A deep copy occurs when an object is copied along with the objects to which it refers.

  **Example**

  ```javascript
  var empDetails = {
    name: "John",
    age: 25,
    expertise: "Software Developer",
  };
  ```

  Create a deep copy by using the properties from the original object into new variable

  ```javascript
  var empDetailsDeepCopy = {
    name: empDetails.name,
    age: empDetails.age,
    expertise: empDetails.expertise,
  };
  ```

  Now if you change `empDetailsDeepCopy.name`, it will only affect `empDetailsDeepCopy` & not `empDetails`

### 348. How do you create specific number of copies of a string

The `repeat()` method is used to construct and return a new string which contains the specified number of copies of the string on which it was called, concatenated together. Remember that this method has been added to the ECMAScript 2015 specification.
  Let's take an example of Hello string to repeat it 4 times,

  ```javascript
  "Hello".repeat(4); // 'HelloHelloHelloHello'
  ```

### 349. How do you return all matching strings against a regular expression

The `matchAll()` method can be used to return an iterator of all results matching a string against a regular expression. For example, the below example returns an array of matching string results against a regular expression,

  ```javascript
  let regexp = /Hello(\d?)/g;
  let greeting = "Hello1Hello2Hello3";

  let greetingList = [...greeting.matchAll(regexp)];

  console.log(greetingList[0][0]); //Hello1
  console.log(greetingList[1][0]); //Hello2
  console.log(greetingList[2][0]); //Hello3
  ```

### 350. How do you trim a string at the beginning or ending

The `trim` method of string prototype is used to trim on both sides of a string. But if you want to trim especially at the beginning or ending of the string then you can use `trimStart/trimLeft` and `trimEnd/trimRight` methods. Let's see an example of these methods on a greeting message,

  ```javascript
  var greeting = "   Hello, Goodmorning!   ";

  console.log(greeting); // "   Hello, Goodmorning!   "
  console.log(greeting.trimStart()); // "Hello, Goodmorning!   "
  console.log(greeting.trimLeft()); // "Hello, Goodmorning!   "

  console.log(greeting.trimEnd()); // "   Hello, Goodmorning!"
  console.log(greeting.trimRight()); // "   Hello, Goodmorning!"
  ```

### 351. What is the output of below console statement with unary operator

Let's take console statement with unary operator as given below,

  ```javascript
  console.log(+"Hello"); // NaN
  ```

  The output of the above console log statement returns NaN. Because the element is prefixed by the unary operator and the JavaScript interpreter will try to convert that element into a number type. Since the conversion fails, the value of the statement results in NaN value.

### 352. Does javascript uses mixins

JavaScript does not have built-in support for mixins as a formal language feature. However, developers commonly implement mixins using various patterns to enable code reuse and composition.

  A mixin is a way to add reusable functionality from one or more objects into a class or another object, without using classical inheritance. It promotes object composition by combining behaviors or properties from different sources into a single destination.

#### Practical Code Example

```javascript
// JavaScript uses Mixins via Object composition:
const sayHiMixin = {
  sayHi() { console.log(`Hi ${this.name}`); }
};

class User {
  constructor(name) { this.name = name; }
}

Object.assign(User.prototype, sayHiMixin); // Mix in functionality
new User('Alex').sayHi(); // 'Hi Alex'
```

### 353. Mixin Example using Object composition

```javascript
  // Define a mixin
  const canEat = {
    eat() {
      console.log("Eating...");
    }
  };

  const canWalk = {
    walk() {
      console.log("Walking...");
    }
  };

  const canRead = {
    read() {
      console.log("Reading...");
    }
  };

  // Create a class
  class Person {
    constructor(name) {
      this.name = name;
    }
  }

  // Apply mixins
  Object.assign(Person.prototype, canEat, canWalk, canRead);

  // Use it
  const person = new Person("Sudheer");
  person.eat();  // Output: Eating...
  person.walk(); // Output: Walking...
  person.read(); // Output: Reading...
  ```

### 354. Benefits

- Avoids deep inheritance hierarchies
  - Encourages composition over inheritance
  - Promotes reusable and modular code

  Modern JavaScript favors mixin alternatives like composition, delegation, higher-order functions, and class mixins to promote reusable and modular code. Libraries like Lodash offer utilities for object composition, while frameworks like Vue.js provide built-in mixin features to promote reusable and modular code.

#### Practical Code Example

```javascript
// Benefits of Mixins:
// 1. Avoids rigid single-inheritance class hierarchies
// 2. Promotes reusable, modular behaviors across unrelated classes
const loggable = { log() { console.log('Logged state:', this); } };
Object.assign(User.prototype, loggable);
```

### 355. What is a thunk function

A thunk is just a function which delays the evaluation of the value. It doesn’t take any arguments but gives the value whenever you invoke the thunk. i.e, It is used not to execute now but it will be sometime in the future. Let's take a synchronous example,

  ```javascript
  const add = (x, y) => x + y;

  const thunk = () => add(2, 3);

  thunk(); // 5
  ```

### 356. What are asynchronous thunks

The asynchronous thunks are useful to make network requests. Let's see an example of network requests,

  ```javascript
  function fetchData(fn) {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => fn(json));
  }

  const asyncThunk = function () {
    return fetchData(function getData(data) {
      console.log(data);
    });
  };

  asyncThunk();
  ```

  The `getData` function won't be called immediately but it will be invoked only when the data is available from API endpoint. The setTimeout function is also used to make our code asynchronous. The best real time example is redux state management library which uses the asynchronous thunks to delay the actions to dispatch.

### 357. What is the output of below function calls

**Code snippet:**

  ```javascript
  const circle = {
    radius: 20,
    diameter() {
      return this.radius * 2;
    },
    perimeter: () => 2 * Math.PI * this?.radius,
  };
  ```

  ```javascript
  console.log(circle.diameter());
  console.log(circle.perimeter());
  ```

  **Output:**

  The output is 40 and NaN. Remember that diameter is a regular function, whereas the value of perimeter is an arrow function. The `this` keyword of a regular function(i.e, diameter) refers to the surrounding scope which is a class(i.e, Shape object). Whereas this keyword of perimeter function refers to the surrounding scope which is a window object. Since there is no radius property on window objects it returns an undefined value and the multiple of number value returns NaN value.

### 358. How to remove all line breaks from a string

The easiest approach is using regular expressions to detect and replace newlines in the string. In this case, we use replace function along with string to replace with, which in our case is an empty string.

  ```javascript
  function remove_linebreaks( var message ) {
      return message.replace( /[\r\n]+/gm, "" );
  }
  ```

  In the above expression, g and m are for global and multiline flags.

### 359. What is the difference between reflow and repaint

A _repaint_ occurs when changes are made which affect the visibility of an element, but not its layout. Examples of this include outline, visibility, or background color. A _reflow_ involves changes that affect the layout of a portion of the page (or the whole page). Resizing the browser window, changing the font, content changing (such as user typing text), using JavaScript methods involving computed styles, adding or removing elements from the DOM, and changing an element's classes are a few of the things that can trigger reflow. Reflow of an element causes the subsequent reflow of all child and ancestor elements as well as any elements following it in the DOM.

#### Practical Code Example

```javascript
// Reflow vs Repaint:
// 1. Reflow (Layout recalculation): Changes to geometry (width, height, display)
element.style.width = '200px'; // Triggers Reflow + Repaint (expensive!)

// 2. Repaint: Visual changes that do not affect layout geometry (color, background)
element.style.color = 'blue';  // Triggers Repaint only (faster)
```

### 360. What happens with negating an array

Negating an array with `!` character will coerce the array into a boolean. Since Arrays are considered to be truthy So negating it will return `false`.

  ```javascript
  console.log(![]); // false
  ```

### 361. What happens if we add two arrays

If you add two arrays together, it will convert them both to strings and concatenate them. For example, the result of adding arrays would be as below,

  ```javascript
  console.log(["a"] + ["b"]); // "ab"
  console.log([] + []); // ""
  console.log(![] + []); // "false", because ![] returns false.
  ```

### 362. What is the output of prepend additive operator on falsy values

If you prepend the additive(+) operator on falsy values(null, undefined, NaN, false, ""), the falsy value converts to a number value zero. Let's display them on browser console as below,

  ```javascript
  console.log(+null); // 0
  console.log(+undefined); // NaN
  console.log(+false); // 0
  console.log(+NaN); // NaN
  console.log(+""); // 0
  ```

### 363. How do you create self string using special characters

The self string can be formed with the combination of `[]()!+` characters. You need to remember the below conventions to achieve this pattern.

  1. Since Arrays are truthful values, negating the arrays will produce false: ![] === false
  2. As per JavaScript coercion rules, the addition of arrays together will toString them: [] + [] === ""
  3. Prepend an array with + operator will convert an array to false, the negation will make it true and finally converting the result will produce value '1': +(!(+[])) === 1

  By applying the above rules, we can derive below conditions

  ```javascript
  (![] + [] === "false" + !+[]) === 1;
  ```

  Now the character pattern would be created as below,

  ```javascript
        s               e               l               f
   ^^^^^^^^^^^^^   ^^^^^^^^^^^^^   ^^^^^^^^^^^^^   ^^^^^^^^^^^^^

   (![] + [])[3] + (![] + [])[4] + (![] + [])[2] + (![] + [])[0]
   ^^^^^^^^^^^^^   ^^^^^^^^^^^^^   ^^^^^^^^^^^^^   ^^^^^^^^^^^^^
  (![] + [])[+!+[]+!+[]+!+[]] +
  (![] + [])[+!+[]+!+[]+!+[]+!+[]] +
  (![] + [])[+!+[]+!+[]] +
  (![] + [])[+[]]
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  (![]+[])[+!+[]+!+[]+!+[]]+(![]+[])[+!+[]+!+[]+!+[]+!+[]]+(![]+[])[+!+[]+!+[]]+(![]+[])[+[]]
  ```

### 364. How do you remove falsy values from an array

You can apply the filter method on the array by passing Boolean as a parameter. This way it removes all falsy values(0, undefined, null, false and "") from the array.

  ```javascript
  const myArray = [false, null, 1, 5, undefined];
  myArray.filter(Boolean); // [1, 5] // is same as myArray.filter(x => x);
  ```

### 365. How do you get unique values of an array

You can get unique values of an array with the combination of `Set` and rest expression/spread(...) syntax.

  ```javascript
  console.log([...new Set([1, 2, 4, 4, 3])]); // [1, 2, 4, 3]
  ```

### 366. What is destructuring aliases

Sometimes you would like to have a destructured variable with a different name than the property name. In that case, you'll use a `: newName` to specify a name for the variable. This process is called destructuring aliases.

  ```javascript
  const obj = { x: 1 };
  // Grabs obj.x as { otherName }
  const { x: otherName } = obj;
  ```

### 367. How do you map the array values without using map method

You can map the array values without using the `map` method by just using the `from` method of Array. Let's map city names from Countries array,

  ```javascript
  const countries = [
    { name: "India", capital: "Delhi" },
    { name: "US", capital: "Washington" },
    { name: "Russia", capital: "Moscow" },
    { name: "Singapore", capital: "Singapore" },
    { name: "China", capital: "Beijing" },
    { name: "France", capital: "Paris" },
  ];

  const cityNames = Array.from(countries, ({ capital }) => capital);
  console.log(cityNames); // ['Delhi, 'Washington', 'Moscow', 'Singapore', 'Beijing', 'Paris']
  ```

### 368. How do you empty an array

You can empty an array quickly by setting the array length to zero.

  ```javascript
  let cities = ["Singapore", "Delhi", "London"];
  cities.length = 0; // cities becomes []
  ```

### 369. How do you round numbers to certain decimals

You can round numbers to a certain number of decimals using `toFixed` method from native javascript.

  ```javascript
  let pie = 3.141592653;
  pie = pie.toFixed(3); // 3.142
  ```

### 370. What is the easiest way to convert an array to an object

You can convert an array to an object with the same data using spread(...) operator.

  ```javascript
  var fruits = ["banana", "apple", "orange", "watermelon"];
  var fruitsObject = { ...fruits };
  console.log(fruitsObject); // {0: "banana", 1: "apple", 2: "orange", 3: "watermelon"}
  ```

### 371. How do you create an array with some data

You can create an array with some data or an array with the same values using `fill` method.

  ```javascript
  var newArray = new Array(5).fill("0");
  console.log(newArray); // ["0", "0", "0", "0", "0"]
  ```

### 372. What are the placeholders from console object

Below are the list of placeholders available from console object,

  1. %o — It takes an object,
  2. %s — It takes a string,
  3. %d — It is used for a decimal or integer
     These placeholders can be represented in the console.log as below

  ```javascript
  const user = { name: "John", id: 1, city: "Delhi" };
  console.log(
    "Hello %s, your details %o are available in the object form",
    "John",
    user
  ); // Hello John, your details {name: "John", id: 1, city: "Delhi"} are available in object
  ```

### 373. Is it possible to add CSS to console messages

Yes, you can apply CSS styles to console messages similar to html text on the web page.

  ```javascript
  console.log(
    "%c The text has blue color, with large font and red background",
    "color: blue; font-size: x-large; background: red"
  );
  ```

  The text will be displayed as below,
  ![Screenshot](images/console-css.png)

  **Note:** All CSS styles can be applied to console messages.

### 374. What is the purpose of dir method of console object

The `console.dir()` is used to display an interactive list of the properties of the specified JavaScript object as JSON.

  ```javascript
  const user = { name: "John", id: 1, city: "Delhi" };
  console.dir(user);
  ```

  The user object displayed in JSON representation
  ![Screenshot](images/console-dir.png)

### 375. Is it possible to debug HTML elements in console

Yes, it is possible to get and debug HTML elements in the console just like inspecting elements.

  ```javascript
  const element = document.getElementsByTagName("body")[0];
  console.log(element);
  ```

  It prints the HTML element in the console,

  ![Screenshot](images/console-html.png)

### 376. How do you display data in a tabular format using console object

The `console.table()` is used to display data in the console in a tabular format to visualize complex arrays or objects.

  ```js
  const users = [
    { name: "John", id: 1, city: "Delhi" },
    { name: "Max", id: 2, city: "London" },
    { name: "Rod", id: 3, city: "Paris" },
  ];
  console.table(users);
  ```

  The data visualized in a table format,

  ![Screenshot](images/console-table.png)
  **Not:** Remember that `console.table()` is not supported in IE.

### 377. How do you verify that an argument is a Number or not

The combination of IsNaN and isFinite methods are used to confirm whether an argument is a number or not.

  ```javascript
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  ```

### 378. How do you create copy to clipboard button

You need to select the content(using .select() method) of the input element and execute the copy command with execCommand (i.e, execCommand('copy')). You can also execute other system commands like cut and paste.

  ```javascript
  document.querySelector("#copy-button").onclick = function () {
    // Select the content
    document.querySelector("#copy-input").select();
    // Copy to the clipboard
    document.execCommand("copy");
  };
  ```

### 379. What is the shortcut to get timestamp

You can use `new Date().getTime()` to get the current timestamp. There is an alternative shortcut to get the value.

  ```javascript
  console.log(+new Date());
  console.log(Date.now());
  ```

### 380. How do you flattening multi dimensional arrays

Flattening bi-dimensional arrays is trivial with Spread operator.

  ```javascript
  const biDimensionalArr = [11, [22, 33], [44, 55], [66, 77], 88, 99];
  const flattenArr = [].concat(...biDimensionalArr); // [11, 22, 33, 44, 55, 66, 77, 88, 99]
  ```

  But you can make it work with multi-dimensional arrays by recursive calls,

  ```javascript
  function flattenMultiArray(arr) {
    const flattened = [].concat(...arr);
    return flattened.some((item) => Array.isArray(item))
      ? flattenMultiArray(flattened)
      : flattened;
  }
  const multiDimensionalArr = [
    11,
    [22, 33],
    [44, [55, 66, [77, [88]], 99]],
  ];
  const flatArr = flattenMultiArray(multiDimensionalArr); // [11, 22, 33, 44, 55, 66, 77, 88, 99]
  ```

  Also you can use the `flat` method of Array.

  ```javascript
  const arr = [1, [2, 3], 4, 5, [6, 7]];
  const fllattenArr = arr.flat(); // [1, 2, 3, 4, 5, 6, 7]

  // And for multiDimensional arrays
  const multiDimensionalArr = [
    11,
    [22, 33],
    [44, [55, 66, [77, [88]], 99]],
  ];
  const oneStepFlat = multiDimensionalArr.flat(1); // [11, 22, 33, 44, [55, 66, [77, [88]], 99]]
  const towStep = multiDimensionalArr.flat(2); // [11, 22, 33, 44, 55, 66, [77, [88]], 99]
  const fullyFlatArray = multiDimensionalArr.flat(Infinity); // [11, 22, 33, 44, 55, 66, 77, 88, 99]
  ```

### 381. What is the easiest multi condition checking

You can use `indexOf` to compare input with multiple values instead of checking each value as one condition.

  ```javascript
  // Verbose approach
  if (
    input === "first" ||
    input === 1 ||
    input === "second" ||
    input === 2
  ) {
    someFunction();
  }
  // Shortcut
  if (["first", 1, "second", 2].indexOf(input) !== -1) {
    someFunction();
  }
  ```

### 382. How do you capture browser back button

The `beforeunload` event is triggered when the window, the document and its resources are about to be unloaded. This event is helpful to warn users about losing the current data and detect back button event.

  ```javascript
  window.addEventListener("beforeunload", () => {
    console.log("Clicked browser back button");
  });
  ```

  You can also use `popstate` event to detect the browser back button.
  **Note:** The history entry has been activated using `history.pushState` method.

  ```javascript
  window.addEventListener("popstate", () => {
    console.log("Clicked browser back button");
    box.style.backgroundColor = "white";
  });

  const box = document.getElementById("div");

  box.addEventListener("click", () => {
    box.style.backgroundColor = "blue";
    window.history.pushState({}, null, null);
  });
  ```


In the preceeding code, When the box element clicked, its background color appears in blue color and changed to while color upon clicking the browser back button using `popstate` event handler. The `state` property of `popstate` contains the copy of history entry's state object.

### 383. How do you disable right click in the web page

The right click on the page can be disabled by returning false from the `oncontextmenu` attribute on the body element.

 ```html
 <body oncontextmenu="return false;"></body>
 ```

### 384. What are wrapper objects

Primitive Values like string,number and boolean don't have properties and methods but they are temporarily converted or coerced to an object(Wrapper object) when you try to perform actions on them. For example, if you apply toUpperCase() method on a primitive string value, it does not throw an error but returns uppercase of the string.

 ```javascript
 let name = "john";

 console.log(name.toUpperCase()); // Behind the scenes treated as console.log(new String(name).toUpperCase());
 ```

 i.e, Every primitive except null and undefined have Wrapper Objects and the list of wrapper objects are String,Number,Boolean,Symbol and BigInt.

### 385. What is AJAX

AJAX stands for Asynchronous JavaScript and XML and it is a group of related technologies(HTML, CSS, JavaScript, XMLHttpRequest API etc) used to display data asynchronously. i.e. We can send data to the server and get data from the server without reloading the web page.

#### Practical Code Example

```javascript
// AJAX (Asynchronous JavaScript and XML): Updating web pages without reloading
// Modern standard implementation using Fetch API:
async function loadUserData() {
  const response = await fetch('/api/user');
  const data = await response.json();
  document.getElementById('username').textContent = data.name; // Updates in-place!
}
```

### 386. What are the different ways to deal with Asynchronous Code

Below are the list of different ways to deal with Asynchronous code.

 1. Callbacks
 2. Promises
 3. Async/await
 4. Third-party libraries such as async.js,bluebird etc

#### Practical Code Example

```javascript
// Ways to deal with Asynchronous Code:
// 1. Callbacks (legacy): fs.readFile(path, cb)
// 2. Promises: fetch(url).then(res => res.json())
// 3. Async / Await (Modern syntax):
async function getData() {
  const res = await fetch('/api');
  return await res.json();
}
```

### 387. How to cancel a fetch request

Until a few days back, One shortcoming of native promises is no direct way to cancel a fetch request. But the new `AbortController` from js specification allows you to use a signal to abort one or multiple fetch calls.
 The basic flow of cancelling a fetch request would be as below,

 1. Create an `AbortController` instance
 2. Get the signal property of an instance and pass the signal as a fetch option for signal
 3. Call the AbortController's abort property to cancel all fetches that use that signal
    For example, passing the same signal to multiple fetch calls will cancel all requests with that signal,

 ```javascript
 const controller = new AbortController();
 const { signal } = controller;

 fetch("http://localhost:8000", { signal })
   .then((response) => {
     console.log(`Request 1 is complete!`);
   })
   .catch((e) => {
     if (e.name === "AbortError") {
       // We know it's been canceled!
     }
   });

 fetch("http://localhost:8000", { signal })
   .then((response) => {
     console.log(`Request 2 is complete!`);
   })
   .catch((e) => {
     if (e.name === "AbortError") {
       // We know it's been canceled!
     }
   });

 // Wait 2 seconds to abort both requests
 setTimeout(() => controller.abort(), 2000);
 ```

### 388. What is web speech API

Web speech API is used to enable modern browsers recognize and synthesize speech(i.e, voice data into web apps). This API was introduced by W3C Community in the year 2012. It has two main parts:

 1. **SpeechRecognition (Asynchronous Speech Recognition or Speech-to-Text):** It provides the ability to recognize voice context from an audio input and respond accordingly. This is accessed by the `SpeechRecognition` interface.
    The example below shows how to use this API to get text from speech,

 ```javascript
 window.SpeechRecognition =
   window.webkitSpeechRecognition || window.SpeechRecognition; // webkitSpeechRecognition for Chrome and SpeechRecognition for FF
 const recognition = new window.SpeechRecognition();
 recognition.onresult = (event) => {
   // SpeechRecognitionEvent type
   const speechToText = event.results[0][0].transcript;
   console.log(speechToText);
 };
 recognition.start();
 ```

 In this API, browser is going to ask you for permission to use your microphone

 2. **SpeechSynthesis (Text-to-Speech):** It provides the ability to recognize voice context from an audio input and respond. This is accessed by the `SpeechSynthesis` interface.
    For example, the below code is used to get voice/speech from text,

 ```javascript
 if ("speechSynthesis" in window) {
   var speech = new SpeechSynthesisUtterance("Hello World!");
   speech.lang = "en-US";
   window.speechSynthesis.speak(speech);
 }
 ```

 The above examples can be tested on chrome(33+) browser's developer console.
 **Note:** This API is still a working draft and only available in Chrome and Firefox browsers(ofcourse Chrome only implemented the specification)

### 389. What is minimum timeout throttling

Both browser and NodeJS javascript environments throttles with a minimum delay that is greater than 0ms. That means even though setting a delay of 0ms will not happen instantaneously.
 **Browsers:** They have a minimum delay of 4ms. This throttle occurs when successive calls are triggered due to callback nesting(certain depth) or after a certain number of successive intervals.
 Note: The older browsers have a minimum delay of 10ms.
 **Nodejs:** They have a minimum delay of 1ms. This throttle happens when the delay is larger than 2147483647 or less than 1.
 The best example to explain this timeout throttling behavior is the order of below code snippet.

 ```javascript
 function runMeFirst() {
   console.log("My script is initialized");
 }
 setTimeout(runMeFirst, 0);
 console.log("Script loaded");
 ```

 and the output would be in

 ```cmd
 Script loaded
 My script is initialized
 ```

 If you don't use `setTimeout`, the order of logs will be sequential.

 ```javascript
 function runMeFirst() {
   console.log("My script is initialized");
 }
 runMeFirst();
 console.log("Script loaded");
 ```

 and the output is,

 ```cmd
 My script is initialized
 Script loaded
 ```

### 390. How do you implement zero timeout in modern browsers

You can't use setTimeout(fn, 0) to execute the code immediately due to minimum delay of greater than 0ms. But you can use window.postMessage() to achieve this behavior.

#### Practical Code Example

```javascript
// Implementing zero timeout in modern browsers:
// setTimeout(fn, 0) has a minimum 4ms clamp in nested loops.
// Use MessageChannel or queueMicrotask for true 0ms execution:
function setZeroTimeout(callback) {
  const channel = new MessageChannel();
  channel.port1.onmessage = callback;
  channel.port2.postMessage(null);
}
setZeroTimeout(() => console.log('Immediate zero-timeout execution'));
```

### 391. What are tasks in event loop

A task is any javascript code/program which is scheduled to be run by the standard mechanisms such as initially starting to run a program, run an event callback, or an interval or timeout being fired. All these tasks are scheduled on a task queue.
 Below are the list of use cases to add tasks to the task queue,

 1. When a new javascript program is executed directly from console or running by the `<script>` element, the task will be added to the task queue.
 2. When an event fires, the event callback added to task queue
 3. When a setTimeout or setInterval is reached, the corresponding callback added to task queue

#### Practical Code Example

```javascript
// Tasks (Macrotasks) in the Event Loop:
// Tasks include setTimeout, setInterval, I/O, UI rendering, and setImmediate (Node.js).
// Each turn of the event loop processes exactly ONE macrotask from the queue,
// then drains all pending microtasks before the next macrotask.
```

### 392. What is microtask

A microtask is a type of JavaScript callback that is scheduled to run immediately after the currently executing script and before the next event loop tick. Microtasks are executed after the current task completes and before any new tasks (macrotasks) are run. This ensures a fast and predictable update cycle.

 Common sources of microtasks stored in the microtask queue include:

 1. **Promises:**
    When a Promise is resolved or rejected, its `.then()`, `.catch()`, and `.finally()` callbacks are placed in the microtask queue.

    ```javascript
    Promise.resolve().then(() => {
     console.log('Microtask from a Promise');
    });
    ```

  2. **queueMicrotask():**
 
     A method that explicitly schedules a function to be run in the microtask queue.

     ```javascript
      queueMicrotask(() => {
         console.log('Microtask from  queueMicrotask');
       });
     ```

  3. **MutationObserver callbacks:**

     Observers changes in the DOM and triggers a callback as a microtask.

     ```javascript
        const observer = new MutationObserver(() => {
          console.log('Microtask from MutationObserver');
        })
        observer.observe(document.body, {childList: true});
     ```

  4. **await:**  
     Await internally uses Promises, so the code after `await` is scheduled as a microtask.

     ```javascript
      async function asyncFunction() {
        await null;
        console.log('Microtask from Await'); // Schedule this code as microtask
      }
     ```
 **Note:** All of these microtasks are processed in the same turn of the event loop.

### 393. What are different event loops

In JavaScript, there are multiple event loops that can be used depending on the context of your application. The most common event loops are:

 1. The Browser Event Loop
 2. The Node.js Event Loop

- Browser Event Loop: The Browser Event Loop is used in client-side JavaScript applications and is responsible for handling events that occur within the browser environment, such as user interactions (clicks, keypresses, etc.), HTTP requests, and other asynchronous actions.

- The Node.js Event Loop is used in server-side JavaScript applications and is responsible for handling events that occur within the Node.js runtime environment, such as file I/O, network I/O, and other asynchronous actions.

#### Practical Code Example

```javascript
// Different Event Loops:
// 1. Window Event Loop: Manages web documents on the same origin
// 2. Worker Event Loop: Runs in Web Worker / Service Worker isolated background threads
// 3. Worklet Event Loop: Specialized loop for audio/paint rendering pipeline
```

### 394. What is the purpose of queueMicrotask

The `queueMicrotask` function is used to schedule a microtask, which is a function that will be executed asynchronously in the microtask queue. The purpose of `queueMicrotask` is to ensure that a function is executed after the current task has finished, but before the browser performs any rendering or handles user events.

 Example:

 ```javascript
 console.log("Start"); //1

 queueMicrotask(() => {
   console.log("Inside microtask"); // 3
 });

 console.log("End"); //2
 ```

 By using queueMicrotask, you can ensure that certain tasks or callbacks are executed at the earliest opportunity during the JavaScript event loop, making it useful for performing work that needs to be done asynchronously but with higher priority than regular `setTimeout` or `setInterval` callbacks.

### 395. How do you use javascript libraries in typescript file

It is known that not all JavaScript libraries or frameworks have TypeScript declaration files. But if you still want to use libraries or frameworks in your TypeScript files without getting compilation errors, the only solution is `declare` keyword along with a variable declaration. For example, let's imagine you have a library called `customLibrary` that doesn’t have a TypeScript declaration and have a namespace called `customLibrary` in the global namespace. You can use this library in typescript code as below,

 ```javascript
 declare var customLibrary;
 ```

 In the runtime, typescript will provide the type to the `customLibrary` variable as `any` type. The another alternative without using declare keyword is below

 ```javascript
 var customLibrary: any;
 ```

### 396. What are the differences between promises and observables

Some of the major difference in a tabular form

 | Promises                                                           | Observables                                                                              |
 | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
 | Emits only a single value at a time                                | Emits multiple values over a period of time(stream of values ranging from 0 to multiple) |
 | Eager in nature; they are going to be called immediately           | Lazy in nature; they require subscription to be invoked                                  |
 | Promise is always asynchronous even though it resolved immediately | Observable can be either synchronous or asynchronous                                     |
 | Doesn't provide any operators                                      | Provides operators such as map, forEach, filter, reduce, retry, and retryWhen etc        |
 | Cannot be canceled                                                 | Canceled by using unsubscribe() method                                                   |

#### Practical Code Example

```javascript
// Promises vs Observables:
// Promise: Eager, returns a single value, not cancellable
const p = new Promise(resolve => resolve(42));

// Observable (RxJS): Lazy, streams multiple values over time, cancellable:
// const obs$ = new Observable(sub => { sub.next(1); sub.next(2); });
// const sub = obs$.subscribe(val => console.log(val));
// sub.unsubscribe(); // Can cancel subscription!
```

### 397. What is heap

Heap(Or memory heap) is the memory location where objects are stored when we define variables. i.e, This is the place where all the memory allocations and de-allocation take place. Both heap and call-stack are two containers of JS runtime.
 Whenever runtime comes across variables and function declarations in the code it stores them in the Heap.

 ![Screenshot](images/heap.png)

#### Practical Code Example

```javascript
// Memory Heap: Unstructured memory region where objects, arrays, and functions are allocated:
const user = { name: 'Manthan' }; // Allocated on the Heap
const numbers = [1, 2, 3, 4, 5];  // Allocated on the Heap
```

### 398. What is an event table

Event Table is a data structure that stores and keeps track of all the events which will be executed asynchronously like after some time interval or after the resolution of some API requests. i.e Whenever you call a setTimeout function or invoke async operation, it is added to the Event Table.
 It doesn't not execute functions on it’s own. The main purpose of the event table is to keep track of events and send them to the Event Queue as shown in the below diagram.

 ![Screenshot](images/event-table.png)

#### Practical Code Example

```javascript
// Event Table (in Browser / Node Architecture):
// Data structure tracking asynchronous operations and their corresponding callbacks
// before they are ready to be pushed to the Event Queue.
```

### 399. What is a microTask queue

Microtask Queue is the new queue where all the tasks initiated by promise objects get processed before the callback queue.
 The microtasks queue are processed before the next rendering and painting jobs. But if these microtasks are running for a long time then it leads to visual degradation.

#### Practical Code Example

```javascript
// Microtask Queue: Highest-priority queue (Promises, queueMicrotask, MutationObserver)
// The entire microtask queue is drained completely after every JS call stack clearance:
queueMicrotask(() => console.log('1. Microtask executed'));
setTimeout(() => console.log('2. Macrotask executed'), 0);
// '1. Microtask' executes before '2. Macrotask'
```

### 400. What is the difference between shim and polyfill

A shim is a library that brings a new API to an older environment, using only the means of that environment. It isn't necessarily restricted to a web application. For example, es5-shim.js is used to emulate ES5 features on older browsers (mainly pre IE9).
 Whereas polyfill is a piece of code (or plugin) that provides the technology that you, the developer, expect the browser to provide natively.
 In a simple sentence, a polyfill is a shim for a browser API.

#### Practical Code Example

```javascript
// Shim vs Polyfill:
// Polyfill: Code that replicates standard W3C/ECMAScript spec on browsers missing it (e.g., fetch polyfill).
// Shim: Broader piece of code that intercepts or provides a compatibility layer, not necessarily standard spec.
```



## Part 7: Execution Context, Functional JS & V8 Engine (401 - 460)

### 401. How do you detect primitive or non primitive value type

In JavaScript, primitive types include boolean, string, number, BigInt, null, Symbol and undefined. Whereas non-primitive types include the Objects. But you can easily identify them with the below function,

 ```javascript
 var myPrimitive = 30;
 var myNonPrimitive = {};
 function isPrimitive(val) {
   return Object(val) !== val;
 }

 isPrimitive(myPrimitive);
 isPrimitive(myNonPrimitive);
 ```

 If the value is a primitive data type, the Object constructor creates a new wrapper object for the value. But If the value is a non-primitive data type (an object), the Object constructor will give the same object.

### 402. What is babel

Babel is a JavaScript transpiler to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments. Some of the main features are listed below,

 1. Transform syntax
 2. Polyfill features that are missing in your target environment (using @babel/polyfill)
 3. Source code transformations (or codemods)

#### Practical Code Example

```javascript
// Babel: JavaScript transpiler converting modern ESNext / JSX syntax into backwards-compatible ES5:
// Modern Input:
const greet = (name) => `Hello ${name}`;

// Transpiled Output:
// var greet = function(name) { return "Hello " + name; };
```

### 403. Is Node.js completely single threaded

Node is a single thread, but some of the functions included in the Node.js standard library(e.g, fs module functions) are not single threaded. i.e, Their logic runs outside of the Node.js single thread to improve the speed and performance of a program.

#### Practical Code Example

```javascript
// Is Node.js completely single threaded?
// NO. The JavaScript execution thread is single-threaded,
// but the underlying libuv runtime uses a multi-threaded Thread Pool (default 4 threads)
// for expensive operations: fs, crypto, zlib, and dns.lookup.
```

### 404. What are the common use cases of observables

Some of the most common use cases of observables are web sockets with push notifications, user input changes, repeating intervals, etc

#### Practical Code Example

```javascript
// Common Use Cases of Observables:
// 1. Real-time WebSocket event streams
// 2. Typeahead search inputs with debouncing:
// searchInput$.pipe(debounceTime(300), distinctUntilChanged(), switchMap(searchApi))
// 3. Multi-event user interactions (drag and drop)
```

### 405. What is RxJS

RxJS (Reactive Extensions for JavaScript) is a library for implementing reactive programming using observables that makes it easier to compose asynchronous or callback-based code. It also provides utility functions for creating and working with observables.

#### Practical Code Example

```javascript
// RxJS (Reactive Extensions for JavaScript): Library for reactive programming using Observables:
import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// fromEvent(document, 'click')
//   .pipe(map(e => e.clientX), filter(x => x > 200))
//   .subscribe(x => console.log('Clicked at X:', x));
```

### 406. What is the difference between Function constructor and function declaration

The functions which are created with `Function constructor` do not create closures to their creation contexts but they are always created in the global scope. i.e, the function can access its own local variables and global scope variables only. Whereas function declarations can access outer function variables(closures) too.

 Let's see this difference with an example,

 **Function Constructor:**

 ```javascript
 var a = 100;
 function createFunction() {
   var a = 200;
   return new Function("return a;");
 }
 console.log(createFunction()()); // 100
 ```

 **Function declaration:**

 ```javascript
 var a = 100;
 function createFunction() {
   var a = 200;
   return function func() {
     return a;
   };
 }
 console.log(createFunction()()); // 200
 ```

### 407. What is a Short circuit condition

Short circuit conditions are meant for condensed way of writing simple if statements. Let's demonstrate the scenario using an example. If you would like to login to a portal with an authentication condition, the expression would be as below,

 ```javascript
 if (authenticate) {
   loginToPorta();
 }
 ```

 Since the javascript logical operators evaluated from left to right, the above expression can be simplified using && logical operator

 ```javascript
 authenticate && loginToPorta();
 ```

### 408. What is the easiest way to resize an array

The length property of an array is useful to resize or empty an array quickly. Let's apply length property on number array to resize the number of elements from 5 to 2,

 ```javascript
 var array = [1, 2, 3, 4, 5];
 console.log(array.length); // 5

 array.length = 2;
 console.log(array.length); // 2
 console.log(array); // [1,2]
 ```

 and the array can be emptied too

 ```javascript
 var array = [1, 2, 3, 4, 5];
 array.length = 0;
 console.log(array.length); // 0
 console.log(array); // []
 ```

### 409. What is an observable

An Observable is basically a function that can return a stream of values either synchronously or asynchronously to an observer over time. The consumer can get the value by calling `subscribe()` method.
 Let's look at a simple example of an Observable

 ```javascript
 import { Observable } from "rxjs";

 const observable = new Observable((observer) => {
   setTimeout(() => {
     observer.next("Message from a Observable!");
   }, 3000);
 });

 observable.subscribe((value) => console.log(value));
 ```

 ![Screenshot](images/observables.png)

 **Note:** Observables are not part of the JavaScript language yet but they are being proposed to be added to the language

### 410. What is the difference between function and class declarations

The main difference between function declarations and class declarations is `hoisting`. The function declarations are hoisted but not class declarations.

 **Classes:**

 ```javascript
 const user = new User(); // ReferenceError

 class User {}
 ```

 **Constructor Function:**

 ```javascript
 const user = new User(); // No error

 function User() {}
 ```

### 411. What is an async function

An async function is a function declared with the `async` keyword which enables asynchronous, promise-based behavior to be written in a cleaner style by avoiding promise chains. These functions can contain zero or more `await` expressions.

 Let's take a below async function example,

 ```javascript
 async function logger() {
   let data = await fetch("http://someapi.com/users"); // pause until fetch returns
   console.log(data);
 }
 logger();
 ```

 It is basically syntax sugar over ES2015 promises and generators.

### 412. How do you prevent promises swallowing errors

While using asynchronous code, JavaScript’s ES6 promises can make your life a lot easier without having callback pyramids and error handling on every second line. But Promises have some pitfalls and the biggest one is swallowing errors by default.

 Let's say you expect to print an error to the console for all the below cases,

 ```javascript
 Promise.resolve("promised value").then(function () {
   throw new Error("error");
 });

 Promise.reject("error value").catch(function () {
   throw new Error("error");
 });

 new Promise(function (resolve, reject) {
   throw new Error("error");
 });
 ```

 But there are many modern JavaScript environments that won't print any errors. You can fix this problem in different ways,

 1. **Add catch block at the end of each chain:** You can add catch block to the end of each of your promise chains

    ```javascript
    Promise.resolve("promised value")
      .then(function () {
        throw new Error("error");
      })
      .catch(function (error) {
        console.error(error.stack);
      });
    ```

    But it is quite difficult to type for each promise chain and verbose too.

 2. **Add done method:** You can replace first solution's then and catch blocks with done method

    ```javascript
    Promise.resolve("promised value").done(function () {
      throw new Error("error");
    });
    ```

    Let's say you want to fetch data using HTTP and later perform processing on the resulting data asynchronously. You can write `done` block as below,

    ```javascript
    getDataFromHttp()
      .then(function (result) {
        return processDataAsync(result);
      })
      .done(function (processed) {
        displayData(processed);
      });
    ```

    In future, if the processing library API changed to synchronous then you can remove `done` block as below,

    ```javascript
    getDataFromHttp().then(function (result) {
      return displayData(processDataAsync(result));
    });
    ```

    and then you forgot to add `done` block to `then` block leads to silent errors.

 3. **Extend ES6 Promises by Bluebird:**
    Bluebird extends the ES6 Promises API to avoid the issue in the second solution. This library has a “default” onRejection handler which will print all errors from rejected Promises to stderr. After installation, you can process unhandled rejections

    ```javascript
    Promise.onPossiblyUnhandledRejection(function (error) {
      throw error;
    });
    ```

    and discard a rejection, just handle it with an empty catch

    ```javascript
    Promise.reject("error value").catch(function () {});
    ```

### 413. What is deno

Deno is a simple, modern and secure runtime for JavaScript and TypeScript that uses V8 JavaScript engine and the Rust programming language. It solves the inherent problems of Node.Js and has been officially released in May 2018. Unlike Node.JS, by default Deno executes the code in a sandbox, which means that runtime has no access to below areas:

 1. The file system
 2. The network
 3. Execution of other scripts
 4. The environment variables

#### Practical Code Example

```typescript
// Deno: Secure JavaScript, TypeScript, and WebAssembly runtime built in Rust and V8:
// - Secure by default (no file, network, or environment access without flags)
// - Native TypeScript support without external bundlers:
// deno run --allow-net app.ts
```

### 414. How do you make an object iterable in javascript

By default, plain objects are not iterable. But you can make the object iterable by defining a `Symbol.iterator` property on it.

 Let's demonstrate this with an example,

 ```javascript
 const collection = {
   one: 1,
   two: 2,
   three: 3,
   [Symbol.iterator]() {
     const values = Object.keys(this);
     let i = 0;
     return {
       next: () => {
         return {
           value: this[values[i++]],
           done: i > values.length,
         };
       },
     };
   },
 };

 const iterator = collection[Symbol.iterator]();

 console.log(iterator.next()); // → {value: 1, done: false}
 console.log(iterator.next()); // → {value: 2, done: false}
 console.log(iterator.next()); // → {value: 3, done: false}
 console.log(iterator.next()); // → {value: undefined, done: true}
 ```

 The above process can be simplified using a generator function,

 ```javascript
 const collection = {
   one: 1,
   two: 2,
   three: 3,
   [Symbol.iterator]: function* () {
     for (let key in this) {
       yield this[key];
     }
   },
 };
 const iterator = collection[Symbol.iterator]();
 console.log(iterator.next()); // {value: 1, done: false}
 console.log(iterator.next()); // {value: 2, done: false}
 console.log(iterator.next()); // {value: 3, done: false}
 console.log(iterator.next()); // {value: undefined, done: true}
 ```

### 415. What is a Proper Tail Call

First, we should know about tail call before talking about "Proper Tail Call". A tail call is a subroutine or function call performed as the final action of a calling function. Whereas **Proper tail call(PTC)** is a technique where the program or code will not create additional stack frames for a recursion when the function call is a tail call.

 For example, the below classic or head recursion of factorial function relies on stack for each step. Each step need to be processed upto `n * factorial(n - 1)`

 ```javascript
 function factorial(n) {
   if (n === 0) {
     return 1;
   }
   return n * factorial(n - 1);
 }
 console.log(factorial(5)); //120
 ```

 But if you use Tail recursion functions, they keep passing all the necessary data it needs down the recursion without relying on the stack.

 ```javascript
 function factorial(n, acc = 1) {
   if (n === 0) {
     return acc;
   }
   return factorial(n - 1, n * acc);
 }
 console.log(factorial(5)); //120
 ```

 The above pattern returns the same output as the first one. But the accumulator keeps track of total as an argument without using stack memory on recursive calls.

### 416. How do you check an object is a promise or not

If you don't know if a value is a promise or not, wrapping the value as `Promise.resolve(value)` which returns a promise

 ```javascript
 function isPromise(object) {
   if (Promise && Promise.resolve) {
     return Promise.resolve(object) == object;
   } else {
     throw "Promise not supported in your environment";
   }
 }

 var i = 1;
 var promise = new Promise(function (resolve, reject) {
   resolve();
 });

 console.log(isPromise(i)); // false
 console.log(isPromise(promise)); // true
 ```

 Another way is to check for `.then()` handler type

 ```javascript
 function isPromise(value) {
   return Boolean(value && typeof value.then === "function");
 }
 var i = 1;
 var promise = new Promise(function (resolve, reject) {
   resolve();
 });

 console.log(isPromise(i)); // false
 console.log(isPromise(promise)); // true
 ```

### 417. How to detect if a function is called as constructor

You can use `new.target` pseudo-property to detect whether a function was called as a constructor(using the new operator) or as a regular function call.

 1. If a constructor or function invoked using the new operator, new.target returns a reference to the constructor or function.
 2. For function calls, new.target is undefined.

 ```javascript
 function Myfunc() {
   if (new.target) {
     console.log("called with new");
   } else {
     console.log("not called with new");
   }
 }

 new Myfunc(); // called with new
 Myfunc(); // not called with new
 Myfunc.call({}); // not called with new
 ```

### 418. What are the differences between arguments object and rest parameter

There are three main differences between arguments object and rest parameters

 1. The arguments object is an array-like but not an array. Whereas the rest parameters are array instances.
 2. The arguments object does not support methods such as sort, map, forEach, or pop. Whereas these methods can be used in rest parameters.
 3. The rest parameters are only the ones that haven’t been given a separate name, while the arguments object contains all arguments passed to the function

#### Practical Code Example

```javascript
// Arguments Object vs Rest Parameters:
// 1. arguments: Array-like object (no map/filter), available in traditional functions only
function oldWay() {
  console.log(arguments.length);
  // arguments.map(...) // TypeError: arguments.map is not a function
}

// 2. rest parameter: Real JavaScript Array with full array methods, works in arrow functions:
function modernWay(...args) {
  return args.map(x => x * 2);
}
```

### 419. What are the differences between spread operator and rest parameter

Rest parameter collects all remaining elements into an array. Whereas Spread operator allows iterables( arrays / objects / strings ) to be expanded into single arguments/elements. i.e, Rest parameter is opposite to the spread operator.

#### Practical Code Example

```javascript
// Spread vs Rest:
// Rest (...args): Gathers multiple elements into an array in function parameters / destructuring:
function sum(...numbers) { return numbers.reduce((a, b) => a + b, 0); }

// Spread (...arr): Expands an iterable array into individual arguments / elements:
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]
```

### 420. What are the different kinds of generators

There are five kinds of generators,

 1. **Generator function declaration:**

    ```javascript
    function* myGenFunc() {
      yield 1;
      yield 2;
      yield 3;
    }
    const genObj = myGenFunc();
    ```

 2. **Generator function expressions:**

    ```javascript
    const myGenFunc = function* () {
      yield 1;
      yield 2;
      yield 3;
    };
    const genObj = myGenFunc();
    ```

 3. **Generator method definitions in object literals:**

    ```javascript
    const myObj = {
      *myGeneratorMethod() {
        yield 1;
        yield 2;
        yield 3;
      },
    };
    const genObj = myObj.myGeneratorMethod();
    ```

 4. **Generator method definitions in class:**

    ```javascript
    class MyClass {
      *myGeneratorMethod() {
        yield 1;
        yield 2;
        yield 3;
      }
    }
    const myObject = new MyClass();
    const genObj = myObject.myGeneratorMethod();
    ```

 5. **Generator as a computed property:**

    ```javascript
    const SomeObj = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    };

    console.log(Array.from(SomeObj)); // [ 1, 2, 3 ]
    ```

### 421. What are the built-in iterables

Below are the list of built-in iterables in javascript,

 1. Arrays and TypedArrays
 2. Strings: Iterate over each character or Unicode code-points
 3. Maps: iterate over its key-value pairs
 4. Sets: iterates over their elements
 5. arguments: An array-like special variable in functions
 6. DOM collection such as NodeList

#### Practical Code Example

```javascript
// Built-in Iterables implementing [Symbol.iterator]:
const array = [1, 2, 3];
const string = "hello";
const map = new Map([['a', 1]]);
const set = new Set([1, 2, 3]);

for (const char of string) console.log(char); // Iterates 'h', 'e', 'l', 'l', 'o'
```

### 422. What are the differences between for...of and for...in statements

Both for...in and for...of statements iterate over js data structures. The only difference is over what they iterate:

 1. for..in iterates over all enumerable property keys of an object
 2. for..of iterates over the values of an iterable object.

 Let's explain this difference with an example,

 ```javascript
 let arr = ["a", "b", "c"];

 arr.newProp = "newVlue";

 // key are the property keys
 for (let key in arr) {
   console.log(key); // 0, 1, 2 & newProp
 }

 // value are the property values
 for (let value of arr) {
   console.log(value); // a, b, c
 }
 ```

 Since for..in loop iterates over the keys of the object, the first loop logs 0, 1, 2 and newProp while iterating over the array object. The for..of loop iterates over the values of a arr data structure and logs a, b, c in the console.

### 423. How do you define instance and non-instance properties

The Instance properties must be defined inside of class methods. For example, name and age properties defined inside constructor as below,

 ```javascript
 class Person {
   constructor(name, age) {
     this.name = name;
     this.age = age;
   }
 }
 ```

 But Static(class) and prototype data properties must be defined outside of the ClassBody declaration. Let's assign the age value for Person class as below,

 ```javascript
 Person.staticAge = 30;
 Person.prototype.prototypeAge = 40;
 ```

### 424. What is the difference between isNaN and Number.isNaN?

1. **isNaN**: The global function `isNaN` converts the argument to a Number and returns true if the resulting value is NaN.
 2. **Number.isNaN**: This method does not convert the argument. But it returns true when the type is a Number and value is NaN.

 Let's see the difference with an example,

 ```javascript
 isNaN(‘hello’);   // true
 Number.isNaN('hello'); // false
 ```

### 425. How to invoke an IIFE without any extra brackets?

Immediately Invoked Function Expressions(IIFE) requires a pair of parenthesis to wrap the function which contains set of statements.

 ```js
 (function (dt) {
   console.log(dt.toLocaleTimeString());
 })(new Date());
 ```

 Since both IIFE and void operator discard the result of an expression, you can avoid the extra brackets using `void operator` for IIFE as below,

 ```js
 void (function (dt) {
   console.log(dt.toLocaleTimeString());
 })(new Date());
 ```

### 426. Is that possible to use expressions in switch cases?

You might have seen expressions used in switch condition but it is also possible to use for switch cases by assigning true value for the switch condition. Let's see the weather condition based on temperature as an example,

 ```js
 const weather = (function getWeather(temp) {
   switch (true) {
     case temp < 0:
       return "freezing";
     case temp < 10:
       return "cold";
     case temp < 24:
       return "cool";
     default:
       return "unknown";
   }
 })(10);
 ```

### 427. What is the easiest way to ignore promise errors?

The easiest and safest way to ignore promise errors is void that error. This approach is ESLint friendly too.

 ```js
 await promise.catch((e) => void e);
 ```

### 428. How do style the console output using CSS?

You can add CSS styling to the console output using the CSS format content specifier %c. The console string message can be appended after the specifier and CSS style in another argument. Let's print the red color text using console.log and CSS specifier as below,

 ```js
 console.log("%cThis is a red text", "color:red");
 ```

 It is also possible to add more styles for the content. For example, the font-size can be modified for the above text

 ```js
 console.log(
   "%cThis is a red text with bigger font",
   "color:red; font-size:20px"
 );
 ```

### 429. What is nullish coalescing operator (??)?

It is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand. This can be contrasted with the logical OR (||) operator, which returns the right-hand side operand if the left operand is any falsy value, not only null or undefined.

 ```js
 console.log(null ?? true); // true
 console.log(false ?? true); // false
 console.log(undefined ?? true); // true
 ```

### 430. How do you group and nest console output?

The `console.group()` can be used to group related log messages to be able to easily read the logs and use console.groupEnd()to close the group. Along with this, you can also nest groups which allows to output message in hierarchical manner.

 For example, if you’re logging a user’s details:

 ```js
 console.group("User Details");
 console.log("name: Sudheer Jonna");
 console.log("job: Software Developer");

 // Nested Group
 console.group("Address");
 console.log("Street: Commonwealth");
 console.log("City: Los Angeles");
 console.log("State: California");

 // Close nested group
 console.groupEnd();

 // Close outer group
 console.groupEnd();
 ```

 You can also use `console.groupCollapsed()` instead of `console.group()` if you want the groups to be collapsed by default.

### 431. What is the difference between dense and sparse arrays?

An array contains items at each index starting from first(0) to last(array.length - 1) is called as Dense array. Whereas if at least one item is missing at any index, the array is called as sparse.

 Let's see the below two kind of arrays,

 ```js
 const avengers = ["Ironman", "Hulk", "CaptainAmerica"];
 console.log(avengers[0]); // 'Ironman'
 console.log(avengers[1]); // 'Hulk'
 console.log(avengers[2]); // 'CaptainAmerica'
 console.log(avengers.length); // 3

 const justiceLeague = ["Superman", "Aquaman", , "Batman"];
 console.log(justiceLeague[0]); // 'Superman'
 console.log(justiceLeague[1]); // 'Aquaman'
 console.log(justiceLeague[2]); // undefined
 console.log(justiceLeague[3]); // 'Batman'
 console.log(justiceLeague.length); // 4
 ```

### 432. What are the different ways to create sparse arrays?

There are 4 different ways to create sparse arrays in JavaScript

 1. **Array literal:** Omit a value when using the array literal
    ```js
    const justiceLeague = ["Superman", "Aquaman", , "Batman"];
    console.log(justiceLeague); // ['Superman', 'Aquaman', empty ,'Batman']
    ```
 2. **Array() constructor:** Invoking Array(length) or new Array(length)
    ```js
    const array = Array(3);
    console.log(array); // [empty, empty ,empty]
    ```
 3. **Delete operator:** Using delete array[index] operator on the array
    ```js
    const justiceLeague = ["Superman", "Aquaman", "Batman"];
    delete justiceLeague[1];
    console.log(justiceLeague); // ['Superman', empty, ,'Batman']
    ```
 4. **Increase length property:** Increasing length property of an array
    ```js
    const justiceLeague = ["Superman", "Aquaman", "Batman"];
    justiceLeague.length = 5;
    console.log(justiceLeague); // ['Superman', 'Aquaman', 'Batman', empty, empty]
    ```

### 433. What is the difference between setTimeout, setImmediate and process.nextTick?

1. **Set Timeout:** setTimeout() is to schedule execution of a one-time callback after delay milliseconds.
 2. **Set Immediate:** The setImmediate function is used to execute a function right after the current event loop finishes.
 3. **Process NextTick:** If process.nextTick() is called in a given phase, all the callbacks passed to process.nextTick() will be resolved before the event loop continues. This will block the event loop and create I/O Starvation if process.nextTick() is called recursively.

#### Practical Code Example

```javascript
// Node.js Execution Order:
// 1. process.nextTick(): Fires immediately before event loop resumes (microtask tick)
// 2. setTimeout(fn, 0): Schedules on Timer Phase
// 3. setImmediate(fn): Schedules on Check Phase (runs after I/O callbacks)

setImmediate(() => console.log('3. setImmediate'));
setTimeout(() => console.log('2. setTimeout'), 0);
process.nextTick(() => console.log('1. nextTick'));
// Output: 1. nextTick -> 2. setTimeout -> 3. setImmediate
```

### 434. How do you reverse an array without modifying original array?

The `reverse()` method reverses the order of the elements in an array but it mutates the original array. Let's take a simple example to demonistrate this case,

 ```javascript
 const originalArray = [1, 2, 3, 4, 5];
 const newArray = originalArray.reverse();

 console.log(newArray); // [ 5, 4, 3, 2, 1]
 console.log(originalArray); // [ 5, 4, 3, 2, 1]
 ```

 There are few solutions that won't mutate the original array. Let's take a look.

 1. **Using slice and reverse methods:**
    In this case, just invoke the `slice()` method on the array to create a shallow copy followed by `reverse()` method call on the copy.

    ```javascript
    const originalArray = [1, 2, 3, 4, 5];
    const newArray = originalArray.slice().reverse(); //Slice an array gives a new copy

    console.log(originalArray); // [1, 2, 3, 4, 5]
    console.log(newArray); // [ 5, 4, 3, 2, 1]
    ```

 2. **Using spread and reverse methods:**
    In this case, let's use the spread syntax (...) to create a copy of the array followed by `reverse()` method call on the copy.

    ```javascript
    const originalArray = [1, 2, 3, 4, 5];
    const newArray = [...originalArray].reverse();

    console.log(originalArray); // [1, 2, 3, 4, 5]
    console.log(newArray); // [ 5, 4, 3, 2, 1]
    ```

 3. **Using reduce and spread methods:**
    Here execute a reducer function on an array elements and append the accumulated array on right side using spread syntax

    ```javascript
    const originalArray = [1, 2, 3, 4, 5];
    const newArray = originalArray.reduce((accumulator, value) => {
      return [value, ...accumulator];
    }, []);

    console.log(originalArray); // [1, 2, 3, 4, 5]
    console.log(newArray); // [ 5, 4, 3, 2, 1]
    ```

 4. **Using reduceRight and spread methods:**
    Here execute a right reducer function(i.e. opposite direction of reduce method) on an array elements and append the accumulated array on left side using spread syntax

    ```javascript
    const originalArray = [1, 2, 3, 4, 5];
    const newArray = originalArray.reduceRight((accumulator, value) => {
      return [...accumulator, value];
    }, []);

    console.log(originalArray); // [1, 2, 3, 4, 5]
    console.log(newArray); // [ 5, 4, 3, 2, 1]
    ```

 5. **Using reduceRight and push methods:**
    Here execute a right reducer function(i.e. opposite direction of reduce method) on an array elements and push the iterated value to the accumulator

    ```javascript
    const originalArray = [1, 2, 3, 4, 5];
    const newArray = originalArray.reduceRight((accumulator, value) => {
      accumulator.push(value);
      return accumulator;
    }, []);

    console.log(originalArray); // [1, 2, 3, 4, 5]
    console.log(newArray); // [ 5, 4, 3, 2, 1]
    ```

### 435. How do you create custom HTML element?

The creation of custom HTML elements involves two main steps,

 1. **Define your custom HTML element:** First you need to define some custom class by extending HTMLElement class.
    After that define your component properties (styles,text etc) using `connectedCallback` method.
    **Note:** The browser exposes a function called `customElements.define` inorder to reuse the element.
    ```javascript
    class CustomElement extends HTMLElement {
      connectedCallback() {
        this.innerHTML = "This is a custom element";
      }
    }
    customElements.define("custom-element", CustomElement);
    ```
 2. **Use custom element just like other HTML element:** Declare your custom element as a HTML tag.

 ```javascript
    <body>
         <custom-element>
    </body>
 ```

### 436. What is global execution context?

The global execution context is the default or first execution context that is created by the JavaScript engine before any code is executed(i.e, when the file first loads in the browser). All the global code that is not inside a function or object will be executed inside this global execution context. Since JS engine is single threaded there will be only one global environment and there will be only one global execution context.

 For example, the below code other than code inside any function or object is executed inside the global execution context.

 ```javascript
 var x = 10;

 function A() {
   console.log("Start function A");

   function B() {
     console.log("In function B");
   }

   B();
 }

 A();

 console.log("GlobalContext");
 ```

### 437. What is function execution context?

Whenever a function is invoked, the JavaScript engine creates a different type of Execution Context known as a Function Execution Context (FEC) within the Global Execution Context (GEC) to evaluate and execute the code within that function.

#### Practical Code Example

```javascript
// Function Execution Context: Created whenever a function is invoked.
// Contains:
// 1. Lexical Environment (parameters, local variables)
// 2. Variable Environment
// 3. 'this' value binding determined at call time
function greet(user) {
  const msg = 'Welcome';
  return `${msg}, ${user}`;
}
greet('Alice'); // Pushes new Function Execution Context to Call Stack
```

### 438. What is debouncing?

Debouncing is a programming technique used to limit how often a function is executed. Specifically, it ensures that a function is only triggered after a certain amount of time has passed since it was last invoked. This prevents unnecessary or excessive function calls, which can help optimize performance and reduce unnecessary CPU usage or API requests.

For example, when a user types in a search box, you typically want to wait until they’ve finished typing before fetching suggestions. Without debouncing, an API call would be triggered on every keystroke, potentially causing performance issues. With debouncing, the function call is postponed until the user stops typing for a specified period (e.g., 300ms). If the user types again before this time elapses, the timer resets.

**Typical use cases for debouncing include:**

*   Search box suggestions (wait until typing pauses before fetching results)
*   Auto-saving text fields (save only after the user stops typing)
*   Preventing double-clicks on buttons
*   Handling window resize or scroll events efficiently

**Example Debounce Function:**

JavaScript

```css
function debounce(func, timeout = 500) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
```

**Usage Example:**

JavaScript

```css
function fetchResults() {
  console.log("Fetching input suggestions");
}
const processChange = debounce(fetchResults, 300);

// Attach to input element
<input type="text" onkeyup="processChange()" />

// Attach to button
<button onclick="processChange()">Click me</button>

// Attach to window event
window.addEventListener("scroll", processChange);
```

**How it works:**  
When `processChange` is invoked (e.g., by typing or clicking), any pending execution is canceled, and the function is scheduled to run after the specified delay. If another event occurs before the delay is up, the timer resets, and the function will only run after events have stopped for the delay duration.

Debouncing is an essential tool for improving user experience and application performance, especially when dealing with events that can fire rapidly and repeatedly.

### 439. What is throttling?

Throttling is a programming technique used to control the rate at which a function is executed. When an event is triggered continuously—such as during window resizing, scrolling, or mouse movement—throttling ensures that the associated event handler is not called more often than a specified interval. This helps improve performance by reducing the number of expensive function calls and preventing performance bottlenecks.

  **Common use cases:**

  *   Window resize events
  *   Scroll events
  *   Mouse movement or drag events
  *   API rate limiting

  **How does throttling work?**  
  Throttling will execute the function at most once every specified time interval, ignoring additional calls until the interval has passed.

  **Example: Throttle Implementation and Usage**

  JavaScript

  ```css
  // Simple throttle function: allows 'func' to run at most once every 'limit' ms
  function throttle(func, limit) {
    let inThrottle = false;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Usage: throttling a scroll event handler
  function handleScrollAnimation() {
    console.log('Scroll event triggered');
  }

  window.addEventListener(
    "scroll",
    throttle(handleScrollAnimation, 100) // Will run at most once every 100ms
  );
  ```

### 440. What is optional chaining?

According to MDN official docs, the optional chaining operator (?.) permits reading the value of a property located deep within a chain of connected objects without having to expressly validate that each reference in the chain is valid.

 The ?. operator is like the . chaining operator, except that instead of causing an error if a reference is nullish (null or undefined), the expression short-circuits with a return value of undefined. When used with function calls, it returns undefined if the given function does not exist.

 ```js
 const adventurer = {
   name: "Alice",
   cat: {
     name: "Dinah",
   },
 };

 const dogName = adventurer.dog?.name;
 console.log(dogName);
 // expected output: undefined

 console.log(adventurer.someNonExistentMethod?.());
 // expected output: undefined
 ```

### 441. What is an environment record?

According to ECMAScript specification 262 (9.1):

 > [Environment Record](https://262.ecma-international.org/12.0/#sec-environment-records) is a specification type used to define the association of Identifiers to specific variables and functions, based upon the lexical nesting structure of ECMAScript code.

 Usually an Environment Record is associated with some specific syntactic structure of ECMAScript code such as a FunctionDeclaration, a BlockStatement, or a Catch clause of a TryStatement.

 Each time such code is evaluated, a new Environment Record is created to record the identifier bindings that are created by that code.

#### Practical Code Example

```javascript
// Environment Record: Internal ECMAScript specification mechanism
// that records identifier bindings created within a lexical scope:
// 1. Declarative Environment Record (stores let, const, class, functions)
// 2. Object Environment Record (stores global object properties in global scope)
```

### 442. How to verify if a variable is an array?

It is possible to check if a variable is an array instance using 3 different ways,

 1. Array.isArray() method:

    The `Array.isArray(value)` utility function is used to determine whether value is an array or not. This function returns a true boolean value if the variable is an array and a false value if it is not.

    ```javascript
    const numbers = [1, 2, 3];
    const user = { name: "John" };
    Array.isArray(numbers); // true
    Array.isArray(user); //false
    ```

 2. instanceof operator:

    The instanceof operator is used to check the type of an array at run time. It returns true if the type of a variable is an Array other false for other type.

    ```javascript
    const numbers = [1, 2, 3];
    const user = { name: "John" };
    console.log(numbers instanceof Array); // true
    console.log(user instanceof Array); // false
    ```

 3. Checking constructor type:

    The constructor property of the variable is used to determine whether the variable Array type or not.

    ```javascript
    const numbers = [1, 2, 3];
    const user = { name: "John" };
    console.log(numbers.constructor === Array); // true
    console.log(user.constructor === Array); // false
    ```

### 443. What is pass by value and pass by reference?

Pass-by-value creates a new space in memory and makes a copy of a value. Primitives such as string, number, boolean etc will actually create a new copy. Hence, updating one value doesn't impact the other value. i.e, The values are independent of each other.

 ```javascript
 let a = 5;
 let b = a;

 b++;
 console.log(a, b); //5, 6
 ```

 In the above code snippet, the value of `a` is assigned to `b` and the variable `b` has been incremented. Since there is a new space created for variable `b`, any update on this variable doesn't impact the variable `a`.

 Pass by reference doesn't create a new space in memory but the new variable adopts a memory address of an initial variable. Non-primitives such as objects, arrays and functions gets the reference of the initiable variable. i.e, updating one value will impact the other variable.

 ```javascript
 let user1 = {
   name: "John",
   age: 27,
 };
 let user2 = user1;
 user2.age = 30;

 console.log(user1.age, user2.age); // 30, 30
 ```

 In the above code snippet, updating the `age` property of one object will impact the other property due to the same reference.

### 444. What are the differences between primitives and non-primitives?

JavaScript language has both primitives and non-primitives but there are few differences between them as below,

 | Primitives                 | Non-primitives       |
 | -------------------------- | -------------------- |
 | These types are predefined | Created by developer |
 | These are immutable        | Mutable              |
 | Compare by value           | Compare by reference |
 | Stored in Stack            | Stored in heap       |
 | Contain certain value      | Can contain NULL too |

#### Practical Code Example

```javascript
// Primitives: Passed by VALUE, stored on stack, immutable:
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (unchanged)

// Non-Primitives (Objects): Passed by REFERENCE:
let obj1 = { name: 'John' };
let obj2 = obj1;
obj2.name = 'Bob';
console.log(obj1.name); // 'Bob' (mutated!)
```

### 445. How do you create your own bind method using either call or apply method?

The custom bind function needs to be created on Function prototype inorder to use it as other builtin functions. This custom function should return a function similar to original bind method and the implementation of inner function needs to use apply method call.

 The function which is going to bind using custom `myOwnBind` method act as the attached function(`boundTargetFunction`) and argument as the object for `apply` method call.

 ```js
 Function.prototype.myOwnBind = function (whoIsCallingMe) {
   if (typeof this !== "function") {
     throw new Error(this + "cannot be bound as it's not callable");
   }
   const boundTargetFunction = this;
   return function () {
     boundTargetFunction.apply(whoIsCallingMe, arguments);
   };
 };
 ```

### 446. What are the differences between pure and impure functions?

Some of the major differences between pure and impure function are as below,

| Pure function                       | Impure function                                                        |
| ----------------------------------- | ---------------------------------------------------------------------- |
| It has no side effects              | It causes side effects                                                 |
| It is always return the same result | It returns different result on each call                               |
| Easy to read and debug              | Difficult to read and debug because they are affected by external code |

#### Practical Code Example

```javascript
// Pure Function (No side-effects, predictable):
const add = (x, y) => x + y;

// Impure Function (Modifies external variable / depends on external state):
let count = 0;
const increment = () => { count++; return count; }; // Side-effect mutation!
```

### 447. What is referential transparency?

An expression in javascript that can be replaced by its value without affecting the behaviour of the program is called referential transparency. Pure functions are referentially transparent.

```javascript
const add = (x, y) => x + y;
const multiplyBy2 = (x) => x * 2;

//Now add (2, 3) can be replaced by 5.

multiplyBy2(add(2, 3));
```

### 448. What are the possible side-effects in javascript?

A side effect is the modification of the state through the invocation of a function or expression. These side effects make our function impure by default. Below are some side effects which make function impure,

- Making an HTTP request. Asynchronous functions such as fetch and promise are impure.
- DOM manipulations
- Mutating the input data
- Printing to a screen or console: For example, console.log() and alert()
- Fetching the current time
- Math.random() calls: Modifies the internal state of Math object

#### Practical Code Example

```javascript
// Common Side-effects in JavaScript:
// 1. Mutating an input parameter
function mutateUser(user) { user.updated = true; }

// 2. Making an API/Network call
// 3. Writing to DOM or console.log
// 4. Writing to localStorage or cookies
```

### 449. What are compose and pipe functions?

The "compose" and "pipe" are two techniques commonly used in functional programming to simplify complex operations and make code more readable. They are not native to JavaScript and higher-order functions. the `compose()` applies right to left any number of functions to the output of the previous function.

#### Practical Code Example

```javascript
// Compose: Evaluates right-to-left: f(g(x))
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

// Pipe: Evaluates left-to-right: g(f(x))
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const add2 = (n) => n + 2;
const multiply3 = (n) => n * 3;

console.log(compose(multiply3, add2)(5)); // (5 + 2) * 3 = 21
console.log(pipe(add2, multiply3)(5));    // (5 + 2) * 3 = 21
```

### 450. What is module pattern?

Module pattern is a designed pattern used to wrap a set of variables and functions together in a single scope returned as an object. JavaScript doesn't have access specifiers similar to other languages(Java, Python, etc) to provide private scope. It uses IIFE (Immediately invoked function expression) to allow for private scopes. i.e., a closure that protect variables and methods.

 The module pattern looks like below,

 ```javascript
 (function () {
   // Private variables or functions goes here.

   return {
     // Return public variables or functions here.
   };
 })();
 ```

 Let's see an example of a module pattern for an employee with private and public access,

 ```javascript
 const createEmployee = (function () {
   // Private
   const name = "John";
   const department = "Sales";
   const getEmployeeName = () => name;
   const getDepartmentName = () => department;

   // Public
   return {
     name,
     department,
     getName: () => getEmployeeName(),
     getDepartment: () => getDepartmentName(),
   };
 })();

 console.log(createEmployee.name);
 console.log(createEmployee.department);
 console.log(createEmployee.getName());
 console.log(createEmployee.getDepartment());
 ```

 **Note:** It mimic the concepts of classes with private variables and methods.

### 451. What is Function Composition?

It is an approach where the result of one function is passed on to the next function, which is passed to another until the final function is executed for the final result.

 ```javascript
 //example
 const double = (x) => x * 2;
 const square = (x) => x * x;

 var output1 = double(2);
 var output2 = square(output1);
 console.log(output2);

 var output_final = square(double(2));
 console.log(output_final);
 ```

### 452. How to use await outside of async function prior to ES2022?

Prior to ES2022, if you attempted to use an await outside of an async function resulted in a SyntaxError.

 ```javascript
 await Promise.resolve(console.log("Hello await")); // SyntaxError: await is only valid in async function
 ```

 But you can fix this issue with an alternative IIFE (Immediately Invoked Function Expression) to get access to the feature.

 ```javascript
 (async function () {
   await Promise.resolve(console.log("Hello await")); // Hello await
 })();
 ```

 In ES2022, you can write top-level await without writing any hacks.

 ```javascript
 await Promise.resolve(console.log("Hello await")); //Hello await
 ```

### 453. What is the purpose of the this keyword in JavaScript?

The `this` keyword in JavaScript refers to **the object that is executing the current function**. Its value is determined by **how a function is called**, not where it is defined.  `this` is essential for writing object-oriented and event-driven code, as it allows methods to interact with the data of the object they belong to.


**Example 1: this in a Global Context**

```javascript
console.log(this);
```

- In a global context, this refers to the global object (e.g., window in a browser).

**Example 2: this in a Function**

```javascript
function displayThis() {
console.log(this);
}

displayThis();
```

- In a regular function, this refers to the global object(window in browser and global in nodejs) for non-strict mode.  In strict mode, it's value is undefined.

**Example 3: this in a Method**

```javascript
const person = {
name: "John",
greet: function () {
  console.log("Hello, " + this.name);
},
};

person.greet();
```

- In a method, this refers to the object that owns the method (person in the case).

**Example 4: this in an Event Handler**

```javascript
document.getElementById("myButton").addEventListener("click", function () {
        console.log(this);
});
```

- In an event handler, this refers to the element that triggered the event (the button in this case).

**Example 5: `this` with Arrow Functions**

```javascript
    const obj = {
      age: 42,
      regular: function() { console.log(this.age); },
      arrow: () => { console.log(this.age); }
    };
    obj.regular(); // 42 (this refers to obj)
    obj.arrow();   // undefined (this refers to the outer scope, not obj)
```
- Arrow functions do not have their own `this` binding; they inherit it from their surrounding (lexical) context.

**Example 6: this in Constructor Functions / Classes**

```javascript
function Person(name) {
  this.name = name;
}

const p1 = new Person('Sudheer');
console.log(p1.name); // Sudheer
```
- When used with new, this refers to the newly created object.

### 454. What are the uses of closures?

Closures are a powerful feature in programming languages like JavaScript. They allow functions to retain access to variables from their containing (enclosing) scope even after the outer function has finished executing. This means that a function defined within another function can access variables from the outer function, even if the outer function has already returned.
 Here are some common use cases of closures:

- Data Privacy: Closures can be used to create private variables and methods. By defining variables within a function's scope and returning inner functions that have access to those variables, you can create a form of encapsulation, limiting access to certain data or functionality.

- Function Factories: Closures are often used to create functions with pre-set parameters. This is useful when you need to create multiple functions with similar behavior but different configurations.

- Callback Functions: Closures are frequently used in asynchronous programming, such as handling event listeners or AJAX requests. The inner function captures variables from the outer scope and can access them when the callback is invoked.

- Memoization: Closures can be used for memoization, a technique to optimize performance by caching the results of expensive function calls. The inner function can remember the results of previous calls and return the cached result if the same input is provided again.

- iterators and Generators: Closures can be used to create iterators and generators, which are essential for working with collections of data in modern JavaScript.

#### Practical Code Example

```javascript
// Practical Uses of Closures:
// 1. Data Encapsulation / Private state:
function createCounter() {
  let count = 0; // Private state
  return {
    increment: () => ++count,
    getValue: () => count
  };
}
const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getValue());  // 1
```

### 455. What are the phases of execution context?

The execution context in JavaScript is a data structure that stores the information necessary for executing a piece of code. It includes the code itself, the values of the variables used in the code, and the scope chain. The scope chain is a list of objects that are used to resolve variable names.

The execution context has two phases:

- Creation phase: In this phase, the JavaScript engine creates the execution context and sets up the script's environment. This includes creating the variable object and the scope chain.
- Execution phase: In this phase, the JavaScript engine executes the code in the execution context. This includes evaluating expressions, assigning values to variables, and calling functions.

The execution context is created when a function is called. The function's code is then executed in the execution context. When the function returns, the execution context is destroyed.

#### Practical Code Example

```javascript
// Phases of Execution Context:
// Phase 1: Creation Phase
// - Memory allocation for variables (var = undefined, let/const in TDZ)
// - Function declarations hoisted in entirety
// - Sets up scope chain and 'this' binding

// Phase 2: Execution Phase
// - Code executed line by line, assigns variable values, invokes functions
```

### 456. What are the possible reasons for memory leaks?

Memory leaks can lead to poor performance, slow loading times and even crashes in web applications. Some of the common causes of memory leaks are listed below,

 1. The execessive usage of global variables or omitting the `var` keyword in local scope.
 2. Forgetting to clear the timers set up by `setTimeout` or `setInterval`.
 3. Closures retain references to variables from their parent scope, which leads to variables might not garbage collected even they are no longer used.

#### Practical Code Example

```javascript
// Possible Reasons for Memory Leaks:
// 1. Forgotten timers or callbacks:
// setInterval(() => { /* references heavyObj */ }, 1000);

// 2. Detached DOM elements retained in JS variables:
let detachedBtn = document.getElementById('btn');
document.body.removeChild(detachedBtn); // Still in memory via detachedBtn reference!

// 3. Accidental global variables (window.data = hugeCache)
```

### 457. What are the optimization techniques of V8 engine?

V8 engine uses the below optimization techniques.

 1. **Inline expansion:** It is a compiler optimization by replacing the function calls with the corresponding function blocks.
 2. **Copy elision:** This is a compiler optimization method to prevent expensive extra objects from being duplicated or copied.
 3. **Inline caching:** It is a runtime optimization technique where it caches the execution of older tasks those can be lookup while executing the same task in the future.

#### Practical Code Example

```javascript
// V8 Optimization Techniques:
// 1. Hidden Classes: Creates shared internal shapes for objects initialized with same keys
function Point(x, y) {
  this.x = x;
  this.y = y; // V8 creates one hidden class C0 -> C1 -> C2
}

// 2. Inline Caching (IC): Caches property offset lookups in machine code
```

### 458. What are the examples of built-in higher order functions?

There are several built-in higher order functions exists on arrays, strings, DOM and promise methods in javascript. These higher order functions provides significant level of abstraction. The list of functions on these categories are listed below,

 1. **arrays:** map, filter, reduce, sort, forEach, some etc.
 2. **DOM**: The DOM method `element.addEventListener(type, handler)` also accepts the function handler as a second argument.
 3. **Strings:** replace() method.

#### Practical Code Example

```javascript
// Built-in Higher-Order Functions on Array prototype:
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(x => x * 2);      // [2, 4, 6, 8, 10]
const evens = numbers.filter(x => x % 2 === 0); // [2, 4]
const sum = numbers.reduce((acc, x) => acc + x, 0); // 15
```

### 459. What are the benefits higher order functions?

The main benefits of higher order functions are:
 1. Abstraction
 2. Reusability
 3. Immutability
 4. Modularity

#### Practical Code Example

```javascript
// Benefits of Higher-Order Functions:
// 1. Declarative, readable code (intent over imperative loops)
// 2. High reusability and composability
// 3. Eliminates off-by-one errors in traditional loops
```

### 460. How do you create polyfills for map, filter and reduce methods?

The polyfills for array methods such as map, filter and reduce methods can be created using array prototype.

1.  **map:**

The built-in `Array.map` method syntax will be helpful to write polyfill. The map method takes the callback function as an argument and that callback function can have below three arguments passed into it.

i. Current value
ii. Index of current value(optional)
iii. array(optional)

The syntax would like below,

```js
let newArray = arr.map(callback(currentValue[, index, arr) {
   // return new array after executing the code
})
```

Let's build our map polyfill based on the above syntax,

```js
Array.prototype.myMap = function (cb) {
  let newArr = [];
  for (let i = 0; i < this.length; i++) {
    newArr.push(cb(this[i], i, this));
  }
  return newArr;
};

const nums = [1, 2, 3, 4, 5];
const multiplyByTwo = nums.myMap((x) => x * 2);
console.log(multiplyByTwo); // [2, 4, 6, 8, 10]
```

In the above code, custom method name 'myMap' has been used to avoid conflicts with built-in method.

2.  **filter:**
Similar to map method, `Array.filter` method takes callback function as an argument and the callback function can have three agurguments passed into it.

    i. Current value
    ii. Index of current value(optional)
    iii. array(optional)

The syntax looks like below,

```js
let newArray = arr.filter(callback(currentValue[, index, arr) {
  // return new array whose elements satisfy the callback conditions
})
```

Let's build our filter polyfill based on the above syntax,

```js
Array.prototype.myFilter = function (cb) {
  let newArr = [];
  for (let i = 0; i < this.length; i++) {
    if (cb(this[i], i, this)) {
      newArr.push(this[i]);
    }
  }
  return newArr;
};

const nums = [1, 2, 3, 4, 5, 6];
const evenNums = nums.myFilter((x) => x % 2);
console.log(evenNums); // [2, 4, 6]
```

3.  **reduce:**

      The built-in `Array.reduce` method syntax will be helpful to write our own polyfill. The reduce method takes the callback function as first argument and the initial value as second argument.

      The callback function can have four arguments passed into it.
      i. Accumulator
      ii. Current value
      iii. Index of current value(optional)
      iv. array(optional)

    The syntax would like below,

    ```js
    arr.reduce(callback((acc, curr, i, arr) => {}), initValue);
    ```
    Let's build our reduce polyfill based on the above syntax,

    ```js
    Array.prototype.myReduce = function(cb, initialValue) {
        let accumulator = initialValue;
        for(let i=0; i< this.length; i++) {
            accumulator = accumulator ? cb(accumulator, this[i], i, this) : this[i];
        }
        return accumulator;
    }
      const nums = [1, 2, 3, 4, 5, 6];
      const sum = nums.myReduce((acc, curr, i, arr) => {
        return acc += curr
      }, 0);
      console.log(sum); // 21
    ```



## Part 8: Modern JavaScript APIs, WeakRef, Proxy & Performance (461 - 518)

### 461. What is the difference between map and forEach functions?

Both map and forEach functions are used to iterate over an arrays but there are some differences in their functionality.

1. **Returning values:** The `map` method returns a new array with transformed elements whereas `forEach` method returns `undefined` even though both of them are doing the same job.

```javascript
  const arr = [1, 2, 3, 4, 5];
  arr.map(x => x * x); // [1, 4, 9, 16, 25]
  arr.forEach(x => x * x); //

  The `forEach()` method in JavaScript always returns undefined. This is because forEach() is used to iterate over arrays and perform side effects on each element, rather than returning a `new array or transforming the original array`
```

2. **Chaining methods:** The `map` method is chainable. i.e, It can be attached with `reduce`, `filter`, `sort` and other methods as well. Whereas `forEach` cannot be attached with any other methods because it returns `undefined` value.

```javascript
const arr = [1, 2, 3, 4, 5];
arr.map((x) => x * x).reduce((total, cur) => total + cur); // 55
arr.forEach((x) => x * x).reduce((total, cur) => total + cur); //Uncaught TypeError: Cannot read properties of undefine(reading 'reduce')
```

3. **Mutation:** The `map` method doesn't mutate the original array by returning new array. Whereas `forEach` method also doesn't mutate the original array but it's callback is allowed to mutate the original array.

**Note:** Both these methods existed since ES5 onwards.

### 462. Give an example of statements affected by automatic semicolon insertion?

The javascript parser will automatically add a semicolon while parsing the source code. For example, the below common statements affected by Automatic Semicolon Insertion(ASI).

 1. An empty statement
 2. var statement
 3. An expression statement
 4. do-while statement
 5. continue statement
 6. break statement
 7. return statement
 8. throw statement

#### Practical Code Example

```javascript
// Automatic Semicolon Insertion (ASI) Pitfall:
function getUser() {
  return // ASI inserts semicolon here: 'return;'!
  {
    name: 'Sarah'
  };
}
console.log(getUser()); // undefined (NOT the object!)

// Fixed:
function getUserCorrect() {
  return {
    name: 'Sarah'
  };
}
```

### 463. What are the event phases of a browser?

There are 3 phases in the lifecycle of an event propagation in JavaScript,

 1. **Capturing phase:** This phase goes down gradually from the top of the DOM tree to the target element when a nested element clicked. Before the click event reaching the final destination element, the click event of each parent's element must be triggered.

 2. **Target phase:** This is the phase where the event originally occurred reached the target element .

 3. **Bubbling phase:** This is reverse of the capturing phase. In this pase, the event bubbles up from the target element through it's parent element, an ancestor and goes all the way to the global window object.

 The pictorial representation of these 3 event phases in DOM looks like below,

 ![Screenshot](images/event-flow.png)

#### Practical Code Example

```javascript
// Browser Event Phases:
// Phase 1: Capturing Phase (Event travels down DOM tree from Window to target)
// Phase 2: Target Phase (Event reaches target node)
// Phase 3: Bubbling Phase (Event bubbles up DOM tree from target to Window)
```

### 464. What are the real world use cases of proxy?

Proxies are not used in regular day to day JavaScript work but they enabled many exciting programming patterns. Some of the real world use cases are listed below,

 1. Vue3 used proxy concept to implement reactive state
 2. SolidJS implemented reactive stores
 3. Immerjs built upon proxy to track updates to immutable updates
 4. ZenStack improved Prisma ORM for access control layer

#### Practical Code Example

```javascript
// Real-world Use Cases for Proxy:
// 1. Schema validation on objects:
const validator = {
  set(target, prop, value) {
    if (prop === 'age' && (typeof value !== 'number' || value < 0)) {
      throw new TypeError('Invalid age');
    }
    target[prop] = value;
    return true;
  }
};
const user = new Proxy({}, validator);
user.age = 25; // Success
// user.age = -5; // Throws TypeError!
```

### 465. What are hidden classes?

Since JavaScript is a dynamic programming language, you can add or remove properties and methods from objects on the fly at runtime. This nature of JavaScript increases the dynamic dictionary lookups(because objects implemented as HashTables in memory) for retrieving a property on an object.

 Let's consider the following example to see how the additional properties `age` and `gender` added at runtime.

 ```javascript
 function Person(name) {
   this.name = name;
 }

 var person1 = new Person("John");
 var person2 = new Person("Randy");

 person1.age = 40;
 person1.gender = "Male";

 person2.gender = "Female";
 person2.age = 50;
 ```

 As a result, this behavior leads to lower JavaScript performance compared to the contiguous buffer method used in non-dynamic languages. The V8 engine provided a solution named **hidden classes** to optimize the access time when retrieving a property on an object. This optimization is achieved by sharing hidden classes among objects created in a similar fashion. These hidden classes are attached to each and every object to track its shape.

 When V8 engine sees the constructor function(e.g, Person) is declared, it creates a hidden class (let's say Class01) without any offsets. Once the first property assignment statement (`this.name = name`) is executed, V8 engine will create a new hidden class (let's say Class02), inheriting all properties from the previous hidden class (Class01), and assign the property to offset 0. This process enables compiler to skip dictionary lookup when you try to retrieve the same property(i.e, name). Instead, V8 will directly point to Class02. The same procedure happens when you add new properties to the object.

 For example, adding `age` and `gender` properties to `Person` constructor leads to transition of hidden classes(Class02 -> Class03 -> Class04). If you create a second object(Person2) based on the same Person object, both Class01 and Class02 hidden classes are going to be shared. However, the hidden classes Class03 and Class04 cannot be shared because second object has been modified with a different order of properties assignment.

 Since both the objects(person1 and person2) do not share the hidden classes, now V8 engine cannot use **Inline Caching** technique for the faster access of properties.

### 466. What is inline caching?

Inline caching is an optimization technique based on the observation that repeated calls to same function tends to occur on same type of objects. The V8 compiler stores a cache of the type of objects that were passed as a parameter in recent method calls. Upon next time when same function is called, compiler can directly search for the type in cache.

Let's consider an example where the compiler stores the shape type in cache for repeated calls in the loop.

```js
let shape = { width: 30, height: 20 }; // Compiler store the type in cache as { width: <int>, height: <int>} after repeated calls

function area(obj) {
//Calculate area
}
for (let i = 0; i < 100; i++) {
area(shape);
}
```

After few successful calls of the same area method to its same hidden class, V8 engine omits the hidden class lookup and simply adds the offset of the property to the object pointer itself. As a result, it increases the execution speed.

There are mainly 3 types of inline caching possible:

1. Monomorphic: This is a optimized caching technique in which there can be always same type of objects passed.
2. Polymorphic: This ia slightly optimized caching technique in which limited number of different types of objects can be passed.
3. Megamorphic: It is an unoptimized caching in which any number of different objects can be passed.

### 467. What are the different ways to execute external scripts?

There are three different ways to execute external scripts,

 1. async: The script is downloaded in parallel to parsing the page, and executed as soon as it is available even before parsing completes. The parsing of the page is going to be interuppted once the script is downloaded completely and then the script is executed. Thereafter, the parsing of the remaining page will continue.

    The syntax for async usage is as shown below,

    ```html
    <script src="demo.js" async></script>
    ```

 2. defer: The script is downloaded in parallel to parsing the page, and executed after the page has finished parsing.

    The syntax for defer usage is as shown below,

    ```html
    <script src="demo.js" defer></script>
    ```

 3. Neither async or defer: The script is downloaded and executed immediately by blocking parsing of the page until the script execution is completed.

 **Note:** You should only use either async or defer attribute if the `src` attribute is present.

### 468. What is Lexical Scope?

Lexical scope is the ability for a function scope to access variables from the parent scope.

 ```js
 <script>
         function x(){
           var a=10;
           function y(){
               console.log(a); // will print a , because of lexical scope, it will first look 'a' in
           //its local memory space and then in its parent functions memory space
           }
           y();
       }
       x();
 </script>
 ```

### 469. How to detect system dark mode in javascript?

The combination of `Window.matchMedia()` utility method along with media query is used to check if the user has selected a dark color scheme in their operating system settings or not. The CSS media query `prefers-color-scheme` needs to be passed to identify system color theme.

 The following javascript code describes the usage,

 ```javascript
 const hasDarkColorScheme = () =>
   window.matchMedia &&
   window.matchMedia("(prefers-color-scheme: dark)").matches;
 ```

 You can also watch changes to system color scheme using `addEventListener`,

 ```javascript
 window
   .matchMedia("(prefers-color-scheme: dark)")
   .addEventListener("change", (event) => {
     const theme = event.matches ? "dark" : "light";
   });
 ```

 **Note:** The matchMedia method returns **MediaQueryList** object stores information from a media query.

### 470. What is the purpose of requestAnimationFrame method?

The requestAnimationFrame() method in JavaScript is used to schedule a function to be called before the next repaint of the browser window, allowing you to create smooth, efficient animations. It's primarily used for animations and visual updates, making it an essential tool for improving performance when you're animating elements on the web.

```javascript
const element = document.getElementById("myElement");
function animate() {
let currentPosition = parseInt(window.getComputedStyle(element).left, 10);

// Move the element 2px per frame
currentPosition += 2;
element.style.left = currentPosition + "px";
// If the element hasn't moved off-screen, request the next frame
if (currentPosition < window.innerWidth) {
requestAnimationFrame(animate);
}
}
// Start the animation
requestAnimationFrame(animate);
```

### 471. What is the difference between substring and substr methods?

Both `substring` and `substr` are used to extract parts of a string, but there are subtle differences between the substring() and substr() methods in terms of **syntax** and **behavior**.

 1. `substring(start, end)`
     - **Parameters:**
         - `start`: The index to start extracting (inclusive).
         - `end`: The index to stop extracting (exclusive).
     - **Behavior:**
         - If `start > end`, it **swaps the arguments**.
         - Negative values are treated as `0`.

     ```javascript
      let str = "Hello World";
      console.log(str.substring(0, 5));   // "Hello"
      console.log(str.substring(5, 0));   // "Hello" (swapped)
      console.log(str.substring(-3, 4));  // "Hell" (negative = 0)
     ```
 2. `substr(start, length)` _(Deprecated)_

     - **Parameters:**
       - `start`: The index to start extracting.
       - `length`: The number of characters to extract.
     - **Behavior:**
       - If `start` is negative, it counts from the **end** of the string.
       - If `length` is omitted, it extracts to the end of the string.

     ```javascript
     let str = "Hello World"; console.log(str.substr(0, 5)); // "Hello" 
     console.log(str.substr(-5, 3)); // "Wor" (starts from 'W')`
     ```
     **Note:** substr() is considered a legacy feature in ECMAScript, so it is best to avoid using it if possible.

### 472. How to find the number of parameters expected by a function?

The function's object has a **length** property which tells you how many formal parameters expected by a function. This is a static value defined by the function, not the number of arguments the function is called with(**arguments.length**). The basic usage of length propery is,

```javascript
function multiply(x, y) {
return x * y;
}

function sum(a, b, c) {
return a + b + c;
}

console.log(multiply.length); //2
console.log(sum.length); //3
```

But there are few important rules which needs to be noted while using length property.

1. **Default values:** Only the parameters which exists before a default value are considered.
```javascript
function sum(a, b = 2, c = 3) {
 return a + b + c;
}
console.log(sum.length); // 1
```
2. **Rest params:** The rest parameters are excluded with in length property.
```javascript
function sum(a, b, ...moreArgs) {
 let total = a + b;
 for (const arg of moreArgs) {
   total += arg;
 }
 return total;
}
console.log(sum.length); // 2
```
3. **Destructuring patterns:** Each destructuring pattern counted as a single parameter.

```javascript
function func([a, b], { x, y }) {
 console.log(a + b, x, y);
}

console.log(func.length); // 2
```

**Note:** The Function constructor is itself a function object and it has a length property of 1.

### 473. What is globalThis, and what is the importance of it?

Nowadays JavaScript language is used in a wide variety of environments and each environment has its own object model. Due to this fact, there are different ways(syntax) to access the global object.

 1. In web browser, the global object is accessible via `window`, `self`, or `frames`.
 2. In Node environment, you have to use `global`.
 3. In Web workers, the global object is available through `self`.

The `globalThis` property provides a standard way of accessing the global object without writing various code snippet to support multiple environments. For example, the global object retuned from multiple environments as shown below,

```javascript
//1. browser environment
console.log(globalThis); // => Window {...}

//2. node.js environment
console.log(globalThis); // => Object [global] {...}

//3. web worker environment
console.log(globalThis); // => DedicatedWorkerGlobalScope {...}
```

### 474. What are the array mutation methods?

JavaScript array methods can be categorized into two groups:
1. Mutating methods: These are the methods that directly modify the original array.
1. Non-mutating methods: These methods return a new array without altering the original one.

There are 9 methods in total that mutate the arrays,

1.  **push:** Adds one or more elements to the end of the array and returns the new length.
2.  **pop:** Removes the last element from the array and returns that element.
3.  **unshift:** Adds one or more elements to the beginning of the array and returns the new length..
4.  **shift:** Removes the first element from the array and returns that element.
5.  **splice:** Adds or removes elements from the array at a specific index position.
6.  **sort:** Sorts the elements of the array in-place based on a given sorting criteria.
7.  **reverse:** Reverses the order of elements in the given array.
8.  **fill:** Fills all elements of the array with a specific value.
9.  **copyWithIn:** Copies a sequence of elements within the array to a specified target index in the same array.

#### Practical Code Example

```javascript
// Array Mutation Methods (modify array in place):
// push(), pop(), shift(), unshift(), splice(), sort(), reverse()

// Modern Non-Mutating Alternatives (ES2023):
const original = [3, 1, 2];
const sorted = original.toSorted();     // [1, 2, 3] (original stays [3, 1, 2])
const reversed = original.toReversed(); // [2, 1, 3]
const spliced = original.toSpliced(0, 1, 99); // [99, 1, 2]
```

### 475. What is module scope in JavaScript?

Module scope is a feature introduced with ES6 (ES2015) modules that creates a scope specific to a module file, isolating variables and functions declared within it from the global scope and other modules. Variables and functions declared in a module are private by default and can only be accessed by other modules if they are explicitly exported.

Key characteristics of module scope:

1.  Variables declared in a module are scoped to that module only.
2.  Each module has its own top-level scope
3.  Variables and functions need to be explicitly exported to be used in other modules
4.  The global scope cannot access module variables unless they are explicitly exported and imported
5.  Modules are always executed in strict mode

```javascript
// moduleA.js

// This variable is PRIVATE to moduleA. It's like a tool inside a closed box.
const privateVariable = "I am private";

// This variable is PUBLIC because it's exported. Others can use it when they import moduleA.
export const publicVariable = "I am public";

// PUBLIC function because it's exported. But it can still access privateVariable inside moduleA.
export function publicFunction() {
console.log(privateVariable); // ✅ This works because we're inside the same module.
return "Hello from publicFunction!";
}

// moduleB.js

// Importing PUBLIC items from moduleA.
import { publicVariable, publicFunction } from "./moduleA.js";

console.log(publicVariable); // ✅ "I am public" - Works because it's exported.
console.log(publicFunction()); // ✅ "Hello from publicFunction!" - Works as well.

// ❌ This will cause an ERROR because privateVariable was NOT exported from moduleA.
// console.log(privateVariable);   // ❌ ReferenceError: privateVariable is not defined
```

Common use cases and benefits:

- Encapsulation of module-specific code
- Prevention of global scope pollution
- Better code organization and maintenance
- Explicit dependency management
- Protection of private implementation details

### 476. What are shadowing and illegal shadowing?

Both **shadowing** and **illegal shadowing** refer to how variable names can "hide" or override others within nested scopes.

 **Shadowing** occurs when a variable declared within a certain scope (like a function or block) has the same name as a variable declared in an outer scope. The inner variable shadows the outer one — meaning, the inner variable takes precedence in its own scope.

 Let's take an example where the inner `a` inside `func()` shadows the outer variable `a`.

  ```javascript
  let a = 10;

  function func() {
    let a = 20; // Shadows the outer 'a'
    console.log(a); // 20
  }

  func();
  console.log(a); // 10
  ```

 **Illegal shadowing** in JavaScript refers to a syntax error that happens when you try to declare a block-scoped variable (`let` or `const`) with the same name as a variable declared using `var` in the same or an overlapping scope. 

 For example, if you declare both block-scoped variable and function scoped variable using the same name inside a function causes an illegal shadowing.

  ```javascript
  function test() {
    var a = 10;
    let a = 20; // SyntaxError: Identifier 'a' has already been declared
  }
  ```

  As an another example, if you declare a variable with `let` or `const` in an outer scope, and then try to redeclare it with `var` inside a nested block, JavaScript throws an error — even though `var` is supposed to be function-scoped. Since the var appears in a block, it ends up trying to overwrite the `let` in the outer scope, which causes a conflict.

  ```javascript
  let a = 10;
  {
    var a = 20; // SyntaxError: Identifier 'a' has already been declared
    console.log(a);
  }
  ```

### 477. Why is it important to remove event listeners after use?

In JavaScript, you need to be mindful of removing event listeners to avoid memory leaks — especially in long-lived apps like single-page applications (SPAs) or when working with frameworks/libraries. Eventhough JavaScript has automatic garbage collection, memory leaks can still happen if:

1. A DOM element is removed, but a listener still references it.
2. A callback (event listener) holds a reference to a large object or closure that can't be cleaned up.
3. Global objects like window, document etc retain listeners indefinitely unless manually removed.

So if you add any event listeners to DOM element, it is a good practice to remove it after its usage as shown below,

```javascript
 const button = document.getElementById("btn");

  function handleClick() {
    console.log("Clicked!");
  }

  button.addEventListener("click", handleClick);

  // Always remove when done
  button.removeEventListener("click", handleClick);
```

### 478. What is structuredClone and how is it used for deep copying objects?

In JavaScript, `structuredClone()` is a built-in method used to create a **deep copy** of a value. It safely clones nested objects, arrays, Maps, Sets, Dates, TypedArrays, and even circular references — without sharing references to the original value. This prevents accidental mutations and makes it useful for state management and data processing.

   For example, the below snippet demonstrates deep cloning of a nested object,

    ```javascript
       const originalObject = {
         name: "Deep Copy Test",
         nested: {
        value: 10,
        list: [1, 2, 3]
},
};

const deepCopy = structuredClone(originalObject);

// Modify cloned value
deepCopy.nested.value = 99;
deepCopy.nested.list.push(4);
console.log(originalObject.nested.value); // 10
console.log(deepCopy.nested.value);       // 99
console.log(originalObject.nested.list);  // [1, 2, 3]
console.log(deepCopy.nested.list);        // [1, 2, 3, 4]

### 479. What is the difference between const and Object.freeze

The main difference is that `const` applies to **variables** (bindings), while `Object.freeze()` applies to **values** (objects).

 1. **`const`**: Prevents the reassignment of a variable identifier. It ensures that the variable name always points to the same memory reference. However, if the variable holds an object or array, the *contents* of that object can still be modified.
 2. **`Object.freeze()`**: Prevents the modification of an object's properties. It makes the object immutable (you cannot add, remove, or change properties), but it does not affect the variable assignment itself (unless the variable is also declared with `const`).

 **Example:**

 ```javascript
   // Case 1: Using const (Reassignment prevented, Mutation allowed)
   const person = { name: "John" };
   person.name = "Doe"; // ✅ Allowed: The object is mutable
   console.log(person.name); // "Doe"

   // person = { name: "Jane" }; // ❌ Error: Assignment to constant variable

   // Case 2: Using Object.freeze (Reassignment allowed, Mutation prevented)
   let profile = { name: "John" };
   Object.freeze(profile);

   profile.name = "Doe"; // ❌ Ignored (or throws TypeError in strict mode)
   console.log(profile.name); // "John"

   profile = { name: "Jane" }; // ✅ Allowed: 'profile' is declared with 'let'
   console.log(profile.name); // "Jane"

### 480. What is Promise.any and when should it be used?

`Promise.any()` is a Promise combinator method introduced in ES2021 that takes an iterable of promises and returns a single promise that fulfills as soon as any of the input promises fulfills. It resolves with the value of the first promise that successfully resolves.

 **Key Characteristics:**

 1. **First Success Wins**: Returns the value of the first fulfilled promise
 2. **Ignores Rejections**: Continues waiting even if some promises reject
 3. **AggregateError**: Only rejects if all promises reject (with an AggregateError containing all rejection reasons)

 **When to Use Promise.any():**

 - **Fastest Resource**: When fetching from multiple mirrors/CDNs and you want the first successful response
 - **Redundant Services**: When calling multiple redundant APIs and only need one to succeed
 - **Fallback Mechanisms**: When you have primary and backup data sources

 **Example:**

 ```javascript
 // Fetching from multiple CDNs - use whichever responds first
 const cdn1 = fetch('https://cdn1.example.com/data.json');
 const cdn2 = fetch('https://cdn2.example.com/data.json');
 const cdn3 = fetch('https://cdn3.example.com/data.json');

 Promise.any([cdn1, cdn2, cdn3])
   .then(response => response.json())
   .then(data => console.log('First successful response:', data))
   .catch(error => {
     // Only if ALL promises reject
     console.error('All CDNs failed:', error.errors);
   });

 // Comparison with other Promise methods:
 const promises = [
   Promise.reject('Error 1'),
   Promise.resolve('Success!'),
   Promise.reject('Error 2')
 ];

 // Promise.any() - Returns first fulfilled promise
 Promise.any(promises)
   .then(value => console.log(value)); // Output: "Success!"

 // Promise.race() - Returns first settled promise (fulfilled or rejected)
 Promise.race(promises)
   .catch(error => console.log(error)); // Output: "Error 1"

 // Promise.all() - Waits for all or fails on first rejection
 Promise.all(promises)
   .catch(error => console.log(error)); // Output: "Error 1"

 // Promise.allSettled() - Waits for all, never rejects
 Promise.allSettled(promises)
   .then(results => console.log(results));
 // Output: [
 //   { status: 'rejected', reason: 'Error 1' },
 //   { status: 'fulfilled', value: 'Success!' },
 //   { status: 'rejected', reason: 'Error 2' }
 // ]
 ```

### 481. What is BigInt and how is it different from Number?

`BigInt` is a built-in JavaScript object (introduced in ES2020) that provides a way to represent whole numbers larger than 2^53 - 1 (the largest number JavaScript can reliably represent with the `Number` primitive).

 **Key Differences:**

 | Feature | Number | BigInt |
 |---------|--------|--------|
 | **Maximum Safe Integer** | 2^53 - 1 (9,007,199,254,740,991) | No theoretical limit |
 | **Syntax** | `42` | `42n` or `BigInt(42)` |
 | **Type** | `"number"` | `"bigint"` |
 | **Decimals** | Supports decimals | Integer only |
 | **Math Operations** | Works with Math object | Cannot use Math object |
 | **JSON** | Native JSON support | No native JSON support |
 | **Mixing Operations** | N/A | Cannot mix with Number without explicit conversion |

 **Creating BigInt:**

 ```javascript
 // Using 'n' suffix
 const bigInt1 = 9007199254740991n;
 const bigInt2 = 123456789012345678901234567890n;

 // Using BigInt() function
 const bigInt3 = BigInt("9007199254740991");
 const bigInt4 = BigInt(9007199254740991);

 console.log(typeof bigInt1); // "bigint"
 ```

 **Common Use Cases:**

 ```javascript
 // 1. Large integer arithmetic
 const largeNumber = 9007199254740992n;
 const result = largeNumber + 1n; // 9007199254740993n

 // Problem with Number:
 console.log(9007199254740992 + 1); // 9007199254740992 (incorrect!)
 console.log(9007199254740992n + 1n); // 9007199254740993n (correct!)

 // 2. High-precision calculations
 const factorial = (n) => {
   if (n === 0n) return 1n;
   return n * factorial(n - 1n);
 };
 console.log(factorial(50n)); // Accurate result for 50!

 // 3. Cryptography and unique identifiers
 const uniqueId = 1234567890123456789012345n;

 // Important: Cannot mix BigInt and Number
 const num = 10;
 const big = 20n;
 // console.log(num + big); // TypeError: Cannot mix BigInt and other types
 console.log(BigInt(num) + big); // 30n (correct)
 console.log(num + Number(big)); // 30 (correct, but loses precision for large values)

 // Comparison works across types
 console.log(10n == 10);  // true
 console.log(10n === 10); // false (different types)
 console.log(10n < 15);   // true
 ```

 **Limitations:**

 ```javascript
 // No decimal support
 const decimal = 3.5n; // SyntaxError

 // Cannot use with Math object
 Math.sqrt(16n); // TypeError

 // JSON serialization requires custom handling
 const data = { id: 123n };
 JSON.stringify(data); // TypeError: Do not know how to serialize a BigInt

 // Solution for JSON:
 JSON.stringify(data, (key, value) => 
   typeof value === 'bigint' ? value.toString() : value
 );
 ```

### 482. What are private class fields in JavaScript?

Private class fields (introduced in ES2022) are class properties that are only accessible within the class itself. They are prefixed with a hash symbol (`#`) and provide true encapsulation in JavaScript classes.

 **Key Features:**

 1. **True Privacy**: Cannot be accessed from outside the class, even using bracket notation
 2. **Instance Privacy**: Each instance has its own private fields
 3. **Subclass Isolation**: Private fields are not inherited or accessible by subclasses
 4. **Hard Private**: Unlike convention-based privacy (e.g., `_privateField`), these are enforced by the language

 **Syntax and Examples:**

 ```javascript
 class BankAccount {
   // Private fields (must be declared at class level)
   #balance = 0;
   #accountNumber;
   #pin;

   // Public field
   accountHolder;

   constructor(holder, accountNumber, initialDeposit, pin) {
     this.accountHolder = holder;
     this.#accountNumber = accountNumber;
     this.#balance = initialDeposit;
     this.#pin = pin;
   }

   // Private method
   #validatePin(inputPin) {
     return this.#pin === inputPin;
   }

   // Public methods can access private fields
   deposit(amount) {
     if (amount > 0) {
       this.#balance += amount;
       return true;
     }
     return false;
   }

   withdraw(amount, pin) {
     if (!this.#validatePin(pin)) {
       throw new Error('Invalid PIN');
     }
     if (amount > 0 && amount <= this.#balance) {
       this.#balance -= amount;
       return amount;
     }
     throw new Error('Insufficient funds');
   }

   getBalance(pin) {
     if (!this.#validatePin(pin)) {
       throw new Error('Invalid PIN');
     }
     return this.#balance;
   }

   // Static private fields
   static #bankName = 'SecureBank';
   
   static getBankName() {
     return this.#bankName;
   }
 }

 // Usage
 const account = new BankAccount('Alice', '123456', 1000, '1234');

 account.deposit(500);
 console.log(account.getBalance('1234')); // 1500

 // Attempting to access private fields throws an error
 console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
 console.log(account['#balance']); // undefined (bracket notation doesn't work)

 // Even reflection doesn't work
 console.log(Object.keys(account)); // ['accountHolder']
 console.log(Reflect.ownKeys(account)); // Does not include private fields in public APIs
 ```

 **Benefits over Convention-Based Privacy:**

 ```javascript
 // Old way (convention-based, not truly private)
 class OldAccount {
   constructor(balance) {
     this._balance = balance; // Convention: underscore means "private"
   }

   getBalance() {
     return this._balance;
   }
 }

 const oldAcc = new OldAccount(1000);
 console.log(oldAcc._balance); // 1000 (accessible! Not truly private)
 oldAcc._balance = 999999; // Can be modified from outside

 // New way (truly private)
 class NewAccount {
   #balance;

   constructor(balance) {
     this.#balance = balance;
   }

   getBalance() {
     return this.#balance;
   }
 }

 const newAcc = new NewAccount(1000);
 // console.log(newAcc.#balance); // SyntaxError
 // newAcc.#balance = 999999; // SyntaxError
 ```

 **Private Fields with Inheritance:**

 ```javascript
 class Parent {
   #privateField = 'parent private';

   getPrivate() {
     return this.#privateField;
   }
 }

 class Child extends Parent {
   #privateField = 'child private'; // Different field, doesn't override

   getChildPrivate() {
     return this.#privateField;
   }
 }

 const child = new Child();
 console.log(child.getPrivate()); // 'parent private'
 console.log(child.getChildPrivate()); // 'child private'
 ```

### 483. What is the Array.prototype.at() method and why is it useful?

The `at()` method (introduced in ES2022) allows you to access array elements using both positive and negative indices. It provides a simpler and more intuitive way to access elements from the end of an array.

 **Syntax:**

 ```javascript
 array.at(index)
 ```

 **Key Features:**

 1. **Negative Indexing**: Negative indices count from the end of the array
 2. **Cleaner Syntax**: More readable than traditional methods for accessing end elements
 3. **Works on Strings**: Also available on String.prototype
 4. **Returns undefined**: Returns `undefined` for out-of-bounds indices (like bracket notation)

 **Examples:**

 ```javascript
 const fruits = ['apple', 'banana', 'orange', 'mango', 'grape'];

 // Positive indices (same as bracket notation)
 console.log(fruits.at(0));  // 'apple'
 console.log(fruits.at(2));  // 'orange'
 console.log(fruits[2]);     // 'orange' (equivalent)

 // Negative indices (the game changer!)
 console.log(fruits.at(-1)); // 'grape' (last element)
 console.log(fruits.at(-2)); // 'mango' (second to last)
 console.log(fruits.at(-5)); // 'apple' (first element)

 // Out of bounds
 console.log(fruits.at(10));  // undefined
 console.log(fruits.at(-10)); // undefined

 // Comparison with traditional approaches:
 const arr = [10, 20, 30, 40, 50];

 // Getting last element
 console.log(arr.at(-1));           // 50 ✅ Clean and simple
 console.log(arr[arr.length - 1]);  // 50 ❌ Verbose
 console.log(arr.slice(-1)[0]);     // 50 ❌ Creates new array

 // Getting second to last
 console.log(arr.at(-2));           // 40 ✅ Clean
 console.log(arr[arr.length - 2]);  // 40 ❌ Verbose

 // Dynamic index from the end
 const n = 3;
 console.log(arr.at(-n));           // 30 ✅ Clean
 console.log(arr[arr.length - n]);  // 30 ❌ Verbose
 ```

 **Works with Strings:**

 ```javascript
 const text = 'Hello, World!';

 console.log(text.at(0));   // 'H'
 console.log(text.at(-1));  // '!'
 console.log(text.at(-6));  // 'W'
 ```

 **Real-World Use Cases:**

 ```javascript
 // 1. Processing the last few elements
 const scores = [85, 92, 78, 95, 88];
 const lastScore = scores.at(-1);
 const secondLastScore = scores.at(-2);
 console.log(`Last two scores: ${secondLastScore}, ${lastScore}`);

 // 2. Circular/wraparound logic
 function getElement(array, index) {
   // Positive: use directly
   // Negative: count from end
   return array.at(index);
 }

 // 3. Working with dynamic data
 const messages = ['msg1', 'msg2', 'msg3', 'msg4'];
 const latest = messages.at(-1); // Always gets the latest

 // 4. Palindrome checking
 function isPalindrome(str) {
   const len = str.length;
   for (let i = 0; i < len / 2; i++) {
     if (str.at(i) !== str.at(-i - 1)) {
       return false;
     }
   }
   return true;
 }
 console.log(isPalindrome('racecar')); // true

 // 5. Safe access with method chaining
 const data = [1, 2, 3];
 console.log(data.filter(x => x > 1).at(-1)); // 3 (last of filtered results)
 ```

 **Benefits over Traditional Methods:**

 ```javascript
 const items = ['a', 'b', 'c', 'd', 'e'];

 // Traditional (verbose and error-prone)
 const last = items[items.length - 1];
 const thirdFromEnd = items[items.length - 3];

 // Modern (clean and intuitive)
 const last2 = items.at(-1);
 const thirdFromEnd2 = items.at(-3);

 // Especially useful in expressions
 const result = someFunction() || items.at(-1); // Clean
 const result2 = someFunction() || items[items.length - 1]; // Cluttered
 ```

### 484. What is top-level await in JavaScript modules?

Top-level await is a feature (introduced in ES2022) that allows you to use the `await` keyword at the top level of ES modules, outside of async functions. This enables modules to act as asynchronous functions themselves.

 **Key Characteristics:**

 1. **Module-Only**: Only works in ES modules (not in scripts or CommonJS)
 2. **Blocks Execution**: The module graph execution pauses until the promise resolves
 3. **No Async Wrapper**: No need to wrap await in an async function
 4. **Import Dependency**: Modules that import a module using top-level await will wait for it

 **Before Top-Level Await:**

 ```javascript
 // ❌ Old way: Wrapper function required
 // config.js
 let config;

 async function loadConfig() {
   const response = await fetch('/api/config');
   config = await response.json();
 }

 loadConfig(); // Returns a promise, but we can't await here

 export { config }; // config might be undefined when imported!

 // ❌ Or using IIFE (Immediately Invoked Function Expression)
 (async () => {
   const response = await fetch('/api/config');
   const config = await response.json();
   // Now what? How to export?
 })();
 ```

 **With Top-Level Await:**

 ```javascript
 // ✅ New way: Direct top-level await
 // config.js
 const response = await fetch('/api/config');
 const config = await response.json();

 export { config }; // config is guaranteed to be loaded
 ```

 **Real-World Use Cases:**

 ```javascript
 // 1. Loading configuration before app starts
 // config.js
 const response = await fetch('/api/config');
 export const config = await response.json();

 // 2. Conditional module loading
 // feature.js
 const isDevelopment = process.env.NODE_ENV === 'development';
 const debugModule = isDevelopment 
   ? await import('./debug-tools.js')
   : null;

 export const debug = debugModule?.debug || (() => {});

 // 3. Database connection
 // db.js
 import { MongoClient } from 'mongodb';

 const client = new MongoClient(process.env.DB_URL);
 await client.connect();
 export const db = client.db('myapp');
 console.log('Database connected!');

 // 4. Establishing dependencies
 // auth.js
 const permissions = await fetch('/api/permissions').then(r => r.json());
 export const hasPermission = (user, action) => {
   return permissions[user]?.includes(action) || false;
 };

 // 5. Feature detection
 // capabilities.js
 let wasmSupported = false;
 try {
   await WebAssembly.instantiate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]));
   wasmSupported = true;
 } catch {}

 export { wasmSupported };
 ```

 **Module Import Blocking:**

 ```javascript
 // slow-module.js
 console.log('Starting slow module');
 await new Promise(resolve => setTimeout(resolve, 3000));
 console.log('Slow module ready');
 export const data = 'Loaded!';

 // main.js
 console.log('Before import');
 import { data } from './slow-module.js'; // Waits for top-level await
 console.log('After import:', data);

 // Console output:
 // "Before import"
 // "Starting slow module"
 // ... 3 second pause ...
 // "Slow module ready"
 // "After import: Loaded!"
 ```

 **Execution Order with Multiple Modules:**

 ```javascript
 // a.js
 console.log('A: start');
 await new Promise(r => setTimeout(r, 100));
 console.log('A: end');
 export const a = 'A';

 // b.js
 console.log('B: start');
 import { a } from './a.js';
 console.log('B: got', a);
 export const b = 'B';

 // main.js
 console.log('Main: start');
 import { b } from './b.js';
 import { a } from './a.js';
 console.log('Main:', a, b);

 // Output:
 // "A: start"
 // (100ms pause)
 // "A: end"
 // "B: start"
 // "B: got A"
 // "Main: start"
 // "Main: A B"
 ```

 **Error Handling:**

 ```javascript
 // data-loader.js
 let data;
 try {
   const response = await fetch('/api/data');
   if (!response.ok) throw new Error('Failed to fetch');
   data = await response.json();
 } catch (error) {
   console.error('Failed to load data:', error);
   data = { default: true }; // Fallback data
 }

 export { data };
 ```

 **Important Considerations:**

 1. **Performance**: Top-level await blocks the entire module graph, so use sparingly
 2. **Error Impact**: If a top-level await rejects and isn't caught, it can prevent module loading
 3. **Not for Scripts**: Only works in ES modules (files with `type="module"` or `.mjs` extension)
 4. **Circular Dependencies**: Be careful with circular imports when using top-level await

 ```javascript
 // ❌ Don't do this - blocks everything
 await new Promise(r => setTimeout(r, 10000)); // 10 second delay!

 // ✅ Better approach for initialization
 const dataPromise = fetch('/api/data').then(r => r.json());
 export const getData = () => dataPromise; // Let consumers decide when to await
 ```

### 485. What are WeakRef and FinalizationRegistry used for?

`WeakRef` and `FinalizationRegistry` are advanced features (introduced in ES2021) for managing memory and object lifecycles in JavaScript. They provide low-level control over garbage collection behavior.

 **WeakRef (Weak Reference):**

 A `WeakRef` creates a weak reference to an object, meaning it doesn't prevent the object from being garbage collected. Unlike regular references, holding a WeakRef doesn't keep the object alive.

 **Syntax:**

 ```javascript
 const weakRef = new WeakRef(targetObject);
 const obj = weakRef.deref(); // Get the object (or undefined if collected)
 ```

 **WeakRef Examples:**

 ```javascript
 // Creating a weak reference
 let obj = { name: 'Important Data', value: 42 };
 const weakRef = new WeakRef(obj);

 // Access the object
 console.log(weakRef.deref()); // { name: 'Important Data', value: 42 }

 // Remove strong reference
 obj = null;

 // At some point, after garbage collection
 console.log(weakRef.deref()); // undefined (object was collected)

 // Practical use: Caching without memory leaks
 class ImageCache {
   #cache = new Map();

   getImage(url) {
     const weakRef = this.#cache.get(url);
     if (weakRef) {
       const image = weakRef.deref();
       if (image) {
         console.log('Cache hit!');
         return image;
       }
     }

     // Load image if not in cache or was collected
     console.log('Cache miss, loading...');
     const newImage = this.loadImage(url);
     this.#cache.set(url, new WeakRef(newImage));
     return newImage;
   }

   loadImage(url) {
     // Simulate loading
     return { url, data: `Image data for ${url}` };
   }
 }

 const cache = new ImageCache();
 const img1 = cache.getImage('photo.jpg'); // Cache miss
 const img2 = cache.getImage('photo.jpg'); // Cache hit!
 ```

 **FinalizationRegistry:**

 `FinalizationRegistry` allows you to register callbacks that run after objects are garbage collected. This enables cleanup actions when objects are no longer needed.

 **Syntax:**

 ```javascript
 const registry = new FinalizationRegistry((heldValue) => {
   // Cleanup callback when object is garbage collected
   console.log('Cleaning up:', heldValue);
 });

 registry.register(targetObject, heldValue, unregisterToken);
 ```

 **FinalizationRegistry Examples:**

 ```javascript
 // Basic usage
 const registry = new FinalizationRegistry((filename) => {
   console.log(`File ${filename} can be deleted - object was collected`);
   // Perform cleanup: close file handles, free resources, etc.
 });

 let fileObject = { name: 'temp.txt', handle: 'handle123' };
 registry.register(fileObject, 'temp.txt');

 // When fileObject is garbage collected, the callback runs
 fileObject = null; // Remove strong reference

 // Real-world example: Resource management
 class FileManager {
   #registry = new FinalizationRegistry((filepath) => {
     this.#closeFile(filepath);
   });

   #openFiles = new Map();

   openFile(filepath) {
     const handle = this.#actuallyOpenFile(filepath);
     const file = { filepath, handle };
     
     this.#openFiles.set(filepath, handle);
     this.#registry.register(file, filepath);
     
     return file;
   }

   #actuallyOpenFile(filepath) {
     console.log(`Opening ${filepath}`);
     return { /* file handle */ };
   }

   #closeFile(filepath) {
     const handle = this.#openFiles.get(filepath);
     if (handle) {
       console.log(`Auto-closing ${filepath}`);
       // Close file handle
       this.#openFiles.delete(filepath);
     }
   }
 }

 // Database connection pooling
 class ConnectionPool {
   #registry = new FinalizationRegistry((connectionId) => {
     console.log(`Connection ${connectionId} released`);
     this.#releaseConnection(connectionId);
   });

   #connections = new Map();

   getConnection() {
     const connectionId = Math.random().toString(36);
     const connection = { id: connectionId, query: () => {} };
     
     this.#connections.set(connectionId, connection);
     this.#registry.register(connection, connectionId);
     
     return connection;
   }

   #releaseConnection(connectionId) {
     this.#connections.delete(connectionId);
     // Return connection to pool
   }
 }

 // Using unregister token to prevent cleanup
 const cleanupRegistry = new FinalizationRegistry((msg) => {
   console.log('Cleanup:', msg);
 });

 let importantObj = { data: 'important' };
 const token = {}; // Unregister token

 cleanupRegistry.register(importantObj, 'important data', token);

 // Later, if you want to prevent cleanup
 cleanupRegistry.unregister(token); // Callback won't run even after GC
 ```

 **Combined Example - Cache with Cleanup:**

 ```javascript
 class SmartCache {
   #cache = new Map();
   #registry = new FinalizationRegistry((key) => {
     console.log(`Removing cache entry: ${key}`);
     this.#cache.delete(key);
   });

   set(key, value) {
     const weakRef = new WeakRef(value);
     this.#cache.set(key, weakRef);
     this.#registry.register(value, key, weakRef);
   }

   get(key) {
     const weakRef = this.#cache.get(key);
     if (!weakRef) return undefined;

     const value = weakRef.deref();
     if (value === undefined) {
       // Object was collected, clean up map
       this.#cache.delete(key);
     }
     return value;
   }

   has(key) {
     return this.get(key) !== undefined;
   }

   delete(key) {
     const weakRef = this.#cache.get(key);
     if (weakRef) {
       this.#registry.unregister(weakRef);
       this.#cache.delete(key);
     }
   }
 }

 const cache = new SmartCache();
 let data = { huge: 'dataset' };
 cache.set('myData', data);
 
 console.log(cache.get('myData')); // { huge: 'dataset' }
 
 data = null; // Remove strong reference
 // After GC, cache entry is automatically cleaned up
 ```

 **Important Caveats:**

 1. **Non-Deterministic**: Garbage collection timing is unpredictable
 2. **No Guarantees**: The finalization callback may never run (e.g., if the process exits)
 3. **Performance**: These are advanced features; use only when necessary
 4. **Avoid Over-Use**: Regular JavaScript patterns are usually better
 5. **Not for Critical Logic**: Don't rely on finalization for business logic

 **When to Use:**

 - ✅ Caching large objects that can be recreated
 - ✅ Managing native resources (file handles, sockets)
 - ✅ Automatic cleanup of external resources
 - ✅ Memory-sensitive applications
 - ❌ Not for regular object lifecycle management
 - ❌ Not for critical cleanup (use explicit cleanup instead)

### 486. What are logical assignment operators?

Logical assignment operators (introduced in ES2021) combine logical operations (`&&`, `||`, `??`) with assignment (`=`). They provide a concise way to assign values based on logical conditions.

 **The Three Operators:**

 1. **`&&=`** - Logical AND assignment
 2. **`||=`** - Logical OR assignment  
 3. **`??=`** - Nullish coalescing assignment

 **Logical AND Assignment (&&=):**

 Assigns the right-hand value only if the left-hand value is truthy.

 ```javascript
 // Syntax: x &&= y
 // Equivalent to: x && (x = y)
 // or: if (x) { x = y; }

 let user = { name: 'Alice', admin: true };

 // Traditional approach
 if (user.admin) {
   user.admin = 'super';
 }

 // With &&=
 user.admin &&= 'super';
 console.log(user.admin); // 'super'

 let guest = { name: 'Bob', admin: false };
 guest.admin &&= 'super';
 console.log(guest.admin); // false (unchanged, because falsy)

 // Practical example: Conditional transformation
 const data = {
   username: 'john_doe',
   email: 'JOHN@EXAMPLE.COM'
 };

 // Normalize email only if it exists
 data.email &&= data.email.toLowerCase();
 console.log(data.email); // 'john@example.com'

 // Use case: Applying transformations
 const product = { name: 'Widget', price: 29.99 };
 product.price &&= product.price * 1.1; // Apply 10% increase
 console.log(product.price); // 32.989
 ```

 **Logical OR Assignment (||=):**

 Assigns the right-hand value only if the left-hand value is falsy.

 ```javascript
 // Syntax: x ||= y
 // Equivalent to: x || (x = y)
 // or: if (!x) { x = y; }

 let config = { timeout: 0 };

 // Traditional approach
 if (!config.timeout) {
   config.timeout = 3000;
 }

 // With ||=
 config.timeout ||= 3000;
 console.log(config.timeout); // 3000

 // Setting default values
 let options = {};
 options.theme ||= 'dark';
 options.lang ||= 'en';
 options.debug ||= false;

 console.log(options); // { theme: 'dark', lang: 'en', debug: false }

 // Practical example: Form defaults
 function processForm(formData) {
   formData.country ||= 'USA';
   formData.newsletter ||= false;
   formData.age ||= 18;
   return formData;
 }

 console.log(processForm({ name: 'Alice' }));
 // { name: 'Alice', country: 'USA', newsletter: false, age: 18 }

 // Use case: Lazy initialization
 class Calculator {
   #cache;

   compute(x) {
     this.#cache ||= new Map(); // Initialize only once
     
     if (!this.#cache.has(x)) {
       this.#cache.set(x, x * x);
     }
     return this.#cache.get(x);
   }
 }
 ```

 **Nullish Coalescing Assignment (??=):**

 Assigns the right-hand value only if the left-hand value is `null` or `undefined` (nullish).

 ```javascript
 // Syntax: x ??= y
 // Equivalent to: x ?? (x = y)
 // or: if (x === null || x === undefined) { x = y; }

 let settings = { volume: 0, brightness: null };

 // Traditional approach
 if (settings.brightness === null || settings.brightness === undefined) {
   settings.brightness = 50;
 }

 // With ??=
 settings.volume ??= 50;      // Unchanged (0 is not nullish)
 settings.brightness ??= 50;  // Changed (null is nullish)

 console.log(settings); // { volume: 0, brightness: 50 }

 // Key difference from ||=
 let data = {
   count: 0,
   active: false,
   name: ''
 };

 // With ||= (treats falsy values as missing)
 let copy1 = { ...data };
 copy1.count ||= 10;    // Changes to 10 (0 is falsy)
 copy1.active ||= true; // Changes to true (false is falsy)
 copy1.name ||= 'Unknown'; // Changes to 'Unknown' ('' is falsy)

 // With ??= (only treats null/undefined as missing)
 let copy2 = { ...data };
 copy2.count ??= 10;    // Stays 0 (not nullish)
 copy2.active ??= true; // Stays false (not nullish)
 copy2.name ??= 'Unknown'; // Stays '' (not nullish)

 console.log(copy1); // { count: 10, active: true, name: 'Unknown' }
 console.log(copy2); // { count: 0, active: false, name: '' }

 // Practical example: API defaults
 function fetchUser(userId, options = {}) {
   options.cache ??= true;
   options.timeout ??= 5000;
   options.retries ??= 3;
   // Note: Won't override if explicitly set to 0 or false
   
   console.log('Fetching with options:', options);
 }

 fetchUser(1, { cache: false }); 
 // { cache: false, timeout: 5000, retries: 3 }
 // cache stays false (not nullish)
 ```

 **Comparison Table:**

 ```javascript
 let obj = { a: 0, b: false, c: '', d: null, e: undefined };

 // &&= (assigns if truthy)
 obj.a &&= 100; // Unchanged (0 is falsy)
 obj.b &&= 100; // Unchanged (false is falsy)
 obj.c &&= 100; // Unchanged ('' is falsy)

 // ||= (assigns if falsy)
 obj.a ||= 100; // Changes to 100
 obj.b ||= 100; // Changes to 100
 obj.c ||= 100; // Changes to 100

 // ??= (assigns if nullish)
 obj.a ??= 100; // Unchanged (0 is not nullish)
 obj.b ??= 100; // Unchanged (false is not nullish)
 obj.c ??= 100; // Unchanged ('' is not nullish)
 obj.d ??= 100; // Changes to 100 (null is nullish)
 obj.e ??= 100; // Changes to 100 (undefined is nullish)
 ```

 **Real-World Examples:**

 ```javascript
 // 1. Component state management
 class Component {
   state = {};

   setState(newState) {
     // Merge with defaults
     newState.loading ??= false;
     newState.error ??= null;
     newState.data ??= [];
     this.state = { ...this.state, ...newState };
   }
 }

 // 2. Configuration merging
 function createConfig(userConfig) {
   const config = { ...userConfig };
   config.env ??= 'production';
   config.debug ??= false;
   config.port ??= 3000;
   config.host ??= 'localhost';
   return config;
 }

 // 3. Memoization
 const memoize = (fn) => {
   const cache = new Map();
   return (arg) => {
     cache.has(arg) ||= cache.set(arg, fn(arg));
     return cache.get(arg);
   };
 };

 // 4. Safe property updates
 function updateUser(user, updates) {
   user.lastModified &&= new Date(); // Only if already has lastModified
   user.email ??= updates.email;      // Only if email is missing
   user.role ||= 'user';              // Only if role is falsy
   return user;
 }
 ```

 **Benefits:**

 1. **Concise**: Shorter than traditional if statements
 2. **Readable**: Clear intent - "assign if condition"
 3. **Safe**: Avoids unnecessary assignments and side effects
 4. **Performance**: Only evaluates right-hand side when needed

### 487. What is the Temporal API and why is it proposed as a replacement for Date?

The Temporal API is a modern proposal (Stage 3) to replace JavaScript's problematic `Date` object. It provides a better, more intuitive way to work with dates and times in JavaScript.

 **Problems with Date:**

 ```javascript
 // 1. Months are 0-indexed (January = 0, December = 11)
 const date1 = new Date(2024, 0, 15); // January 15, 2024 (confusing!)
 const date2 = new Date(2024, 12, 15); // Actually January 15, 2025 (overflow!)

 // 2. Mutable (can lead to bugs)
 const original = new Date('2024-01-15');
 const modified = original;
 modified.setMonth(5);
 console.log(original); // Also changed! (unexpected)

 // 3. Time zone confusion
 const date3 = new Date('2024-01-15'); // Interprets as UTC
 const date4 = new Date('2024-01-15T00:00:00'); // Interprets as local time!

 // 4. Poor API design
 date1.getYear(); // Returns 124 (not 2024!) - deprecated
 date1.getFullYear(); // Returns 2024 (correct, but confusing naming)

 // 5. No support for different calendar systems
 // Can't work with Islamic, Hebrew, Chinese calendars, etc.

 // 6. Limited date arithmetic
 // Adding months is problematic
 const jan31 = new Date(2024, 0, 31);
 jan31.setMonth(jan31.getMonth() + 1); // Feb 31 -> Mar 2 (unexpected!)
 ```

 **Temporal API Types:**

 The Temporal API provides several specialized types:

 1. **`Temporal.PlainDate`** - Date without time (e.g., birthdays, holidays)
 2. **`Temporal.PlainTime`** - Time without date (e.g., daily alarm)
 3. **`Temporal.PlainDateTime`** - Date and time without time zone
 4. **`Temporal.ZonedDateTime`** - Date, time, and time zone
 5. **`Temporal.Instant`** - Exact moment in time (like timestamps)
 6. **`Temporal.Duration`** - Length of time
 7. **`Temporal.PlainYearMonth`** - Year and month (e.g., credit card expiry)
 8. **`Temporal.PlainMonthDay`** - Month and day (e.g., recurring anniversary)

 **Basic Examples:**

 ```javascript
 // 1. Creating dates (intuitive month numbering!)
 const date = Temporal.PlainDate.from('2024-01-15');
 const date2 = Temporal.PlainDate.from({ year: 2024, month: 1, day: 15 });

 console.log(date.toString()); // "2024-01-15"
 console.log(date.month); // 1 (January is 1, not 0!)

 // 2. Immutable (returns new instance)
 const original = Temporal.PlainDate.from('2024-01-15');
 const modified = original.add({ months: 1 });

 console.log(original.toString()); // "2024-01-15" (unchanged)
 console.log(modified.toString()); // "2024-02-15" (new instance)

 // 3. Time zones (explicit and clear)
 const zonedDateTime = Temporal.ZonedDateTime.from({
   timeZone: 'America/New_York',
   year: 2024,
   month: 1,
   day: 15,
   hour: 10,
   minute: 30
 });

 console.log(zonedDateTime.toString());
 // "2024-01-15T10:30:00-05:00[America/New_York]"

 // Convert to different time zone
 const tokyo = zonedDateTime.withTimeZone('Asia/Tokyo');
 console.log(tokyo.toString());
 // "2024-01-16T00:30:00+09:00[Asia/Tokyo]"

 // 4. Date arithmetic (smart handling)
 const jan31 = Temporal.PlainDate.from('2024-01-31');
 const nextMonth = jan31.add({ months: 1 });
 console.log(nextMonth.toString()); // "2024-02-29" (handles leap year!)

 // Different overflow strategies
 const constrain = jan31.add({ months: 1 }, { overflow: 'constrain' });
 console.log(constrain.toString()); // "2024-02-29"

 const reject = jan31.add({ months: 1 }, { overflow: 'reject' });
 // Throws RangeError: date doesn't exist

 // 5. Duration calculations
 const start = Temporal.PlainDate.from('2024-01-15');
 const end = Temporal.PlainDate.from('2024-03-20');
 const duration = start.until(end);

 console.log(duration.toString()); // "P2M5D" (2 months, 5 days)
 console.log(duration.total({ unit: 'days' })); // 65
 ```

 **Real-World Use Cases:**

 ```javascript
 // 1. Birthday calculator
 function getAge(birthDate) {
   const today = Temporal.Now.plainDateISO();
   const birth = Temporal.PlainDate.from(birthDate);
   const age = birth.until(today, { largestUnit: 'years' });
   return age.years;
 }

 console.log(getAge('1990-05-15')); // Current age

 // 2. Business days calculation
 function addBusinessDays(date, days) {
   let current = Temporal.PlainDate.from(date);
   let remaining = days;

   while (remaining > 0) {
     current = current.add({ days: 1 });
     const dayOfWeek = current.dayOfWeek;
     if (dayOfWeek !== 6 && dayOfWeek !== 7) { // Not weekend
       remaining--;
     }
   }

   return current;
 }

 console.log(addBusinessDays('2024-01-15', 5).toString());

 // 3. Meeting scheduler (with time zones)
 function scheduleMeeting(localTime, attendeeTimeZones) {
   const meeting = Temporal.ZonedDateTime.from(localTime);
   
   return attendeeTimeZones.map(tz => ({
     timeZone: tz,
     time: meeting.withTimeZone(tz).toString()
   }));
 }

 const times = scheduleMeeting(
   '2024-01-15T14:00:00[America/New_York]',
   ['America/Los_Angeles', 'Europe/London', 'Asia/Tokyo']
 );

 console.log(times);
 // [
 //   { timeZone: 'America/Los_Angeles', time: '2024-01-15T11:00:00-08:00[America/Los_Angeles]' },
 //   { timeZone: 'Europe/London', time: '2024-01-15T19:00:00+00:00[Europe/London]' },
 //   { timeZone: 'Asia/Tokyo', time: '2024-01-16T04:00:00+09:00[Asia/Tokyo]' }
 // ]

 // 4. Recurring events
 function getNextOccurrence(monthDay, fromDate) {
   const target = Temporal.PlainMonthDay.from(monthDay);
   const current = Temporal.PlainDate.from(fromDate);
   
   let next = target.toPlainDate({ year: current.year });
   if (Temporal.PlainDate.compare(next, current) <= 0) {
     next = target.toPlainDate({ year: current.year + 1 });
   }
   
   return next;
 }

 console.log(getNextOccurrence('12-25', '2024-01-15').toString());
 // "2024-12-25" (next Christmas)

 // 5. Duration formatting
 function formatDuration(start, end) {
   const duration = Temporal.Instant.from(start)
     .until(Temporal.Instant.from(end));
   
   const hours = Math.floor(duration.total({ unit: 'hours' }));
   const minutes = Math.floor(duration.total({ unit: 'minutes' }) % 60);
   
   return `${hours}h ${minutes}m`;
 }

 console.log(formatDuration(
   '2024-01-15T10:00:00Z',
   '2024-01-15T13:45:00Z'
 )); // "3h 45m"

 // 6. Calendar systems
 const gregorian = Temporal.PlainDate.from('2024-01-15');
 const islamic = gregorian.withCalendar('islamic');
 const hebrew = gregorian.withCalendar('hebrew');

 console.log(gregorian.toString()); // "2024-01-15"
 console.log(islamic.toString()); // "1445-07-04[u-ca=islamic]"
 console.log(hebrew.toString()); // "5784-10-04[u-ca=hebrew]"
 ```

 **Comparison with Date:**

 ```javascript
 // Date (old way)
 const date = new Date();
 date.setMonth(date.getMonth() + 1); // Mutates original

 // Temporal (new way)
 const temporal = Temporal.Now.plainDateISO();
 const next = temporal.add({ months: 1 }); // Immutable

 // Time zone conversions
 // Date: Complex and error-prone
 const dateNY = new Date('2024-01-15T10:00:00');
 const dateUTC = new Date(dateNY.toISOString());
 // Messy and unreliable

 // Temporal: Clear and explicit
 const temporalNY = Temporal.ZonedDateTime.from({
   timeZone: 'America/New_York',
   year: 2024, month: 1, day: 15,
   hour: 10, minute: 0
 });
 const temporalUTC = temporalNY.withTimeZone('UTC');
 ```

 **Current Status and Usage:**

 ```javascript
 // As of 2026, Temporal is Stage 3 (not yet in browsers by default)
 // Use with a polyfill:
 // npm install @js-temporal/polyfill

 import { Temporal } from '@js-temporal/polyfill';

 // Or use in browsers with feature detection:
 if (typeof Temporal === 'undefined') {
   // Fall back to Date or load polyfill
   console.warn('Temporal not supported, using Date');
 } else {
   // Use Temporal
   const date = Temporal.Now.plainDateISO();
 }
 ```

 **Benefits of Temporal:**

 1. ✅ **Immutable**: Safer, predictable behavior
 2. ✅ **Intuitive API**: Months start at 1, not 0
 3. ✅ **Time Zone Aware**: First-class time zone support
 4. ✅ **Type Safe**: Different types for different use cases
 5. ✅ **Calendar Support**: Works with non-Gregorian calendars
 6. ✅ **Better Arithmetic**: Smart date calculations
 7. ✅ **ISO 8601**: Native support for standard date format
 8. ✅ **No Legacy Baggage**: Clean slate, modern design

### 488. What is the difference between for loop and forEach

Both are used to iterate over arrays, but they differ in performance, flexibility, and purpose.

 The `for` loop is a core JavaScript statement that gives you full control over iteration:
  ```javascript
  const arr = [1, 2, 3];
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
  ```

 The `forEach` is an array method introduced in ES5 that accepts a callback and calls it for each element:

  ```javascript
  const arr = [1, 2, 3];
  arr.forEach((num) => console.log(num));
  ```

 **Why is `for` loop faster?**

 `forEach` has two sources of overhead on every iteration: first, it
 invokes your callback using `.call()` (a function call has a cost).
 Second, it checks for empty slots in the array (`i in this`) on every
 single iteration even when the array has no empty slots at all. The
 `for` loop does neither of these things, and JavaScript engines like
 V8 are highly optimized for its simple counter pattern.

 **Why was `forEach` created?**

 For readability. The classic `for (let i = 0; i < arr.length; i++)`
 is noisy you have to declare a counter, write a condition, and
 increment manually, just to access each element. `forEach` hides all
 of that mechanics and lets you focus on the element itself. Arrow
 functions later made it even cleaner. However, they also made its
 optional `thisArg` parameter (used to set `this` inside the callback)
 mostly obsolete, since arrow functions inherit `this` automatically.

 **When to use which:**
  ```javascript
  // Use forEach — simple iterations where readability matters
  arr.forEach((num) => console.log(num));

  // Use for loop — when you need break, continue, or max performance
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) break; // impossible with forEach
  }
  ```

 **Note:** The `for` loop is strictly more powerful anything `forEach` does, `for` loop can do too, but not the other way around.

### 489. What are Symbols and what are their use cases?

Symbol is a primitive data type introduced in ES6 that creates unique and immutable values. Each Symbol value is guaranteed to be unique, even if they have the same description.

 ```javascript
 const sym1 = Symbol('description');
 const sym2 = Symbol('description');
 console.log(sym1 === sym2); // false
 ```

 **Common use cases:**

 1. **Creating unique property keys:**
    ```javascript
    const id = Symbol('id');
    const obj = {
      [id]: 12345,
      name: 'John'
    };
    console.log(obj[id]); // 12345
    ```

 2. **Preventing property name collisions:**
    ```javascript
    const myLib = {
      [Symbol('internal')]: 'private data',
      publicMethod() {}
    };
    ```

 3. **Implementing well-known symbols (Symbol.iterator, Symbol.toStringTag, etc.):**
    ```javascript
    class Collection {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
      }
    }
    ```

 **Note:** Symbol properties are not enumerable in `for...in` loops or `Object.keys()`, making them useful for metadata and internal object properties.

### 490. What is the difference between Object.create() and Object.assign()?

`Object.create()` and `Object.assign()` serve completely different purposes:

 **Object.create()** creates a new object with a specified prototype:
 ```javascript
 const proto = { greet() { console.log('Hello'); } };
 const obj = Object.create(proto);
 obj.greet(); // 'Hello'
 console.log(Object.getPrototypeOf(obj) === proto); // true
 ```

 **Object.assign()** copies properties from source objects to a target object:
 ```javascript
 const target = { a: 1 };
 const source = { b: 2, c: 3 };
 Object.assign(target, source);
 console.log(target); // { a: 1, b: 2, c: 3 }
 ```

 **Key differences:**

 | Object.create() | Object.assign() |
 |----------------|-----------------|
 | Creates new object | Modifies existing object |
 | Sets prototype chain | Copies own properties |
 | For inheritance | For composition/merging |
 | Returns new object | Returns modified target |

 ```javascript
 // Object.create with properties
 const obj1 = Object.create(proto, {
   name: { value: 'John', writable: true }
 });

 // Object.assign with multiple sources
 const merged = Object.assign({}, source1, source2, source3);
 ```

### 491. What are generator functions and how do they work?

Generator functions are special functions that can pause execution and resume later, allowing them to produce a sequence of values over time instead of computing them all at once.

 ```javascript
 function* numberGenerator() {
   yield 1;
   yield 2;
   yield 3;
 }

 const gen = numberGenerator();
 console.log(gen.next()); // { value: 1, done: false }
 console.log(gen.next()); // { value: 2, done: false }
 console.log(gen.next()); // { value: 3, done: false }
 console.log(gen.next()); // { value: undefined, done: true }
 ```

 **Key features:**

 1. **Lazy evaluation:**
    ```javascript
    function* infiniteSequence() {
      let i = 0;
      while (true) {
        yield i++;
      }
    }
    ```

 2. **Two-way communication:**
    ```javascript
    function* twoWay() {
      const x = yield 'First';
      yield `Got: ${x}`;
    }

    const gen = twoWay();
    console.log(gen.next());      // { value: 'First', done: false }
    console.log(gen.next('data')); // { value: 'Got: data', done: false }
    ```

 3. **Delegating to other generators:**
    ```javascript
    function* gen1() { yield 1; yield 2; }
    function* gen2() {
      yield* gen1();
      yield 3;
    }
    ```

 **Practical uses:** iterating large datasets, implementing custom iterators, managing async flows (though async/await is now preferred).

### 492. What is the Reflect API and when should you use it?

The Reflect API is a built-in object that provides methods for interceptable JavaScript operations. It mirrors many Object methods but with some improvements.

 ```javascript
 const obj = { name: 'John', age: 30 };

 // Setting properties
 Reflect.set(obj, 'city', 'New York');

 // Getting properties
 console.log(Reflect.get(obj, 'name')); // 'John'

 // Checking property existence
 console.log(Reflect.has(obj, 'age')); // true

 // Deleting properties
 Reflect.deleteProperty(obj, 'age');
 ```

 **Advantages over Object methods:**

 1. **Returns boolean for success/failure:**
    ```javascript
    // Object.defineProperty throws on failure
    try {
      Object.defineProperty(obj, 'prop', { value: 1 });
    } catch (e) {}

    // Reflect.defineProperty returns boolean
    const success = Reflect.defineProperty(obj, 'prop', { value: 1 });
    ```

 2. **Works perfectly with Proxy traps:**
    ```javascript
    const handler = {
      set(target, prop, value, receiver) {
        console.log(`Setting ${prop} to ${value}`);
        return Reflect.set(target, prop, value, receiver);
      }
    };

    const proxy = new Proxy({}, handler);
    proxy.name = 'John'; // Logs: Setting name to John
    ```

 3. **Function.prototype.apply made simpler:**
    ```javascript
    // Old way
    Function.prototype.apply.call(Math.max, null, [1, 2, 3]);

    // Reflect way
    Reflect.apply(Math.max, null, [1, 2, 3]); // 3
    ```

### 493. How does JavaScript handle floating point precision issues?

JavaScript uses IEEE 754 double-precision (64-bit) floating-point format, which can cause precision issues with decimal numbers.

 ```javascript
 console.log(0.1 + 0.2); // 0.30000000000000004
 console.log(0.1 + 0.2 === 0.3); // false
 ```

 **Solutions:**

 1. **Using epsilon comparison:**
    ```javascript
    function areEqual(a, b) {
      return Math.abs(a - b) < Number.EPSILON;
    }
    console.log(areEqual(0.1 + 0.2, 0.3)); // true
    ```

 2. **Rounding to fixed decimals:**
    ```javascript
    const result = Math.round((0.1 + 0.2) * 100) / 100; // 0.3
    ```

 3. **Using toFixed() or toPrecision():**
    ```javascript
    const sum = (0.1 + 0.2).toFixed(2); // "0.30"
    const num = parseFloat(sum); // 0.3
    ```

 4. **Working with integers (cents instead of dollars):**
    ```javascript
    const price1 = 10; // $0.10 as 10 cents
    const price2 = 20; // $0.20 as 20 cents
    const total = price1 + price2; // 30 cents
    const dollars = total / 100; // $0.30
    ```

 5. **Using libraries for precise calculations:**
    ```javascript
    // decimal.js, big.js, or bignumber.js
    const Decimal = require('decimal.js');
    const result = new Decimal(0.1).plus(0.2); // 0.3
    ```

### 494. What are tagged template literals and their practical uses?

Tagged template literals allow you to parse template literals with a function, giving you full control over the interpolation process.

 ```javascript
 function tag(strings, ...values) {
   console.log(strings); // Array of string literals
   console.log(values);  // Array of interpolated values
   return 'processed';
 }

 const name = 'John';
 const age = 30;
 const result = tag`Hello ${name}, you are ${age} years old`;
 // strings: ['Hello ', ', you are ', ' years old']
 // values: ['John', 30]
 ```

 **Practical use cases:**

 1. **HTML escaping for security:**
    ```javascript
    function html(strings, ...values) {
      return strings.reduce((result, str, i) => {
        const value = values[i - 1];
        const escaped = String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return result + escaped + str;
      });
    }

    const userInput = '<script>alert("XSS")</script>';
    const safe = html`<div>${userInput}</div>`;
    ```

 2. **Internationalization (i18n):**
    ```javascript
    function i18n(strings, ...values) {
      // Look up translation for the template
      return translate(strings, values);
    }

    const greeting = i18n`Hello ${userName}!`;
    ```

 3. **SQL query building:**
    ```javascript
    function sql(strings, ...values) {
      // Safely escape values to prevent SQL injection
      return {
        text: strings.reduce((query, str, i) => 
          query + str + (i < values.length ? `$${i + 1}` : ''),
        ''),
        values: values
      };
    }

    const query = sql`SELECT * FROM users WHERE id = ${userId}`;
    ```

 4. **Styled-components (CSS-in-JS):**
    ```javascript
    const Button = styled.button`
      background: ${props => props.primary ? 'blue' : 'white'};
      color: ${props => props.primary ? 'white' : 'blue'};
    `;
    ```

### 495. What is the difference between Object.keys(), Object.values(), and Object.entries()?

These three methods extract different parts of an object's own enumerable properties:

 ```javascript
 const person = {
   name: 'John',
   age: 30,
   city: 'New York'
 };

 // Object.keys() - returns array of property names
 console.log(Object.keys(person));
 // ['name', 'age', 'city']

 // Object.values() - returns array of property values
 console.log(Object.values(person));
 // ['John', 30, 'New York']

 // Object.entries() - returns array of [key, value] pairs
 console.log(Object.entries(person));
 // [['name', 'John'], ['age', 30], ['city', 'New York']]
 ```

 **Common use cases:**

 1. **Object.keys() for iteration:**
    ```javascript
    Object.keys(person).forEach(key => {
      console.log(`${key}: ${person[key]}`);
    });
    ```

 2. **Object.values() for value processing:**
    ```javascript
    const sum = Object.values({ a: 1, b: 2, c: 3 })
      .reduce((acc, val) => acc + val, 0); // 6
    ```

 3. **Object.entries() for Map conversion:**
    ```javascript
    const map = new Map(Object.entries(person));
    
    // Or converting back from Map to Object
    const obj = Object.fromEntries(map);
    ```

 4. **Object.entries() for filtering:**
    ```javascript
    const filtered = Object.fromEntries(
      Object.entries(person).filter(([key, value]) => 
        typeof value === 'string'
      )
    );
    ```

 **Note:** All three methods only return own, enumerable properties, not inherited ones.

### 496. What is the Intl.NumberFormat API and how is it used?

The `Intl.NumberFormat` API provides language-sensitive number formatting, allowing you to format numbers according to locale-specific conventions.

 ```javascript
 // Basic usage
 const formatter = new Intl.NumberFormat('en-US');
 console.log(formatter.format(1234567.89)); // "1,234,567.89"

 // Different locales
 console.log(new Intl.NumberFormat('de-DE').format(1234567.89));
 // "1.234.567,89"

 console.log(new Intl.NumberFormat('hi-IN').format(1234567.89));
 // "12,34,567.89"
 ```

 **Currency formatting:**
 ```javascript
 const usdFormatter = new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD'
 });
 console.log(usdFormatter.format(1234.56)); // "$1,234.56"

 const euroFormatter = new Intl.NumberFormat('de-DE', {
   style: 'currency',
   currency: 'EUR'
 });
 console.log(euroFormatter.format(1234.56)); // "1.234,56 €"
 ```

 **Percentage formatting:**
 ```javascript
 const percentFormatter = new Intl.NumberFormat('en-US', {
   style: 'percent',
   minimumFractionDigits: 2
 });
 console.log(percentFormatter.format(0.1234)); // "12.34%"
 ```

 **Unit formatting:**
 ```javascript
 const distanceFormatter = new Intl.NumberFormat('en-US', {
   style: 'unit',
   unit: 'kilometer',
   unitDisplay: 'long'
 });
 console.log(distanceFormatter.format(50)); // "50 kilometers"
 ```

 **Advanced options:**
 ```javascript
 const formatter = new Intl.NumberFormat('en-US', {
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
   useGrouping: true
 });
 console.log(formatter.format(1234.5)); // "1,234.50"
 ```

### 497. How do you implement method chaining in JavaScript?

Method chaining is a pattern where multiple methods are called on the same object sequentially by returning `this` from each method.

 ```javascript
 class Calculator {
   constructor(value = 0) {
     this.value = value;
   }

   add(num) {
     this.value += num;
     return this; // Enable chaining
   }

   subtract(num) {
     this.value -= num;
     return this;
   }

   multiply(num) {
     this.value *= num;
     return this;
   }

   divide(num) {
     this.value /= num;
     return this;
   }

   getResult() {
     return this.value;
   }
 }

 const result = new Calculator(10)
   .add(5)
   .multiply(2)
   .subtract(3)
   .getResult();

 console.log(result); // 27
 ```

 **Advanced pattern with error handling:**
 ```javascript
 class QueryBuilder {
   constructor() {
     this.query = '';
     this.params = [];
   }

   select(...fields) {
     this.query = `SELECT ${fields.join(', ')}`;
     return this;
   }

   from(table) {
     this.query += ` FROM ${table}`;
     return this;
   }

   where(condition, ...params) {
     this.query += ` WHERE ${condition}`;
     this.params.push(...params);
     return this;
   }

   build() {
     return { query: this.query, params: this.params };
   }
 }

 const query = new QueryBuilder()
   .select('id', 'name', 'email')
   .from('users')
   .where('age > ?', 18)
   .build();
 ```

 **Immutable chaining pattern:**
 ```javascript
 class ImmutableArray {
   constructor(arr = []) {
     this.arr = arr;
   }

   map(fn) {
     return new ImmutableArray(this.arr.map(fn));
   }

   filter(fn) {
     return new ImmutableArray(this.arr.filter(fn));
   }

   value() {
     return this.arr;
   }
 }

 const result = new ImmutableArray([1, 2, 3, 4])
   .map(x => x * 2)
   .filter(x => x > 4)
   .value(); // [6, 8]
 ```

### 498. What are the differences between Map and Object for storing key-value pairs?

While both Map and Object store key-value pairs, they have significant differences:

 **Key types:**
 ```javascript
 // Object - keys are always strings or symbols
 const obj = {};
 obj[1] = 'one';
 console.log(Object.keys(obj)); // ['1'] - converted to string

 // Map - keys can be any type
 const map = new Map();
 map.set(1, 'one');
 map.set({}, 'object');
 map.set(() => {}, 'function');
 ```

 **Size property:**
 ```javascript
 const map = new Map([['a', 1], ['b', 2]]);
 console.log(map.size); // 2

 const obj = { a: 1, b: 2 };
 console.log(Object.keys(obj).length); // Manual counting
 ```

 **Iteration:**
 ```javascript
 const map = new Map([['a', 1], ['b', 2]]);

 // Map is directly iterable
 for (const [key, value] of map) {
   console.log(key, value);
 }

 // Object requires Object.entries()
 for (const [key, value] of Object.entries(obj)) {
   console.log(key, value);
 }
 ```

 **Comparison table:**

 | Feature | Map | Object |
 |---------|-----|--------|
 | Key types | Any type | String/Symbol only |
 | Size | `map.size` | `Object.keys(obj).length` |
 | Iteration | Direct iteration | Requires conversion |
 | Order | Insertion order guaranteed | Not guaranteed (pre-ES2015) |
 | Performance | Better for frequent additions/deletions | Better for simple lookups |
 | Prototype | No prototype pollution risk | Has prototype chain |
 | JSON support | No direct support | Native support |

 **When to use Map:**
 ```javascript
 // Frequent additions and deletions
 const cache = new Map();
 cache.set(key1, value1);
 cache.delete(key1);

 // Non-string keys
 const weakMap = new Map();
 const domElement = document.getElementById('btn');
 weakMap.set(domElement, { clicks: 0 });
 ```

 **When to use Object:**
 ```javascript
 // Simple data structures
 const config = {
   apiUrl: 'https://api.example.com',
   timeout: 5000
 };

 // JSON serialization needed
 const data = { name: 'John', age: 30 };
 JSON.stringify(data);
 ```

### 499. What is the purpose of Symbol.iterator and how do you use it?

`Symbol.iterator` is a well-known symbol that specifies the default iterator for an object, making it iterable with `for...of` loops and spread operators.

 ```javascript
 // Built-in iterables use Symbol.iterator
 const arr = [1, 2, 3];
 const iterator = arr[Symbol.iterator]();

 console.log(iterator.next()); // { value: 1, done: false }
 console.log(iterator.next()); // { value: 2, done: false }
 console.log(iterator.next()); // { value: 3, done: false }
 console.log(iterator.next()); // { value: undefined, done: true }
 ```

 **Creating custom iterables:**
 ```javascript
 class Range {
   constructor(start, end) {
     this.start = start;
     this.end = end;
   }

   [Symbol.iterator]() {
     let current = this.start;
     const end = this.end;

     return {
       next() {
         if (current <= end) {
           return { value: current++, done: false };
         }
         return { done: true };
       }
     };
   }
 }

 const range = new Range(1, 5);
 for (const num of range) {
   console.log(num); // 1, 2, 3, 4, 5
 }

 console.log([...range]); // [1, 2, 3, 4, 5]
 ```

 **Using generator function:**
 ```javascript
 class Countdown {
   constructor(start) {
     this.start = start;
   }

   *[Symbol.iterator]() {
     for (let i = this.start; i >= 0; i--) {
       yield i;
     }
   }
 }

 const countdown = new Countdown(5);
 console.log([...countdown]); // [5, 4, 3, 2, 1, 0]
 ```

 **Practical example - infinite sequence:**
 ```javascript
 const fibonacci = {
   [Symbol.iterator]() {
     let prev = 0, curr = 1;
     return {
       next() {
         [prev, curr] = [curr, prev + curr];
         return { value: prev, done: false };
       }
     };
   }
 };

 // Get first 10 fibonacci numbers
 const fib10 = [];
 for (const num of fibonacci) {
   fib10.push(num);
   if (fib10.length === 10) break;
 }
 console.log(fib10); // [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
 ```

### 500. How does the Intersection Observer API work?

The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or the viewport.

 **Basic usage:**
 ```javascript
 const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
     if (entry.isIntersecting) {
       console.log('Element is visible');
       entry.target.classList.add('visible');
     } else {
       console.log('Element is not visible');
     }
   });
 });

 const target = document.querySelector('.observe-me');
 observer.observe(target);
 ```

 **Lazy loading images:**
 ```javascript
 const imageObserver = new IntersectionObserver((entries, observer) => {
   entries.forEach(entry => {
     if (entry.isIntersecting) {
       const img = entry.target;
       img.src = img.dataset.src;
       img.classList.add('loaded');
       observer.unobserve(img); // Stop observing after loading
     }
   });
 });

 document.querySelectorAll('img[data-src]').forEach(img => {
   imageObserver.observe(img);
 });
 ```

 **Infinite scrolling:**
 ```javascript
 const infiniteScroll = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
     if (entry.isIntersecting) {
       loadMoreContent();
     }
   });
 }, {
   rootMargin: '100px' // Trigger 100px before reaching the element
 });

 const sentinel = document.querySelector('.load-more-trigger');
 infiniteScroll.observe(sentinel);
 ```

 **Options:**
 ```javascript
 const options = {
   root: null, // viewport (default)
   rootMargin: '0px 0px -100px 0px', // Shrink observation area
   threshold: [0, 0.25, 0.5, 0.75, 1] // Trigger at multiple visibility levels
 };

 const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
     console.log(`Visibility: ${entry.intersectionRatio * 100}%`);
   });
 }, options);
 ```

 **Tracking visibility time:**
 ```javascript
 let visibilityStartTime;

 const visibilityObserver = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
     if (entry.isIntersecting) {
       visibilityStartTime = Date.now();
     } else if (visibilityStartTime) {
       const visibilityDuration = Date.now() - visibilityStartTime;
       console.log(`Element was visible for ${visibilityDuration}ms`);
       visibilityStartTime = null;
     }
   });
 });
 ```

### 501. What are async iterators and how are they different from regular iterators?

Async iterators allow you to iterate over asynchronous data sources using `for await...of` loops, where each iteration can wait for a Promise to resolve.

 **Regular iterator (synchronous):**
 ```javascript
 const syncIterable = {
   [Symbol.iterator]() {
     let i = 0;
     return {
       next() {
         if (i < 3) {
           return { value: i++, done: false };
         }
         return { done: true };
       }
     };
   }
 };

 for (const val of syncIterable) {
   console.log(val); // 0, 1, 2
 }
 ```

 **Async iterator:**
 ```javascript
 const asyncIterable = {
   [Symbol.asyncIterator]() {
     let i = 0;
     return {
       async next() {
         if (i < 3) {
           await new Promise(resolve => setTimeout(resolve, 1000));
           return { value: i++, done: false };
         }
         return { done: true };
       }
     };
   }
 };

 (async () => {
   for await (const val of asyncIterable) {
     console.log(val); // 0, 1, 2 (one per second)
   }
 })();
 ```

 **Async generator function:**
 ```javascript
 async function* fetchPages(urls) {
   for (const url of urls) {
     const response = await fetch(url);
     const data = await response.json();
     yield data;
   }
 }

 (async () => {
   const urls = ['api/page1', 'api/page2', 'api/page3'];
   for await (const page of fetchPages(urls)) {
     console.log(page);
   }
 })();
 ```

 **Practical example - reading file streams:**
 ```javascript
 async function* readLines(filePath) {
   const fileStream = fs.createReadStream(filePath);
   const rl = readline.createInterface({
     input: fileStream,
     crlfDelay: Infinity
   });

   for await (const line of rl) {
     yield line;
   }
 }

 (async () => {
   for await (const line of readLines('large-file.txt')) {
     console.log(line);
   }
 })();
 ```

 **Key differences:**

 | Regular Iterator | Async Iterator |
 |-----------------|----------------|
 | Returns `{ value, done }` | Returns `Promise<{ value, done }>` |
 | `Symbol.iterator` | `Symbol.asyncIterator` |
 | Used with `for...of` | Used with `for await...of` |
 | Synchronous | Asynchronous |
 | `next()` method | `async next()` method |

### 502. What is the purpose of Object.getOwnPropertyDescriptors()?

`Object.getOwnPropertyDescriptors()` returns all own property descriptors of an object, including their attributes (value, writable, enumerable, configurable, get, set).

 ```javascript
 const obj = {
   name: 'John',
   get fullName() {
     return this.name;
   }
 };

 const descriptors = Object.getOwnPropertyDescriptors(obj);
 console.log(descriptors);
 /*
 {
   name: {
     value: 'John',
     writable: true,
     enumerable: true,
     configurable: true
   },
   fullName: {
     get: [Function: get fullName],
     set: undefined,
     enumerable: true,
     configurable: true
   }
 }
 */
 ```

 **Use case 1: Shallow cloning with all property attributes:**
 ```javascript
 // Regular spread operator loses getters/setters
 const clone1 = { ...obj };

 // Using Object.assign also loses getters/setters
 const clone2 = Object.assign({}, obj);

 // Proper cloning with descriptors
 const properClone = Object.create(
   Object.getPrototypeOf(obj),
   Object.getOwnPropertyDescriptors(obj)
 );
 ```

 **Use case 2: Mixin pattern preserving all attributes:**
 ```javascript
 function mixin(target, ...sources) {
   for (const source of sources) {
     Object.defineProperties(
       target,
       Object.getOwnPropertyDescriptors(source)
     );
   }
   return target;
 }

 const obj1 = {
   get prop() { return 'getter'; }
 };

 const obj2 = {};
 mixin(obj2, obj1);
 console.log(obj2.prop); // 'getter'
 ```

 **Use case 3: Inspecting property configuration:**
 ```javascript
 const obj = {};
 Object.defineProperty(obj, 'readOnly', {
   value: 42,
   writable: false
 });

 const descriptor = Object.getOwnPropertyDescriptors(obj).readOnly;
 console.log(descriptor.writable); // false
 ```

 **Comparison with Object.getOwnPropertyDescriptor():**
 ```javascript
 // Single property
 const singleDesc = Object.getOwnPropertyDescriptor(obj, 'name');

 // All properties
 const allDescs = Object.getOwnPropertyDescriptors(obj);
 ```

### 503. How does Promise.allSettled() differ from Promise.all()?

`Promise.allSettled()` and `Promise.all()` both handle multiple promises, but they behave differently when promises are rejected.

 **Promise.all() - fails fast:**
 ```javascript
 const promises = [
   Promise.resolve(1),
   Promise.reject('Error'),
   Promise.resolve(3)
 ];

 Promise.all(promises)
   .then(results => console.log(results))
   .catch(error => console.log(error)); // 'Error'
 // Stops at first rejection
 ```

 **Promise.allSettled() - waits for all:**
 ```javascript
 Promise.allSettled(promises)
   .then(results => console.log(results));
 /*
 [
   { status: 'fulfilled', value: 1 },
   { status: 'rejected', reason: 'Error' },
   { status: 'fulfilled', value: 3 }
 ]
 */
 ```

 **Practical example - multiple API calls:**
 ```javascript
 async function fetchUserData(userId) {
   const endpoints = [
     fetch(`/api/users/${userId}`),
     fetch(`/api/users/${userId}/posts`),
     fetch(`/api/users/${userId}/comments`)
   ];

   const results = await Promise.allSettled(endpoints);

   return {
     profile: results[0].status === 'fulfilled' 
       ? await results[0].value.json() 
       : null,
     posts: results[1].status === 'fulfilled' 
       ? await results[1].value.json() 
       : [],
     comments: results[2].status === 'fulfilled' 
       ? await results[2].value.json() 
       : []
   };
 }
 ```

 **Filtering settled results:**
 ```javascript
 const results = await Promise.allSettled(promises);

 const successful = results
   .filter(r => r.status === 'fulfilled')
   .map(r => r.value);

 const failed = results
   .filter(r => r.status === 'rejected')
   .map(r => r.reason);

 console.log(`${successful.length} succeeded, ${failed.length} failed`);
 ```

 **When to use each:**

 | Use Promise.all() when: | Use Promise.allSettled() when: |
 |------------------------|-------------------------------|
 | All promises must succeed | You need all results regardless of status |
 | Failure should stop execution | You want to handle each result independently |
 | You want to fail fast | You need a complete report |

### 504. What are the performance implications of using try-catch in JavaScript?

Try-catch blocks have performance implications, especially when used in hot code paths or when exceptions are frequently thrown.

 **Performance impact:**
 ```javascript
 // Slower - try-catch in a tight loop
 function sumWithTryCatch(arr) {
   let sum = 0;
   for (let i = 0; i < arr.length; i++) {
     try {
       sum += arr[i];
     } catch (e) {
       // Handle error
     }
   }
   return sum;
 }

 // Faster - try-catch outside the loop
 function sumOptimized(arr) {
   let sum = 0;
   try {
     for (let i = 0; i < arr.length; i++) {
       sum += arr[i];
     }
   } catch (e) {
     // Handle error
   }
   return sum;
 }
 ```

 **De-optimization issues:**
 ```javascript
 // This function may not be optimized by V8
 function deoptimized() {
   try {
     // Code here
   } catch (e) {
     // Accessing 'e' can prevent optimizations
     console.log(e);
   }
 }

 // Better approach
 function optimized() {
   try {
     // Code here
   } catch (e) {
     handleError(e); // Move to separate function
   }
 }

 function handleError(error) {
   console.log(error);
 }
 ```

 **Best practices:**

 1. **Use validation instead of try-catch when possible:**
    ```javascript
    // Avoid
    try {
      const value = obj.prop.nested.value;
    } catch (e) {
      // Handle error
    }

    // Prefer
    const value = obj?.prop?.nested?.value;
    ```

 2. **Minimize try-catch scope:**
    ```javascript
    // Bad - wrapping too much
    try {
      const data = fetchData();
      const processed = processData(data);
      const validated = validateData(processed);
      saveData(validated);
    } catch (e) {}

    // Good - only wrap risky operations
    const data = fetchData();
    const processed = processData(data);
    const validated = validateData(processed);
    try {
      saveData(validated);
    } catch (e) {
      handleSaveError(e);
    }
    ```

 3. **Avoid using exceptions for flow control:**
    ```javascript
    // Bad - using exceptions for control flow
    function findUser(id) {
      try {
        return users[id];
      } catch {
        return null;
      }
    }

    // Good - use conditional logic
    function findUser(id) {
      return users[id] || null;
    }
    ```

 **Note:** Modern JavaScript engines have improved try-catch performance significantly, but it's still important to use them judiciously in performance-critical code.

### 505. What is the AbortController API and how is it used?

The AbortController API provides a way to abort one or more asynchronous operations, particularly useful for canceling fetch requests.

 **Basic usage:**
 ```javascript
 const controller = new AbortController();
 const signal = controller.signal;

 fetch('https://api.example.com/data', { signal })
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(err => {
     if (err.name === 'AbortError') {
       console.log('Fetch aborted');
     }
   });

 // Cancel the request
 controller.abort();
 ```

 **Timeout implementation:**
 ```javascript
 function fetchWithTimeout(url, timeout = 5000) {
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), timeout);

   return fetch(url, { signal: controller.signal })
     .then(response => {
       clearTimeout(timeoutId);
       return response;
     })
     .catch(err => {
       clearTimeout(timeoutId);
       if (err.name === 'AbortError') {
         throw new Error('Request timed out');
       }
       throw err;
     });
 }

 fetchWithTimeout('https://api.example.com/slow-endpoint', 3000);
 ```

 **Canceling multiple requests:**
 ```javascript
 const controller = new AbortController();
 const signal = controller.signal;

 Promise.all([
   fetch('/api/users', { signal }),
   fetch('/api/posts', { signal }),
   fetch('/api/comments', { signal })
 ]).catch(err => {
   if (err.name === 'AbortError') {
     console.log('All requests aborted');
   }
 });

 // Cancel all requests
 controller.abort();
 ```

 **React component example:**
 ```javascript
 useEffect(() => {
   const controller = new AbortController();

   async function fetchData() {
     try {
       const response = await fetch('/api/data', {
         signal: controller.signal
       });
       const data = await response.json();
       setData(data);
     } catch (err) {
       if (err.name !== 'AbortError') {
         setError(err);
       }
     }
   }

   fetchData();

   // Cleanup: abort on unmount
   return () => controller.abort();
 }, []);
 ```

 **Custom abortable operations:**
 ```javascript
 function abortablePromise(promise, signal) {
   return new Promise((resolve, reject) => {
     signal.addEventListener('abort', () => {
       reject(new DOMException('Aborted', 'AbortError'));
     });

     promise.then(resolve, reject);
   });
 }

 const controller = new AbortController();
 abortablePromise(
   new Promise(resolve => setTimeout(resolve, 5000)),
   controller.signal
 ).catch(err => console.log(err.name)); // 'AbortError'

 controller.abort();
 ```

### 506. How do you implement a custom error class in JavaScript?

Custom error classes allow you to create specific error types with additional properties and methods, making error handling more precise.

 **Basic custom error:**
 ```javascript
 class CustomError extends Error {
   constructor(message) {
     super(message);
     this.name = 'CustomError';
   }
 }

 throw new CustomError('Something went wrong');
 ```

 **Error with additional properties:**
 ```javascript
 class ValidationError extends Error {
   constructor(message, field) {
     super(message);
     this.name = 'ValidationError';
     this.field = field;
     this.timestamp = new Date();
   }
 }

 try {
   throw new ValidationError('Invalid email', 'email');
 } catch (error) {
   if (error instanceof ValidationError) {
     console.log(`${error.field}: ${error.message}`);
     // email: Invalid email
   }
 }
 ```

 **HTTP error class:**
 ```javascript
 class HTTPError extends Error {
   constructor(message, status, response) {
     super(message);
     this.name = 'HTTPError';
     this.status = status;
     this.response = response;
   }

   get isClientError() {
     return this.status >= 400 && this.status < 500;
   }

   get isServerError() {
     return this.status >= 500;
   }
 }

 async function fetchData(url) {
   const response = await fetch(url);
   if (!response.ok) {
     throw new HTTPError(
       'Failed to fetch',
       response.status,
       await response.json()
     );
   }
   return response.json();
 }

 try {
   await fetchData('/api/users');
 } catch (error) {
   if (error instanceof HTTPError && error.isClientError) {
     console.log('Client error:', error.message);
   }
 }
 ```

 **Error factory pattern:**
 ```javascript
 class AppError extends Error {
   constructor(message, code, metadata = {}) {
     super(message);
     this.name = 'AppError';
     this.code = code;
     this.metadata = metadata;
   }

   static badRequest(message, metadata) {
     return new AppError(message, 'BAD_REQUEST', metadata);
   }

   static notFound(resource) {
     return new AppError(
       `${resource} not found`,
       'NOT_FOUND',
       { resource }
     );
   }

   static unauthorized(message) {
     return new AppError(message, 'UNAUTHORIZED');
   }
 }

 throw AppError.notFound('User');
 throw AppError.badRequest('Invalid input', { field: 'email' });
 ```

 **Error with stack trace customization:**
 ```javascript
 class DatabaseError extends Error {
   constructor(message, query) {
     super(message);
     this.name = 'DatabaseError';
     this.query = query;

     // Maintain proper stack trace
     if (Error.captureStackTrace) {
       Error.captureStackTrace(this, DatabaseError);
     }
   }
 }
 ```

### 507. What is the difference between synchronous and asynchronous generators?

Synchronous and asynchronous generators differ in how they produce values and handle asynchronous operations.

 **Synchronous generator:**
 ```javascript
 function* syncGenerator() {
   yield 1;
   yield 2;
   yield 3;
 }

 const gen = syncGenerator();
 console.log(gen.next()); // { value: 1, done: false }
 console.log(gen.next()); // { value: 2, done: false }
 ```

 **Asynchronous generator:**
 ```javascript
 async function* asyncGenerator() {
   yield await Promise.resolve(1);
   yield await Promise.resolve(2);
   yield await Promise.resolve(3);
 }

 (async () => {
   for await (const value of asyncGenerator()) {
     console.log(value); // 1, 2, 3
   }
 })();
 ```

 **Comparison:**

 | Synchronous Generator | Asynchronous Generator |
 |----------------------|------------------------|
 | `function*` | `async function*` |
 | Returns iterator | Returns async iterator |
 | `.next()` returns `{ value, done }` | `.next()` returns `Promise<{ value, done }>` |
 | Used with `for...of` | Used with `for await...of` |
 | Cannot await inside | Can await inside |

 **Practical example - data streaming:**
 ```javascript
 // Sync generator - in-memory data
 function* readFileSync(lines) {
   for (const line of lines) {
     yield line;
   }
 }

 // Async generator - streaming data
 async function* readFileAsync(filePath) {
   const stream = createReadStream(filePath);
   const reader = stream.getReader();

   while (true) {
     const { done, value } = await reader.read();
     if (done) break;
     yield value;
   }
 }
 ```

 **Async generator with delays:**
 ```javascript
 async function* ticker(interval, max) {
   let count = 0;
   while (count < max) {
     await new Promise(resolve => setTimeout(resolve, interval));
     yield count++;
   }
 }

 (async () => {
   for await (const tick of ticker(1000, 5)) {
     console.log(tick); // 0, 1, 2, 3, 4 (one per second)
   }
 })();
 ```

 **Combining generators:**
 ```javascript
 async function* fetchPages(urls) {
   for (const url of urls) {
     const response = await fetch(url);
     yield await response.json();
   }
 }

 async function* processPages(urls) {
   for await (const page of fetchPages(urls)) {
     yield processPage(page);
   }
 }
 ```

### 508. What are Proxy traps and what operations can they intercept?

Proxy traps are handler methods that intercept fundamental operations on objects, allowing you to customize their behavior.

 **Available traps:**
 ```javascript
 const handler = {
   // Property access
   get(target, prop, receiver) {
     console.log(`Getting ${prop}`);
     return Reflect.get(target, prop, receiver);
   },

   // Property assignment
   set(target, prop, value, receiver) {
     console.log(`Setting ${prop} to ${value}`);
     return Reflect.set(target, prop, value, receiver);
   },

   // Property deletion
   deleteProperty(target, prop) {
     console.log(`Deleting ${prop}`);
     return Reflect.deleteProperty(target, prop);
   },

   // 'in' operator
   has(target, prop) {
     console.log(`Checking ${prop}`);
     return Reflect.has(target, prop);
   },

   // Object.keys, for...in
   ownKeys(target) {
     return Reflect.ownKeys(target);
   },

   // Function calls
   apply(target, thisArg, args) {
     console.log(`Called with ${args}`);
     return Reflect.apply(target, thisArg, args);
   },

   // new operator
   construct(target, args) {
     console.log(`Constructed with ${args}`);
     return Reflect.construct(target, args);
   },

   // Object.getPrototypeOf
   getPrototypeOf(target) {
     return Reflect.getPrototypeOf(target);
   },

   // Object.setPrototypeOf
   setPrototypeOf(target, proto) {
     return Reflect.setPrototypeOf(target, proto);
   },

   // Object.isExtensible
   isExtensible(target) {
     return Reflect.isExtensible(target);
   },

   // Object.preventExtensions
   preventExtensions(target) {
     return Reflect.preventExtensions(target);
   },

   // Object.getOwnPropertyDescriptor
   getOwnPropertyDescriptor(target, prop) {
     return Reflect.getOwnPropertyDescriptor(target, prop);
   },

   // Object.defineProperty
   defineProperty(target, prop, descriptor) {
     return Reflect.defineProperty(target, prop, descriptor);
   }
 };
 ```

 **Validation example:**
 ```javascript
 const validator = {
   set(target, prop, value) {
     if (prop === 'age') {
       if (typeof value !== 'number' || value < 0) {
         throw new TypeError('Age must be a positive number');
       }
     }
     target[prop] = value;
     return true;
   }
 };

 const person = new Proxy({}, validator);
 person.age = 30; // OK
 // person.age = -5; // Throws error
 ```

 **Property access logging:**
 ```javascript
 function createLoggingProxy(obj, name = 'object') {
   return new Proxy(obj, {
     get(target, prop) {
       console.log(`${name}.${String(prop)} accessed`);
       const value = target[prop];
       if (typeof value === 'object' && value !== null) {
         return createLoggingProxy(value, `${name}.${String(prop)}`);
       }
       return value;
     }
   });
 }

 const user = createLoggingProxy({ name: 'John', address: { city: 'NYC' } });
 user.address.city; // Logs: object.address accessed, object.address.city accessed
 ```

 **Negative array indices:**
 ```javascript
 function createArray(arr) {
   return new Proxy(arr, {
     get(target, prop) {
       const index = Number(prop);
       if (index < 0) {
         return target[target.length + index];
       }
       return target[prop];
     }
   });
 }

 const arr = createArray([1, 2, 3, 4, 5]);
 console.log(arr[-1]); // 5
 console.log(arr[-2]); // 4
 ```

 **Function argument validation:**
 ```javascript
 function validateArgs(fn, validators) {
   return new Proxy(fn, {
     apply(target, thisArg, args) {
       validators.forEach((validator, i) => {
         if (!validator(args[i])) {
           throw new Error(`Invalid argument at position ${i}`);
         }
       });
       return Reflect.apply(target, thisArg, args);
     }
   });
 }

 const add = validateArgs(
   (a, b) => a + b,
   [
     x => typeof x === 'number',
     x => typeof x === 'number'
   ]
 );

 console.log(add(1, 2)); // 3
 // add('1', 2); // Throws error
 ```

### 509. How does the Mutation Observer API work?

The MutationObserver API provides a way to watch for changes to the DOM tree, replacing the deprecated mutation events.

 **Basic usage:**
 ```javascript
 const observer = new MutationObserver((mutations) => {
   mutations.forEach(mutation => {
     console.log('Type:', mutation.type);
     console.log('Target:', mutation.target);
   });
 });

 const config = {
   attributes: true,
   childList: true,
   subtree: true
 };

 const targetNode = document.getElementById('observed');
 observer.observe(targetNode, config);

 // Later: stop observing
 observer.disconnect();
 ```

 **Observing attribute changes:**
 ```javascript
 const observer = new MutationObserver((mutations) => {
   mutations.forEach(mutation => {
     if (mutation.type === 'attributes') {
       const oldValue = mutation.oldValue;
       const newValue = mutation.target.getAttribute(mutation.attributeName);
       console.log(`${mutation.attributeName}: ${oldValue} → ${newValue}`);
     }
   });
 });

 observer.observe(element, {
   attributes: true,
   attributeOldValue: true,
   attributeFilter: ['class', 'data-status']
 });
 ```

 **Observing child nodes:**
 ```javascript
 const observer = new MutationObserver((mutations) => {
   mutations.forEach(mutation => {
     mutation.addedNodes.forEach(node => {
       console.log('Added:', node);
     });
     mutation.removedNodes.forEach(node => {
       console.log('Removed:', node);
     });
   });
 });

 observer.observe(container, {
   childList: true,
   subtree: true
 });
 ```

 **Practical example - lazy loading images when added to DOM:**
 ```javascript
 const imageObserver = new MutationObserver((mutations) => {
   mutations.forEach(mutation => {
     mutation.addedNodes.forEach(node => {
       if (node.tagName === 'IMG' && node.dataset.src) {
         loadImage(node);
       }
       // Check descendants
       if (node.querySelectorAll) {
         node.querySelectorAll('img[data-src]').forEach(loadImage);
       }
     });
   });
 });

 function loadImage(img) {
   img.src = img.dataset.src;
   delete img.dataset.src;
 }

 imageObserver.observe(document.body, {
   childList: true,
   subtree: true
 });
 ```

 **Observing text content changes:**
 ```javascript
 const observer = new MutationObserver((mutations) => {
   mutations.forEach(mutation => {
     if (mutation.type === 'characterData') {
       console.log('Text changed:', mutation.target.textContent);
     }
   });
 });

 observer.observe(textNode, {
   characterData: true,
   characterDataOldValue: true
 });
 ```

 **Configuration options:**
 ```javascript
 const config = {
   attributes: true,           // Watch attribute changes
   attributeOldValue: true,    // Record old attribute values
   attributeFilter: ['class'], // Only watch specific attributes
   childList: true,            // Watch child nodes
   subtree: true,              // Watch all descendants
   characterData: true,        // Watch text content
   characterDataOldValue: true // Record old text content
 };
 ```

### 510. What is tail call optimization and does JavaScript support it?

Tail call optimization (TCO) is a technique where a function call in tail position (the last operation before returning) reuses the current stack frame instead of creating a new one, preventing stack overflow in recursive functions.

 **Tail call example:**
 ```javascript
 // Tail call - last operation is the recursive call
 function factorial(n, acc = 1) {
   if (n <= 1) return acc;
   return factorial(n - 1, n * acc); // Tail call
 }

 // Not a tail call - multiplication happens after the recursive call
 function factorialNonTail(n) {
   if (n <= 1) return 1;
   return n * factorialNonTail(n - 1); // NOT a tail call
 }
 ```

 **JavaScript TCO support:**
 - Specified in ES6 (ES2015) but **poorly supported**
 - Only Safari/JavaScriptCore implements it
 - Chrome V8 and Firefox SpiderMonkey do not support it
 - Most JavaScript engines ignore TCO

 **Workaround - trampolining:**
 ```javascript
 function trampoline(fn) {
   while (typeof fn === 'function') {
     fn = fn();
   }
   return fn;
 }

 function factorial(n, acc = 1) {
   if (n <= 1) return acc;
   return () => factorial(n - 1, n * acc);
 }

 const result = trampoline(() => factorial(100000)); // Won't stack overflow
 ```

 **Workaround - iteration instead of recursion:**
 ```javascript
 // Recursive (can cause stack overflow)
 function sumRecursive(arr, index = 0, acc = 0) {
   if (index >= arr.length) return acc;
   return sumRecursive(arr, index + 1, acc + arr[index]);
 }

 // Iterative (safe)
 function sumIterative(arr) {
   let sum = 0;
   for (const num of arr) {
     sum += num;
   }
   return sum;
 }
 ```

 **Checking for TCO:**
 ```javascript
 function checkTCO(n) {
   if (n === 0) return true;
   return checkTCO(n - 1);
 }

 try {
   checkTCO(100000);
   console.log('TCO supported');
 } catch (e) {
   if (e instanceof RangeError) {
     console.log('TCO not supported');
   }
 }
 ```

 **Best practice:** Don't rely on TCO in JavaScript. Use iteration or trampolining for deep recursion.

### 511. What are the different ways to handle circular references in JSON?

Circular references occur when an object references itself directly or indirectly, causing `JSON.stringify()` to throw an error.

 **Problem:**
 ```javascript
 const obj = { name: 'John' };
 obj.self = obj; // Circular reference

 // JSON.stringify(obj); // Throws: TypeError: Converting circular structure to JSON
 ```

 **Solution 1: Custom replacer function:**
 ```javascript
 function stringifyWithCircular(obj) {
   const seen = new WeakSet();
   return JSON.stringify(obj, (key, value) => {
     if (typeof value === 'object' && value !== null) {
       if (seen.has(value)) {
         return '[Circular]';
       }
       seen.add(value);
     }
     return value;
   });
 }

 const obj = { name: 'John' };
 obj.self = obj;
 console.log(stringifyWithCircular(obj));
 // {"name":"John","self":"[Circular]"}
 ```

 **Solution 2: flatted library (preserves structure):**
 ```javascript
 import { stringify, parse } from 'flatted';

 const obj = { name: 'John' };
 obj.self = obj;

 const serialized = stringify(obj);
 const deserialized = parse(serialized);
 console.log(deserialized.self === deserialized); // true
 ```

 **Solution 3: Manual tracking with paths:**
 ```javascript
 function safeStringify(obj, space) {
   const seen = new Map();
   let index = 0;

   return JSON.stringify(obj, function(key, value) {
     if (typeof value === 'object' && value !== null) {
       if (seen.has(value)) {
         return `[Circular:${seen.get(value)}]`;
       }
       seen.set(value, index++);
     }
     return value;
   }, space);
 }
 ```

 **Solution 4: Remove circular references:**
 ```javascript
 function removeCircular(obj) {
   const seen = new WeakSet();

   function detect(obj) {
     if (typeof obj === 'object' && obj !== null) {
       if (seen.has(obj)) {
         return undefined;
       }
       seen.add(obj);

       if (Array.isArray(obj)) {
         return obj.map(detect).filter(x => x !== undefined);
       }

       const cleaned = {};
       for (const [key, value] of Object.entries(obj)) {
         const cleaned value = detect(value);
         if (cleanedValue !== undefined) {
           cleaned[key] = cleanedValue;
         }
       }
       return cleaned;
     }
     return obj;
   }

   return detect(obj);
 }

 const obj = { name: 'John', child: { name: 'Jane' } };
 obj.child.parent = obj;
 const clean = removeCircular(obj);
 console.log(JSON.stringify(clean));
 ```

 **Solution 5: Using toJSON method:**
 ```javascript
 class Node {
   constructor(name) {
     this.name = name;
     this.parent = null;
     this.children = [];
   }

   toJSON() {
     return {
       name: this.name,
       children: this.children,
       // Exclude parent to avoid circular reference
     };
   }
 }

 const root = new Node('root');
 const child = new Node('child');
 root.children.push(child);
 child.parent = root;

 console.log(JSON.stringify(root)); // Works fine
 ```

### 512. How do you implement a singleton pattern in JavaScript?

The singleton pattern ensures a class has only one instance and provides a global access point to it.

 **Classic singleton with closure:**
 ```javascript
 const Singleton = (function() {
   let instance;

   function createInstance() {
     const object = {
       name: 'Singleton',
       data: []
     };
     return object;
   }

   return {
     getInstance() {
       if (!instance) {
         instance = createInstance();
       }
       return instance;
     }
   };
 })();

 const instance1 = Singleton.getInstance();
 const instance2 = Singleton.getInstance();
 console.log(instance1 === instance2); // true
 ```

 **ES6 class singleton:**
 ```javascript
 class Singleton {
   constructor() {
     if (Singleton.instance) {
       return Singleton.instance;
     }
     this.data = [];
     Singleton.instance = this;
   }

   addData(value) {
     this.data.push(value);
   }

   getData() {
     return this.data;
   }
 }

 const s1 = new Singleton();
 const s2 = new Singleton();
 console.log(s1 === s2); // true
 ```

 **Module singleton (simplest):**
 ```javascript
 // config.js
 class Config {
   constructor() {
     this.settings = {};
   }

   set(key, value) {
     this.settings[key] = value;
   }

   get(key) {
     return this.settings[key];
   }
 }

 export default new Config(); // Export single instance

 // usage.js
 import config from './config.js';
 config.set('apiUrl', 'https://api.example.com');
 ```

 **Singleton with WeakMap (private instance):**
 ```javascript
 const Singleton = (function() {
   const instances = new WeakMap();

   class Singleton {
     constructor(key) {
       if (instances.has(key)) {
         return instances.get(key);
       }
       this.data = [];
       instances.set(key, this);
     }
   }

   return Singleton;
 })();
 ```

 **Database connection singleton:**
 ```javascript
 class DatabaseConnection {
   constructor() {
     if (DatabaseConnection.instance) {
       return DatabaseConnection.instance;
     }

     this.connection = null;
     DatabaseConnection.instance = this;
   }

   connect(connectionString) {
     if (!this.connection) {
       this.connection = {
         connectionString,
         connected: true,
         queries: []
       };
     }
     return this.connection;
   }

   disconnect() {
     if (this.connection) {
       this.connection.connected = false;
       this.connection = null;
     }
   }

   query(sql) {
     if (this.connection?.connected) {
       this.connection.queries.push(sql);
       return `Executing: ${sql}`;
     }
     throw new Error('Not connected');
   }
 }

 const db1 = new DatabaseConnection();
 db1.connect('mongodb://localhost:27017');

 const db2 = new DatabaseConnection();
 console.log(db1 === db2); // true
 console.log(db2.query('SELECT * FROM users')); // Works
 ```

### 513. What is the Performance API and how is it used for measuring performance?

The Performance API provides high-precision timing information for measuring web application performance.

 **Basic timing:**
 ```javascript
 // High-resolution timestamp
 const start = performance.now();

 // Some operation
 for (let i = 0; i < 1000000; i++) {}

 const end = performance.now();
 console.log(`Operation took ${end - start} milliseconds`);
 ```

 **Navigation timing:**
 ```javascript
 // Get page load metrics
 const perfData = performance.getEntriesByType('navigation')[0];

 console.log('DNS lookup:', perfData.domainLookupEnd - perfData.domainLookupStart);
 console.log('TCP connection:', perfData.connectEnd - perfData.connectStart);
 console.log('Request time:', perfData.responseStart - perfData.requestStart);
 console.log('Response time:', perfData.responseEnd - perfData.responseStart);
 console.log('DOM processing:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
 console.log('Total load time:', perfData.loadEventEnd - perfData.fetchStart);
 ```

 **Custom performance marks and measures:**
 ```javascript
 // Mark the start of an operation
 performance.mark('operation-start');

 // Do some work
 await fetchData();
 processData();

 // Mark the end
 performance.mark('operation-end');

 // Measure the duration
 performance.measure('operation', 'operation-start', 'operation-end');

 // Get the measurement
 const measures = performance.getEntriesByName('operation');
 console.log(`Operation took ${measures[0].duration}ms`);

 // Clean up
 performance.clearMarks();
 performance.clearMeasures();
 ```

 **Resource timing:**
 ```javascript
 // Get all resource timings
 const resources = performance.getEntriesByType('resource');

 resources.forEach(resource => {
   console.log(`${resource.name}:`);
   console.log(`  Duration: ${resource.duration}ms`);
   console.log(`  Size: ${resource.transferSize} bytes`);
   console.log(`  Type: ${resource.initiatorType}`);
 });

 // Filter specific resources
 const images = performance.getEntriesByType('resource')
   .filter(r => r.initiatorType === 'img');
 ```

 **Function execution time:**
 ```javascript
 function measureFunction(fn, ...args) {
   const start = performance.now();
   const result = fn(...args);
   const end = performance.now();

   console.log(`${fn.name} took ${end - start}ms`);
   return result;
 }

 async function measureAsync(fn, ...args) {
   const start = performance.now();
   const result = await fn(...args);
   const end = performance.now();

   console.log(`${fn.name} took ${end - start}ms`);
   return result;
 }

 measureFunction(expensiveOperation, arg1, arg2);
 await measureAsync(asyncOperation, arg1);
 ```

 **Performance Observer (monitoring):**
 ```javascript
 const observer = new PerformanceObserver((list) => {
   list.getEntries().forEach(entry => {
     console.log(`${entry.name}: ${entry.duration}ms`);
   });
 });

 // Observe specific entry types
 observer.observe({ entryTypes: ['measure', 'resource', 'navigation'] });

 // Later: disconnect
 observer.disconnect();
 ```

 **Real User Monitoring (RUM):**
 ```javascript
 function sendPerformanceMetrics() {
   const navigation = performance.getEntriesByType('navigation')[0];

   const metrics = {
     dns: navigation.domainLookupEnd - navigation.domainLookupStart,
     tcp: navigation.connectEnd - navigation.connectStart,
     ttfb: navigation.responseStart - navigation.requestStart,
     download: navigation.responseEnd - navigation.responseStart,
     domInteractive: navigation.domInteractive - navigation.fetchStart,
     domComplete: navigation.domComplete - navigation.fetchStart,
     loadComplete: navigation.loadEventEnd - navigation.fetchStart
   };

   // Send to analytics
   fetch('/api/metrics', {
     method: 'POST',
     body: JSON.stringify(metrics)
   });
 }

 window.addEventListener('load', () => {
   setTimeout(sendPerformanceMetrics, 0);
 });
 ```

### 514. What are the differences between SharedArrayBuffer and ArrayBuffer?

SharedArrayBuffer and ArrayBuffer are both fixed-length binary data buffers, but SharedArrayBuffer allows sharing memory between multiple workers/threads.

 **ArrayBuffer (not shared):**
 ```javascript
 // Regular ArrayBuffer
 const buffer = new ArrayBuffer(16);
 const view = new Int32Array(buffer);

 view[0] = 42;
 console.log(view[0]); // 42

 // Transferable but not shared
 worker.postMessage(buffer, [buffer]);
 // buffer is now neutered (length = 0)
 ```

 **SharedArrayBuffer (shared memory):**
 ```javascript
 // Main thread
 const sharedBuffer = new SharedArrayBuffer(16);
 const sharedView = new Int32Array(sharedBuffer);

 sharedView[0] = 42;

 // Send to worker (shared, not transferred)
 worker.postMessage(sharedBuffer);

 // Both main thread and worker can access the same memory
 sharedView[0] = 100; // Worker will see this change
 ```

 **Key differences:**

 | ArrayBuffer | SharedArrayBuffer |
 |-------------|-------------------|
 | Single context only | Multiple contexts (workers/threads) |
 | Transferred (moved) between workers | Shared between workers |
 | No synchronization needed | Requires Atomics for safe access |
 | Always available | Requires secure context (HTTPS) |
 | Original becomes neutered after transfer | Original remains valid |

 **Using Atomics with SharedArrayBuffer:**
 ```javascript
 // Main thread
 const sab = new SharedArrayBuffer(4);
 const view = new Int32Array(sab);

 worker.postMessage(sab);

 // Atomic operations
 Atomics.store(view, 0, 42);        // Write atomically
 Atomics.add(view, 0, 10);          // Add 10 atomically
 const value = Atomics.load(view, 0); // Read atomically

 // Wait/notify pattern
 Atomics.wait(view, 0, 0);          // Wait until value changes
 Atomics.notify(view, 0, 1);        // Wake one waiter
 ```

 **Worker communication example:**
 ```javascript
 // Main thread
 const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 2);
 const sharedArray = new Int32Array(sharedBuffer);

 const worker = new Worker('worker.js');
 worker.postMessage({ buffer: sharedBuffer });

 // Increment counter atomically
 setInterval(() => {
   const oldValue = Atomics.add(sharedArray, 0, 1);
   console.log('Main thread incremented to:', oldValue + 1);
 }, 1000);

 // worker.js
 self.onmessage = function(e) {
   const sharedArray = new Int32Array(e.data.buffer);

   setInterval(() => {
     const oldValue = Atomics.add(sharedArray, 1, 1);
     console.log('Worker incremented to:', oldValue + 1);
   }, 1000);
 };
 ```

 **Security requirements for SharedArrayBuffer:**
 ```javascript
 // Requires these headers:
 // Cross-Origin-Opener-Policy: same-origin
 // Cross-Origin-Embedder-Policy: require-corp

 // Check availability
 if (typeof SharedArrayBuffer !== 'undefined') {
   console.log('SharedArrayBuffer is available');
 } else {
   console.log('SharedArrayBuffer is not available');
 }
 ```

### 515. How do you prevent prototype pollution attacks in JavaScript?

Prototype pollution is a security vulnerability where attackers inject properties into Object.prototype, affecting all objects in the application.

 **Vulnerable code:**
 ```javascript
 function merge(target, source) {
   for (let key in source) {
     target[key] = source[key];
   }
   return target;
 }

 // Attack payload
 const malicious = JSON.parse('{"__proto__": {"polluted": "yes"}}');
 merge({}, malicious);

 console.log({}.polluted); // "yes" - all objects are polluted!
 ```

 **Prevention 1: Use Object.create(null):**
 ```javascript
 // Create objects without prototype
 const safeObj = Object.create(null);
 safeObj.__proto__ = { polluted: 'yes' };
 console.log(safeObj.polluted); // undefined

 // For configuration objects
 const config = Object.create(null);
 config.apiUrl = 'https://api.example.com';
 ```

 **Prevention 2: Check for dangerous keys:**
 ```javascript
 function safeMerge(target, source) {
   const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

   for (let key in source) {
     if (dangerousKeys.includes(key)) {
       continue; // Skip dangerous keys
     }
     if (source.hasOwnProperty(key)) {
       target[key] = source[key];
     }
   }
   return target;
 }
 ```

 **Prevention 3: Use Map instead of objects:**
 ```javascript
 const safeMap = new Map();
 safeMap.set('__proto__', 'value');
 // No pollution risk
 ```

 **Prevention 4: Freeze Object.prototype:**
 ```javascript
 Object.freeze(Object.prototype);
 Object.freeze(Object);

 // Now pollution attempts will fail
 Object.prototype.polluted = 'no';
 console.log({}.polluted); // undefined
 ```

 **Prevention 5: Validate object paths:**
 ```javascript
 function setDeepProperty(obj, path, value) {
   const parts = path.split('.');
   const dangerous = ['__proto__', 'constructor', 'prototype'];

   // Validate each part of the path
   if (parts.some(part => dangerous.includes(part))) {
     throw new Error('Invalid property path');
   }

   let current = obj;
   for (let i = 0; i < parts.length - 1; i++) {
     if (!(parts[i] in current)) {
       current[parts[i]] = {};
     }
     current = current[parts[i]];
   }

   current[parts[parts.length - 1]] = value;
 }
 ```

 **Prevention 6: Use libraries with protection:**
 ```javascript
 // Use lodash's merge with customizer
 const _ = require('lodash');

 function safeMergeCustomizer(objValue, srcValue, key) {
   const dangerous = ['__proto__', 'constructor', 'prototype'];
   if (dangerous.includes(key)) {
     return objValue; // Keep original value
   }
 }

 const result = _.mergeWith({}, source, safeMergeCustomizer);
 ```

 **Prevention 7: Schema validation:**
 ```javascript
 const Ajv = require('ajv');
 const ajv = new Ajv();

 const schema = {
   type: 'object',
   properties: {
     name: { type: 'string' },
     age: { type: 'number' }
   },
   additionalProperties: false // Reject unknown properties
 };

 const validate = ajv.compile(schema);

 function safeProcess(data) {
   if (!validate(data)) {
     throw new Error('Invalid data');
   }
   return data;
 }
 ```

 **Prevention 8: JSON.parse with reviver:**
 ```javascript
 function safeJSONParse(text) {
   return JSON.parse(text, (key, value) => {
     const dangerous = ['__proto__', 'constructor', 'prototype'];
     if (dangerous.includes(key)) {
       return undefined; // Filter out dangerous keys
     }
     return value;
   });
 }

 const safe = safeJSONParse('{"__proto__": {"polluted": "yes"}}');
 console.log({}.polluted); // undefined
 ```

### 516. What is the Atomics API and when should it be used?

The Atomics API provides atomic operations on SharedArrayBuffer, ensuring thread-safe access to shared memory in multi-threaded JavaScript (workers).

 **Basic atomic operations:**
 ```javascript
 const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 4);
 const view = new Int32Array(sab);

 // Atomic store - write a value
 Atomics.store(view, 0, 42);

 // Atomic load - read a value
 const value = Atomics.load(view, 0); // 42

 // Atomic add - add and return old value
 const oldValue = Atomics.add(view, 0, 10); // returns 42, view[0] is now 52

 // Atomic sub - subtract
 Atomics.sub(view, 0, 2); // view[0] is now 50

 // Atomic exchange - swap values
 const prev = Atomics.exchange(view, 0, 100); // returns 50, view[0] is now 100

 // Compare and exchange
 const replaced = Atomics.compareExchange(view, 0, 100, 200);
 // If view[0] === 100, set it to 200 and return 100
 // Otherwise, return current value
 ```

 **Wait and notify (worker synchronization):**
 ```javascript
 // Main thread
 const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
 const view = new Int32Array(sab);

 worker.postMessage(sab);

 // Wait for worker to set value to 1
 Atomics.wait(view, 0, 0); // Blocks until view[0] !== 0
 console.log('Worker has finished');

 // Worker thread
 self.onmessage = function(e) {
   const view = new Int32Array(e.data);

   // Do some work
   performTask();

   // Signal completion
   Atomics.store(view, 0, 1);
   Atomics.notify(view, 0, 1); // Wake up one waiting thread
 };
 ```

 **Mutex implementation:**
 ```javascript
 class Mutex {
   constructor(sab, index) {
     this.sab = sab;
     this.index = index;
   }

   lock() {
     const view = new Int32Array(this.sab);
     while (true) {
       const oldValue = Atomics.compareExchange(view, this.index, 0, 1);
       if (oldValue === 0) {
         return; // Successfully acquired lock
       }
       Atomics.wait(view, this.index, 1); // Wait if locked
     }
   }

   unlock() {
     const view = new Int32Array(this.sab);
     Atomics.store(view, this.index, 0);
     Atomics.notify(view, this.index, 1);
   }
 }

 // Usage
 const mutex = new Mutex(sab, 0);
 mutex.lock();
 try {
   // Critical section
   criticalOperation();
 } finally {
   mutex.unlock();
 }
 ```

 **Counter with atomic operations:**
 ```javascript
 class AtomicCounter {
   constructor() {
     this.sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
     this.view = new Int32Array(this.sab);
   }

   increment() {
     return Atomics.add(this.view, 0, 1) + 1;
   }

   decrement() {
     return Atomics.sub(this.view, 0, 1) - 1;
   }

   get value() {
     return Atomics.load(this.view, 0);
   }

   set value(val) {
     Atomics.store(this.view, 0, val);
   }
 }
 ```

 **Available atomic operations:**
 ```javascript
 // Arithmetic
 Atomics.add(typedArray, index, value)
 Atomics.sub(typedArray, index, value)

 // Bitwise
 Atomics.and(typedArray, index, value)
 Atomics.or(typedArray, index, value)
 Atomics.xor(typedArray, index, value)

 // Memory
 Atomics.load(typedArray, index)
 Atomics.store(typedArray, index, value)
 Atomics.exchange(typedArray, index, value)
 Atomics.compareExchange(typedArray, index, expectedValue, replacementValue)

 // Synchronization
 Atomics.wait(typedArray, index, value, timeout)
 Atomics.notify(typedArray, index, count)

 // Utility
 Atomics.isLockFree(size)
 ```

 **When to use Atomics:**
 - Sharing data between web workers
 - Implementing locks, semaphores, or other synchronization primitives
 - Building concurrent data structures
 - High-performance parallel computing
 - Avoiding race conditions in shared memory

### 517. How do you implement a lazy loading pattern for modules?

Lazy loading defers module loading until they're actually needed, reducing initial bundle size and improving load time.

 **Dynamic import (ES modules):**
 ```javascript
 // Traditional import - loaded immediately
 import { heavyFunction } from './heavy-module.js';

 // Dynamic import - loaded on demand
 async function loadModule() {
   const module = await import('./heavy-module.js');
   module.heavyFunction();
 }

 // Or with destructuring
 const { heavyFunction } = await import('./heavy-module.js');
 ```

 **Route-based lazy loading (React):**
 ```javascript
 import { lazy, Suspense } from 'react';

 const Dashboard = lazy(() => import('./Dashboard'));
 const Profile = lazy(() => import('./Profile'));

 function App() {
   return (
     <Router>
       <Suspense fallback={<div>Loading...</div>}>
         <Routes>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/profile" element={<Profile />} />
         </Routes>
       </Suspense>
     </Router>
   );
 }
 ```

 **Feature-based lazy loading:**
 ```javascript
 class FeatureLoader {
   constructor() {
     this.features = new Map();
   }

   async loadFeature(name) {
     if (this.features.has(name)) {
       return this.features.get(name);
     }

     const module = await import(`./features/${name}.js`);
     this.features.set(name, module);
     return module;
   }
 }

 const loader = new FeatureLoader();

 // Load feature only when needed
 button.addEventListener('click', async () => {
   const feature = await loader.loadFeature('advanced-charts');
   feature.render(data);
 });
 ```

 **Intersection Observer lazy loading:**
 ```javascript
 const observer = new IntersectionObserver((entries) => {
   entries.forEach(async (entry) => {
     if (entry.isIntersecting) {
       const moduleName = entry.target.dataset.module;
       const module = await import(`./modules/${moduleName}.js`);
       module.init(entry.target);
       observer.unobserve(entry.target);
     }
   });
 });

 // Observe elements
 document.querySelectorAll('[data-module]').forEach(el => {
   observer.observe(el);
 });
 ```

 **Conditional lazy loading:**
 ```javascript
 async function loadEditor() {
   if (window.innerWidth > 768) {
     // Load full editor for desktop
     const { FullEditor } = await import('./FullEditor.js');
     return new FullEditor();
   } else {
     // Load mobile editor
     const { MobileEditor } = await import('./MobileEditor.js');
     return new MobileEditor();
   }
 }
 ```

 **Prefetching for better UX:**
 ```javascript
 // Prefetch on hover
 link.addEventListener('mouseenter', () => {
   import(/* webpackPrefetch: true */ './heavy-module.js');
 });

 // Preload critical modules after initial load
 window.addEventListener('load', () => {
   setTimeout(() => {
     import(/* webpackPreload: true */ './important-module.js');
   }, 1000);
 });
 ```

 **Module caching:**
 ```javascript
 class ModuleCache {
   constructor() {
     this.cache = new Map();
     this.pending = new Map();
   }

   async load(path) {
     // Return cached module
     if (this.cache.has(path)) {
       return this.cache.get(path);
     }

     // Return pending promise
     if (this.pending.has(path)) {
       return this.pending.get(path);
     }

     // Load module
     const promise = import(path).then(module => {
       this.cache.set(path, module);
       this.pending.delete(path);
       return module;
     });

     this.pending.set(path, promise);
     return promise;
   }
 }

 const moduleCache = new ModuleCache();
 const module = await moduleCache.load('./module.js');
 ```

 **Webpack code splitting:**
 ```javascript
 // Magic comments for webpack
 const module = await import(
   /* webpackChunkName: "my-chunk" */
   /* webpackMode: "lazy" */
   './module.js'
 );
 ```

### 518. What are the best practices for optimizing JavaScript bundle size?

Optimizing bundle size improves load times, reduces bandwidth usage, and enhances user experience, especially on slow networks.

 **1. Code splitting:**
 ```javascript
 // Split by route
 const Home = lazy(() => import('./routes/Home'));
 const About = lazy(() => import('./routes/About'));

 // Split by feature
 button.addEventListener('click', async () => {
   const module = await import('./features/analytics.js');
   module.trackEvent('button_click');
 });
 ```

 **2. Tree shaking (remove unused code):**
 ```javascript
 // Bad - imports entire library
 import _ from 'lodash';
 _.debounce(fn, 300);

 // Good - imports only what's needed
 import debounce from 'lodash/debounce';
 debounce(fn, 300);

 // Even better - use ES modules
 import { debounce } from 'lodash-es';
 ```

 **3. Minimize dependencies:**
 ```javascript
 // Before - 50KB library for date formatting
 import moment from 'moment';
 moment().format('YYYY-MM-DD');

 // After - native Intl API (0KB)
 new Intl.DateTimeFormat('en-CA').format(new Date());

 // Or small alternative - 2KB
 import { format } from 'date-fns';
 format(new Date(), 'yyyy-MM-dd');
 ```

 **4. Use production builds:**
 ```javascript
 // package.json
 {
   "scripts": {
     "build": "NODE_ENV=production webpack --mode production"
   }
 }

 // React automatically removes development code
 if (process.env.NODE_ENV !== 'production') {
   console.log('Development mode');
 }
 ```

 **5. Compress and minify:**
 ```javascript
 // webpack.config.js
 const TerserPlugin = require('terser-webpack-plugin');

 module.exports = {
   optimization: {
     minimize: true,
     minimizer: [new TerserPlugin({
       terserOptions: {
         compress: {
           drop_console: true, // Remove console.logs
           drop_debugger: true
         }
       }
     })]
   }
 };
 ```

 **6. Analyze bundle:**
 ```bash
 # Install bundle analyzer
 npm install --save-dev webpack-bundle-analyzer

 # Run analysis
 npx webpack-bundle-analyzer stats.json
 ```

 **7. Remove duplicate dependencies:**
 ```javascript
 // webpack.config.js
 module.exports = {
   optimization: {
     splitChunks: {
       chunks: 'all',
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all'
         }
       }
     }
   }
 };
 ```

 **8. Use CDN for large libraries:**
 ```html
 <!-- Load from CDN instead of bundling -->
 <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
 <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
 ```

 **9. Defer non-critical JavaScript:**
 ```html
 <!-- Critical - inline or load immediately -->
 <script src="critical.js"></script>

 <!-- Non-critical - defer -->
 <script src="analytics.js" defer></script>
 <script src="social-widgets.js" async></script>
 ```

 **10. Remove dead code:**
 ```javascript
 // Use /* #__PURE__ */ comment for tree shaking
 const result = /* #__PURE__ */ expensiveOperation();

 // Configure webpack to remove unused exports
 module.exports = {
   optimization: {
     usedExports: true,
     sideEffects: false
   }
 };
 ```

 **11. Optimize images and assets:**
 ```javascript
 // Use image-webpack-loader
 module.exports = {
   module: {
     rules: [{
       test: /\.(png|jpe?g|gif|svg)$/,
       use: [
         'file-loader',
         {
           loader: 'image-webpack-loader',
           options: {
             mozjpeg: { quality: 75 },
             pngquant: { quality: [0.65, 0.9] }
           }
         }
       ]
     }]
   }
 };
 ```

 **12. Enable gzip/brotli compression:**
 ```javascript
 // Server-side compression (Express)
 const compression = require('compression');
 app.use(compression());

 // Build-time compression
 const CompressionPlugin = require('compression-webpack-plugin');
 plugins: [
   new CompressionPlugin({
     algorithm: 'brotliCompress',
     test: /\.(js|css|html|svg)$/,
     threshold: 10240,
     minRatio: 0.8
   })
 ]
 ```



<!-- QUESTIONS_END -->

