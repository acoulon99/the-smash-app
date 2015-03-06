angular.module('SmashApp.User.services',[]).value('SMASH_SERVER_API_URL','http://smashserver.cloudapp.net:3000')

	.factory('UserServ', ['$http', 'SMASH_SERVER_API_URL', function($http, SMASH_SERVER_API_URL){

		/*
		Note: The server treats guestBook posts as articles
		TODO: refactor article(server-side) to say guestBookPost or something similar
		*/
		return {
			update: function(userObject) {
				console.log('UserServ.update()', userObject);
				return $http.put(SMASH_SERVER_API_URL + '/users', userObject, {
					headers: {
						'Content-Type' : 'application/json'
					}
				});
			},
			me: function(loginToken){
				console.log('UserServ.me()', {loginToken: loginToken});
				return $http.post(SMASH_SERVER_API_URL + '/users/me', {loginToken: loginToken}, {
					headers: {
						'Content-Type' : 'application/json'
					}
				});
			}
		};
	}]);