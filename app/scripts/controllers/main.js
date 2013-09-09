'use strict';

angular.module('etcdApp')
  .controller('MainCtrl', function ($scope, $http, etcdKeys, $location, $routeParams) {
  	//Allows CORS to work properly
  	delete $http.defaults.headers.common['X-Requested-With'];

  	var etcd_path = 'http://localhost:4001' + $location.path();
  	console.log(etcd_path);
    $http.get(etcd_path).success(function(data) {
       $scope.list = data;
       console.log(data);
    });
  });
