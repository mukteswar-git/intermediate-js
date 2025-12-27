// 3. Callback Hell (The Problem)

setTimeout(() => {
  console.log("Step 1");
  setTimeout(() => {
    console.log("Step 3");
    setTimeout(() => {
      console.log("Step 3");
    }, 1000);
  }, 1000);
}, 1000);