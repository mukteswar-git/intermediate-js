# Week 9: Advanced Function Techniques in JavaScript

## Table of Contents
1. [Higher-Order Functions](#higher-order-functions)
2. [Function Currying](#function-currying)
3. [Function Composition](#function-composition)
4. [Recursion](#recursion)
5. [Memoization](#memoization)
6. [Debounce and Throttle](#debounce-and-throttle)
7. [The 'this' Keyword](#the-this-keyword)
8. [call, apply, and bind Methods](#call-apply-bind)
9. [Practice Exercises](#practice-exercises)

---

## Higher-Order Functions

Higher-order functions are functions that either take other functions as arguments or return functions as results. They're fundamental to functional programming in JavaScript.

### What Makes a Function Higher-Order?

A function is higher-order if it:
- Accepts one or more functions as arguments
- Returns a function as its result
- Or both

### Examples

```javascript
// Example 1: Function that takes a function as argument
function applyOperation(x, y, operation) {
  return operation(x, y);
}

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

console.log(applyOperation(5, 3, add));      // 8
console.log(applyOperation(5, 3, multiply)); // 15

// Example 2: Function that returns a function
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Example 3: Built-in higher-order functions
const numbers = [1, 2, 3, 4, 5];

// map - transforms each element
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - selects elements based on condition
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

// reduce - combines elements into single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15
```

### Practical Use Case

```javascript
// Creating a flexible logger
function createLogger(prefix) {
  return function(message) {
    console.log(`[${prefix}] ${new Date().toISOString()}: ${message}`);
  };
}

const errorLog = createLogger('ERROR');
const infoLog = createLogger('INFO');

errorLog('Database connection failed');
infoLog('User logged in successfully');
```

---

## Function Currying

Currying is the technique of transforming a function that takes multiple arguments into a sequence of functions that each take a single argument.

### Basic Concept

```javascript
// Regular function
function add(a, b, c) {
  return a + b + c;
}

console.log(add(1, 2, 3)); // 6

// Curried version
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(curriedAdd(1)(2)(3)); // 6

// Using arrow functions for cleaner syntax
const curriedAddArrow = a => b => c => a + b + c;
console.log(curriedAddArrow(1)(2)(3)); // 6
```

### Practical Applications

```javascript
// Reusable configurations
const multiply = a => b => a * b;

const double = multiply(2);
const triple = multiply(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Advanced example: Event handlers
const createEventHandler = eventType => selector => callback => {
  document.querySelector(selector)
    .addEventListener(eventType, callback);
};

const onClick = createEventHandler('click');
const onButtonClick = onClick('button');

// Now we can easily add click handlers to buttons
onButtonClick(e => console.log('Button clicked!'));

// Discount calculator
const calculateDiscount = discount => price => {
  return price - (price * discount / 100);
};

const tenPercentOff = calculateDiscount(10);
const twentyPercentOff = calculateDiscount(20);

console.log(tenPercentOff(100));   // 90
console.log(twentyPercentOff(100)); // 80
```

### Generic Curry Function

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

// Usage
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3));    // 6
console.log(curriedSum(1, 2)(3));    // 6
console.log(curriedSum(1, 2, 3));    // 6
```

---

## Function Composition

Function composition is combining two or more functions to create a new function. The output of one function becomes the input of the next.

### Basic Concept

```javascript
// Individual functions
const add5 = x => x + 5;
const multiply3 = x => x * 3;
const subtract2 = x => x - 2;

// Manual composition (right to left)
const result = subtract2(multiply3(add5(10)));
console.log(result); // 43
// Calculation: add5(10) = 15, multiply3(15) = 45, subtract2(45) = 43

// Compose function
const compose = (...fns) => x => 
  fns.reduceRight((acc, fn) => fn(acc), x);

const composedFunction = compose(subtract2, multiply3, add5);
console.log(composedFunction(10)); // 43

// Pipe function (left to right - more intuitive)
const pipe = (...fns) => x => 
  fns.reduce((acc, fn) => fn(acc), x);

const pipedFunction = pipe(add5, multiply3, subtract2);
console.log(pipedFunction(10)); // 43
```

### Practical Examples

```javascript
// String manipulation pipeline
const trim = str => str.trim();
const toLowerCase = str => str.toLowerCase();
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
const addExclamation = str => str + '!';

const formatGreeting = pipe(
  trim,
  toLowerCase,
  capitalize,
  addExclamation
);

console.log(formatGreeting('  HELLO WORLD  ')); // "Hello world!"

// Data transformation pipeline
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

const getActiveUsers = users => users.filter(u => u.active);
const getUserNames = users => users.map(u => u.name);
const sortAlphabetically = names => names.sort();

const getActiveUserNames = pipe(
  getActiveUsers,
  getUserNames,
  sortAlphabetically
);

console.log(getActiveUserNames(users)); // ['Alice', 'Charlie']
```

---

## Recursion

Recursion is when a function calls itself to solve a problem by breaking it down into smaller, similar subproblems.

### Key Components

1. **Base Case**: The condition that stops the recursion
2. **Recursive Case**: The part where the function calls itself with a modified argument

### Basic Examples

```javascript
// Factorial
function factorial(n) {
  // Base case
  if (n === 0 || n === 1) {
    return 1;
  }
  // Recursive case
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120 (5 * 4 * 3 * 2 * 1)

// Countdown
function countdown(n) {
  // Base case
  if (n < 0) {
    return;
  }
  console.log(n);
  // Recursive case
  countdown(n - 1);
}

countdown(5); // 5, 4, 3, 2, 1, 0

// Sum of array
function sumArray(arr) {
  // Base case
  if (arr.length === 0) {
    return 0;
  }
  // Recursive case
  return arr[0] + sumArray(arr.slice(1));
}

console.log(sumArray([1, 2, 3, 4, 5])); // 15
```

### Advanced Examples

```javascript
// Fibonacci sequence
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(7)); // 13

// Flatten nested array
function flattenArray(arr) {
  let result = [];
  
  for (let item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flattenArray(item));
    } else {
      result.push(item);
    }
  }
  
  return result;
}

console.log(flattenArray([1, [2, [3, 4], 5], 6])); // [1, 2, 3, 4, 5, 6]

// Deep clone object
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

const original = { a: 1, b: { c: 2, d: [3, 4] } };
const copied = deepClone(original);
console.log(copied); // { a: 1, b: { c: 2, d: [3, 4] } }
```

---

## Memoization

Memoization is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

### Basic Implementation

```javascript
// Without memoization - slow for large numbers
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// With memoization - much faster
function memoizedFibonacci() {
  const cache = {};
  
  return function fib(n) {
    if (n in cache) {
      return cache[n];
    }
    
    if (n <= 1) {
      return n;
    }
    
    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  };
}

const fastFib = memoizedFibonacci();
console.log(fastFib(40)); // Much faster than regular fibonacci(40)

// Generic memoize function
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log('Fetching from cache...');
      return cache[key];
    }
    
    console.log('Calculating result...');
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

// Usage
const expensiveCalculation = (a, b) => {
  // Simulate expensive operation
  for (let i = 0; i < 1000000000; i++) {}
  return a + b;
};

const memoizedCalc = memoize(expensiveCalculation);

console.log(memoizedCalc(5, 3)); // Calculating result... 8
console.log(memoizedCalc(5, 3)); // Fetching from cache... 8
console.log(memoizedCalc(2, 7)); // Calculating result... 9
```

### Practical Example

```javascript
// Memoized API call simulation
const memoizedFetchUser = memoize(async (userId) => {
  console.log(`Fetching user ${userId}...`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: userId, name: `User ${userId}` };
});

// First call - fetches from "API"
await memoizedFetchUser(1);

// Second call - returns cached result instantly
await memoizedFetchUser(1);
```

---

## Debounce and Throttle

These are techniques to control how often a function executes, especially useful for performance optimization with events like scrolling, resizing, or typing.

### Debounce

Debounce delays function execution until after a specified time has passed since the last time it was invoked.

```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage example: Search input
const searchAPI = (query) => {
  console.log(`Searching for: ${query}`);
  // Make API call here
};

const debouncedSearch = debounce(searchAPI, 500);

// User types "hello"
debouncedSearch('h');     // Cancelled
debouncedSearch('he');    // Cancelled
debouncedSearch('hel');   // Cancelled
debouncedSearch('hell');  // Cancelled
debouncedSearch('hello'); // Executes after 500ms of no more typing
```

### Throttle

Throttle ensures a function executes at most once in a specified time period.

```javascript
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage example: Scroll event
const handleScroll = () => {
  console.log('Scroll position:', window.scrollY);
};

const throttledScroll = throttle(handleScroll, 1000);

// Even if user scrolls continuously, this only executes once per second
window.addEventListener('scroll', throttledScroll);
```

### Comparison

```javascript
// Debounce: Waits for silence, then executes once
// Good for: search input, window resize, form validation

// Throttle: Executes at regular intervals while event is happening
// Good for: scroll handlers, mousemove, game loop updates

// Visual comparison with button clicks:
let debounceCount = 0;
let throttleCount = 0;

const debouncedClick = debounce(() => {
  debounceCount++;
  console.log(`Debounce executed: ${debounceCount} times`);
}, 1000);

const throttledClick = throttle(() => {
  throttleCount++;
  console.log(`Throttle executed: ${throttleCount} times`);
}, 1000);

// If you click 10 times rapidly:
// Debounce: Executes once after you stop clicking
// Throttle: Executes immediately, then once per second while clicking
```

---

## The 'this' Keyword

The `this` keyword refers to the context in which a function is executed. Its value depends on how the function is called.

### Four Rules of 'this'

```javascript
// 1. Global Context
console.log(this); // In browser: Window object

function globalFunction() {
  console.log(this); // In strict mode: undefined, otherwise: global object
}

// 2. Object Method
const person = {
  name: 'Alice',
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

person.greet(); // "Hello, I'm Alice" - 'this' refers to person object

// 3. Constructor Function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const alice = new Person('Alice', 25);
console.log(alice.name); // "Alice" - 'this' refers to new instance

// 4. Explicit Binding (call, apply, bind)
// Covered in next section
```

### Common Pitfalls

```javascript
const user = {
  name: 'Bob',
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

user.greet(); // "Hello, I'm Bob" ✓

// Problem: Losing context
const greetFunction = user.greet;
greetFunction(); // "Hello, I'm undefined" ✗

// Problem: Callback functions
setTimeout(user.greet, 1000); // "Hello, I'm undefined" ✗

// Solution 1: Arrow function in callback
setTimeout(() => user.greet(), 1000); // "Hello, I'm Bob" ✓

// Solution 2: Bind (covered next section)
setTimeout(user.greet.bind(user), 1000); // "Hello, I'm Bob" ✓
```

### Arrow Functions and 'this'

```javascript
// Arrow functions don't have their own 'this'
// They inherit 'this' from the surrounding scope

const team = {
  name: 'Engineering',
  members: ['Alice', 'Bob', 'Charlie'],
  
  // Regular function
  showTeamRegular: function() {
    this.members.forEach(function(member) {
      // 'this' is undefined here (or global in non-strict mode)
      console.log(`${member} is in ${this.name}`);
    });
  },
  
  // Arrow function solution
  showTeamArrow: function() {
    this.members.forEach(member => {
      // 'this' refers to team object
      console.log(`${member} is in ${this.name}`);
    });
  }
};

team.showTeamRegular(); // Error or wrong output
team.showTeamArrow();   // Works correctly
```

---

## call, apply, and bind Methods

These methods allow you to explicitly set the value of `this` when calling a function.

### call()

Invokes a function with a specified `this` value and arguments provided individually.

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person1 = { name: 'Alice' };
const person2 = { name: 'Bob' };

greet.call(person1, 'Hello', '!'); // "Hello, I'm Alice!"
greet.call(person2, 'Hi', '.'); // "Hi, I'm Bob."

// Practical example: Borrowing methods
const cat = {
  sound: 'Meow',
  speak: function() {
    console.log(this.sound);
  }
};

const dog = { sound: 'Woof' };

cat.speak.call(dog); // "Woof" - borrowed cat's method for dog
```

### apply()

Similar to `call()`, but arguments are provided as an array.

```javascript
function introduce(greeting, age, city) {
  console.log(`${greeting}, I'm ${this.name}, ${age} years old from ${city}`);
}

const user = { name: 'Charlie' };

introduce.apply(user, ['Hey', 30, 'New York']);
// "Hey, I'm Charlie, 30 years old from New York"

// Practical example: Math.max with array
const numbers = [5, 6, 2, 3, 7];

// Math.max doesn't accept arrays, but we can use apply
const max = Math.max.apply(null, numbers);
console.log(max); // 7

// Modern alternative using spread operator
const maxSpread = Math.max(...numbers);
console.log(maxSpread); // 7
```

### bind()

Creates a new function with a permanently bound `this` value. Unlike `call` and `apply`, it doesn't invoke the function immediately.

```javascript
const person = {
  name: 'Diana',
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

// Create a new function with bound context
const greetDiana = person.greet.bind(person);

setTimeout(greetDiana, 1000); // "Hello, I'm Diana" after 1 second

// Partial application with bind
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Event handlers
class Button {
  constructor(label) {
    this.label = label;
    this.clicks = 0;
  }
  
  handleClick() {
    this.clicks++;
    console.log(`${this.label} clicked ${this.clicks} times`);
  }
  
  render() {
    const button = document.createElement('button');
    button.textContent = this.label;
    
    // Bind ensures 'this' refers to Button instance
    button.addEventListener('click', this.handleClick.bind(this));
    
    return button;
  }
}

const submitButton = new Button('Submit');
// document.body.appendChild(submitButton.render());
```

### Comparison Summary

```javascript
function showInfo(age, city) {
  console.log(`${this.name}, ${age}, ${city}`);
}

const person = { name: 'Eve' };

// call - immediate invocation, individual arguments
showInfo.call(person, 28, 'Boston');

// apply - immediate invocation, array of arguments
showInfo.apply(person, [28, 'Boston']);

// bind - returns new function, can be called later
const boundShowInfo = showInfo.bind(person, 28, 'Boston');
boundShowInfo(); // Call it later

// bind with partial application
const showEveInfo = showInfo.bind(person);
showEveInfo(28, 'Boston'); // Can provide remaining arguments later
```

---

## Practice Exercises

### Exercise 1: Higher-Order Function
Create a function `repeat` that takes a function and a number, and calls that function the specified number of times.

```javascript
function repeat(fn, times) {
  // Your code here
}

// Test
repeat(() => console.log('Hello'), 3);
// Should print "Hello" three times
```

### Exercise 2: Currying
Convert this function to a curried version:

```javascript
function calculateTotal(price, taxRate, discount) {
  return price * (1 + taxRate) - discount;
}

// Convert to curried form
const curriedCalculateTotal = // Your code here

// Should work like:
// curriedCalculateTotal(100)(0.1)(5) => 105
```

### Exercise 3: Recursion
Write a recursive function to find the power of a number (x^n).

```javascript
function power(x, n) {
  // Your code here
}

// Test
console.log(power(2, 3)); // 8
console.log(power(5, 2)); // 25
```

### Exercise 4: Memoization
Create a memoized version of a function that calculates the nth triangular number (sum of all numbers from 1 to n).

```javascript
const triangular = memoize(function(n) {
  // Your code here
});

// Test
console.log(triangular(5)); // 15 (1+2+3+4+5)
```

### Exercise 5: Debounce
Implement a real-world debounce for a search input that calls an API.

```javascript
// Your implementation here

const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', debouncedSearch);
```

### Solutions

```javascript
// Solution 1
function repeat(fn, times) {
  for (let i = 0; i < times; i++) {
    fn();
  }
}

// Solution 2
const curriedCalculateTotal = price => taxRate => discount => {
  return price * (1 + taxRate) - discount;
};

// Solution 3
function power(x, n) {
  if (n === 0) return 1;
  return x * power(x, n - 1);
}

// Solution 4
const triangular = memoize(function(n) {
  if (n === 1) return 1;
  return n + triangular(n - 1);
});

// Solution 5
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const searchAPI = query => {
  console.log(`Searching for: ${query}`);
  // API call here
};

const debouncedSearch = debounce(e => searchAPI(e.target.value), 500);
```

---

## Key Takeaways

1. **Higher-order functions** enable powerful abstractions and code reuse
2. **Currying** transforms multi-argument functions into chains of single-argument functions
3. **Function composition** combines simple functions to create complex behaviors
4. **Recursion** solves problems by breaking them into smaller instances of the same problem
5. **Memoization** optimizes expensive computations by caching results
6. **Debounce** delays execution until after activity stops
7. **Throttle** limits execution frequency during continuous activity
8. **The `this` keyword** depends on how a function is called
9. **call, apply, bind** give you explicit control over `this` context

Master these techniques and you'll write more efficient, elegant, and maintainable JavaScript code!