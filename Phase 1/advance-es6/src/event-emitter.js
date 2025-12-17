const EVENTS = Symbol('events');
const WILDCARD = '*';

class EventEmitter {
  constructor() {
    this[EVENTS] = new Map();
  }

  on(event, handler) {
    if (!this[EVENTS].has(event)) {
      this[EVENTS].set(event, []);
    }
    this[EVENTS].get(event).push(handler);
    return this;
  }

  off(event, handler) {
    const handlers = this[EVENTS].get(event);
    if (!handlers) return this;

    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }

    if (handlers.length === 0) {
      this[EVENTS].delete(event);
    }

    return this;
  }

  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  async emit(event, ...args) {
    const handlers = this[EVENTS].get(event) || [];
    const wildcardHandlers = this[EVENTS].get(WILDCARD) || [];
    const allHandlers = [...handlers, ...wildcardHandlers];

    const promises = allHandlers.map(handler => {
      try {
        return handler(...args);
      } catch (error) {
        console.error('Handler error', error);
        return null;
      }
    });

    await Promise.all(promises);
    return this;
  }

  listnerCount(event) {
    return (this[EVENTS].get(event) || []).length;
  }

  eventNames() {
    return [...this[EVENTS].keys()];
  }

  removeAllListeners(event) {
    if (event) {
      this[EVENTS].delete(event);
    } else {
      this[EVENTS].clear();
    }
    return this;
  }
}

// Advanced test
const emitter = new EventEmitter();

// Regular listeners
emitter.on('message', msg => console.log('Handler 1:', msg));
emitter.on('message', msg => console.log('Handler 2:', msg));

// Once listners
emitter.once('message', msg => console.log('Once only:', msg));

// Wildcard listener
emitter.on('async', async (data) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('Async handler:', data);
});

// Test
console.log('=== First emit ===');
await emitter.emit('message', 'Hello');

console.log('\n=== Second emit ===');
await emitter.emit('message', 'World');

console.log('\n=== Async emit ===');
await emitter.emit('async', 'Delayed');

console.log('\nListener count:', emitter.listnerCount('message'));
console.log('Event names', emitter.eventNames());