function memoize(fn) {
  const cache = new WeakMap();

  return function(obj) {
    if (cache.has(obj)) {
      return cache.get(obj);
    }

    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}

// Test
function expensiveOperation(obj) {
  console.log('computing...');
  return obj.value * 2;
}

const memoized = memoize(expensiveOperation);
const obj1 = { value: 5 };

console.log(memoized(obj1));
console.log(memoized(obj1));
console.log(memoized({ value: 5 }));