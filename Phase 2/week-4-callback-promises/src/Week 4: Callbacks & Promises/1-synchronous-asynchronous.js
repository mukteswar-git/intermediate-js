// Synchornous Vs. Asynchornous Code

// 1. Synchronous (Blocking)
console.log("A");
console.log("B");
console.log("C");

// 2. Asynchronous (Non-blocking)
console.log("A");
setTimeout(() => {
  console.log("B");
}, 1000);
console.log("C");