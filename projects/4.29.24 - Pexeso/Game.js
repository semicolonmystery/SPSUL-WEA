const CARDS = [
    "404 Error",
    "Android",
    "Angular",
    "Apple",
    "Bash",
    "Bootstrap",
    "C",
    "C++",
    "ChatGPT",
    "C#",
    "CSS",
    "Discord",
    "Facebook",
    "Git",
    "GitHub",
    "Godot",
    "GoLang",
    "Google",
    "HTML",
    "Instagram",
    "Java",
    "JavaScript",
    "jQuery",
    "Kotlin",
    "Lua",
    "MATLAB",
    "Microsoft",
    "Minecraft",
    "NodeJS",
    "Perl",
    "PHP",
    "PlayStation",
    "Python",
    "R-Lang",
    "React",
    "Ruby",
    "Rust",
    "Scala",
    "Snapchat",
    "SQL",
    "Swift",
    "Tailwind CSS",
    "TypeScript",
    "Unity",
    "Unreal Engine",
    "ViteJS",
    "VS Code",
    "WebAssembly",
    "WhatsApp",
    "Windows",
    "Xbox",
];

Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const J = Math.floor(Math.random() * (i + 1));
        [this[i], this[J]] = [this[J], this[i]];
    }
    return this;
};
HTMLDivElement.prototype.getFirstChildByType = function(childType) {
    for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].tagName.toLowerCase() === childType.toLowerCase())
            return this.children[i];
    }
    
    return null;
};
HTMLDivElement.prototype.getFirstChildByClass = function(childClass) {
    for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].classList.contains(childClass))
            return this.children[i];
    }
    
    return null;
};

class Card {
    constructor(id, documentElement, matchedImg, name) {
        this.id = id;
        this.documentElement = documentElement;
        this.matchedImg = matchedImg;
        this.name = name;
    }

    reveal() { this.documentElement.getFirstChildByType("div").classList.add("revealed"); }
    unreveal() { this.documentElement.getFirstChildByType("div").classList.remove("revealed"); }
    match() {
        this.unreveal();
        this.documentElement.getFirstChildByType("div").classList.add("matched");
        setTimeout(() => {
            this.documentElement.getFirstChildByType("div").getFirstChildByClass("card-front").src = this.matchedImg;
        }, 500);
    }
}

document.getElementById("size").getFirstChildByType("input").addEventListener("input", changeSize);
document.getElementById("reset").addEventListener("click", newGame);
addEventListener("resize", resizePexeso);
addEventListener("load", resizePexeso);

function resizePexeso() {
    const pexesoBoard = document.getElementById("pexeso");

    if (window.innerWidth > window.innerHeight) {
        pexesoBoard.style.width = "55vh";
        pexesoBoard.style.height = "55vh";
        switch (size) {
            case 4:
                pexesoBoard.style.fontSize = "1.8vh";
                break;
            case 6:
                pexesoBoard.style.fontSize = "1.35vh";
                break;
            case 8:
                pexesoBoard.style.fontSize = "1vh";
                break;
            case 10:
                pexesoBoard.style.fontSize = "0.7vh";
                break;
        }
    } else if (window.innerWidth+50 > window.innerHeight) {
        pexesoBoard.style.width = "65vw";
        pexesoBoard.style.height = "65vw";
        switch (size) {
            case 4:
                pexesoBoard.style.fontSize = "1.8vh";
                break;
            case 6:
                pexesoBoard.style.fontSize = "1.35vh";
                break;
            case 8:
                pexesoBoard.style.fontSize = "1vh";
                break;
            case 10:
                pexesoBoard.style.fontSize = "0.7vh";
                break;
        }
    } else {
        pexesoBoard.style.width = "80vw";
        pexesoBoard.style.height = "80vw";
        switch (size) {
            case 4:
                pexesoBoard.style.fontSize = "1.8vw";
                break;
            case 6:
                pexesoBoard.style.fontSize = "1.35vw";
                break;
            case 8:
                pexesoBoard.style.fontSize = "1vw";
                break;
            case 10:
                pexesoBoard.style.fontSize = "0.7vw";
                break;
        }
    }
}

let size = 4;
let cards = [];
let firstOpenCard = null;
let waiting = false;
newGame();

function newGame() {
    const pexesoBoard = document.getElementById("pexeso");
    cards = [];
    pexesoBoard.classList = [`pex${size}`];
    pexesoBoard.innerHTML = "";

    let pexesoCardElements = [];
    let cardsNames = [...CARDS];
    for (let i = 0; i < (size*size)/2; i++) {
        const cardName = cardsNames.splice(Math.floor(Math.random() * cardsNames.length), 1);
        
        const cardElementA = document.createElement("div");
        cardElementA.innerHTML = `
            <div class="card-inner" onclick="onCardClick(${i*2})">
                <img src="imgs/NotRevealed.svg" class="card-front">
                <div class="card-back">
                    <img src="imgs/${encodeURIComponent(cardName)}.svg">
                    <h4>${cardName}</h4>
                </div>
            </div>
        `;
        cardElementA.classList.add("card");
        
        pexesoCardElements.push(cardElementA);
        
        const cardElementB = document.createElement("div");
        cardElementB.innerHTML = `
            <div class="card-inner" onclick="onCardClick(${i*2+1})">
                <img src="imgs/NotRevealed.svg" class="card-front">
                <div class="card-back">
                    <img src="imgs/${encodeURIComponent(cardName)}.svg">
                    <h4>${cardName}</h4>
                </div>
            </div>
        `;
        cardElementB.classList.add("card");

        pexesoCardElements.push(cardElementB);

        cards[i] = [new Card(i*2, cardElementA, "imgs/Matched.svg", cardName), new Card(i*2+1, cardElementB, "imgs/Matched.svg", cardName), false];
    }
    pexesoCardElements.shuffle();

    for (const cardElement of pexesoCardElements) {
        pexesoBoard.appendChild(cardElement);
    }
}

function changeSize() {
    const sizeDiv = document.getElementById("size");
    const sizeValue = parseInt(sizeDiv.getFirstChildByType("input").value);
    const sizeText = sizeDiv.getFirstChildByType("p");
    sizeText.innerText  = sizeValue*2;
    size = sizeValue*2;

    newGame();
}

function onCardClick(cardId) {
    const toPairId = (id) => {
        if (id%2 == 0) return id/2;
        else return (id-1)/2;
    };

    if (waiting || cards[toPairId(cardId)][2]) return;

    if (firstOpenCard == null) {
        firstOpenCard = cards[toPairId(cardId)][cardId%2];
        firstOpenCard.reveal();
    } else {
        const secOpenCard = cards[toPairId(cardId)][cardId%2];
        if (firstOpenCard.id == secOpenCard.id) return;

        secOpenCard.reveal();
        waiting = true;
        setTimeout(() => {
            if (firstOpenCard.name == secOpenCard.name) {
                firstOpenCard.match();
                secOpenCard.match();
                firstOpenCard = null;
                waiting = false;
                cards[toPairId(cardId)][2] = true;
                
                setTimeout(checkDone, 1500);
            } else {
                firstOpenCard.unreveal();
                secOpenCard.unreveal();
                firstOpenCard = null;
                waiting = false;
            }
        }, 1000);
    }
}

function checkDone() {
    for (const data of cards)
        if (!data[2]) return;
    
    for (let i = 0; i < cards.length; i++) {
        const cardA = cards[i][0];
        const cardB = cards[i][1];

        setTimeout(() => {
            cardA.reveal();
        }, i*500);
        setTimeout(() => {
            cardB.reveal();
        }, (i+1)*500);
    }
}