
var lactate = require('lactate');
var server = lactate.createServer({root:'html'});

server.listen(80, function() {
  console.log('Listening on port 80');
});

var files = lactate.dir('html');
server.addListener('request', function(req, res) {
  if (req.url === '/') {
    files.serve('index.html', req, res);
  }
});


//var io = require('socket.io').listen(8080);
