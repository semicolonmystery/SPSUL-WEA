"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var hostname = '127.0.0.1';
var port = 3000;
var server = http.createServer(function (req, res) {
    if (req.errored)
        return;
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
server.listen(port, hostname, function () {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});
