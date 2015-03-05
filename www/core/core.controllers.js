angular.module('SmashApp.Core.controllers', [])

  .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicSideMenuDelegate', '$ionicModal', '$localstorage', 'RegAuthServ', function($scope, $rootScope, $state, $ionicSideMenuDelegate, $ionicModal, $localstorage, RegAuthServ) {
    $scope.greeting = 'hey';
    $scope.user = $localstorage.getObject('user');


    // this will hide the tabs when the side menu is open
    $scope.$watch(function () {
      	return $ionicSideMenuDelegate.getOpenRatio();
  	}, function (ratio) {
  		if($ionicSideMenuDelegate.isOpen()){
  			$rootScope.showTabs = false;
  		// side menu is closed
  		} else {
        console.log('Current State', $state.current.name);
        if(['app.welcome'].indexOf($state.current.name) > -1){
          $rootScope.showTabs = false;
        } else {
          $rootScope.showTabs = true;
        }
  		}
	  });	

    // handle showing/hiding tabs for certain states
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      console.log('toState', toState);
      console.log('fromState', fromState);
      console.log('showTabs', $rootScope.showTabs);

      if(['app.welcome'].indexOf(toState.name) > -1){
        $rootScope.showTabs = false;
      } else {
        $rootScope.showTabs = true;
      }

    });


    $scope.logout = function(){
      var logoutData = {loginToken: $scope.user.loginToken};

      console.log('Sending Logout Request', $scope.user);

      RegAuthServ.logout(logoutData).success(function(res){
        console.log('Successful logout', res);
        $localstorage.setObject('user', {});
        $scope.userOptionsModal.hide();
        $state.go('app.welcome');
      });
    };


    // User Options Modal
    $ionicModal.fromTemplateUrl('user/modal.useroptions.html', function($ionicModal){
      $scope.userOptionsModal = $ionicModal;
    },{
      scope: $scope,
      animation: 'slide-in-up'
    });

    $scope.showUserOptions= function() {
      $scope.userOptionsModal.show();
    };

    $scope.closeUserOptions = function() {
      $scope.userOptionsModal.hide();
    };

    $scope.goToPreferences = function() {
      $scope.userOptionsModal.hide(); 
      $state.go('app.preferences');
    };






  }])

  .controller('HomeCtrl', ['$scope', '$localstorage', function($scope, $localstorage){
    $scope.greeting = 'hey';

    $scope.user = $localstorage.getObject('user');

  }])

  .controller('WelcomeCtrl', ['$scope','$rootScope', '$state', '$ionicModal', '$ionicPopup', 'RegAuthServ', '$localstorage', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, RegAuthServ, $localstorage){
    $scope.greeting = 'hey';
    $scope.loginData = {};
    $scope.registerData = {};

    // Login Modal
    $ionicModal.fromTemplateUrl('core/modal.login.html', function($ionicModal){
      $scope.loginModal = $ionicModal
    },{
      scope: $scope,
      animation: 'slide-in-up'
    });

    $scope.showLogin = function() {
      $scope.loginModal.show();
    };

    $scope.closeLogin = function() {
      $scope.loginModal.hide();
    };

    $scope.forgotComingSoon = function(){
      $ionicPopup.alert({
         title: '<p style="color:black">Warning</p>',
         template: '<p style="color:black">Password recovery not ready yet.<br>Please contact an admin.</p>'
      });
    };


    // Register Modal
    $ionicModal.fromTemplateUrl('core/modal.register.html', function($ionicModal){
      $scope.registerModal = $ionicModal
    },{
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
    $scope.login = function(){

      console.log('Doing login', $scope.loginData);

      RegAuthServ.login($scope.loginData).success(function(res) {
        console.log('Successful Login', res);

        // set user object in local storage
        $localstorage.setObject('user', res);

        // clear error message
        $scope.errorMessage = undefined;

        // redirect to home after successful login
        $scope.loginModal.hide();
        $state.go('app.home');

        // error handler
      }).error(function(res) {

        // set scope error message
        $scope.errorMessage = res;
        console.log('Error Login', res);
      });

    };

    $scope.register = function(){

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

            // remove error message
            $scope.errorMessage = undefined;

            // redirect to home after successful login
            $scope.registerModal.hide();
            $state.go('app.home');

        // error handling for login request
        }).error(function(res){
            // set error message
            $scope.errorMessage = res;
            console.log('Error Login', res);
        });

      // error handling for registration request
      }).error(function(res){
          // set error message
          $scope.errorMessage = res;
          console.log('Error Registration', res);
      });
    };

  }])

  .controller('PreferencesCtrl', ['$scope', function($scope){
    $scope.greeting = 'hey';
  }]);
