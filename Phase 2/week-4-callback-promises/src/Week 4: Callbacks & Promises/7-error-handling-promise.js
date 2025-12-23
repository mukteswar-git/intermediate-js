// Error Handling in Promises

function step1() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Step 1 done"), 1000);
  });
}

function step2(message) {
  return new Promise(resolve => {
    setTimeout(() => resolve(message + " -> Step 2 done"), 1000);
  });
}

function step3(message) {
  return new Promise(resolve => {
    setTimeout(() => resolve(message + " -> Step 3 done"), 1000);
  });
}

step1()
  .then(step2)
  .then(() => {
    throw new Error("Oops!");
  })
  .then(step3)
  .catch(error => {
    console.error("Caught:", error.message);
  });