const input = document.getElementById("input");
const output = document.getElementById("output");

let currentChars = {};

input.addEventListener("input", () => {
    showChars(calculateCharacters(input.value));
});

function calculateCharacters(text) {
    let chars = {};
    for (const char of text) {
        if (chars[char] === undefined) chars[char] = 0;
        chars[char]++; 
    }
    
    return chars;
}

function showChars(chars) {
    output.innerHTML = "";
    for (const char in chars) {
        output.innerHTML += `<p>"${char}": ${chars[char]}</p>`;
    }
}