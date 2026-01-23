# Week 26: JavaScript Best Practices & Security

## Table of Contents

1. [Clean Code Principles](#clean-code-principles)
2. [DRY, KISS, YAGNI](#dry-kiss-yagni)
3. [Code Comments](#code-comments)
4. [Naming Conventions](#naming-conventions)
5. [Error Handling Best Practices](#error-handling-best-practices)
6. [Security Basics](#security-basics)
7. [Practical Exercises](#practical-exercises)

---

## Clean Code Principles

Clean code is code that is easy to read, understand, and maintain. It reflects professionalism and respect for fellow developers.

### Core Principles

#### 1. Readability Over Cleverness

```javascript
// Bad: Clever but hard to understand
const r = arr.reduce((a,b)=>a+b)/arr.length;

// Good: Clear and self-explanatory
const calculateAverage = (numbers) => {
  const sum = numbers.reduce((total, num) => total + num, 0);
  return sum / numbers.length;
};
```

#### 2. Single Responsibility Principle

Each function should do one thing and do it well.

```javascript
// Bad: Function does too many things
function processUserData(user) {
  const validated = validateEmail(user.email);
  const saved = saveToDatabase(user);
  const emailSent = sendWelcomeEmail(user.email);
  return { validated, saved, emailSent };
}

// Good: Separate concerns
function validateUser(user) {
  return validateEmail(user.email);
}

function saveUser(user) {
  return saveToDatabase(user);
}

function notifyUser(user) {
  return sendWelcomeEmail(user.email);
}
```

#### 3. Keep Functions Small

Functions should be concise and focused.

```javascript
// Bad: Long function with multiple responsibilities
function createUserAccount(userData) {
  if (!userData.email || !userData.email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (!userData.password || userData.password.length < 8) {
    throw new Error('Password too short');
  }
  const hashedPassword = hashPassword(userData.password);
  const user = {
    id: generateId(),
    email: userData.email,
    password: hashedPassword,
    createdAt: new Date()
  };
  saveToDatabase(user);
  sendWelcomeEmail(user.email);
  logUserCreation(user.id);
  return user;
}

// Good: Broken into smaller, focused functions
function validateUserInput(userData) {
  validateEmail(userData.email);
  validatePassword(userData.password);
}

function createUser(userData) {
  return {
    id: generateId(),
    email: userData.email,
    password: hashPassword(userData.password),
    createdAt: new Date()
  };
}

function registerUser(userData) {
  validateUserInput(userData);
  const user = createUser(userData);
  saveToDatabase(user);
  sendWelcomeEmail(user.email);
  logUserCreation(user.id);
  return user;
}
```

#### 4. Avoid Magic Numbers

Use named constants instead of literal values.

```javascript
// Bad
function calculateDiscount(price) {
  return price * 0.15;
}

// Good
const DISCOUNT_RATE = 0.15;

function calculateDiscount(price) {
  return price * DISCOUNT_RATE;
}
```

---

## DRY, KISS, YAGNI

### DRY (Don't Repeat Yourself)

Avoid code duplication by abstracting common patterns.

```javascript
// Bad: Repetitive code
function calculateCircleArea(radius) {
  return 3.14159 * radius * radius;
}

function calculateCircleCircumference(radius) {
  return 2 * 3.14159 * radius;
}

function calculateSphereVolume(radius) {
  return (4/3) * 3.14159 * radius * radius * radius;
}

// Good: Single source of truth
const PI = Math.PI;

const circle = {
  area: (radius) => PI * radius ** 2,
  circumference: (radius) => 2 * PI * radius
};

const sphere = {
  volume: (radius) => (4/3) * PI * radius ** 3,
  surfaceArea: (radius) => 4 * PI * radius ** 2
};
```

#### Real-world Example: Form Validation

```javascript
// Bad: Repeated validation logic
function validateLoginForm(data) {
  if (!data.email || !data.email.includes('@')) {
    return { valid: false, error: 'Invalid email' };
  }
  if (!data.password || data.password.length < 8) {
    return { valid: false, error: 'Password too short' };
  }
  return { valid: true };
}

function validateRegistrationForm(data) {
  if (!data.email || !data.email.includes('@')) {
    return { valid: false, error: 'Invalid email' };
  }
  if (!data.password || data.password.length < 8) {
    return { valid: false, error: 'Password too short' };
  }
  if (!data.username || data.username.length < 3) {
    return { valid: false, error: 'Username too short' };
  }
  return { valid: true };
}

// Good: Reusable validators
const validators = {
  email: (email) => {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }
  },
  password: (password) => {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
  },
  username: (username) => {
    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
  }
};

function validateForm(data, requiredFields) {
  try {
    requiredFields.forEach(field => {
      if (validators[field]) {
        validators[field](data[field]);
      }
    });
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Usage
validateForm(loginData, ['email', 'password']);
validateForm(registrationData, ['email', 'password', 'username']);
```

### KISS (Keep It Simple, Stupid)

Prefer simple solutions over complex ones.

```javascript
// Bad: Overly complex
function isEven(num) {
  return num % 2 === 0 ? true : false;
}

// Good: Simple and direct
function isEven(num) {
  return num % 2 === 0;
}

// Bad: Unnecessary abstraction
class NumberChecker {
  constructor(number) {
    this.number = number;
  }
  
  checkIfEven() {
    return this.number % 2 === 0;
  }
}

// Good: Simple function
const isEven = (num) => num % 2 === 0;
```

### YAGNI (You Aren't Gonna Need It)

Don't add functionality until it's actually needed.

```javascript
// Bad: Over-engineering for future possibilities
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.preferences = {};
    this.settings = {};
    this.metadata = {};
    this.customFields = {};
    this.extensions = {};
  }
  
  setPreference(key, value) { /* ... */ }
  setSetting(key, value) { /* ... */ }
  setMetadata(key, value) { /* ... */ }
  // ... many more methods we might never use
}

// Good: Start simple, add when needed
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// Add features only when requirements are clear
```

---

## Code Comments

### When to Comment

**Do Comment:**

- Complex algorithms or business logic
- Why decisions were made (not what the code does)
- Warnings about edge cases or gotchas
- Public API documentation

```javascript
/**
 * Calculates the Levenshtein distance between two strings.
 * Used for fuzzy string matching in the search feature.
 * 
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare
 * @returns {number} The edit distance between strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  // Initialize first row and column
  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill the matrix
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str1.length][str2.length];
}

// FIXME: This function fails for arrays with more than 10,000 elements
// TODO: Optimize using a more efficient algorithm
function sortLargeArray(arr) {
  // Using bubble sort temporarily - will cause performance issues
  // Need to implement quicksort or mergesort for production
  return arr.sort();
}

// WARNING: Modifying this timeout may cause race conditions
// with the database connection pool
const DB_TIMEOUT = 5000;
```

**Don't Comment:**

- Obvious code that's self-explanatory
- Redundant information
- Code that can be made clearer through better naming

```javascript
// Bad: Stating the obvious
// Increment i by 1
i++;

// Set the user's name to the input value
user.name = inputValue;

// Loop through all items
for (let item of items) {
  // Process the item
  processItem(item);
}

// Good: Let the code speak
const MAX_RETRY_ATTEMPTS = 3;

function retryFailedRequest(requestFn) {
  let attempts = 0;
  
  while (attempts < MAX_RETRY_ATTEMPTS) {
    try {
      return requestFn();
    } catch (error) {
      attempts++;
      if (attempts >= MAX_RETRY_ATTEMPTS) {
        throw error;
      }
    }
  }
}
```

### JSDoc for Documentation

```javascript
/**
 * Represents a shopping cart item.
 * @typedef {Object} CartItem
 * @property {string} id - Unique item identifier
 * @property {string} name - Product name
 * @property {number} price - Price in cents
 * @property {number} quantity - Number of items
 */

/**
 * Adds an item to the shopping cart.
 * @param {CartItem[]} cart - The current shopping cart
 * @param {CartItem} item - The item to add
 * @returns {CartItem[]} Updated cart with the new item
 * @throws {Error} If item has invalid properties
 */
function addToCart(cart, item) {
  if (!item.id || !item.name || item.price < 0) {
    throw new Error('Invalid item properties');
  }
  
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += item.quantity;
    return cart;
  }
  
  return [...cart, item];
}
```

---

## Naming Conventions

### Variables and Functions

```javascript
// Use camelCase for variables and functions
const userEmail = 'user@example.com';
const isAuthenticated = true;

function calculateTotalPrice(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

// Use PascalCase for classes and constructors
class UserAccount {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
}

// Use UPPER_SNAKE_CASE for constants
const MAX_LOGIN_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;

// Use descriptive names that reveal intent
// Bad
const d = new Date();
const u = getUserData();
const temp = x * 2;

// Good
const currentDate = new Date();
const userData = getUserData();
const doubledValue = value * 2;
```

### Boolean Variables

Prefix with is, has, can, should:

```javascript
const isLoading = false;
const hasPermission = true;
const canEdit = checkEditPermission();
const shouldRenderModal = user.isAuthenticated && !modal.isOpen;
```

### Functions

Use verb-noun combinations:

```javascript
// Good function names
function fetchUserData() { }
function validateEmail() { }
function createOrder() { }
function deleteAccount() { }
function toggleSidebar() { }
function calculateDiscount() { }

// Avoid vague names
function handleData() { }  // Too vague
function doStuff() { }     // Meaningless
function process() { }     // What does it process?
```

### Arrays and Collections

Use plural nouns:

```javascript
const users = [];
const products = ['laptop', 'phone'];
const errorMessages = new Set();
const userProfiles = new Map();
```

---

## Error Handling Best Practices

### Use Try-Catch for Synchronous Code

```javascript
// Bad: Unhandled errors crash the application
function parseUserData(jsonString) {
  return JSON.parse(jsonString);
}

// Good: Graceful error handling
function parseUserData(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse user data:', error.message);
    return null;
  }
}
```

### Create Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class DatabaseError extends Error {
  constructor(message, query) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
  }
}

// Usage
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
  if (!user.password) {
    throw new ValidationError('Password is required', 'password');
  }
}

try {
  validateUser({ email: '' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation failed for field: ${error.field}`);
  }
}
```

### Handle Async Errors Properly

```javascript
// Bad: Unhandled promise rejection
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json());
}

// Good: Catch errors
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error; // Re-throw if caller should handle it
  }
}

// Or use .catch()
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Failed to fetch user data:', error);
      throw error;
    });
}
```

### Provide Meaningful Error Messages

```javascript
// Bad: Generic, unhelpful errors
throw new Error('Error');
throw new Error('Something went wrong');

// Good: Specific, actionable errors
throw new Error('User not found with ID: ' + userId);
throw new Error('Invalid email format. Expected format: user@example.com');
throw new Error('Password must be at least 8 characters long');
```

### Centralized Error Handling

```javascript
class ErrorHandler {
  static handle(error) {
    console.error('Error occurred:', error);
    
    if (error instanceof ValidationError) {
      this.handleValidationError(error);
    } else if (error instanceof DatabaseError) {
      this.handleDatabaseError(error);
    } else {
      this.handleGenericError(error);
    }
  }
  
  static handleValidationError(error) {
    alert(`Validation Error: ${error.message}`);
  }
  
  static handleDatabaseError(error) {
    alert('A database error occurred. Please try again later.');
    // Log to external service
  }
  
  static handleGenericError(error) {
    alert('An unexpected error occurred.');
  }
}

// Usage
try {
  validateAndSaveUser(userData);
} catch (error) {
  ErrorHandler.handle(error);
}
```

### Always Clean Up Resources

```javascript
async function processFile(filename) {
  let fileHandle;
  try {
    fileHandle = await openFile(filename);
    const data = await fileHandle.read();
    return processData(data);
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  } finally {
    // Always executed, even if error occurs
    if (fileHandle) {
      await fileHandle.close();
    }
  }
}
```

---

## Security Basics

### XSS (Cross-Site Scripting)

XSS attacks inject malicious scripts into web pages viewed by other users.

**Types of XSS:**

- Stored XSS: Malicious script is stored on the server
- Reflected XSS: Malicious script is reflected off a web server
- DOM-based XSS: Vulnerability exists in client-side code

**Prevention:**

```javascript
// Bad: Directly inserting user input into DOM
function displayUsername(username) {
  document.getElementById('greeting').innerHTML = 
    `Welcome, ${username}!`;
}
// If username is "<script>alert('XSS')</script>", it will execute!

// Good: Escape user input
function displayUsername(username) {
  const greeting = document.getElementById('greeting');
  greeting.textContent = `Welcome, ${username}!`; // textContent escapes HTML
}

// Or use a sanitization library
import DOMPurify from 'dompurify';

function displayUserBio(bio) {
  const bioElement = document.getElementById('bio');
  bioElement.innerHTML = DOMPurify.sanitize(bio);
}

// Bad: eval() with user input
function executeUserCode(code) {
  eval(code); // NEVER DO THIS
}

// Good: Don't use eval() at all
// If you must parse JSON, use JSON.parse()
function parseUserData(jsonString) {
  try {
    return JSON.parse(jsonString); // Safe
  } catch (error) {
    console.error('Invalid JSON:', error);
    return null;
  }
}
```

**Sanitize URL Parameters:**

```javascript
// Bad: Using URL parameters directly
const urlParams = new URLSearchParams(window.location.search);
const redirectUrl = urlParams.get('redirect');
window.location.href = redirectUrl; // Dangerous!

// Good: Validate and whitelist URLs
function safeRedirect(redirectUrl) {
  const allowedDomains = ['example.com', 'trusted-site.com'];
  
  try {
    const url = new URL(redirectUrl);
    if (allowedDomains.includes(url.hostname)) {
      window.location.href = redirectUrl;
    } else {
      console.warn('Redirect to unauthorized domain blocked');
      window.location.href = '/'; // Default redirect
    }
  } catch (error) {
    console.error('Invalid URL:', error);
    window.location.href = '/';
  }
}
```

### CSRF (Cross-Site Request Forgery)

CSRF tricks users into executing unwanted actions on a web application where they're authenticated.

**Prevention:**

```javascript
// 1. Use CSRF tokens
// Server generates a unique token per session
// Include it in forms and validate on submission

// HTML form
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
  <input type="text" name="amount">
  <button type="submit">Transfer</button>
</form>

// JavaScript fetch with CSRF token
async function transferMoney(amount) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  
  try {
    const response = await fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ amount })
    });
    
    if (!response.ok) {
      throw new Error('Transfer failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Transfer error:', error);
    throw error;
  }
}

// 2. Use SameSite cookie attribute
// Server-side: Set cookies with SameSite attribute
document.cookie = "session=abc123; SameSite=Strict; Secure";

// 3. Verify Origin and Referer headers (server-side check)
// Client sends proper headers
fetch('/api/sensitive-action', {
  method: 'POST',
  credentials: 'same-origin', // Only send cookies for same-origin requests
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

### Additional Security Best Practices

#### 1. Never Store Sensitive Data in localStorage

```javascript
// Bad: Storing sensitive data in localStorage
localStorage.setItem('creditCard', '4111111111111111');
localStorage.setItem('password', 'user123');

// Good: Use secure, httpOnly cookies for sensitive data (set server-side)
// Or use sessionStorage for less sensitive temporary data
sessionStorage.setItem('tempFormData', JSON.stringify(formData));
```

#### 2. Validate and Sanitize All Input

```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .substring(0, 200); // Limit length
}

function processUserInput(rawInput) {
  const sanitized = sanitizeInput(rawInput);
  
  if (sanitized.length === 0) {
    throw new ValidationError('Input cannot be empty');
  }
  
  return sanitized;
}
```

#### 3. Use HTTPS for All Requests

```javascript
// Check if connection is secure
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.warn('Insecure connection detected!');
  // Redirect to HTTPS
  location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

// Always use HTTPS URLs for API calls
const API_URL = 'https://api.example.com'; // Not http://
```

#### 4. Implement Content Security Policy (CSP)

```javascript
// Server should set CSP headers, but you can also use meta tags
// Example meta tag in HTML:
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://trusted-cdn.com; 
               style-src 'self' 'unsafe-inline';">

// Report CSP violations
window.addEventListener('securitypolicyviolation', (e) => {
  console.error('CSP violation:', {
    violatedDirective: e.violatedDirective,
    blockedURI: e.blockedURI,
    sourceFile: e.sourceFile
  });
  
  // Send to logging service
  fetch('/api/csp-report', {
    method: 'POST',
    body: JSON.stringify({
      violatedDirective: e.violatedDirective,
      blockedURI: e.blockedURI
    })
  });
});
```

#### 5. Rate Limiting (Client-Side)

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    );
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }
}

// Usage: Allow max 5 requests per 60 seconds
const apiLimiter = new RateLimiter(5, 60000);

async function fetchData() {
  if (!apiLimiter.canMakeRequest()) {
    throw new Error('Too many requests. Please wait before trying again.');
  }
  
  return await fetch('/api/data');
}
```

---

## Practical Exercises

### Exercise 1: Refactor Poor Code

Refactor this code following clean code principles:

```javascript
// Before
function f(x) {
  let t = 0;
  for (let i = 0; i < x.length; i++) {
    t = t + x[i];
  }
  return t / x.length;
}

const r = f([1, 2, 3, 4, 5]);
console.log(r);
```

**Solution:**

```javascript
// After
function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Input must be a non-empty array of numbers');
  }
  
  const sum = numbers.reduce((total, number) => total + number, 0);
  return sum / numbers.length;
}

const testScores = [1, 2, 3, 4, 5];
const averageScore = calculateAverage(testScores);
console.log(`Average score: ${averageScore}`);
```

### Exercise 2: Implement Secure Form Handling

Create a secure form handler that prevents XSS and validates input:

```javascript
class SecureFormHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.csrfToken = this.getCSRFToken();
    this.initializeEventListeners();
  }
  
  getCSRFToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.content : null;
  }
  
  sanitizeInput(input) {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
  }
  
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
  }
  
  validatePassword(password) {
    if (password.length < 8) {
      throw new ValidationError(
        'Password must be at least 8 characters', 
        'password'
      );
    }
  }
  
  initializeEventListeners() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }
  
  async handleSubmit() {
    try {
      const formData = new FormData(this.form);
      const email = formData.get('email');
      const password = formData.get('password');
      
      // Validate
      this.validateEmail(email);
      this.validatePassword(password);
      
      // Sanitize
      const sanitizedData = {
        email: this.sanitizeInput(email),
        password: password // Never sanitize passwords, just validate
      };
      
      // Submit with CSRF token
      await this.submitForm(sanitizedData);
      
      alert('Form submitted successfully!');
    } catch (error) {
      ErrorHandler.handle(error);
    }
  }
  
  async submitForm(data) {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken
      },
      credentials: 'same-origin',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
  new SecureFormHandler('loginForm');
});
```

### Exercise 3: Error Handling Wrapper

Create a utility that wraps async functions with error handling:

```javascript
function withErrorHandling(asyncFn, errorHandler) {
  return async function(...args) {
    try {
      return await asyncFn(...args);
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        console.error('Unhandled error:', error);
      }
      throw error;
    }
  };
}

// Usage
const fetchUserData = withErrorHandling(
  async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user ${userId}`);
    }
    return await response.json();
  },
  (error) => {
    console.error('Custom error handler:', error.message);
    alert('Failed to load user data. Please try again.');
  }
);

// Use it
fetchUserData(123)
  .then(user => console.log('User:', user))
  .catch(() => console.log('Error was already handled'));
```

---

## Summary

### Key Takeaways

1. **Clean Code**: Write code for humans first, computers second. Prioritize readability and maintainability.

2. **DRY**: Eliminate duplication by abstracting common patterns into reusable functions.

3. **KISS**: Choose simple solutions. Complex code is harder to understand, test, and maintain.

4. **YAGNI**: Only implement features when you actually need them, not when you think you might need them.

5. **Comments**: Use comments to explain why, not what. Let code be self-documenting through good naming.

6. **Naming**: Use clear, descriptive names that reveal intent. Follow language conventions.

7. **Error Handling**: Always handle errors gracefully. Provide meaningful error messages and clean up resources.

8. **Security**: Always validate and sanitize user input. Protect against XSS and CSRF attacks. Never trust client-side data.

---

## Additional Resources

### Recommended Reading

- "Clean Code" by Robert C. Martin
- "The Pragmatic Programmer" by Andy Hunt and Dave Thomas
- MDN Web Security Guidelines
- OWASP Top 10 Security Risks

### Tools for Code Quality

- **ESLint**: Linting and code quality checks
- **Prettier**: Code formatting
- **SonarQube**: Code quality and security analysis
- **Husky**: Git hooks for pre-commit checks

### Security Testing Tools

- **OWASP ZAP**: Security testing tool
- **Snyk**: Vulnerability scanning
- **npm audit**: Check for vulnerable dependencies

---

## Week 26 Checklist

- [ ] Understand and apply DRY principle in your code
- [ ] Refactor complex functions into smaller, single-purpose functions
- [ ] Remove unnecessary comments and improve code self-documentation
- [ ] Implement consistent naming conventions across your project
- [ ] Add proper error handling to all async operations
- [ ] Sanitize all user inputs to prevent XSS
- [ ] Implement CSRF protection in forms
- [ ] Review your code for security vulnerabilities
- [ ] Set up ESLint and Prettier in your project
- [ ] Write JSDoc comments for public APIs
- [ ] Create custom error classes for your application
- [ ] Implement input validation for all user-facing features

---

## Practice Projects

### Project 1: Code Review Tool

Build a simple tool that analyzes JavaScript code and flags potential issues:

- Long functions (>20 lines)
- Magic numbers
- Missing error handling
- Potential XSS vulnerabilities

### Project 2: Secure Blog Platform

Create a blog with proper security measures:

- User authentication with secure password handling
- XSS protection for blog content
- CSRF tokens for forms
- Input validation and sanitization
- Rate limiting for API endpoints

### Project 3: Refactoring Challenge

Take an existing project and:

- Apply DRY principle to eliminate duplication
- Break down large functions
- Improve naming conventions
- Add comprehensive error handling
- Document complex logic

---

## Common Pitfalls to Avoid

### 1. Over-commenting

```javascript
// Bad: Commenting every line
// Create a new user object
const user = {
  // Set the name property
  name: 'John',
  // Set the age property
  age: 30
};

// Good: Let code speak for itself
const user = {
  name: 'John',
  age: 30
};
```

### 2. Ignoring Error Cases

```javascript
// Bad: Only handling happy path
function divide(a, b) {
  return a / b; // What if b is 0?
}

// Good: Handle edge cases
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a / b;
}
```

### 3. Premature Optimization

```javascript
// Bad: Optimizing before measuring
function findUser(users, id) {
  // Creating a hash map for O(1) lookup, but users array is always small
  const userMap = new Map(users.map(u => [u.id, u]));
  return userMap.get(id);
}

// Good: Keep it simple first
function findUser(users, id) {
  return users.find(user => user.id === id);
}
// Optimize later if profiling shows this is a bottleneck
```

### 4. Not Validating User Input

```javascript
// Bad: Trusting user input
function updateUserAge(userId, age) {
  return database.update('users', userId, { age });
}

// Good: Validate everything
function updateUserAge(userId, age) {
  if (!userId || typeof userId !== 'string') {
    throw new ValidationError('Invalid user ID');
  }
  
  const parsedAge = parseInt(age, 10);
  if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 150) {
    throw new ValidationError('Age must be between 0 and 150');
  }
  
  return database.update('users', userId, { age: parsedAge });
}
```

### 5. Inconsistent Error Handling

```javascript
// Bad: Mixing error handling styles
function processData(data) {
  if (!data) return null; // Returns null
  if (data.invalid) throw new Error('Invalid'); // Throws error
  if (data.empty) return { error: 'Empty' }; // Returns error object
}

// Good: Consistent error handling
function processData(data) {
  if (!data) {
    throw new ValidationError('Data is required');
  }
  if (data.invalid) {
    throw new ValidationError('Data is invalid');
  }
  if (data.empty) {
    throw new ValidationError('Data is empty');
  }
  
  return processedData;
}
```

---

## Real-World Example: E-commerce Cart

Here's a complete example incorporating all best practices:

```javascript
// constants.js
const CART_LIMITS = {
  MAX_QUANTITY: 99,
  MAX_ITEMS: 50
};

const ERROR_MESSAGES = {
  INVALID_ITEM: 'Item data is invalid',
  QUANTITY_EXCEEDED: `Maximum quantity per item is ${CART_LIMITS.MAX_QUANTITY}`,
  CART_FULL: `Maximum ${CART_LIMITS.MAX_ITEMS} items allowed in cart`,
  ITEM_NOT_FOUND: 'Item not found in cart'
};

// errors.js
class CartError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'CartError';
    this.code = code;
  }
}

// validators.js
const validators = {
  /**
   * Validates cart item structure
   * @param {Object} item - Item to validate
   * @throws {CartError} If item is invalid
   */
  validateItem(item) {
    if (!item || typeof item !== 'object') {
      throw new CartError(ERROR_MESSAGES.INVALID_ITEM, 'INVALID_ITEM');
    }
    
    const requiredFields = ['id', 'name', 'price', 'quantity'];
    for (const field of requiredFields) {
      if (!(field in item)) {
        throw new CartError(
          `Missing required field: ${field}`,
          'MISSING_FIELD'
        );
      }
    }
    
    if (typeof item.price !== 'number' || item.price < 0) {
      throw new CartError('Price must be a positive number', 'INVALID_PRICE');
    }
    
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new CartError(
        'Quantity must be a positive integer',
        'INVALID_QUANTITY'
      );
    }
    
    if (item.quantity > CART_LIMITS.MAX_QUANTITY) {
      throw new CartError(
        ERROR_MESSAGES.QUANTITY_EXCEEDED,
        'QUANTITY_EXCEEDED'
      );
    }
  },
  
  /**
   * Validates cart size limit
   * @param {Array} cart - Current cart items
   * @throws {CartError} If cart is full
   */
  validateCartSize(cart) {
    if (cart.length >= CART_LIMITS.MAX_ITEMS) {
      throw new CartError(ERROR_MESSAGES.CART_FULL, 'CART_FULL');
    }
  }
};

// cart.js
class ShoppingCart {
  constructor() {
    this.items = [];
    this.discountCode = null;
  }
  
  /**
   * Adds an item to the cart
   * @param {Object} item - Item to add
   * @returns {Object} Updated cart state
   */
  addItem(item) {
    try {
      validators.validateItem(item);
      
      const existingItem = this.findItemById(item.id);
      
      if (existingItem) {
        return this.updateItemQuantity(
          item.id,
          existingItem.quantity + item.quantity
        );
      }
      
      validators.validateCartSize(this.items);
      this.items.push({ ...item });
      
      return this.getCartState();
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  }
  
  /**
   * Removes an item from the cart
   * @param {string} itemId - ID of item to remove
   * @returns {Object} Updated cart state
   */
  removeItem(itemId) {
    const itemIndex = this.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new CartError(ERROR_MESSAGES.ITEM_NOT_FOUND, 'ITEM_NOT_FOUND');
    }
    
    this.items.splice(itemIndex, 1);
    return this.getCartState();
  }
  
  /**
   * Updates quantity of an item
   * @param {string} itemId - ID of item to update
   * @param {number} newQuantity - New quantity value
   * @returns {Object} Updated cart state
   */
  updateItemQuantity(itemId, newQuantity) {
    const item = this.findItemById(itemId);
    
    if (!item) {
      throw new CartError(ERROR_MESSAGES.ITEM_NOT_FOUND, 'ITEM_NOT_FOUND');
    }
    
    if (newQuantity < 1) {
      return this.removeItem(itemId);
    }
    
    if (newQuantity > CART_LIMITS.MAX_QUANTITY) {
      throw new CartError(
        ERROR_MESSAGES.QUANTITY_EXCEEDED,
        'QUANTITY_EXCEEDED'
      );
    }
    
    item.quantity = newQuantity;
    return this.getCartState();
  }
  
  /**
   * Calculates total price of cart
   * @returns {number} Total price in cents
   */
  calculateTotal() {
    const subtotal = this.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
    
    const discount = this.calculateDiscount(subtotal);
    return subtotal - discount;
  }
  
  /**
   * Applies discount code
   * @param {string} code - Discount code to apply
   */
  applyDiscount(code) {
    // In real application, validate against database
    const validCodes = {
      'SAVE10': 0.10,
      'SAVE20': 0.20
    };
    
    if (validCodes[code]) {
      this.discountCode = code;
    } else {
      throw new CartError('Invalid discount code', 'INVALID_DISCOUNT');
    }
  }
  
  /**
   * Calculates discount amount
   * @private
   * @param {number} subtotal - Subtotal before discount
   * @returns {number} Discount amount
   */
  calculateDiscount(subtotal) {
    if (!this.discountCode) return 0;
    
    const discountRates = {
      'SAVE10': 0.10,
      'SAVE20': 0.20
    };
    
    const rate = discountRates[this.discountCode] || 0;
    return subtotal * rate;
  }
  
  /**
   * Finds item by ID
   * @private
   * @param {string} itemId - Item ID to find
   * @returns {Object|undefined} Found item or undefined
   */
  findItemById(itemId) {
    return this.items.find(item => item.id === itemId);
  }
  
  /**
   * Gets current cart state
   * @returns {Object} Cart state with items and total
   */
  getCartState() {
    return {
      items: [...this.items],
      itemCount: this.items.reduce((count, item) => count + item.quantity, 0),
      total: this.calculateTotal()
    };
  }
  
  /**
   * Clears all items from cart
   */
  clear() {
    this.items = [];
    this.discountCode = null;
  }
}

// Usage example
try {
  const cart = new ShoppingCart();
  
  // Add items
  cart.addItem({
    id: 'prod-1',
    name: 'JavaScript Book',
    price: 2999, // Price in cents
    quantity: 1
  });
  
  cart.addItem({
    id: 'prod-2',
    name: 'Coding Mug',
    price: 1499,
    quantity: 2
  });
  
  // Apply discount
  cart.applyDiscount('SAVE10');
  
  // Get cart state
  const state = cart.getCartState();
  console.log(`Total items: ${state.itemCount}`);
  console.log(`Total price: ${(state.total / 100).toFixed(2)}`);
  
} catch (error) {
  if (error instanceof CartError) {
    console.error(`Cart Error [${error.code}]:`, error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

## Conclusion

Writing clean, secure, and maintainable JavaScript code is a continuous learning process. The principles covered in this week's tutorial will serve as a foundation for professional development. Remember:

- **Code is read more often than it's written** - optimize for readability
- **Security is not optional** - always validate and sanitize
- **Errors will happen** - handle them gracefully
- **Consistency matters** - follow conventions
- **Simple is better than clever** - write code others can understand

Keep practicing these principles, and they'll become second nature. Review your code regularly, refactor when necessary, and always be open to learning better approaches.

Happy coding! 🚀
