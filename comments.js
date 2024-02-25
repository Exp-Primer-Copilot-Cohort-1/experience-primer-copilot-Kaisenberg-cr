create web server
// Path: server.js
var http = require('http');
var comments = require('./comments');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(comments.text);
}).listen(8080);
console.log('Server running at http://)