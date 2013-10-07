'use strict';

angular.module('etcd', ['restangular'])

.factory('EtcdV1', ['Restangular', function(Restangular) {
  var keyPrefix = '/v1/keys/'
  var etcd = Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl('/v1/');
  });

  function cleanupPath(path) {
    var parts = path.split('/');
    if (parts.length <= 1) {
      return '';
    }
    parts = parts.filter(function(v){return v!=='';});
    return parts.join('/');
  }

  // parentPath filters out duplicate slashes and removes the last component.
  function parentPath(path) {
    var parts = path.split('/');
    if (parts.length <= 1) {
      return '';
    }
    parts.pop();
    return '/' + parts.join('/') + '/';
  }

  etcd.setOnElemRestangularized(function(elem, isCollection, type) {
    // TODO: use a prototype instead here
    if (type === 'keys') {
      elem.getParent = function() {
        return etcd.one('keys', parentPath(elem.id));
      };
      elem.path = function() {
        return '/' + cleanupPath(keyPrefix + elem.id);
      };
    }
    return elem;
  });

  return {
    getStats: function(stat) {
      return etcd.one('stats', stat);
    },
    getKey: function (key) {
      return etcd.one('keys', key);
    }
  }
}]);
