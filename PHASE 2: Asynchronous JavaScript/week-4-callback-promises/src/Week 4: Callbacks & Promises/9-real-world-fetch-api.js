// Real-World Example: Fetch API

fetch('https://jsonplaceholder.typicode.com/users/1')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); 
  })
  .then(data => {
    console.log(data.name);
  })
  .catch(error => {
    console.log('Fetch error:', error);
  });

// Chaining Multiple API Calls

// Get user, then get their posts
fetch('https://jsonplaceholder.typicode.com/users/1')
  .then(response => response.json())
  .then(user => {
    console.log('User:', user.name);
    return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
  })
  .then(response => response.json())
  .then(posts => {
    console.log('Posts:', posts.length);
  })
  .catch(error => {
    console.log('Error:', error)
  });