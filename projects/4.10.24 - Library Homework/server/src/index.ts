import { createServer } from "http";
import { Library } from "./data.js";
import { hashPassword } from "./utils.js";

const hostname = '127.0.0.1';
const port = 3000;
const server = createServer((req, res) => {
    if (req.errored) return;
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    switch (req.url) {
        case "/login":
            res.end("Test");
            break;
        default:
            res.end("404 Not Found");
            break;
    }
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

let lib = new Library();

console.log(lib.getBooks());
lib.addBook({name: "Test", author: "author", publication: new Date(), description: "none", pngBlob: ""});
hashPassword("splaska123").then(function(result) {
    lib.addUser({username: "Pepiksplasik", firstname: "Pepa", surname: "Splaška", email: "splaska@email.cz", hashedPassword: result});
    console.log(lib.getBooks());
    console.log(lib.getUsers());
});

/*lib.db.db.all("SELECT rowid AS id, name FROM books", (err, rows) => {
    console.log(rows);
});*/

lib.save();
lib.close();