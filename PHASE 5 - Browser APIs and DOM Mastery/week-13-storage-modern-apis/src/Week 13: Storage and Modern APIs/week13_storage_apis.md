# Week 13: Storage & Modern Web APIs

## Table of Contents
1. [localStorage and sessionStorage](#localstorage-and-sessionstorage)
2. [IndexedDB Basics](#indexeddb-basics)
3. [Cookies](#cookies)
4. [Service Workers (Introduction)](#service-workers-introduction)
5. [Web Workers](#web-workers)
6. [Geolocation API](#geolocation-api)
7. [Notification API](#notification-api)
8. [Practice Exercises](#practice-exercises)

---

## localStorage and sessionStorage

### Overview
Web Storage API provides two mechanisms for storing data in the browser: `localStorage` and `sessionStorage`. Both store data as key-value pairs.

### Key Differences

| Feature | localStorage | sessionStorage |
|---------|-------------|----------------|
| **Persistence** | Persists even after browser closes | Cleared when tab/window closes |
| **Scope** | Shared across all tabs/windows from same origin | Limited to single tab/window |
| **Capacity** | ~5-10MB (varies by browser) | ~5-10MB (varies by browser) |

### Basic Operations

```javascript
// STORING DATA
localStorage.setItem('username', 'john_doe');
sessionStorage.setItem('sessionId', '12345');

// RETRIEVING DATA
const username = localStorage.getItem('username');
const sessionId = sessionStorage.getItem('sessionId');

// REMOVING DATA
localStorage.removeItem('username');
sessionStorage.removeItem('sessionId');

// CLEARING ALL DATA
localStorage.clear();
sessionStorage.clear();

// CHECKING IF KEY EXISTS
if (localStorage.getItem('username') !== null) {
    console.log('Username exists');
}

// GETTING NUMBER OF ITEMS
console.log(localStorage.length);

// GETTING KEY BY INDEX
const firstKey = localStorage.key(0);
```

### Storing Complex Data

localStorage and sessionStorage only store strings. For objects and arrays, use JSON:

```javascript
// Storing an object
const user = {
    name: 'Alice',
    age: 25,
    preferences: {
        theme: 'dark',
        language: 'en'
    }
};

localStorage.setItem('user', JSON.stringify(user));

// Retrieving an object
const retrievedUser = JSON.parse(localStorage.getItem('user'));
console.log(retrievedUser.name); // 'Alice'

// Storing an array
const todos = ['Buy milk', 'Walk dog', 'Code'];
localStorage.setItem('todos', JSON.stringify(todos));

// Retrieving an array
const retrievedTodos = JSON.parse(localStorage.getItem('todos'));
```

### Storage Events

Listen for changes in other tabs/windows:

```javascript
window.addEventListener('storage', (e) => {
    console.log('Storage changed!');
    console.log('Key:', e.key);
    console.log('Old Value:', e.oldValue);
    console.log('New Value:', e.newValue);
    console.log('URL:', e.url);
    console.log('Storage Area:', e.storageArea);
});
```

### Practical Example: Theme Preference

```javascript
// Save theme preference
function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
}

// Load theme on page load
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.className = theme;
}

// Toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Load theme when page loads
loadTheme();
```

### Best Practices

1. **Always use try-catch** when working with storage (quota exceeded errors):
```javascript
try {
    localStorage.setItem('key', 'value');
} catch (e) {
    if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
    }
}
```

2. **Check for storage availability**:
```javascript
function isStorageAvailable(type) {
    try {
        const storage = window[type];
        const test = '__storage_test__';
        storage.setItem(test, test);
        storage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

if (isStorageAvailable('localStorage')) {
    // Use localStorage
}
```

---

## IndexedDB Basics

### Overview
IndexedDB is a low-level API for storing significant amounts of structured data, including files and blobs. It's more powerful than Web Storage but more complex.

### Key Features
- Stores much larger amounts of data (limited by disk space)
- Asynchronous operations (non-blocking)
- Supports transactions
- Can store complex objects directly
- Supports indexes for efficient querying

### Opening a Database

```javascript
let db;

// Open (or create) database
const request = indexedDB.open('MyDatabase', 1);

// Handle successful opening
request.onsuccess = (event) => {
    db = event.target.result;
    console.log('Database opened successfully');
};

// Handle errors
request.onerror = (event) => {
    console.error('Database error:', event.target.error);
};

// Handle upgrades (creating/modifying structure)
request.onupgradeneeded = (event) => {
    db = event.target.result;
    
    // Create an object store (like a table)
    if (!db.objectStoreNames.contains('users')) {
        const objectStore = db.createObjectStore('users', { 
            keyPath: 'id', 
            autoIncrement: true 
        });
        
        // Create indexes for searching
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('name', 'name', { unique: false });
    }
};
```

### Adding Data

```javascript
function addUser(user) {
    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');
    
    const request = objectStore.add(user);
    
    request.onsuccess = () => {
        console.log('User added successfully');
    };
    
    request.onerror = (event) => {
        console.error('Error adding user:', event.target.error);
    };
}

// Usage
addUser({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
});
```

### Reading Data

```javascript
// Get by primary key
function getUserById(id) {
    const transaction = db.transaction(['users'], 'readonly');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.get(id);
    
    request.onsuccess = (event) => {
        if (event.target.result) {
            console.log('User found:', event.target.result);
        } else {
            console.log('User not found');
        }
    };
}

// Get by index
function getUserByEmail(email) {
    const transaction = db.transaction(['users'], 'readonly');
    const objectStore = transaction.objectStore('users');
    const index = objectStore.index('email');
    const request = index.get(email);
    
    request.onsuccess = (event) => {
        console.log('User:', event.target.result);
    };
}

// Get all records
function getAllUsers() {
    const transaction = db.transaction(['users'], 'readonly');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.getAll();
    
    request.onsuccess = (event) => {
        console.log('All users:', event.target.result);
    };
}
```

### Updating Data

```javascript
function updateUser(user) {
    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.put(user);
    
    request.onsuccess = () => {
        console.log('User updated successfully');
    };
}
```

### Deleting Data

```javascript
function deleteUser(id) {
    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.delete(id);
    
    request.onsuccess = () => {
        console.log('User deleted successfully');
    };
}
```

### Using Cursors for Iteration

```javascript
function listAllUsers() {
    const transaction = db.transaction(['users'], 'readonly');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.openCursor();
    
    request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
            console.log('User:', cursor.value);
            cursor.continue(); // Move to next record
        } else {
            console.log('No more users');
        }
    };
}
```

### Modern Promise-Based Approach

Using a wrapper library or creating promises:

```javascript
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MyDatabase', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

async function addUserAsync(user) {
    const db = await openDB();
    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');
    
    return new Promise((resolve, reject) => {
        const request = objectStore.add(user);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
```

---

## Cookies

### Overview
Cookies are small pieces of data stored by the browser and sent with every HTTP request to the same domain. They're primarily used for session management, personalization, and tracking.

### Setting Cookies

```javascript
// Basic cookie
document.cookie = "username=john_doe";

// Cookie with expiration (expires in 7 days)
const date = new Date();
date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
document.cookie = `username=john_doe; expires=${date.toUTCString()}`;

// Cookie with max-age (in seconds)
document.cookie = "username=john_doe; max-age=604800"; // 7 days

// Cookie with path
document.cookie = "username=john_doe; path=/";

// Cookie with domain
document.cookie = "username=john_doe; domain=example.com";

// Secure cookie (HTTPS only)
document.cookie = "username=john_doe; secure";

// HttpOnly cannot be set via JavaScript (server-side only)
// SameSite attribute for CSRF protection
document.cookie = "username=john_doe; SameSite=Strict";
```

### Reading Cookies

```javascript
// Get all cookies as string
console.log(document.cookie);

// Parse cookies into object
function getCookies() {
    return document.cookie.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = decodeURIComponent(value);
        return acc;
    }, {});
}

// Get specific cookie
function getCookie(name) {
    const cookies = getCookies();
    return cookies[name] || null;
}

// Usage
const username = getCookie('username');
```

### Deleting Cookies

```javascript
// Delete by setting expiration to past date
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// Usage
deleteCookie('username');
```

### Cookie Helper Functions

```javascript
const CookieManager = {
    set(name, value, days = 7, path = '/') {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=${path}`;
    },
    
    get(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(nameEQ)) {
                return decodeURIComponent(cookie.substring(nameEQ.length));
            }
        }
        return null;
    },
    
    delete(name, path = '/') {
        this.set(name, '', -1, path);
    },
    
    exists(name) {
        return this.get(name) !== null;
    }
};

// Usage
CookieManager.set('theme', 'dark', 30);
console.log(CookieManager.get('theme'));
CookieManager.delete('theme');
```

### Cookie Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `expires` | Expiration date | `expires=Wed, 31 Dec 2025 23:59:59 GMT` |
| `max-age` | Seconds until expiration | `max-age=3600` |
| `path` | URL path where cookie is valid | `path=/admin` |
| `domain` | Domain where cookie is valid | `domain=example.com` |
| `secure` | Only send over HTTPS | `secure` |
| `SameSite` | CSRF protection | `SameSite=Strict` |

### Best Practices

1. **Always encode/decode values**: Use `encodeURIComponent()` and `decodeURIComponent()`
2. **Set appropriate expiration**: Don't create persistent cookies unnecessarily
3. **Use Secure flag**: For sensitive data, require HTTPS
4. **Implement SameSite**: Protect against CSRF attacks
5. **Minimize cookie size**: Cookies are sent with every request
6. **Be mindful of privacy**: Comply with GDPR and cookie consent laws

---

## Service Workers (Introduction)

### Overview
Service Workers are scripts that run in the background, separate from web pages. They enable features like offline functionality, push notifications, and background sync.

### Key Concepts

- **Separate thread**: Runs independently of web pages
- **Lifecycle**: Install → Activate → Fetch/Message
- **HTTPS required**: (except on localhost for development)
- **Scope**: Controls pages under its registered path
- **No DOM access**: Cannot directly manipulate the page

### Service Worker Lifecycle

```
Registration → Install → Activate → Idle → Fetch/Message → Terminated
```

### Basic Registration

```javascript
// In your main JavaScript file
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration.scope);
            })
            .catch(error => {
                console.error('SW registration failed:', error);
            });
    });
}
```

### Service Worker File (sw.js)

```javascript
const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/styles/main.css',
    '/scripts/main.js',
    '/images/logo.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker installing');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});
```

### Updating Service Workers

```javascript
// Main JavaScript file
navigator.serviceWorker.register('/sw.js').then(registration => {
    // Check for updates periodically
    setInterval(() => {
        registration.update();
    }, 60000); // Check every minute
    
    // Handle updates
    registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                if (confirm('New version available! Reload to update?')) {
                    window.location.reload();
                }
            }
        });
    });
});
```

### Communication with Service Workers

```javascript
// From page to service worker
navigator.serviceWorker.controller.postMessage({
    type: 'CACHE_URLS',
    urls: ['/new-page.html']
});

// In service worker
self.addEventListener('message', (event) => {
    if (event.data.type === 'CACHE_URLS') {
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(event.data.urls);
        });
    }
});
```

### Unregistering Service Workers

```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
        registration.unregister();
    });
});
```

### Caching Strategies

**1. Cache First (Offline-first)**
```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

**2. Network First**
```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});
```

**3. Stale While Revalidate**
```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            const fetched = fetch(event.request).then(response => {
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                });
                return response;
            });
            return cached || fetched;
        })
    );
});
```

---

## Web Workers

### Overview
Web Workers allow you to run JavaScript in background threads, enabling parallel processing without blocking the main UI thread.

### Key Features
- Run CPU-intensive tasks without freezing UI
- No access to DOM
- Limited access to Web APIs
- Communicate via messages

### Creating a Web Worker

**Main JavaScript file:**
```javascript
// Check for Web Worker support
if (window.Worker) {
    // Create a new worker
    const worker = new Worker('worker.js');
    
    // Send message to worker
    worker.postMessage({ type: 'START', data: [1, 2, 3, 4, 5] });
    
    // Receive message from worker
    worker.onmessage = (event) => {
        console.log('Result from worker:', event.data);
    };
    
    // Handle errors
    worker.onerror = (error) => {
        console.error('Worker error:', error.message);
    };
    
    // Terminate worker when done
    // worker.terminate();
} else {
    console.log('Web Workers not supported');
}
```

**Worker file (worker.js):**
```javascript
// Listen for messages from main thread
self.onmessage = (event) => {
    if (event.data.type === 'START') {
        const numbers = event.data.data;
        
        // Perform heavy computation
        const result = numbers.reduce((sum, num) => sum + num, 0);
        
        // Send result back to main thread
        self.postMessage(result);
    }
};

// Alternative syntax
self.addEventListener('message', (event) => {
    // Handle message
});
```

### Practical Example: Prime Number Calculator

**Main file:**
```javascript
const worker = new Worker('prime-worker.js');
const resultDiv = document.getElementById('result');

document.getElementById('calculate').addEventListener('click', () => {
    const limit = parseInt(document.getElementById('limit').value);
    resultDiv.textContent = 'Calculating...';
    
    worker.postMessage({ limit });
});

worker.onmessage = (event) => {
    const primes = event.data;
    resultDiv.textContent = `Found ${primes.length} prime numbers`;
};
```

**prime-worker.js:**
```javascript
self.onmessage = (event) => {
    const limit = event.data.limit;
    const primes = [];
    
    for (let num = 2; num <= limit; num++) {
        let isPrime = true;
        
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                isPrime = false;
                break;
            }
        }
        
        if (isPrime) {
            primes.push(num);
        }
    }
    
    self.postMessage(primes);
};
```

### Shared Workers

Shared Workers can be accessed by multiple scripts, even from different windows or tabs.

**Main file:**
```javascript
const sharedWorker = new SharedWorker('shared-worker.js');

sharedWorker.port.start();

sharedWorker.port.postMessage('Hello from tab 1');

sharedWorker.port.onmessage = (event) => {
    console.log('Message from shared worker:', event.data);
};
```

**shared-worker.js:**
```javascript
const connections = [];

self.onconnect = (event) => {
    const port = event.ports[0];
    connections.push(port);
    
    port.onmessage = (event) => {
        // Broadcast to all connections
        connections.forEach(conn => {
            conn.postMessage(`Broadcast: ${event.data}`);
        });
    };
    
    port.start();
};
```

### Importing Scripts in Workers

```javascript
// In worker file
importScripts('helper1.js', 'helper2.js');
```

### Inline Workers

Create workers without separate files:

```javascript
const workerCode = `
    self.onmessage = (e) => {
        const result = e.data * 2;
        self.postMessage(result);
    };
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const worker = new Worker(workerUrl);

worker.postMessage(10);
worker.onmessage = (e) => console.log(e.data); // 20
```

### Best Practices

1. **Keep workers focused**: One task per worker
2. **Transfer large data efficiently**: Use Transferable Objects
3. **Clean up**: Terminate workers when done
4. **Handle errors**: Always implement error handlers
5. **Progressive enhancement**: Check for support first

---

## Geolocation API

### Overview
The Geolocation API allows web applications to access the user's geographical location (with permission).

### Basic Usage

```javascript
if ('geolocation' in navigator) {
    // Get current position
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            
            console.log(`Lat: ${latitude}, Lon: ${longitude}`);
            console.log(`Accuracy: ${accuracy} meters`);
        },
        (error) => {
            console.error('Error getting location:', error.message);
        }
    );
} else {
    console.log('Geolocation not supported');
}
```

### Position Object Properties

```javascript
navigator.geolocation.getCurrentPosition((position) => {
    const coords = position.coords;
    
    console.log('Latitude:', coords.latitude);
    console.log('Longitude:', coords.longitude);
    console.log('Accuracy (m):', coords.accuracy);
    console.log('Altitude (m):', coords.altitude); // May be null
    console.log('Altitude Accuracy:', coords.altitudeAccuracy); // May be null
    console.log('Heading (degrees):', coords.heading); // May be null
    console.log('Speed (m/s):', coords.speed); // May be null
    console.log('Timestamp:', position.timestamp);
});
```

### Error Handling

```javascript
navigator.geolocation.getCurrentPosition(
    successCallback,
    (error) => {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.error('User denied geolocation');
                break;
            case error.POSITION_UNAVAILABLE:
                console.error('Location information unavailable');
                break;
            case error.TIMEOUT:
                console.error('Request timed out');
                break;
            default:
                console.error('Unknown error');
        }
    }
);
```

### Options

```javascript
const options = {
    enableHighAccuracy: true, // Use GPS if available
    timeout: 5000,            // Wait max 5 seconds
    maximumAge: 0             // Don't use cached position
};

navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback,
    options
);
```

### Watching Position (Real-time Tracking)

```javascript
let watchId;

// Start watching
watchId = navigator.geolocation.watchPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`New position: ${latitude}, ${longitude}`);
        updateMap(latitude, longitude);
    },
    (error) => {
        console.error('Tracking error:', error.message);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
    }
);

// Stop watching
function stopTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        console.log('Stopped tracking');
    }
}
```

### Practical Example: Distance Calculator

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(2);
}

// Usage
navigator.geolocation.getCurrentPosition((position) => {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    
    // Distance to New York City
    const nycLat = 40.7128;
    const nycLon = -74.0060;
    
    const distance = calculateDistance(userLat, userLon, nycLat, nycLon);
    console.log(`Distance to NYC: ${distance} km`);
});
```

### Complete Location App Example

```javascript
class LocationTracker {
    constructor() {
        this.watchId = null;
        this.currentPosition = null;
    }
    
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentPosition = position;
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => reject(error),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }
    
    startTracking(callback) {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition = position;
                callback(position);
            },
            (error) => {
                console.error('Tracking error:', error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000
            }
        );
    }
    
    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }
}

// Usage
const tracker = new LocationTracker();

tracker.getCurrentLocation()
    .then(location => {
        console.log('Current location:', location);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
```

---

## Notification API

### Overview
The Notification API allows web applications to display system notifications to users, even when the page is not in focus.

### Requesting Permission

```javascript
// Check if notifications are supported
if ('Notification' in window) {
    // Check current permission status
    console.log('Permission status:', Notification.permission);
    // Possible values: 'default', 'granted', 'denied'
    
    // Request permission
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted');
        } else {
            console.log('Notification permission denied');
        }
    });
}
```

### Creating a Basic Notification

```javascript
if (Notification.permission === 'granted') {
    new Notification('Hello!', {
        body: 'This is a notification message',
        icon: '/icon.png'
    });
} else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            new Notification('Hello!');
        }
    });
}
```

### Notification Options

```javascript
const notification = new Notification('New Message', {
    body: 'You have received a new message from John',
    icon: '/images/icon.png',
    badge: '/images/badge.png',
    image: '/images/preview.jpg',
    tag: 'message-1', // Unique identifier
    requireInteraction: false, // Auto-close or not
    silent: false, // Play sound or not
    vibrate: [200, 100, 200], // Vibration pattern (mobile)
    data: { // Custom data
        url: '/messages/123',
        userId: 456
    },
    actions: [ // Action buttons (requires Service Worker)
        {
            action: 'reply',
            title: 'Reply',
            icon: '/images/reply.png'
        },
        {
            action: 'close',
            title: 'Close',
            icon: '/images/close.png'
        }
    ]
});
```

### Notification Events

```javascript
const notification = new Notification('Title', {
    body: 'Message body',
    icon: '/icon.png'
});

// When notification is shown
notification.onshow = () => {
    console.log('Notification displayed');
};

// When notification is clicked
notification.onclick = (event) => {
    console.log('Notification clicked');
    event.preventDefault(); // Prevent default behavior
    window.focus();
    notification.close();
};

// When notification is closed
notification.onclose = () => {
    console.log('Notification closed');
};

// When notification encounters an error
notification.onerror = (error) => {
    console.error('Notification error:', error);
};
```

### Notification with Auto-Close

```javascript
function showTimedNotification(title, options, duration = 5000) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, options);
        
        // Auto-close after duration
        setTimeout(() => {
            notification.close();
        }, duration);
        
        return notification;
    }
}

// Usage
showTimedNotification('Task Complete', {
    body: 'Your download has finished',
    icon: '/success-icon.png'
}, 3000);
```

### Notification Manager Class

```javascript
class NotificationManager {
    constructor() {
        this.permission = Notification.permission;
    }
    
    async requestPermission() {
        if (!('Notification' in window)) {
            throw new Error('Notifications not supported');
        }
        
        if (this.permission === 'granted') {
            return true;
        }
        
        if (this.permission === 'denied') {
            return false;
        }
        
        const permission = await Notification.requestPermission();
        this.permission = permission;
        return permission === 'granted';
    }
    
    show(title, options = {}) {
        if (this.permission !== 'granted') {
            console.warn('Notification permission not granted');
            return null;
        }
        
        return new Notification(title, options);
    }
    
    showWithClick(title, options = {}, url) {
        const notification = this.show(title, options);
        
        if (notification) {
            notification.onclick = () => {
                window.focus();
                if (url) {
                    window.location.href = url;
                }
                notification.close();
            };
        }
        
        return notification;
    }
    
    async showIfPermitted(title, options = {}) {
        const hasPermission = await this.requestPermission();
        
        if (hasPermission) {
            return this.show(title, options);
        }
        
        return null;
    }
}

// Usage
const notificationManager = new NotificationManager();

// Request permission and show notification
notificationManager.showIfPermitted('Welcome!', {
    body: 'Thanks for visiting our site',
    icon: '/logo.png'
});

// Show with click handler
notificationManager.showWithClick(
    'New Article',
    { body: 'Check out our latest post' },
    '/articles/latest'
);
```

### Service Worker Notifications

For persistent notifications that work even when the page is closed:

**Main JavaScript:**
```javascript
// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

// Show notification via service worker
async function showServiceWorkerNotification() {
    const registration = await navigator.serviceWorker.ready;
    
    registration.showNotification('Background Notification', {
        body: 'This persists even if the page closes',
        icon: '/icon.png',
        badge: '/badge.png',
        tag: 'background-sync',
        actions: [
            { action: 'view', title: 'View' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    });
}
```

**Service Worker (sw.js):**
```javascript
// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'view') {
        // Open a specific URL
        event.waitUntil(
            clients.openWindow('/notifications')
        );
    }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event.notification.tag);
});
```

### Practical Examples

**1. Task Reminder System**
```javascript
class TaskReminder {
    constructor() {
        this.tasks = [];
        this.checkInterval = null;
    }
    
    async init() {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            this.startChecking();
        }
    }
    
    addTask(task, reminderTime) {
        this.tasks.push({
            id: Date.now(),
            task,
            reminderTime: new Date(reminderTime),
            notified: false
        });
    }
    
    startChecking() {
        this.checkInterval = setInterval(() => {
            const now = new Date();
            
            this.tasks.forEach(task => {
                if (!task.notified && now >= task.reminderTime) {
                    new Notification('Task Reminder', {
                        body: task.task,
                        icon: '/task-icon.png',
                        tag: `task-${task.id}`
                    });
                    task.notified = true;
                }
            });
        }, 10000); // Check every 10 seconds
    }
    
    stopChecking() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    }
}

// Usage
const reminder = new TaskReminder();
reminder.init();
reminder.addTask('Team meeting', '2026-01-01T14:00:00');
```

**2. Chat Application Notifications**
```javascript
class ChatNotifications {
    constructor() {
        this.lastMessageId = null;
        this.isPageVisible = !document.hidden;
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = !document.hidden;
        });
    }
    
    async init() {
        if (Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }
    
    notifyNewMessage(message) {
        // Only notify if page is not visible
        if (!this.isPageVisible && Notification.permission === 'granted') {
            const notification = new Notification(
                `New message from ${message.sender}`,
                {
                    body: message.text,
                    icon: message.senderAvatar,
                    tag: 'chat-message',
                    requireInteraction: false,
                    data: { messageId: message.id }
                }
            );
            
            notification.onclick = () => {
                window.focus();
                this.openMessage(message.id);
                notification.close();
            };
            
            // Auto-close after 5 seconds
            setTimeout(() => notification.close(), 5000);
        }
    }
    
    openMessage(messageId) {
        // Navigate to message
        window.location.href = `#message-${messageId}`;
    }
}

// Usage
const chatNotifications = new ChatNotifications();
chatNotifications.init();

// When new message arrives
chatNotifications.notifyNewMessage({
    id: 123,
    sender: 'Alice',
    text: 'Hey, are you free for a call?',
    senderAvatar: '/avatars/alice.jpg'
});
```

**3. Download Progress Notification**
```javascript
class DownloadNotifier {
    constructor() {
        this.notification = null;
    }
    
    async start(filename) {
        if (Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }
        
        if (Notification.permission === 'granted') {
            this.notification = new Notification('Download Started', {
                body: `Downloading ${filename}...`,
                icon: '/download-icon.png',
                tag: 'download-progress',
                requireInteraction: true
            });
        }
    }
    
    complete(filename) {
        if (this.notification) {
            this.notification.close();
        }
        
        const completeNotification = new Notification('Download Complete', {
            body: `${filename} has been downloaded`,
            icon: '/success-icon.png',
            tag: 'download-complete'
        });
        
        setTimeout(() => completeNotification.close(), 5000);
    }
    
    error(filename, error) {
        if (this.notification) {
            this.notification.close();
        }
        
        new Notification('Download Failed', {
            body: `Failed to download ${filename}: ${error}`,
            icon: '/error-icon.png',
            tag: 'download-error'
        });
    }
}

// Usage
const downloader = new DownloadNotifier();
downloader.start('document.pdf');

// Simulate download
setTimeout(() => {
    downloader.complete('document.pdf');
}, 3000);
```

### Best Practices

1. **Always request permission explicitly**: Don't request on page load
```javascript
// Good: Request when user initiates an action
document.getElementById('enable-notifications').addEventListener('click', () => {
    Notification.requestPermission();
});

// Bad: Request immediately
Notification.requestPermission();
```

2. **Use tags to prevent notification spam**:
```javascript
// Replaces previous notification with same tag
new Notification('New Message', {
    tag: 'chat-notification',
    body: 'You have 3 new messages'
});
```

3. **Respect user's choice**: Don't repeatedly ask if denied
```javascript
if (Notification.permission === 'denied') {
    console.log('User has denied notifications');
    // Don't ask again
}
```

4. **Make notifications actionable**:
```javascript
notification.onclick = () => {
    window.focus();
    // Take user to relevant content
    window.location.href = '/relevant-page';
};
```

5. **Clean up notifications**:
```javascript
// Close automatically after some time
setTimeout(() => notification.close(), 5000);
```

6. **Check for support**:
```javascript
if (!('Notification' in window)) {
    // Fall back to in-app notifications
    showInAppAlert('New message received');
}
```

### Notification Troubleshooting

**Common Issues:**

1. **Notifications not showing**: Check permission status
2. **Notifications not clickable**: Ensure `onclick` handler is set
3. **Icon not displaying**: Use absolute URLs or properly configured relative paths
4. **Notifications spam**: Use `tag` property to replace old notifications

---

## Practice Exercises

### Exercise 1: Shopping Cart with localStorage

Create a shopping cart that persists across browser sessions.

**Requirements:**
- Add items to cart
- Remove items from cart
- Update quantities
- Persist cart in localStorage
- Load cart on page refresh
- Display total price

**Starter Code:**
```javascript
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
    }
    
    loadCart() {
        // Load from localStorage
    }
    
    saveCart() {
        // Save to localStorage
    }
    
    addItem(product, quantity = 1) {
        // Add or update item
    }
    
    removeItem(productId) {
        // Remove item
    }
    
    updateQuantity(productId, quantity) {
        // Update quantity
    }
    
    getTotal() {
        // Calculate total price
    }
    
    clear() {
        // Clear cart
    }
}
```

### Exercise 2: Note-Taking App with IndexedDB

Build a note-taking application using IndexedDB.

**Requirements:**
- Create, read, update, delete notes
- Each note has: id, title, content, createdAt, updatedAt
- Search notes by title
- List all notes sorted by creation date
- Store notes in IndexedDB

### Exercise 3: User Preferences with Cookies

Create a user preferences system using cookies.

**Requirements:**
- Save theme (light/dark)
- Save language preference
- Save font size
- Remember user for 30 days
- Apply preferences on page load

### Exercise 4: Offline-First Todo App

Build a todo app that works offline using Service Workers.

**Requirements:**
- Add, edit, delete todos
- Works offline
- Syncs when online
- Caches app shell
- Stores todos in IndexedDB

### Exercise 5: Background Data Processing

Create an app that processes large datasets using Web Workers.

**Requirements:**
- Process CSV file with 10,000+ rows
- Calculate statistics (average, median, mode)
- Show progress indicator
- Don't block UI during processing

### Exercise 6: Location-Based Store Finder

Build a store finder using the Geolocation API.

**Requirements:**
- Get user's current location
- Display distance to nearest stores
- Sort stores by distance
- Update distances when user moves
- Handle permission denied gracefully

### Exercise 7: Real-Time Notification System

Create a notification system for a messaging app.

**Requirements:**
- Request notification permission
- Show notification for new messages
- Only notify when page is not visible
- Click notification to open message
- Group multiple notifications
- Show unread count

### Exercise 8: Progressive Web App (PWA)

Combine multiple APIs to create a basic PWA.

**Requirements:**
- Service Worker for offline functionality
- Cache app shell and assets
- Store user data in IndexedDB
- Show notifications for updates
- Works on mobile devices

### Mini Project: Complete Task Management System

Build a comprehensive task management system combining all learned APIs.

**Features:**
1. **Storage**:
   - Store tasks in IndexedDB
   - Cache preferences in localStorage
   - Remember user session with cookies

2. **Service Workers**:
   - Offline functionality
   - Cache app assets
   - Background sync

3. **Notifications**:
   - Reminder notifications
   - Completion notifications
   - Daily summary

4. **Web Workers**:
   - Process task statistics
   - Generate reports

5. **Geolocation**:
   - Location-based tasks
   - Nearby task reminders

**Data Structure:**
```javascript
{
    id: 123,
    title: 'Complete tutorial',
    description: 'Finish Week 13 exercises',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-01-15',
    location: {
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 1000 // meters
    },
    reminder: {
        enabled: true,
        time: '2026-01-15T09:00:00'
    },
    createdAt: '2026-01-01T10:00:00',
    updatedAt: '2026-01-01T10:00:00'
}
```

---

## Additional Resources

### Documentation
- [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [MDN Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

### Tools and Libraries
- **Dexie.js**: Simplified IndexedDB wrapper
- **Workbox**: Google's Service Worker library
- **localForage**: Unified storage API (localStorage-like API with IndexedDB)
- **js-cookie**: Simple cookie handling library

### Testing
- Chrome DevTools Application tab
- Firefox Storage Inspector
- Service Worker testing in DevTools
- Notification testing in different browsers

### Browser Compatibility
- Check [Can I Use](https://caniuse.com) for API support
- Implement feature detection
- Provide fallbacks for unsupported browsers

---

## Quiz Questions

1. What's the main difference between localStorage and sessionStorage?
2. Why can't you store objects directly in localStorage?
3. What is the approximate storage limit for localStorage?
4. What are the three main events in a Service Worker's lifecycle?
5. Why do Service Workers require HTTPS?
6. What's the purpose of the `tag` property in notifications?
7. How do Web Workers differ from Service Workers?
8. What does `enableHighAccuracy` do in the Geolocation API?
9. When should you use IndexedDB instead of localStorage?
10. How can you update a Service Worker without breaking the current version?

---

## Summary

In Week 13, you learned about:

✅ **Web Storage**: localStorage and sessionStorage for simple key-value storage  
✅ **IndexedDB**: Powerful client-side database for structured data  
✅ **Cookies**: Traditional storage with HTTP integration  
✅ **Service Workers**: Background scripts enabling offline functionality  
✅ **Web Workers**: Parallel processing without blocking UI  
✅ **Geolocation**: Access user's geographical location  
✅ **Notifications**: System-level notifications for user engagement  

These APIs form the foundation of modern web applications, enabling offline functionality, background processing, and enhanced user experiences. Combined together, they allow you to build Progressive Web Apps (PWAs) that rival native applications.

**Next Steps:**
- Complete all practice exercises
- Build the mini project
- Explore Progressive Web App development
- Learn about Push API and Background Sync
- Study advanced Service Worker patterns

---

**Happy Coding! 🚀**
        