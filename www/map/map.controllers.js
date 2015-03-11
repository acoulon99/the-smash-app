angular.module('SmashApp.Map.controllers', [])

  .controller('MapCtrl', ['$scope', '$rootScope', '$ionicLoading', '$cordovaGeolocation', '$ionicPopup', '$localstorage', 'UserServ', function($scope, $rootScope, $ionicLoading, $cordovaGeolocation, $ionicPopup, $localstorage, UserServ) {
    $scope.greeting = 'hey';
    $scope.startPos = new google.maps.LatLng(33.791484, -84.407535);
    $scope.ctrlMarker = undefined;
    $scope.playerMarkers = [];
    $scope.playerInfos = [];

    function attachPlayerInfo(map, marker, content){

    	var infoWindow = new google.maps.InfoWindow();
        // Attaching a click event to the current marker
        google.maps.event.addListener(marker, 'click', function(event) {
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });

        // Creating a closure to retain the correct data 
        // Note how I pass the current data in the loop into the closure (marker, data)
        (function(marker, content) {
          // Attaching a click event to the current marker
          google.maps.event.addListener(marker, "click", function(event) {
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          });
        })(marker, content);
    };

    $scope.findLocalPlayers = function(){

    	var listParams = {
    		latitude: 33,
    		longitude: -84,
    		radius: 2000
    	}

    	UserServ.localList(listParams).success(function(res){
    		console.log('Success Local List', res);

    		var playerList = res;
    		console.log('playerListLocal', playerList);

    		for(var i = 0; i < playerList.length; i++){
    			var marker = new google.maps.Marker({
    				position: {lat: playerList[i].location[1], lng: playerList[i].location[0]},
    				map: $scope.map
    			});

    			$scope.playerMarkers.push(marker);
    		}


    	}).error(function(res){
    		console.log('Error', res);
    	});
    };

	$scope.clearMyLoc = function(){

	    var userUpdate = {
	    		location: null,
	    		loginToken: $rootScope.user.loginToken
	    	};

		console.log('Updating Location', userUpdate);

	    UserServ.update(userUpdate).success(function(res) {
	      	console.log('Successful Update', res);

	      	// set user object in local storage
	      	$localstorage.setObject('user', res);
	      	$rootScope.user = res;

	      	// clear error message
	      	$scope.errorMessage = undefined;

	      	// TODO DISPLAY UPDATE SUCCESSFUL MESSAGE

	      	// error handler
	    }).error(function(res) {
	    	//


	      	// set scope error message
	      	$scope.errorMessage = res;
	      	console.log('Error', res);
	    });
	};

	$scope.toggleActive = function(){

	    var userUpdate = {
	    		active: $rootScope.user.active ? false : true,
	    		loginToken: $rootScope.user.loginToken
	    	};


	    console.log('Updating Active', userUpdate);

	    UserServ.update(userUpdate).success(function(res) {
	      	console.log('Successful Update', res);

	      	// set user object in local storage
	      	$localstorage.setObject('user', res);
	      	$rootScope.user = res;

	      	// clear error message
	      	$scope.errorMessage = undefined;

	      	// TODO DISPLAY UPDATE SUCCESSFUL MESSAGE

	      	// error handler
	    }).error(function(res) {
	      	// set scope error message
	      	$scope.errorMessage = res;
	      	console.log('Error Login', res);
	    });


	};

    $scope.init = function() {

	    var mapOptions = {
	      streetViewControl:true,
	      zoom: 14,
	      center: $scope.startPos,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    var map = new google.maps.Map(document.getElementById('map'),
	        mapOptions);


	    console.log('User', $rootScope.user);
	    // add user location to map if it is set
	    if ($rootScope.user.location){

	    	console.log('adding user position to the map');

			var myMarker = new google.maps.Marker({
				position: {lat: $rootScope.user.location[1], lng: $rootScope.user.location[0]},
				map: $scope.map,
				icon: 'img/active-player-blue.png'
			});

	    }

		// listener for dropping a marker	   
        google.maps.event.addListener(map, 'click', function(event) {

            // remove previous marker
            if($scope.ctrlMarker){
            	$scope.ctrlMarker.setMap(null);
            }

            // create new marker
			$scope.ctrlMarker = new google.maps.Marker({
	                position: event.latLng, 
	                map: map,
	                icon: 'img/map-control-blue.png'
	        });

			google.maps.event.addListener($scope.ctrlMarker, 'click', function() {
    			map.panTo($scope.ctrlMarker.getPosition());

    			var alertPopup = $ionicPopup.show({
     				title: 'Map Options',
     				scope: $scope,
     				buttons: [{text: 'Set My Location', onTap: function(event){

	 				    var userUpdate = {
	 				    		location: [
	 				    			$scope.ctrlMarker.getPosition().lng(), 
	 				    			$scope.ctrlMarker.getPosition().lat()
	 				    		],
	 				    		loginToken: $rootScope.user.loginToken
	 				    	};

	 				    console.log('Updating Location', userUpdate);

				        UserServ.update(userUpdate).success(function(res) {
				          	console.log('Successful Update', res);

				          	// set user object in local storage
				          	$localstorage.setObject('user', res);
				          	$rootScope.user = res;

				          	// clear error message
				          	$scope.errorMessage = undefined;

				          	// TODO DISPLAY UPDATE SUCCESSFUL MESSAGE

				          	// error handler
				        }).error(function(res) {
				        	//


				          	// set scope error message
				          	$scope.errorMessage = res;
				          	console.log('Error Login', res);
				        });
     				}},
     				{text: 'Find Players', onTap: function(event){

     					// find players function
				     	var listParams = {
				    		latitude: $scope.ctrlMarker.getPosition().lat(),
				    		longitude: $scope.ctrlMarker.getPosition().lng(),
				    		radius: 2000 // 2 km search radius
				    	}

				    	// server call to get ocal list
				    	UserServ.localList(listParams).success(function(res){
				    		// success
				    		console.log('Success Local List', res);
				    		
				    		// remove previous markers from map and clear them in memory
				    		for (var i = 0; i < $scope.playerMarkers.length; i++){
				    			$scope.playerMarkers[i].setMap(null);
				    		}
				    		$scope.playerMarkers = [];

				    		// set the player list from the response
				    		var playerList = res;



				    		// for each player in the list, add a marker for them
				    		for(var i = 0; i < playerList.length; i++){

				    			var marker = new google.maps.Marker({
				    				position: {lat: playerList[i].location[1], lng: playerList[i].location[0]},
				    				map: $scope.map,
				    				icon: 'img/active-player-red.png'
				    			});

			    				var infoWindowContent = '<div id="map-player-info-content">'+
			    					'<p>Tag: ' + playerList[i].tag + '</p>'+
			    					'<p>Game(s): ' + playerList[i].games + '</p>'+
			    					'<p>Main(s): ' + playerList[i].mains + '</p>'+
			    					'</div>';		

			    				attachPlayerInfo($scope.map, marker, infoWindowContent);		    			

				    			$scope.playerMarkers.push(marker);
				    		}


				    	}).error(function(res){
				    		console.log('Error', res);
				    	});

     				}}]
   				});

  			});

        });
		$scope.map = map;
	};

  }]);