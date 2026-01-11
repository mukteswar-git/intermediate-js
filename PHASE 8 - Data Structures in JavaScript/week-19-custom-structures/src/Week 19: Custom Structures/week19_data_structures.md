# Week 19: Custom Data Structures 🎯

## Overview
This week focuses on implementing fundamental data structures from scratch. Understanding these structures is crucial for technical interviews and building efficient applications.

---

## 1. Stack Implementation

### What is a Stack?
A stack is a Last-In-First-Out (LIFO) data structure. Think of it like a stack of plates - you can only add or remove from the top.

### Operations
- **Push**: Add element to top
- **Pop**: Remove element from top
- **Peek**: View top element without removing
- **isEmpty**: Check if stack is empty

### Implementation

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  // Add element to top
  push(element) {
    this.items.push(element);
  }

  // Remove and return top element
  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items.pop();
  }

  // View top element
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }

  // Check if empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get size
  size() {
    return this.items.length;
  }

  // Clear stack
  clear() {
    this.items = [];
  }

  // Print stack
  print() {
    console.log(this.items.toString());
  }
}
```

### Usage Examples

```javascript
const stack = new Stack();

stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.peek()); // 30
console.log(stack.pop());  // 30
console.log(stack.size()); // 2
```

### Real-World Applications
- Browser history (back button)
- Undo/Redo functionality
- Function call stack
- Expression evaluation
- Parentheses matching

### Practice: Balanced Parentheses Checker

```javascript
function isBalanced(expression) {
  const stack = new Stack();
  const opening = ['(', '{', '['];
  const closing = [')', '}', ']'];
  const matches = { ')': '(', '}': '{', ']': '[' };

  for (let char of expression) {
    if (opening.includes(char)) {
      stack.push(char);
    } else if (closing.includes(char)) {
      if (stack.isEmpty() || stack.pop() !== matches[char]) {
        return false;
      }
    }
  }

  return stack.isEmpty();
}

console.log(isBalanced("({[]})")); // true
console.log(isBalanced("({[}])")); // false
```

---

## 2. Queue Implementation

### What is a Queue?
A queue is a First-In-First-Out (FIFO) data structure. Think of a line at a store - first person in line is first to be served.

### Operations
- **Enqueue**: Add element to rear
- **Dequeue**: Remove element from front
- **Front**: View front element
- **isEmpty**: Check if queue is empty

### Implementation

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  // Add element to rear
  enqueue(element) {
    this.items.push(element);
  }

  // Remove and return front element
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift();
  }

  // View front element
  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }

  // Check if empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get size
  size() {
    return this.items.length;
  }

  // Clear queue
  clear() {
    this.items = [];
  }

  // Print queue
  print() {
    console.log(this.items.toString());
  }
}
```

### Circular Queue (More Efficient)

```javascript
class CircularQueue {
  constructor(capacity) {
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.front = -1;
    this.rear = -1;
    this.currentSize = 0;
  }

  isFull() {
    return this.currentSize === this.capacity;
  }

  isEmpty() {
    return this.currentSize === 0;
  }

  enqueue(element) {
    if (this.isFull()) {
      return "Queue is full";
    }
    
    this.rear = (this.rear + 1) % this.capacity;
    this.items[this.rear] = element;
    this.currentSize++;
    
    if (this.front === -1) {
      this.front = this.rear;
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    
    const element = this.items[this.front];
    this.items[this.front] = null;
    this.front = (this.front + 1) % this.capacity;
    this.currentSize--;
    
    if (this.isEmpty()) {
      this.front = -1;
      this.rear = -1;
    }
    
    return element;
  }
}
```

### Real-World Applications
- Print job scheduling
- BFS algorithm
- Request handling in servers
- Message queues
- Customer service systems

---

## 3. Linked List Basics

### What is a Linked List?
A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node.

### Node Structure

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
```

### Singly Linked List Implementation

```javascript
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Add node at end
  append(data) {
    const newNode = new Node(data);
    
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  // Add node at beginning
  prepend(data) {
    const newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }

  // Insert at specific position
  insertAt(data, index) {
    if (index < 0 || index > this.size) {
      return "Invalid index";
    }

    if (index === 0) {
      this.prepend(data);
      return;
    }

    const newNode = new Node(data);
    let current = this.head;
    let previous;
    let count = 0;

    while (count < index) {
      previous = current;
      current = current.next;
      count++;
    }

    newNode.next = current;
    previous.next = newNode;
    this.size++;
  }

  // Remove node at specific position
  removeAt(index) {
    if (index < 0 || index >= this.size) {
      return "Invalid index";
    }

    let current = this.head;

    if (index === 0) {
      this.head = current.next;
    } else {
      let previous;
      let count = 0;

      while (count < index) {
        previous = current;
        current = current.next;
        count++;
      }

      previous.next = current.next;
    }
    this.size--;
    return current.data;
  }

  // Search for a value
  search(data) {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.data === data) {
        return index;
      }
      current = current.next;
      index++;
    }
    return -1;
  }

  // Print list
  print() {
    let current = this.head;
    let result = '';
    
    while (current) {
      result += current.data + ' -> ';
      current = current.next;
    }
    result += 'null';
    console.log(result);
  }

  // Reverse the list
  reverse() {
    let previous = null;
    let current = this.head;
    let next = null;

    while (current) {
      next = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }
    this.head = previous;
  }
}
```

### Usage Examples

```javascript
const list = new LinkedList();
list.append(10);
list.append(20);
list.prepend(5);
list.insertAt(15, 2);
list.print(); // 5 -> 10 -> 15 -> 20 -> null

list.reverse();
list.print(); // 20 -> 15 -> 10 -> 5 -> null
```

### Doubly Linked List

```javascript
class DoublyNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(data) {
    const newNode = new DoublyNode(data);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  prepend(data) {
    const newNode = new DoublyNode(data);
    
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
  }

  printForward() {
    let current = this.head;
    let result = '';
    
    while (current) {
      result += current.data + ' <-> ';
      current = current.next;
    }
    result += 'null';
    console.log(result);
  }

  printBackward() {
    let current = this.tail;
    let result = '';
    
    while (current) {
      result += current.data + ' <-> ';
      current = current.prev;
    }
    result += 'null';
    console.log(result);
  }
}
```

---

## 4. Hash Table Concepts

### What is a Hash Table?
A hash table is a data structure that maps keys to values using a hash function. It provides fast insertion, deletion, and lookup.

### Implementation

```javascript
class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }

  // Simple hash function
  _hash(key) {
    let total = 0;
    const PRIME = 31;
    
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const char = key[i];
      const value = char.charCodeAt(0) - 96;
      total = (total * PRIME + value) % this.keyMap.length;
    }
    return total;
  }

  // Set key-value pair
  set(key, value) {
    const index = this._hash(key);
    
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    
    // Check if key already exists and update
    for (let pair of this.keyMap[index]) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }
    
    // Add new key-value pair
    this.keyMap[index].push([key, value]);
  }

  // Get value by key
  get(key) {
    const index = this._hash(key);
    
    if (this.keyMap[index]) {
      for (let pair of this.keyMap[index]) {
        if (pair[0] === key) {
          return pair[1];
        }
      }
    }
    return undefined;
  }

  // Delete key-value pair
  delete(key) {
    const index = this._hash(key);
    
    if (this.keyMap[index]) {
      for (let i = 0; i < this.keyMap[index].length; i++) {
        if (this.keyMap[index][i][0] === key) {
          this.keyMap[index].splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }

  // Get all keys
  keys() {
    const keysArray = [];
    
    for (let bucket of this.keyMap) {
      if (bucket) {
        for (let pair of bucket) {
          keysArray.push(pair[0]);
        }
      }
    }
    return keysArray;
  }

  // Get all values
  values() {
    const valuesArray = [];
    
    for (let bucket of this.keyMap) {
      if (bucket) {
        for (let pair of bucket) {
          if (!valuesArray.includes(pair[1])) {
            valuesArray.push(pair[1]);
          }
        }
      }
    }
    return valuesArray;
  }
}
```

### Usage Examples

```javascript
const ht = new HashTable();

ht.set("name", "Alice");
ht.set("age", 25);
ht.set("city", "New York");

console.log(ht.get("name")); // Alice
console.log(ht.keys());      // ["name", "age", "city"]
console.log(ht.values());    // ["Alice", 25, "New York"]

ht.delete("age");
console.log(ht.get("age"));  // undefined
```

### Real-World Applications
- Database indexing
- Caching systems
- Symbol tables in compilers
- Password verification
- Object property storage (JavaScript objects)

---

## 5. Tree Basics (Binary Tree)

### What is a Binary Tree?
A binary tree is a hierarchical data structure where each node has at most two children (left and right).

### Node Structure

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
```

### Binary Search Tree Implementation

```javascript
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // Insert a value
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    
    let current = this.root;
    while (true) {
      if (value === current.value) return undefined; // Duplicate
      
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  // Search for a value
  search(value) {
    let current = this.root;
    
    while (current) {
      if (value === current.value) {
        return true;
      }
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return false;
  }

  // In-order traversal (Left -> Root -> Right)
  inOrder(node = this.root, result = []) {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }

  // Pre-order traversal (Root -> Left -> Right)
  preOrder(node = this.root, result = []) {
    if (node) {
      result.push(node.value);
      this.preOrder(node.left, result);
      this.preOrder(node.right, result);
    }
    return result;
  }

  // Post-order traversal (Left -> Right -> Root)
  postOrder(node = this.root, result = []) {
    if (node) {
      this.postOrder(node.left, result);
      this.postOrder(node.right, result);
      result.push(node.value);
    }
    return result;
  }

  // Level-order traversal (BFS)
  levelOrder() {
    if (!this.root) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length) {
      const node = queue.shift();
      result.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }

  // Find minimum value
  findMin(node = this.root) {
    while (node.left) {
      node = node.left;
    }
    return node.value;
  }

  // Find maximum value
  findMax(node = this.root) {
    while (node.right) {
      node = node.right;
    }
    return node.value;
  }

  // Get tree height
  height(node = this.root) {
    if (!node) return -1;
    
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    
    return Math.max(leftHeight, rightHeight) + 1;
  }
}
```

### Usage Examples

```javascript
const bst = new BinarySearchTree();

bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);

console.log(bst.search(40));     // true
console.log(bst.inOrder());      // [20, 30, 40, 50, 60, 70, 80]
console.log(bst.levelOrder());   // [50, 30, 70, 20, 40, 60, 80]
console.log(bst.height());       // 2
```

---

## 6. Graph Basics

### What is a Graph?
A graph is a collection of nodes (vertices) connected by edges. Graphs can be directed or undirected, weighted or unweighted.

### Adjacency List Implementation

```javascript
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  // Add vertex
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  // Add edge (undirected)
  addEdge(vertex1, vertex2) {
    if (!this.adjacencyList[vertex1]) this.addVertex(vertex1);
    if (!this.adjacencyList[vertex2]) this.addVertex(vertex2);
    
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1);
  }

  // Remove edge
  removeEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
      v => v !== vertex2
    );
    this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
      v => v !== vertex1
    );
  }

  // Remove vertex
  removeVertex(vertex) {
    while (this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }

  // Depth First Search (Recursive)
  dfsRecursive(start) {
    const result = [];
    const visited = {};
    const adjacencyList = this.adjacencyList;

    function dfs(vertex) {
      if (!vertex) return null;
      visited[vertex] = true;
      result.push(vertex);
      
      adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          return dfs(neighbor);
        }
      });
    }

    dfs(start);
    return result;
  }

  // Depth First Search (Iterative)
  dfsIterative(start) {
    const stack = [start];
    const result = [];
    const visited = {};
    visited[start] = true;

    while (stack.length) {
      const vertex = stack.pop();
      result.push(vertex);

      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          stack.push(neighbor);
        }
      });
    }
    return result;
  }

  // Breadth First Search
  bfs(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;

    while (queue.length) {
      const vertex = queue.shift();
      result.push(vertex);

      this.adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }
    return result;
  }

  // Print graph
  print() {
    for (let vertex in this.adjacencyList) {
      console.log(vertex + ' -> ' + this.adjacencyList[vertex].join(', '));
    }
  }
}
```

### Weighted Graph

```javascript
class WeightedGraph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  // Dijkstra's Algorithm (Shortest Path)
  dijkstra(start, finish) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
    const path = [];

    // Initialize
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        pq.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        pq.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }

    while (!pq.isEmpty()) {
      const smallest = pq.dequeue().value;
      
      if (smallest === finish) {
        // Build path
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }

      if (smallest || distances[smallest] !== Infinity) {
        for (let neighbor of this.adjacencyList[smallest]) {
          const candidate = distances[smallest] + neighbor.weight;
          
          if (candidate < distances[neighbor.node]) {
            distances[neighbor.node] = candidate;
            previous[neighbor.node] = smallest;
            pq.enqueue(neighbor.node, candidate);
          }
        }
      }
    }

    return path.concat(smallest).reverse();
  }
}

// Simple Priority Queue for Dijkstra
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(value, priority) {
    this.values.push({ value, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return this.values.length === 0;
  }
}
```

### Usage Examples

```javascript
const graph = new Graph();

graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");

graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "D");
graph.addEdge("C", "D");

graph.print();
// A -> B, C
// B -> A, D
// C -> A, D
// D -> B, C

console.log(graph.dfsRecursive("A")); // ["A", "B", "D", "C"]
console.log(graph.bfs("A"));          // ["A", "B", "C", "D"]
```

---

## 📚 Week 19 Projects

### Project 1: Browser History Manager
Build a browser history system using stacks.

```javascript
class BrowserHistory {
  constructor() {
    this.history = new Stack();
    this.forward = new Stack();
  }

  visit(url) {
    this.history.push(url);
    this.forward.clear();
    console.log(`Visited: ${url}`);
  }

  back() {
    if (this.history.size() <= 1) {
      return "No history";
    }
    const current = this.history.pop();
    this.forward.push(current);
    return this.history.peek();
  }

  forward() {
    if (this.forward.isEmpty()) {
      return "No forward history";
    }
    const page = this.forward.pop();
    this.history.push(page);
    return page;
  }

  currentPage() {
    return this.history.peek();
  }
}
```

### Project 2: Task Queue System
Implement a task processing system using queues.

```javascript
class TaskQueue {
  constructor() {
    this.queue = new Queue();
    this.processing = false;
  }

  addTask(task) {
    this.queue.enqueue(task);
    console.log(`Task added: ${task.name}`);
    if (!this.processing) {
      this.processNext();
    }
  }

  async processNext() {
    if (this.queue.isEmpty()) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const task = this.queue.dequeue();
    console.log(`Processing: ${task.name}`);
    
    await task.execute();
    console.log(`Completed: ${task.name}`);
    
    this.processNext();
  }
}
```

### Project 3: Simple Cache System
Create a caching system using hash tables.

```javascript
class Cache {
  constructor(maxSize = 100) {
    this.cache = new HashTable();
    this.maxSize = maxSize;
    this.currentSize = 0;
  }

  set(key, value, ttl = 3600000) { // Default 1 hour TTL
    const entry = {
      value,
      expiry: Date.now() + ttl
    };
    
    if (!this.cache.get(key)) {
      this.currentSize++;
    }
    
    if (this.currentSize > this.maxSize) {
      this.evict();
    }
    
    this.cache.set(key, entry);
  }

  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.currentSize--;
      return null;
    }
    
    return entry.value;
  }

  evict() {
    const keys = this.cache.keys();
    if (keys.length > 0) {
      this.cache.delete(keys[0]);
      this.currentSize--;
    }
  }
}
```

---

## 🎯 Practice Challenges

### Challenge 1: Reverse Polish Notation Calculator
Use a stack to evaluate RPN expressions.

```javascript
function evaluateRPN(tokens) {
  const stack = new Stack();
  
  for (let token of tokens) {
    if (['+', '-', '*', '/'].includes(token)) {
      const b = stack.pop();
      const a = stack.pop();
      
      switch(token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(Math.floor(a / b)); break;
      }
    } else {
      stack.push(parseInt(token));
    }
  }
  
  return stack.pop();
}

console.log(evaluateRPN(["2", "1", "+", "3", "*"])); // 9
```

### Challenge 2: Detect Cycle in Linked List
Implement Floyd's cycle detection algorithm.

```javascript
function hasCycle(head) {
  if (!head || !head.next) return false;
  
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) return true;
  }
  
  return false;
}
```

### Challenge 3: Find Path in Graph
Find if a path exists between two nodes.

```javascript
function hasPath(graph, start, end) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift();
    
    if (node === end) return true;
    
    for (let neighbor of graph.adjacencyList[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return false;
}
```

---

## 📊 Time Complexity Comparison

| Operation | Array | Linked List | Stack | Queue | Hash Table | BST (avg) |
|-----------|-------|-------------|-------|-------|------------|-----------|
| Access | O(1) | O(n) | O(n) | O(n) | O(1) | O(log n) |
| Search | O(n) | O(n) | O(n) | O(n) | O(1) | O(log n) |
| Insert | O(n) | O(1) | O(1) | O(1) | O(1) | O(log n) |
| Delete | O(n) | O(1) | O(1) | O(1) | O(1) | O(log n) |

---

## 🎓 Key Takeaways

1. **Stacks**: Use for LIFO operations, undo/redo, backtracking
2. **Queues**: Use for FIFO operations, task scheduling, BFS
3. **Linked Lists**: Dynamic size, efficient insertion/deletion
4. **Hash Tables**: Fast lookups, unique keys, caching
5. **Binary Trees**: Hierarchical data, fast search/insert in BST
6. **Graphs**: Model relationships, network problems, pathfinding

---

## 🚀 Advanced Concepts

### When to Use Each Data Structure

**Use Stack when:**
- You need LIFO behavior
- Implementing recursion iteratively
- Parsing expressions or syntax
- Backtracking algorithms (maze solving, game states)
- Function call management

**Use Queue when:**
- You need FIFO behavior
- Breadth-first search
- Request handling (print jobs, API requests)
- Buffer implementation
- Task scheduling

**Use Linked List when:**
- Frequent insertions/deletions
- Don't know size beforehand
- Don't need random access
- Implementing other structures (stacks, queues)

**Use Hash Table when:**
- Need fast lookups by key
- Counting frequencies
- Caching results
- Removing duplicates
- Database indexing

**Use Binary Tree when:**
- Hierarchical data representation
- Fast search, insert, delete (BST)
- Expression parsing
- File system structures
- Priority queues (heap)

**Use Graph when:**
- Modeling networks (social, computer, road)
- Finding shortest paths
- Dependency resolution
- Recommendation systems
- Web crawling

---

## 💡 Common Interview Questions

### Question 1: Implement Min Stack
A stack that supports push, pop, top, and retrieving minimum element in O(1).

```javascript
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }

  push(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.getMin()) {
      this.minStack.push(val);
    }
  }

  pop() {
    const val = this.stack.pop();
    if (val === this.getMin()) {
      this.minStack.pop();
    }
    return val;
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}
```

### Question 2: Merge Two Sorted Linked Lists

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new Node(0);
  let current = dummy;

  while (l1 && l2) {
    if (l1.data <= l2.data) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 || l2;
  return dummy.next;
}
```

### Question 3: Find Middle of Linked List

```javascript
function findMiddle(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}
```

### Question 4: Validate Binary Search Tree

```javascript
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;

  if (root.value <= min || root.value >= max) {
    return false;
  }

  return isValidBST(root.left, min, root.value) &&
         isValidBST(root.right, root.value, max);
}
```

### Question 5: Clone a Graph

```javascript
function cloneGraph(node, visited = new Map()) {
  if (!node) return null;
  if (visited.has(node)) return visited.get(node);

  const clone = new GraphNode(node.value);
  visited.set(node, clone);

  for (let neighbor of node.neighbors) {
    clone.neighbors.push(cloneGraph(neighbor, visited));
  }

  return clone;
}
```

### Question 6: LRU Cache

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    this.cache.set(key, value);
    
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
```

---

## 🔧 Debugging Tips

### Stack Issues
- **Stack Overflow**: Check for infinite recursion
- **Empty Stack Pop**: Always check `isEmpty()` before popping
- **Memory Leaks**: Clear references when popping

### Queue Issues
- **Memory Growth**: Use circular buffer for fixed-size queues
- **Empty Queue**: Check before dequeuing
- **Priority Issues**: Consider using priority queue implementation

### Linked List Issues
- **Lost References**: Save `next` pointer before modifying
- **Null Pointer**: Always check if node exists
- **Memory Leaks**: Ensure proper cleanup when removing nodes

### Hash Table Issues
- **Collisions**: Implement proper collision handling (chaining/open addressing)
- **Load Factor**: Resize when table gets too full
- **Hash Function**: Ensure even distribution

### Tree Issues
- **Unbalanced Trees**: Consider AVL or Red-Black trees for balance
- **Stack Overflow**: Use iterative approaches for deep trees
- **Null Checks**: Always verify node exists before accessing

### Graph Issues
- **Infinite Loops**: Track visited nodes
- **Memory**: Use efficient representations (adjacency list vs matrix)
- **Disconnected Components**: Check all vertices for complete traversal

---

## 📝 Practice Problems

### Easy Level

1. **Valid Parentheses** - Use stack to check matching brackets
2. **Remove Duplicates from Sorted List** - Linked list traversal
3. **Two Sum** - Hash table for O(n) solution
4. **Maximum Depth of Binary Tree** - Recursive tree traversal
5. **Number of Islands** - Graph DFS/BFS

### Medium Level

1. **Daily Temperatures** - Monotonic stack
2. **Add Two Numbers (Linked Lists)** - List manipulation
3. **Group Anagrams** - Hash table with sorted keys
4. **Binary Tree Level Order Traversal** - BFS with queue
5. **Course Schedule** - Graph cycle detection

### Hard Level

1. **Largest Rectangle in Histogram** - Stack optimization
2. **Merge K Sorted Lists** - Priority queue
3. **Design Twitter** - Multiple data structures
4. **Serialize and Deserialize Binary Tree** - Tree traversal
5. **Word Ladder** - Graph BFS shortest path

---

## 🎯 Weekly Challenge Project

### Build a Complete Text Editor with Undo/Redo

```javascript
class TextEditor {
  constructor() {
    this.text = '';
    this.undoStack = new Stack();
    this.redoStack = new Stack();
  }

  insert(str, position) {
    this.undoStack.push({
      action: 'insert',
      text: str,
      position: position
    });
    
    this.text = this.text.slice(0, position) + str + this.text.slice(position);
    this.redoStack.clear();
  }

  delete(position, length) {
    const deleted = this.text.substr(position, length);
    
    this.undoStack.push({
      action: 'delete',
      text: deleted,
      position: position
    });
    
    this.text = this.text.slice(0, position) + this.text.slice(position + length);
    this.redoStack.clear();
  }

  undo() {
    if (this.undoStack.isEmpty()) return;
    
    const operation = this.undoStack.pop();
    this.redoStack.push(operation);
    
    if (operation.action === 'insert') {
      this.text = this.text.slice(0, operation.position) + 
                  this.text.slice(operation.position + operation.text.length);
    } else {
      this.text = this.text.slice(0, operation.position) + 
                  operation.text + 
                  this.text.slice(operation.position);
    }
  }

  redo() {
    if (this.redoStack.isEmpty()) return;
    
    const operation = this.redoStack.pop();
    this.undoStack.push(operation);
    
    if (operation.action === 'insert') {
      this.text = this.text.slice(0, operation.position) + 
                  operation.text + 
                  this.text.slice(operation.position);
    } else {
      this.text = this.text.slice(0, operation.position) + 
                  this.text.slice(operation.position + operation.text.length);
    }
  }

  getText() {
    return this.text;
  }
}

// Usage
const editor = new TextEditor();
editor.insert('Hello', 0);
editor.insert(' World', 5);
console.log(editor.getText()); // "Hello World"
editor.undo();
console.log(editor.getText()); // "Hello"
editor.redo();
console.log(editor.getText()); // "Hello World"
```

---

## 🌟 Performance Optimization Tips

### Stack Optimization
```javascript
// Use array methods efficiently
class OptimizedStack {
  constructor() {
    this.items = [];
    this.top = -1;
  }

  push(element) {
    this.items[++this.top] = element;
  }

  pop() {
    if (this.top < 0) return undefined;
    const item = this.items[this.top];
    delete this.items[this.top--];
    return item;
  }
}
```

### Queue Optimization
```javascript
// Use circular buffer for better performance
class CircularBuffer {
  constructor(size) {
    this.buffer = new Array(size);
    this.size = size;
    this.head = 0;
    this.tail = 0;
    this.length = 0;
  }

  enqueue(item) {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.size;
    this.length++;
  }

  dequeue() {
    const item = this.buffer[this.head];
    this.head = (this.head + 1) % this.size;
    this.length--;
    return item;
  }
}
```

### Hash Table Optimization
```javascript
// Better hash function for strings
_hashOptimized(key) {
  let hash = 0;
  const prime = 31;
  
  for (let i = 0; i < key.length; i++) {
    hash = (hash * prime + key.charCodeAt(i)) >>> 0;
  }
  
  return hash % this.keyMap.length;
}
```

---

## 📚 Additional Resources

### Online Platforms for Practice
1. **LeetCode** - Data structure problems by category
2. **HackerRank** - Data structures track
3. **CodeSignal** - Interview practice
4. **AlgoExpert** - Structured learning path

### Visualization Tools
1. **VisuAlgo** - Visual animations of data structures
2. **Data Structure Visualizations** (USF)
3. **Algorithm Visualizer**

### Books
1. "Cracking the Coding Interview" - Gayle Laakmann McDowell
2. "Introduction to Algorithms" - CLRS
3. "Data Structures and Algorithms in JavaScript" - Michael McMillan

### Video Resources
1. **FreeCodeCamp** - Data Structures Full Course
2. **CS Dojo** - Data Structures Series
3. **Abdul Bari** - Algorithms Course

---

## ✅ Week 19 Checklist

- [ ] Implement Stack from scratch
- [ ] Implement Queue (regular and circular)
- [ ] Build Singly Linked List
- [ ] Build Doubly Linked List
- [ ] Create Hash Table with collision handling
- [ ] Implement Binary Search Tree
- [ ] Add tree traversal methods
- [ ] Build Graph (adjacency list)
- [ ] Implement DFS and BFS
- [ ] Complete Browser History project
- [ ] Complete Task Queue project
- [ ] Complete Cache System project
- [ ] Solve 5 easy problems
- [ ] Solve 3 medium problems
- [ ] Build Text Editor challenge
- [ ] Review time complexities
- [ ] Practice on LeetCode

---

## 🎊 Congratulations!

You've completed Week 19 and learned fundamental data structures! These concepts are crucial for:

- **Technical Interviews** - Most coding interviews test these structures
- **Algorithm Design** - Understanding which structure fits your problem
- **Performance Optimization** - Choosing the right tool for the job
- **System Design** - Building scalable applications

### Next Steps

1. **Practice Daily** - Solve at least one problem per day
2. **Build Projects** - Apply these structures in real applications
3. **Learn Advanced Topics** - AVL trees, B-trees, Tries, Heaps
4. **Study Algorithms** - Sorting, searching, dynamic programming
5. **Mock Interviews** - Practice explaining your solutions

Remember: Understanding data structures is not about memorizing implementations, but about knowing when and why to use each one!

Keep coding and happy learning! 🚀

---

## 📞 Questions or Issues?

If you have questions about any of these data structures:
1. Review the implementation step by step
2. Draw diagrams to visualize the operations
3. Test with small examples first
4. Practice explaining the structure out loud
5. Build small projects using each structure

**Pro Tip**: The best way to learn data structures is to implement them yourself multiple times until they become second nature!

---

*End of Week 19 Tutorial - Custom Data Structures*