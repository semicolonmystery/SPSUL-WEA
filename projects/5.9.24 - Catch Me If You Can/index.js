var lastUpdate = Date.now();
const mainLoop = setInterval(tick, 0);
const spawnLoop = setInterval(spawnTick, 1000);
var currentSpawns;
var currentSpawnSecond = 0;

var prisoners = {};
var refugees = 0;
var score = 0;
var wave = 0;
const waves = [
    { getSpeed: () => { return Math.random()/2+0.5 }, getSpawnRate: () => 2 , getSize: () => "40px" },
    { getSpeed: () => { return Math.random()  +1   }, getSpawnRate: () => 5 , getSize: () => "55px" },
    { getSpeed: () => { return Math.random()*2+1   }, getSpawnRate: () => 10, getSize: () => "70px" },
    { getSpeed: () => { return Math.random()*2+1   }, getSpawnRate: () => 12, getSize: () => "75px" },
    { getSpeed: () => { return Math.random()*2+1   }, getSpawnRate: () => 14, getSize: () => "75px" },
    { getSpeed: () => { return Math.random()*2+1   }, getSpawnRate: () => 15, getSize: () => "75px" },
    { getSpeed: () => { return Math.random()*2+1   }, getSpawnRate: () => 17, getSize: () => "75px" },
    { getSpeed: () => { return Math.random()*2+2   }, getSpawnRate: () => 20, getSize: () => "75px" },
];

function tick() {
    var now = Date.now();
    var deltaTimeMillis = now - lastUpdate;
    lastUpdate = now;

    updatePrisoners(deltaTimeMillis);
    updateStats();
}
function spawnTick() {
    if (currentSpawns === undefined) {
        currentSpawns = {};
        var seconds = Array.from(Array(10).keys());
        for (var i = 0; i < waves[wave].getSpawnRate(); i++) {
            const pos = seconds.splice(Math.floor(Math.random() * seconds.length), 1);
            if (currentSpawns[pos] === undefined) currentSpawns[pos] = 0;
            currentSpawns[pos]++;
        }
    }
    
    if (Object.keys(currentSpawns).includes(`${currentSpawnSecond}`)) {
        for (var i = 0; i < currentSpawns[currentSpawnSecond]; i++) {
            spawn();
        }
    };

    if (currentSpawnSecond == 9) {
        currentSpawnSecond = 0;
        currentSpawns = undefined;
    } else currentSpawnSecond++;
}

function spawn() {
    if (wave == 7) return;
    const prisoner = document.createElement("div");
    const id = getNewId();
    
    prisoner.innerHTML = "<img src=\"prisoner.svg\">"
    prisoner.classList.add("prisoner");
    prisoner.classList.add("unselectable");
    prisoner.style.width = waves[wave].getSize();
    prisoner.style.height = waves[wave].getSize();
    prisoners[id] = {element: prisoner, dir: randomDirection(), speed: waves[wave].getSpeed(), offset: {x: 0, y: 0}};
    const prisonerClick = function() {
        respawn(id);
        score++;
        if (score%10 == 0) wave++;
        if (wave == 7) victory();
    };
    prisoner.addEventListener("dragstart", (event) => {
        prisonerClick();
        event.preventDefault();
        return;
    });
    prisoner.addEventListener("click", prisonerClick);

    document.getElementById("prisoners").appendChild(prisoner);
}

function victory() {
    clearInterval(spawnLoop);

    for (const id in prisoners) kill(id);

    document.getElementById("jail").style.display = "none";
    const victoryDiv = document.getElementById("victory");
    setTimeout(() => {
        victoryDiv.style.display = "block";
    }, 500);
    const escapedEl = document.createElement("p");
    const catchedEl = document.createElement("p");
    setTimeout(() => {
        escapedEl.innerText = `${refugees} prisoners have escaped.`;
        victoryDiv.appendChild(escapedEl);
    }, 1500);
    setTimeout(() => {
        catchedEl.innerText = `You catched ${score} prisoners from escaping.`;
        victoryDiv.appendChild(catchedEl);
    }, 2500);
}
function respawn(id) {
    kill(id);
    spawn();
}
function kill(id) {
    prisoners[id].element.remove();
    prisoners[id] === undefined;
}

function updatePrisoners(deltaTimeMillis) {
    for (const id in prisoners) {
        const element = prisoners[id].element;
        const dir = prisoners[id].dir;
        const speed = prisoners[id].speed;
        const offset = prisoners[id].offset;

        offset.x += dir.x*speed*deltaTimeMillis/10;
        offset.y += dir.y*speed*deltaTimeMillis/10;

        element.style.marginLeft = `${offset.x}px`;
        element.style.marginTop = `${offset.y}px`;

        prisoners[id].offset = offset;
        
        const pos = getElementPosition(element);

        if (pos.x < -20 || pos.y < -20 || pos.x > window.innerWidth+20 || pos.y > window.innerHeight+20) {
            kill(id);
            refugees++;
        }
    }
}

function updateStats() {
    const refugeesElement = document.getElementById("refugees");
    const scoreElement = document.getElementById("score");
    const waveElement = document.getElementById("wave");

    refugeesElement.innerText = `Refugees: ${refugees}`;
    scoreElement.innerText = `Score: ${score}`;
    waveElement.innerText = `Wave: ${wave}`;
}

function randomDirection() {
    var dir = {x: Math.random()*2-1, y: Math.random()*2-1};

    var length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    if (length !== 0) {
        return { x: dir.x / length, y: dir.y / length };
    } else { 
        return { x: dir.x, y: dir.y };
    }
}
function getElementPosition(element) {
    var rect = element.getBoundingClientRect();
    return {
        x: rect.left,
         y: rect.top
    };
}
function getNewId() {
    for (var i = 0; i < Object.keys(prisoners).length+1; i++) {
        if (prisoners[i] === undefined) return i;
    }
}