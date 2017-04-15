var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function (req, res, next) {
	res.sendFile(__dirname + '/client/index.html')
});

app.use(express.static('client'));

server.listen(7777);
