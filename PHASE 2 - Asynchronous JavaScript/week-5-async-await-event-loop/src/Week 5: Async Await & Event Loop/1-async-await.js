// async

async function getData() {
  return "Hello";
}

getData().then(console.log);

// await

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Start");
  await delay(1000);
  console.log("End");
}

run();