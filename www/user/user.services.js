angular.module('SmashApp.User.services',[])

	.factory('UserServ', ['$http', 'SMASH_SERVER_API_URL', function($http, SMASH_SERVER_API_URL){

		/*
		Note: The server treats guestBook posts as articles
		TODO: refactor article(server-side) to say guestBookPost or something similar
		*/
		return {
			update: function(userObject) {
				console.log('UserServ.update()', userObject);
				return $http.put('api/users', userObject, {
					headers: {
						'Content-Type' : 'application/json'
					}
				});
			},
			me: function(loginToken){
				console.log('UserServ.me()', {loginToken: loginToken});
				return $http.post('api/users/me', {loginToken: loginToken}, {
					headers: {
						'Content-Type' : 'application/json'
					}
				});
			},
			localList: function(listParams) {
				console.log('UserServe.localList()', listParams);
				return $http.post('api/users/local', listParams, {
					headers: {
						'Content-Type' : 'application/json'
					}
				});
			}
		};
	}]);