'use strict';

angular.module('etcdResource', ['ngResource'])

angular.module('etcdResource').factory("etcdKeys", function($resource, $http, $route, $location) {
  delete $http.defaults.headers.common['X-Requested-With'];
  return $resource('http://localhost:4001' + $location.path(), {
  	path: "@path"
  }, {
    get: {method: "GET"}
  });
});
