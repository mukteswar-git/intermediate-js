// CLASS AND INHERITANCE

// CLASS

class Animal {
  // Public field (modern feature)
  species = 'unknown';

  // Private field (prefix with #)
  #screat = 'I have feelings.';

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Instance method
  speak() {
    return `${this.name} makes a noise.`;
  }

  // Getter
  get info() {
    return `${this.name} (${this.age} years)`;
  }

  // Setter
  set nickname(value) {
    this._nickname = value;
  }

  // Static method (belongs to class, not instances)
  static describe() {
    return 'Animals are living organisms.';
  }

  // Access private field
  revealSecret() {
    return this.#screat; 
  }
}

const cat = new Animal('Whiskers', 3);
console.log(cat.speak());
console.log(Animal.describe());
console.log(cat.revealSecret());
console.log(cat.species);
console.log(cat.info);
cat.nickname = 'Tom';
console.log(cat._nickname);
cat.nickname = 'Tomy';
console.log(cat._nickname);


// INHERITANCE WITH 'extends'
class Dog extends Animal {
  constructor(name, age, breed) {
    super(name, age);  // Parent constuctor first
    this.breed = breed;
    this.species = 'Canis familiaris';
  }

  // Override parent method
  speak() {
    return `${this.name} barks.`;
  }

  // Call parent method explicitly
  parentSpeak() {
    return super.speak();
  }

  // New method specific to Dog
  fetch() {
    return `${this.name} fetches the ball`;
  }
}

const rex = new Dog('Rex', 4, 'Beagle');
console.log(rex.speak());
console.log(rex.parentSpeak());
console.log(rex instanceof Dog);
console.log(rex instanceof Animal);


// Base component calss for UI framework

class Component {
  #state = {};

  constructor(props = {}) {
    this.props = props;
  }

  setState(newState) {
    this.#state = { ...this.#state, ...newState};
    this.render();
  }

  getState() {
    return { ...this.#state};
  }

  render() {
    // Override in subclass
    throw new Error('render() must be implemented');
  }
}

class Button extends Component {
  constructor(props) {
    super(props);
    this.setState({ clicked: false});
  }

  render() {
    const state = this.getState();
    return `<button>${this.props.label} (clicked: ${state.clicked})</button>`;
  }

  click() {
    this.setState({ clicked: true });
  }
}

const btn = new Button({ label: "Save" })
btn.click();

console.log(btn.props);
console.log(btn.getState());
console.log(btn.render());
console.log(btn.getState().clicked);


// Common Gotchas

// TRAP 1: Method binding
// class Counter {
//   count = 0;

//   increment() {
//     this.count++;
//   }
// }

// const c = new Counter();
// const inc = c.increment;
// inc(); // TypeError: Cannot read 'count' of undefined

// FIX 1: Use arrow function (atuo-binds)
// class Counter {
//   count = 0;

//   increment = () => {
//     this.count++;
//   }
// }

// const c = new Counter();
// const inc = c.increment;
// inc ()

// FIX 2: Bind in constuctor
class Counter {
  constructor () {
    this.count = 0;
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.count++;
  }
}

const c = new Counter();
const inc = c.increment;
inc ()
