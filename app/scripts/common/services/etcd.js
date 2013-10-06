'use strict';

var module = angular.module('etcd', ['restangular']).
  factory('EtcdV1', ['Restangular', function(Restangular) {
    var etcd = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('/v1/');
    });
    etcd.stats = etcd.one('stats');
    etcd.keys = etcd.one('keys');
    return etcd;
  }]);
