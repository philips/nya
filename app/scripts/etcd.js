'use strict';



angular.module('etcdResource', ['ngResource'])

angular.module('etcdResource').factory("etcdKeys", function($resource) {
  return $resource('http://localhost\\:4001/v1/keys/foobar2', {}, {
    get: {method: "GET"}
  });
});
