# Week 14: Advanced Browser APIs

## Table of Contents
1. [Canvas API Basics](#canvas-api-basics)
2. [Drag and Drop API](#drag-and-drop-api)
3. [History API](#history-api)
4. [Intersection Observer](#intersection-observer)
5. [Mutation Observer](#mutation-observer)
6. [Clipboard API](#clipboard-api)
7. [File API](#file-api)
8. [Practice Projects](#practice-projects)

---

## Canvas API Basics

The Canvas API provides a means for drawing graphics via JavaScript and the HTML `<canvas>` element. It's powerful for creating animations, games, data visualizations, and image manipulation.

### Getting Started with Canvas

```html
<canvas id="myCanvas" width="800" height="600"></canvas>
```

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
```

### Drawing Basic Shapes

#### Rectangles

```javascript
// Filled rectangle
ctx.fillStyle = '#3498db';
ctx.fillRect(50, 50, 200, 100);

// Stroked rectangle
ctx.strokeStyle = '#e74c3c';
ctx.lineWidth = 3;
ctx.strokeRect(300, 50, 200, 100);

// Clear rectangle area
ctx.clearRect(75, 75, 50, 50);
```

#### Circles and Arcs

```javascript
// Full circle
ctx.beginPath();
ctx.arc(150, 250, 50, 0, Math.PI * 2);
ctx.fillStyle = '#2ecc71';
ctx.fill();

// Arc (partial circle)
ctx.beginPath();
ctx.arc(300, 250, 50, 0, Math.PI);
ctx.strokeStyle = '#9b59b6';
ctx.lineWidth = 5;
ctx.stroke();
```

#### Lines and Paths

```javascript
ctx.beginPath();
ctx.moveTo(50, 350);
ctx.lineTo(150, 400);
ctx.lineTo(100, 450);
ctx.closePath();
ctx.strokeStyle = '#f39c12';
ctx.lineWidth = 2;
ctx.stroke();
```

### Text Rendering

```javascript
ctx.font = '30px Arial';
ctx.fillStyle = '#34495e';
ctx.fillText('Hello Canvas!', 50, 500);

// Stroked text
ctx.strokeStyle = '#e67e22';
ctx.lineWidth = 2;
ctx.strokeText('Outlined Text', 50, 550);
```

### Gradients

```javascript
// Linear gradient
const linearGrad = ctx.createLinearGradient(0, 0, 200, 0);
linearGrad.addColorStop(0, '#3498db');
linearGrad.addColorStop(1, '#e74c3c');
ctx.fillStyle = linearGrad;
ctx.fillRect(500, 50, 200, 100);

// Radial gradient
const radialGrad = ctx.createRadialGradient(600, 250, 10, 600, 250, 50);
radialGrad.addColorStop(0, '#fff');
radialGrad.addColorStop(1, '#9b59b6');
ctx.fillStyle = radialGrad;
ctx.fillRect(550, 200, 100, 100);
```

### Image Drawing

```javascript
const img = new Image();
img.onload = function() {
  // Draw image at position
  ctx.drawImage(img, 50, 600);
  
  // Draw with scaling
  ctx.drawImage(img, 200, 600, 100, 75);
  
  // Draw cropped and scaled
  ctx.drawImage(img, 
    10, 10, 80, 80,    // Source crop
    350, 600, 100, 100  // Destination
  );
};
img.src = 'image.jpg';
```

### Animation Example

```javascript
let x = 0;
let y = 100;
let dx = 2;
let dy = 1.5;
const ballRadius = 20;

function animate() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw ball
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#3498db';
  ctx.fill();
  
  // Update position
  x += dx;
  y += dy;
  
  // Bounce off walls
  if (x + ballRadius > canvas.width || x - ballRadius < 0) {
    dx = -dx;
  }
  if (y + ballRadius > canvas.height || y - ballRadius < 0) {
    dy = -dy;
  }
  
  requestAnimationFrame(animate);
}

animate();
```

---

## Drag and Drop API

The HTML Drag and Drop API enables dragging elements and handling drop operations.

### Making Elements Draggable

```html
<div id="dragItem" draggable="true">Drag me!</div>
<div id="dropZone">Drop here</div>
```

### Drag Events

```javascript
const dragItem = document.getElementById('dragItem');
const dropZone = document.getElementById('dropZone');

// Drag start
dragItem.addEventListener('dragstart', (e) => {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
  e.target.style.opacity = '0.5';
});

// Drag end
dragItem.addEventListener('dragend', (e) => {
  e.target.style.opacity = '1';
});

// Drag over (must preventDefault to allow drop)
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  dropZone.classList.add('drag-over');
});

// Drag leave
dropZone.addEventListener('dragleave', (e) => {
  dropZone.classList.remove('drag-over');
});

// Drop
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData('text/html');
  dropZone.innerHTML = data;
  dropZone.classList.remove('drag-over');
});
```

### Dragging Files

```javascript
const fileDropZone = document.getElementById('fileDropZone');

fileDropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

fileDropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  
  for (let file of files) {
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);
  }
});
```

### Complete Sortable List Example

```javascript
const items = document.querySelectorAll('.sortable-item');
let draggedElement = null;

items.forEach(item => {
  item.addEventListener('dragstart', function(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
  });
  
  item.addEventListener('dragend', function(e) {
    this.style.opacity = '1';
  });
  
  item.addEventListener('dragover', function(e) {
    e.preventDefault();
    if (this !== draggedElement) {
      const rect = this.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      
      if (e.clientY < midpoint) {
        this.parentNode.insertBefore(draggedElement, this);
      } else {
        this.parentNode.insertBefore(draggedElement, this.nextSibling);
      }
    }
  });
});
```

---

## History API

The History API allows manipulation of the browser session history.

### Basic Methods

```javascript
// Add new entry to history
history.pushState({ page: 1 }, 'Page 1', '/page1');

// Replace current entry
history.replaceState({ page: 2 }, 'Page 2', '/page2');

// Navigate back
history.back();

// Navigate forward
history.forward();

// Go to specific point
history.go(-2); // Go back 2 pages
history.go(1);  // Go forward 1 page
```

### Listening to History Changes

```javascript
window.addEventListener('popstate', (e) => {
  if (e.state) {
    console.log('State:', e.state);
    // Update page content based on state
    loadPage(e.state.page);
  }
});
```

### Single Page Application Example

```javascript
class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }
  
  init() {
    // Handle link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigateTo(e.target.href);
      }
    });
    
    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRoute(location.pathname);
    });
    
    // Load initial route
    this.handleRoute(location.pathname);
  }
  
  navigateTo(url) {
    history.pushState(null, null, url);
    this.handleRoute(url);
  }
  
  handleRoute(pathname) {
    const route = this.routes[pathname] || this.routes['/404'];
    document.getElementById('app').innerHTML = route();
  }
}

// Usage
const router = new Router({
  '/': () => '<h1>Home Page</h1>',
  '/about': () => '<h1>About Page</h1>',
  '/contact': () => '<h1>Contact Page</h1>',
  '/404': () => '<h1>404 Not Found</h1>'
});
```

---

## Intersection Observer

The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or viewport.

### Basic Usage

```javascript
const options = {
  root: null, // Use viewport as root
  rootMargin: '0px',
  threshold: 0.5 // Trigger when 50% visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('Element is visible!');
      entry.target.classList.add('visible');
      
      // Optionally stop observing
      observer.unobserve(entry.target);
    }
  });
}, options);

// Observe elements
const elements = document.querySelectorAll('.observe-me');
elements.forEach(el => observer.observe(el));
```

### Lazy Loading Images

```javascript
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

### Infinite Scroll

```javascript
const sentinel = document.querySelector('#sentinel');
let page = 1;

const infiniteScrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMoreContent();
    }
  });
}, {
  rootMargin: '100px' // Load before reaching bottom
});

infiniteScrollObserver.observe(sentinel);

function loadMoreContent() {
  page++;
  fetch(`/api/content?page=${page}`)
    .then(response => response.json())
    .then(data => {
      // Append new content
      data.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.content;
        document.querySelector('#content').appendChild(div);
      });
    });
}
```

### Scroll Animations

```javascript
const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.animate').forEach(el => {
  animateOnScroll.observe(el);
});
```

---

## Mutation Observer

The Mutation Observer API provides the ability to watch for changes being made to the DOM tree.

### Basic Usage

```javascript
const targetNode = document.getElementById('content');

const config = {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true,
  attributeOldValue: true,
  characterDataOldValue: true
};

const callback = function(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      console.log('Child node added or removed');
      console.log('Added:', mutation.addedNodes);
      console.log('Removed:', mutation.removedNodes);
    }
    else if (mutation.type === 'attributes') {
      console.log(`Attribute ${mutation.attributeName} changed`);
      console.log('Old value:', mutation.oldValue);
    }
    else if (mutation.type === 'characterData') {
      console.log('Text content changed');
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

// Stop observing
// observer.disconnect();
```

### Watching for New Elements

```javascript
const bodyObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1) { // Element node
        if (node.matches('.dynamic-content')) {
          initializeDynamicContent(node);
        }
      }
    });
  });
});

bodyObserver.observe(document.body, {
  childList: true,
  subtree: true
});
```

### Detecting Class Changes

```javascript
const classObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.attributeName === 'class') {
      const target = mutation.target;
      if (target.classList.contains('active')) {
        console.log('Element became active');
      }
    }
  });
});

const element = document.getElementById('watchMe');
classObserver.observe(element, {
  attributes: true,
  attributeFilter: ['class']
});
```

### Responsive Content Height Tracker

```javascript
const heightTracker = new MutationObserver(() => {
  const height = document.body.scrollHeight;
  console.log('Content height:', height);
  // Send height to parent iframe or update UI
  window.parent.postMessage({ height }, '*');
});

heightTracker.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true
});
```

---

## Clipboard API

The Clipboard API provides the ability to respond to clipboard commands (cut, copy, and paste) as well as to asynchronously read from and write to the system clipboard.

### Reading from Clipboard

```javascript
async function readClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Clipboard text:', text);
    return text;
  } catch (err) {
    console.error('Failed to read clipboard:', err);
  }
}

// Read on button click
document.getElementById('pasteBtn').addEventListener('click', async () => {
  const text = await readClipboard();
  document.getElementById('output').value = text;
});
```

### Writing to Clipboard

```javascript
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied to clipboard');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

// Copy button
document.getElementById('copyBtn').addEventListener('click', () => {
  const text = document.getElementById('input').value;
  copyToClipboard(text);
});
```

### Copy with Feedback

```javascript
async function copyWithFeedback(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    
    // Show success feedback
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('success');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('success');
    }, 2000);
  } catch (err) {
    button.textContent = 'Failed!';
    button.classList.add('error');
    setTimeout(() => {
      button.textContent = 'Copy';
      button.classList.remove('error');
    }, 2000);
  }
}
```

### Copying Rich Content

```javascript
async function copyRichContent(html) {
  try {
    const type = 'text/html';
    const blob = new Blob([html], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    
    await navigator.clipboard.write(data);
    console.log('Rich content copied');
  } catch (err) {
    console.error('Failed to copy rich content:', err);
  }
}

// Usage
const html = '<strong>Bold text</strong> and <em>italic text</em>';
copyRichContent(html);
```

### Legacy Fallback

```javascript
function copyToClipboardLegacy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    console.log('Copied using legacy method');
  } catch (err) {
    console.error('Legacy copy failed:', err);
  }
  
  document.body.removeChild(textArea);
}

// Universal copy function
async function universalCopy(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    copyToClipboardLegacy(text);
  }
}
```

---

## File API

The File API allows web applications to access files selected by the user and read their contents.

### File Input Handling

```javascript
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  
  for (let file of files) {
    console.log('Name:', file.name);
    console.log('Size:', file.size, 'bytes');
    console.log('Type:', file.type);
    console.log('Last modified:', new Date(file.lastModified));
  }
});
```

### Reading Text Files

```javascript
function readTextFile(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const content = e.target.result;
    console.log('File content:', content);
    document.getElementById('output').textContent = content;
  };
  
  reader.onerror = (e) => {
    console.error('Error reading file:', e);
  };
  
  reader.readAsText(file);
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    readTextFile(file);
  }
});
```

### Reading Images

```javascript
function readImageFile(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const img = document.createElement('img');
    img.src = e.target.result;
    document.getElementById('preview').appendChild(img);
  };
  
  reader.readAsDataURL(file);
}

imageInput.addEventListener('change', (e) => {
  const files = e.target.files;
  for (let file of files) {
    if (file.type.startsWith('image/')) {
      readImageFile(file);
    }
  }
});
```

### Progress Monitoring

```javascript
function readLargeFile(file) {
  const reader = new FileReader();
  
  reader.onprogress = (e) => {
    if (e.lengthComputable) {
      const percentLoaded = Math.round((e.loaded / e.total) * 100);
      console.log(`Progress: ${percentLoaded}%`);
      document.getElementById('progress').value = percentLoaded;
    }
  };
  
  reader.onload = (e) => {
    console.log('File loaded successfully');
  };
  
  reader.readAsArrayBuffer(file);
}
```

### File Validation

```javascript
function validateFile(file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png']) {
  // Check file size
  if (file.size > maxSize) {
    alert(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
    return false;
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    alert(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    return false;
  }
  
  return true;
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && validateFile(file)) {
    readImageFile(file);
  }
});
```

### Multiple File Upload with Preview

```javascript
const uploadArea = document.getElementById('uploadArea');
const previewContainer = document.getElementById('preview');

function createPreview(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const preview = document.createElement('div');
    preview.className = 'preview-item';
    
    const img = document.createElement('img');
    img.src = e.target.result;
    
    const info = document.createElement('div');
    info.innerHTML = `
      <p>${file.name}</p>
      <p>${(file.size / 1024).toFixed(2)} KB</p>
    `;
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => preview.remove();
    
    preview.appendChild(img);
    preview.appendChild(info);
    preview.appendChild(removeBtn);
    previewContainer.appendChild(preview);
  };
  
  reader.readAsDataURL(file);
}

uploadArea.addEventListener('change', (e) => {
  const files = e.target.files;
  for (let file of files) {
    if (file.type.startsWith('image/')) {
      createPreview(file);
    }
  }
});
```

### Reading Binary Files

```javascript
function readBinaryFile(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const arrayBuffer = e.target.result;
    const bytes = new Uint8Array(arrayBuffer);
    
    console.log('File size in bytes:', bytes.length);
    console.log('First 10 bytes:', bytes.slice(0, 10));
  };
  
  reader.readAsArrayBuffer(file);
}
```

---

## Practice Projects

### Project 1: Drawing App with Canvas

Create a simple drawing application with the following features:
- Different brush sizes
- Color picker
- Clear canvas button
- Save drawing as image
- Undo/redo functionality

### Project 2: Drag and Drop Task Board

Build a Kanban-style board with:
- Multiple columns (To Do, In Progress, Done)
- Draggable task cards
- Add new tasks
- Delete tasks
- Save board state to localStorage

### Project 3: Infinite Scroll Gallery

Create an image gallery that:
- Lazy loads images as you scroll
- Uses Intersection Observer
- Shows loading indicators
- Implements smooth scroll animations

### Project 4: Content Editor with Auto-save

Build an editor that:
- Watches for content changes with MutationObserver
- Auto-saves to localStorage
- Shows save status
- Implements undo/redo with History API

### Project 5: File Manager

Create a file manager that:
- Allows multiple file uploads
- Shows file previews
- Validates file types and sizes
- Displays upload progress
- Allows copying file information to clipboard

---

## Summary

This week covered seven powerful browser APIs:

- **Canvas API**: For drawing graphics, animations, and visualizations
- **Drag and Drop API**: For creating intuitive drag-and-drop interfaces
- **History API**: For managing browser history in single-page applications
- **Intersection Observer**: For efficiently detecting element visibility
- **Mutation Observer**: For watching DOM changes
- **Clipboard API**: For modern clipboard operations
- **File API**: For reading and handling user files

These APIs are essential for creating modern, interactive web applications with rich user experiences.

## Additional Resources

- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [MDN Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN Mutation Observer](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)