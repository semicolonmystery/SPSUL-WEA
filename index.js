const fullName = true;
const user = "verustus";
const repo = "SPSUL-WEA";
const defaultDirectory = "projects";

const urlParams = new URLSearchParams(window.location.search);
var currentDirectory = defaultDirectory;

if (urlParams.get("directory") != null && urlParams.get("directory") != currentDirectory) {
    currentDirectory = removeWrongSlash(urlParams.get("directory"));
    changeStatus("./" + currentDirectory);
}
setAllContent(user, repo, currentDirectory);

async function setAllContent(user, repo, pathToDirectory) {
    const pathArray = pathToDirectory.replace("\\", "/").split("/");
    const parentUrl = `https://api.github.com/repos/${user}/${repo}/git/trees/master`;

    const fileList = [{ index: 1, url: "./", displayname: "./" }];

    async function fetchDirectoryData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data.tree;
    }

    function isBetween(i, from, to) { return i >= from && i <= to; }

    let currentList = await fetchDirectoryData(parentUrl);

    for (let i = 0; i < pathArray.length; i++) {
        const file = currentList.find(directory => directory.path === pathArray[i]);
        if (file) {
            if (i < pathArray.length-1) parent += "/" + file.path; 
            currentList = await fetchDirectoryData(file.url);
            if (i == pathArray.length-1) {
                await Promise.all(currentList.map(async directory => {
                    var url = pathToDirectory + "/" + directory.path;
                    var displayname = fullName ? directory.path : (directory.path.split(" - ").length >= 2 ? directory.path.substring(directory.path.split(" - ")[0].length + 3) : directory.path);
                    var strDate = directory.path.split(".");
                    strDate.slice(0, 3);
                    if (strDate.length == 3) {
                        strDate.forEach((item, index) => strDate[index] = item.replace(/[^\d.]/g, ''));
                        strDate.filter(item => !isNaN(parseInt(item)));
                        strDate.forEach((item, index) => strDate[index] = parseInt(item));
                    }
                    else strDate.forEach((item, index) => strDate[index] = undefined);
                    var date = (isBetween(strDate[0], 1, 12) && isBetween(strDate[1], 1, 31) && isBetween(strDate[2], 0, 100)) ? new Date(strDate[2]+2000, strDate[0]-1, strDate[1]) : undefined
                    if (directory.type === "tree") {
                        var directoryList = await fetchDirectoryData(directory.url);
                        if (!directoryList.find(file => file.path === "index.html"))
                            url = "?directory=" + pathToDirectory + "/" + directory.path;
                    }
                    fileList.push({date: date, url: url, displayname: displayname});
                }));
            }
        } else changeStatus("There isn't any folder with path: " + pathToDirectory);
    }
    if (pathArray.length > 1) fileList.push({ index: 1, url: "./?directory=" + pathArray.slice(0, -1).join("/"), displayname: ".." });
    else fileList.push({ index: 1, url: "./", displayname: ".." });

    fileList.sort((a, b) => {
        if (a.index && b.index) return a.index - b.index;
        if (a.index) return -1;
        if (b.index) return 1;
        if (a.date && b.date) return  b.date - a.date;
        if (a.date) return 1;
        if (b.date) return -1;
        return 0;
    });

    fileList.forEach((data) => addFileToList(data.url, data.displayname));
}

function addFileToList(url, name) {
    const projectList = document.getElementById("projects");
    const element = document.createElement("li");
    element.innerHTML = "<a href=\"" + url + "\"><p>" + name + "</p></a>";
    projectList.appendChild(element);
}

function changeStatus(str) {
    var status = document.getElementById("status");
    if (!str) status.style.display = "none";
    else {
        status.innerText = str;
        status.style.display = "block";
    }
}

function removeWrongSlash(str) { return str.replace(/^[/\\]+/, '').replace(/[/\\]+$/, ''); }