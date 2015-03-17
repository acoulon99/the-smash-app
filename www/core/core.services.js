angular.module('SmashApp.Core.services',[])

	.factory('RegAuthServ', ['$http', function($http){

		/*
		Note: The server treats guestBook posts as articles
		TODO: refactor article(server-side) to say guestBookPost or something similar
		*/
		return {
			register: function(userObject) {
				console.log('RegAuthServ.register()', userObject);
				return $http.post('api/auth/signup', userObject, {
					headers: {
						'Content-Type' : 'application/json'
					}
				});
			},			
			login: function(loginData) {
				console.log('RegAuthServ.login()', loginData);
				return $http.post('api/auth/signin', loginData, {
					headers: {
						'Content-Type' : 'application/json'
					}
				});
			},			
			logout: function(logoutData) {
				console.log('RegAuthServ.logout()', logoutData);
				return $http.post('api/auth/signout', logoutData, {
					headers: {
						'Content-Type' : 'application/json'
					}
				});
			}
		};
	}])

	.factory('Socket', ['socketFactory', function(socketFactory) {		
		return socketFactory({
			prefix: '',
			ioSocket: io.connect('http://localhost:3000')
		});
	}])


	// local storage
	.factory('$localstorage', ['$window', function($window) {
		return {
			set: function(key, value) {
				$window.localStorage[key] = value;
			},
			get: function(key, defaultValue) {
				return $window.localStorage[key] || defaultValue;
			},
			setObject: function(key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getObject: function(key) {
				return JSON.parse($window.localStorage[key] || '{}');
			}
		}
	}]);