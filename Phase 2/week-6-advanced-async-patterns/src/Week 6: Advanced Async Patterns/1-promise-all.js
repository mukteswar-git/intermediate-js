// Promise.all() - All or Nothing

// Basic Example
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve(42), 100));
const promise3 = Promise.resolve("foo");

const results = await Promise.all([promise1, promise2, promise3]);
console.log(results);

// Real-World Example: Fetching Multiple APIs

async function loadDashboard() {
  try {
    const [user, posts, comments] = await Promise.all([
      fetch('/api/user/1').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/comments').then(r => r.json())
    ]);

    return { user, posts, comments }
  } catch (error) {
    console.error("One of the requests failed:", error);
    throw error;
  }
}