// Iterator

// Creating a Custom Iterator

const myIterator = {
  current: 1,
  last: 5,

  next() {
    if (this.current <= this.last) {
      return { value: this.current++, done: false };
    } else {
      return { value: undefined, done: true };
    }
  }
};

console.log(myIterator.next());
console.log(myIterator.next());
console.log(myIterator.next());
console.log(myIterator.next());
console.log(myIterator.next());
console.log(myIterator.next());

// Making an Object Iterable

const range = {
  start: 1,
  end: 5,

  [Symbol.iterator]() {
    let current = this.start;
    const last = this.end;

    return {
      next () {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const num of range) {
  console.log(num);
}