# Week 25: Testing Basics

## Table of Contents

1. [Why Testing Matters](#why-testing-matters)
2. [Unit Testing Concepts](#unit-testing-concepts)
3. [Jest Basics](#jest-basics)
4. [Writing Test Cases](#writing-test-cases)
5. [Assertions](#assertions)
6. [Mocking](#mocking)
7. [Code Coverage](#code-coverage)
8. [Practice Projects](#practice-projects)

---

## Why Testing Matters

### The Cost of Bugs

Software bugs are expensive. The later a bug is discovered in the development lifecycle, the more costly it becomes to fix. Testing helps catch bugs early when they're cheapest to address.

**Real-world impact:**

- A bug found during development: minutes to fix
- A bug found in production: hours or days to fix, potential data loss, angry users
- A critical bug in production: can cost companies millions

### Benefits of Automated Testing

**Confidence in Changes**
When you have comprehensive tests, you can refactor code or add features knowing that if something breaks, your tests will catch it.

**Living Documentation**
Well-written tests serve as documentation showing how your code is intended to be used.

**Faster Development**
While writing tests takes time upfront, it saves time in the long run by reducing debugging sessions and preventing regressions.

**Better Design**
Writing testable code often leads to better software design with clearer separation of concerns and more modular functions.

### Types of Testing

**Unit Testing**
Testing individual functions or components in isolation. Fast and focused.

**Integration Testing**
Testing how different parts of your application work together.

**End-to-End Testing**
Testing complete user workflows from start to finish, simulating real user interactions.

**This week focuses on unit testing with Jest.**

---

## Unit Testing Concepts

### What is a Unit Test?

A unit test verifies that a single "unit" of code (typically a function) works as expected. Each test should be:

- **Independent**: Tests shouldn't depend on each other
- **Isolated**: Test one thing at a time
- **Fast**: Should run in milliseconds
- **Repeatable**: Same input always produces same output
- **Self-validating**: Test clearly passes or fails

### The AAA Pattern

Most unit tests follow the Arrange-Act-Assert pattern:

```javascript
test('adds two numbers correctly', () => {
  // Arrange: Set up test data
  const a = 5;
  const b = 3;
  
  // Act: Execute the function being tested
  const result = add(a, b);
  
  // Assert: Verify the result
  expect(result).toBe(8);
});
```

### Test-Driven Development (TDD)

TDD is a development approach where you write tests before writing code:

1. **Red**: Write a failing test
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

Example workflow:

```javascript
// Step 1: Write a failing test
test('multiply should return product of two numbers', () => {
  expect(multiply(4, 5)).toBe(20);
});

// Step 2: Write minimal code to pass
function multiply(a, b) {
  return a * b;
}

// Step 3: Refactor if needed (already simple in this case)
```

---

## Jest Basics

### What is Jest?

Jest is a comprehensive JavaScript testing framework created by Facebook. It comes with everything you need: test runner, assertion library, mocking, and coverage reporting.

### Setting Up Jest

**Installation:**

```bash
npm install --save-dev jest
```

**Package.json configuration:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Optional jest.config.js:**

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ]
};
```

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npm test -- calculator.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="add"
```

### File Organization

Jest looks for test files with these patterns:

- Files in `__tests__` folders
- Files with `.test.js` suffix
- Files with `.spec.js` suffix

**Recommended structure:**

```js

src/
  calculator.js
  calculator.test.js
  utils/
    string.js
    string.test.js
```

---

## Writing Test Cases

### Basic Test Structure

```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

```javascript
// math.test.js
import { add, subtract } from './math';

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('subtracts 5 - 2 to equal 3', () => {
  expect(subtract(5, 2)).toBe(3);
});
```

### Grouping Tests with describe()

Use `describe()` to organize related tests:

```javascript
describe('Calculator operations', () => {
  describe('addition', () => {
    test('adds positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('adds negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    test('adds mixed sign numbers', () => {
      expect(add(-2, 3)).toBe(1);
    });
  });

  describe('subtraction', () => {
    test('subtracts positive numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    test('subtracts negative numbers', () => {
      expect(subtract(-5, -3)).toBe(-2);
    });
  });
});
```

### Setup and Teardown

Use hooks to run code before or after tests:

```javascript
describe('Database operations', () => {
  let db;

  // Runs once before all tests in this describe block
  beforeAll(() => {
    db = new Database();
  });

  // Runs before each test
  beforeEach(() => {
    db.clear();
  });

  // Runs after each test
  afterEach(() => {
    db.resetConnection();
  });

  // Runs once after all tests
  afterAll(() => {
    db.close();
  });

  test('can insert data', () => {
    db.insert({ name: 'Alice' });
    expect(db.count()).toBe(1);
  });

  test('can delete data', () => {
    db.insert({ name: 'Bob' });
    db.delete('Bob');
    expect(db.count()).toBe(0);
  });
});
```

### Test Aliases

Jest provides aliases for readability:

```javascript
// These are identical
test('does something', () => {});
it('does something', () => {});

// These are identical
test.skip('skips this test', () => {});
it.skip('skips this test', () => {});
xit('skips this test', () => {});

// These are identical
test.only('runs only this test', () => {});
it.only('runs only this test', () => {});
fit('runs only this test', () => {});
```

---

## Assertions

### Common Matchers

**Equality matchers:**

```javascript
test('equality matchers', () => {
  // Strict equality (===)
  expect(2 + 2).toBe(4);
  expect('hello').toBe('hello');
  
  // Deep equality for objects/arrays
  expect({ name: 'Alice' }).toEqual({ name: 'Alice' });
  expect([1, 2, 3]).toEqual([1, 2, 3]);
  
  // Not equal
  expect(5).not.toBe(3);
});
```

**Truthiness matchers:**

```javascript
test('truthiness', () => {
  expect(true).toBeTruthy();
  expect(false).toBeFalsy();
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();
  expect('hello').toBeDefined();
});
```

**Number matchers:**

```javascript
test('numbers', () => {
  expect(2 + 2).toBe(4);
  expect(2 + 2).toBeGreaterThan(3);
  expect(2 + 2).toBeGreaterThanOrEqual(4);
  expect(2 + 2).toBeLessThan(5);
  expect(2 + 2).toBeLessThanOrEqual(4);
  
  // Floating point equality
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});
```

**String matchers:**

```javascript
test('strings', () => {
  expect('JavaScript').toMatch(/Script/);
  expect('hello world').toContain('world');
  expect('hello').toHaveLength(5);
});
```

**Array and iterable matchers:**

```javascript
test('arrays', () => {
  const fruits = ['apple', 'banana', 'orange'];
  
  expect(fruits).toContain('banana');
  expect(fruits).toHaveLength(3);
  expect(fruits).toEqual(expect.arrayContaining(['apple', 'orange']));
});
```

**Object matchers:**

```javascript
test('objects', () => {
  const user = {
    name: 'Alice',
    age: 30,
    email: 'alice@example.com'
  };
  
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('age', 30);
  expect(user).toMatchObject({ name: 'Alice' });
  
  expect(user).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      age: expect.any(Number)
    })
  );
});
```

**Exception matchers:**

```javascript
test('exceptions', () => {
  function throwError() {
    throw new Error('Something went wrong');
  }
  
  expect(() => throwError()).toThrow();
  expect(() => throwError()).toThrow(Error);
  expect(() => throwError()).toThrow('Something went wrong');
  expect(() => throwError()).toThrow(/wrong/);
});
```

### Asymmetric Matchers

These are useful when you don't know the exact value:

```javascript
test('asymmetric matchers', () => {
  expect({ id: 123, created: new Date() }).toEqual({
    id: expect.any(Number),
    created: expect.any(Date)
  });
  
  expect('hello world').toEqual(expect.stringContaining('world'));
  expect('hello world').toEqual(expect.stringMatching(/world/));
  
  expect([1, 2, 3, 4]).toEqual(expect.arrayContaining([2, 3]));
});
```

### Custom Matchers

You can create your own matchers:

```javascript
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      };
    }
  }
});

test('custom matcher', () => {
  expect(15).toBeWithinRange(10, 20);
  expect(5).not.toBeWithinRange(10, 20);
});
```

---

## Mocking

### Why Mock?

Mocking allows you to replace real dependencies with fake ones to:

- Isolate the code you're testing
- Avoid slow operations (API calls, database queries)
- Test edge cases that are hard to reproduce
- Control the test environment

### Mock Functions

**Creating mock functions:**

```javascript
test('mock function basics', () => {
  const mockFn = jest.fn();
  
  mockFn('hello');
  mockFn('world');
  
  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledTimes(2);
  expect(mockFn).toHaveBeenCalledWith('hello');
  expect(mockFn).toHaveBeenLastCalledWith('world');
});
```

**Mock return values:**

```javascript
test('mock return values', () => {
  const mockFn = jest.fn();
  
  mockFn.mockReturnValue(42);
  expect(mockFn()).toBe(42);
  
  mockFn.mockReturnValueOnce(1)
        .mockReturnValueOnce(2)
        .mockReturnValue(3);
  
  expect(mockFn()).toBe(1);
  expect(mockFn()).toBe(2);
  expect(mockFn()).toBe(3);
  expect(mockFn()).toBe(3);
});
```

**Mock implementations:**

```javascript
test('mock implementation', () => {
  const mockFn = jest.fn(x => x * 2);
  
  expect(mockFn(5)).toBe(10);
  expect(mockFn).toHaveBeenCalledWith(5);
});
```

### Mocking Modules

**Automatic mocking:**

```javascript
// api.js
export function fetchUser(id) {
  return fetch(`/api/users/${id}`).then(res => res.json());
}

// user.test.js
import { fetchUser } from './api';

jest.mock('./api');

test('mock entire module', () => {
  fetchUser.mockResolvedValue({ id: 1, name: 'Alice' });
  
  return fetchUser(1).then(user => {
    expect(user.name).toBe('Alice');
  });
});
```

**Manual mocks:**

Create a `__mocks__` folder next to the module:

```javascript
// __mocks__/api.js
export const fetchUser = jest.fn();
export const createUser = jest.fn();
```

```javascript
// user.test.js
import { fetchUser } from './api';

jest.mock('./api');

test('uses manual mock', () => {
  fetchUser.mockResolvedValue({ id: 1, name: 'Bob' });
  // Test code here
});
```

### Spying on Methods

**Spy on object methods:**

```javascript
test('spy on methods', () => {
  const calculator = {
    add: (a, b) => a + b
  };
  
  const spy = jest.spyOn(calculator, 'add');
  
  calculator.add(2, 3);
  
  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(2, 3);
  
  spy.mockRestore(); // Restore original implementation
});
```

### Mocking Timers

**Control time in tests:**

```javascript
function delayedGreeting(callback) {
  setTimeout(() => {
    callback('Hello!');
  }, 1000);
}

test('mock timers', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  
  delayedGreeting(callback);
  
  expect(callback).not.toHaveBeenCalled();
  
  jest.runAllTimers();
  
  expect(callback).toHaveBeenCalledWith('Hello!');
  
  jest.useRealTimers();
});
```

### Async Testing with Mocks

```javascript
// userService.js
export async function getUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

// userService.test.js
import { getUserData } from './userService';

global.fetch = jest.fn();

test('fetches user data', async () => {
  fetch.mockResolvedValue({
    json: async () => ({ id: 1, name: 'Alice' })
  });
  
  const user = await getUserData(1);
  
  expect(user.name).toBe('Alice');
  expect(fetch).toHaveBeenCalledWith('/api/users/1');
});
```

---

## Code Coverage

### What is Code Coverage?

Code coverage measures how much of your code is executed during tests. It tracks:

- **Line coverage**: Which lines were executed
- **Branch coverage**: Which if/else paths were taken
- **Function coverage**: Which functions were called
- **Statement coverage**: Which statements were executed

### Running Coverage Reports

```bash
npm run test:coverage
```

**Output example:**

```text
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.71 |    66.67 |     100 |   85.71 |
 calculator.js      |   85.71 |    66.67 |     100 |   85.71 |
--------------------|---------|----------|---------|---------|
```

### Interpreting Coverage

**Good coverage example:**

```javascript
// calculator.js
export function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// calculator.test.js - 100% coverage
test('divides numbers', () => {
  expect(divide(10, 2)).toBe(5);
});

test('throws error when dividing by zero', () => {
  expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
});
```

**Poor coverage example:**

```javascript
// calculator.test.js - Only 50% branch coverage
test('divides numbers', () => {
  expect(divide(10, 2)).toBe(5);
});
// Missing: test for division by zero
```

### Coverage Thresholds

Set minimum coverage requirements:

```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### What to Aim For

- **80-90% coverage** is a good target for most projects
- **100% coverage doesn't guarantee bug-free code**
- Focus on testing critical paths and edge cases
- Don't write tests just to increase coverage numbers

### Coverage Reports

Jest generates an HTML report in the `coverage` folder. Open `coverage/lcov-report/index.html` in a browser to see:

- Which lines are covered (green) vs uncovered (red)
- Branch coverage visualization
- Drill down into individual files

---

## Practice Projects

### Project 1: String Utilities Library

Create a library of string manipulation functions with comprehensive tests.

**Functions to implement:**

```javascript
// stringUtils.js

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function reverseString(str) {
  return str.split('').reverse().join('');
}

export function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

export function countWords(str) {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
```

**Your test file should include:**

```javascript
// stringUtils.test.js

describe('String Utilities', () => {
  describe('capitalize', () => {
    test('capitalizes first letter of lowercase word', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    test('handles already capitalized words', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    test('handles empty strings', () => {
      expect(capitalize('')).toBe('');
    });

    test('handles all caps', () => {
      expect(capitalize('HELLO')).toBe('Hello');
    });
  });

  describe('reverseString', () => {
    // Add tests here
  });

  describe('isPalindrome', () => {
    // Add tests here
  });

  describe('countWords', () => {
    // Add tests here
  });

  describe('truncate', () => {
    // Add tests here
  });
});
```

**Coverage goal:** 100%

---

### Project 2: Shopping Cart

Build a shopping cart class with full test coverage.

**Implementation:**

```javascript
// ShoppingCart.js

export class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.product.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.items = [];
  }

  applyDiscount(percentage) {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Discount must be between 0 and 100');
    }
    return this.getTotal() * (1 - percentage / 100);
  }
}
```

**Test requirements:**

```javascript
// ShoppingCart.test.js

describe('ShoppingCart', () => {
  let cart;
  let product1, product2;

  beforeEach(() => {
    cart = new ShoppingCart();
    product1 = { id: 1, name: 'Apple', price: 1.5 };
    product2 = { id: 2, name: 'Banana', price: 0.75 };
  });

  describe('addItem', () => {
    test('adds a new item to the cart', () => {
      cart.addItem(product1, 2);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toEqual({ product: product1, quantity: 2 });
    });

    test('increases quantity if item already exists', () => {
      cart.addItem(product1, 2);
      cart.addItem(product1, 3);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(5);
    });

    // Add more tests
  });

  describe('removeItem', () => {
    // Add tests
  });

  describe('updateQuantity', () => {
    // Add tests
  });

  describe('getTotal', () => {
    // Add tests
  });

  describe('applyDiscount', () => {
    test('throws error for invalid discount percentage', () => {
      expect(() => cart.applyDiscount(-10)).toThrow();
      expect(() => cart.applyDiscount(150)).toThrow();
    });
    // Add more tests
  });
});
```

**Coverage goal:** 100%

---

### Project 3: Todo List with API Mocking

Create a todo list manager that fetches from an API, with mocked HTTP requests.

**Implementation:**

```javascript
// todoService.js

export class TodoService {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.todos = [];
  }

  async fetchTodos() {
    const response = await this.apiClient.get('/todos');
    this.todos = response.data;
    return this.todos;
  }

  async addTodo(text) {
    const newTodo = {
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const response = await this.apiClient.post('/todos', newTodo);
    this.todos.push(response.data);
    return response.data;
  }

  async toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    const updated = { ...todo, completed: !todo.completed };
    const response = await this.apiClient.put(`/todos/${id}`, updated);
    
    const index = this.todos.findIndex(t => t.id === id);
    this.todos[index] = response.data;
    
    return response.data;
  }

  async deleteTodo(id) {
    await this.apiClient.delete(`/todos/${id}`);
    this.todos = this.todos.filter(t => t.id !== id);
  }

  getCompletedTodos() {
    return this.todos.filter(t => t.completed);
  }

  getPendingTodos() {
    return this.todos.filter(t => !t.completed);
  }
}
```

**Test with mocks:**

```javascript
// todoService.test.js

import { TodoService } from './todoService';

describe('TodoService', () => {
  let service;
  let mockApiClient;

  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    
    service = new TodoService(mockApiClient);
  });

  describe('fetchTodos', () => {
    test('fetches todos from API', async () => {
      const mockTodos = [
        { id: 1, text: 'Buy milk', completed: false },
        { id: 2, text: 'Walk dog', completed: true }
      ];

      mockApiClient.get.mockResolvedValue({ data: mockTodos });

      const todos = await service.fetchTodos();

      expect(mockApiClient.get).toHaveBeenCalledWith('/todos');
      expect(todos).toEqual(mockTodos);
      expect(service.todos).toEqual(mockTodos);
    });
  });

  describe('addTodo', () => {
    test('adds a new todo', async () => {
      const newTodo = { 
        id: 1, 
        text: 'New task', 
        completed: false,
        createdAt: expect.any(String)
      };

      mockApiClient.post.mockResolvedValue({ data: newTodo });

      const result = await service.addTodo('New task');

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/todos',
        expect.objectContaining({ text: 'New task', completed: false })
      );
      expect(result).toEqual(newTodo);
    });
  });

  // Add more tests for toggleTodo, deleteTodo, etc.
});
```

**Coverage goal:** 90%

---

## Summary and Best Practices

### Key Takeaways

1. **Write tests early** - Don't wait until the end
2. **Test behavior, not implementation** - Tests should verify what the code does, not how it does it
3. **Keep tests simple** - Each test should verify one thing
4. **Use descriptive test names** - Test names should clearly state what they're testing
5. **Avoid test interdependence** - Each test should be able to run independently
6. **Mock external dependencies** - Isolate the code you're testing
7. **Aim for meaningful coverage** - Focus on critical paths, not just numbers

### Common Pitfalls to Avoid

- Testing implementation details instead of behavior
- Writing tests that are too complex
- Not testing edge cases and error conditions
- Forgetting to clean up after tests
- Mocking too much (makes tests brittle)
- Ignoring test maintenance (tests need refactoring too)

### Next Steps

1. Complete all three practice projects with 80%+ coverage
2. Practice TDD: write tests first, then implementation
3. Learn integration testing with tools like Supertest
4. Explore E2E testing with Cypress or Playwright
5. Study testing best practices and patterns

### Additional Resources

- Jest Documentation: [Jest Documentation](https://jestjs.io/)
- Testing JavaScript: [Testing JavaScript](https://testingjavascript.com/)
- Kent C. Dodds Testing Blog: [Kent C. Dodds Testing Blog](https://kentcdodds.com/blog)

---

## Practice Exercises

1. **Implement and test** a `Calculator` class with methods for basic math operations
2. **Write tests first** for a `User` class using TDD approach
3. **Refactor existing code** to make it more testable
4. **Achieve 100% coverage** on a module of your choice
5. **Create mock API responses** for a weather service

Happy testing! Remember: good tests are an investment in code quality and developer productivity. 🚀
