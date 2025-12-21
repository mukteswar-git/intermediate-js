// Generators

// Basic Generator Syntax

function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());


// Practical Generator Examples

// Infinite sequence generator

function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const sequence = infiniteSequence();
console.log(sequence.next().value);
console.log(sequence.next().value);
console.log(sequence.next().value);

// ID generator

function* idGenerator() {
  let id = 1;
  while (true) {
    yield `ID-${id++}`
  }
}

const getId = idGenerator();
console.log(getId.next().value);
console.log(getId.next().value);

// Range generator

function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

for (const num of range(1, 10, 2)) {
  console.log(num);
}

 
// Generator with parameter
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const fib = fibonacci();
console.log(fib.next().value);
console.log(fib.next().value);
console.log(fib.next().value);
console.log(fib.next().value);
console.log(fib.next().value);
