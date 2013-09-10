'use strict';

angular.module('etcdResource', ['ngResource'])

angular.module('etcdResource').factory("etcdKeys", function($resource, $http, $route, $routeParams) {
  delete $http.defaults.headers.common['X-Requested-With'];
  console.log("route:");
  console.log('http://localhost\\:4001/v1/' + $routeParams.path);
  return $resource('http://localhost\\:4001/v1/' + $routeParams.path, {
  	path: "@path"
  }, {
    get: {method: "GET"}
  });
});
