'use strict';

var module = angular.module('etcd', ['restangular']).
  factory('etcdStats', ['restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('/v1/stats');
    });
  }]);
