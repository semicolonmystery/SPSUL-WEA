const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const servePage = (folderName, res) => {
    const indexHtml = path.join(__dirname, "web", "index.html");
    const headFile = path.join(__dirname, "web", folderName, "head.html");
    const contentFile = path.join(__dirname, "web", folderName, "content.html");

    try {
        let index = fs.readFileSync(indexHtml, "utf8");

        let head = "";
        let content = "No content here yet!";
        try {
            head = fs.readFileSync(headFile, "utf8");
            content = fs.readFileSync(contentFile, "utf8");
        } catch (error) {}

        index = index.replace("%head%", head).replace("%content%", content);

        let status = 200;
        if (folderName === "404") status = 404;
        res.status(status).send(index);
    } catch (error) {
        return res.status(500).send("Error reading index.html!");
    }
};

try {
    const webFolder = fs.readdirSync(path.join(__dirname, "web"), { withFileTypes: true });
    
    webFolder.forEach(folder => {
        if (folder.isDirectory()) {
            app.get(`/${folder.name}`, (req, res) => servePage(folder.name, res));
            app.get(`/${folder.name}/index.html`, (req, res) => res.redirect(`/${folder.name}`));
            app.get(`/${folder.name}/content.html`, (req, res) => res.redirect("/404"));
            app.get(`/${folder.name}/head.html`, (req, res) => res.redirect("/404"));
        }
    });
} catch (error) {
    console.error("Error reading web directory:", error);
    return;
}

app.get("/", (req, res) => res.redirect("/home"));
app.get("/index.html", (req, res) => res.redirect("/home"));

app.use(express.static(path.join(__dirname, "web")));
app.use((req, res) => res.redirect("/404"));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));