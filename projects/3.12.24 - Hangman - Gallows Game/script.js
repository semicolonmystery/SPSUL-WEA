let previousWords = [];
let currentWord;
let dashedWord;
let errors;
let deaths;
let difficulty = 1;
let lock = true;
let fill = true;

const dashesEl = document.getElementById("dashes");
const lettersEl = document.getElementById("letters");
const statusEl = document.getElementById("status");
const guessingEl = document.getElementById("guessing");

loadPage();

function loadPage() {
    deaths = getCookie("deaths");
    if (deaths == null) {
        setCookie("deaths", 0+"");
        deaths = 0;
    }
    updateDeaths();
    
    newGame();
}

function updateDeaths() {
    document.getElementById("deaths").innerText = deaths;
}

function newGame() {
    setDeathStage(0);
    getWord();
    dashedWord = [];
    errors = 0;
    
    statusEl.style.opacity = 0;

    dashesEl.innerHTML = "";
    lettersEl.innerHTML = "";
    
    for (let i = 0; i < currentWord.length; i++) {
        let dashEl = document.createElement("li");
        dashEl.innerHTML = "_";
        dashesEl.appendChild(dashEl);

        let letterEl = document.createElement("li");
        letterEl.innerHTML = "&nbsp";
        lettersEl.appendChild(letterEl);
        dashedWord.push("&nbsp");
    }

    if (fill) {
        let discover = Math.ceil(currentWord.length/(3*difficulty));
        discoverRandom(currentWord <= 3 ? 0 : currentWord < 6 ? 1 : discover);
    }
    write(" ");

    lock = false;
}

function discoverRandom(num) {
    let word = currentWord.replace(" ", "");
    const countChar = (str, char) => {
        return str.split(char).length-1;
    };

    let done = 0;
    while (done < num) {
        const char = word[Math.round(Math.random() * (word.length-1))];
        done += countChar(word, char);
        word.replace(char, "");
        write(char);
    }
}

function write(letter) {
    let word = [];

    lettersEl.innerHTML = "";

    let includes = false;
    let done = true;
    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i].toLowerCase() == letter.toLowerCase()) {
            dashedWord[i] = currentWord[i];
            includes = true;
        }
        if (currentWord[i] != dashedWord[i]) {
            done = false;
        }
        let letterEl = document.createElement("li");
        letterEl.innerHTML = dashedWord[i].replace(" ", "&nbsp");
        lettersEl.appendChild(letterEl);
    }

    return {"includes": includes, "done": done};
}

function getWord() {
    let words = [...WORDS];
    if (previousWords.length == words.length)
        previousWords = [];

    for (const word of previousWords)
        words.splice(words.indexOf(word), 1);

    currentWord = words[Math.round(Math.random() * (words.length-1))];
    previousWords.push(currentWord);
}

function updateWord(letter) {
    let writeResult = write(letter);
    if (writeResult.includes) {
        if (writeResult.done) win();
    } else {
        guessingEl.animate(
            [
                { transform: "rotate(5deg)" },
                { transform: "rotate(0deg)" },
                { transform: "rotate(-5deg)" },
                { transform: "rotate(0deg)" }
            ],
            {
                duration: 250,
                iterations: 2
            }
        );
        errors += (difficulty-1)/2+1;
        if (errors >= 15) lose();
        setDeathStage(Math.round(errors) > 15 ? 15 : Math.round(errors));
    }
}

function win() {
    statusEl.innerHTML = "You won!!!";
    statusEl.style.opacity = 1;
    lock = true;
}

function lose() {
    for (letter of currentWord) write(letter);
    statusEl.innerHTML = "You lost!!!";
    statusEl.style.opacity = 1;
    lock = true;

    setCookie("deaths", ++deaths);
    updateDeaths();
}

function setDeathStage(num) {
    const img = document.getElementById("stage");

    if (num == 0) img.style.opacity = "0";
    else {
        img.src = "img/" + num + ".png";
        img.style.opacity = "1";
    }
}

function updateDifficulty() {
    const difficultyButton = document.getElementById("difficulty");

    if (++difficulty == 4) difficulty = 1;
    difficultyButton.innerText = difficulty;
}
function updateFill() {
    const fillButton = document.getElementById("fill");
    fill = !fill;

    if (fill) fillButton.innerText = "on";
    else fillButton.innerText = "off";
}

document.addEventListener('keydown', function(event) {
    if (!lock) {
        const alphabet = "aábcčdďeéěfghiíjklmnňoópqrřsštťuúůvwxyýzž-*/+:";
        if (alphabet.includes(event.key.toLowerCase()) && event.key.length == 1)
            updateWord(event.key);
    } else if (event.key.toLowerCase() == "enter") newGame();
});
