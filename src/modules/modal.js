// modal.js
const projectForm = document.getElementById('project-form');
const addProjectButton = document.getElementById('add-project-btn');
const projectModal = document.getElementById('project-modal');
const closeProjectModalButton = document.getElementById('close-project-modal-btn');

const todoForm = document.getElementById('todo-form');
const addTodoButton = document.getElementById('add-todo-btn');
const todoModal = document.getElementById('todo-modal');
const closetodoModalButton = document.getElementById('close-todo-modal-btn');

function showModal(modal) {
  modal.style.display = 'flex';
}

function hideModal(modal) {
  modal.style.display = 'none';
}

function openEditModal(todo) {
  document.getElementById('title').value = todo.title;
  document.getElementById('description').value = todo.description;
  document.getElementById('due-date').value = todo.getFormattedDueDate();
  document.getElementById('priority').value = todo.priority;

  showModal(todoModal);
}

function addOutsideClickListener(modal) {
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      hideModal(modal);
    }
  });
}

function showTodoButton() {
  addTodoButton.style.display = 'block';
}

function hideTodoButton() {
  addTodoButton.style.display = 'none';
}


// Modal Event Listeners
addProjectButton.addEventListener('click', () => showModal(projectModal));
addTodoButton.addEventListener('click', () => showModal(todoModal));
closeProjectModalButton.addEventListener('click', () => hideModal(projectModal));
closetodoModalButton.addEventListener('click', () => hideModal(todoModal)); 

addOutsideClickListener(projectModal);
addOutsideClickListener(todoModal);

export {
  showModal,
  hideModal,
  showTodoButton,
  hideTodoButton,
  openEditModal,
  projectModal,
  todoModal
};
