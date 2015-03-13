// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('SmashApp', ['ionic', 'ngCordova',
  'SmashApp.Core.controllers', 'SmashApp.Core.services',
  'SmashApp.User.controllers', 'SmashApp.User.services',
  'SmashApp.Messages.controllers',
  'SmashApp.Map.controllers',
  'SmashApp.Tournaments.controllers',
  'SmashApp.Events.controllers',
  'SmashApp.Login.controllers',
  'btford.socket-io'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: 'core/view.menu.html',
    controller: 'AppCtrl'
  })

  .state('app.welcome', {
    url: "/welcome",
    views: {
      'menuContent': {
        templateUrl: 'core/view.welcome.html',
        controller: 'WelcomeCtrl'
      }
    }
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: 'core/view.home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: 'user/view.profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  
  .state('app.messages', {
    url: "/messages",
    views: {
      'menuContent': {
        templateUrl: 'messages/view.messages.html',
        controller: 'MessagesCtrl'
      }
    }
  })

  .state('app.m2kChat', {
    url: "/messages/m2k",
    views: {
      'menuContent': {
        templateUrl: 'messages/view.example.m2k.html'      
      }
    }
  })

  .state('app.hboxChat', {
    url: "/messages/hbox",
    views: {
      'menuContent': {
        templateUrl: 'messages/view.example.hbox.html'      
      }
    }
  })

  .state('app.map', {
    url: "/map",
    views: {
      'menuContent': {
        templateUrl: 'map/view.map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('app.preferences', {
    url: "/preferences",
    views: {
      'menuContent': {
        templateUrl: 'core/view.preferences.html',
        controller: 'PreferencesCtrl'
      }
    }
  })

  .state('app.tournaments', {
    url: "/tournaments",
    views: {
      'menuContent': {
        templateUrl: 'tournaments/view.tournaments.html',
        controller: 'TournamentsCtrl'
      }
    }
  })

  .state('app.events', {
    url: "/events",
    views: {
      'menuContent': {
        templateUrl: 'events/view.events.html',
        controller: 'EventsCtrl'
      }
    }
  });
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://s3.amazonaws.com/amrap/**', 'http://localhost:3000/**']);



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
});
