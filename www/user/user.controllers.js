angular.module('SmashApp.User.controllers', [])

  .controller('ProfileCtrl', ['$scope', '$rootScope', '$localstorage', 'UserServ', function($scope, $rootScope, $localstorage, UserServ) {
    $scope.greeting = 'hey';
    $scope.updateData = $rootScope.user;

    $scope.updateUser = function(){

      console.log('Doing update', $scope.updateData);

      UserServ.update($scope.updateData).success(function(res) {
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




  }]);