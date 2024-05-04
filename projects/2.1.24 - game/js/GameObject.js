import { gameObjects } from "./game.js";

export class GameObject {
    constructor(position, rotation) {
        this.position = position;
        this.rotation = rotation;
        this.modules = [];
        gameObjects.push(this);
    }

    addModule(module) { this.modules.push(module); }
    removeModule(module) { this.modules.push(module); }

    tick(deltaTime) {
        this.modules.forEach((module) => {
            module.tick();
        });
    }

    fixedTick() {
        this.modules.forEach((module) => {
            module.fixedTick();
        });
    };
    
    destroy() { gameObjects.remove(this); }
}