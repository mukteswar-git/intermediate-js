import { addTask, removeTask, toggleTask, getTasks } from "./taskManager";

const task1 = addTask('Learn ES6');
const task2 = addTask('Build project');
const task3 = addTask('Write tests');

toggleTask(task1.id);
removeTask(task2.id);

console.log(getTasks());