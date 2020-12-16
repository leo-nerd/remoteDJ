// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const app = express();

var webServer = http.createServer(app);
var io = socket(webServer);
var port = process.env.PORT || 8080;

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
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

// FOR MIDI APP
io.on("connection", socket => {
  console.log(socket.id + " connected");
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
  });

  socket.on("ctrlfromclient", msg => {
    console.log(msg);
    socket.broadcast.emit("ctrlfromserver", msg);
    // io.emit("msgfromserver", msg);
  });
});

// listen for requests :)
webServer.listen(port, () => {
  console.log("Your app is listening on port " + webServer.address().port);
});