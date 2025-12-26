// MAP

// Create a Map
const map = new Map();

const objKey = {id: 1};
const funcKey = function() {};

map.set('string', 'value');
map.set(42, 'number key');
map.set(objKey, 'object key');
map.set(funcKey, 'function key');

console.log(map.get('string'));
console.log(map.get(objKey));
console.log(map.get(42));

console.log(map.has('string'));
console.log(map.has('missing'));

console.log(map.size);

map.delete('string');
console.log(map.has('string'));

map.clear();
console.log(map.size);

// ITERATING MAPS

const map1 = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3]
]);

for (const [key, value] of map1) {
  console.log(key, value);
}

map1.forEach((value, key) => {
  console.log(key, value);
})

console.log([...map1.keys()]);
console.log([...map1.values()]);
console.log([...map1.entries()]);


// SET

// Create a Set
const set = new Set();

set.add(1);
set.add(2);
set.add(2);
set.add(3);

console.log(set.size);
console.log(set.has(2));

set.delete(2);
console.log(set.has(2));

const nums = new Set([1, 2, 2, 3, 3, 3]);
console.log([...nums]);

// Iterating Sets
const set1 = new Set(['a', 'b', 'c']);

for (const value of set1) {
  console.log(value);
}

set1.forEach((value, valueAgain, set1) => {
  console.log(value);
})

const arr = [...set1];
const arr2 = Array.from(set1);