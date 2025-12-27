// let PI = 3.14;
// let radius = 10;
// radius = 12;
// const area = PI * radius * radius;

// let a = 5;
// {
//   let a = 10;
//   console.log(a)
// }
// console.log(a);

// const multiply = (a, b) => a * b;

// console.log(multiply(2, 3));

// const greet = (name) => `Hello ${name}`;

// console.log(greet("Mukti"));

// const getUser = () => ({name: "Mukteswar"})

// const nums = [1, 2, 3, 4];

// const doubled = nums.map(num => num * 2)

// console.log(doubled)

// console.log(`
//     Name: Mukteswar
//     Role: Developer
//   `);

// let price = 500;
// let gst = 0.18;
// console.log(`Final amount: ${price + (price * gst)}`);

// const user = { name: "Mukteswar", age: 22, city: "BBSR"}

// console.log(`${user.name} is ${user.age} years old and live in ${user.city}.`)

// // Destructuring

// const arr = [10, 20, 30, 40];
// const [first, ,thrid] = arr;
// console.log(first, thrid);

// let x = 5, y = 10;

// [x, y] = [y, x]

// console.log(x, y);


// const employee = { name: "Mukti", age: 24, city: "BBSR"};
// const { name , age } = employee;

// console.log(name, age);

// const { city: location } = employee

// console.log(location)

// function display({name, age}) {
//   console.log(name, age)
// }

// display({name: "Mukti", age: 24})

// function greeting(name = "Guest") {
//   return `Hello ${name}`
// }

// console.log(greeting())

// function createUser(user = {name: "Anonymous", age: 0}) {
//   return user.name;
// }
// console.log(createUser())

// const user1 = { name: "Mukteswar", city: "BBSR"}

// const copy = {...user1, city: "Cuttack", age: 24}

// console.log(copy)

// const A = [1, 2]
// const B = [3, 4]
// const C = [...A, ...B]
// console.log(C)

// function sum(...nums) {
//   return nums.reduce((total, num) => total + num, 0);
// }

// console.log(sum(1,2,3))

let users = [];

const addUser = ({ name = "Anonymous", age = 0, city = "Unknown" } = {}) => {
  const newUser = { name, age, city };
  users = [...users, newUser];
  console.log(`User Added: ${name}`);
}

const removeUser = (name) => {
  users = users.filter(user => user.name !== name);
  console.log(`User Removed: ${name}`)
}

const updateUser = (name, update = {}) => {
  users = users.map(user => 
    user.name === name
      ? {...user, ...update}
      : user
  )
}

const listUser = () => {
  console.log(`\n=== USER LIST ===`);
  users.forEach(({ name, age, city}) => {
    console.log(`
Name: ${name}
Age:  ${age}
City: ${city}
      `)
  })
}

addUser()
addUser({name: "Mukteswar", age: 24, city: "Nilgiri"});
updateUser("Mukteswar", {age: 25, city: "Mumbai"})
removeUser("Mukteswar")
listUser()
