# Week 20: Functional Programming Concepts

## Overview
This week, we'll dive deep into functional programming (FP) concepts in JavaScript. Functional programming is a programming paradigm that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data.

## Table of Contents
1. [Pure Functions](#pure-functions)
2. [Immutability](#immutability)
3. [Side Effects](#side-effects)
4. [First-Class Functions](#first-class-functions)
5. [Function Composition](#function-composition)
6. [Pipe and Compose](#pipe-and-compose)
7. [Partial Application](#partial-application)
8. [Point-Free Style](#point-free-style)
9. [Practice Projects](#practice-projects)

---

## Pure Functions

### What is a Pure Function?

A pure function is a function that:
1. **Always returns the same output for the same input** (deterministic)
2. **Has no side effects** (doesn't modify external state)

### Examples

#### ❌ Impure Functions

```javascript
// Impure: depends on external state
let tax = 0.1;
function calculateTotal(price) {
  return price + (price * tax);
}

// Impure: modifies external state
let counter = 0;
function increment() {
  counter++;
  return counter;
}

// Impure: non-deterministic (different results for same input)
function addRandom(num) {
  return num + Math.random();
}

// Impure: side effect (I/O operation)
function greet(name) {
  console.log(`Hello, ${name}!`);
  return name;
}
```

#### ✅ Pure Functions

```javascript
// Pure: same input always gives same output
function add(a, b) {
  return a + b;
}

// Pure: tax passed as parameter
function calculateTotal(price, taxRate) {
  return price + (price * taxRate);
}

// Pure: doesn't modify input array
function doubleNumbers(numbers) {
  return numbers.map(num => num * 2);
}

// Pure: creates new object instead of mutating
function updateUser(user, newName) {
  return {
    ...user,
    name: newName
  };
}
```

### Benefits of Pure Functions

- **Testability**: Easy to test with no setup/teardown
- **Predictability**: Same input always produces same output
- **Cacheable**: Results can be memoized
- **Parallelizable**: No shared state to worry about
- **Composable**: Easy to combine with other pure functions

### Practice Exercise

```javascript
// Convert these impure functions to pure functions

// Impure version
let discount = 0.2;
function applyDiscount(price) {
  return price - (price * discount);
}

// Pure version
function applyDiscount(price, discountRate) {
  return price - (price * discountRate);
}

// Impure version
const cart = [];
function addToCart(item) {
  cart.push(item);
  return cart;
}

// Pure version
function addToCart(cart, item) {
  return [...cart, item];
}
```

---

## Immutability

### What is Immutability?

Immutability means once data is created, it cannot be changed. Instead of modifying existing data, we create new data structures with the desired changes.

### Why Immutability Matters

- Prevents unexpected changes to data
- Makes code easier to reason about
- Enables time-travel debugging
- Facilitates undo/redo functionality
- Essential for React and Redux

### Working with Immutable Data

#### Arrays

```javascript
const numbers = [1, 2, 3, 4, 5];

// ❌ Mutating methods (avoid these)
numbers.push(6);        // modifies original
numbers.pop();          // modifies original
numbers.splice(0, 1);   // modifies original
numbers.sort();         // modifies original

// ✅ Immutable operations (use these)
const newNumbers = [...numbers, 6];           // add
const withoutLast = numbers.slice(0, -1);     // remove last
const withoutFirst = numbers.slice(1);        // remove first
const sorted = [...numbers].sort();           // sort copy
const doubled = numbers.map(n => n * 2);      // transform
const filtered = numbers.filter(n => n > 2);  // filter
```

#### Objects

```javascript
const user = {
  name: 'Alice',
  age: 30,
  address: {
    city: 'New York',
    zip: '10001'
  }
};

// ❌ Mutating (avoid)
user.age = 31;
user.email = 'alice@example.com';

// ✅ Immutable updates (use these)
const updatedUser = {
  ...user,
  age: 31
};

const withEmail = {
  ...user,
  email: 'alice@example.com'
};

// Deep updates (nested objects)
const movedUser = {
  ...user,
  address: {
    ...user.address,
    city: 'San Francisco'
  }
};

// Removing properties
const { age, ...userWithoutAge } = user;
```

#### Complex Immutable Patterns

```javascript
// Update item in array by id
function updateItem(items, id, updates) {
  return items.map(item => 
    item.id === id 
      ? { ...item, ...updates }
      : item
  );
}

// Remove item from array by id
function removeItem(items, id) {
  return items.filter(item => item.id !== id);
}

// Add item to array
function addItem(items, newItem) {
  return [...items, newItem];
}

// Toggle boolean in object
function toggleComplete(todo) {
  return {
    ...todo,
    completed: !todo.completed
  };
}

// Update nested array
const state = {
  users: [
    { id: 1, name: 'Alice', posts: [] },
    { id: 2, name: 'Bob', posts: [] }
  ]
};

function addPostToUser(state, userId, post) {
  return {
    ...state,
    users: state.users.map(user =>
      user.id === userId
        ? { ...user, posts: [...user.posts, post] }
        : user
    )
  };
}
```

### Immer Library (for complex immutability)

```javascript
// Using Immer for easier immutable updates
import produce from 'immer';

const state = {
  users: [
    { id: 1, name: 'Alice', address: { city: 'NYC' } }
  ]
};

// With Immer, you can "mutate" a draft
const newState = produce(state, draft => {
  draft.users[0].address.city = 'SF';
});

// Original is unchanged, new state is created
```

---

## Side Effects

### What are Side Effects?

A side effect is any operation that affects something outside the function's scope or that is observable outside the function besides its return value.

### Common Side Effects

```javascript
// 1. Modifying global or external variables
let count = 0;
function increment() {
  count++; // side effect
}

// 2. Console logging
function calculate(x, y) {
  console.log('Calculating...'); // side effect
  return x + y;
}

// 3. DOM manipulation
function updateUI(data) {
  document.getElementById('output').textContent = data; // side effect
}

// 4. HTTP requests
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`); // side effect
  return response.json();
}

// 5. Reading/writing files
function saveToFile(data) {
  fs.writeFileSync('data.json', JSON.stringify(data)); // side effect
}

// 6. Modifying function arguments
function addProperty(obj) {
  obj.newProp = 'value'; // side effect
}

// 7. Throwing exceptions
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero'); // side effect
}

// 8. Random number generation or Date
function generateId() {
  return Math.random(); // side effect (non-deterministic)
}
```

### Managing Side Effects

While we can't eliminate side effects (they're necessary for useful programs), we can:
1. **Isolate them** in specific functions
2. **Keep core logic pure** and side effects at the edges
3. **Make them explicit** and predictable

```javascript
// ❌ Side effects mixed with logic
function processAndSaveUser(userData) {
  const user = {
    ...userData,
    id: Math.random(),
    createdAt: new Date()
  };
  
  fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
  
  console.log('User saved:', user);
  return user;
}

// ✅ Separate pure logic from side effects
// Pure function
function createUser(userData, id, timestamp) {
  return {
    ...userData,
    id,
    createdAt: timestamp
  };
}

// Side effects isolated
async function saveUser(user) {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
  return response.json();
}

function logUser(user) {
  console.log('User saved:', user);
}

// Orchestration (impure, but composed of pure + isolated side effects)
async function processAndSaveUser(userData) {
  const user = createUser(userData, Math.random(), new Date());
  const saved = await saveUser(user);
  logUser(saved);
  return saved;
}
```

---

## First-Class Functions

### What are First-Class Functions?

In JavaScript, functions are first-class citizens, meaning they:
1. Can be assigned to variables
2. Can be passed as arguments
3. Can be returned from functions
4. Can be stored in data structures

### Examples

```javascript
// 1. Assigning functions to variables
const greet = function(name) {
  return `Hello, ${name}!`;
};

const add = (a, b) => a + b;

// 2. Passing functions as arguments (Higher-Order Functions)
function applyOperation(x, y, operation) {
  return operation(x, y);
}

const result = applyOperation(5, 3, add); // 8
const result2 = applyOperation(5, 3, (a, b) => a * b); // 15

// 3. Returning functions from functions
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// 4. Storing functions in data structures
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b
};

console.log(operations.add(10, 5)); // 15
console.log(operations.multiply(10, 5)); // 50
```

### Higher-Order Functions

Functions that take other functions as arguments or return functions.

```javascript
// Array methods are higher-order functions
const numbers = [1, 2, 3, 4, 5];

numbers.map(n => n * 2);        // [2, 4, 6, 8, 10]
numbers.filter(n => n > 2);     // [3, 4, 5]
numbers.reduce((sum, n) => sum + n, 0); // 15

// Custom higher-order functions
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling with args: ${args}`);
    const result = fn(...args);
    console.log(`Result: ${result}`);
    return result;
  };
}

const addWithLogging = withLogging((a, b) => a + b);
addWithLogging(3, 4); 
// Logs: "Calling with args: 3,4"
// Logs: "Result: 7"
// Returns: 7

// Function that returns a function (closure)
function createCounter() {
  let count = 0;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2
```

### Practical Applications

```javascript
// Event handlers
button.addEventListener('click', function handleClick(event) {
  console.log('Button clicked!');
});

// Callbacks
setTimeout(() => console.log('Delayed'), 1000);

// Array processing
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
];

const names = users
  .filter(user => user.age > 26)
  .map(user => user.name);
// ['Alice', 'Charlie']

// Dependency injection
function createApp(logger) {
  return {
    start: () => logger('App started'),
    stop: () => logger('App stopped')
  };
}

const app = createApp(console.log);
app.start(); // Logs: "App started"
```

---

## Function Composition

### What is Function Composition?

Function composition is the process of combining two or more functions to produce a new function. It's like a pipeline where the output of one function becomes the input of the next.

**Mathematical notation**: `(f ∘ g)(x) = f(g(x))`

### Basic Composition

```javascript
// Individual functions
const add10 = x => x + 10;
const multiply2 = x => x * 2;
const subtract5 = x => x - 5;

// Manual composition
const result = subtract5(multiply2(add10(5)));
// 5 -> 15 -> 30 -> 25

// Composing functions
function compose(f, g) {
  return function(x) {
    return f(g(x));
  };
}

const add10ThenMultiply2 = compose(multiply2, add10);
console.log(add10ThenMultiply2(5)); // 30

// Composing multiple functions
function composeMany(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

const calculate = composeMany(subtract5, multiply2, add10);
console.log(calculate(5)); // 25
// Flow: 5 -> add10 -> multiply2 -> subtract5
```

### Real-World Example

```javascript
// Data transformation pipeline
const users = [
  { name: 'Alice', age: 30, active: true },
  { name: 'Bob', age: 25, active: false },
  { name: 'Charlie', age: 35, active: true }
];

// Without composition
const result1 = users
  .filter(user => user.active)
  .map(user => user.name)
  .map(name => name.toUpperCase());

// With composition
const prop = key => obj => obj[key];
const isActive = user => user.active;
const toUpperCase = str => str.toUpperCase();

const getActiveUserNames = composeMany(
  names => names.map(toUpperCase),
  names => names.map(prop('name')),
  users => users.filter(isActive)
);

const result2 = getActiveUserNames(users);
// ['ALICE', 'CHARLIE']

// String processing example
const trim = str => str.trim();
const toLowerCase = str => str.toLowerCase();
const removeSpaces = str => str.replace(/\s+/g, '-');

const slugify = composeMany(removeSpaces, toLowerCase, trim);

console.log(slugify('  Hello World  ')); // 'hello-world'
```

### Debugging Composed Functions

```javascript
// Tap function for debugging
const tap = label => value => {
  console.log(label, value);
  return value;
};

const calculate2 = composeMany(
  tap('After subtract5:'),
  subtract5,
  tap('After multiply2:'),
  multiply2,
  tap('After add10:'),
  add10,
  tap('Initial value:')
);

calculate2(5);
// Logs:
// Initial value: 5
// After add10: 15
// After multiply2: 30
// After subtract5: 25
```

---

## Pipe and Compose

### Compose vs Pipe

- **Compose**: Right-to-left execution (mathematical notation)
- **Pipe**: Left-to-right execution (more intuitive for reading)

```javascript
// Compose (right to left)
const compose = (...fns) => x => 
  fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe (left to right)
const pipe = (...fns) => x => 
  fns.reduce((acc, fn) => fn(acc), x);

const add5 = x => x + 5;
const multiply3 = x => x * 3;
const subtract2 = x => x - 2;

// Compose: reads right to left
const composed = compose(subtract2, multiply3, add5);
console.log(composed(10)); // ((10 + 5) * 3) - 2 = 43

// Pipe: reads left to right (more natural)
const piped = pipe(add5, multiply3, subtract2);
console.log(piped(10)); // ((10 + 5) * 3) - 2 = 43
```

### Practical Pipe Examples

```javascript
// Data processing pipeline
const users = [
  { name: 'alice', email: 'ALICE@EXAMPLE.COM', age: 30 },
  { name: 'bob', email: 'BOB@EXAMPLE.COM', age: 17 },
  { name: 'charlie', email: 'CHARLIE@EXAMPLE.COM', age: 25 }
];

// Helper functions
const filterAdults = users => users.filter(u => u.age >= 18);
const normalizeEmail = user => ({ ...user, email: user.email.toLowerCase() });
const capitalizeName = user => ({ ...user, name: user.name.charAt(0).toUpperCase() + user.name.slice(1) });
const sortByName = users => [...users].sort((a, b) => a.name.localeCompare(b.name));

// Process users
const processUsers = pipe(
  filterAdults,
  users => users.map(normalizeEmail),
  users => users.map(capitalizeName),
  sortByName
);

const processed = processUsers(users);
console.log(processed);
// [
//   { name: 'Alice', email: 'alice@example.com', age: 30 },
//   { name: 'Charlie', email: 'charlie@example.com', age: 25 }
// ]

// Form validation pipeline
const isNotEmpty = str => str.trim().length > 0;
const isEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const hasMinLength = min => str => str.length >= min;

const validateEmail = pipe(
  str => ({ value: str, valid: true, errors: [] }),
  result => result.valid && isNotEmpty(result.value) 
    ? result 
    : { ...result, valid: false, errors: [...result.errors, 'Email is required'] },
  result => result.valid && isEmail(result.value)
    ? result
    : { ...result, valid: false, errors: [...result.errors, 'Invalid email format'] }
);

console.log(validateEmail('test@example.com'));
// { value: 'test@example.com', valid: true, errors: [] }

console.log(validateEmail('invalid'));
// { value: 'invalid', valid: false, errors: ['Invalid email format'] }
```

### Async Pipe

```javascript
// Async pipe for promises
const asyncPipe = (...fns) => x => 
  fns.reduce(async (acc, fn) => fn(await acc), x);

// Example: API data processing
const fetchUser = id => fetch(`/api/users/${id}`).then(r => r.json());
const extractName = user => user.name;
const toUpperCase = str => str.toUpperCase();
const createGreeting = name => `Hello, ${name}!`;

const greetUser = asyncPipe(
  fetchUser,
  extractName,
  toUpperCase,
  createGreeting
);

// Usage
greetUser(123).then(console.log);
// "Hello, ALICE!"
```

---

## Partial Application

### What is Partial Application?

Partial application is the process of fixing a number of arguments to a function, producing another function with fewer arguments.

### Basic Partial Application

```javascript
// Manual partial application
function multiply(a, b, c) {
  return a * b * c;
}

function multiplyBy2(b, c) {
  return multiply(2, b, c);
}

console.log(multiplyBy2(3, 4)); // 24

// Generic partial function
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

const multiplyBy5 = partial(multiply, 5);
console.log(multiplyBy5(3, 4)); // 60

const multiplyBy5And3 = partial(multiply, 5, 3);
console.log(multiplyBy5And3(4)); // 60
```

### Currying vs Partial Application

```javascript
// Currying: Transform function to take one argument at a time
const curriedMultiply = a => b => c => a * b * c;

console.log(curriedMultiply(2)(3)(4)); // 24

const by2 = curriedMultiply(2);
const by2and3 = by2(3);
console.log(by2and3(4)); // 24

// Curry helper
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...nextArgs) {
      return curried(...args, ...nextArgs);
    };
  };
}

const curriedMult = curry((a, b, c) => a * b * c);
console.log(curriedMult(2)(3)(4));        // 24
console.log(curriedMult(2, 3)(4));        // 24
console.log(curriedMult(2)(3, 4));        // 24
```

### Practical Applications

```javascript
// Configuration functions
function fetchWithConfig(baseUrl, headers, endpoint) {
  return fetch(`${baseUrl}${endpoint}`, { headers });
}

const fetchFromAPI = partial(
  fetchWithConfig,
  'https://api.example.com',
  { 'Authorization': 'Bearer token123' }
);

// Now we can easily fetch from our API
fetchFromAPI('/users');
fetchFromAPI('/posts');

// Event handlers
function handleEvent(action, logger, event) {
  logger(`${action} event triggered`);
  // handle event
}

const handleClick = partial(handleEvent, 'Click', console.log);
const handleSubmit = partial(handleEvent, 'Submit', console.log);

button.addEventListener('click', handleClick);
form.addEventListener('submit', handleSubmit);

// Filtering helpers
function filterBy(property, value, items) {
  return items.filter(item => item[property] === value);
}

const filterByStatus = partial(filterBy, 'status');
const filterByActive = partial(filterBy, 'status', 'active');

const tasks = [
  { id: 1, status: 'active', title: 'Task 1' },
  { id: 2, status: 'completed', title: 'Task 2' },
  { id: 3, status: 'active', title: 'Task 3' }
];

console.log(filterByActive(tasks));
// [{ id: 1, status: 'active', title: 'Task 1' }, ...]

// Validation
function validateRange(min, max, value) {
  return value >= min && value <= max;
}

const isValidAge = partial(validateRange, 0, 120);
const isValidPercentage = partial(validateRange, 0, 100);

console.log(isValidAge(25));           // true
console.log(isValidPercentage(150));   // false
```

### Partial from Right

```javascript
// Partial application from the right
function partialRight(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...remainingArgs, ...fixedArgs);
  };
}

function greet(greeting, name) {
  return `${greeting}, ${name}!`;
}

const greetAlice = partialRight(greet, 'Alice');
console.log(greetAlice('Hello'));     // "Hello, Alice!"
console.log(greetAlice('Good morning')); // "Good morning, Alice!"
```

---

## Point-Free Style

### What is Point-Free Style?

Point-free style (also called tacit programming) is writing functions without explicitly mentioning their arguments. It focuses on composing functions rather than manipulating data.

### Basic Examples

```javascript
// With points (explicit arguments)
const double = x => x * 2;
const numbers = [1, 2, 3];
const doubled = numbers.map(x => double(x));

// Point-free (no explicit arguments)
const doubled2 = numbers.map(double);

// With points
const add = (a, b) => a + b;
const sum = numbers.reduce((acc, x) => add(acc, x), 0);

// Point-free
const sum2 = numbers.reduce(add, 0);
```

### Creating Point-Free Functions

```javascript
// Not point-free
const isEven = x => x % 2 === 0;
const getEvens = numbers => numbers.filter(x => isEven(x));

// Point-free
const getEvens2 = numbers => numbers.filter(isEven);

// Even more point-free with partial application
const filter = fn => array => array.filter(fn);
const map = fn => array => array.map(fn);

const getEvens3 = filter(isEven);
const doubleAll = map(double);

console.log(getEvens3([1, 2, 3, 4]));    // [2, 4]
console.log(doubleAll([1, 2, 3, 4]));    // [2, 4, 6, 8]
```

### Practical Point-Free Examples

```javascript
// String operations
const trim = str => str.trim();
const toLowerCase = str => str.toLowerCase();
const split = separator => str => str.split(separator);
const join = separator => arr => arr.join(separator);

// Not point-free
const getWords = str => str.trim().toLowerCase().split(' ');

// Point-free
const getWords2 = pipe(
  trim,
  toLowerCase,
  split(' ')
);

console.log(getWords2('  Hello World  ')); // ['hello', 'world']

// Array operations
const prop = key => obj => obj[key];
const pluck = key => arr => arr.map(prop(key));
const unique = arr => [...new Set(arr)];

const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'admin' }
];

// Not point-free
const getRoles = users => unique(users.map(u => u.role));

// Point-free
const getRoles2 = pipe(
  pluck('role'),
  unique
);

console.log(getRoles2(users)); // ['admin', 'user']

// Predicates
const not = fn => (...args) => !fn(...args);
const isNil = x => x == null;
const isNotNil = not(isNil);

const values = [1, null, 2, undefined, 3];

// Not point-free
const withoutNils = values.filter(x => isNotNil(x));

// Point-free
const withoutNils2 = values.filter(isNotNil);

console.log(withoutNils2); // [1, 2, 3]
```

### Benefits and Trade-offs

**Benefits:**
- More declarative and readable (when done well)
- Easier to compose and reuse
- Focuses on the transformation, not the data
- Less variable naming required

**Trade-offs:**
- Can be harder to debug
- May be less clear to beginners
- Sometimes requires more helper functions
- Not always the best choice for simple operations

```javascript
// Sometimes point-free is overkill
// Simple: clear and direct
const adults = users.filter(user => user.age >= 18);

// Point-free: more abstract
const isAdult = user => user.age >= 18;
const adults2 = users.filter(isAdult);

// Choose based on reusability and context
// If isAdult is used multiple times, point-free is better
// If it's used once, simple version might be clearer
```

### Advanced Point-Free Utilities

```javascript
// Identity (returns input unchanged)
const identity = x => x;

// Constant (always returns the same value)
const constant = x => () => x;

// Flip (reverse argument order)
const flip = fn => (a, b) => fn(b, a);

// Compose with point-free
const map = fn => arr => arr.map(fn);
const filter = fn => arr => arr.filter(fn);
const reduce = fn => initial => arr => arr.reduce(fn, initial);

// Processing pipeline
const processNumbers = pipe(
  filter(x => x > 0),
  map(x => x * 2),
  reduce((a, b) => a + b)(0)
);

console.log(processNumbers([1, -2, 3, -4, 5])); // 18
// [1, 3, 5] -> [2, 6, 10] -> 18
```

---

## Practice Projects

### Project 1: Data Transformation Pipeline

Build a data processing library using functional programming concepts.

```javascript
// Create a functional data processing library
const FP = {
  // Core utilities
  pipe: (...fns) => x => fns.reduce((acc, fn) => fn(acc), x),
  compose: (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x),
  curry: fn => {
    return function curried(...args) {
      if (args.length >= fn.length) {
        return fn(...args);
      }
      return (...nextArgs) => curried(...args, ...nextArgs);
    };
  },
  
  // Array operations
  map: fn => arr => arr.map(fn),
  filter: fn => arr => arr.filter(fn),
  reduce: fn => initial => arr => arr.reduce(fn, initial),
  
  // Object operations
  prop: key => obj => obj[key],
  pick: keys => obj => keys.reduce((acc, key) => 
    ({ ...acc, [key]: obj[key] }), {}),
  
  // Predicates
  equals: a => b => a === b,
  gt: a => b => b > a,
  lt: a => b => b < a,
  not: fn => (...args) => !fn(...args)
};

// Example usage
const data = [
  { name: 'Alice', age: 30, score: 85, active: true },
  { name: 'Bob', age: 25, score: 92, active: false },
  { name: 'Charlie', age: 35, score: 78, active: true },
  { name: 'David', age: 28, score: 95, active: true }
];

// Process data: get names of active users over 25 with scores > 80
const getTopActiveUsers = FP.pipe(
  FP.filter(user => user.active),
  FP.filter(user => user.age > 25),
  FP.filter(user => user.score > 80),
  FP.map(FP.prop('name'))
);

console.log(getTopActiveUsers(data));
// ['Alice', 'David']
```

**Requirements:**
1. Implement all utility functions using pure functions
2. All operations should be immutable
3. Use point-free style where appropriate
4. Add at least 10 more utility functions
5. Create comprehensive examples demonstrating the library

---

### Project 2: Shopping Cart with Functional Programming

Create a shopping cart system using only functional programming principles.

```javascript
// Shopping cart implementation
const Cart = {
  // Pure functions for cart operations
  empty: () => ({ items: [], discountCode: null }),
  
  addItem: (cart, item) => ({
    ...cart,
    items: [...cart.items, { ...item, id: Date.now() }]
  }),
  
  removeItem: (cart, itemId) => ({
    ...cart,
    items: cart.items.filter(item => item.id !== itemId)
  }),
  
  updateQuantity: (cart, itemId, quantity) => ({
    ...cart,
    items: cart.items.map(item =>
      item.id === itemId
        ? { ...item, quantity }
        : item
    )
  }),
  
  applyDiscount: (cart, code) => ({
    ...cart,
    discountCode: code
  }),
  
  // Calculations (pure functions)
  getSubtotal: cart => 
    cart.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0),
  
  getDiscount: cart => {
    const subtotal = Cart.getSubtotal(cart);
    const discounts = {
      'SAVE10': subtotal * 0.1,
      'SAVE20': subtotal * 0.2,
      'SAVE50': subtotal * 0.5
    };
    return discounts[cart.discountCode] || 0;
  },
  
  getTax: cart => {
    const subtotal = Cart.getSubtotal(cart);
    const discount = Cart.getDiscount(cart);
    return (subtotal - discount) * 0.08;
  },
  
  getTotal: cart => {
    const subtotal = Cart.getSubtotal(cart);
    const discount = Cart.getDiscount(cart);
    const tax = Cart.getTax(cart);
    return subtotal - discount + tax;
  },
  
  getSummary: cart => ({
    itemCount: cart.items.length,
    subtotal: Cart.getSubtotal(cart),
    discount: Cart.getDiscount(cart),
    tax: Cart.getTax(cart),
    total: Cart.getTotal(cart)
  })
};

// Usage example
let cart = Cart.empty();

cart = Cart.addItem(cart, { 
  name: 'Laptop', 
  price: 999, 
  quantity: 1 
});

cart = Cart.addItem(cart, { 
  name: 'Mouse', 
  price: 25, 
  quantity: 2 
});

cart = Cart.applyDiscount(cart, 'SAVE10');

console.log(Cart.getSummary(cart));
// {
//   itemCount: 2,
//   subtotal: 1049,
//   discount: 104.9,
//   tax: 75.528,
//   total: 1019.628
// }
```

**Requirements:**
1. All functions must be pure
2. Implement immutable updates
3. Add features: wishlist, saved carts, order history
4. Create a compose/pipe-based checkout flow
5. Add validation functions using partial application
6. Write tests for all functions

---

### Project 3: Task Management System

Build a functional task management system with filtering, sorting, and statistics.

```javascript
// Task management system
const TaskManager = {
  // Initial state
  initialState: () => ({
    tasks: [],
    filters: { status: 'all', priority: 'all', tag: 'all' },
    sort: { by: 'createdAt', order: 'desc' }
  }),
  
  // Task operations (pure functions)
  addTask: (state, task) => ({
    ...state,
    tasks: [...state.tasks, {
      id: Date.now(),
      title: task.title,
      description: task.description || '',
      status: 'pending',
      priority: task.priority || 'medium',
      tags: task.tags || [],
      createdAt: new Date().toISOString(),
      completedAt: null
    }]
  }),
  
  updateTask: (state, taskId, updates) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates }
        : task
    )
  }),
  
  deleteTask: (state, taskId) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== taskId)
  }),
  
  completeTask: (state, taskId) => 
    TaskManager.updateTask(state, taskId, {
      status: 'completed',
      completedAt: new Date().toISOString()
    }),
  
  setFilters: (state, filters) => ({
    ...state,
    filters: { ...state.filters, ...filters }
  }),
  
  setSort: (state, sort) => ({
    ...state,
    sort: { ...state.sort, ...sort }
  }),
  
  // Selectors (pure functions that derive data)
  getFilteredTasks: state => {
    const { tasks, filters } = state;
    
    return tasks
      .filter(task => 
        filters.status === 'all' || task.status === filters.status)
      .filter(task =>
        filters.priority === 'all' || task.priority === filters.priority)
      .filter(task =>
        filters.tag === 'all' || task.tags.includes(filters.tag));
  },
  
  getSortedTasks: state => {
    const filtered = TaskManager.getFilteredTasks(state);
    const { by, order } = state.sort;
    
    return [...filtered].sort((a, b) => {
      const aVal = a[by];
      const bVal = b[by];
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return order === 'asc' ? comparison : -comparison;
    });
  },
  
  getStats: state => {
    const { tasks } = state;
    
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
      byTag: tasks.reduce((acc, task) => {
        task.tags.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {})
    };
  },
  
  // Composed operations
  bulkComplete: (state, taskIds) => 
    taskIds.reduce(
      (acc, id) => TaskManager.completeTask(acc, id),
      state
    ),
  
  clearCompleted: state => ({
    ...state,
    tasks: state.tasks.filter(task => task.status !== 'completed')
  })
};

// Higher-order function for undo/redo
const withHistory = (initialState, maxHistory = 50) => {
  let past = [];
  let present = initialState;
  let future = [];
  
  return {
    getState: () => present,
    
    execute: (fn, ...args) => {
      past = [...past, present].slice(-maxHistory);
      present = fn(present, ...args);
      future = [];
      return present;
    },
    
    undo: () => {
      if (past.length === 0) return present;
      future = [present, ...future];
      present = past[past.length - 1];
      past = past.slice(0, -1);
      return present;
    },
    
    redo: () => {
      if (future.length === 0) return present;
      past = [...past, present];
      present = future[0];
      future = future.slice(1);
      return present;
    },
    
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0
  };
};

// Usage with history
const taskHistory = withHistory(TaskManager.initialState());

// Execute operations
taskHistory.execute(TaskManager.addTask, {
  title: 'Learn FP',
  priority: 'high',
  tags: ['learning', 'javascript']
});

taskHistory.execute(TaskManager.addTask, {
  title: 'Build project',
  priority: 'medium',
  tags: ['coding']
});

console.log(TaskManager.getStats(taskHistory.getState()));

// Undo last operation
taskHistory.undo();
console.log(taskHistory.getState().tasks.length); // 1

// Redo
taskHistory.redo();
console.log(taskHistory.getState().tasks.length); // 2
```

**Requirements:**
1. Implement all CRUD operations as pure functions
2. Add search functionality using function composition
3. Create advanced filters (date ranges, multiple tags, etc.)
4. Implement export/import functionality
5. Add batch operations using reduce
6. Create a point-free API for common operations
7. Write comprehensive tests

---

## Advanced Challenges

### Challenge 1: Memoization with Pure Functions

```javascript
// Implement a generic memoization function
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Cache hit!');
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Expensive calculation
const fibonacci = memoize(function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

console.log(fibonacci(40)); // Calculates
console.log(fibonacci(40)); // Cache hit!

// Create your own memoization with TTL (time to live)
function memoizeWithTTL(fn, ttl = 5000) {
  // Your implementation here
}
```

### Challenge 2: Transducers

```javascript
// Implement transducers for efficient data transformation
const map = fn => reducer => (acc, value) => 
  reducer(acc, fn(value));

const filter = predicate => reducer => (acc, value) =>
  predicate(value) ? reducer(acc, value) : acc;

const transduce = (xform, reducer, initial, collection) => {
  const transformedReducer = xform(reducer);
  return collection.reduce(transformedReducer, initial);
};

// Usage
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const xform = pipe(
  map(x => x * 2),
  filter(x => x > 10)
);

const result = transduce(
  xform,
  (acc, x) => [...acc, x],
  [],
  numbers
);

console.log(result); // [12, 14, 16, 18, 20]

// Challenge: Implement your own transducers library
```

### Challenge 3: Lens Pattern

```javascript
// Implement lenses for deep object updates
const lens = (getter, setter) => ({
  get: getter,
  set: setter
});

const view = (lens, obj) => lens.get(obj);

const set = (lens, value, obj) => lens.set(value, obj);

const over = (lens, fn, obj) => 
  set(lens, fn(view(lens, obj)), obj);

// Create lenses
const nameLens = lens(
  obj => obj.name,
  (value, obj) => ({ ...obj, name: value })
);

const user = { name: 'Alice', age: 30 };

console.log(view(nameLens, user)); // 'Alice'
console.log(set(nameLens, 'Bob', user)); // { name: 'Bob', age: 30 }
console.log(over(nameLens, name => name.toUpperCase(), user));
// { name: 'ALICE', age: 30 }

// Challenge: Implement nested lenses for deep object paths
// Example: user.address.city.name
```

---

## Resources and Further Learning

### Books
- "Functional-Light JavaScript" by Kyle Simpson
- "Professor Frisby's Mostly Adequate Guide to Functional Programming"
- "JavaScript Allongé" by Reginald Braithwaite

### Libraries
- **Ramda**: Practical functional library for JavaScript
- **Lodash/fp**: Functional programming variant of Lodash
- **Sanctuary**: Refuge from unsafe JavaScript
- **Folktale**: Suite of libraries for functional programming

### Practice Resources
- FreeCodeCamp Functional Programming Section
- Exercism JavaScript Track
- LeetCode (practice with FP approach)

### Key Takeaways

1. **Pure Functions**: No side effects, predictable, testable
2. **Immutability**: Never mutate, always create new data
3. **Function Composition**: Build complex operations from simple ones
4. **Higher-Order Functions**: Functions that work with other functions
5. **Declarative Style**: Focus on what, not how

### Common Pitfalls to Avoid

❌ **Don't:**
- Mutate objects or arrays directly
- Mix pure and impure code without clear boundaries
- Over-engineer simple problems with FP
- Sacrifice readability for clever composition
- Forget about performance implications

✅ **Do:**
- Start simple and refactor to FP gradually
- Use FP where it adds clarity
- Keep functions small and focused
- Write tests for pure functions
- Balance FP principles with practicality

---

## Week 20 Checklist

- [ ] Understand pure functions and can identify them
- [ ] Write code using immutable data structures
- [ ] Recognize and manage side effects
- [ ] Use higher-order functions confidently
- [ ] Compose functions to create pipelines
- [ ] Implement pipe and compose utilities
- [ ] Apply partial application and currying
- [ ] Write point-free code when appropriate
- [ ] Complete Project 1: Data transformation library
- [ ] Complete Project 2: Shopping cart system
- [ ] Complete Project 3: Task management system
- [ ] Attempt at least one advanced challenge
- [ ] Review and refactor previous code with FP principles

---

## Next Steps

After mastering these functional programming concepts, you'll be ready to:
- Work with functional libraries like Ramda or Lodash/fp
- Build reactive applications with RxJS
- Understand React hooks and state management better
- Apply FP principles in real-world projects
- Explore advanced FP topics like monads and functors

**Happy Functional Programming! 🚀**