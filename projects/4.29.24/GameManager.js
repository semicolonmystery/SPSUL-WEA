import "./Card.js";

const LANGS = [
    "Angular",
    "C",
    "CSharp",
    "C++",
    "GoLang",
    "HTML",
    "Java",
    "JavaScript",
    "jQuery",
    "Kotlin",
    "Lua",
    "PHP",
    "Python",
    "RLang",
    "Ruby",
    "Rust",
    "Scala",
    "Swift",
    "TypeScript"
]

Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
}

prepareGame();

export function prepareGame() {
    const PEXESO_ELEMENT = document.getElementsByClassName("pexeso")[0];
    let pexesoList = [];
    let langs = [...LANGS];
    for (let i = 0; i < 8; i++) {
        const LANG = langs.splice(Math.floor(Math.random() * langs.length), 1);
        let cardElement = `<div class="card"><img src="imgs/${LANG}.svg"></div>`;

        pexesoList.push(cardElement);
        pexesoList.push(cardElement);
    }
    pexesoList.shuffle();

    for (const CARD_EL of pexesoList) {
        PEXESO_ELEMENT.innerHTML += CARD_EL;
    }
}