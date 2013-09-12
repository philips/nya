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

    console.log("machines:");
    console.log(json);

    console.log("working data");
    console.log([{"hostname":"machine1", "latency":28}, {"hostname":"machine2", "latency":55}, {"hostname":"machine3", "latency":43}]);

    console.log("new data");
    console.log([json][0]);

    // parse a spec and create a visualization view
    function parse(spec) {
        vg.parse.spec(spec, function(chart) {
            chart({
                el:"#latency",
                data: {
                    "table": [{"hostname":"machine1", "latency":28.45}, {"hostname":"machine2", "latency":55.889}, {"hostname":"machine3", "latency":43.6}]
                }
            }).update();
        });
    }
    parse("../etcd-latency.json");

    $scope.getHeight = function() {
        return $(window).height();
    };
    $scope.$watch($scope.getHeight, function(newValue, oldValue) {
        $(".etcd-body").css("height", $scope.getHeight()-5);
    });
    window.onresize = function(){
        $scope.$apply();
    }
  	
});