# Week 23: Advanced API Handling

## Table of Contents

1. [Rate Limiting](#1-rate-limiting)
2. [Retry Logic](#2-retry-logic)
3. [Request Cancellation with AbortController](#3-request-cancellation-with-abortcontroller)
4. [Axios Library](#4-axios-library)
5. [API Error Handling Patterns](#5-api-error-handling-patterns)
6. [Pagination Strategies](#6-pagination-strategies)
7. [Caching Strategies](#7-caching-strategies)
8. [Practice Projects](#8-practice-projects)

---

## 1. Rate Limiting

Rate limiting prevents overwhelming APIs with too many requests.

### Basic Rate Limiter

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow; // in milliseconds
    this.requests = [];
  }

  async throttle() {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle(); // Retry
    }

    this.requests.push(now);
  }
}

// Usage
const limiter = new RateLimiter(5, 1000); // 5 requests per second

async function fetchWithRateLimit(url) {
  await limiter.throttle();
  const response = await fetch(url);
  return response.json();
}
```

### Token Bucket Algorithm

```javascript
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }

  refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  async consume(tokens = 1) {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    // Wait for tokens to refill
    const waitTime = ((tokens - this.tokens) / this.refillRate) * 1000;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return this.consume(tokens);
  }
}

// Usage
const bucket = new TokenBucket(10, 2); // 10 tokens, refill 2/second

async function apiCall(url) {
  await bucket.consume(1);
  return fetch(url);
}
```

---

## 2. Retry Logic

Implement automatic retries for failed requests.

### Exponential Backoff

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      
      if (isLastAttempt) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      console.log(`Retry ${i + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
fetchWithRetry('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(err => console.error('All retries failed:', err));
```

### Advanced Retry with Conditions

```javascript
class RetryHandler {
  constructor(config = {}) {
    this.maxRetries = config.maxRetries || 3;
    this.baseDelay = config.baseDelay || 1000;
    this.maxDelay = config.maxDelay || 30000;
    this.retryableStatuses = config.retryableStatuses || [408, 429, 500, 502, 503, 504];
  }

  shouldRetry(error, attempt) {
    if (attempt >= this.maxRetries) return false;

    // Retry on network errors
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return true;
    }

    // Retry on specific HTTP status codes
    if (error.status && this.retryableStatuses.includes(error.status)) {
      return true;
    }

    return false;
  }

  getDelay(attempt) {
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add randomness
    return Math.min(exponentialDelay + jitter, this.maxDelay);
  }

  async execute(fn) {
    let lastError;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (!this.shouldRetry(error, attempt)) {
          throw error;
        }

        const delay = this.getDelay(attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

// Usage
const retryHandler = new RetryHandler({
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 10000
});

retryHandler.execute(() => fetch('https://api.example.com/data'))
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error('Failed after retries:', err));
```

---

## 3. Request Cancellation with AbortController

Cancel ongoing requests to prevent memory leaks and unnecessary processing.

### Basic AbortController

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Request was cancelled');
    } else {
      console.error('Error:', err);
    }
  });

// Cancel the request
setTimeout(() => controller.abort(), 2000);
```

### Request Manager with Cancellation

```javascript
class RequestManager {
  constructor() {
    this.pendingRequests = new Map();
  }

  async fetch(url, options = {}) {
    // Cancel previous request with same URL
    this.cancel(url);

    const controller = new AbortController();
    this.pendingRequests.set(url, controller);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      this.pendingRequests.delete(url);
      return response;
    } catch (error) {
      this.pendingRequests.delete(url);
      throw error;
    }
  }

  cancel(url) {
    const controller = this.pendingRequests.get(url);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(url);
    }
  }

  cancelAll() {
    this.pendingRequests.forEach(controller => controller.abort());
    this.pendingRequests.clear();
  }
}

// Usage
const manager = new RequestManager();

// Debounced search
let searchTimeout;
function handleSearch(query) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    manager.fetch(`https://api.example.com/search?q=${query}`)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });
  }, 300);
}
```

### Timeout with AbortController

```javascript
function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { signal })
    .then(response => {
      clearTimeout(timeoutId);
      return response;
    })
    .catch(error => {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    });
}

// Usage
fetchWithTimeout('https://api.example.com/data', 3000)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err.message));
```

---

## 4. Axios Library

Axios is a popular HTTP client with built-in features.

### Installation

```bash
npm install axios
```

### Basic Axios Usage

```javascript
import axios from 'axios';

// GET request
axios.get('https://api.example.com/users')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// POST request
axios.post('https://api.example.com/users', {
  name: 'John Doe',
  email: 'john@example.com'
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// With async/await
async function getUser(id) {
  try {
    const response = await axios.get(`https://api.example.com/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
```

### Axios Instance Configuration

```javascript
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});

// Use the configured instance
apiClient.get('/users')
  .then(response => console.log(response.data));

apiClient.post('/users', { name: 'Jane' })
  .then(response => console.log(response.data));
```

### Axios Interceptors

```javascript
// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  error => {
    // Handle errors globally
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Redirect to login
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
      }
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);
```

### Axios with Retry

```javascript
import axios from 'axios';
import axiosRetry from 'axios-retry';

const client = axios.create({
  baseURL: 'https://api.example.com'
});

axiosRetry(client, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status === 429;
  }
});

// Usage
client.get('/data')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

### Axios Cancellation

```javascript
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  })
});

// Cancel the request
cancel('Request cancelled by user');

// Or with AbortController (Axios 0.22.0+)
const controller = new AbortController();

axios.get('/user/12345', {
  signal: controller.signal
});

controller.abort();
```

---

## 5. API Error Handling Patterns

### Centralized Error Handler

```javascript
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Network or other errors
      throw new APIError(
        'Network error or request failed',
        0,
        { originalError: error.message }
      );
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}

// Usage
const api = new APIClient('https://api.example.com');

api.get('/users')
  .then(data => console.log(data))
  .catch(error => {
    if (error instanceof APIError) {
      console.error(`API Error ${error.status}:`, error.message);
      console.error('Details:', error.data);
    } else {
      console.error('Unexpected error:', error);
    }
  });
```

### Error Boundary Pattern

```javascript
async function safeAPICall(apiFunction, fallbackValue = null) {
  try {
    return await apiFunction();
  } catch (error) {
    console.error('API call failed:', error);
    
    // Log to error tracking service
    // logErrorToService(error);
    
    return fallbackValue;
  }
}

// Usage
const users = await safeAPICall(
  () => api.get('/users'),
  [] // fallback to empty array
);

const user = await safeAPICall(
  () => api.get('/users/123'),
  { name: 'Unknown', email: 'unknown@example.com' }
);
```

### Error Recovery Strategies

```javascript
class APIService {
  constructor() {
    this.cache = new Map();
  }

  async fetchWithFallback(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Cache successful response
      this.cache.set(url, data);
      return data;
    } catch (error) {
      console.error('Fetch failed, using cache:', error);
      
      // Return cached data if available
      if (this.cache.has(url)) {
        return this.cache.get(url);
      }

      // Return default data
      return this.getDefaultData(url);
    }
  }

  getDefaultData(url) {
    // Return sensible defaults based on endpoint
    if (url.includes('/users')) {
      return [];
    }
    return null;
  }
}
```

---

## 6. Pagination Strategies

### Offset-Based Pagination

```javascript
class PaginationClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchPage(endpoint, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const url = `${this.baseURL}${endpoint}?limit=${limit}&offset=${offset}`;
    
    const response = await fetch(url);
    return response.json();
  }

  async fetchAllPages(endpoint, limit = 10) {
    const allData = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.fetchPage(endpoint, page, limit);
      allData.push(...response.data);
      
      hasMore = response.data.length === limit;
      page++;
    }

    return allData;
  }
}

// Usage
const client = new PaginationClient('https://api.example.com');

// Single page
const page1 = await client.fetchPage('/users', 1, 20);

// All pages
const allUsers = await client.fetchAllPages('/users', 50);
```

### Cursor-Based Pagination

```javascript
class CursorPagination {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchPage(endpoint, cursor = null, limit = 20) {
    let url = `${this.baseURL}${endpoint}?limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    return {
      items: data.items,
      nextCursor: data.next_cursor,
      hasMore: data.has_more
    };
  }

  async *iteratePages(endpoint, limit = 20) {
    let cursor = null;

    while (true) {
      const page = await this.fetchPage(endpoint, cursor, limit);
      yield page.items;

      if (!page.hasMore) break;
      cursor = page.nextCursor;
    }
  }

  async fetchAll(endpoint, limit = 20) {
    const allItems = [];

    for await (const items of this.iteratePages(endpoint, limit)) {
      allItems.push(...items);
    }

    return allItems;
  }
}

// Usage
const pagination = new CursorPagination('https://api.example.com');

// Iterate through pages
for await (const users of pagination.iteratePages('/users', 50)) {
  console.log('Page of users:', users);
}

// Get all data
const allUsers = await pagination.fetchAll('/users');
```

### Infinite Scroll Implementation

```javascript
class InfiniteScroll {
  constructor(endpoint, container, renderFn) {
    this.endpoint = endpoint;
    this.container = container;
    this.renderFn = renderFn;
    this.page = 1;
    this.loading = false;
    this.hasMore = true;

    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
    this.loadMore();
  }

  handleScroll() {
    if (this.loading || !this.hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 200) {
      this.loadMore();
    }
  }

  async loadMore() {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    try {
      const response = await fetch(
        `${this.endpoint}?page=${this.page}&limit=20`
      );
      const data = await response.json();

      if (data.items.length === 0) {
        this.hasMore = false;
      } else {
        this.renderFn(data.items);
        this.page++;
      }
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      this.loading = false;
    }
  }
}

// Usage
const scroll = new InfiniteScroll(
  'https://api.example.com/posts',
  document.getElementById('posts-container'),
  (items) => {
    items.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item.title;
      document.getElementById('posts-container').appendChild(div);
    });
  }
);
```

---

## 7. Caching Strategies

### Simple Memory Cache

```javascript
class Cache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;

    const age = Date.now() - item.timestamp;
    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

// Usage
const cache = new Cache(60000); // 1 minute TTL

async function fetchWithCache(url) {
  if (cache.has(url)) {
    console.log('Cache hit:', url);
    return cache.get(url);
  }

  console.log('Cache miss, fetching:', url);
  const response = await fetch(url);
  const data = await response.json();
  
  cache.set(url, data);
  return data;
}
```

### LRU Cache

```javascript
class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }

  set(key, value) {
    // Remove if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end
    this.cache.set(key, value);

    // Remove oldest if over capacity
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  has(key) {
    return this.cache.has(key);
  }
}

// Usage
const lruCache = new LRUCache(50);

async function cachedFetch(url) {
  if (lruCache.has(url)) {
    return lruCache.get(url);
  }

  const response = await fetch(url);
  const data = await response.json();
  lruCache.set(url, data);
  
  return data;
}
```

### HTTP Cache Headers

```javascript
async function fetchWithCacheHeaders(url) {
  const response = await fetch(url, {
    cache: 'default', // 'no-store', 'reload', 'no-cache', 'force-cache'
    headers: {
      'Cache-Control': 'max-age=3600'
    }
  });

  return response.json();
}

// Check cache headers
async function checkCacheStatus(url) {
  const response = await fetch(url);
  
  console.log('Cache-Control:', response.headers.get('Cache-Control'));
  console.log('ETag:', response.headers.get('ETag'));
  console.log('Last-Modified:', response.headers.get('Last-Modified'));
  console.log('Expires:', response.headers.get('Expires'));
  
  return response.json();
}
```

### LocalStorage Cache

```javascript
class LocalStorageCache {
  constructor(prefix = 'cache_') {
    this.prefix = prefix;
  }

  set(key, value, ttl = 3600000) {
    const item = {
      value,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(this.prefix + key, JSON.stringify(item));
  }

  get(key) {
    const itemStr = localStorage.getItem(this.prefix + key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const age = Date.now() - item.timestamp;

      if (age > item.ttl) {
        this.delete(key);
        return null;
      }

      return item.value;
    } catch (error) {
      this.delete(key);
      return null;
    }
  }

  delete(key) {
    localStorage.removeItem(this.prefix + key);
  }

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
}

// Usage
const storage = new LocalStorageCache('api_cache_');

async function persistentCachedFetch(url) {
  const cached = storage.get(url);
  if (cached) {
    return cached;
  }

  const response = await fetch(url);
  const data = await response.json();
  storage.set(url, data, 300000); // 5 minutes
  
  return data;
}
```

---

## 8. Practice Projects

### Project 1: Complete API Client

```javascript
class AdvancedAPIClient {
  constructor(config) {
    this.baseURL = config.baseURL;
    this.cache = new Cache(config.cacheTTL || 300000);
    this.rateLimiter = new RateLimiter(
      config.maxRequests || 10,
      config.timeWindow || 1000
    );
    this.retryHandler = new RetryHandler({
      maxRetries: config.maxRetries || 3
    });
    this.requestManager = new RequestManager();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Check cache
    if (options.method === 'GET' && this.cache.has(url)) {
      return this.cache.get(url);
    }

    // Apply rate limiting
    await this.rateLimiter.throttle();

    // Execute with retry logic
    const response = await this.retryHandler.execute(() => 
      this.requestManager.fetch(url, options)
    );

    const data = await response.json();

    // Cache GET requests
    if (options.method === 'GET') {
      this.cache.set(url, data);
    }

    return data;
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }

  cancelAll() {
    this.requestManager.cancelAll();
  }
}

// Usage
const api = new AdvancedAPIClient({
  baseURL: 'https://api.example.com',
  maxRequests: 5,
  timeWindow: 1000,
  cacheTTL: 60000,
  maxRetries: 3
});

api.get('/users').then(console.log);
```

### Project 2: Real-time Search with Debounce

```javascript
class SearchAPI {
  constructor() {
    this.manager = new RequestManager();
    this.debounceTimeout = null;
  }

  search(query, delay = 300) {
    return new Promise((resolve, reject) => {
      clearTimeout(this.debounceTimeout);

      this.debounceTimeout = setTimeout(async () => {
        try {
          const response = await this.manager.fetch(
            `https://api.example.com/search?q=${encodeURIComponent(query)}`
          );
          const data = await response.json();
          resolve(data);
        } catch (error) {
          if (error.name !== 'AbortError') {
            reject(error);
          }
        }
      }, delay);
    });
  }
}

// Usage in UI
const searchAPI = new SearchAPI();
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

searchInput.addEventListener('input', async (e) => {
  const query = e.target.value;

  if (query.length < 2) {
    resultsDiv.innerHTML = '';
    return;
  }

  try {
    const results = await searchAPI.search(query);
    resultsDiv.innerHTML = results.map(r => 
      `<div>${r.title}</div>`
    ).join('');
  } catch (error) {
    console.error('Search error:', error);
  }
});
```

### Project 3: Data Synchronization System

```javascript
class DataSync {
  constructor(apiClient) {
    this.api = apiClient;
    this.queue = [];
    this.syncing = false;
  }

  async addToQueue(action, data) {
    this.queue.push({ action, data, timestamp: Date.now() });
    await this.sync();
  }

  async sync() {
    if (this.syncing || this.queue.length === 0) return;

    this.syncing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];

      try {
        await this.processItem(item);
        this.queue.shift(); // Remove on success
      } catch (error) {
        console.error('Sync failed:', error);
        
        // Retry logic
        if (Date.now() - item.timestamp > 300000) {
          // Remove after 5 minutes
          this.queue.shift();
        } else {
          // Wait and retry
          await new Promise(r => setTimeout(r, 5000));
        }
      }
    }

    this.syncing = false;
  }  // ← This closing brace was missing!

  async processItem(item) {
    switch (item.action) {
      case 'create':
        await this.api.post('/items', item.data);
        break;
      case 'update':
        await this.api.put(`/items/${item.data.id}`, item.data);
        break;
      case 'delete':
        await this.api.delete(`/items/${item.data.id}`);
        break;
    }
  }
}

// Usage
const syncSystem = new DataSync(api);

// Add operations to queue
syncSystem.addToQueue('create', { name: 'New Item' });
syncSystem.addToQueue('update', { id: 123, name: 'Updated' });
syncSystem.addToQueue('delete', { id: 456 });
```

---

## Complete Real-World Example

### Building a Complete API Service

```javascript
// api-service.js
class APIService {
  constructor(config = {}) {
    this.baseURL = config.baseURL || 'https://api.example.com';
    this.timeout = config.timeout || 10000;
    this.cache = new Map();
    this.cacheTTL = config.cacheTTL || 300000; // 5 minutes
    this.requestQueue = [];
    this.maxConcurrent = config.maxConcurrent || 5;
    this.activeRequests = 0;
  }

  // Core request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}_${url}_${JSON.stringify(options.body || {})}`;

    // Check cache for GET requests
    if ((options.method || 'GET') === 'GET') {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    // Wait if too many concurrent requests
    await this.waitForSlot();
    this.activeRequests++;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful GET requests
      if ((options.method || 'GET') === 'GET') {
        this.setCache(cacheKey, data);
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    } finally {
      this.activeRequests--;
      this.processQueue();
    }
  }

  async waitForSlot() {
    if (this.activeRequests < this.maxConcurrent) return;

    return new Promise(resolve => {
      this.requestQueue.push(resolve);
    });
  }

  processQueue() {
    if (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const resolve = this.requestQueue.shift();
      resolve();
    }
  }

  getFromCache(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Convenience methods
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Batch requests
  async batch(requests) {
    return Promise.all(requests.map(req => 
      this.request(req.endpoint, req.options)
    ));
  }

  // Paginated fetch
  async fetchAllPages(endpoint, options = {}) {
    const limit = options.limit || 50;
    let page = 1;
    let allData = [];
    let hasMore = true;

    while (hasMore) {
      const data = await this.get(endpoint, { 
        ...options.params, 
        page, 
        limit 
      });

      allData = allData.concat(data.items || data);
      hasMore = (data.items || data).length === limit;
      page++;

      if (options.maxPages && page > options.maxPages) break;
    }

    return allData;
  }
}

// Export singleton instance
const apiService = new APIService({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  cacheTTL: 300000,
  maxConcurrent: 5
});

// Usage examples
async function examples() {
  // Simple GET
  const users = await apiService.get('/users');

  // GET with params
  const filteredUsers = await apiService.get('/users', { 
    role: 'admin', 
    active: true 
  });

  // POST
  const newUser = await apiService.post('/users', {
    name: 'John Doe',
    email: 'john@example.com'
  });

  // PUT
  const updated = await apiService.put('/users/123', {
    name: 'Jane Doe'
  });

  // DELETE
  await apiService.delete('/users/123');

  // Batch requests
  const results = await apiService.batch([
    { endpoint: '/users', options: { method: 'GET' } },
    { endpoint: '/posts', options: { method: 'GET' } },
    { endpoint: '/comments', options: { method: 'GET' } }
  ]);

  // Fetch all pages
  const allPosts = await apiService.fetchAllPages('/posts', {
    limit: 100,
    maxPages: 10
  });
}
```

---

## Advanced Patterns

### 1. Request Deduplication

```javascript
class RequestDeduplicator {
  constructor() {
    this.pending = new Map();
  }

  async fetch(url, options = {}) {
    const key = `${url}_${JSON.stringify(options)}`;

    // If request is pending, return the same promise
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    // Create new request
    const promise = fetch(url, options)
      .then(res => res.json())
      .finally(() => {
        this.pending.delete(key);
      });

    this.pending.set(key, promise);
    return promise;
  }
}

// Usage
const deduplicator = new RequestDeduplicator();

// These will result in only ONE actual request
const request1 = deduplicator.fetch('https://api.example.com/data');
const request2 = deduplicator.fetch('https://api.example.com/data');
const request3 = deduplicator.fetch('https://api.example.com/data');

Promise.all([request1, request2, request3])
  .then(results => {
    console.log('All got same data:', results);
  });
```

### 2. Optimistic Updates

```javascript
class OptimisticAPI {
  constructor(apiClient) {
    this.api = apiClient;
    this.rollbackStack = [];
  }

  async optimisticUpdate(localUpdate, apiCall, rollback) {
    // Apply local update immediately
    const previousState = localUpdate();

    try {
      // Make API call
      const result = await apiCall();
      return result;
    } catch (error) {
      // Rollback on error
      rollback(previousState);
      throw error;
    }
  }
}

// Usage example with a UI
class TodoList {
  constructor() {
    this.optimisticAPI = new OptimisticAPI(apiService);
    this.todos = [];
  }

  async addTodo(text) {
    const tempId = Date.now();
    const newTodo = { id: tempId, text, completed: false };

    await this.optimisticAPI.optimisticUpdate(
      // Local update
      () => {
        this.todos.push(newTodo);
        this.render();
        return this.todos.length - 1; // Save position
      },
      // API call
      () => apiService.post('/todos', { text }),
      // Rollback
      (position) => {
        this.todos.splice(position, 1);
        this.render();
      }
    );
  }

  render() {
    // Update UI
    console.log('Current todos:', this.todos);
  }
}
```

### 3. Polling with Smart Intervals

```javascript
class SmartPoller {
  constructor(config = {}) {
    this.url = config.url;
    this.interval = config.interval || 5000;
    this.maxInterval = config.maxInterval || 60000;
    this.backoffMultiplier = config.backoffMultiplier || 1.5;
    this.currentInterval = this.interval;
    this.polling = false;
    this.timeoutId = null;
  }

  start(callback) {
    if (this.polling) return;
    this.polling = true;
    this.poll(callback);
  }

  stop() {
    this.polling = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  async poll(callback) {
    if (!this.polling) return;

    try {
      const response = await fetch(this.url);
      const data = await response.json();
      
      callback(null, data);

      // Data changed, reset interval
      if (data.hasChanges) {
        this.currentInterval = this.interval;
      } else {
        // No changes, increase interval
        this.currentInterval = Math.min(
          this.currentInterval * this.backoffMultiplier,
          this.maxInterval
        );
      }
    } catch (error) {
      callback(error, null);
    }

    // Schedule next poll
    this.timeoutId = setTimeout(() => this.poll(callback), this.currentInterval);
  }

  reset() {
    this.currentInterval = this.interval;
  }
}

// Usage
const poller = new SmartPoller({
  url: 'https://api.example.com/status',
  interval: 2000,
  maxInterval: 30000,
  backoffMultiplier: 1.5
});

poller.start((error, data) => {
  if (error) {
    console.error('Poll error:', error);
  } else {
    console.log('Poll data:', data);
  }
});

// Stop polling when done
// poller.stop();
```

### 4. Progressive Enhancement

```javascript
class ProgressiveLoader {
  constructor(endpoints) {
    this.endpoints = endpoints;
    this.data = {};
    this.callbacks = [];
  }

  async load() {
    // Load critical data first
    for (const endpoint of this.endpoints) {
      try {
        const data = await fetch(endpoint.url).then(r => r.json());
        this.data[endpoint.key] = data;
        
        // Notify subscribers after each load
        this.notify(endpoint.key, data);

        // Wait a bit between loads to not overwhelm
        if (endpoint.priority === 'low') {
          await new Promise(r => setTimeout(r, 100));
        }
      } catch (error) {
        console.error(`Failed to load ${endpoint.key}:`, error);
      }
    }

    return this.data;
  }

  onUpdate(callback) {
    this.callbacks.push(callback);
  }

  notify(key, data) {
    this.callbacks.forEach(cb => cb(key, data));
  }
}

// Usage
const loader = new ProgressiveLoader([
  { key: 'critical', url: '/api/critical', priority: 'high' },
  { key: 'secondary', url: '/api/secondary', priority: 'medium' },
  { key: 'optional', url: '/api/optional', priority: 'low' }
]);

loader.onUpdate((key, data) => {
  console.log(`${key} loaded:`, data);
  // Update UI progressively as data arrives
});

loader.load();
```

---

## Best Practices Summary

### 1. Error Handling Checklist

- ✅ Always use try-catch for async operations
- ✅ Provide meaningful error messages
- ✅ Implement fallback strategies
- ✅ Log errors for debugging
- ✅ Show user-friendly error messages

### 2. Performance Optimization

- ✅ Implement caching for repeated requests
- ✅ Use request deduplication
- ✅ Apply rate limiting to avoid overwhelming servers
- ✅ Cancel unnecessary requests
- ✅ Use pagination for large datasets

### 3. User Experience

- ✅ Show loading states
- ✅ Implement optimistic updates
- ✅ Provide retry options
- ✅ Handle offline scenarios
- ✅ Progressive data loading

### 4. Security Considerations

- ✅ Validate all input data
- ✅ Use HTTPS for all requests
- ✅ Implement proper authentication
- ✅ Sanitize user input
- ✅ Handle sensitive data carefully

---

## Exercises

### Exercise 1: Build a Rate-Limited API Client

Create an API client that:

- Limits requests to 10 per second
- Implements exponential backoff retry
- Caches GET requests for 5 minutes
- Cancels duplicate requests

### Exercise 2: Infinite Scroll Implementation

Build an infinite scroll component that:

- Loads data as user scrolls
- Shows loading indicator
- Handles errors gracefully
- Prevents duplicate requests
- Works with both offset and cursor pagination

### Exercise 3: Offline-First Application

Create an app that:

- Queues requests when offline
- Syncs when connection restored
- Shows offline indicator
- Uses localStorage for persistence
- Handles conflicts

### Exercise 4: Real-Time Data Sync

Build a system that:

- Polls for updates every 5 seconds
- Implements smart polling (increases interval when no changes)
- Shows live updates in UI
- Handles connection errors
- Allows manual refresh

---

## Common Pitfalls to Avoid

### 1. Memory Leaks

```javascript
// ❌ Bad: Not cleaning up
function badComponent() {
  setInterval(() => fetch('/api/data'), 1000);
}

// ✅ Good: Clean up intervals
function goodComponent() {
  const intervalId = setInterval(() => fetch('/api/data'), 1000);
  
  return () => clearInterval(intervalId); // Cleanup function
}
```

### 2. Race Conditions

```javascript
// ❌ Bad: Can show stale data
let requestId = 0;
async function search(query) {
  const response = await fetch(`/search?q=${query}`);
  const data = await response.json();
  showResults(data); // Might be from old request!
}

// ✅ Good: Track request order
let requestId = 0;
async function search(query) {
  const currentRequestId = ++requestId;
  const response = await fetch(`/search?q=${query}`);
  const data = await response.json();
  
  // Only show if this is still the latest request
  if (currentRequestId === requestId) {
    showResults(data);
  }
}
```

### 3. Unhandled Promise Rejections

```javascript
// ❌ Bad: Unhandled rejection
fetch('/api/data').then(r => r.json());

// ✅ Good: Always handle errors
fetch('/api/data')
  .then(r => r.json())
  .catch(error => console.error('Error:', error));

// ✅ Better: Use async/await with try-catch
async function getData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### 4. Excessive API Calls

```javascript
// ❌ Bad: New request on every keystroke
input.addEventListener('input', (e) => {
  fetch(`/search?q=${e.target.value}`);
});

// ✅ Good: Debounce user input
let debounceTimer;
input.addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetch(`/search?q=${e.target.value}`);
  }, 300);
});
```

---

## Additional Resources

### Documentation

- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Axios Documentation](https://axios-http.com/)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

### Tools

- Postman - API testing
- JSON Server - Mock REST API
- Charles Proxy - Network debugging

### Further Learning

- REST API design principles
- GraphQL as an alternative
- WebSocket for real-time data
- Service Workers for offline support

---

## Conclusion

Mastering advanced API handling is crucial for building robust web applications. Key takeaways:

1. **Reliability**: Implement retry logic and error handling
2. **Performance**: Use caching and rate limiting
3. **User Experience**: Provide feedback and handle edge cases
4. **Maintainability**: Write clean, organized code
5. **Testing**: Test error scenarios and edge cases

Practice these patterns in your projects, and you'll be well-equipped to handle any API integration challenge!

---

**Next Steps**:

- Week 24: State Management Patterns
- Week 25: Performance Optimization
- Week 26: Testing Strategies

Happy coding! 🚀
  