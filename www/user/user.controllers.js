angular.module('SmashApp.User.controllers', [])

.controller('ProfileCtrl', ['$scope',
    '$rootScope',
    '$localstorage',
    '$ionicPopup',
    'UserServ',
    function($scope, $rootScope, $localstorage, $ionicPopup, UserServ) {
        $scope.greeting = 'hey';
        $scope.updateData = $rootScope.user;
        $scope.editMode = false;

        $scope.updateUser = function() {
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

        $scope.isSocialLogin = function(network) {
            return UserServ.isSocialLogin(network);
        };

        $scope.socialLogin = function(network){
            UserServ.socialLogin(network, function(err){
                if(err){
                    // handle error
                    console.log(err);
                } else {
                    // handle success
                    $scope.$apply();
                }
            });
        };

        $scope.setProfilePic = function(){
            UserServ.getSocialProfile('facebook', function(err, userProfile){
                if(err){
                    $ionicPopup.alert({
                        title: 'No Johns',
                        template: err
                    });
                } else {

                    console.log('Updating Profile pic on server', updateData);

                    // update user on the server with profile pic
                    var updateData = $rootScope.user;
                    updateData.profilePic = userProfile.picture;
                    UserServ.update(updateData).success(function(res) {
                        console.log('Successful Update', res);

                        // set user object in local storage
                        $localstorage.setObject('user', res);
                        $rootScope.user = res;
                        $scope.$apply();

                        // error handler
                    }).error(function(res) {
                        $ionicPopup.alert({
                            title: 'No Johns',
                            template: res
                        });

                    });

                }
            })
        };

        $scope.removeProfilePic = function(){
            console.log('Removing Profile pic on server');

            // update user on the server with profile pic
            var updateData = $rootScope.user;
            updateData.profilePic = null;
            UserServ.update(updateData).success(function(res) {
                console.log('Successful Update', res);

                // set user object in local storage
                $localstorage.setObject('user', res);
                $rootScope.user = res;
                $scope.$apply();

                // error handler
            }).error(function(res) {
                $ionicPopup.alert({
                    title: 'No Johns',
                    template: res
                });
            });
        };
    }
]);
