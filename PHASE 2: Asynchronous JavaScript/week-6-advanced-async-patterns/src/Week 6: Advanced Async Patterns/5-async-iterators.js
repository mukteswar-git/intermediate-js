// Async Iterators

// Basic Async Iterator
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

// Real-World Example: Paginated API
async function fetchPages(url) {
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