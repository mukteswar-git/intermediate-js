// 1. for...of Loops


// Iterating over arrays

const fruits = ['apple', 'banana', 'orange'];

for (const fruit of fruits) {
  console.log(fruit);
}

// Iterating over strings

const message = 'Hello';

for (const char of message) {
  console.log(char);
}

// With index (using entries())

const colors = ['red', 'green', 'blue'];

for (const [index, color] of colors.entries()) {
  console.log(`${index}: ${color}`)
}


