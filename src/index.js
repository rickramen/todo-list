// index.js

import './styles.css'
import Todo from './modules/todo';
import Project from './modules/project';
import * as modalUtils from './modules/modal';
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

let currentProject = null;
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
}

// Add todo to the UI
function addTodoToDOM(todo) {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
  
    todoItem.innerHTML = `
        <div>
            <span class="todo-title">${todo.title}</span>
            <span class="todo-due-date">Due: ${todo.getFormattedDueDate()}</span>
            <span class="todo-priority">Priority: ${todo.priority}</span>
        </div>
    `;

    // Add Edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.type = 'button';
    
    editButton.addEventListener('click', () => {
       modalUtils.openEditModal(todo);  
    });

    // Add Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.type = 'button';
    
    deleteButton.addEventListener('click', () => {
        todoItem.remove(); 
        removeTodoFromProject(todo); 
    });

    todoItem.appendChild(editButton);
    todoItem.appendChild(deleteButton);
    todoList.appendChild(todoItem);
}

// Update an existing todo in the current project
function updateTodoInProject(todo) {
    const updatedTitle = document.getElementById('title').value;
    const updatedDescription = document.getElementById('description').value;
    const updatedDueDate = document.getElementById('due-date').value;
    const updatedPriority = document.getElementById('priority').value;
    
    // Update the todo details
    todo.updateTodo({
        title: updatedTitle,
        description: updatedDescription,
        dueDate: updatedDueDate,
        priority: updatedPriority
    });

    // Save changes to localStorage
    saveProjectsToLocalStorage(projects); 

    // Reload todos for the current project
    loadTodosForProject(currentProject);  
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

// Initialize the app
initialize();