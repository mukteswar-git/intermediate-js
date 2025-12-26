// Promise Static Methods

// 1. Promise.all() - Wait for ALL promises

const p1 = Promise.resolve(3);
const p2 = new Promise(resolve => setTimeout(() => resolve(42), 1000));
const p3 = Promise.resolve("foo");

Promise.all([p1, p2, p3])
  .then(results => {
    console.log(results);
  })
  .catch(error => {
    console.log("One failed:", error);
  });

// 2. Promise.allSettled() - Wait for all, regardless of result

const p4 = Promise.resolve("success");
const p5 = Promise.resolve("error");
const p6 = Promise.resolve("another success");

Promise.allSettled([p4, p5, p6])
  .then(results => {
    console.log(results);
  });

// 3. Promise.any() - First successful promise wins

const p7 = Promise.reject("error 1");
const p8 = new Promise(resolve => setTimeout(() => resolve("Success"), 500));
const p9 = Promise.reject("error 2");

Promise.any([p7, p8, p9])
  .then(first => {
    console.log(first);
  })
  .catch(error => {
    console.log("All failed:", error);
  });