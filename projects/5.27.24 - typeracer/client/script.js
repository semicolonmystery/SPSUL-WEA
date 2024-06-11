String.prototype.insert = function(index, string) {
    if (index > 0) return this.substring(0, index) + string + this.substring(index, this.length);
    return string + this;
};

const textToTypeEl = document.getElementById("textToType");
const inputField = document.getElementById("inputField");
const result = document.getElementById("result");
const track = document.getElementById("track");
const serverURL = `ws://${document.location.host}`;
let gameRunning = false;
let gameId;
let playerId;
let playerSecret;
let playerColor;
let players = {};
let waitingData = [];

let textToType = "";
let typedText = "";
let newText = "";

let state = 0;

let ws;
newGame();

function newGame() {
    inputField.value = "";
    disableInput();
    document.getElementById("winScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    typedText = "";
    updateText(0);

    if (ws !== undefined) ws.close();
    ws = new WebSocket(serverURL);
    ws.onopen = sendNewGameRequest;
    ws.onclose = () => {
        disableInput();
        gameRunning = false;
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "new-game") {
            textToType = data.text;
            textToTypeEl.innerText = textToType;
            gameId = data.gameId;
            playerId = data.playerId;
            playerSecret = data.playerSecret;
            playerColor = data.playerColor;
            addCar(playerColor, playerId);
            enableInput();
            while (waitingData.length !== 0) receiveData(waitingData.pop());
        } else receiveData(data);
    };
}

function receiveData(data) {
    if (gameId === undefined) {
        waitingData.push(data);
        return;
    }
    if (data.type === "game-update") {
        for (const pId in players) {
            if (data.players[pId] !== undefined) continue;
            removeCar(pId);
        }
        let end = false;
        let selfWin = false;
        for (const pId in data.players) {
            const player = data.players[pId];
            if (players[pId] === undefined) addCar(player.color, pId);
            updateCarPosition(player.state.percentage, pId);
            if (pId === playerId) updateText(player.state.wrongIndex);
            if (player.win) {
                end = true;
                if (pId === playerId) selfWin = true;
            }
        }
        if (end) {
            if (selfWin) win();
            else lose();
            gameRunning = false;
        }
        gameRunning = data.running;
        if (gameRunning) enableInput();
        else disableInput();
    }
}

function sendNewGameRequest() {
    if (!gameRunning) ws.send(JSON.stringify({ type: "new-game" }));
}
function sendTextUpdate() {
    if (gameRunning) ws.send(JSON.stringify({
        type: "update-text",
        gameId: gameId,
        playerId: playerId,
        playerSecret: playerSecret,
        text: typedText
    }));
}

function updateText(wrongIndex) {
    const correct = "<span class=\"correct\">";
    const wrong = "<span class=\"wrong\">";
    const end = "</span>";
    let str = textToType;

    str = str.insert(0, correct);
    str = str.insert(wrongIndex+correct.length, end);
    str = str.insert(wrongIndex+correct.length+end.length, wrong);
    str = str.insert(typedText.length+correct.length+end.length+wrong.length, end);
    
    textToTypeEl.innerHTML = str;
}

function addCar(color, id) {
    const carEl = document.createElement("img");
    carEl.classList.add("car");
    carEl.id = `car-${id}`;
    carEl.src = `img/${color}.svg`;
    track.appendChild(carEl);
    players[id] = carEl;
    updatePlayerCount();
}
function removeCar(id) {
    const carEl = players[id];
    delete players[id];
    carEl.remove();
    updatePlayerCount();
}
function updatePlayerCount() {
    const playerCountEl = document.getElementById("playerCount");
    playerCountEl.value = Object.keys(players).length;
}

inputField.addEventListener("input", (e) => {
    if (!gameRunning) {
        disableInput();
        e.preventDefault();
        return;
    }
    typedText = inputField.value;
    sendTextUpdate();
});
function disableInput() { inputField.disabled = true; }
function enableInput() { inputField.disabled = false; }

function updateCarPosition(percentage, id) {
    const trackWidth = track.offsetWidth-players[id].offsetWidth;
    const position = Math.min(percentage * trackWidth, trackWidth);
    players[id].style.marginLeft = `${position}px`;
}

function win() {
    disableInput();
    document.getElementById("winScreen").style.display = "flex";
    gameId = undefined;
}
function lose() {
    disableInput();
    document.getElementById("gameOverScreen").style.display = "flex";
    gameId = undefined;
}