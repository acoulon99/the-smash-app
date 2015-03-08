angular.module('SmashApp.Map.controllers', [])

  .controller('MapCtrl', ['$scope','$ionicLoading','$cordovaGeolocation', '$ionicPopup', function($scope, $ionicLoading, $cordovaGeolocation, $ionicPopup) {
    $scope.greeting = 'hey';
    $scope.startPos = new google.maps.LatLng(33.791484, -84.407535);
    $scope.ctrlMarker = undefined;

    $scope.init = function() {

	    var mapOptions = {
	      streetViewControl:true,
	      zoom: 14,
	      center: $scope.startPos,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    var map = new google.maps.Map(document.getElementById('map'),
	        mapOptions);

		// listener for dropping a marker	   
        google.maps.event.addListener(map, 'click', function(event) {

            // remove previous marker
            if($scope.ctrlMarker){
            	$scope.ctrlMarker.setMap(null);
            }

            // create new marker
			$scope.ctrlMarker = new google.maps.Marker({
	                position: event.latLng, 
	                map: map
	        });

			google.maps.event.addListener($scope.ctrlMarker, 'click', function() {
    			map.panTo($scope.ctrlMarker.getPosition());

    			var alertPopup = $ionicPopup.show({
     				title: 'Map Options',
     				scope: $scope,
     				buttons: [{text: 'Set My Location'}, {text: 'Host Event'}]
   				});

  			});

        });



		$scope.map = map;



	    /*
	    var posOptions = {timeout: 10000, enableHighAccuracy: false};
	    $cordovaGeolocation
	    	.getCurrentPosition(posOptions)
	    	.then(function (pos) {

			  var myPos = new google.maps.Marker({
		        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
		        map: map,
		        title: 'MyPos'
		      });

			  google.maps.event.addListener(myPos, 'click', function() {
		        var infowindow = new google.maps.InfoWindow({
		      	  content: 'Me'
		        });

		        infowindow.open(map, myPos);
		      });


		      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

		    }, function(err) {
		      alert('Unable to get location: ' + err.message);
		    });

		*/

	    /*
	    navigator.geolocation.getCurrentPosition(function(pos) {

		  var myPos = new google.maps.Marker({
	        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
	        map: map,
	        title: 'MyPos'
	      });


		  google.maps.event.addListener(myPos, 'click', function() {
	        var infowindow = new google.maps.InfoWindow({
	      	  content: 'Me'
	        });

	        infowindow.open(map, myPos);
	      });

	      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
	      $ionicLoading.hide();
	    }, function(error) {
	      alert('Unable to get location: ' + error.message);
	    });

		*/

	};


  }]);