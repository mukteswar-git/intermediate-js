# Week 4: Callbacks & Promises — Complete Tutorial

## 🎯 Goal of This Week
Master asynchronous JavaScript: understand callbacks, promises, and how to handle async operations in real-world scenarios.

**Tools needed:** Node.js or browser console (no Vite required)

---

## 1️⃣ Synchronous vs Asynchronous Code

### 🔹 Synchronous (Blocking)
Code runs line by line, one step at a time.

```javascript
console.log("A");
console.log("B");
console.log("C");
```

**Output:**
```
A
B
C
```

Nothing surprising. Each line waits for the previous one.

### 🔹 Asynchronous (Non-blocking)
Some tasks take time (timers, API calls, file reading). JavaScript does NOT wait for them.

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

**Output:**
```
A
C
B
```

### 🧠 Why?
1. `setTimeout` is async
2. It is sent to Web APIs
3. JS continues executing
4. When time is done → callback is queued → executed later

**✅ Key Rule:** Async code does NOT block JS execution

---

## 2️⃣ Callbacks (The Old Way)

A **callback** is just a function passed into another function.

### Example
```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback("Data received");
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
```

**Output (after 1s):**
```
Data received
```

### 🔹 Why callbacks exist
Because JS can't pause execution — it says: *"I'll call you back later when I'm done."*

---

## 3️⃣ Callback Hell (The Problem)

When async tasks depend on each other:

```javascript
setTimeout(() => {
  console.log("Step 1");

  setTimeout(() => {
    console.log("Step 2");

    setTimeout(() => {
      console.log("Step 3");
    }, 1000);

  }, 1000);

}, 1000);
```

### 📌 Problems:
- Hard to read
- Hard to debug
- Error handling is painful
- Impossible to scale

This is called **callback hell** (or pyramid of doom).

---

## 4️⃣ Promises (The Solution)

A **Promise** represents a value that will be available:
- now
- later
- or never

### Promise States:
- **pending** — initial state
- **fulfilled** (resolved) — operation succeeded
- **rejected** — operation failed

### 🔹 Creating a Promise
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});
```

- `resolve(value)` → success
- `reject(error)` → failure

### 🔹 Consuming a Promise
```javascript
promise
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log("Done");
  });
```

**Output:**
```
Success!
Done
```

---

## 5️⃣ Promise with Error

```javascript
const promise = new Promise((resolve, reject) => {
  const success = false;

  if (success) {
    resolve("All good");
  } else {
    reject("Something went wrong");
  }
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

**Output:**
```
Something went wrong
```

**✅ Rule:**
- `.then()` handles success
- `.catch()` handles failure
- `.finally()` always runs

---

## 6️⃣ Promise Chaining (Very Important)

Instead of nesting callbacks, we chain promises.

### ❌ Bad (callbacks)
```javascript
doA(() => {
  doB(() => {
    doC(() => {});
  });
});
```

### ✅ Good (Promises)
```javascript
doA()
  .then(resultA => doB(resultA))
  .then(resultB => doC(resultB))
  .then(finalResult => console.log(finalResult))
  .catch(error => console.error(error));
```

### Example: Step-by-step Promise Chain
```javascript
function step1() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Step 1 done"), 1000);
  });
}

function step2(message) {
  return new Promise(resolve => {
    setTimeout(() => resolve(message + " → Step 2 done"), 1000);
  });
}

function step3(message) {
  return new Promise(resolve => {
    setTimeout(() => resolve(message + " → Step 3 done"), 1000);
  });
}

step1()
  .then(step2)
  .then(step3)
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

**Output:**
```
Step 1 done → Step 2 done → Step 3 done
```

---

## 7️⃣ Error Handling in Promises

### 🔹 Single .catch() handles ALL errors
```javascript
step1()
  .then(step2)
  .then(() => {
    throw new Error("Oops!");
  })
  .then(step3)
  .catch(error => {
    console.error("Caught:", error.message);
  });
```

**Output:**
```
Caught: Oops!
```

### 🧠 Important
- Any error breaks the chain
- Control jumps directly to `.catch()`
- You can have multiple `.catch()` blocks for specific handling

### Common Mistake: Forgetting to Return
```javascript
// ❌ WRONG
doSomething()
  .then(result => {
    doSomethingElse(result); // Missing return!
  })
  .then(result => {
    console.log(result); // undefined!
  });

// ✅ CORRECT
doSomething()
  .then(result => {
    return doSomethingElse(result);
  })
  .then(result => {
    console.log(result); // Correct value
  });
```

---

## 8️⃣ Promise Static Methods

### 🔹 Promise.all() — Wait for ALL promises
Runs multiple promises in parallel. Resolves when ALL succeed.

```javascript
const p1 = Promise.resolve(3);
const p2 = new Promise(resolve => setTimeout(() => resolve(42), 1000));
const p3 = Promise.resolve("foo");

Promise.all([p1, p2, p3])
  .then(results => {
    console.log(results); // [3, 42, "foo"]
  })
  .catch(error => {
    console.error("One failed:", error);
  });
```

**⚠️ Important:** If ANY promise rejects, the entire `Promise.all()` rejects immediately.

### 🔹 Promise.race() — First to finish wins
```javascript
const slow = new Promise(resolve => setTimeout(() => resolve("slow"), 2000));
const fast = new Promise(resolve => setTimeout(() => resolve("fast"), 500));

Promise.race([slow, fast])
  .then(winner => {
    console.log(winner); // "fast"
  });
```

### 🔹 Promise.allSettled() — Wait for all, regardless of result
Returns results for ALL promises (fulfilled or rejected).

```javascript
const p1 = Promise.resolve("success");
const p2 = Promise.reject("error");
const p3 = Promise.resolve("another success");

Promise.allSettled([p1, p2, p3])
  .then(results => {
    console.log(results);
    // [
    //   { status: "fulfilled", value: "success" },
    //   { status: "rejected", reason: "error" },
    //   { status: "fulfilled", value: "another success" }
    // ]
  });
```

### 🔹 Promise.any() — First successful promise wins
```javascript
const p1 = Promise.reject("error 1");
const p2 = new Promise(resolve => setTimeout(() => resolve("success"), 500));
const p3 = Promise.reject("error 2");

Promise.any([p1, p2, p3])
  .then(first => {
    console.log(first); // "success"
  })
  .catch(error => {
    console.log("All failed:", error);
  });
```

**Summary:**
| Method | Resolves When | Rejects When |
|--------|---------------|--------------|
| `Promise.all()` | All succeed | Any fails |
| `Promise.race()` | First settles | First rejects |
| `Promise.allSettled()` | All settle | Never |
| `Promise.any()` | First succeeds | All fail |

---

## 9️⃣ Real-World Example: Fetch API

The `fetch()` API returns a promise.

```javascript
fetch('https://jsonplaceholder.typicode.com/users/1')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Also returns a promise!
  })
  .then(data => {
    console.log(data.name);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
```

### Chaining Multiple API Calls
```javascript
// Get user, then get their posts
fetch('https://jsonplaceholder.typicode.com/users/1')
  .then(response => response.json())
  .then(user => {
    console.log('User:', user.name);
    return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
  })
  .then(response => response.json())
  .then(posts => {
    console.log('Posts:', posts.length);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

---

## 🔟 Converting Callbacks to Promises

Many old APIs use callbacks. You can wrap them in promises.

### Example: setTimeout as a Promise
```javascript
function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// Usage
delay(2000)
  .then(() => console.log("2 seconds later"));
```

### Example: Node.js fs.readFile
```javascript
const fs = require('fs');

function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Usage
readFilePromise('file.txt')
  .then(content => console.log(content))
  .catch(error => console.error(error));
```

**Note:** Node.js now has built-in promise versions: `fs.promises.readFile()`

---

## 1️⃣1️⃣ Event Loop & Microtasks vs Macrotasks

### Why does this happen?
```javascript
console.log("start");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("end");
```

**Output:**
```
start
end
promise
timeout
```

### 🧠 Explanation:
JavaScript has two task queues:

1. **Microtask Queue** (higher priority)
   - Promises (`.then()`, `.catch()`)
   - `queueMicrotask()`
   - `MutationObserver`

2. **Macrotask Queue** (lower priority)
   - `setTimeout()`
   - `setInterval()`
   - I/O operations

**Execution Order:**
1. Run all synchronous code
2. Run ALL microtasks
3. Run ONE macrotask
4. Repeat from step 2

---

## 1️⃣2️⃣ Common Pitfalls

### ❌ Forgetting to return in .then()
```javascript
getData()
  .then(data => {
    processData(data); // Missing return!
  })
  .then(result => {
    console.log(result); // undefined
  });
```

### ❌ Not handling promise rejections
```javascript
// This causes "Unhandled Promise Rejection" warning
fetch('https://api.example.com/data')
  .then(response => response.json());
  // No .catch()!
```

### ❌ Creating unnecessary promises
```javascript
// ❌ Bad
function getData() {
  return new Promise(resolve => {
    resolve(fetch('https://api.example.com/data'));
  });
}

// ✅ Good
function getData() {
  return fetch('https://api.example.com/data');
}
```

---

## 1️⃣3️⃣ Practice Exercises

### Exercise 1: Predict the Output
```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

Promise.resolve().then(() => {
  console.log("4");
  setTimeout(() => console.log("5"), 0);
});

console.log("6");
```

<details>
<summary>Click for answer</summary>

**Output:**
```
1
6
3
4
2
5
```

**Explanation:**
- Sync: 1, 6
- Microtasks: 3, 4
- Macrotasks: 2, 5
</details>

### Exercise 2: Convert Callback to Promise
```javascript
function getUserData(id, callback) {
  setTimeout(() => {
    callback(null, { id, name: "John" });
  }, 1000);
}
```

**Your task:** Convert to promise-based function.

<details>
<summary>Click for solution</summary>

```javascript
function getUserData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id, name: "John" });
    }, 1000);
  });
}

// Usage
getUserData(1)
  .then(user => console.log(user))
  .catch(err => console.error(err));
```
</details>

### Exercise 3: Promise.all() Practice
Create three promises that resolve after 1s, 2s, and 3s. Use `Promise.all()` to wait for all of them and log "All done!".

<details>
<summary>Click for solution</summary>

```javascript
const p1 = new Promise(resolve => setTimeout(() => resolve("1s"), 1000));
const p2 = new Promise(resolve => setTimeout(() => resolve("2s"), 2000));
const p3 = new Promise(resolve => setTimeout(() => resolve("3s"), 3000));

Promise.all([p1, p2, p3])
  .then(results => {
    console.log(results); // ["1s", "2s", "3s"]
    console.log("All done!");
  });
```
</details>

### Exercise 4: Chain API Calls
Using `fetch()`, get a user from `/users/1`, then get their todos from `/todos?userId=1`.

<details>
<summary>Click for solution</summary>

```javascript
fetch('https://jsonplaceholder.typicode.com/users/1')
  .then(response => response.json())
  .then(user => {
    console.log('User:', user.name);
    return fetch(`https://jsonplaceholder.typicode.com/todos?userId=${user.id}`);
  })
  .then(response => response.json())
  .then(todos => {
    console.log('Todos count:', todos.length);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```
</details>

### Exercise 5: Error Handling Challenge
Create a promise chain where the second promise fails. Handle the error and continue the chain.

<details>
<summary>Click for solution</summary>

```javascript
Promise.resolve("Step 1")
  .then(result => {
    console.log(result);
    throw new Error("Step 2 failed!");
  })
  .catch(error => {
    console.error("Caught:", error.message);
    return "Recovered"; // Continue chain
  })
  .then(result => {
    console.log("Step 3:", result);
  });
```

**Output:**
```
Step 1
Caught: Step 2 failed!
Step 3: Recovered
```
</details>

---

## 1️⃣4️⃣ Summary Table

| Concept | Key Takeaway |
|---------|--------------|
| **Callbacks** | Functions passed to other functions |
| **Callback Hell** | Nested callbacks = unreadable code |
| **Promises** | Object representing future value |
| **Promise States** | pending → fulfilled/rejected |
| **.then()** | Handle success |
| **.catch()** | Handle errors |
| **.finally()** | Always runs |
| **Promise.all()** | Wait for all, fail if any fails |
| **Promise.race()** | First to finish wins |
| **Promise.allSettled()** | Wait for all, never fails |
| **Promise.any()** | First success wins |
| **Microtasks** | Promises (high priority) |
| **Macrotasks** | setTimeout (low priority) |

---

## 1️⃣5️⃣ Next Steps

Once you master promises, learn:
1. **async/await** (Week 5) — cleaner syntax for promises
2. **Error boundaries** — handling async errors in production
3. **Concurrency patterns** — throttling, debouncing, retries

---

## 📚 Additional Resources

- [MDN Promises Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [JavaScript.info: Promises](https://javascript.info/promise-basics)
- [You Don't Know JS: Async & Performance](https://github.com/getify/You-Dont-Know-JS)

---

**🎉 Congratulations!** You now understand callbacks and promises deeply. Practice the exercises until they feel natural.