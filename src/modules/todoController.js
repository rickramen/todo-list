// todoController.js

import Todo from './todo';

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const modal = document.getElementById('task-modal');

const tasks = [];

// Function to add task to the UI
function addTaskToDOM(task) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task-item');
  
  taskItem.innerHTML = `
    <div>
      <strong>${task.title}</strong>
      <p>${task.description}</p>
      <p>Due: ${task.getFormattedDueDate()}</p>
      <p>Priority: ${task.priority}</p>
    </div>
  `;

  // Add Delete button to tasks
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    taskItem.remove(); 
    removeTaskFromArray(task); 
  });
  
  taskItem.appendChild(deleteButton);
  taskList.appendChild(taskItem);
}

// Remove task from the tasks array
function removeTaskFromArray(task) {
    const index = tasks.indexOf(task);
    if (index > -1) {
      tasks.splice(index, 1);  
    }
  }

// Add event listener for form submission
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevent default form submission
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;
  
    // Create and add task
    const newTask = new Todo(title, description, dueDate, priority);
    tasks.push(newTask);
    addTaskToDOM(newTask);
  
    // Close the modal and reset the form
    modal.style.display = 'none';
    taskForm.reset();
  });
  