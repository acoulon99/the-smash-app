angular.module('SmashApp.Core.controllers', [])

  .controller('AppCtrl', ['$scope', '$rootScope', '$ionicSideMenuDelegate', function($scope, $rootScope, $ionicSideMenuDelegate) {
    $scope.greeting = 'hey';


    // this will hide the tabs when the side menu is open
    $scope.$watch(function () {
    	return $ionicSideMenuDelegate.getOpenRatio();
	}, function (ratio) {
		if($ionicSideMenuDelegate.isOpen()){
			$rootScope.showTabs = false;
		
		// side menu is closed
		} else {
			$rootScope.showTabs = true;
		}
	});	


  }])

  .controller('HomeCtrl', ['$scope', function($scope){
    $scope.greeting = 'hey';
  }])

  .controller('PreferencesCtrl', ['$scope', function($scope){
    $scope.greeting = 'hey';
  }]);
