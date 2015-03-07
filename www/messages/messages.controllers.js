angular.module('SmashApp.Messages.controllers', [])

  .controller('MessagesCtrl', ['$scope', 'Socket', '$rootScope', '$log', function($scope, Socket, $rootScope, $log) {
    //Pre-build.
    $scope.greeting = 'hey';
    $scope.messages = [];
    $scope.typing = false;
    $scope.error.doesExist = false;

    //////////////////////////////////////////////
    //Socket receive events within chat scope.	//
    //////////////////////////////////////////////

    //SocketEvent represents all emit's from the server.
    //SocketFunction represents all emit functions from the Client.

    //Receive errors from the socket.
    Socket.on('SocketEvent:errorMessage', function(message) {
    	$log.log(message);
    	$scope.error.messages.push(message);
    	//Display the errors array if none existed previously.
    	if ($scope.error.doesExist == false) {
    		$scpe.error.doesExist = true;
    	}
    });

    //Dismiss the error uniquely.
    $scope.dismissError = function(message) {
    	$scope.error.messages.splice(1, message);
    	//Stop displaying the errors array if everything is dismissed.
    	if ($scope.error.messages.length === 0) {
    		$scope.error.doesExist = false;
    	}
    };

    //On sender typing, eventually will display the typing animation
    //@param: typing - This object will contain the typing information. In the use case of multiple users, it will 
    //provide info on which user is doing the typing.
    Socket.on('SocketEvent:senderTyping', function(typing) {
    	$scope.typing = typing;
    	$scope.typing.state = true;    	
    });

    //On user stop typing, remove the typing ... animation.
    Socket.on('SocketEvent:senderStoppedTyping', function(typing) {
    	$scope.typing = typing;
    	$scope.typing.state = false;
    })

    //On message received, apply the new message to the current scope's messages array.
    Socket.on('SocketEvent:messageReceived', function(message) {
    	if (message.senderID === $scope.senderID) {
    		$scope.messages.push(message);
    	} else {
    		$rootScope.notifications++;
    	}
    });


    //Send a message within the sockets.
    $scope.sendNewMessage = function(message) {
    	Socket.emit('SocketFunction:sendMessage', message);
    };

    //On messages send success.
    Socket.on('SocketEvent:SendMessageSuccess', function(msg) {
    	$log.log('Message' + message + 'received');
    };

    //Delete a msg.
    $scope.deleteSelectedMessage = function(messageID) {
    	Socket.emit('SocketFunction:DeleteMessage', messageID);
    };

    //On msg delete success.
    Socket.on('SocketEvent:DeleteMessageSuccess', function(msg) {
    	$log.log('Message' + msg + 'deleted successfully');
    	$scope.messages.splice(1, msg);
    });

    //Edit a message.
    $scope.editMessage = function(message) {
    	Socket.emit('SocketFunction:editMessage', message);
    };

    //Edit message success. 
    Socket.on('SocketEvent:editMessageSuccess', function(msg) {
    	$log.log(msg);
    });

    //Calls a put on the server side.
    $scope.addUserToConversation = function(conversation) {
    	Socket.emit('SocketFunction:addUserToConversation', conversation)
    };

    //On user add success
    Socket.on('SocketEvent:addUserSuccess', function(user) {
    	$log.log('user' + user.name + 'added to conversation.');
    });

    //If current user is admin of conversation, they can remove a user from it.
    $scope.removeUserIfAdmin = function(user) {
    	Socket.emit('SocketFunction:removeUserIfAdmin', user);
    };

    Socket.on('SocketEvent:userRemoved', function(user) {
    	$log.log('user' + user.name + 'removed.');
    })



  }]);