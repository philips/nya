'use strict';

var etcdApp = angular.module('etcdApp', ['ngRoute', 'etcdResource', 'timeRelative'])
  .config(['$routeProvider', function ($routeProvider) {
    //read localstorage
    var previous_path = localStorage.getItem('etcd_path');
    if(previous_path != null && previous_path.indexOf('/v1/keys/') !== -1) {
      var redirect_path = previous_path
    } else {
      var redirect_path = '/v1/keys/';
    }
    $routeProvider
      .when('/', {
        redirectTo: redirect_path
      })
      .otherwise({
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });
  }]);
