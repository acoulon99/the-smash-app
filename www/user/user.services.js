angular.module('SmashApp.User.services',[])

	.factory('UserServ', ['$http', function($http){

		hello.init({
	      facebook : '633943593405254'
	    }, {
	      // Define the OAuth2 return URL
	      redirect_uri : 'http://adodson.com/hello.js/redirect.html'
	    });

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
			},


			// HELLO.JS SOCIAL CALLBACK METHODS
			socialLogin: function(network, callback){
				hello(network).login(function(){
					console.log('Successful login to ' + network);
					callback(null);
				}, function(err){
					console.log('Social Media Error', err);
					callback(err);
				});
			},
			isSocialLogin: function(network) {
				var session = hello(network).getAuthResponse();
				var current_time = (new Date()).getTime() / 1000;

				return session && session.access_token && session.expires > current_time;
			},
			getSocialProfile: function(network, callback){
				hello(network).api('/me').then(function(userObject){
					callback(null, userObject);
				}, function(err){
					console.log('Social Media Error', err);
					callback(err);
				});
			}

		};
	}]);