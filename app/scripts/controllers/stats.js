'use strict';

angular.module('etcd-stats')
  .controller('StatsCtrl', function ($scope, $http) {

  $scope.graphContainer = "#latency";
  $scope.graphVisibility = "etcd-graph-show";
  $scope.tableVisibility = "etcd-table-hide";

  //make requests
  function read() {
    $http.get('http://localhost:4001/v1/stats/leader').success(function(data) {
      $scope.leaderStats = data;
      $scope.followers = []
      $.each(data.peers, function(index, value) {
        value.name = index
        $scope.followers.push(value)
      });
      drawGraph()
    }).error(function (data, status, headers, config) {
      $scope.showBrowseError(data.message);
    });
  }

  function drawGraph () {
    //hardcoded padding from chart json
    var vert_padding = 30;
    var hor_padding = 15;
    //fetch width and height of graph area
    var width = $($scope.graphContainer).width() - hor_padding;
    var height = $($scope.graphContainer).height() - vert_padding;

    // parse a spec and create a visualization view
    function parse(spec) {
      vg.parse.spec(spec, function(chart) {
        chart({
          el: $scope.graphContainer,
          data: {
            "stats": $scope.followers
          }
        }).width(width).height(height).update();
      });
    }
    parse("../etcd-latency.json");
  }

  $scope.show_table = function() {
    $scope.tableVisibility = "etcd-table-reveal";
  }

  $scope.show_graph = function() {
    $scope.tableVisibility = "etcd-table-hide";
  }

  $scope.getHeight = function() {
    return $(window).height();
  };
  $scope.getWidth = function() {
    return $(window).width();
  };
  $scope.$watch($scope.getHeight, function(newValue, oldValue) {
    $(".etcd-body").css("height", $scope.getHeight()-5);
    read();
  });
  $scope.$watch($scope.getWidth, function(newValue, oldValue) {
    read();
  });
  window.onresize = function(){
    $scope.$apply();
  }
  // Update the graphs live
  setInterval(function() {
    read()
    $scope.$apply();
  }, 500);
});
