'use strict';

var etcdApp = angular.module('etcdApp', ['ngRoute', 'etcdResource', 'timeRelative'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/v1/keys/'
      })
      
      .otherwise({
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });
  }]);
