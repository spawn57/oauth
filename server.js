var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var GoogleAuth = require('google-auth-library');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var session = require('express-session');

app.use(session({secret:'aksfjzxkv82asjhfd2as124dw82'}));

// used for google's authentication
var CLIENT_ID = '860177011019-ti6sgag4jgcf3hmcr54trmmqkdofoee8.apps.googleusercontent.com';
var auth = new GoogleAuth();
var client = new auth.OAuth2(CLIENT_ID, '', '');

// used to generated guest names
var userCount = 0;


app.use(bodyParser.urlencoded({
    extended: true
})); 

app.get('/', function (req, res) {
	'use strict';	
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/main.html', function (req, res) {
	'use strict';
	
	if (req.session.user === undefined) {
		console.log('unauthorized access');
		res.status(403).send('You need to sign in <a href="http://localhost:7777">here</a>');
		return;
	}
	
	// authenticate the token again if it's there.
	try {
		var token = req.session.user.token;
		client.verifyIdToken(token, CLIENT_ID, function() {
			console.log('token verified');
			// authenticated, send them to the page
			res.sendFile(__dirname + '/client/main.html');
			return;
		});
	}
	catch (e) {
		// delete the user in the session because it's not valid anymore and fail
		console.log('failed to verify token:' + e);
		delete req.session.user;
		res.status(403).send('You need to sign in again <a href="http://localhost:7777">here</a>');
	}
}); 

app.post('/token', function (req, res) {
	'use strict';
	
	var token = req.body.idtoken;
	try {
		client.verifyIdToken(token, CLIENT_ID, function(e, login) {
			console.log('token verified');
			var payload = login.getPayload();
			var user = {};
			user.token = token;
			user.userid = payload.sub;
			user.name = payload.name;
			user.email = payload.email;
			req.session.user = user;
			res.status(201).send(user.name);
		});
	}
	catch (e) {
		console.log('failed to verify token: ' + e);
		res.status(403).send('Failed to verify token, You need to sign in again <a href="http://localhost:7777">here</a>');
	}
});

app.post('/signout', function (req, res) {
	'use strict';
	
	console.log('logged out user and destroyed session');
	req.session.destroy();
	res.send('session destroyed OK');
});

app.use(express.static('client'));

io.on('connection', function (client) {
	'use strict';
	
	console.log('Client connected...');
	
	userCount++;
	
	client.on('join', function () {
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
