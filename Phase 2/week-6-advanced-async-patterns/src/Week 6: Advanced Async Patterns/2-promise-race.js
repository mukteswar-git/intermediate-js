// Promise.race() - First to Finish

// Basic Example
const slow = new Promise(resolve => setTimeout(() => resolve("slow"), 1000));
const fast = new Promise(resolve => setTimeout(() => resolve("fast"), 100));

const result = await Promise.race([slow, fast]);
console.log(result);

// Real-World Example: Request Timeout
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