var express = require('express');
var http = require('http');
var socket = require('socket.io');

// app.get('/', (req, res) => {
// 	// res.send('Hey');
// 	res.sendFile(__dirname + '/index.html');
// });

var app = express();
var webServer = http.createServer(app);
var io = socket(webServer);
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));

// FOR CHAT APP
// io.on('connection', (socket) => {
// 	console.log(socket.id + " connected");
// 	socket.on('disconnect', () => {
// 		console.log(socket.id + " disconnected");
// 	});
	
// 	socket.on('msgfromclient', (msg) => {
// 		socket.broadcast.emit('msgfromserver', msg);
// 		// io.emit("msgfromserver", msg);
// 	});
// });

io.on('connection', (socket) => {
	console.log(socket.id + " connected");
	socket.on('disconnect', () => {
		console.log(socket.id + " disconnected");
	});
	
	socket.on('ctrlfromclient', (msg) => {
		// console.log(msg);
		socket.broadcast.emit('ctrlfromserver', msg);
		// io.emit("msgfromserver", msg);
	});
});

webServer.listen(port, () => {
	console.log(`server is running on port ${webServer.address().port}`);
});