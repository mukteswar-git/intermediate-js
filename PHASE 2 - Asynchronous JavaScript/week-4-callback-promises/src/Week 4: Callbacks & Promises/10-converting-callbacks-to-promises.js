// Converting Callbacks to Promises

// 1. setTimeout as Promise

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// Usage
delay(2000)
  .then(() => console.log("2 seconds later"));


// 2. Node.js fs.readFile

// const fs = require('fs');

// function readFilePromise(path) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(path, 'utf8', (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// }

// Usage
// readFilePromise('file.txt')
//   .then(content => console.log(content))
//   .catch(error => console.error(error));