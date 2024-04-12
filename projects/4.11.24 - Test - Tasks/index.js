function extendClass(from, to) {
    for (const prop of Object.getOwnPropertyNames(from.prototype)) {
        if (prop !== "constructor") to[prop] = from.prototype[prop];
    }
}

function generateUID() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

class Task {
    constructor(description, priority, state) {
        this.id = generateUID();
        this.description = description;
        this.priority = priority;
        this.state = state;
    }
}

class Priority {
    constructor(priority) {
        if (priority instanceof String) {
            switch (priority) {
                default:
                    this.a = 0;
                    break;
                case "střední":
                    this.a = 1;
                    break;
                case "vysoká":
                    this.a = 2;
                    break;
            }
        } else if (priority instanceof Number) 
            this.a = priority;
        else this.a = 0;
    }
}

class Filter {
    constructor() {
        
    }
}

class TaskManager {
    constructor() {
        this.tasks = new Map();
    }

    addTask(task) { this.setTask(task); }
    setTask(task) { this.tasks.set(task.id, task); }
    removeTask(taskID) { this.tasks.delete(taskID); }
    filteredTask(filter) {
        switch(by) {
            case "id":
                return Array.from(this.tasks.values()).sort((a, b) => a.id > b.id);
            case "state":
                return Array.from(this.tasks.values()).filter((value) => value )
            case "priority":
                return Array.from(this.tasks.values()).sort((a, b) => a.priority.a > b.priority.a);
            default:
                break;
        }
    }
}

const taskManager = new TaskManager();

taskManager.addTask(Task("", Priority(0), State()))