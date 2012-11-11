
/***************
Lactate Setup
***************/

var lactate = require('lactate');
var server = lactate.createServer({root:'html'});


server.listen(80, function() {
  console.log('Lactate listening on port 80');
});
var files = lactate.dir('html');
server.addListener('request', function(req, res) {
  if (req.url === '/') {
	files.serve('index.html', req, res);
  } else if (req.url.indexOf('/socket.io') === 0) {
	files.toMiddleware();
  }
});
