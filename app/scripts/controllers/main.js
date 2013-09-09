'use strict';


angular.module('etcdApp')
  .controller('MainCtrl', function ($scope, $http, etcdKeys) {
    $scope.key = etcdKeys.get();
    $http.get('http://localhost:4001/v1/keys/foobar').success(function(data) {
        $scope.foobar = data;
    });
  });
