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
        if (typeof(priority) === "string") {
            switch (priority) {
                default:
                    this.a = 0;
                    break;
                case "normal":
                    this.a = 1;
                    break;
                case "high":
                    this.a = 2;
                    break;
            }
        } else if (typeof(priority) === "number")
            this.a = priority % 3;
        else this.a = 0;
    }

    toString() {
        switch (this.a) {
            default:
                return "low";
            case 1:
                return "normal";
            case 2:
                return "high";
        }
    }
}

class State {
    constructor(state) {
        if (typeof(state) === "string") {
            switch (state) {
                default:
                    this.a = 0;
                    break;
                case "processing":
                    this.a = 1;
                    break;
                case "done":
                    this.a = 2;
                    break;
            }
        } else if (typeof(state) === "number")
            this.a = state % 3;
        else this.a = 0;
    }

    toString() {
        switch (this.a) {
            default:
                return "open";
            case 1:
                return "processing";
            case 2:
                return "done";
        }
    }
}

class SortFilter {
    constructor(by, dir) {
        if (typeof(by) === "string") {
            switch (by) {
                default:
                    this.by = 0;
                    break;
                case "state":
                    this.by = 1;
                    break;
                case "priority":
                    this.by = 2;
                    break;
            }
        } else if (typeof(by) === "number")
            this.by = by % 3;
        else this.by = 0;
        
        if (typeof(dir) === "string") {
            switch (dir) {
                default:
                    this.dir = 0;
                    break;
                case "up": case "ascending":
                    this.dir = 1;
                    break;
            }
        } else if (typeof(dir) === "number")
            this.dir = dir % 2;
        else this.dir = 0;
    }

    sort(tasks) {
        const s = (a, b) => {
            if (this.dir === 0) return a - b;
            else return b - a;
        };

        switch(this.by) {
            default:
                return tasks.sort((a, b) => s(a.id, b.id));
            case 1:
                return tasks.sort((a, b) => s(a.state.a, b.state.a));
            case 2:
                return tasks.sort((a, b) => s(a.priority.a, b.priority.a));
        }
    }

    filter(tasks, val) {
        const s = (a, b) => {
            if (this.dir === 0) return a < b;
            else return a > b;
        };

        switch(this.by) {
            default:
                return tasks.filter(a => a.id === val);
            case 1:
                return tasks.filter(a => a.state.a === val.a)
            case 2:
                return tasks.sort(a => a.priority.a === val.a);
        }
    }
}

class TaskManager {
    constructor() {
        this.tasks = new Map();
    }

    addTask(task) { this.setTask(task); }
    setTask(task) { this.tasks.set(task.id, task); }
    removeTask(taskID) { this.tasks.delete(taskID); }
    getSortedTasks(sortFilter) {
        return sortFilter.sort(Array.from(this.tasks.values()));
    }
    getFilteredTasks(sortFilter, val) {
        return sortFilter.filter(Array.from(this.tasks.values()), val);
    }

    getTasks() {
        return Array.from(this.tasks.values());
    }
}

const taskManager = new TaskManager();

taskManager.addTask(new Task("bla", new Priority("normal"), new State(0)));
taskManager.addTask(new Task("blfe", new Priority(1), new State(1)));
taskManager.addTask(new Task("blink", new Priority(2), new State(2)));
taskManager.addTask(new Task("blubnk", new Priority(0), new State(0)));
taskManager.addTask(new Task("fsdfsdf", new Priority(1), new State(1)));
webLogTasks(taskManager.getSortedTasks(new SortFilter("state", 0)));

function webLogTasks(tasks) {
    for (const task of tasks) {
        webLog("--------------------");
        webLog(`Description: ${task.description}`);
        webLog(`Id: ${task.id}`);
        webLog(`Priority: ${task.priority.toString()}`);
        webLog(`State: ${task.state.toString()}`);
        webLog("--------------------");
    }
}

function webLog(data, opt = "") {
    const webLog = document.getElementById("webLog");

    webLog.innerHTML += formatHTML("p", data, opt);
}

function formatHTML(type, data, opt = "") {
    return `<${type} ${opt}>${data}<${type}>`
}