# Week 12: DOM & Events - Complete Tutorial

## Table of Contents
1. [Introduction to the DOM](#introduction-to-the-dom)
2. [DOM Manipulation](#dom-manipulation)
3. [Event Listeners](#event-listeners)
4. [Event Bubbling and Capturing](#event-bubbling-and-capturing)
5. [Event Delegation](#event-delegation)
6. [preventDefault and stopPropagation](#preventdefault-and-stoppropagation)
7. [Custom Events](#custom-events)
8. [Practical Projects](#practical-projects)

---

## Introduction to the DOM

The **Document Object Model (DOM)** is a programming interface for HTML documents. It represents the page as a tree of objects that can be manipulated with JavaScript.

### The DOM Tree Structure

```
Document
  └── html
      ├── head
      │   ├── title
      │   └── meta
      └── body
          ├── header
          ├── main
          │   ├── section
          │   └── article
          └── footer
```

Each element is a **node** in this tree, and JavaScript can access and modify any node.

---

## DOM Manipulation

### Selecting Elements

```javascript
// By ID
const header = document.getElementById('header');

// By class name (returns HTMLCollection)
const items = document.getElementsByClassName('item');

// By tag name
const paragraphs = document.getElementsByTagName('p');

// Query selector (returns first match)
const firstItem = document.querySelector('.item');

// Query selector all (returns NodeList)
const allItems = document.querySelectorAll('.item');
```

**Best Practice:** Use `querySelector` and `querySelectorAll` for flexibility and consistency.

### Creating Elements

```javascript
// Create a new element
const newDiv = document.createElement('div');

// Add text content
newDiv.textContent = 'Hello, World!';

// Set attributes
newDiv.setAttribute('class', 'my-class');
newDiv.id = 'my-id';

// Set styles
newDiv.style.backgroundColor = 'lightblue';
newDiv.style.padding = '20px';
```

### Adding Elements to the DOM

```javascript
const container = document.querySelector('#container');

// Append as last child
container.appendChild(newDiv);

// Insert before a specific child
const firstChild = container.firstElementChild;
container.insertBefore(newDiv, firstChild);

// Modern methods
container.append(newDiv); // Can append multiple nodes/strings
container.prepend(newDiv); // Insert at beginning
container.before(newDiv); // Insert before container
container.after(newDiv); // Insert after container
```

### Modifying Elements

```javascript
const element = document.querySelector('.my-element');

// Change text content
element.textContent = 'New text';

// Change HTML content
element.innerHTML = '<strong>Bold text</strong>';

// Modify attributes
element.setAttribute('data-id', '123');
element.getAttribute('data-id'); // '123'
element.removeAttribute('data-id');

// Class manipulation
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('visible');
element.classList.contains('active'); // true/false
```

### Removing Elements

```javascript
const element = document.querySelector('.to-remove');

// Modern way
element.remove();

// Old way
element.parentNode.removeChild(element);

// Remove all children
element.innerHTML = '';
// or
while (element.firstChild) {
  element.removeChild(element.firstChild);
}
```

### Practical Example: Dynamic List

```javascript
function createTodoList() {
  const todos = ['Buy groceries', 'Walk the dog', 'Read a book'];
  const ul = document.createElement('ul');
  
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.textContent = todo;
    li.setAttribute('data-index', index);
    ul.appendChild(li);
  });
  
  document.body.appendChild(ul);
}
```

---

## Event Listeners

Events are actions that happen in the browser (clicks, key presses, mouse movements, etc.). Event listeners allow you to respond to these actions.

### Adding Event Listeners

```javascript
const button = document.querySelector('#myButton');

// Basic syntax
button.addEventListener('click', function(event) {
  console.log('Button clicked!');
  console.log(event); // Event object with details
});

// Arrow function
button.addEventListener('click', (e) => {
  console.log('Clicked!', e.target);
});

// Named function (reusable and removable)
function handleClick(e) {
  console.log('Button clicked!');
}
button.addEventListener('click', handleClick);
```

### Common Event Types

```javascript
// Mouse events
element.addEventListener('click', handler);
element.addEventListener('dblclick', handler);
element.addEventListener('mousedown', handler);
element.addEventListener('mouseup', handler);
element.addEventListener('mousemove', handler);
element.addEventListener('mouseenter', handler);
element.addEventListener('mouseleave', handler);

// Keyboard events
element.addEventListener('keydown', handler);
element.addEventListener('keyup', handler);
element.addEventListener('keypress', handler); // Deprecated

// Form events
form.addEventListener('submit', handler);
input.addEventListener('input', handler); // Fires on every change
input.addEventListener('change', handler); // Fires after focus loss
input.addEventListener('focus', handler);
input.addEventListener('blur', handler);

// Document events
document.addEventListener('DOMContentLoaded', handler);
window.addEventListener('load', handler);
window.addEventListener('resize', handler);
window.addEventListener('scroll', handler);
```

### The Event Object

```javascript
button.addEventListener('click', (e) => {
  console.log(e.type); // 'click'
  console.log(e.target); // Element that triggered the event
  console.log(e.currentTarget); // Element with the listener
  console.log(e.clientX, e.clientY); // Mouse position
  console.log(e.key); // For keyboard events
  console.log(e.timeStamp); // When event occurred
});
```

### Removing Event Listeners

```javascript
function handleClick() {
  console.log('Clicked!');
}

// Add listener
button.addEventListener('click', handleClick);

// Remove listener (must be the same function reference)
button.removeEventListener('click', handleClick);

// Anonymous functions cannot be removed!
// ❌ This won't work:
button.addEventListener('click', () => console.log('Hi'));
button.removeEventListener('click', () => console.log('Hi'));
```

### Event Listener Options

```javascript
// Run only once
button.addEventListener('click', handler, { once: true });

// Passive (for better scroll performance)
window.addEventListener('scroll', handler, { passive: true });

// Capture phase (explained in next section)
element.addEventListener('click', handler, { capture: true });
```

---

## Event Bubbling and Capturing

Events in the DOM propagate through three phases: **Capturing → Target → Bubbling**.

### The Three Phases

```
Window → Document → HTML → Body → Div → Button (CAPTURING)
                                           ↓
                                      [TARGET]
                                           ↓
Window ← Document ← HTML ← Body ← Div ← Button (BUBBLING)
```

### Event Bubbling (Default)

By default, events bubble up from the target element to its ancestors.

```javascript
document.querySelector('#parent').addEventListener('click', () => {
  console.log('Parent clicked');
});

document.querySelector('#child').addEventListener('click', () => {
  console.log('Child clicked');
});

// Clicking child logs:
// "Child clicked"
// "Parent clicked"  ← Event bubbled up
```

### Event Capturing

Events can be caught during the capturing phase by setting `capture: true`.

```javascript
document.querySelector('#parent').addEventListener('click', () => {
  console.log('Parent clicked');
}, { capture: true });

document.querySelector('#child').addEventListener('click', () => {
  console.log('Child clicked');
});

// Clicking child logs:
// "Parent clicked"  ← Captured during descent
// "Child clicked"
```

### Visual Example

```html
<div id="outer" style="padding: 40px; background: lightblue;">
  <div id="middle" style="padding: 40px; background: lightgreen;">
    <div id="inner" style="padding: 40px; background: lightyellow;">
      Click me!
    </div>
  </div>
</div>
```

```javascript
const outer = document.querySelector('#outer');
const middle = document.querySelector('#middle');
const inner = document.querySelector('#inner');

outer.addEventListener('click', () => console.log('Outer'));
middle.addEventListener('click', () => console.log('Middle'));
inner.addEventListener('click', () => console.log('Inner'));

// Clicking "Click me!" logs:
// Inner
// Middle
// Outer
```

---

## Event Delegation

Event delegation uses event bubbling to handle events efficiently. Instead of adding listeners to many elements, add one listener to a common ancestor.

### Why Use Event Delegation?

1. **Performance**: One listener instead of hundreds
2. **Dynamic elements**: Works for elements added later
3. **Memory efficiency**: Fewer event listeners

### Without Event Delegation (❌ Inefficient)

```javascript
const buttons = document.querySelectorAll('.item-button');

buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    console.log('Button clicked:', e.target.textContent);
  });
});

// Problem: Doesn't work for dynamically added buttons!
```

### With Event Delegation (✅ Better)

```javascript
const list = document.querySelector('#item-list');

list.addEventListener('click', (e) => {
  // Check if clicked element is a button
  if (e.target.matches('.item-button')) {
    console.log('Button clicked:', e.target.textContent);
  }
});

// Works for all current and future buttons!
```

### Practical Example: Todo List with Delete

```javascript
const todoList = document.querySelector('#todo-list');

// Single event listener for all delete buttons
todoList.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    const todoItem = e.target.closest('.todo-item');
    todoItem.remove();
  }
});

// Add new todo (delete button will work automatically)
function addTodo(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.innerHTML = `
    <span>${text}</span>
    <button class="delete-btn">Delete</button>
  `;
  todoList.appendChild(li);
}
```

### Advanced Event Delegation

```javascript
const container = document.querySelector('#container');

container.addEventListener('click', (e) => {
  // Handle different types of clicks
  if (e.target.matches('.edit-btn')) {
    handleEdit(e.target);
  } else if (e.target.matches('.delete-btn')) {
    handleDelete(e.target);
  } else if (e.target.matches('.toggle-btn')) {
    handleToggle(e.target);
  }
});
```

---

## preventDefault and stopPropagation

These methods control default browser behavior and event propagation.

### preventDefault()

Prevents the default browser action for an event.

```javascript
// Prevent form submission
const form = document.querySelector('#myForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Form not submitted, handling with JS');
  // Custom form handling here
});

// Prevent link navigation
const link = document.querySelector('a');
link.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Link clicked but not navigating');
});

// Prevent right-click context menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  console.log('Custom context menu could go here');
});
```

### stopPropagation()

Stops the event from bubbling up to parent elements.

```javascript
const parent = document.querySelector('#parent');
const child = document.querySelector('#child');

parent.addEventListener('click', () => {
  console.log('Parent clicked');
});

child.addEventListener('click', (e) => {
  e.stopPropagation(); // Stop event from reaching parent
  console.log('Child clicked');
});

// Clicking child only logs "Child clicked"
```

### stopImmediatePropagation()

Stops propagation and prevents other listeners on the same element.

```javascript
button.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
  console.log('First listener');
});

button.addEventListener('click', () => {
  console.log('Second listener'); // Never runs
});
```

### Practical Example: Modal Dialog

```javascript
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const closeBtn = document.querySelector('.close-btn');

// Close modal when clicking overlay
modal.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Don't close when clicking inside modal content
modalContent.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Close button
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});
```

### When to Use Each

```javascript
// preventDefault: Stop default browser behavior
// Use for: forms, links, context menus, drag and drop

// stopPropagation: Stop event from bubbling
// Use sparingly: Can make debugging harder
// Better: Use event.target checks instead

// Example of better approach without stopPropagation:
parent.addEventListener('click', (e) => {
  if (e.target === parent) {
    // Only run if parent itself was clicked, not children
    console.log('Parent directly clicked');
  }
});
```

---

## Custom Events

Create and dispatch your own events for communication between components.

### Creating Custom Events

```javascript
// Simple custom event
const myEvent = new Event('myCustomEvent');

// Custom event with data
const dataEvent = new CustomEvent('userLoggedIn', {
  detail: {
    username: 'john_doe',
    timestamp: Date.now()
  }
});
```

### Dispatching Custom Events

```javascript
const element = document.querySelector('#myElement');

// Dispatch the event
element.dispatchEvent(myEvent);

// With data
element.dispatchEvent(new CustomEvent('itemAdded', {
  detail: { id: 123, name: 'Widget' }
}));
```

### Listening for Custom Events

```javascript
element.addEventListener('itemAdded', (e) => {
  console.log('Item added:', e.detail);
  // { id: 123, name: 'Widget' }
});
```

### Custom Event Options

```javascript
const event = new CustomEvent('myEvent', {
  detail: { message: 'Hello' },
  bubbles: true,      // Allow event to bubble
  cancelable: true,   // Allow preventDefault
  composed: false     // Cross shadow DOM boundary
});
```

### Practical Example: Component Communication

```javascript
// Shopping cart component
class ShoppingCart {
  constructor() {
    this.items = [];
    this.element = document.querySelector('#cart');
  }
  
  addItem(item) {
    this.items.push(item);
    
    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: {
        items: this.items,
        total: this.getTotal()
      },
      bubbles: true
    }));
  }
  
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

// Listen for cart updates anywhere in the app
document.addEventListener('cartUpdated', (e) => {
  console.log('Cart updated:', e.detail);
  updateCartDisplay(e.detail);
});

// Usage
const cart = new ShoppingCart();
cart.addItem({ id: 1, name: 'Book', price: 15 });
```

### Event Bus Pattern

```javascript
// Create a simple event bus
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName]
      .filter(cb => cb !== callback);
  }
  
  emit(eventName, data) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach(callback => {
      callback(data);
    });
  }
}

// Usage
const bus = new EventBus();

bus.on('userLogin', (user) => {
  console.log('User logged in:', user);
});

bus.emit('userLogin', { name: 'Alice', id: 123 });
```

---

## Practical Projects

### Project 1: Interactive Todo List

Complete todo application with all concepts applied.

```javascript
class TodoApp {
  constructor() {
    this.todos = [];
    this.init();
  }
  
  init() {
    this.form = document.querySelector('#todo-form');
    this.input = document.querySelector('#todo-input');
    this.list = document.querySelector('#todo-list');
    
    // Event listeners
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTodo();
    });
    
    // Event delegation for todo actions
    this.list.addEventListener('click', (e) => {
      if (e.target.matches('.delete-btn')) {
        this.deleteTodo(e.target);
      } else if (e.target.matches('.toggle-btn')) {
        this.toggleTodo(e.target);
      }
    });
  }
  
  addTodo() {
    const text = this.input.value.trim();
    if (!text) return;
    
    const todo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    
    this.todos.push(todo);
    this.renderTodo(todo);
    this.input.value = '';
    
    // Dispatch custom event
    this.list.dispatchEvent(new CustomEvent('todoAdded', {
      detail: todo,
      bubbles: true
    }));
  }
  
  renderTodo(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;
    li.innerHTML = `
      <input type="checkbox" class="toggle-btn" 
             ${todo.completed ? 'checked' : ''}>
      <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
      <button class="delete-btn">Delete</button>
    `;
    this.list.appendChild(li);
  }
  
  deleteTodo(button) {
    const li = button.closest('.todo-item');
    const id = parseInt(li.dataset.id);
    
    this.todos = this.todos.filter(todo => todo.id !== id);
    li.remove();
  }
  
  toggleTodo(checkbox) {
    const li = checkbox.closest('.todo-item');
    const id = parseInt(li.dataset.id);
    const todo = this.todos.find(t => t.id === id);
    
    todo.completed = !todo.completed;
    li.querySelector('span').classList.toggle('completed');
  }
}

// Initialize app
const app = new TodoApp();

// Listen for custom events
document.addEventListener('todoAdded', (e) => {
  console.log('New todo:', e.detail);
});
```

### Project 2: Drag and Drop Interface

```javascript
class DragDropList {
  constructor() {
    this.init();
  }
  
  init() {
    const items = document.querySelectorAll('.draggable-item');
    
    items.forEach(item => {
      item.addEventListener('dragstart', this.handleDragStart);
      item.addEventListener('dragend', this.handleDragEnd);
      item.addEventListener('dragover', this.handleDragOver);
      item.addEventListener('drop', this.handleDrop);
      item.addEventListener('dragenter', this.handleDragEnter);
      item.addEventListener('dragleave', this.handleDragLeave);
    });
  }
  
  handleDragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }
  
  handleDragEnd(e) {
    this.classList.remove('dragging');
  }
  
  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }
  
  handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    
    const dragging = document.querySelector('.dragging');
    if (this !== dragging) {
      this.parentNode.insertBefore(dragging, this);
    }
    
    return false;
  }
  
  handleDragEnter(e) {
    this.classList.add('over');
  }
  
  handleDragLeave(e) {
    this.classList.remove('over');
  }
}

new DragDropList();
```

### Project 3: Modal System with Event Delegation

```javascript
class ModalManager {
  constructor() {
    this.init();
  }
  
  init() {
    // Single event listener for all modals
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal-open]')) {
        e.preventDefault();
        this.openModal(e.target.dataset.modalOpen);
      }
      
      if (e.target.matches('[data-modal-close]')) {
        this.closeModal(e.target.closest('.modal'));
      }
      
      if (e.target.matches('.modal-overlay')) {
        this.closeModal(e.target.querySelector('.modal'));
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }
  
  openModal(modalId) {
    const modal = document.querySelector(`#${modalId}`);
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Dispatch custom event
    modal.dispatchEvent(new CustomEvent('modalOpened', {
      detail: { modalId },
      bubbles: true
    }));
  }
  
  closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    modal.dispatchEvent(new CustomEvent('modalClosed', {
      bubbles: true
    }));
  }
  
  closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
      this.closeModal(modal);
    });
  }
}

new ModalManager();
```

---

## Best Practices Summary

### 1. Event Listeners
- Use `addEventListener` instead of inline handlers
- Remove listeners when no longer needed to prevent memory leaks
- Use named functions for removable listeners
- Use event delegation for dynamic content

### 2. DOM Manipulation
- Cache DOM queries in variables
- Use `documentFragment` for multiple insertions
- Prefer `textContent` over `innerHTML` when possible (security)
- Use `classList` instead of direct `className` manipulation

### 3. Performance
- Minimize DOM access (batch operations)
- Use event delegation for many similar elements
- Debounce/throttle frequent events (scroll, resize)
- Use `requestAnimationFrame` for animations

### 4. Code Organization
```javascript
// ✅ Good: Organized and maintainable
class Component {
  constructor(element) {
    this.element = element;
    this.init();
  }
  
  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    this.element.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick(e) {
    // Handle click
  }
}

// ❌ Bad: Everything in global scope
const el = document.querySelector('#thing');
el.addEventListener('click', function() {
  // Scattered logic
});
```

### 5. Debugging Tips
```javascript
// Log event details
element.addEventListener('click', (e) => {
  console.log('Event type:', e.type);
  console.log('Target:', e.target);
  console.log('Current target:', e.currentTarget);
  console.log('Event phase:', e.eventPhase);
});

// Check if listener is attached
console.dir(element); // Shows event listeners in dev tools
```

---

## Practice Exercises

### Exercise 1: Dynamic Form Validation
Create a form with real-time validation using event listeners.

### Exercise 2: Image Gallery
Build a gallery with click events, keyboard navigation, and custom events.

### Exercise 3: Accordion Component
Create collapsible sections using event delegation and preventDefault.

### Exercise 4: Infinite Scroll
Implement infinite scrolling using scroll events and dynamic DOM manipulation.

### Exercise 5: Custom Dropdown
Build a dropdown component with keyboard accessibility and proper event handling.

---

## Resources for Further Learning

- MDN Web Docs: Events
- JavaScript.info: Browser Events
- Web.dev: Event Delegation
- DOM Enlightenment (online book)

**Next Week:** You'll learn about Browser Storage, AJAX, and Fetch API!

---

*Happy coding! Master these concepts through practice and experimentation.* 🚀