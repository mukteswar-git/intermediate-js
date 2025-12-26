// Promise.any() - First Success

// Basic Example
const promises = [
  Promise.reject("Error 1"),
  Promise.resolve("Success!"),
  Promise.reject("Error 2")
];

const result = await Promise.any(promises);
console.log(result);

// All Reject Example
const promises2 = [
  Promise.reject("Error 1"),
  Promise.reject("Error 2"),
  Promise.reject("Error 3")
];

try {
  await Promise.any(promises2);
} catch (error) {
  console.log(error.errors);
  console.log(error instanceof AggregateError);
}