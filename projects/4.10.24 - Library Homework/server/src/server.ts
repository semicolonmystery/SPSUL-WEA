import { createServer } from "http";
import "data.ts";

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