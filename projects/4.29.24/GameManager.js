import "./Card.js";

let size = 4;
const LANGS = [
    "Android",
    "Angular",
    "Apple",
    "Bootstrap",
    "C",
    "C++",
    "ChatGPT",
    "C Sharp",
    "CSS",
    "Discord",
    "Git",
    "GitHub",
    "GoLang",
    "HTML",
    "iOS",
    "Java",
    "JavaScript",
    "jQuery",
    "Kotlin",
    "Lua",
    "MATLAB",
    "Microsoft",
    "NodeJS",
    "Perl",
    "PHP",
    "Python",
    "React",
    "R-Lang",
    "React",
    "Ruby",
    "Rust",
    "Scala",
    "Swift",
    "Tailwind CSS",
    "TypeScript",
    "ViteJS",
    "WebAssembly",
    "Windows 11"
];

Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const J = Math.floor(Math.random() * (i + 1));
        [this[i], this[J]] = [this[J], this[i]];
    }
    return this;
};
HTMLDivElement.prototype.getFirstChildOfType = function(childType) {
    for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].tagName.toLowerCase() === childType.toLowerCase())
            return this.children[i];
    }
    
    return null;
};
document.getElementById("size").getFirstChildOfType("input").addEventListener("input", changeSize);
document.getElementById("reset").addEventListener("click", newGame);

newGame();

export function newGame() {
    const PEXESO_ELEMENT = document.getElementById("pexeso");
    PEXESO_ELEMENT.classList = [`pex${size}`];
    PEXESO_ELEMENT.innerHTML = "";

    let pexesoList = [];
    let langs = [...LANGS];
    for (let i = 0; i < (size*size)/2; i++) {
        const LANG = langs.splice(Math.floor(Math.random() * langs.length), 1);
        let cardElement = document.createElement("div");
        cardElement.innerHTML = `<img src="imgs/${LANG}.svg" onerror="onImgError(this)">`;
        cardElement.classList.add("card");

        pexesoList.push(cardElement);
        pexesoList.push(cardElement.cloneNode(true));
    }
    pexesoList.shuffle();

    for (const CARD_EL of pexesoList) {
        PEXESO_ELEMENT.appendChild(CARD_EL);
    }
}

window.onImgError = function onImgError(img) {
    img.src = "imgs/404 Error.svg";
}

export function changeSize() {
    const SIZE_DIV = document.getElementById("size");
    const SIZE = parseInt(SIZE_DIV.getFirstChildOfType("input").value);
    const SIZE_TEXT = SIZE_DIV.getFirstChildOfType("p");
    SIZE_TEXT.innerText  = SIZE*2;
    size = SIZE*2;

    newGame();
}