'use strict';

angular.module('etcd-stats')
  .controller('StatsCtrl', function ($scope, $http) {

  $scope.graphContainer = '#latency';
  $scope.graphVisibility = 'etcd-graph-show';
  $scope.tableVisibility = 'etcd-table-hide';

  //make requests
  function read() {
    $http.get('http://localhost:4001/v1/stats/leader').success(function(data) {
      $scope.leaderStats = data;
      $scope.followers = [];
      $.each(data.peers, function(index, value) {
        value.name = index;
        $scope.followers.push(value);
      });
      drawGraph();
    }).error(function (data) {
      $scope.showBrowseError(data.message);
    });
  }

  function drawGraph () {
    //hardcoded padding from chart json
    var vertPadding = 30;
    var horzPadding = 15;
    //fetch width and height of graph area
    var width = $($scope.graphContainer).width() - horzPadding;
    var height = $($scope.graphContainer).height() - vertPadding;

    // parse a spec and create a visualization view
    function parse(spec) {
      vg.parse.spec(spec, function(chart) {
        chart({
          el: $scope.graphContainer,
          data: {
            'stats': $scope.followers
          }
        }).width(width).height(height).update();
      });
    }
    parse('../etcd-latency.json');
  }

  $scope.showTable = function() {
    $scope.tableVisibility = 'etcd-table-reveal';
  };

  $scope.showGraph = function() {
    $scope.tableVisibility = 'etcd-table-hide';
  };

  $scope.getHeight = function() {
    return $(window).height();
  };
  $scope.getWidth = function() {
    return $(window).width();
  };
  $scope.$watch($scope.getHeight, function() {
    $('.etcd-body').css('height', $scope.getHeight()-5);
    read();
  });
  $scope.$watch($scope.getWidth, function() {
    read();
  });
  window.onresize = function(){
    $scope.$apply();
  };

  // Update the graphs live
  setInterval(function() {
    read();
    $scope.$apply();
  }, 500);
});
