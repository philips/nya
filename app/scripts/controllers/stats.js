'use strict';

angular.module('etcd-stats')
  .controller('StatsCtrl', function ($scope, $http) {

    $scope.graphContainer = "#latency";
    $scope.graphVisibility = "etcd-graph-show";
    $scope.tableVisibility = "etcd-table-hide";

    /*{
        "gets":12,
        "sets":7,
        "deletes":0,
        "testAndSets":0
        "testAndSets":0
    }*/
    /*var raw_json = '{
        "followers": [
            {
                "hostname": "machine0",
                "role": "leader",
                "currentLatency":1.400807,
                "averageLatency":1.0508203526193118,
                "sdvLatency":0.5267024400632015,
                "minLatency":0.326581,
                "maxLatency":15.584396,
                "failsCount":321,
                "successCount":19738,
                "failing":0
            },
            {
                "hostname": "machine1",
                "role": "follower",
                "currentLatency":1.400807,
                "averageLatency":1.0508203526193118,
                "sdvLatency":0.5267024400632015,
                "minLatency":0.326581,
                "maxLatency":15.584396,
                "failsCount":321,
                "successCount":19738,
                "failing":0
            }
        ]
    }';*/

    function randomData() {
        var json = {"followers": []}
        var num = Math.floor((Math.random()*20)+1);
        var count = 0;
        while (num > count) {
            var follower = new Object();
            follower.hostname = "etcd-host" + count;
            follower.currentLatency = Math.floor((Math.random()*80)+1);

            json.followers.push(follower);
            count++;
        }

        return json;
    }

    $scope.machines = randomData();

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
                        "stats": $scope.machines.followers
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
        drawGraph();
    });
    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        drawGraph();
    });
    window.onresize = function(){
        $scope.$apply();
    }

});
