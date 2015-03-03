angular.module('SmashApp.Map.controllers', [])

  .controller('MapCtrl', ['$scope','$ionicLoading', function($scope, $ionicLoading) {
    $scope.greeting = 'hey';
    $scope.startPos = new google.maps.LatLng(33.791484, -84.407535);

    $scope.init = function() {

	    var mapOptions = {
	      streetViewControl:true,
	      zoom: 14,
	      mapTypeId: google.maps.MapTypeId.TERRAIN
	    };
	    var map = new google.maps.Map(document.getElementById('map'),
	        mapOptions);

	    $scope.map = map;

	    $ionicLoading.show({
	      content: 'Getting current location... Please Wait',
	      showBackdrop: false
	    });
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

	  };


  }]);