// project.js

export default class Project {
    constructor(name) {
        this.name = name;
        this.todos = []; 
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todo) {
        const index = this.todos.indexOf(todo);
        if (index > -1) {
            this.todos.splice(index, 1);
        }
    }

    getTodos() {
        return this.todos;
    }
}
