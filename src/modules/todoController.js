// todoController.js

import Todo from './todo';

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const modal = document.getElementById('task-modal');


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
    taskItem.remove(); // Remove task from the UI
  });
  
  taskItem.appendChild(deleteButton);
  taskList.appendChild(taskItem);
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
    addTaskToDOM(newTask);
  
    // Close the modal and reset the form
    modal.style.display = 'none';
    taskForm.reset();
  });
  