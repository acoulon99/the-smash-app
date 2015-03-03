angular.module('SmashApp.Login.controllers', [])

  .controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.greeting = 'hey';

    $scope.goToHome = function(){
    	$state.go('app.home');
    };

  }]);