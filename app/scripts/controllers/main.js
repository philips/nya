'use strict';

angular.module('etcdApp')
  .controller('MainCtrl', function ($scope, $http, etcdKeys, $location, $routeParams) {
  	//Allows CORS to work properly
  	delete $http.defaults.headers.common['X-Requested-With'];

  	$scope.save = "etcd-save-hide";
  	$scope.columns = "etcd-single-col";
  	$scope.preview = "etcd-preview-hide";
  	$scope.etcd_path = "/v1/keys/";

  	//var etcd_path = 'http://localhost:4001' + $location.path();
  	$scope.etcd_path = $location.path();

  	//read from path when it changes
  	$scope.$watch('etcd_path', function() {
  		read($scope.etcd_path);
  	});

  	//make requests
  	function read() {
	    $http.get('http://localhost:4001' + $scope.etcd_path).success(function(data) {
	    	//swap this out with better logic later
	    	if(data.length) {
	    		console.log("directory");
	    		$scope.list = data;
	    		$scope.preview = "etcd-preview-hide";
	    	} else {
	    		console.log("single value");
	    		$scope.single_value = data.value;
	    		$scope.preview = "etcd-preview-reveal";
	    	}
	    });
	}

    //back button click
    $scope.back = function() {
    	var path = $scope.etcd_path.split("/");
    	var path_length = path.length;
    	var new_path;
    	//empty strings that used to be /
    	path = path.filter(function(v){return v!==''});
    	//remove last item
    	path.pop();
    	//reconstruct path
    	new_path = path.join("/");
    	//record new path if it doesn't back up too much
    	if(new_path != "v1") $scope.etcd_path = "/" + new_path + "/";
  		$location.path($scope.etcd_path);
    }

    $scope.sync_location = function() {
    	$location.path($scope.etcd_path);
    }

    $scope.show_save = function() {
    	$scope.save = "etcd-save-reveal";
    }

    $scope.save_data = function() {
    	//TODO: add loader
    	$http({
            url: 'http://localhost:4001' + $scope.etcd_path,
            method: "POST",
            data: "value=" + $scope.single_value,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
        	//TODO: remove loader
            console.log("success");
            $scope.save = "etcd-save-hide";
            $scope.preview = "etcd-preview-hide";
            $scope.back();
        }).error(function (data, status, headers, config) {
        	//TODO: remove loader
        	//TODO: show popover with error
            console.log(status);
        });
    }
})

angular.module('etcdApp').directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

angular.module('etcdApp').directive('ngKeypress', function() {
    return function(scope, element, attrs) {
        element.bind("keydown", function(event) {
            scope.$apply(function(){
                scope.$eval(attrs.ngEnter);
            });
        });
    };
});