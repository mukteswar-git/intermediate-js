// Rewriting Promises with async/await

// Promise Chain (Old Way)
// fetch(url)
//   .then(res => res.json())
//   .then(data => console.log(data))
//   .catch(err => console.error(err));

// Async/Await Version (Better)

async function fetchData() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}