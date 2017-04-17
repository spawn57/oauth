var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var userCount = 0;

app.get('/', function (req, res, next) {
	res.sendFile(__dirname + '/client/index.html')
});

app.use(express.static('client'));

io.on('connection', function (client) {
	console.log('Client connected...');
	
	userCount++;
	
	client.on('join', function (data) {
		var username = 'Guest' + userCount;
		console.log('assigning username : ' + username);
		client.emit('username', username);
		var joinMessage = username + ' has joined the chat';
		client.emit('thread', joinMessage);
		client.broadcast.emit('thread', joinMessage);
		console.log(joinMessage);
	});	
	
	client.on('messages', function (data) {
		console.log('received message: ' + data);
		client.emit('thread', data);
		client.broadcast.emit('thread', data);
	});
});


server.listen(7777);
