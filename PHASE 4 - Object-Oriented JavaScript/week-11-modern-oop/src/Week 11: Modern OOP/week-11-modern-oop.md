# Week 11: Modern OOP - ES6 Classes Deep Dive

## Table of Contents
1. [ES6 Class Syntax Review](#1-es6-class-syntax-review)
2. [Inheritance with extends](#2-inheritance-with-extends)
3. [The super Keyword](#3-the-super-keyword)
4. [Static Methods](#4-static-methods)
5. [Getters and Setters](#5-getters-and-setters)
6. [Private Fields (#)](#6-private-fields)
7. [Composition vs Inheritance](#7-composition-vs-inheritance)
8. [Comprehensive Example](#8-comprehensive-example-e-commerce-system)
9. [Practice Exercises](#9-practice-exercises)
10. [Summary](#10-summary)

---

## 1. ES6 Class Syntax Review

Classes in JavaScript are syntactic sugar over the existing prototype-based inheritance. They provide a cleaner, more intuitive way to create objects and handle inheritance.

### Basic Class Structure

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
  }

  celebrateBirthday() {
    this.age++;
    return `Happy birthday! Now I'm ${this.age}.`;
  }
}

const person1 = new Person("Alice", 25);
console.log(person1.introduce()); // Hi, I'm Alice and I'm 25 years old.
console.log(person1.celebrateBirthday()); // Happy birthday! Now I'm 26.
```

### Key Points:
- `constructor()` is called when creating a new instance
- Methods are defined without the `function` keyword
- Use `this` to reference instance properties
- Create instances using the `new` keyword

---

## 2. Inheritance with extends

The `extends` keyword creates a child class that inherits from a parent class.

### Basic Inheritance

```javascript
// Parent class
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
  }

  makeSound(sound) {
    return `${this.name} says ${sound}`;
  }

  describe() {
    return `${this.name} is a ${this.species}`;
  }
}

// Child class inheriting from Animal
class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Dog"); // Call parent constructor
    this.breed = breed;
  }

  // Override parent method
  makeSound() {
    return `${this.name} barks: Woof! Woof!`;
  }

  // New method specific to Dog
  fetch() {
    return `${this.name} is fetching the ball!`;
  }
}

const dog1 = new Dog("Buddy", "Golden Retriever");
console.log(dog1.describe());  // Buddy is a Dog (inherited)
console.log(dog1.makeSound()); // Buddy barks: Woof! Woof! (overridden)
console.log(dog1.fetch());     // Buddy is fetching the ball! (new method)
```

### Multiple Child Classes

```javascript
class Cat extends Animal {
  constructor(name, color) {
    super(name, "Cat");
    this.color = color;
  }

  makeSound() {
    return `${this.name} meows: Meow!`;
  }

  climb() {
    return `${this.name} is climbing a tree!`;
  }
}

const cat1 = new Cat("Whiskers", "Orange");
console.log(cat1.describe()); // Whiskers is a Cat
console.log(cat1.makeSound()); // Whiskers meows: Meow!
console.log(cat1.climb());     // Whiskers is climbing a tree!
```

### Key Points:
- `extends` establishes an inheritance relationship
- Child classes inherit all parent properties and methods
- Child classes can override parent methods
- Child classes can add new methods and properties

---

## 3. The super Keyword

The `super` keyword is used to access and call functions on a parent class.

### Using super() in Constructor

```javascript
class Vehicle {
  constructor(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getInfo() {
    return `${this.year} ${this.brand} ${this.model}`;
  }

  start() {
    return "Vehicle starting...";
  }
}

class Car extends Vehicle {
  constructor(brand, model, year, doors) {
    // super() MUST be called before accessing 'this'
    super(brand, model, year); // Calls parent constructor
    this.doors = doors;
  }

  getInfo() {
    // Using super to call parent method
    const parentInfo = super.getInfo();
    return `${parentInfo} with ${this.doors} doors`;
  }

  start() {
    // Can use super to extend parent functionality
    const parentStart = super.start();
    return `${parentStart} Car engine roaring!`;
  }
}

const car1 = new Car("Toyota", "Camry", 2023, 4);
console.log(car1.getInfo()); 
// 2023 Toyota Camry with 4 doors

console.log(car1.start()); 
// Vehicle starting... Car engine roaring!
```

### Nested Inheritance

```javascript
class ElectricCar extends Car {
  constructor(brand, model, year, doors, batteryCapacity) {
    super(brand, model, year, doors);
    this.batteryCapacity = batteryCapacity;
  }

  start() {
    return `${super.start()} Electric motor activated silently!`;
  }

  charge() {
    return `Charging ${this.batteryCapacity}kWh battery...`;
  }
}

const tesla = new ElectricCar("Tesla", "Model 3", 2024, 4, 75);
console.log(tesla.getInfo());
// 2024 Tesla Model 3 with 4 doors

console.log(tesla.start());
// Vehicle starting... Car engine roaring! Electric motor activated silently!

console.log(tesla.charge());
// Charging 75kWh battery...
```

### Key Points:
- `super()` must be called before accessing `this` in child constructor
- `super.methodName()` calls the parent's version of a method
- Allows extending parent functionality instead of replacing it
- Works with multiple levels of inheritance

---

## 4. Static Methods

Static methods are called on the class itself, not on instances. They're useful for utility functions and factory patterns.

### Basic Static Methods

```javascript
class MathHelper {
  // Static method - called on class, not instance
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }

  static PI = 3.14159;

  // Instance method for comparison
  instanceMethod() {
    return "This is an instance method";
  }
}

// Call static methods on the class itself
console.log(MathHelper.add(5, 3));      // 8
console.log(MathHelper.multiply(5, 3)); // 15
console.log(MathHelper.PI);             // 3.14159

// Static methods cannot be called on instances
const helper = new MathHelper();
console.log(helper.instanceMethod()); // Works
// console.log(helper.add(5, 3));     // Error!
```

### Practical Example: Factory Pattern

```javascript
class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
    this.createdAt = new Date();
  }

  // Instance method
  displayInfo() {
    return `User: ${this.username} (${this.email})`;
  }

  // Static factory method
  static createGuest() {
    return new User("guest", "guest@example.com");
  }

  // Static validation method
  static isValidEmail(email) {
    return email.includes("@") && email.includes(".");
  }

  // Static comparison method
  static compareUsers(user1, user2) {
    return user1.createdAt - user2.createdAt;
  }
}

const user1 = new User("john_doe", "john@example.com");
console.log(user1.displayInfo());
// User: john_doe (john@example.com)

const guestUser = User.createGuest(); // Using static factory
console.log(guestUser.displayInfo());
// User: guest (guest@example.com)

console.log(User.isValidEmail("test@email.com")); // true
console.log(User.isValidEmail("invalid-email"));  // false
```

### Key Points:
- Static methods belong to the class, not instances
- Called using `ClassName.methodName()`
- Great for utility functions, factories, and validators
- Cannot access instance properties with `this`
- Can access other static members

---

## 5. Getters and Setters

Getters and setters allow you to define methods that are accessed like properties, providing controlled access to object data.

### Basic Getters and Setters

```javascript
class Rectangle {
  constructor(width, height) {
    this._width = width;   // Convention: _ indicates "private"
    this._height = height;
  }

  // Getter - access like a property
  get width() {
    return this._width;
  }

  // Setter - set like a property
  set width(value) {
    if (value > 0) {
      this._width = value;
    } else {
      console.log("Width must be positive!");
    }
  }

  get height() {
    return this._height;
  }

  set height(value) {
    if (value > 0) {
      this._height = value;
    } else {
      console.log("Height must be positive!");
    }
  }

  // Computed property using getter
  get area() {
    return this._width * this._height;
  }

  get perimeter() {
    return 2 * (this._width + this._height);
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.width);     // 10 (using getter)
console.log(rect.height);    // 5 (using getter)
console.log(rect.area);      // 50 (computed property)
console.log(rect.perimeter); // 30 (computed property)

rect.width = 15;  // Using setter
console.log(rect.width);  // 15
console.log(rect.area);   // 75 (auto-updated)

rect.width = -5;  // Validation in setter
// Output: Width must be positive!
console.log(rect.width); // 15 (unchanged)
```

### Advanced Example: Temperature Converter

```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }

  get celsius() {
    return this._celsius;
  }

  set celsius(value) {
    this._celsius = value;
  }

  get fahrenheit() {
    return (this._celsius * 9/5) + 32;
  }

  set fahrenheit(value) {
    this._celsius = (value - 32) * 5/9;
  }

  get kelvin() {
    return this._celsius + 273.15;
  }

  set kelvin(value) {
    this._celsius = value - 273.15;
  }
}

const temp = new Temperature(25);
console.log(`${temp.celsius}°C = ${temp.fahrenheit}°F = ${temp.kelvin}K`);
// 25°C = 77°F = 298.15K

temp.fahrenheit = 100;
console.log(`${temp.celsius}°C = ${temp.fahrenheit}°F = ${temp.kelvin}K`);
// 37.77777777777778°C = 100°F = 310.92777777777775K
```

### Key Points:
- Getters use `get` keyword, setters use `set` keyword
- Accessed like properties (no parentheses)
- Great for validation, computed properties, and data transformation
- Can create read-only properties (getter without setter)
- Provide an abstraction layer over internal data

---

## 6. Private Fields (#)

Private fields (introduced in ES2022) provide true encapsulation, making properties and methods truly inaccessible from outside the class.

### Basic Private Fields

```javascript
class BankAccount {
  // Private fields (truly private, not just convention)
  #balance = 0;
  #accountNumber;
  #pin;

  // Public field
  accountHolder;

  constructor(accountHolder, accountNumber, initialBalance, pin) {
    this.accountHolder = accountHolder;
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
    this.#pin = pin;
  }

  // Public method to access private field
  getBalance(enteredPin) {
    if (this.#verifyPin(enteredPin)) {
      return this.#balance;
    }
    return "Invalid PIN";
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      return `Deposited $${amount}. New balance: $${this.#balance}`;
    }
    return "Invalid amount";
  }

  withdraw(amount, enteredPin) {
    if (!this.#verifyPin(enteredPin)) {
      return "Invalid PIN";
    }
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return `Withdrew $${amount}. New balance: $${this.#balance}`;
    }
    return "Invalid amount or insufficient funds";
  }

  // Private method
  #verifyPin(enteredPin) {
    return enteredPin === this.#pin;
  }

  getAccountInfo() {
    return `Account: ${this.#accountNumber}, Holder: ${this.accountHolder}`;
  }
}

const account = new BankAccount("John Doe", "ACC123456", 1000, "1234");
console.log(account.getAccountInfo());
// Account: ACC123456, Holder: John Doe

console.log(account.deposit(500));
// Deposited $500. New balance: $1500

console.log(account.getBalance("1234"));
// 1500

console.log(account.withdraw(200, "1234"));
// Withdrew $200. New balance: $1300

console.log(account.withdraw(200, "0000"));
// Invalid PIN

// Cannot access private fields directly
// console.log(account.#balance);  // SyntaxError!
// console.log(account.#pin);      // SyntaxError!
```

### Counter Example with Private Fields

```javascript
class Counter {
  #count = 0;
  #step;

  constructor(initialCount = 0, step = 1) {
    this.#count = initialCount;
    this.#step = step;
  }

  increment() {
    this.#count += this.#step;
    return this.#count;
  }

  decrement() {
    this.#count -= this.#step;
    return this.#count;
  }

  get value() {
    return this.#count;
  }

  reset() {
    this.#count = 0;
  }
}

const counter = new Counter(0, 5);
console.log(counter.value);      // 0
console.log(counter.increment()); // 5
console.log(counter.increment()); // 10
console.log(counter.decrement()); // 5
counter.reset();
console.log(counter.value);      // 0
```

### Key Points:
- Private fields start with `#`
- Truly private - not accessible outside the class
- Must be declared at the top of the class
- Can have private methods too
- Provides real encapsulation and data hiding
- Different from `_property` convention (which is just a naming convention)

---

## 7. Composition vs Inheritance

Composition is often preferred over inheritance for building flexible, maintainable code.

### The Problem with Deep Inheritance

```javascript
// Inheritance approach - limited flexibility
class FlyingAnimal extends Animal {
  fly() {
    return `${this.name} is flying!`;
  }
}

class SwimmingAnimal extends Animal {
  swim() {
    return `${this.name} is swimming!`;
  }
}

// Problem: What if we need an animal that both flies and swims?
// JavaScript doesn't support multiple inheritance well
```

### The Composition Solution

```javascript
// Create small, focused behaviors
const canFly = {
  fly() {
    return `${this.name} is flying through the air!`;
  }
};

const canSwim = {
  swim() {
    return `${this.name} is swimming in the water!`;
  }
};

const canWalk = {
  walk() {
    return `${this.name} is walking on land!`;
  }
};

const canBark = {
  bark() {
    return `${this.name} barks loudly!`;
  }
};

// Base class
class Creature {
  constructor(name) {
    this.name = name;
  }

  describe() {
    return `This is ${this.name}`;
  }
}

// Compose behaviors using Object.assign
class Duck extends Creature {
  constructor(name) {
    super(name);
    Object.assign(this, canFly, canSwim, canWalk);
  }
}

class Fish extends Creature {
  constructor(name) {
    super(name);
    Object.assign(this, canSwim);
  }
}

class Bird extends Creature {
  constructor(name) {
    super(name);
    Object.assign(this, canFly, canWalk);
  }
}

const duck = new Duck("Donald");
console.log(duck.describe()); // This is Donald
console.log(duck.fly());      // Donald is flying through the air!
console.log(duck.swim());     // Donald is swimming in the water!
console.log(duck.walk());     // Donald is walking on land!

const fish = new Fish("Nemo");
console.log(fish.swim());     // Nemo is swimming in the water!

const bird = new Bird("Tweety");
console.log(bird.fly());      // Tweety is flying through the air!
console.log(bird.walk());     // Tweety is walking on land!
```

### Advanced Composition: Game Characters

```javascript
// Abilities as composable behaviors
const canShoot = {
  shoot(target) {
    return `${this.name} shoots at ${target}!`;
  }
};

const canHeal = {
  heal(target) {
    return `${this.name} heals ${target}!`;
  }
};

const canCastSpell = {
  castSpell(spell) {
    return `${this.name} casts ${spell}!`;
  }
};

const canDefend = {
  defend() {
    this.isDefending = true;
    return `${this.name} raises their shield!`;
  }
};

class GameCharacter {
  constructor(name, health) {
    this.name = name;
    this.health = health;
    this.isDefending = false;
  }

  getStatus() {
    return `${this.name} - Health: ${this.health}`;
  }
}

class Warrior extends GameCharacter {
  constructor(name) {
    super(name, 150);
    Object.assign(this, canShoot, canDefend);
  }
}

class Mage extends GameCharacter {
  constructor(name) {
    super(name, 80);
    Object.assign(this, canCastSpell, canHeal);
  }
}

class Paladin extends GameCharacter {
  constructor(name) {
    super(name, 120);
    // Paladins can do everything!
    Object.assign(this, canShoot, canHeal, canCastSpell, canDefend);
  }
}

const warrior = new Warrior("Conan");
console.log(warrior.getStatus());     // Conan - Health: 150
console.log(warrior.shoot("Goblin")); // Conan shoots at Goblin!
console.log(warrior.defend());        // Conan raises their shield!

const mage = new Mage("Gandalf");
console.log(mage.castSpell("Fireball")); // Gandalf casts Fireball!
console.log(mage.heal("Frodo"));         // Gandalf heals Frodo!

const paladin = new Paladin("Arthas");
console.log(paladin.shoot("Demon"));          // Arthas shoots at Demon!
console.log(paladin.castSpell("Holy Light")); // Arthas casts Holy Light!
console.log(paladin.heal("Ally"));            // Arthas heals Ally!
console.log(paladin.defend());                // Arthas raises their shield!
```

### When to Use Each

**Use Inheritance When:**
- There's a clear "is-a" relationship (Dog IS AN Animal)
- The hierarchy is shallow (2-3 levels max)
- Child classes share most of parent's behavior
- You need polymorphism

**Use Composition When:**
- Behaviors can be mixed and matched
- You need flexibility in combining features
- Deep inheritance would become messy
- Objects need to change behavior at runtime

---

## 8. Comprehensive Example: E-Commerce System

Let's combine everything we've learned into a complete e-commerce system.

```javascript
// Base Product class with private fields
class Product {
  #price;
  #stock;
  static #totalProducts = 0;

  constructor(name, price, stock) {
    this.name = name;
    this.#price = price;
    this.#stock = stock;
    this.id = ++Product.#totalProducts;
  }

  // Getters and setters
  get price() {
    return this.#price;
  }

  set price(value) {
    if (value >= 0) {
      this.#price = value;
    } else {
      console.log("Price cannot be negative");
    }
  }

  get stock() {
    return this.#stock;
  }

  reduceStock(quantity) {
    if (quantity <= this.#stock) {
      this.#stock -= quantity;
      return true;
    }
    return false;
  }

  // Static method
  static getTotalProducts() {
    return Product.#totalProducts;
  }

  getInfo() {
    return `${this.name} - $${this.#price} (${this.#stock} in stock)`;
  }
}

// Electronics with warranty (inheritance)
class Electronics extends Product {
  constructor(name, price, stock, warrantyYears) {
    super(name, price, stock);
    this.warrantyYears = warrantyYears;
  }

  getInfo() {
    return `${super.getInfo()} - ${this.warrantyYears} year warranty`;
  }
}

// Clothing with sizes (inheritance)
class Clothing extends Product {
  constructor(name, price, stock, sizes) {
    super(name, price, stock);
    this.sizes = sizes;
  }

  getInfo() {
    return `${super.getInfo()} - Sizes: ${this.sizes.join(", ")}`;
  }
}

// Create products
const laptop = new Electronics("Gaming Laptop", 1299.99, 15, 2);
const phone = new Electronics("Smartphone", 799.99, 30, 1);
const tshirt = new Clothing("Cotton T-Shirt", 29.99, 100, ["S", "M", "L", "XL"]);

console.log(laptop.getInfo());
// Gaming Laptop - $1299.99 (15 in stock) - 2 year warranty

console.log(phone.getInfo());
// Smartphone - $799.99 (30 in stock) - 1 year warranty

console.log(tshirt.getInfo());
// Cotton T-Shirt - $29.99 (100 in stock) - Sizes: S, M, L, XL

console.log(`Total products: ${Product.getTotalProducts()}`);
// Total products: 3

// Simulate purchase
if (laptop.reduceStock(1)) {
  console.log(`Purchased 1 ${laptop.name}`);
  console.log(laptop.getInfo());
  // Gaming Laptop - $1299.99 (14 in stock) - 2 year warranty
}
```

---

## 9. Practice Exercises

### Exercise 1: Shape Hierarchy

Create a class hierarchy for geometric shapes:

**Requirements:**
- Base class: `Shape` with abstract area calculation
- Child classes: `Circle`, `Square`, `Triangle`
- Use getters for area calculation
- Add static method `compareShapes(shape1, shape2)` that returns the larger shape
- Use private fields for dimensions

```javascript
// Your code here
class Shape {
  // Implement base class
}

class Circle extends Shape {
  // Implement Circle
}

// Test your code
const circle = new Circle(5);
const square = new Square(4);
console.log(circle.area);
console.log(Shape.compareShapes(circle, square));
```

---

### Exercise 2: Library System

Build a library management system:

**Requirements:**
- `Book` class with private `#isbn` field
- Child classes: `DigitalBook` and `PhysicalBook`
- Use composition for behaviors: `Downloadable`, `Borrowable`
- Implement static method `getTotalBooks()`
- Add getters/setters for availability

```javascript
// Your code here
const downloadable = {
  download() {
    // Implementation
  }
};

const borrowable = {
  borrow() {
    // Implementation
  }
};

class Book {
  // Implement Book class
}

// Test your code
const ebook = new DigitalBook("1984", "George Orwell", "978-0451524935");
const physicalBook = new PhysicalBook("1984", "George Orwell", "978-0451524935");
```

---

### Exercise 3: Social Media Post System

Create a social media posting system:

**Requirements:**
- Base `Post` class with private `#likes` count
- Subclasses: `TextPost`, `ImagePost`, `VideoPost`
- Use getters/setters for likes with validation (no negative likes)
- Compose behaviors: `Shareable`, `Commentable`, `Likeable`
- Add static method to find most liked post

```javascript
// Your code here
const shareable = {
  share() {
    // Implementation
  }
};

const commentable = {
  addComment(comment) {
    // Implementation
  }
};

class Post {
  // Implement Post class
}

// Test your code
const textPost = new TextPost("Hello World!", "user123");
textPost.like();
textPost.like();
console.log(textPost.likes); // 2
```

---

## 10. Summary

### Key Takeaways

1. **extends** - Creates inheritance relationship between classes
   - Child class inherits parent's properties and methods
   - Can override parent methods
   - Use for "is-a" relationships

2. **super** - Accesses parent class
   - `super()` calls parent constructor (must be first in child constructor)
   - `super.method()` calls parent methods
   - Allows extending parent functionality

3. **Static Methods** - Belong to class, not instances
   - Called on class: `ClassName.method()`
   - Great for utilities, factories, validators
   - Cannot access instance properties

4. **Getters/Setters** - Controlled property access
   - Use `get` and `set` keywords
   - Access like properties (no parentheses)
   - Perfect for validation and computed properties

5. **Private Fields (#)** - True encapsulation
   - Start with `#` symbol
   - Truly inaccessible from outside class
   - Provides real data hiding

6. **Composition** - Often better than deep inheritance
   - More flexible than inheritance
   - Mix and match behaviors
   - Easier to maintain and test

### Best Practices

✅ **DO:**
- Use inheritance for clear "is-a" relationships
- Keep inheritance hierarchies shallow (2-3 levels)
- Use composition when mixing behaviors
- Make fields private when they shouldn't be accessed directly
- Use static methods for utility functions
- Validate data in setters
- Call `super()` first in child constructors

❌ **DON'T:**
- Create deep inheritance hierarchies
- Use inheritance just for code reuse (use composition)
- Access private fields from outside the class
- Forget to call `super()` in child constructors
- Overuse static methods for everything
- Make everything private (balance encapsulation with usability)

### Additional Resources

- [MDN: Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN: Inheritance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN: Private Class Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)

---

**Congratulations!** You've completed Week 11 on Modern OOP with ES6 Classes. Practice the exercises and experiment with different patterns to solidify your understanding.