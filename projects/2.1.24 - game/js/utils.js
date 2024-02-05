import { repeatedTasks } from "./game.js";

export class RepeatedTask {
    constructor(func, ticks) {
        this.func = func;
        this.ticks = ticks;
        this.last = 0;
        repeatedTasks.push(this);
    }

    tick() {
        if (this.last === this.ticks) {
            this.func();
            this.last = 0;
        }
        this.last++;
    }

    cancel() { repeatedTasks.remove(this); }
}
  