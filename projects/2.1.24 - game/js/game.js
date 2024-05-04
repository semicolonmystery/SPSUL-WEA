import { GameObject } from "./GameObject.js";
import { runRepeatedTask } from "./utils.js";

Array.prototype.remove = function(element) {
    const index = indexOf(element);
    splice(index, 1);
}

export var exit = false;

var canvas = document.getElementById("canvas");
var health = document.getElementById("health");

export var gameObjects = [];
export var repeatedTasks = [];

const gameTickID = setInterval(gameTick, 1000/20);
const renderTickID = setInterval(renderTick, 0);

var lastUpdate = Date.now();

function renderTick() {
    var now = Date.now();
    var deltaTime = now - lastUpdate;
    lastUpdate = now;

    gameObjects.forEach((gameObject) => {
        gameObject.tick(deltaTime);
    });
    if (exit) clearInterval(renderTickID);
}

function gameTick() {
    repeatedTasks.forEach((repeatedTask) => {
        repeatedTask.tick();
    });
    gameObjects.forEach((gameObject) => {
        gameObject.fixedTick();
    });
    if (exit) clearInterval(gameTickID);
}