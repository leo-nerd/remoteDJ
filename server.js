var express = require('express');
var http = require('http');
var socket = require('socket.io');
var path = require('path');

// app.get('/', (req, res) => {
// 	// res.send('Hey');
// 	res.sendFile(__dirname + '/index.html');
// });

var app = express();
var webServer = http.createServer(app);
var io = socket(webServer);
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));

io.on('connection', (socket) => {
	console.log(socket.id + " connected");
	socket.on('disconnect', () => {
		console.log(socket.id + " disconnected");
	});
	
	socket.on('msgfromclient', (msg) => {
		// console.log("From: " + msg.from + ";\nMessage: " + msg.payload);
		socket.broadcast.emit('msgfromserver', msg);
		// io.emit("msgfromserver", msg);
	});
});

webServer.listen(port, () => {
	console.log(`server is running on port ${webServer.address().port}`);
});