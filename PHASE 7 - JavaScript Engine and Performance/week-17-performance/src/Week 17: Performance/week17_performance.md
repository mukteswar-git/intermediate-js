# Week 17: Performance Optimization in JavaScript

## Table of Contents
1. [Time Complexity Basics](#time-complexity-basics)
2. [Memory Leaks](#memory-leaks)
3. [Garbage Collection](#garbage-collection)
4. [Performance.now()](#performancenow)
5. [RequestAnimationFrame](#requestanimationframe)
6. [Code Optimization Techniques](#code-optimization-techniques)
7. [Lazy Loading](#lazy-loading)
8. [Tree Shaking Concepts](#tree-shaking-concepts)

---

## Time Complexity Basics

Time complexity describes how the runtime of an algorithm grows as the input size increases. It helps us understand and compare algorithm efficiency.

### Big O Notation

Big O notation expresses the upper bound of an algorithm's growth rate.

#### Common Time Complexities

**O(1) - Constant Time**
```javascript
function getFirstElement(arr) {
  return arr[0]; // Always takes the same time
}

const nums = [1, 2, 3, 4, 5];
console.log(getFirstElement(nums)); // O(1)
```

**O(log n) - Logarithmic Time**
```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}

const sortedArray = [1, 3, 5, 7, 9, 11, 13];
console.log(binarySearch(sortedArray, 7)); // O(log n)
```

**O(n) - Linear Time**
```javascript
function findMax(arr) {
  let max = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  
  return max;
}

console.log(findMax([3, 7, 2, 9, 1])); // O(n)
```

**O(n log n) - Linearithmic Time**
```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}

console.log(mergeSort([5, 2, 8, 1, 9])); // O(n log n)
```

**O(n²) - Quadratic Time**
```javascript
function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22])); // O(n²)
```

### Space Complexity

Space complexity measures memory usage relative to input size.

```javascript
// O(1) space - only uses a fixed amount of extra space
function sumArray(arr) {
  let sum = 0;
  for (let num of arr) {
    sum += num;
  }
  return sum;
}

// O(n) space - creates a new array of size n
function doubleArray(arr) {
  return arr.map(x => x * 2);
}

// O(n) space - recursive call stack
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

---

## Memory Leaks

Memory leaks occur when memory that is no longer needed is not released, causing applications to consume increasing amounts of memory over time.

### Common Causes of Memory Leaks

#### 1. Global Variables

```javascript
// BAD: Creates global variable
function createLeak() {
  leakedVariable = 'This is now global!';
}

// GOOD: Use proper scoping
function noLeak() {
  const properVariable = 'This is properly scoped';
}
```

#### 2. Forgotten Timers and Callbacks

```javascript
// BAD: Timer never cleared
function startTimer() {
  setInterval(() => {
    console.log('Running...');
  }, 1000);
}

// GOOD: Clear timer when done
function startTimerCorrectly() {
  const timerId = setInterval(() => {
    console.log('Running...');
  }, 1000);
  
  // Clear when component unmounts or is no longer needed
  return () => clearInterval(timerId);
}
```

#### 3. Event Listeners Not Removed

```javascript
// BAD: Event listener never removed
function attachListener() {
  const button = document.getElementById('myButton');
  button.addEventListener('click', handleClick);
}

function handleClick() {
  console.log('Clicked!');
}

// GOOD: Remove event listener
function attachListenerCorrectly() {
  const button = document.getElementById('myButton');
  
  const cleanup = () => {
    button.removeEventListener('click', handleClick);
  };
  
  button.addEventListener('click', handleClick);
  
  return cleanup;
}
```

#### 4. Closures Holding References

```javascript
// BAD: Closure keeps reference to large data
function createClosure() {
  const largeData = new Array(1000000).fill('data');
  
  return function() {
    console.log(largeData[0]);
  };
}

// GOOD: Only keep what you need
function createClosureCorrectly() {
  const largeData = new Array(1000000).fill('data');
  const firstItem = largeData[0];
  
  return function() {
    console.log(firstItem);
  };
}
```

#### 5. Detached DOM Nodes

```javascript
// BAD: Keeping references to removed DOM nodes
const elements = [];

function addElement() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  elements.push(div); // Still referenced after removal
}

function removeElement() {
  document.body.removeChild(elements[0]);
  // elements[0] still holds reference to detached node
}

// GOOD: Clear references
function addElementCorrectly() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

function removeElementCorrectly(element) {
  document.body.removeChild(element);
  element = null; // Clear reference
}
```

### Detecting Memory Leaks

```javascript
// Monitor memory usage
function monitorMemory() {
  if (performance.memory) {
    console.log({
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    });
  }
}

// Check periodically
setInterval(monitorMemory, 5000);
```

---

## Garbage Collection

Garbage collection is the automatic process of reclaiming memory occupied by objects that are no longer in use.

### How Garbage Collection Works

JavaScript uses a mark-and-sweep algorithm for garbage collection.

```javascript
// Example of how objects become eligible for GC

function createObject() {
  let obj = { name: 'Test', data: new Array(1000) };
  // obj is in scope and referenced
  
  return obj;
}

let myObj = createObject();
// myObj references the object - not eligible for GC

myObj = null;
// Object no longer referenced - eligible for GC
```

### Reference Counting

```javascript
// Multiple references prevent garbage collection
let obj1 = { value: 'data' };
let obj2 = obj1; // Two references
let obj3 = obj1; // Three references

obj1 = null; // Still 2 references
obj2 = null; // Still 1 reference
obj3 = null; // Now eligible for GC
```

### Circular References

```javascript
// Modern engines handle circular references
function createCircular() {
  let obj1 = {};
  let obj2 = {};
  
  obj1.ref = obj2;
  obj2.ref = obj1;
  
  return obj1;
}

let circular = createCircular();
circular = null; // Both objects now eligible for GC
```

### WeakMap and WeakSet

WeakMap and WeakSet hold weak references, allowing garbage collection.

```javascript
// WeakMap example
const weakMap = new WeakMap();

let obj = { id: 1 };
weakMap.set(obj, 'metadata');

console.log(weakMap.get(obj)); // 'metadata'

obj = null; // Object can be garbage collected
// WeakMap entry is automatically removed

// Regular Map would prevent GC
const regularMap = new Map();
let obj2 = { id: 2 };
regularMap.set(obj2, 'metadata');

obj2 = null; // Object CANNOT be garbage collected
// Map still holds reference
```

### Optimizing for Garbage Collection

```javascript
// 1. Nullify large objects when done
function processLargeData() {
  let largeArray = new Array(1000000).fill(0);
  
  // Process data
  const result = largeArray.reduce((sum, val) => sum + val, 0);
  
  largeArray = null; // Help GC
  
  return result;
}

// 2. Avoid creating unnecessary objects in loops
// BAD
function badLoop() {
  for (let i = 0; i < 1000; i++) {
    const obj = { index: i }; // Creates 1000 objects
    console.log(obj.index);
  }
}

// GOOD
function goodLoop() {
  const obj = { index: 0 }; // Creates 1 object
  for (let i = 0; i < 1000; i++) {
    obj.index = i;
    console.log(obj.index);
  }
}

// 3. Use object pooling for frequently created objects
class ObjectPool {
  constructor(createFn, resetFn) {
    this.pool = [];
    this.createFn = createFn;
    this.resetFn = resetFn;
  }
  
  acquire() {
    return this.pool.length > 0 
      ? this.pool.pop() 
      : this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

const vectorPool = new ObjectPool(
  () => ({ x: 0, y: 0 }),
  (v) => { v.x = 0; v.y = 0; }
);
```

---

## Performance.now()

`Performance.now()` provides high-resolution timestamps for precise timing measurements.

### Basic Usage

```javascript
// Measure execution time
const start = performance.now();

// Some operation
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}

const end = performance.now();
console.log(`Operation took ${end - start} milliseconds`);
```

### Comparing Algorithm Performance

```javascript
function measurePerformance(fn, iterations = 1) {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  return {
    average: avg,
    min: Math.min(...times),
    max: Math.max(...times),
    times
  };
}

// Compare two sorting algorithms
const data1 = Array.from({length: 1000}, () => Math.random());
const data2 = [...data1];

const bubbleSortResults = measurePerformance(() => {
  bubbleSort([...data1]);
}, 10);

const mergeSortResults = measurePerformance(() => {
  mergeSort([...data2]);
}, 10);

console.log('Bubble Sort:', bubbleSortResults);
console.log('Merge Sort:', mergeSortResults);
```

### Performance Monitoring Class

```javascript
class PerformanceMonitor {
  constructor() {
    this.marks = new Map();
    this.measures = [];
  }
  
  mark(name) {
    this.marks.set(name, performance.now());
  }
  
  measure(name, startMark, endMark) {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);
    
    if (start === undefined || end === undefined) {
      console.error('Invalid marks');
      return;
    }
    
    const duration = end - start;
    this.measures.push({ name, duration, start, end });
    
    return duration;
  }
  
  getReport() {
    return this.measures.map(m => ({
      name: m.name,
      duration: `${m.duration.toFixed(2)}ms`
    }));
  }
  
  clear() {
    this.marks.clear();
    this.measures = [];
  }
}

// Usage
const monitor = new PerformanceMonitor();

monitor.mark('start');
// Some operations
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
monitor.mark('end');

monitor.measure('calculation', 'start', 'end');
console.log(monitor.getReport());
```

---

## RequestAnimationFrame

`requestAnimationFrame` synchronizes code execution with the browser's repaint cycle for smooth animations.

### Basic Animation

```javascript
// Simple animation
function animate() {
  const box = document.getElementById('box');
  let position = 0;
  
  function step() {
    position += 2;
    box.style.transform = `translateX(${position}px)`;
    
    if (position < 500) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}
```

### Animation with Time Delta

```javascript
// Smooth animation independent of frame rate
function smoothAnimate() {
  const box = document.getElementById('box');
  let position = 0;
  let lastTime = 0;
  const speed = 100; // pixels per second
  
  function step(currentTime) {
    if (lastTime === 0) {
      lastTime = currentTime;
    }
    
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;
    
    position += speed * deltaTime;
    box.style.transform = `translateX(${position}px)`;
    
    if (position < 500) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}
```

### Animation Class

```javascript
class Animator {
  constructor() {
    this.animations = new Map();
    this.isRunning = false;
    this.animationId = null;
  }
  
  add(id, callback) {
    this.animations.set(id, {
      callback,
      lastTime: 0
    });
    
    if (!this.isRunning) {
      this.start();
    }
  }
  
  remove(id) {
    this.animations.delete(id);
    
    if (this.animations.size === 0) {
      this.stop();
    }
  }
  
  start() {
    this.isRunning = true;
    this.animationId = requestAnimationFrame(this.loop.bind(this));
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  loop(currentTime) {
    this.animations.forEach((anim, id) => {
      const deltaTime = currentTime - anim.lastTime;
      anim.lastTime = currentTime;
      
      anim.callback(deltaTime, currentTime);
    });
    
    if (this.isRunning) {
      this.animationId = requestAnimationFrame(this.loop.bind(this));
    }
  }
}

// Usage
const animator = new Animator();

let x = 0;
animator.add('moveBox', (delta) => {
  x += delta * 0.1;
  const box = document.getElementById('box');
  if (box) {
    box.style.transform = `translateX(${x}px)`;
  }
});
```

### FPS Counter

```javascript
class FPSCounter {
  constructor() {
    this.fps = 0;
    this.frames = [];
    this.lastTime = performance.now();
  }
  
  update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    
    this.frames.push(delta);
    
    if (this.frames.length > 60) {
      this.frames.shift();
    }
    
    const average = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    this.fps = Math.round(1000 / average);
    
    return this.fps;
  }
  
  display() {
    const fpsDisplay = document.getElementById('fps');
    if (fpsDisplay) {
      fpsDisplay.textContent = `FPS: ${this.fps}`;
    }
  }
}

const fpsCounter = new FPSCounter();

function renderLoop() {
  fpsCounter.update();
  fpsCounter.display();
  requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
```

---

## Code Optimization Techniques

### 1. Debouncing and Throttling

```javascript
// Debounce: Wait until user stops typing
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((e) => {
  console.log('Searching for:', e.target.value);
  // API call here
}, 300);

searchInput.addEventListener('input', debouncedSearch);

// Throttle: Limit execution frequency
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 200);

window.addEventListener('scroll', throttledScroll);
```

### 2. Memoization

```javascript
// Cache expensive function results
function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

// Usage
const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40)); // Much faster with memoization
```

### 3. Loop Optimization

```javascript
// BAD: Accessing length property every iteration
function badLoop(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}

// GOOD: Cache length
function goodLoop(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    console.log(arr[i]);
  }
}

// BETTER: Use for...of when you don't need index
function betterLoop(arr) {
  for (const item of arr) {
    console.log(item);
  }
}

// Array methods for readability (slight performance trade-off)
function functionalLoop(arr) {
  arr.forEach(item => console.log(item));
}
```

### 4. DOM Optimization

```javascript
// BAD: Multiple reflows
function badDOMUpdate() {
  for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    document.body.appendChild(div); // Reflow each time
  }
}

// GOOD: Use document fragment
function goodDOMUpdate() {
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < 100; i++) {
    const div = document.createElement('div');
    div.textContent = i;
    fragment.appendChild(div);
  }
  
  document.body.appendChild(fragment); // Single reflow
}

// BETTER: Use innerHTML (for simple cases)
function betterDOMUpdate() {
  const html = Array.from({length: 100}, (_, i) => 
    `<div>${i}</div>`
  ).join('');
  
  document.body.innerHTML += html;
}
```

### 5. Event Delegation

```javascript
// BAD: Attach listener to each item
function badEventHandling() {
  const items = document.querySelectorAll('.item');
  items.forEach(item => {
    item.addEventListener('click', handleClick);
  });
}

// GOOD: Use event delegation
function goodEventHandling() {
  const container = document.getElementById('container');
  
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('item')) {
      handleClick(e);
    }
  });
}

function handleClick(e) {
  console.log('Clicked:', e.target);
}
```

### 6. Avoid Memory Leaks in Loops

```javascript
// BAD: Creates closures that capture loop variable
function badClosures() {
  const callbacks = [];
  
  for (var i = 0; i < 5; i++) {
    callbacks.push(() => console.log(i));
  }
  
  callbacks.forEach(cb => cb()); // Prints 5, 5, 5, 5, 5
}

// GOOD: Use let or IIFE
function goodClosures() {
  const callbacks = [];
  
  for (let i = 0; i < 5; i++) {
    callbacks.push(() => console.log(i));
  }
  
  callbacks.forEach(cb => cb()); // Prints 0, 1, 2, 3, 4
}
```

---

## Lazy Loading

Lazy loading defers loading resources until they are needed, improving initial load time.

### Image Lazy Loading

```javascript
// Modern browsers support native lazy loading
function nativeLazyLoad() {
  const img = document.createElement('img');
  img.src = 'image.jpg';
  img.loading = 'lazy'; // Native lazy loading
  document.body.appendChild(img);
}

// Intersection Observer for custom lazy loading
class LazyLoader {
  constructor(options = {}) {
    this.options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01,
      ...options
    };
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
  }
  
  observe(element) {
    this.observer.observe(element);
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  loadImage(img) {
    const src = img.dataset.src;
    
    if (!src) return;
    
    img.src = src;
    img.classList.add('loaded');
  }
}

// Usage
const lazyLoader = new LazyLoader();

document.querySelectorAll('img[data-src]').forEach(img => {
  lazyLoader.observe(img);
});
```

### Module Lazy Loading (Dynamic Imports)

```javascript
// Lazy load a module when needed
async function loadModule() {
  const button = document.getElementById('loadChart');
  
  button.addEventListener('click', async () => {
    // Only load chart library when button is clicked
    const { Chart } = await import('./chart.js');
    
    const chart = new Chart();
    chart.render();
  });
}

// Route-based code splitting
async function navigateTo(route) {
  let component;
  
  switch(route) {
    case '/home':
      component = await import('./pages/Home.js');
      break;
    case '/about':
      component = await import('./pages/About.js');
      break;
    case '/dashboard':
      component = await import('./pages/Dashboard.js');
      break;
    default:
      component = await import('./pages/NotFound.js');
  }
  
  component.default.render();
}
```

### Component Lazy Loading

```javascript
// Lazy load component with loading state
class ComponentLoader {
  constructor(container) {
    this.container = container;
    this.cache = new Map();
  }
  
  async load(componentPath) {
    // Check cache first
    if (this.cache.has(componentPath)) {
      return this.cache.get(componentPath);
    }
    
    // Show loading
    this.showLoading();
    
    try {
      const module = await import(componentPath);
      const component = module.default;
      
      // Cache the component
      this.cache.set(componentPath, component);
      
      this.hideLoading();
      return component;
      
    } catch (error) {
      this.showError(error);
      throw error;
    }
  }
  
  showLoading() {
    this.container.innerHTML = '<div class="loading">Loading...</div>';
  }
  
  hideLoading() {
    const loading = this.container.querySelector('.loading');
    if (loading) loading.remove();
  }
  
  showError(error) {
    this.container.innerHTML = `
      <div class="error">
        Failed to load component: ${error.message}
      </div>
    `;
  }
}

// Usage
const loader = new ComponentLoader(document.getElementById('app'));

document.getElementById('loadDashboard').addEventListener('click', async () => {
  const Dashboard = await loader.load('./Dashboard.js');
  const dashboard = new Dashboard();
  dashboard.render();
});
```

### Data Lazy Loading (Pagination)

```javascript
class InfiniteScroll {
  constructor(container, fetchFunction) {
    this.container = container;
    this.fetchFunction = fetchFunction;
    this.page = 1;
    this.loading = false;
    this.hasMore = true;
    
    this.setupObserver();
  }
  
  setupObserver() {
    const sentinel = document.createElement('div');
    sentinel.className = 'sentinel';
    this.container.appendChild(sentinel);
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !this.loading && this.hasMore) {
          this.loadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(sentinel);
  }
  
  async loadMore() {
    this.loading = true;
    this.showLoading();
    
    try {
      const data = await this.fetchFunction(this.page);
      
      if (data.length === 0) {
        this.hasMore = false;
        this.hideLoading();
        return;
      }
      
      this.renderItems(data);
      this.page++;
      
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      this.loading = false;
      this.hideLoading();
    }
  }
  
  renderItems(items) {
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.textContent = item.title;
      fragment.appendChild(div);
    });
    
    const sentinel = this.container.querySelector('.sentinel');
    this.container.insertBefore(fragment, sentinel);
  }
  
  showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.textContent = 'Loading more...';
    this.container.appendChild(loader);
  }
  
  hideLoading() {
    const loader = this.container.querySelector('.loader');
    if (loader) loader.remove();
  }
}

// Usage
async function fetchData(page) {
  const response = await fetch(`/api/items?page=${page}`);
  return response.json();
}

const scroll = new InfiniteScroll(
  document.getElementById('content'),
  fetchData
);
```

---

## Tree Shaking Concepts

Tree shaking eliminates dead code from your final bundle, reducing file size.

### How Tree Shaking Works

Tree shaking relies on ES6 module syntax (import/export) to determine which code is actually used.

```javascript
// math.js - Library with multiple exports
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  return a / b;
}

// main.js - Only import what you need
import { add, multiply } from './math.js';

console.log(add(5, 3));
console.log(multiply(4, 2));

// subtract and divide will be removed by tree shaking
```

### Writing Tree-Shakeable Code

```javascript
// BAD: Default export of object (harder to tree shake)
// utils.js
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b
};

// GOOD: Named exports (tree-shakeable)
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// Usage - only imports what's needed
import { add, multiply } from './utils.js';
```

### Avoiding Side Effects

```javascript
// BAD: Code with side effects (prevents tree shaking)
// config.js
export const API_URL = 'https://api.example.com';

// This runs immediately when module is imported
console.log('Config loaded:', API_URL);
document.title = 'My App';

// GOOD: Pure exports without side effects
// config.js
export const API_URL = 'https://api.example.com';

export function initConfig() {
  console.log('Config loaded:', API_URL);
  document.title = 'My App';
}

// main.js - Side effect runs only when called
import { API_URL, initConfig } from './config.js';

if (needsConfig) {
  initConfig();
}
```

### Package.json Configuration

```javascript
// package.json - Mark your package as side-effect free
{
  "name": "my-library",
  "version": "1.0.0",
  "sideEffects": false,  // No side effects, safe to tree shake
  "main": "dist/index.js",
  "module": "dist/index.esm.js"
}

// Or specify files with side effects
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "src/polyfills.js"
  ]
}
```

### Tree Shaking with Classes

```javascript
// BAD: Class with mixed concerns (harder to tree shake)
class Utils {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
  multiply(a, b) { return a * b; }
  divide(a, b) { return a / b; }
  
  // Unused methods still get bundled
  complexCalculation() { /* ... */ }
  advancedMath() { /* ... */ }
}

export default new Utils();

// GOOD: Separate functions (tree-shakeable)
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

// These won't be included if not imported
export function complexCalculation() { /* ... */ }
export function advancedMath() { /* ... */ }
```

### Real-World Example: Utility Library

```javascript
// date-utils.js - Tree-shakeable utility library
export function formatDate(date) {
  return date.toLocaleDateString();
}

export function formatTime(date) {
  return date.toLocaleTimeString();
}

export function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getDaysDifference(date1, date2) {
  const diff = Math.abs(date1 - date2);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// main.js - Only imports needed functions
import { formatDate, addDays } from './date-utils.js';

const today = new Date();
console.log(formatDate(today));
console.log(formatDate(addDays(today, 7)));

// formatTime, formatDateTime, isWeekend, and getDaysDifference
// will be removed during tree shaking
```

---

## Week 17 Projects

### Project 1: Performance Monitoring Dashboard

Build a real-time performance monitoring tool that tracks your application's performance metrics.

```javascript
class PerformanceDashboard {
  constructor() {
    this.metrics = {
      fps: [],
      memory: [],
      loadTimes: [],
      interactions: []
    };
    
    this.maxDataPoints = 60;
    this.init();
  }
  
  init() {
    this.createUI();
    this.startMonitoring();
    this.setupEventListeners();
  }
  
  createUI() {
    const dashboard = document.createElement('div');
    dashboard.id = 'performance-dashboard';
    dashboard.innerHTML = `
      <div class="dashboard-header">
        <h3>Performance Monitor</h3>
        <button id="toggle-dashboard">Minimize</button>
      </div>
      <div class="dashboard-content">
        <div class="metric">
          <span class="label">FPS:</span>
          <span id="fps-value">--</span>
        </div>
        <div class="metric">
          <span class="label">Memory:</span>
          <span id="memory-value">--</span>
        </div>
        <div class="metric">
          <span class="label">Load Time:</span>
          <span id="load-time">--</span>
        </div>
        <canvas id="fps-chart" width="300" height="100"></canvas>
      </div>
    `;
    
    document.body.appendChild(dashboard);
  }
  
  startMonitoring() {
    // FPS monitoring
    this.monitorFPS();
    
    // Memory monitoring
    if (performance.memory) {
      setInterval(() => this.monitorMemory(), 1000);
    }
    
    // Page load time
    window.addEventListener('load', () => {
      this.measureLoadTime();
    });
  }
  
  monitorFPS() {
    let lastTime = performance.now();
    let frames = 0;
    
    const countFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.updateFPS(fps);
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFPS);
    };
    
    requestAnimationFrame(countFPS);
  }
  
  updateFPS(fps) {
    this.metrics.fps.push(fps);
    
    if (this.metrics.fps.length > this.maxDataPoints) {
      this.metrics.fps.shift();
    }
    
    document.getElementById('fps-value').textContent = fps;
    this.drawChart();
  }
  
  monitorMemory() {
    const memory = performance.memory;
    const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
    
    this.metrics.memory.push(parseFloat(usedMB));
    
    if (this.metrics.memory.length > this.maxDataPoints) {
      this.metrics.memory.shift();
    }
    
    document.getElementById('memory-value').textContent = `${usedMB} MB`;
  }
  
  measureLoadTime() {
    const perfData = performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    document.getElementById('load-time').textContent = `${loadTime}ms`;
  }
  
  drawChart() {
    const canvas = document.getElementById('fps-chart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Draw FPS line
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const data = this.metrics.fps;
    const pointWidth = width / this.maxDataPoints;
    
    data.forEach((fps, index) => {
      const x = index * pointWidth;
      const y = height - (fps / 60) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  }
  
  setupEventListeners() {
    document.getElementById('toggle-dashboard').addEventListener('click', () => {
      const content = document.querySelector('.dashboard-content');
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
  }
}

// Initialize dashboard
const dashboard = new PerformanceDashboard();
```

### Project 2: Optimized Image Gallery with Lazy Loading

Create an image gallery that loads images efficiently using lazy loading and caching.

```javascript
class OptimizedGallery {
  constructor(container, images) {
    this.container = container;
    this.images = images;
    this.loadedImages = new Set();
    this.cache = new Map();
    
    this.init();
  }
  
  init() {
    this.render();
    this.setupLazyLoading();
    this.setupInfiniteScroll();
  }
  
  render() {
    const fragment = document.createDocumentFragment();
    
    this.images.forEach((image, index) => {
      const item = this.createImageItem(image, index);
      fragment.appendChild(item);
    });
    
    this.container.appendChild(fragment);
  }
  
  createImageItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = index;
    
    const img = document.createElement('img');
    img.dataset.src = image.url;
    img.alt = image.alt;
    img.className = 'lazy-image';
    
    // Placeholder
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3C/svg%3E';
    
    const title = document.createElement('p');
    title.textContent = image.title;
    
    item.appendChild(img);
    item.appendChild(title);
    
    return item;
  }
  
  setupLazyLoading() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    const images = this.container.querySelectorAll('.lazy-image');
    images.forEach(img => observer.observe(img));
  }
  
  async loadImage(img) {
    const src = img.dataset.src;
    
    if (!src || this.loadedImages.has(src)) return;
    
    try {
      // Check cache first
      if (this.cache.has(src)) {
        img.src = this.cache.get(src);
        img.classList.add('loaded');
        return;
      }
      
      // Load image
      const loadPromise = new Promise((resolve, reject) => {
        const tempImg = new Image();
        tempImg.onload = () => resolve(tempImg.src);
        tempImg.onerror = reject;
        tempImg.src = src;
      });
      
      const loadedSrc = await loadPromise;
      
      // Cache and display
      this.cache.set(src, loadedSrc);
      this.loadedImages.add(src);
      
      img.src = loadedSrc;
      img.classList.add('loaded');
      
    } catch (error) {
      console.error('Failed to load image:', error);
      img.classList.add('error');
    }
  }
  
  setupInfiniteScroll() {
    let page = 1;
    let loading = false;
    
    const sentinel = document.createElement('div');
    sentinel.className = 'sentinel';
    this.container.appendChild(sentinel);
    
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && !loading) {
        loading = true;
        
        // Simulate loading more images
        await this.loadMoreImages(page);
        page++;
        
        loading = false;
      }
    });
    
    observer.observe(sentinel);
  }
  
  async loadMoreImages(page) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newImages = Array.from({ length: 10 }, (_, i) => ({
      url: `https://picsum.photos/300/200?random=${page * 10 + i}`,
      alt: `Image ${page * 10 + i}`,
      title: `Photo ${page * 10 + i}`
    }));
    
    newImages.forEach(image => {
      const item = this.createImageItem(image, this.images.length);
      this.container.insertBefore(item, this.container.querySelector('.sentinel'));
      this.images.push(image);
    });
    
    this.setupLazyLoading();
  }
}

// Usage
const images = Array.from({ length: 20 }, (_, i) => ({
  url: `https://picsum.photos/300/200?random=${i}`,
  alt: `Image ${i}`,
  title: `Photo ${i}`
}));

const gallery = new OptimizedGallery(
  document.getElementById('gallery'),
  images
);
```

### Project 3: Smart Code Bundle Analyzer

Create a tool that analyzes your JavaScript bundles and identifies optimization opportunities.

```javascript
class BundleAnalyzer {
  constructor() {
    this.modules = new Map();
    this.unusedExports = new Set();
    this.duplicates = new Map();
    this.results = {
      totalSize: 0,
      treeShakeable: 0,
      duplicateCode: 0,
      optimizationPotential: 0
    };
  }
  
  analyze(code) {
    this.parseModules(code);
    this.findUnusedExports();
    this.findDuplicates(code);
    this.calculateResults(code);
    
    return this.generateReport();
  }
  
  parseModules(code) {
    // Simple regex-based parsing (use a proper parser in production)
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
    const exportRegex = /export\s+(?:const|function|class)\s+(\w+)/g;
    
    let match;
    
    // Parse imports
    while ((match = importRegex.exec(code)) !== null) {
      const imports = match[1].split(',').map(s => s.trim());
      const module = match[2];
      
      if (!this.modules.has(module)) {
        this.modules.set(module, { imports: [], exports: [] });
      }
      
      this.modules.get(module).imports.push(...imports);
    }
    
    // Parse exports
    while ((match = exportRegex.exec(code)) !== null) {
      const exportName = match[1];
      
      this.modules.forEach(module => {
        module.exports.push(exportName);
      });
    }
  }
  
  findUnusedExports() {
    this.modules.forEach((module, name) => {
      module.exports.forEach(exp => {
        let used = false;
        
        this.modules.forEach(m => {
          if (m.imports.includes(exp)) {
            used = true;
          }
        });
        
        if (!used) {
          this.unusedExports.add(`${name}:${exp}`);
          this.results.treeShakeable += this.estimateSize(exp);
        }
      });
    });
  }
  
  findDuplicates(code) {
    const codeBlocks = new Map();
    
    // Simplified duplicate detection
    const functions = this.extractFunctions(code);
    
    functions.forEach(fn => {
      const normalized = this.normalizeCode(fn);
      
      if (codeBlocks.has(normalized)) {
        codeBlocks.get(normalized).push(fn);
      } else {
        codeBlocks.set(normalized, [fn]);
      }
    });
    
    codeBlocks.forEach((fns, normalized) => {
      if (fns.length > 1) {
        this.duplicates.set(normalized, fns);
        this.results.duplicateCode += this.estimateSize(normalized) * (fns.length - 1);
      }
    });
  }
  
  extractFunctions(code) {
    // Simplified function extraction
    const functionRegex = /function\s+\w+\s*\([^)]*\)\s*{[^}]+}/g;
    return code.match(functionRegex) || [];
  }
  
  normalizeCode(code) {
    // Remove whitespace and comments for comparison
    return code
      .replace(/\/\/.*/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  estimateSize(code) {
    // Estimate minified + gzipped size
    const minified = code.length * 0.5;
    const gzipped = minified * 0.3;
    return Math.round(gzipped);
  }
  
  calculateResults(code) {
    this.results.totalSize = code.length;
    this.results.optimizationPotential = 
      this.results.treeShakeable + this.results.duplicateCode;
  }
  
  generateReport() {
    return {
      summary: {
        totalSize: `${(this.results.totalSize / 1024).toFixed(2)} KB`,
        unusedExports: this.unusedExports.size,
        duplicateCode: `${(this.results.duplicateCode / 1024).toFixed(2)} KB`,
        potentialSavings: `${(this.results.optimizationPotential / 1024).toFixed(2)} KB`
      },
      unusedExports: Array.from(this.unusedExports),
      duplicates: Array.from(this.duplicates.keys()).map(key => ({
        code: key.substring(0, 50) + '...',
        occurrences: this.duplicates.get(key).length
      })),
      recommendations: this.getRecommendations()
    };
  }
  
  getRecommendations() {
    const recommendations = [];
    
    if (this.unusedExports.size > 0) {
      recommendations.push({
        type: 'tree-shaking',
        message: `Remove ${this.unusedExports.size} unused exports`,
        priority: 'high',
        savings: `${(this.results.treeShakeable / 1024).toFixed(2)} KB`
      });
    }
    
    if (this.duplicates.size > 0) {
      recommendations.push({
        type: 'deduplication',
        message: `Extract ${this.duplicates.size} duplicate code blocks`,
        priority: 'medium',
        savings: `${(this.results.duplicateCode / 1024).toFixed(2)} KB`
      });
    }
    
    return recommendations;
  }
}

// Usage
const analyzer = new BundleAnalyzer();
const sampleCode = `
  import { add, subtract, multiply } from './math.js';
  
  export const calculate = (a, b) => add(a, b);
  export const unused = () => console.log('never used');
  
  function duplicate() {
    return 'duplicate';
  }
  
  function duplicate2() {
    return 'duplicate';
  }
`;

const report = analyzer.analyze(sampleCode);
console.log('Bundle Analysis Report:', report);
```

---

## Practice Exercises

### Exercise 1: Optimize This Function
```javascript
// Unoptimized function - identify and fix performance issues
function processUsers(users) {
  const results = [];
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    
    // Issue 1: Expensive operation in loop
    const formattedDate = new Date(user.createdAt).toLocaleDateString();
    
    // Issue 2: Nested loop
    for (let j = 0; j < users.length; j++) {
      if (users[j].id === user.friendId) {
        user.friend = users[j];
      }
    }
    
    // Issue 3: Multiple DOM manipulations
    const div = document.createElement('div');
    div.textContent = user.name;
    document.body.appendChild(div);
    
    results.push({
      ...user,
      formattedDate
    });
  }
  
  return results;
}

// Your optimized version here
```

### Exercise 2: Implement Efficient Caching
```javascript
// Create a caching mechanism that:
// 1. Stores results of expensive operations
// 2. Has a maximum cache size
// 3. Implements LRU (Least Recently Used) eviction
// 4. Has cache expiration

class AdvancedCache {
  constructor(maxSize, ttl) {
    // Your implementation here
  }
  
  get(key) {
    // Your implementation here
  }
  
  set(key, value) {
    // Your implementation here
  }
  
  clear() {
    // Your implementation here
  }
}
```

### Exercise 3: Build a Performance Profiler
```javascript
// Create a decorator that profiles function performance
function profile(target, propertyKey, descriptor) {
  // Your implementation here
  // Should log: function name, execution time, arguments, return value
}

// Usage
class DataProcessor {
  @profile
  processData(data) {
    // Some expensive operation
    return data.map(x => x * 2);
  }
}
```

---

## Additional Resources

### Performance Tools
- Chrome DevTools Performance Panel
- Lighthouse for performance audits
- WebPageTest for detailed analysis
- Bundle Analyzer tools (webpack-bundle-analyzer, rollup-plugin-visualizer)

### Best Practices Checklist
- ✅ Use appropriate data structures for your use case
- ✅ Implement lazy loading for large resources
- ✅ Debounce/throttle frequent events
- ✅ Use memoization for expensive calculations
- ✅ Minimize DOM manipulations
- ✅ Remove event listeners when done
- ✅ Use tree-shakeable module formats
- ✅ Monitor memory usage regularly
- ✅ Profile before optimizing
- ✅ Test performance on various devices

### Common Performance Pitfalls
1. Premature optimization
2. Ignoring memory leaks
3. Blocking the main thread
4. Not measuring actual impact
5. Over-engineering solutions
6. Ignoring network performance
7. Not considering mobile devices
8. Skipping code reviews for performance

---

## Week 17 Summary

This week covered essential performance optimization concepts:

- **Time Complexity**: Understanding algorithm efficiency with Big O notation
- **Memory Management**: Identifying and preventing memory leaks
- **Garbage Collection**: How JavaScript manages memory automatically
- **Performance Measurement**: Using Performance.now() for accurate timing
- **Animation Optimization**: RequestAnimationFrame for smooth visuals
- **Code Optimization**: Practical techniques for faster code
- **Lazy Loading**: Deferring resource loading for better initial load times
- **Tree Shaking**: Eliminating dead code from bundles

Master these concepts to build fast, efficient, and scalable web applications!