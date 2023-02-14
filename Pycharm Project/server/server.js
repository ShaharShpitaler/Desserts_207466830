let http = require('http');
let fs= require('fs');

http.createServer(function(req, res) {
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(req.url);
    res.end();
}).listen(3000);