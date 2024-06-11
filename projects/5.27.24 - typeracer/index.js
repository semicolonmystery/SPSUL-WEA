const { v4: uuidv4 } = require("uuid");
const express = require("express");
const path = require("path");
const { clearInterval } = require("timers");
const WebSocket = require("ws");

const app = express();
const port = 80;
const maxPlayers = 5;
const minPlayers = 3;
const countdownLong = 15000;
const countdownShort = 5000;

let waitingGames = {};
let runningGames = {};

class Player {
    constructor (color, ws) {
        this.uuid = uuidv4();
        this.secret = uuidv4();
        this.color = color;
        this.text = "";
        this.ws = ws;
        this.win = false;
    }
    setText(text, correctText) {
        this.text = text;
        if (this.text === correctText) {
            this.win = true;
            return { win: true, same: false };
        }
        if (text === correctText) return { win: false, same: true };
        return { win: false, same: false };
    }
    getState(text) {
        let correct = 0;
        let wrong = false;
        let wrongIndex = this.text.length;
        for (const index in text) {
            if (this.text[index] === undefined) break;
            else if (this.text[index] !== text[index]) {
                correct--;
                if (!wrong) wrongIndex = Number(index);
                wrong = true;
            } else if (!wrong) correct++;
        }
        if (correct < 0) correct = 0;
        return { percentage: correct / text.length, wrongIndex: wrongIndex };
    }
}

class Game {
    constructor () {
        this.players = {};
        this.text = getRandomText();
        this.colors = getRandomCarColors();
        this.uuid = uuidv4();
        waitingGames[this.uuid] = this;
        this.lastPlayerCount = 0;
        this.running = false;
        this.countdownTime = countdownLong;
        this.stopping = false;
    }
    newPlayer(ws) {
        if (Object.keys(this.players).length == maxPlayers) return null;
        let p = new Player(this.colors.pop(), ws);
        this.players[p.uuid] = p;
        this.onLeaveJoin();
        return p;
    }
    removePlayer(playerUuid) {
        if (this.players[playerUuid] === undefined) return;
        this.colors.push(this.players[playerUuid].color);
        delete this.players[playerUuid];
        if (Object.keys(this.players).length > 0) this.onLeaveJoin();
        else this.stop();
    }
    onLeaveJoin() {
        if (!this.running) {
            const length = Object.keys(this.players).length;
            if (length < minPlayers) this.cancelCountdown();
            else if (length != this.lastPlayerCount) {
                if (length < maxPlayers) this.startCountdown(countdownLong);
                else this.startCountdown(countdownShort);
                this.lastPlayerCount = length;
            }
        }
        this.broadcastMsg(this.toJsonString());
    }
    startCountdown(time) {
        if (this.countdownTime < time) return;
        if (this.countdown !== undefined && this.countdownTime !== time)
            clearInterval(this.countdown);
        this.countdownTime = time;
        this.countdown = setInterval(() => {
            this.countdownTime -= 100;
            if (this.countdownTime <= 0) {
                runningGames[this.uuid] = this;
                delete waitingGames[this.uuid];
                this.running = true;
                this.cancelCountdown();
                this.broadcastMsg(this.toJsonString());
                return;
            }
            this.broadcastMsg(JSON.stringify({
                type: "game-countdown",
                time: this.countdownTime
            }));
        }, 100);
    }
    cancelCountdown() {
        if (this.countdown === undefined) return;
        clearInterval(this.countdown);
    }
    stop() {
        if (this.stopping) return;
        this.stopping = true;
        setTimeout(() => {
            for (const uuid in this.players) {
                this.players[uuid].ws.close();
                delete this.players[uuid];
            }
            this.broadcastMsg(this.toJsonString());
            this.cancelCountdown();
            delete runningGames[this.uuid];
            delete waitingGames[this.uuid];
        }, 500);
    }
    setPlayerText(playerUuid, playerSecret, text) {
        if (!this.running) return;
        const player = this.players[playerUuid];
        if (player === undefined || player.secret != playerSecret) return;
        let textState = player.setText(text, this.text);
        if (textState.same) return;
        this.broadcastMsg(this.toJsonString());
        if (textState.win) this.stop();
    }
    broadcastMsg(msg) {
        for (const pUuid in this.players) {
            const player = this.players[pUuid];
            if (player.ws) player.ws.send(msg);
        }
    }
    toJsonString() {
        let players = {};
        for (const pUuid in this.players) {
            let p = this.players[pUuid];
            players[pUuid] = {
                id: p.uuid,
                color: p.color,
                state: p.getState(this.text),
                win: p.win
            };
        }
        return JSON.stringify({
            type: "game-update",
            id: this.uuid,
            running: this.running,
            countdown: this.countdownTime,
            players: players
        });
    }
}

app.use(express.static(path.join(__dirname, "client")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", req.path), (err) => {
        if (err) res.status(404).send("File not found");
    });
});

const server = app.listen(port, () => {
    console.log(`TypeRacer app running on: http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    let playerUuid;
    let game;
    ws.on("message", (message) => {
        const msg = JSON.parse(message);
        if (msg.type === "new-game") {
            newG = newGame(ws);
            game = newG.game;
            const p = newG.player;
            playerUuid = p.uuid;
            ws.send(JSON.stringify({ type: "new-game", gameId: game.uuid, text: game.text, playerId: playerUuid, playerSecret: p.secret, playerColor: p.color }));
        } else if (msg.type === "update-text") {
            if (game) game.setPlayerText(msg.playerId, msg.playerSecret, msg.text);
        } else if (msg.type === "get-game") {
            game = getGame(msg.gameId);
            if (game) ws.send(game.toJsonString());
        }
    });

    ws.on("close", () => {
        if (game && playerUuid) game.removePlayer(playerUuid);
    });
});

function newGame(ws) {
    for (let uuid in waitingGames) {
        const game = waitingGames[uuid];
        let p = game.newPlayer(ws);
        if (p != null) return { game: game, player: p };
    }
    let newGame = new Game();
    let p = newGame.newPlayer(ws);
    return { game: newGame, player: p };
}

function getGame(uuid) {
    let game = runningGames[uuid];
    if (!game) game = waitingGames[uuid];
    return game;
}

function getRandomCarColors() {
    let carColors = [
        "beige",
        "blue",
        "brown",
        "dark-blue",
        "green",
        "light-green",
        "orange",
        "pink",
        "red",
        "white",
        "yellow"
    ];
    let selectedColors = [];

    for (let i = 0; i < 5; i++) {
        let randomIndex = Math.floor(Math.random() * carColors.length);
        selectedColors.push(carColors[randomIndex]);
        carColors.splice(randomIndex, 1);
    }

    return selectedColors;
}

function getRandomText() {
    return "The quick brown fox jumps over the lazy dog. Test";
}