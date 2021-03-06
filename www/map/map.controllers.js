angular.module('SmashApp.Map.controllers', [])

.controller('MapCtrl', ['$scope', 
	'$rootScope',      
	'$state', 
	'$ionicLoading', 
	'$cordovaGeolocation', 
	'$ionicPopup', 
	'$localstorage', 
    '$interval',
	'UserServ', 
	function($scope, 
        $rootScope, 
        $state, 
        $ionicLoading, 
        $cordovaGeolocation, 
        $ionicPopup, 
        $localstorage, 
        $interval, 
        UserServ) {

    $scope.startPos = $rootScope.phonePos || new google.maps.LatLng(33.791484, -84.407535);
    $scope.ctrlMarker = undefined;
    $scope.playerMarkers = [];
    $scope.playerInfos = [];
    $scope.locationIsSet = false;
    $scope.activeStatus = $rootScope.user.active;

    function attachPlayerInfo(map, marker, content) {
        //var infoWindow = new google.maps.InfoWindow();
        // Attaching a click event to the current marker
        google.maps.event.addListener(marker, 'click', function(event) {
            //infoWindow.setContent(content);
            //infoWindow.open(map, marker);

            $ionicPopup.show({
                title: 'Player Card',
                scope: $scope,
                template: content,
                buttons: [{
                    text: 'Message',
                    onTap: function() {
                        $state.go('app.hboxChat');
                    }
                }, {
                    text: 'Close'
                }]
            });
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
    }

    function findPlayers(lat, lng, radius) {

        // find players function
        var listParams = {
            latitude: lat,
            longitude: lng,
            radius: 0.01449275362 * radius // search radius in miles
        };

        // server call to get ocal list
        UserServ.localList(listParams).success(function(res) {
            // success
            console.log('Success Local List', res);

            // remove previous markers from map and clear them in memory
            for (var i = 0; i < $scope.playerMarkers.length; i++) {
                $scope.playerMarkers[i].setMap(null);
            }
            $scope.playerMarkers = [];

            // set the player list from the response
            var playerList = res;

            // for each player in the list, add a marker for them
            for (var i = 0; i < playerList.length; i++) {
                // do not create marker for current user
                if(playerList[i].username == $rootScope.user.username){

                    var marker = new google.maps.Marker({
                        position: {
                            lat: playerList[i].location[1],
                            lng: playerList[i].location[0]
                        },
                        map: $scope.map,
                        icon: 'img/active-player-blue.png'
                    });

                    var infoWindowContent = '<div id="map-player-info-content">' +
                        '<img class="player-pic" ng-src="' + (playerList[i].profilePic || 'img/smash-app-icon-2.png') + '">' +
                        '<p><span class="text-bold">Player:</span> ' + playerList[i].tag + '</p>' +
                        '<p><span class="text-bold">Game(s):</span> ' + playerList[i].games + '</p>' +
                        '<p><span class="text-bold">Main(s):</span> ' + playerList[i].mains + '</p>' +
                        '</div>';

                    attachPlayerInfo($scope.map, marker, infoWindowContent);
                    $scope.playerMarkers.push(marker);

                } else {
                    var marker = new google.maps.Marker({
                        position: {
                            lat: playerList[i].location[1],
                            lng: playerList[i].location[0]
                        },
                        map: $scope.map,
                        icon: 'img/active-player-red.png'
                    });

                    var infoWindowContent = '<div id="map-player-info-content">' +
                        '<img class="player-pic" ng-src="' + (playerList[i].profilePic || 'img/smash-app-icon-2.png') + '">' +
                        '<p><span class="text-bold">Player:</span> ' + playerList[i].tag + '</p>' +
                        '<p><span class="text-bold">Game(s):</span> ' + playerList[i].games + '</p>' +
                        '<p><span class="text-bold">Main(s):</span> ' + playerList[i].mains + '</p>' +
                        '</div>';

                    attachPlayerInfo($scope.map, marker, infoWindowContent);
                    $scope.playerMarkers.push(marker);
                }
            }
        }).error(function(res) {
            console.log('Error', res);
        });
    }

    $scope.isActive = function() {
        return $rootScope.user.active;
    };

    $scope.findLocalPlayers = function() {
        findPlayers($scope.map.getCenter().lat(), $scope.map.getCenter().lng(), 50);
    };

    $scope.clearMyLoc = function() {
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

            // update bottom bar to tell user to set location
            $scope.locationIsSet = false;

            findPlayers($scope.map.getCenter().lat(), $scope.map.getCenter().lng(), 50);

            // TODO DISPLAY UPDATE SUCCESSFUL MESSAGE
            // error handler
        }).error(function(res) {
            // set scope error message
            $scope.errorMessage = res;
            console.log('Error', res);
        });
    };

    $scope.toggleActive = function() {
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

            findPlayers($scope.map.getCenter().lat(), $scope.map.getCenter().lng(), 50);

            // error handler
        }).error(function(res) {
            // set scope error message
            $scope.errorMessage = res;
            console.log('Error Login', res);
        });
    };

    $scope.init = function() {
        var mapOptions = {
            center: $scope.startPos,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            disableDefaultUI: true
        };

        var map = new google.maps.Map(document.getElementById('map'),
            mapOptions);

        // find current users
        // findPlayers($scope.startPos.lat(), $scope.startPos.lng(), 50);

        console.log('User', $rootScope.user);
        // add user location toap if it is set
        if ($rootScope.user.location) {
            // update bottom location bar to display correct info
            $scope.locationIsSet = true;

            console.log('adding user position to the map');

            var myMarker = new google.maps.Marker({
                position: {
                    lat: $rootScope.user.location[1],
                    lng: $rootScope.user.location[0]
                },
                map: $scope.map,
                icon: 'img/active-player-blue.png'
            });
        }

        // listener for dropping a marker	   
        google.maps.event.addListener(map, 'click', function(event) {

            // remove previous marker
            if ($scope.ctrlMarker) {
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
                    buttons: [{
                        text: 'Set My Location',
                        onTap: function(event) {

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

                                // update bottom bar to display location
                                $scope.locationIsSet = true;

                                // clear error message
                                $scope.errorMessage = undefined;

                                // TODO DISPLAY UPDATE SUCCESSFUL MESSAGE
                                findPlayers($scope.map.getCenter().lat(), $scope.map.getCenter().lng(), 50);

                                // error handler
                            }).error(function(res) {
                                // set scope error message
                                $scope.errorMessage = res;
                                console.log('Error Login', res);
                            });
                        }
                    }, {text: 'Close'}]
                });
            });
        });
        $scope.map = map;

        // search for local players every minute seconds
        $interval(findPlayers($scope.map.getCenter().lat(), $scope.map.getCenter().lng(), 50), 1000 * 60 * 1);
    };

    $scope.goToHboxChat = function() {
        console.log('click msg button');
        $state.go('app.hboxChat');
    };

    // search for local players every 15 seconds
    // 
}]);
