const isOverflown = ({ clientHeight, scrollHeight, clientWidth, scrollWidth }) => { return scrollHeight > clientHeight || scrollWidth > clientWidth; };
function getFontSize(parent, text) {
    let i = 1;
    let overflow = false;
    const maxSize = 128;
    while (!overflow && i < maxSize) {
        text.style.fontSize = `${i}px`;
        overflow = isOverflown(parent);
        if (!overflow) i += 0.5;
    }
    return i;
}
const aboutmeTextHolder = document.getElementsByClassName("aboutmeTextHolder")[0];
const aboutmeText = document.getElementById("aboutmeText");
const minAboutMeTextHolderHeight = 300;
const maxAboutMeTextHolderHeight = 600;
const projects = document.getElementsByClassName("project");
const projectTexts = document.getElementsByClassName("projectText");
const projectNames = document.getElementsByClassName("projectName");
function adjustSizes() {
    let smallest = 128;
    Array.from(projects).forEach((item, index) => {
        var i = getFontSize(item, projectTexts[index])
        if (i < smallest) smallest = i;
    });
    const heightDifference = window.innerWidth - window.innerHeight;
    const aboutTextHolderHeight = Math.max(minAboutMeTextHolderHeight, Math.min(maxAboutMeTextHolderHeight, maxAboutMeTextHolderHeight - heightDifference));
    aboutmeTextHolder.style.height = `${aboutTextHolderHeight}px`;
    Array.from(projects).forEach((item, index) => {
        projectTexts[index].style.fontSize = `${smallest-2}px`;
        projectNames[index].style.fontSize = `${smallest+2}px`;
    });
    aboutmeText.style.fontSize = `${getFontSize(aboutmeTextHolder, aboutmeText)-0.5}px`;
}
window.addEventListener('load', adjustSizes);
window.addEventListener('resize', adjustSizes);