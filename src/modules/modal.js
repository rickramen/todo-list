// modal.js

const projectModal = document.getElementById('project-modal');
const todoModal = document.getElementById('todo-modal');
const addProjectButton = document.getElementById('add-project-btn');
const closeProjectModalButton = document.getElementById('close-project-modal-btn');
const addTodoButton = document.getElementById('add-todo-btn');
const closetodoModalButton = document.getElementById('close-todo-modal-btn');

function showModal(modal) {
  modal.style.display = 'block';
}

function hideModal(modal) {
  modal.style.display = 'none';
}

function addOutsideClickListener(modal) {
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      hideModal(modal);
    }
  });
}

// Modal Event Listeners
addProjectButton.addEventListener('click', () => showModal(projectModal));
closeProjectModalButton.addEventListener('click', () => hideModal(projectModal));
addTodoButton.addEventListener('click', () => showModal(todoModal));
closetodoModalButton.addEventListener('click', () => hideModal(todoModal));

addOutsideClickListener(projectModal);
addOutsideClickListener(todoModal);

export {
  showModal,
  hideModal,
  addOutsideClickListener,
  addProjectButton,
  addTodoButton,
  projectModal,
  todoModal,
};
