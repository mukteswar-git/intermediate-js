import './style.css'

import { renderTasks } from './ui/UI.js';
import TaskList from './services/TaskList.js';

const taskList = new TaskList();

taskList.addTask(1, 'Learn JS');
taskList.addTask(2, 'Build Task Manager');

renderTasks(Array.from(taskList.tasks.values()));

document.getElementById('task-list')
  .addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    taskList.toggleTask(id);
    renderTasks(Array.from(taskList.tasks.values()));
  });

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');

addBtn.addEventListener('click', () => {
  const title = input.value.trim();
  if (!title) return;

  taskList.addTask(Date.now(), title);
  renderTasks(Array.from(taskList.tasks.values()));
  input.value = '';
})
