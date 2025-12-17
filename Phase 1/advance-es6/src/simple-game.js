// Create a Character class with: 
// - Private field #health
// - Constuctor(name, health)
// - Methods: attack(), takeDamage(amount), isAlive()
// - Getter for health

class Character {
  #health;

  constructor(name, health) {
    this.name = name;
    this.#health = health;
  }

  get health() {
    return this.#health;
  }

  attack() {
    return 10;
  }

  takeDamage(amount) {
    this.#health -= amount;
    if (this.#health < 0) this.#health = 0;
  }

  isAlive() {
    return this.#health > 0;
  }
}


// Crete a Warrior subclass that:
// - Adds a weapon property
// - Overrides attack() to do more damage
// - Has a special ability: shieldBlock()

class Warrior extends Character {
  constructor(name, health, weapon) {
    super(name, health);
    this.weapon = weapon;
  }

  attack() {
    return 15;
  }

  shieldBlock() {
    console.log(`${this.name} gets a shield protection.`);
    return 0.5;
  }
}


// Create a Mage subclass that:
// - Adds a mana property
// - Overrides attack to user mana
// - Has a special ability: heal(target)

class Mage extends Character {
  constructor(name, health, mana) {
    super(name, health);
    this.mana = mana;
  }

  attack() {
    if (this.mana >= 10) {
      this.mana -= 10;
      return 20;
    }
    return 5;
  }

  heal(target) {
    if (this.mana >= 15) {
      this.mana -= 15;
      target.takeDamage(-20);
      console.log(`${this.name} heals ${target.name}!`);
    }
  }
}

// Test
const warrior = new Warrior('Conan', 100, 'Sword');
const mage = new Mage('Gandalf', 80, 100);

console.log(`Battle: ${warrior.name} v/s ${mage.name}`);
