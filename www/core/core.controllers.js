angular.module('SmashApp.Core.controllers', [])

.controller('AppCtrl', ['$scope', '$rootScope', '$cordovaGeolocation', '$state', '$ionicSideMenuDelegate', '$ionicModal', '$ionicPopup', '$localstorage', 'RegAuthServ', 'Socket', function($scope, $rootScope, $cordovaGeolocation, $state, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, $localstorage, RegAuthServ, Socket) {
    $scope.greeting = 'hey';
    $rootScope.user = $localstorage.getObject('user');
    $rootScope.allowSideMenu = true; // allow by default

    function onGeoSuccess(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        console.log('PhonePos-on-load', position);
        $rootScope.phonePos = new google.maps.LatLng(lat, lng); // default map location
    }

    function onGeoError(err) {
        console.log('GPS position grabbing error. Trying again..', err);

        $cordovaGeolocation.getCurrentPosition().then(onGeoSuccess, function(err) {
            console.log('Could not find GPS coordinates', err);
        });
    }

    // find location of phone to center map there
    $cordovaGeolocation.getCurrentPosition().then(onGeoSuccess, onGeoError);

    // this will hide the tabs when the side menu is open
    $scope.$watch(function() {
        return $ionicSideMenuDelegate.getOpenRatio();
    }, function(ratio) {
        if ($ionicSideMenuDelegate.isOpen()) {
            $rootScope.showTabs = false;
            // side menu is closed
        } else {
            console.log('Current State', $state.current.name);
            if (['app.welcome'].indexOf($state.current.name) > -1) {
                $rootScope.showTabs = false;
            } else {
                $rootScope.showTabs = true;
            }
        }
    });

    // handle showing/hiding tabs for certain states
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        console.log('toState', toState);
        console.log('fromState', fromState);
        console.log('showTabs', $rootScope.showTabs);
        console.log('allowSideMenu', $rootScope.allowSideMenu);

        if (['app.welcome'].indexOf(toState.name) > -1) {
            $rootScope.showTabs = false;
        } else {
            $rootScope.showTabs = true;
        }


        if (['app.welcome', 'app.m2kChat', 'app.hboxChat'].indexOf(toState.name) > -1) {
            $rootScope.allowSideMenu = false;
        } else {
            $rootScope.allowSideMenu = true;
        }
    });

    $scope.logout = function() {
        // extract loginToken
        var logoutData = {
            loginToken: $rootScope.user.loginToken
        };

        // send logout request
        console.log('Sending Logout Request', $scope.user);
        RegAuthServ.logout(logoutData).success(function(res) {
            console.log('Successful logout', res);
            $localstorage.setObject('user', {});
            $rootScope.user = {};
            $scope.userOptionsModal.hide();
        });
        $state.go('app.welcome');
    };

    // User Options Modal
    $ionicModal.fromTemplateUrl('user/modal.useroptions.html', function($ionicModal) {
        $scope.userOptionsModal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $scope.showUserOptions = function() {
        $scope.userOptionsModal.show();
    };

    $scope.closeUserOptions = function() {
        $scope.userOptionsModal.hide();
    };

    $scope.goToPreferences = function() {
        $scope.userOptionsModal.hide();
        $state.go('app.preferences');
    };

    //Socket Core Functions. 

    //Test socket.
    Socket.on('connect', function() {
        console.log('socket connected');
    });

    //Receive message and notify the user
    Socket.on('SocketEvent:messageReceived', function(message) {
        //if the current state is app.messages, let the messages ctrl watcher handle it.
        if ($state.current.name !== 'app.messages') {
            $scope.$broadcast('newMessage', message);
        }
    });

    //receive the broadcasts
    $scope.$on('AngularEvent:newMessage', function(message) {
        $rootScope.notificationsCount++;
    });
}])

.controller('WelcomeCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicPopup', 'RegAuthServ', '$localstorage', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, RegAuthServ, $localstorage) {
    $scope.greeting = 'hey';
    $scope.loginData = {};
    $scope.registerData = {};
    $rootScope.allowSideMenu = false;

    // Login Modal
    $ionicModal.fromTemplateUrl('core/modal.login.html', function($ionicModal) {
        $scope.loginModal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $scope.showLogin = function() {
        $scope.loginModal.show();
    };

    $scope.closeLogin = function() {
        $scope.loginModal.hide();
    };

    $scope.forgotComingSoon = function() {
        $ionicPopup.alert({
            title: '<p style="color:black">Warning</p>',
            template: '<p style="color:black">Password recovery not ready yet.<br>Please contact an admin.</p>'
        });
    };

    // Register Modal
    $ionicModal.fromTemplateUrl('core/modal.register.html', function($ionicModal) {
        $scope.registerModal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $scope.showRegister = function() {
        $scope.registerModal.show();
    };

    $scope.closeRegister = function() {
        $scope.registerModal.hide();
    };

    // login function
    $scope.login = function() {

        console.log('Doing login', $scope.loginData);

        RegAuthServ.login($scope.loginData).success(function(res) {
            console.log('Successful Login', res);

            // set user object in local storage
            $localstorage.setObject('user', res);
            $rootScope.user = res;

            // clear error message
            $scope.errorMessage = undefined;

            // redirect to home after successful login
            $scope.loginModal.hide();
            $state.go('app.map', {}, {
                reload: true
            });

            // error handler
        }).error(function(res) {
            // set scope error message
            $scope.errorMessage = res;
            console.log('Error Login', res);
            $ionicPopup.alert({
                title: 'No Johns',
                template: res.message
            });
        });
    };

    $scope.register = function() {
        console.log('Doing Registration', $scope.registerData);

        var user = $scope.registerData;

        RegAuthServ.register(user).success(function(res) {
            console.log('Successful Registration', res);

            // set login data from registration form
            $scope.loginData.username = $scope.registerData.username;
            $scope.loginData.password = $scope.registerData.password;

            // Now login to the app
            console.log('Doing login', $scope.loginData);
            RegAuthServ.login($scope.loginData).success(function(res) {
                console.log('Successful Login', res);
                $localstorage.setObject('user', res);
                $rootScope.user = res;

                // remove error message
                $scope.errorMessage = undefined;

                // redirect to home after successful login
                $scope.registerModal.hide();
                $state.go('app.map', {}, {
                    reload: true
                });

                // error handling for login request
            }).error(function(res) {
                // set error message
                $scope.errorMessage = res;
                console.log('Error Login', res);

                $ionicPopup.alert({
                    title: 'No Johns',
                    template: res.message
                });
            });
            // error handling for registration request
        }).error(function(res) {
            // set error message
            $scope.errorMessage = res;
            console.log('Error Registration', res);
            $ionicPopup.alert({
                title: 'No Johns',
                template: res.message
            });
        });
    };
}]);