'use strict';

angular.module('etcd-stats')
  .controller('StatsCtrl', function ($scope, $http) {

    /*{
        "gets":12,
        "sets":7,
        "deletes":0,
        "testAndSets":0
        "testAndSets":0
    }*/
    /*var raw_json = '{
        "machine1":{
            "latency":1.207485,
            "averageLatency":0.7926237088607593,
            "sdvLatency":0.3366530813348628,
            "minLatency":0.544433,
            "maxLatency":2.812764,
            "failsCount":0,
            "successCount":79,
            "lastMessageSuccessful": 0
        },
        "machine2":{
            "latency":1.207485,
            "averageLatency":0.7926237088607593,
            "sdvLatency":0.3366530813348628,
            "minLatency":0.544433,
            "maxLatency":2.812764,
            "failsCount":0,
            "successCount":79,
            "lastMessageSuccessful": 1
        },
        "machine3":{
            "latency":0.683863,
            "averageLatency":0.8945207707423573,
            "sdvLatency":0.40965952499407354,
            "minLatency":0.422323,
            "maxLatency":3.437533,
            "failsCount":0,
            "successCount":458,
            "lastMessageSuccessful": 1
        }
    }';*/
    var raw_json = '{"machine1":{"latency":1.207485,"averageLatency":0.7926237,"sdvLatency":0.33665308,"minLatency":0.544433,"maxLatency":2.812764,"failsCount":0,"successCount":79,"lastMessageSuccessful":0},"machine2":{"latency":2.307485,"averageLatency":0.7926237,"sdvLatency":0.33665308,"minLatency":0.544433,"maxLatency":2.812764,"failsCount":0,"successCount":79,"lastMessageSuccessful":1},"machine3":{"latency":0.683863,"averageLatency":0.89452076,"sdvLatency":0.40965953,"minLatency":0.422323,"maxLatency":3.437533,"failsCount":0,"successCount":458,"lastMessageSuccessful":1}}';
    var json = JSON.parse(raw_json);
    $scope.machines = json;

    $scope.graphContainer = "#latency";

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
                        "stats": [{"hostname":"machine1", "latency":9}, {"hostname":"machine2", "latency":49}, {"hostname":"machine3", "latency":99},{"hostname":"machine4", "latency":99}]
                    }
                }).width(width).height(height).renderer("svg").update();
            });
        }
        parse("../etcd-latency.json");
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