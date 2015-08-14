/**
 * User: Anderlu
 * Date: 15/8/14
 * Time: 上午11:26
 */
angular.module('GoogleMapPluginDemo', ['GoogleMapPlugin.loader']).controller('DemoController', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$log',
    '$window',
    '$document',
    'GoogleMapApi',
    function($rootScope, $scope, $timeout, $log, $window, $document, GoogleMapApi) {
        angular.extend($scope, {
            init : function () {
                GoogleMapApi.then(function (maps) {
                    var options = {
                        'minZoom':3,
                        'zoom': 5,
                        'center': {lat: 0, lng: 0},
                        'mapTypeId': google.maps.MapTypeId.ROADMAP
                    };
                    $scope.mapInstence = new google.maps.Map(document.getElementById('google-map-container'), options);

                });
            }
        });

        $scope.init();
    }]);
