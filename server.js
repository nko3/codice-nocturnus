
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
/*
db.test.save({email: "fdsaf@gmail.com", password: "rewq", sex: "male"}, function(err, saved) {
	if( err || !saved ) console.log("Entry not saved");
	else console.log("Entry saved");
	console.log(saved);
});

db.test.find({}, function(err, data) {
	if( err || !data) console.log("No data found");
	else {
		console.log(data);
	}
});



db.reports.find({}, function(err, data) {
	if( err || !data) console.log("No data found");
	else {
		console.log(data);
	}
});

db.reports.group(
	{
		key: {'type':true},
		cond: {},
		initial: {},
		reduce: function() {},
		finalize: function() {}
	}, 
	function(err, data) {
		if( err || !data) console.log("No data found");
		else {
			console.log(data);
		}
	});
*/
/*************
Socket.IO Setup
*************/

var io = require('socket.io').listen(8000, {'log level': 0});
console.log('Socket.io listening on port 8000');

io.sockets.on('connection', function (socket) {
	
	socket.on('create-report', function (data) {
		//console.log(data);
		createReport(socket, data);
	});
	
	
	

});

/****
Make Report fuctionality
****/

function createReport(socket, data) {
	db.reports.save(data, (
	function(socket) {
		return function(err, saved) {
			if( err || !saved ) {
				console.log("Entry not saved");
				returnErr(socket, err);
			} else {
				console.log("Entry saved");
				console.log(saved);
				returnId(socket, saved);
			}
		}
	}
	)(socket));
	
}

function returnId(socket, data) {
	socket.emit('save-success', data._id);
}

function returnErr(socket, err) {
	socket.emit('save-error', err);
}




/****
View reports fuctionality
****/







function fetchHighZoomData(socket) {
	db.reports.find({}, (
	function(socket) {
		return function(err, data) {
			if( err || !data ) {
				console.log("Query error");
			} else {
				console.log("Query success");
				returnHZD(socket, data);
			}
		}
	}
	)(socket));
	
}


function returnHZD(socket, data) {
	console.log(data);
	var i = data.length;
	var c;
	var formatted = [];
	for(;i--;) {
		c = data[i];
			
	}
	
}

fetchHighZoomData({});
