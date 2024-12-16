// index.js

import './styles.css'
import Todo from './modules/todo';
import Project from './modules/project';
import * as modalUtils from './modules/modal';
import { format } from 'date-fns';
import 
{   loadProjectsFromLocalStorage, 
    saveProjectsToLocalStorage 
} from './modules/localStorage';

const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const projectForm = document.getElementById('project-form');
const projectContainer = document.getElementById('project-container');
const todoContainer = document.getElementById('todo-container');
const currentProjectName = document.getElementById('current-project-name');
const closeProjectModalButton = document.getElementById('close-project-modal-btn');
const closeTodoModalButton = document.getElementById('close-todo-modal-btn');

const today = new Date();
const formattedDate = format(today, 'yyyy-MM-dd');
document.getElementById('due-date').setAttribute('min', formattedDate);

let currentProject = null;
let activeTodo = null;
let projects = [];

function initialize() {
    projects = loadProjectsFromLocalStorage(); 

    if (!projects || projects.length === 0) {
        projects = [new Project('Default')];
        saveProjectsToLocalStorage(projects);
    }

    updateProjectSidebar();
}

function updateProjectSidebar() {
    projectContainer.innerHTML = '';
    
    projects.forEach(project => {
        addProjectButton(project);
    });

    // Hide create Todo btn when no projects
    if (projects.length === 0) {
        // Hide when no projects left
        showCreateTodoButton(false);
    } else {
        // Default the current project to first one
        if (!currentProject) {
            currentProject = projects[0]; 
            loadTodosForProject(currentProject);
            updateMainContent(currentProject);
        }
        showCreateTodoButton(true); 
    }
}


function selectProject(project) {
    currentProject = project;
    loadTodosForProject(project);
    updateMainContent(currentProject);
}

function updateMainContent(project) {
    currentProjectName.textContent = project.name;
    addDeleteProjectButton(project); 
}

function showCreateTodoButton(show) {
    if (show) {
        modalUtils.showTodoButton();
    } else {
        modalUtils.hideTodoButton();
    }
}

// Adds project to sidebar
function addProjectButton(project) {
    const projectButton = document.createElement('button');
    projectButton.classList.add('project-button');
    projectButton.type = 'button';
    projectButton.textContent = project.name;
    
    projectButton.addEventListener('click', () => selectProject(project));
    projectContainer.appendChild(projectButton);
}

function addDeleteProjectButton(project) {
    const existingDeleteButton = todoContainer.querySelector('.delete-project-button');
    
    if (existingDeleteButton) {
        existingDeleteButton.remove();
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-project-button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete Project';
 
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteProject(project);
    });
    
    todoContainer.appendChild(deleteButton);
}

function deleteProject(projectToDelete) {
    projects = projects.filter(project => project !== projectToDelete);
  
    if (currentProject === projectToDelete) {
        // If there are no projects, set currentProject to null
        currentProject = projects[0] || null; 
        
        if (currentProject) {
            loadTodosForProject(currentProject); 
            updateMainContent(currentProject);  
        } else {
            todoList.innerHTML = '';  
            currentProjectName.textContent = '';  
        }
    }

    saveProjectsToLocalStorage(projects);
    updateProjectSidebar();

    // Remove the delete button if no projects are left
    if (projects.length === 0) {
        const deleteButton = todoContainer.querySelector('.delete-project-button');
        if (deleteButton) {
            deleteButton.remove();  
        }
    }
}

// Add todo to the UI
function addTodoToDOM(todo) {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
  
    // Create left side todo container
    const todoLeftContainer = document.createElement('div');
    todoLeftContainer.classList.add('todo-left-container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('todo-checkbox');
    checkbox.checked = todo.completed;

    // Toggle completed state when clicked
    checkbox.addEventListener('click', () => {
        todo.toggleComplete();
        updateTodoCompletion(todo, todoItem); 
        saveProjectsToLocalStorage(projects);
    });

    // Todo title
    const todoTitle = document.createElement('span');
    todoTitle.classList.add('todo-title');
    todoTitle.textContent = todo.title;

    todoLeftContainer.appendChild(checkbox);
    todoLeftContainer.appendChild(todoTitle);
    todoItem.appendChild(todoLeftContainer);

    // Create right side of todo (details + buttons)
    const todoRightContainer = document.createElement('div');
    todoRightContainer.classList.add('todo-right-container');

    // Create container for the todo details
    const todoDetails = document.createElement('div');
    todoDetails.classList.add('todo-details');

    const todoDueDate = document.createElement('span');
    todoDueDate.classList.add('todo-due-date');
    todoDueDate.textContent = `Due: ${todo.getFormattedDueDate()}`;  

    const todoPriority = document.createElement('span');
    todoPriority.classList.add('todo-priority');
   
    const normalizedPriority = todo.priority.trim().toLowerCase();  

    let displayPriority = normalizedPriority.charAt(0).toUpperCase() + normalizedPriority.slice(1);  

    // Apply color based on priority
    if (normalizedPriority === 'low') {
        todoPriority.style.color = 'green';
    } else if (normalizedPriority === 'medium') {
        todoPriority.style.color = 'orange';
    } else if (normalizedPriority === 'high') {
        todoPriority.style.color = 'red';
    }
    todoPriority.textContent = `${displayPriority} Priority`;

    todoDetails.appendChild(todoDueDate);
    todoDetails.appendChild(todoPriority);
    todoRightContainer.appendChild(todoDetails);


    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('todo-buttons');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit / View';
    editButton.type = 'button';
    editButton.classList.add('todo-edit-button');  

    editButton.addEventListener('click', () => {
        activeTodo = todo;
        modalUtils.openEditModal(todo);
    });

    // Add Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.type = 'button';
    deleteButton.classList.add('todo-delete-button');  

    deleteButton.addEventListener('click', () => {
        todoItem.remove();
        removeTodoFromProject(todo);
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    todoRightContainer.appendChild(buttonContainer);
    todoItem.appendChild(todoRightContainer);
    todoList.appendChild(todoItem);
}

function addTodoToProject(todo) {
    if (currentProject) {
        currentProject.addTodo(todo);
        saveProjectsToLocalStorage(projects);
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
        saveProjectsToLocalStorage(projects); 
    }
}

function updateTodoCompletion(todo, todoItem) {
    const todoTitle = todoItem.querySelector('.todo-title');
    
    if (todo.completed) {
        todoTitle.style.textDecoration = 'line-through'; 
        todoItem.classList.add('completed'); 
    } else {
        todoTitle.style.textDecoration = 'none'; 
        todoItem.classList.remove('completed');
    }
}


// Handle form submission for creating project
projectForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const projectName = document.getElementById('project-name').value;
    const newProject = new Project(projectName);
    projects.push(newProject);
    saveProjectsToLocalStorage(projects);
    updateProjectSidebar(); 

    modalUtils.hideModal(modalUtils.projectModal);
    projectForm.reset();
});

// Handle form submission for creating or editing todos
todoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;

    if (activeTodo) {
        activeTodo.updateTodo({
            title,
            description,
            dueDate,
            priority
        });

        saveProjectsToLocalStorage(projects);
        loadTodosForProject(currentProject);
        activeTodo = null; 
      
    } else {
        const newTodo = new Todo(title, description, dueDate, priority);
        addTodoToProject(newTodo);
    }

    modalUtils.hideModal(modalUtils.todoModal);
    todoForm.reset();
});

closeProjectModalButton.addEventListener('click', () => {
    modalUtils.hideModal(modalUtils.projectModal);
    projectForm.reset();
  });
  
closeTodoModalButton.addEventListener('click', () => {
  modalUtils.hideModal(modalUtils.todoModal);
  todoForm.reset(); 
});


// Initialize the app
initialize();