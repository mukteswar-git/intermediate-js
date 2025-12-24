# Week 5: Async/Await & Event Loop

> **The week JavaScript finally "clicks"**  
> Read slowly. Run every example. Don't skip the exercises.

---

## 🎯 Goals for This Week

By the end of Week 5, you will be able to:

- ✅ Write asynchronous code that reads like synchronous code
- ✅ Handle errors in async flows confidently
- ✅ Predict execution order in tricky async scenarios
- ✅ Explain the Event Loop like a senior developer
- ✅ Debug async bugs without panic

---

## 📚 Table of Contents

1. [async/await Fundamentals](#1-asyncawait-fundamentals)
2. [Rewriting Promises with async/await](#2-rewriting-promises-with-asyncawait)
3. [Error Handling with try/catch](#3-error-handling-with-trycatch)
4. [Sequential vs Parallel Execution](#4-sequential-vs-parallel-execution)
5. [The JavaScript Event Loop](#5-the-javascript-event-loop)
6. [Execution Order](#6-execution-order-very-important)
7. [Task Queues Explained](#7-task-queues-explained)
8. [setTimeout vs setInterval](#8-settimeout-vs-setinterval)
9. [async/await with Loops](#9-asyncawait-with-loops)
10. [Predict-the-Output Challenges](#10-predict-the-output-challenges)
11. [Mini Project: Async Task Runner](#11-mini-project-async-task-runner)
12. [Real-World Example](#12-real-world-example)
13. [Common Pitfalls & Debugging](#13-common-pitfalls--debugging)
14. [Week 5 Checklist](#14-week-5-checklist)

---

## 1. async/await Fundamentals

### What `async` Does

- Marks a function as asynchronous
- **Always** returns a Promise (even if you return a plain value)

```javascript
async function getData() {
  return "Hello";
}

getData().then(console.log); // "Hello"
```

**Equivalent to:**

```javascript
function getData() {
  return Promise.resolve("Hello");
}
```

### What `await` Does

- Pauses execution **inside** the async function
- Waits for a Promise to resolve or reject
- Can only be used inside `async` functions

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Start");
  await delay(1000);
  console.log("End");
}

run();
```

**Output:**
```
Start
(1 second delay)
End
```

### 📌 Important Notes

- `await` does **not** block JavaScript entirely
- It only pauses the **current** async function
- Other code continues to execute normally

---

## 2. Rewriting Promises with async/await

### ❌ Promise Chain (Old Way)

```javascript
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### ✅ Async/Await Version (Better)

```javascript
async function fetchData() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

**Why it's better:**
- ✔ Easier to read
- ✔ Easier to debug (you can set breakpoints)
- ✔ Easier to reason about (looks like sync code)

---

## 3. Error Handling with try/catch

### Why try/catch Is Mandatory

```javascript
async function example() {
  const res = await fetch("invalid-url"); // ❌ This will reject
}
```

☠️ **This causes an unhandled promise rejection!**

### ✅ Correct Way

```javascript
async function example() {
  try {
    const res = await fetch("invalid-url");
    const data = await res.json();
  } catch (error) {
    console.log("Error caught:", error.message);
  }
}
```

### 📌 Rule

- `try/catch` handles **rejected Promises**
- It does **NOT** catch syntax errors outside async execution
- Always wrap `await` calls in try/catch blocks

---

## 4. Sequential vs Parallel Execution

### ❌ Sequential (Slow)

```javascript
const a = await fetch(url1); // Wait for url1
const b = await fetch(url2); // Then wait for url2
```

⏱ **Total time = url1 time + url2 time**

### ✅ Parallel (Correct)

```javascript
const [a, b] = await Promise.all([
  fetch(url1),
  fetch(url2)
]);
```

⏱ **Total time = max(url1 time, url2 time)**

### Promise.all vs Promise.race

```javascript
// Promise.all - Wait for ALL to complete
const results = await Promise.all([promise1, promise2, promise3]);

// Promise.race - Return when FIRST completes
const fastest = await Promise.race([promise1, promise2, promise3]);
```

### 📌 Senior Rule

**Use `await` only when there's a dependency**

```javascript
// Bad - no dependency, but sequential
const user = await getUser();
const posts = await getPosts(); // Doesn't need user data

// Good - parallel
const [user, posts] = await Promise.all([
  getUser(),
  getPosts()
]);

// Good - sequential (has dependency)
const user = await getUser();
const userPosts = await getPostsByUserId(user.id); // Needs user.id
```

---

## 5. The JavaScript Event Loop

**This is where most confusion happens—read carefully.**

### JavaScript Has:

1. **One Call Stack** (executes code)
2. **Multiple Queues** (stores callbacks)

### The Event Loop Process

```
┌─────────────────────────────┐
│    Call Stack (Sync Code)   │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│  Microtask Queue (Promises) │ ← High Priority
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│ Macrotask Queue (Timers)    │ ← Low Priority
└─────────────────────────────┘
```

---

## 6. Execution Order (VERY IMPORTANT)

### Example

```javascript
console.log("start");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("end");
```

### Output

```
start
end
promise
timeout
```

### Why This Order?

1. **Synchronous code runs first** → `start`, `end`
2. **Microtasks run next** → `promise`
3. **Macrotasks run last** → `timeout`

---

## 7. Task Queues Explained

### 🔹 Call Stack

- Executes synchronous code
- One function at a time
- LIFO (Last In, First Out)

### 🔹 Microtask Queue (HIGH Priority)

**Runs after stack is empty, before timers**

Includes:
- `Promise.then`
- `Promise.catch`
- `Promise.finally`
- `queueMicrotask()`
- `MutationObserver`

### 🔹 Macrotask Queue (LOW Priority)

Includes:
- `setTimeout`
- `setInterval`
- `setImmediate` (Node.js)
- I/O events
- UI rendering

### Execution Cycle

```
1. Run all sync code (Call Stack)
2. Run ALL microtasks (until queue is empty)
3. Run ONE macrotask
4. Repeat from step 2
```

---

## 8. setTimeout vs setInterval

### setTimeout (Runs Once)

```javascript
setTimeout(() => {
  console.log("Runs once after 1 second");
}, 1000);
```

### setInterval (Runs Repeatedly)

```javascript
const id = setInterval(() => {
  console.log("Runs every second");
}, 1000);

// Stop it
clearInterval(id);
```

### ⚠️ Danger with setInterval

If the callback takes longer than the interval, calls can stack up:

```javascript
setInterval(() => {
  // If this takes 1500ms, but interval is 1000ms
  // next call starts before this one finishes!
}, 1000);
```

### ✅ Better Pattern: Recursive setTimeout

```javascript
function tick() {
  console.log("tick");
  // Next call waits until this one completes
  setTimeout(tick, 1000);
}
tick();
```

---

## 9. async/await with Loops

### ❌ forEach Doesn't Work

```javascript
const urls = [url1, url2, url3];

// This doesn't wait!
urls.forEach(async (url) => {
  const data = await fetch(url);
  console.log(data);
});

console.log("Done"); // Prints immediately!
```

### ✅ Use for...of

```javascript
const urls = [url1, url2, url3];

for (const url of urls) {
  const data = await fetch(url); // Waits for each
  console.log(data);
}

console.log("Done"); // Prints after all finish
```

### ✅ Use map + Promise.all (Parallel)

```javascript
const urls = [url1, url2, url3];

const promises = urls.map(url => fetch(url));
const results = await Promise.all(promises);

console.log("Done", results);
```

---

## 10. Predict-the-Output Challenges

### Challenge 1

```javascript
console.log(1);

setTimeout(() => console.log(2), 0);

Promise.resolve().then(() => {
  console.log(3);
  setTimeout(() => console.log(4), 0);
});

console.log(5);
```

<details>
<summary>Click for answer</summary>

**Output:**
```
1
5
3
2
4
```

**Explanation:**
1. `1` and `5` are sync → print immediately
2. `3` is a microtask → runs before any macrotasks
3. `2` is the first macrotask → runs next
4. `4` is queued after `3` runs → runs last

</details>

### Challenge 2

```javascript
async function test() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

console.log("C");
test();
console.log("D");
```

<details>
<summary>Click for answer</summary>

**Output:**
```
C
A
D
B
```

**Explanation:**
1. `C` is sync → prints first
2. `test()` is called, `A` prints (sync part of async function)
3. `await` pauses the function, `D` prints (sync code continues)
4. `B` prints (microtask from await)

</details>

### Challenge 3

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout 1");
  Promise.resolve().then(() => console.log("Promise in Timeout"));
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
  setTimeout(() => console.log("Timeout in Promise"), 0);
});

console.log("End");
```

<details>
<summary>Click for answer</summary>

**Output:**
```
Start
End
Promise 1
Timeout 1
Promise in Timeout
Timeout in Promise
```

</details>

---

## 11. Mini Project: Async Task Runner

### 🎯 Requirements

Build a class that:
- Accepts tasks (functions returning promises)
- Executes them sequentially
- Handles failures gracefully
- Logs results

### Solution

```javascript
class TaskRunner {
  constructor() {
    this.queue = [];
  }

  add(task) {
    this.queue.push(task);
  }

  async run() {
    for (const task of this.queue) {
      try {
        const result = await task();
        console.log("✓ Done:", result);
      } catch (e) {
        console.error("✗ Failed:", e.message);
      }
    }
  }
}
```

### Test It

```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const runner = new TaskRunner();

runner.add(() => delay(500).then(() => "Task 1"));
runner.add(() => Promise.reject(new Error("Boom")));
runner.add(() => delay(300).then(() => "Task 3"));

runner.run();
```

**Expected Output:**
```
✓ Done: Task 1
✗ Failed: Boom
✓ Done: Task 3
```

### 🏆 Bonus Challenge

Extend `TaskRunner` to:
- Support parallel execution
- Add a `maxConcurrent` limit
- Return all results as an array

---

## 12. Real-World Example

### Fetching User Data with Dependencies

```javascript
async function getUserDashboard(userId) {
  try {
    // Step 1: Get user info
    const user = await fetch(`/api/users/${userId}`).then(r => r.json());
    console.log("User:", user.name);

    // Step 2: Get user's posts (depends on user)
    const posts = await fetch(`/api/posts?userId=${user.id}`).then(r => r.json());
    console.log("Posts:", posts.length);

    // Step 3: Get comments for all posts (can be parallel)
    const commentPromises = posts.map(post => 
      fetch(`/api/comments?postId=${post.id}`).then(r => r.json())
    );
    const comments = await Promise.all(commentPromises);
    
    return { user, posts, comments: comments.flat() };
  } catch (error) {
    console.error("Dashboard error:", error);
    throw error;
  }
}
```

---

## 13. Common Pitfalls & Debugging

### 🐛 Pitfall 1: Forgetting await

```javascript
// Wrong
async function getData() {
  const data = fetch(url); // ❌ Missing await
  console.log(data); // Promise object, not data!
}

// Correct
async function getData() {
  const data = await fetch(url);
  console.log(data); // Actual response
}
```

### 🐛 Pitfall 2: Not Returning from async Functions

```javascript
// Wrong
async function process() {
  const result = await compute();
  // ❌ Forgot to return
}

// Correct
async function process() {
  const result = await compute();
  return result; // ✓
}
```

### 🐛 Pitfall 3: Mixing Callbacks and Promises

```javascript
// Wrong - don't mix patterns
async function bad() {
  fetch(url).then(res => {
    return res.json(); // ❌ Not awaiting
  });
}

// Correct - choose one pattern
async function good() {
  const res = await fetch(url);
  return await res.json();
}
```

### 🔧 Debugging Tips

```javascript
// Use console.trace() to see the call stack
async function debug() {
  console.trace("Where am I?");
  await something();
}

// Add labels to your promises
const result = await fetch(url)
  .then(r => {
    console.log("Fetch completed");
    return r.json();
  });

// Use try/catch with logging
try {
  const data = await riskyOperation();
} catch (error) {
  console.error("Operation failed:", error.message);
  console.error("Stack:", error.stack);
}
```

---

## 14. Week 5 Checklist

### Before moving to Week 6, you MUST be able to:

- [ ] Explain what `async` and `await` actually do
- [ ] Rewrite `.then()` chains using async/await
- [ ] Handle errors with try/catch confidently
- [ ] Explain why promises run before timeouts
- [ ] Predict execution order in the challenges above
- [ ] Know when to use `Promise.all` vs sequential await
- [ ] Understand the difference between microtasks and macrotasks
- [ ] Complete the TaskRunner project
- [ ] Debug async bugs without panic

### 🎓 Self-Test

Can you explain this to someone else?

```javascript
async function mystery() {
  console.log(1);
  const result = await Promise.resolve(2);
  console.log(result);
  return 3;
}

console.log(4);
mystery().then(console.log);
console.log(5);
```

**If you can predict the output (4, 1, 5, 2, 3) and explain WHY, you're ready for Week 6.**

---

## 📖 Additional Resources

- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [JavaScript.info: async/await](https://javascript.info/async-await)
- [Jake Archibald: In The Loop (Video)](https://www.youtube.com/watch?v=cCOL7MC4Pl0)

---

## ⏭ Next Week

**Week 6:** Modules, ES6+ Features & Project Setup

You'll learn:
- ES6 Modules (import/export)
- Destructuring, Spread/Rest operators
- Template literals, optional chaining
- Setting up a real JavaScript project

---

**Remember:** Don't just read this. Type every example. Run them. Break them. Fix them. That's how you learn.

Good luck! 🚀