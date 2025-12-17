# Week 2: Advanced ES6+ — Complete Guide

Welcome to Week 2! This guide covers advanced JavaScript features with practical examples, visual aids, gotchas, and real-world applications.

---

## 📚 Table of Contents
1. [Classes & Inheritance](#classes-inheritance)
2. [Modules (import/export)](#modules)
3. [Optional Chaining (?.)](#optional-chaining)
4. [Nullish Coalescing (??)](#nullish-coalescing)
5. [Maps & Sets](#maps-sets)
6. [WeakMap & WeakSet](#weakmap-weakset)
7. [Symbols](#symbols)
8. [Quick Reference Tables](#quick-reference)
9. [Exercises](#exercises)
10. [Mini Project](#mini-project)
11. [Quiz](#quiz)

---

## 1. Classes & Inheritance {#classes-inheritance}

### What Are Classes?
Classes are templates for creating objects with shared behavior. They're syntactic sugar over JavaScript's prototype-based inheritance, making OOP more intuitive.

### Basic Syntax

```javascript
class Animal {
  // Public field (modern feature)
  species = 'unknown';
  
  // Private field (prefix with #)
  #secret = 'I have feelings';
  
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Instance method
  speak() {
    return `${this.name} makes a noise.`;
  }
  
  // Getter
  get info() {
    return `${this.name} (${this.age} years)`;
  }
  
  // Setter
  set nickname(value) {
    this._nickname = value;
  }
  
  // Static method (belongs to class, not instances)
  static describe() {
    return 'Animals are living organisms';
  }
  
  // Access private field
  revealSecret() {
    return this.#secret;
  }
}

const cat = new Animal('Whiskers', 3);
console.log(cat.speak());           // "Whiskers makes a noise."
console.log(Animal.describe());     // "Animals are living organisms"
console.log(cat.revealSecret());    // "I have feelings"
// console.log(cat.#secret);        // ❌ SyntaxError: Private field
```

### Inheritance with `extends`

```javascript
class Dog extends Animal {
  constructor(name, age, breed) {
    super(name, age);  // MUST call parent constructor first
    this.breed = breed;
    this.species = 'Canis familiaris';
  }
  
  // Override parent method
  speak() {
    return `${this.name} barks!`;
  }
  
  // Call parent method explicitly
  parentSpeak() {
    return super.speak();
  }
  
  // New method specific to Dog
  fetch() {
    return `${this.name} fetches the ball`;
  }
}

const rex = new Dog('Rex', 4, 'Beagle');
console.log(rex.speak());         // "Rex barks!"
console.log(rex.parentSpeak());   // "Rex makes a noise."
console.log(rex instanceof Dog);  // true
console.log(rex instanceof Animal); // true
```

### 🎯 Real-World Use Case

```javascript
// Base component class for UI framework
class Component {
  #state = {};
  
  constructor(props = {}) {
    this.props = props;
  }
  
  setState(newState) {
    this.#state = { ...this.#state, ...newState };
    this.render();
  }
  
  getState() {
    return { ...this.#state };
  }
  
  render() {
    // Override in subclass
    throw new Error('render() must be implemented');
  }
}

class Button extends Component {
  constructor(props) {
    super(props);
    this.setState({ clicked: false });
  }
  
  render() {
    const state = this.getState();
    return `<button>${this.props.label} (clicked: ${state.clicked})</button>`;
  }
  
  click() {
    this.setState({ clicked: true });
  }
}
```

### ⚠️ Common Gotchas

```javascript
// TRAP 1: Method binding
class Counter {
  count = 0;
  
  increment() {
    this.count++;
  }
}

const c = new Counter();
const inc = c.increment;
// inc(); // ❌ TypeError: Cannot read 'count' of undefined

// FIX 1: Use arrow function (auto-binds)
class Counter {
  count = 0;
  
  increment = () => {
    this.count++;
  }
}

// FIX 2: Bind in constructor
class Counter {
  constructor() {
    this.count = 0;
    this.increment = this.increment.bind(this);
  }
  
  increment() {
    this.count++;
  }
}

// TRAP 2: Forgetting super()
class Dog extends Animal {
  constructor(name) {
    this.name = name; // ❌ ReferenceError: Must call super
    super(name);
  }
}

// TRAP 3: Private fields are REALLY private
class Secret {
  #data = 'secret';
}
const s = new Secret();
console.log(s['#data']); // undefined (not accessible this way)
```

### 📊 Class Features Comparison

| Feature | Syntax | Access Level | Use Case |
|---------|--------|--------------|----------|
| Public field | `name = 'value'` | External & Internal | Default properties |
| Private field | `#name = 'value'` | Internal only | Encapsulation |
| Instance method | `method() {}` | External & Internal | Object behavior |
| Static method | `static method() {}` | Class level | Utilities, factories |
| Getter | `get prop() {}` | External & Internal | Computed properties |
| Setter | `set prop(v) {}` | External & Internal | Validation, side effects |

---

## 2. Modules (import/export) {#modules}

### What Are Modules?
Modules let you split code into separate files and manage dependencies explicitly. ES Modules (ESM) are now standard in browsers and Node.js.

### Named Exports

```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI = 3.14159;

// Can also export at the end
function subtract(a, b) {
  return a - b;
}
export { subtract };
```

```javascript
// app.js
import { add, PI } from './math.js';
console.log(add(2, 3));  // 5
console.log(PI);         // 3.14159

// Import with alias
import { multiply as mult } from './math.js';
console.log(mult(4, 5)); // 20

// Import everything
import * as math from './math.js';
console.log(math.add(1, 2)); // 3
```

### Default Exports

```javascript
// logger.js
export default function log(...messages) {
  console.log('[LOG]:', ...messages);
}

// Can also export classes, objects, or values
export default class Logger {
  log(msg) { console.log(msg); }
}
```

```javascript
// app.js
import log from './logger.js';  // Name can be anything
log('Hello', 'World');

// Mixing default and named
import log, { otherFunction } from './logger.js';
```

### Re-exporting

```javascript
// utils/index.js (barrel file)
export { add, multiply } from './math.js';
export { default as log } from './logger.js';
export * from './validation.js'; // Re-export all named exports
```

```javascript
// app.js
import { add, log } from './utils/index.js';
```

### Dynamic Imports

```javascript
// Load modules conditionally or lazily
async function loadHeavyFeature() {
  if (userWantsFeature) {
    const module = await import('./heavy-feature.js');
    module.default();
  }
}

// Use in click handlers, routes, etc.
button.addEventListener('click', async () => {
  const { animate } = await import('./animations.js');
  animate(element);
});
```

### 🎯 Real-World Use Case

```javascript
// config/index.js
const config = {
  dev: { apiUrl: 'http://localhost:3000' },
  prod: { apiUrl: 'https://api.example.com' }
};

export default config[process.env.NODE_ENV || 'dev'];

// services/api.js
import config from './config/index.js';

export async function fetchUser(id) {
  const response = await fetch(`${config.apiUrl}/users/${id}`);
  return response.json();
}

// app.js
import { fetchUser } from './services/api.js';
const user = await fetchUser(123);
```

### ⚠️ Common Gotchas

```javascript
// TRAP 1: File extensions required in browser/Node ESM
import { add } from './math';     // ❌ Error: Cannot find module
import { add } from './math.js';  // ✅ Correct

// TRAP 2: Circular dependencies
// a.js
import { b } from './b.js';
export const a = 'A' + b; // b might be undefined during init!

// b.js
import { a } from './a.js';
export const b = 'B';

// TRAP 3: Default export syntax confusion
export default function myFunc() {}    // ✅
export default const myFunc = () => {} // ❌ SyntaxError

// TRAP 4: Cannot use import in non-module scripts
<script src="app.js"></script>          // ❌ if app.js uses import
<script type="module" src="app.js"></script> // ✅
```

### 📊 Import/Export Patterns
```
| Pattern | Export | Import | Use Case |
|---------|--------|--------|----------|
| Named | `export const x = 1` | `import { x }` | Multiple utilities |
| Default | `export default x` | `import x` | Main export |
| Alias | `export { x as y }` | `import { x as y }` | Avoid name conflicts |
| Re-export | `export * from './a'` | `import { x }` | Barrel files |
| Dynamic | N/A | `await import()` | Code splitting |
```
---

## 3. Optional Chaining (?.) {#optional-chaining}

### What Is It?
Safely access nested properties without checking each level for null/undefined. Short-circuits to `undefined` if any part is nullish.

### Basic Usage

```javascript
const user = {
  name: 'Asha',
  profile: {
    address: {
      city: 'Mumbai'
    }
  }
};

// Traditional way (verbose)
const city1 = user && user.profile && user.profile.address && user.profile.address.city;

// Optional chaining (clean)
const city2 = user?.profile?.address?.city; // 'Mumbai'
const zip = user?.profile?.address?.zip;     // undefined (no error!)
```

### With Functions

```javascript
const obj = {
  method() { return 'called'; }
};

console.log(obj.method?.());      // 'called'
console.log(obj.missing?.());     // undefined (no error)
console.log(obj.method());        // 'called'
// console.log(obj.missing());    // ❌ TypeError
```

### With Arrays

```javascript
const users = [{ name: 'Alice' }, { name: 'Bob' }];
console.log(users?.[0]?.name);    // 'Alice'
console.log(users?.[5]?.name);    // undefined

const config = null;
console.log(config?.settings?.[0]); // undefined
```

### 🎯 Real-World Use Case

```javascript
// API response handling
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  // Safely access nested data
  return {
    name: data?.user?.profile?.name ?? 'Unknown',
    avatar: data?.user?.profile?.avatar?.url ?? '/default.png',
    role: data?.user?.permissions?.[0]?.role ?? 'guest'
  };
}

// Event handling
element?.addEventListener?.('click', handler);

// Callback execution
onComplete?.({ status: 'done' });
```

### ⚠️ Common Gotchas

```javascript
// TRAP 1: Only short-circuits on null/undefined, not other falsy values
const obj = { prop: 0 };
console.log(obj?.prop);        // 0 (not undefined!)

const obj2 = { prop: false };
console.log(obj2?.prop);       // false (not undefined!)

const obj3 = { prop: '' };
console.log(obj3?.prop);       // '' (not undefined!)

// TRAP 2: Cannot use on left side of assignment
// user?.profile?.name = 'New'; // ❌ SyntaxError

// TRAP 3: Doesn't prevent errors in the accessed value
const obj = { method: 'not a function' };
// obj.method?.(); // ❌ TypeError: obj.method is not a function
```

---

## 4. Nullish Coalescing (??) {#nullish-coalescing}

### What Is It?
Returns the right operand when left is `null` or `undefined`. Unlike `||`, it doesn't treat `0`, `''`, or `false` as "missing".

### Basic Usage

```javascript
// With || (logical OR)
const a1 = 0 || 42;        // 42 (0 is falsy)
const a2 = '' || 'default'; // 'default' ('' is falsy)
const a3 = false || true;   // true (false is falsy)

// With ?? (nullish coalescing)
const b1 = 0 ?? 42;        // 0 (0 is valid!)
const b2 = '' ?? 'default'; // '' (empty string is valid!)
const b3 = false ?? true;   // false (false is valid!)

const b4 = null ?? 42;      // 42 (null is nullish)
const b5 = undefined ?? 42; // 42 (undefined is nullish)
```

### 🎯 Real-World Use Case

```javascript
// Configuration with default values
function createServer(config) {
  return {
    port: config.port ?? 3000,        // 0 is valid port (unusual but possible)
    host: config.host ?? 'localhost',
    timeout: config.timeout ?? 5000,
    debug: config.debug ?? false,     // false should be preserved!
    maxRetries: config.maxRetries ?? 3
  };
}

createServer({ port: 0, debug: false });
// { port: 0, host: 'localhost', timeout: 5000, debug: false, maxRetries: 3 }

// Form input handling
function getFormValue(input) {
  return input.value ?? input.defaultValue ?? '';
}

// User preferences
const theme = userPreferences.theme ?? systemTheme ?? 'light';
```

### Combining with Optional Chaining

```javascript
const user = {
  settings: {
    notifications: {
      email: false  // User explicitly disabled
    }
  }
};

// Perfect combo: safe access + proper default
const emailNotifs = user?.settings?.notifications?.email ?? true;
console.log(emailNotifs); // false (user's explicit choice preserved!)

const pushNotifs = user?.settings?.notifications?.push ?? true;
console.log(pushNotifs); // true (not set, so use default)
```

### ⚠️ Common Gotchas

```javascript
// TRAP 1: Cannot mix ?? with && or || without parentheses
// const x = a || b ?? c;  // ❌ SyntaxError
const x = (a || b) ?? c;   // ✅
const y = a ?? (b || c);   // ✅

// TRAP 2: Doesn't work with older nullish-like checks
const val = undefined;
const result1 = val !== null && val !== undefined ? val : 'default';
const result2 = val ?? 'default'; // Much cleaner!

// TRAP 3: Remember ?? only checks null/undefined
const num = NaN ?? 42;     // NaN (NaN is not nullish)
const obj = {} ?? 'default'; // {} (empty object is not nullish)
```

### 📊 ?? vs || Comparison
```
| Value | `value || 'default'` | `value ?? 'default'` |
|-------|---------------------|---------------------|
| `null` | `'default'` | `'default'` |
| `undefined` | `'default'` | `'default'` |
| `0` | `'default'` ❌ | `0` ✅ |
| `''` | `'default'` ❌ | `''` ✅ |
| `false` | `'default'` ❌ | `false` ✅ |
| `NaN` | `'default'` ❌ | `NaN` ✅ |
```
**Use `??` when:** `0`, `false`, `''` are valid values
**Use `||` when:** You want any falsy value to trigger default

---

## 5. Maps & Sets {#maps-sets}

### Map: Key-Value Store with Superpowers

```javascript
// Create a Map
const map = new Map();

// Set values (any type can be a key!)
const objKey = { id: 1 };
const funcKey = function() {};

map.set('string', 'value');
map.set(42, 'number key');
map.set(objKey, 'object key');
map.set(funcKey, 'function key');

// Get values
console.log(map.get('string'));  // 'value'
console.log(map.get(objKey));    // 'object key'
console.log(map.get(42));        // 'number key'

// Check existence
console.log(map.has('string'));  // true
console.log(map.has('missing')); // false

// Get size
console.log(map.size);           // 4

// Delete
map.delete('string');
console.log(map.has('string'));  // false

// Clear all
map.clear();
console.log(map.size);           // 0
```

### Iterating Maps

```javascript
const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3]
]);

// for...of (maintains insertion order!)
for (const [key, value] of map) {
  console.log(key, value);
}

// forEach
map.forEach((value, key) => {
  console.log(key, value);
});

// Get keys, values, entries
console.log([...map.keys()]);    // ['a', 'b', 'c']
console.log([...map.values()]);  // [1, 2, 3]
console.log([...map.entries()]); // [['a', 1], ['b', 2], ['c', 3]]
```

### Set: Unique Values Collection

```javascript
// Create a Set
const set = new Set();

// Add values
set.add(1);
set.add(2);
set.add(2); // Ignored (already exists)
set.add(3);

console.log(set.size); // 3
console.log(set.has(2)); // true

// Delete
set.delete(2);
console.log(set.has(2)); // false

// From array (auto-dedupes)
const nums = new Set([1, 2, 2, 3, 3, 3]);
console.log([...nums]); // [1, 2, 3]
```

### Iterating Sets

```javascript
const set = new Set(['a', 'b', 'c']);

// for...of
for (const value of set) {
  console.log(value);
}

// forEach (value appears twice for compatibility)
set.forEach((value, valueAgain, set) => {
  console.log(value);
});

// Convert to array
const arr = [...set];
const arr2 = Array.from(set);
```

### 🎯 Real-World Use Cases

```javascript
// 1. Caching with object keys
const cache = new Map();

function fetchUserData(user) {
  if (cache.has(user)) {
    return cache.get(user);
  }
  const data = /* fetch from API */;
  cache.set(user, data);
  return data;
}

// 2. Unique tags/categories
function getTags(articles) {
  const tags = new Set();
  articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  return [...tags].sort();
}

// 3. Remove duplicates from array
const unique = [...new Set([1, 2, 2, 3, 3, 3])];

// 4. Track visited nodes in graph
function bfs(startNode) {
  const visited = new Set();
  const queue = [startNode];
  
  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    
    node.neighbors.forEach(n => queue.push(n));
  }
  
  return visited;
}

// 5. Two-way lookup
const userById = new Map();
const userByEmail = new Map();

function addUser(user) {
  userById.set(user.id, user);
  userByEmail.set(user.email, user);
}
```

### ⚠️ Common Gotchas

```javascript
// TRAP 1: Object keys use reference equality
const key1 = { id: 1 };
const key2 = { id: 1 };

map.set(key1, 'value');
console.log(map.get(key2)); // undefined (different objects!)

// TRAP 2: NaN equality is special
const set = new Set();
set.add(NaN);
set.add(NaN);
console.log(set.size); // 1 (NaN === NaN in Set/Map)

// TRAP 3: Sets don't have get() method
const set = new Set([1, 2, 3]);
// set.get(1); // ❌ set.get is not a function
set.has(1);    // ✅ Use has() to check

// TRAP 4: Can't access by index
const set = new Set(['a', 'b', 'c']);
// console.log(set[0]); // undefined (not array-like)
console.log([...set][0]); // 'a' (convert first)
```

### 📊 Map vs Object, Set vs Array

| Feature | Object | Map |
|---------|--------|-----|
| Key types | Strings, Symbols | Any type |
| Key order | Not guaranteed (mostly insertion) | Guaranteed insertion order |
| Size | Manual (`Object.keys(obj).length`) | `map.size` |
| Iteration | `for...in`, `Object.keys()` | `for...of`, `.forEach()` |
| Performance | Good for small | Better for large, frequent add/delete |
| Prototype | Has prototype chain | No prototype pollution |

| Feature | Array | Set |
|---------|-------|-----|
| Duplicates | Allowed | Automatically removed |
| Indexed access | `arr[0]` | Convert to array first |
| Order | Maintained | Maintained (insertion order) |
| Contains check | `arr.includes(x)` O(n) | `set.has(x)` O(1) |
| Use case | Ordered data, duplicates OK | Unique values, membership tests |

---

## 6. WeakMap & WeakSet {#weakmap-weakset}

### What Makes Them "Weak"?
They hold **weak references** to objects. When the object has no other references, it can be garbage collected, and the entry disappears from the WeakMap/WeakSet automatically.

### WeakMap Basics

```javascript
const wm = new WeakMap();

let obj = { id: 1 };
wm.set(obj, 'metadata');

console.log(wm.get(obj));  // 'metadata'
console.log(wm.has(obj));  // true

// When obj is no longer referenced elsewhere
obj = null;
// The entry in wm can be garbage collected
// (you can't observe this directly)
```

### Key Restrictions

```javascript
const wm = new WeakMap();

// ✅ Object keys only
wm.set({}, 'ok');
wm.set(function(){}, 'ok');
wm.set(document.body, 'ok');

// ❌ Primitive keys not allowed
// wm.set('string', 'nope');  // TypeError
// wm.set(42, 'nope');        // TypeError
// wm.set(Symbol(), 'nope');  // TypeError

// ❌ Not iterable
// for (const [k, v] of wm) {}  // TypeError
// console.log(wm.size);         // undefined
// wm.forEach(...);              // TypeError
```

### WeakSet Basics

```javascript
const ws = new WeakSet();

let obj = { id: 1 };
ws.add(obj);

console.log(ws.has(obj));  // true

ws.delete(obj);
console.log(ws.has(obj));  // false

// Same restrictions: objects only, not iterable
```

### 🎯 Real-World Use Cases

```javascript
// 1. Private data for library classes
const privateData = new WeakMap();

class Widget {
  constructor(element) {
    privateData.set(this, {
      element,
      state: {},
      listeners: []
    });
  }
  
  getElement() {
    return privateData.get(this).element;
  }
  
  setState(newState) {
    const data = privateData.get(this);
    data.state = { ...data.state, ...newState };
  }
}

// When a Widget instance is destroyed, its private data is auto-cleaned

// 2. Cache with automatic cleanup
const cache = new WeakMap();

function processData(obj) {
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  const result = /* expensive computation */;
  cache.set(obj, result);
  return result;
}

// When obj is no longer used, cache entry auto-removed

// 3. Track processed objects without leaking memory
const processed = new WeakSet();

function process(obj) {
  if (processed.has(obj)) {
    return; // Already processed
  }
  
  // Do work
  processed.add(obj);
}

// 4. DOM node metadata
const nodeMetadata = new WeakMap();

function attachMetadata(element, data) {
  nodeMetadata.set(element, data);
}

function getMetadata(element) {
  return nodeMetadata.get(element);
}

// When DOM element is removed, metadata is auto-cleaned

// 5. Prevent memory leaks in event listeners
const listenerMap = new WeakMap();

function addListener(element, eventType, handler) {
  if (!listenerMap.has(element)) {
    listenerMap.set(element, []);
  }
  listenerMap.get(element).push({ eventType, handler });
  element.addEventListener(eventType, handler);
}

// When element is garbage collected, listener info goes too
```

### ⚠️ Common Gotchas

```javascript
// TRAP 1: Can't enumerate to debug
const wm = new WeakMap();
wm.set({}, 'value');
// console.log([...wm]); // ❌ TypeError: wm is not iterable

// Can't inspect contents directly - this is intentional!

// TRAP 2: Can't use primitives as keys
const wm = new WeakMap();
// wm.set('key', 'value'); // ❌ TypeError

// TRAP 3: Can't check if empty
const wm = new WeakMap();
// if (wm.size === 0) {} // ❌ undefined
// You can't know how many entries exist

// TRAP 4: Garbage collection is not immediate
let obj = { id: 1 };
const wm = new WeakMap();
wm.set(obj, 'value');
obj = null;
// Entry MIGHT still exist temporarily
// GC runs at unpredictable times
```

### 📊 Map vs WeakMap, Set vs WeakSet

| Feature | Map | WeakMap |
|---------|-----|---------|
| Key types | Any | Objects only |
| Garbage collection | Prevents GC | Allows GC |
| Iterable | Yes | No |
| Size | `map.size` | N/A |
| Use case | General storage | Memory-leak-free metadata |

| Feature | Set | WeakSet |
|---------|-----|---------|
| Value types | Any | Objects only |
| Garbage collection | Prevents GC | Allows GC |
| Iterable | Yes | No |
| Size | `set.size` | N/A |
| Use case | Unique collections | Tracking without leaks |

**Use WeakMap/WeakSet when:**
- Attaching metadata to objects you don't own
- Building caches that shouldn't prevent GC
- Tracking objects in libraries without memory leaks
- You don't need to iterate or inspect contents

---

## 7. Symbols {#symbols}

### What Are Symbols?
Symbols are unique, immutable primitive values. Perfect for creating unique identifiers that won't collide with other property names.

### Creating Symbols

```javascript
// Each call creates a unique symbol
const sym1 = Symbol();
const sym2 = Symbol();
console.log(sym1 === sym2); // false (always unique)

// With description (for debugging)
const sym3 = Symbol('mySymbol');
const sym4 = Symbol('mySymbol');
console.log(sym3 === sym4); // false (still unique despite same description)

console.log(sym3.toString()); // "Symbol(mySymbol)"
console.log(sym3.description); // "mySymbol"
```

### Global Symbol Registry

```javascript
// Create or retrieve from global registry
const globalSym1 = Symbol.for('app.user.id');
const globalSym2 = Symbol.for('app.user.id');

console.log(globalSym1 === globalSym2); // true (same symbol)

// Get key for a symbol
console.log(Symbol.keyFor(globalSym1)); // "app.user.id"

const localSym = Symbol('local');
console.log(Symbol.keyFor(localSym)); // undefined (not in global registry)
```

### Symbols as Object Keys

```javascript
const id = Symbol('id');
const user = {
  name: 'Asha',
  [id]: 12345  // Symbol as computed property
};

console.log(user.name);  // 'Asha'
console.log(user[id]);   // 12345

// Symbols are hidden from normal enumeration
console.log(Object.keys(user));       // ['name']
console.log(Object.values(user));     // ['Asha']
console.log(JSON.stringify(user));    // {"name":"Asha"}

// But can be accessed explicitly
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)]
console.log(Reflect.ownKeys(user));              // ['name', Symbol(id)]
```

### Well-Known Symbols

JavaScript provides built-in symbols to customize language behavior:

```javascript
// 1. Symbol.iterator - Make objects iterable
const range = {
  from: 1,
  to: 5,
  
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// 2. Symbol.toStringTag - Custom type description
class CustomArray {
  get [Symbol.toStringTag]() {
    return 'CustomArray';
  }
}

const arr = new CustomArray();
console.log(Object.prototype.toString.call(arr)); // "[object CustomArray]"

// 3. Symbol.hasInstance - Customize instanceof
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray); // true

// 4. Symbol.toPrimitive - Customize type coercion
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return 42;
    if (hint === 'string') return 'hello';
    return true;
  }
};

console.log(+obj);     // 42
console.log(`${obj}`); // "hello"
console.log(obj + ''); // "true"
```

### 🎯 Real-World Use Cases

```javascript
// 1. Private properties (before # syntax)
const _private = Symbol('private');

class BankAccount {
  constructor(balance) {
    this[_private] = { balance };
  }
  
  getBalance() {
    return this[_private].balance;
  }
}

// 2. Metadata without name collisions
const META = Symbol('metadata');

class Component {
  constructor(name) {
    this.name = name;
    this[META] = {
      createdAt: Date.now(),
      version: '1.0'
    };
  }
}

// 3. Enum-like constants
const Color = {
  RED: Symbol('red'),
  GREEN: Symbol('green'),
  BLUE: Symbol('blue')
};

function setColor(color) {
  if (color === Color.RED) {
    // Can't accidentally pass 'red' string
  }
}

// 4. Framework-specific markers
const REACTIVE = Symbol.for('reactive');

function markReactive(obj) {
  obj[REACTIVE] = true;
  return obj;
}

function isReactive(obj) {
  return obj[REACTIVE] === true;
}
```

### ⚠️ Common Gotchas

```javascript
// TRAP 1: Can't convert to string implicitly
const sym = Symbol('test');
// console.log('Symbol: ' + sym); // ❌ TypeError
console.log('Symbol: ' + sym.toString()); // ✅
console.log(`Symbol: ${String(sym)}`);     // ✅

// TRAP 2: Not included in for...in or Object.keys
const sym = Symbol('hidden');
const obj = { visible: 1, [sym]: 2 };

for (const key in obj) {
  console.log(key); // Only 'visible'
}

// TRAP 3: Symbol() vs Symbol.for()
const s1 = Symbol('key');
const s2 = Symbol.for('key');
console.log(s1 === s2); // false (one is local, one is global)

// TRAP 4: Symbols aren't truly private
const sym = Symbol('secret');
const obj = { [sym]: 'value' };
const symbols = Object.getOwnPropertySymbols(obj);
console.log(obj[symbols[0]]); // 'value' (accessible if you try hard enough)
```

---

## 8. Quick Reference Tables {#quick-reference}

### When to Use What

| Need | Use | Why |
|------|-----|-----|
| Organize code into files | Modules | Standard way to split code |
| Create reusable templates | Classes | OOP patterns |
| Store key-value pairs | Map | Better than objects for dynamic keys |
| Store unique values | Set | Automatic deduplication |
| Attach metadata without leaks | WeakMap | Garbage collection friendly |
| Track objects without leaks | WeakSet | Memory safe |
| Create unique identifiers | Symbol | Guaranteed uniqueness |
| Safe property access | `?.` | Avoid null/undefined errors |
| Default values for nullish | `??` | Preserve 0, false, '' |

### Feature Browser/Node Support

| Feature | Chrome | Firefox | Safari | Node.js |
|---------|--------|---------|--------|---------|
| Classes | 49+ | 45+ | 9+ | 6+ |
| Private fields (#) | 74+ | 90+ | 14.5+ | 12+ |
| Modules | 61+ | 60+ | 11+ | 12+ (with flag), 14+ |
| Optional chaining | 80+ | 74+ | 13.1+ | 14+ |
| Nullish coalescing | 80+ | 72+ | 13.1+ | 14+ |
| Map/Set | 38+ | 13+ | 8+ | 0.12+ |
| WeakMap/WeakSet | 36+ | 6+ | 8+ | 0.12+ |
| Symbols | 38+ | 36+ | 9+ | 0.12+ |

---

## 9. Exercises {#exercises}

### Exercise 1: Classes & Inheritance
**Task:** Create a class hierarchy for a simple game

```javascript
// Create a Character class with:
// - Private field #health
// - Constructor(name, health)
// - Methods: attack(), takeDamage(amount), isAlive()
// - Getter for health

// Create a Warrior subclass that:
// - Adds a weapon property
// - Overrides attack() to do more damage
// - Has a special ability: shieldBlock()

// Create a Mage subclass that:
// - Adds a mana property
// - Overrides attack() to use mana
// - Has a special ability: heal(target)

// Test by creating instances and simulating a battle
```

<details>
<summary>💡 Solution</summary>

```javascript
class Character {
  #health;
  
  constructor(name, health) {
    this.name = name;
    this.#health = health;
  }
  
  get health() {
    return this.#health;
  }
  
  attack() {
    return 10;
  }
  
  takeDamage(amount) {
    this.#health -= amount;
    if (this.#health < 0) this.#health = 0;
  }
  
  isAlive() {
    return this.#health > 0;
  }
}

class Warrior extends Character {
  constructor(name, health, weapon) {
    super(name, health);
    this.weapon = weapon;
  }
  
  attack() {
    return 15; // More damage
  }
  
  shieldBlock() {
    console.log(`${this.name} blocks with shield!`);
    return 0.5; // 50% damage reduction
  }
}

class Mage extends Character {
  constructor(name, health, mana) {
    super(name, health);
    this.mana = mana;
  }
  
  attack() {
    if (this.mana >= 10) {
      this.mana -= 10;
      return 20; // High damage but uses mana
    }
    return 5; // Low damage without mana
  }
  
  heal(target) {
    if (this.mana >= 15) {
      this.mana -= 15;
      target.takeDamage(-20); // Negative damage = healing
      console.log(`${this.name} heals ${target.name}!`);
    }
  }
}

// Test
const warrior = new Warrior('Conan', 100, 'Sword');
const mage = new Mage('Gandalf', 80, 100);

console.log(warrior.attack()); // 15
mage.takeDamage(warrior.attack());
console.log(mage.health); // 65

console.log(mage.attack()); // 20
warrior.takeDamage(mage.attack());
console.log(warrior.health); // 80
```
</details>

### Exercise 2: Modules
**Task:** Create a modular task management system

```javascript
// Create three modules:

// 1. task.js - Export a Task class
//    - Properties: id, title, completed, createdAt
//    - Methods: toggle(), toJSON()

// 2. taskManager.js - Export functions:
//    - addTask(title)
//    - removeTask(id)
//    - toggleTask(id)
//    - getTasks()
//    - Use a Map internally to store tasks

// 3. app.js - Import and use the modules
//    - Add 3 tasks
//    - Toggle one
//    - Remove one
//    - Log all tasks
```

<details>
<summary>💡 Solution</summary>

```javascript
// task.js
export class Task {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.completed = false;
    this.createdAt = new Date();
  }
  
  toggle() {
    this.completed = !this.completed;
  }
  
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      createdAt: this.createdAt.toISOString()
    };
  }
}

// taskManager.js
import { Task } from './task.js';

const tasks = new Map();
let nextId = 1;

export function addTask(title) {
  const task = new Task(nextId++, title);
  tasks.set(task.id, task);
  return task;
}

export function removeTask(id) {
  return tasks.delete(id);
}

export function toggleTask(id) {
  const task = tasks.get(id);
  if (task) {
    task.toggle();
    return true;
  }
  return false;
}

export function getTasks() {
  return [...tasks.values()];
}

// app.js
import { addTask, removeTask, toggleTask, getTasks } from './taskManager.js';

const task1 = addTask('Learn ES6');
const task2 = addTask('Build project');
const task3 = addTask('Write tests');

toggleTask(task1.id);
removeTask(task2.id);

console.log(getTasks());
```
</details>

### Exercise 3: Optional Chaining & Nullish Coalescing
**Task:** Parse API response safely

```javascript
// Given this API response (may be incomplete):
const apiResponse = {
  user: {
    profile: {
      name: 'Alice',
      settings: {
        theme: '',
        notifications: {
          email: false
        }
      }
    }
  }
};

// Extract these values with defaults:
// - name (default: 'Guest')
// - theme (default: 'light', but preserve empty string if set)
// - emailNotifications (default: true, but preserve false if explicitly set)
// - pushNotifications (default: true)
// - language (default: 'en')
```

<details>
<summary>💡 Solution</summary>

```javascript
const name = apiResponse?.user?.profile?.name ?? 'Guest';
const theme = apiResponse?.user?.profile?.settings?.theme ?? 'light';
const emailNotifications = 
  apiResponse?.user?.profile?.settings?.notifications?.email ?? true;
const pushNotifications = 
  apiResponse?.user?.profile?.settings?.notifications?.push ?? true;
const language = 
  apiResponse?.user?.profile?.settings?.language ?? 'en';

console.log({
  name,              // 'Alice'
  theme,             // '' (empty string preserved!)
  emailNotifications, // false (explicit false preserved!)
  pushNotifications,  // true (default, not in response)
  language           // 'en' (default, not in response)
});
```
</details>

### Exercise 4: Maps & Sets
**Task:** Implement a graph with basic traversal

```javascript
// Create a directed graph using Map
// Add these edges: A→B, A→C, B→D, C→D, D→E
// Implement:
// - addEdge(from, to)
// - getNeighbors(node)
// - hasPath(start, end) - use BFS with Set for visited

// Test:
// hasPath('A', 'E') should return true
// hasPath('E', 'A') should return false
```

<details>
<summary>💡 Solution</summary>

```javascript
class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }
  
  addEdge(from, to) {
    if (!this.adjacencyList.has(from)) {
      this.adjacencyList.set(from, []);
    }
    this.adjacencyList.get(from).push(to);
    
    // Ensure 'to' node exists
    if (!this.adjacencyList.has(to)) {
      this.adjacencyList.set(to, []);
    }
  }
  
  getNeighbors(node) {
    return this.adjacencyList.get(node) || [];
  }
  
  hasPath(start, end) {
    const visited = new Set();
    const queue = [start];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current === end) return true;
      if (visited.has(current)) continue;
      
      visited.add(current);
      
      const neighbors = this.getNeighbors(current);
      queue.push(...neighbors);
    }
    
    return false;
  }
}

// Test
const graph = new Graph();
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'D');
graph.addEdge('D', 'E');

console.log(graph.hasPath('A', 'E')); // true
console.log(graph.hasPath('E', 'A')); // false
```
</details>

### Exercise 5: WeakMap
**Task:** Create a memoization decorator using WeakMap

```javascript
// Implement a memoize function that caches results based on object arguments
// Use WeakMap so cache entries are garbage collected when objects are no longer used

function memoize(fn) {
  // Your code here
}

// Test with:
function expensiveOperation(obj) {
  console.log('Computing...');
  return obj.value * 2;
}

const memoized = memoize(expensiveOperation);
const obj1 = { value: 5 };

memoized(obj1); // Logs "Computing...", returns 10
memoized(obj1); // Returns 10 without logging (cached)
memoized({ value: 5 }); // Logs "Computing..." (different object), returns 10
```

<details>
<summary>💡 Solution</summary>

```javascript
function memoize(fn) {
  const cache = new WeakMap();
  
  return function(obj) {
    if (cache.has(obj)) {
      return cache.get(obj);
    }
    
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}

// Test
function expensiveOperation(obj) {
  console.log('Computing...');
  return obj.value * 2;
}

const memoized = memoize(expensiveOperation);
const obj1 = { value: 5 };

console.log(memoized(obj1)); // "Computing...", 10
console.log(memoized(obj1)); // 10 (cached)
console.log(memoized({ value: 5 })); // "Computing...", 10 (different object)

// When obj1 is no longer referenced, cache entry is auto-removed
```
</details>

### Exercise 6: Symbols
**Task:** Create a custom iterable object using Symbol.iterator

```javascript
// Create a Playlist class that:
// - Stores songs in an array
// - Is iterable (can use for...of)
// - Has a shuffle method using Symbol for internal state
// - Hides internal shuffle state from normal enumeration

class Playlist {
  // Your code here
}

// Test:
const playlist = new Playlist();
playlist.add('Song 1');
playlist.add('Song 2');
playlist.add('Song 3');

for (const song of playlist) {
  console.log(song);
}
```

<details>
<summary>💡 Solution</summary>

```javascript
const SHUFFLE_STATE = Symbol('shuffleState');

class Playlist {
  constructor() {
    this.songs = [];
    this[SHUFFLE_STATE] = false;
  }
  
  add(song) {
    this.songs.push(song);
  }
  
  shuffle(enabled) {
    this[SHUFFLE_STATE] = enabled;
  }
  
  [Symbol.iterator]() {
    let songs = [...this.songs];
    
    if (this[SHUFFLE_STATE]) {
      // Fisher-Yates shuffle
      for (let i = songs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [songs[i], songs[j]] = [songs[j], songs[i]];
      }
    }
    
    let index = 0;
    
    return {
      next() {
        if (index < songs.length) {
          return { value: songs[index++], done: false };
        }
        return { done: true };
      }
    };
  }
}

// Test
const playlist = new Playlist();
playlist.add('Bohemian Rhapsody');
playlist.add('Stairway to Heaven');
playlist.add('Hotel California');

console.log('Normal order:');
for (const song of playlist) {
  console.log(song);
}

playlist.shuffle(true);
console.log('\nShuffled:');
for (const song of playlist) {
  console.log(song);
}

console.log('\nVisible properties:', Object.keys(playlist)); // ['songs']
```
</details>

---

## 10. Mini Project: Event Emitter {#mini-project}

Build a production-quality event emitter class with ES6+ features.

### Requirements

```javascript
// Should support:
// 1. on(event, handler) - add listener
// 2. off(event, handler) - remove listener
// 3. once(event, handler) - listen once
// 4. emit(event, ...args) - trigger event
// 5. listenerCount(event) - count listeners
// 6. Use Symbol for internal storage
// 7. Support async handlers with await option
// 8. Bonus: wildcard events (*)
```

### Starter Code

```javascript
class EventEmitter {
  // Implement here
}

// Test
const emitter = new EventEmitter();

emitter.on('data', (msg) => console.log('Listener 1:', msg));
emitter.on('data', (msg) => console.log('Listener 2:', msg));
emitter.once('data', (msg) => console.log('Once:', msg));

emitter.emit('data', 'Hello'); 
// Listener 1: Hello
// Listener 2: Hello
// Once: Hello

emitter.emit('data', 'World');
// Listener 1: World
// Listener 2: World
// (once listener removed)
```

### Full Solution

<details>
<summary>💡 Click to reveal solution</summary>

```javascript
const EVENTS = Symbol('events');
const WILDCARD = '*';

class EventEmitter {
  constructor() {
    this[EVENTS] = new Map();
  }
  
  on(event, handler) {
    if (!this[EVENTS].has(event)) {
      this[EVENTS].set(event, []);
    }
    this[EVENTS].get(event).push(handler);
    return this; // Allow chaining
  }
  
  off(event, handler) {
    const handlers = this[EVENTS].get(event);
    if (!handlers) return this;
    
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
    
    if (handlers.length === 0) {
      this[EVENTS].delete(event);
    }
    
    return this;
  }
  
  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
  
  async emit(event, ...args) {
    const handlers = this[EVENTS].get(event) || [];
    const wildcardHandlers = this[EVENTS].get(WILDCARD) || [];
    const allHandlers = [...handlers, ...wildcardHandlers];
    
    const promises = allHandlers.map(handler => {
      try {
        return handler(...args);
      } catch (error) {
        console.error('Handler error:', error);
        return null;
      }
    });
    
    await Promise.all(promises);
    return this;
  }
  
  listenerCount(event) {
    return (this[EVENTS].get(event) || []).length;
  }
  
  eventNames() {
    return [...this[EVENTS].keys()];
  }
  
  removeAllListeners(event) {
    if (event) {
      this[EVENTS].delete(event);
    } else {
      this[EVENTS].clear();
    }
    return this;
  }
}

// Advanced test
const emitter = new EventEmitter();

// Regular listeners
emitter.on('message', msg => console.log('Handler 1:', msg));
emitter.on('message', msg => console.log('Handler 2:', msg));

// Once listener
emitter.once('message', msg => console.log('Once only:', msg));

// Wildcard listener
emitter.on('*', (data) => console.log('Wildcard caught:', data));

// Async handler
emitter.on('async', async (data) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('Async handler:', data);
});

// Test
console.log('=== First emit ===');
await emitter.emit('message', 'Hello');

console.log('\n=== Second emit ===');
await emitter.emit('message', 'World'); // Once listener won't fire

console.log('\n=== Async emit ===');
await emitter.emit('async', 'Delayed');

console.log('\nListener count:', emitter.listenerCount('message'));
console.log('Event names:', emitter.eventNames());
```
</details>

### Extension Ideas
1. Add priority levels for handlers
2. Implement error event handling
3. Add namespaced events (e.g., 'user:login', 'user:logout')
4. Create a TypeScript version with proper types
5. Add max listener warnings like Node's EventEmitter

---

## 11. Quiz {#quiz}

Test your understanding!

### Question 1: Classes
```javascript
class Animal {
  #secret = 'top secret';
  
  static getType() {
    return this.name;
  }
}

class Dog extends Animal {}

console.log(Dog.getType());
```
What does this log?
<details><summary>Answer</summary>
`"Dog"` - Static methods have access to the class via `this`, and `this.name` returns the class name.
</details>

### Question 2: Optional Chaining
```javascript
const obj = { a: { b: 0 } };
console.log(obj?.a?.b ?? 'default');
```
What does this log?
<details><summary>Answer</summary>
`0` - Optional chaining returns `0` (not `undefined`), and `0 ?? 'default'` returns `0` because nullish coalescing only triggers on `null`/`undefined`.
</details>

### Question 3: Maps
```javascript
const map = new Map();
const key = { id: 1 };
map.set(key, 'value');
console.log(map.get({ id: 1 }));
```
What does this log?
<details><summary>Answer</summary>
`undefined` - Object keys use reference equality. `{ id: 1 }` creates a new object, different from the original key.
</details>

### Question 4: Sets
```javascript
const set = new Set([1, 2, 3, 2, 1]);
set.add(4);
console.log(set.size);
```
What does this log?
<details><summary>Answer</summary>
`4` - Set auto-deduplicates: [1, 2, 3], then adds 4 → size is 4.
</details>

### Question 5: WeakMap
```javascript
const wm = new WeakMap();
wm.set('key', 'value');
```
What happens?
<details><summary>Answer</summary>
`TypeError` - WeakMap keys must be objects, not primitives like strings.
</details>

### Question 6: Symbols
```javascript
const s1 = Symbol.for('key');
const s2 = Symbol.for('key');
console.log(s1 === s2);
```
What does this log?
<details><summary>Answer</summary>
`true` - `Symbol.for()` uses a global registry. Both retrieve the same symbol.
</details>

### Question 7: Inheritance
```javascript
class A {
  constructor() {
    this.name = 'A';
  }
}

class B extends A {
  constructor() {
    this.name = 'B';
    super();
  }
}

new B();
```
What happens?
<details><summary>Answer</summary>
`ReferenceError` - Must call `super()` before accessing `this` in a derived class constructor.
</details>

### Question 8: Modules
```javascript
// module.js
export default function() {}
export const named = 1;

// app.js
import ??? from './module.js';
```
What's the correct import syntax to get both?
<details><summary>Answer</summary>
`import defaultFunc, { named } from './module.js';`
</details>

### Question 9: Nullish Coalescing
```javascript
const result = (null || undefined) ?? 'default';
console.log(result);
```
What does this log?
<details><summary>Answer</summary>
`undefined` - `null || undefined` evaluates to `undefined`, then `undefined ?? 'default'` returns `'default'`... Wait! Actually it's a trick question - you can't mix `||` and `??` without parentheses. This would be a `SyntaxError`.

Corrected: `const result = (null || undefined) ?? 'default';` logs `'default'`.
</details>

### Question 10: Combined Challenge
```javascript
const PRIVATE = Symbol('private');

class Counter {
  [PRIVATE] = { count: 0 };
  
  inc() {
    this[PRIVATE].count++;
  }
  
  get value() {
    return this[PRIVATE]?.count ?? 0;
  }
}

const c = new Counter();
c.inc();
console.log(c.value);
console.log(Object.keys(c));
```
What does this log?
<details><summary>Answer</summary>
First log: `1` (count was incremented)
Second log: `[]` (Symbol properties aren't enumerable)
</details>

---

## 📖 Summary & Next Steps

### What You've Learned

✅ **Classes** - OOP with inheritance, private fields, static methods  
✅ **Modules** - Code organization with import/export  
✅ **Optional Chaining** - Safe property access with `?.`  
✅ **Nullish Coalescing** - Smart defaults with `??`  
✅ **Maps & Sets** - Better data structures for collections  
✅ **WeakMap & WeakSet** - Memory-leak-free object tracking  
✅ **Symbols** - Unique identifiers and metaprogramming  

### Best Practices Checklist

- [x] Use classes when you need inheritance and shared behavior
- [x] Use `#private` fields for truly private data
- [x] Split code into modules for better organization
- [x] Use `?.` for safe access to potentially missing data
- [x] Use `??` when `0`, `false`, `''` are valid values
- [x] Prefer Map over objects for dynamic key-value storage
- [x] Use Set for unique collections and fast membership tests
- [x] Use WeakMap/WeakSet when attaching metadata to objects
- [x] Use Symbols for meta-properties and avoiding collisions
- [x] Always call `super()` before using `this` in constructors

### What's Next?

**Week 3 Topics** (suggested):
- Async JavaScript (Promises, async/await)
- Error handling (try/catch, custom errors)
- Iterators and Generators
- Proxy and Reflect
- Regex improvements
- Array methods (flatMap, at, etc.)

### Additional Resources

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript.info - Modern JavaScript Tutorial](https://javascript.info/)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- [TC39 Proposals](https://github.com/tc39/proposals) - Upcoming features

---

## 🎯 Practice Challenge

Build a complete mini-app that uses ALL Week 2 concepts:

**Task Manager Application**

Requirements:
1. **Classes** - Task, Project, User classes with inheritance
2. **Modules** - Split into separate files (models, services, utils)
3. **Maps** - Store projects by ID
4. **Sets** - Track unique tags
5. **WeakMap** - Attach private metadata to tasks
6. **Symbols** - Custom iterator for Project to iterate tasks
7. **Optional chaining** - Safe access to nested project data
8. **Nullish coalescing** - Default values for configuration

```javascript
// Starter structure:

// models/task.js
export class Task {
  // Your code
}

// models/project.js  
export class Project {
  // Your code - make it iterable!
}

// services/taskService.js
// Use Map and WeakMap

// app.js
// Import and use everything
```

**Bonus:** Add local storage persistence using JSON serialization (careful with Maps/Sets!).

---

**You've completed Week 2! 🎉**

Move to Week 3 when ready, or spend time building projects with these concepts. The best way to learn is by building!