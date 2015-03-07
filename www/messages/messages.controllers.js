angular.module('SmashApp.Messages.controllers', [])

  .controller('MessagesCtrl', ['$scope', 'Socket', '$rootScope', function($scope, Socket, $rootScope) {
    $scope.greeting = 'hey';
    $scope.messages = [];
    $scope.typing = false;

    //////////////////////////////////////////////
    //Socket receive events within chat scope.	//
    //////////////////////////////////////////////

    //On message received, apply the new message to the current scope's messages array.
    Socket.on('SocketEvent:messageReceived', function(message) {
    	if (message.senderID === $scope.senderID) {
    		$scope.messages.push(message);
    	} else {
    		$rootScope.notifications++;
    	}
    });

    //On sender typing, eventually will display the typing animation
    //@param: typing - This object will contain the typing information. In the use case of multiple users, it will 
    //provide info on which user is doing the typing.
    Socket.on('SocketEvent:senderTyping', function(typing) {
    	$scope.typing = typing;
    	$scope.typing.state == true;    	
    });



    $scope.sendNewMessage = function(message) {
    	Socket.emit('Event:SendMessage', message);
    };

    $scope.deleteSelectedMessage = function(messageID) {
    	Socket.emit('SocketEmit:DeleteMessage', messageID);
    };

  }]);