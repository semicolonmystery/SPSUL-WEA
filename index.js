let withDate = true;
const user = "semicolonmystery";
const repo = "SPSUL-WEA";
const branch = "master"
const defaultDirectory = "projects";

const url = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`;
const urlParams = new URLSearchParams(window.location.search);
let currentDirectory = defaultDirectory;

start();

async function start() {
    if (urlParams.get("showDate") != null) withDate = urlParams.get("showDate") == "true";
    updateDate(withDate, false);
    update();
}

function updateDate(to, refresh = true) {
    if (to != undefined) withDate = to;
    else withDate = !withDate;
    setParam("showDate", withDate);

    const showDateButton = document.getElementById("showDate");
    if (withDate) showDateButton.innerText = "Hide date";
    else showDateButton.innerText = "Show date";

    if (refresh) update(currentDirectory);
}

async function update(url) {
    if (url) setParam("directory", url);
    if (urlParams.get("directory") != null && urlParams.get("directory") != currentDirectory) {
        currentDirectory = removeWrongSlash(urlParams.get("directory"));
        
        if (currentDirectory != defaultDirectory) changeStatus("./" + currentDirectory);
        else changeStatus("");
    }
    clearList();

    let data;
    if (!data) data = await loadData();
    if (data) setAllContent(data, currentDirectory);
}

async function loadData() {
    function onError(error) {
        changeStatus(`There was an error trying to fetch data from github: ${error}`);
        addFileToList("", "Reload page");
        throw new Error(`There was an error trying to fetch data from github: ${error}`);
    }
    try {
        const response = await fetch(url);
        if (response.status !== 200) onError(response.statusText);
        return response.json();
    } catch (error) { onError(error.message); }
}

function setParam(param, value) {
    urlParams.set(param, value);
    let params = "";
    urlParams.forEach((val, key) => {
        if (key == param) val = value;
        params += `${key}=${val}&`;
    });
    window.history.replaceState(null, null, `${window.location.pathname}?${urlParams}`);
}

async function setAllContent(data, pathToDirectory) {
    const parentList = JSON.parse(JSON.stringify(data));
    function isBetween(i, from, to) { return i >= from && i <= to; }
    function getDateFromName(name) {
        let strDate = name.split(".");
        strDate.slice(0, 3);
        if (strDate.length == 3) {
            strDate.forEach((item, index) => strDate[index] = item.replace(/[^\d.]/g, ''));
            strDate = strDate.filter(item => !isNaN(parseInt(item)));
            strDate.forEach((item, index) => strDate[index] = parseInt(item));
        }
        else strDate.forEach((item, index) => strDate[index] = undefined);
        return (isBetween(strDate[0], 1, 12) && isBetween(strDate[1], 1, 31) &&
                isBetween(strDate[2], 0, 100)) ?
                new Date(strDate[2]+2000, strDate[0]-1, strDate[1]) : undefined;
    }
    const fileList = [{ index: 1, url: defaultDirectory, displayname: "./"}];
    parentList.tree = parentList.tree.filter(file => file.path.startsWith(pathToDirectory));
    parentList.tree.forEach((file, index) => parentList.tree[index].path = removeWrongSlash(file.path.substring(pathToDirectory.length)));
    
    if (parentList.tree.find(file => file.path === "") || currentDirectory === "") {
        const directoryFiles = parentList.tree.filter(file =>
            (file.type == "tree" && file.path.split("/").length == 1 && file.path != "") ||
            (file.type == "blob" && (file.path.split("/").length == 1 || file.path.split("/")[1] == "index.html")));
        directoryFiles.forEach(file => {
            if (file.path.split("/").length == 1) {
                let redirect = true;
                let url = pathToDirectory + "/" + file.path;
                let displayname = withDate ? file.path : (file.path.split(" - ").length >= 2 ? file.path.substring(file.path.split(" - ")[0].length + 3) : file.path);
                let date = getDateFromName(file.path);
                if (file.type === "tree") {
                    if (!directoryFiles.find(isIndex => isIndex.path == file.path + "/index.html")) {
                        url = `${pathToDirectory}/${file.path}`;
                        redirect = false;
                    }
                }
                fileList.push({date: date, url: url, displayname: displayname, redirect: redirect});
            }
        });
    } else changeStatus(`There isn't any folder with path: ${pathToDirectory}`);

    const pathArray = pathToDirectory.replace("\\", "/").split("/");
    if (pathArray.length > 1) fileList.push({ index: 1, url: pathArray.slice(0, -1).join("/"), displayname: "..", redirect: false });
    else fileList.push({ index: 1, url: "", displayname: ".." });

    fileList.sort((a, b) => {
        if (a.index && b.index) return a.index - b.index;
        if (a.index) return -1;
        if (b.index) return 1;
        if (a.date && b.date) return  b.date - a.date;
        if (a.date) return 1;
        if (b.date) return -1;
        return 0;
    });

    fileList.forEach((data) => {
        const onclick = data.redirect ? undefined : (data.url == "" ? defaultDirectory : data.url);
        addFileToList(data.redirect ? data.url : `?directory=${data.url}`, data.displayname, onclick);
    });
}

function addFileToList(url, name, onclick) {
    const listItem = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.innerHTML = `<p>${name}</p>`;
    if (onclick) {
        anchor.addEventListener("click", function(event) {
            event.preventDefault();
            update(onclick);
        });
    }
    listItem.appendChild(anchor);
    document.getElementById("files").appendChild(listItem);
}

function clearList() { document.getElementById("files").innerHTML = ""; }

function changeStatus(str) {
    let status = document.getElementById("status");
    if (!str) status.style.display = "none";
    else {
        status.innerText = str;
        status.style.display = "block";
    }
}

function removeWrongSlash(str) { return str.replace(/^[/\\]+/, '').replace(/[/\\]+$/, ''); }
