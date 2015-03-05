angular.module('SmashApp.Core.controllers', [])

  .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicSideMenuDelegate', function($scope, $rootScope, $state, $ionicSideMenuDelegate) {
    $scope.greeting = 'hey';

    $rootScope.showTabs = false;


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
    });


  }])

  .controller('HomeCtrl', ['$scope', function($scope){
    $scope.greeting = 'hey';
  }])

  .controller('WelcomeCtrl', ['$scope','$rootScope', '$state', function($scope, $rootScope, $state){
    $scope.greeting = 'hey';
    console.log('ShowTabs', $rootScope.showTabs);
  }])

  .controller('PreferencesCtrl', ['$scope', function($scope){
    $scope.greeting = 'hey';
  }]);
