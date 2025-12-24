# Week 6: Advanced Async Patterns

> **Master Promise combinators and async iteration**  
> This week separates junior from senior async developers.

---

## 🎯 Goals for This Week

By the end of Week 6, you will be able to:

- ✅ Choose the right Promise combinator for any scenario
- ✅ Build complex parallel and sequential async flows
- ✅ Handle partial failures gracefully
- ✅ Work with async iterators and generators
- ✅ Optimize performance in async operations
- ✅ Debug race conditions and timing issues

---

## 📚 Table of Contents

1. [Promise Combinators Overview](#1-promise-combinators-overview)
2. [Promise.all() - All or Nothing](#2-promiseall---all-or-nothing)
3. [Promise.race() - First to Finish](#3-promiserace---first-to-finish)
4. [Promise.allSettled() - Wait for All Results](#4-promiseallsettled---wait-for-all-results)
5. [Promise.any() - First Success](#5-promiseany---first-success)
6. [Choosing the Right Combinator](#6-choosing-the-right-combinator)
7. [Sequential vs Parallel Patterns](#7-sequential-vs-parallel-patterns)
8. [Async Iterators](#8-async-iterators)
9. [Async Generators](#9-async-generators)
10. [Real-World Patterns](#10-real-world-patterns)
11. [Performance Optimization](#11-performance-optimization)
12. [Advanced Project](#12-advanced-project)
13. [Common Pitfalls](#13-common-pitfalls)
14. [Week 6 Checklist](#14-week-6-checklist)

---

## 1. Promise Combinators Overview

JavaScript provides 4 main Promise combinators:

| Combinator | Resolves When | Rejects When | Use Case |
|------------|---------------|--------------|----------|
| `Promise.all()` | **All** resolve | **Any** rejects | All must succeed |
| `Promise.race()` | **First** settles | **First** rejects | Need fastest result |
| `Promise.allSettled()` | **All** settle | **Never** | Need all results |
| `Promise.any()` | **First** resolves | **All** reject | Need one success |

---

## 2. Promise.all() - All or Nothing

### What It Does

- Waits for **ALL** promises to resolve
- Returns an array of results **in order**
- **Fails fast** - rejects immediately if any promise rejects

### Basic Example

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve(42), 100));
const promise3 = Promise.resolve("foo");

const results = await Promise.all([promise1, promise2, promise3]);
console.log(results); // [3, 42, "foo"]
```

### Real-World Example: Fetching Multiple APIs

```javascript
async function loadDashboard() {
  try {
    const [user, posts, comments] = await Promise.all([
      fetch('/api/user/1').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/comments').then(r => r.json())
    ]);
    
    return { user, posts, comments };
  } catch (error) {
    console.error("One of the requests failed:", error);
    throw error;
  }
}
```

### ⚠️ Important Behavior

```javascript
const promises = [
  Promise.resolve(1),
  Promise.reject("Error!"),
  Promise.resolve(3)
];

try {
  await Promise.all(promises);
} catch (error) {
  console.log(error); // "Error!"
  // Promise 3 still runs, but result is ignored
}
```

**Key Points:**
- ✅ Returns results in the **same order** as input (not completion order)
- ❌ Stops at **first rejection**
- ⚡ All promises run in **parallel**

### When to Use

- All operations **must** succeed for the result to be valid
- You need results from **all** operations
- Example: Loading required data for a page

---

## 3. Promise.race() - First to Finish

### What It Does

- Returns the **first** promise to settle (resolve or reject)
- Ignores all other promises
- Useful for timeouts and fallbacks

### Basic Example

```javascript
const slow = new Promise(resolve => setTimeout(() => resolve("slow"), 1000));
const fast = new Promise(resolve => setTimeout(() => resolve("fast"), 100));

const result = await Promise.race([slow, fast]);
console.log(result); // "fast"
```

### Real-World Example: Request Timeout

```javascript
function timeout(ms) {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const result = await Promise.race([
      fetch(url).then(r => r.json()),
      timeout(ms)
    ]);
    return result;
  } catch (error) {
    if (error.message === "Timeout") {
      console.error("Request timed out");
    }
    throw error;
  }
}

// Usage
const data = await fetchWithTimeout('/api/data', 3000);
```

### Real-World Example: Fallback Servers

```javascript
async function fetchFromMultipleServers(path) {
  const servers = [
    'https://api1.example.com',
    'https://api2.example.com',
    'https://api3.example.com'
  ];
  
  const promises = servers.map(server => 
    fetch(`${server}${path}`).then(r => r.json())
  );
  
  // Return data from fastest responding server
  return await Promise.race(promises);
}
```

### When to Use

- Implementing **timeouts**
- Using **fallback servers**
- Racing between **cache and network**
- Need the **fastest** result

---

## 4. Promise.allSettled() - Wait for All Results

### What It Does

- Waits for **ALL** promises to settle
- **Never rejects** - always resolves
- Returns array of objects with `status` and `value`/`reason`

### Basic Example

```javascript
const promises = [
  Promise.resolve(1),
  Promise.reject("Error!"),
  Promise.resolve(3)
];

const results = await Promise.allSettled(promises);
console.log(results);
/*
[
  { status: "fulfilled", value: 1 },
  { status: "rejected", reason: "Error!" },
  { status: "fulfilled", value: 3 }
]
*/
```

### Real-World Example: Batch Operations

```javascript
async function updateMultipleRecords(records) {
  const updatePromises = records.map(record => 
    fetch(`/api/records/${record.id}`, {
      method: 'PUT',
      body: JSON.stringify(record)
    })
  );
  
  const results = await Promise.allSettled(updatePromises);
  
  const succeeded = results.filter(r => r.status === "fulfilled").length;
  const failed = results.filter(r => r.status === "rejected").length;
  
  console.log(`Updated: ${succeeded}, Failed: ${failed}`);
  
  // Return failed records for retry
  return results
    .map((result, index) => ({ result, record: records[index] }))
    .filter(({ result }) => result.status === "rejected")
    .map(({ record, result }) => ({ 
      record, 
      error: result.reason 
    }));
}
```

### Real-World Example: Image Upload with Previews

```javascript
async function uploadImages(files) {
  const uploadPromises = files.map(file => uploadImage(file));
  const results = await Promise.allSettled(uploadPromises);
  
  const successful = [];
  const failed = [];
  
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      successful.push({
        file: files[index],
        url: result.value
      });
    } else {
      failed.push({
        file: files[index],
        error: result.reason.message
      });
    }
  });
  
  return { successful, failed };
}
```

### When to Use

- You need results from **all** operations regardless of success/failure
- Implementing **batch operations** with partial failures
- Want to **report on each** operation
- Example: Sending emails, updating multiple records

---

## 5. Promise.any() - First Success

### What It Does

- Returns the **first** promise to **resolve**
- Ignores rejected promises
- Rejects only if **ALL** promises reject (AggregateError)

### Basic Example

```javascript
const promises = [
  Promise.reject("Error 1"),
  Promise.resolve("Success!"),
  Promise.reject("Error 2")
];

const result = await Promise.any(promises);
console.log(result); // "Success!"
```

### All Reject Example

```javascript
const promises = [
  Promise.reject("Error 1"),
  Promise.reject("Error 2"),
  Promise.reject("Error 3")
];

try {
  await Promise.any(promises);
} catch (error) {
  console.log(error.errors); // ["Error 1", "Error 2", "Error 3"]
  console.log(error instanceof AggregateError); // true
}
```

### Real-World Example: Redundant API Calls

```javascript
async function fetchFromAnySource(endpoint) {
  const sources = [
    fetch(`https://api1.com${endpoint}`),
    fetch(`https://api2.com${endpoint}`),
    fetch(`https://api3.com${endpoint}`)
  ];
  
  try {
    const response = await Promise.any(sources);
    return await response.json();
  } catch (error) {
    console.error("All sources failed:", error.errors);
    throw new Error("All API sources are down");
  }
}
```

### Real-World Example: Cache + Multiple CDNs

```javascript
async function loadResource(path) {
  const cache = loadFromCache(path);
  const cdn1 = fetch(`https://cdn1.example.com${path}`);
  const cdn2 = fetch(`https://cdn2.example.com${path}`);
  
  // Return first successful result (cache or CDN)
  const response = await Promise.any([cache, cdn1, cdn2]);
  return response;
}
```

### When to Use

- Multiple **redundant sources**
- Fallback strategies
- Need **one success**, don't care which
- Example: Fetching from multiple CDNs

---

## 6. Choosing the Right Combinator

### Decision Tree

```
Need all results?
├─ Yes
│  ├─ All must succeed?
│  │  ├─ Yes → Promise.all()
│  │  └─ No  → Promise.allSettled()
│  └─ ...
└─ No
   ├─ Need first success?
   │  ├─ Yes → Promise.any()
   │  └─ No  → Promise.race()
   └─ ...
```

### Comparison Table

```javascript
// Scenario 1: Loading required resources
// Use Promise.all() - all must succeed
const [css, js, fonts] = await Promise.all([
  loadCSS(),
  loadJS(),
  loadFonts()
]);

// Scenario 2: Fastest server wins
// Use Promise.race() - first to finish
const data = await Promise.race([
  fetchFromServer1(),
  fetchFromServer2()
]);

// Scenario 3: Batch email sending
// Use Promise.allSettled() - need all results
const results = await Promise.allSettled(
  emails.map(sendEmail)
);

// Scenario 4: Redundant APIs
// Use Promise.any() - first success wins
const data = await Promise.any([
  fetchFromAPI1(),
  fetchFromAPI2(),
  fetchFromAPI3()
]);
```

---

## 7. Sequential vs Parallel Patterns

### Pattern 1: Fully Sequential

```javascript
// One after another (slowest)
async function sequential(urls) {
  const results = [];
  
  for (const url of urls) {
    const data = await fetch(url).then(r => r.json());
    results.push(data);
  }
  
  return results;
}

// Total time = sum of all requests
```

**Use when:** Each request depends on the previous result

### Pattern 2: Fully Parallel

```javascript
// All at once (fastest)
async function parallel(urls) {
  const promises = urls.map(url => 
    fetch(url).then(r => r.json())
  );
  
  return await Promise.all(promises);
}

// Total time = longest single request
```

**Use when:** Requests are independent

### Pattern 3: Batched Parallel (Controlled Concurrency)

```javascript
async function batchParallel(urls, batchSize = 3) {
  const results = [];
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(url => fetch(url).then(r => r.json()))
    );
    results.push(...batchResults);
  }
  
  return results;
}

// Limits concurrent requests
```

**Use when:** API rate limits exist or memory is limited

### Pattern 4: Parallel with Dependencies

```javascript
async function parallelWithDeps() {
  // Step 1: Independent requests run in parallel
  const [user, settings] = await Promise.all([
    fetchUser(),
    fetchSettings()
  ]);
  
  // Step 2: Dependent requests (need user.id)
  const [posts, friends] = await Promise.all([
    fetchPosts(user.id),
    fetchFriends(user.id)
  ]);
  
  return { user, settings, posts, friends };
}
```

**Use when:** Some requests depend on others

### Pattern 5: Racing with Fallback

```javascript
async function fetchWithFallback() {
  try {
    // Try fast cache first
    return await Promise.race([
      fetchFromCache(),
      timeout(100) // 100ms timeout
    ]);
  } catch {
    // Fallback to network
    return await fetchFromNetwork();
  }
}
```

**Use when:** You have a fast cache with network fallback

---

## 8. Async Iterators

### What Are Async Iterators?

Objects that implement the async iteration protocol using `Symbol.asyncIterator`.

### Basic Async Iterator

```javascript
const asyncIterable = {
  async *[Symbol.asyncIterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
};

// Consume with for-await-of
for await (const value of asyncIterable) {
  console.log(value);
}
// Output: 1, 2, 3
```

### Real-World Example: Paginated API

```javascript
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    
    yield data.items;
    
    hasMore = data.hasNextPage;
    page++;
  }
}

// Usage
for await (const items of fetchPages('/api/posts')) {
  console.log(`Got ${items.length} items`);
  // Process items...
}
```

### Real-World Example: Streaming Data

```javascript
async function* readLargeFile(filename) {
  const chunkSize = 1024;
  let offset = 0;
  
  while (true) {
    const chunk = await readChunk(filename, offset, chunkSize);
    
    if (chunk.length === 0) break;
    
    yield chunk;
    offset += chunk.length;
  }
}

// Usage
for await (const chunk of readLargeFile('large.txt')) {
  processChunk(chunk);
}
```

### for-await-of Loop

```javascript
const promises = [
  delay(100).then(() => 1),
  delay(200).then(() => 2),
  delay(50).then(() => 3)
];

// Processes in completion order
for await (const value of promises) {
  console.log(value);
}
// Output: 3, 1, 2 (based on completion time)
```

---

## 9. Async Generators

### Basic Async Generator

```javascript
async function* generateNumbers() {
  for (let i = 1; i <= 3; i++) {
    await delay(1000);
    yield i;
  }
}

// Usage
const gen = generateNumbers();
console.log(await gen.next()); // { value: 1, done: false }
console.log(await gen.next()); // { value: 2, done: false }
console.log(await gen.next()); // { value: 3, done: false }
console.log(await gen.next()); // { value: undefined, done: true }
```

### Real-World Example: Live Updates

```javascript
async function* pollForUpdates(endpoint, interval = 5000) {
  while (true) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      yield data;
    } catch (error) {
      yield { error: error.message };
    }
    
    await delay(interval);
  }
}

// Usage
for await (const update of pollForUpdates('/api/status')) {
  if (update.error) {
    console.error('Polling error:', update.error);
  } else {
    console.log('Status:', update);
  }
  
  // Break on some condition
  if (update.complete) break;
}
```

### Real-World Example: Rate-Limited Queue

```javascript
async function* rateLimitedFetch(urls, requestsPerSecond = 5) {
  const delay = 1000 / requestsPerSecond;
  
  for (const url of urls) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      yield { url, data, error: null };
    } catch (error) {
      yield { url, data: null, error: error.message };
    }
    
    // Ensure minimum delay between requests
    const elapsed = Date.now() - startTime;
    if (elapsed < delay) {
      await new Promise(resolve => setTimeout(resolve, delay - elapsed));
    }
  }
}

// Usage
const urls = ['url1', 'url2', 'url3', /*...*/];
for await (const result of rateLimitedFetch(urls)) {
  if (result.error) {
    console.error(`Failed ${result.url}:`, result.error);
  } else {
    console.log(`Success ${result.url}`);
  }
}
```

---

## 10. Real-World Patterns

### Pattern 1: Retry with Exponential Backoff

```javascript
async function retry(fn, maxAttempts = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
const data = await retry(() => fetch('/api/data').then(r => r.json()));
```

### Pattern 2: Parallel with Limit (Pool)

```javascript
async function parallelLimit(tasks, limit) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return await Promise.all(results);
}

// Usage
const tasks = urls.map(url => () => fetch(url));
const results = await parallelLimit(tasks, 3); // Max 3 concurrent
```

### Pattern 3: Debounced Async Function

```javascript
function debounceAsync(fn, delay = 300) {
  let timeoutId;
  let latestResolve;
  
  return function(...args) {
    return new Promise((resolve) => {
      if (timeoutId) clearTimeout(timeoutId);
      
      latestResolve = resolve;
      
      timeoutId = setTimeout(async () => {
        const result = await fn.apply(this, args);
        latestResolve(result);
      }, delay);
    });
  };
}

// Usage
const searchAPI = debounceAsync(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return await response.json();
}, 500);

// Only the last call within 500ms executes
await searchAPI('hello');
```

### Pattern 4: Cache with TTL

```javascript
class AsyncCache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  async get(key, fetchFn) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.value;
    }
    
    const value = await fetchFn();
    this.cache.set(key, { value, timestamp: Date.now() });
    
    return value;
  }
  
  clear() {
    this.cache.clear();
  }
}

// Usage
const cache = new AsyncCache(5000); // 5 second TTL

const userData = await cache.get('user:123', () => 
  fetch('/api/user/123').then(r => r.json())
);
```

---

## 11. Performance Optimization

### Tip 1: Avoid Sequential When Possible

```javascript
// ❌ Slow (600ms total)
const user = await fetchUser();     // 200ms
const posts = await fetchPosts();   // 200ms
const friends = await fetchFriends(); // 200ms

// ✅ Fast (200ms total)
const [user, posts, friends] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchFriends()
]);
```

### Tip 2: Early Return Pattern

```javascript
async function getOptionalData(userId) {
  const user = await fetchUser(userId);
  
  // Early return if user not found
  if (!user) return null;
  
  // Only fetch if user exists
  const [posts, comments] = await Promise.all([
    fetchPosts(user.id),
    fetchComments(user.id)
  ]);
  
  return { user, posts, comments };
}
```

### Tip 3: Streaming Large Datasets

```javascript
async function processLargeDataset(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    // Process chunk immediately (don't wait for full download)
    processChunk(value);
  }
}
```

### Tip 4: Request Deduplication

```javascript
class RequestDeduplicator {
  constructor() {
    this.pending = new Map();
  }
  
  async fetch(key, fetchFn) {
    // Return existing promise if already in flight
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }
    
    const promise = fetchFn()
      .finally(() => this.pending.delete(key));
    
    this.pending.set(key, promise);
    return promise;
  }
}

const deduplicator = new RequestDeduplicator();

// Both calls return same promise
const p1 = deduplicator.fetch('user:1', () => fetchUser(1));
const p2 = deduplicator.fetch('user:1', () => fetchUser(1));
// Only 1 actual request is made
```

---

## 12. Advanced Project

### 🎯 Project: Smart Data Loader

Build a class that intelligently loads data with:
- Automatic retry with backoff
- Concurrent request limiting
- Caching with TTL
- Timeout handling
- Progress reporting

```javascript
class SmartDataLoader {
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 3;
    this.retryAttempts = options.retryAttempts || 3;
    this.timeout = options.timeout || 5000;
    this.cacheTTL = options.cacheTTL || 60000;
    this.cache = new Map();
    this.queue = [];
    this.activeCount = 0;
  }
  
  async load(url) {
    // Check cache first
    const cached = this.getCached(url);
    if (cached) return cached;
    
    // Add to queue
    return new Promise((resolve, reject) => {
      this.queue.push({ url, resolve, reject });
      this.processQueue();
    });
  }
  
  async loadMany(urls, onProgress) {
    let completed = 0;
    
    const promises = urls.map(async (url) => {
      try {
        const result = await this.load(url);
        completed++;
        if (onProgress) onProgress(completed, urls.length);
        return { url, result, error: null };
      } catch (error) {
        completed++;
        if (onProgress) onProgress(completed, urls.length);
        return { url, result: null, error: error.message };
      }
    });
    
    return await Promise.allSettled(promises);
  }
  
  getCached(url) {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.value;
    }
    return null;
  }
  
  async processQueue() {
    if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }
    
    const { url, resolve, reject } = this.queue.shift();
    this.activeCount++;
    
    try {
      const result = await this.fetchWithRetry(url);
      this.cache.set(url, { value: result, timestamp: Date.now() });
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.activeCount--;
      this.processQueue();
    }
  }
  
  async fetchWithRetry(url, attempt = 1) {
    try {
      return await this.fetchWithTimeout(url);
    } catch (error) {
      if (attempt >= this.retryAttempts) throw error;
      
      const delay = 1000 * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.fetchWithRetry(url, attempt + 1);
    }
  }
  
  async fetchWithTimeout(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }
  
  clearCache() {
    this.cache.clear();
  }
}

// Usage
const loader = new SmartDataLoader({
  maxConcurrent: 5,
  retryAttempts: 3,
  timeout: 5000,
  cacheTTL: 60000
});

const urls = [
  '/api/users/1',
  '/api/users/2',
  // ... more URLs
];

const results = await loader.loadMany(urls, (completed, total) => {
  console.log(`Progress: ${completed}/${total}`);
});

console.log(results);
```

### 🏆 Bonus Challenges

1. Add priority queue support
2. Implement request cancellation
3. Add circuit breaker pattern
4. Support batch requests (combine multiple URLs into one request)
5. Add metrics collection (success rate, average time, etc.)

---

## 13. Common Pitfalls

### 🐛 Pitfall 1: Not Handling Partial Failures

```javascript
// ❌ Bad - one failure ruins everything
try {
  const results = await Promise.all(promises);
} catch (error) {
  // All results are lost!
}

// ✅ Good - handle partial failures
const results = await Promise.allSettled(promises);
const successful = results.filter(r => r.status === "fulfilled");
const failed = results.filter(r => r.status === "rejected");
```

### 🐛 Pitfall 2: Creating Promises in Loop

```javascript
// ❌ Bad - promises execute immediately
const promises = [];
for (let i = 0; i < 10; i++) {
  promises.push(fetch(urls[i])); // All start immediately!
}

// ✅ Good - create promise factories
const tasks = [];
for (let i = 0; i < 10; i++) {
  tasks.push(() => fetch(urls[i])); // Functions, not promises
}
// Now you can control when they execute
```

### 🐛 Pitfall 3: Forgetting Error Handling

```javascript
// ❌ Bad - unhandled rejection
Promise.race([fetchA(), fetchB()]); // If both reject?

// ✅ Good - always handle rejections
try {
  await Promise.race([fetchA(), fetchB()]);
} catch (error) {
  console.error("Both failed:", error);
}
```

### 🐛 Pitfall 4: Memory Leaks with Listeners

```javascript
// ❌ Bad - listeners never removed
async function* pollData() {
  while (true) {
    yield await fetchData();
    await delay(1000);
  }
}

// If consumer breaks loop, generator keeps running!

// ✅ Good - use AbortController
async function* pollData(signal) {
  while (!signal.aborted) {
    yield await fetchData();
    await delay(1000);
  }
}

const controller = new AbortController();
const gen = pollData(controller.signal);
// Later: controller.abort();
```

---

## 14. Week 6 Checklist

### Before moving to Week 7, you MUST be able to:

- [ ] Explain when to use each Promise combinator
- [ ] Choose between Promise.all, race, allSettled, and any
- [ ] Implement controlled concurrency (parallel with limit)
- [ ] Handle partial failures gracefully
- [ ] Write async iterators and generators
- [ ] Use for-await-of loops correctly
- [ ] Optimize sequential operations to parallel
- [ ] Implement retry logic with exponential backoff
- [ ] Build the SmartDataLoader project
- [ ] Debug race conditions and timing issues

### 🎓 Self-Test

Can you predict the output?

```javascript
const p1 = Promise.reject("Error");
const p2 = Promise.resolve("Success");
const p3 = new Promise(resolve => setTimeout(() => resolve("Slow"), 1000));

// What does each return?
const r1 = await Promise.all([p2, p3]);
const r2 = await Promise.race([p2, p3]);
const r3 = await Promise.allSettled([p1, p2, p3]);
const r4 = await Promise.any([p1, p2, p3]);
```

<details>
<summary>Click for answers</summary>

- `r1`: Waits for both, returns `["Success", "Slow"]`
- `r2`: Returns immediately with `"Success"` (first to settle)
- `r3`: Waits for all, returns array with all statuses
- `r4`: Returns immediately with `"Success"` (first successful)

</details>

**If you can explain WHY each behaves this way, you're ready for Week 7.**

---

## 📖 Additional Resources

- [MDN: Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [MDN: Promise.race()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [MDN: Promise.allSettled()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
- [MDN: Promise.any()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)
- [MDN: for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
- [JavaScript.info: Async iteration](https://javascript.info/async-iterators-generators)

---

## 💡 Pro Tips

### Tip 1: Promise Combinator Cheat Sheet

```javascript
// All must succeed
Promise.all([a, b, c])

// Need all results (success or failure)
Promise.allSettled([a, b, c])

// Fastest wins (success or failure)
Promise.race([a, b, c])

// First success wins
Promise.any([a, b, c])
```

### Tip 2: Debugging Async Code

```javascript
// Label your promises
const userPromise = fetchUser().then(u => {
  console.log("User fetched:", u);
  return u;
});

// Use Promise.race for timeout debugging
await Promise.race([
  yourAsyncFunction(),
  delay(5000).then(() => console.log("Still waiting..."))
]);

// Track promise state
const trackPromise = (promise, label) => {
  console.log(`${label}: started`);
  return promise
    .then(result => {
      console.log(`${label}: resolved`, result);
      return result;
    })
    .catch(error => {
      console.log(`${label}: rejected`, error);
      throw error;
    });
};
```

### Tip 3: Common Patterns Summary

```javascript
// Sequential: when order matters
for (const item of items) {
  await process(item);
}

// Parallel: when order doesn't matter
await Promise.all(items.map(process));

// Batched: when you need to limit concurrency
for (let i = 0; i < items.length; i += batchSize) {
  const batch = items.slice(i, i + batchSize);
  await Promise.all(batch.map(process));
}

// With dependencies: mix sequential and parallel
const a = await fetchA();
const [b, c] = await Promise.all([
  fetchB(a),
  fetchC(a)
]);
```

---

## ⏭ Next Week

**Week 7:** ES6+ Modules, Modern JavaScript Features & Tooling

You'll learn:
- ES6 Modules (import/export)
- Destructuring and spread operators
- Modern JavaScript features
- Project setup and bundling
- Code organization best practices

---

## 🎯 Final Exercise

Before moving on, implement this challenge:

### Challenge: Multi-Source Data Aggregator

Build a function that:
1. Fetches data from 3 different APIs in parallel
2. If any API fails, retry it 3 times with backoff
3. If all retries fail, use cached data or skip it
4. Return aggregated results with success/failure status
5. Complete within 10 seconds or timeout

```javascript
async function aggregateData(sources, options = {}) {
  // Your implementation here
  // Should use: Promise.all/allSettled, retry logic, timeout
}

// Test it
const sources = [
  { url: '/api/weather', cache: weatherCache },
  { url: '/api/news', cache: newsCache },
  { url: '/api/stocks', cache: stocksCache }
];

const result = await aggregateData(sources, {
  retries: 3,
  timeout: 10000
});
```

**If you can build this confidently, you've mastered Week 6!** 🚀

---

**Remember:** The best way to learn async patterns is to:
1. **Type** every example
2. **Break** the code intentionally
3. **Fix** it yourself
4. **Experiment** with variations

Good luck! 💪