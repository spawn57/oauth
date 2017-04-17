describe('client side tests', function () {
	'use strict';
	
	var socket;
	var $scope;
	var ChatController;	
	
	beforeEach(function () {
		
		inject(function ($rootScope) {
			// Note the use of the $new() function
			$scope = $rootScope.$new();
		});
		
		socket = {};
		socket.on = jasmine.createSpy('on');
		socket.emit = jasmine.createSpy('emit');
		
		spyOn(io, 'connect').and.returnValue(socket);
		
		ChatController = new app.ChatController($scope);
	});
	
	it('controller should load properly', function () {
		expect(ChatController).toBeDefined();
	});
	
	it('empty message should hide button', function () {
		// $scope.newMessage is undefined
		expect($scope.hasNewMessage()).toBe(false);
		
		$scope.newMessage = '';		
		expect($scope.hasNewMessage()).toBe(false);
	});
	
	it('should not send an empty message', function () {		
		$scope.newMessage = '';
		
		var setup = function () {
			ChatController.sendMessage();
		};
		
		expect(setup).toThrow(Error('cannot send empty message'));		
	});
	
	it('should not send a null or undefined message', function () {						
		var setup = function () {
			ChatController.sendMessage();
		};
		
		expect(setup).toThrow(Error('cannot send empty message'));		
	});
});
