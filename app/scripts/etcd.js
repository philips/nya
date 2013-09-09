'use strict';

angular.module('etcdResource', ['ngResource'])

angular.module('etcdResource').factory("etcdKeys", function($resource, $http) {
  delete $http.defaults.headers.common['X-Requested-With'];
  return $resource('http://localhost\\:4001/v1/', {
  	path: "@path"
  }, {
    get: {method: "GET"}
  });
});
