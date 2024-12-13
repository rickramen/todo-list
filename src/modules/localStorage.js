// localStorage.js

import Project from './project'; 
import Todo from './todo'; 

export function saveProjectsToLocalStorage(projects) {
    if (Array.isArray(projects)) {
        localStorage.setItem('projects', JSON.stringify(projects));
    } else {
        console.error('Error Saving: Invalid projects array.');
    }
}

export function loadProjectsFromLocalStorage() {
    const storedProjects = localStorage.getItem('projects');
    let projects = [];

    if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);

        parsedProjects.forEach(projectData => {
            const project = new Project(projectData.name);

            projectData.todos.forEach(todoData => {
                const todo = new Todo(
                    todoData.title,
                    todoData.description,
                    todoData.dueDate,
                    todoData.priority
                );
                project.addTodo(todo);
            });
            projects.push(project);
        });
    } 

    return projects;
}
