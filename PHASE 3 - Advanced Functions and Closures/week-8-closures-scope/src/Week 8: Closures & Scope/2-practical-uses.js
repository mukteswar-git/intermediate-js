// Practical Use Cases

// Use Case 1: Event Handlers

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
      console.log(`Button ${i} clicked`)
    });
  }
}


// Use Case 2: Function Factories

function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));
console.log(triple(5));


// Use Case 3: Memoization (Caching)

function memize(fn) {
  const cache = {};

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

const memoizedSlow = memize(slowFunction);

memoizedSlow(5);
memoizedSlow(5);