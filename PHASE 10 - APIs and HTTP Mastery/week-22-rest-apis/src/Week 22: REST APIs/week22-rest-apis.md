# Week 22: REST APIs - Complete Intermediate Tutorial

## Table of Contents

1. [Introduction to REST APIs](#introduction-to-rest-apis)
2. [RESTful Principles](#restful-principles)
3. [HTTP Methods](#http-methods)
4. [Status Codes](#status-codes)
5. [HTTP Headers](#http-headers)
6. [Query Parameters](#query-parameters)
7. [Request Body Formats](#request-body-formats)
8. [CORS in Detail](#cors-in-detail)
9. [Authentication](#authentication)
10. [Building a REST API](#building-a-rest-api)
11. [Practical Projects](#practical-projects)

---

## Introduction to REST APIs

**REST** (Representational State Transfer) is an architectural style for designing networked applications. A REST API allows different applications to communicate over HTTP using standard methods.

### What is an API?

An API (Application Programming Interface) is a set of rules that allows one piece of software to interact with another. REST APIs use HTTP requests to perform CRUD operations:
- **C**reate (POST)
- **R**ead (GET)
- **U**pdate (PUT/PATCH)
- **D**elete (DELETE)

### Why REST?

- Simple and standardized
- Stateless (each request is independent)
- Scalable and cacheable
- Language-agnostic
- Works over HTTP/HTTPS

---

## RESTful Principles

### 1. Client-Server Architecture

The client and server are separate entities. The client handles the user interface, while the server manages data and business logic.

```javascript
// Client makes a request
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 2. Statelessness

Each request from client to server must contain all necessary information. The server doesn't store client context between requests.

```javascript
// Each request includes authentication
fetch('https://api.example.com/users', {
  headers: {
    'Authorization': 'Bearer token123'
  }
});
```

### 3. Cacheability

Responses should define themselves as cacheable or non-cacheable to improve performance.

```javascript
// Server response with cache headers
res.set('Cache-Control', 'public, max-age=3600');
```

### 4. Uniform Interface

REST APIs should have a consistent, standardized interface:

- **Resource-based URLs**: `/users`, `/products`, `/orders`
- **HTTP methods** for actions: GET, POST, PUT, DELETE
- **Self-descriptive messages**: JSON/XML with clear structure
- **HATEOAS**: Hypermedia as the Engine of Application State

```javascript
// Resource-based URL structure
GET    /api/users           // Get all users
GET    /api/users/123       // Get specific user
POST   /api/users           // Create new user
PUT    /api/users/123       // Update user
DELETE /api/users/123       // Delete user
```

### 5. Layered System

The client doesn't need to know if it's connected directly to the server or through intermediaries (load balancers, proxies).

### 6. Code on Demand (Optional)

Servers can extend client functionality by transferring executable code (like JavaScript).

---

## HTTP Methods

### GET - Retrieve Data

Used to fetch resources without modifying server state.

```javascript
// Get all users
fetch('https://api.example.com/users')
  .then(res => res.json())
  .then(users => console.log(users));

// Get specific user
fetch('https://api.example.com/users/123')
  .then(res => res.json())
  .then(user => console.log(user));
```

**Characteristics:**
- Safe (doesn't modify data)
- Idempotent (multiple identical requests have the same effect)
- Cacheable
- No request body

### POST - Create Resources

Used to create new resources on the server.

```javascript
// Create a new user
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
})
  .then(res => res.json())
  .then(newUser => console.log(newUser));
```

**Characteristics:**
- Not safe (modifies data)
- Not idempotent (multiple requests create multiple resources)
- May return created resource with 201 status

### PUT - Update/Replace Resources

Used to update an existing resource or create it if it doesn't exist (full replacement).

```javascript
// Update entire user object
fetch('https://api.example.com/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Smith',
    email: 'john.smith@example.com',
    age: 30,
    location: 'New York'
  })
})
  .then(res => res.json())
  .then(updatedUser => console.log(updatedUser));
```

**Characteristics:**
- Not safe (modifies data)
- Idempotent (multiple identical requests have the same effect)
- Requires complete resource representation

### PATCH - Partial Updates

Used to apply partial modifications to a resource.

```javascript
// Update only specific fields
fetch('https://api.example.com/users/123', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newemail@example.com'
  })
})
  .then(res => res.json())
  .then(updatedUser => console.log(updatedUser));
```

**Characteristics:**
- Not safe (modifies data)
- May or may not be idempotent
- Only requires fields to update

### DELETE - Remove Resources

Used to delete a resource from the server.

```javascript
// Delete a user
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
})
  .then(res => {
    if (res.ok) {
      console.log('User deleted successfully');
    }
  });
```

**Characteristics:**
- Not safe (modifies data)
- Idempotent (deleting multiple times has same effect)
- May return 204 (No Content) on success

### Method Comparison Table

| Method | Purpose | Idempotent | Safe | Request Body |
|--------|---------|-----------|------|--------------|
| GET | Retrieve | ✓ | ✓ | No |
| POST | Create | ✗ | ✗ | Yes |
| PUT | Replace | ✓ | ✗ | Yes |
| PATCH | Modify | Maybe | ✗ | Yes |
| DELETE | Remove | ✓ | ✗ | No |

---

## Status Codes

HTTP status codes indicate the result of an HTTP request.

### 2xx Success

#### 200 OK
The request succeeded. Used for successful GET, PUT, PATCH requests.

```javascript
// Server response
res.status(200).json({
  id: 123,
  name: 'John Doe'
});
```

#### 201 Created
A new resource was successfully created. Used for successful POST requests.

```javascript
// Server response for POST
res.status(201).json({
  id: 456,
  name: 'New User',
  createdAt: new Date()
});
```

#### 204 No Content
Request succeeded but no content to return. Common for DELETE requests.

```javascript
// Server response for DELETE
res.status(204).send();
```

### 3xx Redirection

#### 301 Moved Permanently
Resource permanently moved to a new URL.

#### 304 Not Modified
Resource hasn't changed (used with caching).

### 4xx Client Errors

#### 400 Bad Request
Server cannot process the request due to client error (invalid syntax, validation failure).

```javascript
// Server validation error
res.status(400).json({
  error: 'Bad Request',
  message: 'Email is required'
});
```

#### 401 Unauthorized
Authentication is required but not provided or failed.

```javascript
// Missing or invalid token
res.status(401).json({
  error: 'Unauthorized',
  message: 'Invalid authentication token'
});
```

#### 403 Forbidden
Server understood the request but refuses to authorize it.

```javascript
// User doesn't have permission
res.status(403).json({
  error: 'Forbidden',
  message: 'You do not have permission to access this resource'
});
```

#### 404 Not Found
The requested resource doesn't exist.

```javascript
// Resource not found
res.status(404).json({
  error: 'Not Found',
  message: 'User with ID 123 not found'
});
```

#### 409 Conflict
Request conflicts with current state (e.g., duplicate entry).

```javascript
// Duplicate resource
res.status(409).json({
  error: 'Conflict',
  message: 'User with this email already exists'
});
```

### 5xx Server Errors

#### 500 Internal Server Error
Generic server error when something unexpected happens.

```javascript
// Unexpected error
res.status(500).json({
  error: 'Internal Server Error',
  message: 'An unexpected error occurred'
});
```

#### 503 Service Unavailable
Server temporarily unavailable (maintenance, overload).

### Status Code Handling in Client

```javascript
fetch('https://api.example.com/users/123')
  .then(response => {
    if (response.status === 200) {
      return response.json();
    } else if (response.status === 404) {
      throw new Error('User not found');
    } else if (response.status === 401) {
      throw new Error('Unauthorized');
    } else if (response.status === 500) {
      throw new Error('Server error');
    }
    throw new Error('Request failed');
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

---

## HTTP Headers

Headers provide additional information about the request or response.

### Content-Type

Specifies the media type of the resource.

```javascript
// Client sends JSON
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'John' })
});

// Server responds with JSON
res.set('Content-Type', 'application/json');
res.json({ id: 1, name: 'John' });
```

**Common Content-Type values:**
- `application/json` - JSON data
- `application/x-www-form-urlencoded` - Form data
- `multipart/form-data` - File uploads
- `text/html` - HTML
- `text/plain` - Plain text
- `application/xml` - XML data

### Authorization

Contains credentials for authenticating the client.

```javascript
// Bearer token authentication
fetch('https://api.example.com/users', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});

// Basic authentication
const credentials = btoa('username:password');
fetch('https://api.example.com/users', {
  headers: {
    'Authorization': `Basic ${credentials}`
  }
});
```

### Accept

Tells the server what content types the client can handle.

```javascript
fetch('https://api.example.com/users', {
  headers: {
    'Accept': 'application/json'
  }
});
```

### Other Important Headers

```javascript
// Custom headers
fetch('https://api.example.com/users', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123',
    'Accept': 'application/json',
    'User-Agent': 'MyApp/1.0',
    'X-Custom-Header': 'custom-value'
  }
});
```

**Common headers:**
- `Cache-Control` - Caching directives
- `Access-Control-Allow-Origin` - CORS policy
- `ETag` - Resource version identifier
- `Location` - Redirect URL
- `Set-Cookie` - Set cookies
- `Cookie` - Send cookies

---

## Query Parameters

Query parameters allow filtering, sorting, and pagination of resources.

### Basic Query Parameters

```javascript
// Simple filter
fetch('https://api.example.com/users?role=admin')
  .then(res => res.json())
  .then(users => console.log(users));

// Multiple parameters
fetch('https://api.example.com/users?role=admin&status=active')
  .then(res => res.json())
  .then(users => console.log(users));
```

### Pagination

```javascript
// Page-based pagination
fetch('https://api.example.com/users?page=2&limit=10')
  .then(res => res.json())
  .then(data => {
    console.log(data.users);
    console.log(`Page ${data.page} of ${data.totalPages}`);
  });

// Offset-based pagination
fetch('https://api.example.com/users?offset=20&limit=10')
  .then(res => res.json());
```

### Sorting

```javascript
// Sort by field
fetch('https://api.example.com/users?sort=name')
  .then(res => res.json());

// Sort descending
fetch('https://api.example.com/users?sort=-createdAt')
  .then(res => res.json());

// Multiple sort fields
fetch('https://api.example.com/users?sort=lastName,firstName')
  .then(res => res.json());
```

### Filtering

```javascript
// Range filters
fetch('https://api.example.com/products?minPrice=10&maxPrice=100')
  .then(res => res.json());

// Search
fetch('https://api.example.com/users?search=john')
  .then(res => res.json());

// Multiple values
fetch('https://api.example.com/products?category=electronics,books')
  .then(res => res.json());
```

### Field Selection

```javascript
// Return only specific fields
fetch('https://api.example.com/users?fields=id,name,email')
  .then(res => res.json());
```

### Building Query Strings

```javascript
// Manual construction
const params = new URLSearchParams({
  role: 'admin',
  status: 'active',
  page: 2,
  limit: 10
});

fetch(`https://api.example.com/users?${params}`)
  .then(res => res.json());

// Using object
const queryParams = {
  role: 'admin',
  status: 'active',
  sort: '-createdAt'
};

const queryString = Object.keys(queryParams)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
  .join('&');

fetch(`https://api.example.com/users?${queryString}`)
  .then(res => res.json());
```

---

## Request Body Formats

### JSON Format

The most common format for REST APIs.

```javascript
// Sending JSON data
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    address: {
      street: '123 Main St',
      city: 'New York'
    },
    hobbies: ['reading', 'coding']
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Form Data

Used for file uploads and traditional form submissions.

```javascript
// Form data for file upload
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('avatar', fileInput.files[0]);

fetch('https://api.example.com/users', {
  method: 'POST',
  body: formData
  // Note: Don't set Content-Type header, browser sets it automatically
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### URL Encoded

Traditional form submission format.

```javascript
// URL encoded data
const params = new URLSearchParams();
params.append('name', 'John Doe');
params.append('email', 'john@example.com');

fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: params
})
  .then(res => res.json());
```

### Text/Plain

For simple text data.

```javascript
fetch('https://api.example.com/notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain'
  },
  body: 'This is a simple note'
})
  .then(res => res.text());
```

---

## CORS in Detail

**CORS** (Cross-Origin Resource Sharing) is a security mechanism that controls which origins can access your API.

### What is CORS?

CORS prevents JavaScript from making requests to a different domain than the one that served the web page (same-origin policy).

**Same Origin:**
- Same protocol (http/https)
- Same domain
- Same port

```javascript
// Same origin - Allowed
// Page: https://example.com
// API:  https://example.com/api

// Different origin - Blocked without CORS
// Page: https://example.com
// API:  https://api.different.com
```

### CORS Headers

#### Access-Control-Allow-Origin

Specifies which origins can access the resource.

```javascript
// Allow specific origin
res.set('Access-Control-Allow-Origin', 'https://example.com');

// Allow all origins (not recommended for production)
res.set('Access-Control-Allow-Origin', '*');

// Dynamic origin
const allowedOrigins = ['https://example.com', 'https://app.example.com'];
const origin = req.headers.origin;

if (allowedOrigins.includes(origin)) {
  res.set('Access-Control-Allow-Origin', origin);
}
```

#### Access-Control-Allow-Methods

Specifies allowed HTTP methods.

```javascript
res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
```

#### Access-Control-Allow-Headers

Specifies allowed request headers.

```javascript
res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

#### Access-Control-Allow-Credentials

Allows cookies and authentication.

```javascript
res.set('Access-Control-Allow-Credentials', 'true');
```

#### Access-Control-Max-Age

Specifies how long preflight results can be cached.

```javascript
res.set('Access-Control-Max-Age', '3600'); // 1 hour
```

### Preflight Requests

For complex requests (PUT, DELETE, custom headers), browsers send a preflight OPTIONS request.

```javascript
// Express CORS middleware
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'https://example.com');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
```

### Using CORS Package (Express)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Simple usage - Allow all origins
app.use(cors());

// Configured usage
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600
}));

// Dynamic origin
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['https://example.com', 'https://app.example.com'];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Route-specific CORS
app.get('/public', cors(), (req, res) => {
  res.json({ message: 'Public endpoint' });
});

app.post('/restricted', cors({ origin: 'https://example.com' }), (req, res) => {
  res.json({ message: 'Restricted endpoint' });
});
```

### CORS Error Handling

```javascript
// Client-side error handling
fetch('https://api.example.com/users')
  .then(res => res.json())
  .catch(error => {
    if (error.message.includes('CORS')) {
      console.error('CORS error - check server configuration');
    }
  });
```

---

## Authentication

### JWT (JSON Web Tokens)

JWT is a compact, self-contained way to securely transmit information between parties.

#### JWT Structure

A JWT consists of three parts: Header, Payload, Signature

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkpvaG4ifQ.signature
|____________Header____________|.|_________Payload________|.|signature|
```

#### Creating JWTs

```javascript
const jwt = require('jsonwebtoken');

// Secret key (store in environment variables)
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Generate token
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  
  const options = {
    expiresIn: '24h' // Token expires in 24 hours
  };
  
  return jwt.sign(payload, SECRET_KEY, options);
}

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Verify credentials (example)
  const user = await findUserByEmail(email);
  
  if (!user || !await verifyPassword(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = generateToken(user);
  
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});
```

### Error Handling Middleware

```javascript
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});
```

### Start Server

```javascript
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Testing the API

```javascript
// test-api.js - Client-side testing script

// Base URL
const API_URL = 'http://localhost:3000/api';
let authToken = '';

// Register user
async function register() {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  console.log('Register:', data);
  authToken = data.token;
}

// Login
async function login() {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  console.log('Login:', data);
  authToken = data.token;
}

// Create post
async function createPost() {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      title: 'My First Post',
      content: 'This is the content of my first post',
      tags: ['javascript', 'rest-api']
    })
  });
  
  const data = await response.json();
  console.log('Create Post:', data);
  return data.post.id;
}

// Get all posts
async function getPosts() {
  const response = await fetch(`${API_URL}/posts?page=1&limit=10&sort=-createdAt`);
  const data = await response.json();
  console.log('All Posts:', data);
}

// Get single post
async function getPost(id) {
  const response = await fetch(`${API_URL}/posts/${id}`);
  const data = await response.json();
  console.log('Single Post:', data);
}

// Update post
async function updatePost(id) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      title: 'Updated Title'
    })
  });
  
  const data = await response.json();
  console.log('Update Post:', data);
}

// Delete post
async function deletePost(id) {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  
  console.log('Delete Post:', response.status === 204 ? 'Success' : 'Failed');
}

// Run tests
async function runTests() {
  try {
    await register();
    await login();
    const postId = await createPost();
    await getPosts();
    await getPost(postId);
    await updatePost(postId);
    await deletePost(postId);
  } catch (error) {
    console.error('Test Error:', error);
  }
}

runTests();
```
#### Verifying JWTs

```javascript
// Middleware to verify token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = user; // Attach user info to request
    next();
  });
}

// Protected route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    userId: req.user.userId,
    email: req.user.email
  });
});
```

#### Client-Side JWT Usage

```javascript
// Store token after login
async function login(email, password) {
  const response = await fetch('https://api.example.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    return data.user;
  } else {
    throw new Error(data.error);
  }
}

// Use token for authenticated requests
async function fetchUserProfile() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('https://api.example.com/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  
  return response.json();
}

// Logout
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

#### Refresh Tokens

```javascript
// Generate both access and refresh tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_SECRET_KEY,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// Refresh token endpoint
app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  
  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    const accessToken = jwt.sign(
      { userId: user.userId },
      SECRET_KEY,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken });
  });
});
```
### OAuth 2.0 Basics

OAuth is an authorization framework that allows third-party applications to access user data without exposing passwords.

#### OAuth Flow (Authorization Code)

1. **User clicks "Login with Google/Facebook/etc"**
2. **Redirect to provider's authorization page**
3. **User grants permission**
4. **Provider redirects back with authorization code**
5. **Exchange code for access token**
6. **Use access token to access user data**

#### OAuth Implementation Example

```javascript
// Step 1: Redirect to OAuth provider
app.get('/auth/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=profile email`;
  
  res.redirect(authUrl);
});

// Step 2: Handle callback
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  
  // Exchange code for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  });
  
  const { access_token } = await tokenResponse.json();
  
  // Get user info
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
  
  const userInfo = await userResponse.json();
  
  // Create session or JWT for your app
  const appToken = generateToken(userInfo);
  
  res.json({ token: appToken, user: userInfo });
});
```

#### Using OAuth Libraries

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    // Find or create user in database
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);
```
### Post Routes

```javascript
// Get all posts (with filtering, sorting, pagination)
app.get('/api/posts', (req, res) => {
  try {
    let filteredPosts = [...posts];
    
    // Filter by author
    if (req.query.author) {
      filteredPosts = filteredPosts.filter(p => 
        p.author.username.toLowerCase().includes(req.query.author.toLowerCase())
      );
    }
    
    // Search in title and content
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filteredPosts = filteredPosts.filter(p => 
        p.title.toLowerCase().includes(search) || 
        p.content.toLowerCase().includes(search)
      );
    }
    
    // Sort
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') 
        ? req.query.sort.slice(1) 
        : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      
      filteredPosts.sort((a, b) => {
        if (a[sortField] > b[sortField]) return sortOrder;
        if (a[sortField] < b[sortField]) return -sortOrder;
        return 0;
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    res.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
app.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
});

// Create post (protected)
app.post('/api/posts', authenticateToken, (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }
    
    // Find author
    const author = users.find(u => u.id === req.user.userId);
    
    // Create post
    const newPost = {
      id: postIdCounter++,
      title,
      content,
      tags: tags || [],
      author: {
        id: author.id,
        username: author.username
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    posts.push(newPost);
    
    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update post (protected)
app.put('/api/posts/:id', authenticateToken, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check ownership
    if (post.author.id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }
    
    const { title, content, tags } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }
    
    // Update post (full replacement)
    post.title = title;
    post.content = content;
    post.tags = tags || [];
    post.updatedAt = new Date();
    
    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Partially update post (protected)
app.patch('/api/posts/:id', authenticateToken, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check ownership
    if (post.author.id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }
    
    const { title, content, tags } = req.body;
    
    // Update only provided fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    post.updatedAt = new Date();
    
    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post (protected)
app.delete('/api/posts/:id', authenticateToken, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const post = posts[postIndex];
    
    // Check ownership
    if (post.author.id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    posts.splice(postIndex, 1);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

---

## Building a REST API

Let's build a complete REST API for a blog application using Express.js.

### Project Setup

```javascript
// Install dependencies
// npm init -y
// npm install express body-parser cors jsonwebtoken bcrypt

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (use real database in production)
const users = [];
const posts = [];
let userIdCounter = 1;
let postIdCounter = 1;
```

### Authentication Middleware

```javascript
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
```

### User Routes

```javascript
// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      id: userIdCounter++,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Generate token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  });
});
```
---

## Practical Projects

### Project 1: Task Manager API

Build a complete task management REST API with the following features:

**Requirements:**
- User authentication (register, login)
- CRUD operations for tasks
- Task categories and priority levels
- Search and filter tasks
- Mark tasks as complete/incomplete
- Due dates and reminders

**Endpoints:**
```
POST   /api/register
POST   /api/login
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tasks/completed
GET    /api/tasks/pending
```

**Sample Task Object:**
```javascript
{
  id: 1,
  title: "Complete REST API tutorial",
  description: "Finish learning about REST APIs",
  priority: "high",
  category: "Learning",
  dueDate: "2026-01-20",
  completed: false,
  createdBy: 1,
  createdAt: "2026-01-15T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z"
}
```

### Project 2: E-Commerce API

Create a simple e-commerce REST API.

**Features:**
- Product catalog with categories
- Shopping cart management
- Order processing
- User reviews and ratings
- Inventory management

**Endpoints:**
```
GET    /api/products
GET    /api/products/:id
POST   /api/products (admin only)
PUT    /api/products/:id (admin only)
DELETE /api/products/:id (admin only)
GET    /api/cart
POST   /api/cart/items
DELETE /api/cart/items/:id
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
```

### Project 3: Social Media API

Build a social media platform API.

**Features:**
- User profiles
- Posts with images
- Comments and likes
- Follow/unfollow users
- News feed
- Hashtags and mentions

**Endpoints:**
```
GET    /api/users/:id
PUT    /api/users/:id
POST   /api/posts
GET    /api/posts
DELETE /api/posts/:id
POST   /api/posts/:id/like
DELETE /api/posts/:id/like
POST   /api/posts/:id/comments
GET    /api/feed
POST   /api/users/:id/follow
DELETE /api/users/:id/follow
```

---

## Best Practices

### 1. API Versioning

Always version your API to maintain backward compatibility.

```javascript
// URL versioning
app.use('/api/v1', routesV1);
app.use('/api/v2', routesV2);

// Header versioning
app.use((req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  req.apiVersion = version;
  next();
});
```

### 2. Rate Limiting

Protect your API from abuse.

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

### 3. Input Validation

Always validate and sanitize user input.

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Process request
  }
);
```

### 4. Use HTTPS in Production

Always use HTTPS to encrypt data in transit.

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(443);
```

### 5. Proper Error Responses

Return consistent error responses.

```javascript
// Error response format
{
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Email is required',
    details: [
      {
        field: 'email',
        message: 'Email must be a valid email address'
      }
    ]
  }
}
```

### 6. Documentation

Document your API using tools like Swagger/OpenAPI.

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

### 7. Logging

Implement comprehensive logging.

```javascript
const morgan = require('morgan');
const winston = require('winston');

// HTTP request logging
app.use(morgan('combined'));

// Application logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.post('/api/posts', (req, res) => {
  logger.info('Creating new post', { userId: req.user.id });
  // Handle request
});
```

---

## Summary

In this tutorial, you learned:

✅ RESTful principles and architecture  
✅ HTTP methods (GET, POST, PUT, PATCH, DELETE)  
✅ Status codes and when to use them  
✅ HTTP headers (Content-Type, Authorization)  
✅ Query parameters for filtering and pagination  
✅ Request body formats (JSON, FormData)  
✅ CORS configuration and preflight requests  
✅ Authentication with JWT and OAuth basics  
✅ Building a complete REST API with Express  
✅ Best practices for production APIs  

### Next Steps

1. Build one of the practical projects
2. Add a database (MongoDB, PostgreSQL)
3. Implement file uploads
4. Add WebSocket support for real-time features
5. Deploy your API to a cloud platform
6. Learn about GraphQL as an alternative to REST
7. Explore API security in depth
8. Study microservices architecture

### Additional Resources

- MDN Web Docs: HTTP
- REST API Tutorial: restfulapi.net
- Express.js Documentation
- JWT.io
- OAuth 2.0 Documentation
- Postman for API testing
- Swagger/OpenAPI Specification

---

**Happy Coding! 🚀**