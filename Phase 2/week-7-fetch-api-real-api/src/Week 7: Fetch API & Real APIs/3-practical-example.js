// Practical Examples

// Example 1: User Management System

const API_BASE = 'https://jsonpaceholder.typicode.com';

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


// Example 2: API Service Class

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
const updated = await api.post('/users/1', { name: 'Jane' });
await api.delete('/users/1')