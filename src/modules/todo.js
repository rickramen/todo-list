/* todo.js */
import { parseISO, isBefore, format } from 'date-fns';

export default class Todo {
    constructor(title, description, dueDate, priority) {
      this.title = title; 
      this.description = description; 
      this.dueDate = dueDate; 
      this.priority = priority; 
      this.completed = false; // default
    }
  
    updateTodo({ title, description, dueDate, priority }) {
      if (title !== undefined) this.title = title;
      if (description !== undefined) this.description = description;
      if (dueDate !== undefined) this.dueDate = parseISO(dueDate);
      if (priority !== undefined) this.priority = priority;
    }

    toggleComplete() {
      this.completed = !this.completed;
    }

    isOverdue() {
        const today = new Date();
        return !this.completed && isBefore(this.dueDate, today);
      }

    getFormattedDueDate() {
        return format(this.dueDate, 'yyyy-MM-dd'); 
    } 
  }