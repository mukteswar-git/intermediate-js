// Callbacks (The Old Way)

function fetchData(callback) {
  setTimeout(() => {
    callback("Data Received");
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
