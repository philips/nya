'use strict';

angular.module('etcdApp', ['etcdResource'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/keys'
      })
      .when('/keys', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
