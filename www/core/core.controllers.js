angular.module('SmashApp.Core.controllers', [])

  .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicSideMenuDelegate', function($scope, $rootScope, $state, $ionicSideMenuDelegate) {
    $scope.greeting = 'hey';


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


  }])

  .controller('HomeCtrl', ['$scope', function($scope){
    $scope.greeting = 'hey';
  }])

  .controller('WelcomeCtrl', ['$scope','$rootScope', '$state', '$ionicModal', '$ionicPopup', function($scope, $rootScope, $state, $ionicModal, $ionicPopup){
    $scope.greeting = 'hey';

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

    $scope.login = function(){
      $scope.loginModal.hide();
      $state.go('app.home');
    };

  }])

  .controller('PreferencesCtrl', ['$scope', function($scope){
    $scope.greeting = 'hey';
  }]);
