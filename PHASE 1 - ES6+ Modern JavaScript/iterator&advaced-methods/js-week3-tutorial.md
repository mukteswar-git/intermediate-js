# Week 3: JavaScript Iterators & Advanced Methods

## Table of Contents
1. [for...of Loops](#forof-loops)
2. [Iterators and Generators](#iterators-and-generators)
3. [Array Methods](#array-methods)
4. [String Methods](#string-methods)
5. [Object Methods](#object-methods)

---

## 1. for...of Loops

The `for...of` loop is a modern way to iterate over iterable objects (arrays, strings, maps, sets, etc.).

### Basic Syntax

```javascript
for (const element of iterable) {
  // code to execute
}
```

### Examples

#### Iterating Over Arrays

```javascript
const fruits = ['apple', 'banana', 'orange'];

for (const fruit of fruits) {
  console.log(fruit);
}
// Output:
// apple
// banana
// orange
```

#### Iterating Over Strings

```javascript
const message = "Hello";

for (const char of message) {
  console.log(char);
}
// Output: H, e, l, l, o (each on a new line)
```

#### With Index (using entries())

```javascript
const colors = ['red', 'green', 'blue'];

for (const [index, color] of colors.entries()) {
  console.log(`${index}: ${color}`);
}
// Output:
// 0: red
// 1: green
// 2: blue
```

### for...of vs for...in

```javascript
const array = ['a', 'b', 'c'];

// for...of iterates over VALUES
for (const value of array) {
  console.log(value); // 'a', 'b', 'c'
}

// for...in iterates over KEYS (indices)
for (const key in array) {
  console.log(key); // '0', '1', '2'
}
```

**Key Difference:** Use `for...of` for values, `for...in` for keys/properties.

---

## 2. Iterators and Generators

### Iterators

An iterator is an object that implements the Iterator protocol by having a `next()` method.

#### Creating a Custom Iterator

```javascript
const myIterator = {
  current: 1,
  last: 5,
  
  next() {
    if (this.current <= this.last) {
      return { value: this.current++, done: false };
    } else {
      return { value: undefined, done: true };
    }
  }
};

console.log(myIterator.next()); // { value: 1, done: false }
console.log(myIterator.next()); // { value: 2, done: false }
console.log(myIterator.next()); // { value: 3, done: false }
```

#### Making an Object Iterable

```javascript
const range = {
  start: 1,
  end: 5,
  
  [Symbol.iterator]() {
    let current = this.start;
    const last = this.end;
    
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

// Now we can use for...of
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

### Generators

Generators are special functions that can pause and resume execution. They're defined using `function*` and use the `yield` keyword.

#### Basic Generator Syntax

```javascript
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

#### Practical Generator Examples

```javascript
// Infinite sequence generator
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const sequence = infiniteSequence();
console.log(sequence.next().value); // 0
console.log(sequence.next().value); // 1
console.log(sequence.next().value); // 2

// ID generator
function* idGenerator() {
  let id = 1;
  while (true) {
    yield `ID-${id++}`;
  }
}

const getId = idGenerator();
console.log(getId.next().value); // 'ID-1'
console.log(getId.next().value); // 'ID-2'

// Range generator
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

for (const num of range(1, 10, 2)) {
  console.log(num); // 1, 3, 5, 7, 9
}
```

#### Generator with Parameters

```javascript
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
console.log(fib.next().value); // 5
```

---

## 3. Array Methods

JavaScript arrays have powerful built-in methods for data manipulation.

### map()

Creates a new array by applying a function to each element.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Extract properties from objects
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

const names = users.map(user => user.name);
console.log(names); // ['Alice', 'Bob', 'Charlie']

// Transform data
const prices = [10, 20, 30];
const pricesWithTax = prices.map(price => ({
  original: price,
  withTax: price * 1.2
}));
console.log(pricesWithTax);
// [{ original: 10, withTax: 12 }, ...]
```

### filter()

Creates a new array with elements that pass a test.

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Get even numbers
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Filter objects
const products = [
  { name: 'Laptop', price: 1000, inStock: true },
  { name: 'Phone', price: 500, inStock: false },
  { name: 'Tablet', price: 300, inStock: true }
];

const availableProducts = products.filter(product => product.inStock);
console.log(availableProducts);
// [{ name: 'Laptop', ... }, { name: 'Tablet', ... }]

// Complex filtering
const expensiveAvailable = products.filter(p => p.price > 400 && p.inStock);
console.log(expensiveAvailable); // [{ name: 'Laptop', ... }]
```

### reduce()

Reduces an array to a single value by executing a function on each element.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((accumulator, current) => {
  return accumulator + current;
}, 0);
console.log(sum); // 15

// Find maximum
const max = numbers.reduce((max, current) => {
  return current > max ? current : max;
}, numbers[0]);
console.log(max); // 5

// Count occurrences
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const fruitCount = fruits.reduce((count, fruit) => {
  count[fruit] = (count[fruit] || 0) + 1;
  return count;
}, {});
console.log(fruitCount);
// { apple: 3, banana: 2, orange: 1 }

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flattened = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log(flattened); // [1, 2, 3, 4, 5, 6]

// Group by property
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];

const groupedByAge = people.reduce((groups, person) => {
  const age = person.age;
  if (!groups[age]) {
    groups[age] = [];
  }
  groups[age].push(person);
  return groups;
}, {});
console.log(groupedByAge);
// { 25: [{name: 'Alice', ...}, {name: 'Charlie', ...}], 30: [...] }
```

### find()

Returns the first element that satisfies a condition.

```javascript
const numbers = [5, 12, 8, 130, 44];

const found = numbers.find(num => num > 10);
console.log(found); // 12

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: 'Bob' }

// Returns undefined if not found
const notFound = numbers.find(num => num > 200);
console.log(notFound); // undefined
```

### findIndex()

Returns the index of the first element that satisfies a condition.

```javascript
const numbers = [5, 12, 8, 130, 44];

const index = numbers.findIndex(num => num > 10);
console.log(index); // 1

// Returns -1 if not found
const notFoundIndex = numbers.findIndex(num => num > 200);
console.log(notFoundIndex); // -1
```

### some()

Tests whether at least one element passes the test.

```javascript
const numbers = [1, 2, 3, 4, 5];

const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

const hasNegative = numbers.some(num => num < 0);
console.log(hasNegative); // false

// Check if any user is admin
const users = [
  { name: 'Alice', role: 'user' },
  { name: 'Bob', role: 'admin' },
  { name: 'Charlie', role: 'user' }
];

const hasAdmin = users.some(user => user.role === 'admin');
console.log(hasAdmin); // true
```

### every()

Tests whether all elements pass the test.

```javascript
const numbers = [2, 4, 6, 8, 10];

const allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // true

const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true

const allLarge = numbers.every(num => num > 5);
console.log(allLarge); // false

// Validation example
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 20 }
];

const allAdults = users.every(user => user.age >= 18);
console.log(allAdults); // true
```

### Chaining Array Methods

You can combine multiple array methods for complex operations.

```javascript
const products = [
  { name: 'Laptop', price: 1000, category: 'electronics' },
  { name: 'Phone', price: 500, category: 'electronics' },
  { name: 'Shirt', price: 30, category: 'clothing' },
  { name: 'Shoes', price: 80, category: 'clothing' }
];

// Get total price of electronics over $400
const total = products
  .filter(p => p.category === 'electronics')
  .filter(p => p.price > 400)
  .map(p => p.price)
  .reduce((sum, price) => sum + price, 0);

console.log(total); // 1500

// Get names of affordable products
const affordableNames = products
  .filter(p => p.price < 100)
  .map(p => p.name.toUpperCase());

console.log(affordableNames); // ['SHIRT', 'SHOES']
```

### Bonus: Modern Array Methods

These newer array methods are especially useful in React and when working with APIs.

#### flat()

Flattens nested arrays to a specified depth.

```javascript
// Flatten one level (default)
const nested1 = [1, 2, [3, 4]];
console.log(nested1.flat()); // [1, 2, 3, 4]

// Flatten multiple levels
const nested2 = [1, [2, [3, [4]]]];
console.log(nested2.flat(1)); // [1, 2, [3, [4]]]
console.log(nested2.flat(2)); // [1, 2, 3, [4]]
console.log(nested2.flat(Infinity)); // [1, 2, 3, 4] - flatten all levels

// Practical example: Flatten API responses
const userGroups = [
  { group: 'A', users: ['Alice', 'Bob'] },
  { group: 'B', users: ['Charlie', 'Diana'] },
  { group: 'C', users: ['Eve'] }
];

const allUsers = userGroups
  .map(group => group.users)
  .flat();
console.log(allUsers); // ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']

// Remove empty slots
const withEmpty = [1, 2, , 4, 5];
console.log(withEmpty.flat()); // [1, 2, 4, 5]
```

#### flatMap()

Maps each element and flattens the result (more efficient than `.map().flat()`).

```javascript
// Basic usage
const numbers = [1, 2, 3];
const doubled = numbers.flatMap(n => [n, n * 2]);
console.log(doubled); // [1, 2, 2, 4, 3, 6]

// Split sentences into words
const sentences = [
  "Hello world",
  "How are you",
  "JavaScript is awesome"
];

const words = sentences.flatMap(sentence => sentence.split(' '));
console.log(words); 
// ['Hello', 'world', 'How', 'are', 'you', 'JavaScript', 'is', 'awesome']

// Extract nested data from API response
const orders = [
  { id: 1, items: ['apple', 'banana'] },
  { id: 2, items: ['orange'] },
  { id: 3, items: ['grape', 'melon', 'kiwi'] }
];

const allItems = orders.flatMap(order => order.items);
console.log(allItems); 
// ['apple', 'banana', 'orange', 'grape', 'melon', 'kiwi']

// Add metadata while flattening
const ordersWithMetadata = orders.flatMap(order => 
  order.items.map(item => ({ orderId: order.id, item }))
);
console.log(ordersWithMetadata);
// [
//   { orderId: 1, item: 'apple' },
//   { orderId: 1, item: 'banana' },
//   { orderId: 2, item: 'orange' },
//   ...
// ]

// Filtering and mapping in one step
const nums = [1, 2, 3, 4, 5];
const evenDoubled = nums.flatMap(n => n % 2 === 0 ? [n * 2] : []);
console.log(evenDoubled); // [4, 8]

// React example: Rendering nested lists
const categories = [
  { name: 'Fruits', items: ['Apple', 'Banana'] },
  { name: 'Vegetables', items: ['Carrot', 'Lettuce'] }
];

// Instead of nested maps, use flatMap
const categoryItems = categories.flatMap(cat => 
  cat.items.map(item => `${cat.name}: ${item}`)
);
console.log(categoryItems);
// ['Fruits: Apple', 'Fruits: Banana', 'Vegetables: Carrot', 'Vegetables: Lettuce']
```

#### at()

Access array elements with positive or negative indices (negative counts from the end).

```javascript
const fruits = ['apple', 'banana', 'orange', 'grape', 'melon'];

// Positive indices (like bracket notation)
console.log(fruits.at(0)); // 'apple'
console.log(fruits.at(2)); // 'orange'

// Negative indices (the real benefit!)
console.log(fruits.at(-1)); // 'melon' (last item)
console.log(fruits.at(-2)); // 'grape' (second to last)
console.log(fruits.at(-3)); // 'orange' (third to last)

// Compare with old way
console.log(fruits[fruits.length - 1]); // 'melon' (old way)
console.log(fruits.at(-1)); // 'melon' (new way - cleaner!)

// Practical examples

// Get last element safely
function getLastElement(arr) {
  return arr.at(-1);
}
console.log(getLastElement([1, 2, 3])); // 3
console.log(getLastElement([])); // undefined (safe!)

// Get nth element from end
function getNthFromEnd(arr, n) {
  return arr.at(-n);
}
console.log(getNthFromEnd([10, 20, 30, 40], 2)); // 30

// API response handling
const apiResponse = {
  data: [
    { id: 1, name: 'First' },
    { id: 2, name: 'Second' },
    { id: 3, name: 'Last' }
  ]
};

// Get the most recent item (last in array)
const mostRecent = apiResponse.data.at(-1);
console.log(mostRecent); // { id: 3, name: 'Last' }

// Toggle between items
const playlist = ['song1.mp3', 'song2.mp3', 'song3.mp3'];
let currentIndex = 0;

// Get current song
console.log(playlist.at(currentIndex)); // 'song1.mp3'

// Go backwards
currentIndex = -1;
console.log(playlist.at(currentIndex)); // 'song3.mp3'

// Works with strings too!
const text = "Hello";
console.log(text.at(0)); // 'H'
console.log(text.at(-1)); // 'o'
console.log(text.at(-2)); // 'l'

// Out of bounds returns undefined (safe)
console.log(fruits.at(100)); // undefined
console.log(fruits.at(-100)); // undefined
```

#### Combining Modern Methods

```javascript
// Real-world example: Processing nested API data
const apiData = [
  {
    category: 'Electronics',
    products: [
      { name: 'Laptop', tags: ['computer', 'portable'] },
      { name: 'Phone', tags: ['mobile', 'smart'] }
    ]
  },
  {
    category: 'Books',
    products: [
      { name: 'JavaScript Guide', tags: ['programming', 'web'] },
      { name: 'React Handbook', tags: ['programming', 'frontend'] }
    ]
  }
];

// Extract all tags from all products
const allTags = apiData
  .flatMap(cat => cat.products)
  .flatMap(product => product.tags);
console.log(allTags);
// ['computer', 'portable', 'mobile', 'smart', 'programming', 'web', 'programming', 'frontend']

// Get unique tags
const uniqueTags = [...new Set(allTags)];
console.log(uniqueTags);
// ['computer', 'portable', 'mobile', 'smart', 'programming', 'web', 'frontend']

// Get the last product's first tag
const lastProduct = apiData.at(-1).products.at(-1);
const firstTag = lastProduct.tags.at(0);
console.log(firstTag); // 'programming'

// React pagination example
const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
const pageSize = 10;
const currentPage = 3;

// Get current page items
const pageItems = items.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

// Get first and last of current page
console.log(pageItems.at(0)); // 'Item 21'
console.log(pageItems.at(-1)); // 'Item 30'

// Nested comment threads (common in social apps)
const comments = [
  {
    text: 'Great post!',
    replies: [
      { text: 'Thanks!' },
      { text: 'Agreed' }
    ]
  },
  {
    text: 'Very helpful',
    replies: [
      { text: 'Glad you liked it' }
    ]
  }
];

// Flatten all comments and replies
const allComments = [
  ...comments,
  ...comments.flatMap(c => c.replies)
];

console.log(`Total comments: ${allComments.length}`); // 5

// Get the most recent reply
const latestReply = comments
  .flatMap(c => c.replies)
  .at(-1);
console.log(latestReply); // { text: 'Glad you liked it' }
```

---

## 4. String Methods

JavaScript strings have powerful methods for searching and manipulation.

### includes()

Checks if a string contains a substring.

```javascript
const text = "Hello, World!";

console.log(text.includes("World")); // true
console.log(text.includes("world")); // false (case-sensitive)
console.log(text.includes("Hello")); // true
console.log(text.includes("Goodbye")); // false

// With position parameter
const message = "JavaScript is awesome";
console.log(message.includes("Java", 0)); // true
console.log(message.includes("Java", 5)); // false

// Practical example
const email = "user@example.com";
if (email.includes("@")) {
  console.log("Valid email format");
}

// Search in array of strings
const fruits = ["apple", "banana", "orange"];
const searchTerm = "ban";
const matchingFruits = fruits.filter(fruit => fruit.includes(searchTerm));
console.log(matchingFruits); // ['banana']
```

### startsWith()

Checks if a string starts with a specified substring.

```javascript
const url = "https://www.example.com";

console.log(url.startsWith("https")); // true
console.log(url.startsWith("http")); // true
console.log(url.startsWith("ftp")); // false

// With position parameter
console.log(url.startsWith("www", 8)); // true

// Practical examples
const filename = "report.pdf";
if (filename.startsWith("report")) {
  console.log("This is a report file");
}

// Filter files by extension
const files = [
  "document.pdf",
  "image.jpg",
  "data.csv",
  "photo.jpg"
];

const imageFiles = files.filter(file => 
  file.endsWith(".jpg") || file.endsWith(".png")
);
console.log(imageFiles); // ['image.jpg', 'photo.jpg']

// URL validation
function isSecureUrl(url) {
  return url.startsWith("https://");
}

console.log(isSecureUrl("https://example.com")); // true
console.log(isSecureUrl("http://example.com")); // false
```

### endsWith()

Checks if a string ends with a specified substring.

```javascript
const filename = "document.pdf";

console.log(filename.endsWith(".pdf")); // true
console.log(filename.endsWith(".doc")); // false
console.log(filename.endsWith("ent.pdf")); // true

// With length parameter
const str = "Hello, World!";
console.log(str.endsWith("Hello", 5)); // true (checks first 5 chars)

// Practical examples
function getFileType(filename) {
  if (filename.endsWith(".jpg") || filename.endsWith(".png")) {
    return "image";
  } else if (filename.endsWith(".pdf")) {
    return "document";
  } else if (filename.endsWith(".mp3")) {
    return "audio";
  }
  return "unknown";
}

console.log(getFileType("photo.jpg")); // "image"
console.log(getFileType("report.pdf")); // "document"

// Check multiple endings
const videoExtensions = [".mp4", ".avi", ".mov"];
const file = "movie.mp4";
const isVideo = videoExtensions.some(ext => file.endsWith(ext));
console.log(isVideo); // true
```

### Combined String Methods Example

```javascript
// Email validator
function validateEmail(email) {
  return email.includes("@") && 
         email.includes(".") && 
         !email.startsWith("@") && 
         !email.endsWith("@");
}

console.log(validateEmail("user@example.com")); // true
console.log(validateEmail("@example.com")); // false

// File filter
const allFiles = [
  "report.pdf",
  "backup_report.pdf",
  "image.jpg",
  "backup_image.jpg",
  "data.csv"
];

const backupPdfs = allFiles.filter(file => 
  file.startsWith("backup") && file.endsWith(".pdf")
);
console.log(backupPdfs); // ['backup_report.pdf']

// Search functionality
function searchProducts(products, query) {
  query = query.toLowerCase();
  return products.filter(product => 
    product.toLowerCase().includes(query)
  );
}

const products = ["Laptop", "Desktop", "Tablet", "Smartphone"];
console.log(searchProducts(products, "top")); // ['Laptop', 'Desktop']
```

---

## 5. Object Methods

JavaScript provides several static methods on the Object constructor for working with objects.

### Object.keys()

Returns an array of an object's own property names.

```javascript
const person = {
  name: 'Alice',
  age: 25,
  city: 'New York'
};

const keys = Object.keys(person);
console.log(keys); // ['name', 'age', 'city']

// Iterate over keys
Object.keys(person).forEach(key => {
  console.log(`${key}: ${person[key]}`);
});
// name: Alice
// age: 25
// city: New York

// Count properties
const propertyCount = Object.keys(person).length;
console.log(propertyCount); // 3

// Check if object is empty
const emptyObj = {};
const isEmpty = Object.keys(emptyObj).length === 0;
console.log(isEmpty); // true
```

### Object.values()

Returns an array of an object's own property values.

```javascript
const scores = {
  math: 95,
  english: 88,
  science: 92
};

const values = Object.values(scores);
console.log(values); // [95, 88, 92]

// Calculate average
const average = Object.values(scores).reduce((sum, score) => sum + score, 0) 
                / Object.values(scores).length;
console.log(average); // 91.67

// Find maximum value
const maxScore = Math.max(...Object.values(scores));
console.log(maxScore); // 95

// Check if any value meets condition
const hasFailingGrade = Object.values(scores).some(score => score < 60);
console.log(hasFailingGrade); // false
```

### Object.entries()

Returns an array of an object's own [key, value] pairs.

```javascript
const user = {
  username: 'john_doe',
  email: 'john@example.com',
  role: 'admin'
};

const entries = Object.entries(user);
console.log(entries);
// [['username', 'john_doe'], ['email', 'john@example.com'], ['role', 'admin']]

// Iterate over entries
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// Convert object to Map
const userMap = new Map(Object.entries(user));
console.log(userMap.get('username')); // 'john_doe'

// Filter object properties
const settings = {
  theme: 'dark',
  notifications: true,
  autoSave: false,
  language: 'en'
};

const enabledSettings = Object.entries(settings)
  .filter(([key, value]) => value === true)
  .map(([key]) => key);
console.log(enabledSettings); // ['notifications']

// Transform object
const prices = { laptop: 1000, phone: 500, tablet: 300 };
const discountedPrices = Object.fromEntries(
  Object.entries(prices).map(([item, price]) => [item, price * 0.9])
);
console.log(discountedPrices);
// { laptop: 900, phone: 450, tablet: 270 }
```

### Object.assign()

Copies properties from one or more source objects to a target object.

```javascript
// Basic usage
const target = { a: 1 };
const source = { b: 2, c: 3 };
const result = Object.assign(target, source);

console.log(result); // { a: 1, b: 2, c: 3 }
console.log(target); // { a: 1, b: 2, c: 3 } (target is modified)

// Merge multiple objects
const defaults = { theme: 'light', language: 'en' };
const userPrefs = { theme: 'dark' };
const settings = Object.assign({}, defaults, userPrefs);

console.log(settings); // { theme: 'dark', language: 'en' }

// Clone an object (shallow copy)
const original = { name: 'Alice', age: 25 };
const clone = Object.assign({}, original);
console.log(clone); // { name: 'Alice', age: 25 }

// Add properties to an object
const person = { name: 'Bob' };
Object.assign(person, { age: 30, city: 'Boston' });
console.log(person); // { name: 'Bob', age: 30, city: 'Boston' }

// Note: Object.assign performs shallow copy
const obj1 = { a: 1, nested: { b: 2 } };
const obj2 = Object.assign({}, obj1);
obj2.nested.b = 99;
console.log(obj1.nested.b); // 99 (nested object is shared!)

// Alternative: spread operator (more common now)
const copy = { ...original };
const merged = { ...defaults, ...userPrefs };
```

### Object.freeze()

Freezes an object, preventing modifications.

```javascript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

Object.freeze(config);

// These operations will fail silently (or throw in strict mode)
config.apiUrl = 'https://new-api.example.com'; // No effect
config.newProperty = 'value'; // No effect
delete config.timeout; // No effect

console.log(config);
// { apiUrl: 'https://api.example.com', timeout: 5000 }

// Check if object is frozen
console.log(Object.isFrozen(config)); // true

// Note: freeze is shallow
const user = {
  name: 'Alice',
  settings: {
    theme: 'light'
  }
};

Object.freeze(user);
user.name = 'Bob'; // No effect
user.settings.theme = 'dark'; // This works! (nested object not frozen)

console.log(user); // { name: 'Alice', settings: { theme: 'dark' } }

// Deep freeze function
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(value => {
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  });
  return obj;
}

const deepFrozen = deepFreeze({
  a: 1,
  nested: { b: 2 }
});
deepFrozen.nested.b = 99; // No effect
console.log(deepFrozen.nested.b); // 2
```

### Object.seal()

Seals an object, preventing additions/deletions but allowing modifications.

```javascript
const product = {
  name: 'Laptop',
  price: 1000
};

Object.seal(product);

// Can modify existing properties
product.price = 1200; // Works
console.log(product.price); // 1200

// Cannot add new properties
product.category = 'Electronics'; // No effect
console.log(product.category); // undefined

// Cannot delete properties
delete product.name; // No effect
console.log(product.name); // 'Laptop'

// Check if sealed
console.log(Object.isSealed(product)); // true
```

### Object.fromEntries()

Creates an object from an array of key-value pairs.

```javascript
const entries = [
  ['name', 'Alice'],
  ['age', 25],
  ['city', 'New York']
];

const obj = Object.fromEntries(entries);
console.log(obj); // { name: 'Alice', age: 25, city: 'New York' }

// Convert Map to object
const map = new Map([
  ['a', 1],
  ['b', 2]
]);
const objFromMap = Object.fromEntries(map);
console.log(objFromMap); // { a: 1, b: 2 }

// Transform object properties
const prices = { laptop: 1000, phone: 500 };
const discounted = Object.fromEntries(
  Object.entries(prices).map(([key, value]) => [key, value * 0.8])
);
console.log(discounted); // { laptop: 800, phone: 400 }

// Filter object properties
const user = {
  name: 'Bob',
  password: '12345',
  email: 'bob@example.com',
  age: 30
};

const publicData = Object.fromEntries(
  Object.entries(user).filter(([key]) => key !== 'password')
);
console.log(publicData);
// { name: 'Bob', email: 'bob@example.com', age: 30 }
```

### Practical Object Methods Examples

```javascript
// Configuration merger
function mergeConfig(defaults, userConfig) {
  return Object.assign({}, defaults, userConfig);
}

const defaultConfig = {
  theme: 'light',
  fontSize: 14,
  notifications: true
};

const userConfig = { theme: 'dark' };
const finalConfig = mergeConfig(defaultConfig, userConfig);
console.log(finalConfig);
// { theme: 'dark', fontSize: 14, notifications: true }

// Object mapper
function mapObject(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value)])
  );
}

const numbers = { a: 1, b: 2, c: 3 };
const doubled = mapObject(numbers, x => x * 2);
console.log(doubled); // { a: 2, b: 4, c: 6 }

// Filter object
function filterObject(obj, predicate) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => predicate(key, value))
  );
}

const data = {
  name: 'Alice',
  age: 25,
  score: 95,
  grade: 'A'
};

const onlyNumbers = filterObject(data, (key, value) => typeof value === 'number');
console.log(onlyNumbers); // { age: 25, score: 95 }

// Count property types
function countPropertyTypes(obj) {
  return Object.values(obj).reduce((counts, value) => {
    const type = typeof value;
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {});
}

const mixed = {
  a: 1,
  b: 'hello',
  c: true,
  d: 42,
  e: 'world'
};

console.log(countPropertyTypes(mixed));
// { number: 2, string: 2, boolean: 1 }
```

---

## Practice Exercises

### Exercise 1: Array Methods Challenge

```javascript
// Given this data, solve the following:
const students = [
  { name: 'Alice', grade: 85, subject: 'Math' },
  { name: 'Bob', grade: 92, subject: 'Science' },
  { name: 'Charlie', grade: 78, subject: 'Math' },
  { name: 'Diana', grade: 95, subject: 'Science' },
  { name: 'Eve', grade: 88, subject: 'Math' }
];

// 1. Get all students with grades above 85
// 2. Calculate average grade
// 3. Get list of student names
// 4. Check if any student failed (grade < 60)
// 5. Check if all students passed (grade >= 70)
```

### Exercise 2: Generator Practice

```javascript
// Create a generator that:
// 1. Generates even numbers
// 2. Takes start and end parameters
// 3. Can be used with for...of loop
```

### Exercise 3: Object Manipulation

```javascript
// Given this object:
const inventory = {
  apple: 10,
  banana: 5,
  orange: 8,
  mango: 0
};

// 1. Get all fruit names
// 2. Get total quantity
// 3. Remove out-of-stock items
// 4. Create a new object with doubled quantities
```

---

## Summary

In Week 3, you learned:

- **for...of loops** for iterating over iterable objects
- **Iterators** for creating custom iteration behavior
- **Generators** for creating iterables with `function*` and `yield`
- **Array methods** like `map`, `filter`, `reduce`, `find`, `some`, `every` for data transformation
- **String methods** like `includes`, `startsWith`, `endsWith` for string searching
- **Object methods** like `keys`, `values`, `entries`, `assign`, `freeze` for object manipulation

These tools form the foundation of modern JavaScript programming and enable you to write more expressive and efficient code!