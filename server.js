
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
  }
});


/*************
MongoDB Setup
*************/
//mongodb://nodejitsu_nko3-codice-nocturnus:dil63rtig7l3j79f1b9s5hn0eh@ds039257.mongolab.com:39257/nodejitsu_nko3-codice-nocturnus_nodejitsudb2284569002
var databaseUrl = "nodejitsu_nko3-codice-nocturnus:dil63rtig7l3j79f1b9s5hn0eh@ds039257.mongolab.com:39257/nodejitsu_nko3-codice-nocturnus_nodejitsudb2284569002";
var collections = ["test", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);

db.test.save({email: "speed85@gmail.com", password: "hello", sex: "male"}, function(err, saved) {
	if( err || !saved ) console.log("Entry not saved");
	else console.log("Entry saved");
});

db.test.find({}, function(err, data) {
	if( err || !data) console.log("No data found");
	else {
		console.log(data);
	}
});



/*************
Socket.IO Setup
*************/

var io = require('socket.io').listen(8000);
console.log('Socket.io listening on port 8000');
console.log(io);

