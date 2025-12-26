// Async Generators

// Basic Async Generator
async function* generateNumbers() {
  for (let i = 1; i <= 3; i++) {
    await delay(1000);
    yield i;
  }
}

// Usage
const gen = generateNumbers();
console.log(await gen.next());
console.log(await gen.next());
console.log(await gen.next());
console.log(await gen.next());

// Real-World Example: Live Updates
async function* pollForUpdates(endpoint, interval = 5000) {
  while (true) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      yield data;
    } catch (error) {
      yield { error: error.message }
    }

    await delay(interval)
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