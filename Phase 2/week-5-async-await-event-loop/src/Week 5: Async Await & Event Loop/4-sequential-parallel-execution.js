// Sequential vs Parallel Execution

// Sequential (Slow)

const a = await fetch(url1);
const b = await fetch(url2);

// Parallel (Correct)

const [c, d] = await Promise.all([
  fetch(url1),
  fetch(url2)
]);

// Promise.all vs Promise.race

// Promise.all - Wait for ALL to complete
const results = await Promise.all([promise1, promise2, promise3]);

// Promise.race - Return when FIRST completes
const fastest = await Promise.race([promise1, promise2, promise3]);