# Week 21: Functional Programming in Practice

## Overview

This week, we'll dive deep into practical functional programming (FP) techniques in JavaScript. You'll master array methods, learn to avoid mutations, work with immutable data patterns, and explore functional utility libraries.

## Table of Contents

1. [Array Methods Deep Dive](#array-methods-deep-dive)
2. [Avoiding Mutations](#avoiding-mutations)
3. [Immutable Data Updates](#immutable-data-updates)
4. [Functional Utility Libraries](#functional-utility-libraries)
5. [Practice Exercises](#practice-exercises)

---

## Array Methods Deep Dive

### map() - Transforming Arrays

The `map()` method creates a new array by applying a function to each element.

```javascript
// Basic mapping
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Mapping objects
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 }
];

const names = users.map(user => user.name);
console.log(names); // ['Alice', 'Bob']

// Complex transformations
const enrichedUsers = users.map(user => ({
  ...user,
  isAdult: user.age >= 18,
  displayName: user.name.toUpperCase()
}));
```

**Key Points:**
- Always returns a new array of the same length
- Doesn't modify the original array
- Can return any type of value

### filter() - Selecting Elements

The `filter()` method creates a new array with elements that pass a test.

```javascript
// Basic filtering
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]

// Filtering objects
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 17, active: false },
  { name: 'Charlie', age: 30, active: true }
];

const activeAdults = users.filter(user => 
  user.age >= 18 && user.active
);

// Removing falsy values
const mixed = [0, 1, false, 2, '', 3, null, undefined, 4];
const truthyValues = mixed.filter(Boolean);
console.log(truthyValues); // [1, 2, 3, 4]
```

**Key Points:**
- Returns a new array (can be shorter than original)
- Doesn't modify the original array
- Predicate function should return true/false

### reduce() - Aggregating Data

The `reduce()` method executes a reducer function on each element, resulting in a single output value.

```javascript
// Basic reduction - sum
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// Finding max value
const max = numbers.reduce((acc, num) => 
  num > acc ? num : acc
, -Infinity);

// Counting occurrences
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count); // { apple: 3, banana: 2, orange: 1 }

// Grouping by property
const people = [
  { name: 'Alice', department: 'Engineering' },
  { name: 'Bob', department: 'Sales' },
  { name: 'Charlie', department: 'Engineering' }
];

const byDepartment = people.reduce((acc, person) => {
  const dept = person.department;
  if (!acc[dept]) acc[dept] = [];
  acc[dept].push(person);
  return acc;
}, {});

// Flattening arrays
const nested = [[1, 2], [3, 4], [5, 6]];
const flattened = nested.reduce((acc, arr) => 
  acc.concat(arr), []
);
console.log(flattened); // [1, 2, 3, 4, 5, 6]

// Building a pipeline
const pipeline = [
  arr => arr.filter(n => n > 0),
  arr => arr.map(n => n * 2),
  arr => arr.reduce((sum, n) => sum + n, 0)
];

const result = pipeline.reduce(
  (data, fn) => fn(data),
  [-1, 2, -3, 4, 5]
);
console.log(result); // 22
```

**Key Points:**
- Most powerful array method
- Can implement any array operation
- Initial value is crucial (second argument)
- Accumulator can be any type

### Chaining Methods

Combining array methods for complex transformations:

```javascript
const orders = [
  { id: 1, item: 'Book', price: 15, quantity: 2 },
  { id: 2, item: 'Pen', price: 2, quantity: 10 },
  { id: 3, item: 'Book', price: 15, quantity: 1 },
  { id: 4, item: 'Notebook', price: 5, quantity: 3 }
];

// Calculate total revenue from book sales
const bookRevenue = orders
  .filter(order => order.item === 'Book')
  .map(order => order.price * order.quantity)
  .reduce((total, amount) => total + amount, 0);

console.log(bookRevenue); // 45

// Get unique items sorted by total revenue
const itemRevenue = orders
  .reduce((acc, order) => {
    const existing = acc.find(item => item.name === order.item);
    const revenue = order.price * order.quantity;
    
    if (existing) {
      existing.revenue += revenue;
    } else {
      acc.push({ name: order.item, revenue });
    }
    return acc;
  }, [])
  .sort((a, b) => b.revenue - a.revenue)
  .map(item => item.name);

console.log(itemRevenue); // ['Book', 'Notebook', 'Pen']
```

### Advanced Patterns

```javascript
// Transducer pattern (compose transformations)
const compose = (...fns) => x => 
  fns.reduceRight((acc, fn) => fn(acc), x);

const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const transform = compose(square, double, addOne);
console.log(transform(3)); // ((3 + 1) * 2)² = 64

// Map with index and filtering
const data = ['a', 'b', 'c', 'd'];
const indexed = data
  .map((item, i) => ({ item, index: i }))
  .filter(obj => obj.index % 2 === 0);
console.log(indexed); // [{ item: 'a', index: 0 }, { item: 'c', index: 2 }]

// Reducing to boolean (early exit with some/every)
const hasAdult = users.some(user => user.age >= 18);
const allAdults = users.every(user => user.age >= 18);
```

---

## Avoiding Mutations

### Why Avoid Mutations?

Mutations make code harder to reason about, debug, and test. Immutable code is predictable and easier to understand.

```javascript
// BAD: Mutation
const addItem = (cart, item) => {
  cart.push(item); // Mutates the original array
  return cart;
};

// GOOD: No mutation
const addItem = (cart, item) => {
  return [...cart, item]; // Returns new array
};
```

### Common Mutation Pitfalls

```javascript
// Arrays
const original = [1, 2, 3];

// AVOID: These mutate
original.push(4);
original.pop();
original.shift();
original.unshift(0);
original.splice(1, 1);
original.sort();
original.reverse();

// PREFER: These create new arrays
const withNew = [...original, 4];
const withoutLast = original.slice(0, -1);
const withoutFirst = original.slice(1);
const withFirst = [0, ...original];
const withoutIndex = [...original.slice(0, 1), ...original.slice(2)];
const sorted = [...original].sort();
const reversed = [...original].reverse();

// Objects
const user = { name: 'Alice', age: 25 };

// AVOID: Mutation
user.age = 26;
delete user.name;

// PREFER: New objects
const updated = { ...user, age: 26 };
const { name, ...rest } = user; // rest doesn't include name
```

### Pure Functions

A pure function always returns the same output for the same input and has no side effects.

```javascript
// IMPURE: Depends on external state
let tax = 0.1;
const calculateTotal = (price) => {
  return price + (price * tax); // Uses external variable
};

// PURE: All inputs are parameters
const calculateTotal = (price, taxRate) => {
  return price + (price * taxRate);
};

// IMPURE: Modifies external state
let cart = [];
const addToCart = (item) => {
  cart.push(item); // Side effect
};

// PURE: Returns new state
const addToCart = (cart, item) => {
  return [...cart, item];
};

// IMPURE: Random output
const generateId = () => {
  return Math.random().toString(36); // Non-deterministic
};

// PURE: Deterministic
const generateId = (seed) => {
  return `id-${seed}-${Date.now()}`;
};
```

---

## Immutable Data Updates

### Updating Nested Objects

```javascript
const state = {
  user: {
    name: 'Alice',
    address: {
      city: 'New York',
      zip: '10001'
    }
  },
  cart: [
    { id: 1, name: 'Book', quantity: 2 }
  ]
};

// Update nested property
const updatedState = {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'Boston'
    }
  }
};

// Helper function for deep updates
const updateIn = (obj, path, updater) => {
  if (path.length === 0) return updater(obj);
  
  const [key, ...rest] = path;
  return {
    ...obj,
    [key]: updateIn(obj[key], rest, updater)
  };
};

const newState = updateIn(
  state,
  ['user', 'address', 'city'],
  () => 'Boston'
);
```

### Updating Arrays of Objects

```javascript
const todos = [
  { id: 1, text: 'Learn FP', done: false },
  { id: 2, text: 'Build project', done: false },
  { id: 3, text: 'Deploy', done: false }
];

// Update by id
const toggleTodo = (todos, id) => {
  return todos.map(todo =>
    todo.id === id
      ? { ...todo, done: !todo.done }
      : todo
  );
};

// Delete by id
const deleteTodo = (todos, id) => {
  return todos.filter(todo => todo.id !== id);
};

// Add new todo
const addTodo = (todos, text) => {
  const newTodo = {
    id: Math.max(...todos.map(t => t.id), 0) + 1,
    text,
    done: false
  };
  return [...todos, newTodo];
};

// Update multiple properties
const updateTodo = (todos, id, updates) => {
  return todos.map(todo =>
    todo.id === id
      ? { ...todo, ...updates }
      : todo
  );
};
```

### Immutable Patterns Reference

```javascript
// Array operations
const arr = [1, 2, 3, 4, 5];

// Add to end
const append = [...arr, 6];

// Add to beginning
const prepend = [0, ...arr];

// Insert at index
const insertAt = (arr, index, item) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index)
];

// Remove at index
const removeAt = (arr, index) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1)
];

// Replace at index
const replaceAt = (arr, index, item) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index + 1)
];

// Update at index
const updateAt = (arr, index, updater) => [
  ...arr.slice(0, index),
  updater(arr[index]),
  ...arr.slice(index + 1)
];

// Object operations
const obj = { a: 1, b: 2, c: 3 };

// Add/update property
const withProp = { ...obj, d: 4 };

// Remove property
const { c, ...withoutC } = obj;

// Conditional property
const conditional = {
  ...obj,
  ...(condition && { d: 4 })
};

// Merge objects
const merged = { ...obj1, ...obj2 };
```

---

## Functional Utility Libraries

### Lodash/fp

Lodash/fp is a functional programming variant of Lodash with auto-curried, iteratee-first, data-last methods.

```javascript
// Traditional Lodash
import _ from 'lodash';

_.map([1, 2, 3], n => n * 2); // [2, 4, 6]

// Lodash/fp - curried and data-last
import fp from 'lodash/fp';

const double = fp.map(n => n * 2);
double([1, 2, 3]); // [2, 4, 6]

// Composition with fp
const process = fp.flow(
  fp.filter(n => n > 0),
  fp.map(n => n * 2),
  fp.reduce((sum, n) => sum + n, 0)
);

process([-1, 2, 3, -4, 5]); // 20
```

### Common Lodash/fp Functions

```javascript
import fp from 'lodash/fp';

// get - Safe property access
const getName = fp.get('user.name');
getName({ user: { name: 'Alice' } }); // 'Alice'
getName({}); // undefined

// getOr - With default value
const getNameOr = fp.getOr('Guest', 'user.name');
getNameOr({}); // 'Guest'

// pick - Select properties
const getCredentials = fp.pick(['username', 'email']);
getCredentials({
  username: 'alice',
  email: 'alice@example.com',
  password: 'secret'
}); // { username: 'alice', email: 'alice@example.com' }

// omit - Exclude properties
const hidePassword = fp.omit(['password']);

// groupBy - Group array elements
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' }
];

const byRole = fp.groupBy('role');
byRole(users);
// { admin: [...], user: [...] }

// sortBy - Sort array
const sortByAge = fp.sortBy('age');
const sortByMultiple = fp.sortBy(['department', 'age']);

// uniq / uniqBy - Remove duplicates
const unique = fp.uniq([1, 2, 2, 3, 3, 4]);
const uniqueBy = fp.uniqBy('id');

// partition - Split by predicate
const [adults, minors] = fp.partition(
  user => user.age >= 18,
  users
);

// compact - Remove falsy values
fp.compact([0, 1, false, 2, '', 3]); // [1, 2, 3]
```

### Ramda

Ramda is designed specifically for functional programming with automatic currying.

```javascript
import R from 'ramda';

// All functions are curried
const add = R.add(10);
add(5); // 15

// Compose functions (right to left)
const transform = R.compose(
  R.sum,
  R.map(R.multiply(2)),
  R.filter(R.gt(R.__, 0))
);

transform([-1, 2, 3, -4, 5]); // 20

// Pipe (left to right)
const process = R.pipe(
  R.filter(R.gt(R.__, 0)),
  R.map(R.multiply(2)),
  R.sum
);

// Lenses for deep updates
const nameLens = R.lensPath(['user', 'name']);
const state = { user: { name: 'Alice', age: 25 } };

R.view(nameLens, state); // 'Alice'
R.set(nameLens, 'Bob', state); // { user: { name: 'Bob', age: 25 } }
R.over(nameLens, R.toUpper, state); // { user: { name: 'ALICE', age: 25 } }

// Useful Ramda functions
R.prop('name'); // Get property
R.path(['user', 'address', 'city']); // Deep property access
R.assoc('name', 'Bob'); // Set property immutably
R.dissoc('password'); // Remove property
R.evolve({ age: R.inc, name: R.toUpper }); // Transform properties
R.mergeDeepRight(obj1, obj2); // Deep merge
```

### Building Your Own Utils

```javascript
// Curry function
const curry = (fn) => {
  const arity = fn.length;
  
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
};

// Usage
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); // 6
add(1, 2)(3); // 6
add(1)(2, 3); // 6

// Compose (right to left)
const compose = (...fns) => x =>
  fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe (left to right)
const pipe = (...fns) => x =>
  fns.reduce((acc, fn) => fn(acc), x);

// Deep clone
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(deepClone);
  
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = deepClone(obj[key]);
    return acc;
  }, {});
};

// Deep freeze (prevent mutations)
const deepFreeze = (obj) => {
  Object.freeze(obj);
  
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  
  return obj;
};
```

---

## Practice Exercises

### Exercise 1: Data Transformation Pipeline

Transform an array of user data:

```javascript
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28, active: true, orders: 5 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 17, active: false, orders: 2 },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 35, active: true, orders: 15 },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', age: 42, active: true, orders: 8 }
];

// Task: Create a pipeline that:
// 1. Filters for active adult users (age >= 18)
// 2. Maps to a simplified format: { name, email, orderCount }
// 3. Sorts by order count (descending)
// 4. Takes top 2 users

const topActiveUsers = users
  .filter(user => user.active && user.age >= 18)
  .map(user => ({
    name: user.name,
    email: user.email,
    orderCount: user.orders
  }))
  .sort((a, b) => b.orderCount - a.orderCount)
  .slice(0, 2);
```

### Exercise 2: Shopping Cart

Implement immutable shopping cart operations:

```javascript
// Create these functions:

const cart = [
  { id: 1, name: 'Book', price: 15, quantity: 2 },
  { id: 2, name: 'Pen', price: 2, quantity: 5 }
];

// Add item (or increase quantity if exists)
const addItem = (cart, item) => {
  const existing = cart.find(i => i.id === item.id);
  
  if (existing) {
    return cart.map(i =>
      i.id === item.id
        ? { ...i, quantity: i.quantity + item.quantity }
        : i
    );
  }
  
  return [...cart, item];
};

// Remove item
const removeItem = (cart, id) => {
  return cart.filter(item => item.id !== id);
};

// Update quantity
const updateQuantity = (cart, id, quantity) => {
  if (quantity <= 0) {
    return removeItem(cart, id);
  }
  
  return cart.map(item =>
    item.id === id
      ? { ...item, quantity }
      : item
  );
};

// Calculate total
const getTotal = (cart) => {
  return cart.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );
};

// Apply discount
const applyDiscount = (cart, discountRate) => {
  return cart.map(item => ({
    ...item,
    price: item.price * (1 - discountRate)
  }));
};
```

### Exercise 3: Nested State Management

Manage a complex application state immutably:

```javascript
const initialState = {
  user: {
    profile: {
      name: 'Alice',
      email: 'alice@example.com'
    },
    preferences: {
      theme: 'dark',
      notifications: true
    }
  },
  posts: [
    { id: 1, title: 'First Post', likes: 10, comments: [] },
    { id: 2, title: 'Second Post', likes: 5, comments: [] }
  ]
};

// Update user email
const updateEmail = (state, newEmail) => ({
  ...state,
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      email: newEmail
    }
  }
});

// Add comment to post
const addComment = (state, postId, comment) => ({
  ...state,
  posts: state.posts.map(post =>
    post.id === postId
      ? { ...post, comments: [...post.comments, comment] }
      : post
  )
});

// Toggle notification preference
const toggleNotifications = (state) => ({
  ...state,
  user: {
    ...state.user,
    preferences: {
      ...state.user.preferences,
      notifications: !state.user.preferences.notifications
    }
  }
});

// Increment post likes
const likePost = (state, postId) => ({
  ...state,
  posts: state.posts.map(post =>
    post.id === postId
      ? { ...post, likes: post.likes + 1 }
      : post
  )
});
```

### Exercise 4: Data Analysis

Analyze sales data using functional techniques:

```javascript
const sales = [
  { product: 'Laptop', category: 'Electronics', amount: 1200, date: '2025-01-05', region: 'North' },
  { product: 'Mouse', category: 'Electronics', amount: 25, date: '2025-01-06', region: 'South' },
  { product: 'Desk', category: 'Furniture', amount: 300, date: '2025-01-06', region: 'North' },
  { product: 'Chair', category: 'Furniture', amount: 150, date: '2025-01-07', region: 'East' },
  { product: 'Monitor', category: 'Electronics', amount: 400, date: '2025-01-08', region: 'North' }
];

// Total sales by category
const salesByCategory = sales.reduce((acc, sale) => {
  const cat = sale.category;
  acc[cat] = (acc[cat] || 0) + sale.amount;
  return acc;
}, {});

// Average sale amount by region
const avgByRegion = Object.entries(
  sales.reduce((acc, sale) => {
    const region = sale.region;
    if (!acc[region]) acc[region] = { total: 0, count: 0 };
    acc[region].total += sale.amount;
    acc[region].count += 1;
    return acc;
  }, {})
).reduce((acc, [region, data]) => {
  acc[region] = data.total / data.count;
  return acc;
}, {});

// Top selling category
const topCategory = Object.entries(salesByCategory)
  .reduce((top, [category, amount]) =>
    amount > top.amount ? { category, amount } : top
  , { category: null, amount: 0 });
```

### Exercise 5: Function Composition

Build a text processing pipeline:

```javascript
// Build these utility functions and compose them

const trim = str => str.trim();
const toLowerCase = str => str.toLowerCase();
const removeSpecialChars = str => str.replace(/[^a-z0-9\s]/g, '');
const splitWords = str => str.split(/\s+/);
const removeStopWords = words => {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but']);
  return words.filter(word => !stopWords.has(word));
};
const countWords = words => {
  return words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});
};

// Compose into pipeline
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const analyzeText = pipe(
  trim,
  toLowerCase,
  removeSpecialChars,
  splitWords,
  removeStopWords,
  countWords
);

const text = "  The quick brown fox! And the quick blue fox.  ";
console.log(analyzeText(text));
// { quick: 2, brown: 1, fox: 2, blue: 1 }
```

---

## Key Takeaways

1. **Array methods are powerful**: Master `map`, `filter`, and `reduce` for most transformations
2. **Avoid mutations**: Always return new data structures instead of modifying existing ones
3. **Pure functions**: No side effects, same input always produces same output
4. **Composition**: Break complex operations into small, composable functions
5. **Data-last**: Design functions to take data as the last parameter for better composition
6. **Use utilities wisely**: Libraries like Lodash/fp and Ramda can simplify functional code

## Additional Resources

- [Lodash FP Guide](https://github.com/lodash/lodash/wiki/FP-Guide)
- [Ramda Documentation](https://ramdajs.com/)
- [Functional-Light JavaScript](https://github.com/getify/Functional-Light-JS)
- [MDN Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

## Next Steps

- Practice refactoring imperative code to functional style
- Experiment with currying and partial application
- Build a small project using purely functional techniques
- Explore functional reactive programming (FRP) concepts