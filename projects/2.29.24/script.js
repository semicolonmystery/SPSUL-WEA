var players = [];
var winners = [];
var losers = [];

setup();

function setup() {
    var pNameElements = document.getElementsByClassName("p-name");
    var randNames = getRandomNames(pNameElements.length);

    for (let i = 0; i < randNames.length; i++) {
        pNameElements[i].innerHTML = randNames[i];
        players.push(pNameElements[i].parentElement);
    }
}

function battle() {
    if (Math.random() < 0.5) {
        winners.push(players[0]);
        losers.push(players[1]);
    } else {
        winners.push(players[1]);
        losers.push(players[0]);
    }
}

function getRandomNames(nameNum) {
    const NAMES = [
        "Adamec Ondřej",
        "Beutler Filip",
        "Brož Matěj",
        "Do Tony",
        "Hladík Vojtěch",
        "Klaška Josef",
        "Kodeš Ondřej",
        "Koritko Jan",
        "Kratochvíl Jakub",
        "Levchenko Radomyr",
        "Očenáš František Filip",
        "Pecha Jakub",
        "Poddaný Lukáš",
        "Podolský Jiří",
        "Porubský Max",
        "Prokeš Tomáš",
        "Sanejstr Filip",
        "Schod Filip",
        "Štros Svatoplus",
        "Tůma Kryštof",
        "Vašíček Martin",
        "Verner Michal"
    ];

    var randNames = [];

    for (var i = 0; i < nameNum; i++) {
        if (NAMES.length != 0) {
            randNames.push(NAMES.splice(Math.round(Math.random()*(NAMES.length-1)), 1));
        } else {
            NAMES = randNames;
        }
    }

    return randNames;
}