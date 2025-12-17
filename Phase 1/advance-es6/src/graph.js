// Create a directed graph using Map
// Add these edges: A→B, A→C, B→D, C→D, D→E
// Implement:
// - addEdge(from, to)
// - getNeighbors(node)
// - hasPath(start, end) - use BFS with Set for visited

// Test:
// hasPath('A', 'E') should return true
// hasPath('E', 'A') should return false

class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addEdge(from, to) {
    if (!this.adjacencyList.has(from)) {
      this.adjacencyList.set(from, []);
    }
    this.adjacencyList.get(from).push(to);

    // Ensure 'to' node exists
    if (!this.adjacencyList.has(to)) {
      this.adjacencyList.set(to, []);
    }
  }

  getNeighbors(node) {
    return this.adjacencyList.get(node) || [];
  }

  hasPath(start, end) {
    const visited = new Set();
    const queue = [start];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current == end) return true;
      if (visited.has(current)) continue;

      visited.add(current);

      const neighbors = this.getNeighbors(current);
      queue.push(...neighbors);
    }

    return false;
  }
}

// Test
const graph = new Graph();
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D')
graph.addEdge('C', 'D');
graph.addEdge('D', 'E');

console.log(graph.hasPath('A', 'E'));
console.log(graph.hasPath('E', 'A'));
