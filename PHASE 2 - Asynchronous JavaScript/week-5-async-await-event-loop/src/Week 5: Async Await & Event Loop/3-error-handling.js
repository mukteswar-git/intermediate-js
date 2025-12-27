// Error Handling with try/catch

async function example() {
  try {
    const res = await fetch("invalid-url");
    const data = await res.json();
  } catch (error) {
    console.log("Error caught:", error.message);
  }
}

example();