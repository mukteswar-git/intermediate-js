# Week 18: Built-in Structures - Complete Tutorial

## Table of Contents
1. [Arrays - Advanced Methods](#arrays-advanced-methods)
2. [Objects - Deep Dive](#objects-deep-dive)
3. [Maps vs Objects](#maps-vs-objects)
4. [Sets vs Arrays](#sets-vs-arrays)
5. [WeakMap and WeakSet](#weakmap-and-weakset)
6. [Typed Arrays](#typed-arrays)
7. [Practice Exercises](#practice-exercises)

---

## Arrays - Advanced Methods

### Transformation Methods

#### `map()` - Transform Each Element
```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Mapping objects
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];
const names = users.map(user => user.name);
console.log(names); // ['Alice', 'Bob']
```

#### `filter()` - Select Elements
```javascript
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]

// Complex filtering
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 17, active: true },
  { name: 'Charlie', age: 30, active: false }
];
const activeAdults = users.filter(user => user.age >= 18 && user.active);
console.log(activeAdults); // [{ name: 'Alice', age: 25, active: true }]
```

#### `reduce()` - Accumulate Values
```javascript
// Sum of array
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// Creating an object from array
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const fruitCount = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(fruitCount); // { apple: 3, banana: 2, orange: 1 }

// Flattening arrays
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log(flat); // [1, 2, 3, 4, 5]
```

### Search and Test Methods

#### `find()` and `findIndex()`
```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: 'Bob' }

const index = users.findIndex(u => u.name === 'Charlie');
console.log(index); // 2
```

#### `some()` and `every()`
```javascript
const numbers = [1, 2, 3, 4, 5];

const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true

const allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // false
```

### Iteration Methods

#### `forEach()` - Side Effects
```javascript
const numbers = [1, 2, 3];
numbers.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});
// Index 0: 1
// Index 1: 2
// Index 2: 3
```

#### `flatMap()` - Map and Flatten
```javascript
const sentences = ['Hello world', 'How are you'];
const words = sentences.flatMap(sentence => sentence.split(' '));
console.log(words); // ['Hello', 'world', 'How', 'are', 'you']

// Duplicate and transform
const numbers = [1, 2, 3];
const doubled = numbers.flatMap(num => [num, num * 2]);
console.log(doubled); // [1, 2, 2, 4, 3, 6]
```

### Advanced Array Techniques

#### Method Chaining
```javascript
const users = [
  { name: 'Alice', age: 25, score: 85 },
  { name: 'Bob', age: 17, score: 92 },
  { name: 'Charlie', age: 30, score: 78 },
  { name: 'David', age: 22, score: 95 }
];

const topAdultScores = users
  .filter(user => user.age >= 18)
  .map(user => ({ name: user.name, score: user.score }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 2);

console.log(topAdultScores);
// [{ name: 'David', score: 95 }, { name: 'Alice', score: 85 }]
```

#### Array Grouping
```javascript
// Grouping by property
const products = [
  { name: 'Apple', category: 'Fruit' },
  { name: 'Carrot', category: 'Vegetable' },
  { name: 'Banana', category: 'Fruit' },
  { name: 'Broccoli', category: 'Vegetable' }
];

const grouped = products.reduce((acc, product) => {
  const category = product.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(product);
  return acc;
}, {});

console.log(grouped);
// {
//   Fruit: [{ name: 'Apple', ... }, { name: 'Banana', ... }],
//   Vegetable: [{ name: 'Carrot', ... }, { name: 'Broccoli', ... }]
// }
```

---

## Objects - Deep Dive

### Object Creation Patterns

#### Object Literals
```javascript
const person = {
  name: 'Alice',
  age: 25,
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};
```

#### Constructor Functions
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const alice = new Person('Alice', 25);
alice.greet(); // Hello, I'm Alice
```

#### Object.create()
```javascript
const personProto = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

const alice = Object.create(personProto);
alice.name = 'Alice';
alice.age = 25;
alice.greet(); // Hello, I'm Alice
```

### Object Static Methods

#### `Object.keys()`, `Object.values()`, `Object.entries()`
```javascript
const person = {
  name: 'Alice',
  age: 25,
  city: 'New York'
};

console.log(Object.keys(person)); // ['name', 'age', 'city']
console.log(Object.values(person)); // ['Alice', 25, 'New York']
console.log(Object.entries(person)); 
// [['name', 'Alice'], ['age', 25], ['city', 'New York']]

// Converting back to object
const entries = [['name', 'Bob'], ['age', 30]];
const obj = Object.fromEntries(entries);
console.log(obj); // { name: 'Bob', age: 30 }
```

#### `Object.assign()` - Shallow Copy and Merge
```javascript
const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };

const result = Object.assign(target, source);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(target); // { a: 1, b: 3, c: 4 } (modified!)

// Creating a new object (common pattern)
const merged = Object.assign({}, target, source);

// Spread operator alternative (preferred)
const merged2 = { ...target, ...source };
```

#### `Object.freeze()` and `Object.seal()`
```javascript
// Object.freeze() - No modifications allowed
const frozen = Object.freeze({ name: 'Alice', age: 25 });
frozen.age = 30; // Silently fails (throws in strict mode)
frozen.city = 'NYC'; // Silently fails
delete frozen.name; // Silently fails
console.log(frozen); // { name: 'Alice', age: 25 }

// Object.seal() - Can modify existing properties
const sealed = Object.seal({ name: 'Bob', age: 30 });
sealed.age = 31; // Works
sealed.city = 'LA'; // Silently fails
delete sealed.name; // Silently fails
console.log(sealed); // { name: 'Bob', age: 31 }
```

#### Property Descriptors
```javascript
const obj = {};

Object.defineProperty(obj, 'name', {
  value: 'Alice',
  writable: true,      // Can be changed
  enumerable: true,    // Shows in for...in and Object.keys()
  configurable: true   // Can be deleted or redefined
});

// Making a read-only property
Object.defineProperty(obj, 'id', {
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false
});

obj.id = 456; // Silently fails
console.log(obj.id); // 123

// Getting property descriptor
const descriptor = Object.getOwnPropertyDescriptor(obj, 'name');
console.log(descriptor);
// { value: 'Alice', writable: true, enumerable: true, configurable: true }
```

### Prototypes and Inheritance

```javascript
// Prototype chain
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// Setting up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} barks!`);
};

const dog = new Dog('Max', 'Golden Retriever');
dog.speak(); // Max makes a sound
dog.bark();  // Max barks!

console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
```

---

## Maps vs Objects

### Map Basics

```javascript
// Creating a Map
const userMap = new Map();

// Setting values
userMap.set('name', 'Alice');
userMap.set('age', 25);
userMap.set(1, 'number key');

// Getting values
console.log(userMap.get('name')); // Alice
console.log(userMap.get(1));      // number key

// Checking existence
console.log(userMap.has('name')); // true

// Deleting
userMap.delete('age');

// Size
console.log(userMap.size); // 2

// Clearing all
userMap.clear();
```

### Maps with Object Keys

```javascript
// Objects as keys (Maps advantage!)
const user1 = { name: 'Alice' };
const user2 = { name: 'Bob' };

const userScores = new Map();
userScores.set(user1, 95);
userScores.set(user2, 87);

console.log(userScores.get(user1)); // 95
console.log(userScores.get(user2)); // 87
```

### Map Iteration

```javascript
const map = new Map([
  ['name', 'Alice'],
  ['age', 25],
  ['city', 'NYC']
]);

// Iterating over keys
for (const key of map.keys()) {
  console.log(key);
}

// Iterating over values
for (const value of map.values()) {
  console.log(value);
}

// Iterating over entries
for (const [key, value] of map.entries()) {
  console.log(`${key}: ${value}`);
}

// forEach
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// Converting to array
const arr = Array.from(map);
console.log(arr); // [['name', 'Alice'], ['age', 25], ['city', 'NYC']]
```

### When to Use Maps vs Objects

**Use Maps when:**
- Keys are not strings/symbols
- Keys are unknown until runtime
- All keys are the same type and all values are the same type
- You need to frequently add/remove key-value pairs
- You need the size of the collection
- You need to iterate in insertion order

**Use Objects when:**
- You need JSON serialization
- Working with simple string keys
- You need property access syntax (obj.prop)
- Working with object methods and prototypes

```javascript
// Map advantages
const map = new Map();
map.set({}, 'object key');
map.set(function() {}, 'function key');
map.set(NaN, 'NaN key');
console.log(map.size); // 3

// Object limitations
const obj = {};
obj[{}] = 'object key';  // Converts to "[object Object]"
obj[function() {}] = 'function key';  // Converts to function's string
obj[NaN] = 'NaN key';
console.log(Object.keys(obj).length); // Just strings

// Performance comparison
console.time('Map insertion');
const perfMap = new Map();
for (let i = 0; i < 1000000; i++) {
  perfMap.set(i, i);
}
console.timeEnd('Map insertion');

console.time('Object insertion');
const perfObj = {};
for (let i = 0; i < 1000000; i++) {
  perfObj[i] = i;
}
console.timeEnd('Object insertion');
```

---

## Sets vs Arrays

### Set Basics

```javascript
// Creating a Set
const numbers = new Set([1, 2, 3, 4, 5]);
console.log(numbers); // Set(5) { 1, 2, 3, 4, 5 }

// Adding values
numbers.add(6);
numbers.add(3); // Duplicate, won't be added
console.log(numbers.size); // 6

// Checking existence
console.log(numbers.has(3)); // true
console.log(numbers.has(10)); // false

// Deleting
numbers.delete(2);

// Clearing
numbers.clear();
```

### Set Operations

```javascript
// Removing duplicates from array
const arr = [1, 2, 2, 3, 3, 3, 4, 5, 5];
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3, 4, 5]

// Union
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);
const union = new Set([...setA, ...setB]);
console.log(union); // Set { 1, 2, 3, 4, 5 }

// Intersection
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log(intersection); // Set { 3 }

// Difference
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log(difference); // Set { 1, 2 }

// Symmetric Difference
const symDiff = new Set([
  ...[...setA].filter(x => !setB.has(x)),
  ...[...setB].filter(x => !setA.has(x))
]);
console.log(symDiff); // Set { 1, 2, 4, 5 }
```

### Set Iteration

```javascript
const fruits = new Set(['apple', 'banana', 'orange']);

// for...of
for (const fruit of fruits) {
  console.log(fruit);
}

// forEach
fruits.forEach(fruit => {
  console.log(fruit);
});

// values() and keys() (same in Sets)
for (const fruit of fruits.values()) {
  console.log(fruit);
}

// entries() - returns [value, value]
for (const [key, value] of fruits.entries()) {
  console.log(key, value); // Same value twice
}
```

### When to Use Sets vs Arrays

**Use Sets when:**
- You need unique values
- You need fast membership testing (has())
- You need set operations (union, intersection, etc.)
- Order doesn't matter or you want insertion order

**Use Arrays when:**
- You need indexed access
- Duplicates are meaningful
- You need array methods (map, filter, reduce)
- You need to sort frequently

```javascript
// Performance comparison
console.time('Array includes');
const arr = Array.from({ length: 100000 }, (_, i) => i);
arr.includes(99999);
console.timeEnd('Array includes'); // Slower

console.time('Set has');
const set = new Set(arr);
set.has(99999);
console.timeEnd('Set has'); // Much faster
```

---

## WeakMap and WeakSet

### WeakMap

WeakMap holds "weak" references to objects, allowing them to be garbage collected.

```javascript
// Basic WeakMap usage
const wm = new WeakMap();

let obj1 = { name: 'Alice' };
let obj2 = { name: 'Bob' };

wm.set(obj1, 'data for Alice');
wm.set(obj2, 'data for Bob');

console.log(wm.get(obj1)); // data for Alice

// When objects are no longer referenced, they can be GC'd
obj1 = null; // Now eligible for garbage collection

// WeakMap methods (limited)
console.log(wm.has(obj2)); // true
wm.delete(obj2);
```

### WeakMap Use Cases

#### Private Data Storage
```javascript
const privateData = new WeakMap();

class User {
  constructor(name, ssn) {
    this.name = name;
    privateData.set(this, { ssn });
  }
  
  getSSN() {
    return privateData.get(this).ssn;
  }
}

const user = new User('Alice', '123-45-6789');
console.log(user.name);      // Alice
console.log(user.ssn);       // undefined
console.log(user.getSSN());  // 123-45-6789
```

#### Caching/Memoization
```javascript
const cache = new WeakMap();

function processObject(obj) {
  if (cache.has(obj)) {
    console.log('Returning cached result');
    return cache.get(obj);
  }
  
  console.log('Computing result');
  const result = { processed: true, data: obj };
  cache.set(obj, result);
  return result;
}

const myObj = { value: 42 };
processObject(myObj); // Computing result
processObject(myObj); // Returning cached result
```

### WeakSet

WeakSet is like Set but only holds objects weakly.

```javascript
const ws = new WeakSet();

let obj1 = { name: 'Alice' };
let obj2 = { name: 'Bob' };

ws.add(obj1);
ws.add(obj2);

console.log(ws.has(obj1)); // true

ws.delete(obj2);
console.log(ws.has(obj2)); // false

obj1 = null; // Can be garbage collected
```

### WeakSet Use Case - Tracking Objects

```javascript
const visitedObjects = new WeakSet();

function traverse(obj) {
  // Avoid infinite loops with circular references
  if (visitedObjects.has(obj)) {
    return;
  }
  
  visitedObjects.add(obj);
  
  // Process object
  console.log('Processing:', obj);
  
  // Traverse properties
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      traverse(obj[key]);
    }
  }
}

const circular = { name: 'root' };
circular.self = circular; // Circular reference

traverse(circular); // Won't cause infinite loop
```

### Weak Collections Limitations

```javascript
// No size property
const wm = new WeakMap();
// console.log(wm.size); // undefined

// Not iterable
const ws = new WeakSet();
// for (const item of ws) {} // Error

// Only object keys (WeakMap) or values (WeakSet)
const weakMap = new WeakMap();
// weakMap.set('string', 'value'); // Error
// weakMap.set(123, 'value'); // Error
weakMap.set({}, 'value'); // OK
```

---

## Typed Arrays

Typed Arrays provide a way to work with binary data efficiently.

### Typed Array Types

```javascript
// 8-bit integers
const int8 = new Int8Array(4);        // -128 to 127
const uint8 = new Uint8Array(4);      // 0 to 255

// 16-bit integers
const int16 = new Int16Array(4);      // -32768 to 32767
const uint16 = new Uint16Array(4);    // 0 to 65535

// 32-bit integers
const int32 = new Int32Array(4);      // -2^31 to 2^31-1
const uint32 = new Uint32Array(4);    // 0 to 2^32-1

// Floating point
const float32 = new Float32Array(4);  // 32-bit float
const float64 = new Float64Array(4);  // 64-bit float (standard JS number)

// Special
const uint8clamped = new Uint8ClampedArray(4); // 0 to 255, clamped
```

### Creating Typed Arrays

```javascript
// From length
const arr1 = new Uint8Array(4);
console.log(arr1); // Uint8Array(4) [0, 0, 0, 0]

// From array
const arr2 = new Uint8Array([1, 2, 3, 4]);
console.log(arr2); // Uint8Array(4) [1, 2, 3, 4]

// From another typed array
const arr3 = new Uint16Array(arr2);
console.log(arr3); // Uint16Array(4) [1, 2, 3, 4]

// From ArrayBuffer
const buffer = new ArrayBuffer(8); // 8 bytes
const arr4 = new Uint8Array(buffer);
const arr5 = new Uint16Array(buffer);

console.log(arr4.length); // 8 (8 bytes / 1 byte per element)
console.log(arr5.length); // 4 (8 bytes / 2 bytes per element)
```

### ArrayBuffer and DataView

```javascript
// ArrayBuffer - raw binary data
const buffer = new ArrayBuffer(16); // 16 bytes

// Multiple views of same buffer
const view1 = new Uint8Array(buffer);
const view2 = new Uint16Array(buffer);
const view3 = new Uint32Array(buffer);

view1[0] = 255;
console.log(view1[0]); // 255
console.log(view2[0]); // 255
console.log(view3[0]); // 255

// DataView - flexible view
const dataView = new DataView(buffer);

// Set different types at different offsets
dataView.setUint8(0, 255);
dataView.setUint16(2, 65535);
dataView.setFloat32(4, 3.14);

console.log(dataView.getUint8(0));    // 255
console.log(dataView.getUint16(2));   // 65535
console.log(dataView.getFloat32(4));  // 3.14159...
```

### Working with Typed Arrays

```javascript
const arr = new Uint8Array([10, 20, 30, 40, 50]);

// Array-like operations
console.log(arr.length);      // 5
console.log(arr[2]);          // 30
arr[2] = 35;
console.log(arr);             // Uint8Array [10, 20, 35, 40, 50]

// Many array methods work
const doubled = arr.map(x => x * 2);
console.log(doubled); // Uint8Array [20, 40, 70, 80, 100]

const filtered = arr.filter(x => x > 30);
console.log(filtered); // Uint8Array [35, 40, 50]

const sum = arr.reduce((acc, val) => acc + val, 0);
console.log(sum); // 165

// Slicing
const slice = arr.slice(1, 4);
console.log(slice); // Uint8Array [20, 35, 40]

// Subarray (shares same buffer)
const sub = arr.subarray(1, 4);
sub[0] = 99;
console.log(arr); // Uint8Array [10, 99, 35, 40, 50] (modified!)
```

### Overflow Behavior

```javascript
// Uint8: wraps around at 255
const uint8 = new Uint8Array([255]);
uint8[0] += 1;
console.log(uint8[0]); // 0

uint8[0] = 256;
console.log(uint8[0]); // 0

uint8[0] = 257;
console.log(uint8[0]); // 1

// Uint8Clamped: clamps to 0-255
const clamped = new Uint8ClampedArray([255]);
clamped[0] += 10;
console.log(clamped[0]); // 255 (clamped, not wrapped)

clamped[0] = -10;
console.log(clamped[0]); // 0 (clamped)

// Int8: wraps in signed range
const int8 = new Int8Array([127]); // max positive
int8[0] += 1;
console.log(int8[0]); // -128 (wrapped to min negative)
```

### Use Cases for Typed Arrays

```javascript
// 1. Binary file processing
function readBinaryFile(arrayBuffer) {
  const data = new Uint8Array(arrayBuffer);
  // Process binary data
  return data;
}

// 2. Image processing (Canvas)
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, 100, 100);
// imageData.data is Uint8ClampedArray
const pixels = imageData.data; // RGBA values

// 3. Audio processing
const audioContext = new AudioContext();
const buffer = audioContext.createBuffer(2, 44100, 44100);
const channelData = buffer.getChannelData(0); // Float32Array

// 4. Network protocols
const packet = new ArrayBuffer(16);
const view = new DataView(packet);
view.setUint8(0, 1);      // Version
view.setUint32(4, 12345); // Packet ID
view.setFloat32(8, 3.14); // Data

// 5. WebGL buffers
const vertices = new Float32Array([
  0.0,  0.5, 0.0,
  -0.5, -0.5, 0.0,
  0.5, -0.5, 0.0
]);
// Pass to WebGL
```

---

## Practice Exercises

### Exercise 1: Array Analysis Tool
Create a function that takes an array of numbers and returns comprehensive statistics.

```javascript
function analyzeArray(numbers) {
  // TODO: Return an object with:
  // - sum
  // - average
  // - min
  // - max
  // - median
  // - mode (most frequent number)
}

// Test
console.log(analyzeArray([1, 2, 2, 3, 4, 5, 5, 5, 6]));
```

### Exercise 2: Object Transformer
Create a function that deeply transforms object property names from camelCase to snake_case.

```javascript
function toSnakeCase(obj) {
  // TODO: Transform all keys recursively
  // Example: { firstName: 'John', userAge: 30 }
  // Should become: { first_name: 'John', user_age: 30 }
}
```

### Exercise 3: Cache System
Build a caching system using Maps that has a size limit and evicts the least recently used items.

```javascript
class LRUCache {
  constructor(capacity) {
    // TODO: Initialize cache
  }
  
  get(key) {
    // TODO: Get value and update access time
  }
  
  put(key, value) {
    // TODO: Add value, evict LRU if over capacity
  }
}
```

### Exercise 4: Set Operations Library
Create a library of set operations.

```javascript
const SetOps = {
  union: (setA, setB) => {
    // TODO
  },
  
  intersection: (setA, setB) => {
    // TODO
  },
  
  difference: (setA, setB) => {
    // TODO
  },
  
  isSubset: (setA, setB) => {
    // TODO: Check if setA is subset of setB
  },
  
  isSuperset: (setA, setB) => {
    // TODO: Check if setA is superset of setB
  }
};
```

### Exercise 5: Binary Data Parser
Create a parser for a simple binary protocol using Typed Arrays.

```javascript
// Protocol: [version(1 byte)][id(4 bytes)][length(2 bytes)][data(variable)]
function createPacket(version, id, data) {
  // TODO: Create ArrayBuffer with the protocol structure
}

function parsePacket(buffer) {
  // TODO: Parse the buffer and return an object with version, id, and data
}
```

### Exercise 6: Weak Reference Memory Manager
Create a system that tracks object usage without preventing garbage collection.

```javascript
class MemoryTracker {
  constructor() {
    // TODO: Use WeakMap to track objects
  }
  
  track(obj, metadata) {
    // TODO: Track object with metadata
  }
  
  getMetadata(obj) {
    // TODO: Get metadata for object
  }
}
```

### Exercise 7: Advanced Array Pipeline
Create a data processing pipeline using array methods.

```javascript
const transactions = [
  { id: 1, amount: 100, category: 'food', date: '2024-01-15' },
  { id: 2, amount: 50, category: 'transport', date: '2024-01-16' },
  { id: 3, amount: 200, category: 'food', date: '2024-01-17' },
  { id: 4, amount: 30, category: 'entertainment', date: '2024-01-18' },
  { id: 5, amount: 75, category: 'transport', date: '2024-01-19' }
];

function processTransactions(transactions) {
  // TODO: Create a pipeline that:
  // 1. Filters transactions > $40
  // 2. Groups by category
  // 3. Calculates total per category
  // 4. Sorts by total (descending)
  // 5. Returns array of { category, total, count }
}
```

---

## Solutions to Practice Exercises

### Solution 1: Array Analysis Tool
```javascript
function analyzeArray(numbers) {
  if (numbers.length === 0) return null;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  
  // Sum
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  
  // Average
  const average = sum / numbers.length;
  
  // Min and Max
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  
  // Median
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
  
  // Mode (most frequent)
  const frequency = numbers.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {});
  
  let maxFreq = 0;
  let mode = null;
  for (const [num, freq] of Object.entries(frequency)) {
    if (freq > maxFreq) {
      maxFreq = freq;
      mode = Number(num);
    }
  }
  
  return { sum, average, min, max, median, mode };
}

// Test
console.log(analyzeArray([1, 2, 2, 3, 4, 5, 5, 5, 6]));
// {
//   sum: 33,
//   average: 3.6666...,
//   min: 1,
//   max: 6,
//   median: 4,
//   mode: 5
// }
```

### Solution 2: Object Transformer
```javascript
function toSnakeCase(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item));
  }
  
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    // Recursively transform nested objects
    result[snakeKey] = toSnakeCase(value);
  }
  
  return result;
}

// Test
const user = {
  firstName: 'John',
  lastName: 'Doe',
  userAge: 30,
  contactInfo: {
    emailAddress: 'john@example.com',
    phoneNumber: '123-456-7890'
  },
  orderHistory: [
    { orderId: 1, orderDate: '2024-01-15' }
  ]
};

console.log(toSnakeCase(user));
// {
//   first_name: 'John',
//   last_name: 'Doe',
//   user_age: 30,
//   contact_info: {
//     email_address: 'john@example.com',
//     phone_number: '123-456-7890'
//   },
//   order_history: [
//     { order_id: 1, order_date: '2024-01-15' }
//   ]
// }
```

### Solution 3: Cache System
```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  put(key, value) {
    // If key exists, remove it first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Add new entry
    this.cache.set(key, value);
    
    // Evict least recently used if over capacity
    if (this.cache.size > this.capacity) {
      // First key is least recently used
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
  
  size() {
    return this.cache.size;
  }
  
  clear() {
    this.cache.clear();
  }
}

// Test
const cache = new LRUCache(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
console.log(cache.get('a')); // 1
cache.put('d', 4); // Evicts 'b'
console.log(cache.get('b')); // undefined
console.log(cache.get('c')); // 3
```

### Solution 4: Set Operations Library
```javascript
const SetOps = {
  union: (setA, setB) => {
    return new Set([...setA, ...setB]);
  },
  
  intersection: (setA, setB) => {
    return new Set([...setA].filter(x => setB.has(x)));
  },
  
  difference: (setA, setB) => {
    return new Set([...setA].filter(x => !setB.has(x)));
  },
  
  symmetricDifference: (setA, setB) => {
    const diff1 = SetOps.difference(setA, setB);
    const diff2 = SetOps.difference(setB, setA);
    return SetOps.union(diff1, diff2);
  },
  
  isSubset: (setA, setB) => {
    return [...setA].every(x => setB.has(x));
  },
  
  isSuperset: (setA, setB) => {
    return SetOps.isSubset(setB, setA);
  },
  
  isDisjoint: (setA, setB) => {
    return [...setA].every(x => !setB.has(x));
  },
  
  cartesianProduct: (setA, setB) => {
    const result = new Set();
    for (const a of setA) {
      for (const b of setB) {
        result.add([a, b]);
      }
    }
    return result;
  }
};

// Test
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

console.log(SetOps.union(setA, setB));              // Set { 1, 2, 3, 4, 5, 6 }
console.log(SetOps.intersection(setA, setB));       // Set { 3, 4 }
console.log(SetOps.difference(setA, setB));         // Set { 1, 2 }
console.log(SetOps.symmetricDifference(setA, setB)); // Set { 1, 2, 5, 6 }
console.log(SetOps.isSubset(new Set([1, 2]), setA)); // true
console.log(SetOps.isSuperset(setA, new Set([1, 2]))); // true
```

### Solution 5: Binary Data Parser
```javascript
// Protocol: [version(1 byte)][id(4 bytes)][length(2 bytes)][data(variable)]
function createPacket(version, id, data) {
  const dataBytes = new TextEncoder().encode(data);
  const length = dataBytes.length;
  
  // Total size: 1 + 4 + 2 + data length
  const buffer = new ArrayBuffer(7 + length);
  const view = new DataView(buffer);
  
  // Write version (1 byte)
  view.setUint8(0, version);
  
  // Write id (4 bytes)
  view.setUint32(1, id);
  
  // Write length (2 bytes)
  view.setUint16(5, length);
  
  // Write data
  const uint8View = new Uint8Array(buffer);
  uint8View.set(dataBytes, 7);
  
  return buffer;
}

function parsePacket(buffer) {
  const view = new DataView(buffer);
  
  // Read version
  const version = view.getUint8(0);
  
  // Read id
  const id = view.getUint32(1);
  
  // Read length
  const length = view.getUint16(5);
  
  // Read data
  const dataBytes = new Uint8Array(buffer, 7, length);
  const data = new TextDecoder().decode(dataBytes);
  
  return { version, id, length, data };
}

// Test
const packet = createPacket(1, 12345, 'Hello, World!');
console.log(parsePacket(packet));
// { version: 1, id: 12345, length: 13, data: 'Hello, World!' }

// Display packet bytes
const bytes = new Uint8Array(packet);
console.log('Packet bytes:', Array.from(bytes));
```

### Solution 6: Weak Reference Memory Manager
```javascript
class MemoryTracker {
  constructor() {
    this.tracker = new WeakMap();
    this.accessLog = new WeakMap();
    this.allocationTime = new WeakMap();
  }
  
  track(obj, metadata = {}) {
    if (typeof obj !== 'object' || obj === null) {
      throw new Error('Can only track objects');
    }
    
    this.tracker.set(obj, {
      ...metadata,
      trackedAt: new Date()
    });
    
    this.allocationTime.set(obj, Date.now());
    this.accessLog.set(obj, []);
  }
  
  getMetadata(obj) {
    return this.tracker.get(obj) || null;
  }
  
  logAccess(obj, operation) {
    if (!this.accessLog.has(obj)) return;
    
    const log = this.accessLog.get(obj);
    log.push({
      operation,
      timestamp: Date.now()
    });
  }
  
  getAccessLog(obj) {
    return this.accessLog.get(obj) || [];
  }
  
  getLifetime(obj) {
    const allocated = this.allocationTime.get(obj);
    if (!allocated) return null;
    return Date.now() - allocated;
  }
  
  updateMetadata(obj, updates) {
    const current = this.tracker.get(obj);
    if (!current) return false;
    
    this.tracker.set(obj, {
      ...current,
      ...updates,
      lastUpdated: new Date()
    });
    
    return true;
  }
}

// Test
const tracker = new MemoryTracker();

let user = { name: 'Alice', id: 1 };
tracker.track(user, { type: 'user', importance: 'high' });

tracker.logAccess(user, 'read');
tracker.logAccess(user, 'update');

console.log(tracker.getMetadata(user));
console.log(tracker.getAccessLog(user));
console.log('Lifetime:', tracker.getLifetime(user), 'ms');

// When user is set to null, it can be garbage collected
// and all tracking data will be automatically cleaned up
user = null;
```

### Solution 7: Advanced Array Pipeline
```javascript
const transactions = [
  { id: 1, amount: 100, category: 'food', date: '2024-01-15' },
  { id: 2, amount: 50, category: 'transport', date: '2024-01-16' },
  { id: 3, amount: 200, category: 'food', date: '2024-01-17' },
  { id: 4, amount: 30, category: 'entertainment', date: '2024-01-18' },
  { id: 5, amount: 75, category: 'transport', date: '2024-01-19' },
  { id: 6, amount: 120, category: 'food', date: '2024-01-20' },
  { id: 7, amount: 45, category: 'entertainment', date: '2024-01-21' }
];

function processTransactions(transactions) {
  return transactions
    // 1. Filter transactions > $40
    .filter(t => t.amount > 40)
    
    // 2. Group by category and calculate stats
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { total: 0, count: 0, transactions: [] };
      }
      acc[t.category].total += t.amount;
      acc[t.category].count++;
      acc[t.category].transactions.push(t);
      return acc;
    }, {})
    
    // 3. Convert to array format
    |> (grouped => Object.entries(grouped).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      average: data.total / data.count,
      transactions: data.transactions
    })))
    
    // 4. Sort by total (descending)
    |> (arr => arr.sort((a, b) => b.total - a.total));
}

// Alternative without pipeline operator
function processTransactionsAlt(transactions) {
  const filtered = transactions.filter(t => t.amount > 40);
  
  const grouped = filtered.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { total: 0, count: 0, transactions: [] };
    }
    acc[t.category].total += t.amount;
    acc[t.category].count++;
    acc[t.category].transactions.push(t);
    return acc;
  }, {});
  
  const result = Object.entries(grouped).map(([category, data]) => ({
    category,
    total: data.total,
    count: data.count,
    average: data.total / data.count,
    transactions: data.transactions
  }));
  
  return result.sort((a, b) => b.total - a.count);
}

// Test
console.log(processTransactionsAlt(transactions));
// [
//   { category: 'food', total: 420, count: 3, average: 140, ... },
//   { category: 'transport', total: 125, count: 2, average: 62.5, ... },
//   { category: 'entertainment', total: 45, count: 1, average: 45, ... }
// ]

// More advanced pipeline example
function analyzeSpending(transactions) {
  return transactions
    .filter(t => t.amount > 0)
    .map(t => ({
      ...t,
      month: t.date.slice(0, 7), // Extract YYYY-MM
      isHighValue: t.amount > 100
    }))
    .reduce((acc, t) => {
      const key = `${t.month}-${t.category}`;
      if (!acc[key]) {
        acc[key] = {
          month: t.month,
          category: t.category,
          total: 0,
          count: 0,
          highValueCount: 0
        };
      }
      acc[key].total += t.amount;
      acc[key].count++;
      if (t.isHighValue) acc[key].highValueCount++;
      return acc;
    }, {});
}

console.log(analyzeSpending(transactions));
```

---

## Additional Real-World Examples

### Example 1: Data Aggregation Pipeline
```javascript
const sales = [
  { product: 'Laptop', region: 'North', amount: 1200, quarter: 'Q1' },
  { product: 'Mouse', region: 'North', amount: 25, quarter: 'Q1' },
  { product: 'Laptop', region: 'South', amount: 1100, quarter: 'Q1' },
  { product: 'Keyboard', region: 'North', amount: 75, quarter: 'Q1' },
  { product: 'Laptop', region: 'North', amount: 1300, quarter: 'Q2' }
];

// Multi-level grouping
const summary = sales.reduce((acc, sale) => {
  const { product, region, quarter } = sale;
  const key = `${product}-${region}`;
  
  if (!acc[key]) {
    acc[key] = {
      product,
      region,
      quarters: {},
      totalAmount: 0,
      totalSales: 0
    };
  }
  
  if (!acc[key].quarters[quarter]) {
    acc[key].quarters[quarter] = 0;
  }
  
  acc[key].quarters[quarter] += sale.amount;
  acc[key].totalAmount += sale.amount;
  acc[key].totalSales++;
  
  return acc;
}, {});

console.log(Object.values(summary));
```

### Example 2: Using Map for Complex Keys
```javascript
// Tracking relationships between objects
const relationships = new Map();

const user1 = { id: 1, name: 'Alice' };
const user2 = { id: 2, name: 'Bob' };
const user3 = { id: 3, name: 'Charlie' };

// Map of Maps for bidirectional relationships
relationships.set(user1, new Map([
  [user2, 'friend'],
  [user3, 'colleague']
]));

relationships.set(user2, new Map([
  [user1, 'friend']
]));

// Check relationship
function getRelationship(from, to) {
  return relationships.get(from)?.get(to) || 'none';
}

console.log(getRelationship(user1, user2)); // 'friend'
console.log(getRelationship(user1, user3)); // 'colleague'
```

### Example 3: Set-based Permissions System
```javascript
class PermissionSystem {
  constructor() {
    this.userPermissions = new Map();
    this.rolePermissions = new Map();
  }
  
  assignRole(user, role) {
    if (!this.userPermissions.has(user)) {
      this.userPermissions.set(user, new Set());
    }
    this.userPermissions.get(user).add(role);
  }
  
  grantPermission(role, permission) {
    if (!this.rolePermissions.has(role)) {
      this.rolePermissions.set(role, new Set());
    }
    this.rolePermissions.get(role).add(permission);
  }
  
  hasPermission(user, permission) {
    const roles = this.userPermissions.get(user);
    if (!roles) return false;
    
    for (const role of roles) {
      const permissions = this.rolePermissions.get(role);
      if (permissions?.has(permission)) {
        return true;
      }
    }
    
    return false;
  }
  
  getAllPermissions(user) {
    const roles = this.userPermissions.get(user);
    if (!roles) return new Set();
    
    const allPerms = new Set();
    for (const role of roles) {
      const perms = this.rolePermissions.get(role);
      if (perms) {
        perms.forEach(p => allPerms.add(p));
      }
    }
    
    return allPerms;
  }
}

// Test
const system = new PermissionSystem();
const admin = { name: 'Admin' };
const user = { name: 'User' };

system.grantPermission('admin', 'read');
system.grantPermission('admin', 'write');
system.grantPermission('admin', 'delete');
system.grantPermission('user', 'read');

system.assignRole(admin, 'admin');
system.assignRole(user, 'user');

console.log(system.hasPermission(admin, 'delete')); // true
console.log(system.hasPermission(user, 'delete'));  // false
console.log(system.getAllPermissions(admin)); // Set { 'read', 'write', 'delete' }
```

---

## Summary and Best Practices

### Choosing the Right Data Structure

**Arrays**: Sequential data, need order, frequent iteration, transformations
**Objects**: String/symbol keys, need JSON serialization, prototype methods
**Maps**: Non-string keys, frequent additions/deletions, need size property
**Sets**: Unique values, membership testing, set operations
**WeakMap/WeakSet**: Private data, caching, prevent memory leaks
**Typed Arrays**: Binary data, performance-critical operations, WebGL/Canvas

### Performance Tips

1. Use `Set.has()` instead of `Array.includes()` for large collections
2. Use `Map` for frequent key-value updates
3. Use typed arrays for numeric computations
4. Prefer method chaining over multiple loops
5. Use `reduce()` wisely - sometimes a simple loop is clearer

### Common Pitfalls

1. Mutating arrays during iteration
2. Forgetting that `map()` and `filter()` return new arrays
3. Using objects as Map keys (they convert to strings)
4. Not handling edge cases (empty arrays, null values)
5. Overusing `reduce()` when simpler methods exist

### Modern JavaScript Patterns

```javascript
// 1. Functional composition
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const transform = pipe(
  arr => arr.filter(x => x > 0),
  arr => arr.map(x => x * 2),
  arr => arr.reduce((sum, x) => sum + x, 0)
);

console.log(transform([1, -2, 3, -4, 5])); // 18

// 2. Immutable updates
const addItem = (arr, item) => [...arr, item];
const updateItem = (arr, index, value) => [
  ...arr.slice(0, index),
  value,
  ...arr.slice(index + 1)
];

// 3. Declarative data transformations
const users = [/* ... */];
const activeUserNames = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();
```

---

## Conclusion

Mastering JavaScript's built-in data structures is essential for writing efficient, maintainable code. Each structure has its strengths:

- **Arrays** excel at ordered collections and transformations
- **Objects** provide familiar key-value storage with prototype inheritance
- **Maps** offer superior performance for dynamic key-value operations
- **Sets** eliminate duplicates and enable mathematical set operations
- **Weak collections** prevent memory leaks in caching scenarios
- **Typed arrays** provide performance for binary and numeric data

Practice using these structures in different scenarios to develop intuition about which tool fits each job. The exercises provided will help solidify your understanding through hands-on implementation.

Happy coding! 🚀