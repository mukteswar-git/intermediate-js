# Week 15: Error Management & Debugging

## Table of Contents
1. [Introduction to Error Handling](#introduction)
2. [Try/Catch/Finally Blocks](#try-catch-finally)
3. [The Throw Keyword](#throw-keyword)
4. [Error Types](#error-types)
5. [Custom Error Classes](#custom-errors)
6. [Async Error Handling](#async-errors)
7. [Debugging Techniques](#debugging)
8. [Chrome DevTools Mastery](#devtools)
9. [Practice Exercises](#exercises)

---

## Introduction to Error Handling {#introduction}

Error handling is crucial for creating robust applications that can gracefully handle unexpected situations. Without proper error handling, your application can crash or behave unpredictably.

### Why Error Handling Matters

- Prevents application crashes
- Provides meaningful feedback to users
- Helps developers identify and fix bugs
- Improves overall code reliability
- Enables graceful degradation

---

## Try/Catch/Finally Blocks {#try-catch-finally}

The `try...catch...finally` statement is the foundation of error handling in JavaScript.

### Basic Syntax

```javascript
try {
  // Code that might throw an error
} catch (error) {
  // Code to handle the error
} finally {
  // Code that always runs (optional)
}
```

### Try Block

The `try` block contains code that might throw an error.

```javascript
try {
  const result = riskyOperation();
  console.log(result);
}
```

### Catch Block

The `catch` block executes when an error occurs in the try block.

```javascript
try {
  const data = JSON.parse('invalid json');
} catch (error) {
  console.error('Failed to parse JSON:', error.message);
}
```

### Finally Block

The `finally` block always executes, regardless of whether an error occurred.

```javascript
let file;
try {
  file = openFile('data.txt');
  processFile(file);
} catch (error) {
  console.error('Error processing file:', error);
} finally {
  // Always close the file, even if an error occurred
  if (file) {
    closeFile(file);
  }
}
```

### Practical Examples

#### Example 1: Safe JSON Parsing

```javascript
function safeJSONParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Invalid JSON:', error.message);
    return null;
  }
}

const data1 = safeJSONParse('{"name": "John"}'); // Works
const data2 = safeJSONParse('invalid'); // Returns null
```

#### Example 2: Database Connection

```javascript
async function connectToDatabase() {
  let connection;
  try {
    connection = await database.connect();
    await connection.query('SELECT * FROM users');
    return connection;
  } catch (error) {
    console.error('Database error:', error);
    throw error; // Re-throw for caller to handle
  } finally {
    console.log('Connection attempt completed');
  }
}
```

---

## The Throw Keyword {#throw-keyword}

The `throw` keyword allows you to create custom errors and control program flow.

### Basic Usage

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

try {
  console.log(divide(10, 2)); // 5
  console.log(divide(10, 0)); // Throws error
} catch (error) {
  console.error(error.message); // "Cannot divide by zero"
}
```

### Throwing Different Values

You can throw any value, but Error objects are recommended.

```javascript
// Throwing a string (not recommended)
throw 'Something went wrong';

// Throwing a number (not recommended)
throw 404;

// Throwing an Error object (recommended)
throw new Error('Something went wrong');

// Throwing a custom object
throw {
  code: 'AUTH_FAILED',
  message: 'Authentication failed',
  timestamp: Date.now()
};
```

### Re-throwing Errors

```javascript
function processUser(user) {
  try {
    validateUser(user);
    saveUser(user);
  } catch (error) {
    console.error('Processing failed:', error);
    // Re-throw to let caller handle it
    throw error;
  }
}

try {
  processUser(invalidUser);
} catch (error) {
  // Handle at higher level
  notifyAdmin(error);
}
```

---

## Error Types {#error-types}

JavaScript has several built-in error types for different situations.

### Common Error Types

#### 1. Error (Base Class)

The generic error type.

```javascript
throw new Error('Generic error message');
```

#### 2. SyntaxError

Occurs when code has incorrect syntax.

```javascript
try {
  eval('console.log("hello)'); // Missing closing quote
} catch (error) {
  console.log(error.name); // "SyntaxError"
  console.log(error.message);
}
```

#### 3. ReferenceError

Occurs when referencing a non-existent variable.

```javascript
try {
  console.log(undefinedVariable);
} catch (error) {
  console.log(error.name); // "ReferenceError"
  console.log(error.message); // "undefinedVariable is not defined"
}
```

#### 4. TypeError

Occurs when a value is not of the expected type.

```javascript
try {
  const num = 42;
  num.toUpperCase(); // Numbers don't have toUpperCase
} catch (error) {
  console.log(error.name); // "TypeError"
  console.log(error.message);
}
```

#### 5. RangeError

Occurs when a value is outside the allowable range.

```javascript
try {
  const arr = new Array(-1); // Array length must be positive
} catch (error) {
  console.log(error.name); // "RangeError"
}
```

#### 6. URIError

Occurs with improper use of URI functions.

```javascript
try {
  decodeURIComponent('%'); // Invalid URI
} catch (error) {
  console.log(error.name); // "URIError"
}
```

### Checking Error Types

```javascript
try {
  someRiskyOperation();
} catch (error) {
  if (error instanceof TypeError) {
    console.log('Type error occurred');
  } else if (error instanceof ReferenceError) {
    console.log('Reference error occurred');
  } else {
    console.log('Unknown error:', error);
  }
}
```

---

## Custom Error Classes {#custom-errors}

Creating custom error classes helps you handle specific error scenarios more effectively.

### Basic Custom Error

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }
}

try {
  validateEmail('notanemail');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed:', error.message);
  }
}
```

### Advanced Custom Error with Additional Properties

```javascript
class DatabaseError extends Error {
  constructor(message, query, code) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
    this.code = code;
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      query: this.query,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}

// Usage
try {
  throw new DatabaseError(
    'Connection failed',
    'SELECT * FROM users',
    'ERR_CONN_TIMEOUT'
  );
} catch (error) {
  console.log(error.name); // "DatabaseError"
  console.log(error.code); // "ERR_CONN_TIMEOUT"
  console.log(error.query); // "SELECT * FROM users"
  console.log(JSON.stringify(error)); // Uses toJSON method
}
```

### Real-World Example: HTTP Error Classes

```javascript
class HTTPError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'HTTPError';
    this.statusCode = statusCode;
  }
}

class NotFoundError extends HTTPError {
  constructor(resource) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends HTTPError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class BadRequestError extends HTTPError {
  constructor(message = 'Bad request', errors = []) {
    super(message, 400);
    this.name = 'BadRequestError';
    this.errors = errors;
  }
}

// Usage in an API
async function getUser(userId) {
  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  const user = await database.findUser(userId);
  
  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
}

// Error handling middleware
try {
  const user = await getUser(null);
} catch (error) {
  if (error instanceof HTTPError) {
    console.log(`HTTP ${error.statusCode}: ${error.message}`);
  }
}
```

---

## Async Error Handling {#async-errors}

Handling errors in asynchronous code requires special attention.

### Promises with .catch()

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    console.error('Fetch failed:', error);
  })
  .finally(() => {
    console.log('Request completed');
  });
```

### Async/Await with Try/Catch

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw for caller
  }
}

// Usage
async function displayUser(userId) {
  try {
    const user = await fetchUserData(userId);
    console.log(user);
  } catch (error) {
    console.log('Could not display user');
  }
}
```

### Handling Multiple Async Operations

```javascript
async function loadAllData() {
  try {
    // Parallel execution with error handling
    const [users, posts, comments] = await Promise.all([
      fetchUsers(),
      fetchPosts(),
      fetchComments()
    ]);
    
    return { users, posts, comments };
  } catch (error) {
    console.error('Failed to load data:', error);
    throw error;
  }
}

// Handle partial failures
async function loadDataWithFallback() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);
  
  const data = {
    users: null,
    posts: null,
    comments: null
  };
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const keys = ['users', 'posts', 'comments'];
      data[keys[index]] = result.value;
    } else {
      console.error(`Failed to load ${['users', 'posts', 'comments'][index]}:`, result.reason);
    }
  });
  
  return data;
}
```

### Async Error Wrapper

```javascript
// Utility function to eliminate try/catch repetition
function asyncHandler(fn) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Async error:', error);
      throw error;
    }
  };
}

// Usage
const fetchUser = asyncHandler(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return await response.json();
});

// No try/catch needed in the calling code
const user = await fetchUser(123);
```

### Timeout Handling

```javascript
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([
      fetch(url),
      timeout(ms)
    ]);
    return await response.json();
  } catch (error) {
    if (error.message === 'Operation timed out') {
      console.error('Request took too long');
    }
    throw error;
  }
}
```

---

## Debugging Techniques {#debugging}

Effective debugging is essential for finding and fixing errors quickly.

### Console Methods

#### console.log() Variations

```javascript
const user = { name: 'John', age: 30 };

// Basic logging
console.log('User:', user);

// Multiple values
console.log('Name:', user.name, 'Age:', user.age);

// String interpolation
console.log(`User ${user.name} is ${user.age} years old`);

// Object logging
console.log({ user }); // Shows property name
```

#### Other Console Methods

```javascript
// console.error() - Red error message
console.error('This is an error!');

// console.warn() - Yellow warning
console.warn('This is a warning!');

// console.info() - Info message
console.info('This is information');

// console.table() - Display data as table
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];
console.table(users);

// console.group() - Group related logs
console.group('User Details');
console.log('Name: John');
console.log('Age: 30');
console.groupEnd();

// console.time() - Measure execution time
console.time('Loop');
for (let i = 0; i < 1000000; i++) {}
console.timeEnd('Loop');

// console.trace() - Show stack trace
function a() { b(); }
function b() { c(); }
function c() { console.trace('Trace'); }
a();

// console.assert() - Log only if false
console.assert(2 + 2 === 4, 'Math works');
console.assert(2 + 2 === 5, 'Math is broken!');

// console.count() - Count calls
for (let i = 0; i < 5; i++) {
  console.count('Loop iteration');
}
```

### Debugger Statement

```javascript
function calculateTotal(items) {
  let total = 0;
  
  debugger; // Execution pauses here when DevTools is open
  
  for (const item of items) {
    total += item.price * item.quantity;
  }
  
  return total;
}
```

### Conditional Breakpoints

```javascript
function processItems(items) {
  for (let i = 0; i < items.length; i++) {
    // In DevTools, set breakpoint here with condition: i === 5
    processItem(items[i]);
  }
}
```

### Stack Traces

```javascript
function getStackTrace() {
  try {
    throw new Error('Stack trace');
  } catch (error) {
    return error.stack;
  }
}

console.log(getStackTrace());
```

---

## Chrome DevTools Mastery {#devtools}

Chrome DevTools provides powerful debugging capabilities.

### Opening DevTools

- Windows/Linux: `F12` or `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`
- Right-click > Inspect

### Sources Panel

#### Setting Breakpoints

1. Open Sources panel
2. Find your JavaScript file
3. Click line number to set breakpoint
4. Blue marker indicates active breakpoint

#### Conditional Breakpoints

1. Right-click line number
2. Select "Add conditional breakpoint"
3. Enter condition (e.g., `userId === 123`)

#### Breakpoint Types

```javascript
// Line breakpoint - Click line number

// Conditional breakpoint - Right-click line number
function processUser(user) {
  // Break only when user.id === 5
  return user.name;
}

// DOM breakpoint - Right-click element > Break on
// - Subtree modifications
// - Attribute modifications
// - Node removal

// Event listener breakpoint
// Sources > Event Listener Breakpoints > Check events

// XHR/Fetch breakpoint
// Sources > XHR/fetch Breakpoints > Add URL pattern
```

### Debugging Controls

When paused at a breakpoint:

- **Resume (F8)** - Continue execution
- **Step Over (F10)** - Execute current line, skip function details
- **Step Into (F11)** - Enter function on current line
- **Step Out (Shift + F11)** - Exit current function
- **Step (F9)** - Execute next statement

### Watch Expressions

```javascript
function calculatePrice(item) {
  const basePrice = item.price;
  const quantity = item.quantity;
  const discount = item.discount || 0;
  
  // In DevTools Watch panel, add:
  // - basePrice
  // - quantity
  // - discount
  // - basePrice * quantity * (1 - discount)
  
  return basePrice * quantity * (1 - discount);
}
```

### Call Stack

View the sequence of function calls that led to the current point.

```javascript
function a() { b(); }
function b() { c(); }
function c() { 
  debugger; // Check Call Stack panel
  console.log('At c');
}
a(); // Call Stack shows: c > b > a
```

### Scope Variables

When paused, the Scope panel shows:

- **Local** - Variables in current function
- **Closure** - Variables from outer scopes
- **Global** - Global variables

### Console Panel Integration

```javascript
// When paused at breakpoint, use Console to:

// Inspect variables
> user.name

// Test expressions
> user.age > 18

// Call functions
> validateUser(user)

// Modify variables (temporarily)
> user.age = 25
```

### Network Panel Debugging

```javascript
// Debug API calls
fetch('/api/users')
  .then(response => {
    // Check Network panel:
    // - Request headers
    // - Response headers
    // - Status code
    // - Response body
    // - Timing
    return response.json();
  });
```

### Performance Profiling

```javascript
// Profile function performance
console.profile('myFunction');
myExpensiveFunction();
console.profileEnd('myFunction');

// Or use Performance panel:
// 1. Click Record
// 2. Perform actions
// 3. Click Stop
// 4. Analyze flame graph
```

### Memory Profiling

```javascript
// Check for memory leaks
let leakyArray = [];

setInterval(() => {
  // Memory panel shows growing heap
  leakyArray.push(new Array(1000000));
}, 1000);
```

### Blackboxing Scripts

Ignore third-party scripts while debugging:

1. Sources panel > Call Stack
2. Right-click library file
3. Select "Blackbox script"

### Snippets

Save reusable debugging code:

1. Sources > Snippets
2. Click "+ New snippet"
3. Write code
4. Right-click > Run

```javascript
// Useful snippet: Find all event listeners
getAllEventListeners(document);

// Snippet: Log all fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch:', args[0]);
  return originalFetch.apply(this, args);
};
```

### DevTools Tips & Tricks

```javascript
// $ commands in Console
$0 // Last selected element
$1 // Second-to-last selected element
$('selector') // document.querySelector
$$('selector') // document.querySelectorAll
$x('xpath') // XPath query

// Copy to clipboard
copy(object) // Copies JSON to clipboard

// Monitor function calls
monitor(functionName)
unmonitor(functionName)

// Get event listeners
getEventListeners(element)

// Inspect element
inspect(element)

// Clear console
clear()
```

---

## Practice Exercises {#exercises}

### Exercise 1: Basic Error Handling

Create a calculator function with proper error handling.

```javascript
function calculate(operation, a, b) {
  // TODO: Implement with error handling
  // - Check if operation is valid (+, -, *, /)
  // - Check if a and b are numbers
  // - Handle division by zero
  // - Throw appropriate errors
}

// Test cases
try {
  console.log(calculate('+', 5, 3)); // Should return 8
  console.log(calculate('/', 10, 0)); // Should throw error
  console.log(calculate('*', 'a', 5)); // Should throw error
} catch (error) {
  console.error(error.message);
}
```

### Exercise 2: Custom Error Classes

Create a user registration system with custom errors.

```javascript
// TODO: Create custom error classes
// - ValidationError (for invalid input)
// - DuplicateUserError (for existing users)
// - DatabaseError (for database issues)

class UserService {
  constructor() {
    this.users = [];
  }

  register(username, email, password) {
    // TODO: Implement with proper error handling
    // - Validate input
    // - Check for duplicates
    // - Simulate database operations
  }
}

// Test the service
const service = new UserService();
try {
  service.register('john', 'john@example.com', 'pass123');
  service.register('john', 'john@example.com', 'pass123'); // Should throw DuplicateUserError
} catch (error) {
  console.error(error.name, error.message);
}
```

### Exercise 3: Async Error Handling

Create an API client with comprehensive error handling.

```javascript
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    // TODO: Implement with error handling
    // - Handle network errors
    // - Handle HTTP errors (4xx, 5xx)
    // - Add timeout handling
    // - Parse JSON safely
  }

  async post(endpoint, data) {
    // TODO: Implement POST with error handling
  }
}

// Test the client
const client = new APIClient('https://jsonplaceholder.typicode.com');

async function testAPI() {
  try {
    const data = await client.get('/posts/1');
    console.log(data);
  } catch (error) {
    console.error('API call failed:', error);
  }
}

testAPI();
```

### Exercise 4: Debugging Challenge

Debug this code using DevTools:

```javascript
// This code has several bugs. Use DevTools to find and fix them.
function processOrders(orders) {
  let total = 0;
  let processed = [];

  for (let i = 0; i <= orders.length; i++) {
    const order = orders[i];
    const price = order.price * order.quantity;
    
    if (order.discount) {
      price = price * (1 - order.discount);
    }
    
    total += price;
    processed.push({
      id: order.id,
      total: price
    });
  }

  return {
    total: total,
    orders: processed
  };
}

const orders = [
  { id: 1, price: 100, quantity: 2, discount: 0.1 },
  { id: 2, price: 50, quantity: 3 },
  { id: 3, price: 75, quantity: 1, discount: 0.2 }
];

console.log(processOrders(orders));
```

### Exercise 5: Error Logging System

Create a comprehensive error logging system.

```javascript
class ErrorLogger {
  constructor() {
    this.errors = [];
  }

  log(error, context = {}) {
    // TODO: Implement error logging
    // - Store error with timestamp
    // - Include context information
    // - Categorize by severity
    // - Support different error types
  }

  getErrors(filter = {}) {
    // TODO: Implement filtering
    // - By type
    // - By severity
    // - By date range
  }

  clearErrors() {
    // TODO: Implement
  }

  exportErrors() {
    // TODO: Export as JSON
  }
}

// Test the logger
const logger = new ErrorLogger();

try {
  throw new TypeError('Invalid type');
} catch (error) {
  logger.log(error, { userId: 123, action: 'login' });
}

console.log(logger.getErrors());
```

---

## Additional Resources

### Recommended Reading
- MDN Web Docs: Error Handling
- JavaScript.info: Error Handling
- Chrome DevTools Documentation

### Practice Platforms
- Frontend Mentor
- JavaScript30
- LeetCode (debugging challenges)

### Tools
- Chrome DevTools
- VS Code Debugger
- Error tracking services (Sentry, LogRocket)

---

## Summary

In this week, you learned:

- How to use try/catch/finally blocks effectively
- When and how to throw errors
- Different built-in error types and their uses
- Creating custom error classes for specific scenarios
- Handling errors in asynchronous code
- Essential debugging techniques
- Mastering Chrome DevTools for efficient debugging

Remember that good error handling makes your applications more robust, easier to debug, and provides better user experiences. Practice these techniques regularly to make them second nature in your development workflow.

---

**Next Week**: Advanced Patterns & Best Practices