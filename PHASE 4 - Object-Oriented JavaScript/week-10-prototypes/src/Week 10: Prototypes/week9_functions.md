# Week 10: JavaScript Prototypes - Complete Tutorial

## Table of Contents
1. [Introduction to Prototypes](#introduction)
2. [The Prototype Chain](#prototype-chain)
3. [__proto__ vs prototype](#proto-vs-prototype)
4. [Constructor Functions](#constructor-functions)
5. [Object.create()](#object-create)
6. [instanceof Operator](#instanceof-operator)
7. [Prototypal Inheritance](#prototypal-inheritance)
8. [Practical Examples](#practical-examples)
9. [Best Practices](#best-practices)

---

## Introduction to Prototypes {#introduction}

JavaScript is a prototype-based language, meaning objects can inherit properties and methods from other objects through prototypes. Every object in JavaScript has an internal link to another object called its prototype.

### Key Concepts
- Prototypes enable object inheritance in JavaScript
- They provide a way to share methods and properties across instances
- Understanding prototypes is crucial for mastering JavaScript's object-oriented features

---

## The Prototype Chain {#prototype-chain}

The prototype chain is a series of links between objects. When you try to access a property on an object, JavaScript first looks at the object itself, then its prototype, then the prototype's prototype, and so on until it reaches `null`.

### How the Prototype Chain Works

```javascript
const animal = {
  eats: true,
  walk() {
    console.log("Animal walks");
  }
};

const rabbit = {
  jumps: true
};

// Set animal as the prototype of rabbit
rabbit.__proto__ = animal;

console.log(rabbit.jumps);  // true (own property)
console.log(rabbit.eats);   // true (inherited from animal)
rabbit.walk();              // "Animal walks" (inherited method)

// Checking the chain
console.log(rabbit.__proto__ === animal);  // true
console.log(animal.__proto__ === Object.prototype);  // true
console.log(Object.prototype.__proto__);  // null (end of chain)
```

### Visualization of Prototype Chain

```
rabbit object
    |
    | __proto__
    ↓
animal object
    |
    | __proto__
    ↓
Object.prototype
    |
    | __proto__
    ↓
null (end of chain)
```

---

## __proto__ vs prototype {#proto-vs-prototype}

This is one of the most confusing aspects of JavaScript prototypes. Let's break it down clearly.

### `__proto__` (Dunder Proto)

- `__proto__` is the actual object that is used in the lookup chain
- It's a property of every object instance
- It points to the prototype of the constructor function that created it
- It's a getter/setter for the internal `[[Prototype]]` property

```javascript
const obj = {};
console.log(obj.__proto__ === Object.prototype);  // true
```

### `prototype`

- `prototype` is a property of constructor functions only
- It's used as the blueprint for `__proto__` when creating new instances
- When you create an object using `new`, the new object's `__proto__` is set to the constructor's `prototype`

```javascript
function Person(name) {
  this.name = name;
}

// prototype is a property of the constructor function
console.log(typeof Person.prototype);  // "object"

// Add method to prototype
Person.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const john = new Person("John");

// john's __proto__ points to Person.prototype
console.log(john.__proto__ === Person.prototype);  // true

// john doesn't have a prototype property (it's not a constructor)
console.log(john.prototype);  // undefined
```

### Key Differences Table

| Feature | `__proto__` | `prototype` |
|---------|-------------|-------------|
| Available on | All objects | Constructor functions only |
| Points to | The prototype object | Object to be used as prototype for instances |
| Used for | Accessing the prototype chain | Defining shared properties/methods |
| Standard | Non-standard (use Object.getPrototypeOf()) | Standard |

### Modern Alternative

Instead of using `__proto__`, use these standard methods:

```javascript
// Get prototype
Object.getPrototypeOf(obj);

// Set prototype
Object.setPrototypeOf(obj, prototype);
```

---

## Constructor Functions {#constructor-functions}

Constructor functions are regular functions used with the `new` keyword to create objects.

### Basic Constructor Function

```javascript
function Car(make, model, year) {
  // Properties unique to each instance
  this.make = make;
  this.model = model;
  this.year = year;
}

// Methods shared across all instances (on prototype)
Car.prototype.getInfo = function() {
  return `${this.year} ${this.make} ${this.model}`;
};

Car.prototype.start = function() {
  console.log(`${this.make} ${this.model} is starting...`);
};

// Creating instances
const car1 = new Car("Toyota", "Camry", 2020);
const car2 = new Car("Honda", "Civic", 2021);

console.log(car1.getInfo());  // "2020 Toyota Camry"
car2.start();  // "Honda Civic is starting..."

// Both instances share the same prototype methods
console.log(car1.getInfo === car2.getInfo);  // true (same function reference)
```

### What Happens with `new`

When you use `new` with a constructor function, JavaScript does four things:

```javascript
function Person(name) {
  // 1. A new empty object is created
  // const this = {};
  
  // 2. The new object's __proto__ is set to Person.prototype
  // this.__proto__ = Person.prototype;
  
  // 3. The constructor function runs with 'this' bound to the new object
  this.name = name;
  
  // 4. The new object is returned (unless the constructor explicitly returns an object)
  // return this;
}
```

### Constructor Property

Every prototype has a `constructor` property that points back to the constructor function:

```javascript
function Dog(name) {
  this.name = name;
}

const myDog = new Dog("Buddy");

console.log(Dog.prototype.constructor === Dog);  // true
console.log(myDog.constructor === Dog);  // true (inherited from prototype)
```

---

## Object.create() {#object-create}

`Object.create()` creates a new object with the specified prototype object. It provides a cleaner way to set up prototypal inheritance without using constructor functions.

### Basic Usage

```javascript
const personProto = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },
  
  introduce() {
    console.log(`My name is ${this.name} and I'm ${this.age} years old`);
  }
};

// Create object with personProto as prototype
const john = Object.create(personProto);
john.name = "John";
john.age = 30;

john.greet();  // "Hello, I'm John"
console.log(john.__proto__ === personProto);  // true
```

### Object.create() with Property Descriptors

```javascript
const animal = {
  type: "Animal",
  
  describe() {
    console.log(`This is a ${this.type}`);
  }
};

const dog = Object.create(animal, {
  name: {
    value: "Rex",
    writable: true,
    enumerable: true,
    configurable: true
  },
  
  breed: {
    value: "German Shepherd",
    writable: false,
    enumerable: true,
    configurable: false
  }
});

console.log(dog.name);   // "Rex"
console.log(dog.breed);  // "German Shepherd"
dog.describe();          // "This is a Animal"
dog.type = "Dog";
dog.describe();          // "This is a Dog"
```

### Object.create(null)

Creating an object with no prototype (no inherited properties):

```javascript
const pureObject = Object.create(null);

console.log(pureObject.toString);  // undefined (no inherited methods)
console.log(pureObject.__proto__); // undefined

// Useful for creating dictionaries/maps without prototype pollution
const dictionary = Object.create(null);
dictionary.toString = "my custom value";  // No conflict with Object.prototype.toString
```

### Comparison: Constructor vs Object.create()

```javascript
// Using Constructor Function
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() {
  console.log(`Hi, I'm ${this.name}`);
};
const person1 = new Person("Alice", 25);

// Using Object.create()
const personProto = {
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
};
const person2 = Object.create(personProto);
person2.name = "Bob";
person2.age = 28;

// Both achieve similar results
person1.greet();  // "Hi, I'm Alice"
person2.greet();  // "Hi, I'm Bob"
```

---

## instanceof Operator {#instanceof-operator}

The `instanceof` operator tests whether an object has a constructor's prototype anywhere in its prototype chain.

### Basic Usage

```javascript
function Car(make) {
  this.make = make;
}

const myCar = new Car("Toyota");

console.log(myCar instanceof Car);     // true
console.log(myCar instanceof Object);  // true (all objects inherit from Object)
console.log(myCar instanceof Array);   // false
```

### How instanceof Works

```javascript
// instanceof checks if Constructor.prototype exists in object's prototype chain

function Animal() {}
function Dog() {}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const myDog = new Dog();

console.log(myDog instanceof Dog);     // true
console.log(myDog instanceof Animal);  // true
console.log(myDog instanceof Object);  // true

// Manual check (what instanceof does internally)
console.log(Dog.prototype.isPrototypeOf(myDog));    // true
console.log(Animal.prototype.isPrototypeOf(myDog)); // true
```

### Common Use Cases

```javascript
// Type checking
function processData(data) {
  if (data instanceof Array) {
    console.log("Processing array...");
    data.forEach(item => console.log(item));
  } else if (data instanceof Object) {
    console.log("Processing object...");
    for (let key in data) {
      console.log(`${key}: ${data[key]}`);
    }
  } else {
    console.log("Processing primitive value:", data);
  }
}

processData([1, 2, 3]);
processData({name: "John", age: 30});
processData("Hello");
```

### Limitations and Caveats

```javascript
// instanceof doesn't work across different window/frame contexts
// Each frame has its own Array constructor

// instanceof doesn't work with primitives
console.log("hello" instanceof String);  // false
console.log(5 instanceof Number);        // false

// But works with wrapper objects
console.log(new String("hello") instanceof String);  // true
console.log(new Number(5) instanceof Number);        // true

// Can be fooled by modifying prototype
function Cat() {}
const fluffy = new Cat();
console.log(fluffy instanceof Cat);  // true

Cat.prototype = {};  // Change prototype
console.log(fluffy instanceof Cat);  // false (fluffy still has old prototype)
```

---

## Prototypal Inheritance {#prototypal-inheritance}

Prototypal inheritance allows objects to inherit properties and methods from other objects.

### Method 1: Using Constructor Functions

```javascript
// Parent constructor
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

Animal.prototype.sleep = function() {
  console.log(`${this.name} is sleeping`);
};

// Child constructor
function Dog(name, breed) {
  // Call parent constructor
  Animal.call(this, name);
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Add Dog-specific methods
Dog.prototype.bark = function() {
  console.log(`${this.name} says: Woof!`);
};

// Usage
const myDog = new Dog("Rex", "German Shepherd");
myDog.eat();    // "Rex is eating" (inherited)
myDog.sleep();  // "Rex is sleeping" (inherited)
myDog.bark();   // "Rex says: Woof!" (own method)

console.log(myDog instanceof Dog);     // true
console.log(myDog instanceof Animal);  // true
```

### Method 2: Using Object.create()

```javascript
// Parent object
const animal = {
  init(name) {
    this.name = name;
    return this;
  },
  
  eat() {
    console.log(`${this.name} is eating`);
  }
};

// Child object
const dog = Object.create(animal);

dog.init = function(name, breed) {
  animal.init.call(this, name);
  this.breed = breed;
  return this;
};

dog.bark = function() {
  console.log(`${this.name} says: Woof!`);
};

// Create instance
const myDog = Object.create(dog).init("Max", "Labrador");
myDog.eat();   // "Max is eating"
myDog.bark();  // "Max says: Woof!"
```

### Method 3: Using ES6 Classes (Modern Approach)

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    console.log(`${this.name} is eating`);
  }
  
  sleep() {
    console.log(`${this.name} is sleeping`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // Call parent constructor
    this.breed = breed;
  }
  
  bark() {
    console.log(`${this.name} says: Woof!`);
  }
}

const myDog = new Dog("Buddy", "Golden Retriever");
myDog.eat();    // "Buddy is eating"
myDog.bark();   // "Buddy says: Woof!"
```

### Multiple Levels of Inheritance

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.breathe = function() {
  console.log(`${this.name} is breathing`);
};

function Mammal(name, furColor) {
  Animal.call(this, name);
  this.furColor = furColor;
}

Mammal.prototype = Object.create(Animal.prototype);
Mammal.prototype.constructor = Mammal;

Mammal.prototype.produceMilk = function() {
  console.log(`${this.name} is producing milk`);
};

function Dog(name, furColor, breed) {
  Mammal.call(this, name, furColor);
  this.breed = breed;
}

Dog.prototype = Object.create(Mammal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} barks`);
};

const myDog = new Dog("Rex", "brown", "Beagle");
myDog.breathe();      // "Rex is breathing" (from Animal)
myDog.produceMilk();  // "Rex is producing milk" (from Mammal)
myDog.bark();         // "Rex barks" (from Dog)

console.log(myDog instanceof Dog);     // true
console.log(myDog instanceof Mammal);  // true
console.log(myDog instanceof Animal);  // true
```

---

## Practical Examples {#practical-examples}

### Example 1: Building a Shape Hierarchy

```javascript
function Shape(color) {
  this.color = color;
}

Shape.prototype.describe = function() {
  console.log(`This is a ${this.color} shape`);
};

// Circle inherits from Shape
function Circle(color, radius) {
  Shape.call(this, color);
  this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.getArea = function() {
  return Math.PI * this.radius * this.radius;
};

Circle.prototype.getCircumference = function() {
  return 2 * Math.PI * this.radius;
};

// Rectangle inherits from Shape
function Rectangle(color, width, height) {
  Shape.call(this, color);
  this.width = width;
  this.height = height;
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};

Rectangle.prototype.getPerimeter = function() {
  return 2 * (this.width + this.height);
};

// Usage
const circle = new Circle("red", 5);
circle.describe();  // "This is a red shape"
console.log("Area:", circle.getArea().toFixed(2));  // "Area: 78.54"

const rectangle = new Rectangle("blue", 4, 6);
rectangle.describe();  // "This is a blue shape"
console.log("Area:", rectangle.getArea());  // "Area: 24"
```

### Example 2: Creating a Plugin System

```javascript
// Base plugin
const Plugin = {
  init(name) {
    this.name = name;
    this.enabled = true;
    return this;
  },
  
  enable() {
    this.enabled = true;
    console.log(`${this.name} enabled`);
  },
  
  disable() {
    this.enabled = false;
    console.log(`${this.name} disabled`);
  }
};

// Logger plugin
const LoggerPlugin = Object.create(Plugin);

LoggerPlugin.log = function(message) {
  if (this.enabled) {
    console.log(`[${this.name}]: ${message}`);
  }
};

// Analytics plugin
const AnalyticsPlugin = Object.create(Plugin);

AnalyticsPlugin.track = function(event) {
  if (this.enabled) {
    console.log(`[${this.name}] Tracking: ${event}`);
  }
};

// Create instances
const logger = Object.create(LoggerPlugin).init("Logger");
const analytics = Object.create(AnalyticsPlugin).init("Analytics");

logger.log("Application started");  // "[Logger]: Application started"
analytics.track("page_view");       // "[Analytics] Tracking: page_view"

logger.disable();
logger.log("This won't show");      // (nothing printed)
```

### Example 3: Method Override and Super

```javascript
function Vehicle(type) {
  this.type = type;
}

Vehicle.prototype.start = function() {
  console.log(`${this.type} is starting...`);
};

Vehicle.prototype.stop = function() {
  console.log(`${this.type} is stopping...`);
};

function ElectricCar(type, batteryLevel) {
  Vehicle.call(this, type);
  this.batteryLevel = batteryLevel;
}

ElectricCar.prototype = Object.create(Vehicle.prototype);
ElectricCar.prototype.constructor = ElectricCar;

// Override start method
ElectricCar.prototype.start = function() {
  if (this.batteryLevel > 0) {
    // Call parent method
    Vehicle.prototype.start.call(this);
    console.log(`Battery level: ${this.batteryLevel}%`);
  } else {
    console.log("Battery dead! Please charge.");
  }
};

ElectricCar.prototype.charge = function() {
  this.batteryLevel = 100;
  console.log("Fully charged!");
};

const tesla = new ElectricCar("Tesla Model 3", 75);
tesla.start();
// "Tesla Model 3 is starting..."
// "Battery level: 75%"

tesla.charge();
// "Fully charged!"
```

---

## Best Practices {#best-practices}

### 1. Add Methods to Prototype, Not Constructor

```javascript
// ❌ Bad: Methods created for each instance
function Person(name) {
  this.name = name;
  this.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
  };
}

// ✅ Good: Methods shared across instances
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};
```

### 2. Use Object.create() for Clean Inheritance

```javascript
// ❌ Avoid this pattern
Child.prototype = new Parent();

// ✅ Use this instead
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

### 3. Don't Modify Built-in Prototypes

```javascript
// ❌ Bad: Modifying native prototypes
Array.prototype.myCustomMethod = function() {
  // This can cause conflicts and unexpected behavior
};

// ✅ Good: Create utility functions or extend properly
function myArrayHelper(arr) {
  // Work with the array
}
```

### 4. Use hasOwnProperty for Property Checks

```javascript
const obj = {
  name: "John"
};

// Check own properties vs inherited properties
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key]);
  }
}

// Or use Object.keys() which only returns own properties
Object.keys(obj).forEach(key => {
  console.log(key, obj[key]);
});
```

### 5. Modern Alternatives: Use ES6 Classes

```javascript
// For new code, prefer ES6 class syntax
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  speak() {
    console.log(`${this.name} barks`);
  }
}
```

### 6. Understand Performance Implications

```javascript
// Prototype chain lookup has performance cost
// Keep prototype chains shallow when possible

// ✅ Good: Direct property access
obj.property;

// ⚠️ Slower: Deep prototype chain lookup
obj.__proto__.__proto__.__proto__.property;
```

---

## Summary

### Key Takeaways

1. **Prototypes are the foundation of inheritance in JavaScript** - Every object has a prototype that it inherits from
2. **Prototype Chain** - JavaScript looks up the prototype chain when accessing properties
3. **`__proto__` vs `prototype`** - `__proto__` is the actual prototype link, `prototype` is a property of constructor functions
4. **Constructor Functions** - Use `new` keyword to create instances with shared methods on the prototype
5. **Object.create()** - Creates objects with specified prototype, cleaner than constructor pattern
6. **instanceof** - Checks if a constructor's prototype exists in an object's prototype chain
7. **Prototypal Inheritance** - Objects inherit from other objects through the prototype chain

### Quick Reference

```javascript
// Creating objects with prototypes
const obj = Object.create(proto);

// Constructor function pattern
function Constructor() {}
Constructor.prototype.method = function() {};
const instance = new Constructor();

// Checking prototypes
Object.getPrototypeOf(obj);
obj instanceof Constructor;
Constructor.prototype.isPrototypeOf(obj);

// Setting up inheritance
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

---

**End of Week 10 Tutorial** 🎉