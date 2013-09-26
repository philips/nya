'use strict';

angular.module('etcd-stats', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl'
      })
      .otherwise({
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl'
      });
  }]);
