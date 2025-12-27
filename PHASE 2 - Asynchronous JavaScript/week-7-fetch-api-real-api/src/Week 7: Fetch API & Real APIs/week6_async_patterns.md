# Week 7: Fetch API & Real APIs

## Table of Contents
1. [Introduction to Fetch API](#introduction-to-fetch-api)
2. [Fetch API Basics](#fetch-api-basics)
3. [HTTP Methods: GET, POST, PUT, DELETE](#http-methods)
4. [Headers and Request Options](#headers-and-request-options)
5. [Handling JSON](#handling-json)
6. [Understanding CORS](#understanding-cors)
7. [HTTP Status Codes](#http-status-codes)
8. [Error Handling in Fetch](#error-handling-in-fetch)
9. [Practical Examples](#practical-examples)
10. [Best Practices](#best-practices)

---

## Introduction to Fetch API

The Fetch API provides a modern interface for making HTTP requests in JavaScript. It returns Promises, making it easier to work with asynchronous operations compared to older methods like XMLHttpRequest.

### Why Use Fetch?
- Clean, promise-based syntax
- Built into modern browsers
- More powerful and flexible
- Better error handling
- Works seamlessly with async/await

---

## Fetch API Basics

### Basic Syntax

```javascript
fetch(url, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Simple GET Request

```javascript
// Basic GET request
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Using Async/Await (Recommended)

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData();
```

---

## HTTP Methods

### GET Request (Read Data)

GET requests retrieve data from a server.

```javascript
async function getData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```

### POST Request (Create Data)

POST requests send data to create new resources.

```javascript
async function createPost() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'My New Post',
        body: 'This is the content of my post',
        userId: 1
      })
    });
    
    const data = await response.json();
    console.log('Created:', data);
  } catch (error) {
    console.error('Error creating post:', error);
  }
}
```

### PUT Request (Update Data - Full Replace)

PUT requests update existing resources by replacing them entirely.

```javascript
async function updatePost(postId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: postId,
        title: 'Updated Post Title',
        body: 'This is the updated content',
        userId: 1
      })
    });
    
    const data = await response.json();
    console.log('Updated:', data);
  } catch (error) {
    console.error('Error updating post:', error);
  }
}
```

### PATCH Request (Update Data - Partial Update)

PATCH requests partially update existing resources.

```javascript
async function patchPost(postId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Only Update Title'
      })
    });
    
    const data = await response.json();
    console.log('Patched:', data);
  } catch (error) {
    console.error('Error patching post:', error);
  }
}
```

### DELETE Request (Remove Data)

DELETE requests remove resources.

```javascript
async function deletePost(postId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log('Post deleted successfully');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}
```

---

## Headers and Request Options

### Common Headers

```javascript
const headers = {
  'Content-Type': 'application/json',      // JSON data
  'Authorization': 'Bearer YOUR_TOKEN',     // Authentication
  'Accept': 'application/json',             // Expected response type
  'X-Custom-Header': 'custom-value'        // Custom headers
};
```

### Complete Options Object

```javascript
const options = {
  method: 'POST',                    // HTTP method
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify(data),        // Request body (for POST/PUT/PATCH)
  mode: 'cors',                      // cors, no-cors, same-origin
  credentials: 'include',            // include, same-origin, omit
  cache: 'no-cache',                 // Cache mode
  redirect: 'follow',                // Redirect mode
  referrerPolicy: 'no-referrer'      // Referrer policy
};

fetch('https://api.example.com/data', options);
```

### Authentication Examples

```javascript
// Bearer Token
async function fetchWithAuth() {
  const token = 'your-jwt-token';
  
  const response = await fetch('https://api.example.com/protected', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data;
}

// API Key
async function fetchWithApiKey() {
  const response = await fetch('https://api.example.com/data', {
    headers: {
      'X-API-Key': 'your-api-key'
    }
  });
  
  const data = await response.json();
  return data;
}
```

---

## Handling JSON

### Parsing JSON Responses

```javascript
async function handleJSON() {
  const response = await fetch('https://api.example.com/data');
  
  // Parse JSON
  const data = await response.json();
  console.log(data);
}
```

### Sending JSON Data

```javascript
async function sendJSON() {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  };
  
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)  // Convert object to JSON string
  });
  
  const result = await response.json();
  return result;
}
```

### Other Response Methods

```javascript
// Get response as text
const text = await response.text();

// Get response as blob (for images, files)
const blob = await response.blob();

// Get response as form data
const formData = await response.formData();

// Get response as array buffer
const buffer = await response.arrayBuffer();

// Clone response (can only read response once)
const clone = response.clone();
```

---

## Understanding CORS

### What is CORS?

Cross-Origin Resource Sharing (CORS) is a security feature that restricts web pages from making requests to a different domain than the one serving the web page.

### CORS Modes

```javascript
// 1. cors (default) - Follow CORS protocol
fetch('https://api.example.com/data', {
  mode: 'cors'
});

// 2. no-cors - Limited, no access to response
fetch('https://api.example.com/data', {
  mode: 'no-cors'
});

// 3. same-origin - Only same-origin requests
fetch('/api/data', {
  mode: 'same-origin'
});
```

### Common CORS Issues

```javascript
// ❌ This will likely fail due to CORS
fetch('https://different-domain.com/api/data')
  .then(response => response.json())
  .catch(error => console.error('CORS error:', error));

// ✅ Solutions:
// 1. Server must include CORS headers:
//    Access-Control-Allow-Origin: *
//    Access-Control-Allow-Methods: GET, POST, PUT, DELETE
//    Access-Control-Allow-Headers: Content-Type

// 2. Use a proxy server for development
// 3. Request server admin to add your domain to allowed origins
```

### CORS with Credentials

```javascript
// Send cookies with cross-origin request
fetch('https://api.example.com/data', {
  credentials: 'include'  // include, same-origin, omit
});
```

---

## HTTP Status Codes

### Common Status Codes

```javascript
// Success (2xx)
200 // OK - Request succeeded
201 // Created - New resource created
204 // No Content - Success but no content to return

// Redirection (3xx)
301 // Moved Permanently
302 // Found (temporary redirect)
304 // Not Modified (cached)

// Client Errors (4xx)
400 // Bad Request - Invalid syntax
401 // Unauthorized - Authentication required
403 // Forbidden - No permission
404 // Not Found - Resource doesn't exist
429 // Too Many Requests - Rate limited

// Server Errors (5xx)
500 // Internal Server Error
502 // Bad Gateway
503 // Service Unavailable
```

### Checking Status Codes

```javascript
async function checkStatus() {
  const response = await fetch('https://api.example.com/data');
  
  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('OK?:', response.ok);  // true if status 200-299
  
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`HTTP Error: ${response.status}`);
  }
}
```

### Handling Different Status Codes

```javascript
async function handleStatusCodes(url) {
  try {
    const response = await fetch(url);
    
    switch (response.status) {
      case 200:
        return await response.json();
        
      case 201:
        console.log('Resource created successfully');
        return await response.json();
        
      case 204:
        console.log('Success, no content');
        return null;
        
      case 400:
        throw new Error('Bad request - check your data');
        
      case 401:
        throw new Error('Unauthorized - please log in');
        
      case 403:
        throw new Error('Forbidden - you don\'t have permission');
        
      case 404:
        throw new Error('Resource not found');
        
      case 500:
        throw new Error('Server error - please try again later');
        
      default:
        throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

## Error Handling in Fetch

### Basic Error Handling

```javascript
async function basicErrorHandling() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    // Handle network errors and thrown errors
    console.error('Fetch error:', error);
    throw error;
  }
}
```

### Comprehensive Error Handling

```javascript
async function comprehensiveErrorHandling(url) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000)  // 5 second timeout
    });
    
    // Check response status
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorBody}`);
    }
    
    // Try to parse JSON
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      throw new Error('Invalid JSON response');
    }
    
  } catch (error) {
    // Handle different error types
    if (error.name === 'AbortError') {
      console.error('Request timeout');
    } else if (error.name === 'TypeError') {
      console.error('Network error or CORS issue');
    } else {
      console.error('Error:', error.message);
    }
    
    throw error;
  }
}
```

### Request Timeout

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return await response.json();
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
```

### Retry Logic

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      
      if (isLastAttempt) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, i) * 1000;
      console.log(`Retry ${i + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

---

## Practical Examples

### Example 1: User Management System

```javascript
const API_BASE = 'https://jsonplaceholder.typicode.com';

// Get all users
async function getUsers() {
  try {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

// Get single user
async function getUser(userId) {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`);
    if (!response.ok) throw new Error('User not found');
    return await response.json();
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Create user
async function createUser(userData) {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Update user
async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

// Delete user
async function deleteUser(userId) {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}
```

### Example 2: API Service Class

```javascript
class APIService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }
  
  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      // Handle no content responses
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
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
  
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Usage
const api = new APIService('https://api.example.com');
api.setAuthToken('your-token-here');

// Make requests
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'John' });
const updated = await api.put('/users/1', { name: 'Jane' });
await api.delete('/users/1');
```

### Example 3: Weather App

```javascript
class WeatherAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
  }
  
  async getCurrentWeather(city) {
    try {
      const response = await fetch(
        `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found');
        }
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      
      return {
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      };
      
    } catch (error) {
      console.error('Weather API Error:', error);
      throw error;
    }
  }
  
  async getForecast(city, days = 5) {
    try {
      const response = await fetch(
        `${this.baseURL}/forecast?q=${city}&appid=${this.apiKey}&units=metric&cnt=${days * 8}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch forecast');
      
      const data = await response.json();
      return data.list;
      
    } catch (error) {
      console.error('Forecast API Error:', error);
      throw error;
    }
  }
}

// Usage
const weather = new WeatherAPI('your-api-key');
const current = await weather.getCurrentWeather('London');
console.log(current);
```

---

## Best Practices

### 1. Always Handle Errors

```javascript
// ❌ Bad - No error handling
const data = await fetch(url).then(r => r.json());

// ✅ Good - Proper error handling
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
} catch (error) {
  console.error('Error:', error);
}
```

### 2. Check Response Status

```javascript
// ✅ Always check response.ok or response.status
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

### 3. Use Async/Await

```javascript
// ✅ More readable with async/await
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

### 4. Create Reusable API Functions

```javascript
// ✅ Centralize API logic
const api = {
  baseURL: 'https://api.example.com',
  
  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  }
};
```

### 5. Use Environment Variables for API Keys

```javascript
// ✅ Never hardcode API keys
const API_KEY = process.env.API_KEY;
// or
const API_KEY = import.meta.env.VITE_API_KEY;
```

### 6. Implement Loading States

```javascript
let isLoading = false;

async function fetchWithLoading(url) {
  isLoading = true;
  try {
    const data = await fetch(url).then(r => r.json());
    return data;
  } finally {
    isLoading = false;
  }
}
```

### 7. Cancel Requests When Needed

```javascript
const controller = new AbortController();

fetch(url, { signal: controller.signal });

// Cancel the request
controller.abort();
```

### 8. Use TypeScript for Type Safety (Optional)

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

---

## Practice Exercises

### Exercise 1: Todo List API
Create a todo list that uses the JSONPlaceholder API to GET, POST, PUT, and DELETE todos.

### Exercise 2: User Directory
Build a user directory that fetches users from an API and displays them with search and filter functionality.

### Exercise 3: Weather Dashboard
Create a weather dashboard that fetches data from a weather API and displays current conditions and forecasts.

### Exercise 4: Error Handling
Implement comprehensive error handling for various HTTP status codes and network errors.

### Exercise 5: API Service Class
Create a reusable API service class with authentication, error handling, and retry logic.

---

## Additional Resources

- [MDN Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JSONPlaceholder - Free Fake API](https://jsonplaceholder.typicode.com/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [Understanding CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Public APIs for Practice](https://github.com/public-apis/public-apis)

---

## Summary

This week you learned about the Fetch API, one of the most important tools for modern web development. You now know how to make HTTP requests, handle responses, work with different HTTP methods, manage errors, and understand CORS. Practice these concepts by building projects that interact with real APIs to solidify your understanding.