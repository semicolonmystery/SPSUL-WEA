const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const servePage = (folderName, res) => {
    const headFile = path.join(__dirname, "web", folderName, "head.html");
    const contentFile = path.join(__dirname, "web", folderName, "content.html");

    const indexHtml = path.join(__dirname, "web", "index.html");

    fs.readFile(indexHtml, "utf8", (err, data) => {
        if (err) return res.status(500).send("Error reading index.html");

        let pageContent = data;
        
        fs.readFile(headFile, "utf8", (err, headData) => {
            if (err) headData = "";
            pageContent = pageContent.replace("%head%", headData);

            fs.readFile(contentFile, "utf8", (err, contentData) => {
                if (err) contentData = "Content not found.";
                pageContent = pageContent.replace("%content%", contentData);
                res.send(pageContent);
            });
        });
    });
};

fs.readdir(path.join(__dirname, "web"), { withFileTypes: true }, (err, folders) => {
    if (err) {
        console.error("Error reading web directory:", err);
        return;
    }

    folders.forEach(folder => {
        if (folder.isDirectory()) {
            app.get(`/${folder.name}`, (req, res) => {
                servePage(folder.name, res);
            });

            app.get(`/${folder.name}/content.html`, (req, res) => {
                servePage(folder.name, res);
            });

            app.get(`/${folder.name}/head.html`, (req, res) => {
                servePage(folder.name, res);
            });
        }
    });
});

app.get("/", (req, res) => res.redirect("/home"));
app.get("/index.html", (req, res) => res.redirect("/home"));

app.use(express.static(path.join(__dirname, "web")));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));