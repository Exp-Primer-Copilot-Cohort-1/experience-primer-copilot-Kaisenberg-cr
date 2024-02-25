//create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var comments = require('./comments.json');
var qs = require('querystring');

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    if (uri == '/comments.json') {
        if (request.method === 'POST') {
            var body = '';
            request.on('data', function(data) {
                body += data;
            });
            request.on('end', function() {
                var POST = qs.parse(body);
                comments.push(POST);
                fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            });
        }
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify(comments));
    } else {
        fs.exists(filename, function(exists) {
            if (!exists) {
                response.writeHead(404, {
                    "Content-Type": "text/plain"
                });
                response.write("404 Not Found\n");
                response.end();
                return;
            }
            if (fs.statSync(filename).isDirectory()) filename += '/index.html';
            fs.readFile(filename, "binary", function(err, file) {
                if (err) {
                    response.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    response.write(err + "\n");
                    response.end();
                    return;
                }
                response.writeHead(200);
                response.write(file, "binary");
                response.end();
            });
        });
    }
}).listen(8080);
console.log('Server running at http://localhost:8080/');