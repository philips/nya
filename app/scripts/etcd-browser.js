'use strict';

angular.module('etcdApp', ['ngRoute', 'etcdResource', 'timeRelative'])
  .config(['$routeProvider', function ($routeProvider) {
    //read localstorage
    var previousPath = localStorage.getItem('etcd_path');
    var redirectPath = '/v1/keys/';
    if(previousPath !== null && previousPath.indexOf('/v1/keys/') !== -1) {
      redirectPath = previousPath;
    }

    $routeProvider
      .when('/', {
        redirectTo: redirectPath
      })
      .otherwise({
        templateUrl: 'views/browser.html',
        controller: 'MainCtrl'
      });
  }]);
