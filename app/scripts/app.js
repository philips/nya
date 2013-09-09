'use strict';

var etcdApp = angular.module('etcdApp', ['etcdResource', 'timeRelative'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:path', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
  });
