app.ChatController = function ($scope) {	
	'use strict';
	
	var self = this;
	this.$scope = $scope;
	
	this.setupChat();
	
	self.$scope.hasNewMessage = function () {
		return !(self.$scope.newMessage === undefined || self.$scope.newMessage === '');
	};
};

app.ChatController.$inject =  ['$scope'];

app.ChatController.prototype.setupChat = function () {
	'use strict';	
	
	var self = this;	
	self.$scope.messages = [];
	

	self.$scope.socket = new io.connect('ws://localhost:7777');
	self.$scope.socket.on('connect', function () {
		self.$scope.socket.emit('join', 'Hello server from client');
	});
	
	self.$scope.socket.on('thread', function (data) {
		self.$scope.$apply(function () {
			self.addToChat(data);
		});
	});
	
	self.$scope.socket.on('username', function (data) {
		self.username = data;
	});
	
	self.$scope.submitChat = function () {
		self.sendMessage();
		self.resetMessagebox();
	};
};

app.ChatController.prototype.addToChat = function (data) {
	'use strict';
	
	this.$scope.messages.push(data);
};

app.ChatController.prototype.sendMessage = function () {
	'use strict';
	
	if (this.$scope.newMessage === undefined || this.$scope.newMessage === '') {
		throw Error('cannot send empty message');
	}
	
	var message = this.username + ': ' + this.$scope.newMessage;
	this.$scope.socket.emit('messages', message);
};

app.ChatController.prototype.resetMessagebox =  function () {
	'use strict';
	
	this.$scope.newMessage = '';
};
