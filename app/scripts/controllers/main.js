'use strict';

angular.module('etcdApp')
  .controller('MainCtrl', function ($scope, $http, etcdKeys, $location, $routeParams) {
  	//Allows CORS to work properly
  	delete $http.defaults.headers.common['X-Requested-With'];

  	$scope.save = "etcd-save-hide";
  	$scope.preview = "etcd-preview-hide";
  	$scope.etcd_path = "/v1/keys/";
  	$scope.enable_back = true;
    $scope.writingNew = false;

  	$scope.etcd_path = $location.path();

  	//read from path when it changes
  	$scope.$watch('etcd_path', function() {

        if($scope.writingNew == false) {
      		//write to localstorage
      		localStorage.setItem('etcd_path', $scope.etcd_path);

      		var current_path = $scope.etcd_path.split("/");
        	var parent_path;
        	//empty strings that used to be /
        	current_path = current_path.filter(function(v){return v!==''});
        	//remove last item
        	current_path.pop();
        	//reconstruct path
        	parent_path = current_path.join("/");

        	$scope.etcd_parent_path = "/" + parent_path + "/";

      		//load data
      		read();

      		//disable back button if at root (/v1/keys/)
      		if($scope.etcd_path == "/v1/keys/") {
      			$scope.enable_back = false;
        	} else {
        		$scope.enable_back = true;
        	}
        }
  	});

  	//make requests
  	function read() {
	    $http.get('http://localhost:4001' + $scope.etcd_path).success(function(data) {
            //hide any errors
            $("#etcd-browse-error").hide();
	    	//swap this out with better logic later
	    	if(data.length) {
	    		$scope.list = data;
	    		$scope.preview = "etcd-preview-hide";
	    	} else {
	    		$scope.single_value = data.value;
	    		$scope.preview = "etcd-preview-reveal";
	    		$http.get('http://localhost:4001' + $scope.etcd_parent_path).success(function(data) {
	    			$scope.list = data;
	    		});
	    	}
	    	$scope.preview_message = "No key selected."
	    }).error(function (data, status, headers, config) {
	    	$scope.preview_message = "Key does not exist."
	    	$http.get('http://localhost:4001' + $scope.etcd_parent_path).success(function(data) {
    			$scope.list = data;
    		});

            //show errors
            $scope.showBrowseError(data.message);
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
    	if(new_path != "v1") {
    		$scope.etcd_path = "/" + new_path + "/";
    	}
  		$location.path($scope.etcd_path);
        $scope.preview = "etcd-preview-hide";
        $scope.writingNew = false;
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
            //data: "value=" + $scope.single_value,
            data: $.param({value: $scope.single_value}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
        	//TODO: remove loader
            $scope.save = "etcd-save-hide";
            $scope.preview = "etcd-preview-hide";
            $scope.back();
            $scope.writingNew = false;
        }).error(function (data, status, headers, config) {
        	//TODO: remove loader
        	//TODO: show popover with error
            console.log(status);
        });
    }

    $scope.delete_key = function() {
    	//TODO: add loader
    	$http({
            url: 'http://localhost:4001' + $scope.etcd_path,
            method: "DELETE",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
        	//TODO: remove loader
            $scope.save = "etcd-save-hide";
            $scope.preview = "etcd-preview-hide";
            $scope.back();
        }).error(function (data, status, headers, config) {
        	//TODO: remove loader
        	//TODO: show popover with error
            console.log(status);
        });
    }

    $scope.add = function() {
    	$scope.save = "etcd-save-reveal";
    	$scope.preview = "etcd-preview-reveal";
    	$scope.single_value = "";
        $(".etcd-browser-path").find("input").focus();
        $scope.writingNew = true;
    }

    $scope.showBrowseError = function(message) {
        $("#etcd-browse-error").find(".etcd-popover-content").text("Error: " + message);
        $("#etcd-browse-error").addClass("etcd-popover-right").show();
    }

    $scope.getHeight = function() {
        return $(window).height();
    };
    $scope.$watch($scope.getHeight, function(newValue, oldValue) {
        $(".etcd-body").css("height", $scope.getHeight()-45);
    });
    window.onresize = function(){
        $scope.$apply();
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

angular.module('etcdApp').directive('highlight', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            if("#" + scope.etcd_path == attrs.href) {
            	element.parent().parent().addClass("etcd-selected")
            }
        }

    };

}]);

moment.lang('en', {
    relativeTime : {
        future: "Expires in %s",
        past:   "Expired %s ago",
        s:  "seconds",
        m:  "a minute",
        mm: "%d minutes",
        h:  "an hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});