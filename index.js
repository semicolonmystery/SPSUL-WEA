const urlParams = new URLSearchParams(window.location.search);
const projectsList = document.getElementById("projects");
var projectFolder = "projects";

if (urlParams.get("directory") != null) {
    projectFolder = removeWrongSlash(urlParams.get("directory"))
    changeStatus("./" + projectFolder);
}
setAllContent("verustus", "SPSUL-WEA", projectFolder);


async function setAllContent(user, repo, pathToDirectory) {
    const pathArray = pathToDirectory.replace("\\", "/").split("/");
    const parentUrl = `https://api.github.com/repos/${user}/${repo}/git/trees/master`;
    var list = await fetch(parentUrl).then(response => response.json());
    for (let i = 0; i < pathArray.length; i++) {
        const dir = list.tree.find(directory => directory.path === pathArray[i]);
        if (dir) {
            list = await fetch(dir.url).then(response => response.json());
            list.tree.forEach(async directory => {
                if (i == pathArray.length-1) {
                    console.log(directory);
                    if (directory.type == "tree") {
                        var directoryList = await fetch(directory.url).then(response => response.json());
                        if (directoryList.tree.find(file => file.path === "index.html"))
                            addToProjectsList(pathToDirectory + "/" + directory.path, directory.path);
                        else addToProjectsList("./?directory=" + pathToDirectory + "/" + directory.path, directory.path);
                    } else addToProjectsList(pathToDirectory + "/" + directory.path, directory.path);
                    /* if (directory.path.split(" - ").length > 1) {
                        addToProjectsList(pathToDirectory + "/" + directory.path.substring(directory.path.split(" - ")[0].length + 3), directory.path);
                    } else addToProjectsList(pathToDirectory + "/" + directory.path, directory.path); */
                }
           });
        } else {
            console.log("There isn't any folder with path: " + pathToDirectory);
            changeStatus("There isn't any folder with path: " + pathToDirectory);
            return;
        }
    }
}

function addToProjectsList(folderName, name) {
    var element = document.createElement("li");
    element.innerHTML = "<a href=\"" + folderName + "\"><p>" + name + "</p></a>";
    projectsList.appendChild(element);
}

function changeStatus(str) {
    var status = document.getElementById("status");
    if (str == "") status.style.display = "none";
    else {
        status.innerText = str;
        status.style.display = "block";
    }
}

function removeWrongSlash(str) { return str.replace(/^[/\\]+/, '').replace(/[/\\]+$/, ''); }