export class Task {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.completed = false;
    this.createdAt = new Date();
  }

  toggle() {
    this.completed = !this.completed;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
      createdAt: this.createdAt.toISOString()
    };
  }
}