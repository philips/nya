'use strict';

angular.module('etcdApp')
  .controller('MainCtrl', function ($scope, $http, etcdKeys, $location, $routeParams) {
  	//Allows CORS to work properly
  	delete $http.defaults.headers.common['X-Requested-With'];

  	var etcd_path = 'http://localhost:4001' + $location.path();
    $http.get(etcd_path).success(function(data) {
    	if(data.length) {
    		console.log("directory");
    	} else {
    		console.log("single value");
    	}
    	$scope.list = data;
    });
  })
