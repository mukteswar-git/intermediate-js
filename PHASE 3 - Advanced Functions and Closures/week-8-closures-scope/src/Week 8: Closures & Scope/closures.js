// Closures

// Bsic Example
function createGreeting(greeting) {
  // 'greeting' is captured in the closure
  return function(name) {
    console.log(`${greeting}, ${name}!`);
  };
}

const sayHello = createGreeting("Hello");
const sayHii = createGreeting("Hii");

sayHello("Alice");
sayHii("Bob");