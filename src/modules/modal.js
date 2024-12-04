const addTodoButton = document.getElementById('add-todo-btn');
const modal = document.getElementById('task-modal');         
const closeModalButton = document.getElementById('close-modal-btn'); 


// Show the modal
addTodoButton.addEventListener('click', () => {
  modal.style.display = 'block'; 
});

// Hide the modal
closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none'; 
});

// Hide when click outside of modal window
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
