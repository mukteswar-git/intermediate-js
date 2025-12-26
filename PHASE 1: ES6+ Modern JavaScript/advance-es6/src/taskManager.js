import { Task } from "./task";

const tasks = new Map();
let nextId = 1;

export function addTask(title) {
  const task = new Task(nextId++, title);
  tasks.set(task.id, task);
  return task;
}

export function removeTask(id) {
  return tasks.delete(id);
}

export function toggleTask(id) {
  const task = tasks.get(id);
  if (task) {
    task.toggle();
    return true;
  }
  return false;
}

export function getTasks() {
  return [...tasks.values()];
}