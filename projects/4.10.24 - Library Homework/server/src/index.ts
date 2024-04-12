import { createServer } from "http";
import { Library, Book } from "./data.js";
/*
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
});*/

let lib = new Library();

String.prototype["hashCode"] = function() {
    var hash = 0,
      i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

console.log(lib.getBooks());
lib.addBook({name: "Test", author: "author", publication: new Date(), description: "none", pngBlob: ""});
lib.addUser({firstname: "Pepa", surname: "Splaška", email: "splaska@email.cz", hashedPassword: ("splaska123" as any).hashCode()});
console.log(lib.getBooks());
lib.save();
lib.close();