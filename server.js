var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8000);

console.log('Server running at http://0.0.0.0:8000/');


var lactate = require('lactate');
var server = lactate.createServer({root:'html'});

server.listen(80, function() {
  console.log('Listening on port 80');
});


var io = require('socket.io').listen(8080);
