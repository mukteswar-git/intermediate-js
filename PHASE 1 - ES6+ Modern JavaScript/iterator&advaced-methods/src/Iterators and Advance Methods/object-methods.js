// Object Methods
console.log('Object Methods');

// Object.keys()
console.log('\nObject.Keys()');

const person = {
  name: 'Alice',
  age: 25,
  city: 'New York'
};

const keys = Object.keys(person);
console.log('\n', keys);

// Iterate over keys 
console.log('\n// Iterate over keys');

Object.keys(person).forEach(key => {
  console.log(`${key}: ${person[key]}`);
});

// Count properties
console.log('\n// Count properties');

const propertyCount = Object.keys(person).length;
console.log(propertyCount);

// Check if object is empty
console.log('\n// Check if object is empty');

const emptyObj = {};
const isEmpty = Object.keys(emptyObj).length === 0;
console.log(isEmpty);


// Object.values()
console.log('\n \n Object.values()');

const scores = {
  math: 95,
  english: 88,
  science: 92
};

const values = Object.values(scores);
console.log('\n', values);

// Calculate average
console.log('\n// Calculate average');

const average = Object.values(scores).reduce((sum, score) => sum + score, 0)
                  / Object.values(scores).length;
console.log(average);

// Find maximum value
console.log('\n// Find maximum value');

const maxScore = Math.max(...Object.values(scores));
console.log(maxScore);

// Check if any value meets condition
console.log('\n// Check if any value meets condition');

const hasFailingGrade = Object.values(scores).some(score => score < 60);
console.log(hasFailingGrade);


// Object.entries()
console.log('\nObject.entries()');

const user = {
  username: 'john_doe',
  email: 'john@example.com',
  role: 'admin'
};

const entries = Object.entries(user);
console.log('\n', entries);

// Iterator over entries
console.log('\n// Iterator over entries');

Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// Convert object to Map
console.log('\n// Convert object to Map');

const userMap = new Map(Object.entries(user));
console.log(userMap.get('username'));

// Filter object properties
console.log('\n// Filter object properties');

const settings = {
  theme: 'dark',
  notifications: true,
  autoSave: false,
  language: 'en'
};

const enabledSettings = Object.entries(settings)
  .filter(([key, value]) => value === true)
  .map(([key]) => key);
console.log(enabledSettings);

// Transform object
console.log('\n// Transform object');

const prices = { laptop: 1000, phone: 500, tablet: 300};
const discountedPrices = Object.fromEntries(
  Object.entries(prices).map(([item, price]) => [item, price * 0.9])
);
console.log(discountedPrices);


// Object.assign()
console.log('\nObject.assign()');

// Basic usage
const target = { a: 1 };
const source = { b: 2, c: 3 };
const result = Object.assign(target, source);

console.log('\n', result);
console.log(target);

// Merge multiple objects
console.log('\n// Merge multiple objects');

const defaults = { theme: 'light', language: 'en' };
const userPrefs = { theme: 'dark' };
const settings1 = Object.assign({}, defaults, userPrefs);

console.log(settings1);

// Clone an object(shallow copy)
console.log('\n// Clone an object(shallow copy)');

const original = { name: 'Alice', age: 25 };
const clone = Object.assign({}, original);
console.log(clone);

// Add properties to an object
console.log('\n// Add properties to an object');

const person1 = { name: 'Bob' };
Object.assign(person1, { age: 30, city: 'Boston' });
console.log(person1);

// Note: Object.assign performs shallow copy
console.log('\n// Note: Object.assign performs shallow copy');

const obj1 = { a: 1, nested: { b: 2 }};
const obj2 = Object.assign({}, obj1);
obj2.nested.b = 99;
console.log(obj1.nested.b);

// Alternative: spread operator (more common now)
const copy = { ...original };
const merged = { ...defaults, ...userPrefs };


// Object.freeze()
console.log('\nObject.freeze()');

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

Object.freeze(config);

// These operations will fail silently (or throw in strict mode)
// config.apiUrl = 'https://new-api.example.com';
// config.newProperty = 'value';

console.log(config);

// Check if object is frozen
console.log('\n// Check if object is frozen');

console.log(Object.isFrozen(config));

// Note: freeze is shallow
console.log('\n// Note: freeze is shallow');

const user1  = {
  name: 'Alice',
  settings: {
    theme: 'light'
  }
};

Object.freeze(user1);
// user1.name = 'Bob';
user1.settings.theme = 'dark';

console.log(user1);

// Deep freeze function
console.log('\n// Deep freeze function');

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
// deepFrozen.nested.b = 99;
console.log(deepFrozen.nested.b);


// Object.seal()
console.log('\nObject.seal()');

const product = {
  name: 'Laptop',
  price: 1000
};

Object.seal(product);
console.log(product);

// Can modify existing properties
console.log('\n// Can modify existing properties');

product.price = 1200;
console.log(product.price);

// Cannot add new properties
// product.category = 'Electronics';
console.log(product.category);

// Cannot delete properties
// delete product.name;
console.log(product.category);

// Check if sealed
console.log(Object.isSealed(product));


// Object.fromEntries()
console.log('\nObject.fromEntries()');

const entries1 = [
  ['name', 'Alice'],
  ['age', 25],
  ['city', 'New York']
];

const obj = Object.fromEntries(entries);
console.log(obj);

// Convert Map to object
console.log('\n// Conver Map to object');

const map = new Map([
  ['a', 1],
  ['b', 2]
]);
const objFromMap = Object.fromEntries(map);
console.log(objFromMap);

// Transform object properties 
console.log('\n// Transform object properties');

const prices1 = { laptop: 1000, phone: 500 };
const discounted = Object.fromEntries(
  Object.entries(prices).map(([key, value]) => [key, value * 0.8])
);
console.log(discounted);

// Filter object properties
console.log('\n// Filter object properties');

const user2 = {
  name: 'Bob',
  password: '12345',
  email: 'bob@example.com',
  age: 30
};

const publicData = Object.fromEntries(
  Object.entries(user2).filter((([key]) => key !== 'password'))
);
console.log(publicData);


// Practical Object Methods Examples
console.log('\nPractical Object Methods Examples');

// Configuration merger
console.log('\n// Configuration merger');

function mergeConfig(defaults, userConfig) {
  return Object.assign({}, defaults, userConfig);
}

const defaultCofig = {
  theme: 'light',
  fontSixe: 14,
  notifications: true
};

const userConfig = { theme: 'dark' };
const finalConfig = mergeConfig(defaultCofig, userConfig);
console.log(finalConfig);

// Object mapper
console.log('\n// Object mapper');

function mapObject(obj, fn) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value)])
  );
}

const numbers = { a: 1, b: 2, c: 3 };
const doubled = mapObject(numbers, x => x * 2);
console.log(doubled);

// Filter object
console.log('\n// Filter object');

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
console.log(onlyNumbers);

// Count property types
console.log('\n// Count property types');

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