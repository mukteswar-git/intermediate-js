# Week 8: Closures & Scope - Complete Tutorial

## Table of Contents
1. [Lexical Scope](#lexical-scope)
2. [Closures Explained](#closures-explained)
3. [Practical Use Cases](#practical-use-cases)
4. [Module Pattern](#module-pattern)
5. [Private Variables](#private-variables)
6. [IIFE (Immediately Invoked Function Expressions)](#iife)
7. [Practice Exercises](#practice-exercises)

---

## 1. Lexical Scope

Lexical scope means that the accessibility of variables is determined by where they are defined in the code, not where they are called.

### Scope Chain

JavaScript has three types of scope:
- **Global Scope**: Variables accessible everywhere
- **Function Scope**: Variables accessible only within the function
- **Block Scope**: Variables accessible only within the block (let/const)

```javascript
// Global scope
const globalVar = "I'm global";

function outerFunction() {
  // Function scope
  const outerVar = "I'm outer";
  
  function innerFunction() {
    // Inner function scope
    const innerVar = "I'm inner";
    
    // Can access all variables due to scope chain
    console.log(innerVar);   // "I'm inner"
    console.log(outerVar);   // "I'm outer"
    console.log(globalVar);  // "I'm global"
  }
  
  innerFunction();
  // console.log(innerVar); // ❌ Error: innerVar is not defined
}

outerFunction();
```

### Block Scope with let and const

```javascript
if (true) {
  var varVariable = "I'm var";
  let letVariable = "I'm let";
  const constVariable = "I'm const";
}

console.log(varVariable);    // ✅ "I'm var" (var is function-scoped)
// console.log(letVariable); // ❌ Error (let is block-scoped)
// console.log(constVariable); // ❌ Error (const is block-scoped)
```

### Variable Shadowing

Inner scope variables can "shadow" outer scope variables with the same name:

```javascript
const name = "Global";

function greet() {
  const name = "Local";
  console.log(name); // "Local" - shadows the global variable
}

greet();
console.log(name); // "Global" - unchanged
```

---

## 2. Closures Explained

A **closure** is a function that remembers and accesses variables from its outer scope, even after the outer function has finished executing.

### Basic Closure Example

```javascript
function createGreeting(greeting) {
  // 'greeting' is captured in the closure
  return function(name) {
    console.log(`${greeting}, ${name}!`);
  };
}

const sayHello = createGreeting("Hello");
const sayHi = createGreeting("Hi");

sayHello("Alice"); // "Hello, Alice!"
sayHi("Bob");      // "Hi, Bob!"

// The inner function still has access to 'greeting'
// even after createGreeting has finished executing
```

### How Closures Work

```javascript
function outer() {
  let counter = 0; // This variable is "closed over"
  
  function inner() {
    counter++; // Inner function can access and modify counter
    console.log(counter);
  }
  
  return inner;
}

const increment = outer();
increment(); // 1
increment(); // 2
increment(); // 3

// Each call remembers the previous value of counter
```

### Multiple Closures

```javascript
function createCounter() {
  let count = 0;
  
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

const counter1 = createCounter();
const counter2 = createCounter(); // Independent closure

console.log(counter1.increment()); // 1
console.log(counter1.increment()); // 2
console.log(counter2.increment()); // 1 (separate closure)
```

---

## 3. Practical Use Cases

### Use Case 1: Event Handlers

```javascript
function attachListeners() {
  const buttons = document.querySelectorAll('button');
  
  buttons.forEach((button, index) => {
    button.addEventListener('click', function() {
      // Closure captures the 'index' variable
      console.log(`Button ${index} clicked`);
    });
  });
}

// Without closure (common mistake with var):
function attachListenersBroken() {
  const buttons = document.querySelectorAll('button');
  
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      console.log(`Button ${i} clicked`); // Always logs the last value
    });
  }
}
```

### Use Case 2: Function Factories

```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

### Use Case 3: Memoization (Caching)

```javascript
function memoize(fn) {
  const cache = {}; // Closure captures this cache
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log('Returning cached result');
      return cache[key];
    }
    
    console.log('Computing result');
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

function slowFunction(num) {
  // Simulate expensive computation
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += num;
  }
  return result;
}

const memoizedSlow = memoize(slowFunction);

memoizedSlow(5); // Computing result (slow)
memoizedSlow(5); // Returning cached result (instant!)
```

### Use Case 4: setTimeout with Loop

```javascript
// Problem: All timeouts log 3
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3
  }, 1000);
}

// Solution 1: Use let (creates new binding each iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2
  }, 1000);
}

// Solution 2: Use closure
for (var i = 0; i < 3; i++) {
  (function(capturedI) {
    setTimeout(function() {
      console.log(capturedI); // 0, 1, 2
    }, 1000);
  })(i);
}
```

---

## 4. Module Pattern

The module pattern uses closures to create private variables and methods, exposing only what's necessary.

### Basic Module Pattern

```javascript
const Calculator = (function() {
  // Private variables and functions
  let result = 0;
  
  function log(operation, value) {
    console.log(`${operation}: ${value}`);
  }
  
  // Public API (returned object)
  return {
    add: function(num) {
      result += num;
      log('Added', num);
      return this; // Enable chaining
    },
    subtract: function(num) {
      result -= num;
      log('Subtracted', num);
      return this;
    },
    multiply: function(num) {
      result *= num;
      log('Multiplied by', num);
      return this;
    },
    getResult: function() {
      return result;
    },
    reset: function() {
      result = 0;
      log('Reset', 0);
      return this;
    }
  };
})();

// Usage
Calculator
  .add(10)
  .multiply(2)
  .subtract(5);

console.log(Calculator.getResult()); // 15
// console.log(Calculator.result); // undefined (private)
```

### Revealing Module Pattern

```javascript
const UserManager = (function() {
  // Private
  let users = [];
  let currentId = 0;
  
  function generateId() {
    return ++currentId;
  }
  
  function validateUser(user) {
    return user.name && user.email;
  }
  
  // Public
  function addUser(name, email) {
    const user = { id: generateId(), name, email };
    
    if (validateUser(user)) {
      users.push(user);
      return user;
    }
    
    throw new Error('Invalid user data');
  }
  
  function getUser(id) {
    return users.find(user => user.id === id);
  }
  
  function getAllUsers() {
    return [...users]; // Return copy to prevent mutation
  }
  
  function removeUser(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
    return null;
  }
  
  // Reveal public methods
  return {
    addUser,
    getUser,
    getAllUsers,
    removeUser
  };
})();

// Usage
UserManager.addUser('Alice', 'alice@email.com');
UserManager.addUser('Bob', 'bob@email.com');
console.log(UserManager.getAllUsers());
// console.log(UserManager.users); // undefined (private)
```

---

## 5. Private Variables

Closures are the primary way to create truly private variables in JavaScript (before private class fields).

### Private Variables with Functions

```javascript
function BankAccount(initialBalance) {
  // Private variable
  let balance = initialBalance;
  
  // Private method
  function validateAmount(amount) {
    return typeof amount === 'number' && amount > 0;
  }
  
  // Public methods
  this.deposit = function(amount) {
    if (validateAmount(amount)) {
      balance += amount;
      return `Deposited $${amount}. New balance: $${balance}`;
    }
    return 'Invalid amount';
  };
  
  this.withdraw = function(amount) {
    if (validateAmount(amount) && amount <= balance) {
      balance -= amount;
      return `Withdrew $${amount}. New balance: $${balance}`;
    }
    return 'Invalid amount or insufficient funds';
  };
  
  this.getBalance = function() {
    return balance;
  };
}

const account = new BankAccount(1000);
console.log(account.deposit(500));    // Deposited $500. New balance: $1500
console.log(account.withdraw(200));   // Withdrew $200. New balance: $1300
console.log(account.getBalance());    // 1300
console.log(account.balance);         // undefined (private)
```

### Private Variables with ES6 Classes and Closures

```javascript
const Person = (function() {
  // WeakMap to store private data
  const privateData = new WeakMap();
  
  class Person {
    constructor(name, age) {
      privateData.set(this, { name, age });
    }
    
    getName() {
      return privateData.get(this).name;
    }
    
    getAge() {
      return privateData.get(this).age;
    }
    
    haveBirthday() {
      const data = privateData.get(this);
      data.age++;
      return `Happy birthday! Now ${data.age} years old.`;
    }
  }
  
  return Person;
})();

const person = new Person('Alice', 30);
console.log(person.getName());     // Alice
console.log(person.haveBirthday()); // Happy birthday! Now 31 years old.
console.log(person.age);           // undefined (private)
```

### Creating a Singleton with Private State

```javascript
const AppConfig = (function() {
  // Private state
  let instance = null;
  let settings = {
    theme: 'light',
    language: 'en',
    apiKey: 'secret-key-123'
  };
  
  function createInstance() {
    return {
      getSetting: function(key) {
        return settings[key];
      },
      setSetting: function(key, value) {
        if (key !== 'apiKey') { // Prevent changing apiKey
          settings[key] = value;
          return true;
        }
        return false;
      },
      getAllSettings: function() {
        const { apiKey, ...publicSettings } = settings;
        return publicSettings; // Don't expose apiKey
      }
    };
  }
  
  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// Usage
const config1 = AppConfig.getInstance();
const config2 = AppConfig.getInstance();

console.log(config1 === config2); // true (same instance)

config1.setSetting('theme', 'dark');
console.log(config2.getSetting('theme')); // 'dark'
```

---

## 6. IIFE (Immediately Invoked Function Expressions)

An IIFE is a function that runs immediately after it's defined. It's useful for creating private scopes and avoiding global namespace pollution.

### Basic IIFE Syntax

```javascript
// Method 1: With parentheses around function
(function() {
  console.log('This runs immediately!');
})();

// Method 2: With parentheses around entire expression
(function() {
  console.log('This also runs immediately!');
}());

// With arrow functions
(() => {
  console.log('Arrow IIFE!');
})();
```

### IIFE with Parameters

```javascript
(function(name, age) {
  console.log(`${name} is ${age} years old`);
})('Alice', 30);

// Using global objects
(function(window, document) {
  // Now you can minify 'window' and 'document' safely
  console.log(window.innerWidth);
  console.log(document.title);
})(window, document);
```

### IIFE for Private Scope

```javascript
// Without IIFE (pollutes global scope)
var counter = 0;
function increment() { counter++; }

// With IIFE (no global pollution)
const myCounter = (function() {
  let counter = 0; // Private
  
  return {
    increment: function() {
      counter++;
    },
    getValue: function() {
      return counter;
    }
  };
})();

myCounter.increment();
console.log(myCounter.getValue()); // 1
console.log(myCounter.counter);    // undefined
```

### IIFE for Initialization

```javascript
const app = (function() {
  // Run initialization code
  console.log('Initializing app...');
  
  const config = {
    apiUrl: 'https://api.example.com',
    version: '1.0.0'
  };
  
  // Setup event listeners
  function setupEventListeners() {
    console.log('Event listeners setup complete');
  }
  
  function loadData() {
    console.log('Loading initial data...');
  }
  
  // Initialize
  setupEventListeners();
  loadData();
  
  // Return public API
  return {
    version: config.version,
    restart: function() {
      console.log('Restarting app...');
      loadData();
    }
  };
})();

console.log(app.version); // 1.0.0
```

### Classic Use Case: Loop with var

```javascript
// Problem
var functions = [];
for (var i = 0; i < 3; i++) {
  functions.push(function() {
    console.log(i);
  });
}
functions[0](); // 3
functions[1](); // 3
functions[2](); // 3

// Solution with IIFE
var functions = [];
for (var i = 0; i < 3; i++) {
  functions.push((function(capturedI) {
    return function() {
      console.log(capturedI);
    };
  })(i));
}
functions[0](); // 0
functions[1](); // 1
functions[2](); // 2
```

### Module Pattern with IIFE

```javascript
const ShoppingCart = (function() {
  // Private
  let items = [];
  let total = 0;
  
  function calculateTotal() {
    total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  
  // Public
  return {
    addItem: function(name, price, quantity = 1) {
      items.push({ name, price, quantity });
      calculateTotal();
      return this;
    },
    
    removeItem: function(name) {
      items = items.filter(item => item.name !== name);
      calculateTotal();
      return this;
    },
    
    getTotal: function() {
      return total.toFixed(2);
    },
    
    getItems: function() {
      return [...items];
    },
    
    clear: function() {
      items = [];
      total = 0;
      return this;
    }
  };
})();

// Usage
ShoppingCart
  .addItem('Laptop', 999.99)
  .addItem('Mouse', 29.99, 2);

console.log(ShoppingCart.getTotal()); // 1059.97
console.log(ShoppingCart.getItems());
```

---

## 7. Practice Exercises

### Exercise 1: Create a Counter Factory

Create a function that returns an object with increment, decrement, and reset methods.

```javascript
function createCounter(initialValue = 0) {
  // Your code here
}

const counter = createCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.decrement(); // 11
counter.reset();     // 10
```

### Exercise 2: Private Todo List

Create a todo list module with private storage using the module pattern.

```javascript
const TodoList = (function() {
  // Create private todos array
  // Add methods: addTodo, removeTodo, getTodos, clearCompleted
})();
```

### Exercise 3: Function Memoization

Create a memoize function that caches expensive function calls.

```javascript
function memoize(fn) {
  // Your code here
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);
```

### Exercise 4: Rate Limiter

Create a rate limiter that only allows a function to be called once per specified time period.

```javascript
function rateLimiter(fn, delay) {
  // Your code here
}

const limitedFunction = rateLimiter(() => {
  console.log('Called!');
}, 1000);
```

### Exercise 5: Secret Message

Create a module that can encrypt and decrypt messages using a private key.

```javascript
const SecretMessage = (function() {
  // Private key
  // encrypt method
  // decrypt method
})();
```

---

## Solutions

### Solution 1: Counter Factory

```javascript
function createCounter(initialValue = 0) {
  let count = initialValue;
  const initial = initialValue;
  
  return {
    increment: function() {
      return ++count;
    },
    decrement: function() {
      return --count;
    },
    reset: function() {
      count = initial;
      return count;
    },
    getValue: function() {
      return count;
    }
  };
}
```

### Solution 2: Private Todo List

```javascript
const TodoList = (function() {
  let todos = [];
  let nextId = 1;
  
  return {
    addTodo: function(text) {
      const todo = {
        id: nextId++,
        text,
        completed: false
      };
      todos.push(todo);
      return todo;
    },
    
    removeTodo: function(id) {
      todos = todos.filter(todo => todo.id !== id);
    },
    
    toggleTodo: function(id) {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    
    getTodos: function() {
      return [...todos];
    },
    
    clearCompleted: function() {
      todos = todos.filter(todo => !todo.completed);
    }
  };
})();
```

### Solution 3: Function Memoization

```javascript
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### Solution 4: Rate Limiter

```javascript
function rateLimiter(fn, delay) {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
    
    console.log('Rate limited - please wait');
  };
}
```

### Solution 5: Secret Message

```javascript
const SecretMessage = (function() {
  const secretKey = 3; // Caesar cipher shift
  
  function caesarCipher(str, shift) {
    return str.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    }).join('');
  }
  
  return {
    encrypt: function(message) {
      return caesarCipher(message, secretKey);
    },
    decrypt: function(encrypted) {
      return caesarCipher(encrypted, 26 - secretKey);
    }
  };
})();
```

---

## Key Takeaways

1. **Lexical Scope**: Variables are accessible based on where they're defined in the code
2. **Closures**: Functions that remember their outer scope even after the outer function returns
3. **Module Pattern**: Use closures to create private variables and expose public APIs
4. **IIFE**: Immediately invoked functions create private scopes and avoid global pollution
5. **Private Variables**: Closures are the classic way to create truly private data in JavaScript

## Further Reading

- MDN: Closures
- JavaScript.info: Variable Scope, Closure
- "You Don't Know JS: Scope & Closures" by Kyle Simpson
- Understanding the Module Pattern in JavaScript

---

**Practice makes perfect!** Try creating your own modules using closures and experiment with different patterns.