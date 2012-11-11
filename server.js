
/***************
Lactate Setup
***************/

var lactate = require('lactate');
var server = lactate.createServer({root:'html'});
var formidable = require('formidable');

server.listen(80, function() {
  console.log('Lactate listening on port 80');
});
var files = lactate.dir('html');
server.addListener('request', function(req, res) {
  if (req.url === '/') {
	files.serve('index.html', req, res);
  } else if (req.url.indexOf('/socket.io') === 0) {
	files.toMiddleware();
  } else if (req.url == '/upload') {
	// parse a file upload
	console.log('file upload');
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
	  res.writeHead(200, {'content-type': 'text/plain'});
	  res.write('received upload:\n\n');
	  res.end();
	});
	
	files.toMiddleware();
	return;
  }
});
