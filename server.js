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
var auth = new GoogleAuth;
var client = new auth.OAuth2(CLIENT_ID, '', '');

// used to generated guest names
var userCount = 0;


app.use(bodyParser.urlencoded({
    extended: true
})); 

app.get('/', function (req, res, next) {
	res.sendFile(__dirname + '/client/index.html')
});

app.get('/main.html', function (req, res, next) {	
	if (req.session.user === undefined) {
		res.status(403).send('You need to sign in <a href="http://localhost:7777">here</a>');
		return;
	}
	
	// authenticate the token again if it's there.
	try {
		var token = req.session.user.token;
		client.verifyIdToken(token, CLIENT_ID, function(e, login) {			
			var payload = login.getPayload();
			// authenticated, send them to the page
			res.sendFile(__dirname + '/client/main.html');
			return
		});
	}
	catch (e) {
		// delete the user in the session because it's not valid anymore and fail
		delete req.session.user;
		res.status(403).send('You need to sign in again <a href="http://localhost:7777">here</a>');
	};
}); 

app.post('/token', function (req, res, next) {
	var token = req.body.idtoken;
	console.log(token);	
	client.verifyIdToken(token, CLIENT_ID, function(e, login) {
		var payload = login.getPayload();
		var user = {};
		user.token = token;
		user.userid = payload['sub'];
		user.name = payload['name'];
		user.email = payload['email'];
		req.session.user = user;
		res.status(201).send(user.name);
	});
});

app.post('/signout', function (req, res, next) {
	req.session.destroy();
	res.send('session destroyed OK');
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

