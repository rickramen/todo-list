// index.js

import './styles.css'
import Todo from './modules/todo';
import Project from './modules/project';
import * as modalUtils from './modules/modal';

const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const projectForm = document.getElementById('project-form');
const projectSidebar = document.getElementById('project-sidebar');
const currentProjectName = document.getElementById('current-project-name');

let projects = [];
let currentProject = null; 

function saveProjectsToLocalStorage() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

function loadProjectsFromLocalStorage() {
  const storedProjects = localStorage.getItem('projects');
  if (storedProjects) {
    const parsedProjects = JSON.parse(storedProjects);
    parsedProjects.forEach(projectData => {
      const project = new Project(projectData.name);
      projectData.todos.forEach(todoData => {
        const todo = new Todo(
          todoData.title,
          todoData.description,
          todoData.dueDate,
          todoData.priority,
        );
        project.addTodo(todo);
      });
      projects.push(project);
    });
  } else {
    // Create a default project if no local storage exists
    const defaultProject = new Project('Default');
    projects.push(defaultProject);
  }
  updateProjectSidebar(); 
}

function updateProjectSidebar() {
  projectSidebar.innerHTML = '';
  projects.forEach(project => {
    createProjectButton(project);
  });

  // Hide when no projects
  if (projects.length === 0) {
    showCreateTodoButton(false); // No projects left, hide the button
  } else {
    if (!currentProject) {
      currentProject = projects[0]; 
      loadTodosForProject(currentProject);
      updateMainContent(currentProject);
    }
    showCreateTodoButton(true); 
  }
}

function createProjectButton(project) {
  const projectButton = document.createElement('button');
  projectButton.classList.add('project-button');
  projectButton.type = 'button';
  projectButton.textContent = project.name;
  projectButton.addEventListener('click', () => selectProject(project));
  projectSidebar.appendChild(projectButton);

  // Added the project delete button to the sidebar for now
  createDeleteButton(project);
}

function createDeleteButton(project){
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-project-button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
 
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    deleteProject(project);
  });
  projectSidebar.appendChild(deleteButton);
}

function selectProject(project) {
  currentProject = project;
  loadTodosForProject(project);
  updateMainContent(currentProject);
}

function updateMainContent(project) {
  currentProjectName.textContent = project.name;
}

function showCreateTodoButton(show) {
  if (show) {
    modalUtils.showTodoButton();
  } else {
    modalUtils.hideTodoButton();
  }
}

function deleteProject(projectToDelete) {
  projects = projects.filter(project => project !== projectToDelete);
  
  if (currentProject === projectToDelete) {
    // If there are no projects left, set currentProject to null
    currentProject = projects[0] || null; 
    
    if (currentProject) {
      loadTodosForProject(currentProject); 
      updateMainContent(currentProject);  
    } else {
      todoList.innerHTML = '';  
      currentProjectName.textContent = '';  
    }
  }

  saveProjectsToLocalStorage();
  updateProjectSidebar();
}

// Add todo to the UI
function addTodoToDOM(todo) {
  const todoItem = document.createElement('li');
  todoItem.classList.add('todo-item');
  
  todoItem.innerHTML = `
    <div>
      <strong>${todo.title}</strong>
      <p>${todo.description}</p>
      <p>Due: ${todo.getFormattedDueDate()}</p>
      <p>Priority: ${todo.priority}</p>
    </div>
  `;

  // Add delete button to todos
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.type = 'button';
  deleteButton.addEventListener('click', () => {
    todoItem.remove(); 
    removeTodoFromProject(todo); 
  });
  
  todoItem.appendChild(deleteButton);
  todoList.appendChild(todoItem);
}


function addTodoToProject(todo) {
  if (currentProject) {
    currentProject.addTodo(todo);
    saveProjectsToLocalStorage();
    loadTodosForProject(currentProject); 
  }
}

function loadTodosForProject(project) {
  todoList.innerHTML = '';
  project.getTodos().forEach(todo => {
    addTodoToDOM(todo); 
  });
}

function removeTodoFromProject(todo) {
  const project = projects.find(p => p.name === todo.project);
  if (project) {
    project.removeTodo(todo);
    saveProjectsToLocalStorage(); 
  }
}

// Handle form submission for creating project
projectForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const projectName = document.getElementById('project-name').value;
  const newProject = new Project(projectName);
  projects.push(newProject);
  saveProjectsToLocalStorage();
  updateProjectSidebar(); 
  
  modalUtils.hideModal(modalUtils.projectModal);
  projectForm.reset();
});

// Handle form submission for creating todos
todoForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;
    const newTodo = new Todo(title, description, dueDate, priority);
    addTodoToProject(newTodo);
  
    modalUtils.hideModal(modalUtils.todoModal);
    todoForm.reset();
});
  

// Load the projects
loadProjectsFromLocalStorage();


