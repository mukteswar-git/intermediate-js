import Task from "../models/Task.js";

export default class TaskList {
  constructor() {
    this.tasks = new Map()
  }

  addTask(id, title) {
    const task = new Task(id, title);
    this.tasks.set(id, task);
  }

  toggleTask(id) {
    const toggle = this.tasks.get(id);
    toggle.toggle();
  }
}