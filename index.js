projectsList = document.getElementById("projects");

setAllContent("verustus", "SPSUL-WEA", "projects");

async function setAllContent(user, repo, parentDirectory) {
    const url = `https://api.github.com/repos/${user}/${repo}/git/trees/master`;
    const list = await fetch(url).then(response => response.json());
    const dir = list.tree.find(directory => directory.path === parentDirectory);
    if (dir) {
       const list = await fetch(dir.url).then(response => response.json());
       list.tree.forEach(directory => {
        if (directory.path.split(" - ").length > 1) {
            console.log("špek");
            addToProjectsList(projectsList, directory.path, directory.path.substring(directory.path.split(" - ")[0].length + 3));
        } else addToProjectsList(projectsList, directory.path, directory.path);
       });
    }
}

function addToProjectsList(parent, folderName, name) {
    var element = document.createElement("li");
    element.innerHTML = "<a href=\"projects/" + folderName + "\"><p>" + name + "</p></a>";
    projectsList.appendChild(element);
}