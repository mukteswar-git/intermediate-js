# Week 16: JavaScript Under the Hood

## Table of Contents
1. [Execution Context](#execution-context)
2. [Call Stack](#call-stack)
3. [Memory Heap](#memory-heap)
4. [Hoisting Explained](#hoisting-explained)
5. [Scope Chain](#scope-chain)
6. [Event Loop Deep Dive](#event-loop-deep-dive)
7. [Microtasks vs Macrotasks](#microtasks-vs-macrotasks)
8. [Putting It All Together](#putting-it-all-together)
9. [Practice Exercises](#practice-exercises)

---

## Execution Context

An **execution context** is an abstract concept that represents the environment in which JavaScript code is evaluated and executed.

### Types of Execution Contexts

1. **Global Execution Context (GEC)**
   - Created when your script first runs
   - Creates the global object (`window` in browsers, `global` in Node.js)
   - Sets up the `this` keyword to point to the global object
   - Only one GEC exists per script

2. **Function Execution Context (FEC)**
   - Created whenever a function is invoked
   - Each function gets its own execution context
   - Multiple FECs can exist

3. **Eval Execution Context**
   - Code executed inside `eval()` function
   - Generally avoided in modern JavaScript

### Phases of Execution Context

Each execution context goes through two phases:

#### 1. Creation Phase (Memory Creation)
```javascript
// During creation phase, before code execution:
var name = 'Alice';
function greet() {
  console.log('Hello');
}

// What happens:
// - 'name' is allocated memory and set to undefined
// - 'greet' is allocated memory and stores entire function
```

**What happens in Creation Phase:**
- Create the Variable Object (stores variables and functions)
- Create the Scope Chain
- Determine the value of `this`

#### 2. Execution Phase (Code Execution)
```javascript
// Now the code actually runs:
var name = 'Alice';  // 'Alice' is assigned to name
function greet() {
  console.log('Hello');
}
greet();  // Function is executed
```

### Visual Representation

```
Global Execution Context
┌─────────────────────────────┐
│  Creation Phase             │
│  - Variable Object created  │
│  - Scope Chain established  │
│  - 'this' determined        │
├─────────────────────────────┤
│  Execution Phase            │
│  - Code runs line by line   │
│  - Variables assigned       │
│  - Functions executed       │
└─────────────────────────────┘
```

---

## Call Stack

The **call stack** is a data structure that keeps track of function calls in your program. It follows the Last-In-First-Out (LIFO) principle.

### How the Call Stack Works

```javascript
function first() {
  console.log('First function');
  second();
  console.log('First function end');
}

function second() {
  console.log('Second function');
  third();
  console.log('Second function end');
}

function third() {
  console.log('Third function');
}

first();

// Call Stack visualization:
// Step 1: [Global]
// Step 2: [Global, first]
// Step 3: [Global, first, second]
// Step 4: [Global, first, second, third]
// Step 5: [Global, first, second] (third popped off)
// Step 6: [Global, first] (second popped off)
// Step 7: [Global] (first popped off)
```

### Stack Overflow

When the call stack exceeds its limit:

```javascript
function recursiveFunction() {
  recursiveFunction(); // Calls itself infinitely
}

recursiveFunction();
// Error: Maximum call stack size exceeded
```

### Practical Example

```javascript
function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function printSquare(n) {
  const result = square(n);
  console.log(result);
}

printSquare(4);

// Call Stack Journey:
// 1. [printSquare(4)]
// 2. [printSquare(4), square(4)]
// 3. [printSquare(4), square(4), multiply(4,4)]
// 4. [printSquare(4), square(4)] - multiply returns 16
// 5. [printSquare(4)] - square returns 16
// 6. [] - printSquare completes, logs 16
```

---

## Memory Heap

The **memory heap** is where JavaScript stores objects and functions. Unlike the call stack (which is structured), the heap is an unstructured memory pool.

### Stack vs Heap

```javascript
// Primitive values → Call Stack
let age = 25;           // Stored directly in stack
let name = 'John';      // Stored directly in stack

// Reference values → Memory Heap
let person = {          // Object stored in heap
  name: 'John',         // Stack holds reference to heap location
  age: 25
};

let numbers = [1, 2, 3]; // Array stored in heap
```

### Memory Allocation Example

```javascript
// Stack Memory
let x = 10;              // 10 stored in stack
let y = x;               // 10 copied to y

x = 20;                  // Only x changes
console.log(x, y);       // 20, 10

// Heap Memory
let obj1 = { value: 10 }; // Object in heap, reference in stack
let obj2 = obj1;          // obj2 points to same heap location

obj1.value = 20;          // Modifies the heap object
console.log(obj1.value);  // 20
console.log(obj2.value);  // 20 (same object!)
```

### Garbage Collection

JavaScript automatically manages memory through garbage collection:

```javascript
function createObjects() {
  let temp = { data: 'large data' }; // Allocated in heap
  // When function ends, temp is no longer referenced
  // Garbage collector will eventually free this memory
}

createObjects();
// After function completes, temp object becomes eligible for GC
```

### Memory Leak Example

```javascript
// Memory Leak: Unintended references prevent garbage collection
let leakyArray = [];

function addToArray() {
  leakyArray.push(new Array(1000000).fill('data'));
  // leakyArray keeps growing, never released
}

setInterval(addToArray, 1000); // Memory leak!
```

---

## Hoisting Explained

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope during the creation phase.

### Variable Hoisting

#### `var` Hoisting
```javascript
console.log(name); // undefined (not an error!)
var name = 'Alice';
console.log(name); // 'Alice'

// What JavaScript actually does:
var name;              // Declaration hoisted
console.log(name);     // undefined
name = 'Alice';        // Assignment stays in place
console.log(name);     // 'Alice'
```

#### `let` and `const` Hoisting
```javascript
console.log(age); // ReferenceError: Cannot access 'age' before initialization
let age = 25;

// let and const ARE hoisted, but in the "Temporal Dead Zone"
// They cannot be accessed before declaration
```

### Temporal Dead Zone (TDZ)

```javascript
// TDZ starts
console.log(typeof value); // ReferenceError

let value = 10; // TDZ ends
console.log(typeof value); // 'number'

// TDZ exists for let and const from:
// - Start of the scope
// - Until the declaration is encountered
```

### Function Hoisting

#### Function Declarations
```javascript
greet(); // Works! Outputs: 'Hello'

function greet() {
  console.log('Hello');
}

// Entire function is hoisted
```

#### Function Expressions
```javascript
sayHi(); // TypeError: sayHi is not a function

var sayHi = function() {
  console.log('Hi');
};

// What happens:
var sayHi;           // Declaration hoisted, set to undefined
sayHi();             // Trying to call undefined
sayHi = function() { // Assignment happens here
  console.log('Hi');
};
```

### Class Hoisting

```javascript
const instance = new MyClass(); // ReferenceError

class MyClass {
  constructor() {
    this.name = 'Test';
  }
}

// Classes are hoisted but remain in TDZ until declaration
```

### Hoisting Best Practices

```javascript
// ✅ Good: Declare before use
const name = 'Alice';
console.log(name);

// ✅ Good: Use let/const instead of var
let count = 0;
const MAX = 100;

// ❌ Avoid: Relying on hoisting
console.log(x); // undefined
var x = 10;

// ✅ Good: Declare functions at top of scope
function helper() {
  return 'help';
}

const result = helper();
```

---

## Scope Chain

The **scope chain** is the mechanism JavaScript uses to resolve variable names. It determines what variables are accessible in what contexts.

### Understanding Scope

```javascript
// Global Scope
const globalVar = 'global';

function outer() {
  // Outer function scope
  const outerVar = 'outer';
  
  function inner() {
    // Inner function scope
    const innerVar = 'inner';
    
    console.log(innerVar);  // ✅ Accessible
    console.log(outerVar);  // ✅ Accessible (scope chain)
    console.log(globalVar); // ✅ Accessible (scope chain)
  }
  
  inner();
  console.log(innerVar);    // ❌ ReferenceError
}

outer();
```

### Scope Chain Visualization

```
┌──────────────────────────────────┐
│     Global Scope                 │
│     globalVar: 'global'          │
│  ┌────────────────────────────┐  │
│  │  Outer Function Scope      │  │
│  │  outerVar: 'outer'         │  │
│  │  ┌──────────────────────┐  │  │
│  │  │ Inner Function Scope │  │  │
│  │  │ innerVar: 'inner'    │  │  │
│  │  │                      │  │  │
│  │  │ Scope chain: inner   │  │  │
│  │  │              ↓       │  │  │
│  │  │            outer     │  │  │
│  │  │              ↓       │  │  │
│  │  │            global    │  │  │
│  │  └──────────────────────┘  │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### Lexical Scoping

Scope is determined by where functions and variables are written in the code:

```javascript
const name = 'Global';

function outer() {
  const name = 'Outer';
  
  function inner() {
    console.log(name); // 'Outer' (lexically scoped)
  }
  
  return inner;
}

const innerFunc = outer();
innerFunc(); // Still logs 'Outer', not 'Global'
```

### Closures and Scope Chain

```javascript
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2

// count is not directly accessible:
console.log(counter.count); // undefined

// The returned functions maintain access to count via scope chain
```

### Block Scope

```javascript
if (true) {
  var varVariable = 'var';      // Function scoped
  let letVariable = 'let';      // Block scoped
  const constVariable = 'const'; // Block scoped
}

console.log(varVariable);   // 'var' (accessible)
console.log(letVariable);   // ReferenceError
console.log(constVariable); // ReferenceError
```

---

## Event Loop Deep Dive

The **event loop** is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded.

### JavaScript Runtime Components

```
┌─────────────────────────────────────┐
│         JavaScript Engine           │
│  ┌──────────┐      ┌─────────────┐ │
│  │   Heap   │      │ Call Stack  │ │
│  └──────────┘      └─────────────┘ │
└─────────────────────────────────────┘
           ↓                ↑
┌─────────────────────────────────────┐
│         Web APIs / Node APIs        │
│  - setTimeout                       │
│  - DOM events                       │
│  - fetch / AJAX                     │
│  - Promise                          │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│          Callback Queue             │
│    (Task Queue / Macrotask Queue)   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         Microtask Queue             │
│    (Promise callbacks, etc.)        │
└─────────────────────────────────────┘
           ↓
        Event Loop
```

### How the Event Loop Works

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');

// Output:
// Start
// End
// Promise
// Timeout
```

### Step-by-Step Execution

```javascript
// 1. Call Stack: [console.log('Start')]
console.log('Start');
// Output: 'Start'
// Call Stack: []

// 2. setTimeout is Web API, callback goes to Macrotask Queue
setTimeout(() => {
  console.log('Timeout');
}, 0);
// Call Stack: []

// 3. Promise resolves immediately, callback goes to Microtask Queue
Promise.resolve().then(() => {
  console.log('Promise');
});
// Call Stack: []

// 4. Call Stack: [console.log('End')]
console.log('End');
// Output: 'End'
// Call Stack: []

// 5. Call stack empty, Event Loop checks Microtask Queue first
// Call Stack: [console.log('Promise')]
// Output: 'Promise'
// Call Stack: []

// 6. Microtask Queue empty, Event Loop checks Macrotask Queue
// Call Stack: [console.log('Timeout')]
// Output: 'Timeout'
// Call Stack: []
```

### Event Loop Algorithm

```
while (true) {
  // 1. Execute all tasks in call stack
  if (callStack.isEmpty()) {
    
    // 2. Execute ALL microtasks
    while (microtaskQueue.hasTask()) {
      task = microtaskQueue.dequeue();
      execute(task);
    }
    
    // 3. Execute ONE macrotask
    if (macrotaskQueue.hasTask()) {
      task = macrotaskQueue.dequeue();
      execute(task);
    }
    
    // 4. Render if needed (in browsers)
    if (renderingNeeded) {
      render();
    }
  }
}
```

### Blocking the Event Loop

```javascript
// ❌ Bad: Blocks the event loop
function blockEventLoop() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // Blocks for 3 seconds
  }
  console.log('Done blocking');
}

console.log('Start');
blockEventLoop();
console.log('End'); // Has to wait 3 seconds

// ✅ Good: Non-blocking
console.log('Start');
setTimeout(() => {
  console.log('Done after 3 seconds');
}, 3000);
console.log('End'); // Executes immediately
```

---

## Microtasks vs Macrotasks

Understanding the difference between microtasks and macrotasks is crucial for predicting code execution order.

### Macrotasks (Task Queue)

Macrotasks include:
- `setTimeout`
- `setInterval`
- `setImmediate` (Node.js)
- I/O operations
- UI rendering

```javascript
setTimeout(() => {
  console.log('Macrotask 1');
}, 0);

setTimeout(() => {
  console.log('Macrotask 2');
}, 0);

// Only ONE macrotask executes per event loop iteration
```

### Microtasks (Job Queue)

Microtasks include:
- `Promise.then/catch/finally`
- `queueMicrotask()`
- `MutationObserver`
- `process.nextTick()` (Node.js - higher priority than other microtasks)

```javascript
Promise.resolve().then(() => {
  console.log('Microtask 1');
});

Promise.resolve().then(() => {
  console.log('Microtask 2');
});

// ALL microtasks execute before the next macrotask
```

### Priority Order

```javascript
console.log('1: Synchronous');

setTimeout(() => {
  console.log('5: Macrotask (setTimeout)');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3: Microtask (Promise 1)');
  })
  .then(() => {
    console.log('4: Microtask (Promise 2)');
  });

console.log('2: Synchronous');

// Output order:
// 1: Synchronous
// 2: Synchronous
// 3: Microtask (Promise 1)
// 4: Microtask (Promise 2)
// 5: Macrotask (setTimeout)
```

### Complex Example

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
  Promise.resolve().then(() => {
    console.log('Promise in Timeout 1');
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    setTimeout(() => {
      console.log('Timeout in Promise 1');
    }, 0);
  })
  .then(() => {
    console.log('Promise 2');
  });

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

console.log('End');

// Output:
// Start
// End
// Promise 1
// Promise 2
// Timeout 1
// Promise in Timeout 1
// Timeout 2
// Timeout in Promise 1
```

### Execution Flow Breakdown

```
1. Call Stack executes:
   - console.log('Start')
   - console.log('End')

2. Microtask Queue executes (ALL):
   - Promise 1 callback → adds setTimeout to Macrotask Queue
   - Promise 2 callback

3. Macrotask Queue executes (ONE):
   - Timeout 1 → adds Promise to Microtask Queue

4. Microtask Queue executes (ALL):
   - Promise in Timeout 1

5. Macrotask Queue executes (ONE):
   - Timeout 2

6. Macrotask Queue executes (ONE):
   - Timeout in Promise 1
```

### Using queueMicrotask

```javascript
console.log('Start');

queueMicrotask(() => {
  console.log('Microtask via queueMicrotask');
});

Promise.resolve().then(() => {
  console.log('Microtask via Promise');
});

console.log('End');

// Output:
// Start
// End
// Microtask via queueMicrotask
// Microtask via Promise
```

### Practical Implications

```javascript
// Example: Button click handler
button.addEventListener('click', () => {
  console.log('Click handler');
  
  // This runs immediately after click handler
  Promise.resolve().then(() => {
    console.log('Promise in click handler');
  });
  
  // This runs in next event loop iteration
  setTimeout(() => {
    console.log('Timeout in click handler');
  }, 0);
});

// When button is clicked:
// Click handler
// Promise in click handler
// Timeout in click handler
```

---

## Putting It All Together

### Complete Execution Example

```javascript
var x = 10;

function foo() {
  console.log('foo start');
  
  setTimeout(() => {
    console.log('foo timeout');
  }, 0);
  
  Promise.resolve().then(() => {
    console.log('foo promise');
  });
  
  bar();
  console.log('foo end');
}

function bar() {
  console.log('bar');
  
  Promise.resolve().then(() => {
    console.log('bar promise');
  });
}

console.log('Global start');
foo();
console.log('Global end');

// Detailed execution:

// CREATION PHASE:
// - Global execution context created
// - x: undefined, foo: function, bar: function

// EXECUTION PHASE:
// 1. x = 10 (assignment)
// 2. console.log('Global start') → Output: 'Global start'
// 3. foo() called → foo execution context created
// 4.   console.log('foo start') → Output: 'foo start'
// 5.   setTimeout callback → added to Macrotask Queue
// 6.   Promise callback → added to Microtask Queue
// 7.   bar() called → bar execution context created
// 8.     console.log('bar') → Output: 'bar'
// 9.     Promise callback → added to Microtask Queue
// 10.    bar() completes
// 11.  console.log('foo end') → Output: 'foo end'
// 12.  foo() completes
// 13. console.log('Global end') → Output: 'Global end'

// CALL STACK NOW EMPTY

// 14. Microtask Queue processed (ALL):
//     - 'foo promise' → Output: 'foo promise'
//     - 'bar promise' → Output: 'bar promise'

// 15. Macrotask Queue processed (ONE):
//     - 'foo timeout' → Output: 'foo timeout'

// Final Output:
// Global start
// foo start
// bar
// foo end
// Global end
// foo promise
// bar promise
// foo timeout
```

### Memory and Call Stack Visualization

```javascript
function outer(a) {
  let outerVar = 100;
  
  function inner(b) {
    let innerVar = 200;
    console.log(a + b + outerVar + innerVar);
  }
  
  inner(20);
}

outer(10);

// Memory Layout:

// HEAP:
// - outer function object
// - inner function object (with closure to outerVar)

// CALL STACK (at console.log line):
// ┌───────────────────────────┐
// │ inner()                   │
// │ - b: 20                   │
// │ - innerVar: 200           │
// │ - access to outerVar: 100 │
// │ - access to a: 10         │
// ├───────────────────────────┤
// │ outer()                   │
// │ - a: 10                   │
// │ - outerVar: 100           │
// ├───────────────────────────┤
// │ Global Execution Context  │
// └───────────────────────────┘
```

---

## Practice Exercises

### Exercise 1: Predict the Output

```javascript
console.log(a);
var a = 5;
console.log(a);

function test() {
  console.log(b);
  var b = 10;
}

test();
```

<details>
<summary>Solution</summary>

```
undefined
5
undefined
```

Explanation: 
- `var a` is hoisted, initialized to undefined
- First console.log prints undefined
- a is assigned 5, second console.log prints 5
- Inside test(), `var b` is hoisted to function scope as undefined
</details>

### Exercise 2: Execution Order

```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');
```

<details>
<summary>Solution</summary>

```
A
D
C
B
```

Explanation:
- A and D are synchronous (run first)
- C is a microtask (runs before B)
- B is a macrotask (runs last)
</details>

### Exercise 3: Scope Chain Challenge

```javascript
var x = 10;

function outer() {
  var x = 20;
  
  function inner() {
    var x = 30;
    console.log(x);
  }
  
  inner();
  console.log(x);
}

outer();
console.log(x);
```

<details>
<summary>Solution</summary>

```
30
20
10
```

Explanation:
- inner() logs its own x: 30
- outer() logs its own x: 20
- Global logs global x: 10
Each function has its own scope with its own x variable.
</details>

### Exercise 4: Complex Async Pattern

```javascript
async function asyncFunc() {
  console.log('1');
  
  setTimeout(() => console.log('2'), 0);
  
  await Promise.resolve();
  console.log('3');
  
  setTimeout(() => console.log('4'), 0);
}

console.log('5');
asyncFunc();
console.log('6');
```

<details>
<summary>Solution</summary>

```
5
1
6
3
2
4
```

Explanation:
1. '5' - synchronous
2. '1' - synchronous in asyncFunc
3. '6' - synchronous (asyncFunc returns immediately at await)
4. '3' - microtask after await resolves
5. '2' - first setTimeout (macrotask)
6. '4' - second setTimeout (macrotask)
</details>

### Exercise 5: Closure and Scope

```javascript
function createFunctions() {
  var result = [];
  
  for (var i = 0; i < 3; i++) {
    result.push(function() {
      return i;
    });
  }
  
  return result;
}

var funcs = createFunctions();
console.log(funcs[0]());
console.log(funcs[1]());
console.log(funcs[2]());
```

<details>
<summary>Solution</summary>

```
3
3
3
```

Explanation:
- `var i` is function-scoped, not block-scoped
- All functions close over the same `i` variable
- After loop, i = 3, so all functions return 3

To fix, use `let` instead of `var`:
```javascript
for (let i = 0; i < 3; i++) { // Each iteration has its own i
  result.push(function() {
    return i;
  });
}
// Output: 0, 1, 2
```
</details>

---

## Key Takeaways

1. **Execution Context**: Environment where code runs, with creation and execution phases
2. **Call Stack**: LIFO structure tracking function execution
3. **Memory Heap**: Unstructured memory for objects and functions
4. **Hoisting**: Declarations moved to top of scope during creation phase
5. **Scope Chain**: Mechanism for resolving variable access through nested scopes
6. **Event Loop**: Enables non-blocking operations in single-threaded JavaScript
7. **Microtasks**: Higher priority than macrotasks, ALL execute before next macrotask
8. **Macrotasks**: ONE executes per event loop iteration

Understanding these concepts gives you deep insight into how JavaScript works internally and helps you write better, more predictable code!

---

## Additional Resources

- **MDN Web Docs**: Detailed documentation on JavaScript execution
- **JavaScript.info**: Comprehensive tutorials on advanced concepts
- **Loupe**: Visual tool for understanding the event loop (latentflip.com/loupe)
- **What the heck is the event loop anyway?**: Classic JSConf talk by Philip Roberts

Happy learning! 🚀