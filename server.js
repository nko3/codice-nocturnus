
var lactate = require('lactate');
var server = lactate.createServer({root:'html'});

server.listen(80, function() {
  console.log('Listening on port 80');
});


var io = require('socket.io').listen(8080);
