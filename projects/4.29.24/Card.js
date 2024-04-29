export class Card {
    constructor(documentElement, image, name) {
        this.documentElement = documentElement;
        this.image = image;
        this.name = name;
    }

    reveal() { this.documentElement.classList.add("revealed"); }
    unreveal() { this.documentElement.classList.remove("revealed"); }
    match() { this.documentElement.classList.add("matched"); }
}