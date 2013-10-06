'use strict';

angular.module('etcdApp', ['ngRoute', 'etcdResource', 'timeRelative'])

.config(['$routeProvider', function ($routeProvider) {
  //read localstorage
  var previousPath = localStorage.getItem('etcd_path');
  var redirectPath = '/v1/keys/';
  if(previousPath !== null && previousPath.indexOf('/v1/keys/') !== -1) {
    redirectPath = previousPath;
  }

  $routeProvider
    .when('/', {
      redirectTo: redirectPath
    })
    .otherwise({
      templateUrl: 'views/browser.html',
      controller: 'MainCtrl'
    });
}])

.module('etcdApp')
  .controller('MainCtrl', function ($scope, $http, etcdKeys, $location, $routeParams) {
  //Allows CORS to work properly
  delete $http.defaults.headers.common['X-Requested-With'];

  $scope.save = 'etcd-save-hide';
  $scope.preview = 'etcd-preview-hide';
  $scope.enableBack = true;
  $scope.writingNew = false;

  $scope.etcdPath = $location.path();

  //read from path when it changes
  $scope.$watch('etcdPath', function() {

    if($scope.writingNew === false) {
      //write to localstorage
      localStorage.setItem('etcdPath', $scope.etcdPath);

      var currentPath = $scope.etcdPath.split('/');
      var parentPath;
      //empty strings that used to be /
      currentPath = currentPath.filter(function(v){return v!=='';});
      //remove last item
      currentPath.pop();
      //reconstruct path
      parentPath = currentPath.join('/');

      $scope.etcdParentPath = '/' + parentPath + '/';

      //load data
      read();

      //disable back button if at root (/v1/keys/)
      if($scope.etcdPath === '/v1/keys/') {
        $scope.enableBack = false;
      } else {
        $scope.enableBack = true;
      }
    }
  });

  //make requests
  function read() {
    EtcdV1.keys.one('leader').get().then(function(data) {
    $http.get('http://localhost:4001' + $scope.etcdPath).success(function(data) {
      //hide any errors
      $('#etcd-browse-error').hide();
      //swap this out with better logic later
      if(data.length) {
        $scope.list = data;
        $scope.preview = 'etcd-preview-hide';
      } else {
        $scope.singleValue = data.value;
        $scope.preview = 'etcd-preview-reveal';
        $http.get('http://localhost:4001' + $scope.etcdParentPath).success(function(data) {
          $scope.list = data;
        });
      }
      $scope.previewMessage = 'No key selected.';
    }).error(function (data, status, headers, config) {
      $scope.previewMessage = 'Key does not exist.';
      $http.get('http://localhost:4001' + $scope.etcdParentPath).success(function(data) {
        $scope.list = data;
      });
      //show errors
      $scope.showBrowseError(data.message);
    });
  }

  //back button click
  $scope.back = function() {
    var path = $scope.etcdPath.split('/');
    var pathLength = path.length;
    var newPath;
    //empty strings that used to be /
    path = path.filter(function(v){return v!=='';});
    //remove last item
    path.pop();
    //reconstruct path
    newPath = path.join('/');
    //record new path if it doesn't back up too much
    if(newPath !== 'v1') {
      $scope.etcdPath = '/' + newPath + '/';
    }
    $location.path($scope.etcdPath);
    $scope.preview = 'etcd-preview-hide';
    $scope.writingNew = false;
  };

  $scope.syncLocation = function() {
    $location.path($scope.etcdPath);
  };

  $scope.showSave = function() {
    $scope.save = 'etcd-save-reveal';
  };

  $scope.saveData = function() {
    //TODO: add loader
    $http({
      url: 'http://localhost:4001' + $scope.etcdPath,
      method: 'POST',
      //data: 'value=' + $scope.singleValue,
      data: $.param({value: $scope.singleValue}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data, status, headers, config) {
      //TODO: remove loader
      $scope.save = 'etcd-save-hide';
      $scope.preview = 'etcd-preview-hide';
      $scope.back();
      $scope.writingNew = false;
    }).error(function (data, status, headers, config) {
      //TODO: remove loader
      //show errors
      $scope.showSaveError(data.message);
    });
  };

  $scope.deleteKey = function() {
    //TODO: add loader
    $http({
      url: 'http://localhost:4001' + $scope.etcdPath,
      method: 'DELETE',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data, status, headers, config) {
      //TODO: remove loader
      $scope.save = 'etcd-save-hide';
      $scope.preview = 'etcd-preview-hide';
      $scope.back();
    }).error(function (data, status, headers, config) {
      //TODO: remove loader
      //show errors
      $scope.showBrowseError('Error: Could not delete the key');
    });
  };

  $scope.add = function() {
    $scope.save = 'etcd-save-reveal';
    $scope.preview = 'etcd-preview-reveal';
    $scope.singleValue = '';
    $('.etcd-browser-path').find('input').focus();
    $scope.writingNew = true;
  };

  $scope.showBrowseError = function(message) {
    $('#etcd-browse-error').find('.etcd-popover-content').text('Error: ' + message);
    $('#etcd-browse-error').addClass('etcd-popover-right').show();
  };

  $scope.showSaveError = function(message) {
    $('#etcd-save-error').find('.etcd-popover-content').text('Error: ' + message);
    $('#etcd-save-error').addClass('etcd-popover-left').show();
  };

  $scope.getHeight = function() {
    return $(window).height();
  };
  $scope.$watch($scope.getHeight, function() {
    $('.etcd-body').css('height', $scope.getHeight()-45);
  });
  window.onresize = function(){
    $scope.$apply();
  };

})

.module('etcdApp').directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind('keydown keypress', function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
})

.module('etcdApp').directive('highlight', ['$location', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if('#' + scope.etcdPath === attrs.href) {
        element.parent().parent().addClass('etcd-selected');
      }
    }
  };
}]);

moment.lang('en', {
  relativeTime : {
    future: 'Expires in %s',
    past:   'Expired %s ago',
    s:  'seconds',
    m:  'a minute',
    mm: '%d minutes',
    h:  'an hour',
    hh: '%d hours',
    d:  'a day',
    dd: '%d days',
    M:  'a month',
    MM: '%d months',
    y:  'a year',
    yy: '%d years'
  }
});
