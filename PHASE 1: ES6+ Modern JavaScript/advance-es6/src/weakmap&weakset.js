// WeakMap

const wm = new WeakMap();

let obj = { id: 1 };
wm.set(obj, 'metadata');

console.log(wm.get(obj));
console.log(wm.has(obj));

obj = null;


// WeaKSet

const ws = new WeakSet();

let obj1 = { id: 1 };
ws.add(obj1);

console.log(ws.has(obj1));

ws.delete(obj1);
console.log(ws.has(obj1));
