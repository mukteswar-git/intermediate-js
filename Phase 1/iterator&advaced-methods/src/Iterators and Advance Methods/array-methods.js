// Array Methods

// map()

const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(num => num * 2);
console.log(doubled);

// Extract properties from objects
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

const names = users.map(user => user.name);
console.log(names);

// Transform data
const prices = [10, 20, 30];
const priceWithTax = prices.map(price => ({
  original: price,
  withTax: price * 1.2
}));
console.log(priceWithTax);


// filter()

const numbers1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Get even numbers
const evens = numbers1.filter(num => num % 2 === 0);
console.log(evens);

// Filter objects
const products = [
  { name: 'Laptop', price: 1000, inStock: true},
  { name: 'Phone', price: 500, inStock: false},
  { name: 'Tablet', price: 300, inStock: true}
];

const availableProducts = products.filter(product => product.inStock);
console.log(availableProducts);

// Complex filtering
const expensiveAvailable = products.filter(p => p.price > 400 && p.inStock);
console.log(expensiveAvailable);


// reduce()

const numbers2 = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers2.reduce((accumulator, current) => {
  return accumulator + current;
}, 0);
console.log(sum);

// Find maximum
const max = numbers2.reduce((max, current) => {
  return current > max ? current : max;
}, numbers2[0]);
console.log(max);

// Count occurance
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const fruitCount = fruits.reduce((count, fruit) => {
  count[fruit] = (count[fruit] || 0) + 1;
  return count;
}, {});
console.log(fruitCount);

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flattened = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log(flattened);

// Group by property
const people = [
  { name: 'Alice', age: 25},
  { name: 'Bob', age: 30},
  { name: 'Charlie', age: 25}
];

const groupByAge = people.reduce((groups, person) => {
  const age = person.age;
  if (!groups[age]) {
    groups[age] = [];
  }
  groups[age].push(person);
  return groups;
}, {});
console.log(groupByAge);


// find()

const numbers3 = [5, 12, 8, 130, 44];

const found = numbers3.find(num => num > 10);
console.log(found);

const users1 = [
  { id: 1, name: 'Alice'},
  { id: 2, name: 'Bob'},
  { id: 3, name: 'Charlie'}
];

const user = users1.find(u => u.id === 2);
console.log(user);

// Returns undefined if not found
const notFound = numbers3.find(num => num > 200);
console.log(notFound);


// findIndex()

const numbers4 = [5, 12, 130, 4];

const index = numbers4.findIndex(num => num > 10);
console.log(index);

// Returns -1 if not found
const notFoundIndex = numbers4.findIndex(num => num > 200);
console.log(notFoundIndex);


// some()

const numbers5 = [1, 2, 3, 4, 5];
 
const hasEven = numbers5.some(num => num % 2 === 0);
console.log(hasEven);

const hasNegative = numbers5.some(num => num < 0);
console.log(hasNegative);

// Check if any user is admin
const users2 = [
  { name: 'Alice', role: 'user' },
  { name: 'Bob', role: 'admin' },
  { name: 'Charlie', role: 'user' }
];

const hasAdmin = users2.some(user => user.role === 'admin');
console.log(hasAdmin);


// every()

const numbers6 = [2, 4, 6, 8, 10];

const allEven = numbers6.every(num => num % 2 === 0);
console.log(allEven);

const allPositive = numbers6.every(num => num > 0);
console.log(allPositive);

const allLarge = numbers6.every(num => num > 5);
console.log(allLarge);



// Chaining Array Methods

const products1 = [
  { name: 'Laptop', price: 1000, category: 'electronics' },
  { name: 'Phone', price: 500, category: 'electronics' },
  { name: 'Shirt', price: 30, category: 'clothing' },
  { name: 'Shoes', price: 80, category: 'clothing' }
];

// Get all price of electronics over $400
const total = products1
  .filter(p => p.category === 'electronics')
  .filter(p => p.price > 400)
  .map(p => p.price)
  .reduce((sum, price) => sum + price, 0);

console.log(total);

// Get names of affordable products
const affordableNames = products1
  .filter(p => p.price < 100)
  .map(p => p.name.toUpperCase());

console.log(affordableNames);