// Excercise 1: Array Methods Challenges

// Given this data, solve the following:
const students = [
  { name: 'Alice', grade: 85, subject: 'Math' },
  { name: 'Bob', grade: 92, subject: 'Science' },
  { name: 'Charlie', grade: 78, subject: 'Math' },
  { name: 'Diana', grade: 95, subject: 'Science' },
  { name: 'Eve', grade: 88, subject: 'Math' }
];

// 1. Get all students with grades above 85
const aboveRequiredMark = students.filter(mark => mark.grade > 85);
console.log(aboveRequiredMark)

// 2. Calculate average grade
const total = students.reduce((avg, grade) => {
  return avg + grade.grade
}, 0);
const average = total/students.length;
console.log(average);

// 3. Get list of student names
const listStudents = students.map(student => student.name);
console.log(listStudents);

// 4. Check if any student failed (grade < 60)
const failedStudent = students.some(student => student.grade < 60);
console.log(failedStudent);

// 5. Check if all students passed (grade >= 70)
const pass = students.every(student => student.grade > 60);
console.log(pass);

// Excercise 2: Generator Practice

// Create a generator that:
// 1. Generates even number
function* even() {
  let i = 0;
  while (true) {
    yield i;
    i += 2;
  }
}

const even1 = even();
console.log(even1.next().value);
console.log(even1.next().value);
console.log(even1.next().value);

// 2. Takes start and end parameter
function* evens(start, end) {
  let current = start % 2 === 0 ? start : start + 1;
  while (current <= end) {
    yield current;
    current += 2;
  }
}

for (const num of evens(3, 12)) {
  console.log(num);
}


// Excercise 3: Object Manipulation

// Given this object:
const inventory = {
  apple: 10,
  banana: 5,
  orange: 8,
  mango: 0
};

// 1. Get all fruit names
console.log(Object.keys(inventory));

// 2. Get total quantity
console.log(Object.values(inventory).reduce(
  (accumulator, quantiy) => accumulator + quantiy, 0
))

// 3. Remove out-of-stock items
console.log(Object.fromEntries(Object.entries(inventory).filter(([fruit, qty]) => qty > 0)))

// 4. Create a new array with doubled quantities
const doubledObject = Object.fromEntries(
  Object.entries(inventory).map(([fruit, qty]) => [fruit, qty * 2])
);

console.log(doubledObject);
