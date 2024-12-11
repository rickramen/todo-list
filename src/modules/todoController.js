// todoController.js

import Todo from './todo';
import Project from './project';

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const modal = document.getElementById('task-modal');
const projectSidebar = document.getElementById('project-sidebar');
const currentProjectName = document.getElementById('current-project-name');
const addTodoButton = document.getElementById('add-todo-btn');

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
      projectData.tasks.forEach(taskData => {
        const task = new Todo(
          taskData.title,
          taskData.description,
          taskData.dueDate,
          taskData.priority,
        );
        project.addTask(task);
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
    const projectButton = document.createElement('button');
    projectButton.classList.add('project-button');
    projectButton.textContent = project.name;

    projectButton.addEventListener('click', () => {
      currentProject = project;  
      loadTasksForProject(project);  
    });
    projectSidebar.appendChild(projectButton);

    // Add delete button for each project
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-project-button');
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation(); 
      deleteProject(project);  
    });
    projectSidebar.appendChild(deleteButton);
  });

  // Assign the first project as the current
  if (projects.length > 0) {
    currentProject = projects[0];
    loadTasksForProject(currentProject);
    updateMainContent(currentProject);
    showCreateTaskButton(true);  
  } else {
    showCreateTaskButton(false);
  }
}

function updateMainContent(project) {
  currentProjectName.textContent = project.name;
}

function showCreateTaskButton(show) {
  if (show) {
    addTodoButton.style.display = 'block';
  } else {
    addTodoButton.style.display = 'none';
  }
}

function deleteProject(projectToDelete) {
  projects = projects.filter(project => project !== projectToDelete);
  
  if (currentProject === projectToDelete) {
    // If there are no projects left, set currentProject to null
    currentProject = projects[0] || null; 
    
    if (currentProject) {
      loadTasksForProject(currentProject); 
      updateMainContent(currentProject);  
    } else {
      taskList.innerHTML = '';  
      currentProjectName.textContent = '';  
    }
  }

  saveProjectsToLocalStorage();
  updateProjectSidebar();
}

// Add task to the UI
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

  // Add delete button to tasks
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.type = 'button';
  deleteButton.addEventListener('click', () => {
    taskItem.remove(); 
    removeTaskFromProject(task); 
  });
  
  taskItem.appendChild(deleteButton);
  taskList.appendChild(taskItem);
}

// Add task to the selected project
function addTaskToProject(task) {
  if (currentProject) {
    currentProject.addTask(task);
    saveProjectsToLocalStorage();
    loadTasksForProject(currentProject);  // Refresh the task list
  }
}

function loadTasksForProject(project) {
  taskList.innerHTML = '';
  project.getTasks().forEach(task => {
    addTaskToDOM(task); 
  });
}


// Remove task from the selected project
function removeTaskFromProject(task) {
  const project = projects.find(p => p.name === task.project);
  if (project) {
    project.removeTask(task);
    saveProjectsToLocalStorage(); 
  }
}

// Handle form submission for creating project
document.getElementById('create-project-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const projectName = document.getElementById('project-name').value;

  const newProject = new Project(projectName);
  projects.push(newProject);
  saveProjectsToLocalStorage();
  updateProjectSidebar(); 
});

// Handle form submission for creating tasks
taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const priority = document.getElementById('priority').value;
  
    // Create and add task
    const newTask = new Todo(title, description, dueDate, priority);
    addTaskToProject(newTask);
  
    // Close the modal and reset the form
    modal.style.display = 'none';
    taskForm.reset();
});
  

// Load the projects
loadProjectsFromLocalStorage();