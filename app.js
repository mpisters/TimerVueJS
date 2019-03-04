var http = require("http");
var url = require('url');
var fs = require('fs');


var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    switch (path) {
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('<h1>You can find the timer here:  <a href="/timer.html">Timer</a></h1>');
            response.end();
            break;
        case '/timer.html':
            fs.readFile(__dirname + path, function (error, data) {
                if (error) {
                    response.writeHead(404);
                    response.write("oops this doesn't exist - 404");
                    response.end();
                } else {
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write("oops this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(8000);

var stop = false;
var timer = 0;
var io = require('socket.io').listen(server);

function startTimer() {
    setInterval(function () {
        var newTimer = stop ? timer : timer += 1;
        io.sockets.emit('stream', {'timer': newTimer});
    }, 1000);
}

let start = startTimer();
io.sockets.on('connection', function (socket) {
    socket.on('reset', () => {
        timer = 0;
        stop = true;
        io.sockets.emit('stream', {'timer': timer});
    });

    socket.on('start', () => {
        stop = false;
    });

    socket.on('stop', () => {
        stop = true;
        clearInterval(start)
    })
});
