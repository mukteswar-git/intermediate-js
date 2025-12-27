const sym1 = Symbol();
const sym2 = Symbol();
console.log(sym1 === sym2);

const sym3 = Symbol('mySymbol');
const sym4 = Symbol('mySymbol');
console.log(sym3 === sym4);

console.log(sym3.toString());
console.log(sym3.description);


// Global Symbol Registry

const globalSym1 = Symbol.for('app.user.id');
const globalSym2 = Symbol.for('app.user.id');

console.log(globalSym1 === globalSym2);

console.log(Symbol.keyFor(globalSym1));

const localSym = Symbol('local');
console.log(Symbol.keyFor(localSym));


// Symbols as Object Keys

const id = Symbol('id');
const user = {
  name: 'Asha',
  [id]: 12345
};

console.log(user.name);
console.log(user[id]);

console.log(Object.keys(user));
console.log(Object.values(user));
console.log(JSON.stringify(user));

console.log(Object.getOwnPropertySymbols(user));
console.log(Reflect.ownKeys(user));


// Well-Known Symbols

// 1. Symbol.iterator - Makes objects iterable
const range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;

    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const num of range ) {
  console.log(num);
}

// 2. Symbol.toStringTag - Custom type description
class CustomArray {
  get [Symbol.toStringTag]() {
    return 'CustomArray';
  }
}

const arr = new CustomArray();
console.log(Object.prototype.toString.call(arr));

// 3. Symbol.hasInstance - Customize instanceof
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray);

// 4. Symbol.toPrimitive - Customize type correction
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return 42;
    if (hint === 'string') return 'hello';
    return true;
  }
};

console.log(+obj);
console.log(`${obj}`);
console.log(obj + '');

