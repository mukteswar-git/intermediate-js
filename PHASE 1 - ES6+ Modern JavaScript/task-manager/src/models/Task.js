export default class Task {
  constructor (id, title) {
    this.id = id;
    this.title = title;
    this.completed = false;
  }

  toggle() {
    this.completed = !this.completed;
  }
}